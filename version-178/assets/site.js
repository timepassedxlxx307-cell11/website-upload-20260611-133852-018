document.addEventListener('DOMContentLoaded', function () {
  setupMobileNavigation();
  setupHeroCarousel();
  setupFilters();
});

function setupMobileNavigation() {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var nav = document.querySelector('[data-main-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', function () {
    nav.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  var carousel = document.querySelector('[data-hero-carousel]');

  if (!carousel) {
    return;
  }

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
  var prev = carousel.querySelector('[data-hero-prev]');
  var next = carousel.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function showSlide(index) {
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

  function startTimer() {
    stopTimer();
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      startTimer();
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      startTimer();
    });
  }

  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);
  showSlide(0);
  startTimer();
}

function setupFilters() {
  var panel = document.querySelector('[data-filter-panel]');
  var grid = document.querySelector('[data-filter-grid]');

  if (!panel || !grid) {
    return;
  }

  var searchInput = panel.querySelector('[data-filter-search]');
  var categorySelect = panel.querySelector('[data-filter-category]');
  var yearSelect = panel.querySelector('[data-filter-year]');
  var status = panel.querySelector('[data-filter-status]');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');

  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilter() {
    var query = normalize(searchInput ? searchInput.value : '');
    var category = categorySelect ? categorySelect.value : '';
    var year = yearSelect ? yearSelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var cardCategory = card.getAttribute('data-category') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var matched = true;

      if (query && text.indexOf(query) === -1) {
        matched = false;
      }

      if (category && cardCategory !== category) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (status) {
      status.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 部';
    }
  }

  [searchInput, categorySelect, yearSelect].forEach(function (element) {
    if (!element) {
      return;
    }

    element.addEventListener('input', applyFilter);
    element.addEventListener('change', applyFilter);
  });

  applyFilter();
}
