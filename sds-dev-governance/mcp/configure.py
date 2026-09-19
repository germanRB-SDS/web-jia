"""Semantic, idempotent local client staging with guarded recovery receipts."""
import json
import os
from pathlib import Path
import sys
import tomllib
from control import Denied, digest
from inventory import SERVERS, atomic, locked, no_links, now, read_bytes, read_config, observe

INSTRUCTION = '''\n<!-- SDS_MCP_CONTROL_START -->
Before MCP use, verify effective identity and admission in the project capability ledger.
For managed Hostinger, run `sds-mcp check --server <id> --client CLIENT --project <root>`.
Other exactly admitted modes retain their project-specific control route; this optional
tool does not replace it. Follow the ledger/policy and controlled execution path; a denial
cannot be bypassed through another server, shell or API. Load MCP guidance only for
MCP work. Hostinger provider access remains BLOCKED_SECRET_ISOLATION until verified
independent custody and exact project admission exist. Installed is not authorized.
<!-- SDS_MCP_CONTROL_END -->
'''


def instruction_path(home, client):
    return Path(home) / ('.codex/AGENTS.md' if client == 'codex' else '.claude/CLAUDE.md')


def record_install(home, project, state, tooling):
    """Observe exact installed bytes. Does not confer admission or claim historical dates."""
    import hashlib
    tooling = no_links(tooling)
    kit = Path(__file__).resolve().parent
    if read_bytes(tooling / 'package-lock.json') != read_bytes(kit / 'tooling/package-lock.json'):
        raise Denied('LOCK_REVISION_CHANGED')
    package = tooling / 'node_modules/@hostinger/mcp'
    provenance = read_config(kit / 'hostinger-provenance.json')
    manifest = read_config(package / 'package.json')
    if manifest.get('name') != provenance['name'] or manifest.get('version') != provenance['version']:
        raise Denied('PACKAGE_REVISION_CHANGED')
    for rel, sha in provenance['files_sha256'].items():
        if Path(rel).is_absolute() or '..' in Path(rel).parts:
            raise Denied('PROVENANCE_PATH')
        if hashlib.sha256(read_bytes(package / rel)).hexdigest() != sha:
            raise Denied('ARTIFACT_REVISION_CHANGED')
    observe(home, project, state)
    with locked(state):
        path = state / 'inventory.json';saved = read_config(path)
        previous = read_config(state / 'hostinger-installation.json')
        stamp = previous.get('verified_install_event', now())
        receipt = {'package': provenance['name'], 'version': provenance['version'],
                   'integrity': provenance['dist_integrity'], 'verified_install_event': stamp,
                   'source': 'explicit owner-authorized installation and byte verification',
                   'last_verified_at': now(), 'admission_granted': False}
        atomic(state / 'hostinger-installation.json', (json.dumps(receipt) + '\n').encode())
        for row in saved['entries'].values():
            if row['id'] in SERVERS:
                row.update(installation='INSTALLED_QUARANTINED', installed_at=stamp,
                           installed_at_source='verified installation receipt',
                           artifact_version=provenance['version'], artifact_integrity=provenance['dist_integrity'])
        atomic(path, (json.dumps(saved, indent=2) + '\n').encode())
        return {'package': provenance['name'], 'version': provenance['version'],
                'installed_at': stamp, 'verified_files': len(provenance['files_sha256']),
                'provider_active': False}


def instructions(home, state, client):
    if client not in ('codex', 'claude'):
        raise Denied('UNSUPPORTED_CLIENT')
    target = no_links(instruction_path(home, client))
    with locked(state):
        old = read_bytes(target) if target.exists() else None
        raw = (old or b'').decode('utf-8')
        block = INSTRUCTION.replace('CLIENT', client)
        if '<!-- SDS_MCP_CONTROL_START -->' in raw or '<!-- SDS_MCP_CONTROL_END -->' in raw:
            if raw.count(block) == 1:
                return {'client': client, 'instructions_changed': False}
            raise Denied('EXISTING_INSTRUCTION_CONFLICT')
        content = (raw + block).encode()
        rid = client + '-instructions-' + digest([now(), digest(content.hex())])[:20]
        if old is not None:
            atomic(state / (rid + '.backup'), old)
        receipt = {'schema': 1, 'client': client, 'kind': 'instructions', 'target': str(target),
                   'backup': rid + '.backup' if old is not None else None,
                   'before': digest(old.hex()) if old is not None else None,
                   'after': digest(content.hex()), 'created_at': now()}
        atomic(state / (rid + '.json'), (json.dumps(receipt) + '\n').encode())
        if (read_bytes(target) if target.exists() else None) != old:
            raise Denied('CONCURRENT_CONFIG_CHANGE')
        atomic(target, content)
        return {'client': client, 'instructions_changed': True, 'receipt': rid}


def expected(server, client):
    entry = {'command': sys.executable,
             'args': [str(Path(__file__).resolve().parent / 'cli.py'), 'serve', '--server', server]}
    if client == 'codex':
        entry.update(enabled=False, startup_timeout_sec=10, tool_timeout_sec=10)
    else:
        entry['type'] = 'stdio'
    return entry


def stage(home, state, client):
    if client not in ('codex', 'claude'):
        raise Denied('UNSUPPORTED_CLIENT')
    home = no_links(home)
    target = home / ('.codex/config.toml' if client == 'codex' else '.claude.json')
    with locked(state):
        old = read_bytes(target) if target.exists() or target.is_symlink() else None
        raw = (old or b'').decode('utf-8')
        config = tomllib.loads(raw) if client == 'codex' else json.loads(raw or '{}')
        key = 'mcp_servers' if client == 'codex' else 'mcpServers'
        servers = config.setdefault(key, {})
        missing = []
        for server in SERVERS:
            entry = expected(server, client)
            if server in servers:
                if servers[server] != entry:
                    raise Denied('EXISTING_SERVER_CONFLICT')
            else:
                missing.append(server)
                servers[server] = entry
        if not missing:
            return {'client': client, 'changed': False, 'servers': list(SERVERS)}
        if client == 'codex':
            for server in missing:
                entry = servers[server]
                raw += '\n[mcp_servers.' + json.dumps(server) + ']\n'
                for k, value in entry.items():
                    raw += k + ' = ' + json.dumps(value) + '\n'
            if tomllib.loads(raw) != config:
                raise Denied('TOML_SEMANTIC_MISMATCH')
        else:
            raw = json.dumps(config, indent=2, ensure_ascii=False) + '\n'
            if json.loads(raw) != config:
                raise Denied('JSON_SEMANTIC_MISMATCH')
        content = raw.encode()
        receipt_id = client + '-' + digest([now(), digest(raw)])[:20]
        backup = state / (receipt_id + '.backup')
        if old is not None:
            atomic(backup, old)
        receipt = {'schema': 1, 'client': client, 'target': str(target),
                   'backup': backup.name if old is not None else None,
                   'before': digest(old.hex()) if old is not None else None,
                   'after': digest(content.hex()), 'created_at': now()}
        atomic(state / (receipt_id + '.json'), (json.dumps(receipt) + '\n').encode())
        # CAS immediately before replacing, including the previously absent case.
        actual = read_bytes(target) if target.exists() else None
        if actual != old:
            raise Denied('CONCURRENT_CONFIG_CHANGE')
        atomic(target, content)
        return {'client': client, 'changed': True, 'servers': missing, 'receipt': receipt_id,
                'provider_active': False, 'restart_required': True}


def restore(home, state, receipt_id):
    if not receipt_id or any(c not in 'abcdefghijklmnopqrstuvwxyz0123456789-' for c in receipt_id):
        raise Denied('INVALID_RECEIPT')
    with locked(state):
        r = read_config(state / (receipt_id + '.json'))
        if r.get('schema') != 1 or r.get('client') not in ('codex', 'claude'):
            raise Denied('INVALID_RECEIPT')
        target = no_links(instruction_path(home, r['client']) if r.get('kind') == 'instructions' else
                          Path(home) / ('.codex/config.toml' if r['client'] == 'codex' else '.claude.json'))
        if str(target) != r['target'] or digest(read_bytes(target).hex()) != r['after']:
            raise Denied('CONFIG_CHANGED_SINCE_STAGING')
        if r['backup']:
            if r['backup'] != receipt_id + '.backup':
                raise Denied('INVALID_RECEIPT')
            content = read_bytes(state / r['backup'])
            if digest(content.hex()) != r['before']:
                raise Denied('BACKUP_CHANGED')
            atomic(target, content)
        else:
            # A newly created synthetic/config file may be removed only at exact hash.
            target.unlink()
        return {'client': r['client'], 'restored': True}
