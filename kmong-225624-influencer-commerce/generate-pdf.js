const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3457";
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");
const OUTPUT_HTML = path.join(__dirname, "proposal-page.html");
const OUTPUT_PDF = path.join(__dirname, "인플루언서_역직구_커머스_플랫폼_제안서.pdf");
const DEMO_URL = "https://firstpip.github.io/demos/kmong-225624-demo/";

// Screenshot definitions: { name, label, path, viewport, actions, clip }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const SCREENSHOTS = [
  // 소비자 웹
  { name: "home", label: "메인 페이지", path: "/", viewport: { width: 1280, height: 900 } },
  { name: "products", label: "상품 목록", path: "/products/", viewport: { width: 1280, height: 900 } },
  { name: "product-detail", label: "상품 상세", path: "/products/prod-1/", viewport: { width: 1280, height: 900 } },
  { name: "bridge", label: "인플루언서 브릿지 페이지", path: "/influencer/inf-1/", viewport: { width: 1280, height: 900 } },
  { name: "cart", label: "장바구니", path: "/cart/", viewport: { width: 1280, height: 900 },
    preAction: async (page) => {
      await page.goto(`${BASE_URL}/products/prod-1/`, { waitUntil: "networkidle0" });
      await page.evaluate(() => { document.querySelectorAll("button").forEach(b => { if (b.textContent.includes("장바구니")) b.click(); }); });
      await sleep(1000);
      await page.goto(`${BASE_URL}/products/prod-6/`, { waitUntil: "networkidle0" });
      await page.evaluate(() => { document.querySelectorAll("button").forEach(b => { if (b.textContent.includes("장바구니")) b.click(); }); });
      await sleep(1000);
    }
  },
  { name: "checkout", label: "결제 페이지 (PG 결제 Mock)", path: "/checkout/", viewport: { width: 1280, height: 900 },
    postAction: async (page) => {
      // 배송지 폼 채우기
      await page.type("#checkout-name", "홍길동");
      await page.type("#checkout-phone", "01012345678");
      await page.type("#checkout-address", "서울시 강남구 테헤란로 123");
      await page.type("#checkout-zip", "06234");
      await sleep(300);
    }
  },
  { name: "mypage", label: "마이페이지", path: "/mypage/", viewport: { width: 1280, height: 900 },
    preAction: async (page) => {
      await page.goto(`${BASE_URL}/login/`, { waitUntil: "networkidle0" });
      const inputs = await page.$$("input");
      if (inputs.length >= 2) { await inputs[0].type("demo@test.com"); await inputs[1].type("1234"); }
      await page.evaluate(() => { document.querySelectorAll("button").forEach(b => { if (b.textContent.includes("로그인")) b.click(); }); });
      await sleep(1500);
    }
  },
  // 인플루언서
  { name: "inf-dashboard", label: "인플루언서 대시보드 (영문)", path: "/influencer/dashboard/", viewport: { width: 1280, height: 900 } },
  { name: "inf-earnings", label: "인플루언서 수익/정산", path: "/influencer/earnings/", viewport: { width: 1280, height: 900 } },
  { name: "inf-links", label: "딥링크 생성/관리", path: "/influencer/links/", viewport: { width: 1280, height: 900 },
    postAction: async (page) => {
      // Create Link 모달 열기
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll("button")];
        const btn = btns.find(b => b.textContent.includes("Create"));
        if (btn) btn.click();
      });
      await sleep(800);
    }
  },
  // 공급사
  { name: "vendor-dashboard", label: "공급사 대시보드", path: "/vendor/dashboard/", viewport: { width: 1280, height: 900 } },
  { name: "vendor-products", label: "공급사 상품 관리", path: "/vendor/products/", viewport: { width: 1280, height: 900 } },
  { name: "vendor-settlements", label: "공급사 정산 관리", path: "/vendor/settlements/", viewport: { width: 1280, height: 900 } },
  // 관리자
  { name: "admin-dashboard", label: "통합 관리자 대시보드", path: "/admin/dashboard/", viewport: { width: 1280, height: 900 } },
  { name: "admin-matching", label: "인플루언서-상품 매칭", path: "/admin/matching/", viewport: { width: 1280, height: 900 } },
  { name: "admin-order-detail", label: "주문 상세 (인플루언서 귀속)", path: "/admin/orders/", viewport: { width: 1280, height: 900 },
    postAction: async (page) => {
      // 주문 상세 모달 열기
      const btn = await page.$("#btn-order-detail-ord-001");
      if (btn) { await btn.click(); await sleep(800); }
    }
  },
  { name: "admin-settlements", label: "관리자 정산 관리", path: "/admin/settlements/", viewport: { width: 1280, height: 900 } },
  { name: "admin-reports", label: "매출/정산 리포트", path: "/admin/reports/", viewport: { width: 1280, height: 900 } },
  { name: "admin-promotions", label: "프로모션/할인코드 관리", path: "/admin/promotions/", viewport: { width: 1280, height: 900 } },
  // 반응형
  { name: "mobile-home", label: "반응형 웹 (모바일)", path: "/", viewport: { width: 375, height: 812 } },
  { name: "tablet-product", label: "반응형 웹 (태블릿)", path: "/products/prod-6/", viewport: { width: 768, height: 1024 } },
];

async function captureScreenshots() {
  console.log("📸 스크린샷 캡처 시작...");
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  for (const ss of SCREENSHOTS) {
    try {
      await page.setViewport(ss.viewport);

      // Hide footer
      if (ss.preAction) await ss.preAction(page);

      await page.goto(`${BASE_URL}${ss.path}`, { waitUntil: "networkidle0", timeout: 15000 });

      // Hide footer for cleaner screenshots
      await page.evaluate(() => {
        const footer = document.getElementById("footer");
        if (footer) footer.style.display = "none";
      });

      await sleep(500);

      // Post-navigation action (fill forms, open modals, etc.)
      if (ss.postAction) await ss.postAction(page);
      await sleep(300);

      const filePath = path.join(SCREENSHOT_DIR, `${ss.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  ✅ ${ss.name} (${ss.viewport.width}x${ss.viewport.height})`);
    } catch (e) {
      console.log(`  ❌ ${ss.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`📸 스크린샷 ${SCREENSHOTS.length}장 캡처 완료\n`);
}

function imgToBase64(name) {
  const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
  if (!fs.existsSync(filePath)) return "";
  return `data:image/png;base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function buildHTML() {
  console.log("📄 HTML 제안서 작성 중...");

  // Group screenshots for demo section (2x2 grid per page)
  const demoScreenshots = SCREENSHOTS.map(s => ({
    ...s,
    base64: imgToBase64(s.name),
  })).filter(s => s.base64);

  const mainScreenshots = demoScreenshots.filter(s => !s.name.startsWith("mobile") && !s.name.startsWith("tablet"));
  const responsiveScreenshots = demoScreenshots.filter(s => s.name.startsWith("mobile") || s.name.startsWith("tablet"));

  // Merge responsive into main list as a single combined item
  if (responsiveScreenshots.length > 0) {
    mainScreenshots.push({
      name: "responsive-combined",
      label: "반응형 웹디자인",
      base64: "__RESPONSIVE__", // marker
      viewport: { width: 1280, height: 900 },
    });
  }

  // Split into pages of 4
  const screenshotPages = [];
  for (let i = 0; i < mainScreenshots.length; i += 4) {
    screenshotPages.push(mainScreenshots.slice(i, i + 4));
  }

  // Dynamic total pages: cover(1) + understanding(1) + experience(1) + schedule(1) + techstack(1) + demo pages + access(1)
  const totalPages = 1 + 1 + 1 + 1 + 1 + screenshotPages.length + 1;

  const pageNum = (n) => `${String(n).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>인플루언서 역직구 커머스 플랫폼 제안서</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Pretendard', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #111827; line-height: 1.6;
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
    background: linear-gradient(160deg, #1e3a5f 0%, #2563EB 60%, #60a5fa 100%);
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
    font-size: 36px; font-weight: 700; line-height: 1.5;
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
  .cover .meta {
    margin-top: 60px; font-size: 13px; color: rgba(255,255,255,0.35);
    letter-spacing: 1px;
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

  /* Page header */
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 3px solid #1e3a5f;
    margin-bottom: 28px;
  }
  .page-header h2 {
    font-size: 26px; font-weight: 800; color: #1e3a5f;
    line-height: 1.2;
  }
  .page-num {
    font-size: 13px; color: #9CA3AF; font-weight: 500;
    white-space: nowrap; padding-top: 6px;
  }

  /* Highlight box */
  .highlight-box {
    background: #F3F4F6; border-left: 4px solid #1e3a5f;
    padding: 16px 22px; margin: 8px 0 20px;
    font-size: 13.5px; color: #4B5563; line-height: 1.8;
  }

  /* Section title */
  .section-title {
    font-size: 16px; font-weight: 700; color: #1e3a5f;
    margin: 16px 0 12px;
  }

  /* Checkmark list in 2-col grid */
  .checklist-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 6px 30px; list-style: none;
  }
  .checklist-grid li {
    font-size: 12px; color: #4B5563; line-height: 1.6;
    padding-left: 24px; position: relative;
  }
  .checklist-grid li::before {
    content: "\\2713"; position: absolute; left: 0;
    color: #2563EB; font-weight: bold; font-size: 14px;
  }

  /* Key capability cards (2x2 grid) */
  .cap-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;
  }
  .cap-card {
    background: #F3F4F6; padding: 12px 16px;
  }
  .cap-card p.cap-title { font-size: 13px; font-weight: 700; color: #1e3a5f; margin-bottom: 4px; }
  .cap-card p.cap-desc { font-size: 11px; color: #6B7280; line-height: 1.5; }

  /* Experience card */
  .exp-card {
    background: #F3F4F6; border: 1px solid #E5E7EB;
    padding: 22px 26px; margin: 8px 0 18px;
  }
  .exp-card h4 { font-size: 16px; font-weight: 700; color: #1e3a5f; margin-bottom: 4px; }
  .exp-card .period { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; }
  .exp-card .desc { font-size: 13px; color: #4B5563; line-height: 1.8; margin-bottom: 14px; }

  /* Tech badges */
  .tech-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .tech-badges span {
    background: #1e3a5f; color: #fff;
    font-size: 11px; padding: 5px 14px;
    border-radius: 20px; font-weight: 500;
  }

  /* Relevance tags */
  .rel-tag {
    display: inline-block;
    background: #2563EB; color: #fff;
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 3px;
    margin-right: 6px; margin-bottom: 4px;
  }

  /* Bullet list */
  .bullet-list { list-style: none; margin-top: 4px; }
  .bullet-list li {
    font-size: 13px; color: #4B5563; line-height: 1.9;
    padding-left: 16px; position: relative; margin-bottom: 1px;
  }
  .bullet-list li::before {
    content: ""; position: absolute; left: 0; top: 10px;
    width: 5px; height: 5px; background: #1e3a5f; border-radius: 50%;
  }

  /* Schedule table */
  .schedule-table {
    width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;
  }
  .schedule-table th {
    background: #1e3a5f; color: #fff; font-weight: 600;
    padding: 10px 14px; text-align: left; font-size: 12px;
  }
  .schedule-table td {
    padding: 9px 14px; border-bottom: 1px solid #E5E7EB; text-align: left;
    color: #4B5563;
  }
  .schedule-table tr:nth-child(even) { background: #F9FAFB; }

  /* Tech stack card grid (2x3) */
  .tech-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-top: 12px;
  }
  .tech-card {
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    overflow: hidden;
  }
  .tech-card-header {
    background: #1e3a5f; color: #fff;
    padding: 8px 18px;
    font-size: 13px; font-weight: 700;
  }
  .tech-card-header span {
    font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.7);
    margin-left: 8px;
  }
  .tech-card-body {
    padding: 12px 18px;
  }
  .tech-card-body p { font-size: 11.5px; color: #4B5563; line-height: 1.7; }

  /* Demo screenshot grid */
  /* Screenshot grid (from B2B template) */
  .screenshot-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 14px; flex: 1; margin-top: 4px;
  }
  .screenshot-item { display: flex; flex-direction: column; }
  .screenshot-item img {
    width: 100%; height: 210px; object-fit: contain; object-position: top;
    border: 1px solid #E5E7EB; background: #F9FAFB;
  }
  .screenshot-item .img-wrapper {
    display: flex; justify-content: space-evenly; align-items: flex-start;
    border: 1px solid #E5E7EB; background: #F9FAFB; overflow: hidden;
    height: 210px;
  }
  .screenshot-item .img-wrapper img {
    border: none; width: auto; flex-shrink: 0; height: 210px; object-fit: contain;
  }
  .screenshot-item .label {
    font-size: 13px; font-weight: 700; color: #1e3a5f; margin-top: 6px;
    text-align: center;
  }
  .screenshot-item .desc { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 2px; }

  /* Demo access layout (from B2B template) */
  .demo-access-layout {
    display: flex; gap: 40px; flex: 1; margin-top: 4px;
  }
  .demo-access-left { flex: 1; }
  .demo-access-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    min-width: 200px; padding-top: 10px;
  }

  /* Responsive demo */
  .responsive-grid { display: flex; gap: 20px; justify-content: center; align-items: flex-start; }
  .responsive-item { overflow: hidden; border: 1px solid #e2e8f0; }
  .responsive-item img { display: block; object-fit: contain; object-position: top; background: #F9FAFB; }
  /* (responsive styles merged into screenshot-item) */

  /* Demo access layout */
  .access-layout { display: flex; gap: 40px; flex: 1; margin-top: 4px; }
  .access-left { flex: 1; }
  .access-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    min-width: 200px; padding-top: 10px;
  }
  .url-box {
    background: #F3F4F6; border-left: 4px solid #2563EB;
    padding: 14px 20px; margin: 8px 0 24px;
  }
  .url-box .url-label { font-size: 11px; color: #64748b; margin-bottom: 4px; }
  .url-box .url { font-size: 14px; font-weight: 700; color: #2563EB; word-break: break-all; }

  /* Steps */
  .step-row { display: flex; align-items: flex-start; margin-bottom: 18px; }
  .step-circle {
    width: 28px; height: 28px; min-width: 28px;
    background: #2563EB; color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; margin-right: 14px; margin-top: 1px;
  }
  .step-text { font-size: 13.5px; color: #111827; line-height: 1.5; font-weight: 500; }
  .step-sub { font-size: 11.5px; color: #9CA3AF; line-height: 1.5; margin-top: 1px; }

  /* QR placeholder */
  .qr-placeholder {
    width: 160px; height: 160px;
    border: 2px dashed #D1D5DB;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: #9CA3AF; font-size: 12px; background: #F9FAFB;
  }

  /* Flow grid */
  .flow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  .flow-card { background: #f8fafc; border-radius: 8px; padding: 10px 12px; }
  .flow-card h5 { font-size: 11px; font-weight: 700; color: #2563EB; margin-bottom: 4px; }
  .flow-card p { font-size: 10px; color: #64748b; line-height: 1.5; }
</style>
</head>
<body>

<!-- Page 1: Cover -->
<div class="page cover">
  <div>
    <div class="spaced-title">P R O P O S A L</div>
    <h1>미국 인플루언서 연계<br>역직구 커머스 플랫폼 구축</h1>
    <div class="divider"></div>
    <div class="subtitle">제안서</div>
    <div class="meta">2026년 4월</div>
  </div>
</div>

<!-- Page 2: Understanding -->
<div class="page content-page">
  <div class="page-header">
    <h2>프로젝트 이해도</h2>
    <span class="page-num">${pageNum(2)}</span>
  </div>
  <div class="page-body">
  <div class="highlight-box">
    <strong>의뢰 핵심:</strong> 미국 인플루언서를 통해 한국 소비재를 역직구 형태로 판매하는 커머스 플랫폼을 구축합니다. 인플루언서별 딥링크 추적, 다자간(인플루언서-공급사-플랫폼) 정산, Payoneer USD 지급까지 포함하는 풀스택 시스템입니다.
  </div>
  <div class="section-title">주요 요구사항</div>
  <ul class="checklist-grid">
    <li>한국 소비자용 반응형 웹 (모바일 최적화)</li>
    <li>인플루언서 전용 딥링크 생성 및 유입 경로 추적</li>
    <li>딥링크 유입 고객의 타 상품 구매도 실적 귀속</li>
    <li>브릿지 페이지 (프로필 + 추천상품 소개)</li>
    <li>인플루언서 대시보드 (영문) - 실시간 매출/수수료/정산</li>
    <li>공급사 어드민 - 입점상품/판매/수수료 컨펌</li>
    <li>통합 관리자 - 매칭/환율/Payoneer 정산</li>
    <li>국내 PG 결제 연동 (토스페이먼츠/간편결제)</li>
    <li>인플루언서 전용 할인코드/프로모션</li>
    <li>일자별/인플루언서별/공급사별 리포트 자동 생성</li>
    <li>소비자용 PC/MO 반응형 웹</li>
    <li>향후 마이크로사이트 / SNS 연동 확장 설계</li>
  </ul>
  <div class="section-title">핵심 역량</div>
  <div class="cap-grid">
    <div class="cap-card"><p class="cap-title">커머스 풀스택</p><p class="cap-desc">기획부터 개발까지 100% 수행. 상품-주문-결제-배송 전체 플로우 구현 경험</p></div>
    <div class="cap-card"><p class="cap-title">PG 결제 연동</p><p class="cap-desc">토스페이먼츠 실전 연동 경험. 카드/간편결제/가상계좌 처리</p></div>
    <div class="cap-card"><p class="cap-title">다자간 정산 시스템</p><p class="cap-desc">인플루언서-공급사-플랫폼 3자 수수료 분배 및 자동 정산</p></div>
    <div class="cap-card"><p class="cap-title">글로벌 정산 (Payoneer)</p><p class="cap-desc">USD 기반 인플루언서 지급. 환율 관리 및 정산 주기 설정</p></div>
  </div>
  </div>
</div>

<!-- Page 3: Experience -->
<div class="page content-page">
  <div class="page-header">
    <h2>유사 경험</h2>
    <span class="page-num">${pageNum(3)}</span>
  </div>
  <div class="page-body">
  <div class="exp-card" style="padding: 28px 30px; margin: 12px 0 28px;">
    <h4>패키지 디자인 에디터 쇼핑몰</h4>
    <div class="period" style="margin-bottom: 14px;">2025.01 ~ 2025.06 (6개월) &middot; 기획 / 디자인 / 개발 100% 수행</div>
    <p class="desc" style="margin-bottom: 20px;">
      컵, 봉투 등 패키지 디자인이 필요한 상품 전문 쇼핑몰. 상품 선택 후 에디터 페이지에서 Three.js/Fabric.js 기반 디자인 에디터로 패키지 디자인을 직접 편집하여 확정한 뒤 구매하는 커머스 플랫폼.
      프론트엔드(Nuxt), 백엔드(Django), DB 설계(PostgreSQL), PG 결제(토스페이먼츠), 소셜 로그인(네이버/카카오), 알림톡 연동까지 전 과정을 1인으로 수행.
    </p>
    <div class="tech-badges" style="gap: 8px;">
      <span>Nuxt.js</span><span>Django</span><span>Three.js</span><span>Fabric.js</span>
      <span>PostgreSQL</span><span>토스페이먼츠</span><span>카카오지도</span>
      <span>네이버 로그인</span><span>카카오 로그인</span><span>카카오 알림톡</span>
    </div>
  </div>
  <div class="section-title" style="margin: 0 0 12px;">이 프로젝트 관점에서의 연관성</div>
  <ul class="bullet-list" style="margin-top: 8px;">
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="rel-tag">결제 연동</span> 토스페이먼츠 카드/가상계좌/간편결제 연동 경험 &rarr; 이번 프로젝트의 <strong>국내 PG 결제 + 다자간 정산 워크플로우</strong>에 직접 활용</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="rel-tag">커머스 플랫폼</span> 상품-주문-결제-배송 전체 플로우 단독 구현 &rarr; <strong>소비자 쇼핑몰 + 공급사 어드민 + 관리자 시스템</strong> 빠른 구축 가능</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="rel-tag">풀스택 개발</span> 프론트엔드 + 백엔드 단독 구축 &rarr; Next.js + FastAPI로 <strong>동일한 풀스택 구조</strong> 적용</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="rel-tag">DB 설계</span> PostgreSQL 기반 상품/주문/회원 데이터 설계 &rarr; <strong>다자간 정산(인플루언서-공급사-플랫폼) 스키마 설계</strong>에 직접 활용</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="rel-tag">외부 API</span> 소셜 로그인/카카오 알림톡 연동 경험 &rarr; <strong>Payoneer API, 환율 API, SNS 연동</strong> 구현에 활용</li>
  </ul>
  </div>
</div>

<!-- Page 4: Schedule -->
<div class="page content-page">
  <div class="page-header">
    <h2>구현 계획</h2>
    <span class="page-num">${pageNum(4)}</span>
  </div>
  <div class="page-body">
  <p style="font-size:14px; color:#4B5563; margin-bottom:16px;">총 <strong>90일(약 3개월)</strong> 일정으로 체계적으로 진행합니다. 각 단계별 산출물 공유 및 중간 점검을 통해 투명한 진행 상황을 보장합니다.</p>
  <table class="schedule-table" style="font-size:13px;">
    <thead>
      <tr><th style="width:150px; padding: 12px 18px;">기간</th><th style="width:150px; padding: 12px 18px;">단계</th><th style="padding: 12px 18px;">세부 내용</th></tr>
    </thead>
    <tbody>
      <tr><td style="padding: 11px 18px;">04/27 ~ 05/10<br><span style="color:#9CA3AF;font-size:11px;">14일</span></td><td style="padding: 11px 18px;"><strong>1. 기획 및 설계</strong></td><td style="padding: 11px 18px;">요구사항 정의서, DB 스키마, API 설계서, 와이어프레임</td></tr>
      <tr><td style="padding: 11px 18px;">05/11 ~ 05/14<br><span style="color:#9CA3AF;font-size:11px;">4일</span></td><td style="padding: 11px 18px;"><strong>2. 인프라 세팅</strong></td><td style="padding: 11px 18px;">AWS Lightsail 서버, PostgreSQL, S3, CI/CD</td></tr>
      <tr><td style="padding: 11px 18px;">05/15 ~ 05/21<br><span style="color:#9CA3AF;font-size:11px;">7일</span></td><td style="padding: 11px 18px;"><strong>3. 인증/사용자 시스템</strong></td><td style="padding: 11px 18px;">회원가입/로그인, 역할 분리(소비자/인플루언서/공급사/관리자)</td></tr>
      <tr><td style="padding: 11px 18px;">05/22 ~ 06/08<br><span style="color:#9CA3AF;font-size:11px;">18일</span></td><td style="padding: 11px 18px;"><strong>4. 소비자 쇼핑몰</strong></td><td style="padding: 11px 18px;">상품 목록/상세, 장바구니, 주문/결제(토스페이먼츠), 마이페이지</td></tr>
      <tr><td style="padding: 11px 18px;">06/09 ~ 06/22<br><span style="color:#9CA3AF;font-size:11px;">14일</span></td><td style="padding: 11px 18px;"><strong>5. 인플루언서 시스템</strong></td><td style="padding: 11px 18px;">딥링크 생성/추적, 브릿지 페이지, 대시보드(영문), 실적 귀속</td></tr>
      <tr><td style="padding: 11px 18px;">06/23 ~ 07/02<br><span style="color:#9CA3AF;font-size:11px;">10일</span></td><td style="padding: 11px 18px;"><strong>6. 공급사 어드민</strong></td><td style="padding: 11px 18px;">상품 CRUD, 주문/배송, 수수료 컨펌, 정산 관리</td></tr>
      <tr><td style="padding: 11px 18px;">07/03 ~ 07/12<br><span style="color:#9CA3AF;font-size:11px;">10일</span></td><td style="padding: 11px 18px;"><strong>7. 통합 관리자</strong></td><td style="padding: 11px 18px;">매칭 관리, 환율/정산, Payoneer 연동, 리포트</td></tr>
      <tr><td style="padding: 11px 18px;">07/13 ~ 07/20<br><span style="color:#9CA3AF;font-size:11px;">8일</span></td><td style="padding: 11px 18px;"><strong>8. 테스트 및 QA</strong></td><td style="padding: 11px 18px;">통합 테스트, 버그 수정, 성능 최적화</td></tr>
      <tr><td style="padding: 11px 18px;">07/21 ~ 07/26<br><span style="color:#9CA3AF;font-size:11px;">5일</span></td><td style="padding: 11px 18px;"><strong>9. 배포 및 인수</strong></td><td style="padding: 11px 18px;">운영 서버 배포, 관리자 교육, 문서 인수인계</td></tr>
    </tbody>
  </table>
  <div style="margin-top: 20px; background: #FEF3C7; border-left: 4px solid #D97706; padding: 14px 20px;">
    <p style="font-size: 12.5px; color: #92400E; line-height: 1.7;">
      <strong>사전 준비 요청:</strong> 토스페이먼츠 테스트 계정, Payoneer API 문서 및 테스트 환경, 공급사 상품 데이터(CSV/엑셀)를 착수 전에 제공해 주시면 일정 리스크를 최소화할 수 있습니다.
    </p>
  </div>
  </div>
</div>

<!-- Page 5: Tech Stack -->
<div class="page content-page">
  <div class="page-header">
    <h2>제안 기술스택</h2>
    <span class="page-num">${pageNum(5)}</span>
  </div>
  <div class="page-body">
  <div class="tech-grid">
    <div class="tech-card">
      <div class="tech-card-header">Frontend <span>Next.js 15 + Tailwind CSS</span></div>
      <div class="tech-card-body">
        <p>React 기반 풀스택 프레임워크. SSR/SSG로 SEO 최적화에 탁월하며, Tailwind CSS + shadcn/ui로 일관된 디자인 시스템을 빠르게 구현합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Backend <span>FastAPI (Python)</span></div>
      <div class="tech-card-body">
        <p>비동기 고성능 API 서버. PG 결제 콜백, Payoneer 웹훅, 정산 cron job 등 서버사이드 처리에 최적화된 Python 생태계를 활용합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Database <span>PostgreSQL</span></div>
      <div class="tech-card-body">
        <p>관계형 데이터베이스. 인플루언서-공급사-플랫폼 다자간 정산에 최적화된 스키마 설계와 트랜잭션 무결성을 보장합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Infra <span>AWS Lightsail + S3</span></div>
      <div class="tech-card-body">
        <p>서울 리전 VPS로 국내 사용자 최적 응답속도를 확보합니다. S3를 통한 상품 이미지 CDN 배포 및 정적 자산 관리.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Payment <span>토스페이먼츠 + Payoneer</span></div>
      <div class="tech-card-body">
        <p>국내 PG(카드/간편결제)와 글로벌 정산(USD 지급)을 동시 지원. 환율 관리 및 자동 정산 주기 설정 기능 포함.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Auth <span>JWT + OAuth 2.0</span></div>
      <div class="tech-card-body">
        <p>소비자/인플루언서/공급사/관리자 4개 역할의 접근 제어. 소셜 로그인(네이버/카카오) 및 토큰 기반 인증.</p>
      </div>
    </div>
  </div>
  <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 14px 20px; margin-top: 20px;">
    <p style="font-size: 12.5px; color: #4B5563; line-height: 1.7;">
      <strong>선정 이유:</strong> 의뢰인께서 선호하신 Next.js/Node.js/Python 스택을 기반으로, 국내 소비자 대상 서비스에 최적화된 AWS 서울 리전 인프라를 구성했습니다. PG 결제 콜백, Payoneer 웹훅, 정산 cron job 등 서버사이드 처리가 필수인 요구사항에 맞춰 서버리스가 아닌 VPS 기반으로 설계했습니다.
    </p>
  </div>
  </div>
</div>

<!-- Pages 6~: Demo Screenshots -->
${screenshotPages.map((group, pageIdx) => `
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">${pageNum(pageIdx + 6)}</span>
  </div>
  <div class="page-body">
  ${pageIdx === 0 ? '<div class="highlight-box" style="margin-bottom:16px;">실제 동작하는 데모를 미리 준비했습니다. 제안 단계에서 완성도를 직접 확인하실 수 있습니다.</div>' : ''}
  <div class="screenshot-grid">
    ${group.map(s => s.base64 === "__RESPONSIVE__" ? `
    <div class="screenshot-item">
      <div class="img-wrapper">
        ${responsiveScreenshots.map(rs => `<img src="${rs.base64}" alt="${rs.label}" />`).join("")}
      </div>
      <p class="label">${s.label}</p>
    </div>
    ` : `
    <div class="screenshot-item">
      <img src="${s.base64}" alt="${s.label}" />
      <p class="label">${s.label}</p>
    </div>
    `).join("")}
  </div>
  </div>
</div>
`).join("")}

<!-- Demo Access Page -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 접속 안내</h2>
    <span class="page-num">${pageNum(6 + screenshotPages.length)}</span>
  </div>
  <div class="page-body">
  <div class="demo-access-layout">
    <div class="demo-access-left">
      <p class="section-title" style="margin-top:0;">데모 URL</p>
      <div class="url-box">${DEMO_URL}</div>

      <p class="section-title">접속 방법</p>
      <div class="step-row"><div class="step-circle">1</div><div><div class="step-text">제공된 URL에 PC 또는 모바일 브라우저로 접속합니다.</div><div class="step-sub">Chrome, Safari, Edge 등 최신 브라우저를 권장합니다.</div></div></div>
      <div class="step-row"><div class="step-circle">2</div><div><div class="step-text">로그인 페이지에서 아무 값이나 입력하여 로그인합니다.</div><div class="step-sub">데모 버전이므로 어떤 값이든 로그인됩니다.</div></div></div>
      <div class="step-row"><div class="step-circle">3</div><div><div class="step-text">상품 목록에서 상품을 선택하고, 장바구니 담기 > 주문/결제까지 전체 구매 플로우를 체험합니다.</div></div></div>
      <div class="step-row"><div class="step-circle">4</div><div><div class="step-text">헤더의 역할 전환 버튼으로 인플루언서/입점사/관리자 모드를 활성화하여 각 어드민 기능을 확인합니다.</div><div class="step-sub">대시보드, 상품/주문 관리, 정산, 리포트 등을 체험할 수 있습니다.</div></div></div>

    </div>
    <div class="demo-access-right">
      <img src="${imgToBase64("qr-code")}" alt="QR Code" style="width:160px; height:160px;" />
      <p style="font-size:11px; color:#9CA3AF; margin-top:8px; text-align:center;">모바일에서 QR 스캔</p>
    </div>
  </div>
  <div style="background:#F3F4F6; padding:18px 22px; margin-top:auto;">
    <p style="font-size:13px; font-weight:700; color:#1e3a5f; margin-bottom:10px;">체험 가능한 플로우</p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 30px; font-size:12px; color:#4B5563; line-height:1.8;">
      <p><strong style="color:#1e3a5f;">소비자 구매</strong> &mdash; 메인 > 상품 검색 > 상세 > 장바구니 > 결제 > 마이페이지</p>
      <p><strong style="color:#1e3a5f;">인플루언서</strong> &mdash; 대시보드 > 수익/정산 > 딥링크 관리 > 상품 > 설정</p>
      <p><strong style="color:#1e3a5f;">공급사</strong> &mdash; 대시보드 > 상품관리 > 주문/배송 > 정산 승인</p>
      <p><strong style="color:#1e3a5f;">통합 관리자</strong> &mdash; 대시보드 > 사용자 > 매칭 > 정산 > 리포트</p>
    </div>
  </div>
  </div>
</div>

</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML, html);
  console.log(`📄 HTML 제안서 작성 완료: ${OUTPUT_HTML}\n`);
}

async function generatePDF() {
  console.log("📑 PDF 생성 중...");
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.goto(`file://${OUTPUT_HTML}`, { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 1000));

  await page.pdf({
    path: OUTPUT_PDF,
    width: "297mm",
    height: "210mm",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`📑 PDF 생성 완료: ${OUTPUT_PDF}`);

  const stats = fs.statSync(OUTPUT_PDF);
  console.log(`   파일 크기: ${(stats.size / 1024 / 1024).toFixed(1)}MB`);
}

(async () => {
  await captureScreenshots();
  buildHTML();
  await generatePDF();
  console.log("\n✅ 완료!");
})();
