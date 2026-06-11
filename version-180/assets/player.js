(function () {
  window.initMoviePlayer = function (videoId, sourceUrl) {
    var video = document.getElementById(videoId);

    if (!video || !sourceUrl) {
      return;
    }

    var root = video.closest("[data-player-root]");
    var button = root ? root.querySelector("[data-player-button]") : null;
    var isReady = false;

    var prepare = function () {
      if (isReady) {
        return;
      }

      isReady = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        return;
      }

      video.src = sourceUrl;
    };

    var start = function () {
      prepare();

      if (button) {
        button.classList.add("is-hidden");
      }

      var request = video.play();

      if (request && typeof request.catch === "function") {
        request.catch(function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    };

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
  };
})();
