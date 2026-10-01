import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneComp01Active implements CinematicScene {
  public id = "scene-comp-01-active";
  public title = "Active Company Good Standing";
  public label = "01 STATUS";
  public kicker = "01 · STATUTORY ENTERPRISE AUDIT";
  public description = "Vance Technologies Ltd (No. 16994903) in active commercial status. Continuous monitoring of Companies House public registers and statutory obligations.";
  public statutoryNote = "Companies Act 2006 · Register of Companies · Good Standing Verification";
  public metricBadge = "STATUS: ACTIVE · GREEN";
  public startProgress = 0.0;
  public endProgress = 0.2;

  public transition: SceneTransition = { type: "PHYSICAL", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-COMP-01-STATUS",
    reelNumber: "01 / 05",
    chapterTitle: "ACTIVE COMPANY GOOD STANDING",
    shutterSpeed: "1/48s",
    aperture: "T1.8",
    focalLength: "35mm Prime",
    iso: 400,
    timecode: "00:01:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 1: CORPORATE AUDIT",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.8] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 38,
    },
    end: {
      position: [0.0, 1.15, 1.1] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 30,
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

    ctx.fillStyle = "#070c18";
    ctx.fillRect(0, 0, w, h);

    // Header bar
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGIFORMATION STATUTORY COMPLIANCE MONITOR · COMPANIES HOUSE API", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("LIVE REGISTRY SYNC: ACTIVE", w - 60, 44);
    ctx.textAlign = "start";

    // Main Card
    ctx.fillStyle = "#0f1b33";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.fillText("VANCE TECHNOLOGIES LTD", 110, 180);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px monospace";
    ctx.fillText("Company number: 16994903  ·  Incorporated: 14 February 2026", 110, 220);

    // 3 Status Badges
    const badges = [
      { k: "Company status", v: "Active", c: "#34d399" },
      { k: "Company type", v: "Private limited Company", c: "#ffffff" },
      { k: "Registered office", v: "71-75 Shelton Street, London, WC2H 9JQ", c: "#ffffff" },
    ];

    badges.forEach((b, idx) => {
      const bx = 110 + idx * 600;
      ctx.fillStyle = "#64748b";
      ctx.font = "16px sans-serif";
      ctx.fillText(b.k, bx, 280);

      ctx.fillStyle = b.c;
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(b.v, bx, 315);
    });

    // Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.moveTo(110, 360);
    ctx.lineTo(w - 110, 360);
    ctx.stroke();

    // Compliance Health Radar
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("Statutory Filing Calendar & Health Check", 110, 420);

    const filings = [
      { item: "Confirmation Statement (CS01)", due: "Due: 28 Feb 2027", next: "First statement date: 14 Feb 2027", status: "PENDING WINDOW" },
      { item: "Annual Statutory Accounts", due: "Due: 14 Nov 2027", next: "Period end: 28 Feb 2027", status: "SCHEDULED" },
      { item: "Companies House Auth Code", due: "Status: Active (6-Digit)", next: "Required for WebFiling updates", status: "VERIFIED" },
      { item: "Registered Office Address (AD01)", due: "London WC2H 9JQ", next: "Authorized corporate address", status: "COMPLIANT" },
    ];

    filings.forEach((f, idx) => {
      const fy = 470 + idx * 110;
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(110, fy, w - 220, 85, 10);
      ctx.fill();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`0${idx + 1}`, 140, fy + 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(f.item, 200, fy + 38);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "15px sans-serif";
      ctx.fillText(f.next, 200, fy + 65);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`● ${f.status}`, w - 160, fy + 48);
      ctx.textAlign = "start";
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
