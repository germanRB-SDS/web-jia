# Frosted Arrow Buttons

## 1. What This Pattern Is

Previous/next navigation buttons with a frosted surface, visible or accessible labels, hover/focus
states, disabled state, and touch-safe dimensions.

## 2. When To Use It

Use it for carousel, gallery, wizard, calendar, or step navigation where the control changes local
view state.

## 3. When Not To Use It

Do not use it for destructive actions, form submission, or global route navigation unless the route
semantics are obvious and accessible.

## 4. Source Anchors In Teragenda

- `src/public/styles/app.css:773` — `.business-carousel-nav`.
- `src/server/render.js:415` — booking mobile previous image control.
- `src/server/render.js:418` — booking mobile next image control.
- `src/server/render.js:541` — compact day previous/next buttons.

## 5. Files In This Example

- `html/frosted-arrow-buttons.html`
- `css/frosted-arrow-buttons.css`
- `javascript/frosted-arrow-buttons.js`

## 6. Integration Steps For Another Project

1. Choose icon-only, text+icon, or both.
2. Keep `aria-label` for icon-only buttons.
3. Disable buttons when there is no item to navigate.
4. Wire controls to local state only.

## 7. Accessibility Checklist

- Icon-only buttons have `aria-label`.
- Disabled state uses the native `disabled` attribute.
- Focus visible style is present.
- Minimum target is at least 40px, preferably 44px.

## 8. Responsiveness Checklist

- Controls remain tappable on mobile.
- Text+icon variant wraps or switches to icon-only if space is constrained.

## 9. Reduced-Motion Behavior

Scale/press transitions are disabled or shortened under reduced motion.

## 10. Constants/i18n/token Adaptation Notes

Use copy keys for `Anterior` and `Siguiente`. Keep colors token-based.

## 11. Common Failure Modes

- Rendering controls for a one-item carousel.
- Hiding visible text without adding `aria-label`.
- Coupling carousel arrows to unrelated worker/service selection state.

## 12. Minimal Verification Checklist

- Previous and next update state correctly.
- Disabled controls cannot fire.
- Keyboard focus and screen-reader names are correct.
