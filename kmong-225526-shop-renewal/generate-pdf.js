const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SCREENSHOTS_DIR = path.join(ROOT, 'screenshots');
const BASE_URL = 'http://localhost:3456';

const CART_ITEMS = [
  { productId: 1, name: '오버사이즈 코튼 티셔츠', price: 39000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop&q=80', color: '화이트', size: 'M', quantity: 2 },
  { productId: 3, name: '울 블렌드 오버코트', price: 189000, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=750&fit=crop&q=80', color: '베이지', size: 'L', quantity: 1 },
  { productId: 2, name: '와이드 데님 팬츠', price: 68000, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=750&fit=crop&q=80', color: '인디고', size: 'M', quantity: 1 }
];

const PAGES_TO_CAPTURE = [
  { name: 'login', url: '/login', needsCart: false, height: 900, action: null },
  { name: 'admin-products', url: '/admin', needsCart: false, height: 900, action: 'clickTab:상품 관리' },
  { name: 'homepage', url: '/', needsCart: false, height: 900, action: 'scrollTo:#home-all-products' },
  { name: 'product-detail', url: '/products/1', needsCart: false, height: 1100, action: null },
  { name: 'cart', url: '/cart', needsCart: true, height: 900, action: null },
  { name: 'checkout', url: '/checkout', needsCart: true, height: 1000, action: null },
  { name: 'admin-orders', url: '/admin', needsCart: false, height: 900, action: 'clickTab:주문 관리' },
  { name: 'tablet-home', url: '/', needsCart: false, height: 700, action: 'tablet' },
  { name: 'mobile-product', url: '/products/1', needsCart: false, height: 700, action: 'mobile' },
  { name: 'admin', url: '/admin', needsCart: false, height: 900, action: null },
];

async function captureScreenshots(browser) {
  console.log('Capturing screenshots at 1440x900, 1x scale...');
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const screenshots = {};

  // 기본: 일반 유저 로그인 상태
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.evaluate(() => {
    localStorage.setItem('shop-demo-logged-in', 'true');
    localStorage.setItem('shop-demo-role', 'user');
  });

  for (const pg of PAGES_TO_CAPTURE) {
    console.log(`  ${pg.name}: ${BASE_URL}${pg.url}`);

    // 페이지별 권한 설정
    const adminPages = ['admin-products', 'admin-orders', 'admin'];
    if (pg.name === 'login') {
      // 로그인 페이지: 비로그인
      await page.evaluate(() => {
        localStorage.removeItem('shop-demo-logged-in');
        localStorage.removeItem('shop-demo-role');
      });
    } else if (adminPages.includes(pg.name)) {
      // 관리자 페이지: 관리자 로그인
      await page.evaluate(() => {
        localStorage.setItem('shop-demo-logged-in', 'true');
        localStorage.setItem('shop-demo-role', 'admin');
      });
    } else {
      // 나머지: 일반 유저 로그인
      await page.evaluate(() => {
        localStorage.setItem('shop-demo-logged-in', 'true');
        localStorage.setItem('shop-demo-role', 'user');
      });
    }

    if (pg.needsCart) {
      await page.goto(`${BASE_URL}${pg.url}`, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.evaluate((items) => {
        localStorage.setItem('shop-demo-cart', JSON.stringify(items));
      }, CART_ITEMS);
      await page.reload({ waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));
    } else {
      await page.goto(`${BASE_URL}${pg.url}`, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));
    }

    // 페이지별 액션 실행 (탭 클릭, 주문 펼치기 등)
    if (pg.action) {
      if (pg.action.startsWith('clickTab:')) {
        const tabText = pg.action.replace('clickTab:', '');
        await page.evaluate((text) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const tab = buttons.find(b => b.textContent.trim() === text);
          if (tab) tab.click();
        }, tabText);
        await new Promise(r => setTimeout(r, 1500));
      } else if (pg.action.startsWith('scrollTo:')) {
        const selector = pg.action.replace('scrollTo:', '');
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, selector);
        await new Promise(r => setTimeout(r, 1000));
      } else if (pg.action === 'clickFirstOrder') {
        await page.evaluate(() => {
          const orderBtn = document.querySelector('[class*="bg-gray-50"]');
          if (orderBtn) orderBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
      } else if (pg.action === 'tablet') {
        await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
        await page.goto(`${BASE_URL}${pg.url}`, { waitUntil: 'networkidle0', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));
      } else if (pg.action === 'mobile') {
        await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
        await page.goto(`${BASE_URL}${pg.url}`, { waitUntil: 'networkidle0', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    const screenshotPath = path.join(SCREENSHOTS_DIR, `${pg.name}.png`);
    if (pg.action === 'tablet') {
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 768, height: pg.height || 1024 } });
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    } else if (pg.action === 'mobile') {
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 375, height: pg.height || 812 } });
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    } else if (pg.action && pg.action.startsWith('scrollTo:')) {
      const scrollY = await page.evaluate(() => window.scrollY);
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: scrollY, width: 1440, height: pg.height || 900 } });
    } else {
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 1440, height: pg.height || 900 } });
    }

    const buf = fs.readFileSync(screenshotPath);
    screenshots[pg.name] = buf.toString('base64');
    const sizeKB = (buf.length / 1024).toFixed(0);
    console.log(`    -> ${pg.name}.png (${sizeKB} KB)`);

    // 로그인 페이지 캡처 후 일반 유저 로그인 복원
    if (pg.name === 'login') {
      await page.evaluate(() => {
        localStorage.setItem('shop-demo-logged-in', 'true');
        localStorage.setItem('shop-demo-role', 'user');
      });
    }
  }

  await page.close();
  return screenshots;
}

function buildHTML(screenshots) {
  const img = (name) => `data:image/png;base64,${screenshots[name]}`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>빌더 쇼핑몰 리뉴얼 제안서</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #222; line-height: 1.6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 297mm; height: 210mm;
    page-break-after: always;
    position: relative; overflow: hidden;
  }
  .page:last-child { page-break-after: avoid; }

  /* ===================== COVER ===================== */
  .cover {
    background: linear-gradient(160deg, #333 0%, #2d2d2d 100%);
    color: #fff;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
  }
  .cover .spaced-title {
    font-size: 14px; letter-spacing: 12px; font-weight: 300;
    color: rgba(255,255,255,0.45); margin-bottom: 48px;
    text-transform: uppercase;
  }
  .cover h1 {
    font-size: 40px; font-weight: 700; line-height: 1.5;
    margin-bottom: 36px; letter-spacing: -0.5px;
    color: #fff;
  }
  .cover .divider {
    width: 60px; height: 2px; background: rgba(255,255,255,0.3);
    margin: 0 auto 28px;
  }
  .cover .subtitle {
    font-size: 20px; font-weight: 300; color: rgba(255,255,255,0.6);
  }

  /* ===================== CONTENT PAGES ===================== */
  .content-page {
    background: #fff;
    padding: 40px 52px 36px;
    display: flex; flex-direction: column;
  }
  .content-page .page-body {
    flex: 1;
    display: flex; flex-direction: column;
  }
  /* 섹션 묶음 간 간격 조절용 클래스 */
  .section-gap-lg > * + * { margin-top: 60px; }
  .section-gap-md > * + * { margin-top: 36px; }
  .section-gap-sm > * + * { margin-top: 24px; }

  /* Page header: title + black underline + page number */
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 3px solid #1a1a1a;
    margin-bottom: 28px;
  }
  .page-header h2 {
    font-size: 26px; font-weight: 800; color: #1a1a1a;
    line-height: 1.2;
  }
  .page-num {
    font-size: 13px; color: #999; font-weight: 500;
    white-space: nowrap; padding-top: 6px;
  }

  /* Highlight box */
  .highlight-box {
    background: #f8f8f8; border-left: 4px solid #333;
    padding: 16px 22px; margin: 8px 0 20px;
    font-size: 13.5px; color: #333; line-height: 1.8;
  }

  /* Section title */
  .section-title {
    font-size: 16px; font-weight: 700; color: #1a1a1a;
    margin: 16px 0 12px;
  }

  /* Checkmark list in 2-col grid */
  .checklist-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 14px 40px; list-style: none;
  }
  .checklist-grid li {
    font-size: 13.5px; color: #444; line-height: 1.8;
    padding-left: 24px; position: relative;
  }
  .checklist-grid li::before {
    content: "\\2713"; position: absolute; left: 0;
    color: #555; font-weight: normal; font-size: 14px;
  }

  /* Experience card */
  .exp-card {
    background: #f8f8f8; border: 1px solid #eee; border-radius: 0;
    padding: 22px 26px; margin: 8px 0 18px;
  }
  .exp-card h4 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
  .exp-card .period { font-size: 12px; color: #888; margin-bottom: 10px; }
  .exp-card .desc { font-size: 13px; color: #444; line-height: 1.8; margin-bottom: 14px; }

  /* Tech badges (black pills) */
  .tech-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .tech-badges span {
    background: #1a1a1a; color: #fff;
    font-size: 11px; padding: 5px 14px;
    border-radius: 20px; font-weight: 500;
  }

  /* Bullet list */
  .bullet-list { list-style: none; margin-top: 4px; }
  .bullet-list li {
    font-size: 13px; color: #444; line-height: 1.9;
    padding-left: 16px; position: relative; margin-bottom: 1px;
  }
  .bullet-list li::before {
    content: ""; position: absolute; left: 0; top: 10px;
    width: 5px; height: 5px; background: #1a1a1a; border-radius: 50%;
  }

  /* Schedule table */
  .schedule-table {
    width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;
  }
  .schedule-table th {
    background: #1a1a1a; color: #fff; font-weight: 600;
    padding: 10px 14px; text-align: left; font-size: 12px;
  }
  .schedule-table td {
    padding: 9px 14px; border-bottom: 1px solid #eee; text-align: left;
    color: #444;
  }
  .schedule-table tr:nth-child(even) { background: #fafafa; }

  /* Tech stack card grid */
  .tech-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-top: 12px;
  }
  .tech-card {
    background: #fafafa; border-radius: 0;
    border: 1px solid #e8e8e8;
    overflow: hidden;
  }
  .tech-card-header {
    background: #1a1a1a; color: #fff;
    padding: 8px 20px;
    font-size: 13px; font-weight: 700;
  }
  .tech-card-header span {
    font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.7);
    margin-left: 8px;
  }
  .tech-card-body {
    padding: 14px 20px;
  }
  .tech-card-body p { font-size: 12px; color: #555; line-height: 1.7; }

  /* Screenshot grid */
  .screenshot-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 18px; flex: 1; margin-top: 4px;
  }
  .screenshot-item { display: flex; flex-direction: column; }
  .screenshot-item img {
    width: 100%; object-fit: contain;
    border: 1px solid #e0e0e0; background: #fafafa;
  }
  .screenshot-item .img-wrapper {
    display: flex; justify-content: space-evenly; align-items: flex-start;
    border: 1px solid #e0e0e0; background: #fafafa; overflow: hidden;
  }
  .screenshot-item .img-wrapper img {
    border: none; width: auto; flex-shrink: 0;
  }
  .screenshot-item .label {
    font-size: 13px; font-weight: 700; color: #1a1a1a; margin-top: 4px;
    text-align: center;
  }
  .screenshot-item .desc { font-size: 11px; color: #888; text-align: center; margin-top: 1px; }

  /* Screenshot for demo pages - constrained height */
  .screenshot-grid-demo img {
    max-height: 220px;
  }
  .screenshot-grid-demo3 {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 18px; margin-top: 4px;
  }
  .screenshot-grid-demo3 .screenshot-item img {
    width: 100%; object-fit: contain;
    border: 1px solid #e0e0e0; background: #fafafa;
  }
  .screenshot-single {
    max-width: 48%;
    margin-top: 14px;
  }
  .screenshot-single img {
    width: 100%; object-fit: contain;
    border: 1px solid #e0e0e0; background: #fafafa;
  }

  /* Differentiator 2x2 card grid */
  .diff-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 18px; margin-top: 14px;
  }
  .diff-card {
    background: #fff; border-radius: 0;
    border: 1px solid #e0e0e0;
    overflow: hidden;
  }
  .diff-card-header {
    background: #1a1a1a; color: #fff;
    padding: 10px 22px;
    font-size: 14px; font-weight: 700;
  }
  .diff-card-body {
    padding: 16px 22px;
  }
  .diff-card-body p { font-size: 12.5px; color: #555; line-height: 1.8; }

  /* Step indicators */
  .step-row {
    display: flex; align-items: flex-start; margin-bottom: 28px;
  }
  .step-circle {
    width: 28px; height: 28px; min-width: 28px;
    background: #1a1a1a; color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; margin-right: 14px; margin-top: 1px;
  }
  .step-text-wrap {}
  .step-text { font-size: 13.5px; color: #333; line-height: 1.5; font-weight: 500; }
  .step-sub { font-size: 11.5px; color: #999; line-height: 1.5; margin-top: 1px; }

  /* QR placeholder */
  .qr-placeholder {
    width: 160px; height: 160px;
    border: 2px dashed #ccc; border-radius: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: #bbb; font-size: 12px; background: #fafafa;
  }
  .qr-placeholder .qr-icon { font-size: 24px; margin-bottom: 6px; color: #ccc; }

  /* Demo access layout */
  .demo-access-layout {
    display: flex; gap: 40px; flex: 1; margin-top: 4px;
  }
  .demo-access-left { flex: 1; }
  .demo-access-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    min-width: 200px; padding-top: 10px;
  }

  /* URL box */
  .url-box {
    background: #f8f8f8; border: 1px solid #e0e0e0;
    padding: 14px 20px; margin: 8px 0 24px;
    font-size: 13.5px; color: #555;
  }

  /* Page-type layout helpers */
  .page-body-spread-REMOVED {

  }
</style>
</head>
<body>

<!-- PAGE 1: Cover -->
<div class="page cover">
  <div>
    <div class="spaced-title">P R O P O S A L</div>
    <h1>빌더 쇼핑몰 &rarr; 자체 구축 리뉴얼<br>+ DB 이관</h1>
    <div class="divider"></div>
    <div class="subtitle">제안서</div>
  </div>
  </div>
</div>

<!-- PAGE 2: 프로젝트 이해도 -->
<div class="page content-page">
  <div class="page-header">
    <h2>프로젝트 이해도</h2>
    <span class="page-num">02 / 08</span>
  </div>
  <div class="page-body page-body-spread">
  <div class="highlight-box">
    <strong>의뢰 핵심:</strong> SaaS 빌더(카페24 등)에서 탈피하여, 클라우드 기반의 자체 쇼핑몰을 구축하고 기존 데이터를 안전하게 이관하는 프로젝트입니다.
  </div>
  <div class="section-title">주요 요구사항</div>
  <ul class="checklist-grid">
    <li>회원가입 / 로그인</li>
    <li>상품 등록 / 수정 / 삭제</li>
    <li>상품 목록 / 검색 / 상세</li>
    <li>장바구니</li>
    <li>결제 연동</li>
    <li>주문 / 배송 관리</li>
    <li>고객DB / 상품DB 이전</li>
    <li>반응형 웹디자인</li>
  </ul>
  <div style="border-top: 1px solid #e0e0e0; margin-top: 24px; padding-top: 20px;">
    <div class="section-title">핵심 역량</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 12px;">
      <div style="background: #f8f8f8; padding: 16px 20px;">
        <p style="font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px;">쇼핑몰 풀사이클 구축 경험</p>
        <p style="font-size: 12px; color: #777; line-height: 1.6;">결제 연동, 소셜 로그인, 카카오 알림톡까지 실제 서비스에 필요한 전체 기능을 직접 구축한 경험이 있습니다.</p>
      </div>
      <div style="background: #f8f8f8; padding: 16px 20px;">
        <p style="font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px;">서버리스 아키텍처</p>
        <p style="font-size: 12px; color: #777; line-height: 1.6;">별도의 호스팅 서버 없이 운영 가능한 구조로, 트래픽에 따라 자동 스케일링되어 운영 비용을 최소화합니다.</p>
      </div>
      <div style="background: #f8f8f8; padding: 16px 20px;">
        <p style="font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px;">반응형 웹 PC/모바일 동시 대응</p>
        <p style="font-size: 12px; color: #777; line-height: 1.6;">하나의 코드베이스로 PC와 모바일을 동시에 지원하여 개발 및 유지보수 비용을 절감합니다.</p>
      </div>
      <div style="background: #f8f8f8; padding: 16px 20px;">
        <p style="font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px;">실제 동작 데모 사전 제공</p>
        <p style="font-size: 12px; color: #777; line-height: 1.6;">제안 단계에서 실제 동작하는 데모를 제공하여 완성도를 사전에 검증할 수 있습니다.</p>
      </div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 3: 유사 경험 -->
<div class="page content-page">
  <div class="page-header">
    <h2>유사 경험</h2>
    <span class="page-num">03 / 08</span>
  </div>
  <div class="page-body page-body-spread">
  <div class="exp-card" style="padding: 28px 30px; margin: 12px 0 28px;">
    <h4>패키지 디자인 에디터 쇼핑몰</h4>
    <div class="period" style="margin-bottom: 14px;">2025.01 ~ 2025.06 (6개월) &middot; 기획 / 디자인 / 개발 100% 수행</div>
    <p class="desc" style="margin-bottom: 20px;">
      상품 선택부터 에디터에서 패키지 디자인 편집, 구매까지의 풀사이클을 단독으로 구축한 프로젝트입니다.
      결제, 소셜 로그인, 알림톡 연동 등 실제 서비스에 필요한 모든 외부 연동을 경험했습니다.
    </p>
    <div class="tech-badges" style="gap: 8px;">
      <span>Nuxt.js</span><span>Django</span><span>Three.js</span><span>Fabric.js</span>
      <span>PostgreSQL</span><span>토스페이먼츠</span><span>카카오지도</span>
      <span>네이버 로그인</span><span>카카오 로그인</span><span>카카오 알림톡</span>
    </div>
  </div>
  <div class="section-title" style="margin: 0 0 16px;">수행 범위 상세</div>
  <ul class="bullet-list" style="margin-top: 8px;">
    <li style="margin-bottom: 14px; line-height: 1.8;"><strong>기획/디자인</strong> — IA 설계, 화면 설계, 디자인 시안을 직접 제작하여 기획부터 개발까지 일관된 흐름으로 진행</li>
    <li style="margin-bottom: 14px; line-height: 1.8;"><strong>풀스택 개발</strong> — 프론트엔드 (Nuxt.js) + 백엔드 (Django REST)를 단일 개발자가 통합 구현</li>
    <li style="margin-bottom: 14px; line-height: 1.8;"><strong>3D/2D 에디터</strong> — Three.js 기반 3D 패키지 프리뷰 + Fabric.js 2D 편집기로 실시간 디자인 편집 구현</li>
    <li style="margin-bottom: 14px; line-height: 1.8;"><strong>결제 연동</strong> — 토스페이먼츠 (카드, 가상계좌, 간편결제) 연동 및 결제 플로우 전체 구축</li>
    <li style="margin-bottom: 14px; line-height: 1.8;"><strong>소셜 로그인/알림</strong> — 네이버/카카오 소셜 로그인, 카카오 알림톡으로 주문 상태 자동 알림</li>
    <li style="margin-bottom: 14px; line-height: 1.8;"><strong>인프라</strong> — AWS 기반 인프라 구성, CI/CD 파이프라인으로 배포 자동화</li>
    <li style="margin-bottom: 14px; line-height: 1.8;"><strong>DB 이관</strong> — 기존 시스템에서 신규 DB로 고객·상품 데이터 마이그레이션 스크립트 작성 및 실행 경험</li>
  </ul>
  </div>
</div>

<!-- PAGE 4: 구현 계획 -->
<div class="page content-page">
  <div class="page-header">
    <h2>구현 계획</h2>
    <span class="page-num">04 / 08</span>
  </div>
  <div class="page-body page-body-spread">
  <p style="font-size:14px; color:#555; margin-bottom:16px;">총 <strong>19일</strong> 일정으로 체계적으로 진행합니다.</p>
  <table class="schedule-table" style="font-size:13px;">
    <thead>
      <tr><th style="width:100px; padding: 14px 18px;">기간</th><th style="width:140px; padding: 14px 18px;">단계</th><th style="padding: 14px 18px;">세부 내용</th></tr>
    </thead>
    <tbody>
      <tr><td style="padding: 13px 18px;">1 ~ 2일차</td><td style="padding: 13px 18px;">프로젝트 세팅</td><td style="padding: 13px 18px;">프로젝트 초기 구성, DB 스키마 설계, 개발환경 구성, Git 저장소 세팅</td></tr>
      <tr><td style="padding: 13px 18px;">3 ~ 5일차</td><td style="padding: 13px 18px;">백엔드 API</td><td style="padding: 13px 18px;">상품 CRUD API, 회원인증(로그인 연동), JWT 기반 인증 체계 구축</td></tr>
      <tr><td style="padding: 13px 18px;">6 ~ 8일차</td><td style="padding: 13px 18px;">프론트엔드 핵심</td><td style="padding: 13px 18px;">상품 목록/상세/상세 페이지, 장바구니 기능, 반응형 레이아웃 개발</td></tr>
      <tr><td style="padding: 13px 18px;">9 ~ 10일차</td><td style="padding: 13px 18px;">결제 연동</td><td style="padding: 13px 18px;">PG사(토스페이먼츠) 결제 모듈 연동, 결제 플로우 구현</td></tr>
      <tr><td style="padding: 13px 18px;">11 ~ 12일차</td><td style="padding: 13px 18px;">주문/배송 관리</td><td style="padding: 13px 18px;">주문 내역 조회, 배송 상태 관리, 주문 히스토리/알림 기능</td></tr>
      <tr><td style="padding: 13px 18px;">13 ~ 14일차</td><td style="padding: 13px 18px;">관리자 페이지</td><td style="padding: 13px 18px;">상품/주문/회원 CRUD, 매출 대시보드, 통계</td></tr>
      <tr><td style="padding: 13px 18px;">15 ~ 16일차</td><td style="padding: 13px 18px;">DB 마이그레이션</td><td style="padding: 13px 18px;">기존 빌더 API/CSV로 고객·상품 DB 추출 → Prisma 마이그레이션으로 신규 DB 매핑·이관, 비밀번호 호환 대응</td></tr>
      <tr><td style="padding: 13px 18px;">17 ~ 18일차</td><td style="padding: 13px 18px;">QA &amp; 최적화</td><td style="padding: 13px 18px;">통합 테스트, 버그 수정, 모바일 반응형 점검, 성능 최적화</td></tr>
      <tr><td style="padding: 13px 18px;">19일차</td><td style="padding: 13px 18px;">배포 &amp; 인수인계</td><td style="padding: 13px 18px;">최종 배포, 운영 가이드 문서 전달, 인수인계</td></tr>
    </tbody>
  </table>
  </div>
</div>

<!-- PAGE 5: 제안 기술스택 -->
<div class="page content-page">
  <div class="page-header">
    <h2>제안 기술스택</h2>
    <span class="page-num">05 / 08</span>
  </div>
  <div class="page-body">
  <div class="tech-grid">
    <div class="tech-card">
      <div class="tech-card-header">Frontend <span>Next.js 14+ (App Router) · Tailwind CSS</span></div>
      <div class="tech-card-body">
        <p>React 기반 풀스택 프레임워크로, SSR/SSG를 통한 SEO 최적화에 탁월합니다. 유틸리티 기반 CSS로 빠른 UI 개발 및 반응형 지원이 가능합니다.<br>Tailwind CSS와 결합하여 디자인 시스템을 빠르게 구축합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Backend <span>Next.js API Routes (Route Handlers)</span></div>
      <div class="tech-card-body">
        <p>별도 백엔드 서버 없이 프론트와 동일 프로젝트에서 API를 구현합니다. 프론트 + 백엔드 단일 프로젝트 관리로 효율적이며,<br>서버리스 배포로 자동 스케일링됩니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Database <span>MySQL + Prisma ORM</span></div>
      <div class="tech-card-body">
        <p>검증된 관계형 DB를 업종에 맞게 채택합니다. Prisma ORM으로 타입 안전한 쿼리를 작성하고 자동 마이그레이션을 제공합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Infrastructure <span>Vercel 또는 Cloud Server</span></div>
      <div class="tech-card-body">
        <p>Vercel 배포 시 무중단 배포/오토스케일링을 제공합니다. 프론트 정적 파일 CDN 자동 배포, 서버 함수 자동 스케일링이 가능합니다. 비용 효율적인 서버 구성이 가능합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Payment <span>토스페이먼츠</span></div>
      <div class="tech-card-body">
        <p>국내 최적화 PG사로 카드결제, 가상계좌, 간편결제(카카오페이/네이버페이) 통합에 탁월합니다. 이전 프로젝트에서 연동 경험을 보유하고 있습니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">기타 <span>TypeScript · ESLint · GitHub Actions</span></div>
      <div class="tech-card-body">
        <p>TypeScript로 안전한 코딩을 보장하며 팀워크에도 적합합니다. CI/CD 파이프라인으로 안정적인 배포 프로세스를 운영합니다.</p>
      </div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 6: 데모 소개 (2x2 그리드, 요구사항 순서 1~4) -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">06 / 08</span>
  </div>
  <div class="page-body">
  <div class="highlight-box" style="margin-bottom: 14px;">
    실제 동작하는 데모를 미리 준비했습니다. 제안 단계에서 완성도를 직접 확인하실 수 있습니다.
  </div>
  <div class="screenshot-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; flex:1;">
    <div class="screenshot-item">
      <img src="${img('login')}" alt="회원가입/로그인" style="max-height:210px;">
      <div class="label">회원가입 / 로그인</div>
      <div class="desc">이메일 로그인, 네이버/카카오 소셜 로그인, 회원가입</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-products')}" alt="상품 등록/관리" style="max-height:210px;">
      <div class="label">상품 등록 / 수정 / 삭제</div>
      <div class="desc">관리자 페이지에서 상품 CRUD, 카테고리 관리</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('homepage')}" alt="상품 목록" style="max-height:210px;">
      <div class="label">상품 목록 / 검색</div>
      <div class="desc">카테고리 필터, 검색, 그리드 레이아웃</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('product-detail')}" alt="상품 상세" style="max-height:210px;">
      <div class="label">상품 상세</div>
      <div class="desc">이미지, 가격, 옵션 선택, 리뷰, 상세 스펙</div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 7: 데모 소개 (2x2 그리드, 요구사항 순서 5~8) -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">07 / 08</span>
  </div>
  <div class="page-body">
  <div class="screenshot-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; flex:1;">
    <div class="screenshot-item">
      <img src="${img('cart')}" alt="장바구니" style="max-height:220px;">
      <div class="label">장바구니</div>
      <div class="desc">수량 변경, 상품 삭제, 배송비 계산, 합계</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('checkout')}" alt="결제 연동" style="max-height:220px;">
      <div class="label">결제 연동</div>
      <div class="desc">배송 정보 입력, 결제 수단 선택</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-orders')}" alt="주문/배송 관리" style="max-height:220px;">
      <div class="label">주문 / 배송 관리</div>
      <div class="desc">관리자 주문 관리 — 상태 변경, 송장 입력, 주문 상세</div>
    </div>
    <div class="screenshot-item">
      <div class="img-wrapper" style="max-height:220px;">
        <img src="${img('tablet-home')}" alt="태블릿 홈" style="max-height:220px;">
        <img src="${img('mobile-product')}" alt="모바일 상품상세" style="max-height:220px;">
      </div>
      <div class="label">반응형 웹디자인</div>
      <div class="desc">태블릿(768px) · 모바일(375px) 최적화 레이아웃</div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 8: 데모 접속 안내 -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 접속 안내</h2>
    <span class="page-num">08 / 08</span>
  </div>
  <div class="demo-access-layout">
    <div class="demo-access-left">
      <div class="section-title" style="margin-top:0;">데모 URL</div>
      <div class="url-box">
        <a href="https://firstpip.github.io/kmong-225526-demo/" style="color: #1a1a1a; text-decoration: underline;">https://firstpip.github.io/kmong-225526-demo/</a>
      </div>
      <div class="section-title">접속 방법</div>
      <div class="step-row">
        <div class="step-circle">1</div>
        <div class="step-text-wrap">
          <div class="step-text">제공된 URL에 PC 또는 모바일 브라우저로 접속합니다.</div>
          <div class="step-sub">Chrome, Safari, Edge 등 최신 브라우저를 권장합니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">2</div>
        <div class="step-text-wrap">
          <div class="step-text">홈페이지에서 상품 목록을 확인하고, 상품을 클릭하여 상세 페이지로 이동합니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">3</div>
        <div class="step-text-wrap">
          <div class="step-text">장바구니에 상품을 담고, 주문/결제 페이지까지 전체 플로우를 체험할 수 있습니다.</div>
          <div class="step-sub">※ 테스트 결제이므로 실제 결제는 진행되지 않습니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">4</div>
        <div class="step-text-wrap">
          <div class="step-text">마이페이지에서 주문 내역을, 관리자 페이지에서 상품/주문/회원 관리 기능을 확인할 수 있습니다.</div>
          <div class="step-sub">※ 헤더의 역할 전환 버튼으로 관리자 모드를 활성화할 수 있습니다.</div>
        </div>
      </div>
    </div>
    <div class="demo-access-right">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://firstpip.github.io/kmong-225526-demo/" alt="QR코드" style="width:120px; height:120px;">
      <p style="font-size:11px; color:#999; margin-top:10px; text-align:center;">모바일에서 QR 스캔</p>
    </div>
  </div>
  <div style="margin-top: 24px; padding: 20px 24px; background: #f8f8f8;">
    <p style="font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 14px;">체험 가능한 플로우</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px 40px;">
      <p style="font-size: 12px; color: #444; line-height: 1.7;"><strong style="color:#1a1a1a;">상품 구매</strong> — 회원가입 → 로그인 → 상품 검색 → 상세 보기 → 옵션 선택 → 장바구니 담기 → 주문/결제</p>
      <p style="font-size: 12px; color: #444; line-height: 1.7;"><strong style="color:#1a1a1a;">내 주문 관리</strong> — 마이페이지 → 주문 내역 확인 → 배송 조회 → 교환/반품 신청 → 리뷰 작성</p>
      <p style="font-size: 12px; color: #444; line-height: 1.7;"><strong style="color:#1a1a1a;">관리자 상품 관리</strong> — 관리자 모드 전환 → 상품 등록 → 옵션/상세 설명 작성 → 상품 수정/삭제</p>
      <p style="font-size: 12px; color: #444; line-height: 1.7;"><strong style="color:#1a1a1a;">관리자 주문 관리</strong> — 주문 상태 변경 → 송장번호 입력 → 주문 상세 확인 → 상태 이력 조회</p>
    </div>
  </div>
  </div>
</div>

</body>
</html>`;
}

async function main() {
  console.log('=== Proposal PDF Generator ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Step 1: Capture screenshots
    const screenshots = await captureScreenshots(browser);

    // Step 2: Build and save HTML
    console.log('\nBuilding HTML...');
    const html = buildHTML(screenshots);
    const htmlPath = path.join(ROOT, 'proposal-page.html');
    fs.writeFileSync(htmlPath, html, 'utf-8');
    const htmlSizeKB = (fs.statSync(htmlPath).size / 1024).toFixed(0);
    console.log(`  proposal-page.html saved (${htmlSizeKB} KB)`);

    // Step 3: Generate PDF from HTML
    console.log('\nGenerating PDF...');
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for base64 images to render
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => { img.onload = resolve; img.onerror = resolve; }))
      );
    });
    await new Promise(r => setTimeout(r, 1500));

    const pdfPath = path.join(ROOT, '쇼핑몰_리뉴얼_제안서.pdf');
    await page.pdf({
      path: pdfPath,
      width: '297mm',
      height: '210mm',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const pdfSizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2);
    console.log(`  쇼핑몰_리뉴얼_제안서.pdf saved (${pdfSizeMB} MB)`);

    await page.close();
    console.log('\nDone!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
