"""Install immutable-version local tooling and stage closed clients; never run npm/provider."""
import argparse
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys
from control import Denied
from inventory import atomic, no_links, read_bytes


def install(home, project):
    home = no_links(home)
    source = Path(__file__).resolve().parent
    destination = home / '.local/share/sds-mcp/v1.27.0/mcp'
    no_links(destination)
    files = []
    for p in source.rglob('*'):
        rel = p.relative_to(source)
        if any(x in ('node_modules', '__pycache__') for x in rel.parts):
            continue
        if p.is_symlink():
            raise Denied('LINKED_SOURCE')
        if p.is_file():
            files.append(rel)
    if destination.exists():
        for rel in files:
            if read_bytes(source / rel) != read_bytes(destination / rel):
                raise Denied('INSTALLED_VERSION_CONFLICT')
    else:
        destination.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        temporary = destination.parent / ('mcp-staging-' + str(os.getpid()))
        temporary.mkdir(mode=0o700)
        for rel in files:
            atomic(temporary / rel, read_bytes(source / rel))
        os.rename(temporary, destination)
    launcher = home / '.local/bin/sds-mcp'
    content = ('#!/usr/bin/env bash\nset -euo pipefail\nexec ' + shlex.quote(sys.executable) +
               ' ' + shlex.quote(str(destination / 'cli.py')) + ' "$@"\n').encode()
    if launcher.exists() or launcher.is_symlink():
        if read_bytes(launcher) != content:
            raise Denied('LAUNCHER_CONFLICT')
    else:
        atomic(launcher, content)
        launcher.chmod(0o700)
    results = []
    for client in ('codex', 'claude'):
        # Explicit fixtures may stage both adapters without installing client software.
        if home == Path.home() and not shutil.which(client):
            results.append({'client': client, 'status': 'CLIENT_NOT_INSTALLED'})
            continue
        for command in ('stage', 'instructions'):
            p = subprocess.run([sys.executable, str(destination / 'cli.py'), command,
                                '--home', str(home), '--project', str(project), '--client', client],
                               capture_output=True, text=True, timeout=20)
            if p.returncode:
                raise Denied('CLIENT_STAGING_INCOMPLETE')
            results.append(json.loads(p.stdout))
    return {'version': '1.27.0', 'provider_active': False, 'results': results,
            'npm_installed': False, 'restart_required': True}


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--home', type=Path, default=Path.home())
    p.add_argument('--project', type=Path, required=True)
    args = p.parse_args()
    try:
        print(json.dumps(install(args.home, args.project), separators=(',', ':')))
    except Exception:
        print('{"status":"LOCAL_INSTALL_INCOMPLETE","provider_active":false}', file=sys.stderr)
        raise SystemExit(4)
