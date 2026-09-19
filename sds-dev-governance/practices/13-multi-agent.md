# 13 — Multi-Agent Adapter Model

SDS Governance is agent-neutral. Each agent reads the same canonical governance kit but through
its own adapter file materialized in the project root.

## Principle

`sds-dev-governance/GOVERNANCE.md` is the single source of portable rules.
Agent-specific files are thin adapters. They do not duplicate rules — they point to the kit.

## Adapter Table

| Agent | Root file | When to use |
|---|---|---|
| Claude Code | `CLAUDE.md` | Default for SDS projects |
| Codex | `AGENTS.md` | OpenAI Codex CLI |
| Gemini CLI | `GEMINI.md` | Google Gemini CLI |
| Cursor | `.cursor/rules/sds-governance.mdc` | Cursor IDE |

Add new adapters to `sds-dev-governance/adapters/` and regenerate with `init.sh`.

## What Every Adapter Must Contain

1. A pointer to `sds-dev-governance/GOVERNANCE.md` as first read.
2. A pointer to `sds-dev-governance/practices/INDEX.md`; only practices selected by that router are
   loaded, plus their declared dependencies, followed by `sds-dev-governance/skills/README.md`.
3. Project-specific paths, repos, branches, and stack.
4. Agent runtime notes only when strictly needed.

Adapters must NOT duplicate governance rules. If a rule is in GOVERNANCE.md, the adapter
references it — it does not restate it.

Full practices must not be preloaded as a bundle. Adapters point to the canonical INDEX and expose
only universal triggers that must be visible before routing. The full practice loads when INDEX or
the kernel router triggers it, before any dependent decision or mutation.

## Read Order for Every Agent

```
1. sds-dev-governance/GOVERNANCE.md
2. sds-dev-governance/practices/INDEX.md
3. only practices selected by INDEX, plus declared dependencies
4. sds-dev-governance/skills/README.md
5. <project-adapter> (CLAUDE.md / AGENTS.md / GEMINI.md / .cursor/rules/)
6. <nested-subproject-adapter> only if the task touches that subproject
7. docs/memory/<affected-area>.md (only areas relevant to the current task)
```

Never preload all practices as part of this read order.

If adapter content conflicts with GOVERNANCE.md, GOVERNANCE.md wins unless the user explicitly
overrides for a concrete task.

## Delegation Brief

Every delegation to a subagent or another agent carries the task scope and authority, the routed
practices, the ledger status of the capabilities it may use, and the active user restrictions (for
example a pstack exclusion). The delegate inherits those restrictions and cannot re-enable an
excluded capability directly, by alias, by copy or by recommendation; a handoff or checkpoint
preserves them.

## Generating and Updating Adapters

Bootstrap (new project):
```bash
./sds-dev-governance/init.sh <project-name> <target-dir>
```

The script writes adapters non-destructively: if a root adapter already exists, it creates
`<adapter>.sds-new` and warns. Review and merge manually.

## Nested Project Memory

For hubs, monorepos, modules, and Git submodules, keep the root adapter lightweight and place
subproject-specific memory inside the subproject itself.

Example:

```text
project/
├── CLAUDE.md
├── AGENTS.md
├── sds-dev-governance/
├── backend/
│   ├── CLAUDE.md
│   └── AGENTS.md
└── ios-app/
    ├── CLAUDE.md
    └── AGENTS.md
```

Root adapter responsibilities:

1. Identify subprojects and their purpose.
2. Tell the agent when to load each nested adapter.
3. Keep shared governance and cross-layer routing only.

Nested adapter responsibilities:

1. Store local stack, commands, risks and validation rules.
2. Point back to `../sds-dev-governance/GOVERNANCE.md` or the correct relative path.
3. Avoid loading sibling subproject memory unless the task is cross-layer.

This pattern is called context compartmentalization: initial context stays small, and subproject
context is loaded only when needed.

## Neutral Subproject Memory

For new subprojects with multiple active agent adapters, shared subproject context should live in a
neutral memory file rather than being duplicated across `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md`.

Recommended project-local location:

```text
docs/memory/<subproject-name>.md
```

The adapters inside the subproject should remain thin:

1. Point to the governance kit.
2. Point to the hub adapter for routing.
3. Point to `docs/memory/<subproject-name>.md` for shared context.
4. Include only truly agent-specific runtime notes.

If shared context is added to one adapter, move it to the neutral memory file instead of copying it
to the other adapters. Project checks may enforce the neutral-memory requirement for an explicit
list of subprojects to avoid retroactive churn in stable legacy adapters.

When updating adapter templates in `sds-dev-governance/adapters/`, re-run `init.sh` or apply
changes manually to keep project adapters in sync.

## Synchronization Rule

Any governance change that affects agent behavior must update:

1. `sds-dev-governance/GOVERNANCE.md`
2. Affected files in `sds-dev-governance/adapters/`
3. Root adapters already materialized in the current project
4. `init.sh` and `init-project-prompt.md` if bootstrap behavior changes
5. Nested adapter templates or examples if context compartmentalization changes

A governance change is not complete until all affected adapters are consistent.

## Adding a New Agent

1. Create `sds-dev-governance/adapters/<AGENT>.md` (or equivalent format).
2. Add the agent to the adapter table in this file and in `GOVERNANCE.md`.
3. Add the file to the `copy_adapter` block in `init.sh`.
4. Add the required-file check in `init.sh` and `check-governance.sh`.
5. Materialize the adapter in the current project root.

## Explicit hub bootstrap

`init.sh --mode hub --files-only` creates hub-owned adapters and docs only.
Independent child repositories retain their own governance, identity, Git and permissions.
No child context, update, capability installation or nested adapter is implied by the hub.
`SDS_NESTED_MODULES` is project/monorepo-only and cannot cross an independent Git boundary.
