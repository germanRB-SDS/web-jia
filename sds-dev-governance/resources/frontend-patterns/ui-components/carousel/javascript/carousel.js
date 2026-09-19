export function createCarousel(root) {
  const slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
  const previous = root.querySelector('[data-carousel-previous]');
  const next = root.querySelector('[data-carousel-next]');
  let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));

  function render() {
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle('is-active', active);
      slide.toggleAttribute('aria-hidden', !active);
    });
    const hideNav = slides.length < 2;
    previous.hidden = hideNav;
    next.hidden = hideNav;
  }

  function move(delta) {
    if (slides.length < 2) return;
    index = (index + delta + slides.length) % slides.length;
    render();
  }

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  slides.forEach((slide) => {
    slide.querySelector('img')?.addEventListener('error', (event) => {
      const fallback = document.createElement('div');
      fallback.className = 'portable-carousel-fallback';
      fallback.textContent = 'Image unavailable';
      event.currentTarget.replaceWith(fallback);
    });
  });
  root.tabIndex ||= 0;
  render();
  return { move, get index() { return index; } };
}

document.querySelectorAll('[data-carousel]').forEach((root) => createCarousel(root));
