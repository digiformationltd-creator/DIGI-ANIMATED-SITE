import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";

export interface ScreenConfig {
  width: number;
  height: number;
  resolution?: [number, number];
}

export class ScreenSurface {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private mesh: THREE.Mesh;
  private material: THREE.MeshStandardMaterial;
  private logoImage: HTMLImageElement | null = null;
  private logoLoaded: boolean = false;
  private lastRenderedPhase: number = -1;
  private lastProgress: number = -1;

  constructor(config: ScreenConfig) {
    const resX = config.resolution ? config.resolution[0] : 1920;
    const resY = config.resolution ? config.resolution[1] : 1200;

    this.canvas = document.createElement("canvas");
    this.canvas.width = resX;
    this.canvas.height = resY;
    this.ctx = this.canvas.getContext("2d")!;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    this.material = MaterialFactory.getInstance().createScreenMaterial(this.texture);

    const geometry = new THREE.PlaneGeometry(config.width, config.height);
    this.mesh = new THREE.Mesh(geometry, this.material);

    this.preloadLogo();
    this.renderByProgress(0.0);
  }

  private preloadLogo(): void {
    const img = new Image();
    img.src = "/assets/brand/digiformation-logo-official.png";
    img.onload = () => {
      this.logoImage = img;
      this.logoLoaded = true;
      if (this.lastProgress >= 0) {
        this.renderByProgress(this.lastProgress, true);
      }
    };
  }

  public renderByProgress(progress: number, force: boolean = false): void {
    // Only re-render if progress crossed a sub-threshold or cursor moved significantly
    if (!force && Math.abs(progress - this.lastProgress) < 0.008) {
      return;
    }
    this.lastProgress = progress;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Reset base screen background
    ctx.fillStyle = "#0c0f14";
    ctx.fillRect(0, 0, w, h);

    if (progress < 0.35) {
      this.renderResearchPhase(progress / 0.35);
    } else if (progress < 0.70) {
      this.renderDiscoveryPhase((progress - 0.35) / 0.35);
    } else {
      this.renderSelectionPhase((progress - 0.70) / 0.30);
    }

    this.texture.needsUpdate = true;
  }

  // PHASE A: Researching UK business setup in search engine
  private renderResearchPhase(localT: number): void {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.drawBrowserHeader("Google Search · register uk ltd company non resident", "https://www.google.co.uk/search?q=register+uk+ltd+company+online+non+resident");

    // Search Box Header
    ctx.fillStyle = "#1e222b";
    ctx.roundRect(140, 110, w - 280, 56, 28);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillText("register uk ltd company online non resident", 180, 146);

    // Search Result 1: DigiFormation (Top Recommended Result)
    const cardY = 220;
    ctx.fillStyle = "#161a22";
    ctx.roundRect(140, cardY, w - 280, 240, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("https://www.digiformation.co.uk › uk-ltd-formation", 180, cardY + 45);

    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 32px 'Space Grotesk', sans-serif";
    ctx.fillText("DigiFormation — Form Your UK Limited Company (Non-Resident Guide)", 180, cardY + 95);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px 'Inter', sans-serif";
    ctx.fillText("Official Companies House e-filing for non-residents worldwide. Includes London Registered Office,", 180, cardY + 145);
    ctx.fillText("Director Service Address, HMRC Corporation Tax UTR registration, and Business Banking assistance.", 180, cardY + 180);

    // Search Result 2: Gov UK Companies House Guide
    const card2Y = 500;
    ctx.fillStyle = "#12151c";
    ctx.roundRect(140, card2Y, w - 280, 200, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("https://www.gov.uk › set-up-limited-company", 180, card2Y + 45);

    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 26px 'Space Grotesk', sans-serif";
    ctx.fillText("Set up a limited company: step by step - GOV.UK", 180, card2Y + 90);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText("What you need to do to set up a private limited company in the UK, including naming rules and directors...", 180, card2Y + 135);

    // Mouse cursor approaching DigiFormation link
    const cursorX = 350 + localT * 320;
    const cursorY = cardY + 80 + Math.sin(localT * Math.PI) * 15;
    this.drawCursor(cursorX, cursorY, localT > 0.8);
  }

  // PHASE B: Arrival at DigiFormation.co.uk
  private renderDiscoveryPhase(localT: number): void {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.drawBrowserHeader("DigiFormation | UK LTD & US LLC Formation, Global Banking", "https://www.digiformation.co.uk/");

    // Brand Navbar
    this.drawNavBar();

    // Hero Section
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.roundRect(100, 190, 280, 32, 16);
    ctx.fill();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillText("★ REGISTERED WITH COMPANIES HOUSE", 118, 211);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px 'Space Grotesk', sans-serif";
    ctx.fillText("Form Your UK Limited Company", 100, 305);
    ctx.fillText("From Anywhere Worldwide.", 100, 380);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "22px 'Inter', sans-serif";
    ctx.fillText("Official Companies House incorporation for international founders.", 100, 440);
    ctx.fillText("ECCT Act 2023 compliant · Prestigious London Registered Address · Global Payment Rails.", 100, 475);

    // Service Highlight Cards
    this.drawServiceCards(localT * 0.4, false);

    // Moving cursor scanning the page
    const cursorX = 280 + localT * 500;
    const cursorY = 480 + localT * 180;
    this.drawCursor(cursorX, cursorY, false);
  }

  // PHASE C: UK LTD Formation Selection & Initiation
  private renderSelectionPhase(localT: number): void {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.drawBrowserHeader("DigiFormation | UK LTD Formation Portal", "https://www.digiformation.co.uk/uk-ltd-formation");
    this.drawNavBar();

    // Section title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px 'Space Grotesk', sans-serif";
    ctx.fillText("Choose Your Formation Package", 100, 240);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px 'Inter', sans-serif";
    ctx.fillText("Select England & Wales corporate package. Transparent statutory pricing.", 100, 280);

    // Service Cards with UK LTD highlighted / selected
    const isClicked = localT >= 0.75;
    this.drawServiceCards(localT, isClicked);

    // Cursor targeting the Silver (Most Popular) / UK LTD package button
    const targetX = 100 + ((w - 280) / 3) + 40 + ((w - 280) / 6);
    const targetY = 820;

    const startX = 600;
    const startY = 450;

    const curX = startX + (targetX - startX) * Math.min(1, localT * 1.3);
    const curY = startY + (targetY - startY) * Math.min(1, localT * 1.3);

    this.drawCursor(curX, curY, isClicked);

    // Selection confirmation flash when clicked
    if (isClicked) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.roundRect((w / 2) - 240, h - 140, 480, 60, 30);
      ctx.fill();
      ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      ctx.shadowBlur = 24;

      ctx.fillStyle = "#090d13";
      ctx.font = "bold 18px 'Space Grotesk', sans-serif";
      ctx.fillText("✓  UK LTD FORMATION INITIALIZED", (w / 2) - 170, h - 103);
      ctx.shadowBlur = 0;
    }
  }

  private drawBrowserHeader(title: string, url: string): void {
    const ctx = this.ctx;
    const w = this.canvas.width;

    // Chrome bar
    ctx.fillStyle = "#13171f";
    ctx.fillRect(0, 0, w, 68);

    // Window controls
    ctx.fillStyle = "#ff5f56";
    ctx.beginPath();
    ctx.arc(36, 34, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffbd2e";
    ctx.beginPath();
    ctx.arc(60, 34, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#27c93f";
    ctx.beginPath();
    ctx.arc(84, 34, 7, 0, Math.PI * 2);
    ctx.fill();

    // URL address capsule
    ctx.fillStyle = "#0c0f14";
    ctx.roundRect(140, 15, w - 280, 38, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "15px 'Inter', sans-serif";
    ctx.fillText(`🔒  ${url}`, 160, 39);
  }

  private drawNavBar(): void {
    const ctx = this.ctx;
    const w = this.canvas.width;

    ctx.fillStyle = "#0c0f14";
    ctx.fillRect(0, 68, w, 72);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.lineTo(w, 140);
    ctx.stroke();

    // Render Real DigiFormation Logo if loaded
    if (this.logoLoaded && this.logoImage) {
      ctx.drawImage(this.logoImage, 100, 84, 180, 38);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px 'Space Grotesk', sans-serif";
      ctx.fillText("DIGIFORMATION", 100, 112);
    }

    // Nav Links
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'Inter', sans-serif";
    ctx.fillText("UK LTD Formation", 380, 110);

    ctx.fillStyle = "#94a3b8";
    ctx.fillText("US LLC Formation", 550, 110);
    ctx.fillText("Business Banking", 720, 110);
    ctx.fillText("Enterprise Software", 890, 110);

    // Support hotline pill
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.roundRect(w - 280, 84, 180, 40, 20);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px 'Inter', sans-serif";
    ctx.fillText("Start Formation", w - 245, 109);
  }

  private drawServiceCards(progress: number, isSelected: boolean): void {
    const ctx = this.ctx;
    const w = this.canvas.width;

    const cards = [
      { name: "Starter", price: "£140", feat: ["Companies House Registration", "Digital Incorporation Certificate", "Client Portal Access"] },
      { name: "Silver Package", price: "£170", badge: "MOST POPULAR", feat: ["Companies House Fee Included", "London Registered Office Address", "HMRC Corporation Tax UTR", "WebFiling Auth Code", "Digital Share Certificates"] },
      { name: "Platinum Dossier", price: "£200", feat: ["Full Statutory Corporate Kit", "Director Service Address", "HMRC Corporation Tax Support", "Priority Compliance Advisor"] },
    ];

    const cardW = (w - 280) / 3;
    const cardY = 340;

    cards.forEach((c, idx) => {
      const cardX = 100 + idx * (cardW + 40);
      const isTarget = idx === 1;

      // Card Background
      if (isTarget && isSelected) {
        ctx.fillStyle = "rgba(35, 45, 62, 0.95)";
      } else if (isTarget) {
        ctx.fillStyle = "rgba(24, 30, 42, 0.9)";
      } else {
        ctx.fillStyle = "rgba(16, 20, 27, 0.75)";
      }

      ctx.roundRect(cardX, cardY, cardW, 560, 20);
      ctx.fill();

      // Card Border with glowing selection pulse
      if (isTarget && isSelected) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
      } else if (isTarget) {
        ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
      }
      ctx.stroke();

      // Recommended badge
      if (c.badge) {
        ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.18)";
        ctx.roundRect(cardX + 30, cardY + 30, 150, 30, 8);
        ctx.fill();

        ctx.fillStyle = isSelected ? "#090d13" : "#ffffff";
        ctx.font = "bold 12px 'Inter', sans-serif";
        ctx.fillText(c.badge, cardX + 46, cardY + 50);
      }

      // Title & Price
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px 'Space Grotesk', sans-serif";
      ctx.fillText(c.name, cardX + 30, cardY + 110);

      ctx.fillStyle = isTarget ? "#ffffff" : "#cbd5e1";
      ctx.font = "bold 56px 'Space Grotesk', sans-serif";
      ctx.fillText(c.price, cardX + 30, cardY + 185);

      // Features list
      ctx.fillStyle = "#94a3b8";
      ctx.font = "17px 'Inter', sans-serif";
      c.feat.forEach((f, fIdx) => {
        ctx.fillText(`✓  ${f}`, cardX + 30, cardY + 250 + fIdx * 45);
      });

      // Action Button
      const btnY = cardY + 475;
      const btnW = cardW - 60;

      if (isTarget && isSelected) {
        ctx.fillStyle = "#22c55e"; // Statutory milestone green on selection
      } else if (isTarget) {
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      }

      ctx.roundRect(cardX + 30, btnY, btnW, 54, 12);
      ctx.fill();

      if (isTarget && isSelected) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 17px 'Inter', sans-serif";
        ctx.fillText("✓  SELECTED — INITIALIZING", cardX + 30 + (btnW / 2) - 110, btnY + 34);
      } else if (isTarget) {
        ctx.fillStyle = "#090d13";
        ctx.font = "bold 17px 'Inter', sans-serif";
        ctx.fillText("START UK FORMATION", cardX + 30 + (btnW / 2) - 95, btnY + 34);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 17px 'Inter', sans-serif";
        ctx.fillText("SELECT PACKAGE", cardX + 30 + (btnW / 2) - 75, btnY + 34);
      }
    });
  }

  // Draw simulated mouse cursor
  private drawCursor(x: number, y: number, isClicked: boolean): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    if (isClicked) {
      // Click ripple effect
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Cursor arrow
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 18);
    ctx.lineTo(5, 14);
    ctx.lineTo(10, 22);
    ctx.lineTo(13, 20);
    ctx.lineTo(8, 12);
    ctx.lineTo(14, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public setEmissiveIntensity(intensity: number): void {
    this.material.emissiveIntensity = intensity;
  }

  public dispose(): void {
    this.material.dispose();
    this.texture.dispose();
    this.mesh.geometry.dispose();
  }
}
