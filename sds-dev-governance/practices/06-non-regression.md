# 06 — No regresion E2E

## Problema que resuelve

Un cambio en una capa rompe otra capa. Un campo renombrado en backend invalida el decoding de iOS. Un indice nuevo en Mongo cambia el rendimiento de un endpoint. Sin verificacion extremo a extremo, los agentes (y humanos) introducen regresiones.

## Regla

Antes de introducir cualquier cambio, verificar coherencia completa del dato y del flujo:

1. Como esta definido realmente en la base de datos.
2. Como esta modelado en entidades, DTOs, schemas.
3. Como entra y sale por el endpoint.
4. Como se valida y transforma en services, managers, helpers.
5. Como se consume y representa en iOS, Android, web.

## Prohibiciones

- No anadir campo sin verificar su definicion real en persistencia.
- No reutilizar campo existente con significado nuevo no confirmado.
- No renombrar, reinterpretar o mapear datos por intuicion.
- No modificar contratos API sin revisar impacto en todos los consumidores.
- No asumir que un cambio local es seguro sin verificar el flujo completo.

## Criterios de preservacion

Todo cambio debe preservar simultaneamente:

- compatibilidad con datos existentes
- compatibilidad con contratos actuales
- estabilidad de funciones encadenadas
- comportamiento esperado de negocio
- estabilidad de la capa de presentacion

## Si no se puede verificar

1. Reducir alcance.
2. Documentar el riesgo.
3. Marcar como `NO VERIFICADO`, `PARCIAL` o `BLOQUEADO`.
4. No implementar basandose en suposiciones.
5. Dejar verificacion manual pendiente indicada.

## Principio

La velocidad no justifica romper compatibilidad, inventar contratos, asumir estructuras de datos ni introducir cambios no contrastados desde persistencia hasta presentacion.

## Discovery Before Hardcoding

Implementation prompts and agent execution must not hardcode environment-specific or
discovery-dependent facts unless the project contract explicitly declares them stable or the user
explicitly instructs it.

Runtime facts must be discovered from repository structure, config files, existing scripts, runtime
configuration, or Phase -1 discovery before use. Repository-relative source paths are allowed when
they are the concrete files being inspected or modified. Do not assume equivalent paths exist in
other projects.

Missing required paths, scripts, tools, or config must be recorded as `N/A` or blockers. Missing
optional tools must not be installed opportunistically during a core feature change.

Examples of facts that must be discovered, not assumed:

- database file paths;
- credentials;
- connection strings;
- ports;
- hostnames;
- deployment URLs;
- webhook or callback URLs;
- migration numbers;
- seed formats;
- migration runner behavior;
- script names in `package.json` or equivalent tooling files;
- tool availability;
- local binary locations;
- generated output paths when governed by the specific prompt version;
- runtime storage formats;
- timezone/date/weekday conventions.

## Cross-Layer Contract Matrix

For changes that cross UI, API, service, repository/query, database, external integrations, and
response rendering layers, require an explicit field-by-field matrix.

The matrix should trace each affected field through:

- UI state/input;
- request payload;
- API schema/contract;
- service validation;
- repository/query layer;
- persistence layer or external service boundary;
- response DTO;
- frontend consumption/rendering;
- tests or validation gates.

This matrix is required only for cross-layer changes. Do not require it for isolated internal
refactors.

## UI-to-Data Lineage and Traceability

For UI elements that represent business-critical state, financial values, user-visible operational
state, availability, identity, permissions, pricing, dates, times, quantities, or persisted workflow
state:

- Trace the displayed value back to its source of truth.
- Document the path from visual component to frontend state, API DTO, service transformation,
  repository/query, database column, or external service.
- Document transformation rules such as rounding, formatting, timezone conversion, currency
  conversion, unit conversion, status mapping, filtering, sorting, or fallback values.
- If the source of truth is ambiguous, stop and record the ambiguity as a blocker.
- If the UI changes only presentation with no business-state impact, record lineage as
  `N/A - presentation only`.
- Do not infer business meaning from labels, CSS classes, or DOM structure alone.

## Frontend Constants, Assets, and Business Portability

Frontend-rendered information must be sourced from the project constants/configuration layer. Do not
hardcode user-facing strings, business identity, service descriptions, prices, policy text, contact
details, route labels, or user-facing media references directly in frontend views, templates,
components, scripts, or styles.

Each frontend project must have a discoverable constants ownership map:

- UI copy and i18n strings: labels, messages, button text, aria labels, empty/loading/error states.
- Business info: business name, brand text, descriptions, services, pricing where applicable,
  opening hours, policies, locations, contact channels, and legal text.
- Assets/media: logos, photos, service images, worker images, icons when business-specific, Open
  Graph/social images, and other user-facing media references.

Business info must have one single entry point. That entry point may aggregate smaller constants
files, but it must represent the whole business profile and must not duplicate values already owned
by another constants file. A frontend should be portable to another business by changing constants,
localized copy, and assets, not by editing presentation code.

If a source of truth is missing, create or propose the constants structure before adding new
frontend content. If the stack already has an i18n framework, use it for locale-specific copy and
keep business data separate unless the framework is explicitly the project's chosen business-data
source.

## Persistence Race Safety

For features involving reservations, availability, stock, quotas, balances, locks, payments,
orders, retries, or other contention-sensitive writes:

- Document the real concurrency primitive used.
- Re-check business invariants inside the write boundary.
- Add a realistic concurrent-write test or explain why it is not applicable.
- Confirm the atomicity boundary of the operation.
- If the discovered persistence layer supports transactions, locks, constraints, compare-and-swap,
  conditional writes, idempotency keys, uniqueness constraints, or equivalent mechanisms, use the
  appropriate primitive for the stack.
- If the discovered persistence layer does not provide an atomic write boundary, state that race
  safety cannot be guaranteed at persistence level and record the residual risk.
- If the operation depends on an external API without transactional guarantees, document the
  best-effort behavior, idempotency strategy, retry behavior, compensation behavior if any, and
  remaining consistency risk.
- For SQLite specifically, evaluate whether `BEGIN IMMEDIATE`, `BEGIN EXCLUSIVE`, unique
  constraints, or equivalent locking/constraint strategies are required.
- Do not generalize SQLite-specific mechanisms to other databases.

## State Mutation Resilience

For user-triggered or system-triggered operations that mutate state:

- Assume retries, duplicate submissions, network failures, partial failures, and interrupted
  responses can happen.
- Define how duplicate submissions are prevented, deduplicated, rejected, or made harmless.
- For UI-triggered mutations, prevent obvious duplicate submission where applicable, such as
  disabling the action during pending state or using an equivalent guard.
- For API-triggered mutations, use an idempotency key, unique constraint, conditional write, lock,
  deduplication key, state-machine guard, or documented alternative where appropriate.
- If idempotency is not applicable, document why and record the residual risk.
- Ensure failure states are visible enough for the user or operator to retry safely.
- Do not hide failed mutations as successful operations.
