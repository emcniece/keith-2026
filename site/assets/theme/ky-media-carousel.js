(function () {
  var slides = document.querySelectorAll('.ky-media__slide');
  if (!slides.length) return;

  var current = 0;

  function show(index) {
    slides[current].classList.remove('ky-media__slide--active');
    slides[current].setAttribute('aria-hidden', 'true');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('ky-media__slide--active');
    slides[current].setAttribute('aria-hidden', 'false');
  }

  var prevBtn = document.querySelector('.ky-media__carousel-prev');
  var nextBtn = document.querySelector('.ky-media__carousel-next');

  if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });
})();
