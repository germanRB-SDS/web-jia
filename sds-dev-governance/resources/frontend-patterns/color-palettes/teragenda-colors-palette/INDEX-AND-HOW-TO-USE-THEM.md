# Teragenda Colors Palette

## 1. What This Pattern Is

A project palette reference extracted from Teragenda's real CSS variables and Google Calendar event
color constants.

Since [49-6] it also carries the accent set (`--color-info-accent` light blue,
`--color-accent-aqua` additive green, `--color-eyebrow-soft` dialog eyebrows) and the popup/dialog
surface `--color-modal-surface #1d2e46`, whose contrast is tuned against `--color-surface #111f30`
content panels — use that pair for floating menus and dialogs. The brand accent is the soft pale
gold `#f2d98b` (owner decision in [49-6]; it replaced the former yellow-orange `#f5c242`, which
survives only inside the logo gradient).

## 2. When To Use It

Use it when a new project explicitly wants the Teragenda visual language: dark premium surfaces,
cyan/coral/gold accents, and restrained feedback colors.

## 3. When Not To Use It

Do not treat this as an SDS default. Do not use it for projects that need a different brand or
accessibility contrast model without redesign.

## 4. Source Anchors In Teragenda

- `src/styles/local-colors.css:1` — brand, surface, text, feedback tokens.
- `src/public/scripts/googleCalendarEventColors.js:1` — calendar event color constants.

## 5. Files In This Example

- `css/teragenda-colors-palette.css`
- `javascript/teragenda-colors-palette.js`

## 6. Integration Steps For Another Project

1. Copy the CSS custom properties into the target project's theme layer.
2. Rename tokens only if the target design system uses different naming.
3. Keep semantic tokens (`success`, `warning`, `danger`) separate from brand tokens.
4. Import the JS export only for tooling, examples, or dynamic swatches.

## 7. Accessibility Checklist

- Recheck contrast after changing any surface/text pair.
- Do not use event colors as text colors without contrast testing.

## 8. Responsiveness Checklist

N/A. Palette is not layout-specific.

## 9. Reduced-Motion Behavior

N/A. Palette is not animation-specific.

## 10. Constants/i18n/token Adaptation Notes

Colors are tokens. User-facing color names in UI must come from copy/i18n if displayed.

## 11. Common Failure Modes

- Copying raw hex literals into components instead of using tokens.
- Treating Google Calendar event colors as brand colors.
- Mixing business-specific copy with palette constants.

## 12. Minimal Verification Checklist

- CSS variables resolve in the target app.
- JS export matches the CSS values.
- Contrast is tested on primary surfaces.
