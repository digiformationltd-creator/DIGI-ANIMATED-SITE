import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS08Banking implements CinematicScene {
  public id = "scene-us-08-banking";
  public title = "US Business Banking Rails";
  public label = "08 US BANKING";
  public kicker = "08 · DOMESTIC US CAPITAL RAILS";
  public description = "Configuring domestic US commercial checking accounts, ACH clearing rails, Fedwire connectivity, and merchant acquiring via Mercury, Relay, Wise US, and Stripe.";
  public statutoryNote = "FDIC Insured Partner Banking · Fedwire & NACHA ACH Clearing · Multi-Currency USD Settlement";
  public metricBadge = "BANKING · ACH ACTIVE";
  public startProgress = 0.77;
  public endProgress = 0.88;

  public transition: SceneTransition = {
    type: "OBJECT",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-08-BANKING",
    reelNumber: "08 / 09",
    chapterTitle: "US BUSINESS BANKING RAILS",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "45mm Angenieux",
    iso: 400,
    timecode: "00:08:20:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 8: US BANKING CONNECTED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.4] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.1, 0.85] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private monitorMesh: THREE.Mesh | null = null;
  private cardMesh: THREE.Mesh | null = null;
  private stripeLogo: HTMLImageElement | null = null;
  private wiseLogo: HTMLImageElement | null = null;
  private airwallexLogo: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1152;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    this.stripeLogo = new Image();
    this.stripeLogo.crossOrigin = "anonymous";
    this.stripeLogo.src = "/assets/partners/stripe.png";

    this.wiseLogo = new Image();
    this.wiseLogo.crossOrigin = "anonymous";
    this.wiseLogo.src = "/assets/partners/wise.png";

    this.airwallexLogo = new Image();
    this.airwallexLogo.crossOrigin = "anonymous";
    this.airwallexLogo.src = "/assets/partners/airwallex.png";

    const checkLoaded = () => {
      this.renderScreen();
    };
    this.stripeLogo.onload = checkLoaded;
    this.wiseLogo.onload = checkLoaded;
    this.airwallexLogo.onload = checkLoaded;
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. FinTech Terminal Screen
    const screenGeo = new THREE.PlaneGeometry(1.25, 0.7);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.monitorMesh = new THREE.Mesh(screenGeo, screenMat);
    this.monitorMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.monitorMesh);

    // Bezel
    const bezelGeo = new THREE.BoxGeometry(1.27, 0.72, 0.02);
    const bezelMat = this.materials.getMatteBlackMetal();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.012);
    this.sceneGroup.add(bezel);

    // 2. Physical Titanium US Business Debit Card floating on pedestal
    const cardGeo = new THREE.BoxGeometry(0.24, 0.006, 0.15);
    const cardMat = this.materials.getBrushedTitanium();
    this.cardMesh = new THREE.Mesh(cardGeo, cardMat);
    this.cardMesh.position.set(0, 0.65, 0.4);
    this.cardMesh.rotation.set(
      THREE.MathUtils.degToRad(-15),
      THREE.MathUtils.degToRad(18),
      0
    );
    this.sceneGroup.add(this.cardMesh);

    this.renderScreen();
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.45 + (1.1 - 1.45) * t;
    const camZ = 1.4 + (0.85 - 1.4) * t;

    const targetX = 0.0;
    const targetY = 0.95;
    const targetZ = 0.0;

    const fov = 34 + (24 - 34) * t;
    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    if (this.cardMesh) {
      this.cardMesh.rotation.y = THREE.MathUtils.degToRad(18 + Math.sin(globalProgress * 12) * 4);
    }
    this.renderScreen();
  }

  private renderScreen(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background
    ctx.fillStyle = "#070c18";
    ctx.fillRect(0, 0, w, h);

    // Header Chrome
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGIFORMATION FINTECH RAILS · US COMMERCIAL BANKING & DOMESTIC ACH", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("FDIC INSURED PARTNER ACCOUNTS", w - 60, 44);
    ctx.textAlign = "start";

    // 3 Cards: Account Credentials, Domestic Rails, Global Partner Integrations
    const colW = (w - 180) / 3;

    // Card 1: US Checking Account
    ctx.fillStyle = "#0f1b33";
    ctx.beginPath();
    ctx.roundRect(60, 100, colW, 460, 14);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px monospace";
    ctx.fillText("01 · US CHECKING ACCOUNT", 85, 145);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Vance Apex LLC", 85, 190);

    const bDetails = [
      { k: "Bank Partner", v: "Mercury / Relay (FDIC)" },
      { k: "ACH Routing", v: "021000021" },
      { k: "Wire Routing", v: "021000021" },
      { k: "Account Number", v: "8849-2018-40" },
      { k: "Currency", v: "USD ($) Native" },
    ];

    bDetails.forEach((b, idx) => {
      const by = 240 + idx * 56;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(b.k, 85, by);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 18px monospace";
      ctx.fillText(b.v, 85, by + 24);
    });

    // Card 2: Payment Rails
    ctx.fillStyle = "#0f1b33";
    ctx.beginPath();
    ctx.roundRect(80 + colW, 100, colW, 460, 14);
    ctx.fill();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 18px monospace";
    ctx.fillText("02 · CLEARING & RAILS", 105 + colW, 145);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Federal Rails Active", 105 + colW, 190);

    const rDetails = [
      { k: "NACHA ACH", v: "Same-Day Direct Deposit" },
      { k: "Fedwire", v: "Instant Large Settlement" },
      { k: "Debit Card", v: "Physical Titanium Visa" },
      { k: "Virtual Cards", v: "Unlimited Digital Tokens" },
      { k: "Daily Limit", v: "$50,000 / day default" },
    ];

    rDetails.forEach((r, idx) => {
      const ry = 240 + idx * 56;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(r.k, 105 + colW, ry);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 18px monospace";
      ctx.fillText(r.v, 105 + colW, ry + 24);
    });

    // Card 3: Partner Integrations
    ctx.fillStyle = "#0f1b33";
    ctx.beginPath();
    ctx.roundRect(100 + colW * 2, 100, colW, 460, 14);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.fillText("03 · MERCHANT ACQUIRING", 125 + colW * 2, 145);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Stripe & FinTech Hub", 125 + colW * 2, 190);

    const pDetails = [
      { k: "Stripe US", v: "Pre-Configured via EIN" },
      { k: "Wise Business", v: "40+ Multi-Currency IBANs" },
      { k: "Airwallex", v: "Cross-Border FX Clearing" },
      { k: "Apple & G Pay", v: "One-Click Checkout" },
      { k: "Merchant Fee", v: "2.9% + 30¢ Domestic" },
    ];

    pDetails.forEach((p, idx) => {
      const py = 240 + idx * 56;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(p.k, 125 + colW * 2, py);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 18px monospace";
      ctx.fillText(p.v, 125 + colW * 2, py + 24);
    });

    // Partner Logo Dock at Bottom
    ctx.fillStyle = "#091020";
    ctx.beginPath();
    ctx.roundRect(60, 580, w - 120, 140, 16);
    ctx.fill();

    // Logos
    if (this.stripeLogo && this.stripeLogo.complete) {
      ctx.drawImage(this.stripeLogo, 160, 620, 140, 50);
    }
    if (this.wiseLogo && this.wiseLogo.complete) {
      ctx.drawImage(this.wiseLogo, 460, 625, 140, 42);
    }
    if (this.airwallexLogo && this.airwallexLogo.complete) {
      ctx.drawImage(this.airwallexLogo, 760, 620, 160, 48);
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 24px monospace";
    ctx.fillText("MERCURY", 1120, 655);
    ctx.fillText("RELAY", 1360, 655);
    ctx.fillText("SHOPIFY PAY", 1580, 655);

    // Status Banner
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(60, 750, w - 120, 70, 12);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓ ALL US FINANCIAL RAILS OPERATIONAL · READY FOR FINAL ECOSYSTEM HANDOVER", w / 2, 794);
    ctx.textAlign = "start";

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
