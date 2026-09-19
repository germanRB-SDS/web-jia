function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function openFrostedConfirm({
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  danger = false,
  dismissible = false,
  onConfirm
}) {
  const previousFocus = document.activeElement;
  const modal = document.createElement('div');
  modal.className = 'confirm-backdrop';
  modal.innerHTML = `
    <section class="confirm-panel" role="dialog" aria-modal="true" aria-labelledby="confirm-title" tabindex="-1">
      <div class="confirm-body">
        <h2 id="confirm-title">${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
      </div>
      <div class="confirm-actions">
        <button class="confirm-button" type="button" data-confirm-cancel>${escapeHtml(cancelLabel)}</button>
        <button class="confirm-button ${danger ? 'danger' : 'primary'}" type="button" data-confirm-accept>${escapeHtml(confirmLabel)}</button>
      </div>
    </section>`;

  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKeydown);
    modal.remove();
    previousFocus?.focus?.();
  }
  function onKeydown(event) {
    if (dismissible && event.key === 'Escape') close();
  }

  modal.addEventListener('click', (event) => {
    if (dismissible && event.target === modal) close();
  });
  modal.querySelector('[data-confirm-cancel]')?.addEventListener('click', close);
  modal.querySelector('[data-confirm-accept]')?.addEventListener('click', async () => {
    await onConfirm?.();
    close();
  });
  document.addEventListener('keydown', onKeydown);
  document.body.append(modal);
  modal.querySelector('[data-confirm-accept]')?.focus();
  return { close, element: modal };
}
