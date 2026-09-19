"""Read-only selective Markdown dialect; identity is document + stable H2 code."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import sys

LIMIT = 2 * 1024 * 1024
CODE = r'[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*'
SECTION = re.compile(r'^## \[(' + CODE + r')\] (\S.*?)\s*$')
FENCE = re.compile(r'^ {0,3}(`{3,}|~{3,})(.*)$')
DIRECTIVE = re.compile(r'^<!-- sds-text:(required|depends) (' + CODE + r'(?: ' + CODE + r')*) -->$')


def read_file(path):
    """One bounded snapshot; reject leaf links/devices and concurrent in-place modification."""
    path = Path(path).expanduser()
    if any(ord(c) < 32 or ord(c) == 127 for c in str(path)):
        raise ValueError('unsupported control character in path')
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as stream:
        before = os.fstat(stream.fileno())
        if not stat.S_ISREG(before.st_mode) or before.st_size > LIMIT:
            raise ValueError('expected a regular file of at most 2 MiB')
        raw = stream.read(LIMIT + 1)
        after = os.fstat(stream.fileno())
        if len(raw) > LIMIT or (before.st_size, before.st_mtime_ns, before.st_ctime_ns) != (after.st_size, after.st_mtime_ns, after.st_ctime_ns):
            raise ValueError('file changed during snapshot or exceeded 2 MiB')
    text = raw.decode('utf-8')
    if '\r' in text.replace('\r\n',''):
        raise ValueError('only LF or CRLF line endings are supported')
    if any((ord(c) < 32 and c not in '\n\r\t') or ord(c) == 127 for c in text):
        raise ValueError('expected text without control characters')
    return raw


class Document:
    def __init__(self, raw):
        self.raw = raw
        self.sha = hashlib.sha256(raw).hexdigest()
        parts = raw.decode('utf-8').split('\n')
        self.lines = [part + '\n' for part in parts[:-1]] + ([parts[-1]] if parts[-1] else [])
        self.sections = {}; self.required = []; self.preamble_end = len(self.lines)
        current = None; fence = None
        for i, line in enumerate(self.lines):
            plain = line.rstrip('\r\n')
            marker = FENCE.match(plain)
            if fence:
                if marker and marker[1][0] == fence[0] and len(marker[1]) >= fence[1] and not marker[2].strip():
                    fence = None
                continue
            if marker:
                if marker[1][0] == '`' and '`' in marker[2]:
                    raise ValueError('backticks in fence info are outside the supported dialect')
                fence = (marker[1][0], len(marker[1])); continue
            # Coded headers are column-zero H2. Reject ambiguous indented candidates.
            if plain.lstrip().startswith('## [') and not plain.startswith('## ['):
                raise ValueError('coded H2 must start in column zero')
            if plain.startswith('## '):
                match = SECTION.fullmatch(plain)
                if not match:
                    if not self.sections and not plain.startswith('## ['):
                        continue  # Introductory H2 preface is always retained, never skipped.
                    raise ValueError('H2 inside the section body must have a valid stable code')
                if current is not None:
                    self.sections[current]['end'] = i
                self.preamble_end = min(self.preamble_end, i)
                code, title = match.groups()
                if code in self.sections:
                    raise ValueError('duplicate section code: ' + code)
                self.sections[code] = dict(start=i, end=len(self.lines), title=title, depends=[])
                current = code
            elif plain.startswith('<!-- sds-text:'):
                directive = DIRECTIVE.fullmatch(plain)
                if not directive:
                    raise ValueError('invalid sds-text directive')
                kind, values = directive.groups(); values = values.split()
                if len(values) != len(set(values)):
                    raise ValueError('duplicate directive code')
                if kind == 'required' and current is None and not self.required:
                    self.required = values
                elif kind == 'depends' and current is not None and not self.sections[current]['depends']:
                    self.sections[current]['depends'] = values
                else:
                    raise ValueError('duplicate or misplaced directive')
        if fence:
            raise ValueError('unclosed code fence')
        if not self.sections:
            raise ValueError('no coded H2 sections; use native tools for unstructured/short text')
        # Validate the entire declared dependency graph before any usable output.
        self.closure([*self.required, *self.sections])

    def closure(self, codes):
        result = []; active = set(); seen = set()
        def visit(code):
            if code not in self.sections:
                raise ValueError('unknown or missing dependency code: ' + code)
            if code in active:
                raise ValueError('dependency cycle: ' + code)
            if code in seen:
                return
            active.add(code)
            for dep in self.sections[code]['depends']:
                visit(dep)
            active.remove(code); seen.add(code); result.append(code)
        for code in codes:
            visit(code)
        return result

    def body(self, code):
        section = self.sections[code]
        return ''.join(self.lines[section['start']:section['end']])

    @property
    def preamble(self):
        return ''.join(self.lines[:self.preamble_end])

    def metadata(self, code):
        s = self.sections[code]; body = self.body(code).encode()
        return dict(code=code, title=s['title'], lines=[s['start']+1,s['end']],
                    bytes=len(body), depends=s['depends'])

    def index(self):
        rows = ['<!-- sds-text-index:v1 source-sha256=' + self.sha + ' -->\n',
                '| Code | Lines | Bytes | Dependencies | Title |\n',
                '|---|---:|---:|---|---|\n']
        for code in self.sections:
            m = self.metadata(code)
            title=m['title'].replace('|','&#124;').replace('\t',' ')
            rows.append(f"| {code} | {m['lines'][0]}–{m['lines'][1]} | {m['bytes']} | {', '.join(m['depends']) or '—'} | {title} |\n")
        return ''.join(rows)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['list','get','check','index'])
    parser.add_argument('file', type=Path)
    parser.add_argument('codes', nargs='*')
    parser.add_argument('--require', action='append', default=[], metavar='CODE')
    parser.add_argument('--expect-sha256')
    parser.add_argument('--index-file', type=Path, help='check only: compare a previously generated index')
    parser.add_argument('--max-lines', type=int, default=400)
    parser.add_argument('--max-bytes', type=int, default=65536, help='complete output budget, including metadata/preamble')
    args = parser.parse_args(argv)
    if args.max_lines < 1 or args.max_bytes < 1:
        raise ValueError('output budgets must be positive')
    if args.command != 'get' and (args.codes or args.require):
        raise ValueError('codes/require are only accepted by get')
    if args.command == 'get' and not args.codes:
        raise ValueError('get needs at least one code')
    if len(args.codes) != len(set(args.codes)) or len(args.require) != len(set(args.require)):
        raise ValueError('duplicate requested code')
    if args.index_file and args.command != 'check':
        raise ValueError('index-file is only accepted by check')
    document = Document(read_file(args.file))
    if args.expect_sha256 and args.expect_sha256 != document.sha:
        raise ValueError('document revision changed; inspect and explicitly repin before continuing')
    if args.index_file and read_file(args.index_file).decode() != document.index():
        raise ValueError('derived index is stale; regenerate from the current source')
    info = dict(schema='sds-text-v1', file=str(args.file), sha256=document.sha, required=document.required,
                preamble_lines=document.preamble_end)
    if args.command == 'get':
        chosen = document.closure([*document.required, *args.require, *args.codes])
        info.update(selected=chosen, requested=args.codes)
        chunks = ['<!-- ' + json.dumps(info,ensure_ascii=False) + ' -->\n', document.preamble]
        for code in chosen:
            m=document.metadata(code);m['sha256']=hashlib.sha256(document.body(code).encode()).hexdigest()
            chunks += ['\n<!-- '+json.dumps(m,ensure_ascii=False)+' -->\n',document.body(code)]
        result = ''.join(chunks)
    elif args.command == 'list':
        info['sections'] = [document.metadata(c) for c in document.sections]
        result = json.dumps(info,ensure_ascii=False,indent=2)+'\n'
    elif args.command == 'index':
        result = document.index()
    else:
        info.update(valid=True,sections=len(document.sections))
        result = json.dumps(info)+'\n'
    if len(result.encode()) > args.max_bytes or len(result.splitlines()) > args.max_lines:
        raise ValueError('complete output exceeds byte/line budget; narrow the task or deliberately raise the limit')
    sys.stdout.write(result)
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError,UnicodeError,ValueError,RecursionError) as error:
        print('sds-text: '+str(error),file=sys.stderr)
        sys.exit(2)
