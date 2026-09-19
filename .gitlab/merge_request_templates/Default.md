<!-- SDS AI-Code Assurance MR template · v1 · rule: sds-dev-governance/agentic-engineering/ai-code-assurance.md -->
<!-- On init, replace {{ACCOUNTABLE_OWNER}} with the project's default accountable owner. -->

## The Golden Rule (accountability)

AI code shifts the engineer's job from **writing** to **editing and auditing**. Your signature on
this MR means you take **100% ownership of every line — regardless of whether a human or a machine
drafted it**. "The AI wrote it" is never an accepted explanation for a defect.

**Accountable owner:** {{ACCOUNTABLE_OWNER}}

- [ ] I, the accountable owner, have read and audited **every changed line** and take full ownership.

## What & why

<!-- One paragraph: what changes and the problem it solves. Link the prompt/issue/Change ID. -->

- Change ID / prompt:
- AI involvement: <!-- who/what drafted it, which parts; what you rewrote -->

## AI-Generated Code Assurance

Check every box, or replace `- [ ]` with `- [x]` and append `N/A: <reason>` when it genuinely does
not apply. An unchecked box blocks the MR.

<!-- sds-ai-assurance:begin -->
### 1. Dependency & API reality
- [ ] Every imported library, symbol, internal method/route/field **actually exists** (verified in-repo, not assumed) and is used per its real signature.
- [ ] No hallucinated config keys, env vars, endpoints, file paths, or CLI flags — each checked against the codebase.
- [ ] Calls match the **installed** version's API (nothing deprecated/removed in that version).

### 2. Resilience (non-happy paths)
- [ ] Null/undefined/empty, error returns, timeouts and network/IO failures are handled explicitly.
- [ ] No swallowed errors; degraded operation never silently bypasses a security or consistency control.
- [ ] Contended writes define concurrency / idempotency / dedup behavior where applicable.

### 3. Test validity (anti false-green)
- [ ] Tests assert real behavior/logic — a plausible bug (mutation) in the change **would fail** them; not happy-path-only or tautological.
- [ ] The test was seen to fail before the fix, or the assertion is demonstrably non-trivial.
- [ ] No over-mocking that hides the code under test; the real seam is exercised. Existing tests pass.

### 4. Security, secrets & assumptions
- [ ] No secrets/credentials/tokens/connection strings/PII hardcoded or logged.
- [ ] Input validated at the trust boundary; authorization / tenant-scoping (anti-IDOR) preserved; no insecure/deprecated patterns.
- [ ] Hidden assumptions (locale, timezone, data shape, scale, single-tenant) are stated and safe for all users/tenants.

### 5. Contract & scope
- [ ] Cross-layer contract lineage (input → persistence/external → response) holds; public contracts (schemas/DTOs/OpenAPI/events) reviewed together where touched.
- [ ] No duplicate source of truth introduced; change is minimal/surgical (no opportunistic refactor).
<!-- sds-ai-assurance:end -->

## Verification run (evidence)

<!-- Paste the commands you ran and their result: tests, lint, smoke, manual check. -->

```text
```

## Pre-PR checklist

Complete `sds-dev-governance/practices/10-pre-pr-checklist.md` (branch/fetch/secrets/contract/traceability).

## Machine-checkable footer (do not edit the marker line)

<!-- sds-ai-assurance:v1 -->
Accountable owner: {{ACCOUNTABLE_OWNER}}
Sign-off: I take 100% ownership of this code, human- or AI-drafted.
- [ ] Confirmed
