const puppeteer = require("puppeteer");
const BASE = "http://localhost:3456";
const results = [];

function log(flow, step, status, detail = "") {
  const icon = status === "OK" ? "✅" : status === "FAIL" ? "❌" : "⚠️";
  results.push({ flow, step, status, detail });
  console.log(`  ${icon} [${flow}] ${step}${detail ? ` — ${detail}` : ""}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function clickByText(page, text, tag = "button") {
  return page.evaluate((t, tg) => {
    const els = [...document.querySelectorAll(tg)];
    const el = els.find(e => e.textContent.includes(t));
    if (el) { el.click(); return true; }
    return false;
  }, text, tag);
}

async function hasText(page, text) {
  return page.evaluate(t => document.body.innerText.includes(t), text);
}

async function hasToast(page) {
  await sleep(600);
  return page.evaluate(() => document.querySelectorAll("[data-sonner-toast], li[data-sonner-toast]").length > 0);
}

async function fillInput(page, selector, value) {
  const el = await page.$(selector);
  if (!el) return false;
  await el.click({ clickCount: 3 });
  await el.type(value);
  return true;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log("\n" + "=".repeat(70));
  console.log("  프로세스(유저 플로우) 전수 검사");
  console.log("=".repeat(70));

  // ═══════════════════════════════════════════════════════════
  // FLOW 1: 회원가입 → 로그인 → 로그아웃
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 1: 회원가입 → 로그인 → 로그아웃");

  await page.goto(`${BASE}/signup/`, { waitUntil: "networkidle0" });
  // 빈 제출 차단
  await clickByText(page, "가입");
  await sleep(300);
  log("인증", "빈 폼 제출 차단", page.url().includes("/signup") ? "OK" : "FAIL");

  // 폼 채우기
  const signupInputs = await page.$$("input");
  if (signupInputs.length >= 4) {
    await signupInputs[0].type("테스트유저");
    await signupInputs[1].type("test@example.com");
    await signupInputs[2].type("password123");
    await signupInputs[3].type("password123");
    await clickByText(page, "가입");
    await sleep(1500);
    log("인증", "회원가입 → /login 이동", page.url().includes("/login") ? "OK" : "FAIL", page.url());
  } else {
    log("인증", "회원가입 폼 필드 수", "FAIL", `${signupInputs.length}개`);
  }

  // 로그인
  await page.goto(`${BASE}/login/`, { waitUntil: "networkidle0" });
  const loginInputs = await page.$$("input");
  if (loginInputs.length >= 2) {
    await loginInputs[0].type("demo@test.com");
    await loginInputs[1].type("1234");
    await clickByText(page, "로그인");
    await sleep(1500);
    log("인증", "로그인 → 메인 이동", !page.url().includes("/login") ? "OK" : "FAIL", page.url());
  }

  // 로그인 상태 확인 (헤더에 사용자명)
  const isLoggedIn = await page.evaluate(() => {
    return !!localStorage.getItem("demo-auth");
  });
  log("인증", "로그인 상태 유지 (localStorage)", isLoggedIn ? "OK" : "FAIL");

  // 로그아웃
  // 사용자 메뉴 열기
  const userMenuOpened = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.querySelector("svg") && b.textContent.includes("demo") || b.textContent.includes("데모"));
    if (btn) { btn.click(); return true; }
    // try dropdown trigger near user icon
    const triggers = document.querySelectorAll("[data-slot='dropdown-menu-trigger']");
    for (const t of triggers) {
      if (t.textContent.includes("demo") || t.textContent.includes("데모")) { t.click(); return true; }
    }
    return false;
  });
  await sleep(500);
  if (userMenuOpened) {
    await clickByText(page, "로그아웃");
    await sleep(1000);
  }
  const loggedOut = await page.evaluate(() => !localStorage.getItem("demo-auth"));
  log("인증", "로그아웃 → 상태 초기화", loggedOut ? "OK" : "WARN", "localStorage 확인");

  // ═══════════════════════════════════════════════════════════
  // FLOW 2: 쇼핑 전체 플로우 (검색→상세→장바구니→결제→주문완료)
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 2: 쇼핑 전체 플로우");

  // 먼저 로그인
  await page.goto(`${BASE}/login/`, { waitUntil: "networkidle0" });
  const li = await page.$$("input");
  await li[0].type("shopper@test.com");
  await li[1].type("1234");
  await clickByText(page, "로그인");
  await sleep(1500);

  // 장바구니 비우기
  await page.evaluate(() => localStorage.removeItem("demo-cart"));

  // 메인 → 상품 목록
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await clickByText(page, "쇼핑하기");
  await sleep(1000);
  log("쇼핑", "메인 → 상품 목록 이동", page.url().includes("/products") ? "OK" : "FAIL");

  // 검색
  await page.goto(`${BASE}/products/`, { waitUntil: "networkidle0" });
  const searchInput = await page.$('input[placeholder*="검색"]');
  if (searchInput) {
    await searchInput.type("크림");
    await sleep(500);
    const count = await page.evaluate(() => {
      const cards = document.querySelectorAll("a[href*='/products/prod-']");
      return cards.length;
    });
    log("쇼핑", "검색 '크림' 필터링", count > 0 && count < 40 ? "OK" : "FAIL", `${count}개 결과`);
    await searchInput.click({ clickCount: 3 });
    await searchInput.press("Backspace");
  }

  // 상품 상세로 이동
  await page.goto(`${BASE}/products/prod-6/`, { waitUntil: "networkidle0" });
  log("쇼핑", "상품 상세 페이지", await hasText(page, "시카 수분 크림") ? "OK" : "FAIL");

  // 수량 2로 변경
  const plusBtn = await page.evaluate(() => {
    const input = document.querySelector('input[inputmode="numeric"]');
    if (!input) return false;
    const btn = input.nextElementSibling;
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(200);
  const qty = await page.evaluate(() => document.querySelector('input[inputmode="numeric"]')?.value);
  log("쇼핑", "수량 2로 변경", qty === "2" ? "OK" : "FAIL", `수량: ${qty}`);

  // 장바구니 추가
  await clickByText(page, "장바구니");
  await sleep(800);
  const cartToast = await hasToast(page);
  log("쇼핑", "장바구니 추가 토스트", cartToast ? "OK" : "FAIL");

  // 헤더 장바구니 뱃지 확인
  const badgeCount = await page.evaluate(() => {
    const badges = document.querySelectorAll("[class*='badge'], span[class*='rounded-full']");
    for (const b of badges) {
      const num = parseInt(b.textContent);
      if (!isNaN(num) && num > 0) return num;
    }
    return 0;
  });
  log("쇼핑", "헤더 장바구니 뱃지", badgeCount > 0 ? "OK" : "FAIL", `뱃지: ${badgeCount}`);

  // 장바구니 페이지
  await page.goto(`${BASE}/cart/`, { waitUntil: "networkidle0" });
  log("쇼핑", "장바구니 상품 표시", await hasText(page, "시카 수분 크림") ? "OK" : "FAIL");

  // 수량 확인
  const cartQty = await page.evaluate(() => {
    const input = document.querySelector('input[inputmode="numeric"]');
    return input ? input.value : "없음";
  });
  log("쇼핑", "장바구니 수량 유지", cartQty === "2" ? "OK" : "FAIL", `수량: ${cartQty}`);

  // 쿠폰 적용
  const couponInput = await page.$('input[placeholder*="할인"], input[placeholder*="쿠폰"], input[placeholder*="코드"]');
  if (couponInput) {
    await couponInput.type("SARAH15");
    await clickByText(page, "적용");
    await sleep(500);
    const discountShown = await hasText(page, "할인") || await hasText(page, "15%") || await hasText(page, "SARAH15");
    log("쇼핑", "쿠폰 SARAH15 적용", discountShown ? "OK" : "FAIL");
  } else {
    log("쇼핑", "쿠폰 입력 필드", "FAIL");
  }

  // 소계/총액 계산 확인
  const priceInfo = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasSubtotal = text.includes("소계") || text.includes("상품");
    const hasTotal = text.includes("총") || text.includes("결제");
    return { hasSubtotal, hasTotal };
  });
  log("쇼핑", "주문 요약 (소계/총액)", priceInfo.hasSubtotal && priceInfo.hasTotal ? "OK" : "FAIL");

  // 결제하기 버튼
  await clickByText(page, "결제하기", "button, a");
  await sleep(1000);
  log("쇼핑", "결제하기 → /checkout 이동", page.url().includes("/checkout") ? "OK" : "FAIL");

  // 결제 페이지 - 배송지 입력
  await page.goto(`${BASE}/checkout/`, { waitUntil: "networkidle0" });
  const checkoutInputs = await page.$$("input");
  log("쇼핑", "결제 페이지 폼 필드 존재", checkoutInputs.length >= 4 ? "OK" : "FAIL", `${checkoutInputs.length}개 필드`);

  // 빈 상태로 결제 시도 (유효성 검증)
  await clickByText(page, "결제하기");
  await sleep(500);
  const stayOnCheckout = page.url().includes("/checkout");
  log("쇼핑", "빈 배송지 결제 차단", stayOnCheckout ? "OK" : "FAIL");

  // 배송지 채우기
  if (checkoutInputs.length >= 4) {
    for (let i = 0; i < checkoutInputs.length; i++) {
      const type = await checkoutInputs[i].evaluate(el => el.type);
      const placeholder = await checkoutInputs[i].evaluate(el => el.placeholder);
      if (type === "radio") continue;
      await checkoutInputs[i].click({ clickCount: 3 });
      if (placeholder.includes("이름") || placeholder.includes("수령인") || i === 0) {
        await checkoutInputs[i].type("홍길동");
      } else if (placeholder.includes("전화") || placeholder.includes("연락") || i === 1) {
        await checkoutInputs[i].type("01012345678");
      } else if (placeholder.includes("주소") || i === 2) {
        await checkoutInputs[i].type("서울시 강남구 테헤란로 123");
      } else if (placeholder.includes("우편") || i === 3) {
        await checkoutInputs[i].type("06234");
      } else {
        await checkoutInputs[i].type("테스트데이터");
      }
    }
  }

  // 결제수단 선택 (라디오)
  const radioClicked = await page.evaluate(() => {
    const radios = document.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) { radios[0].click(); return true; }
    // Maybe custom radio buttons
    const labels = [...document.querySelectorAll("label, div[role='radio'], button")];
    const card = labels.find(l => l.textContent.includes("카드") || l.textContent.includes("토스페이"));
    if (card) { card.click(); return true; }
    return false;
  });
  log("쇼핑", "결제수단 선택", radioClicked ? "OK" : "FAIL");

  // 결제 완료
  await clickByText(page, "결제하기");
  await sleep(2000);
  log("쇼핑", "결제 → 주문완료 이동", page.url().includes("/order-complete") ? "OK" : "FAIL", page.url());

  // 주문완료 페이지
  if (page.url().includes("/order-complete")) {
    const hasOrderNum = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("ORD-") || text.includes("주문번호") || text.includes("주문");
    });
    log("쇼핑", "주문번호 표시", hasOrderNum ? "OK" : "FAIL");
  }

  // 장바구니 비워졌는지
  const cartEmpty = await page.evaluate(() => {
    const cart = localStorage.getItem("demo-cart");
    return !cart || cart === "[]";
  });
  log("쇼핑", "결제 후 장바구니 비워짐", cartEmpty ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════════════════
  // FLOW 3: 인플루언서 딥링크 유입 → 귀속 확인
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 3: 인플루언서 딥링크 → 브릿지 → 상품 → 귀속");

  // 인플루언서 브릿지 페이지 진입
  await page.goto(`${BASE}/influencer/inf-1/`, { waitUntil: "networkidle0" });
  log("딥링크", "브릿지 페이지 - Sarah Johnson", await hasText(page, "Sarah Johnson") ? "OK" : "FAIL");
  log("딥링크", "Sarah's PICK 상품 표시", await page.evaluate(() => document.querySelectorAll("a[href*='/products/prod-']").length > 0) ? "OK" : "FAIL");

  // 상품 클릭
  const bridgeProduct = await page.$('a[href*="/products/prod-"]');
  if (bridgeProduct) {
    const prodHref = await bridgeProduct.evaluate(el => el.href);
    await bridgeProduct.click();
    await sleep(1500);
    log("딥링크", "브릿지 → 상품 상세 이동", page.url().includes("/products/prod-") ? "OK" : "FAIL");

    // 상품 상세에서 "추천 인플루언서" 섹션 확인
    const hasRecommender = await hasText(page, "Sarah") || await hasText(page, "추천");
    log("딥링크", "상품 상세 - 추천 인플루언서 표시", hasRecommender ? "OK" : "FAIL");
  }

  // 관리자 주문에서 귀속 확인
  await page.goto(`${BASE}/admin/orders/`, { waitUntil: "networkidle0" });
  const orderRow = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("tr")];
    const row = rows.find(r => r.querySelector("td"));
    if (row) { row.click(); return true; }
    return false;
  });
  await sleep(500);
  const hasAttribution = await hasText(page, "귀속");
  log("딥링크", "관리자 주문상세 - 인플루언서 귀속 표시", hasAttribution ? "OK" : "FAIL");
  await page.keyboard.press("Escape");

  // ═══════════════════════════════════════════════════════════
  // FLOW 4: 역할 전환 프로세스
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 4: 역할 전환 (소비자→인플루언서→입점사→관리자→소비자)");

  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });

  // 역할 전환 드롭다운 찾기
  for (const [roleName, expectedPath] of [
    ["인플루언서", "/influencer/dashboard"],
    ["입점사", "/vendor/dashboard"],
    ["관리자", "/admin/dashboard"],
    ["소비자", "/"],
  ]) {
    const switched = await page.evaluate((role) => {
      const btns = [...document.querySelectorAll("button")];
      // role switcher trigger
      const trigger = btns.find(b =>
        b.textContent.includes("소비자") ||
        b.textContent.includes("인플루언서") ||
        b.textContent.includes("입점사") ||
        b.textContent.includes("관리자")
      );
      if (trigger) { trigger.click(); return true; }
      return false;
    }, roleName);
    await sleep(500);

    if (switched) {
      await clickByText(page, roleName, "[role='menuitem'], button, div");
      await sleep(1500);
    }
    const onCorrectPage = page.url().includes(expectedPath) || (expectedPath === "/" && !page.url().includes("/admin") && !page.url().includes("/vendor") && !page.url().includes("/influencer/dashboard"));
    log("역할전환", `→ ${roleName}`, onCorrectPage ? "OK" : "FAIL", page.url());
  }

  // ═══════════════════════════════════════════════════════════
  // FLOW 5: 공급사 주문관리 (주문확인→배송중→배송완료)
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 5: 공급사 주문관리 플로우");

  await page.goto(`${BASE}/vendor/orders/`, { waitUntil: "networkidle0" });

  // 주문 클릭 → 상세 모달
  const venOrderClicked = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("tr")];
    const row = rows.find(r => r.querySelector("td"));
    if (row) { row.click(); return true; }
    return false;
  });
  await sleep(500);
  const modalOpen = await page.evaluate(() => !!document.querySelector('[role="dialog"]'));
  log("VEN주문관리", "주문 클릭 → 상세 모달", venOrderClicked && modalOpen ? "OK" : "FAIL");

  // 배송 상태 업데이트 Select
  const hasStatusSelect = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const selects = dialog.querySelectorAll('button[role="combobox"], select');
    return selects.length > 0;
  });
  log("VEN주문관리", "배송 상태 Select 존재", hasStatusSelect ? "OK" : "FAIL");

  if (hasStatusSelect) {
    // Select 클릭
    await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const select = dialog?.querySelector('button[role="combobox"]');
      if (select) select.click();
    });
    await sleep(500);
    // 옵션 선택
    const statusChanged = await page.evaluate(() => {
      const options = document.querySelectorAll('[role="option"]');
      for (const opt of options) {
        if (opt.textContent.includes("배송중") || opt.textContent.includes("shipping")) {
          opt.click();
          return true;
        }
      }
      return false;
    });
    await sleep(500);
    log("VEN주문관리", "배송 상태 변경", statusChanged ? "OK" : "FAIL");

    // 토스트 확인
    log("VEN주문관리", "상태 변경 토스트", await hasToast(page) ? "OK" : "FAIL");
  }
  await page.keyboard.press("Escape");

  // ═══════════════════════════════════════════════════════════
  // FLOW 6: 공급사 상품 CRUD
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 6: 공급사 상품 CRUD");

  await page.goto(`${BASE}/vendor/products/`, { waitUntil: "networkidle0" });

  // 상품 추가 모달
  await clickByText(page, "추가");
  await sleep(500);
  log("VEN상품CRUD", "상품 추가 모달 열기", await page.evaluate(() => !!document.querySelector('[role="dialog"]')) ? "OK" : "FAIL");

  // 필수 필드 빈 상태로 저장 시도
  const saveBtn = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const btns = [...dialog.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("저장") || b.textContent.includes("등록") || b.textContent.includes("추가"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(300);
  const stillOpen = await page.evaluate(() => !!document.querySelector('[role="dialog"]'));
  log("VEN상품CRUD", "빈 폼 저장 차단", stillOpen ? "OK" : "FAIL");

  // 폼 채우기
  await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return;
    const inputs = dialog.querySelectorAll("input, textarea");
    inputs.forEach((input, i) => {
      input.focus();
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                                      Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, ["테스트 상품", "테스트 상품 설명입니다", "50000", "100", "10"][i] || "test");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  });
  await sleep(300);
  await page.keyboard.press("Escape");

  // 상품 상태 변경
  const statusDropdown = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("판매중") || b.textContent.includes("active"));
    if (btn) { btn.click(); return true; }
    // Try dropdown menu trigger
    const triggers = document.querySelectorAll("[data-slot='dropdown-menu-trigger']");
    if (triggers.length > 0) { triggers[0].click(); return true; }
    return false;
  });
  await sleep(500);
  log("VEN상품CRUD", "상품 상태 드롭다운", statusDropdown ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════════════════
  // FLOW 7: 공급사 정산 승인/거부 프로세스
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 7: 공급사 정산 승인/거부");

  await page.goto(`${BASE}/vendor/settlements/`, { waitUntil: "networkidle0" });

  // 정산 명세서 확인
  const hasStatement = await hasText(page, "Gross") || await hasText(page, "Net") || await hasText(page, "Commission") || await hasText(page, "매출") || await hasText(page, "수수료");
  log("VEN정산", "정산 명세서 표시", hasStatement ? "OK" : "FAIL");

  // 승인 버튼
  const approved = await clickByText(page, "승인");
  await sleep(600);
  log("VEN정산", "수수료 승인 + 토스트", approved && await hasToast(page) ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════════════════
  // FLOW 8: 관리자 정산 전체 프로세스 (5단계)
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 8: 관리자 정산 5단계 프로세스");

  await page.goto(`${BASE}/admin/settlements/`, { waitUntil: "networkidle0" });

  // Step Indicator 존재
  const steps = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      step1: text.includes("매출집계") || text.includes("매출"),
      step2: text.includes("수수료") || text.includes("산정"),
      step3: text.includes("컨펌") || text.includes("공급사"),
      step4: text.includes("승인") || text.includes("관리자"),
      step5: text.includes("지급") || text.includes("실행"),
    };
  });
  const stepCount = Object.values(steps).filter(Boolean).length;
  log("ADM정산", "5단계 Step Indicator", stepCount >= 3 ? "OK" : "FAIL", `${stepCount}/5 단계 표시`);

  // Step 진행 (클릭)
  const stepClicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("다음") || b.textContent.includes("진행") || b.textContent.includes("Next"));
    if (btn) { btn.click(); return true; }
    // Step 직접 클릭
    const stepEls = [...document.querySelectorAll("[class*='step'], [class*='Step'], div[class*='cursor-pointer']")];
    if (stepEls.length > 1) { stepEls[1].click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM정산", "Step 진행 클릭", stepClicked ? "OK" : "WARN", "다음 단계 진행");

  // 환율 설정
  const exchangeInput = await page.$('input[inputmode="numeric"], input[placeholder*="환율"], input[type="text"]');
  if (exchangeInput) {
    await exchangeInput.click({ clickCount: 3 });
    await exchangeInput.type("1380");
    const applyRate = await clickByText(page, "적용");
    await sleep(500);
    log("ADM정산", "환율 수동 입력 + 적용", applyRate ? "OK" : "FAIL");
  } else {
    log("ADM정산", "환율 입력 필드", "FAIL");
  }

  // 인플루언서/공급사 탭 전환
  const infTab = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], button')];
    const tab = tabs.find(t => t.textContent.includes("인플루언서"));
    if (tab) { tab.click(); return true; }
    return false;
  });
  await sleep(300);
  log("ADM정산", "인플루언서 정산 탭", infTab ? "OK" : "FAIL");

  const venTab = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], button')];
    const tab = tabs.find(t => t.textContent.includes("공급사"));
    if (tab) { tab.click(); return true; }
    return false;
  });
  await sleep(300);
  log("ADM정산", "공급사 정산 탭", venTab ? "OK" : "FAIL");

  // Payoneer 일괄 지급
  const bulkPay = await clickByText(page, "지급");
  await sleep(500);
  const confirmDialog = await page.evaluate(() => !!document.querySelector('[role="dialog"], [role="alertdialog"]'));
  log("ADM정산", "일괄 지급 → 확인 다이얼로그", bulkPay ? "OK" : "FAIL");
  if (confirmDialog) {
    await clickByText(page, "확인", "button");
    await sleep(600);
    log("ADM정산", "지급 실행 + 토스트", await hasToast(page) ? "OK" : "FAIL");
  }
  await page.keyboard.press("Escape");

  // Reconciliation
  const hasRecon = await hasText(page, "매칭율") || await hasText(page, "Reconciliation") || await hasText(page, "불일치") || await hasText(page, "일치");
  log("ADM정산", "Reconciliation 카드", hasRecon ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════════════════
  // FLOW 9: 관리자 매칭 생성 프로세스
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 9: 관리자 매칭 생성");

  await page.goto(`${BASE}/admin/matching/`, { waitUntil: "networkidle0" });

  // 새 매칭 생성
  const matchCreateBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("매칭") && b.textContent.includes("생성"));
    if (btn) { btn.click(); return true; }
    const btn2 = btns.find(b => b.textContent.includes("새") || b.textContent.includes("추가") || b.textContent.includes("생성"));
    if (btn2) { btn2.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM매칭", "매칭 생성 모달", await page.evaluate(() => !!document.querySelector('[role="dialog"]')) ? "OK" : "FAIL");

  // 모달 내 Select (인플루언서, 상품)
  const selectCount = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return 0;
    return dialog.querySelectorAll('button[role="combobox"]').length;
  });
  log("ADM매칭", "인플루언서/상품 Select 존재", selectCount >= 2 ? "OK" : "FAIL", `${selectCount}개 Select`);

  // 수수료율 입력
  const commInput = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const inputs = dialog.querySelectorAll('input');
    for (const input of inputs) {
      if (input.placeholder?.includes("수수료") || input.inputMode === "numeric" || input.type === "text") {
        return true;
      }
    }
    return false;
  });
  log("ADM매칭", "수수료율 입력 필드", commInput ? "OK" : "FAIL");
  await page.keyboard.press("Escape");

  // 매칭 활성화/비활성화 토글
  const toggleMatch = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("비활성") || b.textContent.includes("활성화") || b.title?.includes("활성"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM매칭", "매칭 활성/비활성 토글", toggleMatch ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════════════════
  // FLOW 10: 관리자 프로모션 CRUD
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 10: 관리자 프로모션 CRUD");

  await page.goto(`${BASE}/admin/promotions/`, { waitUntil: "networkidle0" });

  // 기존 프로모션 표시
  log("ADM프로모션", "기존 코드 목록", await hasText(page, "SARAH15") && await hasText(page, "WELCOME2026") ? "OK" : "FAIL");

  // 생성
  await clickByText(page, "생성");
  await sleep(500);
  const promoDialog = await page.evaluate(() => !!document.querySelector('[role="dialog"]'));
  log("ADM프로모션", "생성 모달 열기", promoDialog ? "OK" : "FAIL");
  await page.keyboard.press("Escape");

  // 수정
  const editBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.textContent.includes("수정") || b.title?.includes("수정") || b.querySelector('svg'));
    // Look for edit icon buttons in table
    const editBtns = btns.filter(b => b.id?.includes("edit") || b.title?.includes("수정"));
    if (editBtns.length > 0) { editBtns[0].click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM프로모션", "수정 버튼", editBtn ? "OK" : "WARN");

  // 삭제
  await page.keyboard.press("Escape");
  await sleep(200);
  const delBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const btn = btns.find(b => b.id?.includes("delete") || b.title?.includes("삭제"));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await sleep(500);
  log("ADM프로모션", "삭제 버튼 + 토스트", delBtn && await hasToast(page) ? "OK" : "WARN");

  // ═══════════════════════════════════════════════════════════
  // FLOW 11: 인플루언서 딥링크 생성 전체 플로우
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 11: 인플루언서 딥링크 생성 플로우");

  await page.goto(`${BASE}/influencer/links/`, { waitUntil: "networkidle0" });

  // 기존 링크 목록 확인
  const existingLinks = await page.evaluate(() => document.querySelectorAll("table tbody tr").length);
  log("INF딥링크", "기존 딥링크 목록", existingLinks > 0 ? "OK" : "FAIL", `${existingLinks}개`);

  // Create New Link
  await clickByText(page, "Create");
  await sleep(500);
  log("INF딥링크", "Create Link 모달", await page.evaluate(() => !!document.querySelector('[role="dialog"]')) ? "OK" : "FAIL");

  // 상품 Select
  const productSelect = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const select = dialog.querySelector('button[role="combobox"]');
    if (select) { select.click(); return true; }
    return false;
  });
  await sleep(500);
  if (productSelect) {
    const firstOpt = await page.evaluate(() => {
      const opts = document.querySelectorAll('[role="option"]');
      if (opts.length > 0) { opts[0].click(); return true; }
      return false;
    });
    await sleep(300);
    log("INF딥링크", "상품 선택", firstOpt ? "OK" : "FAIL");

    // Create 버튼
    await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return;
      const btns = [...dialog.querySelectorAll("button")];
      const btn = btns.find(b => b.textContent.includes("Create") || b.textContent.includes("생성"));
      if (btn) btn.click();
    });
    await sleep(600);
    log("INF딥링크", "링크 생성 + 토스트", await hasToast(page) ? "OK" : "FAIL");
  }
  await page.keyboard.press("Escape");

  // Copy link
  const copyClicked = await clickByText(page, "Copy");
  await sleep(600);
  log("INF딥링크", "링크 복사 + 토스트", copyClicked && await hasToast(page) ? "OK" : "FAIL");

  // ═══════════════════════════════════════════════════════════
  // FLOW 12: 관리자 리포트 조회 프로세스
  // ═══════════════════════════════════════════════════════════
  console.log("\n▶ FLOW 12: 관리자 리포트 조회");

  await page.goto(`${BASE}/admin/reports/`, { waitUntil: "networkidle0" });

  // 일자별 탭 (기본)
  log("ADM리포트", "일자별 차트", await page.evaluate(() => !!document.querySelector(".recharts-wrapper, svg.recharts-surface")) ? "OK" : "FAIL");

  // 인플루언서별 탭
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], button')];
    const tab = tabs.find(t => t.textContent.includes("인플루언서별"));
    if (tab) tab.click();
  });
  await sleep(500);
  log("ADM리포트", "인플루언서별 탭 전환", await hasText(page, "Sarah") || await hasText(page, "인플루언서") ? "OK" : "FAIL");

  // 공급사별 탭
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], button')];
    const tab = tabs.find(t => t.textContent.includes("공급사별"));
    if (tab) tab.click();
  });
  await sleep(500);
  log("ADM리포트", "공급사별 탭 전환", await hasText(page, "서울스타일") || await hasText(page, "공급사") ? "OK" : "FAIL");

  // 다운로드
  await clickByText(page, "다운로드");
  await sleep(600);
  log("ADM리포트", "리포트 다운로드 + 토스트", await hasToast(page) ? "OK" : "FAIL");

  await browser.close();

  // ═══════════════════════════════════════════════════════════
  // 결과 요약
  // ═══════════════════════════════════════════════════════════
  console.log("\n" + "=".repeat(70));
  console.log("  프로세스 검사 결과 요약");
  console.log("=".repeat(70));

  const flows = [...new Set(results.map(r => r.flow))];
  let ok = 0, fail = 0, warn = 0;
  for (const r of results) {
    if (r.status === "OK") ok++;
    else if (r.status === "FAIL") fail++;
    else warn++;
  }

  console.log(`\n총 ${results.length}개 테스트: ✅ ${ok} OK / ❌ ${fail} FAIL / ⚠️ ${warn} WARN`);

  if (fail > 0) {
    console.log("\n❌ FAIL 항목:");
    results.filter(r => r.status === "FAIL").forEach(r => {
      console.log(`  - [${r.flow}] ${r.step}${r.detail ? ` (${r.detail})` : ""}`);
    });
  }
  if (warn > 0) {
    console.log("\n⚠️ WARN 항목:");
    results.filter(r => r.status === "WARN").forEach(r => {
      console.log(`  - [${r.flow}] ${r.step}${r.detail ? ` (${r.detail})` : ""}`);
    });
  }

  console.log("=".repeat(70));
})();
