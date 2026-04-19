const puppeteer = require('/Users/simjeong-gyu/Desktop/outsourcing/bidding/kmong-225711-homepage/node_modules/puppeteer');
const QRCode = require('/Users/simjeong-gyu/Desktop/outsourcing/bidding/kmong-225711-homepage/node_modules/qrcode');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SS_DIR = path.join(ROOT, 'screenshots');
const HTML_PATH = path.join(ROOT, 'proposal-page.html');
const PDF_PATH = path.join(ROOT, '모의고사_서적_쇼핑몰_제안서.pdf');
const DEMO_URL = 'https://firstpip.github.io/demos/kmong-225758-demo/';

function dataUri(name) {
  const p = path.join(SS_DIR, name);
  const buf = fs.readFileSync(p);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function shot(name, label, desc) {
  return `
    <div class="shot-box">
      <div class="shot-img-wrap"><img src="${dataUri(name + '.png')}" alt="${label}"/></div>
      <p class="shot-label">${label}</p>
      <p class="shot-desc">${desc}</p>
    </div>
  `;
}

async function buildHtml() {
  const qrDataUri = await QRCode.toDataURL(DEMO_URL, { margin: 1, width: 240 });

  const CSS = `
    @page { size: 297mm 210mm; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1E293B;
      font-size: 11px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 297mm;
      height: 210mm;
      padding: 14mm 18mm;
      position: relative;
      page-break-after: always;
      overflow: hidden;
      background: #fff;
    }
    .page:last-child { page-break-after: auto; }
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 3px solid #1B2A4A;
      padding-bottom: 6mm;
      margin-bottom: 7mm;
    }
    .page-header h1 { font-size: 22px; font-weight: 800; color: #1B2A4A; letter-spacing: -0.02em; }
    .page-number { font-size: 10px; color: #64748B; font-weight: 600; }

    /* --- 표지 --- */
    .cover {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0d1a2e 0%, #1B2A4A 45%, #2D7A78 100%);
      color: white;
      padding: 0;
    }
    .cover .tag {
      letter-spacing: 0.8em;
      font-size: 10px;
      font-weight: 300;
      color: rgba(255,255,255,0.7);
      margin-bottom: 28px;
      padding-left: 0.8em;
    }
    .cover h1 {
      font-size: 40px;
      font-weight: 800;
      color: white;
      letter-spacing: -0.03em;
      text-align: center;
      line-height: 1.3;
    }
    .cover .divider {
      width: 72px;
      height: 1px;
      background: rgba(255,255,255,0.4);
      margin: 32px 0 20px;
    }
    .cover .sub { font-size: 13px; color: rgba(255,255,255,0.6); }
    .cover .footer {
      position: absolute;
      bottom: 24px;
      font-size: 10px;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.1em;
    }

    /* --- 프로젝트 이해도 --- */
    .callout {
      background: #F1F5F9;
      border-left: 4px solid #1B2A4A;
      padding: 10px 14px;
      margin-bottom: 8mm;
      font-size: 11px;
      color: #1E293B;
      line-height: 1.6;
    }
    .callout b { color: #1B2A4A; }
    h2.section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1B2A4A;
      margin: 6mm 0 3mm;
    }
    .reqs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 24px;
    }
    .reqs .req { display: flex; align-items: center; gap: 6px; font-size: 11px; }
    .reqs .check {
      width: 12px; height: 12px;
      color: #22c55e;
      flex-shrink: 0;
    }
    .capabilities {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 5mm;
    }
    .cap-box {
      background: #F8FAFC;
      border-radius: 4px;
      padding: 10px 12px;
    }
    .cap-box h3 {
      font-size: 12px;
      font-weight: 700;
      color: #1B2A4A;
      margin-bottom: 4px;
    }
    .cap-box p { font-size: 10.5px; color: #475569; line-height: 1.55; }

    /* --- 유사 경험 --- */
    .exp-card {
      background: #F8FAFC;
      border-radius: 6px;
      padding: 14px 18px;
      margin-bottom: 5mm;
    }
    .exp-card h3 { font-size: 14px; font-weight: 700; color: #1B2A4A; }
    .exp-card .meta { font-size: 10.5px; color: #64748B; margin: 4px 0 8px; }
    .exp-card p { font-size: 11px; color: #1E293B; line-height: 1.6; }
    .tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 5px; }
    .tags span {
      display: inline-block;
      padding: 3px 10px;
      background: #1B2A4A;
      color: white;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 500;
    }
    .relevance ul { list-style: none; padding: 0; }
    .relevance li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 11px;
      line-height: 1.55;
    }
    .rel-tag {
      display: inline-block;
      background: #1B2A4A;
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 3px;
      flex-shrink: 0;
      min-width: 56px;
      text-align: center;
    }

    /* --- 구현 계획 테이블 --- */
    .plan-note { font-size: 11px; color: #475569; margin-bottom: 4mm; }
    table.plan {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    table.plan th {
      background: #1B2A4A;
      color: white;
      text-align: left;
      padding: 8px 10px;
      font-size: 11px;
      font-weight: 600;
    }
    table.plan td {
      padding: 10px;
      border-bottom: 1px solid #E2E8F0;
      vertical-align: top;
      line-height: 1.55;
    }
    table.plan tr td:first-child { font-weight: 600; color: #1B2A4A; white-space: nowrap; }
    table.plan tr td:nth-child(2) { color: #475569; white-space: nowrap; }
    .plan-notice {
      background: #FEF9C3;
      border-left: 4px solid #EAB308;
      padding: 10px 14px;
      font-size: 10.5px;
      color: #713F12;
      margin-top: 5mm;
      line-height: 1.55;
    }
    .plan-notice b { color: #854D0E; }

    /* --- 기술스택 --- */
    .stacks { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .stack-box {
      background: #F8FAFC;
      border-radius: 4px;
      padding: 10px 12px;
    }
    .stack-head {
      background: #1B2A4A;
      color: white;
      padding: 6px 10px;
      border-radius: 3px;
      margin: -10px -12px 8px -12px;
      font-size: 11px;
      font-weight: 600;
    }
    .stack-head .tech { font-weight: 400; opacity: 0.85; margin-left: 6px; }
    .stack-box p { font-size: 10.5px; color: #475569; line-height: 1.55; }

    /* --- 데모 소개 --- */
    .shots {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8mm 12mm;
    }
    .shot-box { display: flex; flex-direction: column; align-items: center; }
    .shot-img-wrap {
      width: 100%;
      height: 230px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 4px;
      overflow: hidden;
    }
    .shot-img-wrap img {
      max-width: 100%;
      max-height: 230px;
      object-fit: contain;
    }
    .shot-label {
      font-size: 12px;
      font-weight: 700;
      color: #1B2A4A;
      margin-top: 8px;
      text-align: center;
    }
    .shot-desc {
      font-size: 10.5px;
      color: #64748B;
      margin-top: 3px;
      text-align: center;
      line-height: 1.5;
    }

    /* 반응형 전용 - 템플릿 .screenshot-item .img-wrapper 구조 그대로 이식 */
    .shot-img-wrap.responsive-pair {
      justify-content: space-evenly;
      align-items: flex-start;
    }
    .shot-img-wrap.responsive-pair img {
      width: auto;
      height: 100%;
      max-width: none;
      max-height: 100%;
      flex-shrink: 0;
      object-fit: contain;
    }

    /* 외부 연동 */
    .ext-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .ext-box {
      background: white;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      overflow: hidden;
    }
    .ext-box .ext-head {
      background: #1B2A4A;
      color: white;
      padding: 8px 12px;
      font-weight: 700;
      font-size: 12px;
    }
    .ext-box ul {
      list-style: none;
      padding: 10px 14px;
    }
    .ext-box li {
      font-size: 11px;
      color: #334155;
      line-height: 1.7;
      padding-left: 12px;
      position: relative;
    }
    .ext-box li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #1B2A4A;
      font-weight: 700;
    }
    .ext-box .ext-footer {
      padding: 6px 14px 10px;
      font-size: 10px;
      color: #94A3B8;
      font-style: italic;
    }

    /* 접속 안내 */
    .access-top {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 14mm;
      margin-bottom: 7mm;
    }
    .url-box {
      background: #F8FAFC;
      border-left: 4px solid #1B2A4A;
      padding: 12px 16px;
      font-size: 12px;
      color: #1B2A4A;
      font-weight: 600;
      word-break: break-all;
    }
    .qr-col { text-align: center; }
    .qr-col img { width: 100px; height: 100px; }
    .qr-col p { font-size: 10px; color: #64748B; margin-top: 6px; }
    .steps { display: grid; gap: 7px; }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 11px;
    }
    .step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #1B2A4A;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 11px;
      flex-shrink: 0;
    }
    .step-body { padding-top: 2px; }
    .step-body b { color: #1B2A4A; }
    .step-body .hint { color: #64748B; font-size: 10px; margin-top: 2px; }
    .flows-box {
      margin-top: 6mm;
      padding: 12px 16px;
      background: #F8FAFC;
      border-radius: 4px;
    }
    .flows-box h3 { font-size: 12px; font-weight: 700; color: #1B2A4A; margin-bottom: 6px; }
    .flows-box .flow-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 18px;
      font-size: 10.5px;
      color: #334155;
      line-height: 1.55;
    }
    .flows-box .flow-grid b { color: #1B2A4A; }
  `;

  const check = '<svg class="check" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>';

  const reqs = [
    '온라인 모의고사 서적 판매',
    '회원가입/로그인 (이메일, 소셜)',
    '상품 리스트/상세/구매 플로우',
    '장바구니 + 주문내역 관리',
    '국내 PG 결제 연동 (토스페이먼츠)',
    '자료실 파일 다운로드',
    '후기 등록/조회/관리',
    '검색/필터/정렬 (과목·학년)',
    '배송 관리 (실물 배송 대응)',
    '재고 관리 + 재입고 알림',
    '공지/FAQ',
    '관리자 페이지 (상품/주문/회원/후기/자료)',
    '모바일 반응형 웹',
    'SEO 기본 설정',
    '6개월 하자보수',
    '턴키 기획/디자인/개발/퍼블리싱',
  ];

  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<title>모의고사 서적 쇼핑몰 제안서</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"/>
<style>${CSS}</style>
</head>
<body>

<!-- 1. 표지 -->
<div class="page cover">
  <div class="tag">P R O P O S A L</div>
  <h1>출판사 모의고사 서적<br/>판매 쇼핑몰 구축</h1>
  <div class="divider"></div>
  <div class="sub">제안서</div>
  <div class="footer">EDUPRESS ONLINE BOOKSHOP</div>
</div>

<!-- 2. 프로젝트 이해도 -->
<div class="page">
  <header class="page-header"><h1>프로젝트 이해도</h1><span class="page-number">02 / 13</span></header>
  <div class="callout">
    <b>의뢰 핵심:</b> 출판사의 모의고사 교재를 온라인에서 직접 판매하는 B2C 쇼핑몰을 턴키로 구축합니다. 상품·주문·회원·결제 전체 이커머스 플로우에 교재 특성에 맞는 자료실, 후기, 재고 관리까지 포함합니다.
  </div>

  <h2 class="section-title">주요 요구사항</h2>
  <div class="reqs">
    ${reqs.map(r => `<div class="req">${check}<span>${r}</span></div>`).join('')}
  </div>

  <h2 class="section-title">핵심 역량</h2>
  <div class="capabilities">
    <div class="cap-box">
      <h3>이커머스 전체 플로우 구축 경험</h3>
      <p>상품 카탈로그, 장바구니, 주문 상태 머신, 결제 연동까지 자체 서비스로 운영한 경험을 그대로 활용합니다.</p>
    </div>
    <div class="cap-box">
      <h3>국내 PG 결제 연동</h3>
      <p>토스페이먼츠 카드/계좌/가상계좌 전 수단 연동과 환불·가상계좌 입금 확인 워크플로우를 운영한 경험이 있습니다.</p>
    </div>
    <div class="cap-box">
      <h3>서식 에디터 기반 콘텐츠 관리</h3>
      <p>상품 상세 설명, 공지, 자료 안내 등 서식이 필요한 콘텐츠를 관리자가 직접 편집할 수 있는 에디터를 기본 제공합니다.</p>
    </div>
    <div class="cap-box">
      <h3>반응형 + 6개월 하자보수 대응</h3>
      <p>모바일 기준 375px부터 PC까지 동일 코드베이스로 대응하며, 인수 후 6개월간 하자보수와 정기 업데이트를 제공합니다.</p>
    </div>
  </div>
</div>

<!-- 3. 유사 경험 -->
<div class="page">
  <header class="page-header"><h1>유사 경험</h1><span class="page-number">03 / 13</span></header>

  <div class="exp-card">
    <h3>패키지 디자인 에디터 쇼핑몰 (자체 서비스)</h3>
    <div class="meta">2025.01 - 2025.06 (6개월), 기획 / 디자인 / 개발 / 인프라 단독 수행</div>
    <p>컵·봉투·포장재 등 패키지 디자인이 필요한 상품을 판매하는 커머스 플랫폼. 상품 선택 후 브라우저 에디터에서 로고/텍스트/색상/레이아웃을 편집하고 실시간 3D 프리뷰로 최종 형태를 확인한 뒤 주문·결제까지 한 흐름으로 진행했습니다. 주문 접수 후에는 인쇄 공정에 전달할 고해상도 PDF/SVG를 자동 추출합니다.</p>
    <div class="tags">
      <span>Nuxt</span><span>Django</span><span>PostgreSQL</span><span>Three.js</span><span>Fabric.js</span>
      <span>토스페이먼츠</span><span>카카오 알림톡</span><span>네이버/카카오 로그인</span><span>AWS S3</span>
    </div>
  </div>

  <h2 class="section-title">이 프로젝트와의 연관성</h2>
  <div class="relevance">
    <ul>
      <li><span class="rel-tag">결제 연동</span><span>토스페이먼츠 카드/가상계좌/간편결제 연동 경험 - 본 프로젝트의 국내 PG 결제 플로우에 그대로 활용</span></li>
      <li><span class="rel-tag">이커머스</span><span>상품 카탈로그, 장바구니, 주문 상태 머신(결제완료 > 제작/배송준비 > 배송중 > 완료) 구현 - 서적 주문 상태 관리에 동일 적용</span></li>
      <li><span class="rel-tag">관리자</span><span>상품/주문/회원/쿠폰 CRUD, 매출 대시보드, 인쇄 파일 일괄 다운로드 - 모의고사 교재 관리자 대시보드에 동일 패턴</span></li>
      <li><span class="rel-tag">자료실</span><span>주문 완료 고객이 편집 파일을 다시 받아 가는 구조 - 교재 정오표·해설 PDF 자료실에 구조 재사용</span></li>
      <li><span class="rel-tag">인증</span><span>이메일 + 네이버/카카오 소셜 로그인 연동 운영 경험 - 본 프로젝트 회원 인증 체계에 직접 활용</span></li>
      <li><span class="rel-tag">콘텐츠</span><span>서식 에디터 기반 상품 상세/공지 편집 운영 경험 - 교재 설명과 공지/FAQ 관리에 동일 구조 적용</span></li>
    </ul>
  </div>
</div>

<!-- 4. 구현 계획 -->
<div class="page">
  <header class="page-header"><h1>구현 계획</h1><span class="page-number">04 / 13</span></header>
  <p class="plan-note">총 24일(약 3.5주) 일정으로 진행하며 의뢰인이 제시한 기간(44일) 대비 충분한 여유를 확보합니다. 핵심 기능을 앞 주차에 집중 구현하고, 결제 연동과 QA를 마지막 주차에 배치합니다.</p>

  <table class="plan">
    <thead>
      <tr><th>기간</th><th>단계</th><th>세부 내용</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>1주차 (1~7일)</td>
        <td>프로젝트 세팅<br/>+ 회원 + 상품</td>
        <td>DB 스키마 설계, 개발 환경 구성, 회원가입/로그인(이메일·소셜), 상품 CRUD + 카테고리·학년 분류, 메인 페이지, 상품 리스트/필터/검색/정렬</td>
      </tr>
      <tr>
        <td>2주차 (8~14일)</td>
        <td>상세 + 장바구니<br/>+ 주문/배송</td>
        <td>상품 상세(갤러리, 후기·Q&A, 재고, 배송 안내), 장바구니, 주문/결제 폼, 주소 검색, 주문 상태 머신, 마이페이지(주문내역·후기·회원정보)</td>
      </tr>
      <tr>
        <td>3주차 (15~21일)</td>
        <td>결제 + 자료실<br/>+ 관리자</td>
        <td>토스페이먼츠 연동(카드/계좌/가상계좌), 자료실(R2 파일 업·다운로드), 관리자 대시보드·상품·주문·회원·후기·자료·공지·설정, 서식 에디터 내장</td>
      </tr>
      <tr>
        <td>4주차 (22~24일)</td>
        <td>QA + 배포<br/>+ 인수인계</td>
        <td>반응형 QA(375/768/1280), PG 결제 실거래 테스트, SEO/OG/사이트맵, 인수인계 문서, 운영 가이드 전달, 프로덕션 배포, 6개월 하자보수 대응 준비</td>
      </tr>
    </tbody>
  </table>

  <div class="plan-notice">
    <b>사전 준비 요청:</b> 토스페이먼츠 또는 포트원 MID·API Key, 사업자 도메인, 로고·브랜드 자산, 상품 초기 데이터(엑셀 또는 CSV), 파일 저장용 Cloudflare R2 또는 AWS S3 계정을 준비해 주시면 일정 리스크를 최소화할 수 있습니다.
  </div>
</div>

<!-- 5. 기술스택 -->
<div class="page">
  <header class="page-header"><h1>제안 기술스택</h1><span class="page-number">05 / 13</span></header>

  <div class="stacks">
    <div class="stack-box">
      <div class="stack-head">Frontend <span class="tech">Next.js 15 (App Router) + TypeScript</span></div>
      <p>SSR/SSG를 지원하는 풀스택 프레임워크로 SEO와 초기 로딩에 유리합니다. 주문·결제·관리자 등 페이지 단위가 많은 이커머스에 App Router 구조가 적합합니다.</p>
    </div>
    <div class="stack-box">
      <div class="stack-head">Backend <span class="tech">Next.js API Routes + Prisma</span></div>
      <p>별도 백엔드 서버 없이 API를 구성하며, Prisma ORM으로 타입 안전한 쿼리와 MySQL 마이그레이션을 자동화합니다. 주문 상태 머신·재고 관리 등 트랜잭션이 필요한 로직을 통합 관리합니다.</p>
    </div>
    <div class="stack-box">
      <div class="stack-head">Database <span class="tech">MySQL (Railway) + Prisma</span></div>
      <p>의뢰인 요청 기술을 그대로 반영했으며, Railway 매니지드 MySQL로 백업·스케일링 부담을 줄입니다. Prisma ORM으로 스키마 진화와 데이터 마이그레이션을 안전하게 관리합니다.</p>
    </div>
    <div class="stack-box">
      <div class="stack-head">UI / Styling <span class="tech">Tailwind CSS + shadcn/ui</span></div>
      <p>반응형 레이아웃과 디자인 토큰을 빠르게 구축하고, shadcn/ui 컴포넌트로 일관된 UI와 접근성을 확보합니다. 관리자 테이블·폼도 동일한 디자인 토큰으로 구성합니다.</p>
    </div>
    <div class="stack-box">
      <div class="stack-head">결제 <span class="tech">토스페이먼츠 (포트원 대체 가능)</span></div>
      <p>카드/계좌이체/가상계좌 전 수단을 국내 PG로 지원합니다. 주문 생성 > 결제 승인 > 입금 확인(가상계좌) > 발송까지 상태 머신으로 관리하고, 환불·부분취소 시나리오를 모두 커버합니다.</p>
    </div>
    <div class="stack-box">
      <div class="stack-head">Storage <span class="tech">Cloudflare R2 (S3 호환)</span></div>
      <p>자료실 파일(정오표 PDF, 듣기 MP3, 해설 ZIP)을 presigned URL로 업·다운로드합니다. 이그레스 비용이 낮아 대용량 자료 배포에 유리합니다.</p>
    </div>
    <div class="stack-box">
      <div class="stack-head">Infra <span class="tech">Vercel + Railway</span></div>
      <p>프론트는 Vercel로 자동 배포하고, API·DB는 Railway에서 매니지드로 운영합니다. 프리뷰 배포로 스테이징과 본 운영을 분리합니다.</p>
    </div>
    <div class="stack-box">
      <div class="stack-head">Authentication <span class="tech">NextAuth.js + 소셜 로그인</span></div>
      <p>이메일/비밀번호 기본 + 네이버·카카오 소셜 로그인 연동. 관리자 역할(RBAC)과 세션을 일관되게 관리합니다.</p>
    </div>
  </div>
</div>

<!-- 6. 데모 소개 1 - 사용자 핵심 -->
<div class="page">
  <header class="page-header"><h1>데모 소개</h1><span class="page-number">06 / 13</span></header>
  <div class="callout">제안 단계에서 실제 동작하는 데모를 미리 준비했습니다. 전체 26페이지 중 핵심 화면을 우선 소개합니다.</div>
  <div class="shots">
    ${shot('01-home', '홈', '히어로 배너, 과목 카테고리, 베스트셀러·신간, 공지·후기 위젯')}
    ${shot('02-products', '상품 리스트', '과목/학년 필터, 정렬 4종, 검색, 페이지네이션')}
    ${shot('03-product-detail', '상품 상세', '미디어 갤러리, 가격·적립금, 재고 상태, 예상 배송일, 공유')}
    ${shot('04-product-reviews', '후기 탭', '평균 별점·별점 분포 그래프, 정렬(최신/평점/도움순), 유용해요')}
  </div>
</div>

<!-- 7. 데모 소개 2 - 상세/장바구니/결제 -->
<div class="page">
  <header class="page-header"><h1>데모 소개</h1><span class="page-number">07 / 13</span></header>
  <div class="shots">
    ${shot('05-product-qna', '상품 Q&A', '질문 아코디언, 문의 등록, 답변·관리자 답변 라벨')}
    ${shot('06-cart', '장바구니', '선택 체크박스, 수량 조절, 무료 배송 진행률, 선택 삭제')}
    ${shot('07-checkout', '주문/결제', '배송지 입력·주소 검색, 카드/계좌이체/가상계좌 선택')}
    ${shot('10-mypage-orders', '마이페이지 주문내역', '상태 필터, 배송 조회, 교환·반품 버튼')}
  </div>
</div>

<!-- 8. 데모 소개 3 - 인증·부가 -->
<div class="page">
  <header class="page-header"><h1>데모 소개</h1><span class="page-number">08 / 13</span></header>
  <div class="shots">
    ${shot('08-signup', '회원가입', '이름·이메일·비밀번호·연락처, 약관 전체 동의 토글, 유효성 검증')}
    ${shot('09-login', '로그인', '데모 안내, 회원가입/아이디·비밀번호 찾기, 소셜 로그인 배치')}
    ${shot('11-resources', '자료실', '정오표, 듣기 MP3, 보충 해설 파일 목록 + 파일 타입 필터')}
    ${shot('13-notice-detail', '공지 상세', '서식 에디터로 저장된 HTML 본문 렌더링, 이전/다음 글 네비게이션')}
  </div>
</div>

<!-- 9. 데모 소개 4 - 관리자 핵심 -->
<div class="page">
  <header class="page-header"><h1>데모 소개</h1><span class="page-number">09 / 13</span></header>
  <div class="shots">
    ${shot('20-admin-dashboard', '관리자 대시보드', '오늘 매출·주문·신규 회원 KPI, 주간·월간 매출 차트')}
    ${shot('21-admin-products', '상품 관리', '상품 CRUD 테이블, 재고 상태 뱃지, 카테고리 필터, 검색')}
    ${shot('22-admin-orders', '주문 관리', '주문 상태 필터, 검색, 주문 상세·배송 처리 진입')}
    ${shot('28-admin-product-edit', '상품 수정 + 서식 에디터', '상품 정보 + 상세 설명 서식 에디터 (굵게/제목/리스트/링크/이미지)')}
  </div>
</div>

<!-- 10. 데모 소개 5 - 관리자 부가 -->
<div class="page">
  <header class="page-header"><h1>데모 소개</h1><span class="page-number">10 / 13</span></header>
  <div class="shots">
    ${shot('24-admin-members', '회원 관리', '회원 검색, 적립금 지급, 역할 변경, 제재')}
    ${shot('25-admin-reviews', '후기 관리', '후기 전수 목록, 승인·숨김 처리, 삭제')}
    ${shot('27-admin-notices', '공지 관리', '공지 등록 모달 (서식 에디터 포함), 카테고리별 관리')}
    ${shot('29-admin-settings', '쇼핑몰 설정', '결제·배송·이메일 연동 상태, 배송비·적립금 정책')}
  </div>
</div>

<!-- 11. 반응형 웹 -->
<div class="page">
  <header class="page-header"><h1>데모 소개</h1><span class="page-number">11 / 13</span></header>
  <div class="shots">
    <div class="shot-box">
      <div class="shot-img-wrap responsive-pair">
        <img src="${dataUri('30-responsive-tablet.png')}" alt="태블릿 768px"/>
        <img src="${dataUri('31-responsive-mobile.png')}" alt="모바일 375px"/>
      </div>
      <p class="shot-label">반응형 웹디자인</p>
      <p class="shot-desc">태블릿(768px) + 모바일(375px) 최적화 레이아웃</p>
    </div>
  </div>
</div>

<!-- 12. 외부 연동 구현 계획 -->
<div class="page">
  <header class="page-header"><h1>외부 연동 구현 계획</h1><span class="page-number">12 / 13</span></header>

  <div class="ext-grid">
    <div class="ext-box">
      <div class="ext-head">토스페이먼츠 결제 연동</div>
      <ul>
        <li>카드 / 계좌이체 / 가상계좌 전 수단 연동</li>
        <li>결제 승인 Webhook + 입금 확인(가상계좌) 처리</li>
        <li>부분 취소·환불, 세금계산서 발행 워크플로우</li>
        <li>주문 상태 머신: 결제완료 > 배송준비 > 배송중 > 완료 / 취소</li>
      </ul>
      <div class="ext-footer">※ MID 발급 및 API Key 수령 후 연동. 실거래 테스트 1일 포함</div>
    </div>
    <div class="ext-box">
      <div class="ext-head">Cloudflare R2 (자료실 파일)</div>
      <ul>
        <li>정오표·해설 PDF, 듣기 MP3, ZIP 묶음 업·다운로드</li>
        <li>presigned URL로 보안 안전한 파일 전달</li>
        <li>S3 호환 API로 라이브러리 전환 부담 없음</li>
        <li>이그레스 무료로 대용량 자료 배포 비용 절감</li>
      </ul>
      <div class="ext-footer">※ 계정 발급 후 버킷 설정 · 정책 연동</div>
    </div>
    <div class="ext-box">
      <div class="ext-head">소셜 로그인 (네이버·카카오)</div>
      <ul>
        <li>NextAuth.js Provider로 표준 연동</li>
        <li>이메일/비밀번호 + 소셜 계정 통합 회원 체계</li>
        <li>관리자 역할(RBAC) 분리, 세션·JWT 통합 관리</li>
        <li>로그인 시 회원 맞춤 적립금·할인 적용</li>
      </ul>
      <div class="ext-footer">※ 네이버·카카오 개발자 센터에서 앱 등록 필요</div>
    </div>
    <div class="ext-box">
      <div class="ext-head">이메일/알림 (선택)</div>
      <ul>
        <li>주문 완료·발송·배송 완료 자동 이메일 발송</li>
        <li>재입고 알림 신청 후 자동 안내</li>
        <li>관리자 공지사항 회원 대상 이메일 발송</li>
        <li>SendGrid·Resend 중 운영비에 맞춰 선택</li>
      </ul>
      <div class="ext-footer">※ 도메인 인증(SPF/DKIM) 설정 포함</div>
    </div>
  </div>
</div>

<!-- 12. 데모 접속 안내 -->
<div class="page">
  <header class="page-header"><h1>데모 접속 안내</h1><span class="page-number">13 / 13</span></header>

  <div class="access-top">
    <div>
      <h2 class="section-title" style="margin-top:0;">데모 URL</h2>
      <div class="url-box">${DEMO_URL}</div>

      <h2 class="section-title">접속 방법</h2>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-body"><b>제공된 URL에 PC 또는 모바일 브라우저로 접속합니다.</b><div class="hint">Chrome, Safari, Edge 등 최신 브라우저를 권장합니다.</div></div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-body"><b>로그인 페이지에서 아무 값이나 입력하여 로그인합니다.</b><div class="hint">데모 버전이므로 어떤 값이든 로그인됩니다. 회원가입 플로우도 Mock 동작으로 체험 가능합니다.</div></div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-body"><b>상품 목록에서 교재를 선택해 장바구니 > 주문/결제까지 전체 구매 플로우를 체험합니다.</b><div class="hint">주문 완료 후 마이페이지에서 주문내역과 배송 상태를 확인할 수 있습니다.</div></div>
        </div>
        <div class="step">
          <div class="step-num">4</div>
          <div class="step-body"><b>헤더 상단의 역할 전환 버튼으로 관리자 모드를 활성화하여 관리자 기능을 확인합니다.</b><div class="hint">대시보드, 상품/주문/회원/후기/자료/공지 관리, 서식 에디터 편집까지 모두 체험 가능합니다.</div></div>
        </div>
      </div>
    </div>

    <div class="qr-col">
      <img src="${qrDataUri}" alt="QR 코드"/>
      <p>모바일에서 QR 스캔</p>
    </div>
  </div>

  <div class="flows-box">
    <h3>체험 가능한 플로우</h3>
    <div class="flow-grid">
      <div><b>교재 구매</b> - 검색/필터 > 상세(갤러리·Q&A·후기) > 장바구니 > 주문/결제 Mock</div>
      <div><b>회원</b> - 회원가입(약관 동의) > 로그인 > 마이페이지(주문·후기 관리)</div>
      <div><b>자료실</b> - 교재 선택 > 정오표/해설/음성 파일 다운로드(Mock)</div>
      <div><b>후기 / Q&A</b> - 별점 분포 확인 > 정렬·도움 표시 > Q&A 아코디언</div>
      <div><b>관리자</b> - 역할 전환 > 대시보드 > 상품 CRUD (서식 에디터) > 주문 상태 변경</div>
      <div><b>공지/설정</b> - 공지 모달 등록 > 결제·배송·이메일 연동 상태 > 유지보수 모드</div>
    </div>
  </div>
</div>

</body>
</html>
`;

  fs.writeFileSync(HTML_PATH, html);
  return html;
}

async function main() {
  console.log('Building HTML with embedded screenshots...');
  await buildHtml();
  console.log('  ✓ proposal-page.html');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + HTML_PATH, { waitUntil: 'networkidle0' });
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
  console.log(`  ✓ ${path.basename(PDF_PATH)} (${size} MB)`);
}

main().catch(e => { console.error(e); process.exit(1); });
