// Features Rolling — Dooray style (좌 이미지 sticky / 우 텍스트 스크롤)
(function () {
  const section = document.getElementById('section-features');
  if (!section) return;
  const items = section.querySelectorAll('.feature-item');
  const slides = section.querySelectorAll('.feature-slide');
  if (!items.length || !slides.length) return;
  const total = items.length;
  let lockUntil = 0;

  function setActive(idx) {
    items.forEach((it, i) => it.classList.toggle('active', i === idx));
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      setActive(idx);
      lockUntil = Date.now() + 1500;
    });
  });

  function onScroll() {
    if (Date.now() < lockUntil) return;
    const itemRects = Array.from(items).map(i => i.getBoundingClientRect());
    const vh = window.innerHeight;
    const focusY = vh * 0.4;
    let bestIdx = 0;
    let bestDist = Infinity;
    itemRects.forEach((r, i) => {
      const center = (r.top + r.bottom) / 2;
      const d = Math.abs(center - focusY);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    });
    setActive(bestIdx);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Stats count-up animation
(function () {
  const items = document.querySelectorAll('.stat-item .stat-num');
  if (!items.length) return;
  const animated = new WeakSet();
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (animated.has(el)) return;
      animated.add(el);
      const text = el.innerText;
      const m = text.match(/-?\d[\d,]*/);
      if (!m) return;
      const final = parseInt(m[0].replace(/,/g, ''), 10);
      const suffix = el.innerHTML.split(m[0])[1] || '';
      const sign = text.trim().startsWith('-') ? -1 : 1;
      const target = Math.abs(final);
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.innerHTML = (sign < 0 ? '-' : '') + val.toLocaleString('ko-KR') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: .5 });
  items.forEach(el => io.observe(el));
})();

// Pricing toggle
(function () {
  const wrap = document.querySelector('.pricing-toggle');
  if (!wrap) return;
  const buttons = wrap.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const billing = btn.dataset.billing;
      document.querySelectorAll('.plan-price[data-monthly]').forEach(el => {
        const val = billing === 'monthly' ? el.dataset.monthly : el.dataset.yearly;
        el.innerHTML = `${val}<span class="plan-price-suffix">원/월/인</span>`;
      });
    });
  });
})();

// Video play
(function () {
  const trigger = document.getElementById('btn-video-play');
  if (!trigger) return;
  const open = () => window.openVideoModal('adbMbfAHlVM');
  trigger.addEventListener('click', open);
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
})();
