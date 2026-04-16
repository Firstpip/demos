const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SCREENSHOTS_DIR = path.join(ROOT, 'screenshots');
const BASE_URL = 'http://localhost:3456';

// Cart items for cart/checkout pages
const CART_ITEMS = [
  {
    productId: 'P001',
    productName: '[대용량] 아메리카노 원두 1kg',
    productImage: '/images/products/product-1.jpg',
    optionValues: '미디엄 / 1kg (1봉)',
    quantity: 5,
    unitPrice: 18000,
  },
  {
    productId: 'P004',
    productName: '친환경 세탁세제 5L',
    productImage: '/images/products/product-4.jpg',
    optionValues: '5L (1통)',
    quantity: 3,
    unitPrice: 22000,
  },
  {
    productId: 'P007',
    productName: 'A4 복사용지 2500매',
    productImage: '/images/products/product-7.jpg',
    optionValues: '80g',
    quantity: 10,
    unitPrice: 24000,
  },
];

// Default standard user for localStorage
const STANDARD_USER = {
  id: 'M001',
  loginId: 'hanafoods',
  businessName: '(주)하나식품',
  businessNumber: '123-45-67890',
  ownerName: '김영수',
  managerName: '이지은',
  email: 'hana@hanafoods.co.kr',
  phone: '02-1234-5678',
  address: '서울특별시 강남구 테헤란로 123, 5층',
  businessType: '도소매',
  businessItem: '식품, 음료',
  businessLicense: '/uploads/license-001.pdf',
  retailDesignation: '/uploads/retail-001.pdf',
  status: 'approved',
  discountRate: 5,
  cashReceiptNumber: '010-1234-5678',
  createdAt: '2025-01-15',
  approvedAt: '2025-01-16',
};

const VIP_USER = {
  id: 'M002',
  loginId: 'sungwoo_trade',
  businessName: '성우무역(주)',
  businessNumber: '234-56-78901',
  ownerName: '박성우',
  managerName: '최미영',
  email: 'info@sungwoo.co.kr',
  phone: '02-2345-6789',
  address: '서울특별시 중구 을지로 45, 3층',
  businessType: '도소매',
  businessItem: '생활용품, 잡화',
  businessLicense: '/uploads/license-002.pdf',
  retailDesignation: '/uploads/retail-002.pdf',
  status: 'approved',
  discountRate: 10,
  cashReceiptNumber: '010-2345-6789',
  createdAt: '2024-11-20',
  approvedAt: '2024-11-21',
};

const PAGES_TO_CAPTURE = [
  // 1. B2B 폐쇄몰 기본 — 로그인 게이트
  { name: 'login', url: '/login', role: 'guest', needsCart: false, height: 900, action: null },
  // 2. 회원가입 — 사업자 전용 가입 Step 1 (기본정보 입력)
  { name: 'signup', url: '/signup', role: 'guest', needsCart: false, height: 900, action: 'signupFill' },
  // 3. 홈 / 상품 목록 (로그인 후)
  { name: 'homepage', url: '/', role: 'member', needsCart: false, height: 900, action: null },
  // 4. 상품 상세 — 옵션/재고/할인가/구매제한 표시
  { name: 'product-detail', url: '/products/P001', role: 'member', needsCart: false, height: 1000, action: null },
  // 5. 장바구니 — 수량조절/최소주문 검증
  { name: 'cart', url: '/cart', role: 'member', needsCart: true, height: 900, action: null },
  // 6. 주문/결제 — 무통장/계좌이체/현금영수증
  { name: 'checkout', url: '/checkout', role: 'member', needsCart: true, height: 1000, action: null },
  // 7. 마이페이지 주문내역
  { name: 'mypage-orders', url: '/mypage/orders', role: 'member', needsCart: false, height: 900, action: null },
  // 8. 마이페이지 회원정보
  { name: 'mypage-profile', url: '/mypage/profile', role: 'member', needsCart: false, height: 900, action: null },
  // 9. 관리자 대시보드
  { name: 'admin-dashboard', url: '/admin', role: 'admin', needsCart: false, height: 900, action: null },
  // 10. 관리자 회원관리
  { name: 'admin-members', url: '/admin/members', role: 'admin', needsCart: false, height: 900, action: null },
  // 11. 관리자 상품관리
  { name: 'admin-products', url: '/admin/products', role: 'admin', needsCart: false, height: 900, action: null },
  // 12. 관리자 주문관리
  { name: 'admin-orders', url: '/admin/orders', role: 'admin', needsCart: false, height: 900, action: null },
  // 13. 관리자 주문생성
  { name: 'admin-order-create', url: '/admin/orders/new', role: 'admin', needsCart: false, height: 900, action: null },
  // 14. 관리자 팝업관리
  { name: 'admin-popups', url: '/admin/popups', role: 'admin', needsCart: false, height: 900, action: null },
  // 15. 이카운트 ERP 연동 (Mock UI)
  { name: 'admin-erp', url: '/admin/erp', role: 'admin', needsCart: false, height: 900, action: null },
  // 16. 회계솔루션 연동 (Mock UI)
  { name: 'admin-accounting', url: '/admin/accounting', role: 'admin', needsCart: false, height: 900, action: null },
  // 17. 반응형 — 태블릿
  { name: 'tablet-home', url: '/', role: 'member', needsCart: false, height: 800, action: 'tablet' },
  // 16. 반응형 — 모바일
  { name: 'mobile-product', url: '/products/P001', role: 'member', needsCart: false, height: 800, action: 'mobile' },
];

async function setAuth(page, role) {
  await page.evaluate(({ role, stdUser, vipUser }) => {
    if (role === 'guest') {
      localStorage.removeItem('b2b-role');
      localStorage.removeItem('b2b-user');
      localStorage.removeItem('b2b-cart');
    } else if (role === 'admin') {
      localStorage.setItem('b2b-role', 'admin');
      localStorage.removeItem('b2b-user');
    } else {
      localStorage.setItem('b2b-role', 'member');
      localStorage.setItem('b2b-user', JSON.stringify(stdUser));
    }
  }, { role, stdUser: STANDARD_USER, vipUser: VIP_USER });
}

async function captureScreenshots(browser) {
  console.log('Capturing screenshots at 1440x900, 1x scale...');
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const screenshots = {};

  // Initial load to set localStorage
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });

  for (const pg of PAGES_TO_CAPTURE) {
    console.log(`  ${pg.name}: ${BASE_URL}${pg.url}`);

    // Set auth before navigation
    await setAuth(page, pg.role);

    // Handle responsive captures
    if (pg.action === 'tablet') {
      await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
    } else if (pg.action === 'mobile') {
      await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    } else {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    }

    // Set cart if needed
    if (pg.needsCart) {
      await page.evaluate((items) => {
        localStorage.setItem('b2b-cart', JSON.stringify(items));
      }, CART_ITEMS);
    }

    await page.goto(`${BASE_URL}${pg.url}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));

    // Dismiss popup overlay if present
    await page.evaluate(() => {
      const closeBtn = document.querySelector('#popup-overlay button, [class*="popup"] button[class*="close"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Hide footer to focus on core UI
    await page.evaluate(() => {
      const footer = document.getElementById('footer');
      if (footer) footer.style.display = 'none';
    });

    // Page-specific actions
    if (pg.action === 'signupFill') {
      // Fill step 1 fields (no submit — clean state without validation errors)
      await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
          const name = input.getAttribute('name') || input.getAttribute('id') || '';
          if (name.includes('id') || name.includes('loginId')) input.value = 'testuser';
          if (name.includes('password') || name.includes('Password')) input.value = 'Test1234!';
          if (name.includes('name') || name.includes('Name')) input.value = '홍길동';
          if (name.includes('phone') || name.includes('tel')) input.value = '010-1234-5678';
          if (name.includes('email')) input.value = 'test@test.com';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
      await new Promise(r => setTimeout(r, 500));
    }

    // Measure actual content bottom (footer already hidden)
    const contentHeight = await page.evaluate(() => {
      // Look for the page content container inside <main>
      const main = document.querySelector('main');
      if (main && main.firstElementChild) {
        const content = main.firstElementChild;
        const rect = content.getBoundingClientRect();
        return Math.ceil(rect.bottom + 24);
      }
      // Fallback: scan all direct children of body for max bottom
      let maxBottom = 0;
      document.querySelectorAll('body *').forEach(el => {
        if (el.offsetHeight > 0 && el.children.length === 0) {
          const r = el.getBoundingClientRect();
          if (r.bottom > maxBottom) maxBottom = r.bottom;
        }
      });
      return Math.ceil(maxBottom + 24) || 900;
    });

    // Take screenshot — use content height if shorter than max height
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${pg.name}.png`);
    if (pg.action === 'tablet') {
      const h = Math.min(contentHeight, pg.height);
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 768, height: h } });
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    } else if (pg.action === 'mobile') {
      const h = Math.min(contentHeight, pg.height);
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 375, height: h } });
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    } else {
      const h = Math.min(contentHeight, pg.height);
      await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 1440, height: h } });
    }

    const buf = fs.readFileSync(screenshotPath);
    screenshots[pg.name] = buf.toString('base64');
    const sizeKB = (buf.length / 1024).toFixed(0);
    console.log(`    -> ${pg.name}.png (${sizeKB} KB)`);
  }

  await page.close();
  return screenshots;
}

function buildHTML(screenshots) {
  const img = (name) => `data:image/png;base64,${screenshots[name]}`;
  const totalPages = 12;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>B2B 폐쇄몰 전환 제안서</title>
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
    background: linear-gradient(160deg, #0F2440 0%, #1B3A5C 60%, #0D9488 100%);
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
    border-bottom: 3px solid #1B3A5C;
    margin-bottom: 28px;
  }
  .page-header h2 {
    font-size: 26px; font-weight: 800; color: #0F2440;
    line-height: 1.2;
  }
  .page-num {
    font-size: 13px; color: #9CA3AF; font-weight: 500;
    white-space: nowrap; padding-top: 6px;
  }

  /* Highlight box */
  .highlight-box {
    background: #F3F4F6; border-left: 4px solid #1B3A5C;
    padding: 16px 22px; margin: 8px 0 20px;
    font-size: 13.5px; color: #4B5563; line-height: 1.8;
  }

  /* Section title */
  .section-title {
    font-size: 16px; font-weight: 700; color: #0F2440;
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
    color: #0D9488; font-weight: bold; font-size: 14px;
  }

  /* Experience card */
  .exp-card {
    background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 0;
    padding: 22px 26px; margin: 8px 0 18px;
  }
  .exp-card h4 { font-size: 16px; font-weight: 700; color: #0F2440; margin-bottom: 4px; }
  .exp-card .period { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; }
  .exp-card .desc { font-size: 13px; color: #4B5563; line-height: 1.8; margin-bottom: 14px; }

  /* Tech badges */
  .tech-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .tech-badges span {
    background: #1B3A5C; color: #fff;
    font-size: 11px; padding: 5px 14px;
    border-radius: 20px; font-weight: 500;
  }

  /* Bullet list */
  .bullet-list { list-style: none; margin-top: 4px; }
  .bullet-list li {
    font-size: 13px; color: #4B5563; line-height: 1.9;
    padding-left: 16px; position: relative; margin-bottom: 1px;
  }
  .bullet-list li::before {
    content: ""; position: absolute; left: 0; top: 10px;
    width: 5px; height: 5px; background: #1B3A5C; border-radius: 50%;
  }

  /* Schedule table */
  .schedule-table {
    width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;
  }
  .schedule-table th {
    background: #1B3A5C; color: #fff; font-weight: 600;
    padding: 10px 14px; text-align: left; font-size: 12px;
  }
  .schedule-table td {
    padding: 9px 14px; border-bottom: 1px solid #E5E7EB; text-align: left;
    color: #4B5563;
  }
  .schedule-table tr:nth-child(even) { background: #F9FAFB; }

  /* Tech stack card grid */
  .tech-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-top: 12px;
  }
  .tech-card {
    background: #F9FAFB; border-radius: 0;
    border: 1px solid #E5E7EB;
    overflow: hidden;
  }
  .tech-card-header {
    background: #1B3A5C; color: #fff;
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
  .tech-card-body p { font-size: 12px; color: #4B5563; line-height: 1.7; }

  /* Screenshot grid */
  .screenshot-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 14px; flex: 1; margin-top: 4px;
  }
  .screenshot-item { display: flex; flex-direction: column; }
  .screenshot-item img {
    width: 100%; height: 210px; object-fit: contain;
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
    font-size: 13px; font-weight: 700; color: #0F2440; margin-top: 4px;
    text-align: center;
  }
  .screenshot-item .desc { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 1px; }

  /* Step indicators */
  .step-row {
    display: flex; align-items: flex-start; margin-bottom: 24px;
  }
  .step-circle {
    width: 28px; height: 28px; min-width: 28px;
    background: #1B3A5C; color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; margin-right: 14px; margin-top: 1px;
  }
  .step-text { font-size: 13.5px; color: #111827; line-height: 1.5; font-weight: 500; }
  .step-sub { font-size: 11.5px; color: #9CA3AF; line-height: 1.5; margin-top: 1px; }

  /* QR placeholder */
  .qr-placeholder {
    width: 160px; height: 160px;
    border: 2px dashed #D1D5DB; border-radius: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: #9CA3AF; font-size: 12px; background: #F9FAFB;
  }
  .qr-placeholder .qr-icon { font-size: 24px; margin-bottom: 6px; color: #D1D5DB; }

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
    background: #F3F4F6; border-left: 4px solid #0D9488;
    padding: 14px 20px; margin: 8px 0 24px;
    font-size: 14px; color: #1B3A5C; font-weight: 600;
  }

  /* Key capability cards */
  .cap-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;
  }
  .cap-card {
    background: #F3F4F6; padding: 12px 16px;
  }
  .cap-card p.cap-title { font-size: 13px; font-weight: 700; color: #0F2440; margin-bottom: 4px; }
  .cap-card p.cap-desc { font-size: 11px; color: #6B7280; line-height: 1.5; }

  /* B2B highlight tags */
  .b2b-tag {
    display: inline-block;
    background: #0D9488; color: #fff;
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 3px;
    margin-right: 6px; margin-bottom: 4px;
  }
</style>
</head>
<body>

<!-- PAGE 1: Cover -->
<div class="page cover">
  <div>
    <div class="spaced-title">P R O P O S A L</div>
    <h1>아임웹 쇼핑몰 &rarr; 자체구축<br>B2B 폐쇄몰 전환</h1>
    <div class="divider"></div>
    <div class="subtitle">제안서</div>
  </div>
</div>

<!-- PAGE 2: 프로젝트 이해도 -->
<div class="page content-page">
  <div class="page-header">
    <h2>프로젝트 이해도</h2>
    <span class="page-num">02 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="highlight-box">
    <strong>의뢰 핵심:</strong> 아임웹 기반 쇼핑몰을 B2B 전용 폐쇄몰로 전환하여, 사업자 인증 기반 회원 관리, 이카운트 ERP 연동, 회계솔루션 API 자동 발행, 구매 제한 등 B2B 특화 기능을 갖춘 자체 구축 플랫폼을 구현합니다.
  </div>
  <div class="section-title">주요 요구사항</div>
  <ul class="checklist-grid">
    <li>B2B 폐쇄몰 게이트 (로그인 필수 접근)</li>
    <li>사업자 전용 회원가입 + 사업자번호 검증</li>
    <li>사업자등록증 / 소매인지정서 업로드</li>
    <li>이중 인증 (사업자 + 본인/성인인증)</li>
    <li>관리자 승인 프로세스</li>
    <li>회원별 할인 + 현금영수증 자동 적용</li>
    <li>상품 등록/수정/삭제 + 옵션별 재고</li>
    <li>회원별 상품 공개 여부 설정</li>
    <li>구매 기준 제한 (금액/수량/기간)</li>
    <li>필터 선택 가능한 엑셀 다운로드</li>
    <li>관리자 직접 주문 생성 + 수정</li>
    <li>계좌이체/무통장 입금 결제</li>
    <li>이카운트 ERP 연동 (주문조회/상품)</li>
    <li>회계솔루션 API (현금영수증/세금계산서)</li>
    <li>관리자 대시보드 (매출/주문/회원 통계)</li>
    <li>팝업 기능 (단일/슬라이드)</li>
    <li>DB 마이그레이션 (아임웹 데이터 이관)</li>
    <li>모바일 반응형 웹디자인</li>
  </ul>
  <div style="border-top: 1px solid #E5E7EB; margin-top: 10px; padding-top: 10px;">
    <div class="section-title" style="margin-top: 0;">핵심 역량</div>
    <div class="cap-grid">
      <div class="cap-card">
        <p class="cap-title">B2B 커머스 풀사이클 구축 경험</p>
        <p class="cap-desc">쇼핑몰 기획부터 결제 연동, 소셜 로그인, 알림톡까지 실제 서비스에 필요한 전체 기능을 직접 구축한 경험이 있습니다.</p>
      </div>
      <div class="cap-card">
        <p class="cap-title">ERP/회계 연동 아키텍처</p>
        <p class="cap-desc">이카운트 ERP 동기화, 세금계산서/현금영수증 자동발행을 cron + 어댑터 패턴으로 구현하여 안정적 운영을 보장합니다.</p>
      </div>
      <div class="cap-card">
        <p class="cap-title">반응형 웹 PC/모바일 동시 대응</p>
        <p class="cap-desc">Tailwind CSS 기반 하나의 코드베이스로 PC와 모바일을 동시에 지원, 개발/유지보수 비용을 절감합니다.</p>
      </div>
      <div class="cap-card">
        <p class="cap-title">실제 동작 데모 사전 제공</p>
        <p class="cap-desc">제안 단계에서 14페이지 데모를 직접 제공합니다. 폐쇄몰 게이트, 사업자 가입, 주문, 관리자 전체 기능을 미리 확인하실 수 있습니다.</p>
      </div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 3: 유사 경험 -->
<div class="page content-page">
  <div class="page-header">
    <h2>유사 경험</h2>
    <span class="page-num">03 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="exp-card" style="padding: 28px 30px; margin: 12px 0 28px;">
    <h4>패키지 디자인 에디터 쇼핑몰</h4>
    <div class="period" style="margin-bottom: 14px;">2025.01 ~ 2025.06 (6개월) &middot; 기획 / 디자인 / 개발 100% 수행</div>
    <p class="desc" style="margin-bottom: 20px;">
      커스텀 패키지(컵, 봉투 등) 주문 전문 쇼핑몰입니다. 상품 선택 후 에디터에서 디자인을 직접 편집·확정한 뒤 구매하는 B2B 성격의 커머스 플랫폼으로,
      사업자 고객 중심의 주문 프로세스와 결제 연동, 알림 시스템을 단독 구축했습니다.
    </p>
    <div class="tech-badges" style="gap: 8px;">
      <span>Nuxt.js</span><span>Django</span><span>Three.js</span><span>Fabric.js</span>
      <span>PostgreSQL</span><span>토스페이먼츠</span><span>카카오지도</span>
      <span>네이버 로그인</span><span>카카오 로그인</span><span>카카오 알림톡</span>
    </div>
  </div>
  <div class="section-title" style="margin: 0 0 12px;">B2B 관점에서의 연관성</div>
  <ul class="bullet-list" style="margin-top: 8px;">
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="b2b-tag">결제 연동</span> 토스페이먼츠 카드/가상계좌/간편결제 연동 경험 &rarr; 이번 프로젝트의 <strong>계좌이체/무통장 결제 + 입금확인 워크플로우</strong>에 직접 활용</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="b2b-tag">사업자 고객</span> B2B 성격의 주문 프로세스 구현 경험 &rarr; <strong>사업자 인증 기반 회원관리, 관리자 승인 프로세스</strong>와 동일한 패턴</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="b2b-tag">풀스택 개발</span> 프론트엔드 + 백엔드 단독 구축 &rarr; Next.js API Routes + Prisma ORM으로 <strong>동일한 풀스택 구조</strong> 적용</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="b2b-tag">외부 API</span> 소셜 로그인/카카오 알림톡 연동 경험 &rarr; <strong>이카운트 ERP, 회계솔루션 API, 국세청 사업자 검증 API</strong> 연동에 활용</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="b2b-tag">DB 관리</span> PostgreSQL 기반 상품/주문/회원 데이터 설계 &rarr; <strong>아임웹 데이터 마이그레이션</strong> 및 Prisma ORM 설계에 직접 활용</li>
    <li style="margin-bottom: 12px; line-height: 1.8;"><span class="b2b-tag">관리자 기능</span> 상품 CRUD, 주문 관리, 회원 관리 관리자 패널 구축 &rarr; <strong>B2B 관리자 대시보드, 주문생성, 회원승인</strong> 동일 구조</li>
  </ul>
  </div>
</div>

<!-- PAGE 4: 구현 계획 -->
<div class="page content-page">
  <div class="page-header">
    <h2>구현 계획</h2>
    <span class="page-num">04 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <p style="font-size:14px; color:#4B5563; margin-bottom:16px;">총 <strong>21일(3주)</strong> 일정으로 체계적으로 진행합니다. 핵심 기능 우선 구현 후, ERP/회계 연동은 마지막 주에 집중합니다.</p>
  <table class="schedule-table" style="font-size:13px;">
    <thead>
      <tr><th style="width:100px; padding: 12px 18px;">기간</th><th style="width:130px; padding: 12px 18px;">단계</th><th style="padding: 12px 18px;">세부 내용</th></tr>
    </thead>
    <tbody>
      <tr><td style="padding: 11px 18px;">1주차 (1~7일)</td><td style="padding: 11px 18px;">프로젝트 세팅<br>+ 회원 + 상품</td><td style="padding: 11px 18px;">DB 스키마 설계, 개발환경 구성, 사업자 전용 회원가입 (사업자번호 검증, 서류 업로드, 이중인증), 관리자 승인 프로세스, 폐쇄몰 게이트, 상품 CRUD + 옵션별 재고</td></tr>
      <tr><td style="padding: 11px 18px;">2주차 (8~14일)</td><td style="padding: 11px 18px;">주문/결제<br>+ 관리자</td><td style="padding: 11px 18px;">구매 기준 제한, 장바구니/결제(무통장/계좌이체), 회원별 할인 + 현금영수증, 주문 상태 관리, 관리자 대시보드, 주문 생성/수정, 엑셀 다운로드, 팝업 관리</td></tr>
      <tr><td style="padding: 11px 18px;">3주차 (15~21일)</td><td style="padding: 11px 18px;">연동 + 마이그레이션<br>+ QA/배포</td><td style="padding: 11px 18px;">이카운트 ERP 연동, 회계솔루션 API 연동, 아임웹 DB 마이그레이션, 반응형 최적화, 통합 테스트, 버그 수정, 최종 배포, 인수인계</td></tr>
    </tbody>
  </table>
  <div style="margin-top: 24px; background: #FEF3C7; border-left: 4px solid #D97706; padding: 14px 20px;">
    <p style="font-size: 12.5px; color: #92400E; line-height: 1.7;">
      <strong>사전 준비 요청:</strong> 이카운트 ERP API 문서 + 테스트 계정, 회계솔루션 확정 및 API 문서, 아임웹 데이터 추출 방법(CSV/API) 확인을 착수 전에 제공해 주시면 일정 리스크를 최소화할 수 있습니다.
    </p>
  </div>
  </div>
</div>

<!-- PAGE 5: 제안 기술스택 -->
<div class="page content-page">
  <div class="page-header">
    <h2>제안 기술스택</h2>
    <span class="page-num">05 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="tech-grid">
    <div class="tech-card">
      <div class="tech-card-header">Frontend <span>Next.js 14+ (App Router) + Tailwind CSS</span></div>
      <div class="tech-card-body">
        <p>React 기반 풀스택 프레임워크로, SSR/SSG 지원 및 SEO 최적화에 탁월합니다. Tailwind CSS와 결합하여 B2B 폐쇄몰에 적합한 깔끔한 UI를 빠르게 구현합니다. 반응형 기본 지원으로 모바일 대응도 효율적입니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Backend <span>Next.js API Routes (Route Handlers)</span></div>
      <div class="tech-card-body">
        <p>별도 백엔드 서버 없이 프론트와 동일 프로젝트에서 API를 구현합니다. ERP/회계 API 연동, 사업자번호 검증, 파일 업로드 등 모든 서버 로직을 통합 관리하여 개발/운영 효율을 높입니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Database <span>PostgreSQL (AWS RDS) + Prisma</span></div>
      <div class="tech-card-body">
        <p>관리형 DB로 백업/복구를 자동화합니다. JSON 컬럼으로 ERP 연동 데이터를 유연하게 저장하고, Prisma ORM으로 타입 안전한 쿼리와 아임웹 데이터 마이그레이션을 지원합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Infrastructure <span>AWS Lightsail</span></div>
      <div class="tech-card-body">
        <p>고정 비용 VPS로 운영 비용을 예측 가능하게 관리합니다. cron job으로 ERP 동기화/회계 자동발행을 처리하고, 서버 프로세스 시간 제한 없이 장시간 API 호출이 가능합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Storage <span>AWS S3 + CloudFront</span></div>
      <div class="tech-card-body">
        <p>사업자등록증/소매인지정서 등 파일 업로드를 presigned URL로 처리합니다. CloudFront CDN으로 상품 이미지 등 정적 파일을 빠르게 제공합니다.</p>
      </div>
    </div>
    <div class="tech-card">
      <div class="tech-card-header">Authentication <span>NextAuth.js + 자체 인증</span></div>
      <div class="tech-card-body">
        <p>사업자 인증 + 본인인증(NICE/PASS) 이중 체계를 구현합니다. 서버사이드 callback으로 인증 결과를 안전하게 처리하고, 관리자 승인 프로세스로 접근을 통제합니다.</p>
      </div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 6: 데모 소개 1 (2x2 그리드 — 폐쇄몰/회원/홈/상품) -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">06 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="highlight-box" style="margin-bottom: 14px;">
    실제 동작하는 데모를 미리 준비했습니다. 제안 단계에서 완성도를 직접 확인하실 수 있습니다.
  </div>
  <div class="screenshot-grid">
    <div class="screenshot-item">
      <img src="${img('login')}" alt="폐쇄몰 게이트">
      <div class="label">B2B 폐쇄몰 게이트 (로그인)</div>
      <div class="desc">비로그인 시 로그인 필수, 공식홈페이지 이동 배너, 데모 안내</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('signup')}" alt="사업자 회원가입">
      <div class="label">사업자 전용 회원가입</div>
      <div class="desc">3단계 가입: 기본정보 → 사업자정보(검증+업로드) → 약관동의</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('homepage')}" alt="홈/상품 목록">
      <div class="label">홈 / 상품 목록</div>
      <div class="desc">배너, 카테고리, 추천/신상품/인기 상품 그리드</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('product-detail')}" alt="상품 상세">
      <div class="label">상품 상세 (VIP 할인가)</div>
      <div class="desc">옵션/재고 선택, 회원등급별 할인가, 구매 제한 안내</div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 7: 데모 소개 2 (2x2 그리드 — 장바구니/결제/마이페이지) -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">07 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="screenshot-grid">
    <div class="screenshot-item">
      <img src="${img('cart')}" alt="장바구니">
      <div class="label">장바구니</div>
      <div class="desc">수량 조절, 최소 주문금액/수량 검증, 회원 할인 적용</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('checkout')}" alt="주문/결제">
      <div class="label">주문 / 결제</div>
      <div class="desc">무통장입금/계좌이체, 현금영수증 자동 입력, 세금계산서</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('mypage-orders')}" alt="마이페이지 주문내역">
      <div class="label">마이페이지 — 주문내역</div>
      <div class="desc">주문 목록, 상태 필터, 기간 검색, 주문 상세 모달</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('mypage-profile')}" alt="마이페이지 회원정보">
      <div class="label">마이페이지 — 회원정보</div>
      <div class="desc">사업자 정보, 회원등급/할인율, 현금영수증 설정</div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 8: 데모 소개 3 (2x2 그리드 — 관리자 대시보드/회원/상품/주문) -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">08 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="screenshot-grid">
    <div class="screenshot-item">
      <img src="${img('admin-dashboard')}" alt="관리자 대시보드">
      <div class="label">관리자 — 대시보드</div>
      <div class="desc">오늘 주문/미확인 입금/대기 회원/월 매출, 매출 차트</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-members')}" alt="관리자 회원관리">
      <div class="label">관리자 — 회원관리</div>
      <div class="desc">회원 승인/거절, 등급 변경, 할인율 설정, 상태 필터</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-products')}" alt="관리자 상품관리">
      <div class="label">관리자 — 상품관리</div>
      <div class="desc">상품 CRUD, 옵션별 재고, 회원별 공개, 구매 제한 설정</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-orders')}" alt="관리자 주문관리">
      <div class="label">관리자 — 주문관리</div>
      <div class="desc">주문 목록, 필터/검색, 입금확인, 엑셀 다운로드</div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 9: 데모 소개 4 (2x2 그리드 — 주문생성/팝업/반응형) -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">09 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="screenshot-grid">
    <div class="screenshot-item">
      <img src="${img('admin-order-create')}" alt="관리자 주문생성">
      <div class="label">관리자 — 주문생성</div>
      <div class="desc">회원 검색/선택, 상품 추가, 할인 적용, 직접 주문 생성</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-popups')}" alt="관리자 팝업관리">
      <div class="label">관리자 — 팝업관리</div>
      <div class="desc">팝업 CRUD, 단일/슬라이드 유형, 미리보기, 노출 기간</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-erp')}" alt="이카운트 ERP 연동">
      <div class="label">이카운트 ERP 연동</div>
      <div class="desc">동기화 로그, 상품 매핑, API 설정, 수동 동기화</div>
    </div>
    <div class="screenshot-item">
      <img src="${img('admin-accounting')}" alt="회계솔루션 연동">
      <div class="label">회계솔루션 연동</div>
      <div class="desc">세금계산서/현금영수증 발행 이력, 자동발행 설정</div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 10: 데모 소개 5 — 반응형 웹디자인 -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">10 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div class="screenshot-grid">
    <div class="screenshot-item">
      <div class="img-wrapper">
        <img src="${img('tablet-home')}" alt="태블릿 홈">
        <img src="${img('mobile-product')}" alt="모바일 상품상세">
      </div>
      <div class="label">반응형 웹디자인</div>
      <div class="desc">태블릿(768px) + 모바일(375px) 최적화 레이아웃</div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 11: 외부 연동 구현 계획 (텍스트) -->
<div class="page content-page">
  <div class="page-header">
    <h2>외부 연동 구현 계획</h2>
    <span class="page-num">11 / ${totalPages}</span>
  </div>
  <div class="page-body">
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:4px;">
    <div style="border:1px solid #E5E7EB; overflow:hidden;">
      <div style="background:#1B3A5C; color:#fff; padding:12px 20px; font-size:14px; font-weight:700;">이카운트 ERP 연동</div>
      <div style="padding:18px 20px;">
        <ul class="bullet-list">
          <li style="margin-bottom:8px;">주문 데이터 자동 동기화 (쇼핑몰 → ERP)</li>
          <li style="margin-bottom:8px;">이벤트성 상품 ERP 연동 등록</li>
          <li style="margin-bottom:8px;">재고 수량 실시간 연동</li>
          <li style="margin-bottom:8px;">어댑터 패턴으로 API 변경 대응</li>
        </ul>
        <p style="font-size:11px; color:#9CA3AF; margin-top:12px;">※ 데모에서 Mock UI로 연동 화면 구현 완료</p>
      </div>
    </div>
    <div style="border:1px solid #E5E7EB; overflow:hidden;">
      <div style="background:#1B3A5C; color:#fff; padding:12px 20px; font-size:14px; font-weight:700;">회계솔루션 API 연동</div>
      <div style="padding:18px 20px;">
        <ul class="bullet-list">
          <li style="margin-bottom:8px;">현금영수증 자동 발행 (회원 번호 기반)</li>
          <li style="margin-bottom:8px;">세금계산서 자동 발행 (주문 확정 시)</li>
          <li style="margin-bottom:8px;">발행 이력 조회 및 관리</li>
          <li style="margin-bottom:8px;">솔루션 변경 시 어댑터만 교체</li>
        </ul>
        <p style="font-size:11px; color:#9CA3AF; margin-top:12px;">※ 솔루션 확정 후 API 문서 기반 연동</p>
      </div>
    </div>
    <div style="border:1px solid #E5E7EB; overflow:hidden;">
      <div style="background:#1B3A5C; color:#fff; padding:12px 20px; font-size:14px; font-weight:700;">사업자 인증 / 본인인증</div>
      <div style="padding:18px 20px;">
        <ul class="bullet-list">
          <li style="margin-bottom:8px;">국세청 API 사업자번호 실시간 검증</li>
          <li style="margin-bottom:8px;">NICE/PASS 본인인증 연동</li>
          <li style="margin-bottom:8px;">성인인증 + 사업자 이중 인증 체계</li>
          <li style="margin-bottom:8px;">사업자등록증/소매인지정서 파일 업로드</li>
        </ul>
        <p style="font-size:11px; color:#9CA3AF; margin-top:12px;">※ API 비용 부담 주체 사전 합의 필요</p>
      </div>
    </div>
    <div style="border:1px solid #E5E7EB; overflow:hidden;">
      <div style="background:#1B3A5C; color:#fff; padding:12px 20px; font-size:14px; font-weight:700;">DB 마이그레이션 (아임웹)</div>
      <div style="padding:18px 20px;">
        <ul class="bullet-list">
          <li style="margin-bottom:8px;">아임웹 API/CSV 기반 데이터 추출</li>
          <li style="margin-bottom:8px;">회원/상품/주문 데이터 매핑 + 변환</li>
          <li style="margin-bottom:8px;">Prisma 마이그레이션으로 신규 DB 이관</li>
          <li style="margin-bottom:8px;">무결성 검증 + 롤백 대비</li>
        </ul>
        <p style="font-size:11px; color:#9CA3AF; margin-top:12px;">※ 데이터 추출 방법 사전 확인 필요</p>
      </div>
    </div>
  </div>
  </div>
</div>

<!-- PAGE 12: 데모 접속 안내 -->
<div class="page content-page">
  <div class="page-header">
    <h2>데모 접속 안내</h2>
    <span class="page-num">${totalPages} / ${totalPages}</span>
  </div>
  <div class="demo-access-layout">
    <div class="demo-access-left">
      <div class="section-title" style="margin-top:0;">데모 URL</div>
      <div class="url-box">
        <a href="https://firstpip.github.io/kmong-225550-b2b-mall-demo/" style="color: #1B3A5C; text-decoration: underline;">https://firstpip.github.io/kmong-225550-b2b-mall-demo/</a>
      </div>
      <div class="section-title">접속 방법</div>
      <div class="step-row">
        <div class="step-circle">1</div>
        <div>
          <div class="step-text">제공된 URL에 PC 또는 모바일 브라우저로 접속합니다.</div>
          <div class="step-sub">Chrome, Safari, Edge 등 최신 브라우저를 권장합니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">2</div>
        <div>
          <div class="step-text">로그인 페이지에서 아무 값이나 입력하여 로그인합니다.</div>
          <div class="step-sub">데모 버전이므로 어떤 값이든 로그인됩니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">3</div>
        <div>
          <div class="step-text">상품 목록에서 상품을 선택하고, 장바구니 담기 → 주문/결제까지 전체 구매 플로우를 체험합니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">4</div>
        <div>
          <div class="step-text">헤더의 역할 전환 버튼으로 관리자 모드를 활성화하여 관리자 기능을 확인합니다.</div>
          <div class="step-sub">대시보드, 회원/상품/주문 관리, 주문 생성, 팝업 관리를 체험할 수 있습니다.</div>
        </div>
      </div>
    </div>
    <div class="demo-access-right">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://firstpip.github.io/kmong-225550-b2b-mall-demo/" alt="QR코드" style="width:120px; height:120px;">
      <p style="font-size:11px; color:#9CA3AF; margin-top:10px; text-align:center;">모바일에서 QR 스캔</p>
    </div>
  </div>
  <div style="margin-top: 20px; padding: 20px 24px; background: #F3F4F6;">
    <p style="font-size: 13px; font-weight: 700; color: #0F2440; margin-bottom: 14px;">체험 가능한 플로우</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px 40px;">
      <p style="font-size: 12px; color: #4B5563; line-height: 1.7;"><strong style="color:#0F2440;">B2B 구매</strong> — 로그인 → 상품 검색 → 상세 (할인가 확인) → 옵션 선택 → 장바구니 → 주문/결제 (무통장/계좌이체)</p>
      <p style="font-size: 12px; color: #4B5563; line-height: 1.7;"><strong style="color:#0F2440;">회원가입</strong> — 기본정보 입력 → 사업자정보 (번호 검증 + 서류 업로드) → 약관동의 → 승인 대기</p>
      <p style="font-size: 12px; color: #4B5563; line-height: 1.7;"><strong style="color:#0F2440;">관리자 회원</strong> — 관리자 모드 전환 → 회원관리 → 승인/거절 → 등급/할인율 변경</p>
      <p style="font-size: 12px; color: #4B5563; line-height: 1.7;"><strong style="color:#0F2440;">관리자 주문</strong> — 주문관리 → 입금확인 → 상태 변경 → 직접 주문 생성 → 엑셀 다운로드</p>
    </div>
  </div>
</div>

</body>
</html>`;
}

async function main() {
  console.log('=== B2B Proposal PDF Generator ===\n');

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
    await new Promise(r => setTimeout(r, 2000));

    const pdfPath = path.join(ROOT, 'B2B_폐쇄몰_전환_제안서.pdf');
    await page.pdf({
      path: pdfPath,
      width: '297mm',
      height: '210mm',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const pdfSizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2);
    console.log(`  B2B_폐쇄몰_전환_제안서.pdf saved (${pdfSizeMB} MB)`);

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
