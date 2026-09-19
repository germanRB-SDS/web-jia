#!/bin/bash
# SDS Dev Governance - install/register Graphify for project-scoped agent adapters.
# Usage:
#   ./sds-dev-governance/scripts/install-graphify.sh [project-root]

set -euo pipefail

TARGET_DIR="${1:-.}"
PACKAGE_SPEC="${GRAPHIFY_PACKAGE_SPEC:-graphifyy==0.9.9}"
PLATFORMS="${GRAPHIFY_PLATFORMS:-claude codex gemini cursor}"
STATUS=0

echo "=== Graphify Install/Check ==="
echo "Target: $TARGET_DIR"
echo "Package: $PACKAGE_SPEC"
echo "Platforms: $PLATFORMS"
echo ""

resolve_graphify() {
  if command -v graphify >/dev/null 2>&1; then
    command -v graphify
    return 0
  fi

  if command -v python3 >/dev/null 2>&1; then
    local user_base
    user_base="$(python3 -m site --user-base 2>/dev/null || true)"
    if [ -n "$user_base" ] && [ -x "$user_base/bin/graphify" ]; then
      printf '%s\n' "$user_base/bin/graphify"
      return 0
    fi
  fi

  if [ -x "$HOME/.local/bin/graphify" ]; then
    printf '%s\n' "$HOME/.local/bin/graphify"
    return 0
  fi

  return 1
}

install_graphify_user_venv() {
  if ! command -v python3 >/dev/null 2>&1; then
    return 1
  fi

  local venv_dir
  venv_dir="${GRAPHIFY_VENV_DIR:-$HOME/.local/share/sds-tools/graphify}"

  echo "Installing Graphify in user venv: $venv_dir"
  python3 -m venv "$venv_dir"
  "$venv_dir/bin/python" -m pip install --upgrade pip
  "$venv_dir/bin/python" -m pip install --upgrade "$PACKAGE_SPEC"

  mkdir -p "$HOME/.local/bin"
  ln -sf "$venv_dir/bin/graphify" "$HOME/.local/bin/graphify"
}

install_graphify_cli() {
  if resolve_graphify >/dev/null 2>&1; then
    return 0
  fi

  if command -v uv >/dev/null 2>&1; then
    echo "Installing Graphify with uv..."
    uv tool install "$PACKAGE_SPEC"
    return 0
  fi

  if command -v pipx >/dev/null 2>&1; then
    echo "Installing Graphify with pipx..."
    if ! pipx install "$PACKAGE_SPEC"; then
      pipx upgrade "$PACKAGE_SPEC"
    fi
    return 0
  fi

  if command -v python3 >/dev/null 2>&1; then
    echo "Installing Graphify with python3 -m pip --user..."
    if ! python3 -m pip install --user --upgrade "$PACKAGE_SPEC"; then
      echo "WARN: pip --user install failed; falling back to an isolated user venv"
      install_graphify_user_venv
    fi
    return 0
  fi

  echo "ERROR: cannot install Graphify; install uv, pipx, or Python 3 first."
  return 1
}

run_graphify_install() {
  local graphify_bin="$1"
  local platform="$2"

  case "$platform" in
    claude)
      "$graphify_bin" claude install --project
      ;;
    codex)
      "$graphify_bin" codex install --project
      ;;
    gemini)
      "$graphify_bin" gemini install --project
      ;;
    cursor)
      "$graphify_bin" cursor install --project
      ;;
    *)
      "$graphify_bin" install --project --platform "$platform"
      ;;
  esac
}

ensure_graphify_writable_path() {
  local path="$1"
  local parent

  if [ -e "$path" ]; then
    if [ -w "$path" ]; then
      return 0
    fi
    chmod u+w "$path" 2>/dev/null || chmod g+w "$path" 2>/dev/null || {
      echo "ERROR: Graphify needs write permission for $path"
      echo "       Fix ownership/permissions, then rerun: ./sds-dev-governance/scripts/install-graphify.sh ."
      return 1
    }
    return 0
  fi

  parent="$(dirname "$path")"
  if [ -d "$parent" ] && [ ! -w "$parent" ]; then
    chmod u+w "$parent" 2>/dev/null || chmod g+w "$parent" 2>/dev/null || {
      echo "ERROR: Graphify needs write permission for directory $parent"
      echo "       Fix ownership/permissions, then rerun: ./sds-dev-governance/scripts/install-graphify.sh ."
      return 1
    }
  fi
}

prepare_graphify_platform_permissions() {
  local target_dir="$1"
  local platform="$2"
  local rel_path

  ensure_graphify_writable_path "$target_dir" || return 1

  case "$platform" in
    claude)
      for rel_path in "CLAUDE.md" ".claude" ".claude/settings.json" ".claude/skills"; do
        ensure_graphify_writable_path "$target_dir/$rel_path" || return 1
      done
      ;;
    codex)
      for rel_path in "AGENTS.md" ".codex" ".codex/hooks.json" ".codex/skills"; do
        ensure_graphify_writable_path "$target_dir/$rel_path" || return 1
      done
      ;;
    gemini)
      for rel_path in "GEMINI.md" ".gemini" ".gemini/settings.json" ".gemini/skills"; do
        ensure_graphify_writable_path "$target_dir/$rel_path" || return 1
      done
      ;;
    cursor)
      for rel_path in ".cursor" ".cursor/rules" ".cursor/rules/graphify.mdc"; do
        ensure_graphify_writable_path "$target_dir/$rel_path" || return 1
      done
      ;;
  esac
}

normalize_generated_hook_paths() {
  local target_dir="$1"
  local graphify_bin="$2"

  if [ -z "$graphify_bin" ] || ! command -v python3 >/dev/null 2>&1; then
    return 0
  fi

  TARGET_DIR="$target_dir" GRAPHIFY_BIN="$graphify_bin" python3 - <<'PY'
from pathlib import Path
import os

target_dir = Path(os.environ["TARGET_DIR"])
graphify_bin = os.environ["GRAPHIFY_BIN"]

for rel_path in (
    ".codex/hooks.json",
    ".gemini/settings.json",
    ".claude/settings.json",
):
    path = target_dir / rel_path
    if not path.is_file():
        continue
    text = path.read_text(encoding="utf-8")
    updated = text.replace(graphify_bin, "graphify")
    if updated != text:
        path.write_text(updated, encoding="utf-8")
PY
}

if ! install_graphify_cli; then
  exit 1
fi

GRAPHIFY_BIN="$(resolve_graphify || true)"
if [ -z "$GRAPHIFY_BIN" ]; then
  echo "ERROR: Graphify installed but the graphify command was not found on PATH or user-base bin."
  exit 1
fi

echo "Using Graphify: $GRAPHIFY_BIN"
"$GRAPHIFY_BIN" --version 2>/dev/null || true
echo ""

for platform in $PLATFORMS; do
  echo "Registering Graphify for $platform..."
  if ! prepare_graphify_platform_permissions "$TARGET_DIR" "$platform"; then
    echo "  WARN: Graphify platform install skipped for $platform because required paths are not writable"
    STATUS=1
    continue
  fi
  if (cd "$TARGET_DIR" && run_graphify_install "$GRAPHIFY_BIN" "$platform"); then
    if ! normalize_generated_hook_paths "$TARGET_DIR" "$GRAPHIFY_BIN"; then
      echo "  WARN: could not normalize generated Graphify hook paths for $platform"
      STATUS=1
    fi
    echo "  OK: $platform"
  else
    echo "  WARN: Graphify platform install failed for $platform"
    STATUS=1
  fi
done

echo ""
if [ "$STATUS" -eq 0 ]; then
  echo "Graphify install/check complete."
else
  echo "Graphify install/check completed with warnings."
fi

exit "$STATUS"
