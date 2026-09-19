"""Exact offline guest deletion experiment; never executes its payload on the host."""
import base64
import hashlib
import json
from pathlib import Path
import shlex
import time
from tart_host import checked_root, command, capture

ROOT = '/private/tmp/sds-sentinel-tart-KoUNwE'

def main():
    root = checked_root(ROOT)
    source = Path(__file__).with_name('deletion_expanded_guest.js').read_bytes()
    catalogue = (Path(__file__).resolve().parents[1]/'docs/prompts-output/[01-4]/evidence/deletion-expanded/catalogue.json').read_bytes()
    template = Path(__file__).with_name('templates').joinpath('codex-config.toml').read_bytes()
    revision = json.loads((Path(__file__).resolve().parents[1]/'docs/prompts-output/[01-4]/evidence/deletion-expanded/revision.json').read_text())
    for name, data in [('sentinel/deletion_expanded_guest.js',source), ('sentinel/templates/codex-config.toml',template), ('sentinel/deletion_expanded_vm.py',Path(__file__).read_bytes()), ('docs/prompts-output/[01-4]/evidence/deletion-expanded/catalogue.json',catalogue)]:
        if hashlib.sha256(data).hexdigest() != revision['sha256'][name]:
            raise ValueError('Frozen source mismatch: '+name)
    # Shell verifies the interpreter before evaluating any JavaScript. No sudo or installs.
    shell = '''set -eu
[ "$(/usr/bin/readlink /opt/homebrew/bin/node)" = '../Cellar/node@24/24.20.0/bin/node' ]
[ "$(/usr/bin/shasum -a 256 /opt/homebrew/bin/node)" = 'c8eedc7651a438fb7d2ceb36fd70032676c855586a36c950ba5a662f0b7853bd  /opt/homebrew/bin/node' ]
exec /usr/bin/env -i PATH=/usr/bin:/bin HOME=/Users/admin SDS_GUEST_ONLY=sentinel-expanded-v1 '''
    shell += 'SDS_TEMPLATE_BASE64='+shlex.quote(base64.b64encode(template).decode())+' SDS_TEMPLATE_SHA256='+hashlib.sha256(template).hexdigest()
    shell += ' SDS_CATALOGUE_BASE64='+shlex.quote(base64.b64encode(catalogue).decode())+' SDS_CATALOGUE_SHA256='+hashlib.sha256(catalogue).hexdigest()
    shell += ' /opt/homebrew/bin/node -e '+shlex.quote(source.decode())
    for name, expected in revision['sha256'].items():
        file=Path(name) if Path(name).is_absolute() else Path(__file__).resolve().parents[1]/name
        if hashlib.sha256(file.read_bytes()).hexdigest()!=expected:
            raise ValueError('Dependency changed: '+name)
    log=root/'logs'/f'{time.time_ns()}-deletion-expanded.log'
    print(json.dumps({'log':str(log),'mode':'deletion-expanded'}),flush=True)
    try:
        with log.open('xb') as output:
            pid,status,reason=capture(command(root,'exec-admin',['/bin/sh','-c',shell]),root,output,30)
    except BaseException as error:
        log.with_suffix('.json').write_text(json.dumps({'outcome':'SUPERVISOR_ERROR','error_type':type(error).__name__,'error':str(error),'cleanup_verified':False,'log':str(log)},indent=2))
        raise
    receipt={'pid':pid,'exit_code':status,'stop_reason':reason,'log':str(log)}
    log.with_suffix('.json').write_text(json.dumps(receipt,indent=2))
    print(json.dumps(receipt))
    return status

if __name__=='__main__':
    raise SystemExit(main())
