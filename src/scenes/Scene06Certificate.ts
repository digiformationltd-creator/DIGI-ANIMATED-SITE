import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene06Certificate implements CinematicScene {
  public id = "scene-06-certificate";
  public title = "Incorporation Seal";
  public label = "06 CREATED";
  public kicker = "06 · ROYAL INCORPORATION SEAL";
  public description = "A sovereign British corporation is born. The official Certificate of Incorporation is sealed under the Companies Act 2006 with Company Number 16994903.";
  public statutoryNote = "Companies Act 2006 s.15 · Conclusive Evidence of Incorporation · Royal Arms";
  public metricBadge = "CRN: 16994903 · ACTIVE";
  public startProgress = 0.50;
  public endProgress = 0.60;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-06-CERTIFICATE",
    reelNumber: "06 / 10",
    chapterTitle: "INCORPORATION SEAL",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "100mm Macro Cine",
    iso: 400,
    timecode: "00:06:38:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 6: CERTIFICATE ISSUED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.4] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 30,
    },
    end: {
      position: [0.0, 1.12, 0.65] as [number, number, number],
      target: [0.0, 0.88, 0.0] as [number, number, number],
      fov: 20,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private certGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1600;
    this.canvas.height = 2260; // Standard A4 legal aspect ratio (1:1.414)
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Executive Leather Portfolio Binder
    const folderGeo = new THREE.BoxGeometry(0.74, 0.02, 0.98);
    const folderMat = new THREE.MeshStandardMaterial({
      color: 0x0f1115, // Midnight Charcoal Leather
      roughness: 0.7,
      metalness: 0.1,
    });
    const folder = new THREE.Mesh(folderGeo, folderMat);
    folder.position.set(0, 0.76, 0);
    this.sceneGroup.add(folder);

    // Gold embossed trim on portfolio edge
    const trimGeo = new THREE.BoxGeometry(0.744, 0.005, 0.012);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0.772, 0.48);
    this.sceneGroup.add(trim);

    // 2. Physical Certificate of Incorporation on heavy parchment
    this.renderCertificate();
    const certGeo = new THREE.PlaneGeometry(0.62, 0.88);
    const certMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      roughness: 0.82,
      metalness: 0.05,
    });
    const cert = new THREE.Mesh(certGeo, certMat);
    cert.rotation.x = -Math.PI / 2;
    cert.position.set(0, 0.774, 0);
    this.certGroup.add(cert);

    // 3. Heavy Cast Brass Registrar Seal Plaque
    const sealGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.012, 32);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 0.95,
      roughness: 0.25,
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.set(0.22, 0.778, 0.32);
    this.certGroup.add(seal);

    this.sceneGroup.add(this.certGroup);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.45 + (1.12 - 1.45) * t;
    const camZ = 1.4 + (0.65 - 1.4) * t;

    const targetX = 0.0;
    const targetY = 0.95 + (0.88 - 0.95) * t;
    const targetZ = 0.0;

    const fov = 30 + (20 - 30) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    // Subtle breathing gleam on the parchment
    this.certGroup.rotation.y = Math.sin(sceneProgress * 0.4) * 0.012;
  }

  private renderCertificate(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Heavy archival cream parchment background
    ctx.fillStyle = "#faf7ee";
    ctx.fillRect(0, 0, w, h);

    // Formal Guilloche legal border
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 14;
    ctx.strokeRect(60, 60, w - 120, h - 120);

    ctx.strokeStyle = "#b45309"; // Gold fillet border
    ctx.lineWidth = 4;
    ctx.strokeRect(84, 84, w - 168, h - 168);

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(96, 96, w - 192, h - 192);

    // Royal Crest / Coat of Arms
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 34px serif";
    ctx.textAlign = "center";
    ctx.fillText("DIEU ET MON DROIT", w / 2, 220);

    ctx.fillStyle = "#b45309";
    ctx.font = "bold 26px serif";
    ctx.fillText("HONI SOIT QUI MAL Y PENSE", w / 2, 260);

    // Certificate Title
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 64px serif";
    ctx.fillText("CERTIFICATE OF INCORPORATION", w / 2, 380);

    ctx.font = "bold 40px serif";
    ctx.fillText("OF A PRIVATE LIMITED COMPANY", w / 2, 440);

    // Company Number Box
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(w / 2 - 320, 500, 640, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px monospace";
    ctx.fillText("Company Number: 16994903", w / 2, 555);

    // Legal Body Text
    ctx.fillStyle = "#334155";
    ctx.font = "34px serif";
    const bodyLines = [
      "The Registrar of Companies for England and Wales,",
      "hereby certifies that",
    ];

    bodyLines.forEach((line, idx) => {
      ctx.fillText(line, w / 2, 680 + idx * 60);
    });

    // Company Name in Grand Legal Script
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 72px serif";
    ctx.fillText("VANCE TECHNOLOGIES LTD", w / 2, 880);

    // Certification Clause
    ctx.fillStyle = "#334155";
    ctx.font = "32px serif";
    const certLines = [
      "is this day incorporated under the Companies Act 2006",
      "as a private company, that the company is limited by shares,",
      "and the situation of its registered office is in",
      "England and Wales.",
    ];

    certLines.forEach((line, idx) => {
      ctx.fillText(line, w / 2, 1020 + idx * 56);
    });

    // Given at Cardiff
    ctx.fillStyle = "#0f172a";
    ctx.font = "italic 36px serif";
    ctx.fillText("Given at Companies House, Cardiff.", w / 2, 1340);

    // Date
    ctx.font = "bold 36px serif";
    ctx.fillText("24th March 2026", w / 2, 1420);

    // Bottom Badges & Official Registrar Seal
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.arc(w / 2, 1720, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px serif";
    ctx.fillText("THE OFFICIAL SEAL OF", w / 2, 1690);
    ctx.fillText("THE REGISTRAR OF", w / 2, 1725);
    ctx.fillText("COMPANIES", w / 2, 1760);

    // Official Gazette Verification Notice
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 22px monospace";
    ctx.fillText("VERIFIED STATUTORY INSTRUMENT · COMPANIES ACT 2006 s.15", w / 2, 2040);
    ctx.fillText("DIGIFORMATION CLIENT REFERENCE: DF-UK-16994903-AUTH", w / 2, 2080);

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
