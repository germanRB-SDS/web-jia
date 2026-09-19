# ROLE: Frontend UI Preflight Add-on

# MODE: READ-ONLY ADD-ON

This file extends `docs/prompts/prompt-revision-preflight.md`. It is not a standalone entrypoint.
Load it only when the target prompt affects frontend/UI, browser-rendered content, frontend copy,
client-side state, forms, responsive behavior, design tokens, user-facing assets, or frontend
consumption of API data.

Do **not** load this add-on for backend-only, DB-only, API-only, deployment-only, or documentation
prompts unless repository evidence shows browser/UI impact.

Do **not** execute the target prompt.
Do **not** modify files.
Do **not** install tools.

---

## 1. Selective Scope

Apply this add-on proportionally. It checks whether the target prompt is ready to change UI without
creating hardcoded product/business data, duplicated sources of truth, false-green visual checks, or
frontend regressions.

Use discovered project conventions first:

- root/nested adapters;
- the frontend memory entrypoint (`docs/memory/index-frontend.md` when present, otherwise the valid
  flat `docs/memory/frontend.md`) and only routed shards;
- existing constants/config/i18n files;
- existing design-token, component, accessibility, test, screenshot, and browser-smoke patterns.

If the repository has no frontend, mark this add-on `N/A - no frontend`.

---

## 2. Required Checks

### Constants, Copy, Business Data, and Assets

- Visible copy, labels, button text, aria labels, empty/loading/error states, route labels, policy
  text, business facts, prices, contact details, legal text, and user-facing media references must
  come from the discovered constants/config/i18n layer.
- Hardcoded frontend-rendered information is a blocker unless the user explicitly requests a
  one-off literal and the prompt records why the exception is acceptable.
- Business-exclusive data must have one discoverable entry point or aggregator. Do not create a
  second source of truth for business identity, services, policies, contact details, or assets.
- User-facing asset/photo paths belong in the constants/assets ownership map, not scattered across
  components, templates, scripts, or styles.

### UI-to-Data and Contract Fit

- Business-critical UI values must trace back to source of truth: frontend state, request payload,
  API DTO/schema, service/repository, persistence or external service, response DTO, and rendering.
- Formatting, timezone, currency, status, filtering, sorting, fallback, rounding, and unit
  transformations must be named when they affect user-visible meaning.
- Frontend validation is UX help only; backend/service validation remains authoritative.

### Interaction, Accessibility, and Responsive Behavior

- Forms must have labels or accessible names, visible focus, error states, loading/disabled states,
  and safe duplicate-submission behavior where mutations occur.
- Keyboard paths, tab order, semantic controls, aria state, and screen-reader names must match the
  interaction pattern being introduced.
- Responsive behavior must be explicitly verified or scoped as `N/A`. Text must not overflow,
  overlap, hide controls, or depend on one viewport size.

### Design System and Visual Consistency

- Reuse discovered components, classes, design tokens, spacing, color, typography, icon, and motion
  conventions before inventing new patterns.
- New colors should live in the token/palette layer unless the existing project convention says
  otherwise.
- Do not introduce nested cards, duplicated component systems, or one-off UI primitives when an
  existing local pattern covers the need.

### Verification and False-Green Risk

- Prefer existing frontend tests, DOM tests, browser smokes, screenshots, or Playwright checks
  discovered in the repo.
- Do not claim responsive/accessibility/browser readiness from unit tests alone.
- If the UI consumes API data, include at least one check that the rendered state uses real or
  representative response shapes, not only mocked happy-path literals.

---

## 3. Severity Guidance

Classify as `CRITICAL` when the target prompt would:

- expose privileged UI as a security boundary without server-side authorization;
- hardcode business-critical data where SDS requires constants/config/i18n and portability is a
  stated requirement;
- create a likely false green by validating only static/mock UI while claiming real flow readiness;
- break a booking, billing, auth, admin, public, or customer-critical browser flow.

Classify as `SEVERE` when the target prompt would:

- leave frontend constants/config/i18n ownership ambiguous;
- miss required UI-to-data lineage for business-critical values;
- under-specify responsive, accessibility, or browser verification for a user-facing change;
- duplicate design systems, copy sources, business-info sources, or asset ownership.

---

## 4. Output Additions

In the main preflight output:

- Add `[Frontend UI]` to finding dimensions where applicable.
- In the readiness checklist, mark `Frontend UI add-on loaded or explicitly N/A`.
- Record discovered constants/config/i18n ownership, or state exactly why it is `N/A`.
- Record which frontend verification gates are present, blocked, not present, or not relevant.
