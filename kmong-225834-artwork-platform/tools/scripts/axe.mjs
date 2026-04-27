// axe-core/puppeteer로 핵심 페이지 a11y 검증.
// 사용: node scripts/axe.mjs (BASE_URL 기본 http://localhost:4173)
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:4173";
const OUT_DIR = path.resolve(process.cwd(), ".verify");

const PAGES = [
  { name: "home", path: "/" },
  { name: "jobs-list", path: "/jobs/" },
  { name: "jobs-detail", path: "/jobs/job-001/" },
  { name: "projects-list", path: "/projects/" },
  { name: "artists-list", path: "/artists/" },
  { name: "admin-dashboard", path: "/admin/" },
  { name: "login", path: "/login/" },
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const summary = [];

for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  try {
    await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 600));
    const result = await new AxePuppeteer(page).withTags(["wcag2a", "wcag2aa"]).analyze();
    const violations = result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
      help: v.help,
    }));
    summary.push({ page: p.name, violations: violations.length, details: violations });
  } catch (e) {
    summary.push({ page: p.name, error: String(e) });
  }
  await page.close();
}

await browser.close();

const total = summary.reduce((acc, s) => acc + (s.violations || 0), 0);
const out = { baseUrl: BASE_URL, runAt: new Date().toISOString(), totalViolations: total, pages: summary };
await writeFile(path.join(OUT_DIR, "axe-results.json"), JSON.stringify(out, null, 2));

console.log("=== axe summary ===");
for (const s of summary) {
  console.log(`${s.page}: ${s.error ? `ERROR ${s.error}` : `${s.violations} violations`}`);
  if (s.details && s.details.length) {
    for (const v of s.details) console.log(`  - [${v.impact}] ${v.id} (${v.nodes} nodes): ${v.help}`);
  }
}
console.log(`TOTAL violations: ${total}`);
process.exit(total > 0 ? 1 : 0);
