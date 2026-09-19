"""Bounded configuration observation. Never execute a server or return raw config."""
from contextlib import contextmanager
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import tempfile
import tomllib
from datetime import datetime, timezone
from control import Denied, digest

MODULES = ('hosting', 'domains', 'dns', 'reach', 'vps')
SERVERS = tuple('hostinger-' + x for x in MODULES)
UNKNOWN = 'POR_CONFIRMAR'
MAX_CONFIG = 4 * 1024 * 1024


def now():
    return datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')


def no_links(path):
    path = Path(os.path.abspath(path))
    for p in [path, *path.parents]:
        if p.is_symlink():
            raise Denied('LINKED_PATH')
    return path


def read_bytes(path):
    path = no_links(path)
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as f:
        info = os.fstat(f.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_size > MAX_CONFIG:
            raise Denied('INVALID_CONFIG_FILE')
        value = f.read(MAX_CONFIG + 1)
    if len(value) > MAX_CONFIG:
        raise Denied('CONFIG_LIMIT')
    return value


def read_config(path):
    if not Path(path).exists() and not Path(path).is_symlink():
        return {}
    raw = read_bytes(path).decode('utf-8')
    value = tomllib.loads(raw) if str(path).endswith('.toml') else json.loads(raw)
    if not isinstance(value, dict):
        raise Denied('CONFIG_SHAPE')
    return value


@contextmanager
def locked(state):
    state = no_links(state)
    state.mkdir(parents=True, mode=0o700, exist_ok=True)
    info = state.stat()
    if info.st_uid != os.getuid() or info.st_mode & 0o077:
        raise Denied('STATE_PERMISSIONS')
    fd = os.open(state / 'lock', os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX)
        yield state
    finally:
        os.close(fd)


def atomic(path, value):
    path = no_links(path)
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd, name = tempfile.mkstemp(prefix='.sds-mcp-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(value)
            f.flush()
            os.fsync(f.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def safe_id(name):
    # Unknown identifiers themselves can contain sensitive text. Use opaque IDs.
    return name if name in SERVERS else 'mcp-' + digest(name)[:12]


def public_revision(entry):
    """Drop credential values before hashing; ambiguous inline credentials block use."""
    allowed = ('command', 'args', 'url', 'type', 'enabled', 'enabled_tools',
               'disabled_tools', 'env_vars', 'bearer_token_env_var',
               'startup_timeout_sec', 'tool_timeout_sec')
    clean = {k: entry[k] for k in allowed if k in entry}
    # Command args/URL could themselves embed a secret. They never leave this process,
    # and their digest is not exposed for unmanaged configurations.
    sensitive = bool(entry.get('env') or entry.get('headers') or entry.get('http_headers'))
    return digest(clean), sensitive


def discover(home, project):
    home, project = Path(home).absolute(), Path(project).resolve()
    rows, gaps = [], []

    def add(client, scope, path, entries, priority):
        if not isinstance(entries, dict):
            gaps.append(client + ':CONFIG_SHAPE')
            return
        if len(entries) > 300:
            raise Denied('ENTRY_LIMIT')
        for name, entry in entries.items():
            if not isinstance(entry, dict):
                gaps.append(client + ':ENTRY_SHAPE')
                continue
            rev, inline = public_revision(entry)
            rows.append({'client': client, 'scope': scope, '_path': str(path),
                         '_name': name, '_entry': entry, '_revision': rev,
                         '_priority': priority, 'id': safe_id(name), 'inline_secret_fields': inline})

    def load(client, scope, path, key, priority):
        try:
            add(client, scope, path, read_config(path).get(key, {}), priority)
        except (OSError, ValueError, Denied):
            gaps.append(client + ':' + scope + ':UNREADABLE')

    codex = home / '.codex/config.toml'
    claude = home / '.claude.json'
    load('codex', 'user', codex, 'mcp_servers', 10)
    # Codex merges TOML layers. Conservatively reject duplicates instead of pretending
    # whole-entry precedence is equivalent to field merging.
    ancestors = [*reversed(project.parents), project]
    for i, parent in enumerate(ancestors):
        p = parent / '.codex/config.toml'
        if p != codex:
            load('codex', 'project-' + str(i), p, 'mcp_servers', 20 + i)
    load('claude', 'user', claude, 'mcpServers', 10)
    load('claude', 'project', project / '.mcp.json', 'mcpServers', 20)
    try:
        j = read_config(claude)
        add('claude', 'local', claude, j.get('projects', {}).get(str(project), {}).get('mcpServers', {}), 30)
    except (OSError, ValueError, AttributeError, Denied):
        gaps.append('claude:local:UNREADABLE')
    # Only inspect install registries, not arbitrary trees or plugin code.
    for client in ('claude', 'codex'):
        root = home / ('.' + client) / 'plugins'
        paths = []
        try:
            reg = read_config(root / 'installed_plugins.json').get('plugins', {})
            for installs in reg.values():
                for install in installs if isinstance(installs, list) else [installs]:
                    p = install.get('installPath') if isinstance(install, dict) else None
                    if p:
                        paths.append(Path(p))
        except (OSError, ValueError, AttributeError, Denied):
            gaps.append(client + ':plugins:UNREADABLE')
        # Codex plugin cache layout exposed by current local installation.
        if client == 'codex' and (root / 'cache').exists():
            paths.extend(p for p in (root / 'cache').glob('*/*/*') if p.is_dir())
        if len(paths) > 150:
            raise Denied('PLUGIN_LIMIT')
        for i, p in enumerate(dict.fromkeys(paths)):
            try:
                resolved = p.resolve()
                # Registries may refer outside cache; report without opening that path.
                if root.resolve() not in resolved.parents:
                    gaps.append(client + ':plugin:EXTERNAL_PATH')
                    continue
                load(client, 'plugin-' + str(i), p / '.mcp.json', 'mcpServers', 1)
                for manifest in (p / '.claude-plugin/plugin.json', p / '.codex-plugin/plugin.json'):
                    j = read_config(manifest)
                    m = j.get('mcpServers', {})
                    if isinstance(m, dict):
                        add(client, 'plugin-manifest-' + str(i), manifest, m, 1)
                    elif m:
                        gaps.append(client + ':plugin:INDIRECT_MANIFEST')
            except (OSError, ValueError, Denied):
                gaps.append(client + ':plugin:UNREADABLE')
    # Do not touch machine settings while running with a synthetic home.
    if home == Path.home():
        for client, p, key in (
            ('codex', Path('/etc/codex/managed_config.toml'), 'mcp_servers'),
            ('claude', Path('/Library/Application Support/ClaudeCode/managed-mcp.json'), 'mcpServers'),
            ('claude', Path('/Library/Application Support/ClaudeCode/managed-settings.json'), 'managedMcpServers')):
            load(client, 'managed', p, key, 100)
        if Path('/etc/codex/requirements.toml').exists():
            gaps.append('codex:managed-requirements:REVIEW_REQUIRED')
    gaps.extend(['runtime-overrides:UNVERIFIED', 'remote-connectors:UNVERIFIED',
                 'desktop-ide-injection:UNVERIFIED'])
    if any(k in os.environ for k in ('CODEX_HOME', 'CLAUDE_CONFIG_DIR')):
        gaps.append('environment-config-root:OVERRIDE_REVIEW_REQUIRED')
    return rows, sorted(set(gaps))


def provider_ledger_state(project):
    """Only observe restrictive states. This closed release cannot validate a live grant."""
    path = Path(project) / 'docs/governance/capability-registry.md'
    if not path.exists():
        return 'NOT_EVALUATED'
    text = read_bytes(path).decode('utf-8')
    start, end = '<!-- SDS_CAPABILITY_LEDGER_START -->', '<!-- SDS_CAPABILITY_LEDGER_END -->'
    if text.count(start) != 1 or text.count(end) != 1 or text.index(start) >= text.index(end):
        raise Denied('LEDGER_CORRUPT')
    matches = []
    for line in text.split(start)[1].split(end)[0].splitlines():
        fields = [x.strip() for x in line.strip().strip('|').split('|')]
        if fields and fields[0] == 'Hostinger / real provider operations':
            if len(fields) != 8:
                raise Denied('LEDGER_CORRUPT')
            matches.append(fields[5])
    if len(matches) > 1:
        raise Denied('LEDGER_AMBIGUOUS')
    if matches and matches[0] in ('QUARANTINED', 'REJECTED', 'DEPRECATED'):
        return matches[0]
    return 'NOT_EVALUATED'


def observe(home, project, state):
    from configure import expected
    rows, gaps = discover(home, project)
    if len(rows) > 500:
        raise Denied('TOTAL_ENTRY_LIMIT')
    admission = provider_ledger_state(project)
    with locked(state):
        path = state / 'inventory.json'
        saved = read_config(path)
        if saved and (saved.get('schema') != 1 or not isinstance(saved.get('entries'), dict)):
            raise Denied('INVENTORY_CORRUPT')
        entries = saved.get('entries', {})
        visible = []
        for row in rows:
            key = digest([row['client'], row['_path'], row['scope'], row['_name']])
            old = entries.get(key, {})
            candidates = [r for r in rows if r['client'] == row['client'] and r['_name'] == row['_name']]
            effective = row['_priority'] == max(r['_priority'] for r in candidates)
            same_top = sum(r['_priority'] == row['_priority'] for r in candidates) > 1
            ambiguous = same_top or (row['client'] == 'codex' and len(candidates) > 1)
            managed = row['_name'] in SERVERS
            controlled = managed and row['_entry'] == expected(row['_name'], row['client'])
            record = {k: row[k] for k in ('client', 'scope', 'id', 'inline_secret_fields')}
            record.update({'provider': 'Hostinger' if managed else 'POR_CONFIRMAR',
                           'owner': 'project-ledger-owner' if managed else UNKNOWN,
                           'effective': effective and not ambiguous,
                           'configuration': 'AMBIGUOUS' if ambiguous else 'CONFIGURED',
                           'installation': old.get('installation', 'UNREGISTERED'),
                           'installed_at': old.get('installed_at', UNKNOWN),
                           'installed_at_source': old.get('installed_at_source', UNKNOWN),
                           'first_seen_at': old.get('first_seen_at', now()),
                           'last_verified_at': now(), 'verification_scope': 'configuration_observation',
                           'admission': admission if managed else 'NOT_EVALUATED',
                           'admission_source': 'docs/governance/capability-registry.md',
                           'availability': 'NOT_PROBED', 'connection': 'NOT_PROBED',
                           'credential_ref': 'hostinger-primary' if managed else UNKNOWN,
                           'credential_expiry': UNKNOWN,
                           'policy': '07-mcp-control' if managed else UNKNOWN,
                           'revision_changed': bool(old and old.get('_revision') != row['_revision']),
                           'artifact_version': old.get('artifact_version', UNKNOWN),
                           'artifact_integrity': old.get('artifact_integrity', UNKNOWN),
                           'permissions': UNKNOWN, 'catalog_revision': UNKNOWN,
                           'transport': 'stdio' if 'command' in row['_entry'] else 'remote',
                           'status': 'BLOCKED_SECRET_ISOLATION' if managed else 'UNREGISTERED'})
            if ambiguous:
                record['status'] = 'BLOCKED_CONFIG_AMBIGUITY'
            elif managed and not controlled:
                record['status'] = 'BLOCKED_IDENTITY_CHANGE'
            entries[key] = dict(record, _revision=row['_revision'])
            visible.append(record)
        atomic(path, (json.dumps({'schema': 1, 'entries': entries}, indent=2) + '\n').encode())
    return {'entries': visible, 'coverage': gaps}
