# Graphify

Graphify builds a queryable knowledge graph from the project and installs agent-specific skill
adapters for supported coding assistants.

**Role:** Graphify is an **auxiliary** discovery/search tool over the project — including the
`docs/memory/` tree. It complements but never replaces the memory index (`index-<area>.md`) as the
operational entrypoint, and it is **not** a primary per-execution load. Use it to explore; load the
relevant `index-<area>.md` for authoritative area context.

## Source

- Repository: `https://github.com/safishamsi/graphify`
- Package: `graphifyy`
- CLI: `graphify`

Do not vendor the upstream repository into SDS. Install the package from its published source and
commit only project-scoped adapter or skill files that Graphify generates.

## Install

Use the SDS installer from the project root:

```bash
./sds-dev-governance/scripts/install-graphify.sh .
```

The installer is idempotent. It prefers an existing `graphify` binary, then `uv`, then `pipx`, then
`python3 -m pip --user`. It registers project-scoped adapters for these default platforms:

```text
claude codex gemini cursor
```

Override the list when needed:

```bash
GRAPHIFY_PLATFORMS="claude codex gemini cursor opencode aider" \
  ./sds-dev-governance/scripts/install-graphify.sh .
```

Generated hook commands must stay project-portable: hooks are normalized to call `graphify` through
`PATH`, not a user-specific resolved binary such as `$HOME/.local/bin/graphify`. Run the installer
from the project root with target `.` when refreshing adapters:

```bash
./sds-dev-governance/scripts/install-graphify.sh .
```

The installer checks that adapter files, hook files, and their parent directories are writable before
registering each platform. If an existing file cannot be made writable, fix ownership/permissions
and rerun the same command instead of committing a partial adapter install.

## Upstream Usage Examples

These examples describe available CLI surfaces; listing them is not SDS admission:

```bash
graphify .
GRAPHIFY_QUERY_LOG_DISABLE=1 graphify query "Where is booking capacity enforced?"
graphify export callflow-html
```

Codex users invoke the skill as `$graphify`; most slash-command assistants use `/graphify`.

## SDS-Admitted Mode

The admitted `graphifyy 0.9.9` mode is limited to `query`, `path`, and `explain` over an existing
project-local graph, with `GRAPHIFY_QUERY_LOG_DISABLE=1`. It is read-only discovery: do not use
`save-result`, providers, URL ingestion, export, serve, install, hooks, build/update or reflection
under that admission. Other versions or modes require their own capability revision decision in
`skills/README.md`.

For governance changes, use the graph only to discover candidate consumers:

```bash
GRAPHIFY_QUERY_LOG_DISABLE=1 graphify query \
  "What consumes the governance rule being changed?"
```

Confirm the result against `practices/RULE-COVERAGE.md`, the canonical owner, the diff and targeted
`rg`. The ledger is the incremental owner/consumer index; Graphify is a derived view and cannot
close an authority, admission or synchronization decision. Missing/stale graph output falls back to
the ledger and repository search without blocking baseline governance.

## Versioned Outputs

- Commit project-scoped assistant files created under paths such as `.agents/`, `.claude/`,
  `.codex/`, `.cursor/`, or equivalent platform config.
- Do not commit generated graph output. `graphify-out/` is local analysis output and belongs in
  `.gitignore`.

## Security

Graphify can index source, docs, schemas, and generated reports. Do not run it against directories
containing secrets, database dumps, real `.env` files, private keys, or credentials. SDS secret
scans still apply before committing generated adapter files.

Query logging is enabled by default in the inspected 0.9.9 package and may persist the question and
absolute corpus path in user cache. SDS repository queries therefore set
`GRAPHIFY_QUERY_LOG_DISABLE=1`; this is a behavioral invocation constraint, not a product-wide
technical guarantee.
