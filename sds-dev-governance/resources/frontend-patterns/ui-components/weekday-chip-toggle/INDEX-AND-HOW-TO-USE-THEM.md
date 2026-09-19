# Weekday Chip Toggle

## 1. What This Pattern Is

A single-line strip of pill-shaped toggle chips backed by **native checkboxes**. Each chip is a
`<label>` that wraps its checkbox; the input stays in the DOM (form-value source, focus target,
full accessible name) but is visually collapsed, and every visual state — checked, hover, disabled,
focus ring — is driven purely by CSS `:has(input:state)`. Short visible labels ("Lun") pair with
full accessible names ("Lunes") via `aria-label` on the input and `title` on the chip. Includes an
optional "all days" master checkbox with mutual-exclusion sync (checking the master clears and
disables the chips; checking any chip clears the master).

## 2. When To Use It

Multi-select over a small, fixed, known set (weekdays, sizes, short category filters) where a row
of chips reads faster and denser than a checkbox column, especially inside compact dialogs.

## 3. When Not To Use It

Long or dynamic option lists (use a listbox/multiselect), single-choice groups (use radios or a
segmented control), or options with long labels that cannot be abbreviated without losing meaning.

## 4. Source Anchors In Auragenda

- `src/public/scripts/config.js` — `professionalGroupSeriesFormHtml()` (chip markup with
  `configProfessionalGroupWeekdayShortLabels`) and `mountProfessionalGroupSeriesForm()`
  (all-days/chips mutual-exclusion sync).
- `src/public/styles/app.css` — `.professional-group-modal .professional-group-weekday-options`
  block (chip styling, `:has` states, reduced-motion rule).
- `src/config/local-copy.js` — full + short weekday label constants.

## 5. Files In This Example

- `html/weekday-chip-toggle.html`
- `css/weekday-chip-toggle.css`
- `js/weekday-chip-toggle.js` (optional — only needed for the "all days" master sync)

## 6. Integration Steps For Another Project

1. Copy the markup and CSS; keep the checkbox INSIDE the label (that is what makes the chip a
   native click/keyboard target with zero JS).
2. Re-theme via the custom properties on `.chip-toggle-group`: `--chip-border`, `--chip-border-w`
   (reference uses 1.5px), `--chip-accent` (checked/hover hue), `--chip-text`, `--chip-muted`,
   `--chip-radius`, `--chip-min-h`.
3. Pull visible short labels AND full accessible names from your copy/i18n layer; never hardcode.
   Keep `aria-label` on the input and `title` on the label in sync with the full name.
4. If you need the master "all" checkbox, wire `js/weekday-chip-toggle.js` (`initChipToggleGroup`).
   Skip the JS entirely for a plain multi-select strip.
5. `:has()` requires evergreen browsers. If you must support engines without it, add a tiny JS
   fallback that mirrors `input.checked`/`disabled` onto label classes.

## 7. Accessibility Checklist

- Checkbox remains focusable and announces its full name (`aria-label`), never `display:none`.
- Focus ring via `label:has(input:focus-visible)` — visible keyboard focus on the chip.
- Checked state is not color-only: background + border + weight change together.
- Disabled chips drop to 0.45 opacity, `cursor: not-allowed`, and hover styling is suppressed
  (`label:not(:has(input:disabled)):hover`).
- `prefers-reduced-motion: reduce` disables the state transition.
- Hit target: `--chip-min-h` defaults to 40px.
