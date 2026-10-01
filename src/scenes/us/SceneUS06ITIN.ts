import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS06ITIN implements CinematicScene {
  public id = "scene-us-06-itin";
  public title = "EIN vs ITIN Distinction";
  public label = "06 ITIN";
  public kicker = "06 · FEDERAL TAX ARCHITECTURE";
  public description = "Educational distinction between Federal EIN and personal ITIN. Clarifying when non-resident founders operate with the entity's EIN versus when IRS Form W-7 personal tax identification is mandatory.";
  public statutoryNote = "IRS Form W-7 · Individual Taxpayer Identification Number (26 U.S. Code § 6109) · Certified Acceptance Agent (CAA)";
  public metricBadge = "TAX RAILS · CLARIFIED";
  public startProgress = 0.55;
  public endProgress = 0.66;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-06-ITIN",
    reelNumber: "06 / 09",
    chapterTitle: "EIN VS ITIN DISTINCTION",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "35mm Cine Prime",
    iso: 500,
    timecode: "00:06:30:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 6: TAX IDENTIFICATION RATIFIED",
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
    ctx.fillStyle = "#080d1a";
    ctx.fillRect(0, 0, w, h);

    // Top Chrome Header
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("IRS FEDERAL TAX PROTOCOL · ENTITY EIN VS INDIVIDUAL ITIN COMPARATOR", 60, 44);

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("STATUTORY TAX ADVISORY", w - 60, 44);
    ctx.textAlign = "start";

    // 2 Comparative Columns
    const colW = (w - 180) / 2;

    // Left Column: EIN (The Company)
    ctx.fillStyle = "#0d1b30";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 100, colW, 680, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("01 · EMPLOYER IDENTIFICATION NUMBER (EIN)", 90, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("For The US LLC Entity", 90, 200);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.fillText("✓ INCLUDED IN DIGIFORMATION SETUP", 90, 235);

    const einPoints = [
      "• Issued via IRS Form SS-4 for Vance Apex LLC",
      "• Required to open US Business Bank Accounts (Mercury, Relay)",
      "• Required to integrate Stripe US & payment processors",
      "• Enables domestic US merchant acquiring & ACH settlement",
      "• Mandatory for foreign-owned Single-Member LLCs",
      "• Fulfills all federal business identification mandates",
    ];

    einPoints.forEach((pt, idx) => {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "18px sans-serif";
      ctx.fillText(pt, 90, 290 + idx * 56);
    });

    // Right Column: ITIN (The Individual)
    ctx.fillStyle = "#15112e";
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(100 + colW, 100, colW, 680, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 20px monospace";
    ctx.fillText("02 · INDIVIDUAL TAX IDENTIFIER (ITIN)", 130 + colW, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("For The Personal Owner", 130 + colW, 200);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 18px monospace";
    ctx.fillText("OPTIONAL / SITUATIONAL REQUIREMENT", 130 + colW, 235);

    const itinPoints = [
      "• Issued via IRS Form W-7 for foreign individuals without SSN",
      "• NOT required simply to form an LLC or open a US business account",
      "• Required ONLY if the individual has personal US tax filing obligations",
      "• Needed for personal distributions subject to US tax withholding",
      "• Certified Acceptance Agent (CAA) verification process",
      "• DigiFormation offers optional ITIN filing add-on",
    ];

    itinPoints.forEach((pt, idx) => {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "18px sans-serif";
      ctx.fillText(pt, 130 + colW, 290 + idx * 56);
    });

    // Bottom Summary Banner
    ctx.fillStyle = "#0c172b";
    ctx.beginPath();
    ctx.roundRect(60, 810, w - 120, 80, 14);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓ TAX ARCHITECTURE LOCKED: EIN SECURED FOR BUSINESS OPERATIONS", w / 2, 858);
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
