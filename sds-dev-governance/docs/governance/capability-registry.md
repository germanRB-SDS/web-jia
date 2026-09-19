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
| Git/gh controlled release modes | git 2.50.1 Apple-155; gh 2.98.0; wrappers SHA-256 in REL-10 audit manifest; SDS owner: repository owner; only this canonical repo and origin | REST GET protection/ref inspection; exact non-force push of tested main/version tag; existing credential helper, no token output | refs persist; recovery by reviewed forward fix/revert, no ref deletion | full G1–G6 | ADMITTED_WITH_CONSTRAINTS | Owner-authorized governance publication 2026-09-09. No protection mutation, OAuth, new endpoint, force, delete, broad push or PR signoff. Wrapper hashes must match manifest. | REL-2026-09-09-10/report.md capability evaluation |
| Selective text + governance freshness (canonical development/evaluation) | v1.26.0 candidate; Python 3.14.6/Git 2.50.1; hashes in REL-11 implementation-manifest.json; SDS owner: repository owner; canonical repo and explicitly supplied documents/test fixtures | Reader local read-only; freshness configured trusted origin or test remote read-only; never adopt/pull | No runtime persistent state; optional commands removable, source evidence retained | full G1–G6 | ADMITTED_WITH_CONSTRAINTS | Owner-authorized implementation/evaluation/publication 2026-09-09. No product write, global install, content execution, arbitrary remote or implicit context revision change. Hashes/mode must match manifest. | REL-2026-09-09-11/report.md |
| SDS MCP / offline evaluation and closed status gateway | v1.27.0; Python 3.14.6; source hashes in REL-02 implementation-manifest; owner repository owner; canonical repo and synthetic fixtures | Local config observation, guarded staging/recovery, fixed status only; no provider credential/network/effect | Optional files/state; recovery receipts; baseline governance remains usable | full G1–G6 | ADMITTED_WITH_CONSTRAINTS | Explicit owner execution/publication 2026-09-10; no live provider or claimed OS isolation/human channel; exact source revision only | REL-2026-09-10-02/report.md and evidence |
| Hostinger / package installation and source inspection | @hostinger/mcp 1.58.0; official npm/repository; integrity in mcp/hostinger-provenance.json; exact lockfile; owner repository owner; tooling only | Public npm download; no lifecycle scripts, token, OAuth or server execution | Isolated optional tooling; remove local package without losing contracts | full G1–G6 | ADMITTED_WITH_CONSTRAINTS | Owner-authorized install after governance publication; npm ci ignore-scripts, existing pinned Node, no global package install | REL-2026-09-10-02/evidence/package-audit.json |
| Hostinger / real provider operations | Five modules at 1.58.0; owner repository owner; account/resource/permission scope POR_CONFIRMAR | Mixed metadata, sensitive reads, writes, destructive, communication and billing possibilities; none activated | No provider state created | full G1–G6 with UNKNOWN isolation/channel | QUARANTINED | BLOCKED_SECRET_ISOLATION and BLOCKED_HUMAN_CHANNEL; no real credential access, direct fallback or account assumptions | REL-2026-09-10-02/report.md |
<!-- SDS_CAPABILITY_LEDGER_END -->

## State transitions

Allowed states are `NOT_EVALUATED`, `QUARANTINED`, `ADMITTED`,
`ADMITTED_WITH_CONSTRAINTS`, `REJECTED` and `DEPRECATED`.

Only the SDS owner recorded in a row may declare `DEPRECATED`, with a reason, effective date and
replacement or retirement path. It blocks new tasks. In-flight work must migrate, stop, or receive
a time-bounded recorded owner exception for the unchanged revision; dependency/removal changes
reopen G6. Removing a row does not remove its versioned audit evidence.
