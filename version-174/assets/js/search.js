(function () {
  var form = document.querySelector('[data-site-search]');
  var results = document.querySelector('[data-search-results]');
  var list = typeof MOVIE_SEARCH_INDEX !== 'undefined' ? MOVIE_SEARCH_INDEX : [];

  if (!form || !results) {
    return;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function card(movie) {
    var tags = [movie.year, movie.region, movie.type].filter(Boolean).slice(0, 3).map(function (item) {
      return '<span>' + escapeHtml(item) + '</span>';
    }).join('');

    var badge = movie.genre ? movie.genre.split(/[，,、/]/)[0].trim() : movie.type;

    return '<article class="movie-card">' +
      '<a class="movie-card-media" href="' + escapeHtml(movie.url) + '">' +
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" class="movie-cover" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
      '<span class="movie-badge">' + escapeHtml(badge || '影视') + '</span>' +
      '<span class="movie-play">▶</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<div class="movie-meta">' + tags + '</div>' +
      '<p>' + escapeHtml(movie.line || '') + '</p>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function render() {
    var data = new FormData(form);
    var keyword = normalize(data.get('q'));
    var type = normalize(data.get('type'));

    var matched = list.filter(function (movie) {
      var haystack = normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.line
      ].join(' '));
      var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var okType = !type || normalize(movie.type + ' ' + movie.genre).indexOf(type) !== -1;
      return okKeyword && okType;
    }).slice(0, 80);

    if (!matched.length) {
      results.innerHTML = '<div class="search-empty">没有找到匹配影片，换个关键词试试。</div>';
      return;
    }

    results.innerHTML = matched.map(card).join('');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    render();
  });

  form.addEventListener('input', render);
  form.addEventListener('change', render);

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q');

  if (initial) {
    form.elements.q.value = initial;
  }

  render();
})();
