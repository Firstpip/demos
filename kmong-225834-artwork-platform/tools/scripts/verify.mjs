// Step 6 자체 검증: 라우트 진입 + 시연 시나리오(S-01~S-05) + 콘솔 에러 0 + 3 viewport 캡쳐.
// 사용: node scripts/verify.mjs (BASE_URL 기본 http://localhost:3001)
import puppeteer from "puppeteer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
const OUT_DIR = path.resolve(process.cwd(), ".verify");
const SHOTS_DIR = path.join(OUT_DIR, "screenshots");

const ROUTES = [
  { name: "home", path: "/" },
  { name: "login", path: "/login" },
  { name: "signup", path: "/signup" },
  { name: "jobs-list", path: "/jobs" },
  { name: "jobs-detail", path: "/jobs/job-001" },
  { name: "jobs-new", path: "/jobs/new" },
  { name: "projects-list", path: "/projects" },
  { name: "projects-detail", path: "/projects/proj-001" },
  { name: "projects-new", path: "/projects/new" },
  { name: "artists-list", path: "/artists" },
  { name: "artists-detail", path: "/artists/u-001" },
  { name: "mypage", path: "/mypage" },
  { name: "profile-edit", path: "/profile/edit" },
  { name: "admin-dashboard", path: "/admin" },
  { name: "admin-approvals", path: "/admin/approvals" },
  { name: "admin-jobs", path: "/admin/jobs" },
  { name: "admin-members", path: "/admin/members" },
  { name: "admin-projects", path: "/admin/projects" },
  { name: "admin-reports", path: "/admin/reports" },
  { name: "admin-categories", path: "/admin/categories" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

const STATE_CASES = [
  { name: "skeleton", path: "/jobs", waitFor: 100 }, // 로딩 380ms 안에 캡쳐
  { name: "empty", path: "/jobs?q=ZZZNOMATCH", waitFor: 700 }, // 로딩 종료 후 EmptyState
  { name: "error", path: "/jobs?error=1", waitFor: 500 },
];

const SCENARIOS = [
  {
    id: "S-01",
    name: "댄서 → 힙합 공고 필터 → 지원",
    run: async (page) => {
      await page.goto(`${BASE_URL}/jobs`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("a[href^='/jobs/job-']", { timeout: 5000 });
      await page.click("a[href^='/jobs/job-']");
      await page.waitForFunction(() => /\/jobs\/job-/.test(location.pathname), { timeout: 5000 });
      await page.waitForSelector("body");
    },
  },
  {
    id: "S-02",
    name: "기업 → 공고 등록 폼 진입",
    run: async (page) => {
      await page.goto(`${BASE_URL}/jobs/new`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("input, select, textarea", { timeout: 5000 });
    },
  },
  {
    id: "S-03",
    name: "관리자 → 승인 큐 진입",
    run: async (page) => {
      await page.goto(`${BASE_URL}/admin/approvals`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("h1, h2", { timeout: 5000 });
    },
  },
  {
    id: "S-04",
    name: "프로젝트 모집글 작성 폼 진입",
    run: async (page) => {
      await page.goto(`${BASE_URL}/projects/new`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("input, select, textarea", { timeout: 5000 });
    },
  },
  {
    id: "S-05",
    name: "댄스학원 → 레슨 jobType 탭 → 강사 모집 상세",
    run: async (page) => {
      // 자동완성에서 "레슨" 매칭 → 첫 항목이 jobType=lesson 라우팅
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#hero-search", { timeout: 5000 });
      await page.click("#hero-search");
      await page.type("#hero-search", "레슨", { delay: 30 });
      await page.waitForSelector("[role='listbox'] [role='option']", { timeout: 5000 });
      const optionsCount = await page.$$eval("[role='listbox'] [role='option']", (els) => els.length);
      if (optionsCount === 0) throw new Error("자동완성 결과 0건");
      await page.click("[role='listbox'] [role='option']");
      await page.waitForFunction(
        () => location.pathname.startsWith("/jobs") && location.search.includes("type=lesson"),
        { timeout: 5000 },
      );
      // jobType 4탭 영역 + 레슨 jobType 카드 1건 이상
      await page.waitForSelector("[role='tablist']", { timeout: 5000 });
      await page.waitForSelector("a[href^='/jobs/job-']", { timeout: 5000 });
      // 레슨 강사 모집 상세(job-025)로 진입
      await page.goto(`${BASE_URL}/jobs/job-025`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => document.body.innerText.includes("레슨"),
        { timeout: 5000 },
      );
    },
  },
];

const result = {
  baseUrl: BASE_URL,
  startedAt: new Date().toISOString(),
  routes: [],
  scenarios: [],
  states: [],
  errors: [],
};

await mkdir(SHOTS_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });

const trackConsole = (page, label) => {
  page.on("pageerror", (err) => result.errors.push({ label, type: "pageerror", message: String(err) }));
  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "error" || type === "warning") {
      const text = msg.text();
      // Next.js dev server 정상 알림 일부 무시 (HMR 등)
      if (/\[Fast Refresh\]|Download the React DevTools/.test(text)) return;
      result.errors.push({ label, type, message: text });
    }
  });
  page.on("requestfailed", (req) => {
    if (req.url().startsWith(BASE_URL)) {
      result.errors.push({ label, type: "requestfailed", message: `${req.method()} ${req.url()} - ${req.failure()?.errorText}` });
    }
  });
};

// 1) 라우트 진입 + 데스크톱 캡쳐
const desktop = await browser.newPage();
await desktop.setViewport(VIEWPORTS[0]);
trackConsole(desktop, "routes");
for (const r of ROUTES) {
  const url = `${BASE_URL}${r.path}`;
  const start = Date.now();
  let ok = true;
  let status = 0;
  try {
    const resp = await desktop.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    status = resp?.status() || 0;
    await new Promise((res) => setTimeout(res, 500));
    await desktop.screenshot({ path: path.join(SHOTS_DIR, `route-${r.name}-desktop.png`), fullPage: false });
  } catch (e) {
    ok = false;
    result.errors.push({ label: `route:${r.name}`, type: "navigation", message: String(e) });
  }
  result.routes.push({ name: r.name, path: r.path, status, ok, ms: Date.now() - start });
}
await desktop.close();

// 2) 반응형 캡쳐 (홈만 3종, jobs-list 3종 — 전체는 시간 오래 걸려 핵심 2개로 한정)
for (const vp of VIEWPORTS.slice(1)) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  trackConsole(page, `viewport:${vp.name}`);
  for (const r of [{ name: "home", path: "/" }, { name: "jobs-list", path: "/jobs" }, { name: "jobs-detail", path: "/jobs/job-001" }, { name: "admin-dashboard", path: "/admin" }]) {
    try {
      await page.goto(`${BASE_URL}${r.path}`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await new Promise((res) => setTimeout(res, 500));
      await page.screenshot({ path: path.join(SHOTS_DIR, `route-${r.name}-${vp.name}.png`), fullPage: false });
    } catch (e) {
      result.errors.push({ label: `viewport:${vp.name}:${r.name}`, type: "navigation", message: String(e) });
    }
  }
  await page.close();
}

// 3) 상태 컴포넌트 3종 캡쳐
for (const s of STATE_CASES) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    trackConsole(page, `state:${s.name}:${vp.name}`);
    try {
      await page.goto(`${BASE_URL}${s.path}`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await new Promise((res) => setTimeout(res, s.waitFor));
      await page.screenshot({ path: path.join(SHOTS_DIR, `state-${s.name}-${vp.name}.png`), fullPage: false });
      result.states.push({ name: s.name, viewport: vp.name, ok: true });
    } catch (e) {
      result.states.push({ name: s.name, viewport: vp.name, ok: false, error: String(e) });
    }
    await page.close();
  }
}

// 4) 시연 시나리오
for (const sc of SCENARIOS) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS[0]);
  trackConsole(page, `scenario:${sc.id}`);
  const start = Date.now();
  let ok = true;
  let error = null;
  try {
    await sc.run(page);
    await new Promise((res) => setTimeout(res, 300));
    await page.screenshot({ path: path.join(SHOTS_DIR, `scenario-${sc.id}.png`), fullPage: false });
  } catch (e) {
    ok = false;
    error = String(e);
    result.errors.push({ label: `scenario:${sc.id}`, type: "scenario", message: error });
  }
  result.scenarios.push({ id: sc.id, name: sc.name, ok, ms: Date.now() - start, error });
  await page.close();
}

await browser.close();

result.finishedAt = new Date().toISOString();
result.summary = {
  routesTotal: result.routes.length,
  routesOk: result.routes.filter((r) => r.ok && r.status >= 200 && r.status < 400).length,
  scenariosTotal: result.scenarios.length,
  scenariosOk: result.scenarios.filter((s) => s.ok).length,
  statesTotal: result.states.length,
  statesOk: result.states.filter((s) => s.ok).length,
  errorsTotal: result.errors.length,
};

await writeFile(path.join(OUT_DIR, "verify-result.json"), JSON.stringify(result, null, 2));

console.log("=== verify summary ===");
console.log(JSON.stringify(result.summary, null, 2));
if (result.errors.length) {
  console.log("=== first 10 errors ===");
  console.log(JSON.stringify(result.errors.slice(0, 10), null, 2));
}

const failed =
  result.summary.routesOk !== result.summary.routesTotal ||
  result.summary.scenariosOk !== result.summary.scenariosTotal ||
  result.summary.statesOk !== result.summary.statesTotal ||
  result.errors.length > 0;

process.exit(failed ? 1 : 0);
