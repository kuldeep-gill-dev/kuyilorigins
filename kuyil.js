/* Kuyil Origins — shared behaviour: inquiry modal + Formspree submit */
(function () {
  var ov = document.getElementById('ov');
  var form = document.getElementById('ef');
  if (!ov) return;

  window.openModal = function (preset, ctx) {
    ov.classList.add('active');
    // ctx = { estate, coffee, lot, request, message } -- tags the inquiry with exactly what was asked about
    ['estate', 'coffee', 'lot', 'request_type'].forEach(function (n) {
      var el = form && form.querySelector('[name="' + n + '"]');
      if (el) el.value = ctx ? (ctx[n === 'request_type' ? 'request' : n] || '') : '';
    });
    var line = document.getElementById('ctxLine');
    if (line) {
      line.textContent = ctx ? [ctx.request, ctx.coffee, ctx.estate].filter(Boolean).join(' \u00b7 ') : '';
      line.style.display = ctx ? 'block' : 'none';
    }
    var picks = ov.querySelectorAll('.pk input');
    Array.prototype.forEach.call(picks, function (p) {
      p.checked = !!(ctx && ctx.coffee && p.getAttribute('data-name') === ctx.coffee);
    });
    var msgEl = document.getElementById('i-msg');
    if (msgEl && ctx && ctx.message != null) msgEl.value = ctx.message;
    document.body.style.overflow = 'hidden';
    if (preset) {
      var sel = ov.querySelector('select[name="enquiry_type"]');
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text === preset) { sel.selectedIndex = i; break; }
        }
      }
    }
  };

  window.closeModal = function () {
    ov.classList.remove('active');
    document.body.style.overflow = '';
  };

  ov.addEventListener('click', function (e) { if (e.target === this) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hid = form.querySelector('#coffeesField');
    if (hid) {
      hid.value = Array.prototype.filter.call(form.querySelectorAll('.pk input'), function (i) { return i.checked; })
        .map(function (i) { return i.value; }).join(', ');
    }
    var btn = form.querySelector('.send');
    if (btn && !btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (r) {
      if (r.ok) {
        form.style.display = 'none';
        document.getElementById('ok').style.display = 'block';
      } else {
        fail(btn);
      }
    }).catch(function () { fail(btn); });
  });

  function fail(btn) {
    if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-label') || 'Send Inquiry'; }
    alert('Something went wrong. Please try again, or email hello@kuyilorigins.com directly.');
  }
})();

/* Transparent-over-hero nav: solidify once scrolled */
(function () {
  var nav = document.querySelector('.nav.nav-overlay');
  if (!nav) return;
  function update() {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* Mobile nav menu toggle */
(function () {
  var nav = document.querySelector('.nav');
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('.nav-links');
  if (!nav || !toggle || !links) return;

  function setOpen(open) {
    toggle.classList.toggle('open', open);
    links.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setOpen(!links.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1000) setOpen(false);
  });
})();

/* Editorial carousels — Care, In Practice / The Mark */
function initEditorialCarousel(ids) {
  var viewport = document.getElementById(ids.viewport);
  var track = document.getElementById(ids.track);
  var counter = document.getElementById(ids.counter);
  var prevBtn = document.getElementById(ids.prev);
  var nextBtn = document.getElementById(ids.next);
  if (!viewport || !track || !counter) return;

  var slides = Array.prototype.slice.call(track.children);
  var total = slides.length;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function setActive(i) {
    counter.innerHTML = pad(i + 1) + '<span class="sep">&#47;</span>' + pad(total);
  }

  function current() {
    var left = viewport.scrollLeft, idx = 0, best = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.offsetLeft - left);
      if (d < best) { best = d; idx = i; }
    });
    return idx;
  }

  function goTo(i) {
    i = Math.max(0, Math.min(total - 1, i));
    viewport.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
  }

  var AUTO_MS = 8000;
  var autoTimer = null;

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      var next = current() + 1;
      if (next >= total) next = 0;
      goTo(next);
    }, AUTO_MS);
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current() - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current() + 1); startAuto(); });

  // Hovering (mouse) pauses autoplay and resumes when the cursor leaves --
  // a natural "reading" pause on desktop. On touch there's no equivalent
  // "still there" signal, so a tap/swipe stops autoplay for good instead
  // of silently resuming a moment later while someone is mid-read.
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);
  viewport.addEventListener('touchstart', stopAuto, { passive: true, once: true });

  var scrollTimer;
  viewport.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () { setActive(current()); }, 80);
  });

  setActive(0);
  startAuto();
}

initEditorialCarousel({
  viewport: 'careViewport', track: 'careTrack',
  prev: 'carePrev', next: 'careNext', counter: 'careCounter'
});
initEditorialCarousel({
  viewport: 'markViewport', track: 'markTrack',
  prev: 'markPrev', next: 'markNext', counter: 'markCounter'
});


/* Home page: the menu bar appears once the visitor scrolls a little */
(function () {
  var nav = document.querySelector('.nav.nav-home');
  if (!nav) return;
  function update() { nav.classList.toggle('is-visible', window.scrollY > 40); }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();


/* Roasters page: the photograph carousel rotates by itself */
(function () {
  var stage = document.getElementById('hpStage');
  if (!stage) return;
  var slides = stage.querySelectorAll('.hp-slide');
  if (slides.length < 2) return;
  var cap = document.getElementById('hpCap');
  var dotsEl = document.getElementById('hpDots');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0, timer = null, dots = [];
  function load() {
    Array.prototype.forEach.call(slides, function (s) {
      var d = s.getAttribute('data-src');
      if (d) { s.src = d; s.removeAttribute('data-src'); }
    });
  }
  function show(n) {
    i = (n + slides.length) % slides.length;
    Array.prototype.forEach.call(slides, function (s, k) { s.classList.toggle('is-active', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', k === i); });
    cap.classList.add('swap');
    setTimeout(function () { cap.innerHTML = slides[i].getAttribute('data-cap'); cap.classList.remove('swap'); }, 350);
  }
  function start() { if (reduce || timer) return; timer = setInterval(function () { show(i + 1); }, 6500); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  Array.prototype.forEach.call(slides, function (s, k) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'hp-dot' + (k === 0 ? ' on' : ''); b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Photograph ' + (k + 1));
    b.addEventListener('click', function () { stop(); show(k); start(); });
    dotsEl.appendChild(b); dots.push(b);
  });
  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  if (document.readyState === 'complete') load(); else window.addEventListener('load', load);
  start();
})();
