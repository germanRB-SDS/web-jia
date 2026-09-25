<!-- SDS AI-Code Assurance PR template · v1 · rule: sds-dev-governance/agentic-engineering/ai-code-assurance.md -->
<!-- On init, replace Codex (auditoría técnica del agente) with the project's default accountable owner. -->

## The Golden Rule (accountability)

AI code shifts the engineer's job from **writing** to **editing and auditing**. Your signature on
this PR means you take **100% ownership of every line — regardless of whether a human or a machine
drafted it**. "The AI wrote it" is never an accepted explanation for a defect.

**Accountable owner:** Codex (auditoría técnica del agente)

- [x] I, the accountable owner, have read and audited **every changed line** and take full ownership.

## What & why

La preferencia de movimiento puede activarse expresamente para JIA sin recargar. Delta G: oferta automática sin aceptación salvo Mac/iPad/iPhone, fondo difuminado, CTA mayor y etiquetas exactas; el control de footer se elimina por orden del propietario. Declinar/Escape desactiva efectos esa visita sin persistir rechazo. La retirada posterior de aceptación pasa a ajustes de cookies del navegador. Talleres móvil reserva espacio para el tilt y vuelve a baraja tras 5 segundos sin explorar. Por ampliación del propietario, las tarjetas omiten Imparte/Temática y compactan subtítulo/acciones, preservando datos en la ficha.

- Change ID / prompt: REL-2026-09-25-03 / [54-0]
- AI involvement: implementación y auditoría técnica por Codex. Esta es la firma del agente, no una firma ni declaración de revisión humana del propietario. La plantilla del repositorio no define un responsable humano materializado.

## AI-Generated Code Assurance

Check every box, or replace `- [x]` with `- [x]` and append `N/A: <reason>` when it genuinely does
not apply. An unchecked box blocks the PR.

<!-- sds-ai-assurance:begin -->
### 1. Dependency & API reality
- [x] Every imported library, symbol, internal method/route/field **actually exists** (verified in-repo, not assumed) and is used per its real signature.
- [x] No hallucinated config keys, env vars, endpoints, file paths, or CLI flags — each checked against the codebase.
- [x] Calls match the **installed** version's API (nothing deprecated/removed in that version).

### 2. Resilience (non-happy paths)
- [x] Null/undefined/empty, error returns, timeouts and network/IO failures are handled explicitly.
- [x] No swallowed errors; degraded operation never silently bypasses a security or consistency control. Fallos decorativos mantienen contenido estático; cookie bloqueada conserva aceptación solo en memoria, sin almacenamiento alternativo. No son garantías de persistencia.
- [x] Contended writes define concurrency / idempotency / dedup behavior where applicable. N/A: no writes backend; elección local idempotente y cookie on/deletion. Despliegue usa el actualizador existente con bloqueo y expected-current.

### 3. Test validity (anti false-green)
- [x] Tests assert real behavior/logic — a plausible bug (mutation) in the change **would fail** them; not happy-path-only or tautological.
- [x] The test was seen to fail before the fix, or the assertion is demonstrably non-trivial.
- [x] No over-mocking that hides the code under test; the real seam is exercised. Existing tests pass.

### 4. Security, secrets & assumptions
- [x] No secrets/credentials/tokens/connection strings/PII hardcoded or logged.
- [x] Input validated at the trust boundary; authorization / tenant-scoping (anti-IDOR) preserved; no insecure/deprecated patterns.
- [x] Hidden assumptions (locale, timezone, data shape, scale, single-tenant) are stated and safe for all users/tenants.

### 5. Contract & scope
- [x] Cross-layer contract lineage (input → persistence/external → response) holds; public contracts (schemas/DTOs/OpenAPI/events) reviewed together where touched.
- [x] No duplicate source of truth introduced; change is minimal/surgical (no opportunistic refactor).
<!-- sds-ai-assurance:end -->

## Verification run (evidence)

<!-- Paste the commands you ran and their result: tests, lint, smoke, manual check. -->

```text
Node 24.19.0; npx tsc --noEmit; npm run check:content; NEXT_PUBLIC_SITE_URL=https://jornadasdeinnovacion.com npx next build --webpack.
Pruebas Chrome/Edge CDP y límites: docs/prompts-output/[54-0]/evidence/qa-*.json.
Sin nuevas dependencias. No se ha ejecutado npm run lint: Next 16 no ofrece ese comando configurado; TypeScript, contenido y build sí.
```

## Pre-PR checklist

Complete `sds-dev-governance/practices/10-pre-pr-checklist.md` (branch/fetch/secrets/contract/traceability).

La revisión cubre las líneas modificadas de componentes, store, CSS, copy y pruebas. Un aviso previo PCFSoftShadowMap usa fallback en Three; esta entrega no cambia esa API. Fuentes/constantes centralizadas, excepción Apple explícita por navigator.platform, sin detectar distribución Linux. Se han auditado todas las líneas del delta G en layout, diálogo/estilos, copy/tipos, store y harness nuevo.

## Machine-checkable footer (do not edit the marker line)

<!-- sds-ai-assurance:v1 -->
Accountable owner: Codex (auditoría técnica del agente)
Sign-off: I take 100% ownership of this code, human- or AI-drafted.
- [x] Confirmed
