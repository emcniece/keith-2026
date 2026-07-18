;(function () {
  function initMobileNav(containerSel, openClass, panelSel, clipEl) {
    var container = document.querySelector(containerSel);
    if (!container) return;
    var btn = container.querySelector('.ky-hamburger');
    if (!btn) return;
    var panel = panelSel ? container.querySelector(panelSel) : null;
    // clipEl: an ancestor with clip-path that must be cleared while panel is open
    var clipTarget = clipEl ? document.querySelector(clipEl) : null;

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
      if (clipTarget) clipTarget.classList.remove('ky-clip-suspended');
    }

    btn.addEventListener('click', function () {
      var open = container.classList.toggle(openClass);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = btn.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      if (open) {
        positionPanel();
        if (clipTarget) clipTarget.classList.add('ky-clip-suspended');
      } else {
        if (clipTarget) clipTarget.classList.remove('ky-clip-suspended');
      }
    });

    document.addEventListener('click', function (e) {
      if (container.classList.contains(openClass) && !container.contains(e.target)) {
        close();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav('.ky-inner-nav', 'ky-inner-nav--open', '.ky-inner-nav__nav');
    // Pass .ky-hero so its clip-path is suspended while the panel is open
    initMobileNav('.ky-nav', 'ky-nav--open', '.ky-nav__panel', '.ky-hero');
  });
})();
