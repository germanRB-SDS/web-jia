"""One approved call starts the bounded VM and fixed probe; approval latency precedes boot."""
import hashlib
import json
from pathlib import Path
import signal
import subprocess
import time
from tart_host import checked_root, environment
import deletion_expanded_vm

PYTHON=Path('/opt/homebrew/bin/python3').resolve()
ROOT='/private/tmp/sds-sentinel-tart-KoUNwE'


def main():
    root=checked_root(ROOT)
    source_root=Path(__file__).resolve().parents[1]
    revision=json.loads((source_root/'docs/prompts-output/[01-4]/evidence/deletion-expanded/revision.json').read_text())
    for name,expected in revision['sha256'].items():
        p=Path(name) if Path(name).is_absolute() else source_root/name
        if hashlib.sha256(p.read_bytes()).hexdigest()!=expected:
            raise ValueError('Frozen dependency changed: '+name)
    log=root/'logs'/f'{time.time_ns()}-expanded-cycle.log'
    started=time.monotonic()
    status=78
    boot_status=None
    boot=None
    def interrupt(signum,frame):
        raise KeyboardInterrupt('Cycle interrupted')
    previous={s:signal.signal(s,interrupt) for s in (signal.SIGTERM,signal.SIGINT)}
    try:
        with log.open('xb') as output:
            boot=subprocess.Popen([str(PYTHON),'-B',str(source_root/'sentinel/tart_host.py'),ROOT,'boot-smoke'],cwd=source_root,env=environment(root),stdin=subprocess.DEVNULL,stdout=output,stderr=subprocess.STDOUT,close_fds=True,start_new_session=True)
            print(json.dumps({'mode':'expanded-cycle','boot_supervisor_pid':boot.pid,'boot_log':str(log)}),flush=True)
            # Fixed startup interval is within the unchanged 45s VM lifetime.
            time.sleep(8)
            if boot.poll() is not None:
                raise RuntimeError('VM supervisor exited before probe; no alternate path')
            status=deletion_expanded_vm.main()
            boot_status=boot.wait(timeout=max(1,55-(time.monotonic()-started)))
    finally:
        try:
            if boot is not None and boot.poll() is None:
                # TERM reaches the known supervisor's cleanup handler, which owns Tart PGID.
                boot.terminate()
                boot_status=boot.wait(timeout=30)
        finally:
            for s,handler in previous.items():signal.signal(s,handler)
            receipt={'mode':'expanded-cycle','probe_exit':status,'boot_supervisor_exit':boot_status,'boot_supervisor_pid':None if boot is None else boot.pid,'elapsed_seconds':time.monotonic()-started,'boot_log':str(log),'vm_closure_requires_inspect':True}
            log.with_suffix('.json').write_text(json.dumps(receipt,indent=2))
            print(json.dumps(receipt),flush=True)
    return status if boot_status==124 else 78


if __name__=='__main__':
    raise SystemExit(main())
