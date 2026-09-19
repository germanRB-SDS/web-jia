#!/bin/bash
# Read-only view of the bounded SDS base-plugin runtime state.

set -euo pipefail

TARGET_DIR="${1:-.}"
STATE_FILE="${SDS_PLUGIN_STATE_FILE:-$TARGET_DIR/.sds/state/base-plugins.tsv}"

if [ ! -f "$STATE_FILE" ]; then
  echo "No SDS base-plugin state recorded at $STATE_FILE"
  echo "Run ./sds-dev-governance/scripts/install-plugins.sh . to reconcile the lazy catalog."
  exit 0
fi

echo "SDS base-plugin state: $STATE_FILE"
if command -v column >/dev/null 2>&1; then
  column -t -s '|' "$STATE_FILE"
else
  cat "$STATE_FILE"
fi
