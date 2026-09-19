#!/bin/bash
# Isolated tests for the lazy SDS base-plugin catalog and init integration.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GOVERNANCE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$GOVERNANCE_DIR/.." && pwd)"
TEST_ROOT="$(mktemp -d)"

cleanup() {
  rm -rf -- "$TEST_ROOT"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $1"
  exit 1
}

assert_contains() {
  local file="$1"
  local expected="$2"
  local label="$3"
  grep -Fq "$expected" "$file" || fail "$label"
  echo "OK: $label"
}

assert_count() {
  local expected="$1"
  local pattern="$2"
  local file="$3"
  local label="$4"
  local actual
  actual="$(grep -Fc "$pattern" "$file" || true)"
  [ "$actual" = "$expected" ] || fail "$label (expected $expected, got $actual)"
  echo "OK: $label"
}

FAKE_BIN="$TEST_ROOT/bin"
FAKE_RUNTIME="$TEST_ROOT/runtime"
FIXTURE_CATALOG="$TEST_ROOT/base-catalog.tsv"
STATE_FILE="$TEST_ROOT/project/.sds/state/base-plugins.tsv"
COMMAND_LOG="$TEST_ROOT/commands.log"
CODEX_CONFIG_FILE="$FAKE_RUNTIME/codex-config.toml"
mkdir -p "$FAKE_BIN" "$FAKE_RUNTIME" "$TEST_ROOT/project"
printf '%s\n' \
  '# capability|handler|scope|harnesses|source|desired_revision|features' \
  'figma|figma|user|claude,codex|https://mcp.figma.com/mcp|figma@claude-plugins-official|design,make' \
  > "$FIXTURE_CATALOG"

cat > "$FAKE_BIN/claude" <<'FAKE_CLAUDE'
#!/bin/bash
set -euo pipefail
printf 'claude %s\n' "$*" >> "$SDS_FAKE_COMMAND_LOG"
if [ "${1:-}" = "plugin" ] && [ "${2:-}" = "list" ]; then
  if [ -f "$SDS_FAKE_RUNTIME/claude-installed" ]; then
    printf '%s\n' '[{"id":"figma@claude-plugins-official","version":"fixture"}]'
  else
    printf '%s\n' '[]'
  fi
  exit 0
fi
if [ "${1:-}" = "plugin" ] && [ "${2:-}" = "install" ]; then
  [ "${SDS_FAKE_CLAUDE_INSTALL_FAIL:-0}" != "1" ] || exit 9
  touch "$SDS_FAKE_RUNTIME/claude-installed"
  exit 0
fi
exit 2
FAKE_CLAUDE

cat > "$FAKE_BIN/codex" <<'FAKE_CODEX'
#!/bin/bash
set -euo pipefail
printf 'codex %s\n' "$*" >> "$SDS_FAKE_COMMAND_LOG"
if [ "${1:-}" = "mcp" ] && [ "${2:-}" = "get" ] && [ "${3:-}" = "figma" ]; then
  [ -f "$SDS_CODEX_CONFIG_FILE" ] || exit 1
  awk '/^\[mcp_servers\.figma\]$/ { found = 1; next } found && /^url = / { print; exit }' "$SDS_CODEX_CONFIG_FILE"
  exit 0
fi
exit 2
FAKE_CODEX
chmod +x "$FAKE_BIN/claude" "$FAKE_BIN/codex"

run_fixture() {
  local now="$1"
  PATH="$FAKE_BIN:/usr/bin:/bin" \
    SDS_FAKE_RUNTIME="$FAKE_RUNTIME" \
    SDS_FAKE_COMMAND_LOG="$COMMAND_LOG" \
    SDS_PLUGINS_CATALOG="$FIXTURE_CATALOG" \
    SDS_PLUGIN_STATE_FILE="$STATE_FILE" \
    SDS_CODEX_CONFIG_FILE="$CODEX_CONFIG_FILE" \
    SDS_NOW_UTC="$now" \
    "$GOVERNANCE_DIR/scripts/install-plugins.sh" "$TEST_ROOT/project"
}

echo "=== First install ==="
run_fixture "2026-08-21T10:00:00Z" > "$TEST_ROOT/first.log"
assert_contains "$COMMAND_LOG" "claude plugin install --scope user --yes figma@claude-plugins-official" "Claude uses the official plugin reference"
assert_contains "$CODEX_CONFIG_FILE" 'url = "https://mcp.figma.com/mcp"' "Codex uses the official Figma endpoint"
assert_contains "$STATE_FILE" "figma|claude|auth-pending|figma@claude-plugins-official|2026-08-21T10:00:00Z|2026-08-21T10:00:00Z|2026-08-21T10:00:00Z" "Claude install state is timestamped"
assert_contains "$STATE_FILE" "figma|codex|auth-pending|https://mcp.figma.com/mcp|2026-08-21T10:00:00Z|2026-08-21T10:00:00Z|2026-08-21T10:00:00Z" "Codex install state is timestamped"
if grep -Eq "mcp (add|login)" "$COMMAND_LOG"; then
  fail "bootstrap attempted interactive Codex OAuth"
fi

echo "=== Idempotent verify ==="
run_fixture "2026-08-21T11:00:00Z" > "$TEST_ROOT/second.log"
assert_count 1 "claude plugin install" "$COMMAND_LOG" "Claude plugin installs only once"
assert_count 1 "[mcp_servers.figma]" "$CODEX_CONFIG_FILE" "Codex MCP registers only once"
assert_contains "$STATE_FILE" "figma|claude|auth-pending|figma@claude-plugins-official|2026-08-21T10:00:00Z|2026-08-21T10:00:00Z|2026-08-21T11:00:00Z" "Claude verify preserves change timestamps"
assert_contains "$STATE_FILE" "figma|codex|auth-pending|https://mcp.figma.com/mcp|2026-08-21T10:00:00Z|2026-08-21T10:00:00Z|2026-08-21T11:00:00Z" "Codex verify preserves change timestamps"
assert_count 1 "figma|claude|" "$STATE_FILE" "tracking has one Claude row"
assert_count 1 "figma|codex|" "$STATE_FILE" "tracking has one Codex row"

echo "=== Dry run ==="
DRY_STATE="$TEST_ROOT/dry/.sds/state/base-plugins.tsv"
PATH="$FAKE_BIN:/usr/bin:/bin" \
  SDS_PLUGINS_DRY_RUN=1 \
  SDS_PLUGINS_CATALOG="$FIXTURE_CATALOG" \
  SDS_PLUGIN_STATE_FILE="$DRY_STATE" \
  SDS_NOW_UTC="2026-08-21T12:00:00Z" \
  "$GOVERNANCE_DIR/scripts/install-plugins.sh" "$TEST_ROOT/dry" > "$TEST_ROOT/dry.log"
[ ! -e "$DRY_STATE" ] || fail "dry-run wrote plugin state"
assert_contains "$TEST_ROOT/dry.log" "Design + Make" "dry-run declares both Figma capabilities"

echo "=== Conflict is preserved ==="
printf '%s\n' '[mcp_servers.figma]' 'url = "https://example.invalid/mcp"' > "$CODEX_CONFIG_FILE"
if run_fixture "2026-08-21T13:00:00Z" > "$TEST_ROOT/conflict.log" 2>&1; then
  fail "conflicting Codex endpoint did not fail closed"
fi
assert_contains "$CODEX_CONFIG_FILE" "https://example.invalid/mcp" "conflicting Codex endpoint is preserved"
assert_contains "$STATE_FILE" "figma|codex|failed|https://mcp.figma.com/mcp|2026-08-21T10:00:00Z|2026-08-21T10:00:00Z|2026-08-21T13:00:00Z" "conflict updates check status only"

echo "=== CLI unavailable ==="
MISSING_STATE="$TEST_ROOT/missing/.sds/state/base-plugins.tsv"
if SDS_CLAUDE_BIN="$TEST_ROOT/no-claude" \
  SDS_CODEX_BIN="$TEST_ROOT/no-codex" \
  SDS_PLUGINS_CATALOG="$FIXTURE_CATALOG" \
  SDS_PLUGIN_STATE_FILE="$MISSING_STATE" \
  SDS_NOW_UTC="2026-08-21T14:00:00Z" \
  "$GOVERNANCE_DIR/scripts/install-plugins.sh" "$TEST_ROOT/missing" > "$TEST_ROOT/missing.log" 2>&1; then
  fail "missing CLIs did not produce a visible failure"
fi
assert_contains "$MISSING_STATE" "figma|claude|unavailable" "missing Claude CLI is tracked"
assert_contains "$MISSING_STATE" "figma|codex|unavailable" "missing Codex CLI is tracked"

echo "=== Init default and opt-out ==="
INIT_TARGET="$TEST_ROOT/init-default"
SDS_SKILLS_DRY_RUN=1 SDS_PLUGINS_DRY_RUN=1 SDS_INSTALL_GRAPHIFY=0 \
  "$GOVERNANCE_DIR/init.sh" "Plugin Bootstrap Test" "$INIT_TARGET" > "$TEST_ROOT/init.log"
assert_contains "$TEST_ROOT/init.log" "DRY-RUN: impeccable" "2026-08-20 skill baseline remains default"
assert_contains "$TEST_ROOT/init.log" "DRY-RUN: figma" "base plugins are default-on"

SKIP_TARGET="$TEST_ROOT/init-skip"
SDS_SKILLS_DRY_RUN=1 SDS_PLUGINS_DRY_RUN=1 SDS_INSTALL_GRAPHIFY=0 \
  "$GOVERNANCE_DIR/init.sh" "Plugin Bootstrap Skip" "$SKIP_TARGET" --skip-plugins > "$TEST_ROOT/skip.log"
assert_contains "$TEST_ROOT/skip.log" "SDS base-plugin catalog skipped" "init exposes explicit plugin opt-out"
if grep -Fq "DRY-RUN: figma" "$TEST_ROOT/skip.log"; then
  fail "--skip-plugins still ran the plugin catalog"
fi

echo "OK: plugin bootstrap tests passed"
