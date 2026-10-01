import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene07SoftwareForge implements CinematicScene {
  public id = "scene-07-software-forge";
  public title = "Enterprise Software Forge";
  public label = "07 WEBSITE";
  public kicker = "07 · BESPOKE DIGITAL PRESENCE";
  public description = "Beyond incorporation. An enterprise IT web platform and cloud deployment engineered, responsive across every viewport, and propagated to global edge CDNs.";
  public statutoryNote = "ISO/IEC 27001 Certified Infrastructure · Edge CDN · SSL Secured";
  public metricBadge = "EDGE CDN · LIVE";
  public startProgress = 0.60;
  public endProgress = 0.70;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-07-SOFTWARE-FORGE",
    reelNumber: "07 / 10",
    chapterTitle: "SOFTWARE FORGE",
    shutterSpeed: "1/48s",
    aperture: "T1.8",
    focalLength: "35mm Arri Signature",
    iso: 500,
    timecode: "00:07:22:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 7: CLOUD INFRASTRUCTURE",
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
  private webHeroImg: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1152;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    this.webHeroImg = new Image();
    this.webHeroImg.crossOrigin = "anonymous";
    this.webHeroImg.src = "/assets/heroes/card-hero-web.jpg";
    this.webHeroImg.onload = () => {
      this.renderScreen(0);
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Curved 5K Ultrawide Display
    const screenGeo = new THREE.PlaneGeometry(1.3, 0.72);
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
    const bezelGeo = new THREE.BoxGeometry(1.32, 0.74, 0.03);
    const bezelMat = this.materials.getMatteBlackMetal();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.016);
    this.sceneGroup.add(bezel);

    // Stand
    const standGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.45, 16);
    const stand = new THREE.Mesh(standGeo, bezelMat);
    stand.position.set(0, 0.825, -0.04);
    this.sceneGroup.add(stand);

    // 2. Mechanical Ergonomic Keyboard in Foreground
    const kbGeo = new THREE.BoxGeometry(0.48, 0.02, 0.16);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x11141a, roughness: 0.7 });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(0, 0.75, 0.28);
    this.sceneGroup.add(kb);

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
  }

  private renderScreen(p: number): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Split IDE / Live Production Canvas
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, w, h);

    // Top Chrome Bar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, 60);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("VANCE TECHNOLOGIES LTD · ENTERPRISE CLOUD FORGE · PRODUCTION DEPLOY", 60, 38);

    const halfW = (w - 60) / 2;

    // Left Panel: Live Terminal / Code Build
    ctx.fillStyle = "#050912";
    ctx.beginPath();
    ctx.roundRect(30, 80, halfW, h - 110, 16);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.font = "20px monospace";
    ctx.fillText("> vance-cloud@2.4.0 build", 60, 140);
    ctx.fillText("> tsc --project tsconfig.json && vite build", 60, 180);

    ctx.fillStyle = "#60a5fa";
    ctx.fillText("✓ 2,418 enterprise modules compiled in 1.48s", 60, 240);
    ctx.fillText("✓ Type checking complete: 0 errors, 0 warnings", 60, 280);
    ctx.fillText("✓ SSL certificates generated via Let's Encrypt CA", 60, 320);

    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Deploying to Global Edge Nodes:", 60, 380);
    ctx.fillText("  • London (LHR-1):     4ms   [100% HEALTHY]", 60, 420);
    ctx.fillText("  • Frankfurt (FRA-2):  12ms  [100% HEALTHY]", 60, 460);
    ctx.fillText("  • New York (JFK-1):   19ms  [100% HEALTHY]", 60, 500);
    ctx.fillText("  • Singapore (SIN-1):  34ms  [100% HEALTHY]", 60, 540);

    // Edge Latency Meter
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(60, 600, halfW - 60, 40, 8);
    ctx.fill();

    const progW = (halfW - 60) * Math.min(1, 0.4 + p * 0.6);
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.roundRect(60, 600, progW, 40, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    ctx.fillText("GLOBAL EDGE STATUS: 100% DEPLOYED", 80, 628);

    // Right Panel: Live Responsive Web Portal Preview
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(40 + halfW, 80, halfW, h - 110, 16);
    ctx.fill();

    if (this.webHeroImg && this.webHeroImg.complete) {
      ctx.drawImage(this.webHeroImg, 60 + halfW, 100, halfW - 40, 420);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("Vance Technologies Cloud", 60 + halfW, 580);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText("Autonomous UK Cloud Computing & IT Solutions", 60 + halfW, 630);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("HTTPS://WWW.VANCETECH.CO.UK · COMPANY NO. 16994903", 60 + halfW, 700);

    // Live Badge
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(60 + halfW, 760, 320, 60, 12);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("✓ LIVE IN PRODUCTION", 90 + halfW, 800);

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
