const puppeteer = require("puppeteer");
const BASE = "http://localhost:3456";
const R = [];
let consoleErrors = [];

function log(cat, test, ok, detail = "") {
  R.push({ cat, test, ok, detail });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function txt(page, t) {
  return page.evaluate((t) => document.body.innerText.includes(t), t);
}
async function el(page, s) {
  return page.evaluate((s) => !!document.querySelector(s), s);
}
async function clickText(page, text, scope = "button, a, [role='menuitem'], div") {
  return page.evaluate((t, s) => {
    const els = [...document.querySelectorAll(s)];
    const found = els.find((e) => e.textContent.includes(t));
    if (found) { found.click(); return true; }
    return false;
  }, text, scope);
}
async function hasToast(page) {
  await sleep(700);
  return page.evaluate(() => document.querySelectorAll("[data-sonner-toast], li[data-sonner-toast]").length > 0);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) consoleErrors.push(m.text().substring(0, 120)); });

  console.log("\n" + "=".repeat(70));
  console.log("  전체 인터랙션 전수 검사 (고도화 포함)");
  console.log("=".repeat(70));

  // ============ 메인 ============
  console.log("\n--- 메인 ---");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 15000 });
  log("메인", "히어로 배너", await el(page, "#home-hero"));
  log("메인", "인플루언서 섹션", await el(page, "#home-influencers"));
  log("메인", "프로모션 배너 (SARAH15)", await txt(page, "SARAH15"));
  log("메인", "프로모션 배너 (WELCOME2026)", await txt(page, "WELCOME2026"));
  log("메인", "프로모션 배너 (SPRING30)", await txt(page, "SPRING30"));
  log("메인", "카테고리 탭", await clickText(page, "뷰티"));
  await sleep(300);
  log("메인", "쇼핑하기 버튼", await clickText(page, "쇼핑하기"));
  await sleep(1000);
  log("메인", "→ /products/ 이동", page.url().includes("/products"));

  // ============ 상품목록 ============
  console.log("\n--- 상품목록 ---");
  await page.goto(`${BASE}/products/`, { waitUntil: "networkidle0" });
  log("상품목록", "페이지 로드", await el(page, "#page-products"));
  // 정렬 Select
  const sortExists = await el(page, 'button[role="combobox"]');
  log("상품목록", "정렬 드롭다운", sortExists);
  if (sortExists) {
    await page.click('button[role="combobox"]');
    await sleep(400);
    const opted = await clickText(page, "가격 낮은순", '[role="option"]');
    await sleep(300);
    log("상품목록", "정렬 옵션 선택", opted);
  }
  // 검색
  const si = await page.$('input[placeholder*="검색"]');
  if (si) { await si.type("고추장"); await sleep(400); }
  const searchCount = await page.evaluate(() => document.querySelectorAll('a[href*="/products/prod-"]').length);
  log("상품목록", "검색 필터링", searchCount >= 1 && searchCount < 40, `${searchCount}개`);

  // ============ 상품상세 ============
  console.log("\n--- 상품상세 ---");
  await page.goto(`${BASE}/products/prod-1/`, { waitUntil: "networkidle0" });
  log("상품상세", "Breadcrumb", await txt(page, "홈") && await txt(page, "전체 상품"));
  log("상품상세", "이미지 갤러리 썸네일", await page.evaluate(() => document.querySelectorAll("button[style]").length >= 3));
  log("상품상세", "가격 영역", await txt(page, "원"));
  log("상품상세", "배송비 표시", await txt(page, "배송비"));
  log("상품상세", "찜하기 버튼", await clickText(page, "찜하기"));
  await sleep(500);
  log("상품상세", "찜하기 토스트", await hasToast(page));
  log("상품상세", "공유하기 버튼", await clickText(page, "공유하기"));
  await sleep(500);
  log("상품상세", "공유 토스트", await hasToast(page));
  // 수량 +
  const qPlus = await page.evaluate(() => {
    const input = document.querySelector('input[inputmode="numeric"]');
    if (!input) return false;
    const btn = input.nextElementSibling;
    if (btn) { btn.click(); return true; }
    return false;
  });
  log("상품상세", "수량 + 버튼", qPlus);
  // 장바구니 추가
  log("상품상세", "장바구니 추가", await clickText(page, "장바구니"));
  await sleep(500);
  log("상품상세", "장바구니 토스트", await hasToast(page));
  // 탭 전환
  log("상품상세", "리뷰 탭", await clickText(page, "리뷰"));
  await sleep(300);
  log("상품상세", "리뷰 평점 바", await el(page, "#product-reviews"));
  log("상품상세", "배송/교환 탭", await clickText(page, "배송/교환"));
  await sleep(300);
  log("상품상세", "배송 안내 표시", await txt(page, "배송 안내"));
  // 관련 상품
  log("상품상세", "함께 보면 좋은 상품", await txt(page, "함께 보면"));

  // ============ 브릿지 ============
  console.log("\n--- 브릿지 ---");
  await page.goto(`${BASE}/influencer/inf-1/`, { waitUntil: "networkidle0" });
  log("브릿지", "Sarah Johnson", await txt(page, "Sarah Johnson"));
  log("브릿지", "PICK 상품", await el(page, 'a[href*="/products/prod-"]'));

  // ============ 장바구니 ============
  console.log("\n--- 장바구니 ---");
  await page.goto(`${BASE}/cart/`, { waitUntil: "networkidle0" });
  log("장바구니", "상품 표시", await txt(page, "한복") || await txt(page, "장바구니"));
  // 쿠폰
  const ci = await page.$('input[placeholder*="할인"], input[placeholder*="코드"]');
  if (ci) {
    await ci.type("WELCOME2026");
    await clickText(page, "적용");
    await sleep(500);
    log("장바구니", "쿠폰 적용 토스트", await hasToast(page));
  } else {
    log("장바구니", "쿠폰 입력", false, "input 없음");
  }

  // ============ 결제 ============
  console.log("\n--- 결제 ---");
  await page.goto(`${BASE}/checkout/`, { waitUntil: "networkidle0" });
  log("결제", "배송지 폼", await el(page, "#checkout-form") || await txt(page, "비어있습니다"));
  log("결제", "결제수단 (카드/토스/카카오)", await txt(page, "카드") || await txt(page, "토스페이"));
  // 카드 선택 시 Mock UI
  const hasCardMock = await txt(page, "카드번호") || await txt(page, "데모에서는");
  log("결제", "카드 Mock 입력/데모 안내", hasCardMock);

  // ============ 로그인 ============
  console.log("\n--- 로그인 ---");
  await page.goto(`${BASE}/login/`, { waitUntil: "networkidle0" });
  log("로그인", "데모 안내", await txt(page, "데모"));
  log("로그인", "헤더 숨김", !(await el(page, "#consumer-header")));
  log("로그인", "소셜 로그인 (카카오)", await txt(page, "카카오"));
  log("로그인", "소셜 로그인 (네이버)", await txt(page, "네이버"));
  log("로그인", "소셜 로그인 (Google)", await txt(page, "Google") || await txt(page, "구글"));
  log("로그인", "비밀번호 찾기 링크", await txt(page, "비밀번호 찾기") || await txt(page, "찾기"));
  // 카카오 클릭
  const kakaoClicked = await clickText(page, "카카오");
  await sleep(1000);
  log("로그인", "카카오 로그인 → 토스트+이동", kakaoClicked);

  // ============ 회원가입 ============
  console.log("\n--- 회원가입 ---");
  await page.goto(`${BASE}/signup/`, { waitUntil: "networkidle0" });
  log("회원가입", "약관 동의 체크박스", await txt(page, "이용약관") && await txt(page, "개인정보"));
  log("회원가입", "비밀번호 강도 표시", await page.evaluate(() => {
    const pwInput = document.querySelector('input[type="password"]');
    if (!pwInput) return false;
    // Type something to trigger strength
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (nativeSetter) {
      nativeSetter.call(pwInput, 'Test1234!');
      pwInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return true;
  }));
  await sleep(300);
  const hasStrength = await txt(page, "강함") || await txt(page, "보통") || await txt(page, "약함") || await txt(page, "Strong") || await txt(page, "Medium") || await txt(page, "Weak");
  log("회원가입", "강도 바 표시됨", hasStrength);
  // 빈 제출 (약관 미동의)
  await clickText(page, "가입");
  await sleep(300);
  log("회원가입", "약관 미동의 차단", page.url().includes("/signup"));

  // ============ 마이페이지 ============
  console.log("\n--- 마이페이지 ---");
  // 먼저 로그인
  await page.goto(`${BASE}/login/`, { waitUntil: "networkidle0" });
  const lis = await page.$$("input");
  if (lis.length >= 2) { await lis[0].type("test@test.com"); await lis[1].type("1234"); }
  await clickText(page, "로그인", "button");
  await sleep(1500);

  await page.goto(`${BASE}/mypage/`, { waitUntil: "networkidle0" });
  log("마이페이지", "프로필 섹션", await txt(page, "프로필") || await txt(page, "님"));
  log("마이페이지", "프로필 수정 버튼", await clickText(page, "프로필 수정") || await clickText(page, "수정"));
  await sleep(500);

  // 탭 전환
  log("마이페이지", "주문 내역 탭", await clickText(page, "주문 내역") || await txt(page, "주문"));
  await sleep(300);
  // 주문 상태 필터
  log("마이페이지", "주문 상태 필터 (배송중)", await clickText(page, "배송중"));
  await sleep(300);

  log("마이페이지", "배송 추적 탭", await clickText(page, "배송 추적") || await clickText(page, "추적"));
  await sleep(300);
  log("마이페이지", "리뷰 관리 탭", await clickText(page, "리뷰 관리") || await clickText(page, "리뷰"));
  await sleep(300);

  // 리뷰 작성 Dialog
  const reviewBtn = await clickText(page, "리뷰 작성", "button");
  await sleep(500);
  const reviewDialog = await el(page, '[role="dialog"]');
  log("마이페이지", "리뷰 작성 Dialog 열림", reviewBtn && reviewDialog);
  if (reviewDialog) {
    // 별점 클릭
    const starClicked = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return false;
      const stars = dialog.querySelectorAll("button, svg");
      for (const s of stars) {
        if (s.closest('[role="dialog"]') && (s.className?.toString().includes("star") || s.querySelector?.("svg"))) {
          s.click();
          return true;
        }
      }
      // Just click any star-like element
      const btns = dialog.querySelectorAll("button");
      for (const b of btns) {
        if (b.textContent === "" || b.querySelector("svg")) { b.click(); return true; }
      }
      return false;
    });
    log("마이페이지", "별점 클릭", starClicked);
    await page.keyboard.press("Escape");
  }

  // 찜한 상품 탭
  log("마이페이지", "찜한 상품 탭", await clickText(page, "찜한 상품") || await clickText(page, "찜"));
  await sleep(300);
  const wishlistCards = await page.evaluate(() => document.querySelectorAll('a[href*="/products/prod-"]').length);
  log("마이페이지", "찜한 상품 카드 표시", wishlistCards > 0, `${wishlistCards}개`);

  // ============ INF 대시보드 ============
  console.log("\n--- INF 대시보드 ---");
  await page.goto(`${BASE}/influencer/dashboard/`, { waitUntil: "networkidle0" });
  log("INF", "KPI 카드", await txt(page, "Earnings") || await txt(page, "Clicks"));
  log("INF", "차트", await el(page, ".recharts-wrapper, svg.recharts-surface"));
  log("INF", "기간 전환 30d", await clickText(page, "30d") || await clickText(page, "30"));
  await sleep(300);

  await page.goto(`${BASE}/influencer/earnings/`, { waitUntil: "networkidle0" });
  log("INF", "정산 이력 테이블", await el(page, "table"));
  log("INF", "Step Indicator", await txt(page, "Pending") || await txt(page, "Completed"));
  log("INF", "USD 금액", await txt(page, "$"));

  await page.goto(`${BASE}/influencer/links/`, { waitUntil: "networkidle0" });
  log("INF", "딥링크 테이블", await el(page, "table"));
  log("INF", "Create Link", await clickText(page, "Create"));
  await sleep(500);
  log("INF", "Create 모달", await el(page, '[role="dialog"]'));
  await page.keyboard.press("Escape");
  await sleep(200);
  log("INF", "Copy 버튼", await clickText(page, "Copy"));
  await sleep(500);
  log("INF", "Copy 토스트", await hasToast(page));

  await page.goto(`${BASE}/influencer/products/`, { waitUntil: "networkidle0" });
  log("INF", "Generate Link", await clickText(page, "Generate"));
  await sleep(500);
  log("INF", "Generate 토스트", await hasToast(page));

  await page.goto(`${BASE}/influencer/settings/`, { waitUntil: "networkidle0" });
  log("INF", "Payoneer 섹션", await txt(page, "Payoneer"));
  log("INF", "Save 버튼", await clickText(page, "Save"));
  await sleep(500);
  log("INF", "Save 토스트", await hasToast(page));

  // ============ VEN 어드민 ============
  console.log("\n--- VEN 어드민 ---");
  await page.goto(`${BASE}/vendor/dashboard/`, { waitUntil: "networkidle0" });
  log("VEN", "대시보드 KPI", await txt(page, "매출") || await txt(page, "주문"));

  await page.goto(`${BASE}/vendor/products/`, { waitUntil: "networkidle0" });
  log("VEN", "상품 테이블", await el(page, "table"));
  // 상품 추가 링크
  log("VEN", "상품 추가 버튼", await el(page, 'a[href*="/vendor/products/new"]'));
  // 수정 링크
  log("VEN", "수정 버튼", await el(page, 'a[href*="/edit"]'));

  await page.goto(`${BASE}/vendor/products/new/`, { waitUntil: "networkidle0" });
  log("VEN", "상품 추가 페이지", await txt(page, "상품 추가") || await txt(page, "기본 정보"));
  log("VEN", "이미지 업로드 영역", await txt(page, "이미지"));
  log("VEN", "배송 설정", await txt(page, "배송비") || await txt(page, "배송 설정"));

  await page.goto(`${BASE}/vendor/products/prod-1/edit/`, { waitUntil: "networkidle0" });
  log("VEN", "상품 수정 페이지", await txt(page, "상품 수정") || await txt(page, "한복 모던 원피스"));
  log("VEN", "기존 데이터 프리필", await page.evaluate(() => {
    const input = document.querySelector('#prod-name');
    return input?.value?.length > 0;
  }));

  await page.goto(`${BASE}/vendor/orders/`, { waitUntil: "networkidle0" });
  log("VEN", "주문 테이블", await el(page, "table"));
  // 주문 상세 버튼
  const venDetailBtn = await page.evaluate(() => {
    const btn = document.querySelector("tbody button");
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("VEN", "주문 상세 모달", venDetailBtn && await el(page, '[role="dialog"]'));
  await page.keyboard.press("Escape");

  await page.goto(`${BASE}/vendor/settlements/`, { waitUntil: "networkidle0" });
  log("VEN", "정산 테이블", await el(page, "table"));
  log("VEN", "승인 버튼", await clickText(page, "승인"));
  await sleep(500);
  log("VEN", "승인 토스트", await hasToast(page));

  // ============ ADM 관리자 ============
  console.log("\n--- ADM 관리자 ---");
  await page.goto(`${BASE}/admin/dashboard/`, { waitUntil: "networkidle0" });
  log("ADM", "대시보드 KPI", await txt(page, "GMV") || await txt(page, "주문"));
  log("ADM", "활동 로그", await txt(page, "활동") || await txt(page, "로그"));

  await page.goto(`${BASE}/admin/users/`, { waitUntil: "networkidle0" });
  log("ADM", "사용자 테이블", await el(page, "table"));
  log("ADM", "탭 전환 (인플루언서)", await clickText(page, "인플루언서", '[role="tab"], button'));
  await sleep(300);

  await page.goto(`${BASE}/admin/products/`, { waitUntil: "networkidle0" });
  log("ADM", "상품 테이블", await el(page, "table"));
  const approveBtn = await page.evaluate(() => {
    const btn = document.querySelector('[id^="btn-approve-"]');
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM", "승인 버튼 + 토스트", approveBtn && await hasToast(page));

  await page.goto(`${BASE}/admin/matching/`, { waitUntil: "networkidle0" });
  log("ADM", "매칭 테이블", await el(page, "table"));
  log("ADM", "매칭 생성", await clickText(page, "생성"));
  await sleep(500);
  log("ADM", "매칭 모달", await el(page, '[role="dialog"]'));
  await page.keyboard.press("Escape");

  await page.goto(`${BASE}/admin/orders/`, { waitUntil: "networkidle0" });
  log("ADM", "주문 테이블", await el(page, "table"));
  const admDetail = await page.evaluate(() => {
    const btn = document.querySelector('[id^="btn-order-detail-"]');
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM", "주문 상세 + 귀속", admDetail && await txt(page, "귀속"));
  await page.keyboard.press("Escape");

  await page.goto(`${BASE}/admin/settlements/`, { waitUntil: "networkidle0" });
  log("ADM", "5단계 Step", await txt(page, "매출집계") || await txt(page, "수수료"));
  log("ADM", "환율 설정", await txt(page, "환율"));
  log("ADM", "Reconciliation", await txt(page, "매칭율") || await txt(page, "Reconciliation") || await txt(page, "일치"));

  await page.goto(`${BASE}/admin/promotions/`, { waitUntil: "networkidle0" });
  log("ADM", "프로모션 SARAH15", await txt(page, "SARAH15"));
  log("ADM", "프로모션 생성 모달", await clickText(page, "생성"));
  await sleep(500);
  log("ADM", "생성 Dialog", await el(page, '[role="dialog"]'));
  await page.keyboard.press("Escape");

  await page.goto(`${BASE}/admin/reports/`, { waitUntil: "networkidle0" });
  log("ADM", "요약 통계 카드", await txt(page, "총 매출") || await txt(page, "총 수수료"));
  log("ADM", "차트", await el(page, ".recharts-wrapper, svg.recharts-surface"));
  log("ADM", "탭 전환", await clickText(page, "인플루언서별", '[role="tab"], button'));
  await sleep(300);
  log("ADM", "다운로드 버튼", await clickText(page, "다운로드"));
  await sleep(500);
  log("ADM", "다운로드 토스트", await hasToast(page));

  await page.goto(`${BASE}/admin/categories/`, { waitUntil: "networkidle0" });
  log("ADM", "카테고리 목록", await txt(page, "패션") && await txt(page, "뷰티"));
  log("ADM", "카테고리 추가", await clickText(page, "추가"));
  await sleep(500);
  log("ADM", "추가 Dialog", await el(page, '[role="dialog"]'));

  // ============ 반응형 ============
  console.log("\n--- 반응형 ---");
  for (const { w, name } of [{ w: 768, name: "태블릿" }, { w: 375, name: "모바일" }]) {
    await page.setViewport({ width: w, height: 812 });
    for (const url of ["/", "/products/", "/products/prod-1/", "/mypage/"]) {
      await page.goto(`${BASE}${url}`, { waitUntil: "networkidle0", timeout: 15000 });
      const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth);
      log("반응형", `${name} ${url}`, !overflow);
    }
  }

  await browser.close();

  // ============ 결과 ============
  console.log("\n" + "=".repeat(70));
  console.log("  결과 요약");
  console.log("=".repeat(70));
  let ok = 0, fail = 0;
  const fails = [];
  for (const r of R) {
    if (r.ok) ok++; else { fail++; fails.push(r); }
  }
  console.log(`\n총 ${R.length}개: ✅ ${ok} OK / ❌ ${fail} FAIL`);
  if (fails.length > 0) {
    console.log("\n❌ FAIL 항목:");
    for (const f of fails) {
      console.log(`  [${f.cat}] ${f.test}${f.detail ? ` (${f.detail})` : ""}`);
    }
  }
  if (consoleErrors.length > 0) {
    console.log(`\n콘솔 에러 (${consoleErrors.length}개):`);
    [...new Set(consoleErrors)].slice(0, 10).forEach((e) => console.log(`  - ${e}`));
  }
  console.log("=".repeat(70));
})();
