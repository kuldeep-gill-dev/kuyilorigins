/* Kuyil Origins — Estate > Coffee > Format explorer (data lives in coffee-data.js) */
(function () {
  var cat = window.KUYIL_CATALOG;
  var grid = document.getElementById('estateGrid');
  if (!cat || !grid) return;

  var STATUS = { available: '', limited: 'Limited release', soldout: 'Sold out', soon: 'Coming soon' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function badge(status) {
    return STATUS[status] ? '<span class="cx-badge cx-' + esc(status) + '">' + STATUS[status] + '</span>' : '';
  }
  function money(p) { return p == null ? 'Price to be announced' : '$' + p; }
  function findEstate(id) { return cat.estates.filter(function (e) { return e.id === id; })[0]; }
  function findCoffee(e, id) { return e.coffees.filter(function (c) { return c.id === id; })[0]; }
  function orderable(s) { return s !== 'soldout' && s !== 'soon'; }

  /* ---- intro + producer cards ---- */
  var intro = document.getElementById('estateIntro');
  if (intro && cat.intro) {
    intro.innerHTML = '<div class="eyebrow">' + esc(cat.intro.eyebrow) + '</div>' +
      '<h2>' + esc(cat.intro.title) + '</h2><p>' + esc(cat.intro.body) + '</p>';
  }

  grid.innerHTML = cat.estates.map(function (e) {
    var n = e.coffees.length;
    return '<article class="pcard pcard-open" tabindex="0" role="button" data-estate="' + esc(e.id) + '" aria-label="' + esc(e.name) + ' — explore coffees">' +
      '<div class="fr"><img src="' + esc(e.image) + '" alt="' + esc(e.imageAlt) + '" loading="lazy" decoding="async"></div>' +
      '<h3>' + esc(e.name) + '</h3><div class="region">' + esc(e.location) + '</div>' +
      '<p>' + esc(e.summary) + '</p>' +
      '<span class="go">Explore coffees</span></article>';
  }).join('');

  /* ---- sheet shell ---- */
  var ov = document.createElement('div');
  ov.className = 'cx-ov';
  ov.id = 'cxOv';
  ov.innerHTML = '<div class="cx-sheet" role="dialog" aria-modal="true" aria-labelledby="cxTitle">' +
    '<div class="cx-bar"><button type="button" class="cx-back" id="cxBack"></button>' +
    '<button type="button" class="cx-close" id="cxClose" aria-label="Close">&times;</button></div>' +
    '<div class="cx-scroll" id="cxBody"></div></div>';
  document.body.appendChild(ov);

  var body = document.getElementById('cxBody');
  var backBtn = document.getElementById('cxBack');
  var state = { estate: null, coffee: null };
  var lastFocus = null;

  function setBack(label, fn) {
    backBtn.style.visibility = label ? 'visible' : 'hidden';
    backBtn.textContent = label ? '← ' + label : '';
    backBtn.onclick = fn || null;
  }

  function show(html) {
    body.innerHTML = html;
    body.scrollTop = 0;
    body.classList.remove('cx-in');
    void body.offsetWidth;
    body.classList.add('cx-in');
  }

  /* ---- estate view ---- */
  function estateView(e) {
    state.estate = e; state.coffee = null;
    setBack('All estates', close);
    var cards = e.coffees.length ? '<div class="cx-coffees">' + e.coffees.map(function (c) {
      return '<button type="button" class="cx-ccard" data-coffee="' + esc(c.id) + '">' +
        '<div class="cx-cc-top"><h4>' + esc(c.name) + '</h4>' + badge(c.status) + '</div>' +
        '<div class="cx-meta">' + [c.process, c.variety].filter(Boolean).map(esc).join(' &middot; ') + '</div>' +
        (c.notes.length ? '<ul class="cx-notes">' + c.notes.slice(0, 4).map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
        '<span class="cx-more">Explore this coffee</span></button>';
    }).join('') + '</div>' :
      '<p class="cx-empty">We’re still selecting coffees from ' + esc(e.name) + '. <a href="#" data-ask="' + esc(e.name) + '">Ask what’s coming</a>.</p>';

    show('<header class="cx-head"><div class="cx-kicker">' + esc(e.name) + '</div>' +
      '<h2 id="cxTitle">' + esc(e.name) + '</h2>' +
      '<div class="cx-loc">' + esc(e.location) + '</div>' +
      '<p class="cx-desc">' + esc(e.description) + '</p>' +
      '<a class="cx-link" href="' + esc(e.pageUrl) + '">Read the estate story</a></header>' +
      '<div class="cx-img"><img src="' + esc(e.image) + '" alt="' + esc(e.imageAlt) + '"></div>' +
      '<h3 class="cx-sub">Explore coffees from ' + esc(e.name.replace(/ (Estate|Plantations)$/, '')) + '</h3>' + cards);
  }

  /* ---- coffee view ---- */
  function coffeeView(e, c) {
    state.coffee = c;
    setBack('Back to ' + e.name.replace(/ (Estate|Plantations)$/, '') + ' coffees', function () { estateView(e); });
    var f = c.formats || {};
    var meta = [c.process, c.variety, c.region].filter(Boolean).map(esc).join(' <i>|</i> ');
    var html = '<header class="cx-head"><div class="cx-kicker">' + esc(e.name) + '</div>' +
      '<h2 id="cxTitle">' + esc(c.name) + '</h2>' +
      (meta ? '<div class="cx-loc">' + meta + '</div>' : '') +
      (c.notes.length ? '<ul class="cx-notes cx-notes-lg">' + c.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
      (c.story ? '<p class="cx-desc">' + esc(c.story) + '</p>' : '') + '</header>';

    var blocks = '';
    if (f.roasted) blocks += formatBlock('roasted', 'Roasted coffee', f.roasted.blurb || 'Roasted in small batches for Kuyil Origins.', f.roasted, c, 'Add to Cart');
    if (f.green) blocks += formatBlock('green', 'Green coffee — for home roasters', f.green.blurb || 'Unroasted coffee for home roasters and coffee enthusiasts who want to roast the coffee themselves.', f.green, c, 'Add Green Coffee to Cart');
    var partners = (f.partners || []).filter(function (p) { return p.available; });

    html += '<div class="cx-choose"><div class="cx-kicker">Choose how you want to experience this coffee</div>';
    html += blocks || (partners.length ? '' : '<p class="cx-empty">Formats for this coffee are coming soon. <a href="#" data-ask="' + esc(c.name) + '">Ask us about it</a>.</p>');
    if (partners.length) {
      html += '<div class="cx-fmt cx-partners"><div class="cx-fmt-h">Prefer it roasted?</div>' +
        '<p class="cx-fmt-p">Try a partner roaster’s interpretation.</p>' +
        partners.map(function (p) {
          return '<div class="cx-partner">' +
            (p.logo ? '<img class="cx-plogo" src="' + esc(p.logo) + '" alt="">' : '') +
            '<div class="cx-pbody"><div class="cx-pname">' + esc(p.roaster) + '</div>' +
            (p.product ? '<div class="cx-pprod">' + esc(p.product) + '</div>' : '') +
            (p.description ? '<p>' + esc(p.description) + '</p>' : '') +
            (p.roast ? '<p class="cx-roast">' + esc(p.roast) + '</p>' : '') +
            (p.url ? '<a class="cx-btn" href="' + esc(p.url) + '" target="_blank" rel="noopener">Buy roasted from ' + esc(p.roaster) + ' →</a>'
                   : '<span class="cx-btn cx-off">Link coming soon</span>') +
            '</div></div>';
        }).join('') + '</div>';
    }
    html += '</div>';
    show(html);
  }

  function formatBlock(key, title, blurb, fmt, c, cta) {
    var sizes = fmt.sizes || [];
    var firstOk = -1;
    sizes.forEach(function (s, i) { if (firstOk < 0 && orderable(s.status || fmt.status)) firstOk = i; });
    var chips = sizes.map(function (s, i) {
      var st = s.status || fmt.status || 'available';
      var off = !orderable(st);
      return '<button type="button" class="cx-size' + (i === firstOk ? ' on' : '') + (off ? ' off' : '') + '"' +
        (off ? ' disabled' : '') + ' data-size="' + i + '" aria-pressed="' + (i === firstOk) + '">' +
        '<b>' + esc(s.label) + '</b><span>' + (off ? STATUS[st] : money(s.price)) + '</span></button>';
    }).join('');
    var dead = firstOk < 0;
    return '<div class="cx-fmt" data-format="' + key + '">' +
      '<div class="cx-fmt-top"><div class="cx-fmt-h">' + title + '</div>' + badge(fmt.status) + '</div>' +
      '<p class="cx-fmt-p">' + esc(blurb) + '</p>' +
      '<div class="cx-sizes">' + chips + '</div>' +
      '<button type="button" class="cx-btn cx-cart"' + (dead ? ' disabled' : '') + ' data-add="' + key + '">' +
      (dead ? (STATUS[fmt.status] || 'Unavailable') : cta) + '</button></div>';
  }

  /* ---- cart hook ---- */
  function addToCart(key, sizeIdx) {
    var e = state.estate, c = state.coffee;
    var fmt = c.formats[key], s = fmt.sizes[sizeIdx];
    var item = { estate: e.name, coffee: c.name, coffeeId: c.id, format: key, size: s.label, price: s.price };
    if (window.KuyilCart && typeof window.KuyilCart.add === 'function') {
      window.KuyilCart.add(item);
      return;
    }
    close();
    window.openModal('Roasted coffee');
    var msg = document.getElementById('i-msg');
    if (msg) msg.value = 'I’d like to order: ' + c.name + ' (' + e.name + '), ' +
      (key === 'green' ? 'green coffee, ' : 'roasted, ') + s.label + '.';
  }

  /* ---- open / close ---- */
  function open(id) {
    var e = findEstate(id);
    if (!e) return;
    lastFocus = document.activeElement;
    estateView(e);
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('cxClose').focus();
  }
  function close() {
    ov.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  grid.addEventListener('click', function (ev) {
    var card = ev.target.closest('.pcard-open');
    if (card) open(card.getAttribute('data-estate'));
  });
  grid.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList.contains('pcard-open')) {
      ev.preventDefault(); open(ev.target.getAttribute('data-estate'));
    }
  });

  ov.addEventListener('click', function (ev) {
    if (ev.target === ov) return close();
    var t;
    if ((t = ev.target.closest('.cx-ccard'))) {
      return coffeeView(state.estate, findCoffee(state.estate, t.getAttribute('data-coffee')));
    }
    if ((t = ev.target.closest('.cx-size'))) {
      if (t.disabled) return;
      Array.prototype.forEach.call(t.parentNode.children, function (b) {
        b.classList.toggle('on', b === t); b.setAttribute('aria-pressed', b === t);
      });
      return;
    }
    if ((t = ev.target.closest('[data-add]'))) {
      var sel = t.closest('.cx-fmt').querySelector('.cx-size.on');
      return addToCart(t.getAttribute('data-add'), sel ? +sel.getAttribute('data-size') : 0);
    }
    if ((t = ev.target.closest('[data-ask]'))) {
      ev.preventDefault();
      var what = t.getAttribute('data-ask');
      close(); window.openModal('Roasted coffee');
      var msg = document.getElementById('i-msg');
      if (msg) msg.value = 'I’d like to hear more about: ' + what + '.';
    }
  });
  document.getElementById('cxClose').addEventListener('click', close);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && ov.classList.contains('active')) close();
  });
})();
