#!/bin/sh
# Read-only metadata for the exact failed guards; no executor or credential content.
set -eu
/usr/bin/id
printf 'NODE_LINK='
/usr/bin/readlink /opt/homebrew/bin/node
/usr/bin/shasum -a 256 /opt/homebrew/bin/node
for target in /private/tmp/sds-sentinel-client.gXPEva /private/tmp/sds-sentinel-client.gXPEva/codex /private/tmp/sds-sentinel-client.gXPEva/state; do
  if [ -e "$target" ] || [ -L "$target" ]; then
    /usr/bin/stat -f 'METADATA %N size=%z mode=%p uid=%u gid=%g' "$target"
  else
    printf 'ABSENT %s\n' "$target"
  fi
done
if [ -f /private/tmp/sds-sentinel-client.gXPEva/codex ] && [ ! -L /private/tmp/sds-sentinel-client.gXPEva/codex ]; then
  /usr/bin/shasum -a 256 /private/tmp/sds-sentinel-client.gXPEva/codex
fi
