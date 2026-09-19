# Frosted Confirm Modal

## 1. What This Pattern Is

A two-action confirmation dialog with frosted backdrop, primary/secondary actions, optional danger
styling, and non-dismissible mode for high-risk actions.

## 2. When To Use It

Use it before destructive, retroactive, or irreversible actions.

## 3. When Not To Use It

Do not use it for simple informational alerts or for complex forms. Use a real form dialog/drawer
when the user must edit structured data.

## 4. Source Anchors In Teragenda

- `src/public/scripts/modal.js:97` — `openConfirm`.
- `docs/prompts/[12-0-alpha]admin-agenda-holidays-panel-range-and-solid-bg.md:176` — frosted
  confirm requirements.
- `src/public/styles/app.css:3066` — frosted `.modal-backdrop`.

## 5. Files In This Example

- `html/frosted-confirm-modal.html`
- `css/frosted-confirm-modal.css`
- `javascript/frosted-confirm-modal.js`

## 6. Integration Steps For Another Project

1. Put confirm/cancel labels in copy/i18n.
2. Use non-dismissible mode for destructive actions.
3. Keep the secondary action first in DOM if that matches the local design system.
4. Run the action only from the primary button callback.

## 7. Accessibility Checklist

- Dialog title is labelled.
- Primary button receives initial focus only when intentional.
- Escape/backdrop close behavior is disabled for non-dismissible destructive actions.
- Focus returns to the trigger on close.

## 8. Responsiveness Checklist

- Keep max panel width around 540-560px.
- Keep action buttons wrapping or stacking on narrow screens.

## 9. Reduced-Motion Behavior

Disable entrance animations under `prefers-reduced-motion: reduce`.

## 10. Constants/i18n/token Adaptation Notes

Example labels are `Aceptar` and `Cancelar`. In production, read both from the target project's copy
catalog. Danger color must come from semantic tokens.

## 11. Common Failure Modes

- Treating cancel as a successful action.
- Allowing outside click to dismiss destructive confirmation.
- Triggering the action before the user confirms.

## 12. Minimal Verification Checklist

- Confirm calls the supplied callback exactly once.
- Cancel closes without side effects.
- Non-dismissible mode ignores Escape and backdrop click.
