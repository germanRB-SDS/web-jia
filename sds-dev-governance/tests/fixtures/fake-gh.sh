#!/usr/bin/env bash
set -euo pipefail

printf '%q ' "$@" >> "$SDS_FAKE_GH_LOG"
printf '\n' >> "$SDS_FAKE_GH_LOG"

if [ "${1:-}" = "--version" ]; then
  echo "gh version 2.94.0 (fake)"
  exit 0
fi

[ "${1:-}" = "api" ] || exit 1
endpoint="${2:-}"
method="GET"
previous=""
for argument in "$@"; do
  case "$previous:$argument" in
    --method:*) method="$argument" ;;
    *:--method=*) method="${argument#*=}" ;;
  esac
  previous="$argument"
done

case "$method:$endpoint" in
  GET:/user/repos*)
    if [ "${SDS_FAKE_GH_FAIL_INVENTORY:-0}" = "1" ]; then
      echo 'synthetic inventory failure' >&2
      exit 1
    fi
    printf 'public-repo\tfalse\tfalse\ttrue\n'
    printf 'private-repo\ttrue\tfalse\ttrue\n'
    ;;
  GET:/repos/test-owner/public-repo/rulesets)
    if [ -f "$SDS_FAKE_GH_STATE" ]; then
      printf '[{"id":42,"name":"SDS Guardrails - Manual Remote Deletion Only"}]\n'
    else
      printf '[]\n'
    fi
    ;;
  GET:/repos/test-owner/public-repo/rulesets/42)
    printf '{"id":42,"name":"SDS Guardrails - Manual Remote Deletion Only","target":"branch","enforcement":"active","bypass_actors":[],"conditions":{"ref_name":{"include":["~ALL"],"exclude":[]}},"rules":[{"type":"deletion"},{"type":"non_fast_forward"}]}\n'
    ;;
  GET:/repos/test-owner/public-repo/rulesets/99)
    printf '{"id":99,"name":"Foreign Ruleset"}\n'
    ;;
  POST:/repos/test-owner/public-repo/rulesets)
    : > "$SDS_FAKE_GH_STATE"
    printf '{"id":42}\n'
    ;;
  GET:/repos/test-owner/private-repo/rulesets)
    echo 'Upgrade to GitHub Pro or make this repository public to enable this feature.' >&2
    exit 1
    ;;
  *)
    echo "unexpected fake gh call: $method $endpoint" >&2
    exit 1
    ;;
esac
