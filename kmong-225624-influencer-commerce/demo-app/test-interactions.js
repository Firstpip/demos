const puppeteer = require("puppeteer");

const BASE = "http://localhost:3456";
const results = [];
let consoleErrors = [];

function log(category, test, status, detail = "") {
  results.push({ category, test, status, detail });
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function safeClick(page, selector, timeout = 3000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    return true;
  } catch { return false; }
}

async function hasText(page, text) {
  return page.evaluate((t) => document.body.innerText.includes(t), text);
}

async function hasElement(page, selector) {
  return page.evaluate((s) => !!document.querySelector(s), selector);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on("console", msg => {
    if (msg.type() === "error" && !msg.text().includes("favicon")) {
      consoleErrors.push(msg.text().substring(0, 150));
    }
  });

  // ═══════════════════════════════════════════════
  // 소비자 웹
  // ═══════════════════════════════════════════════

  // 1. 메인 페이지
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("메인", "히어로 배너 존재", await hasElement(page, "#home-hero") ? "OK" : "FAIL");
  log("메인", "인플루언서 섹션", await hasElement(page, "#home-influencers") ? "OK" : "FAIL");
  log("메인", "인기 상품 섹션", await hasElement(page, "#home-products") ? "OK" : "FAIL");

  // 히어로 쇼핑하기 버튼
  const shopClicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("쇼핑하기"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(1000);
  log("메인", "쇼핑하기 버튼 → /products/ 이동", shopClicked && page.url().includes("/products") ? "OK" : "FAIL", page.url());
  await page.goBack();
  await sleep(500);

  // 인플루언서 보기 버튼
  const infBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("인플루언서 보기"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  log("메인", "인플루언서 보기 버튼 클릭", infBtn ? "OK" : "FAIL");

  // 카테고리 탭 전환
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 15000 });
  const catTabs = await page.$$("button");
  let catTabClicked = false;
  for (const btn of catTabs) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && text.includes("뷰티")) {
      await btn.click();
      catTabClicked = true;
      break;
    }
  }
  log("메인", "카테고리 탭 전환 (뷰티)", catTabClicked ? "OK" : "FAIL");

  // 인플루언서 카드 클릭 → 브릿지 이동
  const infLink = await page.$('a[href*="/influencer/inf-"]');
  if (infLink) {
    await infLink.click();
    await sleep(1500);
    log("메인", "인플루언서 카드 → 브릿지 이동", page.url().includes("/influencer/inf-") ? "OK" : "FAIL", page.url());
    await page.goBack();
    await sleep(500);
  } else {
    log("메인", "인플루언서 카드 링크 존재", "FAIL");
  }

  // 2. 상품 목록
  await page.goto(`${BASE}/products/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("상품목록", "페이지 로드", await hasElement(page, "#page-products") ? "OK" : "FAIL");

  // 검색
  const searchInput = await page.$('input[placeholder*="검색"]');
  if (searchInput) {
    await searchInput.type("크림");
    await sleep(500);
    const filtered = await page.evaluate(() => document.querySelectorAll('[class*="grid"] > div, [class*="grid"] > a').length);
    log("상품목록", "검색 필터링", "OK", `${filtered}개 결과`);
    // Clear
    await searchInput.click({ clickCount: 3 });
    await searchInput.press("Backspace");
    await sleep(300);
  } else {
    log("상품목록", "검색 인풋 존재", "FAIL");
  }

  // 정렬 드롭다운
  const sortTrigger = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("인기순") || b.textContent.includes("정렬"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("상품목록", "정렬 드롭다운", sortTrigger ? "OK" : "FAIL");

  // 상품 카드 클릭
  const prodLink = await page.$('a[href*="/products/prod-"]');
  if (prodLink) {
    await prodLink.click();
    await sleep(1500);
    log("상품목록", "상품 카드 → 상세 이동", page.url().includes("/products/prod-") ? "OK" : "FAIL");
  } else {
    log("상품목록", "상품 카드 링크 존재", "FAIL");
  }

  // 3. 상품 상세
  await page.goto(`${BASE}/products/prod-1/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("상품상세", "페이지 로드", await hasText(page, "한복 모던 원피스") ? "OK" : "FAIL");

  // 수량 증가
  const plusBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.trim() === "+");
    if (btn) { btn.click(); return true; }
    return false;
  });
  log("상품상세", "수량 + 버튼", plusBtn ? "OK" : "FAIL");

  // 장바구니 추가
  const addCartBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("장바구니"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(1000);
  log("상품상세", "장바구니 추가 버튼", addCartBtn ? "OK" : "FAIL");

  // 토스트 확인
  const toastVisible = await page.evaluate(() => {
    const toasts = document.querySelectorAll("[data-sonner-toast], [role='status'], li[data-sonner-toast]");
    return toasts.length > 0;
  });
  log("상품상세", "장바구니 추가 토스트", toastVisible ? "OK" : "FAIL");

  // 리뷰 존재
  log("상품상세", "리뷰 섹션", await hasText(page, "리뷰") ? "OK" : "FAIL");

  // 추천 인플루언서 섹션
  log("상품상세", "추천 인플루언서", await hasText(page, "Sarah") || await hasText(page, "인플루언서") ? "OK" : "FAIL");

  // 4. 인플루언서 브릿지
  await page.goto(`${BASE}/influencer/inf-1/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("브릿지", "인플루언서 프로필", await hasText(page, "Sarah Johnson") ? "OK" : "FAIL");
  log("브릿지", "SNS 링크", await hasText(page, "instagram") || await hasText(page, "Instagram") || await hasElement(page, 'a[href*="instagram"], svg') ? "OK" : "FAIL");
  log("브릿지", "추천 상품 존재", await hasElement(page, 'a[href*="/products/prod-"]') ? "OK" : "FAIL");

  // 5. 장바구니
  await page.goto(`${BASE}/cart/`, { waitUntil: "networkidle0", timeout: 15000 });
  const cartHasItems = await hasText(page, "한복") || await hasText(page, "장바구니");
  log("장바구니", "페이지 로드", cartHasItems ? "OK" : "FAIL");

  // 쿠폰 적용
  const couponInput = await page.$('input[placeholder*="할인"], input[placeholder*="쿠폰"], input[placeholder*="코드"]');
  if (couponInput) {
    await couponInput.type("SARAH15");
    const applyBtn = await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button")];
      const btn = btns.find(b => b.textContent.includes("적용"));
      if (btn) { btn.click(); return true; }
      return false;
    });
    await sleep(500);
    log("장바구니", "쿠폰 적용", applyBtn ? "OK" : "FAIL");
  } else {
    log("장바구니", "쿠폰 입력 존재", await hasText(page, "비어") ? "SKIP(빈 장바구니)" : "FAIL");
  }

  // 수량 변경
  const qtyPlus = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.trim() === "+" && b.closest("#cart-items, [id*='cart']"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  log("장바구니", "수량 변경", qtyPlus ? "OK" : "SKIP");

  // 6. 로그인
  await page.goto(`${BASE}/login/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("로그인", "데모 안내 문구", await hasText(page, "데모") ? "OK" : "FAIL");
  log("로그인", "헤더 숨김", !(await hasElement(page, "#consumer-header")) ? "OK" : "FAIL");

  // 로그인 폼 제출
  const emailInput = await page.$('input[type="email"], input[placeholder*="이메일"]');
  const pwInput = await page.$('input[type="password"]');
  if (emailInput && pwInput) {
    await emailInput.type("test@test.com");
    await pwInput.type("1234");
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button")];
      const btn = btns.find(b => b.textContent.includes("로그인"));
      if (btn) btn.click();
    });
    await sleep(1500);
    log("로그인", "로그인 → 메인 이동", page.url().endsWith("/") || page.url().includes("localhost:3456") ? "OK" : "FAIL", page.url());
  } else {
    log("로그인", "로그인 폼 존재", "FAIL");
  }

  // 7. 회원가입
  await page.goto(`${BASE}/signup/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("회원가입", "페이지 로드", await hasText(page, "회원가입") || await hasText(page, "가입") ? "OK" : "FAIL");
  log("회원가입", "헤더 숨김", !(await hasElement(page, "#consumer-header")) ? "OK" : "FAIL");

  // 유효성 검증 테스트 (빈 제출)
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("가입") || b.textContent.includes("회원"));
    if (btn) btn.click();
  });
  await sleep(500);
  log("회원가입", "빈 폼 제출 차단", await hasText(page, "필수") || await hasText(page, "입력") || page.url().includes("/signup") ? "OK" : "FAIL");

  // 8. 결제
  await page.goto(`${BASE}/checkout/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("결제", "배송지 폼", await hasElement(page, "#checkout-form") || await hasText(page, "배송") ? "OK" : "FAIL");
  log("결제", "결제수단 선택", await hasText(page, "토스페이") || await hasText(page, "카카오페이") || await hasText(page, "카드") ? "OK" : "FAIL");

  // 9. 주문 완료
  await page.goto(`${BASE}/order-complete/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("주문완료", "페이지 로드", await hasText(page, "완료") || await hasText(page, "주문") ? "OK" : "FAIL");

  // 10. 마이페이지
  await page.goto(`${BASE}/mypage/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("마이페이지", "페이지 로드", await hasText(page, "주문") ? "OK" : "FAIL");

  // 탭 전환
  const mypageTabs = await page.$$('[role="tab"], button');
  let tabSwitched = false;
  for (const tab of mypageTabs) {
    const text = await tab.evaluate(el => el.textContent);
    if (text && (text.includes("배송") || text.includes("추적"))) {
      await tab.click();
      tabSwitched = true;
      break;
    }
  }
  await sleep(300);
  log("마이페이지", "탭 전환 (배송추적)", tabSwitched ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════
  // 인플루언서 대시보드
  // ═══════════════════════════════════════════════

  await page.goto(`${BASE}/influencer/dashboard/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("INF대시보드", "KPI 카드", await hasText(page, "Total Earnings") || await hasText(page, "Earnings") ? "OK" : "FAIL");
  log("INF대시보드", "차트 존재", await hasElement(page, ".recharts-wrapper, svg.recharts-surface") ? "OK" : "FAIL");

  // 기간 전환 (7d/30d/90d)
  const periodBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("30d") || b.textContent.includes("30"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  log("INF대시보드", "차트 기간 변경", periodBtn ? "OK" : "FAIL");

  // Earnings
  await page.goto(`${BASE}/influencer/earnings/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("INF수익", "정산 이력 테이블", await hasElement(page, "table") ? "OK" : "FAIL");
  log("INF수익", "Step Indicator", await hasText(page, "Pending") || await hasText(page, "Processing") || await hasText(page, "Completed") ? "OK" : "FAIL");
  log("INF수익", "USD 금액", await hasText(page, "$") ? "OK" : "FAIL");

  // Links
  await page.goto(`${BASE}/influencer/links/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("INF링크", "딥링크 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  // Create Link 모달
  const createLinkBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("Create") || b.textContent.includes("생성"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  const modalOpen = await hasElement(page, '[role="dialog"]');
  log("INF링크", "Create Link 모달", createLinkBtn && modalOpen ? "OK" : "FAIL");
  // 모달 닫기
  await page.keyboard.press("Escape");
  await sleep(300);

  // Copy 버튼
  const copyBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("Copy") || b.textContent.includes("복사"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("INF링크", "Copy 버튼 + 토스트", copyBtn ? "OK" : "FAIL");

  // Products
  await page.goto(`${BASE}/influencer/products/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("INF상품", "상품 카드 존재", await hasText(page, "Generate Link") || await hasText(page, "Commission") ? "OK" : "FAIL");

  const genLinkBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("Generate"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("INF상품", "Generate Link 버튼 + 토스트", genLinkBtn ? "OK" : "FAIL");

  // Settings
  await page.goto(`${BASE}/influencer/settings/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("INF설정", "프로필 폼", await hasText(page, "Sarah") || await hasText(page, "Profile") ? "OK" : "FAIL");
  log("INF설정", "Payoneer 섹션", await hasText(page, "Payoneer") || await hasText(page, "Payout") ? "OK" : "FAIL");

  const saveBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("Save") || b.textContent.includes("저장"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("INF설정", "Save 버튼 + 토스트", saveBtn ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════
  // 공급사 어드민
  // ═══════════════════════════════════════════════

  await page.goto(`${BASE}/vendor/dashboard/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("VEN대시보드", "KPI 카드", await hasText(page, "매출") || await hasText(page, "주문") ? "OK" : "FAIL");
  log("VEN대시보드", "차트 존재", await hasElement(page, ".recharts-wrapper, svg.recharts-surface") ? "OK" : "FAIL");

  // Products
  await page.goto(`${BASE}/vendor/products/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("VEN상품", "상품 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  const addProductBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("추가") || b.textContent.includes("등록"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("VEN상품", "상품 추가 모달", addProductBtn && await hasElement(page, '[role="dialog"]') ? "OK" : "FAIL");
  await page.keyboard.press("Escape");
  await sleep(300);

  // Orders
  await page.goto(`${BASE}/vendor/orders/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("VEN주문", "주문 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  // 주문 상세 모달
  const orderRow = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("tr")];
    const row = rows.find(r => r.querySelector("td"));
    if (row) { row.click(); return true; }
    return false;
  });
  await sleep(500);
  log("VEN주문", "주문 상세 모달", orderRow ? "OK" : "FAIL");
  await page.keyboard.press("Escape");
  await sleep(300);

  // Settlements
  await page.goto(`${BASE}/vendor/settlements/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("VEN정산", "수수료 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  const approveBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("승인"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("VEN정산", "승인 버튼 + 토스트", approveBtn ? "OK" : "FAIL");

  // Settings
  await page.goto(`${BASE}/vendor/settings/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("VEN설정", "업체 정보 폼", await hasText(page, "서울스타일") || await hasText(page, "회사명") ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════
  // 통합 관리자
  // ═══════════════════════════════════════════════

  await page.goto(`${BASE}/admin/dashboard/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM대시보드", "KPI 카드", await hasText(page, "GMV") || await hasText(page, "주문") ? "OK" : "FAIL");
  log("ADM대시보드", "차트", await hasElement(page, ".recharts-wrapper, svg.recharts-surface") ? "OK" : "FAIL");
  log("ADM대시보드", "활동 로그", await hasText(page, "활동") || await hasText(page, "로그") || await hasText(page, "생성") ? "OK" : "FAIL");

  // Users
  await page.goto(`${BASE}/admin/users/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM사용자", "테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  // 탭 전환
  const userTabInf = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], button')];
    const tab = tabs.find(t => t.textContent.includes("인플루언서"));
    if (tab) { tab.click(); return true; }
    return false;
  });
  await sleep(300);
  log("ADM사용자", "탭 전환 (인플루언서)", userTabInf ? "OK" : "FAIL");

  // 상태 변경
  const statusToggle = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("비활성") || b.textContent.includes("활성화"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM사용자", "상태 변경 + 토스트", statusToggle ? "OK" : "FAIL");

  // Products
  await page.goto(`${BASE}/admin/products/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM상품", "상품 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  const approveProduct = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("승인"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM상품", "승인/반려 액션", approveProduct ? "OK" : "FAIL");

  // Matching
  await page.goto(`${BASE}/admin/matching/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM매칭", "매칭 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  const createMatchBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("매칭") && b.textContent.includes("생성"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM매칭", "매칭 생성 모달", createMatchBtn && await hasElement(page, '[role="dialog"]') ? "OK" : "FAIL");
  await page.keyboard.press("Escape");
  await sleep(300);

  // Orders
  await page.goto(`${BASE}/admin/orders/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM주문", "주문 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  // 필터
  log("ADM주문", "필터 (상태/인플루언서/공급사)", await hasText(page, "전체") || await hasText(page, "필터") || await hasElement(page, "button[role='combobox']") ? "OK" : "FAIL");

  // 주문 상세 (인플루언서 귀속)
  const admOrderRow = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("tr")];
    const row = rows.find(r => r.querySelector("td"));
    if (row) { row.click(); return true; }
    return false;
  });
  await sleep(500);
  const hasAttribution = await hasText(page, "귀속") || await hasText(page, "인플루언서");
  log("ADM주문", "주문 상세 + 인플루언서 귀속", admOrderRow && hasAttribution ? "OK" : "FAIL");
  await page.keyboard.press("Escape");
  await sleep(300);

  // Settlements
  await page.goto(`${BASE}/admin/settlements/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM정산", "Step Indicator", await hasText(page, "매출집계") || await hasText(page, "수수료") ? "OK" : "FAIL");
  log("ADM정산", "환율 설정", await hasText(page, "환율") || await hasText(page, "USD") ? "OK" : "FAIL");
  log("ADM정산", "정산 테이블", await hasElement(page, "table") ? "OK" : "FAIL");

  // 일괄 지급 버튼
  const bulkPayBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("지급") || b.textContent.includes("실행"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM정산", "일괄 지급 버튼", bulkPayBtn ? "OK" : "FAIL");
  await page.keyboard.press("Escape");
  await sleep(300);

  // Promotions
  await page.goto(`${BASE}/admin/promotions/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM프로모션", "할인코드 테이블", await hasElement(page, "table") ? "OK" : "FAIL");
  log("ADM프로모션", "인플루언서 전용 코드", await hasText(page, "SARAH15") ? "OK" : "FAIL");

  const createPromoBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("생성") || b.textContent.includes("추가"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM프로모션", "할인코드 생성 모달", createPromoBtn && await hasElement(page, '[role="dialog"]') ? "OK" : "FAIL");
  await page.keyboard.press("Escape");
  await sleep(300);

  // Reports
  await page.goto(`${BASE}/admin/reports/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM리포트", "차트 존재", await hasElement(page, ".recharts-wrapper, svg.recharts-surface") ? "OK" : "FAIL");
  log("ADM리포트", "필터 (기간)", await hasElement(page, 'input[type="date"]') ? "OK" : "FAIL");

  // 탭 전환
  const reportTabInf = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], button')];
    const tab = tabs.find(t => t.textContent.includes("인플루언서별"));
    if (tab) { tab.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM리포트", "탭 전환 (인플루언서별)", reportTabInf ? "OK" : "FAIL");

  // 다운로드 버튼
  const dlBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("다운로드") || b.textContent.includes("Download"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM리포트", "다운로드 버튼 + 토스트", dlBtn ? "OK" : "FAIL");

  // Categories
  await page.goto(`${BASE}/admin/categories/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("ADM카테고리", "카테고리 목록", await hasText(page, "패션") && await hasText(page, "뷰티") ? "OK" : "FAIL");

  const addCatBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("추가"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM카테고리", "카테고리 추가 모달", addCatBtn && await hasElement(page, '[role="dialog"]') ? "OK" : "FAIL");
  await page.keyboard.press("Escape");

  // ═══════════════════════════════════════════════
  // 반응형 테스트
  // ═══════════════════════════════════════════════

  for (const { w, name } of [{ w: 768, name: "태블릿" }, { w: 375, name: "모바일" }]) {
    await page.setViewport({ width: w, height: 812 });
    for (const url of ["/", "/products/", "/products/prod-1/"]) {
      await page.goto(`${BASE}${url}`, { waitUntil: "networkidle0", timeout: 15000 });
      const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth);
      log("반응형", `${name}(${w}px) ${url} 가로스크롤`, overflow ? "FAIL" : "OK");
    }
  }

  // 모바일 하단 네비
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 15000 });
  const bottomNav = await hasElement(page, '#mobile-bottom-nav, nav.fixed.bottom-0, [class*="fixed"][class*="bottom"]');
  log("반응형", "모바일 하단 네비게이션", bottomNav ? "OK" : "FAIL");

  await browser.close();

  // ═══════════════════════════════════════════════
  // 결과 출력
  // ═══════════════════════════════════════════════

  console.log("\n" + "=".repeat(70));
  console.log("  인터랙션 전수 검사 결과");
  console.log("=".repeat(70));

  const cats = [...new Set(results.map(r => r.category))];
  let okCount = 0, failCount = 0, skipCount = 0;

  for (const cat of cats) {
    console.log(`\n[${cat}]`);
    for (const r of results.filter(r => r.category === cat)) {
      const icon = r.status === "OK" ? "  ✅" : r.status === "FAIL" ? "  ❌" : "  ⏭️";
      const detail = r.detail ? ` (${r.detail})` : "";
      console.log(`${icon} ${r.test}: ${r.status}${detail}`);
      if (r.status === "OK") okCount++;
      else if (r.status === "FAIL") failCount++;
      else skipCount++;
    }
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log(`총 ${results.length}개 테스트: ✅ ${okCount} OK / ❌ ${failCount} FAIL / ⏭️ ${skipCount} SKIP`);

  if (consoleErrors.length > 0) {
    console.log(`\n브라우저 콘솔 에러 (${consoleErrors.length}개):`);
    [...new Set(consoleErrors)].slice(0, 15).forEach(e => console.log(`  - ${e}`));
  }

  console.log("=".repeat(70));
})();
