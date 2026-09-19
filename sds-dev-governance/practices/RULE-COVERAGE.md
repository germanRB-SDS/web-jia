# SDS Rule Coverage And Deduplication Ledger

Audit/reference artifact for the selective-loading refactor. **Not part of the default read order.**
Complete normative rules remain in numbered practices; `GOVERNANCE.md` keeps universal pre-routing
rules and `INDEX.md` makes every practice reachable.

## Preservation method

- At the v1.15.0 selective-loading cut, practices 01–12 and 14 were byte-identical to the v1.14.0
  baseline; 13 and 15 changed only obsolete read-order wording. `[sds-01-5]` evidence preserves
  those historical hashes.
- Later changes edit the canonical owner only and update this ledger when a material owner,
  consumer or reopen edge changes; historical byte identity is not asserted after that point.
- Detailed sections removed from the old kernel are retained in the canonical owners below.
- Validators enforce presence/routing, adapter parity, no stale bulk-preload wording and context
  budgets.

## Canonical ownership and incremental impact index

This is a deterministic discovery index, not a second normative source. `Known consumers` are
candidates to inspect, not mandatory edits. Graphify may add candidate edges; only canonical
contracts and verified deltas close the synchronization matrix.

| Rule family | Canonical detailed owner | Router | Known consumers/materializations | Reopen when |
|---|---|---|---|---|
| Authority, precedence, fail-closed routing | GOVERNANCE kernel + 15 for conflicts | Always + 15 | prompt/preflight/output templates; adapters | authority, evidence role or conflict trigger changes |
| Agent memory, trees, tmp/evidence | 01/03; selective file/code reads and active pin in `modules/01-selective-text.md`; structure 09; phase relation 14 | 01/03/09/14 | adapters; output/memory scaffold; practice 11 | path, retention, checkpoint or phase relation changes |
| Prompt naming, lifecycle, preface, preflight | 02 | 02 | init prompt; prompt/preflight templates; adapters | identifier, lifecycle or trigger changes |
| Prompt output and checkpoints | 03 | 03 | output templates; memory/continuity consumers | output schema or continuity contract changes |
| Feature tracking | 04 | 04 | feature templates and active FTR indexes | feature lifecycle or threshold changes |
| Git, Change ID, push/ref safety, integration, rollback | 05 | 05 | adapters; safe push/hook; outputs; practice 14 | branch, commit, push/ref, integration or rollback contract changes |
| Non-regression, discovery, lineage, races | 06 | 06 | practice 10; prompts; affected technical memories | behavior/contract lineage or mutation gate changes |
| Secrets, GitHub remote deletion/protection, secure failure/degradation | 07; pre-PR assertion 10 | 05/07/10 | kernel; adapters; `gh-safe.sh`; ruleset/apply/audit; `.gitignore` bootstrap; security outputs | data boundary, secret class, GitHub capability/plan/protection or failure mode changes |
| Operational roles | 08 | 08 | prompt output roles | role ownership or required evidence changes |
| Documentation structure | 09 | 09 | scaffold; init; prompt bootstrap; validators | governed path or required artifact changes |
| Pre-PR readiness | 10 | 10 | PR/MR templates; validators; CI guidance | readiness assertion or closure trigger changes |
| Governance synchronization/bootstrap equivalence | 11; distribution module; `scripts/bootstrap.py` file plan | 11 | init/metaprompt; classifier; tree snapshots; nested adapters; checker; README | file ownership, hub boundary, flags, preserved conflicts, fingerprints or original-baseline proof changes |
| Agent capability admission | `practices/modules/11-capability-admission.md`; current state in project `docs/governance/capability-registry.md` | skills router + ledger; INDEX → 11 module only on admission/delta/mismatch | kernel; scaffold ledger; skill docs; capability evidence; active adapters | revision, mode, permission, effect, persistence, dependency, ledger route or adapter invocation changes |
| Proportional LEVEL 0–3 | 12 | 12 | kernel summary; output depth; routed practices | level criteria or minimum evidence changes |
| Agent adapters/nested context | 13 | 13 | root/template/nested adapters; init | supported runtime, trigger or nesting changes |
| Phase checkpoint/report commits | 14 | 14 | adapters; outputs; Git practice | executable trigger or phase-close evidence changes |
| Verification scope proportionality (V0-V4, evidence reuse, calibration) | 16; escalators/ledger detail in `practices/modules/16-verification-scope.md` | 16; module only on V3/V4, critical surface, dispute or dubious reuse | practice 14 evidence declarations; output template test section; evaluation ledger | scale, reuse identity, escalator, budget or calibration trigger changes |
| Contract authority/contradictions | 15 | 15 | kernel; prompt/preflight/output templates | authority, scope, supersession or contradiction changes |
| Frontend constants/business portability | 02 prompt; 06 implementation; 10 pre-PR | 02/06/10 | kernel summary; frontend memory/config | portability source, lineage or pre-PR gate changes |
| Agentic Engineering / AI assurance | 10 + `agentic-engineering/` | 10 | PR/MR templates; checker; kernel trigger | executable close trigger or assurance schema changes |
| Skills/resources/Graphify/base plugins | `skills/README.md`; `plugins/README.md`; resource index; skill docs | Always-lightweight routers; catalogs/tracking on demand | kernel pointer; project capability ledger; install catalogs; installers/adapters when runtime changes | catalog, endpoint, bootstrap default, invocation, ledger route or resource membership changes |

## Kernel deduplication decisions

- Duplicate `Agentic Engineering` block: one compact trigger retained; detailed rule remains in
  practice 10 and `agentic-engineering/`.
- Long practice catalogue: moved to INDEX, which is validated against actual numbered files.
- Detailed frontend portability text: canonical wording remains unchanged in practices 02/06/10.
- Detailed continuity wording: canonical wording remains unchanged in practices 01/03/09/11/14.
- Detailed governance synchronization: remains unchanged in practice 11.
- Full proportionality criteria: remain unchanged in practice 12.
- Prompt conventions and contract co-review: remain unchanged in practice 02.

## Drift acceptance

Closure requires: no orphan practice; scenario safety parity; explained hashes for every changed
practice; always-read set within budget or an explicit parity-first exception; and no old blanket
preload instruction in active kernel/adapters/preflight. Historical outputs/changelogs may quote the
old rule and are not rewritten.

Selective context consumers: sds-text engine/example/tests; prompt preface and memory index authoring
guidance; bootstrap/checker required files; freshness report. Reopen on dialect, dependencies,
revision identity, budget, offline/timeout or adoption semantics. No kernel/static-load expansion.

## MCP execution-control delta

Owner: `practices/modules/07-mcp-control.md`; routing: 07, kernel, INDEX and skills
router. Consumers: 11 admission module, root adapter templates, optional `mcp/` tooling,
bootstrap required-file checker. Installation state is local and never a second ledger.
Reopen on server/catalog/config revision, custody, authorization, output or scope changes.
