(function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var siteNav = document.querySelector("[data-site-nav]");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      siteNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;

    var setHero = function (index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        setHero(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    window.setInterval(function () {
      setHero(activeIndex + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));

  searchInputs.forEach(function (input) {
    var scopeSelector = input.getAttribute("data-search-scope");
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call((scope || document).querySelectorAll("[data-search-card]"));

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search-text") || card.textContent || "").toLowerCase();
        card.classList.toggle("is-hidden", query.length > 0 && text.indexOf(query) === -1);
      });
    });
  });

  var filterGroups = Array.prototype.slice.call(document.querySelectorAll("[data-filter-group]"));

  filterGroups.forEach(function (group) {
    var scopeSelector = group.getAttribute("data-filter-group");
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    var chips = Array.prototype.slice.call(group.querySelectorAll("[data-filter-type]"));

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var type = chip.getAttribute("data-filter-type");
        var cards = Array.prototype.slice.call((scope || document).querySelectorAll("[data-search-card]"));

        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
        });

        cards.forEach(function (card) {
          var cardType = card.getAttribute("data-type") || "";
          var matched = type === "all" || cardType.indexOf(type) !== -1;
          card.classList.toggle("is-hidden", !matched);
        });
      });
    });
  });
})();
