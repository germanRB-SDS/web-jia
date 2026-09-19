# Index of Resources and Working Patterns

Single, authoritative index of everything under `sds-dev-governance/resources/`.

**Read this file first.** It exists so agents discover available resources without listing or
opening folder by folder (which wastes context and cost). Find the resource you need here, then open
only that one leaf folder and its `INDEX-AND-HOW-TO-USE-THEM.md`.

These resources are **optional** and **lazy-loaded**: load one only when the user or active prompt
explicitly asks for a frontend pattern, component, web component, animation, palette, nomenclature, naming help,
release know-how, or names a path. They are portable references, not runtime source of truth.

## Operational How-To

| Resource | Path | Load only when |
|---|---|---|
| Android / Google Play release | [How-to](../knowledge/android/how-to-release-an-app/android-google-play-release.md) (lives in `knowledge/android/` since v1.29.0); [prompts P00–P13](prompts/android-google-play-agent-prompts.md) | Preparing or recovering an Android/Google Play release, AAB, Play App Signing, upload key or keystore. Canonical guide and prompt catalog; verified 2026-09-01. |

## Mobile Sample Code

| Resource | Path | What it is | How-to |
|---|---|---|---|
| swiftui-paypal-donation-link | `mobile-sample-code/swiftui-paypal-donation-link` | Runnable Swift package preserving UpNews's validated PayPal hosted-button URL builder, strict allowlist, external opener and configurable SwiftUI button; reference-only and not an App Store authorization. | `mobile-sample-code/swiftui-paypal-donation-link/INDEX-AND-HOW-TO-USE-THEM.md` |

## Nomenclature and Know-How

| Resource | Path | What it is | Load only when |
|---|---|---|---|
| nomenclature-explanation | `nomenclature-explanation.md` | Bilingual English/Spanish explanation of SDS naming conventions for prompts, refinements, planned-iteration insertions, outputs, preflights, feature IDs, decision IDs, governance IDs and policy placeholders. | The user or active prompt asks about nomenclature, naming help, conventions, know-how, or how to name SDS artifacts. |

## Glossaries

| Resource | Path | What it is |
|---|---|---|
| indice-glosario-de-terminos | `frontend-patterns/indice-glosario-de-terminos.md` | Canonical names, aliases and example locations for reusable UI effects/components such as `aura-lift`, `mask-reveal`, `border-glow` and `text-shimmer`. |

## Design Standards

| Resource | Path | What it is | Load only when |
|---|---|---|---|
| design-standards | `frontend-patterns/design-standards.md` | Owner-ratified binding visual defaults: DS-001 console page-title size (`clamp(1.76rem, 4vw, 3.04rem)`), DS-002 standard form, DS-003 asymmetric account two-column layout. | Designing/reviewing any SDS console page, form, or two-column account layout. |

## ⚠️ Maintenance rule (restrictive — mandatory)

Whenever you **add, rename, move, or remove** a working resource/example under `resources/`, you
**MUST update this index in the same change**. An unindexed resource is considered non-existent.
This rule is enforced by `check-governance.sh` (section "Resources Index"): a resource leaf folder
with an `INDEX-AND-HOW-TO-USE-THEM.md` that is not listed here makes the check fail.

When adding a row: include category, name, path (relative to `resources/`), a one-line description,
and the path to its how-to index.

## web-components

Complete, validated components with working source, the site-side integration that was validated and an agent
procedure to rebuild the same result in another project. Heavier than a pattern: open the leaf only when asked for it.

| Resource | Path | What it is | How-to |
|---|---|---|---|
| tree-3d | `web-components/tree-3d` | Procedural animated 3D tree (Three.js, no model, no video): slender stems, dense lobed crown, hanging roots, flat-faced rocks, breeze sway and leaves torn off that drift towards the viewer; palette by CSS tokens; React wrapper, framework-free `mountTree` and a no-build HTML demo. Decoration behind a section's content. Aliases: `arbol 3d`, `árbol del saber`, `falling leaves`. | `web-components/tree-3d/INDEX-AND-HOW-TO-USE-THEM.md` |

## frontend-patterns / ui-animations

| Resource | Path | What it is | How-to |
|---|---|---|---|
| border-glow | `frontend-patterns/ui-animations/border-glow` | Pointer-following border glow that highlights a surface on hover/focus without tinting its content. | `border-glow/INDEX-AND-HOW-TO-USE-THEM.md` |
| carousel-motion | `frontend-patterns/ui-animations/carousel-motion` | Direction-aware slide/fade animation layer for carousel transitions. | `carousel-motion/INDEX-AND-HOW-TO-USE-THEM.md` |
| svg-path-glow-trace | `frontend-patterns/ui-animations/svg-path-glow-trace` | Decorative glow particle or comet trail that follows an inline SVG path with native `animateMotion`. | `svg-path-glow-trace/INDEX-AND-HOW-TO-USE-THEM.md` |
| text-shimmer | `frontend-patterns/ui-animations/text-shimmer` | Animated horizontal gradient highlight clipped to any text (default warm/orange), slow loop. | `text-shimmer/INDEX-AND-HOW-TO-USE-THEM.md` |
| wordmark-mask-beams | `frontend-patterns/ui-animations/wordmark-mask-beams` | Canvas light beams clipped to a wordmark/logo via CSS mask, using brand palette tokens. | `wordmark-mask-beams/INDEX-AND-HOW-TO-USE-THEM.md` |

## frontend-patterns / ui-components

| Resource | Path | What it is | How-to |
|---|---|---|---|
| account-two-column-layout | `frontend-patterns/ui-components/account-two-column-layout` | Asymmetric account-console layout (rail `minmax(200px,252px)` + wide content, NEVER 50/50): stacked identity, bright hairline groups, quiet text+icon rail items, aria-pressed panel toggles. Aliases: "dos columnas con enlaces/menú/botones en la izquierda", "como la cuenta de Apple". | `account-two-column-layout/INDEX-AND-HOW-TO-USE-THEM.md` |
| carousel | `frontend-patterns/ui-components/carousel` | Responsive carousel with count-based controls, current-index state and keyboard support. | `carousel/INDEX-AND-HOW-TO-USE-THEM.md` |
| consult-source-button | `frontend-patterns/ui-components/consult-source-button` | Gradient pill CTA link (radial glow, floating points, document icon draw-on-hover) that opens an external source-of-truth document. | `consult-source-button/INDEX-AND-HOW-TO-USE-THEM.md` |
| drag-relocate-button | `frontend-patterns/ui-components/drag-relocate-button` | Drag-handle button to reorder cards/sections using SortableJS. | `drag-relocate-button/INDEX-AND-HOW-TO-USE-THEM.md` |
| expandable-search-filter-panel | `frontend-patterns/ui-components/expandable-search-filter-panel` | Collapsible bordered panel whose search field expands by default and contracts to reveal aligned, state-preserving filters. | `expandable-search-filter-panel/INDEX-AND-HOW-TO-USE-THEM.md` |
| frosted-alert-modal | `frontend-patterns/ui-components/frosted-alert-modal` | One-action alert/acknowledge modal with a frosted glass backdrop. | `frosted-alert-modal/INDEX-AND-HOW-TO-USE-THEM.md` |
| frosted-arrow-buttons | `frontend-patterns/ui-components/frosted-arrow-buttons` | Previous/next navigation buttons with a frosted surface and hover/focus states. | `frosted-arrow-buttons/INDEX-AND-HOW-TO-USE-THEM.md` |
| frosted-confirm-modal | `frontend-patterns/ui-components/frosted-confirm-modal` | Two-action confirm dialog with frosted backdrop, primary/secondary actions and optional danger style. | `frosted-confirm-modal/INDEX-AND-HOW-TO-USE-THEM.md` |
| gradient-flow-button | `frontend-patterns/ui-components/gradient-flow-button` | Filled pill CTA whose brand gradient flows left-to-right on hover (seamless loop) with a light vertical lift shadow. Pure CSS. | `gradient-flow-button/INDEX-AND-HOW-TO-USE-THEM.md` |
| notification-toast-stack | `frontend-patterns/ui-components/notification-toast-stack` | Accessible info/success/error notification stack with 3.5-second dwell, animated entry/exit, immediate click dismissal and the discovery tag `notificaciones-01`. | `notification-toast-stack/INDEX-AND-HOW-TO-USE-THEM.md` |
| procedural-horizon-hero | `frontend-patterns/ui-components/procedural-horizon-hero` | Full-viewport editorial hero with a complete static landscape fallback, quiet copy corridor and optional deferred Three.js enhancement with lifecycle controls. | `procedural-horizon-hero/INDEX-AND-HOW-TO-USE-THEM.md` |
| standard-form | `frontend-patterns/ui-components/standard-form` | The SDS dark-panel form: 12px-radius card, box-less segmented switch (only the selection fills), 2-column grid with 12px row rhythm, muted .85rem labels, 42px inputs, inline per-field errors, caption-sized live status. Aliases: "el form de auragenda/teragenda/sds-dev". | `standard-form/INDEX-AND-HOW-TO-USE-THEM.md` |
| weekday-chip-toggle | `frontend-patterns/ui-components/weekday-chip-toggle` | Single-line pill chip strip over native checkboxes (`:has`-driven states, short visible labels with full accessible names, optional "all days" master sync). | `weekday-chip-toggle/INDEX-AND-HOW-TO-USE-THEM.md` |

## frontend-patterns / color-palettes

| Resource | Path | What it is | How-to |
|---|---|---|---|
| teragenda-colors-palette | `frontend-patterns/color-palettes/teragenda-colors-palette` | Project palette reference from Teragenda CSS variables and calendar event colors; can seed design tokens. | `teragenda-colors-palette/INDEX-AND-HOW-TO-USE-THEM.md` |

## frontend-patterns / site-compositions

| Resource | Path | What it is | How-to |
|---|---|---|---|
| grounded-editorial-studio | `frontend-patterns/site-compositions/grounded-editorial-studio` | Whole-page studio composition with world hero, positioning, alternating proof, context, people and contact, structured through spacing and hairlines rather than card grids. | `grounded-editorial-studio/INDEX-AND-HOW-TO-USE-THEM.md` |

## frontend-external-sample-code

| Resource | Path | What it is | How-to |
|---|---|---|---|
| ivancidev-gta6-landing-clone | `frontend-external-sample-code/ivancidev-gta6-landing-clone` | Reference notes for ivancidev's public GTA VI landing clone with source plus working Vercel deployment; license-sensitive, not vendored source. | `frontend-external-sample-code/ivancidev-gta6-landing-clone/INDEX-AND-HOW-TO-USE-THEM.md` |
| midu-gta-vi-hero | `frontend-external-sample-code/midu-gta-vi-hero` | Reference notes for midudev's public GTA VI-inspired Astro/Tailwind/GSAP hero sample; license-sensitive, not vendored source. | `frontend-external-sample-code/midu-gta-vi-hero/INDEX-AND-HOW-TO-USE-THEM.md` |
| grounded-studio-reference | `frontend-external-sample-code/grounded-studio-reference` | SDS-owned clean-room runnable sample for the procedural hero and grounded editorial page patterns; neutral copy/assets, config-driven static generation and optional pinned Three.js enhancement. | `frontend-external-sample-code/grounded-studio-reference/INDEX-AND-HOW-TO-USE-THEM.md` |

## Category READMEs

- `frontend-patterns/README.md` — scope and rules for the whole catalog.
- `frontend-patterns/ui-components/README.md`, `ui-animations/README.md`, `color-palettes/README.md`,
  `site-compositions/README.md`.
- `web-components/README.md` — what a promoted web component must carry and what it must not.
- `frontend-external-sample-code/README.md` — provenance rules for external references and the
  owner-requested clean-room sample leaf.
- `mobile-sample-code/README.md` — runnable native-mobile references and their distribution-policy
  boundary.
