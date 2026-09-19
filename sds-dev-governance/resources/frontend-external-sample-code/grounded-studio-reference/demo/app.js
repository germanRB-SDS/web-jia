(function () {
  'use strict';
  var header = document.querySelector('.masthead');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('#nav');
  if (!header || !toggle || !nav) return;

  function syncHeader() {
    header.classList.toggle('is-lifted', window.scrollY > 24);
  }
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', function (event) {
    if (!event.target.closest('a')) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
})();
