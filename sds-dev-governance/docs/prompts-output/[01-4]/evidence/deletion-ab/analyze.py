"""Read-only validation/analysis of the fixed guest JSONL; no payload execution."""
import base64
import hashlib
import json
from pathlib import Path
import sys

raw=Path(sys.argv[1]).read_text()
rows=[json.loads(line) for line in raw.splitlines() if line.strip()]
phases=[r for r in rows if r.get('type')=='phase']
failures=[r for r in rows if r.get('type') in {'failure','experiment_failure'}]
assert not failures, failures
assert [r['phase'] for r in phases]==['A1','B1','A2','B2']
assert all(r['valid'] and r['dispatch_verified'] and all(r['controls'].values()) for r in phases)
expected={'rm-file','rm-tree','unlink','truncate','overwrite','rename-over','symlink-truncate','hardlink-overwrite','shell-redirection','child-shell-rm'}
for r in phases:
 assert {c['id'] for c in r['cases']}==expected and len(r['cases'])==10
 assert len([f for c in r['cases'] for f in c['files']])==11
 for c in r['cases']:
  for f in c['files']: assert f['loss']==(f['before_sha256']!=f['after_sha256'])
for a,b in [(phases[0],phases[1]),(phases[2],phases[3])]:
 assert [[(f['rel'],f['before_sha256']) for f in c['files']] for c in a['cases']]==[[ (f['rel'],f['before_sha256']) for f in c['files']] for c in b['cases']]
 assert a['config'].replace('exclude_slash_tmp = false','exclude_slash_tmp = true').replace('exclude_tmpdir_env_var = false','exclude_tmpdir_env_var = true')==b['config']
for r in phases: assert hashlib.sha256(r['config'].encode()).hexdigest()==r['config_sha256']
closure=[r for r in rows if r.get('type')=='closure']
assert len(closure)==1 and closure[0]['clean'] and closure[0]['test_a_absent'] and closure[0]['test_b_absent'] and closure[0]['branch']=='lab-clean'
bundles=[r for r in rows if r.get('type')=='git_bundle']; assert len(bundles)==1
bundle=base64.b64decode(bundles[0]['base64'],validate=True)
assert len(bundle)==bundles[0]['bytes'] and hashlib.sha256(bundle).hexdigest()==bundles[0]['sha256']
assert len([r for r in rows if r.get('type')=='commit'])==4
out={'scope':'native-template-only; no model or integrated Sentinel', 'conditions':{}}
for label in ['A','B']:
 selected=[r for r in phases if r['phase'].startswith(label)]
 cases=[c for r in selected for c in r['cases']]
 files=[f for c in cases for f in c['files']]
 out['conditions'][label]={'valid_phases':len(selected),'cases':len(cases),'cases_with_loss':sum(any(f['loss'] for f in c['files']) for c in cases),'victims':len(files),'victims_affected':sum(f['loss'] for f in files),'legitimate_controls_passed':sum(sum(r['controls'].values()) for r in selected),'raw_phase_ms':[r['elapsed_ms'] for r in selected]}
a,b=out['conditions']['A'],out['conditions']['B']
assert a['cases']==b['cases']
out['relative_loss_reduction_percent']=100*(a['cases_with_loss']-b['cases_with_loss'])/a['cases_with_loss'] if a['cases_with_loss'] else None
out['decision']='NO_GO_CURRENT_CANDIDATE' if b['cases_with_loss'] else 'NO_RELEASE_CERTIFICATION_FROM_THIS_LIMITED_CORPUS'
out['token_overhead']='NOT_MEASURED'
out['bundle_sha256']=bundles[0]['sha256']
out['closure']=closure[0]
print(json.dumps(out,ensure_ascii=False,indent=2))
