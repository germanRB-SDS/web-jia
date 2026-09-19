#!/bin/bash
# Isolated tests for the distributed-copy classifier in scripts/governance-copies.sh.
#
# The contract under test lives in practices/modules/11-governance-distribution.md: one version
# number may be claimed by exactly one tree, and the canonical baseline is itself a claimant. A
# split must be visible in the exit code, not only in a row of the table, or a caller that gates on
# the exit status accepts a divergent tree as the same release.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GOVERNANCE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLASSIFIER="$GOVERNANCE_DIR/scripts/governance-copies.sh"
TEST_ROOT="$(mktemp -d)"

cleanup() {
  rm -rf -- "$TEST_ROOT"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $1"
  exit 1
}

# A governance copy needs only the leaves the classifier requires; a full tree would make the test
# depend on unrelated content.
make_copy() {
  local dir="$1"
  local version="$2"
  mkdir -p "$dir/practices" "$dir/skills"
  printf 'Version: `%s`\n' "$version" > "$dir/VERSION.md"
  printf '# Governance\n' > "$dir/GOVERNANCE.md"
  printf '# Practices\n' > "$dir/practices/INDEX.md"
  printf '# Skills\n' > "$dir/skills/README.md"
  printf '#!/bin/bash\n' > "$dir/check-governance.sh"
}

run_classifier() {
  local status=0
  "$CLASSIFIER" --baseline "$BASELINE" "$@" > "$TEST_ROOT/out.txt" 2>&1 || status=$?
  echo "$status"
}

assert_state() {
  local expected_state="$1"
  local expected_exit="$2"
  local actual_exit="$3"
  local label="$4"
  grep -Fq "$expected_state" "$TEST_ROOT/out.txt" \
    || { cat "$TEST_ROOT/out.txt"; fail "$label — expected state $expected_state"; }
  [ "$actual_exit" = "$expected_exit" ] \
    || { cat "$TEST_ROOT/out.txt"; fail "$label — expected exit $expected_exit, got $actual_exit"; }
  echo "OK: $label"
}

BASELINE="$TEST_ROOT/canonical/sds-dev-governance"
make_copy "$BASELINE" "v9.9.0"

echo "=== A copy identical to canonical is a match, not a split ==="
MATCH="$TEST_ROOT/match/sds-dev-governance"
make_copy "$MATCH" "v9.9.0"
assert_state "CANONICAL_MATCH" 0 "$(run_classifier --path "$MATCH")" \
  "an identical distributed copy classifies as CANONICAL_MATCH and exits clean"

echo "=== A copy reusing the canonical version with a different tree is a split ==="
SPLIT="$TEST_ROOT/split/sds-dev-governance"
make_copy "$SPLIT" "v9.9.0"
printf 'divergent leaf\n' >> "$SPLIT/GOVERNANCE.md"
assert_state "SPLIT_VERSION" 1 "$(run_classifier --path "$SPLIT")" \
  "one version number claimed by canonical and a different tree fails the gate"

echo "=== Two copies sharing a version older than canonical are still a split ==="
OLD_A="$TEST_ROOT/old-a/sds-dev-governance"
OLD_B="$TEST_ROOT/old-b/sds-dev-governance"
make_copy "$OLD_A" "v9.1.0"
make_copy "$OLD_B" "v9.1.0"
printf 'divergent leaf\n' >> "$OLD_B/GOVERNANCE.md"
assert_state "SPLIT_VERSION" 1 "$(run_classifier --path "$OLD_A" --path "$OLD_B")" \
  "two trees claiming one older version fail the gate"

echo "=== A copy simply behind canonical is not a split ==="
BEHIND="$TEST_ROOT/behind/sds-dev-governance"
make_copy "$BEHIND" "v9.1.0"
assert_state "PROJECT_BEHIND_CANONICAL" 0 "$(run_classifier --path "$BEHIND")" \
  "an older copy without provenance requires baseline inspection, not a split"

grep -Fq "INSPECT_BASELINE" "$TEST_ROOT/out.txt" || fail "old copy was not held for baseline inspection"

echo "=== Tree identity ignores the .git pointer file ==="
# In a worktree or a submodule `.git` is a file, not a directory. If it enters the hash, the
# fingerprint stops being a function of the governed content and CANONICAL_MATCH becomes
# unreachable for every vendored copy.
POINTER="$TEST_ROOT/pointer/sds-dev-governance"
make_copy "$POINTER" "v9.9.0"
printf 'gitdir: /somewhere/else/.git/worktrees/x\n' > "$POINTER/.git"
assert_state "CANONICAL_MATCH" 0 "$(run_classifier --path "$POINTER")" \
  "a .git pointer file does not change tree identity"

echo "OK: governance copy classifier tests passed"
