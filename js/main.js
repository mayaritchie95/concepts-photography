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

/* ---- Rotating short testimonials (homepage) ---- */
(function () {
  var rot = document.getElementById('kind-rotator');
  if (!rot) return;
  var items = Array.prototype.slice.call(rot.querySelectorAll('.rot-item'));
  var dotsWrap = document.getElementById('rot-dots');
  if (items.length < 2) return;
  var i = 0, timer = null;

  items.forEach(function (_, idx) {
    var d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', 'Show testimonial ' + (idx + 1));
    if (idx === 0) d.setAttribute('aria-current', 'true');
    d.addEventListener('click', function () { show(idx); restart(); });
    dotsWrap.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function show(n) {
    items[i].classList.remove('is-active');
    dots[i].removeAttribute('aria-current');
    i = (n + items.length) % items.length;
    items[i].classList.add('is-active');
    dots[i].setAttribute('aria-current', 'true');
  }
  function start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () { show(i + 1); }, 5000);
  }
  function stop() { if (timer) clearInterval(timer); }
  function restart() { stop(); start(); }

  rot.addEventListener('mouseenter', stop);
  rot.addEventListener('mouseleave', start);
  start();
})();

/* ---- Year ---- */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.year'), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
