(function () {
  'use strict';

  var selfUrl = document.currentScript && document.currentScript.src;

  function preferencesAllow() {
    if (!selfUrl) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (navigator.connection && navigator.connection.saveData) return false;
    return true;
  }

  function hasWebGL() {
    try {
      var probe = document.createElement('canvas');
      var gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) return false;
      var lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      return true;
    } catch (error) {
      return false;
    }
  }

  function whenIdle(callback) {
    function schedule() {
      if ('requestIdleCallback' in window) window.requestIdleCallback(callback, { timeout: 2500 });
      else window.setTimeout(callback, 320);
    }
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
  }

  function boot() {
    var hero = document.querySelector('.world-hero');
    var canvas = hero && hero.querySelector('.world-hero__canvas');
    if (!hero || !canvas || !preferencesAllow()) return;

    var controller = null;
    var visible = !document.hidden;
    var onScreen = true;
    var observer = null;
    var wipeFrame = 0;
    var disposed = false;

    function sync() {
      if (!controller) return;
      if (visible && onScreen) controller.start();
      else controller.stop();
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        onScreen = entries.some(function (entry) { return entry.isIntersecting; });
        sync();
      }, { rootMargin: '10% 0px' });
    }

    function onVisibilityChange() {
      visible = !document.hidden;
      sync();
    }
    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

    whenIdle(function () {
      if (disposed || !hasWebGL()) return;
      import(new URL('./hero-scene.js', selfUrl).href)
        .then(function (module) {
          if (disposed) return;
          controller = module.createHeroScene(canvas, {
            onFirstFrame: function () {
              if (disposed) return;
              hero.classList.add('is-enhanced');
              var start = performance.now();
              var duration = 1450;
              function wipe(now) {
                var linear = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - linear, 2.2);
                hero.style.setProperty('--hero-wipe', (eased * 100).toFixed(2) + '%');
                if (linear < 1) wipeFrame = window.requestAnimationFrame(wipe);
                else {
                  wipeFrame = 0;
                  hero.classList.add('is-swept');
                  hero.style.removeProperty('--hero-wipe');
                }
              }
              wipeFrame = window.requestAnimationFrame(wipe);
            }
          });
          if (observer) observer.observe(hero);
          sync();
        })
        .catch(function () {
          hero.classList.remove('is-enhanced', 'is-swept');
          hero.style.removeProperty('--hero-wipe');
        });
    });

    function dispose() {
      if (disposed) return;
      disposed = true;
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (wipeFrame) window.cancelAnimationFrame(wipeFrame);
      wipeFrame = 0;
      if (controller) controller.dispose();
      controller = null;
    }
    window.addEventListener('pagehide', dispose, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
