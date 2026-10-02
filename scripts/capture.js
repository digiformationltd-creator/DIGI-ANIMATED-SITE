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

  console.log("Navigating to http://localhost:4173/ ...");
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Take screenshot at scroll = 0 (Building establishing shot)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "scene_00_building_p00.png") });
  console.log("Captured scene_00_building_p00.png");

  // Scroll to p = 0.35 (Monument approach)
  await page.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.35);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "scene_00_monument_p35.png") });
  console.log("Captured scene_00_monument_p35.png");

  // Scroll to p = 0.45 (Silver steel logo on monument)
  await page.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.45);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "scene_00_silver_logo_p45.png") });
  console.log("Captured scene_00_silver_logo_p45.png");

  // Scroll to p = 0.96 (Office interior with Director Haroon)
  await page.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * 0.96);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "scene_00_office_director_p96.png") });
  console.log("Captured scene_00_office_director_p96.png");

  // Click Film 01 UK LTD
  const btnUK = await page.getByRole("button", { name: /UK LTD/i }).first();
  if (btnUK) {
    await btnUK.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "film_01_uk_ltd.png") });
    console.log("Captured film_01_uk_ltd.png");
  }

  // Click Film 02 US LLC
  const btnUS = await page.getByRole("button", { name: /US LLC/i }).first();
  if (btnUS) {
    await btnUS.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "film_02_us_llc.png") });
    console.log("Captured film_02_us_llc.png");
  }

  // Click Film 03 COMPLIANCE
  const btnComp = await page.getByRole("button", { name: /COMPLIANCE/i }).first();
  if (btnComp) {
    await btnComp.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "film_03_compliance.png") });
    console.log("Captured film_03_compliance.png");
  }

  // Click Film 04 DIGITAL BUILD
  const btnDigi = await page.getByRole("button", { name: /DIGITAL BUILD/i }).first();
  if (btnDigi) {
    await btnDigi.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "film_04_digital.png") });
    console.log("Captured film_04_digital.png");
  }

  // Click Film 05 DIGI BIZ OS
  const btnOS = await page.getByRole("button", { name: /DIGI BIZ OS/i }).first();
  if (btnOS) {
    await btnOS.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "film_05_bizos.png") });
    console.log("Captured film_05_bizos.png");
  }

  await browser.close();
  console.log("Capture completed successfully!");
}

capture().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
