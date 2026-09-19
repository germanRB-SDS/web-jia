# 15 — Contract Authority And Contradiction Gate

## Conditional load

Do not preload this file. Its complete load/no-load router lives only in `GOVERNANCE.md` to avoid
duplicating static context. After the mandatory kernel + `practices/INDEX.md` read order, load this
file when triggered, then open only contractual sources and project memory for the affected scope,
never whole project folders by default.

## Decision protocol

An **established contract** is the current set of authorized normative decisions defining what a
system, interface, process, or agent must, may, or must not do. Detect it by meaning, not by the word
`contract`.

A conflict is **material** when choosing A rather than B can change required behavior, permissions,
data/schema, compatibility, acceptance, security/governance obligations, or an execution verdict.

Classify each material claim:

| Role | Meaning |
|---|---|
| `ACTIVE_CONTRACT` | Authorized current normative decision with identifiable scope |
| `DERIVED_ARTIFACT` | Test, schema, memory, report, example, generated output, or consumer of a contract; normative only when explicitly designated |
| `RUNTIME_REALITY` | Reproducible behavior of an identified revision/environment; describes current, not desired, behavior |
| `HISTORICAL_ARTIFACT` | Superseded, rejected, completed, draft, or otherwise inactive claim |

Then apply, in order:

1. Non-overridable legal, platform, safety, and permission constraints. Active SDS Governance
   governs ordinary work, but an explicitly authorized governance-change request is resolved and
   recorded through this gate rather than rejected as inherently non-overridable.
2. Normative versus descriptive role.
3. For normative claims: source, owner authority, scope, status, and version/date.
4. Explicit authorized supersession for the same scope. Recency alone does not supersede; a specific
   rule refines a general rule only when compatible.
5. Repository/runtime evidence establishes observed reality, not target intent.

If authority, scope, status, or supersession remains uncertain, do not choose silently.

## Stop and ask

If two material normative claims remain incompatible:

- continue only bounded read-only investigation needed to state the conflict accurately;
- stop before any dependent write, migration, commit, external mutation, execution approval, or
  artifact update that selects or materializes either outcome. An authorized neutral blocker,
  preflight report, checkpoint, or evidence record may be persisted without resolving the conflict;
- show both claims, source/authority/status, incompatible behavior, and affected artifacts;
- ask the authorized owner which governs and how to classify the resolution;
- infer nothing from silence. Preflight verdict:
  `BLOCKED — OWNER CONTRACT DECISION REQUIRED`; execution state: contract blocker.

Use this compact question:

> Contract contradiction in `<scope>`: A — `<claim/source/authority/status>`; B —
> `<claim/source/authority/status>`. Which governs, and is the resolution `ERROR`, `CLARIFICATION`,
> `ADDITION`, `MODIFICATION`, or `IMPROVEMENT`? Until resolved, no dependent mutation or approval
> will occur.

| Class | Test |
|---|---|
| `ERROR` | Corrects an accidental claim without changing the valid contract |
| `CLARIFICATION` | Changes wording, not conforming behavior |
| `ADDITION` | Adds compatible scope without changing already-covered cases |
| `MODIFICATION` | Replaces, removes, or changes required behavior for an already-covered case |
| `IMPROVEMENT` | Improves internal/non-functional quality with identical contractual behavior |

Permissions, defaults, schemas, compatibility, observable behavior, or acceptance changes are
`ADDITION`/`MODIFICATION`, even if called an improvement.

After authorization, record owner/source, date/version, scope, old/new behavior, class, and explicit
supersession; update authoritative artifacts before derived ones; re-evaluate scope, SDS level,
security, rollback, baselines, tests, routing, and capabilities before resuming. At least one
versioned authoritative artifact must hold the resolution before dependent work resumes; chat or an
execution output alone is not sufficient.

No owner question is needed for an unambiguous implementation gap, clearly stale derived artifact,
explicitly authorized scope-specific exception with unequivocal precedence, explicitly inactive
history, equivalent implementation detail, different revision/environment, compatible new scope,
or disproved agent assumption. Do not repeat the owner question when an authorized instruction
already identifies the superseded claim, governing replacement, and resolution class; record and
propagate it.
