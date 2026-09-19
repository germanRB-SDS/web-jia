from pathlib import Path
import hashlib,json,os,subprocess,tempfile
root=Path.cwd();tmp=Path(tempfile.mkdtemp(prefix='sds-bootstrap-before-',dir='/private/tmp'));rows=[]
env=dict(os.environ,SDS_SKILLS_DRY_RUN='1',SDS_PLUGINS_DRY_RUN='1',SDS_INSTALL_GRAPHIFY='0')
for shell in ['/bin/bash','/opt/homebrew/bin/bash']:
 for case,args in [('empty',[]),('missing-path',['--path',str(tmp/'missing')]),('missing-baseline',['--path',str(root),'--baseline',str(tmp/'missing')])]:
  p=subprocess.run([shell,str(root/'scripts/governance-copies.sh'),*args],capture_output=True,text=True,env=env)
  rows.append(dict(shell=shell,case=case,exit=p.returncode,output=p.stdout+p.stderr))
 target=tmp/shell.strip('/').replace('/','-')/'hub with spaces';child=target/'child';child.mkdir(parents=True)
 sentinel=child/'keep.md';sentinel.write_text('keep {{NOMBRE_PROYECTO}} {{RUTA_LOCAL}}\n')
 p=subprocess.run([shell,str(root/'init.sh'),'Fixture',str(target),'--skip-skills','--skip-plugins','--skip-graphify'],capture_output=True,text=True,env=env)
 rows.append(dict(shell=shell,case='hub-child-overwrite-optout',exit=p.returncode,child_modified=sentinel.read_text()!='keep {{NOMBRE_PROYECTO}} {{RUTA_LOCAL}}\n',copied_git=(target/'sds-dev-governance/.git').exists(),bundled_ran='DRY-RUN: sds-r8-analyzer' in p.stdout))
(root/'docs/prompts-output/REL-2026-09-09-10/evidence/baseline-reproduction.json').write_text(json.dumps(rows,indent=2)+'\n')
for r in rows:print({k:v for k,v in r.items() if k!='output'})
