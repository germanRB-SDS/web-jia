#!/usr/bin/env bash
set -euo pipefail
sds_script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
exec python3 "$sds_script_dir/governance_freshness.py" "$@"
