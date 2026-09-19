# Account Two-Column Layout (asymmetric rail + content)

## 0. Invocation Aliases (binding)

When the owner asks for **"dos columnas con enlaces/menú/botones en la izquierda"** (or a page
"como la cuenta de Apple"), THIS layout is what they mean. The defining trait: the two columns are
**never 50/50** — the left rail is a narrow fixed-range column and the content owns the rest.

## 1. What This Pattern Is

An account-console layout: a narrow left rail (identity on top, then hairline-separated groups of
quiet text+icon items) next to a wide content column whose resting state shows ONE summary card;
rail navigation reveals further panels beneath it. Extracted from Teragenda's payments account
console (`[50-5]`/`[50-6]`), which adapts the Apple Account page to the SDS dark palette.

## 2. Reference Analysis (Apple "Cuenta de Apple" page — owner-loved proportions)

Measured from the owner's reference capture (~2000px frame):

- **Left column ≈ 320px (~16% of the frame)** — identity (large round photo, name, email) over a
  plain vertical list of text links. Not a sidebar "panel": no background, no border, just content
  on the page surface.
- **Right column takes the remainder (~65–70% used, generous outer whitespace).** Content is a
  grid of rounded cards; the column NEVER competes with the rail for width.
- Selected nav item is set in the accent color (Apple blue) with the same type size — selection is
  color+weight, not a filled box.
- A single hairline under the page header spans the full width; grouping inside the rail is done
  by whitespace, not boxes.
- Single job per zone: rail = who you are + where you can go; content = the thing you chose.

## 3. The SDS adaptation (what our version fixes in numbers)

| Axis | Value |
|---|---|
| Grid | `minmax(200px, 252px) minmax(0, 1fr)`, gap `clamp(1.25rem, 3vw, 2rem)`, `align-items: start` |
| Identity | stacked (avatar 46px → name 1.05rem → email .82rem caption); email owns the column, never wraps beside the avatar |
| Group separator | 1px bright hairline (`--color-hairline-bright`), full rail width, **identical air above/below from ONE named constant** (18px, `--billing-rail-separator-gap`) |
| Rail item | text+icon (18px stroke `currentColor`), min-height 2.4rem, no boxes; hover → bright, `:active` → muted (darker), selected/primary → brand accent + weight 750 |
| Rail groups | identity → section navigation (`aria-pressed` toggles, one panel at a time, resting = summary only) → actions |
| Stacked ≤780px | one column, rail first; identity returns to a compact row; items grow to ~2.9rem tap targets |

## 4. Source Anchors In Teragenda

- `src/public/scripts/billing.js` — `renderLoaded()` rail composition, `railPanelNavHtml`,
  `railActionButton`, panel visibility state (`activePanel`).
- `src/public/styles/app.css` — `.billing-account-layout`, `.billing-account-rail`,
  `.billing-rail-separator`, `.billing-rail-action*`, `.billing-rail-panels`.
- `src/config/local-ui.js` — `billing.railSeparatorGapPx` (the symmetric hairline air).

## 5. Files In This Example

- `html/account-two-column-layout.html`
- `css/account-two-column-layout.css`

Panel-toggle behaviour (which section is on stage) belongs to the host project's JS; the example
only ships the states (`aria-pressed`).

## 6. Integration Steps For Another Project

1. Copy markup + CSS; map `--al-*` custom properties to the project's tokens.
2. Keep the asymmetry: rail `minmax(200px, 252px)` — resist widening it toward 50/50.
3. Give every rail item a descriptive stroke icon (`currentColor`, aria-hidden) — the label
   carries the name.
4. If rail items toggle content panels, keep the panels in the DOM and switch `hidden` — never
   unmount (contracts and tests depend on presence).
5. Pull all visible strings from the copy/i18n layer.

## 7. Accessibility Checklist

- The rail is an `aside` with an accessible name; each group is a `nav` (heading may be sr-only).
- Section toggles are buttons with `aria-pressed`; selection is also conveyed by color+weight.
- `:focus-visible` outline on every item; disabled items keep readable contrast.

## 8. Responsiveness Checklist

- ≤780px: single column, no horizontal overflow (rail items are `width: 100%`).
- Long emails/labels: `overflow-wrap: anywhere` on identity details; `min-width: 0` on both grid
  columns.

## 9. Reduced-Motion Behavior

Item color/icon transitions are disabled under `prefers-reduced-motion`. Do not add movement to
the hairlines or the rail itself.

## 10. Constants/i18n/token Adaptation Notes

Two numbers ARE the pattern: the rail width range (200–252px) and the separator air (18px as a
named constant, same above and below). Publish the latter from the project's UI-constants layer
(Teragenda: `local-ui.js` → `--billing-rail-separator-gap`), not as a CSS literal.
