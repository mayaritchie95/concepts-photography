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

/* ---- Contact form -> mailto ---- */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var get = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
    var name = get('name'), email = get('email'), phone = get('phone'),
        type = get('project_type'), location = get('location'),
        timeframe = get('timeframe'), message = get('message');
    var subject = 'Website inquiry' + (type ? ' \u2014 ' + type : '') + (name ? ' from ' + name : '');
    var body = ['Name: ' + name, 'Email: ' + email, 'Phone: ' + phone,
      'Project type: ' + type, 'Preferred location: ' + location,
      'Timeframe: ' + timeframe, '', 'Message:', message].join('\n');
    window.location.href = 'mailto:kareedavidson@sasktel.net?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    var note = document.getElementById('form-status');
    if (note) note.textContent = 'Opening your email app to send this to Karee. If nothing happens, email kareedavidson@sasktel.net directly.';
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

/* ---- Gallery login (mock) ---- */
(function () {
  var form = document.getElementById('gallery-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = document.getElementById('gallery-status');
    if (status) status.textContent = 'This is a preview. Secure client galleries will be connected before launch — for now, email Karee for your images.';
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
})();

/* ---- Year ---- */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.year'), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
