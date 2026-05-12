const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const BASE = 'http://localhost:4943';
const STORAGE_KEY = 'kmong225943:auth';
const PRESETS = {
  guest:   { userId: 'user-guest',     role: 'guest' },
  member:  { userId: 'user-member-1',  role: 'member' },
  partner: { userId: 'user-partner-2', role: 'partner' },
  admin:   { userId: 'user-admin-1',   role: 'admin' },
};
const ROUTES = [
  { url: '/account/orders/order-DEMO-S02/',  role: 'member' },
  { url: '/admin/',                          role: 'admin' },
  { url: '/admin/cms/partner/raonwood/',     role: 'partner' },
];
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  for (const r of ROUTES) {
    await page.evaluate((k, v) => sessionStorage.setItem(k, v), STORAGE_KEY, JSON.stringify(PRESETS[r.role]));
    await page.goto(BASE + r.url, { waitUntil: 'networkidle0' });
    await new Promise(rr => setTimeout(rr, 600));
    const results = await new AxePuppeteer(page).withRules(['color-contrast']).analyze();
    console.log(`\n=== [${r.role}] ${r.url}`);
    for (const v of results.violations) {
      v.nodes.slice(0, 6).forEach((n, i) => {
        console.log(`  ${i}: target=${n.target.join(' >> ')}`);
        console.log(`     html=${n.html.slice(0, 180)}`);
        const m = n.any && n.any[0] && n.any[0].data;
        if (m) console.log(`     bg=${m.bgColor} fg=${m.fgColor} ratio=${m.contrastRatio} font=${m.fontSize}/${m.fontWeight}`);
      });
    }
  }
  await browser.close();
})();
