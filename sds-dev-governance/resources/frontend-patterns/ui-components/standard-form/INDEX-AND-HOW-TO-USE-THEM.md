# Standard Form (SDS dark-panel form)

## 0. Invocation Aliases (binding)

When the owner asks for **"el form de auragenda"**, **"el form de teragenda"** or **"el form de
sds-dev"** — or asks to design a form "with our style" — THIS pattern is the answer. Copy this
style; do not improvise a new form language.

## 1. What This Pattern Is

The SDS standard form: one bordered, rounded (12px) dark card per form, a segmented entity switch
with **no outer box** (only the chosen option fills as a pill), a two-column field grid whose only
vertical rhythm is a 12px row gap, quiet muted labels (.85rem/600) that sit 0.28rem above their
42px inputs, per-field inline errors, and a footer where the submit button and a caption-sized
live status share one line.

Extracted from Teragenda's fiscal billing form (`billingProfileForm.js` + `app.css`), as refined
in `[50-5]`/`[50-6]`.

## 2. Anatomy (what makes it read as "ours")

| Piece | Value | Why |
|---|---|---|
| Card | surface bg, 1px border, radius 12px, padding 28px | one calm container, no nested boxes |
| Segmented switch | container = pure layout (inline-flex, gap .4rem); option = pill 999px, padding .5rem 1.1rem | selection is the ONLY filled thing; hover on unselected = 8% text-tint |
| Field grid | 2 cols `minmax(0,1fr)`, gap `12px 1.25rem`; 1 col ≤780px | the 12px row gap makes a label belong to ITS field |
| Label | muted, .85rem, weight 600, gap .28rem to control | quieter than the value the user types |
| Input/select | bg = page bg, 1px border, radius 8px, min-height 42px, padding 10px 12px | inputs read as wells cut into the card |
| Focus | border + 2px outline in accent, offset 1px | one accent, both signals |
| Invalid | border = danger 65% mix + `.sf-field-error` (.85rem danger) under the field | error belongs to the field, not a summary |
| Footer | flex row, gap .85rem; status caption .82rem muted, `role="status" aria-live="polite"` | saving/saved/empty hints never compete with fields |

## 3. Two hard-won gotchas (do not re-learn them)

1. **Global label margins detach rows.** If the host project styles `label { margin: … }`
   globally, the grid gap stacks on top of it and fields float away from the next label. The
   pattern ships `margin: 0` on `.sf-field` — keep it.
2. **The switch container must not be a box.** Background + radius on the container reads as a
   second nested card; move them to the options so only the selection fills.

## 4. Source Anchors In Teragenda

- `src/public/scripts/billingProfileForm.js` — markup builder (real radios, aria wiring,
  server-mirrored validation, optimistic-lock footer).
- `src/public/styles/app.css` — `.billing-segmented*`, `.billing-profile-grid`,
  `.billing-profile-field*`, `.billing-profile-footer`, `.billing-profile-status`.
- `src/config/local-ui.js` — `billing.profileFieldGapPx` (the 12px row rhythm as a constant).

## 5. Files In This Example

- `html/standard-form.html`
- `css/standard-form.css`

No JavaScript: behaviour (validation echo, single-flight save) belongs to the host project.

## 6. Integration Steps For Another Project

1. Copy the markup and CSS; map every `--sf-*` custom property to the project's tokens.
2. Pull all visible strings from the project's copy/i18n layer.
3. Keep server-side validation as the single authority; the form only mirrors it
   (`aria-invalid` + per-field error text).
4. If the project has global `label`/`legend` margins, verify the rhythm survives (gotcha #1).

## 7. Accessibility Checklist

- Real radios inside `fieldset`/`legend`; options are labels wrapping their input.
- `:focus-visible` styles on options and inputs; never remove without replacement.
- Errors: `aria-describedby` from input to its error paragraph; status line is a live region.

## 8. Responsiveness Checklist

- ≤780px: one column; footer stacks and stretches.
- Inputs are `width: 100%` inside `minmax(0, 1fr)` columns — no overflow from long values.

## 9. Reduced-Motion Behavior

Only the segmented pill transition animates; it is disabled under `prefers-reduced-motion`.

## 10. Constants/i18n/token Adaptation Notes

The two rhythm numbers (row gap 12px, label gap .28rem) are the pattern's signature — in
Teragenda the row gap is a named UI constant (`--billing-profile-field-gap`) published from
`local-ui.js`, not a CSS literal. Reproduce that discipline in the host project.
