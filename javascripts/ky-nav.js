;(function () {
  function initMobileNav(containerSel, openClass) {
    var container = document.querySelector(containerSel);
    if (!container) return;
    var btn = container.querySelector('.ky-hamburger');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var open = container.classList.toggle(openClass);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = btn.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (container.classList.contains(openClass) && !container.contains(e.target)) {
        container.classList.remove(openClass);
        btn.setAttribute('aria-expanded', 'false');
        var icon = btn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav('.ky-inner-nav', 'ky-inner-nav--open');
    initMobileNav('.ky-nav',       'ky-nav--open');
  });
})();
