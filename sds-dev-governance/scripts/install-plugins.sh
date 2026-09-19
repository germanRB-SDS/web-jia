#!/bin/bash
# SDS Dev Governance — install/check the lazy base-plugin catalog.
# Usage: ./sds-dev-governance/scripts/install-plugins.sh [project-root]

set -uo pipefail

TARGET_DIR="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CATALOG_FILE="${SDS_PLUGINS_CATALOG:-$SCRIPT_DIR/../plugins/base-catalog.tsv}"
STATE_FILE="${SDS_PLUGIN_STATE_FILE:-$TARGET_DIR/.sds/state/base-plugins.tsv}"
DRY_RUN="${SDS_PLUGINS_DRY_RUN:-0}"
NOW_UTC="${SDS_NOW_UTC:-$(date -u '+%Y-%m-%dT%H:%M:%SZ')}"
CLAUDE_BIN="${SDS_CLAUDE_BIN:-claude}"
CODEX_BIN="${SDS_CODEX_BIN:-codex}"
CODEX_CONFIG_DIR="${CODEX_HOME:-}"
if [ -z "$CODEX_CONFIG_DIR" ] && [ -n "${HOME:-}" ]; then
  CODEX_CONFIG_DIR="$HOME/.codex"
fi
CODEX_CONFIG_FILE="${SDS_CODEX_CONFIG_FILE:-${CODEX_CONFIG_DIR:+$CODEX_CONFIG_DIR/config.toml}}"
FAILURE_COUNT=0

warn_failure() {
  echo "WARN: $1"
  FAILURE_COUNT=$((FAILURE_COUNT + 1))
}

sanitize_field() {
  printf '%s' "$1" | tr '\t\r\n|' '     ' | cut -c1-160
}

valid_timestamp() {
  case "$1" in
    ????-??-??T??:??:??Z) return 0 ;;
    *) return 1 ;;
  esac
}

if ! valid_timestamp "$NOW_UTC"; then
  echo "ERROR: SDS_NOW_UTC must use UTC ISO-8601 seconds: YYYY-MM-DDTHH:MM:SSZ"
  exit 1
fi

record_state() {
  local capability="$1"
  local harness="$2"
  local status="$3"
  local revision="$4"
  local changed="$5"
  local detail="$6"

  [ "$DRY_RUN" = "1" ] && return

  local state_dir
  local temporary
  local previous=""
  local installed_at="-"
  local changed_at="-"
  state_dir="$(dirname "$STATE_FILE")"
  mkdir -p "$state_dir"
  if [ -f "$STATE_FILE" ]; then
    previous="$(awk -F'|' -v capability="$capability" -v harness="$harness" '
      $1 == capability && $2 == harness { print; exit }
    ' "$STATE_FILE")"
  fi
  if [ -n "$previous" ]; then
    installed_at="$(printf '%s\n' "$previous" | awk -F'|' '{print $5}')"
    changed_at="$(printf '%s\n' "$previous" | awk -F'|' '{print $6}')"
  fi
  if [ "$changed" = "1" ]; then
    [ "$installed_at" != "-" ] || installed_at="$NOW_UTC"
    changed_at="$NOW_UTC"
  fi

  temporary="$(mktemp "$state_dir/base-plugins.XXXXXX")"
  if [ -f "$STATE_FILE" ]; then
    awk -F'|' -v capability="$capability" -v harness="$harness" '
      NR == 1 { print; next }
      !($1 == capability && $2 == harness) { print }
    ' "$STATE_FILE" > "$temporary"
  else
    printf '%s\n' '# capability|harness|status|observed_revision|installed_at|last_changed_at|last_checked_at|detail' > "$temporary"
  fi
  printf '%s|%s|%s|%s|%s|%s|%s|%s\n' \
    "$(sanitize_field "$capability")" \
    "$(sanitize_field "$harness")" \
    "$(sanitize_field "$status")" \
    "$(sanitize_field "$revision")" \
    "$installed_at" \
    "$changed_at" \
    "$NOW_UTC" \
    "$(sanitize_field "$detail")" >> "$temporary"
  mv "$temporary" "$STATE_FILE"
}

command_available() {
  command -v "$1" >/dev/null 2>&1
}

claude_figma_present() {
  "$CLAUDE_BIN" plugin list --json 2>/dev/null | grep -Fq 'figma@claude-plugins-official'
}

codex_figma_output() {
  "$CODEX_BIN" mcp get figma 2>/dev/null
}

codex_figma_config_url() {
  [ -f "$CODEX_CONFIG_FILE" ] || return 1
  awk '
    /^\[mcp_servers\.figma\]$/ { in_figma = 1; next }
    /^\[/ { in_figma = 0 }
    in_figma && /^url[[:space:]]*=/ {
      value = $0
      sub(/^[^=]*=[[:space:]]*/, "", value)
      gsub(/^"|"$/, "", value)
      print value
      exit
    }
  ' "$CODEX_CONFIG_FILE"
}

register_codex_figma_without_oauth() {
  local endpoint="$1"
  local existing_url=""
  [ -n "$CODEX_CONFIG_FILE" ] || return 1
  existing_url="$(codex_figma_config_url || true)"
  if [ -n "$existing_url" ]; then
    [ "$existing_url" = "$endpoint" ]
    return
  fi

  mkdir -p "$(dirname "$CODEX_CONFIG_FILE")"
  if [ ! -e "$CODEX_CONFIG_FILE" ]; then
    touch "$CODEX_CONFIG_FILE"
    chmod 600 "$CODEX_CONFIG_FILE"
  fi
  printf '\n[mcp_servers.figma]\nurl = "%s"\n' "$endpoint" >> "$CODEX_CONFIG_FILE"
}

install_figma_for_claude() {
  local plugin_reference="$1"
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: figma -> Claude user plugin $plugin_reference (Design + Make; OAuth deferred)"
    return
  fi
  if ! command_available "$CLAUDE_BIN"; then
    record_state figma claude unavailable "$plugin_reference" 0 "Claude CLI unavailable"
    warn_failure "Claude CLI not found; cannot install $plugin_reference"
    return
  fi

  local changed=0
  if claude_figma_present; then
    echo "  OK: Claude Figma plugin already present"
  else
    echo "Installing Figma plugin for Claude Code..."
    if ! "$CLAUDE_BIN" plugin install --scope user --yes "$plugin_reference"; then
      record_state figma claude failed "$plugin_reference" 0 "Claude plugin install failed"
      warn_failure "Claude Figma plugin installation failed"
      return
    fi
    changed=1
    if ! claude_figma_present; then
      record_state figma claude failed "$plugin_reference" "$changed" "Claude install not observable"
      warn_failure "Claude Figma plugin was not observable after installation"
      return
    fi
  fi

  if [ "${SDS_FIGMA_AUTH_CONFIRMED_CLAUDE:-0}" = "1" ]; then
    record_state figma claude present "$plugin_reference" "$changed" "Design+Make; auth confirmed externally"
  else
    record_state figma claude auth-pending "$plugin_reference" "$changed" "Design+Make installed; authorize in Claude /plugin"
  fi
}

install_figma_for_codex() {
  local endpoint="$1"
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: figma -> Codex remote MCP $endpoint (Design + Make; OAuth deferred)"
    return
  fi
  if ! command_available "$CODEX_BIN"; then
    record_state figma codex unavailable "$endpoint" 0 "Codex CLI unavailable"
    warn_failure "Codex CLI not found; cannot register Figma MCP"
    return
  fi

  local output=""
  local changed=0
  if output="$(codex_figma_output)"; then
    if ! printf '%s\n' "$output" | grep -Fq "$endpoint"; then
      record_state figma codex failed "$endpoint" 0 "Existing figma MCP uses different configuration"
      warn_failure "Codex MCP 'figma' exists with a different endpoint; preserved existing configuration"
      return
    fi
    echo "  OK: Codex Figma MCP already present"
  else
    echo "Registering Figma MCP for Codex..."
    # `codex mcp add` may start OAuth immediately on OAuth-capable servers.
    # Write the documented MCP config shape so bootstrap remains non-interactive;
    # the owner can authorize later with `codex mcp login figma`.
    if ! register_codex_figma_without_oauth "$endpoint"; then
      record_state figma codex failed "$endpoint" 0 "Codex MCP registration failed"
      warn_failure "Codex Figma MCP registration failed"
      return
    fi
    changed=1
    if ! output="$(codex_figma_output)" || ! printf '%s\n' "$output" | grep -Fq "$endpoint"; then
      record_state figma codex failed "$endpoint" "$changed" "Codex registration not observable"
      warn_failure "Codex Figma MCP was not observable after registration"
      return
    fi
  fi

  if [ "${SDS_FIGMA_AUTH_CONFIRMED_CODEX:-0}" = "1" ]; then
    record_state figma codex present "$endpoint" "$changed" "Design+Make; auth confirmed externally"
  else
    record_state figma codex auth-pending "$endpoint" "$changed" "Design+Make registered; run codex mcp login figma"
  fi
}

install_figma() {
  local endpoint="$1"
  local plugin_reference="$2"
  local harnesses="$3"
  local features="$4"
  case ",$features," in
    *,design,make,*|*,make,design,*) ;;
    *)
      warn_failure "Figma catalog entry must declare both design and make"
      return
      ;;
  esac
  case ",$harnesses," in
    *,claude,*) install_figma_for_claude "$plugin_reference" ;;
    *) warn_failure "Figma catalog entry does not include Claude" ;;
  esac
  case ",$harnesses," in
    *,codex,*) install_figma_for_codex "$endpoint" ;;
    *) warn_failure "Figma catalog entry does not include Codex" ;;
  esac
}

echo "=== SDS Base Plugin Install/Check ==="
echo "Target:  $TARGET_DIR"
echo "Catalog: $CATALOG_FILE"

if [ ! -f "$CATALOG_FILE" ]; then
  echo "ERROR: SDS base-plugin catalog not found at $CATALOG_FILE"
  exit 1
fi

while IFS='|' read -r capability handler scope harnesses source desired_revision features; do
  case "$capability" in
    ""|\#*) continue ;;
  esac
  if [ -z "$handler" ] || [ -z "$scope" ] || [ -z "$harnesses" ] || [ -z "$source" ]; then
    warn_failure "invalid plugin catalog row for $capability"
    continue
  fi
  echo "--- $capability [$scope; $harnesses; $features] ---"
  case "$handler" in
    figma) install_figma "$source" "$desired_revision" "$harnesses" "$features" ;;
    *) warn_failure "unknown base-plugin handler: $handler" ;;
  esac
done < "$CATALOG_FILE"

if [ "$DRY_RUN" = "1" ]; then
  echo "OK: plugin dry-run completed without configuration or state changes"
elif [ "$FAILURE_COUNT" -eq 0 ]; then
  echo "OK: SDS base-plugin catalog reconciled"
  echo "NOTICE: Figma OAuth is intentionally deferred; inspect with scripts/plugin-status.sh"
fi

if [ "$FAILURE_COUNT" -gt 0 ]; then
  echo "ERROR: SDS base-plugin catalog completed with $FAILURE_COUNT warning(s) requiring attention"
  exit 1
fi
