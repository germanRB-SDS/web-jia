# Bootstrap and classifier repair — REL-2026-09-09-10

Owner authority: 2026-09-09 continuation in MAC-DEV-PROJECTS. PATH-00 closed in hub
067668c. LEVEL 3 / GOV-SAFETY, GOV-STRUCTURE, GOV-AUTOMATION. Base cdf80a7 v1.25.0;
origin refreshed without change. Worktree isolated; no product initialization here.

## Contract decisions before implementation

Fix accidental overwrite, recursive placeholder mutation, false successes and incomplete
opt-out. Add explicit --mode hub, --files-only and --dry-run. Preserve project CLI;
--skip-skills must also skip bundled installation. Hub always uses files-only and never
materializes nested adapters in independent repositories. No implicit account/OAuth/Git action.
Bootstrap creates missing owned files; identical files are no-op, conflicts preserve originals
and existing .sds-new. Never copy Git metadata or reconcile an existing divergent kit.
Resolve physical roots; reject linked write paths and escaping/overlapping modules up front.
No project-versioned skill sources are discovered from the kit's parent directory by default.

Classifier remains read-only and keeps TSV columns. Validate the complete request before
printing rows. Older version without its original baseline is INSPECT_BASELINE, never
SAFE_UPGRADE. Fingerprint handles symlinks and invalid transport names explicitly. Preserve
unique-material discovery semantics separately from proof of an unchanged old release.

Native Bash-only patch versus Python stdlib engine: compare complexity during audit;
Python is already required by the classifier and validator. Prefer a small wrapper with one
validated file plan to a second recursive shell walker if evidence supports it.

## Gates

Audit init and metaprompt completely, then every invoked helper, scaffold/adapter and checker
write/network/Git surface. Reproduce old failures in fixtures; never install capabilities globally.
Run both Bash 3.2 and 5.3 including child shell selection. Matrix: new/existing project,
new/existing hub, monorepo modules, dirty files, conflicts/.sds-new, same/different kit,
worktree .git, symlinks, spaces/Unicode, invalid args, interrupted/repeated operations,
permissions/dependencies, no-network files-only and installer doubles. Full valid-fixture
checker and existing classifier/skills/plugins/Git guardrail tests. No production builds.

Review Upnews v1.25.1 provenance/resources before promotion. Preserve valid material without
claiming fixes already present in v1.25.0. Publish only tested repaired revision with exact
safe refspecs and verified remote protections. Hub initialization follows publication.

Independent phase B covers selective context/version freshness and reproducible PM metrics.
Graph primary + automatic Gmail and deployment form 3–7 stay unchanged. No mail/DNS/providers/VPS.
