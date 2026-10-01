import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene02Order implements CinematicScene {
  public id = "scene-02-order";
  public title = "The Statutory Order";
  public label = "02 ORDER";
  public kicker = "02 · FORMATION CONFIGURATOR";
  public description = "Configuring the corporate architecture. Name availability check against the official Companies House register verifies VANCE TECHNOLOGIES LTD.";
  public statutoryNote = "Companies Act 2006 · Statutory Name Availability Passed · GB-LTD";
  public metricBadge = "CRN SEARCH · VERIFIED";
  public startProgress = 0.10;
  public endProgress = 0.20;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-02-ORDER",
    reelNumber: "02 / 10",
    chapterTitle: "THE STATUTORY ORDER",
    shutterSpeed: "1/48s",
    aperture: "T2.8",
    focalLength: "35mm Macro Cine",
    iso: 640,
    timecode: "00:02:40:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 2: NAME CLEARANCE",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.05, 1.45] as [number, number, number],
      target: [0.0, 1.05, 0.0] as [number, number, number],
      fov: 32,
    },
    end: {
      position: [0.0, 1.05, 1.25] as [number, number, number],
      target: [0.0, 1.05, 0.0] as [number, number, number],
      fov: 28,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private screenMesh: THREE.Mesh | null = null;
  private materials = MaterialFactory.getInstance();
  private logoImg: HTMLImageElement | null = null;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1280;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTexture.minFilter = THREE.LinearFilter;
    this.canvasTexture.magFilter = THREE.LinearFilter;

    // Load official DigiFormation logo
    this.logoImg = new Image();
    this.logoImg.crossOrigin = "anonymous";
    this.logoImg.src = "/assets/brand/digiformation-logo-official.png";
    this.logoImg.onload = () => {
      this.renderScreen(0);
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Large 32-inch 4K Studio Display Screen
    const screenGeo = new THREE.PlaneGeometry(1.2, 0.75);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.1,
    });

    this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
    this.screenMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.screenMesh);

    // 2. Anodized Aluminum Display Bezel
    const bezelGeo = new THREE.BoxGeometry(1.22, 0.77, 0.02);
    const bezelMat = this.materials.getAnodizedAluminum();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.012);
    this.sceneGroup.add(bezel);

    // Initial render
    this.renderScreen(0);

    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    // Majestic forward probe glide into the statutory order dashboard
    const camX = 0.0;
    const camY = 1.05;
    const camZ = 1.45 + (1.25 - 1.45) * t;

    const targetX = 0.0;
    const targetY = 1.05;
    const targetZ = 0.0;

    const fov = 32 + (28 - 32) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.renderScreen(sceneProgress);

    if (sceneProgress < 0.45) {
      this.kicker = "02 · NAME AVAILABILITY VERIFICATION";
      this.description = "Verifying Vance Technologies Ltd against the live official Companies House registrar index.";
      this.telemetry.statutoryStep = "STEP 2: NAME CLEARANCE";
    } else {
      this.kicker = "02 · STATUTORY ORDER CONFIRMED";
      this.description = "Name cleared. England & Wales jurisdiction verified. Package initialized with London EC1 registered office.";
      this.telemetry.statutoryStep = "STEP 2: ORDER LOCKED";
    }
  }

  private renderScreen(p: number): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark titanium browser canvas
    ctx.fillStyle = "#090d14";
    ctx.fillRect(0, 0, w, h);

    // Top Navigation & Browser Chrome
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, w, 90);

    // Browser URL Pill
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.roundRect(w * 0.25, 20, w * 0.5, 50, 25);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px monospace";
    ctx.fillText("🔒 https://www.digiformation.co.uk/checkout/ltd-formation", w * 0.25 + 30, 52);

    // DigiFormation Brand Logo
    if (this.logoImg && this.logoImg.complete) {
      ctx.drawImage(this.logoImg, 50, 24, 180, 42);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("DigiFormation", 50, 58);
    }

    // Step 2 Title
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 22px monospace";
    ctx.fillText("STAGE 02 / 10 · STATUTORY CONFIGURATION", 80, 160);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px sans-serif";
    ctx.fillText("Configure Your UK Entity", 80, 230);

    // Name Availability Search Card
    ctx.fillStyle = "#131b2e";
    ctx.strokeStyle = p >= 0.45 ? "#10b981" : "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(80, 280, w - 160, 220, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("PROPOSED COMPANY NAME (COMPANIES HOUSE INDEX CHECK)", 120, 330);

    // Live typing animation
    const fullText = "VANCE TECHNOLOGIES LTD";
    const charsToShow = Math.min(fullText.length, Math.floor(p * 2.2 * fullText.length));
    const typedText = fullText.substring(0, charsToShow);

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(120, 360, w - 240, 80, 12);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px monospace";
    ctx.fillText(typedText + (p < 0.45 ? "▎" : ""), 150, 415);

    // Verification Status Badge
    if (p >= 0.45) {
      ctx.fillStyle = "#064e3b";
      ctx.beginPath();
      ctx.roundRect(w - 560, 375, 410, 50, 10);
      ctx.fill();

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("✓ NAME AVAILABLE TO REGISTER", w - 540, 408);
    }

    // Package & Jurisdiction Summary Grid
    const colWidth = (w - 200) / 2;

    // Left Column: Selected Package
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(80, 540, colWidth, 620, 18);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("PLATINUM FORMATION DOSSIER", 120, 600);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px sans-serif";
    ctx.fillText("£200", 120, 680);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText("All statutory government filing fees included", 270, 670);

    const features = [
      "✓ Official Companies House WebFiling Submission",
      "✓ Prestigious London EC1 Registered Office Address",
      "✓ Director Privacy Protection & Service Address",
      "✓ Digital Memorandum & Articles of Association",
      "✓ Electronic Certificate of Incorporation (PDF)",
      "✓ Fast-Track 24-Hour Processing Guarantee",
    ];

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#cbd5e1";
    features.forEach((feat, idx) => {
      ctx.fillText(feat, 120, 740 + idx * 60);
    });

    // Right Column: Statutory Jurisdiction & Director Rails
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(100 + colWidth, 540, colWidth, 620, 18);
    ctx.fill();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("GOVERNANCE & JURISDICTION", 140 + colWidth, 600);

    const governance = [
      "• Jurisdiction: England and Wales (GB-LTD)",
      "• Legislation: Companies Act 2006",
      "• Anti-Money Laundering: ECCT Act 2023 Compliant",
      "• Standard Share Capital: £100 (100 Ordinary Shares of £1)",
      "• Company Secretary: Optional / Digitally Managed",
      "• HMRC Corporation Tax: Automatic Registration Rail",
    ];

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#e2e8f0";
    governance.forEach((gov, idx) => {
      ctx.fillText(gov, 140 + colWidth, 670 + idx * 60);
    });

    // Action Button at Bottom
    ctx.fillStyle = p > 0.7 ? "#059669" : "#2563eb";
    ctx.beginPath();
    ctx.roundRect(140 + colWidth, 1040, colWidth - 80, 80, 16);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      p > 0.7 ? "✓ ORDER CONFIRMED — PROCEEDING TO VERIFICATION" : "CONFIRM & LOCK STATUTORY CONFIGURATION",
      140 + colWidth + (colWidth - 80) / 2,
      1090
    );
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
