# Governed MCP tooling

Python 3.11+ standard library; optional, no application runtime dependency. Entry point:
`scripts/sds-mcp`. Read `practices/modules/07-mcp-control.md` only for MCP work.

Explicit local setup: `python3 mcp/install-local.py --project <root>` copies a fixed
version into local user tooling, adds `sds-mcp` in the user's local bin directory and
stages the installed clients. It never installs client software, runs npm, accesses a
credential or starts a provider. Repeating the same revision is idempotent; a different
source under the same version or a conflicting launcher is rejected.

After authorized package installation (`npm ci --ignore-scripts --no-audit --no-fund`
inside the installed `mcp/tooling` with its pinned `.nvmrc` loaded), run
`sds-mcp record-install --tooling <installed-tooling> --project <root>`. This verifies
the locked package's reviewed file bytes and records the observed installation event;
it does not admit or activate it. Use only following an actual installation you performed.

This release provides offline inventory/check/doctor, atomic client staging, a closed
MCP gateway, a custody parser and a tested batch-policy engine. **Real Hostinger access
and destruction are deliberately unavailable in this release**: no independently
protected custody service or authenticated human approval channel has been established.
Neither an admitted source revision nor a restart enables provider operations.

```sh
./scripts/sds-mcp inventory --compact --project .
./scripts/sds-mcp check --server hostinger-vps --client codex --project .
./scripts/sds-mcp doctor --client claude --project .
```

Exit codes: 0 observational command completed/check allowed; 2 invalid arguments;
3 capability blocked; 4 invalid/unreadable local state. Inventory completing with 0
does not imply admission. `doctor` reports 3 while isolation or client coverage is
unverified. Runtime installation and connections are separate fields.

`--home` and `--state` support isolated fixtures; default machine state is
`~/.local/state/sds-mcp`. Never commit this inventory, client backups or custody files.
`--project` is explicit for checks; inventory defaults to the current directory.
Discovery is bounded to that project, ancestor Codex configs, user configs, known
plugin manifests and platform managed files. It never traverses independent projects
or starts servers. Dynamic flags, remote connectors, Desktop/IDE injection and managed
settings outside supported files remain `UNVERIFIED`; checks never treat that gap as
permission. Paths, arguments, headers, environment values and raw errors are not printed.
The inventory's verification timestamp describes configuration observation; installation
bytes have their separate receipt. Local state is editable by its owner, not an immutable
audit log or authorization source. Restrictive ledger states are observed; live admission
cannot be established by this release's check command, even by changing a ledger row.

Hostinger staging uses five logical identities and a closed stdio gateway. It advertises
only `sds_status` with fixed machine-readable results. No provider process is spawned;
all other methods/operations fail closed. The safe status endpoint may be connected;
that is not a Hostinger API connection. Codex entries are disabled by default; Claude
entries can initialize only the closed gateway, exposing one small local status tool.
The original/unified server is never configured. Billing/mail are not added.

`stage --client codex|claude --project PATH` merges only absent/exact managed entries,
preserves unrelated settings, refuses conflicting server definitions and links, validates
both document formats and writes atomically under a lock. Protected local backups and a
content-bound recovery receipt allow `restore --receipt NAME` only if the staged file
has not changed. Conflicting concurrent edits require a semantic human reconciliation.
Installation timestamps are recorded only by a verified installation event, not staging.

## Isolation and human activation

The custody parser is a library, not a token-reading CLI; tests use synthetic files.
Production gateway contains no credential path, network client or enable switch. The
batch engine accepts a trusted event source only as an internal integration interface;
the test source is explicitly synthetic and unavailable through the CLI/MCP gateway.
An editable event log or locally generated signature is never real human evidence.

Before a future live activation, an owner must establish a service identity or verified
agent sandbox that denies access to the secret, process state and active broker code,
policy and authorization records. A protected service must have fixed TLS egress,
operation/schema/response allowlists and project/account/resource binding. Review and
integrate that service, verify denied direct/shell/override paths, then admit its exact
revision in each project ledger. Human destruction needs an independent authenticated
two-event channel and protected journal. This is additional work, not a flag to flip.

No real credential is opened during installation. Same-user 0600 files, editable
wrappers, optional hooks and restart alone cannot satisfy this activation gate.
Recovery removes the optional client configuration using its receipt; it never deletes
provider resources or alters other projects. Credential rotation belongs to the owner;
expiry is `POR_CONFIRMAR` until independently verified. No notification service is enabled.

Compatibility: this release does not replace controls for other exactly admitted MCP
modes. Their existing project-ledger route remains authoritative. The new executable
check controls only the managed Hostinger onboarding; other inventory entries are
observations, not migration decisions or permission to execute. Universal migration
to one per-call gateway is not claimed.
