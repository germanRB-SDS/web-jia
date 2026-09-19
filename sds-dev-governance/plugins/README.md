# SDS Base Plugin Catalog

This directory is the lazy owner for user-level plugins and MCP integrations that SDS bootstrap
installs or verifies by default. It is separate from `skills/install-catalog.tsv`: skills package
reusable instructions or CLIs, while this catalog registers external-service integrations.

## Selective read contract

Do not preload this directory from adapters or routine governance reads. Read it only when:

- `scripts/install-plugins.sh` installs or reconciles the declared integrations;
- `scripts/plugin-status.sh` is explicitly invoked to inspect local state;
- a governance validator checks deterministic catalog invariants; or
- a plugin revision, permissions, endpoint, installation or admission decision changes.

`base-catalog.tsv` is the small, static desired-state index. Its schema is:

```text
capability|handler|scope|harnesses|source|desired_revision|features
```

Runtime observations never belong in that catalog. The installer writes bounded local state to
`.sds/state/base-plugins.tsv`, which is gitignored and regenerable. One row per capability and
harness records status, observed revision, installation/change/check timestamps and a short detail.
Unknown historical timestamps use `-`; every recorded timestamp is UTC ISO-8601.

## Figma baseline

Figma Design and Figma Make are capabilities of one official Figma integration, not separate
packages. Claude Code installs `figma@claude-plugins-official`; Codex registers the official remote
MCP endpoint `https://mcp.figma.com/mcp`. Bootstrap does not open OAuth or claim authentication:
presence is recorded as `auth-pending` until the owner confirms connection in each harness.

Installation is not SDS admission. The project capability ledger remains fail-closed and must
contain an exact admitted revision/mode before an agent uses the integration for governed work.

## Commands

```bash
./sds-dev-governance/scripts/install-plugins.sh .
./sds-dev-governance/scripts/plugin-status.sh .
```

Use `SDS_INSTALL_PLUGINS=0` or init's `--skip-plugins` only as an explicit opt-out. Use
`SDS_PLUGINS_DRY_RUN=1` for a plan with no configuration or state writes.
