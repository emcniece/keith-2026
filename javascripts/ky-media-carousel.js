(function () {
  var slides = document.querySelectorAll('.ky-media__slide');
  if (!slides.length) return;

  var current = 0;
  var timer;

  function show(index) {
    slides[current].classList.remove('ky-media__slide--active');
    slides[current].setAttribute('aria-hidden', 'true');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('ky-media__slide--active');
    slides[current].setAttribute('aria-hidden', 'false');
  }

  function startTimer() {
    timer = setInterval(function () { show(current + 1); }, 5000);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  var prevBtn = document.querySelector('.ky-media__carousel-prev');
  var nextBtn = document.querySelector('.ky-media__carousel-next');
  var carousel = document.querySelector('.ky-media__carousel');

  if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); resetTimer(); });

  if (carousel) {
    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', startTimer);
  }

  startTimer();
})();
