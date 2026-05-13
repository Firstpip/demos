// 데모 핵심 페이지 + S-01~S-04 시연 시나리오 스크린샷
// 1280x800, screenshots/ 출력, project.json.thumbnail = 01-home.png
// 권한 분기: pages.role(guest/member/partner/admin)에 따라 sessionStorage 시드 후 캡처
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE_URL || 'http://localhost:4943';
const OUT = path.join(__dirname, 'screenshots');
const STORAGE_KEY = 'kmong225943:auth';
const CART_STORAGE_KEY = 'kmong225943:cart';
const PRESETS = {
  guest:   { userId: 'user-guest',     role: 'guest' },
  member:  { userId: 'user-member-1',  role: 'member' },
  partner: { userId: 'user-partner-2', role: 'partner' },
  admin:   { userId: 'user-admin-1',   role: 'admin' },
};
const CART_SEED = [
  { productId: 'prd-oakhaus-dining-table-1800', option: '오크|Q', qty: 1, unitPrice: 1450000 },
  { productId: 'prd-maholn-oak-sofa-3s',         option: '오크|Q', qty: 1, unitPrice: 1890000 },
  { productId: 'prd-raonwood-oak-bed',           option: '오크|Q', qty: 1, unitPrice: 1140000 },
];
const SEED_CART_FILES = new Set(['07-cart.png', '08-checkout.png']);

const pages = [
  { file: '01-home.png',                  url: '/',                                                 role: 'guest' },
  { file: '02-collections.png',           url: '/collections/',                               role: 'guest' },
  { file: '03-collection-detail.png',     url: '/collections/warm-living-26ss/',              role: 'guest' },
  { file: '04-products.png',              url: '/products/',                                  role: 'guest' },
  { file: '05-product-detail.png',        url: '/products/oakhaus-dining-table-1800/',        role: 'guest' },
  { file: '06-search.png',                url: '/search?q=오크',                              role: 'guest' },
  { file: '07-cart.png',                  url: '/cart/',                                      role: 'member' },
  { file: '08-checkout.png',              url: '/checkout/',                                  role: 'member' },
  { file: '09-sign-in.png',               url: '/sign-in/',                                   role: 'guest' },
  { file: '10-sign-up.png',               url: '/sign-up/',                                   role: 'guest' },
  { file: '11-account.png',               url: '/account/',                                   role: 'member' },
  { file: '12-order-detail.png',          url: '/account/orders/order-DEMO-S02/',             role: 'member' },
  { file: '13-rewards.png',               url: '/account/rewards/',                           role: 'member' },
  { file: '14-maholn-home.png',           url: '/maholn/',                                    role: 'guest' },
  { file: '15-maholn-lookbook.png',       url: '/maholn/lookbook/2026-spring/',               role: 'guest' },
  { file: '16-maholn-about.png',          url: '/maholn/about/',                              role: 'guest' },
  { file: '17-admin-dashboard.png',       url: '/admin/',                                     role: 'admin' },
  { file: '18-admin-products.png',        url: '/admin/products/',                            role: 'admin' },
  { file: '19-admin-product-new.png',     url: '/admin/products/new/',                        role: 'admin' },
  { file: '20-admin-orders.png',          url: '/admin/orders/',                              role: 'admin' },
  { file: '21-admin-coupons.png',         url: '/admin/coupons/',                             role: 'admin' },
  { file: '22-admin-users.png',           url: '/admin/users/',                               role: 'admin' },
  { file: '23-admin-cms.png',             url: '/admin/cms/',                                 role: 'admin' },
  { file: '24-admin-cms-partner.png',     url: '/admin/cms/partner/raonwood/',                role: 'partner' },
  { file: '25-admin-delivery-monitor.png',url: '/admin/delivery-monitor/',                    role: 'admin' },
  { file: '26-admin-integrations.png',    url: '/admin/integrations/',                        role: 'admin' },
  { file: '27-admin-brands.png',          url: '/admin/brands/',                              role: 'admin' },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  // 초기 진입: 도메인 컨텍스트 확보 후 sessionStorage 사용 가능
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  let ok = 0, fail = 0, lastRole = null;
  for (const p of pages) {
    const url = BASE + p.url;
    const target = path.join(OUT, p.file);
    try {
      if (p.role !== lastRole) {
        const preset = PRESETS[p.role];
        await page.evaluate((key, val) => {
          sessionStorage.setItem(key, val);
        }, STORAGE_KEY, JSON.stringify(preset));
        lastRole = p.role;
      }
      const r = await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
      if (SEED_CART_FILES.has(p.file)) {
        await page.evaluate((key, val) => {
          sessionStorage.setItem(key, val);
        }, CART_STORAGE_KEY, JSON.stringify(CART_SEED));
        await page.reload({ waitUntil: 'networkidle0', timeout: 45000 });
      }
      const status = r ? r.status() : 0;
      await new Promise(r => setTimeout(r, 900));
      await page.screenshot({ path: target, fullPage: false });
      const stat = fs.statSync(target);
      console.log(`OK  ${status} ${(stat.size/1024).toFixed(0).padStart(4)}K  [${p.role}] ${p.file} <- ${p.url}`);
      ok++;
    } catch (e) {
      console.log(`ERR ${p.file} <- ${p.url} :: ${e.message}`);
      fail++;
    }
  }
  await browser.close();
  console.log(`---\nDone: ${ok} ok / ${fail} fail`);
  process.exit(fail > 0 ? 1 : 0);
})();
