// axe-core/puppeteer로 핵심 경로 6개 a11y 검사
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const BASE = process.env.BASE_URL || 'http://localhost:4943';
const STORAGE_KEY = 'kmong225943:auth';
const PRESETS = {
  guest:   { userId: 'user-guest',     role: 'guest' },
  member:  { userId: 'user-member-1',  role: 'member' },
  partner: { userId: 'user-partner-2', role: 'partner' },
  admin:   { userId: 'user-admin-1',   role: 'admin' },
};
const ROUTES = [
  { url: '/',                                          role: 'guest' },
  { url: '/products/',                                 role: 'guest' },
  { url: '/products/oakhaus-dining-table-1800/',       role: 'guest' },
  { url: '/account/orders/order-DEMO-S02/',            role: 'member' },
  { url: '/admin/',                                    role: 'admin' },
  { url: '/admin/cms/partner/raonwood/',               role: 'partner' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  let totalViolations = 0;
  const summary = [];
  for (const r of ROUTES) {
    await page.evaluate((key, val) => sessionStorage.setItem(key, val), STORAGE_KEY, JSON.stringify(PRESETS[r.role]));
    await page.goto(BASE + r.url, { waitUntil: 'networkidle0' });
    await new Promise(res => setTimeout(res, 600));
    const results = await new AxePuppeteer(page).analyze();
    const v = results.violations;
    totalViolations += v.length;
    summary.push({ url: r.url, role: r.role, violations: v.length, ids: v.map(x => `${x.id}(${x.nodes.length})`) });
    console.log(`[${r.role.padEnd(7)}] ${v.length} violation(s)  ${r.url}`);
    for (const x of v) console.log(`    - ${x.id} (impact=${x.impact}, nodes=${x.nodes.length})`);
  }
  await browser.close();
  console.log(`---\nTotal violations across ${ROUTES.length} routes: ${totalViolations}`);
  require('fs').writeFileSync('axe-results.json', JSON.stringify(summary, null, 2));
  process.exit(totalViolations === 0 ? 0 : 1);
})();
