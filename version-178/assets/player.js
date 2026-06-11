document.addEventListener('DOMContentLoaded', function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
  players.forEach(initializePlayer);
});

function initializePlayer(container) {
  var video = container.querySelector('video');
  var button = container.querySelector('[data-play-button]');
  var message = container.querySelector('[data-player-message]');
  var source = video ? video.getAttribute('data-video-src') : '';
  var ready = false;
  var hlsInstance = null;

  if (!video || !button) {
    return;
  }

  function setMessage(text) {
    if (message) {
      message.textContent = text || '';
    }
  }

  function attachSource() {
    if (ready) {
      return Promise.resolve();
    }

    if (!source) {
      setMessage('当前影片暂未配置播放源。');
      return Promise.reject(new Error('Missing video source'));
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      ready = true;
      container.classList.add('is-ready');
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      ready = true;
      container.classList.add('is-ready');
      return Promise.resolve();
    }

    video.src = source;
    ready = true;
    container.classList.add('is-ready');
    setMessage('如果无法播放，请使用支持 HLS 的浏览器访问。');
    return Promise.resolve();
  }

  function playVideo() {
    setMessage('正在加载播放源...');
    attachSource()
      .then(function () {
        return video.play();
      })
      .then(function () {
        setMessage('');
      })
      .catch(function () {
        setMessage('播放未自动开始，请再次点击视频播放按钮。');
      });
  }

  button.addEventListener('click', playVideo);

  video.addEventListener('play', function () {
    container.classList.add('is-playing');
    setMessage('');
  });

  video.addEventListener('pause', function () {
    container.classList.remove('is-playing');
  });

  video.addEventListener('ended', function () {
    container.classList.remove('is-playing');
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
