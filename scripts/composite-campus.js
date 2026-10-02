import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const executablePath = "C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe";

async function run() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage({
    viewport: { width: 1024, height: 682 }
  });

  const campusPath = path.resolve("public/assets/brand/campus-reference.jpg");
  const logoPath = path.resolve("public/assets/brand/digiformation-black-logo.png");
  const silverLogoPath = path.resolve("public/assets/brand/digiformation-silver-logo-official.jpg");

  const campusBase64 = fs.readFileSync(campusPath).toString("base64");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const silverBase64 = fs.readFileSync(silverLogoPath).toString("base64");

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;overflow:hidden;background:#000;">
        <canvas id="c" width="1024" height="682"></canvas>
      </body>
    </html>
  `;

  await page.setContent(html);

  await page.evaluate(({ cB64, lB64, sB64 }) => {
    return new Promise((resolve) => {
      const c = document.getElementById("c");
      const ctx = c.getContext("2d");

      const campusImg = new Image();
      campusImg.src = "data:image/jpeg;base64," + cB64;
      campusImg.onload = () => {
        ctx.drawImage(campusImg, 0, 0, 1024, 682);

        // Monument plaque dimensions on campus photo
        // Plaque is on the left half of the granite monument plinth
        const px = 562;
        const py = 538;
        const pw = 84;
        const ph = 88;

        // Dark architectural slate panel
        ctx.fillStyle = "#1e242d";
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 4);
        ctx.fill();

        // Subtle brushed highlight gradient
        const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.18)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 4);
        ctx.fill();

        // Architectural silver beveled frame
        ctx.strokeStyle = "rgba(210, 225, 240, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Mount the official DigiFormation silver crest onto the panel
        const silverImg = new Image();
        silverImg.src = "data:image/jpeg;base64," + sB64;
        silverImg.onload = () => {
          ctx.drawImage(silverImg, px + 8, py + 10, pw - 16, ph - 20);
          resolve();
        };
      };
    });
  }, { cB64: campusBase64, lB64: logoBase64, sB64: silverBase64 });

  const canvasHandle = await page.$("#c");
  await canvasHandle.screenshot({
    path: path.resolve("public/assets/brand/campus-digiformation-hq.jpg"),
    type: "jpeg",
    quality: 95
  });

  console.log("Successfully generated public/assets/brand/campus-digiformation-hq.jpg!");
  await browser.close();
}

run().catch(console.error);
