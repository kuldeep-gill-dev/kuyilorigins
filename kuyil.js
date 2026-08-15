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
