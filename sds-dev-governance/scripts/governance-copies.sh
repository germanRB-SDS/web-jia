#!/bin/bash
# Read-only classifier. Python stdlib validates the entire request before emitting TSV rows.
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
exec python3 "$SCRIPT_DIR/governance_copies.py" "$@"
