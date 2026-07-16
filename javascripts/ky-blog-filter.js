(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.ky-blog--listing .ky-blog__card'));
  var filtersEl = document.getElementById('ky-blog-filters');
  if (!cards.length || !filtersEl) return;

  // Collect unique tags in order of first appearance
  var seen = {};
  var tags = [];
  cards.forEach(function (card) {
    var raw = card.getAttribute('data-tags') || '';
    raw.split(',').forEach(function (t) {
      t = t.trim();
      if (t && !seen[t]) {
        seen[t] = true;
        tags.push(t);
      }
    });
  });

  if (!tags.length) return;

  // Build "All" + tag buttons
  ['All'].concat(tags).forEach(function (tag, i) {
    var btn = document.createElement('button');
    btn.className = 'ky-blog__filter-btn' + (i === 0 ? ' ky-blog__filter-btn--active' : '');
    btn.textContent = tag;
    btn.setAttribute('data-filter', tag);
    filtersEl.appendChild(btn);
  });

  filtersEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.ky-blog__filter-btn');
    if (!btn) return;
    var filter = btn.getAttribute('data-filter');

    filtersEl.querySelectorAll('.ky-blog__filter-btn').forEach(function (b) {
      b.classList.toggle('ky-blog__filter-btn--active', b === btn);
    });

    cards.forEach(function (card) {
      if (filter === 'All') {
        card.classList.remove('ky-blog__card--hidden');
      } else {
        var cardTags = (card.getAttribute('data-tags') || '').split(',').map(function (t) { return t.trim(); });
        card.classList.toggle('ky-blog__card--hidden', cardTags.indexOf(filter) === -1);
      }
    });
  });
})();
