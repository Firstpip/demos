const puppeteer = require('./demo-app/node_modules/puppeteer');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = __dirname;
const DEMO_URL = 'https://firstpip.github.io/demos/kmong-225630-demo/';
const SS_DIR = path.join(PROJECT_DIR, 'screenshots');
const HTML_FILE = path.join(PROJECT_DIR, 'proposal-page.html');
const PDF_FILE = path.join(PROJECT_DIR, '스포츠리그_경기신청_대진표_플랫폼_제안서.pdf');

function img(filename) {
  const fp = path.join(SS_DIR, filename);
  if (!fs.existsSync(fp)) return '';
  return 'data:image/png;base64,' + fs.readFileSync(fp).toString('base64');
}

function buildHTML() {
  const screenshots = [
    { file: '01-home.png', label: '홈 - 대회 일정 및 실시간 경기' },
    { file: '02-schedule.png', label: '경기 일정 - 카테고리/상태 필터' },
    { file: '03-tournament-detail.png', label: '대회 상세 - 참가 신청' },
    { file: '04-payment.png', label: '결제 화면 (PG 결제 Mock)' },
    { file: '05-bracket.png', label: '토너먼트 대진표 - 실시간 업데이트' },
    { file: '06-bracket-finished.png', label: '대진표 - 우승자 표시' },
    { file: '07-ranking.png', label: '랭킹 - 카테고리별 순위' },
    { file: '08-mypage.png', label: '마이페이지 - 전적/참가 이력' },
    { file: '09-verify.png', label: '인증 관리 - 학생/프로 인증' },
    { file: '10-appeal.png', label: '이의제기 - 신청/현황' },
    { file: '11-admin-dashboard.png', label: '관리자 대시보드' },
    { file: '12-admin-members.png', label: '회원 관리' },
    { file: '13-admin-results.png', label: '경기 결과 입력' },
    { file: '14-admin-bracket-mgmt.png', label: '대진표 생성/관리' },
    { file: '15-admin-appeals.png', label: '이의제기 관리' },
    { file: '16-admin-payments.png', label: '결제 관리' },
    { file: '17-login.png', label: '로그인 - 소셜 로그인 지원' },
  ];

  const ssPages = [];
  for (let i = 0; i < screenshots.length; i += 4) {
    ssPages.push(screenshots.slice(i, i + 4));
  }

  const totalPages = 5 + ssPages.length + 1; // cover + 4 content + N demo + 1 access

  const pageHeader = (title, num) => `
    <div class="page-header">
      <h2>${title}</h2>
      <span class="page-num">${String(num).padStart(2,'0')} / ${totalPages}</span>
    </div>`;

  const demoHTML = ssPages.map((chunk, pi) => {
    const isFirst = pi === 0;
    const cards = chunk.map(s => `
      <div class="ss-item">
        <div class="ss-img-wrap"><img src="${img(s.file)}" alt="${s.label}" /></div>
        <div class="ss-label">${s.label}</div>
      </div>`).join('');
    return `
    <div class="page">
      ${pageHeader('데모 소개', 6 + pi)}
      ${isFirst ? '<p class="demo-intro">실제 동작하는 데모를 미리 준비했습니다. 제안 단계에서 완성도를 직접 확인하실 수 있습니다.</p>' : ''}
      <div class="ss-grid${isFirst ? ' with-intro' : ''}">${cards}</div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif; color: #1e293b; }

  .page {
    width: 297mm; height: 210mm; padding: 36px 48px;
    page-break-after: always; position: relative; overflow: hidden;
    display: flex; flex-direction: column;
  }
  .page:last-child { page-break-after: auto; }

  /* Page header - matching reference style */
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    padding-bottom: 14px; border-bottom: 3px solid #1e293b; margin-bottom: 24px; flex-shrink: 0;
  }
  .page-header h2 { font-size: 24px; color: #1e293b; font-weight: 800; letter-spacing: -0.5px; }
  .page-header .page-num { font-size: 13px; color: #94a3b8; font-weight: 500; }

  /* Cover - diagonal gradient like reference */
  .cover {
    justify-content: center; align-items: center; text-align: center; padding: 0;
    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%);
    color: white;
  }
  .cover .proposal-label { font-size: 14px; letter-spacing: 12px; font-weight: 300; opacity: 0.7; margin-bottom: 32px; }
  .cover h1 { font-size: 38px; font-weight: 800; line-height: 1.4; margin-bottom: 24px; }
  .cover .divider { width: 60px; height: 2px; background: rgba(255,255,255,0.5); margin: 0 auto 24px; }
  .cover .subtitle { font-size: 16px; font-weight: 400; opacity: 0.8; margin-bottom: 48px; }
  .cover .date { font-size: 13px; opacity: 0.6; }

  /* Project understanding */
  .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }
  .summary-box strong { color: #1e293b; }
  .summary-box p { font-size: 13px; color: #475569; line-height: 1.7; }
  .section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 14px; }
  .check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; margin-bottom: 24px; }
  .check-item { display: flex; align-items: start; gap: 8px; font-size: 12.5px; color: #334155; line-height: 1.5; }
  .check-icon { color: #2563eb; font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .cap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: auto; }
  .cap-card { background: #1e293b; border-left: 3px solid #2563eb; padding: 14px 16px; border-radius: 4px; }
  .cap-card h4 { font-size: 13px; font-weight: 600; color: white; }
  .cap-card p { font-size: 11px; color: #94a3b8; margin-top: 3px; }

  /* Experience */
  .exp-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 20px; }
  .exp-box h3 { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
  .exp-meta { font-size: 12px; color: #64748b; margin-bottom: 14px; }
  .exp-desc { font-size: 12.5px; color: #475569; line-height: 1.7; margin-bottom: 14px; }
  .tag-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag { background: #1e293b; color: white; font-size: 11px; padding: 4px 10px; border-radius: 999px; font-weight: 500; }
  .rel-section { margin-top: 16px; }
  .rel-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 14px; }
  .rel-item { display: flex; align-items: start; gap: 10px; margin-bottom: 10px; font-size: 12px; color: #334155; line-height: 1.6; }
  .rel-badge { background: #2563eb; color: white; font-size: 10px; padding: 3px 8px; border-radius: 4px; font-weight: 600; white-space: nowrap; flex-shrink: 0; margin-top: 1px; }
  .rel-arrow { color: #64748b; }

  /* Schedule */
  .schedule-intro { font-size: 13px; color: #475569; margin-bottom: 16px; line-height: 1.6; }
  .schedule-intro strong { color: #1e293b; }
  .sched-table { width: 100%; border-collapse: collapse; }
  .sched-table thead th { background: #1e293b; color: white; padding: 10px 14px; font-size: 12px; font-weight: 600; text-align: left; }
  .sched-table thead th:first-child { border-radius: 6px 0 0 0; }
  .sched-table thead th:last-child { border-radius: 0 6px 0 0; }
  .sched-table td { padding: 12px 14px; font-size: 12px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  .sched-date { font-size: 12px; font-weight: 500; }
  .sched-days { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .sched-step { font-weight: 700; }

  /* Tech stack */
  .tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
  .tech-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
  .tech-label { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 4px; }
  .tech-badge { display: inline-block; font-size: 13px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; }
  .tech-desc { font-size: 11px; color: #64748b; line-height: 1.6; }
  .tech-reason { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-top: auto; }
  .tech-reason strong { font-size: 12px; color: #1e293b; }
  .tech-reason p { font-size: 11.5px; color: #475569; line-height: 1.7; margin-top: 6px; }

  /* Demo screenshots */
  .demo-intro { font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 16px; border-left: 3px solid #2563eb; padding-left: 12px; }
  .ss-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 36px 28px; }
  .ss-item { display: flex; flex-direction: column; align-items: center; }
  .ss-img-wrap { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; width: 100%; height: 200px; }
  .ss-img-wrap img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .ss-label { padding: 8px 0 0; font-size: 13px; font-weight: 700; color: #1e293b; text-align: center; }

  /* Demo access */
  .access-box { border-left: 4px solid #2563eb; background: #f8fafc; border-radius: 0 8px 8px 0; padding: 20px 24px; margin-bottom: 24px; }
  .access-url { font-size: 15px; font-weight: 700; color: #1e40af; word-break: break-all; margin-top: 4px; }
  .steps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
  .step { display: flex; align-items: start; gap: 12px; }
  .step-num { width: 30px; height: 30px; background: #1e293b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
  .step h4 { font-size: 13px; font-weight: 600; }
  .step p { font-size: 11px; color: #64748b; margin-top: 2px; }
  .flows-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
  .flow-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .flow-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; font-size: 11.5px; color: #475569; line-height: 1.5; }
  .flow-item strong { color: #1e293b; }
</style>
</head>
<body>

<!-- Page 1: Cover -->
<div class="page cover">
  <div>
    <div class="proposal-label">P R O P O S A L</div>
    <h1>스포츠리그 경기신청 및<br>대진표 제공 플랫폼 구축</h1>
    <div class="divider"></div>
    <div class="subtitle">제안서</div>
    <div class="date">2026년 4월</div>
  </div>
</div>

<!-- Page 2: Project Understanding -->
<div class="page">
  ${pageHeader('프로젝트 이해도', 2)}
  <div class="summary-box">
    <p><strong>의뢰 핵심:</strong> 배드민턴 기반 스포츠 리그 시스템으로 회원관리, 대회관리, 랭킹관리, 대회운영 기능을 구축합니다. 월 1-2회 경기 주최를 위한 MVP 버전으로, 하이브리드 앱(iOS/Android) + 마켓 등록까지 포함하는 턴키 프로젝트입니다.</p>
  </div>
  <div class="section-title">주요 요구사항</div>
  <div class="check-grid">
    <div class="check-item"><span class="check-icon">✔</span> 관리자 수기 경기 일정 등록 및 카테고리 분류</div>
    <div class="check-item"><span class="check-icon">✔</span> 사용자 경기 신청 및 결제 필수 프로세스</div>
    <div class="check-item"><span class="check-icon">✔</span> 카테고리별 인증 (학생-나이, 프로-선수증)</div>
    <div class="check-item"><span class="check-icon">✔</span> 관리자 승인/거절 + 이의제기 재심사</div>
    <div class="check-item"><span class="check-icon">✔</span> 토너먼트 승자에 따른 대진표 실시간 업데이트</div>
    <div class="check-item"><span class="check-icon">✔</span> 선수 개인별 참가 경기/전적 조회</div>
    <div class="check-item"><span class="check-icon">✔</span> 카테고리별 랭킹 시스템 (승/패/포인트)</div>
    <div class="check-item"><span class="check-icon">✔</span> 소비자용 PC/MO 반응형 + 관리자 시스템</div>
    <div class="check-item"><span class="check-icon">✔</span> PG 결제 연동 (토스페이먼츠/간편결제)</div>
    <div class="check-item"><span class="check-icon">✔</span> 향후 영문 버전 및 해외 마켓 확장 대비 설계</div>
  </div>
  <div class="section-title">핵심 역량</div>
  <div class="cap-grid">
    <div class="cap-card"><h4>하이브리드 앱 개발</h4><p>React Native(Expo)로 iOS/Android 동시 개발. 마켓 등록 포함.</p></div>
    <div class="cap-card"><h4>PG 결제 연동</h4><p>토스페이먼츠 실전 연동 경험. 카드/간편결제/환불 처리.</p></div>
    <div class="cap-card"><h4>실시간 시스템</h4><p>Supabase Realtime으로 대진표/경기현황 실시간 반영.</p></div>
    <div class="cap-card"><h4>실제 동작 데모</h4><p>18개 페이지 데모 구현. 모든 인터랙션 동작 확인 가능.</p></div>
  </div>
</div>

<!-- Page 3: Experience -->
<div class="page">
  ${pageHeader('유사 경험', 3)}
  <div class="exp-box">
    <h3>패키지 디자인 에디터 쇼핑몰</h3>
    <div class="exp-meta">2025.01 - 2025.06 (6개월) · 기획 / 디자인 / 개발 100% 수행</div>
    <div class="exp-desc">
      컵, 봉투 등 패키지 디자인이 필요한 상품 전문 쇼핑몰. 상품 선택 후 에디터 페이지에서 Three.js/Fabric.js 기반 디자인 에디터로 패키지 디자인을 직접 편집/확정한 뒤 구매하는 커머스 플랫폼. 프론트엔드(Nuxt), 백엔드(Django), DB 설계(PostgreSQL), PG 결제(토스페이먼츠), 소셜 로그인(네이버/카카오), 알림톡 연동까지 전 과정을 1인으로 수행.
    </div>
    <div class="tag-row">
      <span class="tag">Nuxt.js</span><span class="tag">Django</span><span class="tag">Three.js</span><span class="tag">Fabric.js</span><span class="tag">PostgreSQL</span><span class="tag">토스페이먼츠</span><span class="tag">네이버 로그인</span><span class="tag">카카오 로그인</span><span class="tag">카카오 알림톡</span>
    </div>
  </div>
  <div class="rel-section">
    <div class="rel-title">이 프로젝트 관점에서의 연관성</div>
    <div class="rel-item"><span class="rel-badge">결제 연동</span> 토스페이먼츠 카드/간편결제 연동 경험 <span class="rel-arrow">→</span> 이번 프로젝트의 <strong>국내 PG 결제 + 환불 워크플로우</strong>에 직접 활용</div>
    <div class="rel-item"><span class="rel-badge">풀스택 개발</span> 프론트엔드 + 백엔드 단독 구축 <span class="rel-arrow">→</span> <strong>React Native + Supabase</strong>로 동일한 풀스택 구조 적용</div>
    <div class="rel-item"><span class="rel-badge">DB 설계</span> PostgreSQL 기반 상품/주문/회원 데이터 설계 <span class="rel-arrow">→</span> <strong>대회-신청-매치-결과-랭킹</strong> 스키마 설계에 직접 활용</div>
    <div class="rel-item"><span class="rel-badge">외부 API</span> 소셜 로그인/카카오 알림톡 연동 경험 <span class="rel-arrow">→</span> <strong>소셜 로그인, 푸시 알림, FCM</strong> 구현에 활용</div>
    <div class="rel-item"><span class="rel-badge">관리자 시스템</span> 주문/상품/회원 관리 대시보드 구축 <span class="rel-arrow">→</span> <strong>대회/신청/결제/이의제기 관리</strong> 시스템에 대응</div>
  </div>
</div>

<!-- Page 4: Implementation Plan -->
<div class="page">
  ${pageHeader('구현 계획', 4)}
  <p class="schedule-intro"><strong>총 90일(약 3개월)</strong> 일정으로 체계적으로 진행합니다. 각 단계별 산출물 공유 및 중간 점검을 통해 투명한 진행 상황을 보장합니다.</p>
  <table class="sched-table">
    <thead><tr><th>기간</th><th>단계</th><th>세부 내용</th></tr></thead>
    <tbody>
      <tr><td><div class="sched-date">04/30 ~ 05/13</div><div class="sched-days">14일</div></td><td class="sched-step">1. 기획 및 설계</td><td>요구사항 정의서, DB 스키마, API 설계서, 와이어프레임</td></tr>
      <tr><td><div class="sched-date">05/14 ~ 05/17</div><div class="sched-days">4일</div></td><td class="sched-step">2. 환경 세팅</td><td>Supabase 프로젝트 생성, Expo 초기화, CI/CD 구성</td></tr>
      <tr><td><div class="sched-date">05/18 ~ 05/31</div><div class="sched-days">14일</div></td><td class="sched-step">3. 인증/회원 시스템</td><td>소셜 로그인(카카오/네이버/구글), 회원가입, 카테고리 인증</td></tr>
      <tr><td><div class="sched-date">06/01 ~ 06/14</div><div class="sched-days">14일</div></td><td class="sched-step">4. 대회 관리</td><td>대회 CRUD, 경기 일정표, 카테고리 분류, 상태 워크플로우</td></tr>
      <tr><td><div class="sched-date">06/15 ~ 07/05</div><div class="sched-days">21일</div></td><td class="sched-step">5. 신청/결제/대진표</td><td>경기 신청, PG 결제 연동, 토너먼트 대진표, 실시간 업데이트, 랭킹</td></tr>
      <tr><td><div class="sched-date">07/06 ~ 07/19</div><div class="sched-days">14일</div></td><td class="sched-step">6. 관리자/알림</td><td>관리자 대시보드, 이의제기, 푸시 알림(FCM), 결제/환불 관리</td></tr>
      <tr><td><div class="sched-date">07/20 ~ 07/26</div><div class="sched-days">7일</div></td><td class="sched-step">7. QA 및 배포</td><td>통합 테스트, 디바이스 테스트, 앱 빌드, 스토어 등록</td></tr>
    </tbody>
  </table>
</div>

<!-- Page 5: Tech Stack -->
<div class="page">
  ${pageHeader('제안 기술스택', 5)}
  <div class="tech-grid">
    <div class="tech-card"><div class="tech-label">App Framework</div><div class="tech-badge">React Native (Expo)</div><div class="tech-desc">iOS/Android 하이브리드 앱 동시 개발. Expo로 빌드/배포 간소화. OTA 업데이트 지원.</div></div>
    <div class="tech-card"><div class="tech-label">Backend / Auth</div><div class="tech-badge">Supabase</div><div class="tech-desc">Auth/DB/Storage/Realtime 통합. 소셜 로그인, RLS 기반 보안. Edge Functions로 서버 로직.</div></div>
    <div class="tech-card"><div class="tech-label">Database</div><div class="tech-badge">PostgreSQL</div><div class="tech-desc">Supabase 내장 PostgreSQL. Realtime 구독으로 대진표 실시간 업데이트. RLS 정책.</div></div>
    <div class="tech-card"><div class="tech-label">Storage</div><div class="tech-badge">Supabase Storage</div><div class="tech-desc">선수증, 프로필 사진 등 파일 업로드. DB와 통합 관리. CDN 제공.</div></div>
    <div class="tech-card"><div class="tech-label">Payment</div><div class="tech-badge">토스페이먼츠</div><div class="tech-desc">국내 주요 PG사. 카드/계좌이체/카카오페이 동시 지원. Edge Functions에서 웹훅 처리.</div></div>
    <div class="tech-card"><div class="tech-label">Push Notification</div><div class="tech-badge">Expo Notifications</div><div class="tech-desc">FCM/APNs 통합. 경기 일정, 승인/거절, 대회 안내 알림.</div></div>
  </div>
  <div class="tech-reason">
    <strong>선정 이유:</strong>
    <p>의뢰인께서 하이브리드 앱을 희망하셨기에 React Native(Expo)를 선택했습니다. Supabase 올인원 조합으로 인증/DB/Storage/Realtime을 하나의 플랫폼에서 관리하여 개발 생산성을 극대화합니다. 대진표 실시간 업데이트는 Supabase Realtime으로 추가 인프라 없이 구현 가능하며, 월 ~$25의 합리적 비용으로 운영할 수 있습니다.</p>
  </div>
</div>

<!-- Demo pages -->
${demoHTML}

<!-- Last Page: Demo Access -->
<div class="page">
  ${pageHeader('데모 접속 안내', totalPages)}
  <div style="display: flex; gap: 24px; margin-bottom: 20px;">
    <div style="flex: 1;">
      <div class="access-box">
        <div style="font-size: 12px; color: #2563eb; font-weight: 600;">데모 URL</div>
        <div class="access-url">${DEMO_URL}</div>
      </div>
      <div class="steps-grid" style="margin-top: 16px;">
        <div class="step"><div class="step-num">1</div><div><h4>위 URL 접속</h4><p>PC 또는 모바일 브라우저에서 접속</p></div></div>
        <div class="step"><div class="step-num">2</div><div><h4>로그인</h4><p>아무 값이나 입력하여 로그인 가능</p></div></div>
        <div class="step"><div class="step-num">3</div><div><h4>기능 체험</h4><p>대회 신청, 대진표, 랭킹 등 체험</p></div></div>
        <div class="step"><div class="step-num">4</div><div><h4>관리자 모드</h4><p>헤더의 역할 전환 버튼 클릭</p></div></div>
      </div>
    </div>
    <div style="flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px;">
      <img src="QR_PLACEHOLDER" style="width: 140px; height: 140px;" />
      <div style="font-size: 10px; color: #94a3b8; margin-top: 8px; text-align: center;">모바일에서 QR 스캔으로<br>바로 접속하세요</div>
    </div>
  </div>
  <div style="margin-top: 150px;">
    <div class="flows-title">체험 가능한 주요 플로우</div>
    <div class="flow-grid">
      <div class="flow-item"><strong>경기 신청</strong> - 대회 선택 > 상세 확인 > 신청 > Mock 결제(카드/계좌/카카오) > 완료</div>
      <div class="flow-item"><strong>대진표 확인</strong> - 진행중 대회 > 대진표 > 라운드별 매치 > 실시간 LIVE > 우승자</div>
      <div class="flow-item"><strong>랭킹 조회</strong> - 카테고리별 필터 > TOP 3 카드 > 전체 순위 > 선수 검색</div>
      <div class="flow-item"><strong>마이페이지</strong> - 전적 요약 > 참가 이력 > 결제 내역 > 인증 관리 > 이의제기</div>
      <div class="flow-item"><strong>대회 운영</strong> - 대회 생성 > 접수 관리 > 시드 배정 > 대진표 생성 > 결과 입력 > 종료</div>
      <div class="flow-item"><strong>관리자 기능</strong> - 대시보드 > 회원 관리 > 인증 승인 > 이의제기 처리 > 결제/환불</div>
    </div>
  </div>
</div>

</body>
</html>`;
}

(async () => {
  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(DEMO_URL, { width: 280, margin: 1, color: { dark: '#1e293b' } });

  let html = buildHTML();
  html = html.replace('QR_PLACEHOLDER', qrDataUrl);
  fs.writeFileSync(HTML_FILE, html);
  console.log('HTML saved:', HTML_FILE);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('file://' + HTML_FILE, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: PDF_FILE,
    width: '297mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log('PDF saved:', PDF_FILE);
  await browser.close();
})();
