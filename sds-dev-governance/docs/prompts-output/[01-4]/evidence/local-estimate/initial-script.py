"""Bounded local helper measurements and explicitly hypothetical token scenarios.

No client invocation, credentials, network, payload execution or settings changes.
This is not the A/B campaign and does not estimate whole-session cost from microseconds.
"""
import hashlib
import json
import math
from pathlib import Path
import platform
import statistics
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from sentinel.core import message, native_reply

PAIRS = 9
ITERATIONS = 2000
WARMUP = 200
LABEL = 'fixtures/report.md'


def measure(harness, deny):
    payload = {'hook_event_name': 'PreToolUse', 'tool_name': 'Bash', 'tool_input': {}}
    baseline = lambda: ''
    candidate = lambda: native_reply(harness, payload, deny=deny, reason='R3', label=LABEL)
    functions = {'baseline_empty_call': baseline, 'candidate_codec': candidate}
    for function in functions.values():
        for _ in range(WARMUP):
            function()
    rows = []
    for pair in range(PAIRS):
        order = list(functions) if pair % 2 == 0 else list(reversed(functions))
        for name in order:
            function = functions[name]
            start = time.perf_counter_ns()
            for _ in range(ITERATIONS):
                function()
            rows.append({'pair': pair, 'order': order, 'path': name,
                         'ns_per_call': (time.perf_counter_ns()-start)/ITERATIONS})
    deltas = [next(r['ns_per_call'] for r in rows if r['pair']==i and r['path']=='candidate_codec')
              - next(r['ns_per_call'] for r in rows if r['pair']==i and r['path']=='baseline_empty_call')
              for i in range(PAIRS)]
    wire = candidate()
    return {'client_codec': harness, 'denied': deny, 'observed_wire_bytes': len(wire.encode()),
            'observed_wire': wire, 'raw': rows,
            'paired_delta_ns': {'median': statistics.median(deltas), 'min': min(deltas), 'max': max(deltas)},
            'scope': 'in-process encoding and validation only, not native client/Sentinel B',
            'whole_session_overhead_percent': None}


def observe():
    body = message('R3', LABEL)
    # Deliberately declared sensitivity assumptions, NOT a calibrated tokenizer or bound.
    assumed_chars_per_token = [2, 4]
    tokens = [math.ceil(len(body)/4), math.ceil(len(body)/2)]
    scenarios = []
    for name, notices, reads, extra_turn_tokens in [
        ('no_notice_component', 0, 0, 0),
        ('one_notice_once', 1, 1, 0),
        ('five_notices_read_five_times_each', 5, 5, 0),
        ('ten_notices_read_five_times_each', 10, 5, 0),
        ('one_notice_and_assumed_extra_turn', 1, 1, 2000),
    ]:
        extra = [notices*reads*n+extra_turn_tokens for n in tokens]
        scenarios.append({'scenario': name, 'class': 'HYPOTHETICAL_SENSITIVITY',
                          'assumed_A_total_tokens': 10000, 'assumed_notices': notices,
                          'assumed_reads_per_notice': reads, 'assumed_extra_turn_total_tokens': extra_turn_tokens,
                          'estimated_extra_tokens_range': extra,
                          'estimated_component_overhead_percent_range': [v/100 for v in extra],
                          'whole_session_overhead_percent': None})
    return {'class': 'LOCAL_COMPONENT_MEASUREMENT_AND_UNCALIBRATED_SCENARIOS',
            'platform': platform.platform(), 'python': sys.version.split()[0],
            'source_sha256': {f: hashlib.sha256((ROOT/f).read_bytes()).hexdigest()
                              for f in ['sentinel/core.py', 'tests/estimate-sentinel-local.py']},
            'design': {'pairs': PAIRS, 'iterations_per_arm_per_pair': ITERATIONS, 'warmup_per_arm': WARMUP,
                       'order': 'alternating, fixed ahead of measurement'},
            'helper_measurements': [measure(h, deny) for h in ['codex', 'claude'] for deny in [False, True]],
            'text': {'class': 'OBSERVED_LOCAL_TEXT', 'body': body, 'characters': len(body),
                     'utf8_bytes': len(body.encode()), 'compatible_tokenizer_available': False,
                     'assumed_chars_per_token': assumed_chars_per_token,
                     'uncalibrated_tokens_per_notice_range': tokens,
                     'warning': 'Sensitivity assumption only; actual token count may lie outside this range.'},
            'scenarios': scenarios,
            'model_runs': 0, 'api_calls': 0, 'A_B_campaign_runs': 0,
            'money': None, 'currency': None, 'quota_consumed_by_model_trials': None,
            'real_model_overhead_percent': None,
            'limits': ['No inference runs: this does not run GPT-6 Astra or Fable offline.',
                       'No model-specific tokenizer, cache, quota or native usage calibration.',
                       'No startup/IPC/IO/policy resolver/snapshot/rollback measured by helper timing.',
                       'Token scenarios omit unknown static context, framing, retries, reasoning and behavioral change unless explicitly assumed.',
                       'Repeated input tokens are not necessarily new billed/weighted quota tokens.',
                       'The baseline is an empty function, never client A with native controls.',
                       'No security/utility/S0/S7 evidence or global <8/<40 acceptance.']}


if __name__ == '__main__':
    print(json.dumps(observe(), ensure_ascii=True, indent=2))
