(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector('.menu-toggle');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            var opened = menu.classList.toggle('open');
            button.setAttribute('aria-expanded', opened ? 'true' : 'false');
            button.textContent = opened ? '×' : '☰';
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero-slider]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle('active', position === current);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle('active', position === current);
                dot.setAttribute('aria-current', position === current ? 'true' : 'false');
            });
        }

        function start() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
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

        show(0);
        start();
    }

    function setupFilter() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
        inputs.forEach(function (input) {
            var scopeSelector = input.getAttribute('data-filter-input');
            var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
            if (!scope) {
                return;
            }
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
            var empty = scope.querySelector('.empty-state');
            input.addEventListener('input', function () {
                var keyword = input.value.trim().toLowerCase();
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                    var matched = !keyword || haystack.indexOf(keyword) !== -1;
                    card.style.display = matched ? '' : 'none';
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            });
        });
    }

    function createHls(video, stream, onReady, onError) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            onReady();
            return null;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                onReady();
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    onError();
                }
            });
            return hls;
        }
        video.src = stream;
        onReady();
        return null;
    }

    window.initMoviePlayer = function (options) {
        ready(function () {
            var video = document.getElementById(options.videoId);
            var overlay = document.getElementById(options.overlayId);
            var button = document.getElementById(options.buttonId);
            var status = document.getElementById(options.statusId);
            var started = false;
            var hlsInstance = null;

            if (!video || !overlay || !button || !options.stream) {
                return;
            }

            function setStatus(text) {
                if (status) {
                    status.textContent = text || '';
                }
            }

            function begin() {
                overlay.classList.add('is-hidden');
                setStatus('正在准备播放…');

                function playNow() {
                    var attempt = video.play();
                    if (attempt && typeof attempt.catch === 'function') {
                        attempt.then(function () {
                            setStatus('');
                        }).catch(function () {
                            setStatus('点击视频继续观看');
                        });
                    } else {
                        setStatus('');
                    }
                }

                if (!started) {
                    started = true;
                    hlsInstance = createHls(video, options.stream, playNow, function () {
                        setStatus('播放暂不可用，请稍后再试');
                    });
                } else {
                    playNow();
                }
            }

            overlay.addEventListener('click', begin);
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                begin();
            });
            video.addEventListener('click', function () {
                if (video.paused) {
                    begin();
                }
            });
            window.addEventListener('beforeunload', function () {
                if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                    hlsInstance.destroy();
                }
            });
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilter();
    });
}());
