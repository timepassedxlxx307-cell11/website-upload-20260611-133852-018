(function () {
  function startPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.player-start');
    var streamUrl = video ? video.getAttribute('data-stream') : '';

    if (!video || !streamUrl) {
      return;
    }

    function playVideo() {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    function loadStream() {
      if (video.getAttribute('data-ready') === 'yes') {
        playVideo();
        return;
      }

      video.setAttribute('data-ready', 'yes');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        playVideo();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
        shell.hlsPlayer = hls;
        return;
      }

      video.src = streamUrl;
      playVideo();
    }

    function activate() {
      if (button) {
        button.classList.add('is-hidden');
      }

      loadStream();
    }

    if (button) {
      button.addEventListener('click', activate);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        activate();
      }
    });
  }

  document.querySelectorAll('.movie-player').forEach(startPlayer);
})();
