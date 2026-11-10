/* Kuyil Origins — Shop Coffee tiles (data: coffee-data.js -> KUYIL_SHOP). See notes there for Stripe. */
(function () {
  var cat = window.KUYIL_CATALOG, shop = window.KUYIL_SHOP;
  var grid = document.getElementById('shopGrid');
  if (!cat || !shop || !grid) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function find(id) {
    for (var i = 0; i < cat.estates.length; i++) {
      for (var k = 0; k < cat.estates[i].coffees.length; k++) {
        if (cat.estates[i].coffees[k].id === id) return { e: cat.estates[i], c: cat.estates[i].coffees[k] };
      }
    }
    return null;
  }

  function buy(o) {
    if (!o) return '';
    var live = o.status === 'available' && o.checkoutUrl;
    if (o.type === 'partner') {
      var who = o.roaster || 'our partner roaster';
      return '<div class="sp-price">Partner roaster</div>' + (live
        ? '<a class="btn btn-sm btn-solid" href="' + esc(o.checkoutUrl) + '" target="_blank" rel="noopener">Buy from ' + esc(who) + ' &rarr;</a>'
        : '<span class="btn btn-sm sp-off" aria-disabled="true">Coming Soon</span>');
    }
    var price = o.price != null ? '<div class="sp-price">$' + o.price + '</div>' : '';
    return price + (live
      ? '<a class="btn btn-sm btn-solid" href="' + esc(o.checkoutUrl) + '">Buy Now</a>'
      : '<span class="btn btn-sm sp-off" aria-disabled="true">Coming Soon</span>');
  }

  function cardHTML(f, p) {
    if (p.card && p.photo) {
      var k = p.card;
      return '<div class="sp-card">' +
        '<div class="spc-txt">' +
          '<div class="spc-estate">' + esc(f.e.name) + '</div>' +
          '<div class="spc-place">' + esc(k.place) + '</div>' +
          '<div class="spc-spec">' + esc(k.spec) + '</div>' +
          '<div class="spc-rule"></div>' +
          '<div class="spc-h">In the cup</div>' +
          '<div class="spc-notes">' + esc(k.notes) + '</div>' +
          '<div class="spc-feel">' + esc(k.feel) + '</div>' +
        '</div>' +
        '<div class="spc-photo"><img src="' + esc(p.photo) + '" alt="' + esc(f.e.name) + '" loading="lazy" decoding="async"></div>' +
        '</div>';
    }
    if (p.image) return '<img src="' + esc(p.image) + '" alt="' + esc(f.c.name + ', ' + f.e.name) + '" loading="lazy" decoding="async">';
    return '<div class="sp-ph" aria-hidden="true"><img src="assets/label-mark-maroon.svg" alt=""></div>';
  }

  grid.innerHTML = shop.order.map(function (id) {
    var f = find(id), p = shop.products[id] || {};
    if (!f) return '';
    return '<article class="sp" data-coffee="' + esc(id) + '">' +
      '<div class="sp-img' + ((p.card && p.photo) || p.image ? ' has-img' : '') + '">' + cardHTML(f, p) + '</div>' +
      '<div class="sp-kicker">' + esc(f.e.name) + '</div>' +
      '<h3>' + esc(f.c.name) + '</h3>' +
      '<div class="sp-proc">' + esc(f.c.process) + '</div>' +
      '<button type="button" class="sp-view" data-open="' + esc(id) + '">View details &amp; buy</button>' +
      '<a class="sp-learn" href="producers.html#' + esc(f.e.id) + '">Learn more about the estate</a>' +
      '</article>';
  }).join('');

  /* ---------- pop-out window ---------- */
  var ov = document.createElement('div');
  ov.className = 'sp-ov'; ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = '<div class="sp-modal" role="dialog" aria-modal="true" aria-label="Coffee details" tabindex="-1">' +
    '<button type="button" class="sp-x" aria-label="Close">&times;</button><div class="sp-mbody"></div></div>';
  document.body.appendChild(ov);
  var modal = ov.querySelector('.sp-modal'), mbody = ov.querySelector('.sp-mbody'), lastFocus = null, cur = null;

  function renderModal(id, optIdx) {
    var f = find(id), p = shop.products[id] || {}, options = p.options || [];
    cur = { id: id, i: optIdx || 0 };
    var chips = options.map(function (o, i) {
      return '<button type="button" class="sp-opt' + (i === cur.i ? ' on' : '') + '" data-i="' + i + '" aria-pressed="' + (i === cur.i) + '">' + esc(o.label) + '</button>';
    }).join('');
    var c = f.c, notes = (c.notes || []).join(' · ');
    mbody.innerHTML =
      '<div class="spm-pic">' + cardHTML(f, p) + '</div>' +
      '<div class="spm-info">' +
        '<div class="sp-kicker">' + esc(f.e.name) + '</div>' +
        '<h2>' + esc(c.name) + '</h2>' +
        '<div class="spm-proc">' + esc(c.process) + (c.variety ? ' &middot; ' + esc(c.variety) : '') + '</div>' +
        (c.story ? '<p class="spm-story">' + esc(c.story) + '</p>' : '') +
        (notes ? '<div class="spm-notes"><span>In the cup</span>' + esc(notes) + '</div>' : '') +
        (chips ? '<div class="spm-label">Choose your size</div><div class="sp-opts">' + chips + '</div>' : '') +
        '<div class="sp-buy">' + buy(options[cur.i]) + '</div>' +
        '<a class="sp-learn" href="producers.html#' + esc(f.e.id) + '">Learn more about the estate</a>' +
      '</div>';
  }
  function openModal(id, trigger) {
    lastFocus = trigger || document.activeElement;
    renderModal(id, 0);
    ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('sp-lock');
    ov.scrollTop = 0; mbody.scrollTop = 0; modal.focus();
  }
  function closeModal() {
    ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('sp-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  grid.addEventListener('click', function (ev) {
    if (ev.target.closest('a')) return;
    var art = ev.target.closest('.sp');
    if (art) openModal(art.getAttribute('data-coffee'), art.querySelector('.sp-view'));
  });
  ov.addEventListener('click', function (ev) {
    if (ev.target === ov || ev.target.closest('.sp-x')) return closeModal();
    var b = ev.target.closest('.sp-opt');
    if (b && cur) renderModal(cur.id, +b.getAttribute('data-i'));
  });
  document.addEventListener('keydown', function (ev) {
    if (!ov.classList.contains('open')) return;
    if (ev.key === 'Escape') return closeModal();
    if (ev.key === 'Tab') {
      var f = ov.querySelectorAll('button,a[href]'); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && (document.activeElement === first || document.activeElement === modal)) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
})();
