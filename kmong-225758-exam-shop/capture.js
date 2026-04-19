const puppeteer = require('/Users/simjeong-gyu/Desktop/outsourcing/bidding/kmong-225711-homepage/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:4758';
const OUT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const HIDE_FOOTER = `
  try {
    const f = document.querySelector('footer');
    if (f) f.style.display = 'none';
  } catch {}
`;

async function capture(page, name, opts = {}) {
  const { width = 1280, height = 900, path: url, setup } = opts;
  await page.setViewport({ width, height });
  await page.goto(BASE + url, { waitUntil: 'networkidle0' });
  if (setup) await setup(page);
  await page.evaluate(HIDE_FOOTER);
  await new Promise(r => setTimeout(r, 300));

  const outPath = path.join(OUT_DIR, `${name}.png`);
  // viewport 캡처 (fullPage 제외) - PDF에서 가독성 확보
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

async function loginAs(page, role) {
  await page.evaluate(r => {
    sessionStorage.setItem(
      'edupress-demo:auth',
      JSON.stringify({ isLoggedIn: true, role: r, userName: '김학생' })
    );
  }, role);
}

async function logoutSession(page) {
  await page.evaluate(() => {
    sessionStorage.removeItem('edupress-demo:auth');
    sessionStorage.removeItem('edupress-demo:cart');
  });
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--lang=ko-KR'] });
  const page = await browser.newPage();

  // === 사용자 영역 ===
  await capture(page, '01-home', { path: '/', height: 950 });

  await capture(page, '02-products', { path: '/products/', height: 950 });

  await capture(page, '03-product-detail', { path: '/products/1/', height: 1000 });

  await capture(page, '04-product-reviews', {
    path: '/products/1/',
    height: 1000,
    setup: async p => {
      await p.evaluate(() => {
        const btn = [...document.querySelectorAll('#product-tabs button')].find(b => b.textContent.includes('후기'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 400));
      await p.evaluate(() => {
        document.querySelector('#product-tabs')?.scrollIntoView({ block: 'start' });
        window.scrollBy(0, -60);
      });
      await new Promise(r => setTimeout(r, 200));
    },
  });

  await capture(page, '05-product-qna', {
    path: '/products/1/',
    height: 1000,
    setup: async p => {
      await p.evaluate(() => {
        const btn = [...document.querySelectorAll('#product-tabs button')].find(b => b.textContent.includes('Q&A'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 300));
      await p.evaluate(() => {
        const first = document.querySelector('#product-qna button');
        if (first) first.click();
      });
      await new Promise(r => setTimeout(r, 200));
      await p.evaluate(() => {
        document.querySelector('#product-tabs')?.scrollIntoView({ block: 'start' });
        window.scrollBy(0, -60);
      });
      await new Promise(r => setTimeout(r, 200));
    },
  });

  // 장바구니 (로그인 + 상품 담기)
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await loginAs(page, 'user');
  await page.evaluate(() => {
    sessionStorage.setItem(
      'edupress-demo:cart',
      JSON.stringify([
        { productId: 1, quantity: 2, selected: true },
        { productId: 9, quantity: 1, selected: true },
        { productId: 21, quantity: 3, selected: true },
      ])
    );
  });
  await capture(page, '06-cart', { path: '/cart/', height: 900 });

  await capture(page, '07-checkout', { path: '/checkout/', height: 1100 });

  // signup/login은 비로그인 상태로 캡처해야 AuthGuard(guestOnly)가 통과
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await logoutSession(page);
  await capture(page, '08-signup', { path: '/signup/', height: 950 });
  await capture(page, '09-login', { path: '/login/', height: 900 });

  // 마이페이지 접근 전 다시 사용자 로그인
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await loginAs(page, 'user');

  await capture(page, '10-mypage-orders', { path: '/mypage/orders/', height: 950 });

  await capture(page, '11-resources', { path: '/resources/', height: 950 });

  await capture(page, '12-faq', { path: '/faq/', height: 950 });

  await capture(page, '13-notice-detail', { path: '/notice/1/', height: 950 });

  // === 관리자 영역 ===
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await loginAs(page, 'admin');

  await capture(page, '20-admin-dashboard', { path: '/admin/', height: 950 });

  await capture(page, '21-admin-products', { path: '/admin/products/', height: 950 });

  await capture(page, '22-admin-orders', { path: '/admin/orders/', height: 950 });

  await capture(page, '23-admin-order-detail', { path: '/admin/orders/1/', height: 1000 });

  await capture(page, '24-admin-members', { path: '/admin/members/', height: 950 });

  await capture(page, '25-admin-reviews', { path: '/admin/reviews/', height: 950 });

  await capture(page, '26-admin-resources', { path: '/admin/resources/', height: 900 });

  await capture(page, '27-admin-notices', {
    path: '/admin/notices/',
    height: 900,
    setup: async p => {
      await p.evaluate(() => {
        const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('공지 등록'));
        if (b) b.click();
      });
      await new Promise(r => setTimeout(r, 400));
    },
  });

  await capture(page, '28-admin-product-edit', { path: '/admin/products/1/', height: 1100 });

  await capture(page, '29-admin-settings', { path: '/admin/settings/', height: 950 });

  // === 반응형 ===
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await capture(page, '30-responsive-tablet', { path: '/', width: 768, height: 1000 });
  await capture(page, '31-responsive-mobile', { path: '/products/1/', width: 375, height: 1000 });

  await browser.close();
  console.log('\nCaptured', fs.readdirSync(OUT_DIR).length, 'screenshots');
}

main().catch(e => { console.error(e); process.exit(1); });
