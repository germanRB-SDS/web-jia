# Cross-Agent Skill Index

Ordered inventory of every skill this governance kit knows about and which agent can reach it.

**Generated file — do not edit by hand.** Regenerate with:

```bash
./sds-dev-governance/scripts/generate-skills-index.sh
```

`--check` fails when the committed index no longer matches the policy and the local stores.
`--check-policy` compares only the machine-independent part — the classified skill set, its
classes, its order and the tier counts — so a repository can assert it anywhere; that is the
mode `check-governance.sh` runs. Classification is owned by
`skills/cross-agent-portability.tsv`; a skill absent from that policy is never propagated.

## Summary

| Metric | Value |
|---|---|
| Classified skills | 88 |
| Portable by direct link (`LINK`) | 32 |
| Portable by curated rewrite (`PORT`) | 14 |
| Not portable (`CLAUDE_ONLY`) | 42 |
| Reachable from Claude Code | 86 |
| Reachable from Codex | 46 |
| Reachable from Gemini CLI | 46 |
| Reachable from all three | 44 |

Legend: `C` Claude Code, `X` Codex, `G` Gemini CLI. `✔` reachable locally, `·` absent.

## Tier 1 — direct link (`LINK`)

Provider-neutral `SKILL.md`. One real directory, symlinked into every agent store, so all three agents read the same revision.

```text
link/
+-- [CXG] deploy-to-vercel
+-- [CXG] find-skills
+-- [·XG] frontend-design
+-- [CXG] impeccable
+-- [CXG] sds-r8-analyzer
+-- [CXG] spline
+-- [CXG] threejs-agents-model-optimizer
+-- [CXG] threejs-agents-scene-builder
+-- [CXG] threejs-core-math
+-- [CXG] threejs-core-raycaster
+-- [CXG] threejs-core-renderer
+-- [CXG] threejs-core-scene-graph
+-- [CXG] threejs-errors-performance
+-- [CXG] threejs-errors-rendering
+-- [CXG] threejs-impl-animation
+-- [CXG] threejs-impl-audio
+-- [CXG] threejs-impl-drei
+-- [CXG] threejs-impl-ifc-viewer
+-- [CXG] threejs-impl-lighting
+-- [CXG] threejs-impl-physics
+-- [CXG] threejs-impl-post-processing
+-- [CXG] threejs-impl-react-three-fiber
+-- [CXG] threejs-impl-shadows
+-- [CXG] threejs-impl-webgpu
+-- [CXG] threejs-impl-xr
+-- [CXG] threejs-syntax-controls
+-- [CXG] threejs-syntax-geometries
+-- [CXG] threejs-syntax-loaders
+-- [CXG] threejs-syntax-materials
+-- [CXG] threejs-syntax-shaders
+-- [CXG] vercel-cli-with-tokens
\-- [CXG] vercel-optimize
```

| Skill | C | X | G | Rationale |
|---|:-:|:-:|:-:|---|
| `deploy-to-vercel` | ✔ | ✔ | ✔ | already installed in the shared universal store |
| `find-skills` | ✔ | ✔ | ✔ | already installed in the shared universal store |
| `frontend-design` | · | ✔ | ✔ | already provider-neutral design guidance |
| `impeccable` | ✔ | ✔ | ✔ | multi-harness frontend design skill, portable by design |
| `sds-r8-analyzer` | ✔ | ✔ | ✔ | SDS-authored, analysis-only, provider-neutral |
| `spline` | ✔ | ✔ | ✔ | SKILL.md is provider-neutral; the MCP bridge is registered per agent |
| `threejs-agents-model-optimizer` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-agents-scene-builder` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-core-math` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-core-raycaster` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-core-renderer` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-core-scene-graph` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-errors-performance` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-errors-rendering` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-animation` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-audio` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-drei` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-ifc-viewer` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-lighting` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-physics` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-post-processing` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-react-three-fiber` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-shadows` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-webgpu` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-impl-xr` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-syntax-controls` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-syntax-geometries` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-syntax-loaders` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-syntax-materials` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `threejs-syntax-shaders` | ✔ | ✔ | ✔ | provider-neutral three.js guidance |
| `vercel-cli-with-tokens` | ✔ | ✔ | ✔ | already installed in the shared universal store |
| `vercel-optimize` | ✔ | ✔ | ✔ | already installed in the shared universal store |

## Tier 2 — curated rewrite (`PORT`)

Useful but Claude/gstack-coupled. Codex and Gemini consume the SDS rewrite under `docs/codex-skills/from-claude/skills/`, never the Claude original.

```text
port/
+-- [CXG] browse
+-- [CXG] careful
+-- [CXG] cso
+-- [CXG] design-review
+-- [CXG] document-generate
+-- [CXG] document-release
+-- [·XG] graphify
+-- [CXG] guard
+-- [CXG] investigate
+-- [CXG] qa
+-- [CXG] qa-only
+-- [CXG] review
+-- [CXG] ship
\-- [CXG] spec
```

| Skill | C | X | G | Rationale |
|---|:-:|:-:|:-:|---|
| `browse` | ✔ | ✔ | ✔ | curated rewrite uses generic browser tooling instead of the gstack daemon |
| `careful` | ✔ | ✔ | ✔ | curated rewrite expresses the guardrails as procedural checks |
| `cso` | ✔ | ✔ | ✔ | curated rewrite is findings-first security review guidance |
| `design-review` | ✔ | ✔ | ✔ | curated rewrite drops the gstack browser dependency |
| `document-generate` | ✔ | ✔ | ✔ | curated rewrite is evidence-based documentation guidance |
| `document-release` | ✔ | ✔ | ✔ | curated rewrite removes publishing automation |
| `graphify` | · | ✔ | ✔ | curated rewrite references the official package and the SDS installer |
| `guard` | ✔ | ✔ | ✔ | curated rewrite expresses the scoped-edit posture procedurally |
| `investigate` | ✔ | ✔ | ✔ | curated rewrite drops external memory dependencies |
| `qa` | ✔ | ✔ | ✔ | curated rewrite targets generic tooling |
| `qa-only` | ✔ | ✔ | ✔ | curated rewrite targets generic tooling |
| `review` | ✔ | ✔ | ✔ | curated rewrite drops subagents and telemetry |
| `ship` | ✔ | ✔ | ✔ | curated rewrite removes push, PR, deploy and version automation |
| `spec` | ✔ | ✔ | ✔ | curated rewrite is bounded planning guidance |

## Tier 3 — not portable (`CLAUDE_ONLY`)

Requires the gstack runtime, a device bridge, a browser daemon, or Claude host semantics. Deliberately not propagated.

```text
claude-only/
+-- [C··] _gstack-command
+-- [C··] autoplan
+-- [C··] benchmark
+-- [C··] benchmark-models
+-- [C··] canary
+-- [C··] codex
+-- [C··] connect-chrome
+-- [C··] context-restore
+-- [C··] context-save
+-- [C··] design-consultation
+-- [C··] design-html
+-- [C··] design-shotgun
+-- [C··] devex-review
+-- [C··] freeze
+-- [C··] gstack
+-- [C··] gstack-upgrade
+-- [C··] health
+-- [C··] ios-clean
+-- [C··] ios-design-review
+-- [C··] ios-fix
+-- [C··] ios-qa
+-- [C··] ios-sync
+-- [C··] land-and-deploy
+-- [C··] landing-report
+-- [C··] learn
+-- [C··] make-pdf
+-- [C··] office-hours
+-- [C··] open-gstack-browser
+-- [C··] pair-agent
+-- [C··] plan-ceo-review
+-- [C··] plan-design-review
+-- [C··] plan-devex-review
+-- [C··] plan-eng-review
+-- [C··] plan-tune
+-- [C··] retro
+-- [C··] scrape
+-- [C··] setup-browser-cookies
+-- [C··] setup-deploy
+-- [C··] setup-gbrain
+-- [C··] skillify
+-- [C··] sync-gbrain
\-- [C··] unfreeze
```

| Skill | C | X | G | Rationale |
|---|:-:|:-:|:-:|---|
| `_gstack-command` | ✔ | · | · | gstack command dispatcher; no meaning outside the gstack runtime |
| `autoplan` | ✔ | · | · | orchestrates Claude subagents and auto-decisions |
| `benchmark` | ✔ | · | · | requires the gstack browse daemon |
| `benchmark-models` | ✔ | · | · | benchmarks gstack skills across Claude models |
| `canary` | ✔ | · | · | post-deploy monitoring bound to gstack deploy state |
| `codex` | ✔ | · | · | wrapper that shells out to another agent from inside Claude |
| `connect-chrome` | ✔ | · | · | launches the gstack Chromium build with its extension |
| `context-restore` | ✔ | · | · | reads gstack session state |
| `context-save` | ✔ | · | · | writes gstack session state |
| `design-consultation` | ✔ | · | · | generates preview assets through gstack tooling |
| `design-html` | ✔ | · | · | emits Pretext-native output tied to the gstack pipeline |
| `design-shotgun` | ✔ | · | · | opens a local comparison board served by gstack |
| `devex-review` | ✔ | · | · | live audit driven by the gstack browser daemon |
| `freeze` | ✔ | · | · | mutates Claude Code edit-scope state |
| `gstack` | ✔ | · | · | the runtime itself |
| `gstack-upgrade` | ✔ | · | · | upgrades the gstack runtime |
| `health` | ✔ | · | · | dashboard bound to gstack collectors |
| `ios-clean` | ✔ | · | · | iOS DebugBridge package management |
| `ios-design-review` | ✔ | · | · | requires the iOS device bridge |
| `ios-fix` | ✔ | · | · | requires the iOS device bridge |
| `ios-qa` | ✔ | · | · | requires the iOS device bridge |
| `ios-sync` | ✔ | · | · | regenerates the iOS debug bridge |
| `land-and-deploy` | ✔ | · | · | live deploy access through gstack |
| `landing-report` | ✔ | · | · | reads the gstack workspace queue |
| `learn` | ✔ | · | · | manages gstack project learnings |
| `make-pdf` | ✔ | · | · | depends on the gstack rendering toolchain |
| `office-hours` | ✔ | · | · | interactive Claude-specific role play |
| `open-gstack-browser` | ✔ | · | · | launches the gstack browser |
| `pair-agent` | ✔ | · | · | pairs a remote agent with the gstack browser |
| `plan-ceo-review` | ✔ | · | · | depends on AskUserQuestion semantics |
| `plan-design-review` | ✔ | · | · | depends on AskUserQuestion semantics |
| `plan-devex-review` | ✔ | · | · | depends on AskUserQuestion semantics |
| `plan-eng-review` | ✔ | · | · | depends on AskUserQuestion semantics |
| `plan-tune` | ✔ | · | · | tunes gstack question sensitivity |
| `retro` | ✔ | · | · | reads gstack history collectors |
| `scrape` | ✔ | · | · | requires the gstack browse daemon |
| `setup-browser-cookies` | ✔ | · | · | imports cookies into the gstack browse session |
| `setup-deploy` | ✔ | · | · | configures gstack deploy settings |
| `setup-gbrain` | ✔ | · | · | installs and registers gbrain |
| `skillify` | ✔ | · | · | codifies a gstack browse flow into a skill |
| `sync-gbrain` | ✔ | · | · | synchronises gbrain state |
| `unfreeze` | ✔ | · | · | clears Claude Code edit-scope state |

## Notes

- A `·` under Claude for a `LINK` row means the skill ships as a Claude *plugin* rather than a
  filesystem skill, so there is no directory to bridge.
- `CLAUDE_ONLY` rows are expected to show `·` for Codex and Gemini. That is the decision, not a gap.
- Reachability is measured by following symlinks to a readable `SKILL.md`; it does not assert that
  the skill's own runtime dependencies are installed.
