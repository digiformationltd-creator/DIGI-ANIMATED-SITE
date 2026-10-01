import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneComp02Due implements CinematicScene {
  public id = "scene-comp-02-due";
  public title = "Confirmation Statement & Accounts Due";
  public label = "02 OBLIGATIONS";
  public kicker = "02 · ANNUAL STATUTORY DEADLINES";
  public description = "Companies House triggers statutory filing windows for Confirmation Statement (CS01) and Annual Accounts. Failure to submit risks financial penalties and strike-off.";
  public statutoryNote = "Section 853A Companies Act 2006 · 14-day statutory delivery period";
  public metricBadge = "ALERT: FILING WINDOW OPEN";
  public startProgress = 0.2;
  public endProgress = 0.4;

  public transition: SceneTransition = { type: "SCREEN", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-COMP-02-DUE",
    reelNumber: "02 / 05",
    chapterTitle: "ANNUAL FILING DEADLINES",
    shutterSpeed: "1/48s",
    aperture: "T1.8",
    focalLength: "45mm Prime",
    iso: 450,
    timecode: "00:02:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 2: STATUTORY REMINDERS",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.35, 1.5] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.1, 0.95] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 26,
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
    this.renderScreen();
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const tableGeo = new THREE.BoxGeometry(2.0, 0.04, 1.1);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.75, 0);
    this.sceneGroup.add(table);

    const screenGeo = new THREE.PlaneGeometry(1.2, 0.68);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.9,
      roughness: 0.55,
      metalness: 0.0,
    });
    this.monitorMesh = new THREE.Mesh(screenGeo, screenMat);
    this.monitorMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.monitorMesh);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private renderScreen(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 20px monospace";
    ctx.fillText("COMPANIES HOUSE STATUTORY DEADLINE SYSTEM", 60, 44);

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("ACTION REQUIRED WITHIN 14 DAYS", w - 60, 44);
    ctx.textAlign = "start";

    // Warning Banner
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.roundRect(60, 100, w - 120, 90, 12);
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("⚠️ UPCOMING STATUTORY OBLIGATIONS · CONFIRMATION STATEMENT (CS01)", 100, 140);
    ctx.fillStyle = "#fde68a";
    ctx.font = "16px sans-serif";
    ctx.fillText("A confirmation statement must be delivered no later than 14 days after the end of your review period.", 100, 168);

    // 2 Large Filing Detail Panels
    const pw = (w - 160) / 2;

    // Panel 1: CS01
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(60, 220, pw, 780, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("FILING 01 · FORM CS01", 90, 270);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 30px sans-serif";
    ctx.fillText("Confirmation Statement", 90, 315);

    const csPoints = [
      { label: "Statutory Purpose", val: "Confirms directors, shareholders, PSC, and SIC code remain current" },
      { label: "Review Period Ends", val: "14 February (Annual)" },
      { label: "Filing Deadline", val: "28 February (Strict 14-day limit)" },
      { label: "Companies House Fee", val: "£34 standard digital tariff included" },
      { label: "Failure Consequence", val: "Criminal offense for directors + striking-off danger" },
    ];

    csPoints.forEach((p, idx) => {
      const py = 370 + idx * 75;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(p.label, 90, py);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 17px monospace";
      ctx.fillText(p.val, 90, py + 26);
    });

    // Panel 2: Accounts
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(100 + pw, 220, pw, 780, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 20px monospace";
    ctx.fillText("FILING 02 · ANNUAL ACCOUNTS", 130 + pw, 270);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 30px sans-serif";
    ctx.fillText("Dormant / Micro-Entity Accounts", 130 + pw, 315);

    const accPoints = [
      { label: "Accounting Reference Date", val: "28 February annually" },
      { label: "First Accounts Deadline", val: "Within 21 months of incorporation" },
      { label: "Subsequent Accounts", val: "Within 9 months of financial year end" },
      { label: "Late Filing Penalty", val: "£150 to £1,500 automatic civil penalty" },
      { label: "DigiFormation Guarantee", val: "Automated preparation & digital gateway lodgement" },
    ];

    accPoints.forEach((p, idx) => {
      const py = 370 + idx * 75;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(p.label, 130 + pw, py);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 17px monospace";
      ctx.fillText(p.val, 130 + pw, py + 26);
    });

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void { this.sceneGroup.visible = true; }
  public exit(): void { this.sceneGroup.visible = false; }
  public update(sceneProgress: number, globalProgress: number, delta: number): void {}
  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
