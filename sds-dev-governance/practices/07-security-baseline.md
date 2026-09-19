# 07 — Seguridad baseline

## Problema que resuelve

Secretos filtrados en repos (publicos o privados), credenciales hardcodeadas, certificados comiteados. Un solo leak invalida infraestructura entera.

## Regla

No almacenar secretos en ningun repositorio. Nunca.

## Que se considera secreto

- Credenciales (passwords, tokens, API keys)
- Connection strings con datos reales
- Certificados y keystores (.p12, .pem, .key)
- Ficheros .env con valores reales
- Dumps de base de datos
- Datos personales reales no necesarios

## .gitignore obligatorio

Incluir como minimo:

```
.env
.env.*
*.p12
*.pem
*.key
*.keystore
node_modules/
dist/
build/
DerivedData/
.swiftpm/
Pods/
target/
.idea/
.vscode/
.DS_Store
*.dump
*.bak
```

## Revision pre-commit

Antes del primer commit de cualquier proyecto:

1. Buscar patrones sensibles con `rg -i -l` (password, secret, key, token, connection, mongodb+srv, etc.).
2. Revisar ficheros encontrados.
3. Redactar valores reales a placeholders o variables de entorno.
4. Documentar hallazgos en `docs/security/`.

## Si se detecta un leak

1. No hacer commit.
2. Documentar el hallazgo.
3. Sanear el fichero.
4. Si ya se commiteo: rotar las credenciales inmediatamente.

## No Hardcoded Secrets or Credentials

Never hardcode real credentials, passwords, API keys, tokens, refresh tokens, connection strings,
private URLs containing sensitive parameters, or production identifiers in:

- code;
- prompts;
- generated outputs;
- tests;
- documentation;
- governance examples.

Use placeholders, environment variables, local secret stores, or discovered safe configuration
references.

If a real secret or unencrypted credential is found committed in the repository, stop execution
immediately and treat it as a security incident. Do not continue normal implementation until the
incident is recorded and the user or project owner decides the remediation path.

## Secure Failure and Degraded Operation

For MCP installation, evaluation, identity changes or effect-bearing use, load
`practices/modules/07-mcp-control.md`: per-call control, independent custody and finite
destructive batches. Routine exact-revision checks need only their ledger and profile.

Security-sensitive operations must fail closed where appropriate. Degraded operation must not bypass
authentication, authorization, validation, consent, auditability, or data minimization.

If an external dependency fails, document whether the operation fails closed, fails open, becomes
read-only, queues for retry, or enters best-effort mode. Best-effort behavior must be explicit and
must not be presented as guaranteed consistency.

Do not silently downgrade security controls to preserve happy-path UX.

## GitHub remote deletion and protection weakening

All deletion of GitHub remote resources is permanently manual-owner-only for agents. This includes
repositories and any part or associated resource: refs, releases/assets, Actions runs/artifacts/
caches, packages, deployments/environments, webhooks, issues/comments, secrets/variables,
rulesets/protections, and files or trees deleted through GitHub CLI/API. Equivalent destructive
GraphQL mutations, bulk operations and history rewrites are covered even if their command does not
contain the word `delete`.

No user instruction in chat delegates this action to an agent. When deletion is genuinely needed,
the agent stops, gives the owner manual UI/terminal guidance, and may verify the final state only by
an admitted read-only mode. Agents also never request or retain the `delete_repo` OAuth scope and
never disable, weaken, set to evaluation, add bypass actors to, or remove a protection. A requested
exception is a request for guidance, not authorization to execute.

Defense in depth:

1. Route every agent `gh` call through `scripts/gh-safe.sh`; unlisted modes fail closed. The only
   write profile admitted by the portable mechanism can create or replace the exact canonical
   active anti-deletion/non-fast-forward ruleset, with no bypass actors.
2. Use `scripts/apply-github-guardrails.sh` to audit first and apply idempotently only after its exact
   `gh` revision/mode is admitted in the project capability ledger.
3. Use `scripts/git-safe-push.sh` plus the versioned pre-push hook for remote refs.
4. Verify protections by read-back. A plan/license `403`, missing admin permission, archived target,
   unsupported private repository or partial inventory is not green and must be reported honestly.
5. Organization settings and rulesets are additional controls, not a guarantee against owners.
   Personal accounts have no organization-wide inheritance, so new repositories require audit.

Repository rulesets prevent ref deletion and non-fast-forward updates; they do not prevent deletion
of the repository itself. Whole-repository deletion remains additionally constrained by omitting
`delete_repo`, the wrapper and this non-delegable SDS contract. If GitHub cannot enforce a server-side
rule on the current plan, do not claim full remote protection or weaken repository privacy to gain it.
