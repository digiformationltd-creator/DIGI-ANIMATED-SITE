import { chromium } from "playwright-core";
import path from "path";

const executablePath = "C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe";

async function run() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0;background:#000;overflow:hidden;">
        <img src="http://localhost:4173/assets/brand/campus-digiformation-hq.jpg" style="width:100vw;height:100vh;object-fit:cover;object-position:center 60%;" />
      </body>
    </html>
  `);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.resolve("screenshots/test_fit.png") });
  console.log("Saved test_fit.png");
  await browser.close();
}

run();
