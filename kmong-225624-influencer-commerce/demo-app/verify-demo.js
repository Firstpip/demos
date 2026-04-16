const puppeteer = require("puppeteer");

const BASE = "http://localhost:3456";
const pages = [
  { path: "/", name: "메인" },
  { path: "/products/", name: "상품 목록" },
  { path: "/products/prod-1/", name: "상품 상세" },
  { path: "/influencer/inf-1/", name: "인플루언서 브릿지" },
  { path: "/cart/", name: "장바구니" },
  { path: "/login/", name: "로그인" },
  { path: "/signup/", name: "회원가입" },
  { path: "/mypage/", name: "마이페이지" },
  { path: "/checkout/", name: "결제" },
  { path: "/order-complete/", name: "주문 완료" },
  { path: "/influencer/dashboard/", name: "인플루언서 대시보드" },
  { path: "/influencer/earnings/", name: "인플루언서 수익" },
  { path: "/influencer/links/", name: "인플루언서 링크" },
  { path: "/influencer/products/", name: "인플루언서 상품" },
  { path: "/influencer/settings/", name: "인플루언서 설정" },
  { path: "/vendor/dashboard/", name: "공급사 대시보드" },
  { path: "/vendor/products/", name: "공급사 상품" },
  { path: "/vendor/orders/", name: "공급사 주문" },
  { path: "/vendor/settlements/", name: "공급사 정산" },
  { path: "/vendor/settings/", name: "공급사 설정" },
  { path: "/admin/dashboard/", name: "관리자 대시보드" },
  { path: "/admin/users/", name: "관리자 사용자" },
  { path: "/admin/products/", name: "관리자 상품" },
  { path: "/admin/matching/", name: "관리자 매칭" },
  { path: "/admin/orders/", name: "관리자 주문" },
  { path: "/admin/settlements/", name: "관리자 정산" },
  { path: "/admin/promotions/", name: "관리자 프로모션" },
  { path: "/admin/reports/", name: "관리자 리포트" },
  { path: "/admin/categories/", name: "관리자 카테고리" },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  const errors = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`${msg.text()}`);
  });

  for (const p of pages) {
    try {
      const res = await page.goto(`${BASE}${p.path}`, { waitUntil: "networkidle0", timeout: 15000 });
      const status = res.status();
      if (status !== 200) {
        errors.push(`[${status}] ${p.name} (${p.path})`);
      } else {
        // Check for empty body
        const bodyText = await page.evaluate(() => document.body.innerText.trim());
        if (bodyText.length < 10) {
          errors.push(`[EMPTY] ${p.name} (${p.path})`);
        }
      }
    } catch (e) {
      errors.push(`[ERROR] ${p.name} (${p.path}): ${e.message}`);
    }
  }

  // Responsive check on main page
  for (const vp of [{ w: 768, name: "tablet" }, { w: 375, name: "mobile" }]) {
    await page.setViewport({ width: vp.w, height: 812 });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 15000 });
    const overflow = await page.evaluate(() => {
      return document.body.scrollWidth > document.documentElement.clientWidth;
    });
    if (overflow) errors.push(`[RESPONSIVE] 메인 페이지 가로 스크롤 발생 (${vp.name} ${vp.w}px)`);
  }

  await browser.close();

  console.log("\n=== 검증 결과 ===");
  console.log(`총 페이지: ${pages.length}`);
  console.log(`에러: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach((e) => console.log("  - " + e));
  } else {
    console.log("  모든 페이지 정상 접근 + 반응형 OK");
  }
  if (consoleErrors.length > 0) {
    console.log(`\n콘솔 에러 (${consoleErrors.length}개):`);
    consoleErrors.slice(0, 10).forEach((e) => console.log("  - " + e));
  }
})();
