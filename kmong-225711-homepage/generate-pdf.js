const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.DEMO_URL || 'http://localhost:3711';
const DEMO_URL = 'https://firstpip.github.io/demos/kmong-225711-demo/';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const PDF_PATH = path.join(__dirname, 'B2B_인터랙티브_기업_홈페이지_제안서.pdf');
const HTML_PATH = path.join(__dirname, 'proposal-page.html');

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// SHOTS — order follows the original Kmong requirement order:
// BI/CI / 기획 / 디자인 / 개발 / 인터랙티브 / 은유적 / 전문성 (showcased through demo pages)
const SHOTS = [
  { id: 'hero', url: '/', label: '메인 — 오로라 그라디언트 히어로', viewport: { w: 1440, h: 900 } },
  { id: 'portfolio-parallax', url: '/portfolio/', label: '포트폴리오 — 3행 작품 그리드', viewport: { w: 1440, h: 900 } },
  { id: 'about-values', url: '/about/', label: '핵심 가치 — 포커스 카드 hover', scrollTo: 'What drives us', scrollExtra: 280, viewport: { w: 1440, h: 900 }, hoverFocusCard: 1 },
  { id: 'cta-home', url: '/', label: '메인 CTA — 인터랙티브 배경 + 타이포 효과', viewport: { w: 1440, h: 900 }, scrollToBottom: true, hoverSweep: true },
];

async function capture() {
  console.log(`📸 Capturing screenshots from ${BASE_URL}`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  for (const s of SHOTS) {
    try {
      const vp = s.viewport ? { width: s.viewport.w, height: s.viewport.h } : { width: 1440, height: 900 };
      await page.setViewport({ ...vp, deviceScaleFactor: 2 });

      await page.goto(`${BASE_URL}${s.url}`, { waitUntil: 'load', timeout: 60000 });
      await new Promise(r => setTimeout(r, 1200));

      await page.addStyleTag({ content: 'footer { display: none !important; }' });

      if (s.scrollTo) {
        await page.evaluate(text => {
          const h = [...document.querySelectorAll('h1, h2, p')].find(x => x.textContent?.includes(text));
          h?.scrollIntoView({ block: 'center' });
        }, s.scrollTo);
        if (s.scrollExtra) {
          await page.evaluate(dy => window.scrollBy(0, dy), s.scrollExtra);
        }
        await new Promise(r => setTimeout(r, s.wait ?? 1500));
      } else if (s.scrollToBottom) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight));
        await new Promise(r => setTimeout(r, s.wait ?? 1500));
      } else {
        await new Promise(r => setTimeout(r, s.wait ?? 1500));
      }

      if (s.hover) {
        await page.mouse.move(s.hover.x, 100);
        await new Promise(r => setTimeout(r, 200));
        await page.mouse.move(s.hover.x, 450, { steps: 10 });
        await new Promise(r => setTimeout(r, 400));
      }

      if (s.hoverFocusCard !== undefined) {
        // Paint focused-card state directly on FocusCards DOM — target card stays sharp with overlay,
        // other cards get blur + scale-down (matches the live hover effect).
        await page.evaluate((focusedIdx) => {
          const grids = [...document.querySelectorAll('.grid')];
          const fc = grids.find(g =>
            g.children.length >= 2 &&
            [...g.children].every(c => c.querySelector('img'))
          );
          if (!fc) return;
          const cards = [...fc.children];
          cards.forEach((card, idx) => {
            const overlay = card.querySelector(':scope > div.absolute');
            if (idx === focusedIdx) {
              card.classList.remove('blur-sm', 'scale-[0.98]');
              if (overlay) { overlay.classList.remove('opacity-0'); overlay.classList.add('opacity-100'); }
            } else {
              card.classList.add('blur-sm', 'scale-[0.98]');
              if (overlay) { overlay.classList.add('opacity-0'); overlay.classList.remove('opacity-100'); }
            }
          });
        }, s.hoverFocusCard);
        await new Promise(r => setTimeout(r, 500));
      }

      if (s.hoverSweep) {
        // Simulate a single mouse swipe — pick ~14 cells along a curved path,
        // newest cells at full color, older cells fading out (like a real hover trail).
        await page.evaluate((vh) => {
          const COLORS = ['#c8ff00', '#00d4ff', '#a855f7', '#ff6b35', '#ffb547'];
          const cells = [...document.querySelectorAll('[data-box-cell]')];
          const cy = vh * 0.55;

          // Trail along the bottom band, below the CTA button — avoids the big title text
          const pts = [];
          const STEPS = 14;
          for (let i = 0; i <= STEPS; i++) {
            const t = i / STEPS;
            const x = 340 + t * 680;
            const y = cy + 220 + Math.sin(t * Math.PI) * 30;
            pts.push({ x, y });
          }

          const hit = new Set();
          const trail = [];
          pts.forEach((pt, idx) => {
            let best = null, bestD = Infinity;
            for (const cell of cells) {
              if (hit.has(cell)) continue;
              const r = cell.getBoundingClientRect();
              const dx = (r.left + r.width / 2) - pt.x;
              const dy = (r.top + r.height / 2) - pt.y;
              const d = dx * dx + dy * dy;
              if (d < bestD) { bestD = d; best = cell; }
            }
            if (best) { hit.add(best); trail.push({ cell: best, idx }); }
          });

          const N = trail.length;
          trail.forEach(({ cell, idx }) => {
            // idx 0 = oldest (dim), idx N-1 = newest (bright)
            const freshness = (idx + 1) / N; // 0.07 .. 1.0
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const aBg = Math.round(freshness * 0.45 * 255).toString(16).padStart(2, '0');
            const aBd = Math.round(freshness * 0.85 * 255).toString(16).padStart(2, '0');
            cell.style.transition = 'none';
            cell.style.backgroundColor = color + aBg;
            cell.style.borderColor = color + aBd;
          });
        }, vp.height);
        await new Promise(r => setTimeout(r, 100));
      }

      const filePath = path.join(SCREENSHOT_DIR, `${s.id}.png`);

      if (s.section) {
        const el = await page.evaluateHandle((text) => {
          if (text) {
            const h = [...document.querySelectorAll('h1, h2')].find(x => x.textContent?.includes(text));
            return h?.closest('section');
          }
          return document.querySelector('main > div > section, main section, section');
        }, s.scrollTo);
        const asEl = el.asElement();
        if (asEl) {
          await asEl.screenshot({ path: filePath });
          console.log(`  ✅ ${s.id}.png (section)`);
          continue;
        }
      }

      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  ✅ ${s.id}.png`);
    } catch (e) {
      console.log(`  ❌ ${s.id}: ${e.message}`);
    }
  }

  await browser.close();
  return SHOTS;
}

async function generatePDF(shots) {
  console.log('\n📄 Generating PDF...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = await buildHTML(shots);
  fs.writeFileSync(HTML_PATH, html);
  console.log(`  ✅ ${HTML_PATH}`);

  await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log(`  ✅ ${PDF_PATH}`);

  await browser.close();
}

function imgToBase64(id) {
  const file = path.join(SCREENSHOT_DIR, `${id}.png`);
  if (!fs.existsSync(file)) return '';
  return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
}

async function buildHTML(shots) {
  const qrDataURL = await QRCode.toDataURL(DEMO_URL, {
    margin: 1,
    width: 400,
    color: { dark: '#050505', light: '#ffffff' },
  });
  // Pages: cover/이해도/경험/계획/스택/데모미리보기/접속
  const TOTAL = 7;
  const pn = (n) => `<div class="pn">${String(n).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}</div>`;

  const splitLabel = (label) => {
    const idx = label.indexOf('—');
    if (idx < 0) return { title: label, desc: '' };
    return { title: label.slice(0, idx).trim(), desc: label.slice(idx + 1).trim() };
  };

  const previewPage = `
    <section class="page">
      <header class="ph"><h1>데모 소개</h1>${pn(6)}</header>
      <div class="phr"></div>
      <p style="font-size:12px; color:#999990; line-height:1.7; margin-bottom:7mm;">
        아래 이미지는 직접 구현한 데모의 페이지 구성·디자인 톤을 보여주는 정지 캡처입니다. 스크롤 트리거·시차 효과·3D 모션·마우스 인터랙션은 정지 이미지로는 전달되지 않습니다. <span style="color:#c8ff00;">다음 페이지의 데모 URL에서 직접 체감해 주세요.</span>
      </p>
      <div class="screen-grid">
        ${shots.map(s => {
          const { title, desc } = splitLabel(s.label);
          return `
          <div class="screen-box">
            <div class="screen-frame"><img src="${imgToBase64(s.id)}" alt="${title}" /></div>
            <div class="screen-title">${title}</div>
            ${desc ? `<div class="screen-desc">${desc}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
    </section>`;

  const accessPageNum = TOTAL;

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>B2B 인터랙티브 기업 홈페이지 제안서</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Pretendard', 'Apple SD Gothic Neo', sans-serif; background: #050505; color: #f5f5f0; -webkit-font-smoothing: antialiased; }
  .page {
    width: 297mm; height: 210mm; padding: 14mm 18mm;
    display: flex; flex-direction: column; position: relative;
    page-break-after: always; background: #050505;
  }
  .page:last-child { page-break-after: avoid; }

  /* Common page header — title left, page-num right, divider below */
  .ph { display: flex; align-items: flex-end; justify-content: space-between; }
  .ph h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
  .pn { font-size: 10px; color: #4a4a5e; font-family: 'Space Grotesk', monospace; letter-spacing: 0.15em; }
  .phr { height: 1px; background: #1a1a1a; margin: 7mm 0 8mm; position: relative; }
  .phr::before { content: ''; position: absolute; left: 0; top: 0; width: 60px; height: 1px; background: #c8ff00; }

  /* Cover — centered */
  .cover { background: linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #050505 100%); justify-content: center; align-items: center; text-align: center; }
  .cover .meta { font-size: 11px; letter-spacing: 0.5em; color: #c8ff00; font-family: 'Space Grotesk', monospace; margin-bottom: 16mm; }
  .cover h1 { font-size: 56px; font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; }
  .cover h1 .accent { color: #c8ff00; }
  .cover .divider { width: 50px; height: 1px; background: #c8ff00; margin: 14mm auto; }
  .cover .subtitle { font-size: 13px; color: #999990; letter-spacing: 0.3em; }
  .cover-foot { position: absolute; bottom: 12mm; left: 18mm; right: 18mm; display: flex; justify-content: space-between; font-size: 9px; color: #4a4a5e; font-family: 'Space Grotesk', monospace; letter-spacing: 0.2em; }

  /* Callout (left-bordered) */
  .callout { padding: 6mm 8mm; border-left: 3px solid #c8ff00; background: #0a0a0a; }
  .callout .k { font-weight: 700; color: #c8ff00; }
  .callout p { font-size: 11.5px; color: #c8c8c0; line-height: 1.65; }
  .callout-warn { padding: 6mm 8mm; border-left: 3px solid #ffb547; background: #1a1408; }
  .callout-warn .k { font-weight: 700; color: #ffb547; }
  .callout-warn p { font-size: 11px; color: #d8d0c0; line-height: 1.6; }

  /* Section block label */
  .sec-h { font-size: 13px; font-weight: 700; margin: 8mm 0 5mm; letter-spacing: -0.01em; color: #f5f5f0; }

  /* Checked requirements 2-col */
  .req-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12mm; }
  .req-2col li { display: flex; align-items: flex-start; padding: 5px 0; font-size: 11px; color: #c8c8c0; line-height: 1.5; list-style: none; }
  .req-2col li::before { content: '✓'; color: #c8ff00; margin-right: 10px; font-weight: 700; flex: 0 0 12px; }

  /* Strength 2x2 */
  .strength { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .strength .item { padding: 5mm 6mm; border: 1px solid #1a1a1a; border-radius: 4px; background: #0a0a0a; }
  .strength .item .name { font-size: 12px; font-weight: 700; color: #f5f5f0; }
  .strength .item .desc { font-size: 10.5px; color: #999990; line-height: 1.6; margin-top: 4px; }

  /* Experience: big card + 연관성 */
  .exp-card { padding: 7mm 8mm; border: 1px solid #1a1a1a; border-radius: 4px; background: #0a0a0a; }
  .exp-card .name { font-size: 16px; font-weight: 700; }
  .exp-card .meta { font-size: 10.5px; color: #999990; margin-top: 5px; letter-spacing: 0.02em; }
  .exp-card .desc { font-size: 11.5px; color: #c8c8c0; line-height: 1.7; margin-top: 12px; }
  .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 14px; }
  .tags .tag { font-size: 10px; padding: 4px 11px; border-radius: 999px; background: #050505; border: 1px solid #1a1a1a; color: #c8c8c0; }
  .relevance { margin-top: 7mm; }
  .relevance li { display: flex; align-items: flex-start; gap: 12px; padding: 5px 0; font-size: 11px; color: #c8c8c0; line-height: 1.55; list-style: none; }
  .relevance li::before { content: '•'; color: #c8ff00; flex: 0 0 8px; padding-top: 1px; }
  .relevance .chip { flex: 0 0 auto; font-size: 9.5px; padding: 3px 9px; border-radius: 4px; background: #c8ff00; color: #050505; font-weight: 700; letter-spacing: 0.05em; }
  .relevance .arr { color: #4a4a5e; padding: 0 4px; }
  .relevance .em { color: #f5f5f0; font-weight: 700; }

  /* Plan: table */
  .plan-intro { font-size: 12px; color: #c8c8c0; line-height: 1.6; margin-bottom: 7mm; }
  .plan-intro b { color: #c8ff00; }
  .plan-table { width: 100%; border-collapse: collapse; margin-bottom: 8mm; font-size: 11px; }
  .plan-table thead th { font-size: 10px; font-weight: 700; color: #c8ff00; text-align: left; padding: 8px 12px; background: #0a0a0a; border-bottom: 1px solid #1a1a1a; letter-spacing: 0.05em; }
  .plan-table td { padding: 9px 12px; color: #c8c8c0; border-bottom: 1px solid #131313; line-height: 1.5; vertical-align: top; }
  .plan-table tr td:first-child { color: #f5f5f0; font-weight: 600; width: 150px; white-space: nowrap; }
  .plan-table tr td:nth-child(2) { color: #f5f5f0; width: 180px; }

  /* Stack: 2x4 */
  .stack-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 6mm; }
  .stack-card { padding: 5mm 6mm; border: 1px solid #1a1a1a; border-radius: 4px; background: #0a0a0a; }
  .stack-card .head { display: flex; align-items: baseline; gap: 10px; }
  .stack-card .area { font-size: 11px; font-weight: 700; color: #c8ff00; letter-spacing: 0.05em; }
  .stack-card .name { font-size: 11.5px; color: #f5f5f0; }
  .stack-card .why { font-size: 10.5px; color: #999990; margin-top: 5px; line-height: 1.6; }

  /* Demo grid */
  .screen-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 6mm 8mm; flex: 1; }
  .screen-box { display: flex; flex-direction: column; }
  .screen-frame { height: 210px; border-radius: 4px; overflow: hidden; background: #0a0a0a; border: 1px solid #1a1a1a; }
  .screen-frame img { width: 100%; height: 210px; object-fit: contain; display: block; }
  .screen-title { font-size: 12px; font-weight: 700; color: #f5f5f0; margin-top: 5mm; text-align: center; }
  .screen-desc { font-size: 10px; color: #999990; margin-top: 3px; text-align: center; line-height: 1.5; }

  /* Interaction libraries (4 cards 2x2) */
  .lib-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 6mm; }
  .lib-card { padding: 0; border: 1px solid #1a1a1a; border-radius: 4px; background: #0a0a0a; overflow: hidden; }
  .lib-card .head { padding: 4mm 6mm; background: #0f0f0a; border-bottom: 1px solid #1a1a1a; font-size: 12px; font-weight: 700; color: #c8ff00; letter-spacing: 0.02em; }
  .lib-card .body { padding: 5mm 6mm; }
  .lib-card .body li { font-size: 10.5px; color: #c8c8c0; padding: 3px 0 3px 14px; position: relative; line-height: 1.55; list-style: none; }
  .lib-card .body li::before { content: '•'; color: #c8ff00; position: absolute; left: 0; top: 3px; }
  .lib-card .foot { padding: 3mm 6mm; border-top: 1px solid #131313; font-size: 9.5px; color: #666660; }

  /* Demo access */
  .access { display: grid; grid-template-columns: 1.6fr 1fr; gap: 12mm; }
  .url-label { font-size: 11px; font-weight: 700; color: #f5f5f0; margin-bottom: 4mm; }
  .url-box { padding: 5mm 6mm; border-left: 3px solid #c8ff00; background: #0a0a0a; margin-bottom: 8mm; }
  .url-box a { font-size: 12.5px; color: #c8ff00; text-decoration: underline; word-break: break-all; }
  .step-label { font-size: 11px; font-weight: 700; color: #f5f5f0; margin-bottom: 4mm; }
  .steps { list-style: none; }
  .steps li { display: flex; gap: 14px; padding: 5px 0; align-items: flex-start; }
  .steps .num { flex: 0 0 26px; height: 26px; border-radius: 999px; background: #c8ff00; color: #050505; font-size: 10.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', monospace; }
  .steps .txt strong { font-size: 11.5px; display: block; line-height: 1.4; color: #f5f5f0; }
  .steps .txt span { font-size: 10px; color: #666660; line-height: 1.5; }
  .qr-box { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .qr-box img { width: 130px; height: 130px; background: #fff; padding: 5px; border-radius: 4px; }
  .qr-cap { font-size: 10px; color: #999990; margin-top: 8px; }
  .flow { margin-top: 6mm; padding: 5mm 6mm; border-top: 1px solid #1a1a1a; }
  .flow .lbl { font-size: 11px; font-weight: 700; color: #f5f5f0; margin-bottom: 4mm; }
  .flow .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .flow .row { font-size: 10.5px; color: #c8c8c0; padding: 3px 0; line-height: 1.5; }
  .flow .row b { color: #c8ff00; font-weight: 700; }
</style>
</head>
<body>

<!-- 1. Cover -->
<section class="page cover">
  <div class="meta">P R O P O S A L</div>
  <h1>B2B 인터랙티브<br><span class="accent">기업 홈페이지 구축</span></h1>
  <div class="divider"></div>
  <div class="subtitle">제 안 서</div>
  <div class="cover-foot">
    <div>PROPOSAL</div>
    <div>kmong-225711</div>
  </div>
</section>

<!-- 2. Understanding -->
<section class="page">
  <header class="ph"><h1>프로젝트 이해도</h1>${pn(2)}</header>
  <div class="phr"></div>
  <div class="callout">
    <p><span class="k">의뢰 핵심:</span> 정보통신 B2B 전문 서비스 기업의 하이엔드 인터랙티브 홈페이지를 BI/CI 구축부터 기획·UI/UX 디자인·반응형 풀스택 개발까지 턴키 방식으로 구축합니다. 절제·미니멀·은유적 톤을 기준으로 다크 베이스 + 라임 액센트의 일관된 브랜드 톤을 완성합니다.</p>
  </div>

  <div class="sec-h">주요 요구사항</div>
  <ul class="req-2col">
    <li>BI/CI 구축 - 브랜드 로고 + 디자인 시스템 제작</li>
    <li>하이엔드 감성, 세련되고 전문적인 분위기</li>
    <li>홈페이지 상세 기획 (은유적 표현 기법 활용)</li>
    <li>스크롤 인터랙션 및 인터랙티브 요소 도입</li>
    <li>UI/UX 디자인</li>
    <li>은유적/상징적 텍스트 및 이미지 배치</li>
    <li>인터랙티브 요소 포함 반응형 웹 개발 (턴키)</li>
    <li>기업 전문성 + 포트폴리오 강조 레이아웃</li>
  </ul>

  <div class="sec-h">핵심 역량</div>
  <div class="strength">
    <div class="item"><div class="name">구현 능력 증빙 데모 보유</div><div class="desc">직접 구축한 풀스택 인터랙티브 데모를 제공합니다. 말이 아닌 실제 동작하는 결과물로 이런 수준의 인터랙션을 구현할 수 있음을 증빙합니다.</div></div>
    <div class="item"><div class="name">하이엔드 모션 구현 경험</div><div class="desc">스크롤 트리거, 시차 효과, 3D 모션, 마우스 인터랙션 등 하이엔드 인터랙션을 페이지 전반에 구현한 경험이 있습니다.</div></div>
    <div class="item"><div class="name">기획·디자인·개발 통합 수행</div><div class="desc">디자이너와 개발자가 한 팀으로 BI/CI부터 개발까지 일관된 톤으로 진행하여 커뮤니케이션 비용을 최소화합니다.</div></div>
    <div class="item"><div class="name">레퍼런스 톤 매칭</div><div class="desc">절제된 다크 톤 + 라임 액센트 디자인 시스템 운영 경험. 하이엔드 레퍼런스 수준의 마감 품질을 목표합니다.</div></div>
  </div>
</section>

<!-- 3. Experience -->
<section class="page">
  <header class="ph"><h1>유사 경험</h1>${pn(3)}</header>
  <div class="phr"></div>

  <div class="exp-card">
    <div class="name">인터랙티브 기업 홈페이지 데모</div>
    <div class="meta">2026 / 기획 + 디자인 + 개발 통합 수행 — 구현 능력 증빙용</div>
    <div class="desc">직접 구축한 6 페이지 풀스택 인터랙티브 기업 홈페이지 데모. 스크롤 트리거, 시차 효과, 3D 모션, 마우스 인터랙션, 스티키 리빌, 타임라인 등 하이엔드 인터랙션을 다크 + 라임 톤에 맞춰 페이지 전반에 통일감 있게 구현 가능함을 보여주는 사례입니다.</div>
    <div class="tags">
      <span class="tag">Next.js 16</span><span class="tag">React 19</span><span class="tag">TypeScript</span>
      <span class="tag">Tailwind v4</span><span class="tag">Framer Motion</span><span class="tag">GSAP</span>
      <span class="tag">Lenis</span>
    </div>
  </div>

  <div class="sec-h">B2B 인터랙티브 홈페이지 관점에서의 연관성</div>
  <ul class="relevance">
    <li><span class="chip">디자인 시스템</span><span class="arr">&gt;</span><span>다크 + 라임 토큰 + Pretendard/Space Grotesk 타이포 시스템 직접 운영 -&gt; <span class="em">BI/CI 디자인 시스템 구축에 직접 활용</span></span></li>
    <li><span class="chip">인터랙션</span><span class="arr">&gt;</span><span>스크롤 트리거, 시차 효과, 3D 모션, 마우스 인터랙션 등 페이지 전반 적용 경험 -&gt; <span class="em">스크롤 인터랙션 및 인터랙티브 요소 요구사항 충족</span></span></li>
    <li><span class="chip">은유적 기획</span><span class="arr">&gt;</span><span>추상 메시지 + 상징 비주얼 기획 직접 수행 -&gt; <span class="em">은유적 표현 기법 동일 패턴 적용</span></span></li>
    <li><span class="chip">반응형</span><span class="arr">&gt;</span><span>데스크탑/태블릿(768px)/모바일(375px) 풀 대응, 깨짐 검수 자동화 -&gt; <span class="em">인터랙티브 반응형 웹 개발 검증된 워크플로우</span></span></li>
    <li><span class="chip">포트폴리오</span><span class="arr">&gt;</span><span>시차 효과 + 3D 카드 기반 작품 강조 레이아웃 구현 경험 -&gt; <span class="em">기업 전문성 + 포트폴리오 강조 동일 구조</span></span></li>
    <li><span class="chip">턴키 수행</span><span class="arr">&gt;</span><span>패키지 디자인 에디터 쇼핑몰(2025.01-06) 6개월 통합 수행 경험 -&gt; <span class="em">기획+디자인+개발 턴키 방식 수행 능력 증빙</span></span></li>
  </ul>
</section>

<!-- 4. Plan / Timeline -->
<section class="page">
  <header class="ph"><h1>구현 계획</h1>${pn(4)}</header>
  <div class="phr"></div>

  <div class="plan-intro">총 <b>9주(63일)</b> 일정으로 BI/CI -&gt; 기획 -&gt; 디자인 -&gt; 개발 -&gt; QA -&gt; 런칭 순으로 진행합니다. 디자이너와 개발자가 병렬로 협업하여 일정 리스크를 최소화합니다.</div>

  <table class="plan-table">
    <thead>
      <tr><th>기간</th><th>단계</th><th>세부 내용</th></tr>
    </thead>
    <tbody>
      <tr><td>1주차 (1~7일)</td><td>킥오프 + BI/CI</td><td>요구사항 확정, 디자이너 BI 컨셉 워크숍, 로고/컬러/타이포 1차 시안, 사이트맵 정의</td></tr>
      <tr><td>2주차 (8~14일)</td><td>상세 기획</td><td>은유적 메시지·카피 기획, 페이지별 와이어프레임, 인터랙션 명세서 작성, 콘텐츠 구조 확정</td></tr>
      <tr><td>3-4주차 (15~28일)</td><td>UI/UX 디자인</td><td>전 페이지 하이엔드 디자인 시안, 디자인 시스템 컴포넌트화, 인터랙션 프로토타입(Figma)</td></tr>
      <tr><td>5-7주차 (29~49일)</td><td>풀스택 개발</td><td>Next.js 페이지/컴포넌트 구현, 인터랙션 적용, 반응형 대응, CMS 연동(옵션)</td></tr>
      <tr><td>8주차 (50~56일)</td><td>QA + 반응형 검증</td><td>데스크탑/태블릿(768)/모바일(375) 전수 검증, 콘솔 에러·성능·접근성 점검</td></tr>
      <tr><td>9주차 (57~63일)</td><td>런칭 + 핸드오버</td><td>도메인·배포 환경 세팅, 운영 매뉴얼 작성, 인수인계, 1개월 무상 유지보수 시작</td></tr>
    </tbody>
  </table>

  <div class="callout-warn">
    <p><span class="k">사전 준비 요청:</span> 브랜드 자산(기존 로고/이미지/카피, 있는 경우), 회사 소개 콘텐츠, 강조하고 싶은 포트폴리오 작품 정보를 착수 전 제공해 주시면 일정 리스크를 최소화할 수 있습니다.</p>
  </div>
</section>

<!-- 5. Tech Stack -->
<section class="page">
  <header class="ph"><h1>제안 기술스택</h1>${pn(5)}</header>
  <div class="phr"></div>

  <div class="stack-grid">
    <div class="stack-card"><div class="head"><div class="area">Framework</div><div class="name">Next.js 16 + App Router</div></div><div class="why">React 기반 풀스택 프레임워크. SSG 정적 사이트 생성으로 SEO 최적화 + 빠른 로딩, GitHub Pages/Vercel 무한 배포 가능.</div></div>
    <div class="stack-card"><div class="head"><div class="area">UI</div><div class="name">React 19 + TypeScript 5</div></div><div class="why">컴포넌트 기반 + 타입 안전성으로 복잡한 인터랙션의 안정적 운영과 유지보수성 확보.</div></div>
    <div class="stack-card"><div class="head"><div class="area">Styling</div><div class="name">Tailwind CSS v4</div></div><div class="why">유틸리티 기반 빠른 반응형 + 디자인 토큰 시스템. 다크/라임 토큰을 @theme inline으로 일원화.</div></div>
    <div class="stack-card"><div class="head"><div class="area">Animation</div><div class="name">Framer Motion + GSAP</div></div><div class="why">선언적 모션 + 스크롤 트리거 + SVG 패스 애니메이션. 업계 표준 모션 라이브러리.</div></div>
    <div class="stack-card"><div class="head"><div class="area">Scroll</div><div class="name">Lenis (Smooth Scroll)</div></div><div class="why">관성 스무스 스크롤. 하이엔드 인터랙티브 사이트의 표준 라이브러리.</div></div>
    <div class="stack-card"><div class="head"><div class="area">Typography</div><div class="name">Pretendard + Space Grotesk</div></div><div class="why">한글 본문(Pretendard) + 영문 디스플레이(Space Grotesk)로 국문/영문 톤 매칭.</div></div>
    <div class="stack-card"><div class="head"><div class="area">Deploy</div><div class="name">Vercel / GitHub Pages</div></div><div class="why">정적 배포 + CDN. 무한 무료 트래픽, 미리보기 배포로 매 단계 검수 가능.</div></div>
    <div class="stack-card"><div class="head"><div class="area">CMS (옵션)</div><div class="name">Headless CMS (Sanity/Contentful)</div></div><div class="why">콘텐츠 자율 운영이 필요한 경우 추가. 정적 사이트 + ISR로 빠른 갱신.</div></div>
  </div>
</section>

${previewPage}

<!-- Demo Access -->
<section class="page">
  <header class="ph"><h1>데모 접속 안내</h1>${pn(accessPageNum)}</header>
  <div class="phr"></div>

  <div class="access">
    <div>
      <div class="url-label">데모 URL</div>
      <div class="url-box">
        <a href="https://firstpip.github.io/demos/kmong-225711-demo/">https://firstpip.github.io/demos/kmong-225711-demo/</a>
      </div>

      <div class="step-label">접속 방법</div>
      <ul class="steps">
        <li><div class="num">1</div><div class="txt"><strong>제공된 URL에 PC 또는 모바일 브라우저로 접속합니다.</strong><span>Chrome, Safari, Edge 등 최신 브라우저를 권장합니다.</span></div></li>
        <li><div class="num">2</div><div class="txt"><strong>전체 페이지를 천천히 스크롤하며 인터랙션을 체감합니다.</strong><span>스크롤 트리거와 시차 효과가 단계적으로 등장합니다.</span></div></li>
        <li><div class="num">3</div><div class="txt"><strong>주요 버튼·카드에 hover/탭하여 마우스 인터랙션을 확인합니다.</strong><span>데스크탑에서 모션 품질이 가장 잘 체감됩니다.</span></div></li>
        <li><div class="num">4</div><div class="txt"><strong>문의 페이지에서 폼 검증과 토스트 알림을 체험합니다.</strong><span>입력값 검증과 인터랙션 피드백 마감을 직접 확인하실 수 있습니다.</span></div></li>
      </ul>
    </div>

    <div>
      <div class="qr-box">
        <img src="${qrDataURL}" alt="Demo QR" />
        <div class="qr-cap">모바일에서 QR 스캔</div>
      </div>
    </div>
  </div>

  <div class="flow">
    <div class="lbl">체험 가능한 플로우</div>
    <div class="grid">
      <div class="row"><b>메인</b> - 은유적 슬로건 + 라인 단위 등장 모션</div>
      <div class="row"><b>서비스 소개</b> - 카드 그리드 + 마우스 인터랙션</div>
      <div class="row"><b>성과 지표</b> - 숫자 카운트업 + 배경 모션</div>
      <div class="row"><b>대표 작품</b> - 3D 카드 호버 + 라벨 등장</div>
      <div class="row"><b>진행 프로세스</b> - 단계별 스테퍼 활성화</div>
      <div class="row"><b>메인 CTA</b> - 인터랙티브 배경 + 타이포 효과</div>
      <div class="row"><b>회사 소개</b> - 단어 단위 포커스 타이틀</div>
      <div class="row"><b>연혁</b> - 스크롤 스티키 타임라인</div>
      <div class="row"><b>팀</b> - 3D 카드 인터랙션</div>
      <div class="row"><b>서비스 상세</b> - 집중 조명 + 스티키 리빌</div>
      <div class="row"><b>포트폴리오</b> - 3행 시차 그리드</div>
      <div class="row"><b>문의</b> - 인터랙티브 타이포 + 폼 검증</div>
    </div>
  </div>
</section>

</body>
</html>`;
}

(async () => {
  const shots = await capture();
  await generatePDF(shots);
  console.log('\n✅ Done.');
})();
