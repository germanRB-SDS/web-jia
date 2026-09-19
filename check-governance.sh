#!/bin/bash
# SDS Dev Governance — validation checks
# Usage:
#   ./sds-dev-governance/check-governance.sh [project-root]

set -euo pipefail

TARGET_DIR="${1:-.}"
MAX_MEMORY_LINES="${MAX_MEMORY_LINES:-250}"
MAX_GOVERNANCE_WORDS="${MAX_GOVERNANCE_WORDS:-1700}"
MAX_PRACTICE_INDEX_WORDS="${MAX_PRACTICE_INDEX_WORDS:-1000}"
MAX_ALWAYS_READ_WORDS="${MAX_ALWAYS_READ_WORDS:-3000}"
STATUS=0
WORKSPACE_MODE="project"
if [ -f "$TARGET_DIR/docs/governance/workspace-mode" ]; then
  WORKSPACE_MODE="$(cat "$TARGET_DIR/docs/governance/workspace-mode")"
fi
case "$WORKSPACE_MODE" in project|hub) ;; *) echo "FAIL: invalid workspace mode"; exit 1 ;; esac
CHECK_TMP="$(mktemp -d "${TMPDIR:-/tmp}/sds-check.XXXXXX")"
trap 'rm -rf -- "$CHECK_TMP"' EXIT

fail() {
  echo "FAIL: $1"
  STATUS=1
}

pass() {
  echo "OK: $1"
}

require_file() {
  local file="$1"
  if [ -f "$TARGET_DIR/$file" ]; then
    pass "$file exists"
  else
    fail "$file missing"
  fi
}

contains() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  if [ ! -f "$TARGET_DIR/$file" ]; then
    fail "$file missing for check: $label"
    return
  fi
  if grep -Eq "$pattern" "$TARGET_DIR/$file"; then
    pass "$label"
  else
    fail "$label"
  fi
}

check_max_words() {
  local file="$1"
  local max_words="$2"
  local label="$3"
  if [ ! -f "$TARGET_DIR/$file" ]; then
    fail "$file missing for word-budget check: $label"
    return
  fi
  local words
  words="$(wc -w < "$TARGET_DIR/$file" | tr -d ' ')"
  if [ "$words" -le "$max_words" ]; then
    pass "$label ($words <= $max_words words)"
  else
    fail "$label ($words > $max_words words)"
  fi
}

check_practice_router() {
  local index="$TARGET_DIR/sds-dev-governance/practices/INDEX.md"
  if [ ! -f "$index" ]; then
    fail "practice router missing"
    return
  fi
  local practice
  local count=0
  for practice in "$TARGET_DIR"/sds-dev-governance/practices/[0-9][0-9]-*.md; do
    [ -f "$practice" ] || continue
    count=$((count + 1))
    local base
    local matches
    base="$(basename "$practice")"
    matches="$(grep -F -c "\`$base\`" "$index" || true)"
    if [ "$matches" -eq 1 ]; then
      pass "practice router lists $base exactly once"
    else
      fail "practice router must list $base exactly once (found $matches)"
    fi
  done
  if [ "$count" -eq 16 ]; then
    pass "practice router covers 16 numbered practices"
  else
    fail "expected 16 numbered practices, found $count"
  fi
}

# [47-1] Practice 16 (verification proportionality): deterministic invariants only — module present
# and routed, root within the ratified word budget, core anchors present, and no second LEVEL scale
# (the LEVEL table belongs exclusively to practice 12). No prose interpretation.
check_verification_proportionality() {
  local module_rel="sds-dev-governance/practices/modules/16-verification-scope.md"
  local module="$TARGET_DIR/$module_rel"
  local root="$TARGET_DIR/sds-dev-governance/practices/16-verification-proportionality.md"
  local index="$TARGET_DIR/sds-dev-governance/practices/INDEX.md"

  if [ ! -f "$root" ]; then
    fail "practice 16 root missing"
    return
  fi
  if [ ! -f "$module" ]; then
    fail "$module_rel missing"
    return
  fi
  local words
  words="$(wc -w < "$root" | tr -d ' ')"
  if [ "$words" -le "${MAX_PRACTICE16_ROOT_WORDS:-633}" ]; then
    pass "practice 16 root within ratified word budget ($words <= ${MAX_PRACTICE16_ROOT_WORDS:-633})"
  else
    fail "practice 16 root exceeds ratified word budget ($words > ${MAX_PRACTICE16_ROOT_WORDS:-633})"
  fi
  if grep -q 'V0' "$root" && grep -q 'V4' "$root" && grep -q 'No-change, no-rerun' "$root"; then
    pass "practice 16 root keeps V0/V4 scale and no-change-no-rerun anchors"
  else
    fail "practice 16 root lost a required anchor (V0/V4/No-change, no-rerun)"
  fi
  if grep -Eq 'LEVEL [0-3]' "$root"; then
    fail "practice 16 must not define a second LEVEL scale (LEVEL belongs to practice 12)"
  else
    pass "practice 16 defines no second LEVEL scale"
  fi
  for file in "$root" "$index"; do
    local relative="${file#$TARGET_DIR/}"
    if grep -Fq 'practices/modules/16-verification-scope.md' "$file"; then
      pass "$relative routes the verification scope module"
    else
      fail "$relative must route practices/modules/16-verification-scope.md"
    fi
  done
}

check_capability_ledger() {
  local ledger_rel="docs/governance/capability-registry.md"
  local scaffold_rel="sds-dev-governance/scaffold/docs/governance/capability-registry.md"
  local ledger="$TARGET_DIR/$ledger_rel"
  local scaffold="$TARGET_DIR/$scaffold_rel"
  local file

  for file in "$ledger" "$scaffold"; do
    [ -f "$file" ] || continue
    local relative="${file#$TARGET_DIR/}"
    if awk '
      /<!-- SDS_CAPABILITY_LEDGER_START -->/ { starts++; if (active) bad=1; active=1; next }
      /<!-- SDS_CAPABILITY_LEDGER_END -->/ { ends++; if (!active) bad=1; active=0; next }
      END { exit !(starts == 1 && ends == 1 && active == 0 && bad != 1) }
    ' "$file"; then
      pass "$relative has one ordered capability ledger block"
    else
      fail "$relative must have one ordered capability ledger block"
      continue
    fi
    if grep -Fqx '| Capability / mode | Effective revision / ownership / scope | Access / effects / authority | Persistence / reversal | Risk route | Status | Constraints | Evidence |' "$file"; then
      pass "$relative uses the canonical capability ledger columns"
    else
      fail "$relative must use the canonical capability ledger columns"
    fi

    local ledger_errors
    ledger_errors="$(awk -F'|' '
      function trim(value) {
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
        gsub(/`/, "", value)
        return value
      }
      /<!-- SDS_CAPABILITY_LEDGER_START -->/ { active=1; next }
      /<!-- SDS_CAPABILITY_LEDGER_END -->/ { active=0; next }
      active && /^\|/ {
        capability=trim($2)
        status=trim($7)
        constraints=trim($8)
        if (capability == "" || capability == "Capability / mode" || capability ~ /^-+$/) next
        if (status !~ /^(NOT_EVALUATED|QUARANTINED|ADMITTED|ADMITTED_WITH_CONSTRAINTS|REJECTED|DEPRECATED)$/) {
          print "line " NR ": invalid status " status
          next
        }
        if (status == "ADMITTED_WITH_CONSTRAINTS" && (constraints == "" || constraints ~ /^N\/A/ || constraints == "-")) {
          print "line " NR ": constrained admission lacks substantive constraints"
        }
        if (status == "ADMITTED" && constraints != "N/A — no constraints") {
          print "line " NR ": unconstrained admission must declare N/A — no constraints"
        }
      }
    ' "$file")"
    if [ -z "$ledger_errors" ]; then
      pass "$relative uses the closed capability status enum and explicit admission constraints"
    else
      fail "$relative has invalid capability rows: $ledger_errors"
    fi
  done

  if [ -f "$scaffold" ]; then
    local scaffold_rows
    scaffold_rows="$(awk -F'|' '
      function trim(value) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", value); return value }
      /<!-- SDS_CAPABILITY_LEDGER_START -->/ { active=1; next }
      /<!-- SDS_CAPABILITY_LEDGER_END -->/ { active=0; next }
      active && /^\|/ {
        capability=trim($2)
        if (capability != "" && capability != "Capability / mode" && capability !~ /^-+$/) rows++
      }
      END { print rows + 0 }
    ' "$scaffold")"
    if [ "$scaffold_rows" -eq 0 ]; then
      pass "portable capability ledger scaffold has no environment admissions"
    else
      fail "portable capability ledger scaffold must not carry environment admissions"
    fi
  fi

  if [ -f "$TARGET_DIR/sds-dev-governance/skills/README.md" ] &&
    grep -Eq '[[:xdigit:]]{64}' "$TARGET_DIR/sds-dev-governance/skills/README.md"; then
    fail "always-read skills router must not contain environment fingerprints"
  else
    pass "always-read skills router has no environment fingerprints"
  fi
}

check_capability_admission_module() {
  local module_rel="sds-dev-governance/practices/modules/11-capability-admission.md"
  local module="$TARGET_DIR/$module_rel"
  local root="$TARGET_DIR/sds-dev-governance/practices/11-governance-evolution.md"
  local index="$TARGET_DIR/sds-dev-governance/practices/INDEX.md"
  local skills="$TARGET_DIR/sds-dev-governance/skills/README.md"

  if [ ! -f "$module" ]; then
    fail "$module_rel missing"
    return
  fi
  if grep -q '^### Seis gates$' "$module" &&
    grep -q '^### Estados canonicos$' "$module" &&
    grep -q '^### Cierre normativo$' "$module"; then
    pass "capability admission module retains gates, states and closure"
  else
    fail "capability admission module is incomplete"
  fi
  if grep -q '^### Seis gates$' "$root"; then
    fail "practice 11 root still embeds the full capability gate"
  else
    pass "practice 11 root does not embed the full capability gate"
  fi
  for file in "$root" "$index" "$skills"; do
    local relative="${file#$TARGET_DIR/}"
    if grep -Fq 'practices/modules/11-capability-admission.md' "$file"; then
      pass "$relative routes the capability admission module"
    else
      fail "$relative must route practices/modules/11-capability-admission.md"
    fi
  done
  if grep -Eqi 'routine|rutinaria' "$index" && grep -Eqi 'routine|rutinaria' "$skills"; then
    pass "INDEX and skills router preserve routine exact-match lazy loading"
  else
    fail "INDEX and skills router must document routine exact-match lazy loading"
  fi
}

check_github_deletion_guardrails() {
  local adapter
  local -a adapters=(
    "CLAUDE.md"
    "AGENTS.md"
    "GEMINI.md"
    ".cursor/rules/sds-governance.mdc"
    "sds-dev-governance/adapters/CLAUDE.md"
    "sds-dev-governance/adapters/AGENTS.md"
    "sds-dev-governance/adapters/GEMINI.md"
    "sds-dev-governance/adapters/cursor-rules/sds-governance.mdc"
    "sds-dev-governance/adapters/nested/CLAUDE.md"
    "sds-dev-governance/adapters/nested/AGENTS.md"
    "sds-dev-governance/adapters/nested/GEMINI.md"
    "sds-dev-governance/adapters/nested/cursor-rules/sds-governance.mdc"
  )

  contains "sds-dev-governance/GOVERNANCE.md" "manual-owner-only" "kernel makes GitHub remote deletion manual-owner-only"
  contains "sds-dev-governance/practices/05-git-branching.md" "git-safe-push.sh" "Git practice routes safe push"
  contains "sds-dev-governance/practices/07-security-baseline.md" "No user instruction in chat delegates" "security practice makes deletion non-delegable"
  contains "sds-dev-governance/practices/07-security-baseline.md" "delete_repo" "security practice forbids delete_repo scope"
  contains "sds-dev-governance/practices/07-security-baseline.md" "A plan/license" "security practice fails closed on unsupported plans"

  for adapter in "${adapters[@]}"; do
    contains "$adapter" "GitHub Remote Deletion Guardrail" "$adapter carries GitHub deletion guardrail trigger"
    contains "$adapter" "gh-safe.sh" "$adapter routes GitHub CLI through safe wrapper"
  done

  if jq -e '
    .target == "branch" and .enforcement == "active" and .bypass_actors == [] and
    .conditions.ref_name.include == ["~ALL"] and
    ((.rules | map(.type) | sort) == ["deletion", "non_fast_forward"])
  ' "$TARGET_DIR/sds-dev-governance/github/ruleset-anti-deletion.json" >/dev/null 2>&1; then
    pass "canonical GitHub ruleset is active, global and bypass-free"
  else
    fail "canonical GitHub ruleset lost anti-deletion/non-fast-forward invariants"
  fi

  local executable
  for executable in \
    "sds-dev-governance/scripts/gh-safe.sh" \
    "sds-dev-governance/scripts/git-safe-push.sh" \
    "sds-dev-governance/scripts/install-git-guardrails.sh" \
    "sds-dev-governance/scripts/apply-github-guardrails.sh" \
    "sds-dev-governance/hooks/pre-push" \
    "sds-dev-governance/tests/test-github-guardrails.sh" \
    "sds-dev-governance/tests/test-skill-bootstrap.sh" \
    "sds-dev-governance/tests/test-plugin-bootstrap.sh"; do
    if [ -x "$TARGET_DIR/$executable" ]; then
      pass "$executable is executable"
    else
      fail "$executable must be executable"
    fi
  done

  if bash "$TARGET_DIR/sds-dev-governance/tests/test-github-guardrails.sh"; then
    pass "GitHub guardrail negative/idempotence tests pass"
  else
    fail "GitHub guardrail negative/idempotence tests failed"
  fi
}

check_policy_folders() {
  local folders=("$TARGET_DIR"/docs/*-policies)
  local found=0

  for folder in "${folders[@]}"; do
    [ -d "$folder" ] || continue
    found=1

    local folder_name
    local policy_prefix
    folder_name="$(basename "$folder")"
    policy_prefix="${folder_name%-policies}"

    require_file "docs/$folder_name/${policy_prefix}-cookies-policy.md"
    require_file "docs/$folder_name/${policy_prefix}-privacy-policy.md"
    require_file "docs/$folder_name/${policy_prefix}-terms-of-service.md"
  done

  if [ "$found" -eq 0 ]; then
    fail "docs/<project-name>-policies/ folder missing"
  else
    pass "project policy folder naming checked"
  fi
}

echo "=== SDS Dev Governance Check ==="
echo "Target: $TARGET_DIR"
echo ""

REQUIRED_FILES=(
  "sds-dev-governance/GOVERNANCE.md"
  "sds-dev-governance/VERSION.md"
  "sds-dev-governance/practices/INDEX.md"
  "sds-dev-governance/practices/modules/01-selective-text.md"
  "sds-dev-governance/scripts/sds-text"
  "sds-dev-governance/scripts/sds-mcp"
  "sds-dev-governance/mcp/README.md"
  "sds-dev-governance/mcp/cli.py"
  "sds-dev-governance/mcp/control.py"
  "sds-dev-governance/mcp/configure.py"
  "sds-dev-governance/mcp/install-local.py"
  "sds-dev-governance/mcp/inventory.py"
  "sds-dev-governance/mcp/gateway.py"
  "sds-dev-governance/mcp/hostinger.json"
  "sds-dev-governance/mcp/hostinger-provenance.json"
  "sds-dev-governance/mcp/tooling/package.json"
  "sds-dev-governance/mcp/tooling/package-lock.json"
  "sds-dev-governance/mcp/tooling/.nvmrc"
  "sds-dev-governance/scripts/sds_text.py"
  "sds-dev-governance/scripts/governance-freshness.sh"
  "sds-dev-governance/scripts/governance_freshness.py"
  "sds-dev-governance/examples/prompts/selective-context.md"
  "sds-dev-governance/practices/RULE-COVERAGE.md"
  "sds-dev-governance/skills/README.md"
  "sds-dev-governance/skills/catalog-authority.md"
  "sds-dev-governance/skills/bootstrap-and-agents.md"
  "sds-dev-governance/skills/impeccable.md"
  "sds-dev-governance/skills/gstack.md"
  "sds-dev-governance/skills/skillui.md"
  "sds-dev-governance/skills/design-references.md"
  "sds-dev-governance/skills/graphify.md"
  "sds-dev-governance/skills/vercel-skills.md"
  "sds-dev-governance/skills/r8-analyzer.md"
  "sds-dev-governance/skills/runtime/sds-r8-analyzer/SKILL.md"
  "sds-dev-governance/skills/runtime/sds-r8-analyzer/LICENSE.txt"
  "sds-dev-governance/skills/runtime/sds-r8-analyzer/NOTICE.md"
  "sds-dev-governance/skills/runtime/sds-r8-analyzer/agents/openai.yaml"
  "sds-dev-governance/skills/runtime/sds-r8-analyzer/references/analysis-workflow.md"
  "sds-dev-governance/skills/runtime/sds-r8-analyzer/references/report-format.md"
  "sds-dev-governance/scripts/install-skills.sh"
  "sds-dev-governance/skills/threejs.md"
  "sds-dev-governance/skills/install-catalog.tsv"
  "sds-dev-governance/plugins/README.md"
  "sds-dev-governance/plugins/base-catalog.tsv"
  "sds-dev-governance/scripts/install-plugins.sh"
  "sds-dev-governance/scripts/plugin-status.sh"
  "sds-dev-governance/skills/spline.md"
  "sds-dev-governance/skills/pstack.md"
  "sds-dev-governance/skills/cross-agent-availability.md"
  "sds-dev-governance/skills/INDEX.md"
  "sds-dev-governance/skills/cross-agent-portability.tsv"
  "sds-dev-governance/scripts/sync-agent-skills.sh"
  "sds-dev-governance/scripts/generate-skills-index.sh"
  "sds-dev-governance/scripts/install-graphify.sh"
  "sds-dev-governance/scripts/governance-copies.sh"
  "sds-dev-governance/scripts/gh-safe.sh"
  "sds-dev-governance/scripts/git-safe-push.sh"
  "sds-dev-governance/scripts/install-git-guardrails.sh"
  "sds-dev-governance/scripts/apply-github-guardrails.sh"
  "sds-dev-governance/github/ruleset-anti-deletion.json"
  "sds-dev-governance/hooks/pre-push"
  "sds-dev-governance/tests/test-github-guardrails.sh"
  "sds-dev-governance/tests/test-skill-bootstrap.sh"
  "sds-dev-governance/tests/test-plugin-bootstrap.sh"
  "sds-dev-governance/tests/test-governance-copies.sh"
  "sds-dev-governance/tests/fixtures/fake-gh.sh"
  "sds-dev-governance/tests/fixtures/fake-git.sh"
  "sds-dev-governance/resources/index-of-resources-and-working-patters.md"
  "sds-dev-governance/resources/frontend-patterns/ui-components/expandable-search-filter-panel/INDEX-AND-HOW-TO-USE-THEM.md"
  "sds-dev-governance/resources/frontend-patterns/ui-components/expandable-search-filter-panel/html/expandable-search-filter-panel.html"
  "sds-dev-governance/resources/frontend-patterns/ui-components/expandable-search-filter-panel/css/expandable-search-filter-panel.css"
  "sds-dev-governance/resources/frontend-patterns/ui-components/expandable-search-filter-panel/javascript/expandable-search-filter-panel.js"
  "sds-dev-governance/resources/frontend-patterns/ui-components/notification-toast-stack/INDEX-AND-HOW-TO-USE-THEM.md"
  "sds-dev-governance/resources/frontend-patterns/ui-components/notification-toast-stack/html/notification-toast-stack.html"
  "sds-dev-governance/resources/frontend-patterns/ui-components/notification-toast-stack/css/notification-toast-stack.css"
  "sds-dev-governance/resources/frontend-patterns/ui-components/notification-toast-stack/javascript/notification-toast-stack.js"
  "sds-dev-governance/resources/frontend-patterns/ui-components/procedural-horizon-hero/INDEX-AND-HOW-TO-USE-THEM.md"
  "sds-dev-governance/resources/frontend-patterns/site-compositions/grounded-editorial-studio/INDEX-AND-HOW-TO-USE-THEM.md"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/INDEX-AND-HOW-TO-USE-THEM.md"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/README.md"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/index.template.html"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/build.mjs"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/package.json"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/index.html"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/site-content.js"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/app.js"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/styles.css"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/hero-boot.js"
  "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/hero-scene.js"
  "sds-dev-governance/scaffold/docs/governance/capability-registry.md"
  "sds-dev-governance/scaffold/docs/governance/governance-change-log.md"
  "sds-dev-governance/practices/13-multi-agent.md"
  "sds-dev-governance/practices/14-phase-commit-report.md"
  "sds-dev-governance/practices/15-contract-authority.md"
  "sds-dev-governance/practices/modules/11-capability-admission.md"
  "sds-dev-governance/practices/modules/07-mcp-control.md"
  "sds-dev-governance/practices/modules/11-governance-distribution.md"
  "sds-dev-governance/adapters/nested/CLAUDE.md"
  "sds-dev-governance/adapters/nested/AGENTS.md"
  "sds-dev-governance/adapters/nested/GEMINI.md"
  "sds-dev-governance/adapters/nested/cursor-rules/sds-governance.mdc"
  "CLAUDE.md"
  "AGENTS.md"
  "GEMINI.md"
  ".cursor/rules/sds-governance.mdc"
  "check-governance.sh"
  "docs/governance/README.md"
  "docs/governance/capability-registry.md"
  "docs/governance/governance-change-log.md"
  "docs/governance/evaluation/README.md"
  "docs/governance/evaluation/output-review-template.md"
  "docs/governance/evaluation/improvement-backlog.md"
  "docs/memory/README.md"
  "docs/memory/frontend.md"
  "docs/memory/backend.md"
  "docs/memory/api-openapi.md"
  "docs/memory/database.md"
  "docs/memory/security.md"
  "docs/memory/deployment.md"
  "sds-dev-governance/scaffold/docs/memory/index-area.md.template"
  "sds-dev-governance/scaffold/docs/prompts/preface-template.md"
  "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md"
  "sds-dev-governance/scaffold/docs/prompts/preflight-module-index.md"
  "sds-dev-governance/scaffold/docs/prompts/preflight-frontend-ui.md"
  "sds-dev-governance/scaffold/docs/prompts/preflight-frontend-security.md"
  "docs/prompts/prompt-revision-preflight.md"
  "docs/prompts/preflight-module-index.md"
  "docs/prompts/preflight-frontend-ui.md"
  "docs/prompts/preflight-frontend-security.md"
  "sds-dev-governance/examples/prompts/level-2-feature.md"
  "sds-dev-governance/examples/prompts/level-3-cross-layer-change.md"
  "docs/prompts-output-template/output-template.md"
  "docs/prompts-output/README.md"
  "docs/features/features-index.md"
  "docs/contracts/README.md"
  "docs/runbooks/README.md"
  "docs/decisions/DEC-000-template.md"
  "sds-dev-governance/agentic-engineering/README.md"
  "sds-dev-governance/agentic-engineering/ai-code-assurance.md"
  "sds-dev-governance/agentic-engineering/check-ai-pr-assurance.sh"
  "sds-dev-governance/scaffold/.github/PULL_REQUEST_TEMPLATE.md"
  "sds-dev-governance/scaffold/.gitlab/merge_request_templates/Default.md"
  ".github/PULL_REQUEST_TEMPLATE.md"
  ".gitlab/merge_request_templates/Default.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  require_file "$file"
done

echo ""
echo "=== Project Policies ==="
check_policy_folders

echo ""
echo "=== Required Rules ==="
contains "sds-dev-governance/GOVERNANCE.md" "SDS Governance" "GOVERNANCE.md has SDS title"
contains "sds-dev-governance/GOVERNANCE.md" "Proportional Governance" "GOVERNANCE.md has proportional governance"
contains "sds-dev-governance/GOVERNANCE.md" "Non-Regression Premise" "GOVERNANCE.md has non-regression premise"
contains "sds-dev-governance/GOVERNANCE.md" "Prompt And Contract Discipline" "GOVERNANCE.md has prompt and contract discipline"
contains "sds-dev-governance/GOVERNANCE.md" "Contract Authority And Contradiction Gate" "GOVERNANCE.md has contract gate router"
contains "sds-dev-governance/GOVERNANCE.md" "lazy-load router" "contract gate router is explicitly lazy-loaded"
contains "sds-dev-governance/GOVERNANCE.md" "Project Bootstrap Equivalence" "GOVERNANCE.md has bootstrap equivalence"
contains "sds-dev-governance/GOVERNANCE.md" "Frontend Constants And Business Portability" "GOVERNANCE.md has frontend constants/business portability"
contains "sds-dev-governance/GOVERNANCE.md" "practices/INDEX.md" "GOVERNANCE.md routes practice loading through INDEX"
contains "sds-dev-governance/practices/INDEX.md" "only practice-loading entrypoint" "practice INDEX is the sole loading entrypoint"
contains "sds-dev-governance/practices/INDEX.md" "Do not load when|Do not load" "practice INDEX includes no-load semantics"
contains "sds-dev-governance/practices/INDEX.md" "Future practices and fail-closed behavior" "practice INDEX defines future/fail-closed routing"
contains "sds-dev-governance/practices/RULE-COVERAGE.md" "Not part of the default read order" "rule coverage ledger is excluded from default context"
check_practice_router
check_capability_ledger
check_capability_admission_module
check_github_deletion_guardrails
check_verification_proportionality
check_max_words "sds-dev-governance/GOVERNANCE.md" "$MAX_GOVERNANCE_WORDS" "GOVERNANCE.md context budget"
check_max_words "sds-dev-governance/practices/INDEX.md" "$MAX_PRACTICE_INDEX_WORDS" "practice INDEX context budget"
always_read_words=$((
  $(wc -w < "$TARGET_DIR/sds-dev-governance/GOVERNANCE.md") +
  $(wc -w < "$TARGET_DIR/sds-dev-governance/practices/INDEX.md") +
  $(wc -w < "$TARGET_DIR/sds-dev-governance/skills/README.md")
))
if [ "$always_read_words" -le "$MAX_ALWAYS_READ_WORDS" ]; then
  pass "always-read SDS context budget ($always_read_words <= $MAX_ALWAYS_READ_WORDS words)"
else
  fail "always-read SDS context budget exceeded ($always_read_words > $MAX_ALWAYS_READ_WORDS words)"
fi
agentic_headings="$(grep -c '^## Agentic Engineering$' "$TARGET_DIR/sds-dev-governance/GOVERNANCE.md" || true)"
if [ "$agentic_headings" -eq 1 ]; then
  pass "GOVERNANCE.md has one Agentic Engineering section"
else
  fail "GOVERNANCE.md must have exactly one Agentic Engineering section (found $agentic_headings)"
fi
contains "sds-dev-governance/practices/02-prompt-system.md" "Prompts as Deltas, Not Duplicate Sources of Truth" "prompt practice has delta discipline"
contains "sds-dev-governance/practices/02-prompt-system.md" "Context-Driven Extensibility" "prompt practice has context-driven extensibility"
contains "sds-dev-governance/practices/02-prompt-system.md" "Contract Artifacts and Validators Move Together" "prompt practice has contract artifact co-review"
contains "sds-dev-governance/practices/02-prompt-system.md" "Frontend Constants and Business Portability in Prompts" "prompt practice has frontend constants gate"
contains "sds-dev-governance/practices/02-prompt-system.md" "Sufijos pre-ejecucion" "prompt practice has pre-execution suffix naming"
contains "sds-dev-governance/practices/02-prompt-system.md" "Inserciones pre-iteracion planificada" "prompt practice has planned-iteration insertion naming"
contains "sds-dev-governance/resources/index-of-resources-and-working-patters.md" "nomenclature-explanation.md" "resources index lists nomenclature explanation"
contains "sds-dev-governance/resources/index-of-resources-and-working-patters.md" "expandable-search-filter-panel" "resources index lists expandable search/filter panel"
contains "sds-dev-governance/resources/frontend-patterns/ui-components/expandable-search-filter-panel/INDEX-AND-HOW-TO-USE-THEM.md" "autocomplete" "expandable filter pattern keeps autocomplete in filter scope"
contains "sds-dev-governance/init-project-prompt.md" "expandable-search-filter-panel" "init prompt preserves expandable search/filter resource"
contains "sds-dev-governance/resources/index-of-resources-and-working-patters.md" "notification-toast-stack" "resources index lists notification toast stack"
contains "sds-dev-governance/resources/frontend-patterns/ui-components/notification-toast-stack/INDEX-AND-HOW-TO-USE-THEM.md" "notificaciones-01" "notification toast pattern keeps its discovery tag"
contains "sds-dev-governance/resources/frontend-patterns/ui-components/notification-toast-stack/INDEX-AND-HOW-TO-USE-THEM.md" "3.5 seconds" "notification toast pattern documents readable duration"
contains "sds-dev-governance/init-project-prompt.md" "notification-toast-stack" "init prompt preserves notification toast resource"
contains "sds-dev-governance/resources/index-of-resources-and-working-patters.md" "procedural-horizon-hero" "resources index lists procedural horizon hero"
contains "sds-dev-governance/resources/frontend-patterns/ui-components/procedural-horizon-hero/INDEX-AND-HOW-TO-USE-THEM.md" "Static fallback remains complete" "procedural hero preserves fallback acceptance"
contains "sds-dev-governance/resources/index-of-resources-and-working-patters.md" "grounded-editorial-studio" "resources index lists grounded editorial composition"
contains "sds-dev-governance/resources/frontend-patterns/site-compositions/grounded-editorial-studio/INDEX-AND-HOW-TO-USE-THEM.md" "Empirical acceptance protocol" "studio composition preserves empirical gate"
contains "sds-dev-governance/resources/index-of-resources-and-working-patters.md" "grounded-studio-reference" "resources index lists grounded studio sample"
contains "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/build.mjs" "Unresolved template" "grounded studio generator rejects unresolved slots"
contains "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/build.mjs" "Unsupported link destination" "grounded studio generator rejects unsupported link destinations"
contains "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/hero-boot.js" "prefers-reduced-motion" "grounded studio enhancement respects reduced motion"
contains "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/hero-boot.js" "removeEventListener\('visibilitychange'" "grounded studio teardown removes visibility listener"
contains "sds-dev-governance/resources/frontend-external-sample-code/grounded-studio-reference/demo/hero-boot.js" "cancelAnimationFrame" "grounded studio teardown cancels hand-over frame"
contains "sds-dev-governance/init-project-prompt.md" "grounded-studio-reference" "init prompt preserves grounded studio sample"
for portable_adapter in sds-dev-governance/adapters/CLAUDE.md sds-dev-governance/adapters/AGENTS.md sds-dev-governance/adapters/GEMINI.md; do
  contains "$portable_adapter" "NOMBRE_PROYECTO" "$portable_adapter preserves project-name placeholder"
  contains "$portable_adapter" "RUTA_LOCAL" "$portable_adapter preserves project-root placeholder"
done
if grep -r -n "upnews\|Development/upnews" "$TARGET_DIR/sds-dev-governance/adapters" >"$CHECK_TMP/adapter-identity" 2>/dev/null; then
  fail "portable adapters contain leaked project identity/path"
else
  pass "portable adapters contain no leaked project identity/path"
fi
rm -f "$CHECK_TMP/adapter-identity"
contains "sds-dev-governance/agentic-engineering/ai-code-assurance.md" "La Regla de Oro" "agentic-engineering has the Golden Rule"
contains ".github/PULL_REQUEST_TEMPLATE.md" "sds-ai-assurance:v1" "PR template carries the AI-assurance machine marker"
contains "sds-dev-governance/resources/nomenclature-explanation.md" "Planned-Iteration Insertions" "nomenclature explanation documents planned-iteration insertions"
contains "sds-dev-governance/practices/02-prompt-system.md" "Prefacio no-ejecutable|PREFACE.*NON-EXECUTABLE" "prompt practice documents non-executable preface"
contains "sds-dev-governance/practices/02-prompt-system.md" "Revision pre-ejecucion de prompts" "prompt practice documents pre-execution review"
contains "sds-dev-governance/practices/02-prompt-system.md" "practices/15-contract-authority.md" "prompt practice routes contract authority conditionally"
contains "sds-dev-governance/practices/15-contract-authority.md" "Do not preload this file" "contract authority practice forbids static preload"
contains "sds-dev-governance/practices/15-contract-authority.md" "BLOCKED — OWNER CONTRACT DECISION REQUIRED" "contract authority practice defines owner-decision verdict"
for resolution_class in ERROR CLARIFICATION ADDITION MODIFICATION IMPROVEMENT; do
  contains "sds-dev-governance/practices/15-contract-authority.md" "$resolution_class" "contract authority practice defines $resolution_class"
done
contains "sds-dev-governance/GOVERNANCE.md" "docs/prompts-output/<PROMPT_ID>/tmp/" "GOVERNANCE.md documents prompt tmp memory location"
contains "sds-dev-governance/practices/01-agent-memory.md" "Memoria temporal de ejecucion de prompts" "agent memory practice documents prompt tmp memory"
contains "sds-dev-governance/practices/03-output-traceability.md" "Tmp/scratch memory y evidencia" "output traceability practice documents tmp/evidence"
contains "sds-dev-governance/practices/09-docs-structure.md" "docs/prompts-output/<PROMPT_ID>/tmp/" "docs structure practice routes prompt tmp memory"
contains "sds-dev-governance/practices/11-governance-evolution.md" "Consolidacion tmp/evidence" "governance evolution practice documents tmp consolidation"
contains "sds-dev-governance/practices/14-phase-commit-report.md" "Relacion con tmp/scratch memory" "phase report practice links tmp memory"
contains "sds-dev-governance/init.sh" "tmp/evidence continuity" "init.sh surfaces prompt tmp/evidence continuity"
contains "sds-dev-governance/init-project-prompt.md" "docs/prompts-output/<PROMPT_ID>/tmp/" "init prompt surfaces prompt tmp/evidence continuity"
contains "sds-dev-governance/practices/11-governance-evolution.md" "governance-change-log" "governance evolution practice documents detailed change log"
contains "docs/governance/governance-change-log.md" "Prompt base" "project governance log tracks prompt base"
contains "docs/governance/governance-change-log.md" "Sistema de utilizacion" "project governance log tracks usage system"
contains "docs/governance/governance-change-log.md" "Fecha de incorporacion" "project governance log tracks incorporation date"
contains "sds-dev-governance/scaffold/docs/governance/governance-change-log.md" "Ficheros tocados" "scaffold governance log tracks touched files"
contains "sds-dev-governance/scaffold/docs/prompts/preface-template.md" "PREFACE.*NON-EXECUTABLE" "preface template has non-executable marker"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "PRE-EXECUTION REVIEW MODE" "preflight prompt has review mode"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "Do \\*\\*not\\*\\* execute the target prompt" "preflight prompt forbids execution"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "Selective Preflight Add-ons" "preflight prompt documents selective add-ons"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "preflight-module-index.md" "preflight prompt references module index"
contains "sds-dev-governance/scaffold/docs/prompts/preflight-module-index.md" "Module Graph" "preflight module index has graph"
contains "sds-dev-governance/scaffold/docs/prompts/preflight-module-index.md" "Routing Table" "preflight module index has routing table"
contains "sds-dev-governance/scaffold/docs/prompts/preflight-module-index.md" "future preflight modules|future add-ons|future modules" "preflight module index covers future modules"
contains "sds-dev-governance/scaffold/docs/prompts/preflight-module-index.md" "Do not load all modules" "preflight module index forbids loading all modules"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "preflight-frontend-ui.md" "preflight prompt references frontend UI add-on"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "preflight-frontend-security.md" "preflight prompt references frontend security add-on"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "practices/15-contract-authority.md" "preflight template loads contract authority gate"
contains "sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" "BLOCKED — OWNER CONTRACT DECISION REQUIRED" "preflight template defines owner-decision verdict"
contains "docs/prompts/prompt-revision-preflight.md" "PRE-EXECUTION REVIEW MODE" "project preflight prompt has review mode"
contains "docs/prompts/prompt-revision-preflight.md" "Selective Preflight Add-ons" "project preflight prompt documents selective add-ons"
contains "docs/prompts/prompt-revision-preflight.md" "practices/15-contract-authority.md" "project preflight loads contract authority gate"
contains "docs/prompts/prompt-revision-preflight.md" "BLOCKED — OWNER CONTRACT DECISION REQUIRED" "project preflight defines owner-decision verdict"
contains "docs/prompts/preflight-module-index.md" "Module Graph" "project preflight module index has graph"
contains "docs/prompts/preflight-module-index.md" "Do not load all modules" "project preflight module index forbids loading all modules"
contains "docs/prompts/preflight-frontend-ui.md" "constants/config/i18n" "frontend UI preflight covers constants/config/i18n"
contains "docs/prompts/preflight-frontend-ui.md" "hardcoded" "frontend UI preflight covers hardcoded rendered information"
contains "docs/prompts/preflight-frontend-security.md" "OWASP" "frontend security preflight covers OWASP"
contains "docs/prompts/preflight-frontend-security.md" "CSRF" "frontend security preflight covers CSRF"
contains "docs/prompts/preflight-frontend-security.md" "XSS" "frontend security preflight covers XSS"
contains "docs/prompts/preflight-frontend-security.md" "CSP" "frontend security preflight covers CSP"
contains "CLAUDE.md" "dev preflight" "Claude adapter has development preflight trigger"
contains "AGENTS.md" "dev preflight" "Codex adapter has development preflight trigger"
contains "GEMINI.md" "dev preflight" "Gemini adapter has development preflight trigger"
contains "sds-dev-governance/adapters/CLAUDE.md" "dev preflight" "Claude adapter template has development preflight trigger"
contains "sds-dev-governance/adapters/AGENTS.md" "dev preflight" "Codex adapter template has development preflight trigger"
contains "sds-dev-governance/adapters/GEMINI.md" "dev preflight" "Gemini adapter template has development preflight trigger"
contains ".cursor/rules/sds-governance.mdc" "dev preflight" "Cursor root adapter has development preflight trigger"
contains "sds-dev-governance/adapters/cursor-rules/sds-governance.mdc" "dev preflight" "Cursor adapter template has development preflight trigger"
contains "CLAUDE.md" "preflight-module-index.md" "Claude root adapter references preflight module index"
contains "AGENTS.md" "preflight-module-index.md" "Codex root adapter references preflight module index"
contains "GEMINI.md" "preflight-module-index.md" "Gemini root adapter references preflight module index"
contains ".cursor/rules/sds-governance.mdc" "preflight-module-index.md" "Cursor root adapter references preflight module index"
contains "sds-dev-governance/adapters/CLAUDE.md" "preflight-module-index.md" "Claude adapter template references preflight module index"
contains "sds-dev-governance/adapters/AGENTS.md" "preflight-module-index.md" "Codex adapter template references preflight module index"
contains "sds-dev-governance/adapters/GEMINI.md" "preflight-module-index.md" "Gemini adapter template references preflight module index"
contains "sds-dev-governance/adapters/cursor-rules/sds-governance.mdc" "preflight-module-index.md" "Cursor adapter template references preflight module index"
contains "sds-dev-governance/adapters/nested/CLAUDE.md" "preflight-module-index.md" "nested Claude adapter references preflight module index"
contains "sds-dev-governance/adapters/nested/AGENTS.md" "preflight-module-index.md" "nested Codex adapter references preflight module index"
contains "sds-dev-governance/adapters/nested/GEMINI.md" "preflight-module-index.md" "nested Gemini adapter references preflight module index"
contains "sds-dev-governance/adapters/nested/cursor-rules/sds-governance.mdc" "preflight-module-index.md" "nested Cursor adapter references preflight module index"

CONTRACT_GATE_ADAPTERS=(
  "CLAUDE.md"
  "AGENTS.md"
  "GEMINI.md"
  ".cursor/rules/sds-governance.mdc"
  "sds-dev-governance/adapters/CLAUDE.md"
  "sds-dev-governance/adapters/AGENTS.md"
  "sds-dev-governance/adapters/GEMINI.md"
  "sds-dev-governance/adapters/cursor-rules/sds-governance.mdc"
  "sds-dev-governance/adapters/nested/CLAUDE.md"
  "sds-dev-governance/adapters/nested/AGENTS.md"
  "sds-dev-governance/adapters/nested/GEMINI.md"
  "sds-dev-governance/adapters/nested/cursor-rules/sds-governance.mdc"
)
for adapter in "${CONTRACT_GATE_ADAPTERS[@]}"; do
  contains "$adapter" "Contract Authority And Contradiction Gate" "$adapter carries contract gate trigger"
  contains "$adapter" "15-contract-authority.md" "$adapter points to conditional contract authority practice"
  contains "$adapter" "do not preload|never preload" "$adapter forbids conditional-practice preload"
  contains "$adapter" "practices/INDEX.md" "$adapter points to selective practice router"
done

echo ""
echo "=== Selective Practice Loading Drift ==="
ACTIVE_ROUTING_FILES=(
  "$TARGET_DIR/sds-dev-governance/GOVERNANCE.md"
  "$TARGET_DIR/sds-dev-governance/practices/13-multi-agent.md"
  "$TARGET_DIR/sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md"
  "$TARGET_DIR/docs/prompts/prompt-revision-preflight.md"
)
for adapter in "${CONTRACT_GATE_ADAPTERS[@]}"; do
  ACTIVE_ROUTING_FILES+=("$TARGET_DIR/$adapter")
done
if grep -E -n 'All non-conditional|all non-conditional|Load all non-conditional|load all non-conditional' "${ACTIVE_ROUTING_FILES[@]}" >"$CHECK_TMP/preload" 2>/dev/null; then
  cat "$CHECK_TMP/preload"
  fail "obsolete blanket practice preload instruction found"
else
  pass "obsolete blanket practice preload instruction absent"
fi
rm -f "$CHECK_TMP/preload"
contains "sds-dev-governance/examples/prompts/level-2-feature.md" "PREFACE.*NON-EXECUTABLE" "level-2 example has non-executable preface"
contains "sds-dev-governance/examples/prompts/level-3-cross-layer-change.md" "PREFACE.*NON-EXECUTABLE" "level-3 example has non-executable preface"
contains "sds-dev-governance/practices/06-non-regression.md" "Discovery Before Hardcoding" "non-regression practice has discovery before hardcoding"
contains "sds-dev-governance/practices/06-non-regression.md" "Cross-Layer Contract Matrix" "non-regression practice has cross-layer matrix"
contains "sds-dev-governance/practices/06-non-regression.md" "UI-to-Data Lineage and Traceability" "non-regression practice has UI-to-data lineage"
contains "sds-dev-governance/practices/06-non-regression.md" "Frontend Constants, Assets, and Business Portability" "non-regression practice has frontend constants/assets portability"
contains "sds-dev-governance/practices/06-non-regression.md" "Persistence Race Safety" "non-regression practice has persistence race safety"
contains "sds-dev-governance/practices/06-non-regression.md" "State Mutation Resilience" "non-regression practice has state mutation resilience"
contains "sds-dev-governance/practices/07-security-baseline.md" "No Hardcoded Secrets or Credentials" "security practice has no-hardcoded-secrets rule"
contains "sds-dev-governance/practices/07-security-baseline.md" "Secure Failure and Degraded Operation" "security practice has degraded-operation rule"
contains "sds-dev-governance/practices/10-pre-pr-checklist.md" "user-facing assets/photos" "pre-PR checklist covers frontend constants and assets"
contains "CLAUDE.md" "sds-dev-governance/GOVERNANCE.md" "CLAUDE.md points to SDS governance"
contains "AGENTS.md" "sds-dev-governance/GOVERNANCE.md" "AGENTS.md points to SDS governance"
contains "GEMINI.md" "sds-dev-governance/GOVERNANCE.md" "GEMINI.md points to SDS governance"
contains ".cursor/rules/sds-governance.mdc" "sds-dev-governance/GOVERNANCE.md" "Cursor adapter points to SDS governance"
contains "CLAUDE.md" "business-info entry point|Business info entry point|Frontend Constants" "CLAUDE.md includes frontend constants guidance"
contains "AGENTS.md" "Frontend Constants" "AGENTS.md includes frontend constants guidance"
contains "GEMINI.md" "Frontend Constants" "GEMINI.md includes frontend constants guidance"
contains ".cursor/rules/sds-governance.mdc" "Frontend Constants" "Cursor adapter includes frontend constants guidance"
contains "sds-dev-governance/skills/README.md" "Impeccable" "skills index includes Impeccable"
contains "sds-dev-governance/skills/README.md" "gstack" "skills index includes gstack"
contains "sds-dev-governance/skills/README.md" "skillui" "skills index includes skillui"
contains "sds-dev-governance/skills/README.md" "Graphify" "skills index includes Graphify"
contains "sds-dev-governance/skills/README.md" "Vercel Agent Skills" "skills index includes Vercel Agent Skills"
contains "sds-dev-governance/skills/README.md" "r8-analyzer" "skills index includes r8-analyzer"
contains "sds-dev-governance/skills/README.md" "Three.js" "skills index includes Three.js"
contains "sds-dev-governance/skills/install-catalog.tsv" '^impeccable\|impeccable\|project\|' "skill catalog includes Impeccable"
contains "sds-dev-governance/skills/install-catalog.tsv" '^gstack\|gstack\|user\|' "skill catalog includes gstack"
contains "sds-dev-governance/skills/install-catalog.tsv" '^skillui\|skillui\|user-cli\|' "skill catalog includes skillui"
contains "sds-dev-governance/skills/install-catalog.tsv" '^threejs\|threejs\|user\|' "skill catalog includes Three.js"
contains "sds-dev-governance/skills/install-catalog.tsv" '^graphify\|graphify\|project-cli\|' "skill catalog includes Graphify"
contains "sds-dev-governance/scripts/install-skills.sh" 'IMPECCABLE_VERSION=.*4\.1\.1' "2026-08-20 Impeccable pin is preserved"
contains "sds-dev-governance/scripts/install-skills.sh" 'SKILLUI_VERSION=.*1\.3\.4' "2026-08-20 skillui pin is preserved"
contains "sds-dev-governance/scripts/install-skills.sh" 'GSTACK_REVISION=.*ce5fbfa99ffb82fe445cae23a398a130dd643952' "2026-08-20 gstack pin is preserved"
contains "sds-dev-governance/scripts/install-skills.sh" 'THREEJS_REVISION=.*6c190f0db95d6e4b77d7843d181c6d3325c09d0e' "2026-08-20 Three.js pin is preserved"
contains "sds-dev-governance/plugins/README.md" "Do not preload" "plugin router is explicitly lazy"
contains "sds-dev-governance/plugins/base-catalog.tsv" '^figma\|figma\|user\|claude,codex\|https://mcp\.figma\.com/mcp\|figma@claude-plugins-official\|design,make$' "base plugin catalog includes official Figma Design+Make for Claude and Codex"
contains ".gitignore" '^\.sds/state/$' "project ignores local base-plugin tracking"
contains "sds-dev-governance/init-project-prompt.md" '^\.sds/state/$' "init prompt ignores local base-plugin tracking"
contains "sds-dev-governance/skills/README.md" "Spline" "skills index includes Spline"
contains "sds-dev-governance/skills/README.md" "Cross-agent bridge" "skills index includes the cross-agent bridge"
contains "sds-dev-governance/skills/README.md" "INDEX.md" "skills index points to the ordered skill index"
contains "sds-dev-governance/skills/README.md" "docs/governance/capability-registry.md" "skills router points to project capability ledger"
contains "docs/governance/capability-registry.md" "If this ledger is missing" "project capability ledger is fail-closed"
graphify_update_hits=""
for graphify_adapter in CLAUDE.md AGENTS.md GEMINI.md .cursor/rules/graphify.mdc; do
  [ -f "$TARGET_DIR/$graphify_adapter" ] || continue
  graphify_adapter_hits="$(grep -E -nH 'After modifying code( files)?, run `graphify update' "$TARGET_DIR/$graphify_adapter" || true)"
  if [ -n "$graphify_adapter_hits" ]; then
    graphify_update_hits="${graphify_update_hits}${graphify_adapter_hits}"
  fi
done
if [ -n "$graphify_update_hits" ]; then
  fail "active adapters retain an imperative graphify update instruction"
  printf '%s\n' "$graphify_update_hits"
else
  pass "active adapters do not imperatively invoke graphify update"
fi
contains "sds-dev-governance/skills/graphify.md" "graphifyy" "Graphify skill documents package"
contains "sds-dev-governance/skills/vercel-skills.md" "vercel-labs/agent-skills" "Vercel skill documents upstream source"
contains "sds-dev-governance/skills/vercel-skills.md" "NOT_EVALUATED" "Vercel skill defers to project capability ledger"
contains "sds-dev-governance/skills/r8-analyzer.md" "github.com/android/skills" "r8-analyzer documents official upstream source"
contains "sds-dev-governance/skills/r8-analyzer.md" "observed upstream bundle contains" "r8-analyzer documents the verified upstream limitation"
contains "sds-dev-governance/skills/r8-analyzer.md" "NOT_EVALUATED" "r8-analyzer defers to project capability ledger"
contains "sds-dev-governance/skills/runtime/sds-r8-analyzer/SKILL.md" "name: sds-r8-analyzer" "bundled r8-analyzer has the custom non-colliding name"
contains "sds-dev-governance/skills/runtime/sds-r8-analyzer/SKILL.md" "They are intentionally" "bundled r8-analyzer excludes unavailable scripts"
contains "sds-dev-governance/scripts/install-skills.sh" "bundled-only" "skills installer supports bootstrap-safe bundled mode"
contains "sds-dev-governance/scripts/install-skills.sh" "CLAUDE_SKILLS_HOME" "skills installer targets Claude Code globally"
contains "sds-dev-governance/scripts/install-skills.sh" "CODEX_SKILLS_HOME" "skills installer targets Codex globally"
contains "sds-dev-governance/init.sh" "bundled-only" "init.sh documents bundled-only opt-out"
contains "sds-dev-governance/init.sh" "skills/r8-analyzer.md" "init.sh requires the r8-analyzer guide"
contains "sds-dev-governance/init-project-prompt.md" "r8-analyzer.md" "init prompt preserves the r8-analyzer guide"
contains "sds-dev-governance/skills/spline.md" "spline-mcp.cjs" "Spline skill documents the bundled MCP entrypoint"
contains "sds-dev-governance/skills/spline.md" "docs/governance/capability-registry.md" "Spline skill defers to project capability ledger"
contains "sds-dev-governance/skills/cross-agent-availability.md" "cross-agent-portability.tsv" "cross-agent doc names its policy file"
contains "sds-dev-governance/skills/cross-agent-availability.md" "fail-closed" "cross-agent policy is fail-closed"
contains "sds-dev-governance/skills/INDEX.md" "Generated file" "ordered skill index declares it is generated"
contains "sds-dev-governance/init.sh" "install-graphify.sh" "init.sh installs Graphify"
contains "sds-dev-governance/init.sh" 'SDS_INSTALL_SKILLS:-1' "init.sh enables the catalog by default"
contains "sds-dev-governance/init.sh" '\-\-skip-skills' "init.sh exposes an explicit catalog opt-out"
contains "sds-dev-governance/init.sh" 'install-skills.sh' "init.sh installs the declared catalog"
contains "sds-dev-governance/init.sh" 'SDS_INSTALL_PLUGINS:-1' "init.sh enables base plugins by default"
contains "sds-dev-governance/init.sh" '\-\-skip-plugins' "init.sh exposes an explicit plugin opt-out"
contains "sds-dev-governance/init.sh" 'install-plugins.sh' "init.sh installs the lazy base-plugin catalog"
contains "sds-dev-governance/init-project-prompt.md" "install-graphify.sh" "init prompt installs Graphify"
contains "sds-dev-governance/init-project-prompt.md" "install-plugins.sh" "init prompt installs base plugins"
# --- Skill identity, catalog authority and routing semantics ---
# Skill identity is a stable slug. Ordering belongs to generated indexes, never to a filename.
legacy_skill_names="$(find "$TARGET_DIR/sds-dev-governance/skills" -maxdepth 1 -type f -name '[0-9][0-9]-*' 2>/dev/null || true)"
if [ -n "$legacy_skill_names" ]; then
  fail "skill files still carry numeric identity prefixes"
  printf '%s\n' "$legacy_skill_names"
else
  pass "skill files use stable semantic slugs"
fi

legacy_skill_refs="$(grep -rEn '(^|[^0-9a-zA-Z_-])0[0-9]-(impeccable|gstack|skillui|design-references|graphify|threejs|vercel-skills|r8-analyzer|spline|cross-agent-availability|INDEX)\.md' \
  "$TARGET_DIR/sds-dev-governance" \
  --include='*.md' --include='*.sh' --include='*.tsv' --include='*.mdc' \
  --exclude=CHANGELOG.md 2>/dev/null || true)"
if [ -n "$legacy_skill_refs" ]; then
  fail "runtime governance still references pre-slug skill filenames"
  printf '%s\n' "$legacy_skill_refs"
else
  pass "no runtime reference to pre-slug skill filenames outside the changelog"
fi

# The install catalog is the single owner of installation identity and of the capability -> document
# binding. Every row must be complete and must name a skill document that exists and is routed.
sds_catalog="$TARGET_DIR/sds-dev-governance/skills/install-catalog.tsv"
if [ ! -f "$sds_catalog" ]; then
  fail "skill install catalog missing"
else
  catalog_problems=""
  catalog_rows=0
  seen_capabilities=""
  while IFS='|' read -r capability handler scope harnesses doc extra; do
    case "$capability" in ""|\#*) continue ;; esac
    catalog_rows=$((catalog_rows + 1))
    if [ -z "$handler" ] || [ -z "$scope" ] || [ -z "$harnesses" ] || [ -z "$doc" ]; then
      catalog_problems="${catalog_problems}incomplete row: $capability"$'\n'
      continue
    fi
    if [ -n "$extra" ]; then
      catalog_problems="${catalog_problems}row has more than five columns: $capability"$'\n'
    fi
    case " $seen_capabilities " in
      *" $capability "*) catalog_problems="${catalog_problems}duplicate capability: $capability"$'\n' ;;
      *) seen_capabilities="$seen_capabilities $capability" ;;
    esac
    if [ ! -f "$TARGET_DIR/sds-dev-governance/skills/$doc" ]; then
      catalog_problems="${catalog_problems}$capability names a missing document: skills/$doc"$'\n'
    elif ! grep -Fq "$doc" "$TARGET_DIR/sds-dev-governance/skills/README.md"; then
      catalog_problems="${catalog_problems}$capability document is not routed from skills/README.md: skills/$doc"$'\n'
    fi
  done < "$sds_catalog"
  if [ -n "$catalog_problems" ]; then
    fail "skill install catalog is not internally consistent"
    printf '%s' "$catalog_problems"
  else
    pass "skill install catalog rows are complete, unique and routed ($catalog_rows capabilities)"
  fi
fi

# The portability policy owns propagation only. It must not restate installation columns.
if grep -Eq '^[^#][^\t]*\t[^\t]*\t[^\t]*\t' "$TARGET_DIR/sds-dev-governance/skills/cross-agent-portability.tsv" 2>/dev/null; then
  fail "cross-agent portability policy carries columns beyond skill/class/reason"
else
  pass "cross-agent portability policy owns propagation only"
fi
contains "sds-dev-governance/skills/README.md" "catalog-authority.md" "skills router routes to the catalog authority node"
contains "sds-dev-governance/practices/11-governance-evolution.md" "11-governance-distribution.md" "practice 11 routes the distribution/promotion module"
contains "sds-dev-governance/practices/INDEX.md" "distributing/promoting governance" "practice INDEX routes distribution/promotion work"
contains "sds-dev-governance/practices/modules/11-governance-distribution.md" "CANONICAL_MATCH" "distribution module defines the project-copy state model"
contains "sds-dev-governance/practices/modules/11-governance-distribution.md" "SPLIT_VERSION" "distribution module defines split-version detection"
contains "sds-dev-governance/practices/modules/11-governance-distribution.md" "estado distinto de cero" "distribution module requires a split to fail, not merely to be reported"
contains "sds-dev-governance/practices/modules/11-governance-distribution.md" "SUPERSEDED" "distribution module defines the regression/preservation classes"
contains "sds-dev-governance/practices/modules/11-governance-distribution.md" '`N`' "distribution module is written for an arbitrary number of projects"
contains "sds-dev-governance/practices/05-git-branching.md" "Escritores concurrentes" "practice 05 owns concurrent-writer isolation and staging"
contains "sds-dev-governance/practices/05-git-branching.md" 'git add -A' "practice 05 names the prohibited broad staging commands"
contains "sds-dev-governance/GOVERNANCE.md" "Minimum Sufficient Subgraph" "kernel states the minimum-sufficient-subgraph rule"
contains "sds-dev-governance/practices/12-governance-proportionality.md" "Subgrafo minimo suficiente" "practice 12 owns the sharding criteria"
contains "sds-dev-governance/skills/catalog-authority.md" "Load this only when" "catalog authority node declares its load trigger"
contains "sds-dev-governance/skills/catalog-authority.md" "install-catalog.tsv" "catalog authority node owns the ownership table"
contains "sds-dev-governance/skills/bootstrap-and-agents.md" "Load this only when" "skill bootstrap node declares its load trigger"

# Routing surfaces and the directory each one resolves its relative references against.
SDS_ROUTING_SURFACES="GOVERNANCE.md:. practices/INDEX.md:practices practices/RULE-COVERAGE.md:practices skills/README.md:skills plugins/README.md:plugins resources/index-of-resources-and-working-patters.md:resources"

# Emit every governance node a routing surface names: markdown link targets plus backticked paths
# that end in a governed extension. Project-scoped paths are excluded; they belong to the generated
# project, not to the kit, and are validated by the project checks above.
routing_refs_of() {
  local surface="$1"
  {
    grep -oE '\]\([^)]+\)' "$TARGET_DIR/sds-dev-governance/$surface" 2>/dev/null \
      | sed -e 's|^](||' -e 's|)$||' -e 's|#.*$||'
    grep -oE '`[A-Za-z0-9._/-]+\.(md|tsv|sh|json|mdc|txt|yaml|yml|html|css|js|mjs|template)`' \
      "$TARGET_DIR/sds-dev-governance/$surface" 2>/dev/null | tr -d '`'
  } \
    | sed -e 's|^sds-dev-governance/||' -e 's|[,;:]*$||' \
    | grep -vE '^https?://|^mailto:|^$|\*|\{|<|^\.\.?/?$' \
    | grep -vE '^(docs|\.cursor|\.sds|\.github|\.gitlab|src|db|node_modules)/' \
    | grep -vE '^(CLAUDE|AGENTS|GEMINI|DESIGN|PRODUCT)\.md$' \
    | sort -u || true
}

# Resolve a reference against the kit root, the surface's own directory, and finally as a path
# suffix anywhere in the kit. Routing surfaces legitimately name a leaf relative to a base given in
# a neighbouring column, so a suffix match still proves the node exists; a reference that matches
# nothing is a real dangling route.
SDS_KIT_FILES=""
routing_ref_resolves() {
  local ref="$1"
  local dir="$2"
  [ -e "$TARGET_DIR/sds-dev-governance/$ref" ] && return 0
  [ "$dir" != "." ] && [ -e "$TARGET_DIR/sds-dev-governance/$dir/$ref" ] && return 0
  if [ -z "$SDS_KIT_FILES" ]; then
    SDS_KIT_FILES="$(cd "$TARGET_DIR/sds-dev-governance" && find . -type f | sed 's|^\./||')"
  fi
  # Here-strings, not pipes: `grep -q` exits at the first match and a `printf |` writer then dies of SIGPIPE,
  # which `pipefail` reports as "not found" once the kit's file list outgrows the pipe buffer.
  grep -Fxq "$ref" <<<"$SDS_KIT_FILES" && return 0
  grep -Fq "/$ref" <<<"$SDS_KIT_FILES" && return 0
  return 1
}

# G1/G2 — every governance path named by a routing surface resolves.
routing_dangling=""
routing_refs=0
for surface_pair in $SDS_ROUTING_SURFACES; do
  surface="${surface_pair%%:*}"
  surface_dir="${surface_pair#*:}"
  if [ ! -f "$TARGET_DIR/sds-dev-governance/$surface" ]; then
    routing_dangling="${routing_dangling}missing routing surface: $surface"$'\n'
    continue
  fi
  while IFS= read -r ref; do
    [ -n "$ref" ] || continue
    routing_refs=$((routing_refs + 1))
    routing_ref_resolves "$ref" "$surface_dir" \
      || routing_dangling="${routing_dangling}$surface -> $ref"$'\n'
  done <<REFS
$(routing_refs_of "$surface")
REFS
done
if [ -n "$routing_dangling" ]; then
  fail "routing surfaces reference governance paths that do not exist"
  printf '%s' "$routing_dangling"
else
  pass "every governance path named by a routing surface resolves ($routing_refs references)"
fi

# G3 — no orphan knowledge: each routable node is reachable from its own entrypoint.
routing_orphans=""
for skill_doc in "$TARGET_DIR/sds-dev-governance/skills"/*.md; do
  skill_base="$(basename "$skill_doc")"
  case "$skill_base" in README.md|INDEX.md) continue ;; esac
  grep -Fq "$skill_base" "$TARGET_DIR/sds-dev-governance/skills/README.md" \
    || routing_orphans="${routing_orphans}skills/$skill_base is not routed from skills/README.md"$'\n'
done
for practice_doc in "$TARGET_DIR/sds-dev-governance/practices"/*.md; do
  practice_base="$(basename "$practice_doc")"
  case "$practice_base" in INDEX.md|RULE-COVERAGE.md) continue ;; esac
  grep -Fq "$practice_base" "$TARGET_DIR/sds-dev-governance/practices/INDEX.md" \
    || routing_orphans="${routing_orphans}practices/$practice_base is not routed from practices/INDEX.md"$'\n'
done
for practice_module in "$TARGET_DIR/sds-dev-governance/practices/modules"/*.md; do
  [ -f "$practice_module" ] || continue
  module_base="$(basename "$practice_module")"
  if ! grep -rFql "modules/$module_base" "$TARGET_DIR/sds-dev-governance/practices" "$TARGET_DIR/sds-dev-governance/GOVERNANCE.md" >/dev/null 2>&1; then
    routing_orphans="${routing_orphans}practices/modules/$module_base is not routed from any practice or the kernel"$'\n'
  fi
done
if [ -n "$routing_orphans" ]; then
  fail "routable governance nodes are unreachable from their entrypoint"
  printf '%s' "$routing_orphans"
else
  pass "every skill, practice and practice module is reachable from its entrypoint"
fi

# G4 — selectivity: a representative task must route to its node and not to unrelated specialists.
route_matches() {
  local term="$1"
  local surface_pair surface surface_dir
  for surface_pair in $SDS_ROUTING_SURFACES; do
    surface="${surface_pair%%:*}"
    surface_dir="${surface_pair#*:}"
    [ -f "$TARGET_DIR/sds-dev-governance/$surface" ] || continue
    grep -hiE "$term" "$TARGET_DIR/sds-dev-governance/$surface" 2>/dev/null \
      | grep -oE '`[A-Za-z0-9._/-]+\.(md|tsv|sh)`|(sds-dev-governance/)?(practices|skills|plugins|resources)/[A-Za-z0-9._/-]+\.(md|tsv|sh)' \
      | tr -d '`' \
      | sed -e 's|^sds-dev-governance/||' -e 's|[,;:)]*$||' \
      | awk -v dir="$surface_dir" '{ if ($0 !~ /\//) { if (dir != ".") print dir "/" $0 } else print }' \
      || true
  done | sort -u
}

route_fixture() {
  local task="$1"
  local term="$2"
  local expected="$3"
  shift 3
  local matched forbidden
  matched="$(route_matches "$term" || true)"
  if ! printf '%s\n' "$matched" | grep -Fxq "$expected"; then
    fail "routing selectivity: '$task' does not route to $expected"
    return
  fi
  for forbidden in "$@"; do
    if printf '%s\n' "$matched" | grep -Fxq "$forbidden"; then
      fail "routing selectivity: '$task' also routes to unrelated $forbidden"
      return
    fi
  done
  pass "routing selectivity: '$task' -> $expected"
}
route_fixture "Android R8 shrinking review" 'R8 activation' "skills/r8-analyzer.md" "skills/spline.md" "skills/impeccable.md" "skills/pstack.md"
route_fixture "authored 3D or 2D asset work" 'Author 3D scenes' "skills/spline.md" "skills/r8-analyzer.md" "skills/impeccable.md" "skills/pstack.md"
route_fixture "schema or data migration" 'migrations' "practices/14-phase-commit-report.md" "skills/spline.md" "skills/r8-analyzer.md" "skills/pstack.md"
route_fixture "frontend visual work" 'UI projects, design audit' "skills/impeccable.md" "skills/r8-analyzer.md" "skills/spline.md" "skills/pstack.md"
route_fixture "secrets and permissions work" 'Secrets, auth, permissions' "practices/07-security-baseline.md" "skills/spline.md" "skills/impeccable.md" "skills/pstack.md"
route_fixture "knowledge-graph discovery" 'Auxiliary discovery' "skills/graphify.md" "skills/spline.md" "skills/r8-analyzer.md" "skills/pstack.md"
route_fixture "unknown subsystem investigation" 'Unknown subsystem' "skills/pstack.md" "skills/impeccable.md" "skills/r8-analyzer.md" "skills/spline.md" "skills/graphify.md"

# --- pstack: plugin skills routed declaratively; no installer, script, bridge or body dependency ---
contains "sds-dev-governance/skills/pstack.md" "painhardcore/pstack" "pstack node pins its source and revision"
contains "sds-dev-governance/skills/pstack.md" "NOT_EVALUATED" "pstack node defers to project capability ledger"
contains "sds-dev-governance/skills/pstack.md" "sin pstack" "pstack node defines the user exclusion"
contains "sds-dev-governance/skills/README.md" "sin pstack" "skills router carries the pstack exclusion trigger"
contains "sds-dev-governance/practices/03-output-traceability.md" "Restricciones activas del usuario" "continuity checkpoint keeps active user restrictions"
contains "sds-dev-governance/practices/13-multi-agent.md" "Delegation Brief" "delegation brief carries user restrictions"
for adapter in adapters/CLAUDE.md adapters/AGENTS.md adapters/GEMINI.md adapters/nested/CLAUDE.md adapters/nested/AGENTS.md adapters/nested/GEMINI.md; do
  contains "sds-dev-governance/$adapter" "skills/pstack.md" "$adapter routes pstack through the skills node"
done
pstack_bodies="$(grep -rlE '^name: (poteto-mode|how|why|recall|blast-radius|architect|arena|swarm|interrogate|teach|tdd|no-comments|typescript-best-practices|figure-it-out|show-me-your-work|create-verification-skill|maintain-verification-skill|unslop|bro|technical-writing|principle-[a-z-]+)$' \
  "$TARGET_DIR/sds-dev-governance" "$TARGET_DIR/docs/memory" 2>/dev/null || true)"
if [ -n "$pstack_bodies" ]; then
  fail "pstack skill bodies are embedded in governance or memory"
  printf '%s\n' "$pstack_bodies"
else
  pass "no pstack skill body is embedded in governance or project memory"
fi
pstack_runtime_refs="$(grep -rl 'pstack' "$TARGET_DIR/sds-dev-governance/scripts" "$TARGET_DIR/sds-dev-governance/init.sh" "$TARGET_DIR/sds-dev-governance/plugins" 2>/dev/null || true)"
if [ -n "$pstack_runtime_refs" ]; then
  fail "kit scripts, bootstrap or plugin catalog depend on pstack"
  printf '%s\n' "$pstack_runtime_refs"
else
  pass "no kit script, bootstrap or plugin catalog depends on pstack"
fi

# The N-project mechanism must not encode the current project set as an architectural assumption.
if grep -qiE '(FIELDS|AURAGENDA|UPNEWS|TERAGENDA|SOUTH.?DESERT)' "$TARGET_DIR/sds-dev-governance/scripts/governance-copies.sh" 2>/dev/null; then
  fail "governance copy discovery hard-codes current project names"
else
  pass "governance copy discovery is project-agnostic (0..N copies)"
fi

# Determinism is necessary but not sufficient: assert the generated index against the policy it
# derives from, using the machine-independent view so the result does not depend on what happens
# to be installed on the machine running the checker.
if [ -x "$TARGET_DIR/sds-dev-governance/scripts/generate-skills-index.sh" ]; then
  if "$TARGET_DIR/sds-dev-governance/scripts/generate-skills-index.sh" --check-policy >/dev/null 2>&1; then
    pass "generated skill index matches the cross-agent portability policy"
  else
    fail "generated skill index no longer matches skills/cross-agent-portability.tsv"
  fi
else
  fail "skill index generator is missing or not executable"
fi

if bash "$TARGET_DIR/sds-dev-governance/tests/test-skill-bootstrap.sh"; then
  pass "skill catalog and bootstrap tests pass"
else
  fail "skill catalog and bootstrap tests failed"
fi
if bash "$TARGET_DIR/sds-dev-governance/tests/test-plugin-bootstrap.sh"; then
  pass "base-plugin catalog and bootstrap tests pass"
else
  fail "base-plugin catalog and bootstrap tests failed"
fi
contains "sds-dev-governance/practices/INDEX.md" "13-multi-agent.md" "practice INDEX routes multi-agent practice"
contains "sds-dev-governance/README.md" "13-multi-agent.md" "README.md lists multi-agent practice"
contains "sds-dev-governance/practices/13-multi-agent.md" "GOVERNANCE.md" "multi-agent practice points to governance"
contains "sds-dev-governance/practices/13-multi-agent.md" "Nested Project Memory" "multi-agent practice documents nested memory"
contains "sds-dev-governance/practices/INDEX.md" "14-phase-commit-report.md" "practice INDEX routes phase commit report practice"
contains "sds-dev-governance/adapters/CLAUDE.md" "14-phase-commit-report.md" "Claude adapter carries phase report trigger"
contains "sds-dev-governance/adapters/AGENTS.md" "14-phase-commit-report.md" "Codex adapter carries phase report trigger"
contains "sds-dev-governance/adapters/GEMINI.md" "14-phase-commit-report.md" "Gemini adapter carries phase report trigger"
contains "CLAUDE.md" "Prompt Execution Continuity Trigger" "Claude root adapter carries prompt continuity trigger"
contains "AGENTS.md" "Prompt Execution Continuity Trigger" "Codex root adapter carries prompt continuity trigger"
contains "GEMINI.md" "Prompt Execution Continuity Trigger" "Gemini root adapter carries prompt continuity trigger"
contains ".cursor/rules/sds-governance.mdc" "Prompt Execution Continuity Trigger" "Cursor root adapter carries prompt continuity trigger"
contains "sds-dev-governance/adapters/CLAUDE.md" "Prompt Execution Continuity Trigger" "Claude adapter template carries prompt continuity trigger"
contains "sds-dev-governance/adapters/AGENTS.md" "Prompt Execution Continuity Trigger" "Codex adapter template carries prompt continuity trigger"
contains "sds-dev-governance/adapters/GEMINI.md" "Prompt Execution Continuity Trigger" "Gemini adapter template carries prompt continuity trigger"
contains "sds-dev-governance/adapters/cursor-rules/sds-governance.mdc" "Prompt Execution Continuity Trigger" "Cursor adapter template carries prompt continuity trigger"
contains "sds-dev-governance/adapters/nested/CLAUDE.md" "Prompt Execution Continuity Trigger" "nested Claude adapter carries prompt continuity trigger"
contains "sds-dev-governance/adapters/nested/AGENTS.md" "Prompt Execution Continuity Trigger" "nested Codex adapter carries prompt continuity trigger"
contains "sds-dev-governance/adapters/nested/GEMINI.md" "Prompt Execution Continuity Trigger" "nested Gemini adapter carries prompt continuity trigger"
contains "sds-dev-governance/adapters/nested/cursor-rules/sds-governance.mdc" "Prompt Execution Continuity Trigger" "nested Cursor adapter carries prompt continuity trigger"
contains "sds-dev-governance/practices/14-phase-commit-report.md" "GOVERNANCE.md" "phase report practice points to governance"
contains "sds-dev-governance/GOVERNANCE.md" "Nested Project Memory" "GOVERNANCE.md documents nested project memory"
contains "sds-dev-governance/adapters/nested/CLAUDE.md" "GOVERNANCE_RELATIVE_PATH" "nested Claude template uses relative governance placeholder"
contains "sds-dev-governance/adapters/nested/AGENTS.md" "GOVERNANCE_RELATIVE_PATH" "nested Codex template uses relative governance placeholder"
contains "docs/governance/evaluation/README.md" "context_efficiency" "governance evaluation has objective metrics"
contains "docs/prompts-output-template/output-template.md" "Areas afectadas" "output template tracks affected areas"
contains "docs/prompts-output-template/output-template.md" "Nivel de gobernanza" "output template tracks governance level"
contains "docs/prompts-output-template/output-template.md" "Checkpoint de continuidad" "output template has continuity checkpoint"
contains "docs/prompts-output-template/output-template.md" "Matriz cross-layer campo-a-campo" "output template tracks cross-layer matrix"
contains "docs/prompts-output-template/output-template.md" "Lineage UI-to-data" "output template tracks UI-to-data lineage"
contains "docs/prompts-output-template/output-template.md" "Resiliencia de mutaciones" "output template tracks mutation resilience"
contains "docs/prompts-output-template/output-template.md" "Tmp/scratch memory y evidencia" "output template tracks prompt tmp/evidence consolidation"
contains "docs/prompts-output-template/output-template.md" "Autoridad y resoluciones contractuales" "output template tracks contract resolutions"
contains "sds-dev-governance/scaffold/docs/prompts-output-template/output-template.md" "Autoridad y resoluciones contractuales" "scaffold output template tracks contract resolutions"
contains "sds-dev-governance/init-project-prompt.md" "15-contract-authority.md" "init prompt installs contract gate routing"
contains "sds-dev-governance/init.sh" "15-contract-authority.md" "init script surfaces lazy contract gate"
contains "docs/prompts-output/README.md" "docs/prompts-output/<PROMPT_ID>/tmp/" "prompts-output README documents tmp location"

echo ""
echo "=== Contract Authority Drift ==="
CONTRACT_OLD_RULE='If the repository contradicts the target prompt, repository[[:space:]]+evidence wins'
if grep -E -n "$CONTRACT_OLD_RULE" \
  "$TARGET_DIR/sds-dev-governance/practices/02-prompt-system.md" \
  "$TARGET_DIR/sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md" \
  "$TARGET_DIR/docs/prompts/prompt-revision-preflight.md"; then
  fail "obsolete repository-always-wins contract rule found"
else
  pass "obsolete repository-always-wins contract rule absent"
fi

echo ""
echo "=== Placeholders ==="
if grep -r -n "{{NOMBRE_PROYECTO}}\|{{RUTA_LOCAL}}" "$TARGET_DIR/CLAUDE.md" "$TARGET_DIR/AGENTS.md" "$TARGET_DIR/GEMINI.md" "$TARGET_DIR/.cursor/rules" "$TARGET_DIR/docs" --include='*.sds-new' >"$CHECK_TMP/placeholders" 2>/dev/null; then
  cat "$CHECK_TMP/placeholders"
  fail "unresolved placeholders found"
else
  pass "no unresolved project placeholders"
fi
rm -f "$CHECK_TMP/placeholders"

echo ""
echo "=== Governance Template Portability ==="
for template_adapter in \
  "sds-dev-governance/adapters/CLAUDE.md" \
  "sds-dev-governance/adapters/AGENTS.md" \
  "sds-dev-governance/adapters/GEMINI.md"; do
  contains "$template_adapter" '^# \{\{NOMBRE_PROYECTO\}\}' "$template_adapter keeps the project-name placeholder"
  contains "$template_adapter" '\{\{RUTA_LOCAL\}\}' "$template_adapter keeps the project-root placeholder"
  contains "$template_adapter" 'sds-dev-governance/scripts/gh-safe.sh' "$template_adapter points to the installed GitHub wrapper"
done
contains "sds-dev-governance/adapters/cursor-rules/sds-governance.mdc" \
  'sds-dev-governance/scripts/gh-safe.sh' \
  "Cursor adapter template points to the installed GitHub wrapper"
contains "sds-dev-governance/init-project-prompt.md" '\{\{NOMBRE_PROYECTO\}\}' \
  "init prompt documents the project-name placeholder"
contains "sds-dev-governance/init-project-prompt.md" '\{\{RUTA_LOCAL\}\}' \
  "init prompt documents the project-root placeholder"
if grep -E -n '/Users/|/home/|[A-Za-z]:\\' \
  "$TARGET_DIR/sds-dev-governance/adapters/CLAUDE.md" \
  "$TARGET_DIR/sds-dev-governance/adapters/AGENTS.md" \
  "$TARGET_DIR/sds-dev-governance/adapters/GEMINI.md" \
  "$TARGET_DIR/sds-dev-governance/adapters/cursor-rules/sds-governance.mdc" \
  "$TARGET_DIR/sds-dev-governance/init-project-prompt.md" \
  >"$CHECK_TMP/template-paths" 2>/dev/null; then
  cat "$CHECK_TMP/template-paths"
  fail "governance templates contain a machine-specific absolute path"
else
  pass "governance templates contain no machine-specific absolute path"
fi
rm -f "$CHECK_TMP/template-paths"

echo ""
echo "=== Obsolete References ==="
if grep -r -n "docs/CLAUDE.md\|docs/agents-memory.md\|memory-of-implementation" "$TARGET_DIR/CLAUDE.md" "$TARGET_DIR/AGENTS.md" "$TARGET_DIR/GEMINI.md" "$TARGET_DIR/docs/memory" "$TARGET_DIR/docs/governance" >"$CHECK_TMP/obsolete" 2>/dev/null; then
  cat "$CHECK_TMP/obsolete"
  fail "obsolete memory references found"
else
  pass "no obsolete memory references"
fi
rm -f "$CHECK_TMP/obsolete"

echo ""
echo "=== Governance Kit Consistency ==="
if grep -r -n "scaffold/CLAUDE.md\|CLAUDE.md.*fuente unica\|fuente unica.*CLAUDE.md\|reglas viven solo en CLAUDE.md" "$TARGET_DIR/sds-dev-governance/README.md" "$TARGET_DIR/sds-dev-governance/GOVERNANCE.md" "$TARGET_DIR/sds-dev-governance/practices" "$TARGET_DIR/sds-dev-governance/scaffold/docs/memory" >"$CHECK_TMP/kit-obsolete" 2>/dev/null; then
  cat "$CHECK_TMP/kit-obsolete"
  fail "obsolete canonical-governance references found in governance kit"
else
  pass "no obsolete canonical-governance references in governance kit"
fi
rm -f "$CHECK_TMP/kit-obsolete"

echo ""
echo "=== Resources Index ==="
RES_DIR="$TARGET_DIR/sds-dev-governance/resources"
RES_PATTERNS="$RES_DIR/frontend-patterns"
RES_INDEX="$RES_DIR/index-of-resources-and-working-patters.md"
if [ -d "$RES_PATTERNS" ]; then
  if [ -f "$RES_INDEX" ]; then
    pass "resources index exists"
    while IFS= read -r howto; do
      leaf="$(basename "$(dirname "$howto")")"
      if grep -q "$leaf" "$RES_INDEX"; then
        pass "resource indexed: $leaf"
      else
        fail "resource NOT in index (update index-of-resources-and-working-patters.md): $leaf"
      fi
    done < <(find "$RES_DIR" -type f -iname "INDEX-AND-HOW-TO-USE-THEM.md")
  else
    fail "resources present but index missing: resources/index-of-resources-and-working-patters.md"
  fi
else
  pass "no resources catalog (skip index check)"
fi

echo ""
echo "=== Nested Adapters ==="
if [ "$WORKSPACE_MODE" != "hub" ]; then
for nested_adapter in "$TARGET_DIR"/*/CLAUDE.md "$TARGET_DIR"/*/AGENTS.md "$TARGET_DIR"/*/GEMINI.md "$TARGET_DIR"/*/.cursor/rules/sds-governance.mdc; do
  [ -f "$nested_adapter" ] || continue
  relative="${nested_adapter#$TARGET_DIR/}"
  if grep -Eq "sds-dev-governance/GOVERNANCE.md|GOVERNANCE.md" "$nested_adapter"; then
    pass "$relative points to governance"
  else
    fail "$relative missing governance pointer"
  fi
done
else
  pass "hub: child repository adapters are outside this check"
fi

echo ""
echo "=== Memory Size ==="
# Sharding-aware memory validation. Four file types under docs/memory/:
#   - README.md                          -> memory index (legacy cap)
#   - index-<area>.md                    -> tree entrypoint (Contexto minimo + marker + <=300)
#   - <area>-N.md                        -> shard (<=250, must be listed in its index)
#   - <area>.md                          -> legacy flat (Contexto minimo + <=250) OR, if an
#                                           index-<area>.md sibling exists, deprecated stub (<=40,
#                                           DEPRECATED, points to index, no Contexto minimo)
# Cross-links (minimal, executable): only Markdown-local links inside a "## Cross-links" section,
# of form <area>-N.md or docs/memory/<area>-N.md. Nonexistent target = fail; self-link = fail.
# Index maps reject missing/duplicate/subshard targets; Cross-links reject missing/self/cyclic routes.
MAX_INDEX_MEMORY_LINES="${MAX_INDEX_MEMORY_LINES:-300}"
MAX_STUB_MEMORY_LINES="${MAX_STUB_MEMORY_LINES:-40}"
MEMORY_DIR="$TARGET_DIR/docs/memory"
DO_NOT_READ_MARKER="do not read all shards by default"

validate_crosslinks() {
  local file="$1"
  local relative="$2"
  local self_base section targets t tbase
  self_base="$(basename "$file")"
  section="$(awk '/^##[[:space:]]+Cross-links/{f=1;next} /^##[[:space:]]/{f=0} f{print}' "$file" 2>/dev/null || true)"
  [ -n "$section" ] || return 0
  targets="$(printf '%s\n' "$section" | grep -oE '[A-Za-z0-9_./-]+\.md' 2>/dev/null | sed 's#^docs/memory/##' | sort -u || true)"
  for t in $targets; do
    tbase="$(basename "$t")"
    # only validate shard-form targets <area>-<number>.md
    [[ "$tbase" =~ ^.+-[0-9]+\.md$ ]] || continue
    if [ "$tbase" = "$self_base" ]; then
      fail "$relative has self-link in Cross-links: $tbase"
    elif [ -f "$MEMORY_DIR/$tbase" ]; then
      pass "$relative cross-link ok: $tbase"
    else
      fail "$relative cross-link to nonexistent shard: $tbase"
    fi
  done
}

validate_shard_map() {
  local file="$1"
  local area="$2"
  local relative="$3"
  local section targets nested target occurrences
  section="$(awk '/^##[[:space:]]+Mapa tematico de shards/{f=1;next} /^##[[:space:]]/{f=0} f{print}' "$file" 2>/dev/null || true)"
  if [ -z "$section" ]; then
    fail "$relative missing Mapa tematico de shards"
    return
  fi
  nested="$(printf '%s\n' "$section" | grep -oE "${area}-[0-9]+-[0-9]+\\.md" 2>/dev/null || true)"
  if [ -n "$nested" ]; then
    fail "$relative references forbidden subshards: $nested"
  fi
  targets="$(printf '%s\n' "$section" | grep -oE "${area}-[0-9]+\\.md" 2>/dev/null | sort -u || true)"
  if [ -z "$targets" ]; then
    fail "$relative has no shards in its map"
  fi
  for target in $targets; do
    occurrences="$(printf '%s\n' "$section" | grep -oF "$target" | wc -l | tr -d ' ')"
    if [ "$occurrences" -eq 1 ]; then
      pass "shard listed once in $relative: $target"
    else
      fail "shard must be listed once in $relative: $target (found $occurrences)"
    fi
    if [ -f "$MEMORY_DIR/$target" ]; then
      pass "mapped shard exists for $relative: $target"
    else
      fail "mapped shard missing for $relative: $target"
    fi
  done
  for target in "$MEMORY_DIR/$area"-*.md; do
    [ -f "$target" ] || continue
    local target_base
    target_base="$(basename "$target")"
    [[ "$target_base" =~ ^${area}-[0-9]+\.md$ ]] || continue
    if printf '%s\n' "$section" | grep -Fq "$target_base"; then
      pass "shard indexed in $relative: $target_base"
    else
      fail "shard NOT in index $relative: $target_base"
    fi
  done
}

validate_crosslink_dag() {
  local file="$1"
  local relative="$2"
  local section
  section="$(awk '/^##[[:space:]]+Cross-links/{f=1;next} /^##[[:space:]]/{f=0} f{print}' "$file" 2>/dev/null || true)"
  [ -n "$section" ] || return 0
  if printf '%s\n' "$section" | awk '
    /→/ {
      line=$0; gsub(/`/, "", line); count=0
      fields=split(line, part, /[[:space:]]+/)
      for (i=1; i<=fields; i++) if (part[i] ~ /\.md$/) node[++count]=part[i]
      if (count >= 2) { edge[node[1] SUBSEP node[2]]=1; seen[node[1]]=1; seen[node[2]]=1 }
      delete node
    }
    function visit(n, key, pair) {
      if (state[n] == 1) return 1
      if (state[n] == 2) return 0
      state[n]=1
      for (key in edge) { split(key, pair, SUBSEP); if (pair[1] == n && visit(pair[2])) return 1 }
      state[n]=2
      return 0
    }
    END { for (n in seen) if (visit(n)) cyclic=1; exit cyclic ? 1 : 0 }
  '; then
    pass "$relative Cross-links graph is acyclic"
  else
    fail "$relative Cross-links graph has a cycle"
  fi
}

for memory_file in "$MEMORY_DIR"/*.md; do
  [ -f "$memory_file" ] || continue
  base="$(basename "$memory_file" .md)"
  relative="${memory_file#$TARGET_DIR/}"
  lines="$(wc -l < "$memory_file" | tr -d ' ')"

  # README: memory index (legacy cap)
  if [ "$base" = "README" ]; then
    pass "$relative is memory index"
    if [ "$lines" -le "$MAX_MEMORY_LINES" ]; then
      pass "$relative has $lines lines"
    else
      fail "$relative has $lines lines; max is $MAX_MEMORY_LINES"
    fi
    continue
  fi

  # Index: index-<area>.md (single entrypoint)
  if [[ "$base" =~ ^index-(.+)$ ]]; then
    area="${BASH_REMATCH[1]}"
    if grep -q "^## Contexto minimo" "$memory_file"; then
      pass "$relative (index) has Contexto minimo"
    else
      fail "$relative (index) missing Contexto minimo"
    fi
    if grep -qi "$DO_NOT_READ_MARKER" "$memory_file"; then
      pass "$relative has do-not-read-all marker"
    else
      fail "$relative missing '$DO_NOT_READ_MARKER' marker"
    fi
    if [ "$lines" -le "$MAX_INDEX_MEMORY_LINES" ]; then
      pass "$relative has $lines lines"
    else
      fail "$relative has $lines lines; max is $MAX_INDEX_MEMORY_LINES"
    fi
    validate_shard_map "$memory_file" "$area" "$relative"
    validate_crosslinks "$memory_file" "$relative"
    validate_crosslink_dag "$memory_file" "$relative"
    continue
  fi

  # Shard: <area>-<number>.md (greedy area capture supports hyphenated areas)
  if [[ "$base" =~ ^(.+)-[0-9]+$ ]]; then
    area="${BASH_REMATCH[1]}"
    if [ "$lines" -le "$MAX_MEMORY_LINES" ]; then
      pass "$relative (shard) has $lines lines"
    else
      fail "$relative (shard) has $lines lines; max is $MAX_MEMORY_LINES"
    fi
    if [ -f "$MEMORY_DIR/index-$area.md" ]; then
      pass "$relative has index-$area.md entrypoint"
    else
      fail "$relative is a shard without index-$area.md entrypoint"
    fi
    validate_crosslinks "$memory_file" "$relative"
    continue
  fi

  # Plain <area>.md: deprecated stub (if index sibling exists) or legacy flat
  if [ -f "$MEMORY_DIR/index-$base.md" ]; then
    if grep -q "DEPRECATED" "$memory_file"; then
      pass "$relative is deprecated stub (DEPRECATED marker present)"
    else
      fail "$relative coexists with index-$base.md but lacks DEPRECATED marker"
    fi
    if grep -q "index-$base.md" "$memory_file"; then
      pass "$relative deprecated stub points to index-$base.md"
    else
      fail "$relative deprecated stub must point to docs/memory/index-$base.md"
    fi
    if grep -q "^## Contexto minimo" "$memory_file"; then
      fail "$relative deprecated stub must NOT contain Contexto minimo (no operational content)"
    else
      pass "$relative deprecated stub has no Contexto minimo"
    fi
    if [ "$lines" -le "$MAX_STUB_MEMORY_LINES" ]; then
      pass "$relative deprecated stub has $lines lines"
    else
      fail "$relative deprecated stub has $lines lines; max is $MAX_STUB_MEMORY_LINES"
    fi
    continue
  fi

  # Legacy flat <area>.md (current behavior preserved)
  if grep -q "^## Contexto minimo" "$memory_file"; then
    pass "$relative has Contexto minimo"
  else
    fail "$relative missing Contexto minimo"
  fi
  if [ "$lines" -le "$MAX_MEMORY_LINES" ]; then
    pass "$relative has $lines lines"
  else
    fail "$relative has $lines lines; max is $MAX_MEMORY_LINES"
  fi
done

echo ""
echo "=== Sensitive Value Patterns ==="
if grep -r -I -n -E '(password|secret|token|apikey|api_key|connection|string|uri)[[:space:]]*[:=][[:space:]]*[^[:space:]_]|mongodb\+srv://' "$TARGET_DIR/CLAUDE.md" "$TARGET_DIR/AGENTS.md" "$TARGET_DIR/GEMINI.md" "$TARGET_DIR/docs/memory" "$TARGET_DIR/docs/governance" >"$CHECK_TMP/secrets" 2>/dev/null; then
  cat "$CHECK_TMP/secrets"
  fail "possible sensitive values found; review manually"
else
  pass "no common sensitive value patterns found"
fi
rm -f "$CHECK_TMP/secrets"

echo ""
# Optional reader fixture gate, no network or product execution.
if ! bash "$TARGET_DIR/sds-dev-governance/scripts/sds-text" check "$TARGET_DIR/sds-dev-governance/examples/prompts/selective-context.md" >/dev/null; then
  echo "FAIL: selective context example is invalid"
  exit 1
fi

if [ "$STATUS" -eq 0 ]; then
  echo "SDS Dev Governance check passed."
else
  echo "SDS Dev Governance check failed."
fi

exit "$STATUS"
