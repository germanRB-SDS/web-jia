"""Pure policy contracts. No production network, custody service or approval issuer."""
import copy
import hashlib
import json
import os
from pathlib import Path
import stat
import threading


class Denied(Exception):
    """Only fixed reason codes may cross the client boundary."""


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'),
                                     allow_nan=False).encode()).hexdigest()


def credential_from_file(path, expected_name, owner_uid):
    """Custody-only interface; never called by CLI/gateway. No symlink parent/leaf."""
    path = Path(path)
    if not path.is_absolute() or '..' in path.parts:
        raise Denied('CUSTODY_PATH')
    fd = os.open('/', os.O_RDONLY | os.O_DIRECTORY)
    try:
        for part in path.parts[1:-1]:
            nxt = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
            os.close(fd)
            fd = nxt
        child = os.open(path.name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=fd)
        with os.fdopen(child, 'rb') as stream:
            info = os.fstat(stream.fileno())
            if (not stat.S_ISREG(info.st_mode) or info.st_uid != owner_uid or
                    info.st_mode & 0o077 or info.st_nlink != 1 or info.st_size > 8192):
                raise Denied('CUSTODY_PERMISSIONS')
            raw = stream.read(8193)
        if len(raw) > 8192:
            raise Denied('CUSTODY_FORMAT')
        fields = {}
        for line in raw.decode('utf-8').splitlines():
            key, sep, value = line.partition(':')
            if not sep or key not in ('NAME', 'TOKEN-SECRET') or key in fields or not value:
                raise Denied('CUSTODY_FORMAT')
            fields[key] = value
        if (set(fields) != {'NAME', 'TOKEN-SECRET'} or fields['NAME'] != expected_name or
                any(ord(c) < 33 or ord(c) > 126 for c in fields['TOKEN-SECRET'])):
            raise Denied('CUSTODY_FORMAT')
        return fields['TOKEN-SECRET']
    except (OSError, UnicodeError):
        raise Denied('CUSTODY_UNAVAILABLE') from None
    finally:
        os.close(fd)


class BatchControl:
    """Reference execution engine; callers must supply independently protected adapters.

    The supplied backend and event source are trusted code, never request arguments.
    No production adapter is shipped. The in-memory journal is for simulations only.
    """
    def __init__(self, policy, backend, human_events, clock):
        self.policy = copy.deepcopy(policy)
        self.backend, self.human_events, self.clock = backend, human_events, clock
        self.journal = {}
        self.lock = threading.Lock()

    def validate(self, batch, executor):
        if set(batch) != {'policy', 'executor', 'project', 'account', 'environment',
                          'expires', 'operations', 'nonce'}:
            raise Denied('BATCH_CONTRACT')
        if batch['policy'] != digest(self.policy) or batch['executor'] != executor:
            raise Denied('REVISION_OR_EXECUTOR')
        if any(batch[k] != self.policy[k] for k in ('project', 'account', 'environment')):
            raise Denied('SCOPE')
        if (type(batch['expires']) not in (int, float) or
                not self.clock() < batch['expires'] <= self.clock() + 3600):
            raise Denied('EXPIRED')
        if not isinstance(batch['nonce'], str) or not 16 <= len(batch['nonce']) <= 128:
            raise Denied('NONCE')
        ops = batch['operations']
        if not isinstance(ops, list) or not 1 <= len(ops) <= 100:
            raise Denied('FINITE_BATCH')
        destructive = False
        identities = set()
        for op in ops:
            if set(op) != {'tool', 'schema', 'resource', 'arguments', 'before', 'recovery'}:
                raise Denied('OPERATION_CONTRACT')
            rule = self.policy['tools'].get(op['tool'])
            if not rule or op['schema'] != rule['schema']:
                raise Denied('UNKNOWN_TOOL_OR_SCHEMA')
            if op['resource'] not in self.policy['resources']:
                raise Denied('RESOURCE')
            # Reviewed argument tuples define effects; neither method names nor hints do.
            effect = rule['argument_effects'].get(digest(op['arguments']))
            if effect not in ('read', 'write', 'destroy'):
                raise Denied('UNCLASSIFIED_EFFECT')
            if self.policy['provider'] == 'github' and effect == 'destroy':
                raise Denied('MANUAL_OWNER_ONLY')
            if effect == 'write' and not self.policy['reversible_write_authorized']:
                raise Denied('WRITE_AUTHORITY')
            if effect != 'read' and (not op['before'] or not op['recovery']):
                raise Denied('RECOVERY_REQUIRED')
            identity = (op['tool'], op['resource'], digest(op['arguments']))
            if identity in identities:
                raise Denied('DUPLICATE_OPERATION')
            identities.add(identity)
            destructive |= effect == 'destroy'
        return destructive

    def execute(self, batch, executor):
        batch = copy.deepcopy(batch)
        with self.lock:
            destructive = self.validate(batch, executor)
            key = digest(batch)
            if destructive:
                # Trusted channel must attest two separate events for this exact batch.
                events = self.human_events.events_for(key, executor)
                if (len(events) != 2 or len({e['event_id'] for e in events}) != 2 or
                        [e['stage'] for e in events] != [1, 2] or
                        any(e['batch'] != key or e['executor'] != executor or
                            e['expires'] < self.clock() for e in events) or
                        not events[0]['at'] < events[1]['at'] <= self.clock()):
                    raise Denied('TWO_HUMAN_EVENTS_REQUIRED')
            for i, op in enumerate(batch['operations']):
                journal_key = (key, i)
                state = self.journal.get(journal_key)
                if state == 'done':
                    continue
                if state == 'uncertain':
                    if self.backend.reconcile(key, i) == 'done':
                        self.journal[journal_key] = 'done'
                        continue
                    raise Denied('RECONCILIATION_REQUIRED')
                if self.backend.precondition(op['resource']) != op['before']:
                    raise Denied('PRECONDITION_CHANGED')
                self.journal[journal_key] = 'uncertain'
                try:
                    self.backend.apply(op, key, i)
                except Exception:
                    raise Denied('RECONCILIATION_REQUIRED') from None
                self.journal[journal_key] = 'done'
            return {'batch': key, 'completed': len(batch['operations'])}
