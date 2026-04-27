// capture-screenshots.js — ARTWORK 데모 스크린샷 자동 캡처
// 사용법: dev server가 http://localhost:3001 에서 실행 중인 상태에서 `node capture-screenshots.js`

const puppeteer = require('/Users/simjeong-gyu/Desktop/outsourcing/bidding/kmong-225711-homepage/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SS_DIR = path.join(ROOT, 'screenshots');
const BASE_URL = 'http://localhost:3001';

const STORAGE_KEY = 'artwork225834:auth';

if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR);

const SESSIONS = {
  guest: null,
  general: { session: { userId: 'u-001', type: 'general', name: '서준호' }, scraps: [], myApplications: [], pendingJobAdjust: 0, notificationCountOffset: 0 },
  company: { session: { userId: 'c-001', type: 'company', name: '스테이지라이즈(담당: 김태호)' }, scraps: [], myApplications: [], pendingJobAdjust: 0, notificationCountOffset: 0 },
  academy: { session: { userId: 'c-009', type: 'company', name: '스튜디오라이즈댄스아카데미(담당: 윤소은)' }, scraps: [], myApplications: [], pendingJobAdjust: 0, notificationCountOffset: 0 },
  admin: { session: { userId: 'a-001', type: 'admin', name: 'ARTWORK 운영팀' }, scraps: [], myApplications: [], pendingJobAdjust: 0, notificationCountOffset: 0 },
};

async function setAuth(page, kind) {
  const state = SESSIONS[kind];
  await page.evaluateOnNewDocument((key, value) => {
    if (value === null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, STORAGE_KEY, state);
}

async function hideFooter(page) {
  await page.addStyleTag({ content: 'footer { display: none !important; }' });
}

async function shoot(page, name, opts = {}) {
  const filePath = path.join(SS_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: opts.fullPage || false });
  console.log(`  shot ${name}.png`);
}

async function gotoPage(browser, route, kind, viewport = { width: 1280, height: 900 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await setAuth(page, kind);
  await page.goto(BASE_URL + route, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 600));
  await hideFooter(page);
  return page;
}

async function main() {
  console.log('Launching puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });

  // ============================================================
  // 데모 소개 1 (4컷): 홈 / 공고 리스트 / 공고 상세 / 공고 등록
  // ============================================================
  console.log('[demo intro 1]');
  {
    const p = await gotoPage(browser, '/', 'guest');
    await shoot(p, 'd1-home');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/jobs/', 'general');
    await shoot(p, 'd1-jobs-list');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/jobs/job-001/', 'general');
    await shoot(p, 'd1-jobs-detail');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/jobs/new/', 'company');
    // wait for jobType select or form
    await new Promise((r) => setTimeout(r, 800));
    await shoot(p, 'd1-jobs-new');
    await p.close();
  }

  // ============================================================
  // 데모 소개 2 (4컷): 마이페이지(기업) / 프로젝트 리스트 / 예술인 리스트 / 예술인 상세
  // ============================================================
  console.log('[demo intro 2]');
  {
    const p = await gotoPage(browser, '/mypage/?tab=my-jobs', 'company');
    await shoot(p, 'd2-mypage');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/projects/', 'general');
    await shoot(p, 'd2-projects');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/artists/', 'general');
    await shoot(p, 'd2-artists');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/artists/u-001/', 'general');
    await shoot(p, 'd2-artist-detail');
    await p.close();
  }

  // ============================================================
  // 데모 소개 3 (4컷): 관리자 대시보드 / 공고 승인 / 회원관리 / 카테고리 관리
  // ============================================================
  console.log('[demo intro 3]');
  {
    const p = await gotoPage(browser, '/admin/', 'admin');
    await shoot(p, 'd3-admin-dashboard');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/admin/approvals/', 'admin');
    await shoot(p, 'd3-admin-approvals');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/admin/members/', 'admin');
    await shoot(p, 'd3-admin-members');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/admin/categories/', 'admin');
    await shoot(p, 'd3-admin-categories');
    await p.close();
  }

  // ============================================================
  // 데모 소개 4 (반응형): 태블릿 + 모바일
  // ============================================================
  console.log('[demo intro 4 — responsive]');
  {
    const p = await gotoPage(browser, '/jobs/', 'general', { width: 768, height: 1024 });
    await shoot(p, 'd4-tablet');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/jobs/', 'general', { width: 375, height: 812 });
    await shoot(p, 'd4-mobile');
    await p.close();
  }

  // ============================================================
  // 시나리오 S-01: 댄서가 힙합 공고를 필터링 → 지원
  // ============================================================
  console.log('[scenario S-01]');
  {
    const p = await gotoPage(browser, '/', 'general');
    await shoot(p, 's1-1-home');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/jobs/?genre=dance', 'general');
    await shoot(p, 's1-2-list-filtered');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/jobs/job-001/', 'general');
    await shoot(p, 's1-3-detail-cta');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/mypage/?tab=applications', 'general');
    await shoot(p, 's1-4-mypage-applied');
    await p.close();
  }

  // ============================================================
  // 시나리오 S-02: 기업이 공고 등록 후 지원자 확인
  // ============================================================
  console.log('[scenario S-02]');
  {
    const p = await gotoPage(browser, '/jobs/new/', 'company');
    await shoot(p, 's2-1-jobs-new');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/mypage/?tab=my-jobs', 'company');
    await shoot(p, 's2-2-company-dashboard');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/artists/u-001/', 'company');
    await shoot(p, 's2-3-artist-portfolio');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/artists/', 'company');
    await shoot(p, 's2-4-artists-list');
    await p.close();
  }

  // ============================================================
  // 시나리오 S-03: 관리자 승인 큐 검토·반려
  // ============================================================
  console.log('[scenario S-03]');
  {
    const p = await gotoPage(browser, '/admin/', 'admin');
    await shoot(p, 's3-1-admin-dashboard');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/admin/approvals/', 'admin');
    await shoot(p, 's3-2-approval-queue');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/admin/reports/', 'admin');
    await shoot(p, 's3-3-reports');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/admin/jobs/', 'admin');
    await shoot(p, 's3-4-admin-jobs');
    await p.close();
  }

  // ============================================================
  // 시나리오 S-04: 개인 예술인이 프로젝트 모집글 작성
  // ============================================================
  console.log('[scenario S-04]');
  {
    const p = await gotoPage(browser, '/projects/', 'general');
    await shoot(p, 's4-1-projects-list');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/projects/new/', 'general');
    await shoot(p, 's4-2-projects-new');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/projects/proj-001/', 'general');
    await shoot(p, 's4-3-project-detail');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/mypage/?tab=my-projects', 'general');
    await shoot(p, 's4-4-mypage-projects');
    await p.close();
  }

  // ============================================================
  // 시나리오 S-05: 댄스학원이 레슨 강사 모집
  // ============================================================
  console.log('[scenario S-05]');
  {
    const p = await gotoPage(browser, '/jobs/?type=lesson', 'general');
    await shoot(p, 's5-1-lesson-tab');
    await p.close();
  }
  {
    // pick a lesson job — try job-007 first; fallback to job-001
    let route = '/jobs/job-007/';
    let page = await gotoPage(browser, route, 'general');
    const url = page.url();
    if (url.endsWith('/jobs/') || url.includes('?')) {
      await page.close();
      page = await gotoPage(browser, '/jobs/job-001/', 'general');
    }
    await shoot(page, 's5-2-lesson-detail');
    await page.close();
  }
  {
    const p = await gotoPage(browser, '/jobs/new/', 'academy');
    await shoot(p, 's5-3-academy-new');
    await p.close();
  }
  {
    const p = await gotoPage(browser, '/admin/categories/', 'admin');
    await shoot(p, 's5-4-categories');
    await p.close();
  }

  await browser.close();
  console.log('done');
}

main().catch((e) => { console.error(e); process.exit(1); });
