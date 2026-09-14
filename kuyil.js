/* Kuyil Origins — shared behaviour: inquiry modal + Formspree submit */
(function () {
  var ov = document.getElementById('ov');
  var form = document.getElementById('ef');
  if (!ov) return;

  window.openModal = function (preset) {
    ov.classList.add('active');
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
    var btn = form.querySelector('.send');
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
    if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }
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
