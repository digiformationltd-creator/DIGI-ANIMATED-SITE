import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene04Address implements CinematicScene {
  public id = "scene-04-address";
  public title = "UK Headquarters";
  public label = "04 ADDRESS";
  public kicker = "04 · PRESTIGE REGISTERED OFFICE";
  public description = "A sovereign legal anchor in the United Kingdom. Office 1006, 85 Dunstall Hill, Wolverhampton & London EC1 directory presence and daily statutory mail scanning.";
  public statutoryNote = "Companies Act 2006 s.86 · Official Registered Office · Director Privacy";
  public metricBadge = "LONDON EC1 · ACTIVATED";
  public startProgress = 0.30;
  public endProgress = 0.40;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-04-ADDRESS",
    reelNumber: "04 / 10",
    chapterTitle: "UK HEADQUARTERS",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "28mm Cooke S4/i",
    iso: 500,
    timecode: "00:04:48:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 4: PHYSICAL HEADQUARTERS",
  };

  public cameraWaypoints = {
    start: {
      position: [0.65, 1.45, 1.6] as [number, number, number],
      target: [0.0, 1.05, 0.0] as [number, number, number],
      fov: 38,
    },
    end: {
      position: [0.15, 1.15, 0.95] as [number, number, number],
      target: [0.0, 1.02, 0.0] as [number, number, number],
      fov: 28,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private plaqueGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1536;
    this.canvas.height = 1024;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Portland Stone / Architectural Limestone wall
    const wallGeo = new THREE.BoxGeometry(3.6, 2.4, 0.15);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e26,
      roughness: 0.85,
      metalness: 0.1,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 1.2, -0.4);
    this.sceneGroup.add(wall);

    // 2. Heavy Solid Brushed Brass Plaque Backplate
    const plaqueBackGeo = new THREE.BoxGeometry(1.22, 0.78, 0.03);
    const plaqueBackMat = new THREE.MeshStandardMaterial({
      color: 0xc89b3c, // Rich British Architectural Brass
      metalness: 0.88,
      roughness: 0.28,
    });
    const plaqueBack = new THREE.Mesh(plaqueBackGeo, plaqueBackMat);
    plaqueBack.position.set(0, 1.15, -0.3);
    this.plaqueGroup.add(plaqueBack);

    // 3. Frosted Glass Faceplate with Brass Standoff Bolts
    this.renderPlaque();
    const faceGeo = new THREE.PlaneGeometry(1.18, 0.74);
    const faceMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      roughness: 0.2,
      metalness: 0.2,
    });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, 1.15, -0.28);
    this.plaqueGroup.add(face);

    // 4 Corner Brass Standoff Bolts
    const boltMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.95, roughness: 0.15 });
    const boltGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.04, 16);
    const boltOffsets = [
      [-0.56, 0.34],
      [0.56, 0.34],
      [-0.56, -0.34],
      [0.56, -0.34],
    ];

    boltOffsets.forEach(([x, y]) => {
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(x, 1.15 + y, -0.275);
      this.plaqueGroup.add(bolt);
    });

    this.sceneGroup.add(this.plaqueGroup);

    // 4. Solid Oak Mail Sorter Console beneath plaque
    const consoleGeo = new THREE.BoxGeometry(1.6, 0.72, 0.6);
    const consoleMat = this.materials.getDarkWalnutWood();
    const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
    consoleMesh.position.set(0, 0.36, -0.05);
    this.sceneGroup.add(consoleMesh);

    // 5. Official Envelopes (HMRC & Companies House mail)
    const envMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });
    const envGeo = new THREE.BoxGeometry(0.24, 0.012, 0.16);

    const env1 = new THREE.Mesh(envGeo, envMat);
    env1.position.set(-0.25, 0.73, 0.05);
    env1.rotation.y = THREE.MathUtils.degToRad(14);
    this.sceneGroup.add(env1);

    const env2 = new THREE.Mesh(envGeo, envMat);
    env2.position.set(-0.22, 0.742, 0.06);
    env2.rotation.y = THREE.MathUtils.degToRad(-8);
    this.sceneGroup.add(env2);

    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.65 + (0.15 - 0.65) * t;
    const camY = 1.45 + (1.15 - 1.45) * t;
    const camZ = 1.6 + (0.95 - 1.6) * t;

    const targetX = 0.0;
    const targetY = 1.05 + (1.02 - 1.05) * t;
    const targetZ = 0.0;

    const fov = 38 + (28 - 38) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    // Subtle brass plaque gleam
    this.plaqueGroup.rotation.y = Math.sin(sceneProgress * 0.5) * 0.015;
  }

  private renderPlaque(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark slate tinted glass
    ctx.fillStyle = "#0d131f";
    ctx.fillRect(0, 0, w, h);

    // Outer double brass gold border
    ctx.strokeStyle = "#c89b3c";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, w - 90, h - 90);

    // Crown / Crest header
    ctx.fillStyle = "#dfb15b";
    ctx.font = "bold 28px serif";
    ctx.textAlign = "center";
    ctx.fillText("HER MAJESTY'S REALM · JURISDICTION OF ENGLAND & WALES", w / 2, 120);

    // Company Directory Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px serif";
    ctx.fillText("VANCE TECHNOLOGIES LTD", w / 2, 230);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("OFFICIAL UK REGISTERED OFFICE & STATUTORY ADDRESS", w / 2, 310);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "38px sans-serif";
    ctx.fillText("Office 1006, 85 Dunstall Hill, Wolverhampton & London EC1", w / 2, 420);

    ctx.font = "28px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("COMPANIES ACT 2006 COMPLIANT · DIRECTOR SERVICE ADDRESS ENABLED", w / 2, 510);

    // Status Badges at bottom
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(120, 620, w - 240, 180, 16);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("✓ DAILY STATUTORY MAIL SCANNING & ENCRYPTED FORWARDING", w / 2, 700);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "26px sans-serif";
    ctx.fillText("HMRC and Companies House statutory notices digitally secured within 1 hour of delivery", w / 2, 755);

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
