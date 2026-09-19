"""Offline MCP inventory and fail-closed staging. No provider execution command."""
import argparse
import json
import os
from pathlib import Path
import sys
from control import Denied
from inventory import SERVERS, observe
from configure import stage, restore, instructions, record_install
from gateway import serve, status


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    for name in ('inventory', 'check', 'doctor', 'stage', 'restore', 'instructions', 'record-install'):
        p = sub.add_parser(name)
        p.add_argument('--home', type=Path, default=Path.home())
        p.add_argument('--state', type=Path)
        p.add_argument('--project', type=Path, required=name == 'check', default=Path.cwd())
        if name in ('check', 'doctor', 'stage', 'instructions'):
            p.add_argument('--client', choices=('codex', 'claude', 'gemini'), required=True)
        if name == 'check':
            p.add_argument('--server', required=True)
        if name == 'inventory':
            p.add_argument('--compact', action='store_true')
        if name == 'restore':
            p.add_argument('--receipt', required=True)
        if name == 'record-install':
            p.add_argument('--tooling', type=Path, required=True)
    p = sub.add_parser('serve')
    p.add_argument('--server', choices=SERVERS, required=True)
    args = parser.parse_args()
    if args.command == 'serve':
        return serve(args.server) or 0
    state = args.state or args.home / '.local/state/sds-mcp'
    if args.command in ('stage', 'restore', 'instructions', 'record-install'):
        if args.home == Path.home() and any(k in os.environ for k in ('CODEX_HOME', 'CLAUDE_CONFIG_DIR')):
            raise Denied('CONFIG_ROOT_OVERRIDE_REVIEW_REQUIRED')
        if args.command == 'stage':
            result = stage(args.home, state, args.client)
        elif args.command == 'instructions':
            result = instructions(args.home, state, args.client)
        elif args.command == 'record-install':
            result = record_install(args.home, args.project, state, args.tooling)
        else:
            result = restore(args.home, state, args.receipt)
        print(json.dumps(result, separators=(',', ':')))
        return 0
    result = observe(args.home, args.project, state)
    if args.command == 'inventory':
        if args.compact:
            fields = ('id', 'client', 'scope', 'installed_at', 'first_seen_at', 'status')
            print('MCP\tCLIENT\tSCOPE\tINSTALLED_AT\tFIRST_SEEN_AT\tSTATUS')
            for row in result['entries']:
                print('\t'.join(str(row[k]) for k in fields))
            print('COVERAGE\t' + ','.join(result['coverage']))
        else:
            print(json.dumps(result, separators=(',', ':')))
        return 0
    if args.command == 'doctor':
        print(json.dumps({'client': args.client, 'status': 'BLOCKED_SECRET_ISOLATION',
                          'coverage': result['coverage'], 'real_provider_calls': 0}, separators=(',', ':')))
        return 3
    matches = [r for r in result['entries'] if r['client'] == args.client and r['id'] == args.server and r['effective']]
    reason = 'NOT_EVALUATED'
    ledger = args.project / 'docs/governance/capability-registry.md'
    if not ledger.exists():
        reason = 'LEDGER_MISSING'
    elif args.server in SERVERS and len(matches) == 1:
        reason = matches[0]['status']
    print(json.dumps({'server': args.server if args.server in SERVERS else 'unregistered',
                      'client': args.client, 'status': reason, 'allowed': False,
                      'policy': 'practices/modules/07-mcp-control.md'}, separators=(',', ':')))
    return 3


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (Exception, KeyboardInterrupt):
        print('{"status":"CONTROL_UNAVAILABLE","allowed":false}', file=sys.stderr)
        raise SystemExit(4)
