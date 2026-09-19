#!/bin/bash
# SDS bootstrap, Bash 3.2/5.3. The Python stdlib engine owns the bounded write plan.
# Usage: ./init.sh NAME TARGET [--mode project|hub] [--files-only] [--dry-run]
# Project defaults: SDS_INSTALL_SKILLS:-1 and SDS_INSTALL_PLUGINS:-1.
# --skip-skills includes bundled-only; --skip-plugins disables install-plugins.sh.
# --skip-graphify disables install-graphify.sh inside install-skills.sh.
# Source checks include skills/r8-analyzer.md; no automatic capability admission.
# Follow tmp/evidence continuity and the lazy practices/15-contract-authority.md router.
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
exec python3 "$SCRIPT_DIR/scripts/bootstrap.py" --shell "$BASH" "$@"
