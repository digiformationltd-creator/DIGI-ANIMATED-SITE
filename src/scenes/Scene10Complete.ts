import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene10Complete implements CinematicScene {
  public id = "scene-10-complete";
  public title = "Sovereign Complete";
  public label = "10 LAUNCH";
  public kicker = "10 · ENTERPRISE ECOSYSTEM LIVE";
  public description = "The journey completes. Vance Technologies Ltd is officially incorporated, banked, digitally equipped, and ready for global commerce under English law.";
  public statutoryNote = "Company No. 16994903 · Fully Compliant · Ready for Global Business";
  public metricBadge = "STATUS: FULLY ACTIVE";
  public startProgress = 0.90;
  public endProgress = 1.00;

  public transition: SceneTransition = {
    type: "MATCH_CUT",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-10-COMPLETE",
    reelNumber: "10 / 10",
    chapterTitle: "SOVEREIGN COMPLETE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "24mm Master Prime",
    iso: 500,
    timecode: "00:10:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 10: SOVEREIGN LAUNCH",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.25, 1.2] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 36,
    },
    end: {
      position: [0.0, 1.75, 2.6] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 46,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private ctaMesh: THREE.Mesh | null = null;
  private logoImg: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1280;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    this.logoImg = new Image();
    this.logoImg.crossOrigin = "anonymous";
    this.logoImg.src = "/assets/brand/digiformation-logo-official.png";
    this.logoImg.onload = () => {
      this.renderCanvas();
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Sleek Central Table Display
    const tableGeo = new THREE.BoxGeometry(2.0, 0.04, 1.1);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.75, 0);
    this.sceneGroup.add(table);

    // 2. Leather Corporate Binder Portfolio
    const binderGeo = new THREE.BoxGeometry(0.44, 0.03, 0.62);
    const binderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.1 });
    const binder = new THREE.Mesh(binderGeo, binderMat);
    binder.position.set(-0.55, 0.77, 0.05);
    binder.rotation.y = THREE.MathUtils.degToRad(-10);
    this.sceneGroup.add(binder);

    // 3. Titanium Cards Stack
    const cardGeo = new THREE.BoxGeometry(0.18, 0.012, 0.12);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.2 });
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.position.set(-0.22, 0.772, 0.18);
    card.rotation.y = THREE.MathUtils.degToRad(15);
    this.sceneGroup.add(card);

    // 4. Central Large Interactive Brand & Launch Billboard
    this.renderCanvas();
    const ctaGeo = new THREE.PlaneGeometry(1.4, 0.88);
    const ctaMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.ctaMesh = new THREE.Mesh(ctaGeo, ctaMat);
    this.ctaMesh.position.set(0.12, 1.25, -0.15);
    this.sceneGroup.add(this.ctaMesh);

    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    // Epic wide pull-back into full architectural view
    const camX = 0.0;
    const camY = 1.25 + (1.75 - 1.25) * t;
    const camZ = 1.2 + (2.6 - 1.2) * t;

    const targetX = 0.0;
    const targetY = 0.95;
    const targetZ = 0.0;

    const fov = 36 + (46 - 36) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.renderCanvas();
  }

  private renderCanvas(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark titanium luxury backing
    ctx.fillStyle = "#070b14";
    ctx.fillRect(0, 0, w, h);

    // Top Brand Logo
    if (this.logoImg && this.logoImg.complete) {
      ctx.drawImage(this.logoImg, w / 2 - 140, 60, 280, 64);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DigiFormation", w / 2, 110);
      ctx.textAlign = "start";
    }

    // Grand Completion Title
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText("UK LTD FORMATION · COMPLETED ECOSYSTEM", w / 2, 180);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 58px sans-serif";
    ctx.fillText("Your UK Corporate Entity Is Live", w / 2, 255);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "26px sans-serif";
    ctx.fillText("Vance Technologies Ltd (Company No. 16994903) is officially registered, banked, and active.", w / 2, 310);

    // Summary Achievement Checklist (4 Badges)
    const badges = [
      { title: "COMPANIES HOUSE", desc: "Official Registrar Seal" },
      { title: "LONDON EC1 ADDRESS", desc: "Prestige Headquarters" },
      { title: "GLOBAL BANKING", desc: "Stripe & Wise Active" },
      { title: "HMRC TAX UTR", desc: "Corporation Tax Vault" },
    ];

    const bW = (w - 180) / 4;
    badges.forEach((b, idx) => {
      const bx = 60 + idx * (bW + 20);
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.roundRect(bx, 380, bW, 160, 14);
      ctx.fill();

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 20px monospace";
      ctx.fillText("✓ VERIFIED", bx + 30, 430);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(b.title, bx + 30, 470);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "18px sans-serif";
      ctx.fillText(b.desc, bx + 30, 505);
    });

    // Package Tier Selector Row (£50 / £120 / £200)
    const tiers = [
      { name: "Silver Package", price: "£50", highlight: "Companies House Filing Only" },
      { name: "Gold Package", price: "£120", highlight: "Filing + London Registered Office" },
      { name: "Platinum Package", price: "£200", highlight: "Full Corporate Kit + Banking + Web" },
    ];

    const tW = (w - 160) / 3;
    tiers.forEach((t, idx) => {
      const tx = 60 + idx * (tW + 20);
      const isPlat = idx === 2;

      ctx.fillStyle = isPlat ? "#1e293b" : "#0f172a";
      ctx.strokeStyle = isPlat ? "#38bdf8" : "#334155";
      ctx.lineWidth = isPlat ? 3 : 1;
      ctx.beginPath();
      ctx.roundRect(tx, 590, tW, 300, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isPlat ? "#38bdf8" : "#94a3b8";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(t.name, tx + 35, 650);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px sans-serif";
      ctx.fillText(t.price, tx + 35, 725);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "20px sans-serif";
      ctx.fillText(t.highlight, tx + 35, 785);

      ctx.fillStyle = isPlat ? "#10b981" : "#64748b";
      ctx.font = "bold 18px monospace";
      ctx.fillText(isPlat ? "★ MOST POPULAR CHOICE" : "STATUTORY ESSENTIALS", tx + 35, 840);
    });

    // Primary Call to Action Button
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 340, 960, 680, 90, 20);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("BEGIN YOUR UK FORMATION JOURNEY", w / 2, 1018);

    // Direct Contact Bar
    ctx.fillStyle = "#94a3b8";
    ctx.font = "22px sans-serif";
    ctx.fillText("Official Support: +44 7462 070281 · support@digiformation.co.uk · Fast-Track 24Hr Incorporation", w / 2, 1110);
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
