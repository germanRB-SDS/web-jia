# Frosted Alert Modal

## 1. What This Pattern Is

A one-action modal for alerts and acknowledgements, using a frosted glass backdrop and a compact
surface panel.

## 2. When To Use It

Use it for informational messages that require acknowledgement but no branching decision.

## 3. When Not To Use It

Do not use it for destructive actions, save confirmations, or flows that require cancel/confirm
choice. Use `frosted-confirm-modal/` instead.

## 4. Source Anchors In Teragenda

- `src/public/scripts/modal.js:22` — generic `openModal`.
- `src/public/scripts/modal.js:89` — `openAlert`.
- `src/public/styles/app.css:3066` — `.modal-backdrop`.
- `src/public/styles/app.css:3079` — `.modal-panel`.

## 5. Files In This Example

- `html/frosted-alert-modal.html`
- `css/frosted-alert-modal.css`
- `javascript/frosted-alert-modal.js`

## 6. Integration Steps For Another Project

1. Move labels and messages into the target project's copy/i18n catalog.
2. Copy the CSS tokens or map them to existing project tokens.
3. Import `openFrostedAlert` from the JavaScript example.
4. Call it from a real user action and verify focus returns to the trigger.

## 7. Accessibility Checklist

- Dialog uses `role="dialog"` and `aria-modal="true"`.
- Title is connected through `aria-labelledby`.
- Initial focus enters the dialog.
- Escape and backdrop click close the alert.
- Focus returns to the previous active element.

## 8. Responsiveness Checklist

- Panel width is capped with `width: min(560px, 100%)`.
- Backdrop has viewport padding.
- Body scrolls if content is taller than the viewport.

## 9. Reduced-Motion Behavior

Disable modal entrance animation under `prefers-reduced-motion: reduce`.

## 10. Constants/i18n/token Adaptation Notes

The default label `Aceptar` is an example. Replace it with a project copy key. Map the CSS variables
to the target design system.

## 11. Common Failure Modes

- Hardcoding business-specific copy inside JavaScript.
- Forgetting to remove the keydown listener.
- Not restoring focus after close.
- Letting long body text overflow off-screen.

## 12. Minimal Verification Checklist

- Open and close by button, Escape, and backdrop click.
- Tab order remains inside the modal while it is open or documented as a target-project hook.
- Mobile viewport has no horizontal overflow.
