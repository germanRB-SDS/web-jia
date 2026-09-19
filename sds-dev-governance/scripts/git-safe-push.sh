#!/usr/bin/env bash
# Explicit-ref push wrapper that rejects deletion, force and broad mirroring modes.

set -euo pipefail

GIT_BIN="${SDS_GIT_REAL_BIN:-}"
if [ -z "$GIT_BIN" ]; then
  GIT_BIN="$(command -v git || true)"
fi

deny() {
  echo "DENIED BY SDS GIT PUSH GUARDRAIL: $*" >&2
  exit 64
}

[ -n "$GIT_BIN" ] || deny "git executable not found"
[ -x "$GIT_BIN" ] || deny "git executable is not executable: $GIT_BIN"

local_remote=""
local_refspec=""
declare -a forwarded=()

while [ "$#" -gt 0 ]; do
  argument="$1"
  shift
  case "$argument" in
    --set-upstream|-u|--dry-run|--porcelain|--atomic)
      forwarded+=("$argument")
      ;;
    --force|--force=*|--force-with-lease|--force-with-lease=*|--force-if-includes|-f|--delete|-d|--mirror|--prune|--prune-tags|--all|--tags|--follow-tags|--no-verify)
      deny "option $argument can rewrite, delete, broaden or bypass refs"
      ;;
    --*)
      deny "unknown push option: $argument"
      ;;
    +*|:*|*:)
      deny "destructive refspec is forbidden: $argument"
      ;;
    *)
      if [ -z "$local_remote" ]; then
        local_remote="$argument"
      elif [ -z "$local_refspec" ]; then
        local_refspec="$argument"
      else
        deny "exactly one remote and one explicit refspec are required"
      fi
      forwarded+=("$argument")
      ;;
  esac
done

[ -n "$local_remote" ] || deny "explicit remote required"
[ -n "$local_refspec" ] || deny "explicit refspec required"

case "$local_refspec" in
  *:*)
    source_ref="${local_refspec%%:*}"
    destination_ref="${local_refspec#*:}"
    [ -n "$source_ref" ] || deny "refspec source must not be empty"
    [ -n "$destination_ref" ] || deny "refspec destination must not be empty"
    ;;
esac

exec "$GIT_BIN" push "${forwarded[@]}"
