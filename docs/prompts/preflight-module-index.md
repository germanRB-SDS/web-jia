# Preflight Module Index

This is the lightweight routing index for `docs/prompts/prompt-revision-preflight.md`.

Do not execute this file directly. Do not load every module by default. The main preflight reads
this index, infers affected surfaces, and loads only the matching add-on files.

This index is also the extension point for future preflight modules. When adding a module, register
it here with a precise trigger and a precise "do not load when" condition. New modules must remain
lazy-loaded by default; adding a module must not increase baseline context for unrelated prompts.

## Module Graph

```text
prompt-revision-preflight.md
├── preflight-module-index.md
├── preflight-frontend-ui.md          [conditional]
└── preflight-frontend-security.md    [conditional]
```

## Routing Table

| Module | Load only when target prompt affects | Do not load when |
|---|---|---|
| `preflight-frontend-ui.md` | Frontend/UI, browser-rendered content, copy, client-side state, forms, responsive behavior, design tokens, user-facing assets, or frontend API consumption | Backend-only, DB-only, API-only, deployment-only, or documentation-only prompts with no UI/browser impact |
| `preflight-frontend-security.md` | Browser security boundary, auth/session UX, admin/public forms, frontend-triggered mutations, cookies, tokens, OAuth/login, CSP/security headers, third-party embeds/assets, payments, tenant/admin visibility, privileged UI, or personal data in UI | Backend-only, DB-only, API-only, deployment-only, or documentation-only prompts with no browser-security impact |

## Agent Rule

All agents use the same path:

1. Load `docs/prompts/prompt-revision-preflight.md`.
2. Read this index only as a router.
3. Load only current or future add-ons whose trigger matches the target prompt or repository evidence.
4. Do not load all modules defensively "just in case".
5. Mark non-applicable add-ons as `N/A`.

Adapters must not duplicate module checklists. They only carry the trigger to run the main
preflight entrypoint.
