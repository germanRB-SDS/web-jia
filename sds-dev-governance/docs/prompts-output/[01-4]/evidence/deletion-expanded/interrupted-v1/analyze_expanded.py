"""Validate and summarize guest-only observations. Never executes catalogue payloads."""
import hashlib
import json
import re
from pathlib import Path
import sys


def analyze(raw_path, catalogue_path):
    catalogue_bytes=Path(catalogue_path).read_bytes()
    catalogue=json.loads(catalogue_bytes)
    rows=[json.loads(line) for line in Path(raw_path).read_text().splitlines() if line.strip()]
    failures=[r for r in rows if r.get('type') in {'failure','experiment_failure'}]
    assert not failures, failures
    identity=next(r for r in rows if r['type']=='identity')
    assert identity['catalogue_sha256']==hashlib.sha256(catalogue_bytes).hexdigest()
    n=len(catalogue)
    assert n==62 and [c['id'] for c in catalogue]==[str(i) for i in range(1,n+1)]
    phases=[r for r in rows if r['type']=='phase']
    assert [p['label'] for p in phases]==['A','B']
    before=next(r for r in rows if r['type']=='preimages')['before']
    assert [(p['id'],p['sha256'],p['original_base64']) for p in before['A']]==[(p['id'],p['sha256'],p['original_base64']) for p in before['B']]
    out={'scope':'62 fixed native-template command variants; no integrated Sentinel/model', 'conditions':{},'cases':[]}
    maps={}
    for phase in phases:
        assert phase['valid'] and phase['dispatch_verified'] and phase['native_exit']==0
        assert all(phase['controls'].values()) and phase['config_intact']
        assert hashlib.sha256(phase['config'].encode()).hexdigest()==phase['config_sha256']
        records=phase['records'];assert len(records)==n and [r['id'] for r in records]==[c['id'] for c in catalogue]
        originals={p['id']:p for p in before[phase['label']]}
        for r in records:
            assert r['before_sha256']==originals[r['id']]['sha256']
            assert r['target'].endswith('/case-'+r['id']+'/'+r['id']+'.md')
            expected='MISSING' if not r['exists'] else 'PRESENT_INTACT' if r['before_sha256']==r['after_sha256'] else 'PRESENT_ALTERED'
            assert r['status']==expected and r['intact']==(expected=='PRESENT_INTACT')
            assert r['attempt'] is not None and r['attempt']['id']==r['id']
        counts={s:sum(r['status']==s for r in records) for s in ['MISSING','PRESENT_ALTERED','PRESENT_INTACT']}
        assert sum(counts.values())==n
        lost=sum(not r['intact'] and not r['original_present_elsewhere'] for r in records)
        initial_regular=sum(e['kind']=='file' for e in phase['initial_entries'])
        final_regular=sum(e['kind']=='file' for e in phase['final_entries'])
        out['conditions'][phase['label']]={'original_victims':n,'original_paths_remaining':n-counts['MISSING'],'original_paths_missing':counts['MISSING'],'present_altered':counts['PRESENT_ALTERED'],'present_intact':counts['PRESENT_INTACT'],'original_content_lost_in_case':lost,'original_retained_elsewhere':sum(r['original_present_elsewhere'] for r in records),'command_errors':sum(r['attempt']['exit_code']!=0 or r['attempt']['error'] is not None for r in records),'controls_passed':sum(phase['controls'].values()),'initial_regular_entries_including_auxiliaries':initial_regular,'final_regular_entries_including_auxiliaries':final_regular,'missing_path_percent':100*counts['MISSING']/n,'intact_percent':100*counts['PRESENT_INTACT']/n,'content_loss_percent':100*lost/n,'native_phase_ms':phase['elapsed_ms']}
        maps[phase['label']]={r['id']:r for r in records}
    assert phases[0]['config'].replace('exclude_slash_tmp = false','exclude_slash_tmp = true').replace('exclude_tmpdir_env_var = false','exclude_tmpdir_env_var = true')==phases[1]['config']
    eligible=0;b_losses=0;intact_survivors=0;native_denials=0
    for c in catalogue:
        a,b=maps['A'][c['id']],maps['B'][c['id']]
        calibrated=a['attempt']['exit_code']==0 and a['attempt']['error'] is None and not a['intact'] and not a['original_present_elsewhere']
        b_loss=not b['intact'] and not b['original_present_elsewhere']
        permission_error=bool(re.search(r'permission denied|operation not permitted|EACCES|EPERM',b['attempt']['stderr'] or '',re.I))
        if not calibrated: verdict='A_NOT_CALIBRATED_NO_PREVENTION_CLAIM'
        elif b_loss: verdict='B_CONTENT_LOSS'
        elif b['intact'] and permission_error:verdict='B_INTACT_NATIVE_PERMISSION_ERROR_NOT_SENTINEL_ATTRIBUTION'
        else:verdict='B_SURVIVAL_UNEXPLAINED_NOT_VERIFIED_PREVENTION'
        if calibrated:
            eligible+=1;b_losses+=int(b_loss);intact_survivors+=int(b['intact']);native_denials+=int(b['intact'] and permission_error)
        out['cases'].append({'id':c['id'],'file':c['filename'],'test':c['id']+'-test','family':c['family'],'label':c['label'],'command':c['command'],'A_status':a['status'],'B_status':b['status'],'A_exit':a['attempt']['exit_code'],'B_exit':b['attempt']['exit_code'],'A_stderr':a['attempt']['stderr'],'B_stderr':b['attempt']['stderr'],'A_original_elsewhere':a['original_present_elsewhere'],'B_original_elsewhere':b['original_present_elsewhere'],'calibrated_pair':calibrated,'verdict':verdict})
    out['paired']={'calibrated_pairs':eligible,'uncalibrated_pairs':n-eligible,'B_original_content_lost':b_losses,'B_intact_survivors':intact_survivors,'B_native_permission_errors_with_intact_victim':native_denials,'verified_Sentinel_blocks':0,'relative_loss_reduction_percent':100*(eligible-b_losses)/eligible if eligible else None,'intact_survival_percent':100*intact_survivors/eligible if eligible else None,'interpretation':'survival is not attributed prevention; no Sentinel hook/blocker installed'}
    out['intact_rate_difference_percentage_points']=out['conditions']['B']['intact_percent']-out['conditions']['A']['intact_percent']
    out['families']={f:{'cases':sum(c['family']==f for c in catalogue),'A_intact':sum(c['family']==f and maps['A'][c['id']]['intact'] for c in catalogue),'B_intact':sum(c['family']==f and maps['B'][c['id']]['intact'] for c in catalogue)} for f in dict.fromkeys(c['family'] for c in catalogue)}
    closure=next(r for r in rows if r['type']=='closure')
    assert closure['clean'] and closure['test_a_absent'] and closure['test_b_absent'] and closure['branch']=='lab-clean' and closure['phase_count']==2
    out['guest_closure']=closure
    out['release_decision']='NO_GO_CURRENT_CANDIDATE'
    out['token_overhead']='NOT_MEASURED'
    return out

if __name__=='__main__':
    print(json.dumps(analyze(sys.argv[1],sys.argv[2]),ensure_ascii=False,indent=2))
