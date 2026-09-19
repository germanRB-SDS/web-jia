# Carousel Motion

## 1. What This Pattern Is

An animation layer for carousel transitions: direction-aware slide movement, optional fade, and a
reduced-motion fallback.

## 2. When To Use It

Use it when a carousel already has correct state and controls, and needs polished motion.

## 3. When Not To Use It

Do not use motion to hide broken state management. Fix the carousel logic first.

## 4. Source Anchors In Teragenda

- `src/public/styles/app.css:609` — 3D fan carousel transition variables.
- `src/public/scripts/businessImages.js:178` — navigation changes active item.
- `src/public/scripts/businessImages.js:187` — roles are reassigned on persistent nodes.

## 5. Files In This Example

- `html/carousel-motion.html`
- `css/carousel-motion.css`
- `javascript/carousel-motion.js`

## 6. Integration Steps For Another Project

1. Keep stable slide nodes.
2. Toggle state attributes or classes for current/previous/next.
3. Use CSS transforms for movement.
4. Disable transform-heavy effects under reduced motion.

## 7. Accessibility Checklist

- Motion does not change focus unexpectedly.
- Inactive slides are not keyboard traps.
- Controls remain accessible names, not only icons.

## 8. Responsiveness Checklist

- Motion distance is container-relative.
- Slides keep stable dimensions through `aspect-ratio`.

## 9. Reduced-Motion Behavior

Under reduced motion, transition duration becomes near-zero and transforms flatten.

## 10. Constants/i18n/token Adaptation Notes

Motion timing can be stored in CSS variables. Copy remains in the carousel component, not this
animation layer.

## 11. Common Failure Modes

- Recreating DOM nodes and losing transitions.
- Moving layout boxes instead of transform-only layers.
- Excessive parallax on small screens.

## 12. Minimal Verification Checklist

- Navigate forward and backward.
- Verify no layout shift.
- Verify reduced-motion mode.
