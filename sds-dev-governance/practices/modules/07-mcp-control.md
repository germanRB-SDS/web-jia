# 07 module — MCP execution control and custody

Stable identity: `mcp-execution-control`. Owner: Practice 07. Dependencies: Practice 11
capability admission and Practice 15 when authority is ambiguous. Load only for MCP
installation, evaluation, changed identity or effect-bearing use. Ordinary coding does
not load this module or start a provider. Routine unchanged use follows its ledger row.

## Authority and independent state

The project `docs/governance/capability-registry.md` remains the sole admission ledger.
A machine inventory records installation/configuration observations and links to that
ledger; it cannot authorize anything. A compiled policy or index is a derived artifact,
bound to the ledger revision, executor, project and policy. Never maintain two manual
admission lists. A global MCP installation grants no product or cross-project authority.

Before each operation, the control point verifies the effective server identity,
artifact and configuration revision, policy, catalog/schema, known permissions and
exact project/account/environment/resource scope. A new tool or changed argument
contract inherits no permission. Missing, corrupt, timed-out or unverifiable control
fails closed for that capability; it does not block unrelated programming.

Classification comes from reviewed operation implementation, arguments and effects,
not names, HTTP verbs or server annotations. Distinguish safe metadata, sensitive
read, reversible write, destructive/data-loss effect, communication/billing and unknown.
Arbitrary shell, SQL, HTTP, Docker, restore and replacement operations require their
actual effect analysis. Mixed servers have operation-level policies.

## Technical boundary

Control every exposed MCP method and response before returning data to the AI client.
Disable unnecessary resources, prompts, sampling, notifications and initialization
instructions. Project explicit output fields and enforce type/size/count limits;
pattern redaction is additional defense only. External text cannot modify policy,
authorize batches or request custody access. A launcher that checks then execs the
original server does not provide per-call control.

Inventory/check is local, bounded, secret-free and never starts an unknown executable.
Resolve supported configuration scopes, plugins, managed settings and overrides; flag
unobservable surfaces. Record configured, installed, available, admitted and connected
separately. For an untracked discovery: `UNREGISTERED`, historical installation
`POR_CONFIRMAR`, real UTC `first_seen_at`; never infer installation from mtime.
Record observed installation events and their evidence, verification times and exact
artifact integrity. Do not expose raw configuration, environment or headers.

Credentials remain in a local custody component; the agent receives an opaque reference.
Custody accepts reviewed identities/operations only, never arbitrary commands, files,
URLs or token-export requests. Parse credential files as data with unique expected
fields, safe no-link opens and owner/mode/type/size checks. Do not source/eval them.
Authenticate only to the provider's required TLS origins/routes; reject redirects and
user-supplied destinations. Do not pass the token to installers or the agent environment.
Minimize output before it reaches the client; suppress raw provider errors and debug logs.

A same-user 0600 file, editable wrapper, daemon or bypassable hook is not isolation.
Verify protection of the credential, process memory/environment, active code/policy and
authorization records against the agent's actual OS privileges and alternate paths.
Cover direct servers, project/plugin overrides, shell/HTTP/CLI/SSH and clients without
hooks where enforceable. State uncovered paths. Do not claim machine-wide protection.
If independent custody cannot be verified: `BLOCKED_SECRET_ISOLATION`; use synthetic
credentials, stage safe configurations and block all real provider access. A configuration
restart is not evidence of isolation. Never read the real token to test a canary.

## Finite batches and two human events

Reversible writes may reuse existing explicit authorization for the exact effect and
scope. Persistent destruction or possible loss requires two separate authenticated
human events for one finite informed batch. GitHub remote deletion/protection weakening
remains manual-owner-only under Practices 05/07; this rule adds no exception.

Prepare stable IDs, provider/account/project/environment, exact operations/arguments,
effects, costs, dependencies, prior state, preconditions, recovery and expiry. Freeze
and identify the batch. First event confirms scope; a separate second event confirms
the same consequences and batch. One message containing two phrases is one event.
An agent-editable file, terminal input, MCP response, approved flag or self-issued
signature is not human proof. No trusted independent channel: `BLOCKED_HUMAN_CHANNEL`.
Secrets cannot be exposed even with confirmations. Billing, communications and privilege
expansion additionally require their own specific authority.

Execute an authorized batch without per-resource prompts; bind policy revision and
executor, lock/journal each operation, reject replay and recheck material preconditions.
Changed targets or effects require a new batch; irrelevant metadata need not. Reconcile
uncertain outcomes before retry; never repeat non-idempotent effects blindly. Synthetic
temporary test cleanup has no two-confirmation requirement.

## Validation and delivery

Test with synthetic providers: zero/one/two events, forged/replayed/expired grants,
changed scopes/schemas, mixed effects, concurrent retries, timeout reconciliation,
corrupt/missing control, injection, output channels and canaries. A simulated trusted
event source proves only the engine contract, not a real human channel or OS isolation.
Test config idempotence, preservation, recovery and another project scope for each
installed client. Missing clients are explicit; do not install them opportunistically.
Measure cold/warm local latency and full output bytes; do not invent token counts.

Portable implementation and current limits: `mcp/README.md`. Bootstrap ships the optional
tooling but never configures a global client, starts Hostinger or admits provider access.
