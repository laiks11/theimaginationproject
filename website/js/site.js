/* The Imagination Project — site interactions */
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var mobile = document.querySelector('.nav-mobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () { mobile.classList.toggle('open'); });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobile.classList.remove('open'); });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!open) { item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
    });
  });

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Scroll-spy table of contents (homepage)
  var toc = document.getElementById('toc');
  if (toc) {
    var hero = document.querySelector('.hero');
    var chips = [].slice.call(toc.querySelectorAll('a'));
    var secs = chips.map(function (c) { return document.querySelector(c.getAttribute('href')); });
    var onScroll = function () {
      var y = window.pageYOffset;
      if (hero && y > hero.offsetHeight - 130) toc.classList.add('show'); else toc.classList.remove('show');
      var activeIdx = -1;
      secs.forEach(function (s, i) {
        if (s && s.getBoundingClientRect().top <= 170) { chips[i].classList.add('seen'); activeIdx = i; }
      });
      chips.forEach(function (c, i) { c.classList.toggle('active', i === activeIdx); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Newsletter placeholder
  document.querySelectorAll('.news-form').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      form.innerHTML = '<p style="color:var(--gold);font-weight:600;margin:6px 0;">Thank you. We will be in touch soon.</p>';
    });
  });

  // Top scroll-progress bar
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    var setBar = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.pageYOffset / h) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', setBar, { passive: true });
    window.addEventListener('resize', setBar);
    setBar();
  }
})();
