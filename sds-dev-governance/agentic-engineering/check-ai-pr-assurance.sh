#!/usr/bin/env bash
# SDS Dev Governance · agentic-engineering — AI-Code Assurance PR/MR check
# Rule: sds-dev-governance/agentic-engineering/ai-code-assurance.md
#
# Validates that a PR/MR body satisfies the AI-Generated Code Assurance contract:
#   - the machine marker '<!-- sds-ai-assurance:v1 -->' is present (right template),
#   - no unchecked assurance boxes remain inside the begin/end block,
#   - the accountable-owner sign-off is confirmed ('- [x] Confirmed'),
#   - (optional) the accountable owner matches an expected name.
#
# Usage:
#   check-ai-pr-assurance.sh <pr-body-file> [--owner "Name"]
#   gh pr view <n> --json body -q .body | check-ai-pr-assurance.sh - --owner "Owner Name"
#
# Exit codes: 0 = pass, 1 = assurance failed, 2 = usage/input error.
set -euo pipefail

OWNER_EXPECTED=""
BODY_FILE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --owner) OWNER_EXPECTED="${2:-}"; shift 2 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) BODY_FILE="$1"; shift ;;
  esac
done

if [ -z "$BODY_FILE" ] || [ "$BODY_FILE" = "-" ]; then
  BODY="$(cat)"
else
  [ -f "$BODY_FILE" ] || { echo "ERROR: body file not found: $BODY_FILE" >&2; exit 2; }
  BODY="$(cat "$BODY_FILE")"
fi

STATUS=0
fail() { echo "FAIL: $1" >&2; STATUS=1; }

# 1. machine marker present
printf '%s\n' "$BODY" | grep -qF '<!-- sds-ai-assurance:v1 -->' \
  || fail "missing machine marker '<!-- sds-ai-assurance:v1 -->' (wrong or absent template)"

# 2. no unchecked assurance boxes between begin/end
BLOCK="$(printf '%s\n' "$BODY" | awk '/<!-- sds-ai-assurance:begin -->/{f=1;next} /<!-- sds-ai-assurance:end -->/{f=0} f')"
if [ -z "$BLOCK" ]; then
  fail "assurance block delimiters not found ('sds-ai-assurance:begin/end')"
else
  UNCHECKED="$(printf '%s\n' "$BLOCK" | grep -cE '^[[:space:]]*- \[ \]' || true)"
  [ "$UNCHECKED" -eq 0 ] \
    || fail "$UNCHECKED unchecked assurance item(s) — check each or mark '- [x] ... N/A: <reason>'"
fi

# 3. owner sign-off confirmed
printf '%s\n' "$BODY" | grep -qE '^[[:space:]]*- \[x\][[:space:]]*Confirmed' \
  || fail "owner sign-off not confirmed ('- [x] Confirmed' missing under the footer)"

# 4. accountable owner present (and matches, if expected)
OWNER_VALUE="$(printf '%s\n' "$BODY" | grep -m1 -E '^Accountable owner:' | sed -E 's/^Accountable owner:[[:space:]]*//' || true)"
[ -n "$OWNER_VALUE" ] || fail "'Accountable owner:' line missing or empty"
if [ -n "$OWNER_EXPECTED" ] && [ "$OWNER_VALUE" != "$OWNER_EXPECTED" ]; then
  fail "accountable owner '$OWNER_VALUE' != expected '$OWNER_EXPECTED'"
fi

if [ "$STATUS" -eq 0 ]; then
  echo "PASS: AI-code assurance satisfied${OWNER_EXPECTED:+ (owner: $OWNER_EXPECTED)}"
fi
exit "$STATUS"
