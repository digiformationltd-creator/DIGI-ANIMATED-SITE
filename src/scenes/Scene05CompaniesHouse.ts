import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene05CompaniesHouse implements CinematicScene {
  public id = "scene-05-companies-house";
  public title = "Companies House Dispatch";
  public label = "05 DISPATCH";
  public kicker = "05 · DIRECT GOVERNMENT GATEWAY";
  public description = "Direct electronic transmission to Companies House. Memorandum, Articles of Association, and PSC register securely dispatched via XML gateway API.";
  public statutoryNote = "Companies House WebFiling API · Section 9 Companies Act 2006 · Digital Filing";
  public metricBadge = "GOV.UK GATEWAY · TRANSMITTED";
  public startProgress = 0.40;
  public endProgress = 0.50;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-05-COMPANIES-HOUSE",
    reelNumber: "05 / 10",
    chapterTitle: "COMPANIES HOUSE DISPATCH",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "40mm Anamorphic",
    iso: 640,
    timecode: "00:05:42:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 5: DIRECT API DISPATCH",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.35, 1.5] as [number, number, number],
      target: [0.0, 1.0, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.05, 0.75] as [number, number, number],
      target: [0.0, 0.98, 0.0] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private monitorMesh: THREE.Mesh | null = null;
  private chLogo: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1152;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    this.chLogo = new Image();
    this.chLogo.crossOrigin = "anonymous";
    this.chLogo.src = "/assets/partners/companies-house.png";
    this.chLogo.onload = () => {
      this.renderScreen(0);
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Dual-Curved Operations Terminal Monitor
    const screenGeo = new THREE.PlaneGeometry(1.2, 0.68);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.monitorMesh = new THREE.Mesh(screenGeo, screenMat);
    this.monitorMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.monitorMesh);

    // Bezel
    const bezelGeo = new THREE.BoxGeometry(1.22, 0.7, 0.03);
    const bezelMat = this.materials.getMatteBlackMetal();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.016);
    this.sceneGroup.add(bezel);

    // Stand
    const standGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 16);
    const stand = new THREE.Mesh(standGeo, bezelMat);
    stand.position.set(0, 0.825, -0.04);
    this.sceneGroup.add(stand);

    // Initial render
    this.renderScreen(0);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.35 + (1.05 - 1.35) * t;
    const camZ = 1.5 + (0.75 - 1.5) * t;

    const targetX = 0.0;
    const targetY = 1.0 + (0.98 - 1.0) * t;
    const targetZ = 0.0;

    const fov = 34 + (24 - 34) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.renderScreen(sceneProgress);

    if (sceneProgress < 0.6) {
      this.kicker = "05 · ELECTRONIC XML DISPATCH";
      this.description = "Transmitting Articles of Association, Form IN01, and PSC compliance records to Companies House electronic registrar.";
      this.telemetry.statutoryStep = "STEP 5: XML DISPATCH";
    } else {
      this.kicker = "05 · TRANSMISSION CONFIRMED";
      this.description = "Companies House XML gateway response: 200 OK. Filing entered priority 24-hour examination queue.";
      this.telemetry.statutoryStep = "STEP 5: DISPATCH 200 OK";
    }
  }

  private renderScreen(p: number): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Deep command center background
    ctx.fillStyle = "#070c14";
    ctx.fillRect(0, 0, w, h);

    // Top Header with GOV.UK style bar
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, 80);

    ctx.fillStyle = "#00703c"; // GOV.UK Green accent
    ctx.fillRect(0, 76, w, 4);

    // Companies House Partner Logo
    if (this.chLogo && this.chLogo.complete) {
      ctx.drawImage(this.chLogo, 60, 18, 220, 44);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("Companies House", 60, 52);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "right";
    ctx.fillText("SECURE REGISTRAR GATEWAY · API v4.2", w - 60, 50);
    ctx.textAlign = "start";

    // Main Status Terminal Title
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px monospace";
    ctx.fillText("ELECTRONIC INCORPORATION PROTOCOL (IN01)", 80, 140);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("Submitting to Registrar of England & Wales", 80, 200);

    // Transmission Progress Bar
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(80, 240, w - 160, 24, 12);
    ctx.fill();

    const progressWidth = Math.min(w - 160, (w - 160) * (0.15 + p * 0.85));
    ctx.fillStyle = p > 0.6 ? "#10b981" : "#3b82f6";
    ctx.beginPath();
    ctx.roundRect(80, 240, progressWidth, 24, 12);
    ctx.fill();

    // Data Packet Inspector Grid (3 columns)
    const cardW = (w - 200) / 3;

    // Card 1: Statutory Entity
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(80, 300, cardW, 460, 16);
    ctx.fill();

    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 22px monospace";
    ctx.fillText("CORPORATE ENTITY", 110, 350);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Vance Technologies Ltd", 110, 400);

    ctx.font = "20px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Type: Private Limited (LTD)", 110, 450);
    ctx.fillText("Jurisdiction: England & Wales", 110, 490);
    ctx.fillText("Gov Filing Fee: £50 (Paid)", 110, 530);
    ctx.fillText("SIC Code: 62020 (IT Consult)", 110, 570);
    ctx.fillText("Accounting Ref: 31 March", 110, 610);

    // Card 2: Legal Capital & Governance
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(100 + cardW, 300, cardW, 460, 16);
    ctx.fill();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 22px monospace";
    ctx.fillText("CAPITAL & OFFICERS", 130 + cardW, 350);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Share Capital: £100.00", 130 + cardW, 400);

    ctx.font = "20px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Shares: 100 Ordinary of £1", 130 + cardW, 450);
    ctx.fillText("Director: David Vance", 130 + cardW, 490);
    ctx.fillText("PSC: David Vance (100%)", 130 + cardW, 530);
    ctx.fillText("Voting Rights: 75%+", 130 + cardW, 570);
    ctx.fillText("Articles: Model Articles 2006", 130 + cardW, 610);

    // Card 3: Gateway Status Packet
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(120 + cardW * 2, 300, cardW, 460, 16);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 22px monospace";
    ctx.fillText("GATEWAY TRANSMISSION", 150 + cardW * 2, 350);

    ctx.fillStyle = p > 0.6 ? "#10b981" : "#fbbf24";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(p > 0.6 ? "HTTP 200: ACCEPTED" : "TRANSMITTING ENCRYPTED...", 150 + cardW * 2, 400);

    ctx.font = "18px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Endpoint: api.gov.uk/xml", 150 + cardW * 2, 450);
    ctx.fillText("Payload Size: 48.2 KB", 150 + cardW * 2, 490);
    ctx.fillText("Signature: SHA-256 RSA", 150 + cardW * 2, 530);
    ctx.fillText("Batch ID: DF-2026-98104", 150 + cardW * 2, 570);
    ctx.fillText(p > 0.6 ? "Queue: Priority 24Hr Reg" : "Queue: Handshake...", 150 + cardW * 2, 610);

    // Terminal Log at bottom
    ctx.fillStyle = "#0b101b";
    ctx.beginPath();
    ctx.roundRect(80, 800, w - 160, 280, 16);
    ctx.fill();

    ctx.fillStyle = "#22c55e";
    ctx.font = "20px monospace";
    ctx.fillText("[00:05:42.102] CONNECTING TO SECURE COMPANIES HOUSE GATEWAY...", 110, 850);
    ctx.fillText("[00:05:42.314] XML SCHEMA VALIDATION: PASSED. ZERO SYNTAX WARNINGS.", 110, 890);
    ctx.fillText("[00:05:42.580] DISPATCHING IN01 STATUTORY PACKET WITH INCORPORATION FEE...", 110, 930);
    if (p > 0.4) {
      ctx.fillText("[00:05:42.822] GOVERNMENT REPOSITORIES ACKNOWLEDGED RECEIPT. SUBMISSION ID: CH-GB-16994903.", 110, 970);
    }
    if (p > 0.7) {
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("[00:05:43.010] ✓ DISPATCH COMPLETE. AWAITING FINAL GAZETTE & ROYAL INCORPORATION SEAL...", 110, 1020);
    }

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
