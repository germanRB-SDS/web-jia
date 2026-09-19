#!/usr/bin/env bash
# Fail-closed GitHub CLI entrypoint for SDS-governed agent work.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
RULESET_FILE="$SCRIPT_DIR/../github/ruleset-anti-deletion.json"
GH_BIN="${SDS_GH_REAL_BIN:-}"

deny() {
  echo "DENIED BY SDS GITHUB GUARDRAIL: $*" >&2
  exit 64
}

if [ -z "$GH_BIN" ]; then
  GH_BIN="$(command -v gh || true)"
fi
[ -n "$GH_BIN" ] || deny "gh executable not found"
[ -x "$GH_BIN" ] || deny "gh executable is not executable: $GH_BIN"

validate_ruleset_payload() {
  local candidate="$1"
  local candidate_dir
  local candidate_abs
  local ruleset_dir
  local ruleset_abs

  [ -f "$candidate" ] || deny "guardrail payload missing"
  candidate_dir="$(cd "$(dirname "$candidate")" && pwd -P)"
  candidate_abs="$candidate_dir/$(basename "$candidate")"
  ruleset_dir="$(cd "$(dirname "$RULESET_FILE")" && pwd -P)"
  ruleset_abs="$ruleset_dir/$(basename "$RULESET_FILE")"
  [ "$candidate_abs" = "$ruleset_abs" ] || deny "only the canonical ruleset payload is allowed"

  command -v jq >/dev/null 2>&1 || deny "jq is required to validate the guardrail payload"
  jq -e '
    .name == "SDS Guardrails - Manual Remote Deletion Only" and
    .target == "branch" and
    .enforcement == "active" and
    (.bypass_actors == []) and
    (.conditions.ref_name.include == ["~ALL"]) and
    (.conditions.ref_name.exclude == []) and
    ((.rules | map(.type) | sort) == ["deletion", "non_fast_forward"])
  ' "$candidate" >/dev/null || deny "canonical ruleset payload failed invariants"
}

read_only_api() {
  [ "$#" -ge 1 ] || deny "usage: gh-safe.sh api /endpoint [read-only flags]"
  local endpoint="$1"
  shift
  local method="GET"
  local -a forwarded=("api" "$endpoint")

  [[ "$endpoint" == /* ]] || deny "REST endpoint must start with /"
  [ "$endpoint" != "/graphql" ] || deny "GraphQL is outside the admitted read-only mode"

  while [ "$#" -gt 0 ]; do
    case "$1" in
      --method|-X)
        [ "$#" -ge 2 ] || deny "$1 requires a value"
        method="$(printf '%s' "$2" | tr '[:lower:]' '[:upper:]')"
        forwarded+=("$1" "$2")
        shift 2
        ;;
      --method=*)
        method="${1#*=}"
        method="$(printf '%s' "$method" | tr '[:lower:]' '[:upper:]')"
        forwarded+=("$1")
        shift
        ;;
      -XGET|-XHEAD)
        method="${1#-X}"
        forwarded+=("$1")
        shift
        ;;
      --paginate|--slurp)
        forwarded+=("$1")
        shift
        ;;
      --jq)
        [ "$#" -ge 2 ] || deny "--jq requires an expression"
        forwarded+=("$1" "$2")
        shift 2
        ;;
      --jq=*)
        forwarded+=("$1")
        shift
        ;;
      -f|-F|--field|--raw-field|--input|--template|--include|-i|--verbose|--hostname|-H|--header|--cache)
        deny "flag $1 is outside the admitted secret-safe read-only mode"
        ;;
      *)
        deny "unknown gh api argument: $1"
        ;;
    esac
  done

  case "$method" in
    GET|HEAD) ;;
    *) deny "HTTP $method is not read-only" ;;
  esac

  exec "$GH_BIN" "${forwarded[@]}"
}

apply_guardrail() {
  [ "${SDS_GH_GUARDRAIL_APPLY:-0}" = "1" ] || deny "guardrail apply profile is not enabled"
  [ "$#" -eq 3 ] || deny "usage: gh-safe.sh guardrail-apply POST|PUT /repos/O/R/rulesets[/ID] payload"

  local method="$(printf '%s' "$1" | tr '[:lower:]' '[:upper:]')"
  local endpoint="$2"
  local payload="$3"
  local existing_name=""
  validate_ruleset_payload "$payload"

  case "$method" in
    POST)
      [[ "$endpoint" =~ ^/repos/[^/]+/[^/]+/rulesets$ ]] || deny "POST endpoint is not allowlisted"
      ;;
    PUT)
      [[ "$endpoint" =~ ^/repos/[^/]+/[^/]+/rulesets/[0-9]+$ ]] || deny "PUT endpoint is not allowlisted"
      existing_name="$("$GH_BIN" api "$endpoint" --method GET --jq '.name')" ||
        deny "cannot verify the existing ruleset before PUT"
      [ "$existing_name" = "SDS Guardrails - Manual Remote Deletion Only" ] ||
        deny "PUT may only replace the named SDS guardrail ruleset"
      ;;
    *)
      deny "only POST create and PUT replace are admitted for the canonical ruleset"
      ;;
  esac

  exec "$GH_BIN" api "$endpoint" --method "$method" --input "$payload"
}

[ "$#" -ge 1 ] || deny "explicit mode required"
mode="$1"
shift

case "$mode" in
  api)
    read_only_api "$@"
    ;;
  auth)
    [ "${1:-}" = "status" ] || deny "only gh auth status is admitted"
    shift
    for argument in "$@"; do
      case "$argument" in
        --active) ;;
        --show-token|-t) deny "token display is forbidden" ;;
        *) deny "unknown gh auth status argument: $argument" ;;
      esac
    done
    exec "$GH_BIN" auth status "$@"
    ;;
  version|--version)
    [ "$#" -eq 0 ] || deny "version mode accepts no arguments"
    exec "$GH_BIN" --version
    ;;
  guardrail-apply)
    apply_guardrail "$@"
    ;;
  repo-delete|release-delete|run-delete|cache-delete|secret-delete|variable-delete|workflow-disable|ruleset-delete|api-delete|graphql)
    deny "destructive GitHub mode is permanently non-delegable"
    ;;
  *)
    deny "gh mode '$mode' is not admitted; evaluate an exact non-destructive mode first"
    ;;
esac
