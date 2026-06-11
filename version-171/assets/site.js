(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var searchInputs = document.querySelectorAll('.js-search-input');
  var searchableCards = document.querySelectorAll('[data-search]');

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();

      searchableCards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var match = !value || haystack.indexOf(value) !== -1;

        if (match) {
          card.removeAttribute('hidden-by-search');
        } else {
          card.setAttribute('hidden-by-search', 'true');
        }
      });
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;

    var activate = function (index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot') || 0));
      });
    });

    window.setInterval(function () {
      activate(active + 1);
    }, 5200);
  }

  var players = document.querySelectorAll('[data-player]');

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var stream = player.getAttribute('data-stream');
    var hlsInstance = null;
    var ready = false;

    var bindStream = function () {
      if (!video || !stream || ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        ready = true;
        return;
      }

      video.src = stream;
      ready = true;
    };

    var startPlayback = function () {
      bindStream();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      if (video) {
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }
    };

    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!ready || video.paused) {
          startPlayback();
        }
      });

      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  });
})();
