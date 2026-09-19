# SDS Practice Router

This lightweight index is the **only practice-loading entrypoint**. Read it after `GOVERNANCE.md`,
then load only the practices whose semantic triggers match the task, plus declared dependencies.
Never preload all practices “just in case”. If a required file/route/dependency is missing, fail
closed before dependent mutation or approval.

## Routing method

1. Classify intent: explain, inspect, diagnose, author/review a prompt, mutate, release or change
   governance.
2. Infer affected surfaces: code, UI, API, DB, security, docs, Git, deployment, agents.
3. Evaluate contract authority before normative decisions and phase/report before executable work.
4. Load the smallest safe bundle below. Re-evaluate when scope expands or a contradiction appears.

Terms alone do not trigger or avoid a practice; route by meaning and effect.

## Practice routes

| Practice | Load when | Do not load when | Dependencies |
|---|---|---|---|
| `01-agent-memory.md` | Resuming/pausing long, partial or high-context work; creating/updating memory or tmp checkpoints | One-shot work with no continuity state | 03 when producing a prompt output |
| `02-prompt-system.md` | Creating, revising, preflighting, delegating, executing or naming development prompts; changing contract artifacts | Casual instructions or non-development Q&A | 12; 15 for normative prompt work |
| `03-output-traceability.md` | Work requiring prompt output, evidence, checkpoint or execution report | LEVEL 0/no-output work and casual Q&A | 01 for resumable work; 12 |
| `04-feature-tracking.md` | Multi-session/multi-prompt feature touching >2 layers or requiring FTR tracking | Local one-shot change or inventory | 01 and 03 when active tracking persists |
| `05-git-branching.md` | Branch, commit, push/ref safety, integration, rollback, multi-repo Change ID or shared-branch decisions | Read-only work with no Git operation | 12; 07 for remote deletion/protection; 14 for executable phase commits |
| `06-non-regression.md` | Diagnosis or change to code, behavior, data flow, contracts, UI lineage, concurrency or mutations | Pure navigation/history and meaning-preserving docs | 07 for security-sensitive flows; 12 |
| `07-security-baseline.md` | Secrets, auth, permissions, PII, tokens, GitHub remote deletion/protection, security controls/incidents or degraded operation | Work demonstrably outside security/data exposure | 05 for remote refs; 06 for implementation/diagnosis; 15 on conflicting policy |
| `08-role-system.md` | Selecting/declaring operational roles for a prompt/output or multi-layer review | Casual Q&A with no governed output | 03 for outputs |
| `09-docs-structure.md` | Creating/moving governed docs, prompts, outputs, memory, contracts, decisions or runbooks | Reading existing docs without structural change | 01/02/03 according to artifact type |
| `10-pre-pr-checklist.md` | PR/MR, release, ship, pre-handoff or readiness review | Drafting/analysis not approaching integration | 05, 06, 07 as affected; AI assurance only for executable code closure |
| `11-governance-evolution.md` | Modifying SDS rules/routers/adapters/scaffold/bootstrap/validators/governance docs, admitting/changing an agent capability, or distributing/promoting governance between the canonical repository and a project copy | Product/docs work that changes neither governance nor capability revision/mode; routine invocation of an exactly matching admitted capability | 09, 12, 15; 05 for concurrent promotion work |
| `12-governance-proportionality.md` | Any governed task needing LEVEL/output/validation depth classification | Casual Q&A with no governed work | None |
| `13-multi-agent.md` | Creating/updating adapters, nested project routing, delegating to agents or changing multi-agent behavior | Single-agent work outside adapters/subprojects | 11 for governance changes |
| `14-phase-commit-report.md` | Any task landing executable code, tests, migrations, dependencies, CI/config, scripts or security operations | Analysis-only, pure docs/governance text with no executable change | 03, 05, 12 |
| `15-contract-authority.md` | The kernel before-work/on-signal router triggers | Only the kernel's explicit no-load cases | Load before other dependent normative decisions |
| `16-verification-proportionality.md` | Deciding automated verification scope for a checkpoint/closure; full-suite debates; evidence-reuse claims | Purely informational work producing no automated evidence | 06, 14; 15 on authority tension; module only on V3/V4, critical surface, dispute or dubious reuse |

## Conditional project artifacts

| Artifact | Load when | Do not load when | Governing practice |
|---|---|---|---|
| `docs/governance/capability-registry.md` | Before evaluating, invoking, installing, modifying, deprecating or removing an agent capability | No capability is used or changed | 11; missing/unlisted/mismatched is `NOT_EVALUATED` |
| `practices/modules/11-capability-admission.md` | Evaluating, admitting, installing, modifying, deprecating or removing a capability; unlisted/mismatched/ambiguous mode; material delta | Routine invocation whose mode, revision, scope and constraints exactly match an admitted ledger row | 11; load the project ledger first |
| `practices/modules/16-verification-scope.md` | V3/V4 candidate, critical surface, scope dispute or dubious evidence reuse | V0/V1 fast path and undisputed V2 | 16 root first |

## Common bundles

MCP setup/evaluation/change/custody/effects: 07 → `practices/modules/07-mcp-control.md`;
dependencies 11 admission, conditional 15. No load for ordinary work or unchanged checks.

- Status/navigation: kernel + INDEX; targeted checkpoint/memory only. No full practice by default.
- Read-only diagnosis/QA: 06 + 12; add 07/15 only on their signals.
- Local executable fix: 05 + 06 + 12 + 14 + 16; add 03 and affected security/contract practices.
- Prompt/preflight: 02 + 12 + 15; add 01/03 for continuity/output and routed preflight modules.
- UI behavior: 02 + 06 + 12 + 14 + 16; add 07 for browser/auth/data boundaries and Impeccable.
- API/DB/auth: 02 + 06 + 07 + 12 + 14 + 15 + 16, plus affected project memory.
- Pre-PR executable closure: 05 + 06 + 07 + 10 + 12 + AI-code assurance.
- Governance change with scripts: 03 + 05 + 09 + 11 + 12 + 13 + 14 + 15.

## Future practices and fail-closed behavior

Every new, renamed or removed numbered practice must update this index, bootstrap required files,
validators, README/changelog and adapters only if a new universal trigger is required. Validators
must reject orphan practices, duplicate routes and missing targets. An unknown or ambiguous
high-impact scope is investigated read-only; it is never made green by loading nothing or by bulk
loading everything without classification.
