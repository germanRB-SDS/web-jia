# SDS Design Standards (binding defaults)

Owner-ratified visual defaults that apply across SDS projects unless a project's brief explicitly
overrides them. Each standard names its source anchor so drift is checkable.

## DS-001 — Console page-title size

**Standard:** every admin/console page `<h1>` uses `font-size: clamp(1.76rem, 4vw, 3.04rem)`.

- Ratified 2026-07-31 (`[50-6]`, owner order: "Pagos y Facturación" must match "Configuración").
- Source anchor (Teragenda): `src/public/styles/app.css` —
  `.admin-shell--config .booking-intro h1, .billing-page-shell .booking-intro h1`.
- The larger public/booking hero clamp (`clamp(2.2rem, 5vw, 3.8rem)` on `.booking-intro h1`)
  remains correct for PUBLIC pages; the standard above is for console/admin surfaces.
- When adding a new console page, join the shared selector instead of duplicating the clamp.

## DS-002 — Standard form

**Standard:** forms follow the `standard-form` pattern
(`ui-components/standard-form/INDEX-AND-HOW-TO-USE-THEM.md`). Invocation aliases: "el form de
auragenda / teragenda / sds-dev". Ratified 2026-07-31 (`[50-6]`).

## DS-003 — Account two-column layout

**Standard:** "dos columnas con enlaces/menú/botones en la izquierda" means the asymmetric
account-console layout (`ui-components/account-two-column-layout/INDEX-AND-HOW-TO-USE-THEM.md`):
left rail `minmax(200px, 252px)`, content `minmax(0, 1fr)` — never 50/50. Ratified 2026-07-31
(`[50-6]`, Apple Account reference).
