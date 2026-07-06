(function ($) {
  $(function () {
    $('.ky-blog__modal')
      .on('show.bs.modal', function () {
        var $iframe = $(this).find('iframe');
        if (!$iframe.length) return;
        // Store original src on first open
        if (!$iframe.data('ky-src')) {
          $iframe.data('ky-src', $iframe.attr('src'));
        }
        // Restore src if cleared by a previous close
        if (!$iframe.attr('src') && $iframe.data('ky-src')) {
          $iframe.attr('src', $iframe.data('ky-src'));
        }
      })
      .on('shown.bs.modal', function () {
        var $iframe = $(this).find('iframe');
        if (!$iframe.length) return;
        var src = $iframe.attr('src') || $iframe.data('ky-src');
        if (!src) return;
        // YouTube: reload with autoplay=1
        if (src.indexOf('youtube.com') !== -1 || src.indexOf('youtu.be') !== -1) {
          src = src.replace(/[?&]autoplay=\d/, '');
          $iframe.attr('src', src + (src.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=1');
        }
      })
      .on('hide.bs.modal', function () {
        var $iframe = $(this).find('iframe');
        if (!$iframe.length) return;
        var src = $iframe.attr('src');
        if (src) $iframe.data('ky-src', src);
        // Clear src to stop playback
        $iframe.attr('src', '');
      });
  });
}(jQuery));
