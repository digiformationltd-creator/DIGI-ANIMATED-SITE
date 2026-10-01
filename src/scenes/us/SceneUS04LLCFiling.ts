import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS04LLCFiling implements CinematicScene {
  public id = "scene-us-04-llc-filing";
  public title = "Articles of Organization Filing";
  public label = "04 LLC";
  public kicker = "04 · WYOMING SECRETARY OF STATE";
  public description = "Submitting official Articles of Organization via the Wyoming Secretary of State electronic gateway (WyoBiz). Statutory review, state filing fee clearance, and issuance of the legal Certificate of Organization.";
  public statutoryNote = "Wyoming Secretary of State · W.S. 17-29-201 · Articles of Organization Endorsed & Filed";
  public metricBadge = "STATE FILING · ENDORSED";
  public startProgress = 0.33;
  public endProgress = 0.44;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-04-LLC",
    reelNumber: "04 / 09",
    chapterTitle: "ARTICLES OF ORGANIZATION FILING",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "35mm Cine Anamorphic",
    iso: 640,
    timecode: "00:04:45:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 4: STATE FILING TRANSMITTED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.35, 1.5] as [number, number, number],
      target: [0.0, 1.0, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.05, 0.8] as [number, number, number],
      target: [0.0, 0.98, 0.0] as [number, number, number],
      fov: 25,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private monitorMesh: THREE.Mesh | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1152;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Operations Command Terminal Display
    const screenGeo = new THREE.PlaneGeometry(1.2, 0.68);
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
    const bezelGeo = new THREE.BoxGeometry(1.22, 0.7, 0.03);
    const bezelMat = this.materials.getMatteBlackMetal();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.016);
    this.sceneGroup.add(bezel);

    this.renderScreen(0);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.35 + (1.05 - 1.35) * t;
    const camZ = 1.5 + (0.8 - 1.5) * t;

    const targetX = 0.0;
    const targetY = 1.0 + (0.98 - 1.0) * t;
    const targetZ = 0.0;

    const fov = 34 + (25 - 34) * t;
    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.renderScreen(sceneProgress);
  }

  private renderScreen(p: number): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background
    ctx.fillStyle = "#070b14";
    ctx.fillRect(0, 0, w, h);

    // Top Chrome Header
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("WYOBIZ SECURE GATEWAY · WYOMING SECRETARY OF STATE ELECTRONIC FILINGS", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("STATUS: SUBMISSION ACTIVE", w - 60, 44);
    ctx.textAlign = "start";

    // 2-Column Grid
    const colW = (w - 180) / 2;

    // Left Column: Articles of Organization Packet
    ctx.fillStyle = "#0d1424";
    ctx.beginPath();
    ctx.roundRect(60, 100, colW, 680, 16);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("ARTICLES OF ORGANIZATION (W.S. 17-29-201)", 90, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("Vance Apex LLC", 90, 210);

    const dossier = [
      { label: "Entity Type", val: "Domestic Limited Liability Company" },
      { label: "Formation State", val: "State of Wyoming" },
      { label: "Management Structure", val: "Member-Managed" },
      { label: "Registered Agent", val: "DigiFormation Registered Agent Services" },
      { label: "Registered Office", val: "1621 Central Ave, Cheyenne, WY 82001" },
      { label: "Filing Fee", val: "$100.00 State Fee (Paid)" },
      { label: "Statutory Duration", val: "Perpetual" },
    ];

    dossier.forEach((item, idx) => {
      const dy = 260 + idx * 56;
      ctx.fillStyle = "#64748b";
      ctx.font = "16px sans-serif";
      ctx.fillText(item.label, 90, dy);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 18px monospace";
      ctx.fillText(item.val, 90, dy + 24);
    });

    // Right Column: State Handshake & Filing Certificate
    ctx.fillStyle = "#0d1424";
    ctx.beginPath();
    ctx.roundRect(100 + colW, 100, colW, 680, 16);
    ctx.fill();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 20px monospace";
    ctx.fillText("SECRETARY OF STATE FILING ENDORSEMENT", 130 + colW, 150);

    // Official Gold Stamp Box
    ctx.fillStyle = "#1e1b4b";
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(130 + colW, 190, colW - 60, 220, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#facc15";
    ctx.font = "bold 26px serif";
    ctx.textAlign = "center";
    ctx.fillText("STATE OF WYOMING", 130 + colW + (colW - 60) / 2, 240);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("CERTIFICATE OF ORGANIZATION", 130 + colW + (colW - 60) / 2, 280);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 22px monospace";
    ctx.fillText("FILING ID: 2026-001699490", 130 + colW + (colW - 60) / 2, 330);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("Filed & Endorsed in the Office of Secretary of State", 130 + colW + (colW - 60) / 2, 370);
    ctx.textAlign = "start";

    // Transmission Progress Log
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.roundRect(130 + colW, 440, colW - 60, 310, 12);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "16px monospace";
    ctx.fillText("> [00:04:12] Handshake: wyobiz.wyo.gov:443", 150 + colW, 480);
    ctx.fillText("> [00:04:13] XML Schema Validation: Passed", 150 + colW, 520);
    ctx.fillText("> [00:04:14] State Fee Transaction: CLEARED ($100)", 150 + colW, 560);
    ctx.fillText("> [00:04:15] Articles Recorded in State Archive", 150 + colW, 600);

    ctx.fillStyle = "#34d399";
    ctx.fillText("✓ [00:04:16] LLC ESTABLISHED · STATUTORY STATUS ACTIVE", 150 + colW, 660);

    // Bottom Action Bar
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(60, 810, w - 120, 80, 14);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓ WYOMING LLC CREATED · PROCEEDING TO FEDERAL EIN IDENTIFICATION (IRS)", w / 2, 860);
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
