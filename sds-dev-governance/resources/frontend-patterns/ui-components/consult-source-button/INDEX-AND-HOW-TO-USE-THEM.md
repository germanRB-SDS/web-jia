# Consult-Source Button

## 1. What This Pattern Is

A pill-shaped gradient CTA link that sends the user to an external "source of truth" document
(for example a legal policy hosted on GitHub). It layers a radial bottom glow, a soft white sheen,
ten floating particle "points", and a document icon whose outline animates ("draws" then fills) on
hover. It is an `<a>`, not a `<button>`: it navigates.

Credits: structure and animations adapted from a Uiverse button by **ilkhoeri**
(https://uiverse.io). Adaptations for SDS use: brand-themable gradient via custom properties, a
**document** icon instead of the original lightning bolt, and the original corner-fold effect
removed (it only looks right at small `border-radius`; on a pill it looks off).

## 2. When To Use It

Use it as a single, prominent call to action that opens an always-up-to-date external document or
canonical resource in a new tab: legal pages that defer to a GitHub source, "view full document",
"open spec", "read the policy".

## 3. When Not To Use It

Do not use it for primary form submission, destructive actions, or as a generic in-app button. Do
not place several side by side; it is meant to be the one focal action of its section.

## 4. Source Anchors In Auragenda

- `src/server/render.js` — `renderLegal()` builds the `.legal-cta` anchor (markup of this pattern).
- `src/public/styles/app.css` — `.legal-cta` rules (this pattern, scoped under that class).

## 5. Files In This Example

- `html/consult-source-button.html`
- `css/consult-source-button.css`

No JavaScript: the effect is pure CSS.

## 6. Integration Steps For Another Project

1. Copy the `<a class="consult-cta">` markup and the CSS.
2. Set `href` to your external document and keep `target="_blank" rel="noopener"`.
3. Re-theme via the three custom properties on `.consult-cta`: `--cta-grad`, `--cta-glow`
   (RGB triplet), `--cta-shadow` (RGB triplet).
4. Replace the SVG with any line icon; keep `fill="none" stroke="currentColor"` for the
   draw-on-hover animation to work.
5. Pull the visible label from your copy/i18n layer.

## 7. Accessibility Checklist

- It is a link (`<a>`) and navigates; the visible label describes the destination.
- Opens in a new tab with `rel="noopener"`.
- Decorative layers (`points_wrapper`, the SVG) are `aria-hidden`.
- Focus state fills the icon so keyboard focus is perceivable; keep a visible focus outline if you
  remove `outline:none`.

## 8. Responsiveness Checklist

- Content-sized via padding (no fixed width), so longer labels fit.
- `white-space: nowrap` keeps the label on one line; shorten the label on very narrow screens.

## 9. Reduced-Motion Behavior

The example ships a `@media (prefers-reduced-motion: reduce)` block that stops the floating points
and the icon-draw animation and hides the particle layer. Adopt it in production too (the Auragenda
source currently does not include it yet).

## 10. Constants/i18n/token Adaptation Notes

The label ("Consultar aquí") must come from the copy/i18n layer, not be hardcoded. Colors are
exposed as custom properties so they can map to design tokens instead of literal hex/RGB values.

## 11. Common Failure Modes

- Keeping the original `.fold` corner on a high-radius pill (looks broken) — it is removed here.
- Using a filled SVG: the hover draw needs `fill="none"` + `stroke="currentColor"`.
- Hardcoding the gradient/label instead of tokens/i18n.
- Rendering many of them at once; it is a single focal CTA.

## 12. Minimal Verification Checklist

- The link opens the correct external document in a new tab.
- Hover animates the icon; points float continuously.
- Under reduced motion, animations stop.
- Keyboard focus is visible and the icon fills on focus.
