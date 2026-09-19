# {{MODULE_NAME}} — Codex Adapter

This is a nested adapter for `{{MODULE_PATH}}`. Load it only when the task touches this subproject.

Read:

1. `{{GOVERNANCE_RELATIVE_PATH}}/GOVERNANCE.md`
2. `{{GOVERNANCE_RELATIVE_PATH}}/practices/INDEX.md`
3. Only practices selected by INDEX, plus their declared dependencies
4. `{{GOVERNANCE_RELATIVE_PATH}}/skills/README.md`
5. Hub adapter at `{{HUB_RELATIVE_PATH}}/AGENTS.md` for routing only
6. This file for `{{MODULE_NAME}}`-specific context

## Context

- Module path: `{{MODULE_PATH}}`
- Module type: `{{MODULE_TYPE}}`
- Shared branch: `{{MODULE_BRANCH}}`
- Hub outputs: `{{HUB_RELATIVE_PATH}}/docs/prompts-output/`

## Rules

- Preserve user changes.
- Load sibling subproject adapters only for cross-layer work.
- Before running `node`, `npm`, or `npx`, if `.nvmrc` exists in the command cwd or module root, load
  nvm and select the pinned runtime in the same shell command (`source "$HOME/.nvm/nvm.sh" && nvm use`).
- _Fill module-specific commands, validation and risk rules._

## Contract Authority And Contradiction Gate (conditional)

Use the router in `{{GOVERNANCE_RELATIVE_PATH}}/GOVERNANCE.md`; do not preload
`{{GOVERNANCE_RELATIVE_PATH}}/practices/15-contract-authority.md`. Load it only when the router
triggers and before any decision or mutation that depends on the possible conflict.

## GitHub Remote Deletion Guardrail (always-on)

Apply the manual-owner rule in `{{GOVERNANCE_RELATIVE_PATH}}/GOVERNANCE.md` and Practices 05/07.
Agent GitHub/push operations use `{{GOVERNANCE_RELATIVE_PATH}}/scripts/gh-safe.sh` and
`{{GOVERNANCE_RELATIVE_PATH}}/scripts/git-safe-push.sh`; destructive steps remain human-only.
## Skills Routing

Read `{{GOVERNANCE_RELATIVE_PATH}}/skills/README.md` for the catalogue and
`{{GOVERNANCE_RELATIVE_PATH}}/skills/INDEX.md` for which skills this agent can actually reach. Installed
is not admitted: check `{{HUB_RELATIVE_PATH}}/docs/governance/capability-registry.md` before invoking any capability.

- This agent discovers user-level skills in `~/.codex/skills/`.
- For UI and design work, apply `{{GOVERNANCE_RELATIVE_PATH}}/skills/impeccable.md`, even when slash
  commands are unavailable.
- For review, QA, ship and security workflows, apply the SDS-compatible equivalents in
  `{{GOVERNANCE_RELATIVE_PATH}}/skills/gstack.md`.
- For authored 3D or 2D assets, apply `{{GOVERNANCE_RELATIVE_PATH}}/skills/spline.md`. Spline is an asset
  source, never a design authority, and its MCP bridge needs the desktop app running.
- pstack (`$` → `pstack:<skill>`, when the plugin is installed for Codex): select through
  `{{GOVERNANCE_RELATIVE_PATH}}/skills/pstack.md` by task, phase and risk, never by project type.
  «sin pstack» / "no pstack" excludes it for the task, its subagents and continuations.
- If a skill is missing here but present for another agent, do not improvise a local copy. Run
  `{{GOVERNANCE_RELATIVE_PATH}}/scripts/sync-agent-skills.sh` (report-only by default) and read
  `{{GOVERNANCE_RELATIVE_PATH}}/skills/cross-agent-availability.md`; a skill absent from
  `skills/cross-agent-portability.tsv` is deliberately not propagated.

## Development Preflight Trigger

If the user asks for "preflight de desarrollo", "dev preflight", "development preflight", "preflight
del prompt", or a close equivalent followed by a prompt path, pasted prompt, or beginning of a prompt,
run the read-only review protocol in `{{HUB_RELATIVE_PATH}}/docs/prompts/prompt-revision-preflight.md`
against that target.
Do not preload specialized add-ons in static context; the preflight entrypoint reads
`{{HUB_RELATIVE_PATH}}/docs/prompts/preflight-module-index.md` and loads only applicable modules.
Do not execute the target prompt while doing this review.

## Prompt Execution Continuity Trigger

Before executing development work, especially code changes, `LEVEL 3` prompts, long-running prompts,
multi-gate/multi-phase work, release closure, migrations, refactors, security/scoping fixes, or any
task with high context/token risk, evaluate the tmp/scratch memory rule in
`{{GOVERNANCE_RELATIVE_PATH}}/GOVERNANCE.md` and
`{{GOVERNANCE_RELATIVE_PATH}}/practices/01-agent-memory.md` /
`{{GOVERNANCE_RELATIVE_PATH}}/practices/03-output-traceability.md`. Use
`{{HUB_RELATIVE_PATH}}/docs/prompts-output/<PROMPT_ID>/tmp/` and
`{{HUB_RELATIVE_PATH}}/docs/prompts-output/<PROMPT_ID>/evidence/` when it applies; record `N/A` in
the output when it does not.

## Phase Commit & Report Rule (conditional)

Before executing a task that lands executable changes (code, bugfix, schema/data migration,
runtime refactor, security ops, tests, dependencies), read
`{{GOVERNANCE_RELATIVE_PATH}}/practices/14-phase-commit-report.md` and apply it: each phase closes with one
or more green implementation checkpoint commits, then a terminal phase report (summary +
moderate/severe/critical risk analysis + proposed fixes), then a separate report commit whose
description includes the summary + risk analysis. Skip that practice entirely for analysis-only work
(evaluation, audit, documentation, diagrams, decision gates, Q&A).

## AI-Code Assurance Trigger (conditional)

Do NOT preload `{{GOVERNANCE_RELATIVE_PATH}}/agentic-engineering/ai-code-assurance.md` as static context. Load
it at ONE point: when closing a change that lands executable code into a PR/MR (pre-PR / pre-handoff)
— same "lands executable changes" family as the phase-commit rule, fired at close; not while
drafting, not for analysis-only work. At that point read that file, fill the PR/MR template
(`.github/PULL_REQUEST_TEMPLATE.md` / `.gitlab/merge_request_templates/Default.md`) auditing every
changed line, and validate the body with
`{{GOVERNANCE_RELATIVE_PATH}}/agentic-engineering/check-ai-pr-assurance.sh - --owner "<accountable owner>"`.
The signer owns 100% of the code, human- or AI-drafted.
