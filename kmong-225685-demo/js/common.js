// 헤더/푸터 fetch 삽입
async function loadPartial(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    el.innerHTML = await res.text();
  } catch (e) { console.warn('partial load failed', url, e); }
}

async function initLayout() {
  // basePath 자동 감지 (GitHub Pages 대응)
  const path = location.pathname;
  const isSub = /\/(service|pricing|resources|support)\//.test(path);
  const prefix = isSub ? '../partials' : './partials';
  await Promise.all([
    loadPartial('layout-header', `${prefix}/header.html`),
    loadPartial('layout-footer', `${prefix}/footer.html`),
  ]);
  // 모든 내부 링크를 현재 경로에 맞춰 재작성
  rewriteLinks();
  // 현재 페이지 메뉴 활성화
  markActiveMenu();
  // 헤더 스크롤 처리
  initHeaderScroll();
  // 햄버거
  initMobileMenu();
}

function rewriteLinks() {
  const path = location.pathname;
  const isSub = /\/(service|pricing|resources|support)\//.test(path);
  const prefix = isSub ? '..' : '.';
  document.querySelectorAll('a[href^="/"]').forEach(a => {
    const href = a.getAttribute('href');
    if (href.startsWith('//') || href.startsWith('/#')) return;
    if (href === '/index.html') {
      a.setAttribute('href', `${prefix}/index.html`);
    } else {
      a.setAttribute('href', `${prefix}${href}`);
    }
  });
}

function markActiveMenu() {
  const path = location.pathname;
  const map = {
    service: /\/service\//,
    pricing: /\/pricing\//,
    resources: /\/resources\//,
    support: /\/support\//,
  };
  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.getAttribute('data-link');
    if (map[key] && map[key].test(path)) el.classList.add('active');
  });
}

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const floating = document.getElementById('floating-banner');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (floating) floating.classList.toggle('visible', y > 500 && !floating.classList.contains('closed'));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

// Toast
window.toast = function (message, type = 'default') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(20px)';
    t.style.transition = 'opacity .3s, transform .3s';
    setTimeout(() => t.remove(), 300);
  }, 3000);
};

// Video Modal
window.openVideoModal = function (youtubeId) {
  let modal = document.getElementById('video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" id="video-modal-close" aria-label="닫기">✕</button>
        <iframe id="video-modal-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeVideoModal(); });
    document.getElementById('video-modal-close').addEventListener('click', closeVideoModal);
  }
  document.getElementById('video-modal-iframe').src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeVideoModal = function () {
  const modal = document.getElementById('video-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.getElementById('video-modal-iframe').src = '';
  document.body.style.overflow = '';
};

// 플로팅 배너 닫기
window.closeFloating = function () {
  const el = document.getElementById('floating-banner');
  if (el) {
    el.classList.remove('visible');
    el.classList.add('closed');
  }
};

document.addEventListener('DOMContentLoaded', initLayout);
