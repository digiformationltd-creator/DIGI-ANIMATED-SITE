import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const executablePath = "C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe";
const outDir = path.resolve(process.cwd(), "screenshots");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--use-angle=d3d11",
      "--window-size=1920,1080",
    ],
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  page.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));

  console.log("Navigating to http://localhost:4173/ ...");
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // Take screenshot at scroll = 0 (Building establishing shot)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, "scene_00_building_p00.png") });
  console.log("Captured scene_00_building_p00.png");

  // Scroll to p = 0.14 (Office interior with Executive Lounge Sofa & Floor Lamp)
  await page.evaluate(() => {
    if (window.__timeline) {
      window.__timeline.scrollTo(0.14);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.14);
  });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(outDir, "scene_00_office_lounge_p14.png") });
  console.log("Captured scene_00_office_lounge_p14.png");

  // Scroll to p = 0.25 (Reel 01: UK LTD Formation)
  await page.evaluate(() => {
    if (window.__timeline) {
      window.__timeline.scrollTo(0.25);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.25);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, "scene_01_uk_ltd_p25.png") });
  console.log("Captured scene_01_uk_ltd_p25.png");

  // Scroll to p = 0.42 (Reel 02: US LLC Formation & FinTech)
  await page.evaluate(() => {
    if (window.__timeline) {
      window.__timeline.scrollTo(0.42);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.42);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, "scene_02_us_llc_p42.png") });
  console.log("Captured scene_02_us_llc_p42.png");

  // Scroll to p = 0.58 (Reel 03: Compliance & Tax Ledger)
  await page.evaluate(() => {
    if (window.__timeline) {
      window.__timeline.scrollTo(0.58);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.58);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, "scene_03_compliance_p58.png") });
  console.log("Captured scene_03_compliance_p58.png");

  // Scroll to p = 0.74 (Reel 04: Digital Product Build Forge)
  await page.evaluate(() => {
    if (window.__timeline) {
      window.__timeline.scrollTo(0.74);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.74);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, "scene_04_digital_build_p72.png") });
  console.log("Captured scene_04_digital_build_p72.png");

  // Scroll to p = 0.94 (Reel 05: Digi Biz OS with Rotating 3D Laptop & Jupiter Globe)
  await page.evaluate(() => {
    if (window.__timeline) {
      window.__timeline.scrollTo(0.94);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.94);
  });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(outDir, "scene_05_bizos_p92.png") });
  console.log("Captured scene_05_bizos_p92.png");

  await browser.close();
  console.log("Capture completed successfully!");
}

capture().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
