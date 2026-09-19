#!/bin/bash
# SDS Dev Governance — pstack integration invariants (offline, deterministic).
# Proves the Kit-side contract: one lazy node, one router row, no embedded skill bodies, no runtime
# dependency, exclusion carried by checkpoint and delegation, pinned revision and interface
# verifiable against a plugin tree. It does not prove agent reasoning or product behavior.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf -- "$TEST_ROOT"' EXIT

fail() { echo "FAIL: $1"; exit 1; }
ok() { echo "OK: $1"; }
count_matches() { grep -c -- "$1" "$2" 2>/dev/null || true; }

NODE="$KIT/skills/pstack.md"
ROUTER="$KIT/skills/README.md"
PRIORITY_SKILLS="how architect blast-radius interrogate create-verification-skill maintain-verification-skill tdd typescript-best-practices poteto-mode"
PINNED_VERSION="$(grep -oE 'plugin `[0-9]+\.[0-9]+\.[0-9]+`' "$NODE" | head -1 | tr -d '`' | awk '{print $2}')"
PINNED_COMMIT="$(grep -oE 'commit `[0-9a-f]{40}`' "$NODE" | head -1 | tr -d '`' | awk '{print $2}')"

echo "=== Permanent layer: one router row, nothing in kernel or practice INDEX ==="
[ -f "$NODE" ] || fail "skills/pstack.md missing"
[ "$(count_matches 'pstack.md' "$ROUTER")" = "1" ] || fail "router must carry exactly one pstack row"
[ "$(count_matches 'pstack' "$KIT/GOVERNANCE.md")" = "0" ] || fail "kernel must not mention pstack"
[ "$(count_matches 'pstack' "$KIT/practices/INDEX.md")" = "0" ] || fail "practice INDEX must not mention pstack"
grep -Fq 'sin pstack' "$ROUTER" || fail "router row must carry the exclusion trigger"
always_read=$(( $(wc -w < "$KIT/GOVERNANCE.md") + $(wc -w < "$KIT/practices/INDEX.md") + $(wc -w < "$ROUTER") ))
[ "$always_read" -le "${MAX_ALWAYS_READ_WORDS:-3000}" ] || fail "always-read budget exceeded ($always_read)"
ok "always-read set within budget ($always_read words); pstack costs one router row"
[ -n "$PINNED_VERSION" ] && [ -n "$PINNED_COMMIT" ] || fail "node must pin plugin version and commit"
ok "node pins plugin $PINNED_VERSION @ ${PINNED_COMMIT:0:12}"

echo "=== No skill bodies, no runtime dependency, no bridge propagation ==="
if grep -rlE '^name: (poteto-mode|how|architect|blast-radius|interrogate|tdd|principle-[a-z-]+)$' \
  "$KIT/skills" "$KIT/practices" "$KIT/adapters" "$KIT/scaffold" "$KIT/examples" >/dev/null 2>&1; then
  fail "pstack skill bodies embedded in the Kit"
fi
ok "no pstack SKILL.md body inside the Kit"
if grep -rl 'pstack' "$KIT/scripts" "$KIT/init.sh" "$KIT/init-project-prompt.md" "$KIT/plugins" "$KIT/skills/install-catalog.tsv" >/dev/null 2>&1; then
  fail "installers, bootstrap or catalogs depend on pstack"
fi
ok "bootstrap, installers and install catalogs are untouched"
grep -q 'pstack' "$KIT/skills/cross-agent-portability.tsv" && fail "pstack must not be bridged by the cross-agent policy"
ok "cross-agent bridge does not propagate plugin skills"
DRY="$TEST_ROOT/dry.log"
SDS_SKILLS_DRY_RUN=1 SDS_PLUGINS_DRY_RUN=1 SDS_INSTALL_GRAPHIFY=0 \
  "$KIT/scripts/install-skills.sh" "$KIT/.." > "$DRY" 2>&1 || true
grep -q 'pstack' "$DRY" && fail "skill installer dry run mentions pstack"
ok "install-skills.sh dry run unchanged (no pstack)"
"$KIT/scripts/generate-skills-index.sh" --check-policy > "$TEST_ROOT/index.log" 2>&1 \
  || fail "ordered skill index drifted from policy"
ok "ordered skill index and portability policy unchanged"

echo "=== Node references resolve; priority skills and exclusion variants are named ==="
dangling=""
while IFS= read -r ref; do
  [ -n "$ref" ] || continue
  [ -e "$KIT/$ref" ] || [ -e "$KIT/skills/$ref" ] || dangling="$dangling $ref"
done <<REFS
$(grep -oE '`(practices|skills|scripts|plugins|adapters|tests)/[A-Za-z0-9._/-]+`' "$NODE" | tr -d '`' | sort -u)
$(grep -oE '`cross-agent-portability\.tsv`' "$NODE" | tr -d '`' | sort -u)
REFS
[ -z "$dangling" ] || fail "node references missing kit paths:$dangling"
ok "every kit path named by the node resolves"
for skill in $PRIORITY_SKILLS; do
  grep -Fq "\`$skill\`" "$NODE" || fail "node does not describe $skill"
done
ok "priority skills described: $PRIORITY_SKILLS"
for phrase in 'sin pstack' 'no uses pstack' 'no pstack' 'Lauren Tan'; do
  grep -Fq "$phrase" "$NODE" || fail "exclusion variant missing: $phrase"
done
grep -Fq 'subagents and its continuations' "$NODE" || fail "exclusion scope must include subagents and continuations"
ok "exclusion variants and inherited scope declared"
grep -Fq 'Restricciones activas del usuario' "$KIT/practices/03-output-traceability.md" || fail "checkpoint contract lacks user restrictions"
grep -Fq 'Restricciones activas del usuario' "$KIT/practices/11-governance-evolution.md" || fail "practice 11 checkpoint lacks user restrictions"
grep -Fq '## Delegation Brief' "$KIT/practices/13-multi-agent.md" || fail "practice 13 lacks the delegation brief"
grep -Fq 'cannot re-enable an' "$KIT/practices/13-multi-agent.md" || fail "delegation brief must forbid re-enabling"
ok "exclusion survives checkpoint (03/11) and delegation (13)"
grep -Fq 'never global' "$NODE" || fail "poteto-mode must not be global"
grep -Fq 'Never nest orchestrators' "$NODE" || fail "orchestrator recursion must be forbidden"
grep -Fq 'never authorizes implementation' "$NODE" || fail "read tasks must not authorize implementation"
grep -Fq 'PREREQ_BLOCKED' "$NODE" && grep -Fq 'Never relax' "$NODE" || fail "failure classification incomplete"
ok "proportionality, non-recursion, read/implement boundary and failure classes declared"

echo "=== Adapters: real per-agent differences ==="
for adapter in adapters/CLAUDE.md adapters/nested/CLAUDE.md; do
  grep -Fq '/pstack:<skill>' "$KIT/$adapter" || fail "$adapter lacks the Claude invocation"
done
for adapter in adapters/AGENTS.md adapters/nested/AGENTS.md; do
  grep -Fq 'pstack:<skill>' "$KIT/$adapter" || fail "$adapter lacks the Codex invocation"
done
for adapter in adapters/GEMINI.md adapters/nested/GEMINI.md; do
  grep -Fq 'not packaged for Gemini' "$KIT/$adapter" || fail "$adapter must state pstack is unavailable"
done
for adapter in adapters/CLAUDE.md adapters/AGENTS.md adapters/GEMINI.md adapters/nested/CLAUDE.md adapters/nested/AGENTS.md adapters/nested/GEMINI.md; do
  grep -Fq 'sin pstack' "$KIT/$adapter" || fail "$adapter lacks the exclusion trigger"
done
ok "Claude/Codex invoke, Gemini falls back, every adapter carries the exclusion"

echo "=== Interface check against a plugin tree (fixture, then local install if present) ==="
check_plugin_tree() {
  local dir="$1" missing=""
  for skill in $PRIORITY_SKILLS; do
    [ -f "$dir/skills/$skill/SKILL.md" ] || missing="$missing $skill"
  done
  [ -z "$missing" ] || { echo "missing:$missing"; return 1; }
  return 0
}
FAKE_OK="$TEST_ROOT/plugin-ok"; FAKE_BAD="$TEST_ROOT/plugin-bad"
for skill in $PRIORITY_SKILLS; do
  mkdir -p "$FAKE_OK/skills/$skill" "$FAKE_BAD/skills/$skill"
  printf -- '---\nname: %s\ndescription: fixture\n---\n' "$skill" > "$FAKE_OK/skills/$skill/SKILL.md"
  printf -- '---\nname: %s\ndescription: fixture\n---\n' "$skill" > "$FAKE_BAD/skills/$skill/SKILL.md"
done
rm -rf "$FAKE_BAD/skills/how"
check_plugin_tree "$FAKE_OK" >/dev/null || fail "complete fixture tree rejected"
check_plugin_tree "$FAKE_BAD" > "$TEST_ROOT/bad.log" && fail "incomplete fixture tree accepted"
grep -q 'missing: how' "$TEST_ROOT/bad.log" || fail "missing skill not reported"
ok "interface check accepts a complete tree and names a missing skill"
INSTALL_DIR="${SDS_PSTACK_INSTALL_DIR:-$HOME/.claude/plugins/cache/pstack/pstack/$PINNED_VERSION}"
if [ -d "$INSTALL_DIR/skills" ]; then
  check_plugin_tree "$INSTALL_DIR" >/dev/null || fail "installed plugin $INSTALL_DIR lacks a priority skill"
  if [ -f "$HOME/.claude/plugins/installed_plugins.json" ] && ! grep -Fq "\"$PINNED_COMMIT\"" "$HOME/.claude/plugins/installed_plugins.json"; then
    echo "WARN: installed pstack commit differs from the pinned $PINNED_COMMIT (new capability revision; update the node and ledger)"
  fi
  ok "local install $PINNED_VERSION exposes every priority skill (observation, not admission)"
else
  echo "SKIP: pstack $PINNED_VERSION not installed locally; Kit needs nothing from it"
fi

echo "All pstack integration invariants passed."
