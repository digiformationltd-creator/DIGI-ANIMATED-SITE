import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene03Verification implements CinematicScene {
  public id = "scene-03-verification";
  public title = "Biometric Compliance";
  public label = "03 VERIFY";
  public kicker = "03 · ECCT ACT 2023 COMPLIANCE";
  public description = "Mandatory UK Economic Crime and Corporate Transparency Act 2023 verification. Direct optical passport MRZ extraction and live biometric liveness validation.";
  public statutoryNote = "ECCT Act 2023 · Level 3 Anti-Money Laundering · High-Assurance KYC";
  public metricBadge = "AML LEVEL 3 · PASSED";
  public startProgress = 0.20;
  public endProgress = 0.30;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-03-VERIFICATION",
    reelNumber: "03 / 10",
    chapterTitle: "BIOMETRIC COMPLIANCE",
    shutterSpeed: "1/48s",
    aperture: "T1.5",
    focalLength: "85mm Supreme Prime",
    iso: 640,
    timecode: "00:03:55:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 3: BIOMETRIC SCANNING",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.8] as [number, number, number],
      target: [0.0, 0.92, 0.0] as [number, number, number],
      fov: 32,
    },
    end: {
      position: [0.0, 1.15, 0.85] as [number, number, number],
      target: [0.0, 0.88, 0.0] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private scanLaser: THREE.Mesh | null = null;
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private passportMesh: THREE.Mesh | null = null;
  private selfieMesh: THREE.Mesh | null = null;
  private idMesh: THREE.Mesh | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const texLoader = new THREE.TextureLoader();

    // 1. Sleek Optical Compliance Bed on Desk
    const bedGeo = new THREE.BoxGeometry(1.4, 0.03, 0.9);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x080b11,
      roughness: 0.3,
      metalness: 0.8,
    });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, 0.75, 0);
    this.sceneGroup.add(bed);

    // Glowing cyan optical scanning grid surface
    const gridGeo = new THREE.PlaneGeometry(1.36, 0.86);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, 0.766, 0);
    this.sceneGroup.add(grid);

    // 2. Real Passport Document
    const passportTex = texLoader.load("/assets/verification/example-passport.jpg");
    passportTex.colorSpace = THREE.SRGBColorSpace;
    const passportMat = new THREE.MeshStandardMaterial({
      map: passportTex,
      roughness: 0.4,
      metalness: 0.1,
    });
    const passportGeo = new THREE.BoxGeometry(0.38, 0.008, 0.26);
    this.passportMesh = new THREE.Mesh(passportGeo, passportMat);
    this.passportMesh.position.set(-0.35, 0.772, 0);
    this.passportMesh.rotation.y = THREE.MathUtils.degToRad(-5);
    this.sceneGroup.add(this.passportMesh);

    // 3. Real Biometric Liveness Verification Selfie
    const selfieTex = texLoader.load("/assets/verification/example-holding-selfie.jpg");
    selfieTex.colorSpace = THREE.SRGBColorSpace;
    const selfieMat = new THREE.MeshStandardMaterial({
      map: selfieTex,
      roughness: 0.4,
    });
    const selfieGeo = new THREE.BoxGeometry(0.24, 0.008, 0.32);
    this.selfieMesh = new THREE.Mesh(selfieGeo, selfieMat);
    this.selfieMesh.position.set(0.35, 0.772, 0);
    this.selfieMesh.rotation.y = THREE.MathUtils.degToRad(8);
    this.sceneGroup.add(this.selfieMesh);

    // 4. National ID Card in Center
    const idTex = texLoader.load("/assets/verification/example-id-front.jpg");
    idTex.colorSpace = THREE.SRGBColorSpace;
    const idMat = new THREE.MeshStandardMaterial({
      map: idTex,
      roughness: 0.35,
      metalness: 0.2,
    });
    const idGeo = new THREE.BoxGeometry(0.22, 0.006, 0.14);
    this.idMesh = new THREE.Mesh(idGeo, idMat);
    this.idMesh.position.set(0.0, 0.772, -0.02);
    this.sceneGroup.add(this.idMesh);

    // 5. Animated Cyan Optical Laser Scanning Beam
    const laserGeo = new THREE.BoxGeometry(1.36, 0.004, 0.015);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    this.scanLaser = new THREE.Mesh(laserGeo, laserMat);
    this.scanLaser.position.set(0, 0.78, -0.4);
    this.sceneGroup.add(this.scanLaser);

    // 6. Floating Status HUD Hologram Plane
    const hudGeo = new THREE.PlaneGeometry(0.9, 0.45);
    const hudMat = new THREE.MeshBasicMaterial({
      map: this.canvasTexture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const hudMesh = new THREE.Mesh(hudGeo, hudMat);
    hudMesh.position.set(0, 1.15, -0.25);
    this.sceneGroup.add(hudMesh);

    this.renderHud(0);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.45 + (1.15 - 1.45) * t;
    const camZ = 1.8 + (0.85 - 1.8) * t;

    const targetX = 0.0;
    const targetY = 0.92 + (0.88 - 0.92) * t;
    const targetZ = 0.0;

    const fov = 32 + (24 - 32) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    // Animate laser scanning beam back and forth across the documents
    if (this.scanLaser) {
      const zPos = -0.35 + Math.sin(sceneProgress * Math.PI * 3) * 0.35;
      this.scanLaser.position.z = zPos;
    }

    this.renderHud(sceneProgress);

    if (sceneProgress < 0.6) {
      this.kicker = "03 · OPTICAL SCANNING ACTIVE";
      this.description = "Scanning biometric security features: MRZ checksums, microtext, chip encryption, and liveness verification.";
      this.telemetry.statutoryStep = "STEP 3: OPTICAL EXTRACTION";
    } else {
      this.kicker = "03 · ECCT ACT 2023 CLEARED";
      this.description = "All statutory identity verifications passed. Level 3 AML compliance token cryptographically signed.";
      this.telemetry.statutoryStep = "STEP 3: AML CLEARED";
    }
  }

  private renderHud(p: number): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Dark glass backing
    ctx.fillStyle = "rgba(7, 12, 22, 0.88)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(40, 40, w - 80, h - 80, 24);
    ctx.fill();
    ctx.stroke();

    // Top Title
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 32px monospace";
    ctx.fillText("UK STATUTORY COMPLIANCE PORTAL", 80, 110);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("ECCT Act 2023 Identity Verification", 80, 175);

    // Scan Metrics Grid
    const items = [
      { label: "PASSPORT MRZ CHECKSUM", status: p > 0.3 ? "VERIFIED (GBR-98401)" : "SCANNING..." },
      { label: "BIOMETRIC FACIAL MATCH", status: p > 0.5 ? "99.8% CONFIDENCE" : "EXTRACTING..." },
      { label: "CHIP CRYPTOGRAPHIC KEY", status: p > 0.7 ? "AUTHENTICATED" : "READING..." },
      { label: "SANCTIONS & PEP SCREENING", status: p > 0.85 ? "CLEAR (0 MATCHES)" : "CROSS-REFERENCING..." },
    ];

    items.forEach((item, idx) => {
      const y = 260 + idx * 110;
      ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
      ctx.beginPath();
      ctx.roundRect(80, y, w - 160, 85, 14);
      ctx.fill();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 24px monospace";
      ctx.fillText(item.label, 110, y + 52);

      const isDone = item.status.includes("VERIFIED") || item.status.includes("CONFIDENCE") || item.status.includes("AUTHENTICATED") || item.status.includes("CLEAR");
      ctx.fillStyle = isDone ? "#34d399" : "#fbbf24";
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(item.status, w - 110, y + 52);
      ctx.textAlign = "start";
    });

    // Final Compliance Badge
    if (p >= 0.85) {
      ctx.fillStyle = "rgba(6, 78, 59, 0.9)";
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(80, h - 220, w - 160, 110, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 36px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("✓ IDENTITY VERIFIED · STATUTORY FILING PERMITTED", w / 2, h - 150);
      ctx.textAlign = "start";
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
