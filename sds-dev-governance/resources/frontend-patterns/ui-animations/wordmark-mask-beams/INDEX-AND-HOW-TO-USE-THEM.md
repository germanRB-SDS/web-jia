# Wordmark Mask Beams

## 1. What This Pattern Is

A decorative beam layer clipped to a wordmark or logo. The implementation is a `<canvas>` placed on
top of a visible wordmark layer and clipped with the same CSS `mask` / `-webkit-mask` image. The
canvas draws animated diagonal light beams using brand palette tokens, so the color movement appears
inside the letters only.

This is a mask effect, not an SVG path trace. It does not know the logo geometry point-by-point; the
browser clips a normal canvas rectangle through the wordmark mask.

## 2. When To Use It

Use it for first-load brand moments where the product name should feel alive before any scroll
interaction. It works well on large hero wordmarks, monograms, display logos, or campaign headlines
that can tolerate decorative motion.

## 3. When Not To Use It

Do not use it for body text, small navigation logos, critical status text, buttons, or anything that
needs exact deterministic layout on every frame. Avoid it when the logo is already visually busy or
when the canvas would compete with another reveal animation.

## 4. Source Anchors In Auragenda

Extracted from the Auragenda home (`[6-0]` hero intro phase):

- `src/server/render.js` - adds
  `<canvas class="hero-wordmark-beams" aria-hidden="true"></canvas>` next to the visible
  `.hero-wordmark`.
- `src/public/styles/app.css` - shares geometry between
  `.hero-wordmark`, `.hero-wordmark-beams`, and `.hero-wordmark-glow-layer` (same `left/top`,
  `width: min(64vw, 820px)`, `aspect-ratio: 3664 / 729`, and `translate(-50%, -50%)`); clips the
  canvas with `var(--wordmark)`.
- `src/public/scripts/hero.js` - the `introBeams` canvas renderer reads
  `--aura-blue`, `--aura-violet`, and `--aura-lilac`, pauses the rAF loop via
  `IntersectionObserver` visibility, and exits early under `prefers-reduced-motion`.
- `docs/prompts-output/[6-0]hero-intro-wordmark-beams-report.md` - validation and risk notes.

## 5. Files In This Example

- `html/wordmark-mask-beams.html`
- `css/wordmark-mask-beams.css`
- `javascript/wordmark-mask-beams.js`

## 6. Integration Steps For Another Project

1. Define a `--wordmark` CSS variable pointing to the SVG/PNG mask asset.
2. Define brand beam tokens such as `--brand-beam-blue`, `--brand-beam-violet`, and
   `--brand-beam-lilac`.
3. Render a visible wordmark layer and a sibling `<canvas class="wordmark-mask-beams">`.
4. Give both layers the same position, size, `aspect-ratio`, and transform.
5. Clip the canvas with the same mask image as the visible wordmark.
6. Initialize the renderer after DOM load, and pass selectors/tokens if your project names differ.
7. If the wordmark participates in a scroll/intro timeline, animate the canvas layer together with
   the visible wordmark.

## 7. Accessibility Checklist

- The canvas is decorative: `aria-hidden="true"` and `pointer-events: none`.
- The visible wordmark keeps the accessible name when it represents the product identity.
- Motion is disabled or hidden under `prefers-reduced-motion: reduce`.
- The effect is not used as the only indicator of state, progress, focus, validation, or error.

## 8. Responsiveness Checklist

- Visible wordmark and canvas share one size rule and one `aspect-ratio`.
- Mobile breakpoints update both layers together.
- Canvas dimensions are recalculated on resize.
- Verify the mask is still aligned after font loading, viewport changes, and device pixel ratio
  changes.

## 9. Reduced-Motion Behavior

Preferred behavior: hide the beam canvas and leave the static wordmark visible.

If the brand requires a static enhanced state, keep a non-animated gradient fill on the visible
wordmark and do not start the canvas animation loop.

## 10. Constants/i18n/token Adaptation Notes

The mask asset and palette must come from the target project's constants/design-token layer. In the
Auragenda implementation the relevant tokens are:

```css
:root {
  --wordmark: url("/assets/wordmark.svg");
  --aura-blue: #5AA0E8;
  --aura-violet: #7B7FE0;
  --aura-lilac: #9D7BE8;
}
```

For another brand, rename the variables to match that project, but keep the ownership rule: raw
brand colors belong in token/config files, not scattered in component code.

## 11. Common Failure Modes

- Applying the mask to the visible wordmark but not to the canvas, which makes the beams cover the
  full rectangular box.
- Letting the canvas and wordmark use different dimensions or transforms, which makes the clipping
  feel offset.
- Making opacity too low: the canvas exists but reads as a normal static gradient instead of beams.
- Forgetting reduced-motion handling, leaving a decorative `requestAnimationFrame` loop running for
  users who requested less motion.
- Reusing a scroll-reveal beam engine for this intro state. Keep this as a separate layer when the
  existing reveal beams have different timing and visual responsibilities.

## 12. Minimal Verification Checklist

- On page load, beams are visible inside the wordmark only.
- The base wordmark remains readable at desktop and mobile sizes.
- Existing reveal/scroll beams are unchanged.
- `prefers-reduced-motion: reduce` hides or disables the canvas animation.
- No canvas layer intercepts pointer events.
- Console has no JavaScript errors during load, resize, or scroll.
