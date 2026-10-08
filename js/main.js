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

/* ---- Client gallery: login -> view-only gallery + lightbox (demo) ----
   NOTE: this is a front-end demo. The access code is checked in the browser,
   which is fine for a preview but is NOT real security — a secure, per-client
   gallery service is connected before launch. */
(function () {
  var form = document.getElementById('gallery-form');
  if (!form) return;

  // Demo galleries: code -> { name, count }. Images live in images/gallery-demo/proof-NN.jpg
  var DEMO = {
    'SMITH2027': { name: 'Smith Leadership Team', count: 12 }
  };

  var loginSection = document.getElementById('gallery-login-section');
  var viewSection  = document.getElementById('gallery-view');
  var grid         = document.getElementById('proof-grid');
  var clientNameEl = document.getElementById('gallery-client-name');
  var status       = document.getElementById('gallery-status');
  var signout      = document.getElementById('gallery-signout');

  function pad(n){ return (n < 10 ? '0' : '') + n; }

  function openGallery(gal) {
    clientNameEl.textContent = gal.name;
    grid.innerHTML = '';
    for (var i = 1; i <= gal.count; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'proof-cell';
      btn.setAttribute('data-index', i);
      var img = document.createElement('img');
      img.src = 'images/gallery-demo/proof-' + pad(i) + '.jpg';
      img.alt = gal.name + ' — proof ' + i;
      img.setAttribute('draggable', 'false');
      img.loading = 'lazy';
      var num = document.createElement('span');
      num.className = 'pnum';
      num.textContent = pad(i);
      btn.appendChild(img);
      btn.appendChild(num);
      btn.addEventListener('click', (function (idx) { return function () { openLightbox(idx, gal.count); }; })(i));
      grid.appendChild(btn);
    }
    loginSection.hidden = true;
    viewSection.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = (form.elements['gallery-code'].value || '').trim().toUpperCase();
    var gal = DEMO[code];
    if (gal) {
      if (status) status.textContent = '';
      openGallery(gal);
    } else {
      if (status) status.textContent = "That code isn't right. Check the code from your email, or get in touch and Karee will resend it.";
    }
  });

  if (signout) signout.addEventListener('click', function () {
    viewSection.hidden = true;
    loginSection.hidden = false;
    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Lightbox ---- */
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbImg = document.getElementById('lb-img');
  var lbNum = lb.querySelector('.lb-num');
  var cur = 1, total = 0;

  function show(i) {
    cur = i;
    lbImg.src = 'images/gallery-demo/proof-' + pad(i) + '.jpg';
    lbNum.textContent = pad(i) + ' / ' + pad(total);
  }
  function openLightbox(i, count) {
    total = count; show(i); lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() { lb.hidden = true; document.body.style.overflow = ''; }
  function next() { show(cur % total + 1); }
  function prev() { show((cur - 2 + total) % total + 1); }

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-next').addEventListener('click', next);
  lb.querySelector('.lb-prev').addEventListener('click', prev);
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
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
