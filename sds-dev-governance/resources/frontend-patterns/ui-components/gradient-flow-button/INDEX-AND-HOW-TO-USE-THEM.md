# Gradient-Flow Button

## 1. What This Pattern Is

A filled pill CTA whose multi-stop brand gradient slides left-to-right in a seamless loop
**only on hover**, paired with a light vertical drop shadow underneath that lifts the button. The
gradient is symmetric (c1…c3…c1) so the horizontal shift never snaps. Pure CSS, no JS.

## 2. When To Use It

Use it for a primary call to action where you want a touch of life on hover (a "Hablemos",
"Empezar", "Solicitar demo") without resorting to heavy effects. One focal CTA per section.

## 3. When Not To Use It

Do not use it for secondary/tertiary actions, for many buttons at once (the motion stops being
special), or where the gradient clashes with the surrounding palette. Avoid on destructive actions.

## 4. Source Anchors In Auragenda

- `src/public/styles/app.css` — `.cta-dark` (this pattern) and `@keyframes cta-dark-flow`.
- `src/server/render.js` — `renderLanding()` renders the `.cta-dark` "Hablemos" button in `.promesa`.

## 5. Files In This Example

- `html/gradient-flow-button.html`
- `css/gradient-flow-button.css`

No JavaScript: the flow and the shadow are pure CSS (`background-position` animation + `:hover`).

## 6. Integration Steps For Another Project

1. Copy the `.gradient-flow-btn` markup (works on `<a>` or `<button>`) and the CSS.
2. Re-theme via the custom properties: `--gf-c1/--gf-c2/--gf-c3` (keep it symmetric so it loops),
   `--gf-shadow` (RGB triplet for the shadow), `--gf-speed` (loop duration).
3. Keep `background-size: 220%` aligned with the keyframe end (`220%`) for a seamless loop.
4. Pull the visible label from your copy/i18n layer.

## 7. Accessibility Checklist

- Use a real `<a>`/`<button>` with a descriptive label; color is decorative, not informational.
- Keep sufficient contrast of the white text over the gradient at every position of the loop.
- Provide a visible focus style if you remove default outlines.

## 8. Responsiveness Checklist

- Content-sized via padding; the loop and shadow scale with the element.
- Touch devices have no hover: the button stays as a clean static gradient pill (acceptable).

## 9. Reduced-Motion Behavior

The example ships a `@media (prefers-reduced-motion: reduce)` block that disables the gradient
flow on hover (the lift shadow still applies). Keep it.

## 10. Constants/i18n/token Adaptation Notes

Colors are exposed as custom properties so they can map to design tokens instead of literal hex.
In Auragenda they map to the brand palette (`--aura-blue/--aura-violet/--aura-lilac`). The label
must come from the copy/i18n layer.

## 11. Common Failure Modes

- Non-symmetric gradient (c1…c3 without returning to c1) → visible snap at loop restart.
- `background-size` and keyframe end percentage out of sync → stutter.
- Putting the animation on the base rule instead of `:hover` → it never rests.
- Using a wide blurred shadow on hover → reads as a halo, not a downward lift.

## 12. Minimal Verification Checklist

- Resting state is a static gradient pill.
- On hover the gradient flows left→right smoothly and loops without a jump.
- On hover a light shadow appears below the button (not all around).
- Under reduced motion, the flow stops; the lift shadow remains.
