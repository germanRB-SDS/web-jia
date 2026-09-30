#!/usr/bin/env python3
"""Read-only integrity check. Run with Python 3 from any working directory."""
import hashlib
import json
from pathlib import Path
import re
import struct
from urllib.parse import unquote

base = Path(__file__).resolve().parent.parent
errors = []
checks = 0

def check(condition, message):
    global checks
    checks += 1
    if not condition:
        errors.append(message)

manifest = json.loads((base / 'metainfo/source-manifest.json').read_text())
snapshot = base / 'project-skeleton/reference'
for item in manifest['files']:
    f = snapshot / item['path']
    check(f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest() == item['sha256'], 'Source mismatch: ' + item['path'])
for item in manifest['added_files']:
    check((snapshot / item).is_file(), 'Missing snapshot addition: ' + item)
shots = json.loads((base / 'project-screenshots/manifest.json').read_text())
check(len(shots) == 14, 'Expected the 14 supplied screenshots')
for item in shots:
    f = base / 'project-screenshots' / item['file']
    if not f.is_file():
        check(False, 'Missing screenshot: ' + item['file'])
        continue
    data = f.read_bytes()
    check(hashlib.sha256(data).hexdigest() == item['sha256'], 'Screenshot modified: ' + item['file'])
    check(struct.unpack('>II', data[16:24]) == (item['width'], item['height']), 'Wrong PNG dimensions: ' + item['file'])
# Authored documentation only: original comments/design docs are historical evidence.
for f in base.rglob('*.md'):
    if snapshot in f.parents:
        continue
    for target in re.findall(r'\]\(([^)]+)\)', f.read_text()):
        if target.startswith(('http:', 'https:', '#')):
            continue
        path = unquote(target.split('#', 1)[0])
        check((f.parent / path).exists(), f'Missing reference in {f.relative_to(base)}: {target}')
# Source closure for local imports (including dynamic imports and CSS Modules).
for f in snapshot.rglob('*'):
    if f.suffix not in ('.ts', '.tsx'):
        continue
    text = f.read_text()
    for target in re.findall(r'(?:from\s*|import\s*\(\s*|import\s*)[\'\"]([^\'\"]+)', text):
        if target.startswith('@/'):
            p = snapshot / target[2:]
        elif target.startswith('.'):
            p = f.parent / target
        else:
            continue
        candidates = [p] + [Path(str(p) + ext) for ext in ('.ts', '.tsx', '.js', '.json')]
        candidates += [p / ('index' + ext) for ext in ('.ts', '.tsx', '.js')]
        check(any(c.is_file() for c in candidates), f'Missing import {target} from {f.relative_to(snapshot)}')
skill = base / '.skills/build-web-jia-model/SKILL.md'
text = skill.read_text()
front = re.match(r'^---\n(.*?)\n---\n', text, re.S)
check(bool(front), 'Missing skill YAML frontmatter')
if front:
    rows = dict(line.split(':', 1) for line in front.group(1).splitlines())
    check(set(rows) == {'name', 'description'}, 'Unexpected skill metadata')
    check(rows['name'].strip() == 'build-web-jia-model', 'Skill name mismatch')
    check(0 < len(rows['description'].strip()) <= 1024, 'Invalid skill description')
check('allow_implicit_invocation: false' in (skill.parent / 'agents/openai.yaml').read_text(), 'Skill must be explicit-only')
check('[TODO:' not in text, 'Unfinished skill scaffold')
for f in base.rglob('*'):
    check(not f.is_symlink(), 'Unexpected symlink: ' + str(f.relative_to(base)))
    check(f.name not in ('node_modules', '.next', '.git', '.env'), 'Generated/private artifact: ' + str(f.relative_to(base)))
result = {'checks': checks, 'source_files': len(manifest['files']), 'screenshots': len(shots), 'errors': errors, 'status': 'FAIL' if errors else 'PASS'}
print(json.dumps(result, indent=2))
raise SystemExit(1 if errors else 0)
