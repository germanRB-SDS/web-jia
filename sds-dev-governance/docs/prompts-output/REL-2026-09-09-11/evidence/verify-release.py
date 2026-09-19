"""Reproduce acceptance with the selected shell used by every env-bash child."""
import json, os
from pathlib import Path
import subprocess, tempfile
kit=Path(__file__).resolve().parents[4]
evidence=Path(__file__).resolve().parent
rows=[]
for shell in ['/bin/bash','/opt/homebrew/bin/bash']:
    if not Path(shell).exists():continue
    label='bash32' if shell=='/bin/bash' else 'bash53'
    temp=Path(tempfile.mkdtemp(prefix='sds-release-'+label+'-'))
    bin_dir=temp/'bin';bin_dir.mkdir();(bin_dir/'bash').symlink_to(shell)
    env=dict(os.environ,PATH=str(bin_dir)+':'+os.environ['PATH'])
    for script in ['test-governance-copies.sh','test-github-guardrails.sh','test-skill-bootstrap.sh','test-plugin-bootstrap.sh']:
        name=label+'-'+script+'.log'
        with (evidence/name).open('w') as log:
            p=subprocess.run([shell,str(kit/'tests'/script)],cwd=kit,env=env,stdout=log,stderr=subprocess.STDOUT,timeout=120)
        rows.append(dict(shell=shell,case=script,exit=p.returncode,evidence=name))
    for mode in ['project','hub']:
        target=temp/mode
        command=[shell,str(kit/'init.sh'),'Release fixture',str(target),'--mode',mode,'--files-only']
        p=subprocess.run(command,cwd=kit,env=env,capture_output=True,text=True,timeout=60)
        if p.returncode:raise RuntimeError(p.stderr)
        if mode=='hub':
            child=target/'independent';child.mkdir();(child/'AGENTS.md').write_text('child owns its context {{RUTA_LOCAL}}')
        name=label+'-check-'+mode+'.log'
        with (evidence/name).open('w') as log:
            p=subprocess.run([shell,str(target/'check-governance.sh'),str(target)],env=env,stdout=log,stderr=subprocess.STDOUT,timeout=180)
        rows.append(dict(shell=shell,case='checker '+mode,exit=p.returncode,evidence=name))
(evidence/'acceptance.json').write_text(json.dumps(rows,indent=2)+'\n')
print(json.dumps(rows,indent=2))
raise SystemExit(1 if any(x['exit'] for x in rows) else 0)
