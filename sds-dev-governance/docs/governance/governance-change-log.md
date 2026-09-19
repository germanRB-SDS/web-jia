# Governance Change Log

## GOV-2026-09-09-10 — Bootstrap preservation and classifier repair

- Prompt base: owner continuation, hub docs/prompts/2026-09-09-continuar-gobernanza.md.
- Fecha de incorporacion / Fecha de ultima modificacion: 2026-09-09.
- Tipo SDS: GOV-SAFETY, GOV-STRUCTURE, GOV-AUTOMATION, GOV-PROMPT.
- Sistema de utilizacion: init/metaprompt, adapters, checker, inventory and optional installers.
- Verificacion: REL-10 acceptance.json, safety/copy suites both shells, three Swift resource tests.
- Riesgos residuales y recuperacion: release report; no automatic destructive rollback.
- Ficheros tocados: the following materializations share the bounded bootstrap/distribution contract;
  executable source hashes and effects are in the audit manifest and report.

- `.gitignore`: repair preservation/routing or synchronize its documented/tested contract.
- `CHANGELOG.md`: repair preservation/routing or synchronize its documented/tested contract.
- `README.md`: repair preservation/routing or synchronize its documented/tested contract.
- `VERSION.md`: repair preservation/routing or synchronize its documented/tested contract.
- `adapters/nested/AGENTS.md`: repair preservation/routing or synchronize its documented/tested contract.
- `adapters/nested/CLAUDE.md`: repair preservation/routing or synchronize its documented/tested contract.
- `adapters/nested/GEMINI.md`: repair preservation/routing or synchronize its documented/tested contract.
- `adapters/nested/cursor-rules/sds-governance.mdc`: repair preservation/routing or synchronize its documented/tested contract.
- `check-governance.sh`: repair preservation/routing or synchronize its documented/tested contract.
- `init-project-prompt.md`: repair preservation/routing or synchronize its documented/tested contract.
- `init.sh`: repair preservation/routing or synchronize its documented/tested contract.
- `practices/11-governance-evolution.md`: repair preservation/routing or synchronize its documented/tested contract.
- `practices/13-multi-agent.md`: repair preservation/routing or synchronize its documented/tested contract.
- `practices/RULE-COVERAGE.md`: repair preservation/routing or synchronize its documented/tested contract.
- `practices/modules/11-governance-distribution.md`: repair preservation/routing or synchronize its documented/tested contract.
- `resources/index-of-resources-and-working-patters.md`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/bootstrap.py`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/copy-skill.py`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/gh-safe.sh`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/governance-copies.sh`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/governance_copies.py`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/governance_tree.py`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/install-git-guardrails.sh`: repair preservation/routing or synchronize its documented/tested contract.
- `scripts/install-skills.sh`: repair preservation/routing or synchronize its documented/tested contract.
- `skills/bootstrap-and-agents.md`: repair preservation/routing or synchronize its documented/tested contract.
- `tests/test-bootstrap-safety.py`: repair preservation/routing or synchronize its documented/tested contract.
- `tests/test-copy-safety.py`: repair preservation/routing or synchronize its documented/tested contract.
- `tests/test-governance-copies.sh`: repair preservation/routing or synchronize its documented/tested contract.
- `resources/mobile-sample-code/swiftui-paypal-donation-link/`: preserve incubated five-file resource and provenance; intercept its test URL.

## GOV-2026-09-09-11 — Selective context and freshness

- Prompt base: owner governance continuation and STATE-05; checkpoint 90d1263.
- Fecha de incorporacion / Fecha de ultima modificacion: 2026-09-09.
- Sistema de utilizacion: optional reader/freshness, canonical owners, authoring templates/checker.
- Ficheros tocados y motivo: scripts/sds-text + sds_text.py (bounded retrieval); freshness wrapper +
  engine (no-update version report); tests for both (adversarial behavioral proof); module 01 and
  practices 01/02/03/11 + RULE-COVERAGE (one source of contract); example/preface/memory template,
  init prompt/checker/README (real invocation and availability); version/changelog (release).
- Canonical capability ledger (exact local/remote read modes); REL-11 report/evidence (PM costs,
  limitations, provenance and reproduction). Kernel/INDEX/adapters/catalogs unchanged: no new
  universal preload or installation required. Product code and original dossier unchanged.
- Verificacion: reader/freshness suites both Bash versions; full valid fixtures + inherited suites;
  raw metrics/tokenizer/corpus/implementation hashes in REL-11 evidence.
- Riesgos residuales/recuperacion: REL-11 report; no semantic/financial claim beyond measured spans;
  optional tools removable without losing source or base governance, no automatic rollback of children.

## GOV-2026-09-10-02 — Optional closed MCP control

- Owner request: execute Hostinger governance metaprompt; publish governance before local installation.
- Incorporation / last modified: 2026-09-10. GOV-SAFETY, GOV-STRUCTURE, GOV-AUTOMATION.
- Contract ADDITION: new MCP rules and optional Hostinger onboarding; existing exact admitted modes
  keep their own project controls. GitHub deletion remains manual-owner-only.
- Canonical admission remains in the existing ledger; machine observations cannot authorize use.
- Discovery: INDEX/security/admission/skills routers and minimal root adapter references.
- Verification: REL-2026-09-10-02 evidence; 21 canonical acceptance groups, 21 synthetic MCP tests,
  installed-tooling fixture/idempotence/recovery and measured local checks.
- Severe residual: real custody and authenticated human channel unverified; provider access stays
  quarantined. No credential read or provider effect. Recovery: receipts for unchanged local
  configurations; forward fix/revert for source, no remote/resource deletion.

| File | Action / purpose |
|---|---|
| `.gitignore` | update release/discovery documentation or exclude generated tooling dependencies |
| `CHANGELOG.md` | update release/discovery documentation or exclude generated tooling dependencies |
| `README.md` | update release/discovery documentation or exclude generated tooling dependencies |
| `VERSION.md` | update release/discovery documentation or exclude generated tooling dependencies |
| `adapters/AGENTS.md` | add conditional Hostinger route; preserve other admitted modes |
| `adapters/CLAUDE.md` | add conditional Hostinger route; preserve other admitted modes |
| `adapters/GEMINI.md` | add conditional Hostinger route; preserve other admitted modes |
| `adapters/cursor-rules/sds-governance.mdc` | add conditional Hostinger route; preserve other admitted modes |
| `check-governance.sh` | require complete optional MCP leaf through existing bootstrap engine |
| `docs/governance/README.md` | record capability evaluation and human discovery index |
| `docs/governance/capability-registry.md` | record capability evaluation and human discovery index |
| `docs/governance/governance-change-log.md` | update this per-file evolution index |
| `init-project-prompt.md` | update release/discovery documentation or exclude generated tooling dependencies |
| `mcp/README.md` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/cli.py` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/configure.py` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/control.py` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/gateway.py` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/hostinger-provenance.json` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/hostinger.json` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/install-local.py` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/inventory.py` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/tooling/.nvmrc` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/tooling/package-lock.json` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `mcp/tooling/package.json` | add optional closed tooling, safe staging, provenance or exact dependency lock |
| `practices/07-security-baseline.md` | add owner rule, lazy route or derived impact relationship |
| `practices/INDEX.md` | add owner rule, lazy route or derived impact relationship |
| `practices/RULE-COVERAGE.md` | add owner rule, lazy route or derived impact relationship |
| `practices/modules/07-mcp-control.md` | add owner rule, lazy route or derived impact relationship |
| `practices/modules/11-capability-admission.md` | add owner rule, lazy route or derived impact relationship |
| `scripts/sds-mcp` | update release/discovery documentation or exclude generated tooling dependencies |
| `skills/README.md` | update release/discovery documentation or exclude generated tooling dependencies |
| `tests/test-mcp-control.py` | add synthetic negative, recovery, concurrency and cross-client tests |

N/A: GOVERNANCE.md already routes security/capability changes; init.sh/bootstrap engine
already copies the complete kit and derives required leaves from checker. Nested adapters
inherit root routing; portable ledger remains empty. No product copies or app/API/DB/UI
artifacts are changed. Private machine paths and credential reference remain outside this kit.

## GOV-2026-09-17-01 — pstack declarative integration

- Prompt base: owner request "Integración de pstack en SDS: aditiva, selectiva, eficiente y reversible".
- Incorporation / last modified: 2026-09-17. GOV-RULE, GOV-STRUCTURE, GOV-CONTINUITY, GOV-AUTOMATION.
- Discovery: always-read skills router row → lazy `skills/pstack.md`; adapters carry invocation and
  exclusion trigger only; checkpoint/delegation practices carry the restriction.
- Verification: `check-governance.sh` on a `--files-only` fixture (637 OK), `tests/test-pstack-integration.sh`,
  inherited suites; measurements in `docs/prompts-output/REL-2026-09-17-01/`.
- Residual risk / recovery: routing remains agent reasoning (deterministic tests cover structure,
  not semantics); remove the node and its router row to restore prior routing; plugin disable/uninstall
  per host; no product or project copy changed.

| File | Action |
|---|---|
| `skills/pstack.md` | new lazy node: source/revision, invocation, selection, exclusion, verification, admission |
| `skills/README.md` | one pstack row with exclusion trigger; compensating trims keep always-read ≤ 3000 |
| `adapters/{CLAUDE,AGENTS,GEMINI}.md`, `adapters/nested/{CLAUDE,AGENTS,GEMINI}.md` | one Skills Routing bullet: invocation or native fallback + exclusion |
| `practices/03-output-traceability.md`, `practices/11-governance-evolution.md` | checkpoint minimum content: active user restrictions |
| `practices/13-multi-agent.md` | Delegation Brief section: restrictions inherited, no re-enable |
| `check-governance.sh` | required node, contains gates, routing fixtures, no-body and no-dependency gates |
| `tests/test-pstack-integration.sh` | offline invariants incl. fixture interface check and local-install observation |
| `README.md`, `VERSION.md`, `CHANGELOG.md`, `docs/governance/README.md` | release documentation v1.28.0 |

N/A: `GOVERNANCE.md`/`practices/INDEX.md` (router row suffices; budget); `install-catalog.tsv`,
`plugins/base-catalog.tsv`, `install-*.sh`, `init.sh`, `bootstrap.py` (no bootstrap install);
`cross-agent-portability.tsv`/`INDEX.md` (plugin distributed per host, not bridged); Cursor adapters
(upstream plugin, router row already applies); scaffold ledger (stays empty); project copies.
