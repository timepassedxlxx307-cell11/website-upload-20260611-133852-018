(function () {
    function setupMenu() {
        var button = document.querySelector('.menu-button');
        var nav = document.querySelector('.mobile-nav');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        if (slides.length <= 1) {
            return;
        }
        var activeIndex = 0;
        var timer = null;
        function show(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle('active', current === activeIndex);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle('active', current === activeIndex);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(activeIndex + 1);
            }, 5000);
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(index);
                start();
            });
        });
        start();
    }

    function setupListFilter() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('.category-search'));
        inputs.forEach(function (input) {
            var scope = input.closest('main') || document;
            var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .ranking-item'));
            input.addEventListener('input', function () {
                var keyword = input.value.trim().toLowerCase();
                items.forEach(function (item) {
                    var text = [
                        item.getAttribute('data-title'),
                        item.getAttribute('data-region'),
                        item.getAttribute('data-year'),
                        item.getAttribute('data-genre'),
                        item.textContent
                    ].join(' ').toLowerCase();
                    item.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
                });
            });
        });
    }

    function setupGlobalSearch() {
        var input = document.getElementById('global-search-input');
        var results = document.getElementById('global-search-results');
        if (!input || !results || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        input.value = initial;
        function card(movie) {
            return [
                '<article class="search-result-card">',
                '<a href="' + movie.url + '"><img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy"></a>',
                '<div>',
                '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
                '<p>' + escapeHtml([movie.year, movie.region, movie.type, movie.genre].filter(Boolean).join(' · ')) + '</p>',
                '<p>' + escapeHtml(movie.oneLine || '') + '</p>',
                '</div>',
                '</article>'
            ].join('');
        }
        function render() {
            var keyword = input.value.trim().toLowerCase();
            var matches = window.SEARCH_MOVIES.filter(function (movie) {
                if (!keyword) {
                    return movie.id <= 48;
                }
                return [movie.title, movie.region, movie.year, movie.type, movie.genre, movie.oneLine]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(keyword) !== -1;
            }).slice(0, 160);
            results.innerHTML = matches.map(card).join('');
        }
        input.addEventListener('input', render);
        render();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setupPlayer() {
        var video = document.querySelector('.movie-video');
        var overlay = document.querySelector('.player-overlay');
        var streamUrl = window.MOVIE_STREAM;
        if (!video || !overlay || !streamUrl) {
            return;
        }
        var hlsInstance = null;
        var prepared = false;
        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            video.controls = true;
        }
        function play() {
            prepare();
            overlay.classList.add('hidden');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    overlay.classList.remove('hidden');
                });
            }
        }
        overlay.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (!prepared) {
                play();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupListFilter();
        setupGlobalSearch();
        setupPlayer();
    });
}());
