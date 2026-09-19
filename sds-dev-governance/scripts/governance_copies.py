"""Validate, discover and classify 0..N copies without upgrading any of them."""
import argparse
import os
from pathlib import Path
import re
import subprocess
import sys
from governance_tree import fingerprint, inventory, safe_name

REQUIRED = ('GOVERNANCE.md', 'VERSION.md', 'practices/INDEX.md', 'skills/README.md', 'check-governance.sh')


def version(path):
    f = path / 'VERSION.md'
    if not f.is_file() or f.is_symlink():
        return None
    match = re.search(r'\bv(\d+)\.(\d+)\.(\d+)\b', f.read_text(encoding='utf-8'))
    return tuple(map(int, match.groups())) if match else None


def label(v):
    return 'v' + '.'.join(map(str, v)) if v else 'none'


def directory(raw):
    if not raw.strip():
        raise ValueError('directory argument must not be empty')
    safe_name(raw)
    path = Path(raw).expanduser().resolve(strict=True)
    if not path.is_dir():
        raise ValueError('not a directory: ' + raw)
    return path


def git_state(path):
    def call(*args):
        return subprocess.run(['git', '--no-optional-locks', '-C', str(path), *args],
                              capture_output=True, text=True, timeout=10)
    p = call('rev-parse', '--short', 'HEAD')
    if p.returncode:
        return '-', '-'
    status = call('status', '--porcelain', '--', str(path))
    if status.returncode:
        raise ValueError('cannot inspect Git status: ' + str(path))
    return p.stdout.strip(), 'dirty' if status.stdout else 'clean'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', action='append', default=[])
    parser.add_argument('--path', action='append', default=[])
    parser.add_argument('--stdin', action='store_true')
    parser.add_argument('--baseline', default=str(Path(__file__).resolve().parent.parent))
    parser.add_argument('--original-baseline', action='append', default=[], help='verified original release tree (repeatable)')
    parser.add_argument('--depth', type=int, default=5)
    parser.add_argument('--format', choices=['table', 'tsv'], default='table')
    parser.add_argument('--list-unique', action='store_true')
    args = parser.parse_args()
    if args.depth < 0:
        parser.error('--depth must be nonnegative')
    baseline = directory(args.baseline)
    base = inventory(baseline); base_fp = fingerprint(base); base_v = version(baseline)
    if base_v is None or any(n not in base or base[n][0] != 'file' for n in REQUIRED):
        raise ValueError('invalid or incomplete canonical baseline')
    originals = {}
    for raw in args.original_baseline:
        p = directory(raw); v = version(p); fp = fingerprint(inventory(p))
        if v is None or (v in originals and originals[v] != fp):
            raise ValueError('invalid or conflicting original baseline')
        originals[v] = fp
    candidates = [directory(p) for p in args.path]
    if args.stdin:
        candidates.extend(directory(line.rstrip('\r\n')) for line in sys.stdin if line.rstrip('\r\n'))
    for raw in args.root:
        root = directory(raw)
        def discover(p, depth):
            if p.name == 'sds-dev-governance':
                candidates.append(p); return
            if depth == args.depth:
                return
            for child in sorted(p.iterdir()):
                if child.name in {'.git', 'node_modules', '.venv'} or child.is_symlink():
                    continue
                if child.is_dir():
                    discover(child, depth + 1)
        discover(root, 0)
    if not (args.root or args.path or args.stdin):
        parser.error('use --root, --path or --stdin')
    rows = []; claims = {base_v: {base_fp}}
    for p in dict.fromkeys(candidates):
        tree = inventory(p); fp = fingerprint(tree); v = version(p)
        missing = [n for n in REQUIRED if n not in tree or tree[n][0] != 'file']
        hashes = {row[2] for row in base.values()}
        unique = [n for n, row in tree.items() if n not in base and
                  re.sub(r'^skills/[0-9]{2}-', 'skills/', n) not in base and row[2] not in hashes]
        if v is None:
            state, action = 'UNKNOWN', 'INSPECT'
        elif fp == base_fp:
            state, action = 'CANONICAL_MATCH', 'NONE'
        elif v >= base_v and missing:
            state, action = 'INVALID_MUTATION', 'INSPECT'
        elif v == base_v:
            state, action = 'SPLIT_VERSION', 'INSPECT'
        elif v > base_v:
            state, action = 'CANONICAL_BEHIND_PROJECT', 'PROMOTE_FIRST'
        elif unique or (v in originals and originals[v] != fp):
            state, action = 'LOCAL_GOVERNANCE_DELTA', 'PROMOTE_FIRST'
        else:
            state = 'PROJECT_BEHIND_CANONICAL'
            action = 'SAFE_UPGRADE' if originals.get(v) == fp else 'INSPECT_BASELINE'
        head, dirty = git_state(p)
        if action == 'SAFE_UPGRADE' and dirty == 'dirty':
            action = 'INSPECT_BASELINE'
        if v:
            claims.setdefault(v, set()).add(fp)
        rows.append([label(v), fp[:12], head, dirty, str(len(unique)), state, action,
                     'missing: ' + ' '.join(missing) if missing else '-', str(p)])
        if args.list_unique:
            for name in unique:
                print('  unpromoted: ' + str(p / name), file=sys.stderr)
    splits = [label(v) for v, fps in claims.items() if len(fps) > 1]
    header = ['version','fingerprint','head','worktree','unique_content','state','upgrade_action','missing','path']
    print(('\t' if args.format == 'tsv' else ' | ').join(header))
    for row in rows:
        print(('\t' if args.format == 'tsv' else ' | ').join(row))
    if splits:
        print('SPLIT_VERSION detected: ' + ', '.join(sorted(splits)), file=sys.stderr)
    return int(bool(splits))


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, subprocess.SubprocessError) as e:
        print('ERROR: ' + str(e), file=sys.stderr)
        sys.exit(2)
