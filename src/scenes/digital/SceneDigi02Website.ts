import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneDigi02Website implements CinematicScene {
  public id = "scene-digi-02-website";
  public title = "High-Performance Modern Web";
  public label = "02 WEB APP";
  public kicker = "02 · SUB-100MS WEB PERFORMANCE";
  public description = "Sub-100ms first paint, edge-rendered React and TypeScript, automated responsive layouts, and integrated payment checkout.";
  public statutoryNote = "Google Lighthouse 100/100 · Zero Layout Shift (CLS 0.0) · Edge CDN";
  public metricBadge = "PERF: 100/100 · 42ms TTFB";
  public startProgress = 0.2;
  public endProgress = 0.4;

  public transition: SceneTransition = { type: "SCREEN", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-DIGI-02-WEB",
    reelNumber: "02 / 05",
    chapterTitle: "HIGH-PERFORMANCE MODERN WEB",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "45mm Prime",
    iso: 350,
    timecode: "00:02:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 2: FULL-STACK WEB",
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
      roughness: 0.95,
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

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // Browser Chrome Header
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, 70);

    // Window controls
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(45, 35, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(75, 35, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(105, 35, 8, 0, Math.PI * 2);
    ctx.fill();

    // URL bar
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(160, 16, 700, 38, 8);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 15px monospace";
    ctx.fillText("🔒 https://vanceapex.com · Production Edge", 185, 41);

    // Lighthouse badge
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(w - 320, 16, 260, 38, 8);
    ctx.fill();
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 15px monospace";
    ctx.fillText("LIGHTHOUSE: 100/100", w - 300, 41);

    // Main App Preview
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.stroke();

    // Hero inside website
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px monospace";
    ctx.fillText("NEXT-GEN COMMERCIAL PLATFORM", 110, 180);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 48px sans-serif";
    ctx.fillText("ENGINEERED FOR IMMEDIATE CONVERSION", 110, 245);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Built with React 19, TypeScript, Tailwind CSS, and edge caching across 280+ worldwide POPs.", 110, 290);

    // 3 Performance Metrics Cards
    const metrics = [
      { num: "42ms", label: "Time to First Byte (TTFB)", sub: "Edge CDN worldwide delivery" },
      { num: "0.4s", label: "Largest Contentful Paint", sub: "Instant hero element hydration" },
      { num: "0.00", label: "Cumulative Layout Shift", sub: "Strict dimensional reservation" },
    ];
    const mw = (w - 280) / 3;
    metrics.forEach((m, idx) => {
      const mx = 110 + idx * (mw + 30);
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(mx, 360, mw, 200, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "900 44px sans-serif";
      ctx.fillText(m.num, mx + 28, 435);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(m.label, mx + 28, 480);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(m.sub, mx + 28, 515);
    });

    // Integrated Checkout Bar
    ctx.fillStyle = "#162036";
    ctx.beginPath();
    ctx.roundRect(110, 610, w - 220, 180, 14);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("Embedded Universal Commerce & Stripe Rails", 150, 670);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("Direct API integration with Stripe Elements, Apple Pay, Google Pay, and localized currencies.", 150, 710);

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.roundRect(w - 360, 660, 210, 50, 10);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("ONE-CLICK BUY →", w - 330, 692);

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
