# Drag Relocate Button

## 1. What This Pattern Is

A dedicated drag handle button that lets users reorder existing cards/sections using SortableJS
without making the whole card draggable.

## 2. When To Use It

Use it for reordering persistent DOM sections that contain forms, tables, or interactive controls.

## 3. When Not To Use It

Do not use it when card order is business data unless the backend contract explicitly persists that
data. Do not attach drag start to the full card.

## 4. Source Anchors In Teragenda

- `src/server/render.js:40` — `data-config-card-drag-handle`.
- `src/public/scripts/config.js:40` — localStorage key and card selector.
- `src/public/scripts/config.js:87` — SortableJS initialization.
- `src/public/styles/app.css:428` — drag handle styles.
- `docs/prompts/[13-2]drag-and-reorder-sections-on-settings.md:45` — handle-only decision.

## 5. Files In This Example

- `html/drag-relocate-button.html`
- `css/drag-relocate-button.css`
- `javascript/drag-relocate-button.js`

## 6. Integration Steps For Another Project

1. Add one handle button per sortable card.
2. Restore order before wiring card-specific controllers.
3. Initialize SortableJS with `handle`.
4. Persist only the order IDs, never form data.
5. Move existing DOM nodes; do not clone cards.

## 7. Accessibility Checklist

- Handle is a real button with a clear accessible name.
- Card controls remain focusable and clickable.
- Dragging is progressive enhancement; page still works without SortableJS.

## 8. Responsiveness Checklist

- Touch devices use delay/threshold settings so scroll is not hijacked.
- Handle has a minimum 35-44px target.

## 9. Reduced-Motion Behavior

Set SortableJS `animation` to `0` when reduced motion is active.

## 10. Constants/i18n/token Adaptation Notes

The handle aria label belongs in copy/i18n. The storage key must be project-specific and versioned.

## 11. Common Failure Modes

- Starting drag from inputs, selects, buttons, or color pickers.
- Duplicating Sortable instances after rerender.
- Recreating cards and losing unsaved form state.
- Treating localStorage order as server data.

## 12. Minimal Verification Checklist

- Dragging preserves unsaved input values.
- Inputs and buttons do not start drag.
- Refresh restores saved order.
- Corrupted localStorage is ignored safely.
