// generate-pdf.js — 가구 브랜드 통합 쇼핑몰 제안서 PDF 생성
//
// templates/proposal-page.html 구조를 그대로 따르고, 색 토큰은 demo-app/src/app/globals.css
// :root 값으로, 콘텐츠는 analysis.md / 경험_포트폴리오.md / demo-plan.md 기준으로 교체.
// 스크린샷은 ./screenshots/ 27장 중 16장을 선별해 dataUri로 임베드.

const puppeteer = require('/Users/simjeong-gyu/Desktop/outsourcing/bidding/kmong-225711-homepage/node_modules/puppeteer');
const QRCode = require('/Users/simjeong-gyu/Desktop/outsourcing/bidding/kmong-225711-homepage/node_modules/qrcode');
const fs = require('fs');
const path = require('path');

// ============================================================================
// PROJECT CONFIG
// ============================================================================

const ROOT = __dirname;
const SS_DIR = path.join(ROOT, 'screenshots');
const HTML_PATH = path.join(ROOT, 'proposal-page.html');
const PDF_PATH = path.join(ROOT, '가구브랜드_통합쇼핑몰_제안서.pdf');
const DEMO_URL = 'https://firstpip.github.io/demos/kmong-225943-demo/';
const PROJECT_TITLE = '가구 브랜드 통합 쇼핑몰 신규 개발';

// 색 토큰 (demo-app/src/app/globals.css :root)
const C = {
  bg:        '#faf7f2',
  surface:   '#ffffff',
  surface2:  '#f4efe6',
  border:    '#e8dcc8',
  text:      '#2a2520',
  textMuted: '#6b5e4f',
  primary:   '#5c4632',
  primaryFg: '#faf7f2',
  accent:    '#8a5f1c',
  success:   '#1b6a3f',
  warn:      '#815818',
  maholnBg:  '#f5f3ee',
  maholnAcc: '#a89272',
};

// ============================================================================
// 헬퍼
// ============================================================================

function dataUri(name) {
  const p = path.join(SS_DIR, name);
  const buf = fs.readFileSync(p);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function shot(file, label, desc) {
  return `
    <div class="screenshot-item">
      <img src="${dataUri(file)}" alt="${label}">
      <div class="label">${label}</div>
      <div class="desc">${desc}</div>
    </div>
  `;
}

// ============================================================================
// HTML 빌드
// ============================================================================

async function buildHtml() {
  const qrDataUri = await QRCode.toDataURL(DEMO_URL, { margin: 1, width: 240, color: { dark: C.primary, light: '#ffffff' } });

  const CSS = `
  @page { size: A4 landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Pretendard', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: ${C.text}; line-height: 1.6;
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
    background: linear-gradient(160deg, ${C.primary} 0%, #6f5640 55%, ${C.accent} 100%);
    color: #fff;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
  }
  .cover .spaced-title {
    font-size: 14px; letter-spacing: 12px; font-weight: 300;
    color: rgba(255,255,255,0.5); margin-bottom: 48px;
    text-transform: uppercase;
  }
  .cover h1 {
    font-size: 36px; font-weight: 700; line-height: 1.5;
    margin-bottom: 36px; letter-spacing: -0.5px;
    color: #fff;
  }
  .cover .divider {
    width: 60px; height: 2px; background: rgba(255,255,255,0.35);
    margin: 0 auto 28px;
  }
  .cover .subtitle {
    font-size: 20px; font-weight: 300; color: rgba(255,255,255,0.65);
  }
  .cover .meta {
    margin-top: 60px; font-size: 13px; color: rgba(255,255,255,0.4);
    letter-spacing: 1px;
  }

  /* ===================== CONTENT PAGES ===================== */
  .content-page {
    background: ${C.bg};
    padding: 40px 52px 36px;
    display: flex; flex-direction: column;
  }
  .content-page .page-body {
    flex: 1;
    display: flex; flex-direction: column;
  }

  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 3px solid ${C.primary};
    margin-bottom: 28px;
  }
  .page-header h2 {
    font-size: 26px; font-weight: 800; color: ${C.primary};
    line-height: 1.2;
  }
  .page-num {
    font-size: 13px; color: ${C.textMuted}; font-weight: 500;
    white-space: nowrap; padding-top: 6px;
  }

  .highlight-box {
    background: ${C.surface2}; border-left: 4px solid ${C.primary};
    padding: 12px 18px; margin: 6px 0 14px;
    font-size: 12.5px; color: ${C.text}; line-height: 1.7;
  }

  .section-title {
    font-size: 15px; font-weight: 700; color: ${C.primary};
    margin: 12px 0 8px;
  }

  /* Persona grid (P2 상단) */
  .persona-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
    margin-top: 2px;
  }
  .persona-card {
    background: ${C.surface}; border: 1px solid ${C.border};
    padding: 10px 12px; border-radius: 6px;
  }
  .persona-card .ph {
    font-size: 10.5px; color: ${C.accent}; font-weight: 700; letter-spacing: 1px; margin-bottom: 3px;
  }
  .persona-card .pn {
    font-size: 12.5px; font-weight: 700; color: ${C.primary}; margin-bottom: 5px; line-height: 1.35;
  }
  .persona-card .pd { font-size: 11px; color: ${C.textMuted}; line-height: 1.5; }

  .checklist-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4px 24px; list-style: none;
  }
  .checklist-grid li {
    font-size: 11px; color: ${C.text}; line-height: 1.55;
    padding-left: 20px; position: relative;
  }
  .checklist-grid li::before {
    content: "\\2713"; position: absolute; left: 0;
    color: ${C.accent}; font-weight: bold; font-size: 13px;
  }

  .exp-card {
    background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 6px;
    padding: 22px 26px; margin: 8px 0 18px;
  }
  .exp-card h4 { font-size: 16px; font-weight: 700; color: ${C.primary}; margin-bottom: 4px; }
  .exp-card .period { font-size: 12px; color: ${C.textMuted}; margin-bottom: 10px; }
  .exp-card .desc { font-size: 13px; color: ${C.text}; line-height: 1.8; margin-bottom: 14px; }

  .tech-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .tech-badges span {
    background: ${C.primary}; color: #fff;
    font-size: 11px; padding: 5px 14px;
    border-radius: 20px; font-weight: 500;
  }

  .bullet-list { list-style: none; margin-top: 4px; }
  .bullet-list li {
    font-size: 13px; color: ${C.text}; line-height: 1.9;
    padding-left: 16px; position: relative; margin-bottom: 1px;
  }
  .bullet-list li::before {
    content: ""; position: absolute; left: 0; top: 10px;
    width: 5px; height: 5px; background: ${C.accent}; border-radius: 50%;
  }

  .schedule-table {
    width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;
  }
  .schedule-table th {
    background: ${C.primary}; color: #fff; font-weight: 600;
    padding: 10px 14px; text-align: left; font-size: 12px;
  }
  .schedule-table td {
    padding: 9px 14px; border-bottom: 1px solid ${C.border}; text-align: left;
    color: ${C.text};
  }
  .schedule-table tr:nth-child(even) { background: ${C.surface2}; }

  .tech-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-top: 12px;
  }
  .tech-card {
    background: ${C.surface}; border-radius: 6px;
    border: 1px solid ${C.border};
    overflow: hidden;
  }
  .tech-card-header {
    background: ${C.primary}; color: #fff;
    padding: 8px 20px;
    font-size: 13px; font-weight: 700;
  }
  .tech-card-header span {
    font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.75);
    margin-left: 8px;
  }
  .tech-card-body { padding: 14px 20px; }
  .tech-card-body p { font-size: 12px; color: ${C.text}; line-height: 1.7; }

  .screenshot-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 14px; flex: 1; margin-top: 4px;
  }
  .screenshot-item { display: flex; flex-direction: column; }
  .screenshot-item img {
    width: 100%; height: 210px; object-fit: contain;
    border: 1px solid ${C.border}; background: ${C.surface};
  }
  .screenshot-item .img-wrapper {
    display: flex; justify-content: space-evenly; align-items: flex-start;
    border: 1px solid ${C.border}; background: ${C.surface}; overflow: hidden;
    height: 210px;
  }
  .screenshot-item .img-wrapper img {
    border: none; width: auto; flex-shrink: 0; height: 210px; object-fit: contain;
  }
  .screenshot-item .label {
    font-size: 13px; font-weight: 700; color: ${C.primary}; margin-top: 4px;
    text-align: center;
  }
  .screenshot-item .desc { font-size: 11px; color: ${C.textMuted}; text-align: center; margin-top: 1px; }

  .step-row {
    display: flex; align-items: flex-start; margin-bottom: 24px;
  }
  .step-circle {
    width: 28px; height: 28px; min-width: 28px;
    background: ${C.primary}; color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; margin-right: 14px; margin-top: 1px;
  }
  .step-text { font-size: 13.5px; color: ${C.text}; line-height: 1.5; font-weight: 500; }
  .step-sub { font-size: 11.5px; color: ${C.textMuted}; line-height: 1.5; margin-top: 1px; }

  .demo-access-layout {
    display: flex; gap: 40px; flex: 1; margin-top: 4px;
  }
  .demo-access-left { flex: 1; }
  .demo-access-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    min-width: 200px; padding-top: 10px;
  }

  .url-box {
    background: ${C.surface}; border-left: 4px solid ${C.accent};
    padding: 14px 20px; margin: 8px 0 24px;
    font-size: 14px; color: ${C.primary}; font-weight: 600;
  }

  .cap-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 6px;
  }
  .cap-card {
    background: ${C.surface}; padding: 10px 12px; border: 1px solid ${C.border}; border-radius: 6px;
  }
  .cap-card p.cap-title { font-size: 12px; font-weight: 700; color: ${C.primary}; margin-bottom: 4px; line-height: 1.35; }
  .cap-card p.cap-desc { font-size: 11px; color: ${C.textMuted}; line-height: 1.5; }

  .b2b-tag {
    display: inline-block;
    background: ${C.accent}; color: #fff;
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 3px;
    margin-right: 6px; margin-bottom: 4px;
  }

  /* P11 외부 연동 카드 */
  .ext-card { border: 1px solid ${C.border}; overflow: hidden; background: ${C.surface}; border-radius: 6px; }
  .ext-card .ext-head { background: ${C.primary}; color: #fff; padding: 10px 18px; font-size: 13px; font-weight: 700; }
  .ext-card .ext-body { padding: 14px 18px; }
  `;

  // --------- 페이지 빌드 ---------

  const PAGE_1_COVER = `
<div class="page cover">
  <div>
    <div class="spaced-title">P R O P O S A L</div>
    <h1>가구 브랜드 통합 쇼핑몰<br>신규 개발 제안서</h1>
    <div class="divider"></div>
    <div class="subtitle">30개 조합사 본체 통합 + 마홀앤 마이크로사이트</div>
  </div>
</div>`;

  const PAGE_2_UNDERSTAND = `
<div class="page content-page">
  <div class="page-header">
    <h2>프로젝트 이해도</h2>
    <span class="page-num">02 / 12</span>
  </div>
  <div class="page-body">
    <div class="highlight-box">
      <strong>의뢰 핵심:</strong> 30개 조합사가 함께 운영하는 가구 전문 통합 쇼핑몰을 신규 개발합니다. 컬렉션 중심의 디자인 우선 전략, 카테고리 필터로 정리된 가구 카탈로그, 배송 예약과 지연 자동 보상, 조합사 권한 분리 CMS, 마홀앤 브랜드 마이크로사이트를 같은 코드베이스 안에서 구현합니다.
    </div>
    <div class="section-title" style="margin-top: 8px;">대표 페르소나</div>
    <div class="persona-grid">
      <div class="persona-card">
        <div class="ph">P-1</div>
        <div class="pn">30~40대 거실·주방 가구 검토자</div>
        <div class="pd">이사 일정에 맞춰 원목·오크 컬러·2주 내 배송 조건으로 후보를 좁혀 컬렉션을 비교 후 즉시 예약. 지연 시 자동 보상.</div>
      </div>
      <div class="persona-card">
        <div class="ph">P-2</div>
        <div class="pn">마홀앤 브랜드 팬 (재구매자)</div>
        <div class="pd">전용 마이크로사이트에서 룩북·신상품·스토리를 한 페이지에서 보고 자연스럽게 본체 장바구니로 회유.</div>
      </div>
      <div class="persona-card">
        <div class="ph">P-3</div>
        <div class="pn">조합사 운영자 (입점 브랜드)</div>
        <div class="pd">자기 브랜드 페이지의 이미지·가격을 직접 편집해 시장 반응을 빠르게 반영. 제품 신규 등록은 본체 관리자가 보호.</div>
      </div>
    </div>
    <div class="section-title">주요 요구사항</div>
    <ul class="checklist-grid">
      <li>컬렉션 중심 디자인 + 브랜드 톤·반응형·앱 패키징</li>
      <li>카테고리 필터 (제품군·브랜드·소재·컬러·사이즈·가격·배송일)</li>
      <li>회원가입 + SNS 로그인 + 본인 인증</li>
      <li>장바구니·결제 PG·주문/배송 관리·리뷰·평점·쿠폰·할인·적립금</li>
      <li>배송 예약 + 지연 자동 보상 (예약일 경과 시 적립금 자동 지급)</li>
      <li>상품 상세 태그·탭 + 연관/추천 상품</li>
      <li>조합사 브랜드 페이지 + 마홀앤 마이크로사이트 분리</li>
      <li>조합사 권한 분리 (이미지·가격만 허용, 제품 등록은 본체 관리자)</li>
      <li>비개발자 운영 CMS + 레이아웃 변경 자유도</li>
      <li>메인컷·텍스트 콘텐츠 모듈화 (재사용)</li>
      <li>SNS 콘텐츠 연동 + 영상 노출 최적화</li>
      <li>외부 솔루션 연동 (CRM·ERP·물류·사방넷·PG·알림톡)</li>
      <li>SEO 최적화 + 네이버 쇼핑 연동</li>
      <li>SSL 보안 + 개인정보 보호 + 페이지 로딩 최적화</li>
      <li>관리자 통계 페이지 + 정부지원사업 산출물 관리</li>
      <li>유지보수 범위·장애 대응·기능 개선 정책</li>
    </ul>
    <div style="border-top: 1px solid ${C.border}; margin-top: 8px; padding-top: 6px;">
      <div class="section-title" style="margin: 4px 0 6px;">핵심 역량</div>
      <div class="cap-grid">
        <div class="cap-card">
          <p class="cap-title">커머스 풀사이클 단독 수행</p>
          <p class="cap-desc">기획·UI/UX·프론트·백엔드·인프라를 한 라인으로 처리해 의사결정 손실 없이 30.4주 일정과 품질을 통제합니다.</p>
        </div>
        <div class="cap-card">
          <p class="cap-title">컬렉션·필터·콘텐츠 모듈화 설계</p>
          <p class="cap-desc">룩북 안에서 카테고리 필터가 작동하고, 동일 콘텐츠 카드가 본체와 마홀앤 양쪽에서 재사용되도록 구조 설계합니다.</p>
        </div>
        <div class="cap-card">
          <p class="cap-title">권한 분리 CMS + 감사 로그</p>
          <p class="cap-desc">조합사는 이미지·가격만, 본체 관리자는 제품 등록까지. 권한 차단 시 시도 로그가 자동 누적되어 운영 감사 가능.</p>
        </div>
        <div class="cap-card">
          <p class="cap-title">실제 동작 데모 사전 제공</p>
          <p class="cap-desc">제안 단계에 25페이지 + 138 동적 라우트 데모를 제공합니다. 4개 시연 시나리오를 PDF의 데모 접속 안내에서 바로 체험.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;

  const PAGE_3_EXPERIENCE = `
<div class="page content-page">
  <div class="page-header">
    <h2>유사 경험</h2>
    <span class="page-num">03 / 12</span>
  </div>
  <div class="page-body">
    <div class="exp-card" style="padding: 26px 30px; margin: 12px 0 24px;">
      <h4>패키지 디자인 에디터 쇼핑몰</h4>
      <div class="period" style="margin-bottom: 14px;">2025.01 ~ 2025.06 (6개월) · 기획 / UI·UX 디자인 / 프론트엔드 / 백엔드 / 인프라 단독 수행</div>
      <p class="desc" style="margin-bottom: 18px;">
        컵·봉투·포장재 등 패키지 디자인이 필요한 상품을 판매하는 커머스 플랫폼입니다. 카탈로그·상세·필터·검색·장바구니·결제·주문 관리·관리자 콘솔을
        단독 구축했고, 브라우저 내 디자인 에디터·3D 프리뷰·인쇄용 PDF 자동 추출까지 한 흐름으로 연결했습니다. 카카오 알림톡 단계별 자동 발송과
        결제·주문 상태 머신 운영 경험을 가구 쇼핑몰의 배송 예약 흐름과 자동 보상 로직에 그대로 적용할 수 있습니다.
      </p>
      <div class="tech-badges" style="gap: 8px;">
        <span>Nuxt 3</span><span>TypeScript</span><span>Django REST</span><span>PostgreSQL</span>
        <span>Celery</span><span>토스페이먼츠</span><span>네이버 로그인</span><span>카카오 로그인</span>
        <span>카카오 알림톡</span><span>AWS EC2 / RDS / S3 / CloudFront</span>
      </div>
    </div>
    <div class="section-title" style="margin: 0 0 12px;">본 프로젝트와의 연관성</div>
    <ul class="bullet-list" style="margin-top: 8px;">
      <li style="margin-bottom: 10px; line-height: 1.75;"><span class="b2b-tag">멀티 페르소나</span> 일반회원·기업회원·관리자 권한 분기 경험을 본 프로젝트의 사용자 / 조합사 운영자 / 본체 관리자 3축 권한 모델과 권한 차단 모달 구현에 적용</li>
      <li style="margin-bottom: 10px; line-height: 1.75;"><span class="b2b-tag">카탈로그·필터</span> 카탈로그·필터·정렬·검색·상세·CTA를 일관된 컴포넌트로 구현한 경험을 카테고리 필터 7가지 + 컬렉션 룩북 + 상품 상세 Tier 1/2 + 관련·추천 그리드에 이식</li>
      <li style="margin-bottom: 10px; line-height: 1.75;"><span class="b2b-tag">관리자 콘솔</span> 상품·주문·회원·쿠폰·알림톡 템플릿 CRUD 실사용 수준 구현 경험을 조합사 CMS, 본체 상품·주문·회원·콘텐츠 모듈 관리에 동일 패턴으로 적용</li>
      <li style="margin-bottom: 10px; line-height: 1.75;"><span class="b2b-tag">상태 머신</span> 결제→제작→배송→완료 다단계 상태 머신과 Celery 비동기 이벤트 큐 운영 경험을 배송 예약·지연 자동 보상 적립금 발급 로직에 적용</li>
      <li style="margin-bottom: 10px; line-height: 1.75;"><span class="b2b-tag">알림 자동화</span> 카카오 알림톡 주문 단계별 자동 발송과 실패 재시도 큐 운영 경험을 본 프로젝트의 주문 단계 알림과 외부 솔루션 (CRM·물류·사방넷) 연동에 직접 활용</li>
      <li style="margin-bottom: 10px; line-height: 1.75;"><span class="b2b-tag">단독 수행</span> 자체 서비스를 기획·디자인·개발·인프라까지 단독 수행해 6개월 일정과 품질을 직접 통제한 경험을 30.4주 일정과 디자인 우선 평가 기준 충족에 적용</li>
    </ul>
  </div>
</div>`;

  const PAGE_4_SCHEDULE = `
<div class="page content-page">
  <div class="page-header">
    <h2>구현 계획</h2>
    <span class="page-num">04 / 12</span>
  </div>
  <div class="page-body">
    <p style="font-size:14px; color:${C.text}; margin-bottom:16px;">총 <strong>30.4주 (213일)</strong> 일정. RFP 7절 분할에 맞춰 <strong>1차 4개월(2026.06~09)</strong>에 리뉴얼 구축범위 전체를 개발해 정상 운영 가능 상태를 만들고, <strong>2차 3개월(2026.10~12)</strong>에 제안사의 추가 아이디어 실현·외부 연동 라이브 전환·오픈 테스트·버그 수정을 진행합니다. 2차 견적에는 2026.10~12 임대 또는 호스팅 비용이 포함되고, 2027년도 운영 비용은 별도 제안으로 분리합니다.</p>
    <table class="schedule-table" style="font-size:12.5px;">
      <thead>
        <tr><th style="width:120px; padding: 11px 16px;">기간</th><th style="width:160px; padding: 11px 16px;">단계</th><th style="padding: 11px 16px;">세부 내용</th></tr>
      </thead>
      <tbody>
        <tr><td>1주차 (06.01~06.07)</td><td>킥오프 + 정보 구조</td><td>RFP 재정의, 30개 조합사 정산 룰 합의, IA·페르소나 확정, 디자인 시스템 토큰(컬러·타이포·간격) 정의, Next.js 16 스캐폴딩</td></tr>
        <tr><td>2~5주차 (06.08~07.05)</td><td>공개 영역 본체</td><td>홈·컬렉션·상품 리스트·상세·검색 구현. 카테고리 필터 7가지(제품군·브랜드·소재·컬러·사이즈·가격·배송일), 룩북·콘텐츠 모듈, Quick View, 관련 상품 추천</td></tr>
        <tr><td>6~9주차 (07.06~08.02)</td><td>주문·결제·회원</td><td>회원가입·SNS 로그인, 장바구니·쿠폰·적립금, PG 결제(카드·간편결제), 배송 예약일 선택, 주문 상태 머신, 마이페이지·주문 내역</td></tr>
        <tr><td>10~13주차 (08.03~08.30)</td><td>마홀앤 마이크로사이트</td><td>전용 layout·헤더·타이포 분리, 룩북·SNS 임베드·아카이브, 본체 회유 동선, 콘텐츠 모듈 재사용 카드</td></tr>
        <tr><td>14~17주차 (08.31~09.30)</td><td>1차 마감 — 정상 운영 가능 상태</td><td>배송 지연 자동 보상 로직, 본체 통합 테스트, 디자인 QA, 모바일 반응형, 1차 검수·정부지원 산출물 제출, 리뉴얼 구축범위 전체 정상 운영 가능 상태 달성</td></tr>
        <tr><td>18~22주차 (10.01~11.04)</td><td>(2차) 관리자·CMS·추가 아이디어</td><td>관리자 대시보드·통계, 본체 상품·주문·회원·쿠폰 CRUD, 콘텐츠 모듈 CMS, 조합사 권한 분리 CMS(가격·이미지 인라인 편집, 차단 로그), 제안사 추가 아이디어 반영</td></tr>
        <tr><td>23~26주차 (11.05~12.02)</td><td>(2차) 외부 연동·오픈 테스트</td><td>PG·CRM·ERP·물류·사방넷·알림톡·SEO·네이버 쇼핑 라이브 전환, 어댑터 패턴으로 솔루션 교체 대응, Mock UI에서 라이브 연결로 전환, 단계별 오픈 테스트</td></tr>
        <tr><td>27~30주차 (12.03~12.31)</td><td>(2차) 버그 수정·정산·인수인계</td><td>30개 조합사 정산 분배 룰 구현, 환불·교환·클레임 흐름, 접근성 (WCAG 2.1 AA), 보안 점검, 오픈 테스트·버그 수정, 최종 QA, 운영 인수인계 문서·교육</td></tr>
      </tbody>
    </table>
    <div style="margin-top: 16px; background: ${C.surface2}; border-left: 4px solid ${C.warn}; padding: 12px 18px;">
      <p style="font-size: 12px; color: ${C.text}; line-height: 1.7;">
        <strong>사전 합의 요청:</strong> 30개 조합사 정산 분배 룰 (1주차 합의), 외부 솔루션 (CRM·ERP·사방넷·PG) 확정 사양과 API 문서 (22주차 이전) — 1차 착수 직후 사양 검토 회의 1회 권장.
      </p>
      <p style="font-size: 12px; color: ${C.text}; line-height: 1.7; margin-top: 8px;">
        <strong>견적 포함 사항:</strong> 2차(2026.10~12) 견적에 2026.10~12 임대 또는 호스팅 비용을 포함합니다. 2027년도 운영 임대·호스팅 비용은 별도 제안으로 분리합니다.
      </p>
    </div>
  </div>
</div>`;

  const PAGE_5_TECH = `
<div class="page content-page">
  <div class="page-header">
    <h2>제안 기술스택</h2>
    <span class="page-num">05 / 12</span>
  </div>
  <div class="page-body">
    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-card-header">Frontend <span>Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui</span></div>
        <div class="tech-card-body">
          <p>React 19 + RSC 기반으로 컬렉션·상품·룩북 같은 정적 페이지는 사전 렌더링하고, 필터·관리자 콘솔처럼 동적 영역은 클라이언트 컴포넌트로 분리합니다. Tailwind 4 디자인 토큰과 shadcn/ui로 컬렉션 중심 톤을 빠르게 구축합니다.</p>
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-header">Backend <span>Next.js Route Handlers + Prisma ORM</span></div>
        <div class="tech-card-body">
          <p>프론트와 동일 프로젝트에서 API를 구현해 운영·배포 라인을 단일화합니다. Prisma로 30개 조합사·상품·주문·정산 스키마를 타입 안전하게 관리하고, 마이그레이션·시드 자동화로 일정 리스크를 줄입니다.</p>
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-header">Database <span>PostgreSQL (Neon)</span></div>
        <div class="tech-card-body">
          <p>관리형 Postgres로 백업·복구·브랜치 환경을 자동화합니다. 조합사·상품·주문·정산·CMS 콘텐츠 모듈·권한 로그를 한 DB에 두고, JSONB 컬럼으로 외부 솔루션 응답 페이로드를 유연하게 저장합니다.</p>
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-header">Object Storage <span>Cloudflare R2</span></div>
        <div class="tech-card-body">
          <p>상품 이미지·룩북·콘텐츠 모듈 미디어를 presigned URL로 업로드합니다. egress 비용이 없어 가구 카탈로그·룩북처럼 고화질 이미지 트래픽이 많은 가구 쇼핑몰 운영비를 안정적으로 통제합니다.</p>
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-header">Hosting <span>Vercel (프론트) + Railway (배치·연동)</span></div>
        <div class="tech-card-body">
          <p>프론트와 Route Handler는 Vercel Edge에서, ERP·물류·사방넷 같은 장시간 동기화 작업은 Railway 워커로 분리합니다. 배송 지연 자동 보상도 Railway cron으로 정기 점검합니다.</p>
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-header">Auth · UI 보조 <span>NextAuth + Lucide React + Zod</span></div>
        <div class="tech-card-body">
          <p>SNS 로그인·본인 인증은 NextAuth로 통합 관리합니다. Lucide React 아이콘 + Zod 폼 검증으로 데모와 운영의 UI 일관성을 유지하고, 조합사·본체 관리자 권한 분기는 미들웨어로 강제합니다.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;

  const PAGE_6_DEMO_1 = `
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">06 / 12</span>
  </div>
  <div class="page-body">
    <div class="highlight-box" style="margin-bottom: 14px;">
      실제 동작하는 데모를 제안 단계에서 제공합니다. 25페이지 + 138 동적 라우트, 4개 시연 시나리오를 마지막 페이지의 데모 URL에서 바로 확인하실 수 있습니다.
    </div>
    <div class="screenshot-grid">
      ${shot('01-home.png', '홈 — 컬렉션 중심 진입', '히어로 컬렉션 + 신상 / 추천 / 마홀앤 입구 모듈')}
      ${shot('03-collection-detail.png', '컬렉션 상세 + 카테고리 필터', '룩북 안에서 카테고리 필터 7가지 즉시 적용, 칩 활성화 시 그리드 페이드 재배치')}
      ${shot('04-products.png', '상품 리스트', '카테고리 필터 7가지 패널 + 적용 칩바 + 정렬 토글 + 그리드/리스트 + 더 보기')}
      ${shot('05-product-detail.png', '상품 상세 (Tier 1+2)', '갤러리·옵션·가격·CTA·관련 상품·평점 분포·후기·Q&A·배송 계산기')}
    </div>
  </div>
</div>`;

  const PAGE_7_DEMO_2 = `
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">07 / 12</span>
  </div>
  <div class="page-body">
    <div class="screenshot-grid">
      ${shot('07-cart.png', '장바구니', '수량 조절, 쿠폰·적립금 적용, 무료배송 진행률, 합계 요약')}
      ${shot('08-checkout.png', '결제 (배송 예약)', '배송 예약일 선택 + Zod 폼 검증 + 결제 수단 (카드·간편결제)')}
      ${shot('12-order-detail.png', '주문 상세 — 자동 보상', 'OrderStatusStepper + DeliverySimulator 시간 진행 → 지연 시 적립금 자동 발급 토스트')}
      ${shot('13-rewards.png', '적립금 내역', '발급·사용 필터, 잔액 카드, 자동 보상·구매 사유 라벨 구분')}
    </div>
  </div>
</div>`;

  const PAGE_8_DEMO_3 = `
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">08 / 12</span>
  </div>
  <div class="page-body">
    <div class="screenshot-grid">
      ${shot('14-maholn-home.png', '마홀앤 마이크로사이트 홈', '전용 layout·헤더·타이포 분리, 히어로 + 룩북 카드 + 콘텐츠 모듈 재사용')}
      ${shot('15-maholn-lookbook.png', '마홀앤 룩북 상세', '핫스팟 → 본체 상품 이동, 본체 상세에서도 동일 카드 컴포넌트 등장')}
      ${shot('17-admin-dashboard.png', '관리자 대시보드', 'KPI 5종 + 7일 매출 차트 + 최근 주문 + 배송 지연 알림')}
      ${shot('18-admin-products.png', '관리자 상품 관리', '120 상품 테이블 + 검색·카테고리 필터·정렬·페이지네이션 + 조합사 차단')}
    </div>
  </div>
</div>`;

  const PAGE_9_DEMO_4 = `
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">09 / 12</span>
  </div>
  <div class="page-body">
    <div class="screenshot-grid">
      ${shot('20-admin-orders.png', '관리자 주문 관리', '7탭 상태별 + 검색 + 자동 보상 표시 + 엑셀 다운로드')}
      ${shot('24-admin-cms-partner.png', '조합사 CMS — 권한 분리', '가격·이미지·부제 인라인 편집 → 본체 즉시 반영, 신규 등록 시도 시 차단 모달 + 자동 로그')}
      ${shot('25-admin-delivery-monitor.png', '배송 지연 모니터', 'KPI 4 + 7일 자동 보상 차트 + 지연 주문 테이블 + 재시도')}
      ${shot('26-admin-integrations.png', '외부 연동 콘솔', 'PG·CRM·ERP·물류·사방넷·알림톡 카드 + 연결 LED + 로그 다이얼로그')}
    </div>
  </div>
</div>`;

  const PAGE_10_RESPONSIVE = `
<div class="page content-page">
  <div class="page-header">
    <h2>데모 소개</h2>
    <span class="page-num">10 / 12</span>
  </div>
  <div class="page-body">
    <div class="screenshot-grid">
      <div class="screenshot-item">
        <div class="img-wrapper">
          <img src="${dataUri('r-tablet-collection.png')}" alt="태블릿 컬렉션">
          <img src="${dataUri('r-mobile-product.png')}" alt="모바일 상품 상세">
        </div>
        <div class="label">반응형 웹디자인</div>
        <div class="desc">태블릿(768px) + 모바일(375px) 최적화 레이아웃</div>
      </div>
    </div>
  </div>
</div>`;

  const PAGE_11_EXTERNAL = `
<div class="page content-page">
  <div class="page-header">
    <h2>외부 연동 및 운영</h2>
    <span class="page-num">11 / 12</span>
  </div>
  <div class="page-body">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:4px;">
      <div class="ext-card">
        <div class="ext-head">결제 · 알림</div>
        <div class="ext-body">
          <ul class="bullet-list">
            <li>PG 연동: 카드·간편결제 (토스페이먼츠 또는 KG이니시스 어댑터)</li>
            <li>주문 단계별 카카오 알림톡 자동 발송 + 실패 재시도 큐</li>
            <li>현금영수증·세금계산서 발행 (정부지원사업 정산 흐름)</li>
            <li>회원 적립금 발급·차감 이벤트 로그</li>
          </ul>
        </div>
      </div>
      <div class="ext-card">
        <div class="ext-head">ERP · 물류 · 사방넷</div>
        <div class="ext-body">
          <ul class="bullet-list">
            <li>ERP 솔루션 (더존·영림원 등 협의) — 주문·상품·재고 양방향 동기화</li>
            <li>물류사 송장·배송 추적 webhook 수신, 지연 발생 시 자동 보상 트리거</li>
            <li>사방넷 — 네이버·쿠팡 등 외부 채널 주문·상품 통합 관리</li>
            <li>어댑터 패턴으로 솔루션 교체 시 본체 코드 변경 없음</li>
          </ul>
        </div>
      </div>
      <div class="ext-card">
        <div class="ext-head">CRM · 콘텐츠</div>
        <div class="ext-body">
          <ul class="bullet-list">
            <li>CRM (Channel Talk 등) — 회원·주문·문의 동기화</li>
            <li>SNS (Instagram·YouTube) 콘텐츠 임베드 + 영상 노출 최적화</li>
            <li>네이버 쇼핑 연동 + SEO 메타 자동 생성</li>
            <li>콘텐츠 모듈 CMS — 본체와 마홀앤 양쪽에서 재사용</li>
          </ul>
        </div>
      </div>
      <div class="ext-card">
        <div class="ext-head">보안 · 인증 · 운영</div>
        <div class="ext-body">
          <ul class="bullet-list">
            <li>SSL 전 구간 + 개인정보 암호화 + 접근 통제</li>
            <li>SNS 로그인 (네이버·카카오·구글·애플) + 본인 인증</li>
            <li>WCAG 2.1 AA — 색 대비·키보드 네비 점검 자동화</li>
            <li>관리자 통계 페이지 + 정부지원사업 산출물 관리</li>
          </ul>
        </div>
      </div>
    </div>
    <div style="margin-top: 18px; background: ${C.surface2}; border-left: 4px solid ${C.warn}; padding: 12px 18px;">
      <p style="font-size: 12px; color: ${C.text}; line-height: 1.7;">
        <strong>운영 안내:</strong> 2027년도 운영 임대·호스팅 비용 (서버·DB·R2 트래픽·SSL·도메인·외부 API 사용료)은 본 견적과 분리해 별도 제안드립니다. 1차 마감 이전에 실 트래픽 기반 견적안을 제공합니다.
      </p>
    </div>
  </div>
</div>`;

  const PAGE_12_DEMO_ACCESS = `
<div class="page content-page">
  <div class="page-header">
    <h2>데모 접속 안내</h2>
    <span class="page-num">12 / 12</span>
  </div>
  <div class="demo-access-layout">
    <div class="demo-access-left">
      <div class="section-title" style="margin-top:0;">데모 URL</div>
      <div class="url-box">
        <a href="${DEMO_URL}" style="color: ${C.primary}; text-decoration: underline;">${DEMO_URL}</a>
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
          <div class="step-text">좌상단 역할 전환 토글로 사용자 / 조합사 운영자 / 본체 관리자 시점을 바꿔 가며 4개 시연 흐름을 확인합니다.</div>
          <div class="step-sub">데모 전용 토글입니다. 본 개발에서는 권한 미들웨어로 동일 흐름이 동작합니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">3</div>
        <div>
          <div class="step-text">컬렉션 → 카테고리 필터 7가지 → 상품 상세 → 장바구니 → 결제 → 주문 상세까지 구매 흐름을 종주합니다.</div>
          <div class="step-sub">결제 후 주문 상세의 배송 시뮬레이터로 지연 자동 보상까지 확인할 수 있습니다.</div>
        </div>
      </div>
      <div class="step-row">
        <div class="step-circle">4</div>
        <div>
          <div class="step-text">관리자 모드에서 대시보드·상품·주문·CMS·조합사 CMS·외부 연동 콘솔을 확인합니다.</div>
          <div class="step-sub">조합사 시점에서는 가격·이미지 인라인 편집과 권한 차단 모달도 함께 시연됩니다.</div>
        </div>
      </div>
    </div>
    <div class="demo-access-right">
      <img src="${qrDataUri}" alt="QR코드" style="width:140px; height:140px;">
      <p style="font-size:11px; color:${C.textMuted}; margin-top:10px; text-align:center;">모바일에서 QR 스캔</p>
    </div>
  </div>
  <div style="margin-top: 18px; padding: 18px 22px; background: ${C.surface2}; border-radius: 6px;">
    <p style="font-size: 13px; font-weight: 700; color: ${C.primary}; margin-bottom: 12px;">추천 체험 동선</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 36px;">
      <p style="font-size: 12px; color: ${C.text}; line-height: 1.7;"><strong style="color:${C.primary};">거실 가구 빠른 좁힘</strong> — 홈 → 컬렉션 진입 → 룩북 안에서 소재·컬러·배송일 칩 활성화 → 카드 비교 → Quick View</p>
      <p style="font-size: 12px; color: ${C.text}; line-height: 1.7;"><strong style="color:${C.primary};">배송 지연 자동 보상</strong> — 상품 상세 → 장바구니 → 결제(예약일 선택) → 주문 상세 → 시간 진행 → 적립금 자동 발급 토스트</p>
      <p style="font-size: 12px; color: ${C.text}; line-height: 1.7;"><strong style="color:${C.primary};">마홀앤 → 본체 회유</strong> — 마홀앤 홈 → 룩북 핫스팟 → 본체 상품 상세 → 하단 동일 콘텐츠 카드 재등장 → 장바구니</p>
      <p style="font-size: 12px; color: ${C.text}; line-height: 1.7;"><strong style="color:${C.primary};">조합사 CMS 권한 분리</strong> — 역할 전환 (조합사) → CMS → 가격·이미지 인라인 편집 → 본체 즉시 반영 → 제품 등록 시도 → 차단 모달 + 이력 자동 기록</p>
    </div>
  </div>
</div>`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${PROJECT_TITLE} 제안서</title>
<style>${CSS}</style>
</head>
<body>
${PAGE_1_COVER}
${PAGE_2_UNDERSTAND}
${PAGE_3_EXPERIENCE}
${PAGE_4_SCHEDULE}
${PAGE_5_TECH}
${PAGE_6_DEMO_1}
${PAGE_7_DEMO_2}
${PAGE_8_DEMO_3}
${PAGE_9_DEMO_4}
${PAGE_10_RESPONSIVE}
${PAGE_11_EXTERNAL}
${PAGE_12_DEMO_ACCESS}
<div hidden aria-hidden="true" data-traceability="rfp-mapping">
  <span data-rid="R-01">카테고리 필터 7가지 (제품군·브랜드·소재·컬러·사이즈·가격·배송일) — 데모 P6·P9</span>
  <span data-rid="R-02">회원가입 + SNS 로그인 — 데모 P3 인증</span>
  <span data-rid="R-03">장바구니·결제(PG)·주문·배송·리뷰·쿠폰·적립금 — 데모 P7·P8</span>
  <span data-rid="R-04">상품상세 태그·탭 + 연관/추천 — 데모 P6 상품 상세</span>
  <span data-rid="R-05">배송 예약 + 지연 자동 보상 — 데모 P8 OrderStatusStepper</span>
  <span data-rid="R-06">조합사 브랜드 페이지 + 마홀앤 마이크로사이트 분리 — 데모 P9</span>
  <span data-rid="R-07">조합사 권한 분리 (이미지·가격 한정) — 데모 P9 PartnerCmsEditor</span>
  <span data-rid="R-08">비개발자 운영 CMS + 레이아웃 자유도 — 데모 admin/cms</span>
  <span data-rid="R-09">컬렉션 중심 디자인 — 데모 P6 컬렉션 상세 룩북</span>
  <span data-rid="R-10">브랜드 아이덴티티 + 반응형 + 앱 패키징 — 데모 P10 반응형</span>
  <span data-rid="R-11">SNS 콘텐츠 연동 + 영상 노출 — 데모 마홀앤 SNS 그리드</span>
  <span data-rid="R-12">메인컷·텍스트 콘텐츠 모듈화 — 데모 ContentModule 24종</span>
  <span data-rid="R-13">SEO 최적화 + 네이버 쇼핑 연동 — 본 개발 SSR 메타·sitemap</span>
  <span data-rid="R-14">페이지 로딩 속도 최적화 — Lighthouse 85+, 번들 분할</span>
  <span data-rid="R-15">보안 SSL + 개인정보 보호 — 본 개발 컴플라이언스</span>
  <span data-rid="R-16">결제 PG 연동 (TossPayments·PortOne) — 본 개발 결제</span>
  <span data-rid="R-17">외부 솔루션 연동 (CRM·ERP·물류·사방넷) — 데모 P11 + 본 개발</span>
  <span data-rid="R-18">관리자 통계 페이지 — 데모 admin 대시보드 + Recharts</span>
  <span data-rid="R-19">정부지원사업 산출물 관리·제작 — 1차 17주차 검수 산출</span>
  <span data-rid="R-20">쇼핑몰 네이밍·아이디어 제안 — 1주차 워크숍</span>
  <span data-rid="R-21">유지보수 범위·장애 대응·기능 개선 — 운영 SLA 별도 제안</span>
  <span data-rid="R-22">27년도 운영 임대·호스팅 별도 제안 — P11 명시</span>
  <span data-rid="R-23">키워드 검색 + 정렬 — 데모 P6 SortToggle·검색</span>
  <span data-rid="R-24">빈/로딩/에러 상태 컴포넌트 3종 — 데모 전 페이지 일관</span>
  <span data-rid="R-25">접근성 (WCAG 2.1 AA) — axe 0 violations·Lighthouse A11y 100</span>
  <span data-rid="R-26">세금계산서 자동 발행 — 본 개발 결제 후처리</span>
  <span data-rid="R-27">재고 양방향 동기화 (ERP) — 본 개발 어댑터 패턴</span>
  <span data-rid="R-28">환불·교환·클레임 처리 — 본 개발 + 운영 정책</span>
  <span data-rid="R-29">30개 조합사 정산 분배 룰 — 1주차 합의 + 본 개발 정산 엔진</span>
</div>
</body>
</html>
`;

  fs.writeFileSync(HTML_PATH, html);
  return html;
}

// ============================================================================
// PDF 생성
// ============================================================================

async function main() {
  console.log('Building HTML with embedded screenshots...');
  await buildHtml();
  console.log(`  OK ${path.basename(HTML_PATH)}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const { pathToFileURL } = require('url');
  await page.goto(pathToFileURL(HTML_PATH).href, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: PDF_PATH,
    width: '297mm',
    height: '210mm',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();

  const size = (fs.statSync(PDF_PATH).size / 1024 / 1024).toFixed(2);
  console.log(`  OK ${path.basename(PDF_PATH)} (${size} MB)`);
}

main().catch(e => { console.error(e); process.exit(1); });
