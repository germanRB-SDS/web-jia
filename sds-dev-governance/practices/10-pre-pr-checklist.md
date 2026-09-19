# 10 — Checklist pre-PR

> **Gate de código IA:** toda PR/MR pasa además por el aseguramiento de código generado por IA
> (**La Regla de Oro** + checklist mejorada) en `agentic-engineering/ai-code-assurance.md`, cuya
> plantilla se materializa en `.github/PULL_REQUEST_TEMPLATE.md` / `.gitlab/merge_request_templates/`
> y se comprueba con `agentic-engineering/check-ai-pr-assurance.sh`.

## Problema que resuelve

PRs que llegan con secretos, tests rotos, contratos rotos o sin trazabilidad. Sin checklist, cada PR depende de la memoria del desarrollador o del reviewer.

## Checklist obligatorio antes de crear PR

- [ ] Rama de trabajo creada desde rama compartida actualizada
- [ ] `git fetch` ejecutado y divergencias revisadas
- [ ] Cambios compilados sin errores en todas las plataformas afectadas
- [ ] Tests existentes pasan
- [ ] No hay secretos, .env ni credenciales en los cambios
- [ ] Contrato API no roto o compatibilidad dejada
- [ ] Output del prompt creado en `docs/prompts-output/` (si aplica)
- [ ] Change ID incluido en titulo de PR si cambio multi-repo
- [ ] No environment-specific absolute paths, DB locations, ports, URLs, credentials, connection strings, or tool locations were hardcoded without an explicit project contract or user instruction.
- [ ] Required scripts and tools were discovered from existing project files before being used as mandatory gates.
- [ ] Missing optional tools were recorded as unavailable or `N/A`; they were not installed opportunistically during the core change.
- [ ] Cross-layer changes include a field-by-field contract matrix from UI/input to persistence or external service and back to UI/response.
- [ ] Business-critical UI values include source-of-truth lineage and transformation rules where applicable.
- [ ] Contention-sensitive writes document the concurrency primitive, atomicity boundary, and residual race-safety risks where applicable.
- [ ] State mutations define duplicate-submission, retry, idempotency, or deduplication behavior where applicable.
- [ ] Public contract changes reviewed schemas, DTOs, route contracts, event contracts, generated clients, design tokens, and custom validators together where applicable.
- [ ] Stack-specific rules were applied through discovered adapters, skills, scaffold templates, or project conventions rather than hardcoded into core governance.
- [ ] The change does not create duplicate sources of truth for inventories, rules, outputs, contracts, or validation gates.
- [ ] Degraded operation does not silently bypass security controls or present best-effort behavior as guaranteed consistency.
- [ ] Frontend-rendered strings, business information, and user-facing assets/photos are sourced from constants/config/i18n files; business data has a single entry point or aggregator.

## Checklist adicional para backend (`roots/`)

- [ ] Controller, service, DTO, persistencia revisados
- [ ] Consumidores iOS/web verificados o marcados como pendientes
- [ ] Smoke test del endpoint afectado ejecutado
- [ ] Side effects revisados (Stripe, Twilio, email, notificaciones)

## Checklist adicional para mobile (`FieldsApp/`)

- [ ] Navegacion al flujo verificada
- [ ] Estados loading/exito/error verificados
- [ ] Compatibilidad con respuesta API verificada

## Checklist adicional para web

- [ ] Build production exitoso
- [ ] Tests E2E ejecutados (Playwright u otra herramienta)
- [ ] Responsive verificado si aplica

## Regla

Si alguna respuesta es "no", la PR no esta lista. Documentar el motivo en la descripcion de la PR si se abre igualmente como draft.
