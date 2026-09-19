#!/bin/bash
# SDS Dev Governance — install/check the declared capability catalog
# Usage:
#   ./sds-dev-governance/scripts/install-skills.sh [project-root] [--bundled-only]

set -uo pipefail

TARGET_DIR="${1:-.}"
INSTALL_BUNDLED_ONLY="0"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GOVERNANCE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SDS_R8_SKILL_SOURCE="$GOVERNANCE_DIR/skills/runtime/sds-r8-analyzer"
CATALOG_FILE="${SDS_SKILLS_CATALOG:-$SCRIPT_DIR/../skills/install-catalog.tsv}"
CLAUDE_SKILLS_HOME="${CLAUDE_SKILLS_HOME:-$HOME/.claude/skills}"
CODEX_SKILLS_HOME="${CODEX_SKILLS_HOME:-$HOME/.codex/skills}"
GEMINI_SKILLS_HOME="${GEMINI_SKILLS_HOME:-$HOME/.gemini/skills}"
CODEX_SKILLS_SOURCE="$TARGET_DIR/docs/codex-skills/from-claude/skills"
DRY_RUN="${SDS_SKILLS_DRY_RUN:-0}"
FAILURE_COUNT=0
THREEJS_TMP_DIR=""
RESOLVED_THREEJS_SOURCE=""
BUNDLED_INSTALLED=""
RUN_BRIDGE="${SDS_SKILLS_BRIDGE:-1}"

IMPECCABLE_VERSION="${SDS_IMPECCABLE_VERSION:-4.1.1}"
SKILLUI_VERSION="${SDS_SKILLUI_VERSION:-1.3.4}"
GSTACK_REVISION="${SDS_GSTACK_REVISION:-ce5fbfa99ffb82fe445cae23a398a130dd643952}"
THREEJS_REPOSITORY="${SDS_THREEJS_REPOSITORY:-https://github.com/OpenAEC-Foundation/Three.js-Claude-Skill-Package.git}"
THREEJS_REVISION="${SDS_THREEJS_SKILLS_REVISION:-6c190f0db95d6e4b77d7843d181c6d3325c09d0e}"
THREEJS_EXPECTED_COUNT="${SDS_THREEJS_EXPECTED_COUNT:-24}"

for arg in "${@:2}"; do
  case "$arg" in
    --bundled-only)
      INSTALL_BUNDLED_ONLY="1"
      ;;
    "")
      ;;
    *)
      echo "ERROR: unknown option: $arg"
      echo "Usage: ./sds-dev-governance/scripts/install-skills.sh [project-root] [--bundled-only]"
      exit 1
      ;;
  esac
done

cleanup() {
  if [ -n "$THREEJS_TMP_DIR" ] && [ -d "$THREEJS_TMP_DIR" ]; then
    rm -rf -- "$THREEJS_TMP_DIR"
  fi
}
trap cleanup EXIT

warn_failure() {
  echo "WARN: $1"
  FAILURE_COUNT=$((FAILURE_COUNT + 1))
}

prepare_node_runtime() {
  if [ -f "$TARGET_DIR/.nvmrc" ] && [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "$HOME/.nvm/nvm.sh"
    if ! nvm use >/dev/null; then
      warn_failure "could not select the Node runtime pinned by $TARGET_DIR/.nvmrc"
    fi
  fi
}

ensure_skill_link() {
  local source_dir="$1"
  local destination_dir="$2"
  local label="$3"

  if [ -L "$destination_dir" ]; then
    if [ "$(readlink "$destination_dir")" = "$source_dir" ]; then
      echo "  OK: $label already shared"
    else
      warn_failure "$label already points to another source; preserved $destination_dir"
    fi
    return
  fi

  if [ -e "$destination_dir" ]; then
    if [ -f "$destination_dir/SKILL.md" ]; then
      echo "  NOTICE: $label already exists independently; preserved $destination_dir"
    else
      warn_failure "$label destination exists without SKILL.md; preserved $destination_dir"
    fi
    return
  fi

  mkdir -p "$(dirname "$destination_dir")"
  ln -s "$source_dir" "$destination_dir"
  echo "  OK: $label shared"
}

install_impeccable() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: impeccable -> project multi-harness installer"
    return
  fi
  if ! command -v npx >/dev/null 2>&1; then
    warn_failure "npx not found; cannot install Impeccable"
    return
  fi

  echo "Installing/verifying Impeccable for this project..."
  if ! (cd "$TARGET_DIR" && printf 'Y\nN\n' | npx --yes "impeccable@$IMPECCABLE_VERSION" skills install); then
    warn_failure "Impeccable install did not complete cleanly; inspect harness folders manually"
  fi
}

install_skillui() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: skillui -> user CLI"
    return
  fi
  if command -v skillui >/dev/null 2>&1; then
    echo "skillui already available: $(command -v skillui)"
    return
  fi
  if [ -x "$HOME/.npm-global/bin/skillui" ]; then
    echo "skillui already available: $HOME/.npm-global/bin/skillui"
    return
  fi
  if ! command -v npm >/dev/null 2>&1; then
    warn_failure "npm not found; cannot install skillui"
    return
  fi

  echo "Installing skillui globally..."
  if npm install -g "skillui@$SKILLUI_VERSION"; then
    return
  fi

  echo "Global npm install failed; retrying under ~/.npm-global..."
  mkdir -p "$HOME/.npm-global"
  if ! npm install -g --prefix "$HOME/.npm-global" "skillui@$SKILLUI_VERSION"; then
    warn_failure "skillui installation failed"
    return
  fi
  echo "Add ~/.npm-global/bin to PATH if your shell does not already include it."
}

install_gstack() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: gstack -> Claude user skill + Codex shared link"
    return
  fi

  local claude_gstack="$CLAUDE_SKILLS_HOME/gstack"
  local codex_gstack="$CODEX_SKILLS_HOME/gstack"

  if [ -f "$claude_gstack/SKILL.md" ]; then
    echo "gstack already available: $claude_gstack"
  elif ! command -v git >/dev/null 2>&1; then
    warn_failure "git not found; cannot install gstack"
    return
  else
    if ! command -v bun >/dev/null 2>&1 && [ ! -x "$HOME/.bun/bin/bun" ]; then
      if ! command -v curl >/dev/null 2>&1; then
        warn_failure "Bun is required by gstack and curl is unavailable"
        return
      fi
      echo "Bun is required by gstack; installing pinned Bun 1.3.10 for this user..."
      local bun_installer
      bun_installer="$(mktemp)"
      if ! curl -fsSL "https://bun.sh/install" -o "$bun_installer"; then
        rm -f -- "$bun_installer"
        warn_failure "could not download the Bun installer"
        return
      fi
      shasum -a 256 "$bun_installer"
      if ! BUN_VERSION="1.3.10" bash "$bun_installer"; then
        rm -f -- "$bun_installer"
        warn_failure "Bun installation failed"
        return
      fi
      rm -f -- "$bun_installer"
    fi

    echo "Installing gstack globally..."
    mkdir -p "$CLAUDE_SKILLS_HOME"
    if ! git clone --quiet --filter=blob:none --no-checkout https://github.com/garrytan/gstack.git "$claude_gstack"; then
      warn_failure "gstack clone failed"
      return
    fi
    if ! git -C "$claude_gstack" checkout --quiet "$GSTACK_REVISION"; then
      warn_failure "gstack revision $GSTACK_REVISION is unavailable"
      return
    fi
    if ! (cd "$claude_gstack" && PATH="$HOME/.bun/bin:$PATH" ./setup); then
      warn_failure "gstack setup failed; inspect $claude_gstack"
      return
    fi
  fi

  ensure_skill_link "$claude_gstack" "$codex_gstack" "gstack for Codex"
}

threejs_existing_revision_matches() {
  local provenance="$CLAUDE_SKILLS_HOME/THREEJS-SKILLS-PROVENANCE.md"
  local count
  count="$(find "$CLAUDE_SKILLS_HOME" -mindepth 2 -maxdepth 2 -type f -path '*/threejs-*/SKILL.md' 2>/dev/null | wc -l | tr -d ' ')"
  [ "$count" = "$THREEJS_EXPECTED_COUNT" ] &&
    [ -f "$provenance" ] &&
    grep -Fq "$THREEJS_REVISION" "$provenance"
}

resolve_threejs_source() {
  if [ -n "${SDS_THREEJS_SOURCE_DIR:-}" ]; then
    RESOLVED_THREEJS_SOURCE="$SDS_THREEJS_SOURCE_DIR"
    return 0
  fi
  if threejs_existing_revision_matches; then
    RESOLVED_THREEJS_SOURCE="$CLAUDE_SKILLS_HOME"
    return 0
  fi
  if ! command -v git >/dev/null 2>&1; then
    return 1
  fi

  THREEJS_TMP_DIR="$(mktemp -d)"
  local checkout="$THREEJS_TMP_DIR/package"
  if ! git clone --quiet --filter=blob:none "$THREEJS_REPOSITORY" "$checkout"; then
    return 1
  fi
  if ! git -C "$checkout" checkout --quiet "$THREEJS_REVISION"; then
    return 1
  fi
  RESOLVED_THREEJS_SOURCE="$checkout"
}

install_threejs() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: threejs -> $THREEJS_EXPECTED_COUNT Claude skills + Codex shared links"
    return
  fi

  local source_root
  if ! resolve_threejs_source; then
    warn_failure "could not resolve Three.js skill package at revision $THREEJS_REVISION"
    return
  fi
  source_root="$RESOLVED_THREEJS_SOURCE"

  local discovered=0
  local installed=0
  local preserved=0
  local skill_file
  while IFS= read -r skill_file; do
    local source_skill_dir
    local skill_name
    local claude_target
    source_skill_dir="$(dirname "$skill_file")"
    skill_name="$(basename "$source_skill_dir")"
    case "$skill_name" in
      threejs-*) ;;
      *) continue ;;
    esac

    discovered=$((discovered + 1))
    claude_target="$CLAUDE_SKILLS_HOME/$skill_name"
    if [ "$source_skill_dir" = "$claude_target" ]; then
      :
    elif [ -e "$claude_target" ] || [ -L "$claude_target" ]; then
      echo "  NOTICE: preserving existing Claude skill $claude_target"
      preserved=$((preserved + 1))
    else
      mkdir -p "$CLAUDE_SKILLS_HOME"
      cp -R "$source_skill_dir" "$claude_target"
      installed=$((installed + 1))
    fi

    if [ -f "$claude_target/SKILL.md" ]; then
      ensure_skill_link "$claude_target" "$CODEX_SKILLS_HOME/$skill_name" "$skill_name for Codex"
    else
      warn_failure "$skill_name was not materialized for Claude"
    fi
  done < <(find "$source_root" -type f -name SKILL.md | sort)

  if [ "$discovered" != "$THREEJS_EXPECTED_COUNT" ]; then
    warn_failure "Three.js package exposed $discovered skills; expected $THREEJS_EXPECTED_COUNT"
    return
  fi
  if [ "$preserved" -gt 0 ] && ! threejs_existing_revision_matches; then
    warn_failure "existing Three.js skills were preserved but their revision is not verified"
    return
  fi

  if [ "$source_root" != "$CLAUDE_SKILLS_HOME" ]; then
    cat > "$CLAUDE_SKILLS_HOME/THREEJS-SKILLS-PROVENANCE.md" <<EOF
# Three.js Skill Package — provenance

- Upstream: $THREEJS_REPOSITORY
- Commit: $THREEJS_REVISION
- Skills: $discovered
EOF
  fi
  echo "OK: Three.js skills available ($discovered total, $installed newly installed)"
}

# The curated port holds Claude skills rewritten to drop gstack/Claude-only assumptions. Codex and
# Gemini both consume the same rewrite, so neither agent gets a silently different revision.
install_ported_skills_from_project() {
  local agent_home="$1"
  local agent_label="$2"

  if [ ! -d "$CODEX_SKILLS_SOURCE" ]; then
    echo "NOTICE: no project-versioned ported skill source at $CODEX_SKILLS_SOURCE"
    return
  fi
  if ! command -v python3 >/dev/null 2>&1; then
    warn_failure "python3 not found; cannot install project-versioned $agent_label skills"
    return
  fi

  mkdir -p "$agent_home"
  echo "Installing project-versioned $agent_label skills..."
  local skill_dir
  while IFS= read -r skill_dir; do
    [ -f "$skill_dir/SKILL.md" ] || continue
    local skill_name
    local target_skill_dir
    skill_name="$(basename "$skill_dir")"
    target_skill_dir="$agent_home/$skill_name"
    if [ -L "$target_skill_dir" ]; then
      echo "  NOTICE: preserving bridged $agent_label skill $target_skill_dir"
      continue
    fi
    if python3 "$SCRIPT_DIR/copy-skill.py" "$skill_dir" "$target_skill_dir"; then
      echo "  OK: $skill_name"
    else
      warn_failure "existing $agent_label skill preserved; explicit reconciliation required"
    fi
  done < <(find "$CODEX_SKILLS_SOURCE" -mindepth 1 -maxdepth 1 -type d | sort)
}

bridge_agent_skills() {
  local bridge="$GOVERNANCE_DIR/scripts/sync-agent-skills.sh"
  if [ "$RUN_BRIDGE" != "1" ]; then
    echo "NOTICE: cross-agent bridge skipped by SDS_SKILLS_BRIDGE=0"
    return
  fi
  if [ ! -x "$bridge" ]; then
    warn_failure "cross-agent bridge not found at sds-dev-governance/scripts/sync-agent-skills.sh"
    return
  fi
  echo ""
  echo "--- cross-agent skill bridge ---"
  if ! "$bridge" --apply; then
    warn_failure "cross-agent skill bridge reported unresolved rows"
  fi
}

install_graphify() {
  if [ "${SDS_INSTALL_GRAPHIFY:-1}" != "1" ]; then
    echo "NOTICE: Graphify skipped by SDS_INSTALL_GRAPHIFY=0 or --skip-graphify"
    return
  fi
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: graphify -> project CLI/adapters"
    return
  fi
  if [ ! -x "$TARGET_DIR/sds-dev-governance/scripts/install-graphify.sh" ]; then
    warn_failure "Graphify installer missing at $TARGET_DIR/sds-dev-governance/scripts/install-graphify.sh"
    return
  fi
  if ! "$TARGET_DIR/sds-dev-governance/scripts/install-graphify.sh" "$TARGET_DIR"; then
    warn_failure "Graphify install did not complete cleanly"
  fi
}

install_bundled_skill() {
  local skill_name="$1"
  local source_dir="$2"
  local destination_home
  local destination_dir

  if [ ! -f "$source_dir/SKILL.md" ]; then
    warn_failure "bundled skill source missing: $source_dir/SKILL.md"
    return 1
  fi

  if ! command -v python3 >/dev/null 2>&1; then
    warn_failure "python3 is required to install bundled skills reproducibly"
    return 1
  fi

  for destination_home in "$CLAUDE_SKILLS_HOME" "$CODEX_SKILLS_HOME"; do
    destination_dir="$destination_home/$skill_name"
    if ! python3 "$SCRIPT_DIR/copy-skill.py" "$source_dir" "$destination_dir"; then
      warn_failure "bundled skill destination preserved; explicit reconciliation required"
      return 1
    fi
    echo "  OK: bundled $skill_name installed at $destination_dir"
  done
}

install_sds_r8_analyzer() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY-RUN: sds-r8-analyzer -> bundled copy for Claude Code and Codex"
    return
  fi
  install_bundled_skill "sds-r8-analyzer" "$SDS_R8_SKILL_SOURCE" || return
  BUNDLED_INSTALLED="$BUNDLED_INSTALLED sds-r8-analyzer"
  if [ -f "$CLAUDE_SKILLS_HOME/r8-analyzer/SKILL.md" ] ||
    [ -f "$CODEX_SKILLS_HOME/r8-analyzer/SKILL.md" ]; then
    echo "  WARN: upstream r8-analyzer is also installed; use the explicit sds-r8-analyzer name to avoid ambiguity"
  fi
}

run_catalog_handler() {
  local handler="$1"
  case "$handler" in
    impeccable) install_impeccable ;;
    gstack) install_gstack ;;
    skillui) install_skillui ;;
    threejs) install_threejs ;;
    graphify) install_graphify ;;
    sds-r8-analyzer) install_sds_r8_analyzer ;;
    *) warn_failure "unknown skill catalog handler: $handler" ;;
  esac
}

echo "=== SDS Skills Catalog Install/Check ==="
echo "Target:  $TARGET_DIR"
echo "Catalog: $CATALOG_FILE"
echo ""

if [ "$DRY_RUN" != "1" ] && [ "$INSTALL_BUNDLED_ONLY" != "1" ]; then
  prepare_node_runtime
fi

if [ ! -f "$CATALOG_FILE" ]; then
  echo "ERROR: SDS skill catalog not found at $CATALOG_FILE"
  exit 1
fi

while IFS='|' read -r capability handler scope harnesses doc; do
  case "$capability" in
    ""|\#*) continue ;;
  esac
  if [ -z "$handler" ] || [ -z "$scope" ] || [ -z "$harnesses" ] || [ -z "$doc" ]; then
    warn_failure "invalid catalog row for $capability"
    continue
  fi
  if [ ! -f "$GOVERNANCE_DIR/skills/$doc" ]; then
    warn_failure "catalog row $capability names a missing skill document: skills/$doc"
    continue
  fi
  if [ "$INSTALL_BUNDLED_ONLY" = "1" ] && [ "$scope" != "bundled" ]; then
    continue
  fi
  echo "--- $capability [$scope; $harnesses] ---"
  run_catalog_handler "$handler"
done < "$CATALOG_FILE"

if [ "$INSTALL_BUNDLED_ONLY" = "1" ]; then
  if [ "$FAILURE_COUNT" -gt 0 ]; then
    echo "ERROR: bundled-only installation completed with $FAILURE_COUNT warning(s) requiring attention"
    exit 1
  fi
  echo "OK: bundled-only installation complete. Capability use still requires the project ledger."
  exit 0
fi

if [ "$DRY_RUN" != "1" ]; then
  install_ported_skills_from_project "$CODEX_SKILLS_HOME" "Codex"
  install_ported_skills_from_project "$GEMINI_SKILLS_HOME" "Gemini"
  bridge_agent_skills
fi

echo ""
echo "=== Verification ==="
if [ "$DRY_RUN" = "1" ]; then
  echo "OK: dry-run completed without external changes"
else
  for agent_pair in "Claude Code:$CLAUDE_SKILLS_HOME" "Codex:$CODEX_SKILLS_HOME" "Gemini:$GEMINI_SKILLS_HOME"; do
    agent_label="${agent_pair%%:*}"
    agent_home="${agent_pair#*:}"
    if [ -d "$agent_home" ]; then
      AGENT_SKILL_COUNT="$(find -L "$agent_home" -mindepth 2 -maxdepth 2 -type f -name SKILL.md -not -path "$agent_home/.system/*" 2>/dev/null | wc -l | tr -d ' ')"
      echo "OK: $agent_label skills reachable at $agent_home ($AGENT_SKILL_COUNT)"
    else
      warn_failure "$agent_label skills directory not found at $agent_home"
    fi
  done
fi

if [ "$DRY_RUN" != "1" ] && [ -n "$BUNDLED_INSTALLED" ]; then
  for bundled_skill in $BUNDLED_INSTALLED; do
    if [ -f "$CLAUDE_SKILLS_HOME/$bundled_skill/SKILL.md" ] &&
      [ -f "$CODEX_SKILLS_HOME/$bundled_skill/SKILL.md" ]; then
      echo "OK: $bundled_skill detected for Claude Code and Codex"
    else
      warn_failure "$bundled_skill installation is incomplete"
    fi
  done
fi

echo "See sds-dev-governance/skills/README.md for use and admission rules."
if [ "$FAILURE_COUNT" -gt 0 ]; then
  echo "ERROR: SDS skill catalog completed with $FAILURE_COUNT warning(s) requiring attention"
  exit 1
fi
echo "OK: SDS skill catalog completed"
