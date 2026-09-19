# SVG Path Glow Trace

## 1. What This Pattern Is

A decorative glow particle that travels along an SVG path. The source implementation used it as a
premium load animation over a wordmark: an inline SVG overlay shares the same `viewBox` and layout
box as the visible mark, hides the motion path, and moves one or more radial-gradient circles with
native SVG `<animateMotion>`.

The reusable form is not tied to logos. It works for any path where the geometry is known and stable:
icons, line art, monograms, separators, route maps, or brand symbols.

## 2. When To Use It

Use it for a short, signature animation where the path shape matters and a normal CSS shimmer would
not follow the geometry. Best for first-load brand moments, a single icon, or a decorative trace
behind a hero object.

## 3. When Not To Use It

Do not use it for dense illustrations, long looping backgrounds, body content, critical feedback,
or any control where the glow could be mistaken for focus, validation, or progress state.

## 4. Source Anchors In Auragenda

- `src/server/render.js` in `origin/production` (`[5-0]`) - generated
  `.hero-wordmark-glow-layer` with multiple `<circle class="hero-wordmark-glow">` nodes staggered
  over one `<path id="hwMotionPath">`.
- `src/public/styles/app.css` in `origin/production` (`[5-0]`) - shared geometry for
  `.hero-wordmark` and `.hero-wordmark-glow-layer`, plus `mix-blend-mode: screen` and
  `drop-shadow`.
- `docs/prompts-output/[5-0]hero-wordmark-glow-trace-report.md` in `origin/production` - rationale,
  verification notes, and risks.

## 5. Files In This Example

- `html/svg-path-glow-trace.html`
- `css/svg-path-glow-trace.css`
- `javascript/svg-path-glow-trace.js`

## 6. Integration Steps For Another Project

1. Extract the exact path to trace from the source SVG. Keep its `d` value and `viewBox` together.
2. Add an inline SVG overlay with the same aspect ratio, position, and sizing as the visible shape.
3. Put the extracted path inside the overlay as an invisible motion path.
4. Move one radial-gradient circle with `<animateMotion>` for a single dot, or generate several
   staggered circles for a comet-like trail.
5. Keep the overlay decorative: `aria-hidden="true"`, `focusable="false"`, `pointer-events: none`.
6. Hide or freeze the animation under `prefers-reduced-motion: reduce`.

## 7. Accessibility Checklist

- The glow is decorative and not announced by assistive tech.
- The visible logo/icon keeps its own accessible name if it conveys identity.
- The animation is not the only indication of state or progress.
- Reduced-motion users do not get path-tracing motion.

## 8. Responsiveness Checklist

- The overlay and visible SVG/share target use the same `viewBox` ratio.
- Use `aspect-ratio` and one shared size rule for both visible layer and overlay.
- Avoid hand-positioning the motion path independently from the visible shape.
- Verify at mobile and desktop widths; path coordinates can look correct at one size and drift at
  another if the boxes diverge.

## 9. Reduced-Motion Behavior

Preferred behavior: hide the glow overlay. The base logo/icon remains visible and unchanged.

Alternative for non-brand decorative art: keep a static soft halo without `animateMotion`.

## 10. Constants/i18n/token Adaptation Notes

Use design tokens for glow color, opacity, blur, size, duration, trail count, and delay. Copy and
visible business assets belong in the target project's constants/config/i18n layer. This pattern
only owns the motion technique.

## 11. Common Failure Modes

- Trying to trace a CSS mask or background image directly. The geometry is not addressable; add an
  inline SVG overlay with the copied path.
- Putting the glow SVG inside an element that has the logo mask. It inherits/clips the glow and the
  trace disappears.
- Letting the overlay box differ from the source SVG `viewBox`, which silently misaligns the path.
- Using too few trail samples with long delays, creating separate visible dots instead of one
  continuous glow.
- Forgetting that SMIL `<animateMotion>` support is good in modern browsers but still best treated
  as decorative. The fallback should be benign.

## 12. Minimal Verification Checklist

- The glow follows the intended path, not a nearby bounding box.
- The effect does not cause layout shift.
- The base SVG/logo remains visible if the animation does not run.
- Reduced-motion mode removes motion.
- Console has no SVG/animation errors.
