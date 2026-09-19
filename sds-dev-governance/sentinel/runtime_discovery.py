"""Fixed native prerequisite observation through the existing offline Tart supervisor.

One approval before boot; no arbitrary commands/roots, subjects or credential access.
The exact discovery revision requires its ledger admission before --run.
"""
import argparse
import hashlib
from io import BytesIO
import json
from pathlib import Path
import shlex
import signal
import subprocess
import time

from tart_host import capture, checked_root, command, environment

BASE = Path(__file__).resolve().parents[1]
LAB = Path('/private/tmp/sds-sentinel-tart-KoUNwE')
REVISION = BASE/'docs/prompts-output/[01-5]/evidence/runtime-discovery-revision.json'


def boot_owner(raw):
    """Read only this invocation's exclusive supervisor output, never guest output.

    The first PID belongs to stopped-state inspection. Only a PID emitted after
    the boot-smoke marker belongs to the launch accepted by that inspection.
    """
    if not isinstance(raw, bytes) or len(raw) > 65536:
        raise ValueError('Invalid boot evidence')
    accepted = False
    for line in raw.splitlines():
        row = json.loads(line)
        if not isinstance(row, dict):
            raise ValueError('Invalid boot record')
        if row.get('mode') == 'boot-smoke' and set(row) == {'mode', 'log'}:
            accepted = True
        elif accepted and set(row) == {'pid', 'process_group'}:
            if type(row['pid']) is int and row['pid'] > 1 and row['pid'] == row['process_group']:
                return row['pid']
            raise ValueError('Invalid boot process identity')
    raise ValueError('No owned boot after stopped-state validation; guest command skipped')


def verify():
    revision = json.loads(REVISION.read_text())
    for name, expected in revision['sha256'].items():
        path = Path(name) if Path(name).is_absolute() else BASE/name
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise ValueError('Frozen dependency changed: '+name)
    return revision


def run():
    revision = verify()
    root = checked_root(str(LAB))
    python = revision['python']
    source = (BASE/'sentinel/runtime_discovery_guest.js').read_text()
    shell = '''set -eu
[ "$(/usr/bin/readlink /opt/homebrew/bin/node)" = '../Cellar/node@24/24.20.0/bin/node' ]
[ "$(/usr/bin/shasum -a 256 /opt/homebrew/bin/node)" = 'c8eedc7651a438fb7d2ceb36fd70032676c855586a36c950ba5a662f0b7853bd  /opt/homebrew/bin/node' ]
[ -f /Users/Shared/sds-sentinel-client-4f85982624b3/codex ]
exec /usr/bin/env -i PATH=/usr/bin:/bin HOME=/var/empty /opt/homebrew/bin/node -e '''+shlex.quote(source)
    boot_log = root/'logs'/f'{time.time_ns()}-runtime-discovery-boot.log'
    guest_log = root/'logs'/f'{time.time_ns()}-runtime-discovery-guest.log'
    started = time.monotonic()
    boot = None
    result = {'mode':'runtime-discovery', 'boot_log':str(boot_log), 'guest_log':str(guest_log),
              'guest_exit':None, 'boot_exit':None, 'stopped_observed':False}

    def interrupted(signum, frame):
        raise KeyboardInterrupt('Discovery interrupted')

    previous = {s:signal.signal(s, interrupted) for s in (signal.SIGINT, signal.SIGTERM)}
    try:
        with boot_log.open('xb') as output:
            boot = subprocess.Popen([python, '-B', str(BASE/'sentinel/tart_host.py'), str(LAB), 'boot-smoke'],
                cwd=BASE, env=environment(root), stdin=subprocess.DEVNULL, stdout=output,
                stderr=subprocess.STDOUT, close_fds=True, start_new_session=True)
            result['boot_pid'] = boot.pid
            print(json.dumps(result), flush=True)
            time.sleep(8)
            if boot.poll() is not None:
                raise RuntimeError('Boot supervisor exited before discovery')
            result['tart_pid'] = boot_owner(boot_log.read_bytes())
            with guest_log.open('xb') as guest:
                pid, status, reason = capture(command(root, 'exec-admin', ['/bin/sh', '-c', shell]), root, guest, 25)
            result.update(guest_pid=pid, guest_exit=status, guest_reason=reason)
            result['boot_exit'] = boot.wait(timeout=max(1, 55-(time.monotonic()-started)))
    finally:
        try:
            if boot is not None and boot.poll() is None:
                boot.terminate()
                result['boot_exit'] = boot.wait(timeout=30)
            inspection = BytesIO()
            pid, status, reason = capture(command(root, 'inspect', []), root, inspection, 10)
            result['inspect_pid'] = pid
            result['inspect_exit'] = status
            result['inspect_reason'] = reason
            result['inspect_raw'] = inspection.getvalue().decode('utf8', errors='replace')
            if status == 0 and not reason:
                entries = json.loads(result['inspect_raw'])
                matches = [e for e in entries if e.get('Name') == 'sentinel-lab' and e.get('Source') == 'local']
                result['stopped_observed'] = len(matches) == 1 and matches[0].get('State') == 'stopped'
        finally:
            for s, handler in previous.items():
                signal.signal(s, handler)
            result['elapsed_seconds'] = time.monotonic()-started
            with boot_log.with_suffix('.json').open('x') as receipt:
                json.dump(result, receipt, indent=2)
            print(json.dumps(result), flush=True)
    return 0 if result['guest_exit'] == 0 and result['boot_exit'] == 124 and result['stopped_observed'] else 78


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--run', action='store_true', required=True)
    parser.parse_args()
    raise SystemExit(run())
