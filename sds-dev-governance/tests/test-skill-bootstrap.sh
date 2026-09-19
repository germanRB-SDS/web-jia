#!/bin/bash
# SDS Dev Governance — isolated skill-catalog and init bootstrap tests

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

echo "=== Skill catalog dry run ==="
DRY_OUTPUT="$TEST_ROOT/catalog-dry-run.log"
SDS_SKILLS_DRY_RUN=1 SDS_PLUGINS_DRY_RUN=1 SDS_INSTALL_GRAPHIFY=0 \
  "$GOVERNANCE_DIR/scripts/install-skills.sh" "$PROJECT_ROOT" > "$DRY_OUTPUT"

assert_contains "$DRY_OUTPUT" "DRY-RUN: impeccable" "catalog includes Impeccable"
assert_contains "$DRY_OUTPUT" "DRY-RUN: gstack" "catalog includes gstack"
assert_contains "$DRY_OUTPUT" "DRY-RUN: skillui" "catalog includes skillui"
assert_contains "$DRY_OUTPUT" "DRY-RUN: threejs" "catalog includes Three.js"
assert_contains "$DRY_OUTPUT" "Graphify skipped" "Graphify has an independent opt-out"

echo "=== Isolated Three.js sharing ==="
FIXTURE_SOURCE="$TEST_ROOT/threejs-source"
FIXTURE_CLAUDE="$TEST_ROOT/claude-skills"
FIXTURE_CODEX="$TEST_ROOT/codex-skills"
FIXTURE_GEMINI="$TEST_ROOT/gemini-skills"
FIXTURE_CATALOG="$TEST_ROOT/threejs-catalog.tsv"
mkdir -p "$FIXTURE_SOURCE" "$FIXTURE_CLAUDE" "$FIXTURE_CODEX" "$FIXTURE_GEMINI"
printf '# capability|handler|scope|compatible-harnesses|doc\nthreejs|threejs|user|claude,codex|threejs.md\n' > "$FIXTURE_CATALOG"

for skill_name in threejs-alpha threejs-beta threejs-gamma; do
  mkdir -p "$FIXTURE_SOURCE/$skill_name"
  printf '# %s\n' "$skill_name" > "$FIXTURE_SOURCE/$skill_name/SKILL.md"
done

run_threejs_fixture() {
  SDS_SKILLS_CATALOG="$FIXTURE_CATALOG" \
    SDS_THREEJS_SOURCE_DIR="$FIXTURE_SOURCE" \
    SDS_THREEJS_EXPECTED_COUNT=3 \
    SDS_INSTALL_GRAPHIFY=0 \
    CLAUDE_SKILLS_HOME="$FIXTURE_CLAUDE" \
    CODEX_SKILLS_HOME="$FIXTURE_CODEX" \
    GEMINI_SKILLS_HOME="$FIXTURE_GEMINI" \
    SDS_SKILLS_BRIDGE=0 \
    "$GOVERNANCE_DIR/scripts/install-skills.sh" "$PROJECT_ROOT"
}

run_threejs_fixture > "$TEST_ROOT/threejs-first.log"
run_threejs_fixture > "$TEST_ROOT/threejs-second.log"

for skill_name in threejs-alpha threejs-beta threejs-gamma; do
  [ -f "$FIXTURE_CLAUDE/$skill_name/SKILL.md" ] || fail "$skill_name was not materialized for Claude"
  [ -L "$FIXTURE_CODEX/$skill_name" ] || fail "$skill_name was not shared with Codex"
  [ "$(readlink "$FIXTURE_CODEX/$skill_name")" = "$FIXTURE_CLAUDE/$skill_name" ] || fail "$skill_name Codex link has the wrong source"
done
assert_contains "$FIXTURE_CLAUDE/THREEJS-SKILLS-PROVENANCE.md" "Skills: 3" "Three.js provenance records the verified package"
assert_contains "$TEST_ROOT/threejs-second.log" "already shared" "Three.js install is idempotent"

echo "=== Isolated bundled-only mode ==="
BUNDLED_CATALOG="$TEST_ROOT/bundled-catalog.tsv"
BUNDLED_CLAUDE="$TEST_ROOT/bundled-claude"
BUNDLED_CODEX="$TEST_ROOT/bundled-codex"
BUNDLED_GEMINI="$TEST_ROOT/bundled-gemini"
mkdir -p "$BUNDLED_CLAUDE" "$BUNDLED_CODEX" "$BUNDLED_GEMINI"
printf '# capability|handler|scope|compatible-harnesses|doc\nimpeccable|impeccable|project|claude|impeccable.md\nsds-r8-analyzer|sds-r8-analyzer|bundled|claude,codex|r8-analyzer.md\n' > "$BUNDLED_CATALOG"
BUNDLED_LOG="$TEST_ROOT/bundled-only.log"
SDS_SKILLS_CATALOG="$BUNDLED_CATALOG" \
  CLAUDE_SKILLS_HOME="$BUNDLED_CLAUDE" \
  CODEX_SKILLS_HOME="$BUNDLED_CODEX" \
  GEMINI_SKILLS_HOME="$BUNDLED_GEMINI" \
  SDS_SKILLS_BRIDGE=0 \
  "$GOVERNANCE_DIR/scripts/install-skills.sh" "$PROJECT_ROOT" --bundled-only > "$BUNDLED_LOG"
[ -f "$BUNDLED_CLAUDE/sds-r8-analyzer/SKILL.md" ] || fail "bundled-only did not install the bundled skill for Claude"
[ -f "$BUNDLED_CODEX/sds-r8-analyzer/SKILL.md" ] || fail "bundled-only did not install the bundled skill for Codex"
if grep -Fq "impeccable" "$BUNDLED_LOG"; then
  fail "bundled-only ran a non-bundled catalog row"
fi
echo "OK: --bundled-only installs only rows with bundled scope"

INVALID_CATALOG="$TEST_ROOT/invalid-catalog.tsv"
printf '# capability|handler|scope|compatible-harnesses|doc\nghost|graphify|user|claude|does-not-exist.md\n' > "$INVALID_CATALOG"
if SDS_SKILLS_CATALOG="$INVALID_CATALOG" SDS_SKILLS_DRY_RUN=1 SDS_SKILLS_BRIDGE=0 \
  "$GOVERNANCE_DIR/scripts/install-skills.sh" "$PROJECT_ROOT" > "$TEST_ROOT/invalid-catalog.log" 2>&1; then
  fail "a catalog row naming a missing document was accepted"
fi
assert_contains "$TEST_ROOT/invalid-catalog.log" "missing skill document" "catalog rows must name an existing skill document"

echo "=== Isolated init defaults ==="
INIT_TARGET="$TEST_ROOT/default-init"
INIT_OUTPUT="$TEST_ROOT/default-init.log"
SDS_SKILLS_DRY_RUN=1 SDS_PLUGINS_DRY_RUN=1 SDS_INSTALL_GRAPHIFY=0 \
  "$GOVERNANCE_DIR/init.sh" "Skill Bootstrap Test" "$INIT_TARGET" > "$INIT_OUTPUT"

assert_contains "$INIT_OUTPUT" "DRY-RUN: impeccable" "init installs the catalog by default"
[ -f "$INIT_TARGET/sds-dev-governance/skills/install-catalog.tsv" ] || fail "init did not copy the catalog"

SKIP_TARGET="$TEST_ROOT/skip-init"
SKIP_OUTPUT="$TEST_ROOT/skip-init.log"
SDS_SKILLS_DRY_RUN=1 SDS_PLUGINS_DRY_RUN=1 \
  "$GOVERNANCE_DIR/init.sh" "Skill Bootstrap Skip Test" "$SKIP_TARGET" --skip-skills > "$SKIP_OUTPUT"
assert_contains "$SKIP_OUTPUT" "SDS skill catalog skipped" "init exposes an explicit catalog opt-out"
if grep -Fq "DRY-RUN: impeccable" "$SKIP_OUTPUT"; then
  fail "--skip-skills still ran the catalog"
fi
echo "OK: --skip-skills performs no catalog install"

echo "OK: skill bootstrap tests passed"
