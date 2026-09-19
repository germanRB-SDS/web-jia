# SDS Base Skills

Neutral capability router shared by Claude, Codex, Cursor, Gemini and future agents. Skills
accelerate work and never override SDS Governance; a catalogue entry or personal installation is
not authorization for SDS repository work.

## Included Capabilities

| Document | Capability | Load when |
|---|---|---|
| `impeccable.md` | Impeccable | UI projects, design audit, polish, hardening |
| `gstack.md` | gstack | Review, QA, security, release, planning |
| `skillui.md` | skillui | Extract design tokens and component style from references |
| `design-references.md` | awesome-design-md | Select an external `DESIGN.md` inspiration per project |
| `graphify.md` | Graphify | Auxiliary discovery across code, docs, schemas and artifacts; never the primary memory load |
| `threejs.md` | Three.js skill package | Build, diagnose and optimize Three.js scenes through focused skill modules |
| `vercel-skills.md` | Vercel Agent Skills | Deploy, configure or cost-optimize a Vercel-hosted project. Preview by default; production and token writes need a ledger row |
| `r8-analyzer.md` | sds-r8-analyzer | Read-only R8 activation, keep-rule, missing-rule, retrace and size analysis; bundled globally, use still needs a ledger row |
| `spline.md` | Spline | Author 3D scenes or 2D screens as project assets. Asset source only, never a design authority or a substitute for Impeccable |
| `pstack.md` | pstack | Unknown subsystem or flow (`how`), structural design, shared-impact change, adversarial review, project verification skills, TDD, TypeScript. Per task, phase and risk, never per project type; «sin pstack» / "no pstack" excludes it for the task, its subagents and continuations |
| `cross-agent-availability.md` | Cross-agent bridge | Make one trusted skill revision reachable from Claude Code, Codex and Gemini CLI. Plumbing only; bridging never admits a capability |
| `INDEX.md` | Ordered skill index | Look up a classified skill, its portability tier and which agent reaches it. Regenerated, never hand-edited |

The table catalogs guidance; it admits no installed plugin, CLI, hook or server of the same name.
Each effective runtime mode needs a project-ledger decision.

## Deeper Routes

Load one only when the task is about the catalog itself.

| Route | Load when | Owns |
|---|---|---|
| [`catalog-authority.md`](catalog-authority.md) | Adding, renaming, reclassifying or removing a skill, a catalog row or an index | Which file owns which catalog fact |
| [`bootstrap-and-agents.md`](bootstrap-and-agents.md) | Bootstrapping, installing or reconciling the catalog, bridging skills between agents | The install sequence and what each agent reaches |
| [`cross-agent-availability.md`](cross-agent-availability.md) | A skill is missing for one agent but present for another | The `LINK` / `PORT` / `CLAUDE_ONLY` policy and its scripts |
| [`INDEX.md`](INDEX.md) | Checking whether a skill is reachable from an agent today | Observed reachability; generated, never hand-edited |

## Capability Admission Router

The project-local `docs/governance/capability-registry.md` is the sole current-state ledger for
every agent capability. Load it before evaluating, invoking, installing, modifying, deprecating or
removing a capability. Routine use of an exactly matching admitted row follows that row and its
constraints without loading the full gate.

If the ledger is missing, a mode is unlisted, or its revision, configuration or scope does not
match, the mode is `NOT_EVALUATED` and unauthorized. Load Practice 11 and its conditional
`practices/modules/11-capability-admission.md` (states, row schema, gates). Naming an upstream
provider records provenance, not SDS authorship.

## Priority

Managed Hostinger: `scripts/sds-mcp check --server <id> --client <client> --project <root>`.
Other admitted modes retain their controls. Setup: `mcp/README.md`.

If skill advice conflicts with SDS:

1. SDS Governance wins.
2. Project-specific adapter constraints win over generic skill examples.
3. The user can explicitly override either for a concrete task.
