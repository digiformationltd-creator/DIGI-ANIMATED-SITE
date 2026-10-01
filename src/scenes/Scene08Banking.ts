import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene08Banking implements CinematicScene {
  public id = "scene-08-banking";
  public title = "Global Banking Rails";
  public label = "08 BANKING";
  public kicker = "08 · MULTI-CURRENCY FINTECH RAILS";
  public description = "Borderless financial infrastructure. Dedicated UK business accounts, international IBANs, and merchant acquiring configured with Stripe, Wise, and global partners.";
  public statutoryNote = "FCA Regulated Banking Rails · Multi-Currency · Direct Debit & Faster Payments";
  public metricBadge = "SORT CODE: 04-00-04";
  public startProgress = 0.70;
  public endProgress = 0.80;

  public transition: SceneTransition = {
    type: "OBJECT",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-08-BANKING",
    reelNumber: "08 / 10",
    chapterTitle: "GLOBAL BANKING RAILS",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "75mm Angenieux",
    iso: 400,
    timecode: "00:08:15:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 8: BANKING RAILS ACTIVATED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.55, 1.35, 1.4] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 32,
    },
    end: {
      position: [0.12, 1.08, 0.75] as [number, number, number],
      target: [0.0, 0.92, 0.0] as [number, number, number],
      fov: 22,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private cardGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private partnerLogos: { img: HTMLImageElement; x: number; y: number; w: number; h: number }[] = [];
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1600;
    this.canvas.height = 1000;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    // Load banking partner logos
    const partners = [
      { src: "/assets/partners/stripe.png", x: 120, y: 720, w: 180, h: 72 },
      { src: "/assets/partners/wise.png", x: 380, y: 720, w: 200, h: 64 },
      { src: "/assets/partners/payoneer.png", x: 660, y: 720, w: 210, h: 68 },
      { src: "/assets/partners/tide.png", x: 950, y: 720, w: 180, h: 68 },
      { src: "/assets/partners/airwallex.png", x: 1210, y: 720, w: 230, h: 68 },
    ];

    partners.forEach((p) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = p.src;
      img.onload = () => this.renderDashboard();
      this.partnerLogos.push({ img, x: p.x, y: p.y, w: p.w, h: p.h });
    });
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Frosted Glass Executive Plinth
    const plinthGeo = new THREE.BoxGeometry(1.6, 0.04, 0.9);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.15,
      metalness: 0.85,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, 0.75, 0);
    this.sceneGroup.add(plinth);

    // 2. Physical Titanium Business Debit Card
    const cardGeo = new THREE.BoxGeometry(0.34, 0.006, 0.215);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep Obsidian Titanium
      roughness: 0.25,
      metalness: 0.95,
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.position.set(-0.25, 0.776, 0.05);
    card.rotation.y = THREE.MathUtils.degToRad(-12);
    this.cardGroup.add(card);

    // Gold Contact EMV Smart Chip
    const chipGeo = new THREE.BoxGeometry(0.042, 0.002, 0.034);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(-0.33, 0.78, 0.04);
    chip.rotation.y = THREE.MathUtils.degToRad(-12);
    this.cardGroup.add(chip);

    this.sceneGroup.add(this.cardGroup);

    // 3. Floating Banking Terminal Display
    this.renderDashboard();
    const dashGeo = new THREE.PlaneGeometry(1.2, 0.75);
    const dashMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.82,
      roughness: 0.25,
      metalness: 0.1,
    });
    const dash = new THREE.Mesh(dashGeo, dashMat);
    dash.position.set(0.15, 1.1, -0.15);
    dash.rotation.y = THREE.MathUtils.degToRad(-8);
    this.sceneGroup.add(dash);

    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.55 + (0.12 - 0.55) * t;
    const camY = 1.35 + (1.08 - 1.35) * t;
    const camZ = 1.4 + (0.75 - 1.4) * t;

    const targetX = 0.0;
    const targetY = 0.95 + (0.92 - 0.95) * t;
    const targetZ = 0.0;

    const fov = 32 + (22 - 32) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    // Subtle sheen on titanium card
    this.cardGroup.rotation.y = Math.sin(sceneProgress * 0.6) * 0.02;
  }

  private renderDashboard(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark titanium dashboard background
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px monospace";
    ctx.fillText("UK CORPORATE TREASURY & BANKING INFRASTRUCTURE", 60, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("Multi-Currency Merchant Rails", 60, 140);

    // Account Rail Cards Grid
    const cardW = (w - 180) / 3;

    // Rail 1: UK Faster Payments
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(60, 190, cardW, 460, 16);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 22px monospace";
    ctx.fillText("GBP ACCOUNT (UK)", 90, 240);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Sort Code: 04-00-04", 90, 300);

    ctx.font = "20px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Account No: 82910481", 90, 350);
    ctx.fillText("Beneficiary: Vance Tech Ltd", 90, 390);
    ctx.fillText("Network: Faster Payments (FPS)", 90, 430);
    ctx.fillText("Bacs & CHAPS: Active", 90, 470);
    ctx.fillText("Status: INSTANT SETTLEMENT", 90, 510);

    // Rail 2: Multi-Currency IBAN
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(80 + cardW, 190, cardW, 460, 16);
    ctx.fill();

    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 22px monospace";
    ctx.fillText("GLOBAL IBAN RAILS", 110 + cardW, 240);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Multi-Currency Vault", 110 + cardW, 300);

    ctx.font = "18px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("EUR IBAN: GB29WISE040004...", 110 + cardW, 350);
    ctx.fillText("USD Routing: 026073150", 110 + cardW, 390);
    ctx.fillText("SWIFT/BIC: WISEGB2L", 110 + cardW, 430);
    ctx.fillText("Currencies: 40+ Supported", 110 + cardW, 470);
    ctx.fillText("FX Margin: 0.35% Direct Interbank", 110 + cardW, 510);

    // Rail 3: Merchant Acquiring (Stripe)
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(100 + cardW * 2, 190, cardW, 460, 16);
    ctx.fill();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 22px monospace";
    ctx.fillText("MERCHANT GATEWAY", 130 + cardW * 2, 240);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Stripe & E-Commerce", 130 + cardW * 2, 300);

    ctx.font = "18px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Merchant ID: acct_1N9x...", 130 + cardW * 2, 350);
    ctx.fillText("Payout Schedule: Daily Rolling", 130 + cardW * 2, 390);
    ctx.fillText("3D Secure 2.2: Enabled", 130 + cardW * 2, 430);
    ctx.fillText("Apple & Google Pay: Live", 130 + cardW * 2, 470);
    ctx.fillText("Status: CHARGES VERIFIED", 130 + cardW * 2, 510);

    // Partner Logos Row at bottom
    ctx.fillStyle = "#050912";
    ctx.fillRect(60, 680, w - 120, 150);

    this.partnerLogos.forEach((p) => {
      if (p.img && p.img.complete) {
        ctx.drawImage(p.img, p.x, p.y, p.w, p.h);
      }
    });

    // Verification checkmark
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("✓ ALL FINTECH ACCOUNTS PRE-APPROVED & INTEGRATED VIA DIGIFORMATION DIRECT RAILS", 120, 890);

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void {
    this.sceneGroup.visible = true;
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
