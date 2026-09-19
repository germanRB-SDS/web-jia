"""Bounded bootstrap: inspect a complete plan, then create files exclusively inside one root."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import subprocess
import sys
from governance_tree import inventory, snapshot, fingerprint, safe_name

KIT = Path(__file__).resolve().parent.parent
EXCLUSIONS = '''.env
.env.*
*.p12
*.pem
*.key
*.keystore
node_modules/
dist/
build/
DerivedData/
.swiftpm/
Pods/
target/
.idea/
.vscode/
.DS_Store
*.dump
*.bak
__pycache__/
*.pyc
.gradle/
graphify-out/
.sds/state/
'''
HUB_IGNORES = '''# Hub owns only explicitly reviewed governance documents and entrypoints.
/*
!/.gitignore
!/AGENTS.md
!/CLAUDE.md
!/GEMINI.md
!/.cursor/
!/.cursor/rules/
!/.cursor/rules/sds-governance.mdc
!/check-governance.sh
!/docs/
'''
HUB_BOUNDARY = '''\n## Independent Repository Boundary\n\nThis workspace is a hub of independent repositories, not a shared product or monorepo.\nThe hub kit governs hub-owned files only. Before work inside a child repository or\nworktree, resolve that repository's own root, adapters, governance, memory and authority.\nLoad only the selected project's context. Do not install, update or propagate parent\ngovernance into children or treat their branches, remotes, credentials, capabilities,\nOAuth identities, deployment authority or VPS services as shared. User instructions\nretain their authorized scope. A root task never implicitly authorizes writes in children.\n'''


def env_flag(name):
    value = os.environ.get(name, '1')
    if value not in ('0', '1'):
        raise ValueError(name + ' must be 0 or 1')
    return value == '1'


def inspect_path(root, relative):
    p = root
    for i, name in enumerate(relative.parts):
        p = p / name
        if p.is_symlink():
            raise ValueError('linked write path rejected: ' + str(p))
        if p.exists() and (i < len(relative.parts)-1 and not p.is_dir()):
            raise ValueError('file blocks destination directory: ' + str(p))
    if p.exists() and not p.is_file():
        raise ValueError('directory/special file blocks destination: ' + str(p))
    return p


def exclusive_write(root_fd, relative, content, mode):
    """Open every parent without following links; a concurrent writer cannot redirect writes."""
    fd = os.dup(root_fd)
    try:
        for name in relative.parts[:-1]:
            try:
                os.mkdir(name, 0o755, dir_fd=fd)
            except FileExistsError:
                pass
            child = os.open(name, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
            os.close(fd); fd = child
        out = os.open(relative.name, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, mode, dir_fd=fd)
        with os.fdopen(out, 'wb') as stream:
            stream.write(content); stream.flush(); os.fsync(stream.fileno())
            os.fchmod(stream.fileno(), mode)
    finally:
        os.close(fd)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--shell', required=True, help=argparse.SUPPRESS)
    parser.add_argument('project_name')
    parser.add_argument('target_directory')
    parser.add_argument('--mode', choices=['project', 'hub'], default='project')
    parser.add_argument('--files-only', action='store_true')
    parser.add_argument('--dry-run', action='store_true')
    for name in ['skills', 'plugins']:
        group = parser.add_mutually_exclusive_group()
        group.add_argument('--install-' + name, dest=name, action='store_true')
        group.add_argument('--skip-' + name, dest=name, action='store_false')
        parser.set_defaults(**{name: None})
    parser.add_argument('--skip-graphify', action='store_true')
    args = parser.parse_args()
    safe_name(args.project_name); safe_name(args.target_directory)
    if not args.target_directory.strip():
        raise ValueError('target directory must not be empty')
    if not args.project_name.strip() or '`' in args.project_name or '{{' in args.project_name:
        raise ValueError('project name must be nonempty plain text')
    target = Path(args.target_directory).expanduser().resolve()
    if target == KIT or KIT in target.parents:
        raise ValueError('target cannot be inside the source kit')
    if target.exists() and not target.is_dir():
        raise ValueError('target must be a directory')
    files_only = args.files_only or args.mode == 'hub'
    if files_only and (args.skills is True or args.plugins is True):
        raise ValueError('files-only/hub conflicts with explicit capability installation')
    skills = env_flag('SDS_INSTALL_SKILLS') if args.skills is None else args.skills
    plugins = env_flag('SDS_INSTALL_PLUGINS') if args.plugins is None else args.plugins
    graphify = env_flag('SDS_INSTALL_GRAPHIFY') and not args.skip_graphify
    skills = skills and not files_only; plugins = plugins and not files_only
    source, source_bytes = snapshot(KIT)
    for rel in ('GOVERNANCE.md','VERSION.md','practices/INDEX.md','skills/README.md',
                'skills/r8-analyzer.md','scaffold/docs/governance/capability-registry.md',
                'adapters/AGENTS.md','check-governance.sh'):
        if rel not in source or source[rel][0] != 'file':
            raise ValueError('missing required source: ' + rel)
    required_source = re.findall(r'^  "sds-dev-governance/([^"\n]+)"',
                                 source_bytes['check-governance.sh'].decode(), re.M)
    for rel in required_source:
        if rel not in source or source[rel][0] != 'file':
            raise ValueError('missing checker-required source: ' + rel)
    if any(row[0] != 'file' for row in source.values()):
        raise ValueError('source kit contains links; distribute a regular-file kit')
    gov = target / 'sds-dev-governance'
    if gov.is_symlink():
        raise ValueError('linked kit destination rejected')
    if gov.exists() and (not gov.is_dir() or inventory(gov) != source):
        raise ValueError('existing kit differs; bootstrap never upgrades or merges it')
    specs = os.environ.get('SDS_NESTED_MODULES', '')
    if args.mode == 'hub' and specs:
        raise ValueError('hub never materializes adapters in independent repositories')
    modules = []
    for spec in specs.split(';') if specs else []:
        fields = spec.split('|')
        if len(fields) < 2 or len(fields) > 4 or not fields[0] or not fields[1]:
            raise ValueError('invalid module: expected path|name|type|branch')
        path = PurePosixPath(fields[0]); safe_name(spec)
        if path.is_absolute() or any(x in ('', '.', '..') for x in fields[0].split('/')):
            raise ValueError('module must be a normalized relative path')
        if path.parts[0] in ('docs','sds-dev-governance') or any(x.startswith('.') for x in path.parts):
            raise ValueError('module overlaps an owned or hidden path')
        if any(path == p or path in p.parents or p in path.parents for p, _ in modules):
            raise ValueError('duplicate or overlapping modules')
        current = target
        for part in path.parts:
            current /= part
            if current.is_symlink() or (current / '.git').exists():
                raise ValueError('module crosses a symlink or independent Git boundary')
        modules.append((path, fields))
    planned = {}; conflicts = []
    def add(relative, content, mode=0o644):
        relative = Path(relative); dest = inspect_path(target, relative)
        if relative in planned:
            raise ValueError('duplicate planned destination')
        if dest.exists():
            if dest.read_bytes() == content:
                return
            conflicts.append(str(relative))
            relative = Path(str(relative) + '.sds-new'); dest = inspect_path(target, relative)
            if dest.exists():
                if dest.read_bytes() != content:
                    raise ValueError('existing .sds-new differs; preserve and reconcile: ' + str(relative))
                return
        planned[relative] = (content, mode)
    substitutions = {'{{NOMBRE_PROYECTO}}': args.project_name, '{{RUTA_LOCAL}}': str(target)}
    def render(p, extra=None):
        value = source_bytes[p.relative_to(KIT).as_posix()].decode('utf-8')
        for before, after in {**substitutions, **(extra or {})}.items():
            value = value.replace(before, after)
        return value.encode()
    if not gov.exists():
        for rel in source:
            path = KIT / rel
            add(Path('sds-dev-governance') / rel, source_bytes[rel], 0o755 if source[rel][1] else 0o644)
    for rel in source:
        if rel.startswith('scaffold/'):
            add(Path(rel).relative_to('scaffold'), render(KIT / rel), 0o755 if source[rel][1] else 0o644)
    for name in ('CLAUDE.md','AGENTS.md','GEMINI.md','cursor-rules/sds-governance.mdc'):
        dest = '.cursor/rules/sds-governance.mdc' if name.startswith('cursor') else name
        content = render(KIT / 'adapters' / name)
        if args.mode == 'hub':
            content += HUB_BOUNDARY.encode()
        add(dest, content)
    add('check-governance.sh', source_bytes['check-governance.sh'], 0o755)
    add('.gitignore', ((HUB_IGNORES if args.mode == 'hub' else '') + EXCLUSIONS).encode())
    add('docs/governance/workspace-mode', (args.mode + '\n').encode())
    for path, fields in modules:
        up = '/'.join(['..'] * len(path.parts))
        extra = dict(zip(['{{MODULE_PATH}}','{{MODULE_NAME}}','{{MODULE_TYPE}}','{{MODULE_BRANCH}}'],
                         [str(path),fields[1],fields[2] if len(fields)>2 and fields[2] else 'subproject',
                          fields[3] if len(fields)>3 and fields[3] else '_pending_']))
        extra.update({'{{GOVERNANCE_RELATIVE_PATH}}':up+'/sds-dev-governance','{{HUB_RELATIVE_PATH}}':up})
        for name in ('CLAUDE.md','AGENTS.md','GEMINI.md','cursor-rules/sds-governance.mdc'):
            dest = '.cursor/rules/sds-governance.mdc' if name.startswith('cursor') else name
            add(Path(path)/dest,render(KIT/'adapters/nested'/name,extra))
    slug = re.sub('[^a-z0-9]+','-',args.project_name.lower()).strip('-') or 'project'
    for name in ('cookies-policy','privacy-policy','terms-of-service'):
        dest = Path(f'docs/{slug}-policies/{slug}-{name}.md')
        if not inspect_path(target,dest).exists():
            add(dest,b'')
    print(json.dumps({'target':str(target),'mode':args.mode,'source_fingerprint':fingerprint(source),
                      'files_only':files_only,'create':[str(p) for p in planned],
                      'conflicts':conflicts,'install_skills':skills,'install_plugins':plugins},ensure_ascii=False))
    if args.dry_run:
        return 3 if conflicts else 0
    target.mkdir(parents=True,exist_ok=True)
    fd = os.open(target,os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    try:
        for relative,(content,mode) in planned.items():
            exclusive_write(fd,relative,content,mode)
    finally:
        os.close(fd)
    if conflicts:
        print('CONFLICT: original files preserved; review .sds-new before installation',file=sys.stderr)
        return 3
    child_env = dict(os.environ,SDS_INSTALL_GRAPHIFY=str(int(graphify)))
    # Installation is separate from admission. files-only invokes no capability helper.
    if skills:
        subprocess.run([args.shell,str(gov/'scripts/install-skills.sh'),str(target)],env=child_env,check=True)
    else:
        print('NOTICE: SDS skill catalog skipped (including bundled skills)')
    if plugins:
        subprocess.run([args.shell,str(gov/'scripts/install-plugins.sh'),str(target)],env=child_env,check=True)
    else:
        print('NOTICE: SDS base-plugin catalog skipped')
    print('Scaffold complete. Review owned files, then run check-governance.sh on this root.')
    print('No Git initialization, staging, branch changes, OAuth or capability admission performed.')
    print('For interruption, inspect the printed create plan; preserve existing files before retrying.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError,ValueError,subprocess.SubprocessError) as e:
        print('ERROR: '+str(e),file=sys.stderr)
        sys.exit(2)
