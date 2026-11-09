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

  grid.innerHTML = shop.order.map(function (id) {
    var f = find(id), p = shop.products[id] || {};
    if (!f) return '';
    var options = p.options || [];
    var img;
    if (p.card && p.photo) {
      var k = p.card;
      img = '<div class="sp-card">' +
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
    } else if (p.image) {
      img = '<img src="' + esc(p.image) + '" alt="' + esc(f.c.name + ', ' + f.e.name) + '" loading="lazy" decoding="async">';
    } else {
      img = '<div class="sp-ph" aria-hidden="true"><img src="assets/label-mark-maroon.svg" alt=""></div>';
    }
    var chips = options.map(function (o, i) {
      return '<button type="button" class="sp-opt' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(o.label) + '</button>';
    }).join('');
    return '<article class="sp" data-coffee="' + esc(id) + '">' +
      '<div class="sp-img' + ((p.card && p.photo) || p.image ? ' has-img' : '') + '">' + img + '</div>' +
      '<div class="sp-kicker">' + esc(f.e.name) + '</div>' +
      '<h3>' + esc(f.c.name) + '</h3>' +
      '<div class="sp-proc">' + esc(f.c.process) + '</div>' +
      (chips ? '<div class="sp-opts">' + chips + '</div>' : '') +
      '<div class="sp-buy">' + buy(options[0]) + '</div>' +
      '<a class="sp-learn" href="producers.html#' + esc(f.e.id) + '">Learn more about the estate</a>' +
      '</article>';
  }).join('');

  grid.addEventListener('click', function (ev) {
    var b = ev.target.closest('.sp-opt');
    if (!b) return;
    var card = b.closest('.sp');
    var p = shop.products[card.getAttribute('data-coffee')] || {};
    var o = (p.options || [])[+b.getAttribute('data-i')];
    Array.prototype.forEach.call(card.querySelectorAll('.sp-opt'), function (x) {
      x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b);
    });
    card.querySelector('.sp-buy').innerHTML = buy(o);
  });
})();
