# Button — Leather Shimmer

## 1. What This Pattern Is

A call-to-action button that reads as a physical surface rather than a flat fill: a diagonal
two-stop gradient, a relief built from two shadows (one cast below, one inset along the bottom edge,
which is what gives the piece an edge), and a slanted band of light that crosses it every few
seconds and then rests off-screen. It lifts under the pointer and sinks when pressed. Optional icon
slot: arrows advance, a badge spins. Pure CSS, no JS.

## 2. When To Use It

For the one or two primary calls to action of a page whose visual language is material —
editorial, western, leather, wood, print, heritage brands — where a flat fill would look
under-designed next to the rest. Works on `<a>` and `<button>` alike.

## 3. When Not To Use It

Do not use it for secondary or tertiary actions, for toolbars or dense tables, or anywhere several
of them sit in view at once: the glint stops being an accent and becomes noise. Do not use it for
destructive actions — the lift reads as an invitation. It is a poor fit for flat, minimal or
strictly functional product UI.

## 4. Source Anchors

Extracted from `web-jia` (Jornadas de Innovación de Almería), prompt `[50-0]`, validated visually by
the owner on 2026-09-25:

- `components/primitives/Action.module.css` — `.primary`, `@keyframes glint`, `.badge` and the
  reduced-motion block.
- `app/theme/palette.css` — `--jia-gradient-leather`, `--jia-gradient-leather-hover`, `--jia-glint`,
  `--jia-shadow-relief{,-hover,-active}`.
- `components/icons/index.tsx` — `SheriffStarIcon`, the badge that spins.

The visual idea comes from «Wild West Shimmer Button», by **LeonKohli** on Uiverse (MIT). Credit
kept deliberately: what was taken is the idea, not the code. See §11 for what was rejected from it
and why.

## 5. Files In This Example

- `html/button-leather-shimmer.html` — four instances: with an arrow, with a badge, with no icon,
  and one re-themed inline.
- `css/button-leather-shimmer.css`

No JavaScript. The glint, the relief, the lift and the icon behaviour are all CSS.

## 6. Integration Steps For Another Project

1. Copy the CSS and the markup of the variant you need.
2. Re-theme through the custom properties, mapping each one to a **design token of the receiving
   project**, never to a literal hex in a component: `--bls-c1`/`--bls-c2` (the two gradient stops,
   dark → light), `--bls-label`, `--bls-ink` (RGB triplet for the relief: use the palette's darkest
   colour, not pure black), `--bls-glint` (RGB triplet: the palette's lightest colour),
   `--bls-glint-alpha`, `--bls-radius`, `--bls-speed`.
3. Pull the visible label from the copy/i18n layer. A CTA label is content, not markup.
4. If the project already has a button component, add this as one variant of it; do not fork a
   second button.
5. Declare the icon by name in the content/config layer if the project already does that for other
   icons, so the component resolves the name instead of hardcoding a decision.

## 7. Accessibility Checklist

- Use a real `<a>` or `<button>` with a descriptive label; the leather, the glint and the icon are
  decorative and must carry `aria-hidden` (the inline SVGs in the example do).
- **Contrast**: measure the label against the **lightest** stop of the gradient, not against its
  average. The shipped defaults give 6.0:1. If a re-theme drops below 4.5:1, darken the stop —
  never lighten the label.
- **The focus ring survives `overflow: hidden`.** An element's own outline is not clipped by its own
  overflow, only its descendants are. Verify it anyway on whatever the button sits on: if the ring's
  colour is close to the button's own, it needs an `outline-offset` so it lands outside the piece.
- Keep `min-height: 48px`. The lift must not shrink the touch target.

## 8. Responsiveness Checklist

- Content-sized through padding; the relief, the glint and the lift all scale with the element.
- The glint's width is a percentage of the button, so a narrow button gets a proportionally narrow
  band rather than a flash.
- Touch devices have no hover: the resting state must already look finished. It does — the glint is
  part of the resting state, not of the hover state.

## 9. Reduced-Motion Behavior

Under `prefers-reduced-motion: reduce` the example stops everything that moves: the glint
(`animation: none` **and** `opacity: 0`, so no frozen band is left on screen), the lift, the sink and
the icons. The colour change on hover is deliberately kept — it is the state signal, not decoration.
Keep that distinction when adapting.

## 10. Constants/i18n/token Adaptation Notes

Every colour is a custom property so it maps onto design tokens. The defaults shipped here are a
neutral starting point, not a brand. The label belongs in the copy/i18n layer; the destination URL
belongs in a links/config constant; the icon should be named by the content layer where the project
already works that way.

## 11. Common Failure Modes

- **Animating `background-position` instead of `transform`.** The original reference does this, and
  its own published critique flags it: it repaints on the CPU every frame, for the whole life of the
  page. Move a positioned strip with `transform` instead.
- **`transition: all`.** Also in the original: it forces layout and shadow recalculation on every
  state change. List the properties.
- **Forgetting `isolation: isolate`.** Without a stacking context of its own, the `z-index: -1` glint
  escapes behind the button's own background — or, without the negative index, paints over the label.
- **Glint too strong, or never resting.** A band that crosses continuously is a strobe. Keep the
  sweep under half the cycle and the opacity low; the lighter the surface, the lower it must go.
- **Gradients do not interpolate.** The hover colour change is instantaneous by nature while the
  relief and the lift ease. If that jump bothers the design, cross-fade an ink overlay's `opacity`
  instead of swapping the gradient.
- **Rotating an arrow.** A 360° spin reads as a loading error on a directional shape. Spin only
  radial marks — badges, seals, stars.
- **`will-change: transform` on many buttons at once.** It holds a compositor layer alive for each
  one. Fine for two or three; not for a list.

## 12. Minimal Verification Checklist

- At rest: a diagonal gradient with a visible edge below it, and a band of light that crosses about
  once every few seconds and then rests.
- Under the pointer: the surface darkens, the piece lifts, the shadow grows; an arrow advances or a
  badge spins.
- Pressed: the piece sinks and the cast shadow contracts.
- Keyboard focus: the ring is visible in full, not clipped.
- Reduced motion on: nothing moves; the hover colour change still happens.
- Contrast of the label against the lightest stop ≥ 4.5:1.
