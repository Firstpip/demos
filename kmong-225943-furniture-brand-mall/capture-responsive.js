// 반응형 스크린샷 (태블릿 768 + 모바일 375) — 배포된 GH Pages 데모에서 캡처
const puppeteer = require('/Users/simjeong-gyu/Desktop/outsourcing/bidding/kmong-225711-homepage/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'https://firstpip.github.io/demos/kmong-225943-demo';
const OUT = path.join(__dirname, 'screenshots');

const captures = [
  { file: 'r-tablet-collection.png', url: '/collections/warm-living-26ss/', vw: 768, vh: 1024 },
  { file: 'r-mobile-product.png',    url: '/products/oakhaus-dining-table-1800/', vw: 375, vh: 812 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  for (const c of captures) {
    await page.setViewport({ width: c.vw, height: c.vh, deviceScaleFactor: 2 });
    const target = path.join(OUT, c.file);
    try {
      const r = await page.goto(BASE + c.url, { waitUntil: 'networkidle0', timeout: 45000 });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: target, fullPage: false });
      const stat = fs.statSync(target);
      console.log(`OK  ${r ? r.status() : 0} ${(stat.size/1024).toFixed(0).padStart(4)}K  [${c.vw}x${c.vh}] ${c.file}`);
    } catch (e) {
      console.log(`ERR ${c.file} :: ${e.message}`);
    }
  }
  await browser.close();
})();
