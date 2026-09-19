function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function openFrostedAlert({ title, message, acceptLabel = 'Aceptar' }) {
  const previousFocus = document.activeElement;
  const modal = document.createElement('div');
  modal.className = 'frosted-modal-backdrop';
  modal.innerHTML = `
    <section class="frosted-modal-panel" role="dialog" aria-modal="true" aria-labelledby="frosted-alert-title" tabindex="-1">
      <div class="frosted-modal-body">
        <h2 id="frosted-alert-title">${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
      </div>
      <div class="frosted-modal-actions">
        <button class="frosted-modal-button" type="button" data-alert-accept>${escapeHtml(acceptLabel)}</button>
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
    if (event.key === 'Escape') close();
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  modal.querySelector('[data-alert-accept]')?.addEventListener('click', close);
  document.addEventListener('keydown', onKeydown);
  document.body.append(modal);
  modal.querySelector('[data-alert-accept]')?.focus();
  return { close, element: modal };
}
