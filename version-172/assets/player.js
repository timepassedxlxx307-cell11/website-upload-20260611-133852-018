(function () {
  var player = document.querySelector('[data-player]');

  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var cover = player.querySelector('.player-cover');
  var source = player.getAttribute('data-url');
  var hls = null;
  var ready = false;

  function bind() {
    if (!video || !source || ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      ready = true;
      return;
    }

    video.src = source;
    ready = true;
  }

  function play() {
    bind();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    video.controls = true;
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
