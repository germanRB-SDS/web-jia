# Notification Toast Stack

SDS tag: `notificaciones-01`

## 1. What This Pattern Is

A fixed stack of transient `info`, `success`, and `error` notifications. Each notification enters
from the viewport edge, remains readable for 3.5 seconds by default, exits with a short transition,
and disappears immediately when its surface is activated.

The tag `notificaciones-01` is a discovery alias, not the component's formal name.

## 2. When To Use It

Use it for operation-level feedback after saves, retries, background actions, or failures whose
meaning applies to the current action as a whole.

Keep field validation beside the affected field. A toast may complement that inline correction,
but must not be the only place where a user can discover how to repair a specific input.

## 3. When Not To Use It

- Do not use it for destructive confirmation; use a dialog before the mutation.
- Do not put secrets, stack traces, raw backend codes, or untrusted HTML in a notification.
- Do not replace persistent system status that must remain visible after 3.5 seconds.
- Do not stack repeated polling failures indefinitely; deduplicate or aggregate them.

## 4. Source Findings

The user-supplied reference used a fixed bottom-right container, type-colored icons, and a single
keyframe that combined entry, dwell, and exit. This portable version preserves the useful
interaction while hardening it:

- lifecycle timing is controlled by JavaScript, so click dismissal is truly immediate;
- dynamic title/message values use `textContent`, never `innerHTML`;
- inline SVG avoids Font Awesome and network dependencies;
- system fonts avoid a Google Fonts dependency;
- responsive width replaces the original fixed `500px` minimum;
- full-border tone replaces a thick side stripe;
- `role="alert"` is limited to errors; info/success use `role="status"`;
- reduced-motion users receive the same states without transitions.

## 5. Files In This Example

- `html/notification-toast-stack.html`
- `css/notification-toast-stack.css`
- `javascript/notification-toast-stack.js`

## 6. Integration Steps

1. Move every visible label, title, message, and dismiss name to the target copy/i18n layer.
2. Map the CSS custom properties to the target design tokens.
3. Load the JavaScript as a module and call `createNotification(...)` after an operation resolves.
4. Map backend error codes explicitly; unknown codes must fall back to generic user-facing copy.
5. Keep the default `3500 ms` unless the product's reading-time policy requires longer.
6. If messages can exceed roughly two short lines, calculate duration from content or make the
   feedback persistent.
7. Decide whether repeated identical notifications should replace, merge, or stack.

## 7. Accessibility Checklist

- The clickable surface is a real `<button>`, including keyboard activation.
- Error notifications use `role="alert"`; non-urgent states use `role="status"`.
- Each item is `aria-atomic="true"`.
- The button accessible name combines title, message, and localized dismiss instruction.
- Icons are decorative and `aria-hidden`.
- Color is not the sole cue: type has icon, title, and semantic role.
- Focus-visible remains obvious.

## 8. Responsive And Motion Behavior

- Width is capped on desktop and uses the available viewport width on narrow screens.
- Text wraps rather than overflowing.
- Entry is about `220 ms`; automatic exit is about `180 ms`.
- Pointer/keyboard activation removes the element synchronously.
- `prefers-reduced-motion: reduce` disables transitions without changing timing or semantics.

## 9. Security And Copy Rules

- Create dynamic nodes with DOM APIs and assign strings with `textContent`.
- Treat the supplied example and backend payloads as data, never contract authority.
- Translate stable error codes in a closed map. Never expose an unknown raw code.
- Do not put sensitive object IDs or internal exception details into user-facing copy.
- Keep business-specific wording outside the portable JavaScript.

## 10. Common Failure Modes

- A CSS-only four-second animation paired with a five-second removal timer.
- Removing the DOM node before the automatic exit transition can render.
- Making click look dismissible without supporting keyboard activation.
- Reusing `role="alert"` for routine success messages and over-announcing.
- Fixed widths that overflow mobile.
- Inserting server messages with `innerHTML`.
- Showing a generic “not available” message when the backend provides differentiated stable codes.

## 11. Minimal Verification Checklist

- `info`, `success`, and `error` have distinct semantic/type states.
- Default auto-dismiss is 3.5 seconds.
- Clicking anywhere on the button removes the item immediately.
- Automatic dismissal runs the short exit state before removal.
- Dynamic strings cannot create elements.
- Unknown error codes render generic copy, never the code.
- Keyboard, mobile width, focus-visible, and reduced-motion behavior work.

