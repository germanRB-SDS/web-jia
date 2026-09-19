# ROLE: Frontend Security Preflight Add-on

# MODE: READ-ONLY ADD-ON

This file extends `docs/prompts/prompt-revision-preflight.md`. It is not a standalone entrypoint.
Load it only when the target prompt affects browser security boundaries, auth/session UX,
admin/public forms, frontend-triggered mutations, cookies, tokens, OAuth/login surfaces,
CSP/security headers, third-party embeds/assets, payments, tenant/admin visibility, or UI that
exposes privileged or personal data.

Do **not** load this add-on for backend-only, DB-only, API-only, deployment-only, or documentation
prompts unless repository evidence shows browser/UI security impact.

Do **not** execute the target prompt.
Do **not** modify files.
Do **not** install tools.

---

## 1. Selective Scope

Apply this add-on proportionally. Its purpose is to make the browser boundary explicit without
turning every preflight into a heavy security audit.

Use discovered project conventions first:

- `docs/memory/security.md`, `docs/memory/index-security.md`, or the applicable security shard;
- existing auth/session, cookie, CSRF/origin, CSP/header, validation, audit, and rate-limit code;
- existing dependency, secret-scan, security, browser-smoke, and deployment-preflight scripts.

Map relevant findings to OWASP Web Top 10 and OWASP API Security Top 10 when useful. Do not force a
full OWASP matrix for prompts whose changed surface is narrow.

If the repository has no frontend/browser surface, mark this add-on `N/A - no browser surface`.

---

## 2. Required Checks

### Cookies, Sessions, and Browser Auth

- Session cookies should be `HttpOnly`; `Secure` in production; scoped with `Path=/`; use a suitable
  `SameSite` value; and use the `__Host-` prefix in production where HTTPS and no `Domain` attribute
  make that possible.
- Session payloads must not contain passwords, OAuth access tokens, refresh tokens, API keys,
  private credentials, or unnecessary personal data.
- Session expiry, logout/clear behavior, revocation or re-auth expectations, and production secret
  length/source must be understood for changed auth surfaces.
- Client-side hiding, disabled buttons, route labels, local flags, or `hidden` attributes are
  presentation only. Server-side authorization remains the boundary.

### CSRF and Cookie-Backed Mutations

- For mutations authenticated by cookies, the prompt must explain the CSRF posture: `SameSite`
  adequacy, same-origin assumptions, Origin/Referer checks, CSRF tokens, double-submit cookies, or
  why the mutation is not CSRF-relevant.
- Admin, billing, role, tenant, profile, booking, payment, and destructive mutations deserve
  explicit CSRF/origin reasoning.

### XSS and DOM Injection

- Check `innerHTML`, template strings, Markdown/HTML rendering, rich text, user/business-provided
  labels, translated copy, query params, URL fragments, postMessage, and third-party embed inputs.
- Dynamic content must be escaped, sanitized, parsed structurally, or rendered through safe DOM APIs.
- URL inputs must reject dangerous protocols and malformed/control-character variants where they can
  reach links, images, iframes, fetches, redirects, or CSS.

### CSP, Security Headers, and Third-Party Surfaces

- Review CSP changes for overbroad directives such as broad `https:`, `data:`, or `'unsafe-inline'`.
  If broad directives are retained, document the compatibility reason and residual risk.
- Check `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `frame-src`,
  `frame-ancestors`, `object-src`, and `base-uri` when affected.
- Third-party images, iframes, analytics, payment links, maps, OAuth, or embeds must have explicit
  host allowlists, privacy implications, and failure behavior where relevant.

### Frontend Storage and Token Exposure

- Do not store session identifiers, OAuth tokens, refresh tokens, API keys, passwords, or privileged
  authorization state in `localStorage`, `sessionStorage`, IndexedDB, logs, URLs, prompts, reports,
  analytics, or DOM-readable config.
- Local/browser storage is acceptable only for non-sensitive preferences or cache data with clear
  invalidation and privacy impact.
- OAuth access/refresh tokens should stay server-side unless the project has an explicit,
  reviewed browser-token architecture.

### OWASP-Oriented API/Browser Risks

Check the relevant subset, not a rote full matrix:

- Broken access control / BOLA / IDOR: tenant, user, role, resource, and business IDs are resolved
  server-side or authorized before use.
- Broken function-level authorization: privileged routes and pages use server guards, not client UI
  visibility.
- Excessive data exposure: frontend DTOs do not leak secrets, internal reasons, privileged metadata,
  role internals, audit internals, payment secrets, or personal data not needed for the UI.
- Mass assignment: frontend payloads cannot set role, tenant, plan, owner, pricing, security,
  audit, or server-derived fields unless explicitly allowed and authorized.
- Injection and SSRF-adjacent browser inputs: URLs, embeds, image fetches, redirects, and search or
  filter params are validated for the context where they are used.
- Security misconfiguration: CSP/header/cookie/rate-limit/trust-proxy assumptions are explicit for
  deployment-sensitive changes.
- Vulnerable/outdated components: dependency changes or runtime web dependency risk should run or
  record `npm audit --omit=dev`, equivalent tooling, or `N/A`.
- Logging and monitoring: sensitive auth, token, payment, and personal data must not be logged; high
  risk admin/security mutations should be auditable where the project has audit support.

### Automation and Baselines

- Use existing project scripts only. Candidate gates include dependency audit, secret scan,
  auth/tenant tests, browser smokes, deployment preflight, backup/token scanners, or OWASP ZAP/DAST
  only when already present and appropriate.
- Do not install scanners opportunistically during preflight.
- DAST/ZAP-style checks belong to release/staging or explicit security review by default, not every
  local development preflight.

---

## 3. Severity Guidance

Classify as `CRITICAL` when the target prompt would:

- expose or persist tokens, credentials, session secrets, or sensitive personal data to the browser
  or logs;
- rely on client-side visibility as the security boundary for privileged behavior;
- create likely IDOR/BOLA, broken function-level authorization, cross-tenant leakage, payment
  escalation, or admin-role escalation;
- introduce unescaped DOM injection into user/business-controlled content;
- weaken cookie/session/header/CSP controls without a documented compensating control;
- claim security readiness while relevant security baseline is red or unverified.

Classify as `SEVERE` when the target prompt would:

- omit CSRF/origin reasoning for cookie-backed sensitive mutations;
- leave token/OAuth/browser-storage handling ambiguous;
- leave CSP or third-party host changes overbroad and undocumented;
- under-specify dependency/security scans for runtime web dependency changes;
- omit audit/privacy handling for privileged or personal-data browser flows.

---

## 4. Output Additions

In the main preflight output:

- Add `[Frontend Security/Browser Boundary]` and specific OWASP tags where applicable.
- In the readiness checklist, mark `Frontend security/browser-boundary add-on loaded or explicitly N/A`.
- Record the discovered session/cookie, CSP/header, storage/token, CSRF/origin, dependency-audit,
  and security-test posture, or state exact `N/A` reasons.
- Keep recommendations surgical: prompt fixes first; implementation changes only happen later, when
  the target prompt is executed.
