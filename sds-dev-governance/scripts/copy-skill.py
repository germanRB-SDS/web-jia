"""Create a missing skill; preserve and reject any divergent existing installation."""
import os
from pathlib import Path
import stat
import sys
from bootstrap import exclusive_write
from governance_tree import inventory, snapshot

try:
    source, target = map(Path, sys.argv[1:])
    tree, contents = snapshot(source)
    if target.is_symlink() or any(v[0] != 'file' for v in tree.values()):
        raise ValueError('linked skill destination/source is not a writable copy target')
    if target.exists():
        if inventory(target) != tree:
            raise ValueError('existing skill differs; preserved for explicit reconciliation')
    else:
        target.mkdir(parents=True, exist_ok=False)
        fd = os.open(target, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
        try:
            for relative in tree:
                p = source / relative
                exclusive_write(fd, Path(relative), contents[relative], 0o755 if tree[relative][1] else 0o644)
        finally:
            os.close(fd)
except (OSError, ValueError) as e:
    print('ERROR: ' + str(e), file=sys.stderr)
    sys.exit(1)
