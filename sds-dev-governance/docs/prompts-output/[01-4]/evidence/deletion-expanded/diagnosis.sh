#!/bin/sh
set -eu
repo=/Users/admin/MAC-DEV-PROJECTS/sds-dev-governance
/usr/bin/git -C "$repo" branch --show-current
/usr/bin/git -C "$repo" rev-parse HEAD
/usr/bin/git -C "$repo" status --porcelain
/usr/bin/git -C "$repo" log --all --max-count=15 --format='%H %s'
/bin/ls -ld "$repo/test-a" "$repo/test-b" /Users/Shared/sds-sentinel-expanded-Io8N0o /Users/Shared/sds-sentinel-expanded-Io8N0o/A.json /Users/Shared/sds-sentinel-expanded-Io8N0o/B.json /Users/Shared/sds-sentinel-expanded-Io8N0o/executions.bundle
