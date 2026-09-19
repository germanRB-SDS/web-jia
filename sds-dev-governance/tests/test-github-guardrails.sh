#!/usr/bin/env bash
set -euo pipefail

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
KIT_DIR="$(cd "$TEST_DIR/.." && pwd -P)"
TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/sds-gh-guardrails.XXXXXX")"
trap 'rm -rf "$TMP_ROOT"' EXIT

export SDS_GH_REAL_BIN="$TEST_DIR/fixtures/fake-gh.sh"
export SDS_GIT_REAL_BIN="$TEST_DIR/fixtures/fake-git.sh"
export SDS_FAKE_GH_LOG="$TMP_ROOT/gh.log"
export SDS_FAKE_GH_STATE="$TMP_ROOT/ruleset-created"
export SDS_FAKE_GIT_LOG="$TMP_ROOT/git.log"
: > "$SDS_FAKE_GH_LOG"
: > "$SDS_FAKE_GIT_LOG"

expect_denied() {
  if "$@" >"$TMP_ROOT/out" 2>"$TMP_ROOT/err"; then
    echo "FAIL: command unexpectedly allowed: $*" >&2
    exit 1
  fi
  grep -Fq 'DENIED BY SDS' "$TMP_ROOT/err" || {
    echo "FAIL: denial marker missing: $*" >&2
    exit 1
  }
}

expect_denied "$KIT_DIR/scripts/gh-safe.sh" api /repos/o/r --method DELETE
expect_denied "$KIT_DIR/scripts/gh-safe.sh" api /graphql
expect_denied "$KIT_DIR/scripts/gh-safe.sh" auth status --show-token
expect_denied "$KIT_DIR/scripts/gh-safe.sh" repo-delete owner/repo
expect_denied env SDS_GH_GUARDRAIL_APPLY=1 "$KIT_DIR/scripts/gh-safe.sh" \
  guardrail-apply DELETE /repos/o/r/rulesets/1 "$KIT_DIR/github/ruleset-anti-deletion.json"
expect_denied env SDS_GH_GUARDRAIL_APPLY=1 "$KIT_DIR/scripts/gh-safe.sh" \
  guardrail-apply PUT /repos/test-owner/public-repo/rulesets/99 \
  "$KIT_DIR/github/ruleset-anti-deletion.json"

expect_denied "$KIT_DIR/scripts/git-safe-push.sh" --force origin main
expect_denied "$KIT_DIR/scripts/git-safe-push.sh" --delete origin old-branch
expect_denied "$KIT_DIR/scripts/git-safe-push.sh" origin :old-branch
expect_denied "$KIT_DIR/scripts/git-safe-push.sh" origin +main:main

"$KIT_DIR/scripts/git-safe-push.sh" --set-upstream origin feature:refs/heads/feature
grep -Fq 'push --set-upstream origin feature:refs/heads/feature' "$SDS_FAKE_GIT_LOG"

set +e
"$KIT_DIR/scripts/apply-github-guardrails.sh" --owner test-owner --all-owned --apply \
  >"$TMP_ROOT/apply-1.out" 2>"$TMP_ROOT/apply-1.err"
first_status=$?
"$KIT_DIR/scripts/apply-github-guardrails.sh" --owner test-owner --all-owned --apply \
  >"$TMP_ROOT/apply-2.out" 2>"$TMP_ROOT/apply-2.err"
second_status=$?
set -e

[ "$first_status" -eq 2 ] && [ "$second_status" -eq 2 ] || {
  echo "FAIL: plan-unsupported repositories must keep aggregate result non-green" >&2
  exit 1
}
grep -Fq $'test-owner/public-repo\tpublic\tPROTECTED\tcreated' "$TMP_ROOT/apply-1.out"
grep -Fq $'test-owner/public-repo\tpublic\tPROTECTED\tnone' "$TMP_ROOT/apply-2.out"
grep -Fq $'test-owner/private-repo\tprivate\tUNAVAILABLE_ON_PLAN\tnone' "$TMP_ROOT/apply-2.out"
[ "$(grep -c -- '--method POST' "$SDS_FAKE_GH_LOG")" -eq 1 ] || {
  echo "FAIL: idempotent rerun unexpectedly recreated the ruleset" >&2
  exit 1
}

set +e
SDS_FAKE_GH_FAIL_INVENTORY=1 "$KIT_DIR/scripts/apply-github-guardrails.sh" \
  --owner test-owner --all-owned >"$TMP_ROOT/inventory-fail.out" 2>"$TMP_ROOT/inventory-fail.err"
inventory_status=$?
set -e
[ "$inventory_status" -ne 0 ] || {
  echo "FAIL: inventory failure produced a green exit" >&2
  exit 1
}
grep -Fq 'owned repository inventory failed' "$TMP_ROOT/inventory-fail.err"
if grep -Fq 'ALL_TARGETS_PROTECTED' "$TMP_ROOT/inventory-fail.out"; then
  echo "FAIL: inventory failure produced a false all-protected result" >&2
  exit 1
fi

echo "PASS: GitHub deletion guardrails deny destructive modes and apply idempotently"
