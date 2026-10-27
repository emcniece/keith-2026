;(function () {
  function initMobileNav(containerSel, openClass, panelSel) {
    var container = document.querySelector(containerSel);
    if (!container) return;
    var btn = container.querySelector('.ky-hamburger:not(.ky-nav-close)');
    if (!btn) return;
    var panel = panelSel ? container.querySelector(panelSel) : null;

    function positionPanel() {
      if (!panel) return;
      var rect = container.getBoundingClientRect();
      panel.style.top = rect.bottom + 'px';
    }

    function close() {
      container.classList.remove(openClass);
      btn.setAttribute('aria-expanded', 'false');
      var icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }

    btn.addEventListener('click', function () {
      var open = container.classList.toggle(openClass);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = btn.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      if (open) positionPanel();
    });

    if (panel) {
      var closeBtn = panel.querySelector('.ky-nav-close');
      if (closeBtn) closeBtn.addEventListener('click', close);
    }

    document.addEventListener('click', function (e) {
      if (container.classList.contains(openClass) && !container.contains(e.target)) {
        close();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav('.ky-inner-nav', 'ky-inner-nav--open', '.ky-inner-nav__nav');
    initMobileNav('.ky-nav',       'ky-nav--open',       '.ky-nav__panel');
  });
})();
