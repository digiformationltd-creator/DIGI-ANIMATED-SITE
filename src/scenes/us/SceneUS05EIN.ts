import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS05EIN implements CinematicScene {
  public id = "scene-us-05-ein";
  public title = "Federal Tax Identification (EIN)";
  public label = "05 EIN";
  public kicker = "05 · INTERNAL REVENUE SERVICE (IRS)";
  public description = "Securing the Federal Employer Identification Number (EIN) from the IRS via Form SS-4. Establishing federal corporate tax identity required for US business banking, Stripe merchant processing, and payroll compliance.";
  public statutoryNote = "Internal Revenue Code (IRC § 6109) · Form SS-4 · Official IRS CP 575 Confirmation Notice";
  public metricBadge = "IRS · EIN ISSUED";
  public startProgress = 0.44;
  public endProgress = 0.55;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-05-EIN",
    reelNumber: "05 / 09",
    chapterTitle: "FEDERAL TAX IDENTIFICATION (EIN)",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "45mm Macro Cine",
    iso: 400,
    timecode: "00:05:40:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 5: FEDERAL EIN SECURED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.4, 0.95] as [number, number, number],
      target: [0.0, 0.82, -0.05] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.12, 0.55] as [number, number, number],
      target: [0.0, 0.82, -0.1] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private docMesh: THREE.Mesh | null = null;
  private irsLogo: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1700;
    this.canvas.height = 2200;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTexture.minFilter = THREE.LinearFilter;
    this.canvasTexture.magFilter = THREE.LinearFilter;

    this.irsLogo = new Image();
    this.irsLogo.crossOrigin = "anonymous";
    this.irsLogo.src = "/assets/partners/irs.png";
    this.irsLogo.onload = () => {
      this.renderDoc();
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Heavy Federal Parchment Document Sheet
    const docGeo = new THREE.PlaneGeometry(0.55, 0.71);
    const docMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      roughness: 0.85,
      metalness: 0.0,
    });
    this.docMesh = new THREE.Mesh(docGeo, docMat);
    this.docMesh.position.set(0, 0.82, -0.05);
    this.docMesh.rotation.x = THREE.MathUtils.degToRad(-60);
    this.sceneGroup.add(this.docMesh);

    // 2. Desk Base Plate
    const deskGeo = new THREE.BoxGeometry(1.6, 0.05, 1.0);
    const deskMat = this.materials.getDarkWalnutWood();
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.75, 0);
    this.sceneGroup.add(desk);

    this.renderDoc();
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.4 + (1.12 - 1.4) * t;
    const camZ = 0.95 + (0.55 - 0.95) * t;

    const targetX = 0.0;
    const targetY = 0.82;
    const targetZ = -0.05 + (-0.1 - -0.05) * t;

    const fov = 34 + (24 - 34) * t;
    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.renderDoc();
  }

  private renderDoc(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Federal bond paper texture
    ctx.fillStyle = "#fafaf8";
    ctx.fillRect(0, 0, w, h);

    // Subtle security border
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, w - 120, h - 120);

    // IRS Header & Seal
    if (this.irsLogo && this.irsLogo.complete) {
      // Invert white IRS logo on dark bg or draw cleanly
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(100, 100, 220, 70, 8);
      ctx.fill();
      ctx.drawImage(this.irsLogo, 110, 110, 200, 50);
    } else {
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 32px serif";
      ctx.fillText("IRS", 100, 150);
    }

    ctx.fillStyle = "#0f172a";
    ctx.font = "22px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Department of the Treasury", w - 100, 120);
    ctx.fillText("Internal Revenue Service", w - 100, 150);
    ctx.fillText("Cincinnati, OH 45999-0023", w - 100, 180);
    ctx.textAlign = "start";

    // Divider
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 220);
    ctx.lineTo(w - 100, 220);
    ctx.stroke();

    // Notice Information
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 32px serif";
    ctx.fillText("NOTICE 575 (CP 575 A) · EIN CONFIRMATION", 100, 280);

    ctx.font = "20px monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Date of this notice: March 24, 2026", 100, 320);
    ctx.fillText("Form: SS-4 (Application for Employer Identification Number)", 100, 350);

    // Recipient
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("VANCE APEX LLC", 100, 430);
    ctx.font = "22px sans-serif";
    ctx.fillText("1621 Central Ave", 100, 465);
    ctx.fillText("Cheyenne, WY 82001", 100, 500);

    // Hero EIN Callout Box
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(100, 560, w - 200, 240, 16);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px monospace";
    ctx.fillText("FEDERAL EMPLOYER IDENTIFICATION NUMBER (EIN)", 140, 620);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 76px monospace";
    ctx.fillText("88-4920184", 140, 715);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("✓ ACTIVE & RATIFIED IN IRS IRS BMF", w - 140, 700);
    ctx.textAlign = "start";

    // Official Text Body
    ctx.fillStyle = "#334155";
    ctx.font = "22px serif";
    const body = [
      "We assigned you the Employer Identification Number (EIN) shown above. Please keep this",
      "official notice in your permanent corporate records. You will need your EIN to open a US business",
      "bank account, process customer payments via Stripe, and file federal tax declarations.",
      "",
      "Entity Classification: Single-Member LLC treated as a Disregarded Entity for US Federal Tax purposes.",
      "Applicable Forms: Form 1120 / Form 5472 for foreign-owned domestic entities.",
      "",
      "Your EIN is permanently locked to Vance Apex LLC and cannot be transferred.",
    ];

    body.forEach((line, idx) => {
      ctx.fillText(line, 100, 870 + idx * 40);
    });

    // Bottom Watermark Box
    ctx.fillStyle = "#f1f5f9";
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(100, 1240, w - 200, 120, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 20px monospace";
    ctx.fillText("SECURITY NOTICE: VERIFIED VIA DIGIFORMATION DIRECT IRS PROCESSING", 140, 1290);
    ctx.fillStyle = "#64748b";
    ctx.font = "18px sans-serif";
    ctx.fillText("Next Chapter: ITIN Distinction Analysis & Non-Resident Tax Optimization Protocol.", 140, 1325);

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
