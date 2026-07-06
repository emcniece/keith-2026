(function ($) {
  $(function () {
    $('.ky-blog__modal')
      .on('show.bs.modal', function () {
        var $iframe = $(this).find('iframe');
        if (!$iframe.length) return;
        // Store original src once
        if (!$iframe.data('ky-src')) {
          $iframe.data('ky-src', $iframe.attr('src'));
        }
      })
      .on('shown.bs.modal', function () {
        // Reload iframe inside the user-gesture window so autoplay is permitted
        var $iframe = $(this).find('iframe');
        if (!$iframe.length) return;
        var src = $iframe.data('ky-src');
        if (!src) return;

        // Add autoplay hint (honoured by YouTube; ignored but harmless elsewhere)
        src = src.replace(/[?&]autoplay=\d/, '');
        src += (src.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=1';

        // Allow autoplay on the iframe element itself
        $iframe.attr('allow', 'autoplay; encrypted-media');

        // Force a reload: clear first, then set after a tick
        $iframe.attr('src', '');
        setTimeout(function () { $iframe.attr('src', src); }, 50);
      })
      .on('hide.bs.modal', function () {
        var $iframe = $(this).find('iframe');
        if (!$iframe.length) return;
        $iframe.attr('src', '');
      });
  });
}(jQuery));
