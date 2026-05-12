const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const BASE = process.env.BASE_URL || 'http://localhost:4943';
const STORAGE_KEY = 'kmong225943:auth';
const PRESETS = {
  guest:   { userId: 'user-guest',     role: 'guest' },
  member:  { userId: 'user-member-1',  role: 'member' },
  partner: { userId: 'user-partner-2', role: 'partner' },
};
const TARGETS = [
  { url: '/products/oakhaus-dining-table-1800/', role: 'guest',   only: ['aria-prohibited-attr', 'nested-interactive'] },
  { url: '/account/orders/order-DEMO-S02/',      role: 'member',  only: ['landmark-complementary-is-top-level'] },
  { url: '/admin/cms/partner/raonwood/',         role: 'partner', only: ['heading-order'] },
];
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  for (const t of TARGETS) {
    await page.evaluate((k, v) => sessionStorage.setItem(k, v), STORAGE_KEY, JSON.stringify(PRESETS[t.role]));
    await page.goto(BASE + t.url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const results = await new AxePuppeteer(page).analyze();
    for (const v of results.violations) {
      if (!t.only.includes(v.id)) continue;
      console.log(`\n=== ${t.url}  -  ${v.id}`);
      console.log('help:', v.helpUrl);
      v.nodes.forEach((n, i) => {
        console.log(`  [${i}] selector: ${n.target.join(' >> ')}`);
        console.log(`      html: ${n.html.slice(0, 240)}`);
        n.failureSummary && console.log(`      fail: ${n.failureSummary.split('\n').slice(0,3).join(' | ')}`);
      });
    }
  }
  await browser.close();
})();
