# Agent Capability Admission Ledger

Project-local canonical state for effective agent-capability revisions. Load this file only before
evaluating, invoking, installing, modifying, deprecating or removing a capability. Catalogue or
installation presence never grants authorization.

`sds-dev-governance/practices/11-governance-evolution.md` owns the admission gate. This ledger alone
owns current project status and constraints. Evidence records observed facts and reasoning but
cannot declare a different state.

## Fail-closed rule

If this ledger is missing, a mode is unlisted, or revision/configuration/scope does not match its
row exactly, treat it as `NOT_EVALUATED` and unauthorized. A clean bootstrap deliberately carries
no environment-specific admission decisions. It may install the portable SDS catalog for
discoverability, but that action does not add ledger rows or authorize invocation.

## Effective revisions

<!-- SDS_CAPABILITY_LEDGER_START -->
| Capability / mode | Effective revision / ownership / scope | Access / effects / authority | Persistence / reversal | Risk route | Status | Constraints | Evidence |
|---|---|---|---|---|---|---|---|
<!-- SDS_CAPABILITY_LEDGER_END -->

## State transitions

Allowed states are `NOT_EVALUATED`, `QUARANTINED`, `ADMITTED`,
`ADMITTED_WITH_CONSTRAINTS`, `REJECTED` and `DEPRECATED`.

Only the SDS owner recorded in a row may declare `DEPRECATED`, with a reason, effective date and
replacement or retirement path. It blocks new tasks. In-flight work must migrate, stop, or receive
a time-bounded recorded owner exception for the unchanged revision; dependency/removal changes
reopen G6. Removing a row does not remove its versioned audit evidence.
