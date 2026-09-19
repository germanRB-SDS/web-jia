# Skill Bootstrap And Agent Reach

Load this only when bootstrapping a project, installing or reconciling the catalog, or bridging
skills between agents. Day-to-day skill selection needs only `skills/README.md`.

## Recommended Workflow

1. Bootstrap the project with `sds-dev-governance/init.sh` or `init-project-prompt.md`; the declared
   `skills/install-catalog.tsv` is installed/checked by default.
2. Use `--skip-skills` or `SDS_INSTALL_SKILLS=0` only for an explicit no-install bootstrap;
   `--skip-graphify` excludes Graphify while retaining the rest of the catalog.
3. Rerun `sds-dev-governance/scripts/install-skills.sh` to reconcile the catalog idempotently.
4. For external integrations, load `sds-dev-governance/plugins/README.md` only on install, status,
   validation or capability delta; its catalog and runtime tracking are not normal skill context.
5. Select or generate a `DESIGN.md` when UI style matters.
6. Record active design references in the shard selected by the frontend memory entrypoint
   (`docs/memory/index-frontend.md` when the area is a tree; `docs/memory/frontend.md` while flat).
7. Use SDS practices for branching, outputs, QA, review, and release.
8. Use `sds-dev-governance/scripts/install-graphify.sh` to reconcile Graphify alone and register
   project-scoped adapters for Claude Code, Codex, Gemini, Cursor, and any extra platform declared
   through `GRAPHIFY_PLATFORMS`.
9. For Android R8 work, read `r8-analyzer.md`; bootstrap with skills enabled installs the versioned
   `sds-r8-analyzer` bundle globally for Claude Code and Codex.
10. Install Spline only when a project needs authored 3D or 2D assets, and confirm its ledger status
    before invoking its MCP bridge. Its desktop app must be running for any tool to exist.
11. Run `sds-dev-governance/scripts/sync-agent-skills.sh` to check, and `--apply` to bridge, the
    provider-neutral skills into Claude Code, Codex and Gemini. Then regenerate the ordered index
    with `sds-dev-governance/scripts/generate-skills-index.sh`.

Catalog installation is an owner-authorized bootstrap convenience, not a capability-ledger
decision. A clean project ledger stays empty and fail-closed; installed capabilities cannot be
invoked for SDS repository work until their exact effective revision/mode is admitted.

## Agent Compatibility

- Claude Code can use native slash commands where installed.
- Codex should apply the documented workflow equivalents even when slash commands are unavailable.
- Cursor and Gemini should read the same guidance through their adapters.

Claude Code, Codex and Gemini CLI all consume the open Agent Skills format from their own user
store. `cross-agent-availability.md` owns the policy and the scripts that make one trusted
revision reachable from all three without forking content; `INDEX.md` records which agent can
actually reach each skill today. Bridging is plumbing and never substitutes for admission.

`--files-only` and hub mode install no skills, bundled skills, plugins or Graphify.
`--skip-skills` now includes bundled skills. Divergent skill directories are preserved.
