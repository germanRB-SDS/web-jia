"""Read-only tree identities, independent of Git metadata and filesystem traversal order."""
import hashlib
import os
from pathlib import Path
import stat

IGNORED = {'.git', '.DS_Store', '__pycache__'}


def safe_name(value):
    if any(ord(c) < 32 or ord(c) == 127 for c in value):
        raise ValueError('control characters are not supported in paths')
    value.encode('utf-8')
    return value


def snapshot(root):
    """Read each entry once through pinned, no-follow directory descriptors."""
    root = Path(root).resolve(strict=True)
    entries, contents = {}, {}
    def visit(fd, prefix):
        for name in sorted(os.listdir(fd), key=os.fsencode):
            if name in IGNORED:
                continue
            rel = safe_name(prefix + name)
            st = os.stat(name, dir_fd=fd, follow_symlinks=False)
            if stat.S_ISLNK(st.st_mode):
                data = os.fsencode(os.readlink(name, dir_fd=fd)); kind = 'link'
            elif stat.S_ISDIR(st.st_mode):
                child = os.open(name, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
                try:
                    visit(child, rel + '/')
                finally:
                    os.close(child)
                continue
            elif stat.S_ISREG(st.st_mode):
                item = os.open(name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=fd)
                with os.fdopen(item, 'rb') as stream:
                    actual = os.fstat(stream.fileno())
                    if not stat.S_ISREG(actual.st_mode) or (actual.st_dev, actual.st_ino) != (st.st_dev, st.st_ino):
                        raise ValueError('entry changed during read: ' + rel)
                    data = stream.read()
                    after = os.fstat(stream.fileno())
                    if (actual.st_size, actual.st_mtime_ns, actual.st_ctime_ns) != (after.st_size, after.st_mtime_ns, after.st_ctime_ns):
                        raise ValueError('file changed during read: ' + rel)
                kind = 'file'
            else:
                raise ValueError('unsupported special file: ' + rel)
            executable = bool(st.st_mode & 0o111) if kind == 'file' else False
            entries[rel] = (kind, executable, hashlib.sha256(data).hexdigest())
            contents[rel] = data
    fd = os.open(root, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    try:
        visit(fd, '')
    finally:
        os.close(fd)
    return entries, contents


def inventory(root):
    return snapshot(root)[0]


def fingerprint(entries):
    # v2: types, executable bit and link text are identity. Empty directories are not.
    h = hashlib.sha256(b'sds-tree-v2\0')
    for name, row in sorted(entries.items()):
        for field in (name, row[0], str(int(row[1])), row[2]):
            h.update(field.encode('utf-8') + b'\0')
    return h.hexdigest()
