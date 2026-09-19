"""Pure receipt mutation checks. Never executes a deletion command or starts a VM."""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('closure_analyzer', HERE / 'analyze_with_closure.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
raw = [json.loads(x) for x in (HERE / '1789328068464235000-deletion-expanded.log').read_text().splitlines()]
close = [json.loads(x) for x in (HERE / '1789328388708787000-deletion-close.log').read_text().splitlines()]

def row(rows, kind):
    return next(x for x in rows if x['type'] == kind)

checks = []
with tempfile.TemporaryDirectory(prefix='sentinel-receipt-check-') as directory:
    raw_path, close_path = (Path(directory) / name for name in ('raw.jsonl', 'close.jsonl'))
    def check(name, mutate, accepted=False, with_close=True):
        r, c = copy.deepcopy(raw), copy.deepcopy(close)
        mutate(r, c)
        raw_path.write_text(''.join(json.dumps(x) + '\n' for x in r))
        close_path.write_text(''.join(json.dumps(x) + '\n' for x in c))
        try:
            result = module.analyze(raw_path, HERE / 'catalogue.json', close_path if with_close else None)
            outcome = True
            if accepted:
                assert result['paired']['calibrated_pairs'] == 62
                assert result['paired']['relative_loss_reduction_percent'] == 0
                assert result['original_execution_failures_preserved'] == [row(raw, 'failure')]
                assert result['original_guest_closure_preserved']['clean'] is False
        except (AssertionError, KeyError, StopIteration):
            outcome = False
        assert outcome == accepted, name
        checks.append({'case': name, 'expected': 'accept' if accepted else 'reject', 'pass': True})
    check('real receipts preserve original failure', lambda r,c: None, accepted=True)
    check('original failed closure alone', lambda r,c: None, with_close=False)
    check('unexpected original failure', lambda r,c: row(r,'failure').update(message='PAYLOAD_FAILED'))
    check('incomplete phase pair', lambda r,c: r.remove(next(x for x in r if x['type']=='phase' and x['label']=='B')))
    check('invalid B phase', lambda r,c: next(x for x in r if x['type']=='phase' and x['label']=='B').update(valid=False))
    check('additional failure in closure', lambda r,c: c.append({'type':'experiment_failure'}))
    check('files deleted during closure', lambda r,c: row(c,'closure').update(files_deleted=1))
    check('test-b still present', lambda r,c: row(c,'closure').update(test_b_absent=False))
    check('wrong final branch', lambda r,c: row(c,'closure').update(branch='other'))
    check('missing persisted reference', lambda r,c: c.remove(row(c,'persisted_reference')))
    check('failed reference lookup', lambda r,c: row(c,'persisted_reference').update(status=1))
    check('different commit reference', lambda r,c: row(c,'persisted_reference').update(stdout='0'*40))
    check('false persistence claim', lambda r,c: row(c,'closure').update(expanded_reference_persisted=False))
    check('inventory outside roots', lambda r,c: row(c,'empty_directories_before')['directories'].__setitem__(0,'/Users/admin/unrelated'))
    check('inventory parent traversal', lambda r,c: row(c,'empty_directories_before')['directories'].__setitem__(0,row(r,'identity')['repo']+'/test-a/../other'))
    check('inventory count mismatch', lambda r,c: row(c,'closure').update(removed_empty_directories=77))
print(json.dumps({'scope':'pure receipt validation; no payload execution', 'passed':len(checks), 'checks':checks}, indent=2))
