# {{NOMBRE_PROYECTO}} — Gemini Adapter

This project follows SDS Governance.

Read in order:

1. `sds-dev-governance/GOVERNANCE.md`
2. `sds-dev-governance/practices/INDEX.md`
3. Only practices selected by INDEX, plus their declared dependencies
4. `sds-dev-governance/skills/README.md`
5. This adapter for project-specific context
6. `docs/memory/` for affected technical areas only

If this file conflicts with SDS Governance, SDS Governance wins.

## Contract Authority And Contradiction Gate (conditional)

Use the router in `sds-dev-governance/GOVERNANCE.md`; do not preload
`sds-dev-governance/practices/15-contract-authority.md`. Load it only when the router triggers and
before any decision or mutation that depends on the possible conflict.

## GitHub Remote Deletion Guardrail (always-on)

Apply the non-delegable manual-owner rule in `sds-dev-governance/GOVERNANCE.md` and Practices 05/07.
Agent GitHub/push operations use `sds-dev-governance/scripts/gh-safe.sh` and
`sds-dev-governance/scripts/git-safe-push.sh`; deletion or
protection weakening is guidance + read-only verification only.

## Runtime

- Agent: Gemini CLI or compatible Gemini coding agent
- Project root: `{{RUTA_LOCAL}}`
- Prompts: `docs/prompts/`
- Outputs: `docs/prompts-output/`
- Node/npm/npx: if `.nvmrc` exists, run through the pinned runtime in the same shell command
  (`source "$HOME/.nvm/nvm.sh" && nvm use`) before any Node-based command. Do not treat a failure
  from an unpinned older shell Node as a product baseline.
- Prefer `rg` and existing project tooling over ad-hoc scripts.
- Preserve user changes and avoid destructive Git operations.
- Apply SDS proportional governance before deciding output depth.

## Project Context

<!-- Fill repos, branches, stack, and project-specific constraints. -->

## Active Memory

Load only affected `docs/memory/` areas. When an area uses a memory tree, its entrypoint is
`docs/memory/index-<area>.md` and shards `<area>-N.md` load on demand (do not read all shards by
default); a flat `docs/memory/<area>.md` is valid only while no sibling index exists and becomes a
deprecated stub after migration. Graphify is auxiliary discovery only.

## Frontend Constants

For frontend/UI work, apply `GOVERNANCE.md` → "Frontend Constants And Business Portability":
discover or define the project constants ownership map before adding visible content. UI copy,
business information, and user-facing assets/photos must come from constants/config/i18n files, with
a single business-info entry point or aggregator.

## Skills Routing

Read `sds-dev-governance/skills/README.md` for the catalogue and
`sds-dev-governance/skills/INDEX.md` for which skills this agent can actually reach. Installed
is not admitted: check `docs/governance/capability-registry.md` before invoking any capability.

- This agent discovers user-level skills in `~/.gemini/skills/ (the `~/.agents/skills/` alias also works)`.
- For UI and design work, apply `sds-dev-governance/skills/impeccable.md`, even when slash
  commands are unavailable.
- For review, QA, ship and security workflows, apply the SDS-compatible equivalents in
  `sds-dev-governance/skills/gstack.md`.
- For authored 3D or 2D assets, apply `sds-dev-governance/skills/spline.md`. Spline is an asset
  source, never a design authority, and its MCP bridge needs the desktop app running.
- pstack is not packaged for Gemini CLI: apply the native alternatives in
  `sds-dev-governance/skills/pstack.md`. A «sin pstack» exclusion still binds delegated work.
- If a skill is missing here but present for another agent, do not improvise a local copy. Run
  `sds-dev-governance/scripts/sync-agent-skills.sh` (report-only by default) and read
  `sds-dev-governance/skills/cross-agent-availability.md`; a skill absent from
  `skills/cross-agent-portability.tsv` is deliberately not propagated.

## Development Preflight Trigger

If the user asks for "preflight de desarrollo", "dev preflight", "development preflight", "preflight
del prompt", or a close equivalent followed by a prompt path, pasted prompt, or beginning of a prompt,
run the read-only review protocol in `docs/prompts/prompt-revision-preflight.md` against that target.
Do not preload specialized add-ons in static context; the preflight entrypoint reads
`docs/prompts/preflight-module-index.md` and loads only applicable modules.
Do not execute the target prompt while doing this review.

## Prompt Execution Continuity Trigger

Before executing development work, especially code changes, `LEVEL 3` prompts, long-running prompts,
multi-gate/multi-phase work, release closure, migrations, refactors, security/scoping fixes, or any
task with high context/token risk, evaluate the tmp/scratch memory rule in `GOVERNANCE.md` and
`sds-dev-governance/practices/01-agent-memory.md` / `03-output-traceability.md`. Use
`docs/prompts-output/<PROMPT_ID>/tmp/` and `docs/prompts-output/<PROMPT_ID>/evidence/` when it
applies; record `N/A` in the output when it does not.

## Phase Commit & Report Rule (conditional)

Before executing a task that lands executable changes (code, bugfix, schema/data migration,
runtime refactor, security ops, tests, dependencies), read
`sds-dev-governance/practices/14-phase-commit-report.md` and apply it: each phase closes with one
or more green implementation checkpoint commits, then a terminal phase report (summary +
moderate/severe/critical risk analysis + proposed fixes), then a separate report commit whose
description includes the summary + risk analysis. Skip that practice entirely for analysis-only work
(evaluation, audit, documentation, diagrams, decision gates, Q&A).

## AI-Code Assurance Trigger (conditional)

Do NOT preload `sds-dev-governance/agentic-engineering/ai-code-assurance.md` as static context. Load
it at ONE point: when closing a change that lands executable code into a PR/MR (pre-PR / pre-handoff)
— same "lands executable changes" family as the phase-commit rule, fired at close; not while
drafting, not for analysis-only work. At that point read that file, fill the PR/MR template
(`.github/PULL_REQUEST_TEMPLATE.md` / `.gitlab/merge_request_templates/Default.md`) auditing every
changed line, and validate the body with
`sds-dev-governance/agentic-engineering/check-ai-pr-assurance.sh - --owner "<accountable owner>"`.
The signer owns 100% of the code, human- or AI-drafted.

## MCP Control (conditional)

For managed Hostinger, run `sds-dev-governance/scripts/sds-mcp check --server <id>
--client <client> --project <root>`; follow the project capability ledger and indicated
policy. Other exactly admitted MCP modes retain their existing control route. A denial
never authorizes a bypass. Load
`sds-dev-governance/mcp/README.md` only for MCP setup or troubleshooting.
