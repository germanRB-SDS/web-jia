# pstack

pstack is a plugin of engineering-workflow skills: poteto's (Lauren Tan) Cursor `pstack`, in the
portable fork by painhardcore for Claude Code, Codex and OpenCode. SDS accepts its skills as
accelerators. This node owns how they are referenced, selected, invoked, excluded and verified; it
never reopens their quality and never overrides SDS Governance, practice routing or the ledger.

## Source and revision

| Fact | Value |
|---|---|
| Distribution | Claude Code plugin `pstack@pstack`, marketplace `painhardcore/pstack` (GitHub) |
| Pinned revision | plugin `1.1.0`, commit `04830a98367e41c79d1565e0c4903cc6ddedce1b`; upstream Cursor pin `46756f89270d7e7dcb8c28c90fd0f957ade4ce2c` |
| Claude Code | `~/.claude/plugins/cache/pstack/pstack/<version>/skills/`; a plugin, not a `~/.claude/skills/` directory |
| Codex | Same fork: `codex plugin marketplace add painhardcore/pstack` + `codex plugin add pstack@pstack` |
| Gemini CLI | Not packaged; use the native alternatives below |
| Cursor | Upstream `cursor/plugins` pstack; same selection and exclusion rules |
| Verify | `claude plugin list --json` (id, version, enabled); another version or fork is a new capability revision |

One reference, no vendored copy: the Kit points at the installed plugin and records its revision
here. Bootstrap does not install it and the cross-agent bridge does not link plugin skills (absent
from `cross-agent-portability.tsv` on purpose); each host installs the same pinned revision through
its own plugin route. Never mix forks or auto-update inside an ordinary task.

Direct skills: `poteto-mode`, `how`, `why`, `recall`, `blast-radius`, `architect`, `arena`, `swarm`,
`interrogate`, `teach`, `tdd`, `no-comments`, `typescript-best-practices`, `figure-it-out`,
`show-me-your-work`, `create-verification-skill`, `maintain-verification-skill`, `unslop`, `bro`,
`technical-writing`, plus 21 `principle-*` leaves those skills load.

## Invocation

| Host | Explicit | Implicit |
|---|---|---|
| Claude Code | `/pstack:<skill> <task>` | the host may match a description; SDS routing still decides |
| Codex | `$` → `pstack:<skill>` | same |

A selected skill loads only its `SKILL.md` and the references it names. Skill bodies never enter
adapters, memories, prompts or this Kit. Plugin discovery already costs the host the description
list of every enabled plugin, with or without SDS routing.

## Selection

Combine, in order: user intent and exclusions → affected component or surface → task type and
phase (explain, diagnose, design, implement, refactor, review, verify) → risk, `LEVEL` and blast
scope → what is already known and current → what the ledger admits. Project type never triggers a
battery; a task may need no pstack. A read or diagnosis task never authorizes implementation, even
when a skill offers to continue.

| Skill | Use when | Do not use when | Without pstack | Overlap / precedence |
|---|---|---|---|---|
| `how` | Relevant ignorance of a subsystem or flow; a diagnosis must rebuild how it works | Knowledge is sufficient, current and loaded (memory, contract, prior output) | Practice 06 flow tracing, `docs/memory/`, `rg` | Complements practice 06; never replaces its matrix |
| `architect` | Structural decision or real complexity: new boundary, interface, shared module | Small change; implementation not authorized | Practice 06 plus `docs/decisions/` | A proposal; contract authority (15) governs |
| `blast-radius` | Shared consumers or relevant dependencies: auth, contract, shared service | Isolated leaf change; whole-repository audit | Practice 06 consumers; practice 16 V2–V3 | Feeds practice 16 amplitude; never widens scope |
| `interrogate` | Sensitive change, significant uncertainty or explicit review request | Ordinary edit; same-purpose review already ran (gstack `/review`, `/cso`) | gstack equivalents; practice 10 | One review per purpose: gstack or `interrogate` |
| `create-verification-skill` | No project verification mechanism, or demonstrably insufficient for the flow | A script, test or fixture already covers it; after every change | Existing tests, runbooks, evidence | New project-local capability: quarantined draft until a ledger row |
| `maintain-verification-skill` | A relevant change (flow, startup, tooling, legitimate expectation) drifts the skill | Per task; to hide a product failure | Manual update of the skill or test | Expectation changes need contract backing |
| `tdd` | Bug or logic with a cheap, useful local test | Unclear, expensive or integration-heavy test path; by default | Practice 16 modalities; project runner | Practice 16 owns amplitude |
| `typescript-best-practices` | `.ts`/`.tsx` files really edited | JavaScript; "web" or "backend" by association | Project lint and `tsconfig` | Check the language first |

`poteto-mode` (playbooks plus principles) is never global nor a prerequisite: only when the user asks
for it or a multi-phase task benefits from a playbook, always inside SDS routing. Playbooks that own
continuity, commits, PRs or worktrees (`opening-a-pr`, `babysit`, `session-pickup`, `pause-safely`,
`worktree-cleanup`, `multi-phase-plan`) yield to practices 01/03/05/14. Never nest orchestrators
(gstack `/autoplan`, `poteto-mode`, `figure-it-out`, `swarm`) nor run equivalent reviews from two
Kit layers. `why` and `recall` are read-only over admitted sources.

Project profile: from the adapter, `docs/memory/`, manifests, structure, build configuration, tests
and the affected component; never the repository name alone, and `package.json` does not make a
project web-only. Monorepos route per affected component and widen only for justified dependencies.
Read selectively first; ask only what still changes selection or safety (component purpose, critical
flow, authorized environment, scope). Separate observed facts, inferences and pending data; no
invented confidence. A stored profile is invalidated by a manifest or configuration change, a new
affected component, a plugin revision change or a user correction.

## Exclusion: work without pstack

«sin pstack», «no uses pstack», «haz esta tarea sin pstack», "no pstack", "don't use pstack" and
"don't use Lauren Tan's / poteto's skills" are one instruction. It beats every automatic
recommendation.

- Scope: the current task, its subagents and its continuations. Session- or project-wide only when
  the user says so; reactivation follows that scope and later instructions, never a silent global
  preference.
- Persistence: an active user restriction in the continuity checkpoint (practice 03) and in every
  delegation brief (practice 13). A phase that recommends pstack cannot re-enable it.
- Effect: no intentional load of pstack skill bodies; no direct, implicit, aliased, copied or
  delegated invocation. Continue with SDS-native routes and admitted tools. Descriptions the host
  already loaded cannot be unread; do not claim otherwise.
- Unchanged: SDS security, compatibility, tests, evidence, review and permission rules; impact
  analysis, review and tests still run, without pstack. Project tests or scripts once created with
  pstack help may run when running them invokes no pstack procedure; otherwise use the native
  alternative or report the limitation.

## Verification profiles

Verification is a project capability, not a per-agent ritual. Discover existing scripts, tests,
fixtures and runbooks first; generate a profile only when they are absent or insufficient, then
reuse it. Maintain it on relevant change, not per task.

| Surface | Candidate tools (only if available and admitted) | Resulting capability |
|---|---|---|
| Android | ARTEMIS, `adb`, logs | Concrete flows on device or emulator |
| iOS | build, Simulator, UI automation, project tests | The app through real interaction |
| Web | Playwright or the established runner | UI, navigation, network, observable results |
| Backend | existing tests, HTTP; Postman MCP only when admitted and simpler checks fall short | Contracts, API behavior, authorized integrations |

Candidates are neither dependencies nor authorized installs. Compiling, launching or a screenshot
never proves a flow; owning a tool never proves the access it needs. Each profile states: flow and
contract checked; environment and authorized data; interaction and expected result; evidence tying
result to version, environment and scope; parts left unverified; cleanup. Evidence lives in
`docs/prompts-output/<PROMPT_ID>/evidence/` without secrets, unnecessary personal data or
indiscriminate database access. `verify-<project>-<surface>` names are illustrative.

Generated skill paths: Claude Code `.claude/skills/`, Codex `.agents/skills/`, one copy for the
active host. First use and every regeneration are capability revisions for the ledger. No
`/run project verification` command exists; invoke the generated skill by its own name.

## Failed verification

A failing check authorizes diagnosis within scope, not product changes. Classify first: `PRODUCT`,
`VERIFIER`, `ENVIRONMENT`, `PREREQ_BLOCKED` or `INCONCLUSIVE`, recorded with the practice 16 line
(`FAIL`, `PARTIAL`, `NOT VERIFIED`, `FLAKY-SUSPECT`). An HTTP 500, a blank screen or a timeout proves
neither the root cause nor that this repository is responsible; a failure seen from one client never
authorizes editing another component or a server. Fix only with a supported cause and a task that
authorizes that component; then rerun the failed check and relevant regressions. Never relax
assertions, change expected results or drop steps to go green. Bound repair loops (two attempts
unless the task sets another limit), keep the attempts, report `BLOCKED`. Router checks passed ≠
product verified.

## Admission

Installation and this node do not authorize use. Record the exact plugin revision and mode in
`docs/governance/capability-registry.md`; otherwise it is `NOT_EVALUATED`. Recommended initial
mode: Claude Code plugin skills `1.1.0`; local read and edit inside task scope; no external effect;
no autonomous push, PR or merge (pstack itself requires explicit authority for those); reversible
with `claude plugin disable pstack@pstack` or `claude plugin uninstall pstack@pstack`. `why`/`recall`
MCP queries and any generated verification skill are separate modes.

## Disable and restore

Task: the exclusion above. Host: disable or uninstall the plugin. Project: remove or deprecate the
ledger row. No Kit script, installer, test or check depends on the plugin being present; removing
this node and its router row restores the previous routing exactly.
