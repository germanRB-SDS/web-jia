const STORAGE_KEY = 'example.sortableCardOrder.v1';
const CARD_SELECTOR = '.sortable-card[data-card-id]';

function readSavedOrder() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return null;
    return [...new Set(parsed.filter((id) => typeof id === 'string' && id))];
  } catch {
    return null;
  }
}

function restoreOrder(container) {
  const saved = readSavedOrder();
  if (!saved?.length) return;
  const cards = Array.from(container.querySelectorAll(CARD_SELECTOR));
  const byId = new Map(cards.map((card) => [card.dataset.cardId, card]));
  const ordered = saved.filter((id) => byId.has(id)).map((id) => byId.get(id));
  const rest = cards.filter((card) => !ordered.includes(card));
  for (const card of [...ordered, ...rest]) container.appendChild(card);
}

function saveOrder(container) {
  const order = Array.from(container.querySelectorAll(CARD_SELECTOR)).map((card) => card.dataset.cardId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* Sorting still works for this session. */
  }
}

export async function initDragRelocate(container) {
  restoreOrder(container);
  let Sortable;
  try {
    ({ default: Sortable } = await import('./sortable.esm.js'));
  } catch {
    return null;
  }
  if (container.__sortableCards) {
    container.__sortableCards.destroy();
    container.__sortableCards = null;
  }
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  container.__sortableCards = new Sortable(container, {
    draggable: CARD_SELECTOR,
    handle: '[data-drag-handle]',
    filter: 'input, select, textarea, button:not([data-drag-handle]), a, [contenteditable]',
    preventOnFilter: false,
    animation: reducedMotion ? 0 : 150,
    delay: 200,
    delayOnTouchOnly: true,
    touchStartThreshold: 5,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    onEnd: () => saveOrder(container)
  });
  return container.__sortableCards;
}

document.querySelectorAll('[data-sortable-cards]').forEach((container) => initDragRelocate(container));
