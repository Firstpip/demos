const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3199';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const VIEWPORT = { width: 1280, height: 800 };

// 로그인 상태를 localStorage에 설정
const AUTH_STATE = JSON.stringify({ isLoggedIn: true, userName: '이환규', role: 'user' });
const DOCTOR_AUTH = JSON.stringify({ isLoggedIn: true, userName: '김민수', role: 'doctor' });
const PHARMACIST_AUTH = JSON.stringify({ isLoggedIn: true, userName: '강정환', role: 'pharmacist' });
const ADMIN_AUTH = JSON.stringify({ isLoggedIn: true, userName: '관리자', role: 'admin' });

// 스크린샷 캡처 목록 (요구사항 순서)
const captures = [
  // 사용자 영역
  { name: '01_메인홈', url: '/', auth: null, scroll: 0 },
  { name: '02_DTC소개', url: '/dtc', auth: null },
  { name: '03_DTC검사키트', url: '/dtc/products', auth: null },
  { name: '04_DTC검사신청', url: '/dtc/products/basic', auth: AUTH_STATE },
  { name: '05_내결과_입구', url: '/my-results', auth: AUTH_STATE },
  { name: '06_DTC유전자결과', url: '/my-results/dtc', auth: AUTH_STATE, scroll: 200 },
  { name: '07_유전자마커상세', url: '/my-results/dtc', auth: AUTH_STATE, scroll: 900 },
  { name: '08_건강검진결과', url: '/my-results/health-checkup', auth: AUTH_STATE, scroll: 200 },
  { name: '09_AI건강리포트', url: '/my-results/report', auth: AUTH_STATE },
  { name: '10_건강설문', url: '/survey', auth: AUTH_STATE },
  { name: '11_마켓', url: '/market', auth: null },
  { name: '12_상품상세', url: '/market/P001', auth: null },
  { name: '13_상품상세_복용법', url: '/market/P001', auth: null, click: '복용법' },
  { name: '14_본인인증', url: '/verify', auth: AUTH_STATE },
  { name: '15_전문가상담_약사', url: '/consultation', auth: AUTH_STATE },
  { name: '16_채팅상담', url: '/consultation/room?type=chat', auth: AUTH_STATE, wait: 5000 },
  { name: '17_화상상담', url: '/consultation/room?type=video', auth: AUTH_STATE, wait: 3000 },
  { name: '18_장바구니', url: '/cart', auth: AUTH_STATE },
  { name: '19_결제', url: '/checkout', auth: AUTH_STATE },
  { name: '20_마이페이지', url: '/mypage', auth: AUTH_STATE },
  { name: '21_주문내역', url: '/mypage/orders', auth: AUTH_STATE },
  { name: '22_정기배송관리', url: '/mypage/subscription', auth: AUTH_STATE },
  { name: '23_복약관리', url: '/mypage/medication', auth: AUTH_STATE },
  { name: '24_상담내역', url: '/mypage/consultations', auth: AUTH_STATE },
  { name: '25_건강매거진', url: '/magazine', auth: null },
  { name: '26_고객센터FAQ', url: '/cs', auth: null },
  // 의사 파트너센터
  { name: '27_의사대시보드', url: '/partner', auth: DOCTOR_AUTH },
  { name: '28_환자목록', url: '/partner/patients', auth: DOCTOR_AUTH },
  { name: '29_의사상담관리', url: '/partner/consultation', auth: DOCTOR_AUTH },
  { name: '30_제품추천', url: '/partner/recommend', auth: DOCTOR_AUTH },
  { name: '31_수수료정산', url: '/partner/settlement', auth: DOCTOR_AUTH },
  { name: '32_QR링크설정', url: '/partner/qr', auth: DOCTOR_AUTH },
  // 약사
  { name: '33_약사대시보드', url: '/pharmacist', auth: PHARMACIST_AUTH },
  { name: '34_약사상담관리', url: '/pharmacist/consultation', auth: PHARMACIST_AUTH },
  { name: '35_제품조합', url: '/pharmacist/products', auth: PHARMACIST_AUTH },
  // 관리자
  { name: '36_관리자대시보드', url: '/admin', auth: ADMIN_AUTH },
  { name: '37_제품관리', url: '/admin/products', auth: ADMIN_AUTH },
  { name: '38_전문가관리', url: '/admin/experts', auth: ADMIN_AUTH },
  { name: '39_주문관리', url: '/admin/orders', auth: ADMIN_AUTH },
  { name: '40_정산관리', url: '/admin/settlement', auth: ADMIN_AUTH },
  // 반응형
  { name: '41_모바일_메인', url: '/', auth: null, mobile: true },
  { name: '42_모바일_마켓', url: '/market', auth: null, mobile: true },
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  for (const cap of captures) {
    const page = await browser.newPage();
    const vp = cap.mobile ? { width: 375, height: 812 } : VIEWPORT;
    await page.setViewport(vp);

    // auth 설정
    if (cap.auth) {
      await page.evaluateOnNewDocument((auth) => {
        localStorage.setItem('enerringer-auth', auth);
      }, cap.auth);
    }

    // 장바구니 더미 데이터 (장바구니 캡처용)
    if (cap.name.includes('장바구니')) {
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('enerringer-cart', JSON.stringify([
          { product: { id: 'P001', name: '프리미엄 밀크씨슬', price: 32000, subscriptionPrice: 25600, category: '간건강', ingredients: [], rating: 4.8, reviewCount: 234, description: '', detailDescription: '', howToTake: '', caution: '', targetUser: '' }, quantity: 1, isSubscription: true },
          { product: { id: 'P002', name: 'rTG 오메가3 1000', price: 38000, subscriptionPrice: 30400, category: '혈행건강', ingredients: [], rating: 4.9, reviewCount: 456, description: '', detailDescription: '', howToTake: '', caution: '', targetUser: '' }, quantity: 1, isSubscription: true },
        ]));
      });
    }

    // 푸터 숨김
    await page.evaluateOnNewDocument(() => {
      const style = document.createElement('style');
      style.textContent = 'footer { display: none !important; }';
      document.head.appendChild(style);
    });

    try {
      await page.goto(`${BASE_URL}${cap.url}`, { waitUntil: 'networkidle0', timeout: 15000 });

      // 추가 대기
      if (cap.wait) await new Promise(r => setTimeout(r, cap.wait));

      // 스크롤
      if (cap.scroll) await page.evaluate((y) => window.scrollTo(0, y), cap.scroll);

      // 탭 클릭
      if (cap.click) {
        const buttons = await page.$$('button');
        for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent, btn);
          if (text && text.includes(cap.click)) { await btn.click(); await new Promise(r => setTimeout(r, 500)); break; }
        }
      }

      await new Promise(r => setTimeout(r, 500));

      const filePath = path.join(SCREENSHOTS_DIR, `${cap.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✓ ${cap.name}`);
    } catch (err) {
      console.log(`✗ ${cap.name}: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n캡처 완료: ${SCREENSHOTS_DIR}`);
}

async function generatePDF() {
  // proposal-page.html 읽기 (build-proposal-html.js로 사전 생성 필요)
  const htmlPath = path.join(__dirname, 'proposal-page.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('proposal-page.html이 없습니다. 먼저 node build-proposal-html.js를 실행하세요.');
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  console.log(`proposal-page.html 로드 완료 (${(html.length / 1024 / 1024).toFixed(1)} MB)`);

  // Puppeteer로 PDF 변환
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

  const pdfPath = path.join(__dirname, '맞춤형_건기식_플랫폼_제안서.pdf');
  await page.pdf({
    path: pdfPath,
    width: '297mm',
    height: '210mm',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });

  await browser.close();
  console.log(`PDF 생성 완료: ${pdfPath}`);
}

// 실행: 인자에 따라 동작 분기
(async () => {
  const args = process.argv.slice(2);

  if (args.includes('--capture')) {
    console.log('=== 스크린샷 캡처 시작 ===');
    await captureScreenshots();
  }

  if (args.includes('--pdf') || args.length === 0) {
    console.log('\n=== PDF 생성 시작 ===');
    await generatePDF();
  }

  if (args.includes('--all')) {
    console.log('=== 스크린샷 캡처 시작 ===');
    await captureScreenshots();
    console.log('\n=== HTML 빌드 ===');
    require('./build-proposal-html');
    console.log('\n=== PDF 생성 시작 ===');
    await generatePDF();
  }
})();
