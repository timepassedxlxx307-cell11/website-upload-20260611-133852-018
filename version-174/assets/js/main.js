(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var opened = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var heroThumbs = Array.prototype.slice.call(document.querySelectorAll('.hero-thumb'));
  var heroIndex = 0;

  function setHero(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });

    heroThumbs.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle('is-active', thumbIndex === heroIndex);
    });
  }

  heroThumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var target = Number(thumb.getAttribute('data-hero-target')) || 0;
      setHero(target);
    });
  });

  if (heroSlides.length > 1) {
    window.setInterval(function () {
      setHero(heroIndex + 1);
    }, 6500);
  }

  document.querySelectorAll('.rail-controls button').forEach(function (button) {
    button.addEventListener('click', function () {
      var section = button.closest('.content-section');
      var rail = section ? section.querySelector('.movie-rail') : null;
      var direction = button.getAttribute('data-scroll') === 'left' ? -1 : 1;

      if (rail) {
        rail.scrollBy({
          left: direction * 460,
          behavior: 'smooth'
        });
      }
    });
  });

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var textInput = scope.querySelector('[data-filter-text]');
    var typeInput = scope.querySelector('[data-filter-type]');
    var yearInput = scope.querySelector('[data-filter-year]');
    var section = scope.closest('.content-section');
    var cards = section ? Array.prototype.slice.call(section.querySelectorAll('.movie-card')) : [];

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      var text = normalize(textInput && textInput.value);
      var type = normalize(typeInput && typeInput.value);
      var year = normalize(yearInput && yearInput.value);

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var matchedText = !text || haystack.indexOf(text) !== -1;
        var matchedType = !type || normalize(card.getAttribute('data-type')).indexOf(type) !== -1;
        var matchedYear = !year || normalize(card.getAttribute('data-year')) === year;
        card.style.display = matchedText && matchedType && matchedYear ? '' : 'none';
      });
    }

    [textInput, typeInput, yearInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilter);
        input.addEventListener('change', applyFilter);
      }
    });
  });
})();
