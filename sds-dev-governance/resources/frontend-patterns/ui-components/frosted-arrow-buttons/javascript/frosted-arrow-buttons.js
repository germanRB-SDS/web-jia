export function wireFrostedArrowButtons(root, { count, initialIndex = 0, onChange } = {}) {
  let index = initialIndex;
  const previous = root.querySelector('[data-arrow-previous]');
  const next = root.querySelector('[data-arrow-next]');
  const status = root.querySelector('[data-arrow-status]');

  function render() {
    const disabled = count < 2;
    if (previous) previous.disabled = disabled;
    if (next) next.disabled = disabled;
    if (status) status.textContent = `${index + 1} / ${Math.max(count, 1)}`;
    onChange?.(index);
  }

  function move(delta) {
    if (count < 2) return;
    index = (index + delta + count) % count;
    render();
  }

  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  render();
  return { move, get index() { return index; } };
}

const demo = document.querySelector('[data-arrow-demo]');
if (demo) wireFrostedArrowButtons(demo, { count: 3 });
