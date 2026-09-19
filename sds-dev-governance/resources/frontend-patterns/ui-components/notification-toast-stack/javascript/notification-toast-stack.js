export const DEFAULT_NOTIFICATION_DURATION_MS = 3500;
const EXIT_DURATION_MS = 180;
const SVG_NS = 'http://www.w3.org/2000/svg';

const ICON_PATHS = {
  info: ['M12 11v5', 'M12 8h.01'],
  success: ['m8 12 2.6 2.6L16.5 9'],
  error: ['m9 9 6 6', 'm15 9-6 6']
};

function getStack(doc, label) {
  let stack = doc.querySelector('[data-notification-stack]');
  if (!stack) {
    stack = doc.createElement('section');
    stack.className = 'notification-stack';
    stack.dataset.notificationStack = '';
    doc.body.append(stack);
  }
  stack.setAttribute('aria-label', label);
  return stack;
}

function createIcon(doc, type) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const circle = doc.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '9');
  svg.append(circle);
  for (const pathData of ICON_PATHS[type]) {
    const path = doc.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    svg.append(path);
  }
  return svg;
}

export function createNotification({
  type = 'info',
  title,
  message,
  dismissLabel,
  stackLabel,
  durationMs = DEFAULT_NOTIFICATION_DURATION_MS
}, { doc = document, win = window } = {}) {
  const safeType = Object.hasOwn(ICON_PATHS, type) ? type : 'info';
  const toast = doc.createElement('article');
  toast.className = `notification-toast notification-toast--${safeType}`;
  toast.setAttribute('role', safeType === 'error' ? 'alert' : 'status');
  toast.setAttribute('aria-atomic', 'true');

  const button = doc.createElement('button');
  button.type = 'button';
  button.className = 'notification-toast__button';
  button.setAttribute('aria-label', [title, message, dismissLabel].filter(Boolean).join('. '));

  const icon = doc.createElement('span');
  icon.className = 'notification-toast__icon';
  icon.append(createIcon(doc, safeType));
  const content = doc.createElement('span');
  content.className = 'notification-toast__content';
  const heading = doc.createElement('strong');
  heading.className = 'notification-toast__title';
  heading.textContent = title;
  const body = doc.createElement('span');
  body.className = 'notification-toast__message';
  body.textContent = message;
  content.append(heading, body);
  button.append(icon, content);
  toast.append(button);
  getStack(doc, stackLabel).append(toast);

  let removalTimer;
  let exitTimer;
  const dismiss = (immediate = false) => {
    win.clearTimeout(removalTimer);
    win.clearTimeout(exitTimer);
    if (immediate) {
      toast.classList.add('is-dismissed-immediately');
      toast.remove();
      return;
    }
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    exitTimer = win.setTimeout(() => toast.remove(), EXIT_DURATION_MS);
  };

  button.addEventListener('click', () => dismiss(true), { once: true });
  const nextFrame = win.requestAnimationFrame?.bind(win)
    || ((callback) => win.setTimeout(callback, 0));
  nextFrame(() => toast.classList.add('is-visible'));
  removalTimer = win.setTimeout(() => dismiss(false), durationMs);
  return { element: toast, dismiss: () => dismiss(true) };
}

// Demo-only copy. Production consumers must inject localized copy from their own configuration.
const demoMessages = {
  info: ['Information', 'The operation is still running.'],
  success: ['Done', 'The changes were saved.'],
  error: ['Error: action not completed', 'Review the data and try again.']
};

document.querySelectorAll('[data-notification-demo]').forEach((button) => {
  button.addEventListener('click', () => {
    const type = button.dataset.notificationDemo;
    const [title, message] = demoMessages[type];
    createNotification({
      type,
      title,
      message,
      dismissLabel: 'Dismiss notification',
      stackLabel: 'Notifications'
    });
  });
});
