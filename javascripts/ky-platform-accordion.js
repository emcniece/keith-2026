document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('.ky-platform-accordion__item');

  items.forEach(function (item) {
    var toggle = item.querySelector('.ky-platform-accordion__toggle');
    var caretIcon = item.querySelector('.ky-platform-accordion__caret i');

    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var isOpen = item.classList.contains('ky-platform-accordion__item--open');

      if (isOpen) {
        item.classList.remove('ky-platform-accordion__item--open');
        toggle.setAttribute('aria-expanded', 'false');
        if (caretIcon) {
          caretIcon.classList.remove('fa-minus');
          caretIcon.classList.add('fa-plus');
        }
      } else {
        item.classList.add('ky-platform-accordion__item--open');
        toggle.setAttribute('aria-expanded', 'true');
        if (caretIcon) {
          caretIcon.classList.remove('fa-plus');
          caretIcon.classList.add('fa-minus');
        }
      }
    });
  });
});
