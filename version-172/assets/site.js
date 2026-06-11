(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobile = document.querySelector('[data-mobile-nav]');

  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
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
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var yearSelect = document.querySelector('[data-year-filter]');
  var items = Array.prototype.slice.call(document.querySelectorAll('.searchable-item'));

  function filterItems() {
    var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var y = yearSelect ? yearSelect.value : '';

    items.forEach(function (item) {
      var corpus = [
        item.getAttribute('data-title') || '',
        item.getAttribute('data-year') || '',
        item.getAttribute('data-tags') || ''
      ].join(' ').toLowerCase();
      var year = item.getAttribute('data-year') || '';
      var matchQuery = !q || corpus.indexOf(q) !== -1;
      var matchYear = !y || year.indexOf(y) !== -1;
      item.classList.toggle('is-hidden', !(matchQuery && matchYear));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterItems);
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', filterItems);
  }
})();
