export function initCarouselMotion(root) {
  const slides = Array.from(root.querySelectorAll('[data-motion-slide]'));
  let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-current')));

  function render(previousIndex, direction) {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-current', slideIndex === index);
      slide.classList.toggle('is-exiting-previous', slideIndex === previousIndex && direction < 0);
      slide.classList.toggle('is-exiting-next', slideIndex === previousIndex && direction > 0);
      slide.toggleAttribute('aria-hidden', slideIndex !== index);
    });
  }

  function move(direction) {
    if (slides.length < 2) return;
    const previousIndex = index;
    index = (index + direction + slides.length) % slides.length;
    render(previousIndex, direction);
  }

  root.querySelector('[data-motion-previous]')?.addEventListener('click', () => move(-1));
  root.querySelector('[data-motion-next]')?.addEventListener('click', () => move(1));
  render(-1, 0);
  return { move, get index() { return index; } };
}

document.querySelectorAll('[data-motion-carousel]').forEach((root) => initCarouselMotion(root));
