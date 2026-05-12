const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const BASE = 'http://localhost:4943';
const STORAGE_KEY = 'kmong225943:auth';
const PRESETS = {
  guest:   { userId: 'user-guest',     role: 'guest' },
  admin:   { userId: 'user-admin-1',   role: 'admin' },
};
const ROUTES = [
  { url: '/',                                     role: 'guest', max: 6 },
  { url: '/products/',                            role: 'guest', max: 4 },
  { url: '/products/oakhaus-dining-table-1800/',  role: 'guest', max: 3 },
  { url: '/admin/',                               role: 'admin', max: 10 },
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
      v.nodes.slice(0, r.max).forEach((n, i) => {
        const m = n.any && n.any[0] && n.any[0].data;
        const targ = n.target.join(' >> ').slice(0, 130);
        const tag = (n.html.match(/^<\w+[^>]*class="([^"]*)"/) || [,''])[1].slice(0,80);
        console.log(`  ${i}: ${m ? `ratio=${m.contrastRatio} bg=${m.bgColor} fg=${m.fgColor}` : ''} | ${tag}`);
        console.log(`     ${targ}`);
      });
    }
  }
  await browser.close();
})();
