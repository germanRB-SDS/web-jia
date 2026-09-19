#!/bin/bash
# SDS Dev Governance — cross-agent skill availability bridge
#
# Makes the skills a project already trusts reachable from Claude Code, Codex and Gemini CLI
# without duplicating content and without mutating any existing installation.
#
# Usage:
#   ./sds-dev-governance/scripts/sync-agent-skills.sh [--apply] [--agents "claude codex gemini"]
#                                                     [--policy FILE] [--inventory FILE]
#
# Default mode is --check: it reports the exact actions it would take and changes nothing.
# Only --apply creates links. The script never deletes a skill, never overwrites a real
# directory, and never rewrites a link that already points at the intended target.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
POLICY="${SCRIPT_DIR}/../skills/cross-agent-portability.tsv"
APPLY='no'
AGENTS='claude codex gemini'
INVENTORY=''
CLAUDE_HOME="${CLAUDE_SKILLS_HOME:-$HOME/.claude/skills}"
CODEX_HOME="${CODEX_SKILLS_HOME:-$HOME/.codex/skills}"
GEMINI_HOME="${GEMINI_SKILLS_HOME:-$HOME/.gemini/skills}"
UNIVERSAL_HOME="${AGENTS_SKILLS_HOME:-$HOME/.agents/skills}"

while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY='yes'; shift ;;
    --check) APPLY='no'; shift ;;
    --agents) AGENTS="$2"; shift 2 ;;
    --policy) POLICY="$2"; shift 2 ;;
    --inventory) INVENTORY="$2"; shift 2 ;;
    -h|--help) sed -n '2,14p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "sync-agent-skills: unknown argument '$1'" >&2; exit 2 ;;
  esac
done

[ -f "$POLICY" ] || { echo "sync-agent-skills: policy not found: $POLICY" >&2; exit 2; }

planned=0
applied=0
skipped=0
conflicts=0
unclassified=0

echo "=== SDS Cross-Agent Skill Bridge ==="
echo "Mode:      $([ "$APPLY" = yes ] && echo APPLY || echo CHECK '(no changes)')"
echo "Agents:    $AGENTS"
echo "Policy:    $POLICY"
echo "Sources:   $CLAUDE_HOME, $UNIVERSAL_HOME"
echo ""

target_home_for() {
  case "$1" in
    claude) printf '%s' "$CLAUDE_HOME" ;;
    codex)  printf '%s' "$CODEX_HOME" ;;
    gemini) printf '%s' "$GEMINI_HOME" ;;
    *) return 1 ;;
  esac
}

# Resolve the real directory that holds a skill, preferring the universal store.
resolve_source() {
  local name="$1" candidate
  for candidate in "$UNIVERSAL_HOME/$name" "$CLAUDE_HOME/$name"; do
    if [ -f "$candidate/SKILL.md" ]; then
      ( cd "$candidate" && pwd -P )
      return 0
    fi
  done
  return 1
}

link_one() {
  local name="$1" source_dir="$2" agent="$3" home target current
  home="$(target_home_for "$agent")" || return 0
  target="$home/$name"

  if [ -L "$target" ]; then
    current="$(cd "$(dirname "$target")" && cd "$(readlink "$target")" 2>/dev/null && pwd -P || true)"
    if [ "$current" = "$source_dir" ]; then
      skipped=$((skipped + 1))
      return 0
    fi
    echo "  CONFLICT $agent/$name -> existing link points elsewhere ($(readlink "$target"))"
    conflicts=$((conflicts + 1))
    return 0
  fi

  if [ -e "$target" ]; then
    if [ "$(cd "$target" 2>/dev/null && pwd -P || true)" = "$source_dir" ]; then
      skipped=$((skipped + 1))
      return 0
    fi
    # An independent copy with identical content is equivalent, not a conflict.
    if [ -f "$target/SKILL.md" ] && [ -f "$source_dir/SKILL.md" ] \
      && [ "$(shasum -a 256 "$target/SKILL.md" | cut -d' ' -f1)" \
         = "$(shasum -a 256 "$source_dir/SKILL.md" | cut -d' ' -f1)" ]; then
      echo "  EQUIVAL  $agent/$name -> independent copy, identical SKILL.md; left untouched"
      skipped=$((skipped + 1))
      return 0
    fi
    echo "  CONFLICT $agent/$name -> a divergent real directory already exists; left untouched"
    conflicts=$((conflicts + 1))
    return 0
  fi

  planned=$((planned + 1))
  if [ "$APPLY" = 'yes' ]; then
    mkdir -p "$home"
    ln -s "$source_dir" "$target"
    echo "  LINKED   $agent/$name -> $source_dir"
    applied=$((applied + 1))
  else
    echo "  WOULD    $agent/$name -> $source_dir"
  fi
}

while IFS=$'\t' read -r name class reason; do
  case "$name" in ''|\#*) continue ;; esac
  [ -n "${class:-}" ] || continue

  case "$class" in
    CLAUDE_ONLY)
      continue
      ;;
    LINK)
      if ! source_dir="$(resolve_source "$name")"; then
        echo "  MISSING  $name -> not installed locally; nothing to bridge"
        continue
      fi
      for agent in $AGENTS; do
        [ "$agent" = 'claude' ] && [ -e "$CLAUDE_HOME/$name" ] && continue
        link_one "$name" "$source_dir" "$agent"
      done
      ;;
    PORT)
      # Curated rewrites are served from the project port, not from the Claude copy.
      continue
      ;;
    *)
      echo "  UNKNOWN  $name -> unrecognised class '$class'; skipped fail-closed"
      unclassified=$((unclassified + 1))
      ;;
  esac
done < "$POLICY"

# Any locally installed skill absent from the policy is reported, never propagated.
if [ -d "$CLAUDE_HOME" ]; then
  while IFS= read -r skill_dir; do
    name="$(basename "$skill_dir")"
    if ! grep -q "^${name}$(printf '\t')" "$POLICY"; then
      echo "  UNLISTED $name -> not in policy; fail-closed, not propagated"
      unclassified=$((unclassified + 1))
    fi
  done < <(find "$CLAUDE_HOME" -mindepth 1 -maxdepth 1 -type d -o -mindepth 1 -maxdepth 1 -type l | sort)
fi

echo ""
echo "=== Summary ==="
echo "planned:      $planned"
echo "applied:      $applied"
echo "already ok:   $skipped"
echo "conflicts:    $conflicts"
echo "unclassified: $unclassified"

if [ -n "$INVENTORY" ]; then
  {
    echo "# Generated by sds-dev-governance/scripts/sync-agent-skills.sh"
    echo "# $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    echo "# agent<TAB>skill<TAB>kind<TAB>sha256(SKILL.md)"
    for agent in $AGENTS; do
      home="$(target_home_for "$agent")" || continue
      [ -d "$home" ] || continue
      while IFS= read -r entry; do
        n="$(basename "$entry")"
        [ -f "$entry/SKILL.md" ] || continue
        kind='dir'; [ -L "$entry" ] && kind='link'
        printf '%s\t%s\t%s\t%s\n' "$agent" "$n" "$kind" \
          "$(shasum -a 256 "$entry/SKILL.md" | cut -d' ' -f1)"
      done < <(find "$home" -mindepth 1 -maxdepth 1 \( -type d -o -type l \) | sort)
    done
  } > "$INVENTORY"
  echo "inventory:    $INVENTORY"
fi

if [ "$conflicts" -gt 0 ]; then
  echo ""
  echo "Conflicts were reported and nothing was overwritten. Resolve them by hand."
  exit 1
fi
