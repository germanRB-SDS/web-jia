# SDS Dev Governance — Changelog

## v1.30.0 — 2026-09-25

Change ID: `REL-2026-09-25-01`

- Add `resources/frontend-patterns/ui-components/button-leather-shimmer`: material CTA button pattern promoted
  from `web-jia` (prompt `[50-0]`) after the owner's visual validation. Diagonal leather gradient, relief built
  from a cast shadow plus an inset bottom edge, a slanted glint that crosses in under a third of its cycle and
  rests off-screen, lift on hover, sink on press, and an optional icon slot: plain `<svg>` children advance,
  children marked `bls-btn__badge` spin. Pure CSS, no JS. Every colour is a custom property so it maps onto the
  receiving project's design tokens; the shipped values are a neutral starting point, not a brand.
- The how-to names the third-party reference it was modelled after («Wild West Shimmer Button», by LeonKohli on
  Uiverse, MIT) and records the two performance defects of that reference, both flagged in its own published
  critique, together with what replaces them here: the glint moves a positioned strip with `transform` instead of
  animating `background-position` (which repaints on the CPU every frame), and state changes list their
  properties instead of using `transition: all` (which forces layout and shadow recalculation).
- Accessibility is part of the contract, not a note: contrast is measured against the gradient's lightest stop
  (6.0:1 with the shipped defaults), the focus ring is verified to survive the button's own `overflow: hidden`,
  the 48px touch target is preserved, and reduced motion stops the glint, the lift, the sink and the icons while
  deliberately keeping the hover colour change, which is the state signal.
- Index, category README and glossary updated in the same change: index row, `ui-components/README.md` bullet and
  the canonical term `leather-shimmer` with its aliases and its boundary against `text-shimmer` and `border-glow`.
- `README.md` version line corrected: it still read v1.27.0 after two releases.
- No rule, practice, router, adapter, installer, scaffold or always-read change.

## v1.29.0 — 2026-09-19

Change ID: `REL-2026-09-19-01`

- Add `resources/web-components/` (category README + index section): complete, validated components promoted from
  a project, heavier than a pattern. Each leaf carries the working source in `component/` (copied unchanged, no
  project imports, no site colours), the validated site side in `integration/` (to map, not to paste) and an
  `INDEX-AND-HOW-TO-USE-THEM.md` with an agent procedure and acceptance list.
- Add `resources/web-components/tree-3d`: procedural animated 3D tree (Three.js 0.186, WebGL 2; no model, video or
  GSAP): stems, lobed crown of 22 000 instanced leaves, hanging roots, flat-faced rocks, shader wind, leaves torn
  off that drift towards the viewer, haze, two-step ground shade, exact camera fit by projection, CSS-token palette.
  React wrapper, framework-free `mount-tree.ts`, no-build `vanilla/` demo (rendered and checked), `AUDIT.md` with
  every origin file, colour constant, option and decision, and three previews. The reference it was modelled after
  is a third-party video: not used, not linked.
- Publish `knowledge/` (README, image→SVG, iOS HealthKit chart) and restructure: the Android/Google Play release
  guide moves from `resources/how-to/` to `knowledge/android/how-to-release-an-app/` (content unchanged) with a new
  `knowledge/android/README.md`; the resources index and the P00–P13 prompt catalog point at the new path.
  `resources/how-to/` no longer exists.
- Checker: `routing_ref_resolves` used `printf … | grep -q` under `pipefail`; on a copy whose file list outgrows the
  pipe buffer the writer died of SIGPIPE and four valid references were reported as missing ("routing surfaces
  reference governance paths that do not exist"). Here-strings fix it (Bash 3.2 compatible).
- No rule, adapter, practice, installer or always-read change.

## v1.28.0 — 2026-09-17

Change ID: `REL-2026-09-17-01`

- Add `skills/pstack.md`: pinned plugin revision (`pstack@pstack` 1.1.0, painhardcore fork of Cursor
  pstack), per-host invocation, selection table for the priority skills with use/no-use,
  native alternative and precedence, proportional `poteto-mode`, project discovery, user
  exclusion («sin pstack») with inherited scope, verification profiles per surface, failure
  classification and admission/removal. One router row in `skills/README.md`; kernel and INDEX unchanged.
- Carry active user restrictions in continuity checkpoints (practices 03/11) and in a new
  delegation brief (practice 13). Claude/Codex adapters invoke, Gemini falls back natively.
- Checker: required node, routing fixtures (unknown-subsystem routes to pstack; UI/R8/3D/migration/
  security/graph fixtures do not), no embedded skill bodies, no script/bootstrap/catalog dependency.
  New offline `tests/test-pstack-integration.sh`. Always-read set 3000 → 2986 words.
- No installer, plugin-catalog row, cross-agent bridge row or vendored copy: each host installs the
  pinned revision itself; admission stays per project ledger.

## v1.27.0 — 2026-09-10

Change ID: `REL-2026-09-10-02`

- Add lazy MCP control under Practice 07, preserving the existing admission ledger and
  GitHub manual-owner deletion rule. Separate machine observations from normative admission.
- Add bounded offline inventory/check/doctor, semantic atomic staging/recovery for Codex
  and Claude, and closed stdio gateways for five Hostinger identities. No real provider
  operation, credential access, OAuth fallback or auto-activation is enabled.
- Pin optional quarantined Hostinger tooling to @hostinger/mcp 1.58.0 and exact dependencies.
- Test synthetic custody parsing, two-event destructive batches, forgery/replay denial,
  concurrency, uncertain-outcome reconciliation, output channels and configuration recovery.
  Real OS isolation and human approval channel remain explicit activation prerequisites.
- Bootstrap copies the optional tooling and adapters, without touching global client configs.

## v1.26.0 — 2026-09-09

Change ID: `REL-2026-09-09-11`

- Add optional `sds-text list|get|check|index`: stable H2 codes, calculated ranges, a bounded UTF-8
  snapshot, preamble/required sections and explicit same-file dependency closure. Invalid IDs,
  cycles, unclosed fences, stale SHA/index or complete-output budget failures emit no partial text.
- Add read-only `governance-freshness.sh`: pinned active revision, local/worktree/vendored evidence,
  offline/timeout/ancestry/dirty reports. No fetch, pull, automatic update or silent adoption.
- Synchronize memory/prompt/output/evolution owners, lazy module, authoring templates, example,
  checker and README. Preserve kernel/practice INDEX and existing bootstrap safety contract.
- Publish reproducible native/wrapper/derived-index metrics with pinned tokenizer, complete retrieval
  overhead and explicit limits. The 75% goal is evaluated, not promised; no fabricated model/billing
  measurements or external endorsement.

## v1.25.2 — 2026-09-09

Change ID: `REL-2026-09-09-10`

### Fixed

- Bootstrap now creates a bounded plan and preserves existing files, independent child repos,
  worktree metadata, symlinks and existing `.sds-new` proposals. Explicit hub/files-only/dry-run
  modes have no installers, Git or global effects; skip-skills also skips bundled skills.
- Bash 3.2/5.3 wrappers propagate failures. One Python stdlib engine owns the script/metaprompt
  contract; nested adapter references resolve from their declared module depth.
- Classifier validates complete requests and returns nonzero for invalid arguments/paths. Old
  releases require an exact original baseline before SAFE_UPGRADE; content changes in known
  files cannot be hidden by newer canonical versions. Fingerprints include mode/type/link text.
- Checker uses a private temporary directory, avoids following symlink directories and respects
  independent hub repositories. GitHub verb checks support Bash 3.2; hook installer recognizes
  the canonical kit layout. Bundled/ported copies preserve divergent installed skills.

### Preserved and verified

- Upnews v1.25.1 SwiftUI PayPal reference (five files and resource index) promoted with provenance;
  its test intercepts the URL without opening a browser. Three Swift tests pass on macOS.
- Original Unreleased claims for canonical split detection and `.git` pointer exclusion describe
  behavior already present in cdf80a7/v1.25.0. Regression coverage remains; these are not new fixes.
- Adversarial fixtures and full project/hub checker evidence are in the release report. Optional
  global install paths were audited and tested with doubles; no real global installations ran.

## v1.25.0 — 2026-09-03

Change ID: `REL-2026-09-03-02`

Canonical reconciliation release. The canonical repository had fallen behind the governance its own
projects were producing: `main` carried the v1.21.0 lineage plus three later feature branches, while
two independent project copies shipped a byte-identical v1.24.1. This release promotes that
validated downstream lineage, preserves everything it would have dropped, and makes the promotion
cycle itself a permanent, executable governance capability.

### Promotion provenance

- Promotion candidate: `v1.24.1` (2026-08-22), tree fingerprint `0361edc76b1b`, held identically by
  two project copies. Validated before promotion: shell syntax, the three isolated suites
  (guardrails, skills, plugins), `VERSION.md`, `CHANGELOG.md`, and no uncommitted delta in either
  copy.
- Preserved from canonical `main`, which the candidate never saw: the Vercel skill entry, the
  `sds-r8-analyzer` skill and its versioned runtime bundle, the Android/Google Play release how-to
  and agent-prompt catalog, and the repository `.gitignore`.
- Preserved from a second, materially different `v1.23.0` released 2026-08-22 in another project:
  `procedural-horizon-hero`, the new `site-compositions` category with `grounded-editorial-studio`,
  and the clean-room `grounded-studio-reference` sample. The candidate descends from a `v1.23.0`
  released 2026-08-20 with different content; both are valid, and this is recorded as a genuine
  same-version split rather than resolved by discarding one side.
- Integrated over the reconciled baseline rather than over its original base: the Spline entry, the
  cross-agent availability policy and bridge, the portability catalog and the generated index
  `[REL-2026-09-03-01]`.

### Added

- `practices/modules/11-governance-distribution.md`: the permanent promotion and distribution
  contract, lazy-loaded from practice 11. Canonical authority, downstream incubation over an
  arbitrary `N` projects, promotion-candidate selection with the newer-wins default, the
  `SUPERSEDED` / `INTENTIONAL_REMOVAL` / `PRESERVE` / `UNKNOWN` regression scan, split-version
  handling, the eight project-copy states, provenance, and the rule that a descendant copy is never
  blindly overwritten.
- `scripts/governance-copies.sh`: discovers `0..N` governance copies from `--root`, `--path` or
  `--stdin`, fingerprints each tree deterministically and classifies it against a baseline. It
  contains no project name, and the checker fails if one is ever added.
- `GOVERNANCE.md` gains the minimum-sufficient-subgraph rule; `practices/12-governance-proportionality.md`
  gains the sharding criteria and the budget policy — exceeding a context budget is a signal to
  shard, never to raise the limit.
- `practices/05-git-branching.md` gains the concurrent-writer section: one task, one isolated
  branch, preferably an isolated worktree, path-scoped staging and staged-diff inspection before
  every commit, with broad staging prohibited when the tree may hold another session's work.
- `skills/catalog-authority.md` and `skills/bootstrap-and-agents.md`: on-demand nodes carrying the
  catalog-ownership rules and the install/bridge sequence that the always-read router no longer
  holds.
- `skills/install-catalog.tsv` gains a `doc` column binding each capability to its governance
  document, and a `bundled` scope that `--bundled-only` selects by.
- `scripts/generate-skills-index.sh` gains `--check-policy`: the machine-independent comparison of
  the generated index against the policy it derives from. `--check` remains the local gate.
- `skills/r8-analyzer.md`, the `skills/README.md` route and the versioned
  `skills/runtime/sds-r8-analyzer/` bundle add an SDS-maintained derivative of Google's Android R8
  analysis skill. The derivative removes unavailable upstream quantitative-script paths and adds
  evidence-backed activation, artifact, keep-rule, missing-rule, retrace, size and validation
  guidance `[REL-2026-09-02-01]`.
- `skills/vercel-skills.md`: catalog entry for the Vercel Agent Skills (`deploy-to-vercel`,
  `vercel-cli-with-tokens`, `vercel-optimize`) distributed through the open `skills` CLI. Documents
  provenance, the shared `~/.agents/skills` universal store and its per-agent linking for Claude
  Code and Codex, the SDS workflow mapping, and the constraints that make them effect-bearing:
  preview-by-default deployments, token secrecy, configuration blast radius, billing-adjacent output
  handling and deployment irreversibility. Upstream frontend/writing skills are explicitly excluded.
- Canonical Android/Google Play release how-to and reusable agent-prompt catalog, officially verified
  2026-09-01, with secure signing, key recovery, API/Console authority and the FIELDS 1.0.8 case
  `[REL-2026-09-01-05]`.
- `skills/spline.md`: catalog entry for Spline. Documents that the MCP server ships **inside** the
  V2 desktop app (`/Applications/Spline.app/Contents/Resources/spline-mcp.cjs`), that the bridge is
  inert until the app attaches and publishes its manifest, the `3d_*` / `2d_*` tool families and
  their `load_skill`-first contracts, the auto-registration side effect on launch, and the rejection
  of the unpinned community `spline-mcp-server` supply chain.
- `skills/cross-agent-availability.md`: the policy and scripts that make one trusted skill revision
  reachable from Claude Code, Codex and Gemini CLI without forking content. Three tiers (`LINK`,
  `PORT`, `CLAUDE_ONLY`) and the enforced guarantees: dry-run by default, non-destructive,
  idempotent, fail-closed, traceable by hashed inventory, reversible.
- `skills/cross-agent-portability.tsv`: fail-closed classification of all known skills.
- `skills/INDEX.md`: generated ordered index of every classified skill and its per-agent
  reachability, with a drift gate.
- `scripts/sync-agent-skills.sh`: the bridge. Report-only by default; `--apply` creates symlinks;
  `--inventory` records `agent/skill/kind/sha256`.
- `scripts/generate-skills-index.sh`: regenerates `skills/INDEX.md`.
- Frontend knowledge preserved from the parallel lineage: `procedural-horizon-hero`,
  `site-compositions/grounded-editorial-studio` and the runnable `grounded-studio-reference`.

### Changed

- **Skill files use stable semantic slugs.** `01-impeccable.md` becomes `impeccable.md` and so on
  through the catalog; `00-INDEX.md` becomes `INDEX.md`. Ordering now lives only in generated
  indexes and router tables. Every consumer was rebuilt by search: adapters and their nested
  variants, practice 01, both bootstrap paths, the checker, the index generator and the skills
  router. Released changelog entries keep the historical filenames.
- Catalog ownership is explicit and non-overlapping: `install-catalog.tsv` owns installation,
  `cross-agent-portability.tsv` owns propagation, `INDEX.md` owns observed reachability and stays
  generated. `skills/README.md` routes to all three and restates none of them.
- `skills/README.md` is sharded back to an always-read router. The always-read SDS set returned from
  3440 to under 3000 words against the budget the checker already enforced.
- `scripts/install-skills.sh` is one catalog-driven orchestrator: bundled skills are a catalog scope
  rather than a hard-coded call, the curated port installs for both Codex and Gemini, the
  cross-agent bridge runs as a guarded step, and verification follows symlinks across all three
  agent stores.
- `adapters/{CLAUDE,AGENTS,GEMINI}.md` and their nested variants carry the `Skills Routing` section
  naming each agent's store, the catalogue, the ordered index and the ledger.
- `practices/INDEX.md` routes distribution and promotion work through practice 11, with practice 05
  as its dependency for concurrent execution.

### Fixed

- `init-project-prompt.md` had lost its `{{NOMBRE_PROYECTO}}` / `{{RUTA_LOCAL}}` placeholders and
  carried a source project name and a machine-specific absolute path. The line arrived from the
  parallel `v1.23.0` lineage without conflicting, so the merge imported it silently and the
  candidate's own portability gate caught it.
- Bundled-skill verification asserted one specific skill unconditionally instead of verifying the
  bundled rows the catalog actually installed.
- Isolated skill fixtures reached outside their sandbox because the installer's cross-agent bridge
  writes to real agent homes. `SDS_SKILLS_BRIDGE` now allows an explicit opt-out and the fixtures
  pin all three agent homes.

### Security

- Spline remains `QUARANTINED`. With the bundled bridge process running and no Spline application
  attached, the server published an empty tool manifest to this session, so the runtime manifest is
  still unverified. No manifest was invented and no admission was widened.
- Installation still grants no admission. Every capability remains fail-closed in the project
  `docs/governance/capability-registry.md` until its exact revision and mode are admitted.

### Validation

- Shell syntax across the kit; the three isolated suites (GitHub guardrails, skill bootstrap, plugin
  bootstrap); index determinism plus the new machine-independent policy check; a full `init.sh`
  bootstrap into an isolated project followed by the complete checker: 595 checks, 0 failures.
- New routing gates, each verified against a deliberate break: existence and integrity of every path
  a routing surface names, coverage of every skill, practice and practice module from its
  entrypoint, and six task fixtures that must route to their node and not to unrelated specialists.
- Cross-agent bridge idempotence on the real stores: 0 planned, 62 already correct, 0 conflicts,
  0 unclassified. Claude Code 86 reachable skills, Codex 46, Gemini 46; the Gemini CLI is not
  installed on this machine, so its end-to-end load is recorded as not tested rather than passing.

## v1.24.1 — 2026-08-22

Change ID: `REL-2026-08-22-01`

### Fixed

- Root adapter templates once again use `{{NOMBRE_PROYECTO}}` and `{{RUTA_LOCAL}}` instead of a
  source-project name and machine-specific absolute path.
- Root adapter templates and bootstrap guidance now point to the installed wrappers under
  `sds-dev-governance/scripts/`.

### Added

- Governance template portability checks require both project placeholders, validate the wrapper
  path and reject machine-specific absolute paths in portable templates.

### Validation

- Shell syntax, isolated guardrail/skill/plugin tests, complete generated-project checker and an
  isolated `init.sh` probe with a synthetic project name/path.

## v1.24.0 — 2026-08-21

### Added

- Lazy `plugins/base-catalog.tsv` and router, plus read-only `plugin-status.sh`.
- Idempotent Figma registration for Claude Code and Codex, covering Design and Make through one
  official integration while deferring OAuth.
- Bounded local state with install/change/check timestamps and isolated plugin/bootstrap tests.
- Regression certification for the complete v1.23.0 skill bootstrap introduced on 2026-08-20.

### Changed

- `init.sh` and the manual bootstrap install/check skills and base plugins independently by
  default, with explicit `--skip-plugins` / `SDS_INSTALL_PLUGINS=0` opt-out.
- Plugin indexes and runtime state are lazy: routine adapters and governance reads do not load them.

### Security

- Existing plugin/MCP configurations are preserved, OAuth never runs in non-interactive bootstrap,
  runtime state contains no tokens, and installation continues to grant no SDS admission.

### Validation

- Shell syntax, fake Claude/Codex first install, idempotence, conflict preservation, missing CLIs,
  dry-run, default init, opt-out, baseline skill certification and both governance checkers.

## v1.23.0 — 2026-08-20

### Added

- Declarative `skills/install-catalog.tsv` covering Impeccable, gstack, skillui, Three.js and
  Graphify, plus isolated bootstrap/idempotence tests.
- Pinned OpenAEC Three.js skill-package integration for Claude with shared Codex links and explicit
  provenance.

### Changed

- `init.sh` installs/checks the complete catalog by default; `--skip-skills` disables the catalog
  and `--skip-graphify` excludes only Graphify. The previous `--install-skills` flag remains a
  compatible explicit enable.
- Bootstrap, skill router and admission contract now state that installation never populates or
  bypasses the fail-closed project capability ledger.

### Security

- Existing skill destinations are preserved, upstream revisions are pinned, and a bootstrap
  network/install failure degrades to a visible warning without destroying the scaffold.

### Validation

- Shell syntax, catalog dry run, isolated Three.js materialization/linking/idempotence, default init
  and explicit opt-out are exercised without network access.

## v1.22.0 — 2026-08-15

### Added

- Always-on manual-owner-only contract for GitHub remote deletion and protection weakening. Agent
  execution has no chat override; guidance and admitted read-only verification remain available.
- Fail-closed `scripts/gh-safe.sh`, explicit-ref `git-safe-push.sh`, a non-fast-forward/deletion
  pre-push hook and non-destructive per-clone installer.
- Canonical active branch ruleset with `~ALL`, zero bypass actors, `deletion` and
  `non_fast_forward`; idempotent all-owned audit/apply with plan/permission failures kept non-green.
- Negative/idempotence test suite with isolated fake GitHub/Git executables.

### Changed

- Practices 05/07, kernel, INDEX, RULE-COVERAGE and all portable/materialized adapters route remote
  GitHub and push work through the new guardrails.
- Bootstrap paths, both checkers and kit documentation now require and validate the complete
  guardrail leaf. The project capability ledger admits only the fingerprinted read-only `gh` mode
  until the exact apply mode closes its gates.

### Security

- Agents never request `delete_repo`, execute DELETE/GraphQL mutations, force-push/delete refs, or
  weaken/remove/bypass protections. Server-side ruleset unavailability on a private Free-plan repo
  is reported as a blocker; privacy is never weakened to gain ruleset support.

### Validation

- Shell syntax, wrapper denial cases, idempotence, checker parity, governance checks, isolated
  bootstrap and remote read-back are the required V4 closure set.

## v1.21.0 — 2026-07-24

### Added

- Portable `resources/frontend-patterns/ui-components/notification-toast-stack/` reference with
  HTML/CSS/JavaScript and discovery tag `notificaciones-01`.
- Accessible `info`, `success` and `error` states, safe DOM text, inline SVG icons, responsive width,
  3.5-second default dwell, animated automatic exit, immediate click/keyboard dismissal and
  reduced-motion fallback.

### Changed

- Resource catalog, glossary, component/kit READMEs, bootstrap required-files, generation prompt and
  both byte-identical governance checkers now preserve and validate the complete pattern leaf.

### Validation

- Shell syntax, checker parity, resource indexing, JavaScript syntax and isolated bootstrap validate
  the portable resource and its installation path.

## v1.20.0 — 2026-07-21

### Added

- Practice `16-verification-proportionality.md`: verification scope proportional to real blast
  radius. V0-V4 amplitude scale with orthogonal modalities, per-checkpoint decision algorithm with
  V0/V1 fast path, evidence identity and reuse (no-change-no-rerun, superset, selective
  invalidation, reactive baseline, FLAKY-SUSPECT), marginal-signal rule, critical-surface floors and
  a conditional `Verification:` record. Root is a 633-word kernel (ratified 25% of the executable
  bundle); escalators, V4 triggers, consumer incorporation, modality table, anti-gaming and the
  derived calibration ledger live in the lazy module `practices/modules/16-verification-scope.md`
  (loaded only on V3/V4 candidates, critical surfaces, scope disputes or dubious evidence reuse).
- `check-governance.sh`: practice count 15→16 and deterministic practice-16 invariants (root/module
  presence and routing, ratified word budget, scale anchors, no second `LEVEL` scale).
- INDEX routing row + conditional module row + practice 16 added to executable bundles;
  RULE-COVERAGE ownership row; `init.sh` required-files parity for the new module.
- Output template section 7 now defers test scope to practice 16 (tool rows are examples, not
  mandates).

## v1.19.0 — 2026-07-21

### Added

- Portable `resources/frontend-patterns/ui-components/expandable-search-filter-panel/` reference
  with HTML/CSS/JavaScript and an integration guide. It combines a collapsible bordered panel with
  a search field that expands when secondary filters are hidden and contracts to reveal aligned,
  state-preserving filters.
- Accessibility, responsive, reduced-motion, focus-transfer and shared-query guidance so hidden
  criteria continue to scope result lists and autocomplete suggestions.

### Changed

- The resource catalog and component READMEs expose the new lazy-loaded pattern.
- `init.sh` and `init-project-prompt.md` now explicitly require/materialize the complete pattern leaf,
  while both byte-identical governance checkers fail if the resource, index entry or autocomplete
  scoping guidance is lost.

### Validation

- Shell syntax, checker parity, resource-index enforcement and an isolated `init.sh --skip-graphify`
  bootstrap verify that new projects receive all pattern files.

## v1.18.0 — 2026-07-20

### Added

- Lazy-loaded `practices/modules/11-capability-admission.md`, preserving the complete G1-G6 block
  byte-for-byte while routine exact admitted invocations use only the skills router and project ledger.
- Deterministic checker gates for canonical shard maps, existing targets, duplicate entries,
  forbidden subshards, acyclic Cross-links and Practice 11 module routing.
- Routing metrics in the existing governance evaluation system: critical/general recall, precision,
  area-context reduction, fallback, expansion and explicit blindness/adjudication status.

### Changed

- Database, backend and frontend project memories now use canonical index entrypoints plus direct
  semantic shards; legacy flat paths remain four-line deprecated stubs.
- Active adapters, memory/feature indexes, frontend preflight and skill guidance route through the
  new entrypoints without loading every shard.
- Practice 11 root falls from 2,634 to 1,612 words. Always-read context changes from 2,491 to 2,596
  words and remains within the unchanged 3,000-word budget.

### Validation

- Both byte-identical checkers pass; six negative fixtures fail closed for the expected route/module
  defects. All 83 migrated technical sections compare byte-identically.
- The 15-case retrospective is honestly `NOT_BLINDED`: no area is declared `ROUTING_PROVEN`;
  backend routing remains not proven after a Push/waitlist shard miss, and its trigger is reinforced.

## v1.17.0 — 2026-07-20

### Added

- Project-local `docs/governance/capability-registry.md` as the sole effective admission ledger,
  with an empty fail-closed scaffold for clean projects.
- Deterministic checker coverage for the closed status enum, explicit admission constraints,
  portable scaffold and stale imperative Graphify update instructions.

### Changed

- The always-read `skills/README.md` is now a compact portable router instead of carrying personal
  environment fingerprints; effective decisions load only when a capability is involved.
- Root Graphify adapters no longer instruct agents to execute the unevaluated `update` mode.
- Practice 11 defines `DEPRECATED` ownership and transition for new and in-flight work.
- Always-read governance context decreases from 2,809 to 2,491 words without raising budgets.

## v1.16.0 — 2026-07-20

### Added

- Property-based agent-capability admission in practice 11 with G1–G6, proportional light/full
  routes, fail-closed states, effective revision/mode identity and delta-only reassessment.
- Canonical admission registry in `skills/README.md`, including evidence-backed decisions for the
  inspected `context7`, `code-review`, Claude/Codex `skill-creator` and Graphify query modes.
- Incremental owner/consumer/reopen edges in `practices/RULE-COVERAGE.md` so governance changes
  reuse canonical controls and inspect only material synchronization candidates.

### Changed

- Kernel and INDEX now route new/changed agent capabilities through practice 11; marketplace or
  personal installation no longer implies SDS authorization.
- Graphify governance discovery is constrained to local `query/path/explain` for version 0.9.9 with
  query logging disabled. Its graph remains ignored, derived and non-authoritative.
- Governance synchronization now records `CHANGE` or justified `N/A` per candidate instead of
  rewriting scaffold, adapters, bootstrap or validators when their contract did not change.

### Security

- Rejects the inspected unpinned `context7` `npx -y` mode and the inspected publishing/filtering
  `code-review` command, while admitting only quarantined draft modes for the fingerprinted
  Claude/Codex `skill-creator` bundles.

## v1.15.0 — 2026-07-15

### Added

- Mandatory lightweight `practices/INDEX.md` with explicit load/no-load/dependency semantics for
  every numbered practice 01–15, plus fail-closed registration rules for future practices.
- Audit-only `practices/RULE-COVERAGE.md` mapping rule families to their canonical owners without
  adding it to default agent context.
- Validator gates for route completeness/uniqueness, context budgets, stale blanket-preload
  wording, duplicate kernel sections and root/template/nested adapter propagation.
- Positive root+nested bootstrap smoke and negative fixtures for a missing route, stale adapter and
  exceeded always-read budget.

### Changed

- Authorized governance `MODIFICATION`: replace the blanket preload of practices 01–13 with
  `GOVERNANCE.md` kernel → `practices/INDEX.md` → only routed practices and declared dependencies.
  All detailed practices remain available; unchanged practices 01–12 and 14 are byte-identical.
- Always-read SDS context reduced from 11,735 to 2,208 words (`-81.2%`) without deleting any
  practice or weakening conditional contract-authority, phase-close, security or non-regression
  gates.
- Claude, Codex, Gemini and Cursor root adapters, portable templates and nested adapters now share
  the same provider-neutral selective-loading contract.
- Script and prompt bootstrap paths, project/scaffold preflights and both governance validators now
  generate and enforce the same routed model.

## v1.14.0 — 2026-07-14

### Added

- External frontend sample-code reference category
  `resources/frontend-external-sample-code/`, with `midu-gta-vi-hero` notes for midudev's public
  GTA VI-inspired Astro/Tailwind/GSAP hero sample. The resource records source URL, upstream tree
  SHA, local-run instructions, reusable hero-pattern findings and a clean-room analysis protocol;
  it intentionally stores the URL and findings rather than vendoring source or GTA assets.
- Second online GTA VI landing reference
  `resources/frontend-external-sample-code/ivancidev-gta6-landing-clone`, recording the public
  source URL, Vercel deployment URL, observed commit/tree SHA, live HTTP 200 check, Astro/React/GSAP
  + Lenis findings and the same clean-room/no-vendoring policy for GTA/Rockstar assets.
- Conditional practice `practices/15-contract-authority.md`: semantic definition of an established
  contract; `ACTIVE_CONTRACT`, `DERIVED_ARTIFACT`, `RUNTIME_REALITY`, and `HISTORICAL_ARTIFACT`
  evidence roles; authority/scope/supersession protocol; and mandatory owner `stop-and-ask` for
  unresolved material contradictions.
- Resolution classes `ERROR`, `CLARIFICATION`, `ADDITION`, `MODIFICATION`, and `IMPROVEMENT`, with
  propagation fields for recording the authorized decision in prompt outputs and governance logs.

### Changed

- `GOVERNANCE.md` and Claude, Codex, Gemini, and Cursor adapters carry only a lightweight load router;
  the full contract-authority practice is read only for prompt/instruction work with normative
  effect, contract-to-repository comparison, or contradiction signals. Casual Q&A, status,
  navigation, factual inventory, deterministic checkpoints, and unambiguous mechanical edits do not
  preload it.
- Prompt authoring/revision, preflight, bootstrap, output templates, and governance validators now
  route unresolved normative conflicts to
  `BLOCKED — OWNER CONTRACT DECISION REQUIRED` before dependent mutation or execution approval.
- Repository and runtime evidence establish observed behavior for an identified revision/environment;
  they no longer win automatically over an authorized active contract.

## v1.13.0 — 2026-07-09

### Added

- Agentic-engineering CI/CD guide `agentic-engineering/ci-cd_to_catch_hallucinations.md`: stack-aware
  detection of AI failure modes before human review (lockfile drift vs. hallucinated imports, Node/npm
  and Python/Ruff controls, gate order A–H, coverage without dogma, control matrix, dependency-addition
  protocol, agent instructions, adoption levels, non-goals, adaptable examples). Linked from the area
  README.
- Agentic-engineering module (`sds-dev-governance/agentic-engineering/`): AI-code assurance rule
  `ai-code-assurance.md` (**The Golden Rule** — a PR/MR signature means 100% ownership of the code,
  human- or AI-drafted — plus the improved AI-code assurance checklist: dependency reality,
  resilience, anti-false-green tests, secrets/security, contract/scope) and
  `check-ai-pr-assurance.sh`, a posterior PR/MR body validator (marker present, no unchecked
  assurance box, owner sign-off confirmed, optional owner match). Materialized as
  `.github/PULL_REQUEST_TEMPLATE.md` and `.gitlab/merge_request_templates/Default.md`, with the
  portable source (placeholder `{{ACCOUNTABLE_OWNER}}`) under `scaffold/.github/` and
  `scaffold/.gitlab/`. Wired into `GOVERNANCE.md`, `practices/10-pre-pr-checklist.md`, `init.sh`
  (copy + required-file check + owner reminder) and `check-governance.sh`.
- Selective frontend preflight add-ons:
  `docs/prompts/preflight-frontend-ui.md` for frontend/UI readiness and
  `docs/prompts/preflight-frontend-security.md` for browser-boundary security, loaded by the main
  preflight only when the target prompt affects those surfaces.
- Lightweight preflight module router at `docs/prompts/preflight-module-index.md`, so agents load
  the main preflight first, then only applicable current or future add-ons.
- Temporary prompt execution memory convention: long-running, `LEVEL 3`, multi-gate, release,
  migration, refactor, security, or high context-risk prompts should use
  `docs/prompts-output/<PROMPT_ID>/tmp/` for recoverable checkpoints and
  `docs/prompts-output/<PROMPT_ID>/evidence/` for heavy evidence, never `docs/prompts/`.

### Changed

- Graphify project adapter installation now checks adapter/hook write permissions before each
  platform registration and normalizes generated hook commands to invoke `graphify` through `PATH`
  instead of recording a user-specific resolved binary path, keeping the SDS kit portable when copied
  between projects.
- `init.sh` now detects required-file path collisions where the destination is a directory and writes
  a sibling `.sds-new` instead of silently copying the file inside that directory.
- The read-only prompt preflight now documents lazy-loading rules for frontend UI and frontend
  security add-ons, avoiding token/time cost for backend-only, DB-only, API-only, deployment-only,
  or documentation-only prompts.
- Claude, Codex, Gemini, Cursor, and nested adapter templates now carry only the minimal preflight
  trigger and point to the module index, avoiding duplicated static checklists in agent memory.
- Future specialized preflights must be registered in the module index with precise load/no-load
  conditions and must remain lazy-loaded.
- Prompt preflight reports now have canonical persisted names:
  `docs/prompts-output/[NN-R]preflight.md` for the first pass, then
  `[NN-R]preflight-2.md`, `[NN-R]preflight-3.md`, etc. for re-preflights of the same target.
- Prompt naming now allows compact planned-iteration insertions (`[NN-Ra]`, `[NN-Rb]`, ...)
  when new executable prompts must be inserted after an executed `[NN-(R-1)]*` variant but before
  an already planned `[NN-R]`; refinements stay as `-alpha`, `-beta`, etc. on the full identifier.
- Added lazy-loaded bilingual nomenclature know-how at
  `sds-dev-governance/resources/nomenclature-explanation.md`, indexed for use only when the user or
  prompt asks about nomenclature, naming help, conventions, or know-how.

## v1.12.0 — 2026-06-26

### Added

- Read-only prompt preflight template at `scaffold/docs/prompts/prompt-revision-preflight.md`,
  materialized in projects as `docs/prompts/prompt-revision-preflight.md`.
- Claude, Codex, and Gemini adapter triggers for "preflight de desarrollo", "dev preflight",
  "development preflight", "preflight del prompt", and close equivalents followed by a prompt path
  or pasted prompt.
- Detailed governance change log at `docs/governance/governance-change-log.md`, with required
  fields for prompt base, touched files, per-file rationale, usage system, dates, verification,
  residual risk, and rollback/recovery.

### Changed

- Practice `02-prompt-system.md` now documents pre-execution prompt review.
- Practice `11-governance-evolution.md` now requires the detailed governance change log for every
  governance update.
- `init.sh`, `init-project-prompt.md`, and `check-governance.sh` create and validate the new
  preflight/log artifacts.

## v1.11.0 — 2026-06-25

### Added

- Memory tree convention: a thematic memory area may migrate from a flat `docs/memory/<area>.md` to an
  `index-<area>.md` entrypoint (`Contexto minimo` + shard map + cross-links + `do not read all shards by
  default`) plus `<area>-N.md` shards loaded on demand. Documented in `practices/01-agent-memory.md`,
  scaffold template `scaffold/docs/memory/index-area.md.template`, and `GOVERNANCE.md`.
- Non-executable prompt preface (`PREFACE — NON-EXECUTABLE`) standardized for `LEVEL 2-3` prompts in
  `practices/02-prompt-system.md`, with `scaffold/docs/prompts/preface-template.md` and updated
  `examples/prompts/level-2-feature.md` / `level-3-cross-layer-change.md`.
- `check-governance.sh` is sharding-aware: validates index (`Contexto minimo` + marker + <=300 lines),
  shards (<=250, listed in index, with index entrypoint), deprecated stub (<=40, `DEPRECATED`, points to
  index, no `Contexto minimo`), and minimal cross-links (nonexistent target / self-link = fail). Legacy
  flat memory stays valid; advanced cycle detection is intentionally out of scope. It also checks the
  preface marker in the template and `LEVEL 2-3` examples.

### Changed

- Graphify documented as an auxiliary discovery/search tool over the project and the memory tree,
  never the primary per-execution load nor a replacement for the memory index entrypoint.
- `init.sh` and `init-project-prompt.md` ship and verify the memory-tree and preface templates.

## v1.10.0 — 2026-06-22

### Added

- Graphify skill guidance at `skills/05-graphify.md` with the official upstream repository,
  package name (`graphifyy`), CLI command, usage, and security notes.
- `scripts/install-graphify.sh`, an idempotent installer that prefers existing `graphify`, then
  `uv`, `pipx`, and `python3 -m pip --user`; it registers project-scoped adapters for Claude Code,
  Codex, Gemini, and Cursor by default.
- `init.sh`, `init-project-prompt.md`, and `install-skills.sh` now include Graphify installation
  and adapter registration as part of SDS bootstrap/skills setup.
- `docs/codex-skills/from-claude/skills/graphify/SKILL.md` as a versioned Codex-compatible source
  reference for Graphify usage.

## v1.9.2 — 2026-06-22

### Added

- Practice `05-git-branching.md` now documents an environment-promotion model
  (`dev-local` / `dev-local-<machine>` → `dev` → `prod`): per-developer local-machine branches for
  commits/push, promotion to `dev` once green/validated, then to `prod` after final testing; `dev`/`prod`
  created on demand; shared-branch rollback rules and Change ID/classification still apply.

## v1.9.1 — 2026-06-19

### Added

- Standard public policy folder convention: `docs/<project-name>-policies/`.
- Required policy placeholders for new projects:
  `<project-name>-cookies-policy.md`, `<project-name>-privacy-policy.md`, and
  `<project-name>-terms-of-service.md`.
- `init.sh` now creates the project-specific policy folder and empty policy files during bootstrap.
- `check-governance.sh` validates existing `docs/*-policies/` folders and their canonical file names.

## v1.9.0 — 2026-06-16

### Added

- Optional frontend pattern library at `sds-dev-governance/resources/frontend-patterns/`.
- Portable examples for frosted alert/confirm modals, frosted previous/next buttons, carousel,
  SortableJS drag-relocate handles, carousel motion, border glow, and the Teragenda color palette.
- Lazy-loading rule for frontend resources: agents must not read this folder during normal SDS
  startup; they load only the requested pattern, animation, or palette.

## v1.8.2 — 2026-06-16

### Changed

- Practice `02-prompt-system.md` now distinguishes executed prompt iterations (`[NN-0]`,
  `[NN-1]`, `[NN-2]`...) from pre-execution refinements (`-alpha`, `-beta`, `-gamma`,
  `-delta`, `-epsilon`). Ad hoc lettered executions such as `[16-0-b]` are explicitly disallowed.

## v1.8.1 — 2026-06-12

### Changed

- Practice `14-phase-commit-report.md` now explicitly allows an implementation phase to land as a
  consecutive series of green implementation checkpoint commits when authorized by the active
  prompt/tracker or proportional to risk. The final implementation commit closes the phase and
  triggers the terminal phase report plus documentary commit.

## v1.8.0 — 2026-06-12

### Added

- Practice `14-phase-commit-report.md`: every phase that lands executable changes closes with
  two commits — commit 1 (implementation, green evidence) and commit 2 (phase report file, with
  the summary + moderate/severe/critical risk analysis + proposed fixes included verbatim in the
  commit description) — and the report is also shown in the terminal.
- Conditional loading model for the new practice: adapters and `GOVERNANCE.md` carry only a short
  trigger; the practice file is read only for implementation-shaped tasks (code, bugfix,
  migration, runtime refactor, security ops, tests, dependencies) and skipped for analysis-only
  work (evaluation, audit, documentation, diagrams, decision gates, Q&A).
- Trigger propagated to Claude, Codex, Gemini, and Cursor adapters (root + nested) and to
  `init-project-prompt.md`; `check-governance.sh` verifies the practice file and adapter triggers.

## v1.7.0 — 2026-06-08

### Added

- Frontend constants and business portability rule: visible copy, business data, and user-facing
  assets/photos must be sourced from constants/config/i18n instead of hardcoded presentation code.
- Required single business-info entry point or aggregator for business identity, services,
  descriptions, contact/legal information, and media references.
- Prompt, non-regression, pre-PR, adapter, init prompt, and validator coverage for the new rule.

## v1.6.0 — 2026-06-06

### Added

- Prompt delta discipline to avoid duplicate sources of truth.
- Context-driven extensibility rules for stack-specific guidance.
- Contract artifact and validator co-review rules.
- Discovery-before-hardcoding, cross-layer matrix, UI-to-data lineage, persistence race safety, and
  state mutation resilience rules.
- Explicit no-hardcoded-secrets and secure degraded-operation rules.
- Pre-PR checklist items for discovery, contracts, lineage, race safety, idempotency, and degraded
  security behavior.

### Changed

- Output templates now include optional traceability sections for cross-layer matrices, UI-to-data
  lineage, contention-sensitive writes, and state mutations.
- Governance validator now checks the new required practice headings.

## v1.5.0 — 2026-05-29

### Added

- Nested adapter templates under `adapters/nested/`.
- Context compartmentalization model for hubs, monorepos and Git submodules.
- Optional `SDS_NESTED_MODULES` support in `init.sh`.
- `init-project-prompt.md` instructions for subproject-local adapters.

### Changed

- Root adapters should map subprojects and avoid loading subproject memory by default.
- Practice 13 now documents nested project memory.

## v1.4.1 — 2026-05-29

### Fixed

- `init.sh` now writes `.sds-new` files instead of overwriting existing adapters, scaffold docs,
  `check-governance.sh`, or `.gitignore`.
- Placeholder replacement now also covers `.sds-new` files.
- Practices 01 and 11 now use `GOVERNANCE.md` + adapters as the canonical model.
- Memory README templates now point to `sds-dev-governance/GOVERNANCE.md` instead of `CLAUDE.md`.
- Governance checks now detect stale `scaffold/CLAUDE.md` and old `CLAUDE.md`-canonical wording.
- Practice 13 is now listed in `GOVERNANCE.md`, `README.md`, and `init-project-prompt.md`.

## v1.4.0 — 2026-05-29

### Added

- Neutral `GOVERNANCE.md` as the canonical SDS entry point.
- Multi-agent adapters for Claude, Codex, Gemini, and Cursor.
- Practice 13: multi-agent adapter model.
- Base skills documentation for Impeccable, gstack, skillui, and design references.
- `scripts/install-skills.sh` for install/check of base skills.

### Changed

- Root agent files are now adapters; they are no longer the source of portable SDS rules.
- `init.sh` and `init-project-prompt.md` now materialize multi-agent adapters.
- Generated projects include `AGENTS.md`, `GEMINI.md`, and `.cursor/rules/sds-governance.mdc`.

## v1.3.0 — 2026-05-28

### Added

- Practice 12: proportional governance levels (`LEVEL 0-3`).
- `check-governance.sh` automatic validator.
- Canonical examples for prompts, outputs, checkpoints and memory.
- No-documentation policy for trivial/local changes.
- `Contexto minimo` section in thematic memories.
- Section-first memory loading and compact output rules.
- Deferred output/governance evaluation folder under `docs/governance/evaluation/`.

### Changed

- Generated `CLAUDE.md` now includes proportional governance rules.
- Output template now records governance level and rationale.
- `init.sh` now copies `check-governance.sh` into generated projects.
- `init-project-prompt.md` now requires the validator and proportional governance setup.
- Generated projects now prefer automated governance validation over manual rule narration.
- Generated `CLAUDE.md` now loads governance evaluation only on explicit optimization/audit prompts.

## v1.2.0 — 2026-05-28

### Added

- `docs/memory/` standard thematic memory scaffold:
  - `frontend.md`
  - `backend.md`
  - `api-openapi.md`
  - `database.md`
  - `security.md`
  - `deployment.md`
- Mandatory selective context loading protocol in generated `CLAUDE.md`.
- Area declaration/inference table in the prompt output template.

### Changed

- `init-project-prompt.md` and `init.sh` now verify the thematic memory scaffold.
- Prompt protocol now requires declared or inferred affected areas before loading context.
- Memory practice now standardizes `docs/memory/*.md` instead of ad hoc domain memory paths.

## v1.1.0 — 2026-05-28

### Added

- Practice 11: synchronized governance evolution protocol.
- `docs/governance/README.md` in the project scaffold.
- Continuity checkpoint section in the prompt output template.
- Feature index column for partial feature memory.
- Low-context loading policy for governed projects.

### Changed

- `init-project-prompt.md` now bootstraps governance evolution and checkpoints.
- `init.sh` next steps now include governance review and broader secret scan.
- `scaffold/CLAUDE.md` now includes operational rules for governance changes and prompt continuity.

## v1.0.0 — 2026-05-28

Initial release. Extracted from FIELDS project operational practices.

### Practices (10)

- 01-agent-memory: single CLAUDE.md as source of truth (no tri-sync)
- 02-prompt-system: [NN-R] naming convention
- 03-output-traceability: mandatory output per prompt with 12-section template
- 04-feature-tracking: FTR-NNN compartmentalized tracking
- 05-git-branching: Change ID + feature branch naming
- 06-non-regression: E2E coherence verification before any change
- 07-security-baseline: no secrets in repos, .gitignore policy
- 08-role-system: 11 operational roles for outputs
- 09-docs-structure: predictable docs/ folder structure
- 10-pre-pr-checklist: mandatory checklist before creating PR

### Scaffold

- CLAUDE.md template with {{placeholders}}
- docs/ structure with all standard subfolders
- output-template.md for prompt traceability
- Runbooks, ADR template, contracts, security

### Tools

- init.sh: automated scaffolding script
- init-project-prompt.md: manual bootstrapping prompt

### Key decisions

- Single CLAUDE.md replaces tri-sync (CLAUDE.md + docs/CLAUDE.md + docs/agents-memory.md)
- memory-of-implementation-*.md files replaced by prompt output system
- Domain-specific memory (docs/mongodb-dev/agent-memory.md) kept separate, not duplicated
- Contracts API moved to docs/contracts/ (separate from domain-specific docs)
