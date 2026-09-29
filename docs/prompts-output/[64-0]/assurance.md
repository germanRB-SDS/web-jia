<!-- SDS AI-Code Assurance PR template · v1 · rule: sds-dev-governance/agentic-engineering/ai-code-assurance.md -->
<!-- On init, replace Codex with the project's default accountable owner. -->

## The Golden Rule (accountability)

AI code shifts the engineer's job from **writing** to **editing and auditing**. Your signature on
this PR means you take **100% ownership of every line — regardless of whether a human or a machine
drafted it**. "The AI wrote it" is never an accepted explanation for a defect.

**Accountable owner:** Codex

- [x] I, the accountable owner, have read and audited **every changed line** and take full ownership.

## What & why

Exportación de tres componentes probados de web-jia a recursos independientes con demos, dependencias, tokens, procedencia y guía. Auditoría ejecutada por Codex; no representa firma ni revisión humana del propietario.

- Change ID / prompt: REL-2026-09-29-01 / [64-0]
- AI involvement: Codex extrajo código, aisló dependencias, escribió demos, documentación y pruebas. Código fuente preservado con cambios delimitados por hashes y revisión.

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
- [x] No swallowed errors; degraded operation never silently bypasses a security or consistency control.
- [x] Contended writes: N/A, componentes de presentación. Distribuidor rechaza destinos distintos, comprueba cambios concurrentes e idempotencia.

### 3. Test validity (anti false-green)
- [x] Tests assert real behavior/logic — a plausible bug (mutation) in the change **would fail** them; not happy-path-only or tautological.
- [x] The test was seen to fail before the fix, or the assertion is demonstrably non-trivial.
- [x] No over-mocking that hides the code under test; the real seam is exercised. Pruebas del cambio PASS; suite general 9/10, freshness timeout también falla en baseline c63d175 y queda fuera del delta.

### 4. Security, secrets & assumptions
- [x] No secrets/credentials/tokens/connection strings/PII hardcoded or logged.
- [x] N/A auth/tenant/API: sólo datos del host. El receptor debe validar URLs/medios en su ensamblador; sin datos externos no confiables ni HTML sin escapar.
- [x] Hidden assumptions (locale, timezone, data shape, scale, single-tenant) are stated and safe for all users/tenants.

### 5. Contract & scope
- [x] N/A persistencia/API. Contratos props → media/types → motor → CSS/browser revisados junto con demos y configuración.
- [x] No duplicate source of truth introduced; change is minimal/surgical (no opportunistic refactor).
<!-- sds-ai-assurance:end -->

## Verification run (evidence)

<!-- Paste the commands you ran and their result: tests, lint, smoke, manual check. -->

```text
TypeScript y builds: PASS. Nueve escenarios Chrome: PASS.
Instalación npm ci aislada + build cubo: PASS. Imports/hashes/locks/índice: PASS.
Distribuidor dry-run/preservación/idempotencia/conflicto: PASS.
SDS checker: PASS. Suite canónica: 9/10; freshness timeout preexistente reproducido.
```

## Pre-PR checklist

Complete `sds-dev-governance/practices/10-pre-pr-checklist.md` (branch/fetch/secrets/contract/traceability).

## Machine-checkable footer (do not edit the marker line)

<!-- sds-ai-assurance:v1 -->
Accountable owner: Codex
Sign-off: I take 100% ownership of this code, human- or AI-drafted.
- [x] Confirmed
