#!/usr/bin/env bash
# Audit or idempotently apply the canonical branch ruleset to owned GitHub repositories.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
GH_SAFE="$SCRIPT_DIR/gh-safe.sh"
RULESET_FILE="$SCRIPT_DIR/../github/ruleset-anti-deletion.json"
RULESET_NAME="SDS Guardrails - Manual Remote Deletion Only"
OWNER=""
APPLY="0"
ALL_OWNED="0"
declare -a REPOSITORIES=()

usage() {
  echo "Usage: $0 --owner LOGIN (--all-owned | --repo NAME [...]) [--apply]" >&2
  exit 64
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --owner)
      [ "$#" -ge 2 ] || usage
      OWNER="$2"
      shift 2
      ;;
    --all-owned)
      ALL_OWNED="1"
      shift
      ;;
    --repo)
      [ "$#" -ge 2 ] || usage
      [[ "$2" =~ ^[A-Za-z0-9._-]+$ ]] || {
        echo "ERROR: invalid GitHub repository name" >&2
        exit 64
      }
      REPOSITORIES+=("$2")
      shift 2
      ;;
    --apply)
      APPLY="1"
      shift
      ;;
    *)
      usage
      ;;
  esac
done

[ -n "$OWNER" ] || usage
[[ "$OWNER" =~ ^[A-Za-z0-9][A-Za-z0-9-]{0,38}$ ]] || {
  echo "ERROR: invalid GitHub owner login" >&2
  exit 64
}
if [ "$ALL_OWNED" = "1" ] && [ "${#REPOSITORIES[@]}" -gt 0 ]; then
  usage
fi
if [ "$ALL_OWNED" = "0" ] && [ "${#REPOSITORIES[@]}" -eq 0 ]; then
  usage
fi

command -v jq >/dev/null 2>&1 || {
  echo "ERROR: jq is required" >&2
  exit 1
}

if [ "$ALL_OWNED" = "1" ]; then
  if ! inventory="$(
    "$GH_SAFE" api "/user/repos?affiliation=owner&per_page=100" --paginate \
      --jq ".[] | select(.owner.login == \"$OWNER\") | [.name, (.private|tostring), (.archived|tostring), (.permissions.admin|tostring)] | @tsv"
  )"; then
    echo "ERROR: owned repository inventory failed" >&2
    exit 1
  fi
  while IFS=$'\t' read -r repo_name repo_private repo_archived repo_admin; do
    [ -n "$repo_name" ] || continue
    REPOSITORIES+=("$repo_name|$repo_private|$repo_archived|$repo_admin")
  done <<< "$inventory"
else
  for index in "${!REPOSITORIES[@]}"; do
    repo_name="${REPOSITORIES[$index]}"
    metadata="$("$GH_SAFE" api "/repos/$OWNER/$repo_name" --jq '[.name, (.private|tostring), (.archived|tostring), (.permissions.admin|tostring)] | @tsv')"
    REPOSITORIES[$index]="${metadata//$'\t'/|}"
  done
fi

[ "${#REPOSITORIES[@]}" -gt 0 ] || {
  echo "ERROR: no owned repository targets discovered" >&2
  exit 1
}

printf 'repository\tvisibility\tstatus\taction\n'
failures=0

for entry in "${REPOSITORIES[@]}"; do
  IFS='|' read -r repo_name repo_private repo_archived repo_admin <<< "$entry"
  [[ "$repo_name" =~ ^[A-Za-z0-9._-]+$ ]] || {
    printf '%s/%s\tunknown\tINVALID_REPOSITORY_NAME\tnone\n' "$OWNER" "$repo_name"
    failures=$((failures + 1))
    continue
  }
  visibility="public"
  [ "$repo_private" = "true" ] && visibility="private"

  if [ "$repo_admin" != "true" ]; then
    printf '%s/%s\t%s\tNO_ADMIN\tnone\n' "$OWNER" "$repo_name" "$visibility"
    failures=$((failures + 1))
    continue
  fi
  if [ "$repo_archived" = "true" ]; then
    printf '%s/%s\t%s\tARCHIVED_MANUAL_ONLY\tnone\n' "$OWNER" "$repo_name" "$visibility"
    failures=$((failures + 1))
    continue
  fi

  if ! rulesets="$("$GH_SAFE" api "/repos/$OWNER/$repo_name/rulesets" 2>&1)"; then
    if grep -Fq 'Upgrade to GitHub Pro or make this repository public' <<< "$rulesets"; then
      printf '%s/%s\t%s\tUNAVAILABLE_ON_PLAN\tnone\n' "$OWNER" "$repo_name" "$visibility"
    else
      printf '%s/%s\t%s\tREAD_FAILED\tnone\n' "$OWNER" "$repo_name" "$visibility"
      sed 's/^/  /' <<< "$rulesets" >&2
    fi
    failures=$((failures + 1))
    continue
  fi

  ruleset_id="$(jq -r --arg name "$RULESET_NAME" 'first(.[] | select(.name == $name) | .id) // empty' <<< "$rulesets")"
  state="MISSING"
  if [ -n "$ruleset_id" ]; then
    details="$("$GH_SAFE" api "/repos/$OWNER/$repo_name/rulesets/$ruleset_id")"
    if jq -e --arg name "$RULESET_NAME" '
      .name == $name and .target == "branch" and .enforcement == "active" and
      ((.bypass_actors // []) == []) and
      (.conditions.ref_name.include == ["~ALL"]) and
      (.conditions.ref_name.exclude == []) and
      ((.rules | map(.type) | sort) == ["deletion", "non_fast_forward"])
    ' <<< "$details" >/dev/null; then
      state="PROTECTED"
    else
      state="DRIFT"
    fi
  fi

  action="none"
  if [ "$APPLY" = "1" ] && [ "$state" != "PROTECTED" ]; then
    if [ "$state" = "MISSING" ]; then
      SDS_GH_GUARDRAIL_APPLY=1 "$GH_SAFE" guardrail-apply POST \
        "/repos/$OWNER/$repo_name/rulesets" "$RULESET_FILE" >/dev/null
      action="created"
    else
      SDS_GH_GUARDRAIL_APPLY=1 "$GH_SAFE" guardrail-apply PUT \
        "/repos/$OWNER/$repo_name/rulesets/$ruleset_id" "$RULESET_FILE" >/dev/null
      action="updated"
    fi

    refreshed="$("$GH_SAFE" api "/repos/$OWNER/$repo_name/rulesets")"
    ruleset_id="$(jq -r --arg name "$RULESET_NAME" 'first(.[] | select(.name == $name) | .id) // empty' <<< "$refreshed")"
    [ -n "$ruleset_id" ] || {
      printf '%s/%s\t%s\tVERIFY_FAILED\t%s\n' "$OWNER" "$repo_name" "$visibility" "$action"
      failures=$((failures + 1))
      continue
    }
    details="$("$GH_SAFE" api "/repos/$OWNER/$repo_name/rulesets/$ruleset_id")"
    if jq -e --arg name "$RULESET_NAME" '
      .name == $name and .target == "branch" and .enforcement == "active" and
      ((.bypass_actors // []) == []) and
      (.conditions.ref_name.include == ["~ALL"]) and
      (.conditions.ref_name.exclude == []) and
      ((.rules | map(.type) | sort) == ["deletion", "non_fast_forward"])
    ' <<< "$details" >/dev/null; then
      state="PROTECTED"
    else
      state="VERIFY_FAILED"
    fi
  fi

  if [ "$state" != "PROTECTED" ]; then
    failures=$((failures + 1))
  fi
  printf '%s/%s\t%s\t%s\t%s\n' "$OWNER" "$repo_name" "$visibility" "$state" "$action"
done

if [ "$failures" -gt 0 ]; then
  echo "RESULT: PARTIAL_OR_BLOCKED ($failures repository findings)" >&2
  exit 2
fi

echo "RESULT: ALL_TARGETS_PROTECTED"
