// generate-pdf.js — ARTWORK 제안서 PDF 생성
// 전제: ./screenshots/ 폴더에 capture-screenshots.js 실행 결과가 있어야 함
// 실행: node generate-pdf.js

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
const PDF_PATH = path.join(ROOT, 'ARTWORK_제안서.pdf');
const DEMO_URL = 'https://firstpip.github.io/demos/kmong-225834-demo/';
const PROJECT_TITLE = 'ARTWORK';
const PROJECT_SUBTITLE = '예술인 채용·공연·협업 플랫폼';

// ARTWORK 디자인 토큰 (demo-app/app/globals.css 기준)
const C = {
  primary: '#C53A0E',
  primaryHover: '#A52F0A',
  accent: '#1A1A1A',
  text: '#121212',
  muted: '#555555',
  bg: '#FAFAF7',
  surface: '#FFFFFF',
  line: '#E6E6E1',
  success: '#0E9F6E',
  warning: '#F59E0B',
  danger: '#DC2626',
};

// ============================================================================
// 헬퍼
// ============================================================================
function dataUri(name) {
  const p = path.join(SS_DIR, name);
  const buf = fs.readFileSync(p);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function shot(name, label, desc) {
  return `
    <div class="screenshot-item">
      <img src="${dataUri(name + '.png')}" alt="${label}"/>
      <div class="label">${label}</div>
      <div class="desc">${desc}</div>
    </div>
  `;
}

// ============================================================================
// HTML 생성
// ============================================================================
async function buildHtml() {
  const qrDataUri = await QRCode.toDataURL(DEMO_URL, { margin: 1, width: 240, color: { dark: '#1A1A1A', light: '#FFFFFF' } });

  const CSS = `
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: ${C.text};
      line-height: 1.6;
      letter-spacing: -0.01em;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { width: 297mm; height: 210mm; page-break-after: always; position: relative; overflow: hidden; }
    .page:last-child { page-break-after: avoid; }

    /* ===================== COVER ===================== */
    .cover {
      background: linear-gradient(160deg, #1A1A1A 0%, #2C1410 55%, ${C.primary} 100%);
      color: #fff;
      display: flex; flex-direction: column;
      justify-content: center; align-items: center; text-align: center;
    }
    .cover .spaced-title {
      font-size: 14px; letter-spacing: 12px; font-weight: 300;
      color: rgba(255,255,255,0.5); margin-bottom: 36px;
      text-transform: uppercase;
    }
    .cover h1 {
      font-size: 96px; font-weight: 800; line-height: 1.1;
      margin-bottom: 28px; letter-spacing: -0.04em;
      color: #fff;
    }
    .cover .divider {
      width: 60px; height: 2px; background: rgba(255,255,255,0.45);
      margin: 0 auto 22px;
    }
    .cover .subtitle {
      font-size: 22px; font-weight: 400; color: rgba(255,255,255,0.78);
      letter-spacing: -0.01em;
    }
    .cover .meta {
      margin-top: 56px; font-size: 13px; color: rgba(255,255,255,0.4);
      letter-spacing: 1px;
    }

    /* ===================== CONTENT PAGES ===================== */
    .content-page {
      background: ${C.surface};
      padding: 36px 48px 28px;
      display: flex; flex-direction: column;
    }
    .content-page .page-body { flex: 1; display: flex; flex-direction: column; }

    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding-bottom: 12px;
      border-bottom: 3px solid ${C.primary};
      margin-bottom: 22px;
    }
    .page-header h2 { font-size: 24px; font-weight: 800; color: ${C.accent}; line-height: 1.2; }
    .page-num { font-size: 13px; color: #9CA3AF; font-weight: 500; white-space: nowrap; padding-top: 6px; }

    .highlight-box {
      background: #FEF1EC; border-left: 4px solid ${C.primary};
      padding: 14px 20px; margin: 4px 0 16px;
      font-size: 12.5px; color: #4B3528; line-height: 1.7;
    }
    .section-title { font-size: 15px; font-weight: 700; color: ${C.accent}; margin: 12px 0 10px; }

    .checklist-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 5px 24px; list-style: none;
    }
    .checklist-grid li {
      font-size: 11.5px; color: #4B5563; line-height: 1.55;
      padding-left: 20px; position: relative;
    }
    .checklist-grid li::before {
      content: "\\2713"; position: absolute; left: 0;
      color: ${C.primary}; font-weight: bold; font-size: 13px;
    }
    .checklist-grid li strong { color: ${C.accent}; font-weight: 700; }

    .cap-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px;
    }
    .cap-card { background: #F7F5F0; padding: 11px 16px; border-radius: 4px; }
    .cap-card p.cap-title { font-size: 12.5px; font-weight: 700; color: ${C.accent}; margin-bottom: 3px; }
    .cap-card p.cap-desc { font-size: 11px; color: #6B7280; line-height: 1.55; }

    /* Experience card */
    .exp-card {
      background: #F7F5F0; border: 1px solid ${C.line}; border-radius: 4px;
      padding: 22px 26px; margin: 4px 0 16px;
    }
    .exp-card h4 { font-size: 16px; font-weight: 700; color: ${C.accent}; margin-bottom: 4px; }
    .exp-card .period { font-size: 12px; color: ${C.muted}; margin-bottom: 12px; }
    .exp-card .desc { font-size: 12.5px; color: #4B5563; line-height: 1.75; margin-bottom: 14px; }
    .tech-badges { display: flex; flex-wrap: wrap; gap: 6px; }
    .tech-badges span {
      background: ${C.accent}; color: #fff;
      font-size: 11px; padding: 4px 12px;
      border-radius: 14px; font-weight: 500;
    }

    .bullet-list { list-style: none; margin-top: 4px; }
    .bullet-list li {
      font-size: 12px; color: #4B5563; line-height: 1.7;
      padding-left: 16px; position: relative; margin-bottom: 6px;
    }
    .bullet-list li::before {
      content: ""; position: absolute; left: 0; top: 9px;
      width: 5px; height: 5px; background: ${C.primary}; border-radius: 50%;
    }
    .bullet-list li strong { color: ${C.accent}; font-weight: 700; }
    .b2b-tag {
      display: inline-block;
      background: ${C.primary}; color: #fff;
      font-size: 10.5px; font-weight: 600;
      padding: 2px 9px; border-radius: 3px;
      margin-right: 6px;
    }

    /* Schedule */
    .schedule-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 6px; }
    .schedule-table th {
      background: ${C.accent}; color: #fff; font-weight: 600;
      padding: 10px 14px; text-align: left; font-size: 12px;
    }
    .schedule-table td {
      padding: 9px 14px; border-bottom: 1px solid ${C.line}; text-align: left;
      color: #4B5563; vertical-align: top;
    }
    .schedule-table tr:nth-child(even) { background: #F9FAFB; }
    .schedule-table td strong { color: ${C.accent}; }

    .note-box {
      margin-top: 16px; background: #FEF6E6; border-left: 4px solid ${C.warning};
      padding: 12px 18px;
    }
    .note-box p { font-size: 12px; color: #6B4517; line-height: 1.65; }

    /* Tech stack */
    .tech-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 4px; }
    .tech-card { background: ${C.surface}; border: 1px solid ${C.line}; overflow: hidden; border-radius: 4px; }
    .tech-card-header { background: ${C.accent}; color: #fff; padding: 8px 16px; font-size: 12.5px; font-weight: 700; }
    .tech-card-header span { font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.72); margin-left: 6px; display: block; margin-top: 2px; }
    .tech-card-body { padding: 12px 16px; }
    .tech-card-body p { font-size: 11.5px; color: #4B5563; line-height: 1.65; }

    /* Screenshot grid */
    .screenshot-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 14px; flex: 1; margin-top: 4px;
    }
    .screenshot-item { display: flex; flex-direction: column; }
    .screenshot-item img {
      width: 100%; height: 215px; object-fit: contain;
      border: 1px solid ${C.line}; background: #F9FAFB;
      border-radius: 4px;
    }
    .screenshot-item .img-wrapper {
      display: flex; justify-content: space-evenly; align-items: flex-start;
      border: 1px solid ${C.line}; background: #F9FAFB; overflow: hidden;
      height: 215px; border-radius: 4px;
    }
    .screenshot-item .img-wrapper img {
      border: none; width: auto; flex-shrink: 0; height: 215px; object-fit: contain;
    }
    .screenshot-item .label {
      font-size: 12.5px; font-weight: 700; color: ${C.accent}; margin-top: 5px;
      text-align: center;
    }
    .screenshot-item .desc { font-size: 10.5px; color: #6B7280; text-align: center; margin-top: 1px; line-height: 1.45; }

    /* Demo access page */
    .demo-access-layout { display: flex; gap: 36px; flex: 1; margin-top: 4px; }
    .demo-access-left { flex: 1; }
    .demo-access-right {
      display: flex; flex-direction: column;
      align-items: center; justify-content: flex-start;
      min-width: 200px; padding-top: 6px;
    }
    .url-box {
      background: #FEF1EC; border-left: 4px solid ${C.primary};
      padding: 13px 18px; margin: 6px 0 18px;
      font-size: 13px; color: ${C.accent}; font-weight: 600;
      word-break: break-all;
    }
    .step-row { display: flex; align-items: flex-start; margin-bottom: 16px; }
    .step-circle {
      width: 26px; height: 26px; min-width: 26px;
      background: ${C.primary}; color: #fff; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; margin-right: 12px; margin-top: 1px;
    }
    .step-text { font-size: 12.5px; color: ${C.text}; line-height: 1.5; font-weight: 500; }
    .step-sub { font-size: 11px; color: #9CA3AF; line-height: 1.45; margin-top: 1px; }

    .demo-flow-box {
      margin-top: 16px; padding: 16px 20px; background: #F7F5F0; border-radius: 4px;
    }
    .demo-flow-box p.title { font-size: 13px; font-weight: 700; color: ${C.accent}; margin-bottom: 10px; }
    .demo-flow-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; }
    .demo-flow-grid p { font-size: 11.5px; color: #4B5563; line-height: 1.6; }
    .demo-flow-grid p strong { color: ${C.accent}; }
  `;

  // ============================================================
  // 페이지 마크업
  // ============================================================

  const pageCover = `
    <div class="page cover">
      <div>
        <div class="spaced-title">P R O P O S A L</div>
        <h1>${PROJECT_TITLE}</h1>
        <div class="divider"></div>
        <div class="subtitle">${PROJECT_SUBTITLE}</div>
        <div class="meta">예술인 채용 / 프로젝트 모집 / 운영자 콘솔 MVP</div>
      </div>
    </div>
  `;

  const pageUnderstanding = `
    <div class="page content-page">
      <div class="page-header">
        <h2>프로젝트 이해도</h2>
        <span class="page-num">02 / 10</span>
      </div>
      <div class="page-body">
        <div class="highlight-box">
          <strong>의뢰 핵심:</strong> 예술인(댄스·음악·연기·모델·서커스 등)을 위한 채용공고와 프로젝트/공연 모집을 한 플랫폼에서 연결합니다. 일반회원·기업회원·운영자 3축 권한, 카테고리 두 축(jobType 4종 / 장르 8종), 검색·필터, 지원·승인·신고 처리까지 확장 가능한 구조로 38일 안에 MVP를 완성합니다.
        </div>
        <div class="section-title">주요 요구사항 (R-01 ~ R-21)</div>
        <ul class="checklist-grid">
          <li><strong>R-01</strong> 회원가입 / 로그인 (이메일·재설정)</li>
          <li><strong>R-02</strong> 일반·기업 회원 구분 + 권한 분기</li>
          <li><strong>R-03</strong> 프로필·포트폴리오·장르·경력 입력</li>
          <li><strong>R-04</strong> 채용공고 CRUD (jobType별 동적 필드)</li>
          <li><strong>R-05</strong> 카테고리 두 축 (jobType 4 / 장르 8)</li>
          <li><strong>R-06</strong> 공고 리스트 / 상세 + 지원 CTA</li>
          <li><strong>R-07</strong> 프로젝트·공연 모집 게시판</li>
          <li><strong>R-08</strong> 검색 자동완성 + 다중 필터</li>
          <li><strong>R-09</strong> 관리자 회원 관리·제재</li>
          <li><strong>R-10</strong> 관리자 공고 승인·반려 큐</li>
          <li><strong>R-11</strong> 관리자 게시글 관리</li>
          <li><strong>R-12</strong> 반응형 (모바일·태블릿·데스크톱)</li>
          <li><strong>R-13</strong> DB 구축·확장 가능 구조</li>
          <li><strong>R-14</strong> 유지보수·호스팅 인계</li>
          <li><strong>R-15</strong> 지원하기 + 기업 측 지원자 확인</li>
          <li><strong>R-16</strong> 영상·이미지 포트폴리오 첨부</li>
          <li><strong>R-17</strong> 빈·로딩·에러 상태 처리</li>
          <li><strong>R-18</strong> 4단 권한 분기(비로그인/일반/기업/관리자)</li>
          <li><strong>R-19</strong> SEO 메타·OG·sitemap 기본값</li>
          <li><strong>R-20</strong> 이메일 알림 (가입·지원·승인)</li>
          <li><strong>R-21</strong> 신고·차단 + 운영자 처리 큐</li>
        </ul>
        <div style="border-top: 1px solid ${C.line}; margin-top: 12px; padding-top: 10px;">
          <div class="section-title" style="margin-top: 0;">핵심 역량</div>
          <div class="cap-grid">
            <div class="cap-card">
              <p class="cap-title">멀티 페르소나 권한 분기 실사용 경험</p>
              <p class="cap-desc">일반·기업·관리자 3축 권한 분기와 4단 가드(비로그인 포함) 패턴을 동일 구조 프로젝트에서 단독 구축했습니다.</p>
            </div>
            <div class="cap-card">
              <p class="cap-title">관리자 콘솔 CRUD + 큐 운영</p>
              <p class="cap-desc">상품·주문·회원·쿠폰·알림 템플릿 CRUD를 실서비스 수준으로 구현한 패턴을 회원·공고·게시글·신고·카테고리 관리에 그대로 이식합니다.</p>
            </div>
            <div class="cap-card">
              <p class="cap-title">카탈로그 · 필터 · 상세 · CTA 일관성</p>
              <p class="cap-desc">검색 · 다중 필터 · 정렬 · 상세 · 지원 흐름을 단일 컴포넌트 시스템으로 묶어 공고·프로젝트·예술인 3축에 일관 적용합니다.</p>
            </div>
            <div class="cap-card">
              <p class="cap-title">실제 동작 데모 사전 제공</p>
              <p class="cap-desc">제안 단계에서 20페이지 데모(사용자 13 + 관리자 7)와 권한별 추천 동선을 미리 확인하실 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const pageExperience = `
    <div class="page content-page">
      <div class="page-header">
        <h2>유사 경험</h2>
        <span class="page-num">03 / 10</span>
      </div>
      <div class="page-body">
        <div class="exp-card" style="padding: 22px 26px; margin: 4px 0 18px;">
          <h4>패키지 디자인 에디터 쇼핑몰 (자체 서비스)</h4>
          <div class="period" style="margin-bottom: 12px;">2025.01 ~ 2025.06 (6개월) &middot; 기획 / 디자인 / 개발 / 인프라 단독 수행</div>
          <p class="desc" style="margin-bottom: 16px;">
            컵·봉투·포장재 등 패키지 디자인 상품을 판매하는 커머스 플랫폼. 고객이 상품 선택 후 브라우저 내 디자인 에디터에서 로고·텍스트·색상·레이아웃을 편집하고, 실시간 3D 프리뷰로 확인 뒤 주문·결제까지 한 흐름으로 진행. 사용자·관리자 콘솔, 결제 연동, 카카오 알림톡, 비회원·회원 장바구니 병합, 인쇄용 자동 변환 파이프라인을 단독 구축했습니다.
          </p>
          <div class="tech-badges">
            <span>Nuxt 3</span><span>TypeScript</span><span>Three.js</span><span>Fabric.js</span>
            <span>Django REST</span><span>PostgreSQL</span><span>Celery</span>
            <span>AWS EC2 / RDS / S3</span><span>토스페이먼츠</span>
            <span>네이버·카카오 로그인</span><span>카카오 알림톡</span><span>카카오지도</span>
          </div>
        </div>
        <div class="section-title" style="margin: 0 0 8px;">ARTWORK 도메인 연관성</div>
        <ul class="bullet-list">
          <li><span class="b2b-tag">권한 분기</span> 멀티 페르소나(일반·기업·관리자) 권한 분기 구조를 자체 서비스에서 구현 &rarr; <strong>R-02 · R-18</strong> 일반회원·기업회원·운영자 3축 권한 모델 + 4단 가드 그대로 적용</li>
          <li><span class="b2b-tag">관리자 콘솔</span> 상품·주문·회원·쿠폰·알림 템플릿 CRUD 실사용 수준 구현 &rarr; <strong>R-09 · R-10 · R-11 · R-21</strong> 회원 관리, 공고 승인, 게시글 관리, 신고 처리 큐와 동일한 CRUD·상태 머신 패턴</li>
          <li><span class="b2b-tag">카탈로그·검색</span> 카탈로그·필터·정렬·검색·상세·CTA 흐름을 일관 컴포넌트로 구현 &rarr; <strong>R-06 · R-08 · R-15</strong> 공고 리스트·필터·상세·지원 흐름에 그대로 이식 가능</li>
          <li><span class="b2b-tag">인증·소셜</span> 비회원·회원 분기, 소셜 로그인, 인증 상태에 따른 액션 가시성 처리 &rarr; <strong>R-01 · R-02 · R-18</strong> 회원가입·로그인·권한 분기 동일 구조 적용</li>
          <li><span class="b2b-tag">알림 큐</span> 카카오 알림톡 단계별 자동 발송 + 실패 재시도 큐 운영 &rarr; <strong>R-20</strong> 이메일 알림(가입 / 지원 접수·결과 / 공고 승인 결과)을 동일 이벤트 큐 패턴으로 구성</li>
          <li><span class="b2b-tag">단독 수행</span> 자체 서비스를 기획·UI/UX·프론트·백·인프라까지 단독으로 6개월 일정·품질을 직접 통제 &rarr; ARTWORK 38일 MVP의 의사결정·구현·검수 책임을 단일 라인으로 처리</li>
        </ul>
      </div>
    </div>
  `;

  const pagePlan = `
    <div class="page content-page">
      <div class="page-header">
        <h2>구현 계획</h2>
        <span class="page-num">04 / 10</span>
      </div>
      <div class="page-body">
        <p style="font-size:13px; color:#4B5563; margin-bottom:12px;">
          공고 시작 <strong>2026-04-24</strong> ~ 마감 <strong>2026-05-31</strong> 기준 <strong>38일(약 5.4주)</strong>. 핵심 루프(가입 → 공고 → 지원 → 승인)를 우선 안정화하고, 부가 기능(신고·이메일 알림·카테고리 관리)은 후반부에 배치합니다.
        </p>
        <table class="schedule-table">
          <thead>
            <tr><th style="width:110px;">기간</th><th style="width:170px;">단계</th><th>세부 내용</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>1주차 (4/24 ~ 4/30)</td>
              <td><strong>세팅 + 인증 / 회원</strong></td>
              <td>Next.js + Supabase 세팅, ERD 1차 (users / artist_profiles / company_profiles / categories / jobs / projects / applications / reports / notifications), 일반·기업 회원가입(R-01·R-02), 프로필 편집·포트폴리오 입력(R-03·R-16), 권한 가드(R-18)</td>
            </tr>
            <tr>
              <td>2주차 (5/1 ~ 5/7)</td>
              <td><strong>공고 + 카테고리</strong></td>
              <td>jobType 4종 + 장르 8종 카테고리 마스터(R-05·R-13), 공고 CRUD + jobType별 동적 추가 필드(R-04), 공고 리스트·상세·지원 흐름(R-06·R-15), 검색 자동완성·다중 필터(R-08), 빈·로딩·에러 상태(R-17)</td>
            </tr>
            <tr>
              <td>3주차 (5/8 ~ 5/14)</td>
              <td><strong>프로젝트 모집 + 마이페이지</strong></td>
              <td>프로젝트 모집 CRUD·상세·댓글(R-07), 예술인 카탈로그·상세·영상 그리드(R-03·R-16), 마이페이지 4 탭(지원·스크랩·내 프로젝트·내 공고) 통계 카드, 반응형 레이아웃 1차(R-12)</td>
            </tr>
            <tr>
              <td>4주차 (5/15 ~ 5/21)</td>
              <td><strong>운영자 콘솔</strong></td>
              <td>관리자 대시보드·승인 큐(R-10), 회원 관리·제재(R-09), 공고·게시글 관리(R-11), 신고 처리 큐(R-21), 카테고리 관리(R-13), 처리 로그·반려 사유 모달</td>
            </tr>
            <tr>
              <td>5주차 (5/22 ~ 5/28)</td>
              <td><strong>알림 + SEO + 검수</strong></td>
              <td>이메일 알림(R-20, 가입·지원 접수·지원 결과·공고 승인 결과), 메타·OG·sitemap(R-19), 반응형 최종 검증(768·375·1280), 주요 동선 종주 QA, 접근성·콘솔 에러 0 검증</td>
            </tr>
            <tr>
              <td>6주차 (5/29 ~ 5/31)</td>
              <td><strong>배포 + 인계</strong></td>
              <td>Vercel + Supabase 운영 환경 분리 배포, 도메인 연결, 운영 비용표·이관 절차서 작성(R-14), 어드민 시드 + 인수인계 미팅, 후속 단계 백로그 정리</td>
            </tr>
          </tbody>
        </table>
        <div class="note-box">
          <p>
            <strong>사전 준비 요청:</strong> Vercel·Supabase 결제 명의 / Resend 이메일 발신 도메인 / 운영자 초기 계정 정보 / 개인정보처리방침·이용약관 초안을 착수 전에 공유해 주시면 일정 리스크를 최소화할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  `;

  const pageStack = `
    <div class="page content-page">
      <div class="page-header">
        <h2>제안 기술스택</h2>
        <span class="page-num">05 / 10</span>
      </div>
      <div class="page-body">
        <p style="font-size:12.5px; color:#4B5563; margin-bottom:10px;">
          1인 단독 수행으로 5.4주 안에 안정적 MVP를 만들기 위해, 통합 인증·DB·스토리지를 단일 벤더(Supabase)로 묶고 SSR/SEO와 배포는 Next.js + Vercel로 일원화합니다.
        </p>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-card-header">Frontend<span>Next.js 16 (App Router) + TypeScript + Tailwind 4</span></div>
            <div class="tech-card-body">
              <p>SSR · SSG로 공고 상세 SEO 유입(R-19) 확보. 단일 코드베이스 반응형(R-12). shadcn/ui 컴포넌트 시스템과 lucide 아이콘으로 UI 일관성 확보, 디자인 토큰을 globals.css로 단일화.</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-card-header">Backend<span>Next.js API Routes + Supabase Postgres</span></div>
            <div class="tech-card-body">
              <p>백엔드 분리 없이 API 라우트로 통합. RLS(Row Level Security)로 일반·기업·관리자 권한 분기(R-18) 구현. full-text search로 검색·필터(R-08) 기본 제공.</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-card-header">Auth · Storage<span>Supabase Auth + Supabase Storage</span></div>
            <div class="tech-card-body">
              <p>이메일·OAuth 통합 인증(R-01). 프로필 사진·포트폴리오 영상 썸네일을 Storage로 보관(R-03·R-16). 인증·DB·스토리지 한 콘솔로 관리하여 운영 비용 절감.</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-card-header">Email<span>Resend</span></div>
            <div class="tech-card-body">
              <p>월 3,000통 무료 티어로 가입 확인 / 지원 접수·결과 / 공고 승인·반려 메일 알림(R-20) 발송. 발송 이력은 Resend 대시보드 + DB notification 테이블 이중 보관.</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-card-header">Infrastructure<span>Vercel + Supabase Cloud</span></div>
            <div class="tech-card-body">
              <p>Next.js 최적 연동 + 프리뷰 배포로 검수 사이클 단축. 도메인 연결 후 의뢰사 명의 이전 가능(R-14). cron이 필요한 작업이 없어 서버리스 한계 회피.</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-card-header">DB 확장 슬롯<span>RBAC · 결제 · 검색 인덱스 · 감사 로그</span></div>
            <div class="tech-card-body">
              <p>jobType별 동적 추가 필드는 type_meta 테이블로 분리, 카테고리는 마스터 CRUD로 운영자가 직접 관리(R-13). 결제·다국어·감사 로그·외부 검색 인덱스 슬롯을 ERD에 선반영.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const pageDemo1 = `
    <div class="page content-page">
      <div class="page-header">
        <h2>데모 소개</h2>
        <span class="page-num">06 / 10</span>
      </div>
      <div class="page-body">
        <div class="highlight-box" style="margin-bottom: 12px;">
          73개 페이지 / 콘솔 에러 0 / axe 단일 룰만 잔존하는 검증 완료 데모입니다. 실제 동작 화면을 제안 단계에서 확인하실 수 있습니다.
        </div>
        <div class="screenshot-grid">
          ${shot('d1-home', '홈 (게스트)', '히어로 + 카테고리 그리드 + 추천 공고·예술인·프로젝트')}
          ${shot('d1-jobs-list', '공고 리스트 + jobType 4탭', '레슨·공연·행사·프로젝트 탭 + 좌측 필터(지역·장르·경력)')}
          ${shot('d1-jobs-detail', '공고 상세 + 지원 CTA', '포스터·기본 정보·조건 태그·상세 설명·우측 고정 지원 버튼')}
          ${shot('d1-jobs-new', '공고 등록 (기업)', 'jobType 선택 시 동적 추가 필드 자동 갈아끼움')}
        </div>
      </div>
    </div>
  `;

  const pageDemo2 = `
    <div class="page content-page">
      <div class="page-header">
        <h2>데모 소개</h2>
        <span class="page-num">07 / 10</span>
      </div>
      <div class="page-body">
        <div class="screenshot-grid">
          ${shot('d2-mypage', '마이페이지 (기업)', '4 탭 + 통계 4 카드 + jobType 분포 막대 + 카드별 메트릭')}
          ${shot('d2-projects', '프로젝트 모집 리스트', '단기 협업·공연 멤버 모집, 보수 유형(유·무·수익 배분) 표시')}
          ${shot('d2-artists', '예술인 리스트', '프로필·대표 영상 썸네일·장르 태그·경력·활동 가능 지역')}
          ${shot('d2-artist-detail', '예술인 상세 + 영상 그리드', '히어로 · 포트폴리오 영상 · 경력 타임라인 · 활동 가능 지역')}
        </div>
      </div>
    </div>
  `;

  const pageDemo3 = `
    <div class="page content-page">
      <div class="page-header">
        <h2>데모 소개</h2>
        <span class="page-num">08 / 10</span>
      </div>
      <div class="page-body">
        <div class="screenshot-grid">
          ${shot('d3-admin-dashboard', '관리자 대시보드', '승인 대기·오늘 처리·신고 카드 + 최근 활동 로그')}
          ${shot('d3-admin-approvals', '공고 승인 큐', '대기·승인·반려 탭 + 상세 검토 패널 + 반려 사유 모달')}
          ${shot('d3-admin-members', '회원 관리', '일반·기업 탭 + 상태 변경(활성·정지) + 검색·정렬')}
          ${shot('d3-admin-categories', '카테고리 관리', 'jobType 4 + 장르 8 마스터 CRUD + 사용 중 항목 삭제 잠금')}
        </div>
      </div>
    </div>
  `;

  const pageDemo4 = `
    <div class="page content-page">
      <div class="page-header">
        <h2>데모 소개</h2>
        <span class="page-num">09 / 10</span>
      </div>
      <div class="page-body">
        <div class="screenshot-grid">
          <div class="screenshot-item">
            <div class="img-wrapper">
              <img src="${dataUri('d4-tablet.png')}" alt="태블릿 768px"/>
              <img src="${dataUri('d4-mobile.png')}" alt="모바일 375px"/>
            </div>
            <div class="label">반응형 웹디자인</div>
            <div class="desc">태블릿(768px) + 모바일(375px) 최적화 레이아웃</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const pageDemoAccess = `
    <div class="page content-page">
      <div class="page-header">
        <h2>데모 접속 안내</h2>
        <span class="page-num">10 / 10</span>
      </div>
      <div class="demo-access-layout">
        <div class="demo-access-left">
          <div class="section-title" style="margin-top:0;">데모 URL</div>
          <div class="url-box">
            <a href="${DEMO_URL}" style="color: ${C.accent}; text-decoration: underline;">${DEMO_URL}</a>
          </div>
          <div class="section-title">접속 방법</div>
          <div class="step-row">
            <div class="step-circle">1</div>
            <div>
              <div class="step-text">제공된 URL에 PC 또는 모바일 브라우저로 접속합니다.</div>
              <div class="step-sub">Chrome · Safari · Edge 최신 버전 권장.</div>
            </div>
          </div>
          <div class="step-row">
            <div class="step-circle">2</div>
            <div>
              <div class="step-text">상단 우측 계정 드롭다운에서 데모 계정을 선택해 일반·기업·관리자 역할을 즉시 전환합니다.</div>
              <div class="step-sub">데모이므로 비밀번호 없이 전환됩니다.</div>
            </div>
          </div>
          <div class="step-row">
            <div class="step-circle">3</div>
            <div>
              <div class="step-text">홈 → 공고·프로젝트·예술인 탐색 → 지원·모집글 작성·관리자 승인까지 추천 동선을 자유롭게 따라가 보실 수 있습니다.</div>
            </div>
          </div>
        </div>
        <div class="demo-access-right">
          <img src="${qrDataUri}" alt="데모 QR" style="width:160px; height:160px;">
          <p style="font-size:11px; color:${C.muted}; margin-top:8px; text-align:center;">모바일 QR 스캔</p>
        </div>
      </div>
      <div class="demo-flow-box">
        <p class="title">추천 체험 동선</p>
        <div class="demo-flow-grid">
          <p><strong>공고 필터링과 지원</strong> &mdash; 홈 검색 자동완성 → 필터 → 공고 상세 → 지원 → 마이페이지 지원 내역 갱신</p>
          <p><strong>기업 공고 등록과 지원자 확인</strong> &mdash; 기업 대시보드 → 공고 등록 → 지원자 영상 그리드 → 채팅 제안</p>
          <p><strong>관리자 처리 큐</strong> &mdash; 대시보드 → 승인 큐 → 반려 사유 모달 → 처리 로그 갱신</p>
          <p><strong>프로젝트 모집</strong> &mdash; 프로젝트 탭 → 작성 폼 → 임시 저장 → 새 카드 하이라이트</p>
          <p><strong>댄스학원 레슨 강사 모집</strong> &mdash; 레슨 자동완성 → jobType 4탭 → 강사 상세 → 등록 폼 jobType 매칭</p>
          <p><strong>반응형 검증</strong> &mdash; 768px(태블릿) / 375px(모바일) / 1280px(데스크톱) 동일 코드베이스</p>
        </div>
      </div>
    </div>
  `;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${PROJECT_TITLE} 제안서</title>
<style>${CSS}</style>
</head>
<body>
${pageCover}
${pageUnderstanding}
${pageExperience}
${pagePlan}
${pageStack}
${pageDemo1}
${pageDemo2}
${pageDemo3}
${pageDemo4}
${pageDemoAccess}
</body>
</html>`;

  fs.writeFileSync(HTML_PATH, html);
  return html;
}

// ============================================================================
// PDF 생성
// ============================================================================
async function main() {
  console.log('Building HTML with embedded screenshots...');
  await buildHtml();
  console.log(`  ok ${path.basename(HTML_PATH)}`);

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
  console.log(`  ok ${path.basename(PDF_PATH)} (${size} MB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
