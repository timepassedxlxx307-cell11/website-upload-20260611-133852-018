(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobilePanel.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var previous = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-grid]').forEach(function (grid) {
    var search = document.querySelector('[data-card-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var genreFilter = document.querySelector('[data-genre-filter]');
    var cards = Array.prototype.slice.call(grid.children);

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function applyFilters() {
      var query = valueOf(search);
      var selectedType = valueOf(typeFilter);
      var selectedYear = valueOf(yearFilter);
      var selectedGenre = valueOf(genreFilter);

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-type'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.textContent
        ].join(' ').toLowerCase();
        var type = (card.getAttribute('data-type') || '').toLowerCase();
        var year = (card.getAttribute('data-year') || '').toLowerCase();
        var genre = (card.getAttribute('data-genre') || '').toLowerCase();
        var visible = true;

        if (query && text.indexOf(query) === -1) {
          visible = false;
        }
        if (selectedType && type !== selectedType) {
          visible = false;
        }
        if (selectedYear && year !== selectedYear) {
          visible = false;
        }
        if (selectedGenre && genre.indexOf(selectedGenre) === -1) {
          visible = false;
        }
        card.classList.toggle('is-filter-hidden', !visible);
      });
    }

    [search, typeFilter, yearFilter, genreFilter].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilters);
        element.addEventListener('change', applyFilters);
      }
    });
  });

  var searchResults = document.getElementById('search-results');
  if (searchResults && window.siteSearchData) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.getElementById('search-page-input');
    var status = document.getElementById('search-status');

    if (input) {
      input.value = query;
    }

    function createCard(item) {
      var article = document.createElement('article');
      article.className = 'movie-card';
      article.setAttribute('data-title', item.title);
      article.setAttribute('data-type', item.type);
      article.setAttribute('data-region', item.region);
      article.setAttribute('data-year', item.year);
      article.setAttribute('data-genre', item.genre);
      article.innerHTML = '<a class="poster-wrap" href="' + item.url + '"><img src="./' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy"><span class="quality-badge">高清</span><span class="card-play">▶</span></a><div class="movie-card-body"><div class="movie-meta"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.year) + '</span></div><h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3><p>' + escapeHtml(item.oneLine) + '</p><div class="tag-line"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.genre) + '</span></div></div>';
      return article;
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"]/g, function (mark) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[mark];
      });
    }

    var normalized = query.toLowerCase();
    var results = window.siteSearchData.filter(function (item) {
      if (!normalized) {
        return true;
      }
      return [item.title, item.type, item.region, item.year, item.genre, item.tags, item.oneLine].join(' ').toLowerCase().indexOf(normalized) !== -1;
    }).slice(0, 120);

    searchResults.innerHTML = '';
    results.forEach(function (item) {
      searchResults.appendChild(createCard(item));
    });

    if (status) {
      status.textContent = query ? '搜索：' + query : '推荐片单';
    }
  }

  document.querySelectorAll('.movie-player').forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var stream = player.getAttribute('data-stream');
    var hls = null;
    var ready = false;

    function attach() {
      if (ready || !video || !stream) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      attach();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!ready || video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
      video.addEventListener('pause', function () {
        if (overlay && video.currentTime === 0) {
          overlay.classList.remove('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
