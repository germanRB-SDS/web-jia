#!/usr/bin/env bash
# Install the versioned pre-push guardrail without replacing an existing custom hooks path.

set -euo pipefail

PROJECT_ROOT="${1:-.}"
EXPECTED_PATH="sds-dev-governance/hooks"
if [ -f "$PROJECT_ROOT/GOVERNANCE.md" ] && [ -f "$PROJECT_ROOT/hooks/pre-push" ]; then
  EXPECTED_PATH="hooks"
fi

git -C "$PROJECT_ROOT" rev-parse --git-dir >/dev/null
current_path="$(git -C "$PROJECT_ROOT" config --local --get core.hooksPath || true)"

if [ -n "$current_path" ] && [ "$current_path" != "$EXPECTED_PATH" ]; then
  echo "ERROR: core.hooksPath already points to '$current_path'; merge the SDS pre-push guard manually." >&2
  exit 1
fi

[ -x "$PROJECT_ROOT/$EXPECTED_PATH/pre-push" ] || {
  echo "ERROR: executable SDS pre-push hook missing at $PROJECT_ROOT/$EXPECTED_PATH/pre-push" >&2
  exit 1
}

git -C "$PROJECT_ROOT" config --local core.hooksPath "$EXPECTED_PATH"
installed_path="$(git -C "$PROJECT_ROOT" config --local --get core.hooksPath)"
[ "$installed_path" = "$EXPECTED_PATH" ] || {
  echo "ERROR: failed to verify core.hooksPath" >&2
  exit 1
}

echo "OK: core.hooksPath=$installed_path"
