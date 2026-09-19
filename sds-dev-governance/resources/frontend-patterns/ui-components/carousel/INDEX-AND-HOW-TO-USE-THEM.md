# Carousel Component

## 1. What This Pattern Is

A responsive carousel component with count-based controls, current-index state, keyboard support,
fallback handling, and reduced-motion support.

## 2. When To Use It

Use it for a finite set of images or cards where the user can browse one active item at a time.

## 3. When Not To Use It

Do not use it for unrelated selections such as worker choice, product filtering, or anything where
changing one domain concept would silently change another.

## 4. Source Anchors In Teragenda

- `src/public/scripts/booking.js:97` — public booking image navigation.
- `src/public/scripts/businessImages.js:159` — admin business-images 3D fan carousel.
- `src/public/styles/app.css:609` — 3D carousel CSS.
- `src/public/styles/app.css:773` — frosted carousel arrow controls.

## 5. Files In This Example

- `html/carousel.html`
- `css/carousel.css`
- `javascript/carousel.js`

## 6. Integration Steps For Another Project

1. Feed items from a project constants/media layer or API DTO.
2. Validate image URLs before assigning `img.src` when URLs are user-provided.
3. Hide controls when item count is less than two.
4. Keep carousel state independent from unrelated form state.

## 7. Accessibility Checklist

- Use a labelled region.
- Active image has meaningful alt text when it conveys content.
- Offscreen or inactive slides are not keyboard traps.
- Controls have accessible names.

## 8. Responsiveness Checklist

- Use a stable aspect ratio.
- Avoid layout shift when images load or fail.
- Keep controls tappable.

## 9. Reduced-Motion Behavior

Flatten transform-heavy transitions under `prefers-reduced-motion: reduce`.

## 10. Constants/i18n/token Adaptation Notes

Image sources and labels should come from constants or API data. Button labels should come from
copy/i18n.

## 11. Common Failure Modes

- Rebuilding the whole carousel on each navigation when only roles/state should update.
- Rendering arrows with one image.
- Letting broken images show native broken-image icons.
- Coupling carousel state to worker/service selection.

## 12. Minimal Verification Checklist

- One item: no navigation controls.
- Two or more items: previous/next cycles.
- Keyboard left/right works when focus is inside the carousel.
- Broken image fallback renders.
