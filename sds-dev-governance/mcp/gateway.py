"""Closed MCP stdio endpoint. No upstream process, credential access or network code."""
import json
import sys
from pathlib import Path
from control import Denied
from inventory import SERVERS, read_config

VERSIONS = ('2025-06-18', '2025-03-26', '2024-11-05')
MAX_MESSAGE = 32768


def status(server):
    profile = read_config(Path(__file__).parent / 'hostinger.json')
    if (profile.get('schema') != 1 or profile.get('runtime') != 'BLOCKED_SECRET_ISOLATION' or
            server not in profile.get('modules', {}) or profile.get('real_operations') != []):
        raise Denied('CONTROL_UNAVAILABLE')
    return {'server': server, 'status': 'BLOCKED_SECRET_ISOLATION',
            'provider_connected': False, 'provider_operations': False,
            'human_channel': 'BLOCKED_HUMAN_CHANNEL'}


def dispatch(request, server):
    if not isinstance(request, dict) or request.get('jsonrpc') != '2.0':
        raise Denied('INVALID_REQUEST')
    method = request.get('method')
    params = request.get('params', {})
    if not isinstance(params, dict):
        raise Denied('INVALID_PARAMS')
    current = status(server)  # Recheck control on every message, not just initialization.
    if method == 'initialize':
        version = params.get('protocolVersion')
        if version not in VERSIONS:
            raise Denied('PROTOCOL_UNSUPPORTED')
        return {'protocolVersion': version, 'serverInfo': {'name': 'sds-' + server, 'version': '1.27.0'},
                'capabilities': {'tools': {'listChanged': False}}}
    if method == 'ping':
        return {}
    if method == 'tools/list':
        return {'tools': [{'name': 'sds_status', 'description': 'Local control status; no provider access.',
                           'inputSchema': {'type': 'object', 'properties': {}, 'additionalProperties': False},
                           'annotations': {'readOnlyHint': True}}]}
    if method == 'tools/call' and params == {'name': 'sds_status', 'arguments': {}}:
        return {'content': [{'type': 'text', 'text': json.dumps(current, separators=(',', ':'))}]}
    if method == 'notifications/initialized':
        return None
    raise Denied('OPERATION_BLOCKED')


def serve(server):
    if server not in SERVERS:
        raise Denied('UNKNOWN_SERVER')
    for _ in range(100000):
        line = sys.stdin.buffer.readline(MAX_MESSAGE + 1)
        if not line:
            return
        if len(line) > MAX_MESSAGE:
            return  # Do not parse a truncated request or allow unbounded input.
        request = None
        try:
            request = json.loads(line)
            result = dispatch(request, server)
            if 'id' not in request:
                continue
            response = {'jsonrpc': '2.0', 'id': request['id'], 'result': result}
        except Exception:
            # No request/provider/error text is interpolated into a client-facing error.
            if isinstance(request, dict) and 'id' not in request:
                continue
            response = {'jsonrpc': '2.0', 'id': request.get('id') if isinstance(request, dict) else None,
                        'error': {'code': -32003, 'message': 'SDS_CONTROL_BLOCKED'}}
        encoded = json.dumps(response, allow_nan=False, separators=(',', ':'))
        if len(encoded.encode()) > MAX_MESSAGE:
            return
        print(encoded, flush=True)
