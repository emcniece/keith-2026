;(function () {
  var DURATION = 1600;

  // BezierEasing polyfill (same easing as colby-2026 counter-animation.js)
  function ease(t) {
    // ease-out-expo approximation
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  // ── COUNT-UP for .ky-progress-card__stat ─────────────────────────────────

  function parseCounter(text) {
    text = text.trim();
    var match = text.match(/^([^0-9]*)([0-9][0-9,.]*)([^0-9]*)$/);
    if (!match) return null;
    var raw = match[2].replace(/,/g, '');
    var value = parseFloat(raw);
    if (isNaN(value)) return null;
    return {
      prefix: match[1],
      value: value,
      suffix: match[3],
      useCommas: match[2].indexOf(',') !== -1
    };
  }

  function formatNumber(n, useCommas) {
    var rounded = Math.round(n);
    return useCommas ? rounded.toLocaleString('en-US') : String(rounded);
  }

  function animateCounter(el, parsed) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / DURATION, 1);
      var current = parsed.value * ease(progress);
      el.textContent = parsed.prefix + formatNumber(current, parsed.useCommas) + parsed.suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var els = document.querySelectorAll('.ky-progress-card__stat, .ky-stats__num');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var parsed = parseCounter(el.textContent);
        if (parsed) animateCounter(el, parsed);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });
    els.forEach(function (el) { observer.observe(el); });
  }

  // ── DONUT CHART ANIMATION ────────────────────────────────────────────────

  function animateDonut(el, target) {
    el.style.setProperty('--done', 0);
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / DURATION, 1);
      el.style.setProperty('--done', target * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initDonuts() {
    var charts = document.querySelectorAll('.ky-progress-donut__chart');
    if (!charts.length) return;
    charts.forEach(function (chart) {
      // Read target from inline style before we zero it
      var raw = chart.style.getPropertyValue('--done') || '0';
      var target = parseFloat(raw.trim());
      chart.dataset.doneDone = target;  // stash for reference
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var chart = entry.target;
        var target = parseFloat(chart.dataset.doneDone || '0');
        animateDonut(chart, target);
        observer.unobserve(chart);
      });
    }, { threshold: 0.4 });
    charts.forEach(function (el) { observer.observe(el); });
  }

  // ── DONUT ↔ LEGEND HOVER PAIRING ────────────────────────────────────────

  function initDonutHover() {
    var donuts = document.querySelectorAll('.ky-progress-donut');
    donuts.forEach(function (donut) {
      var items = donut.querySelectorAll('.ky-progress-donut__legend-item');
      var chart = donut.querySelector('.ky-progress-donut__chart');
      if (!chart || items.length < 2) return;

      items[0].addEventListener('mouseenter', function () {
        donut.classList.add('ky-progress-donut--hover-done');
        donut.classList.remove('ky-progress-donut--hover-progress');
      });
      items[1].addEventListener('mouseenter', function () {
        donut.classList.add('ky-progress-donut--hover-progress');
        donut.classList.remove('ky-progress-donut--hover-done');
      });
      donut.addEventListener('mouseleave', function () {
        donut.classList.remove('ky-progress-donut--hover-done', 'ky-progress-donut--hover-progress');
      });
    });
  }

  // ── SMOOTH SCROLL for anchor nav ────────────────────────────────────────

  function initSmoothScroll() {
    var links = document.querySelectorAll('.ky-progress-anchors__link');
    // Must match the CSS `top` on .ky-progress-section__left (nav bottom 72px + 16px gap)
    var STICKY_LEFT_TOP = 88;

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        var section = document.getElementById(href.slice(1));
        if (!section) return;
        e.preventDefault();
        var kicker = section.querySelector('.ky-progress-section__kicker');
        var el = kicker || section;
        var elAbsTop = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elAbsTop - STICKY_LEFT_TOP, behavior: 'smooth' });
      });
    });
  }

  function init() {
    initCounters();
    initDonuts();
    initDonutHover();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
