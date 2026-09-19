export function initGlowCards(root = document) {
  const cards = Array.from(root.querySelectorAll('[data-glow-card]'));
  function update(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xp = rect.width ? x / rect.width : 0;
    event.currentTarget.style.setProperty('--x', x.toFixed(1));
    event.currentTarget.style.setProperty('--y', y.toFixed(1));
    event.currentTarget.style.setProperty('--xp', xp.toFixed(3));
    event.currentTarget.style.setProperty('--glow-hue', String(210 + xp * 200));
  }
  function clear(event) {
    for (const prop of ['--x', '--y', '--xp', '--glow-hue']) event.currentTarget.style.removeProperty(prop);
  }
  for (const card of cards) {
    card.addEventListener('pointermove', update);
    card.addEventListener('pointerleave', clear);
  }
}

initGlowCards();
