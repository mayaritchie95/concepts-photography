/* Concepts Photography & Design Inc. — site scripts */

/* ---- Mobile nav ---- */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();

/* ---- Hero: curated image strip with caption + counter (homepage) ---- */
(function () {
  var track = document.getElementById('hero-track');
  if (!track) return;

  var capEl = document.getElementById('hero-cap');
  var countEl = document.getElementById('hero-count');
  var prev = document.getElementById('hero-prev');
  var next = document.getElementById('hero-next');
  var slides = [], captions = [], index = 0, timer = null;

  function pad(n){ return (n < 10 ? '0' : '') + n; }

  function render() {
    if (countEl) countEl.textContent = pad(index + 1) + ' / ' + pad(slides.length);
    if (capEl) capEl.textContent = captions[index] || 'Featured work';
  }

  function build(data) {
    var list = (data && data.slides) || [];
    if (!list.length) { slides = Array.prototype.slice.call(track.children); startAuto(); return; }
    track.innerHTML = '';
    list.forEach(function (item, i) {
      var slide = document.createElement('div');
      slide.className = 'hero-slide';
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || 'Photography by Concepts Photography & Design';
      img.loading = i === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);
      captions.push(item.caption || '');
    });
    slides = Array.prototype.slice.call(track.children);
    render();
    startAuto();
  }

  function go(i) {
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
    render();
  }

  function startAuto() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAuto();
    timer = setInterval(function () { go(index + 1); }, 6000);
  }
  function stopAuto() { if (timer) clearInterval(timer); }

  if (prev) prev.addEventListener('click', function () { go(index - 1); stopAuto(); startAuto(); });
  if (next) next.addEventListener('click', function () { go(index + 1); stopAuto(); startAuto(); });
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  var deb;
  track.addEventListener('scroll', function () {
    clearTimeout(deb);
    deb = setTimeout(function () {
      var nearest = 0, min = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - track.scrollLeft);
        if (d < min) { min = d; nearest = i; }
      });
      index = nearest; render();
    }, 120);
  });

  fetch('js/gallery.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(build)
    .catch(function () { build(null); });
})();

/* ---- Contact form -> Formspree (AJAX, stays on page) ---- */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple required-field check (name, email, project type, message)
    var required = ['name', 'email', 'project_type', 'message'];
    for (var i = 0; i < required.length; i++) {
      var el = form.elements[required[i]];
      if (el && !el.value.trim()) {
        if (status) { status.style.color = ''; status.textContent = 'Please fill in your name, email, what you\u2019re looking for, and a message.'; }
        el.focus();
        return;
      }
    }

    var action = form.getAttribute('action');
    var data = new FormData(form);
    if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
    if (status) { status.style.color = ''; status.textContent = ''; }

    fetch(action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        if (status) status.textContent = 'Thank you \u2014 your inquiry has been sent. Karee will get back to you by email.';
        if (btn) btn.textContent = 'Sent \u2713';
      } else {
        return res.json().then(function (d) {
          var msg = (d && d.errors && d.errors.length) ? d.errors.map(function (x){return x.message;}).join(', ')
            : 'Something went wrong sending your message.';
          throw new Error(msg);
        });
      }
    }).catch(function (err) {
      if (status) status.textContent = (err && err.message ? err.message + ' ' : '') +
        'Please try again, or email kareedavidson@sasktel.net directly.';
      if (btn) { btn.disabled = false; btn.textContent = 'Send inquiry'; }
    });
  });
})();

/* ---- Rotating short testimonials (homepage) — cycles pages of 3 ---- */
(function () {
  var rot = document.getElementById('kind-rotator');
  if (!rot) return;
  var pages = Array.prototype.slice.call(rot.querySelectorAll('.rot-page'));
  var dotsWrap = document.getElementById('rot-dots');
  if (pages.length < 2) return;
  var i = 0, timer = null;

  pages.forEach(function (_, idx) {
    var d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', 'Show testimonials, page ' + (idx + 1));
    if (idx === 0) d.setAttribute('aria-current', 'true');
    d.addEventListener('click', function () { show(idx); restart(); });
    dotsWrap.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function show(n) {
    pages[i].classList.remove('is-active');
    dots[i].removeAttribute('aria-current');
    i = (n + pages.length) % pages.length;
    pages[i].classList.add('is-active');
    dots[i].setAttribute('aria-current', 'true');
  }
  function start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 860px)').matches) return; /* stacked on mobile */
    timer = setInterval(function () { show(i + 1); }, 6000);
  }
  function stop() { if (timer) clearInterval(timer); }
  function restart() { stop(); start(); }

  rot.addEventListener('mouseenter', stop);
  rot.addEventListener('mouseleave', start);
  start();
})();

/* ---- Client gallery: send client to their Pixieset gallery ----
   The client types their gallery name (and password). We build their Pixieset
   gallery URL from the name and send them there. Pixieset confirms the password
   and shows their private, view-only images. Karee manages all galleries in
   Pixieset — no website changes needed per client. */
(function () {
  var form = document.getElementById('gallery-form');
  if (!form) return;

  // Karee's Pixieset base. A gallery named "kristajflint" lives at BASE + "kristajflint/".
  var PIXIESET_BASE = 'https://conceptsphotographydesigninc.pixieset.com/';

  var status = document.getElementById('gallery-status');
  var btn = form.querySelector('button[type="submit"]');
  var nameField = form.elements['gallery-name'];
  var confirmed = false;

  function slugify(raw) {
    return raw.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-]/g, '');
  }

  // If they edit the name after a confirm prompt, reset back to step one.
  nameField.addEventListener('input', function () {
    if (confirmed) {
      confirmed = false;
      if (status) status.textContent = '';
      if (btn) btn.textContent = 'View my gallery';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var raw = (nameField.value || '').trim();

    if (!raw) {
      if (status) status.textContent = 'Please enter your gallery name (it\'s in your email).';
      nameField.focus();
      return;
    }

    var slug = slugify(raw);
    if (!slug) {
      if (status) status.textContent = 'That gallery name doesn\'t look right. Please check your email and try again.';
      nameField.focus();
      nameField.select();
      return;
    }

    // STEP 1 — confirm the name before leaving the site, so a typo is caught here.
    if (!confirmed) {
      confirmed = true;
      if (status) status.textContent = 'Taking you to the \u201C' + slug + '\u201D gallery. Not your gallery? Edit the name above, or click again to continue.';
      if (btn) btn.textContent = 'Continue to my gallery \u2192';
      return;
    }

    // STEP 2 — they confirmed; send them to Pixieset (which checks the password).
    if (status) status.textContent = 'Opening your gallery\u2026';
    if (btn) { btn.disabled = true; btn.textContent = 'Opening\u2026'; }
    window.location.href = PIXIESET_BASE + slug + '/';
  });
})();

/* ---- Client gallery image protection ----
   Disables right-click (context menu), image dragging, and long-press save
   on pages marked <body data-protect="gallery">. This deters casual saving of
   client images. Note: no web protection is absolute, but this covers the
   common ways people grab images. */
(function () {
  if (document.body.getAttribute('data-protect') !== 'gallery') return;

  document.addEventListener('contextmenu', function (e) {
    // Block the right-click menu on images (and everywhere on the gallery, to be safe)
    e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });
  // Discourage long-press "save image" on touch devices
  document.querySelectorAll('img').forEach(function (img) {
    img.setAttribute('draggable', 'false');
    img.style.webkitTouchCallout = 'none';
    img.style.userSelect = 'none';
  });
  // Block the common "save page/image" keyboard shortcut (Ctrl/Cmd+S)
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
    }
  });
})();

/* ---- Year ---- */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.year'), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
