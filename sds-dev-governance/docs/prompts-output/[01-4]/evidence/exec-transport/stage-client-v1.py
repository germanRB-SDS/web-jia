"""Stage one pinned, credential-free Codex executable into the disposable Tart guest.

Administrative provisioning only, not a model session or a protected client launch.
The sole stdin source is the exact public installed executable, never a credential/config.
Requires the exact project admission and an already-running bounded boot-smoke session.
"""
import hashlib
import json
import os
from pathlib import Path
import stat
import sys
import time

import tart_host

SOURCE = Path('/opt/homebrew/Caskroom/codex/0.154.0/bin/codex')
SOURCE_SHA256 = '4f85982624b3898c8991cb80c0981b2aa71070e3537046c9a95950318a95afcc'
SOURCE_SIZE = 222655232
LAB = Path('/private/tmp/sds-sentinel-tart-KoUNwE')


def guest_script():
    # Fresh directory only. Hash check precedes execution; a partial/corrupt transfer
    # retains its fixture and cannot run. No links/shares/network or shell from input.
    return '''set -eu
umask 077
client_root=$(/usr/bin/mktemp -d /private/tmp/sds-sentinel-client.XXXXXX)
printf 'CLIENT_ROOT=%s\\n' "$client_root"
/bin/mkdir "$client_root/state" "$client_root/tmp" "$client_root/home"
/bin/cat > "$client_root/codex"
[ "$(/usr/bin/stat -f %z "$client_root/codex")" = "''' + str(SOURCE_SIZE) + '''" ] || { echo STAGE_SIZE_FAIL; exit 78; }
[ "$(/usr/bin/shasum -a 256 "$client_root/codex")" = "''' + SOURCE_SHA256 + '''  $client_root/codex" ] || { echo STAGE_HASH_FAIL; exit 78; }
/bin/chmod 500 "$client_root/codex"
printf 'CLIENT_SHA256=%s\\n' "''' + SOURCE_SHA256 + '''"
/usr/bin/id
cd "$client_root"
/usr/bin/env -i PATH=/usr/bin:/bin HOME="$client_root/home" CODEX_HOME="$client_root/state" TMPDIR="$client_root/tmp" "$client_root/codex" --version
'''


def stage():
    root = tart_host.checked_root(str(LAB))
    start = time.monotonic()
    log = root/'logs'/f'{time.time_ns()}-stage-client.log'
    fd = os.open(SOURCE, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as source:
        if not stat.S_ISREG(os.fstat(source.fileno()).st_mode):
            raise ValueError('pinned source is not a regular file')
        if source.seek(0, 2) != SOURCE_SIZE:
            raise ValueError('pinned source size changed')
        source.seek(0)
        digest = hashlib.file_digest(source, 'sha256').hexdigest()
        if digest != SOURCE_SHA256:
            raise ValueError('pinned source hash changed')
        source.seek(0)
        argv = [str(tart_host.TART), 'exec', '-i', tart_host.VM, '/bin/sh', '-c', guest_script()]
        print(json.dumps({'mode':'stage-client', 'log':str(log), 'source_sha256':digest}), flush=True)
        with log.open('xb') as output:
            try:
                pid, status, reason = tart_host.capture(argv, root, output, 25, stdin_source=source)
            except BaseException as error:
                failure = {'mode':'stage-client', 'outcome':'SUPERVISOR_ERROR',
                           'error_type':type(error).__name__, 'cleanup_verified':False,
                           'elapsed_seconds':time.monotonic()-start, 'log':str(log)}
                log.with_suffix('.json').write_text(json.dumps(failure,indent=2)+'\n')
                raise
    receipt = {'mode':'stage-client', 'pid':pid, 'exit_code':status, 'stop_reason':reason,
               'elapsed_seconds':time.monotonic()-start, 'source_sha256':digest,
               'source_bytes':SOURCE_SIZE, 'log':str(log), 'log_bytes':log.stat().st_size,
               'auth_transferred':False, 'model_sessions':0, 'AB_runs':0}
    log.with_suffix('.json').write_text(json.dumps(receipt,indent=2)+'\n')
    print(json.dumps(receipt))
    print(json.dumps({'captured_output':log.read_bytes()[:8192].decode('utf8',errors='replace')}))
    return status


if __name__ == '__main__':
    if len(sys.argv) != 1:
        raise SystemExit('stage-client accepts no arguments')
    raise SystemExit(stage())
