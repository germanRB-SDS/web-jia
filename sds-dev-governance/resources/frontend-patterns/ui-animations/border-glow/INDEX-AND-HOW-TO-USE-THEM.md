# Border Glow

## 1. What This Pattern Is

A restrained border glow animation that highlights a surface on hover/focus without filling or
tinting its content.

## 2. When To Use It

Use it for premium cards, docks, panels, or controls that need a subtle interactive affordance.

## 3. When Not To Use It

Do not use it on dense tables, destructive buttons, long forms, or surfaces where the glow hurts
readability.

## 4. Source Anchors In Teragenda

- `src/public/styles/app.css:1467` — pointer-aware `[data-glow-card]` spotlight border.
- `src/public/scripts/animations.js:460` — pointer coordinate updates for glow cards.
- `src/public/styles/app.css:3357` — floating dock conic-gradient ring.
- `docs/prompts/[01-1]glow-al-dock.md:17` — requirement to keep the glass interior unchanged.

## 5. Files In This Example

- `html/border-glow.html`
- `css/border-glow.css`
- `javascript/border-glow.js`

## 6. Integration Steps For Another Project

1. Add `data-glow-card` or a project-specific equivalent to target surfaces.
2. Keep the surface `position: relative` and `border-radius`.
3. Use pseudo-elements for the border layer.
4. Keep content above decorative layers.

## 7. Accessibility Checklist

- Glow is not the only focus indicator.
- Contrast remains valid with the glow active.
- Decorative layers use `pointer-events: none`.

## 8. Responsiveness Checklist

- Glow radius works on small cards and large panels.
- Effects do not create horizontal scroll.

## 9. Reduced-Motion Behavior

Disable animated angle shifts and transitions under reduced motion.

## 10. Constants/i18n/token Adaptation Notes

Use project color tokens for glow colors. Raw hex values only belong in a palette definition.

## 11. Common Failure Modes

- Placing a conic gradient under frosted glass so the whole interior gets tinted.
- Allowing pseudo-elements to block clicks.
- Missing `isolation` or z-index layering.

## 12. Minimal Verification Checklist

- Hover/focus shows border glow only.
- Content remains readable.
- Reduced-motion mode is calm.
