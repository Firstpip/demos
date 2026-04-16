// SafeWorks 랜딩페이지 제안서 PDF 생성
// 1) 데모 스크린샷 캡처 → screenshots/
// 2) proposal-page.html을 PDF로 변환 → SafeWorks_랜딩페이지_제안서.pdf
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const SCREENSHOTS = path.join(ROOT, 'screenshots');
const DEMO_BASE = process.env.DEMO_BASE || 'http://localhost:8765';
const HTML_PATH = path.join(ROOT, 'proposal-page.html');
const PDF_PATH = path.join(ROOT, 'SafeWorks_랜딩페이지_제안서.pdf');

fs.mkdirSync(SCREENSHOTS, { recursive: true });

// 데모 소개 규칙: 반응형(태블릿+모바일) 제외하고는 모두 PC 뷰포트(1440x900) 디폴트로 캡처
const captures = [
  { url: '/index.html', viewport: { width: 1440, height: 900 }, name: 'main-hero' },
  { url: '/index.html', viewport: { width: 1440, height: 900 }, name: 'main-partners', selector: '#section-partners' },
  { url: '/index.html', viewport: { width: 1440, height: 900 }, name: 'main-features', selector: '#section-features' },
  { url: '/index.html', viewport: { width: 1440, height: 900 }, name: 'main-pricing', selector: '#section-pricing' },
  { url: '/index.html', viewport: { width: 1440, height: 900 }, name: 'main-cases', selector: '#section-cases' },
  { url: '/index.html', viewport: { width: 1440, height: 900 }, name: 'main-floating', scrollTop: 700 },
  { url: '/service/', viewport: { width: 1440, height: 900 }, name: 'service-values' },
  { url: '/pricing/', viewport: { width: 1440, height: 900 }, name: 'pricing-compare' },
  { url: '/resources/', viewport: { width: 1440, height: 900 }, name: 'resources' },
  { url: '/support/', viewport: { width: 1440, height: 900 }, name: 'support-faq' },
  // 반응형만 예외
  { url: '/index.html', viewport: { width: 768, height: 1024 }, name: 'responsive-tablet' },
  { url: '/index.html', viewport: { width: 375, height: 800 }, name: 'responsive-mobile' },
];

async function captureAll(browser) {
  for (const c of captures) {
    const page = await browser.newPage();
    await page.setViewport(c.viewport);
    try {
      await page.goto(`${DEMO_BASE}${c.url}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500));
      // hide footer for screenshots that aren't full-page
      if (!c.fullPage && !c.selector) {
        await page.evaluate(() => {
          const f = document.querySelector('#site-footer'); if (f) f.style.display = 'none';
        });
      }
      const file = path.join(SCREENSHOTS, `${c.name}.png`);
      if (c.selector) {
        await page.evaluate(sel => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), c.selector);
        await new Promise(r => setTimeout(r, 600));
        const el = await page.$(c.selector);
        if (el) await el.screenshot({ path: file });
      } else if (c.clip) {
        await page.screenshot({ path: file, clip: c.clip });
      } else if (c.fullPage) {
        await page.screenshot({ path: file, fullPage: true });
      } else if (typeof c.scrollTop === 'number') {
        await page.evaluate(y => window.scrollTo(0, y), c.scrollTop);
        await new Promise(r => setTimeout(r, 800));
        await page.screenshot({ path: file });
      } else {
        await page.screenshot({ path: file });
      }
      console.log(`✓ captured ${c.name}`);
    } catch (e) {
      console.error(`✗ ${c.name}: ${e.message}`);
    }
    await page.close();
  }
}

async function generatePdf(browser) {
  const page = await browser.newPage();
  // A4 가로 297mm x 210mm
  await page.setViewport({ width: 1400, height: 990, deviceScaleFactor: 2 });
  await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await page.close();
  console.log(`✓ PDF saved: ${PDF_PATH}`);
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    await captureAll(browser);
    await generatePdf(browser);
  } finally {
    await browser.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
