(function () {
  function initBlogModals() {
    document.querySelectorAll('.ky-blog__modal').forEach(function (modal) {

      // Before open: restore src if it was cleared on a previous close
      modal.addEventListener('show.bs.modal', function () {
        var iframe = modal.querySelector('iframe');
        if (!iframe) return;
        if (!iframe.dataset.kySrc) {
          iframe.dataset.kySrc = iframe.src;
        }
        if (!iframe.src && iframe.dataset.kySrc) {
          iframe.src = iframe.dataset.kySrc;
        }
      });

      // After open: trigger autoplay for platforms that support it
      modal.addEventListener('shown.bs.modal', function () {
        var iframe = modal.querySelector('iframe');
        if (!iframe) return;
        var src = iframe.src || iframe.dataset.kySrc;
        if (!src) return;
        // YouTube: append autoplay=1
        if (src.indexOf('youtube.com') !== -1 || src.indexOf('youtu.be') !== -1) {
          src = src.replace(/[?&]autoplay=\d/, '');
          iframe.src = src + (src.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=1';
        }
      });

      // On close: clear src to stop playback
      modal.addEventListener('hide.bs.modal', function () {
        var iframe = modal.querySelector('iframe');
        if (!iframe) return;
        if (iframe.src) {
          iframe.dataset.kySrc = iframe.src;
        }
        iframe.src = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogModals);
  } else {
    initBlogModals();
  }
})();
