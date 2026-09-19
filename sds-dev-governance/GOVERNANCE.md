# SDS Governance

SDS Governance is the neutral operating contract for projects managed with AI coding agents.
Agent files such as `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, and Cursor rules are project adapters;
they never replace this canonical entry point.

## Read Order

Read in this order:

1. `sds-dev-governance/GOVERNANCE.md` — compact always-read kernel.
2. `sds-dev-governance/practices/INDEX.md` — mandatory lightweight semantic router.
3. Only the numbered practices selected by that router, including their declared dependencies.
4. `sds-dev-governance/skills/README.md` — lightweight capability router.
5. The project adapter and, only when applicable, a nested subproject adapter.
6. Project memory entrypoints for affected technical areas only.

Never preload every practice defensively. If INDEX is missing, a practice route is invalid, or a
required dependency cannot be loaded, fail closed before dependent mutation or approval.

## Authority And Core Safety

Priority is: non-overridable legal/platform/safety/permission constraints, active SDS Governance,
project-specific adapter constraints, then explicit user instructions within their authorized scope.
Use the contract-authority gate below when two possibly active normative claims conflict; recency or
runtime reality alone does not silently supersede an authorized contract.

Always preserve user changes, keep unrelated dirty work out of commits, avoid destructive Git
operations unless explicitly authorized, and never store secrets or unnecessary personal data in
code, prompts, outputs, evidence, logs, or documentation. Discover repository/runtime facts before
hardcoding them. These kernel safeguards apply even before a task-specific practice is loaded.

Remote GitHub deletion and protection weakening are stricter: they are manual-owner-only and never
delegable to an agent, including by a later chat instruction. Agents may guide the owner and verify
read-only, but never delete repositories, refs, releases, artifacts, packages, environments,
settings, secrets/variables, rulesets/protections, remote files or equivalent GitHub resources;
request `delete_repo`; force-push; or disable, weaken or bypass protection. Agent GitHub CLI/API and
push operations use the SDS safe wrappers. Practices 05 and 07 own the complete rules.

## Core Model

- `GOVERNANCE.md` contains only universal pre-routing rules and routers.
- `practices/INDEX.md` owns practice selection; numbered practices own complete detailed rules.
- `practices/RULE-COVERAGE.md` is an audit ledger, not default runtime context.
- `skills/` accelerates work but never overrides governance.
- `resources/` is optional lazy-loaded reference material. Discover it through
  `resources/index-of-resources-and-working-patters.md`; never browse or preload it as a bundle.
- Root and nested agent files are thin adapters. Shared context belongs in neutral project memory.
- `docs/memory/` stores verified project facts, not duplicate governance. For memory trees, read
  `index-<area>.md` first and only the routed shards; Graphify is auxiliary discovery, never the
  primary memory entrypoint.
- Prompt sources live in `docs/prompts/`. Traceable results live in `docs/prompts-output/`.
- Temporary execution state lives in `docs/prompts-output/<PROMPT_ID>/tmp/`; heavy evidence in
  `docs/prompts-output/<PROMPT_ID>/evidence/`; never place scratch state under `docs/prompts/`.
- Public policy placeholders use canonical names under `docs/<project-name>-policies/`.

## Proportional Governance

Classify work before deciding documentation and validation depth; load practice 12 for the full
rule:

| Level | Typical scope | Minimum effect |
|---|---|---|
| `LEVEL 0` | Trivial, no behavioral impact | No mandatory output |
| `LEVEL 1` | Small, single-layer, non-security change | Compact output |
| `LEVEL 2` | Normal feature or observable behavior | Full output + validation |
| `LEVEL 3` | Cross-layer, DB, auth/security, breaking API, release or governance | Full output + checkpoint + E2E evidence |

Proportionality reduces ceremony, never safety. Ambiguous high-impact work is not downgraded to save
context.

## Minimum Sufficient Subgraph

Governance knowledge far exceeds what any one task needs, and corpus growth must not become growth
in what is read by default.

Load only: the mandatory static set, the index entries the task selects, the specialist nodes those
entries name, and their declared dependencies. Loading a directory, the repository, or an unselected
specialist is a routing defect, not rigor.

Every routable node carries a stable identity independent of ordering, a path, a purpose, a load
trigger, its authority and its dependencies. Roots route and never restate their shards. Practice 12
owns the sharding criteria; `check-governance.sh` enforces the budgets.

## Practice Routing

`practices/INDEX.md` is the only practice-loading entrypoint and must register every numbered
practice with exact load/no-load semantics and dependencies. Detection is semantic: terminology
alone neither triggers nor avoids a practice. New practices are incomplete until INDEX, bootstrap,
validators, adapters where needed, README and changelog remain synchronized.

Common universal routing signals:

- prompt authoring/execution, outputs and continuity → practices 01–03 as INDEX specifies;
- implementation or diagnosis across data/runtime layers → practice 06;
- secrets, auth, permissions, personal data or secure degradation → practice 07;
- pre-PR/release readiness → practice 10 and conditional AI-code assurance;
- governance modification or agent-capability admission/change → practice 11;
- executable changes → conditional practice 14;
- normative behavior or contradiction signals → conditional practice 15.

## Non-Regression Premise

Before changing behavior, load practice 06 and verify the real affected flow from persistence or
external source of truth through model/schema, endpoint, service/transformation and every consumer.
Do not invent fields, reinterpret contracts or assume a local change is safe. Cross-layer work uses
the field matrix, UI-to-data lineage, concurrency and mutation-resilience rules defined there.

## Prompt And Contract Discipline

Load practice 02 for prompt naming/lifecycle, prefaces, preflight, deltas and contract artifacts.
Prompts reference governance rather than copying it. When public behavior, schemas, DTOs, generated
clients, design tokens, OpenAPI files or validators change, review the related artifacts together.
High-risk preflight uses the single materialized entrypoint
`docs/prompts/prompt-revision-preflight.md` and its own module router; it never executes the target.

Prompt identifiers follow `[NN-R]`; pre-execution refinements use `-alpha`, `-beta`, etc., and
planned-iteration insertions use `[NN-Ra]`, `[NN-Rb]`, etc. Full rules remain in practice 02.

## Contract Authority And Contradiction Gate

This is the mandatory lazy-load router for `practices/15-contract-authority.md`:

| Load | Semantic trigger |
|---|---|
| **Before work** | Create, revise, approve, preflight, delegate, execute or resume a prompt/instruction that may define, change, encode or judge expected behavior, permissions, defaults, API/schema/data, compatibility, acceptance, security, deployment, governance or normative artifacts |
| **On signal** | Analysis, QA, diagnosis, security, incident or handoff reveals incompatible possibly active claims, unclear authority/supersession, or a need to decide what governs |
| **Do not load** | Casual Q&A, navigation/status, deterministic checks, meaning-preserving edits, descriptive history or an unambiguous implementation gap with no normative choice |

The before-work/on-signal rows take precedence. If triggered, load practice 15 before any dependent
decision or mutation. Unresolved material contradiction stops work with
`BLOCKED — OWNER CONTRACT DECISION REQUIRED`; repository/runtime evidence describes current reality
but does not choose target intent.

## Frontend Constants And Business Portability

Frontend-rendered copy, labels, messages, business information and user-facing asset references
must come from the project's constants/configuration/i18n ownership layer, with one discoverable
business-info entry point. Route frontend prompt work through practice 02, implementation and
lineage through practice 06, and pre-PR verification through practice 10. Those practices contain
the complete rule; do not duplicate it in adapters or views.

## Project Bootstrap Equivalence

`init.sh` and `init-project-prompt.md` must remain behaviorally equivalent. Bootstrap materializes
root adapters, standard docs and optional nested adapters non-destructively; preserves existing
project content; verifies required governance/router files; and installs/checks the declared skills
and lazy base-plugin catalogs unless explicitly disabled. The plugin index and local tracking are
read only during install, validation or an explicit status query; adapters never preload them.
Governance changes load practice 11 and synchronize scaffold, bootstrap, validators, adapters,
README, changelog and materialized project artifacts as applicable.
Installation remains distinct from admission: bootstrapped capabilities remain unauthorized until
their exact revision and mode appear as admitted in the project capability ledger.

## Agent Adapters And Nested Project Memory

Supported adapters are Claude (`CLAUDE.md`), Codex (`AGENTS.md`), Gemini (`GEMINI.md`) and Cursor
(`.cursor/rules/sds-governance.mdc`). They point to this kernel and INDEX, contain only project or
agent runtime context, and do not reproduce practice bodies or the full routing table. Load practice
13 only for adapter, nested-project or multi-agent work.

Nested adapters are loaded only when their subproject is affected. Shared subproject facts belong
in neutral memory, not copied across agent-specific files.

## Agentic Engineering

AI-specific PR/MR assurance lives under `agentic-engineering/`. Load
`ai-code-assurance.md` exactly when closing executable code into a PR/MR (pre-PR/pre-handoff), not
during drafting or analysis-only work. The signer owns 100% of the code, human- or AI-drafted; use
the materialized PR/MR template and `check-ai-pr-assurance.sh` as documented by practice 10.

## Skills And Resources

Read `skills/README.md` as the lightweight capability router. UI work routes to Impeccable; review,
QA, security and release workflows route to the SDS-compatible gstack equivalents; Graphify is
query-first auxiliary architecture discovery when its project graph exists. Skills and resources
never supersede SDS or project-specific constraints. Catalogue presence, marketplace installation
or personal configuration does not authorize a runtime capability. Before capability use or change,
load `docs/governance/capability-registry.md`; a missing ledger, unlisted mode or revision mismatch is
`NOT_EVALUATED` and unauthorized. Practice 11 routes the detailed gate in its conditional
`practices/modules/11-capability-admission.md`; exact admitted routine use needs only the skills
router and project ledger.
