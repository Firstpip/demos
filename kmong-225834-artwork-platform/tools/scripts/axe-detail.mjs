// color-contrast 위반의 실제 fg/bg/요소 식별
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

const BASE_URL = process.env.BASE_URL || "http://localhost:4173";
const URL = process.env.URL || `${BASE_URL}/`;

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto(URL, { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 600));
const result = await new AxePuppeteer(page).withRules(["color-contrast"]).analyze();
const v = result.violations.find((x) => x.id === "color-contrast");
if (!v) { console.log("none"); process.exit(0); }
const samples = v.nodes.slice(0, 8).map((n) => ({
  target: n.target.join(" "),
  html: n.html.slice(0, 140),
  msg: n.failureSummary,
}));
console.log(JSON.stringify({ count: v.nodes.length, samples }, null, 2));
await browser.close();
