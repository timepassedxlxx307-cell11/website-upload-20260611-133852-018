(function () {
  const navButton = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    const show = function (next) {
      if (!slides.length) {
        return;
      }

      index = (next + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-scroll-row]').forEach(function (wrap) {
    const row = wrap.querySelector('[data-card-row]');
    const left = wrap.querySelector('[data-scroll-left]');
    const right = wrap.querySelector('[data-scroll-right]');

    if (!row) {
      return;
    }

    if (left) {
      left.addEventListener('click', function () {
        row.scrollBy({ left: -420, behavior: 'smooth' });
      });
    }

    if (right) {
      right.addEventListener('click', function () {
        row.scrollBy({ left: 420, behavior: 'smooth' });
      });
    }
  });

  document.querySelectorAll('[data-filter-area]').forEach(function (area) {
    const searchInput = area.querySelector('[data-search]');
    const yearSelect = area.querySelector('[data-year-filter]');
    const typeSelect = area.querySelector('[data-type-filter]');
    const regionSelect = area.querySelector('[data-region-filter]');
    const cards = Array.from(area.querySelectorAll('[data-card]'));
    const rows = Array.from(area.querySelectorAll('[data-rank-row]'));
    const empty = area.querySelector('[data-empty]');
    const items = cards.length ? cards : rows;

    const normalize = function (value) {
      return String(value || '').trim().toLowerCase();
    };

    const apply = function () {
      const query = normalize(searchInput ? searchInput.value : '');
      const year = normalize(yearSelect ? yearSelect.value : '');
      const type = normalize(typeSelect ? typeSelect.value : '');
      const region = normalize(regionSelect ? regionSelect.value : '');
      let visible = 0;

      items.forEach(function (item) {
        const haystack = normalize([
          item.getAttribute('data-title'),
          item.getAttribute('data-tags'),
          item.getAttribute('data-year'),
          item.getAttribute('data-type'),
          item.getAttribute('data-region')
        ].join(' '));
        const itemYear = normalize(item.getAttribute('data-year'));
        const itemType = normalize(item.getAttribute('data-type'));
        const itemRegion = normalize(item.getAttribute('data-region'));
        const matched = (!query || haystack.indexOf(query) !== -1) &&
          (!year || itemYear === year) &&
          (!type || itemType === type) &&
          (!region || itemRegion.indexOf(region) !== -1);

        item.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };

    [searchInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
  });
})();
