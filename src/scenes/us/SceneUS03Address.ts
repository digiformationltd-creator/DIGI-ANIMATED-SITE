import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS03Address implements CinematicScene {
  public id = "scene-us-03-address";
  public title = "US Registered Agent & Address";
  public label = "03 ADDRESS";
  public kicker = "03 · STATUTORY US HEADQUARTERS";
  public description = "Appointing a Commercial Registered Agent and establishing an official physical address in Cheyenne, Wyoming. Meeting state legal mandates while preserving founder residential privacy with encrypted mail forwarding.";
  public statutoryNote = "Wyoming Registered Agent Act (W.S. 17-28-101) · Physical Street Address Mandate · Secure Digital Mail Vault";
  public metricBadge = "AGENT · WY-ACTIVE";
  public startProgress = 0.22;
  public endProgress = 0.33;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-03-ADDRESS",
    reelNumber: "03 / 09",
    chapterTitle: "US REGISTERED AGENT & ADDRESS",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "28mm Cooke S4/i",
    iso: 500,
    timecode: "00:03:30:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 3: REGISTERED AGENT APPOINTED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.5] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 36,
    },
    end: {
      position: [0.0, 1.15, 0.95] as [number, number, number],
      target: [0.0, 0.98, 0.0] as [number, number, number],
      fov: 26,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private plaqueMesh: THREE.Mesh | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1024;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTexture.minFilter = THREE.LinearFilter;
    this.canvasTexture.magFilter = THREE.LinearFilter;
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Brushed Aluminum & Glass Directory Plaque
    const plaqueGeo = new THREE.PlaneGeometry(1.4, 0.7);
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.25,
    });

    this.plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    this.plaqueMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.plaqueMesh);

    // Frame
    const frameGeo = new THREE.BoxGeometry(1.44, 0.74, 0.03);
    const frameMat = this.materials.getAnodizedAluminum();
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 1.05, -0.018);
    this.sceneGroup.add(frame);

    // Standoff Brass Bolts
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 16);
    const boltMat = this.materials.getArchitecturalBrass();
    const offsets = [
      [-0.67, 1.37],
      [0.67, 1.37],
      [-0.67, 0.73],
      [0.67, 0.73],
    ];

    offsets.forEach(([bx, by]) => {
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(bx, by, 0.015);
      this.sceneGroup.add(bolt);
    });

    // 2. Mail Sorting Dock (Tray with Envelopes)
    const trayGeo = new THREE.BoxGeometry(0.5, 0.04, 0.35);
    const trayMat = this.materials.getMatteBlackMetal();
    const tray = new THREE.Mesh(trayGeo, trayMat);
    tray.position.set(0, 0.65, 0.35);
    this.sceneGroup.add(tray);

    const paperMat = this.materials.getStatutoryPaper();
    for (let i = 0; i < 3; i++) {
      const envGeo = new THREE.BoxGeometry(0.24, 0.008, 0.14);
      const env = new THREE.Mesh(envGeo, paperMat);
      env.position.set(0.04 * (i - 1), 0.68 + i * 0.01, 0.35 + (i - 1) * 0.03);
      env.rotation.y = THREE.MathUtils.degToRad(i * 4 - 2);
      this.sceneGroup.add(env);
    }

    this.renderScreen(0);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.45 + (1.15 - 1.45) * t;
    const camZ = 1.5 + (0.95 - 1.5) * t;

    const targetX = 0.0;
    const targetY = 0.95 + (0.98 - 0.95) * t;
    const targetZ = 0.0;

    const fov = 36 + (26 - 36) * t;
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
    ctx.fillStyle = "#0c1322";
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid Inlay
    ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Top Header Badge
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(80, 50, w - 160, 70, 14);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("WYOMING REGISTERED AGENT STATUTORY DIRECTORY · COMMERCIAL OFFICE", 120, 94);

    // Entity Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VANCE APEX LLC", w / 2, 230);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("OFFICIAL US REGISTERED OFFICE & COMMERCIAL AGENT HEADQUARTERS", w / 2, 290);

    // Address Plaque Details
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 44px monospace";
    ctx.fillText("1621 Central Ave, Cheyenne, WY 82001", w / 2, 400);

    ctx.font = "26px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("UNITED STATES OF AMERICA · JURISDICTION OF WYOMING · RA-LICENSE #WY-82001", w / 2, 460);

    // 3 Feature Badges
    const badgeW = (w - 240) / 3;
    const features = [
      { title: "✓ STATUTORY AGENT INCLUDED", desc: "Meets Wyoming Secretary of State mandate" },
      { title: "✓ PRIVACY SHIELD", desc: "Personal home address kept off public state records" },
      { title: "✓ DIGITAL MAIL FORWARDING", desc: "HMRC/IRS/State mail scanned to encrypted client vault" },
    ];

    features.forEach((feat, idx) => {
      const bx = 80 + idx * (badgeW + 40);
      const by = 550;

      ctx.fillStyle = "#111c33";
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, 160, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "start";
      ctx.fillText(feat.title, bx + 24, by + 50);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "18px sans-serif";
      ctx.fillText(feat.desc, bx + 24, by + 95);
    });

    // Verification Seal at bottom
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(80, 770, w - 160, 80, 14);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      p > 0.4 ? "✓ COMMERCIAL REGISTERED AGENT RATIFIED · READY FOR ARTICLES OF ORGANIZATION FILING" : "AGENT ASSIGNMENT IN PROGRESS...",
      w / 2,
      820
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
