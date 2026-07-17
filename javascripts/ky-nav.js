;(function () {
  function initMobileNav(containerSel, openClass, sideEffectEl, sideEffectClass) {
    var container = document.querySelector(containerSel);
    if (!container) return;
    var btn = container.querySelector('.ky-hamburger');
    if (!btn) return;
    var side = sideEffectEl ? document.querySelector(sideEffectEl) : null;

    function close() {
      container.classList.remove(openClass);
      btn.setAttribute('aria-expanded', 'false');
      var icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
      if (side && sideEffectClass) side.classList.remove(sideEffectClass);
    }

    btn.addEventListener('click', function () {
      var open = container.classList.toggle(openClass);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = btn.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      if (side && sideEffectClass) side.classList.toggle(sideEffectClass, open);
    });

    document.addEventListener('click', function (e) {
      if (container.classList.contains(openClass) && !container.contains(e.target)) {
        close();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav('.ky-inner-nav', 'ky-inner-nav--open');
    // Pass .ky-hero so clip-path can be lifted while the panel is open
    initMobileNav('.ky-nav', 'ky-nav--open', '.ky-hero', 'ky-hero--nav-open');
  });
})();
