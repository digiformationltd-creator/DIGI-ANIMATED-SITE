import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../types/cinema";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { MaterialFactory } from "../core/MaterialFactory";

export class Scene09TaxCredentials implements CinematicScene {
  public id = "scene-09-tax-credentials";
  public title = "Statutory Tax Credentials";
  public label = "09 UTR KEY";
  public kicker = "09 · HMRC CORPORATION TAX & VAULT";
  public description = "Statutory tax authority and digital filing security. HMRC Corporation Tax UTR generated and Companies House WebFiling Authentication Code locked in client vault.";
  public statutoryNote = "Finance Act · HMRC Corporation Tax Registration · WebFiling Key Auth";
  public metricBadge = "UTR: 94820 18402";
  public startProgress = 0.80;
  public endProgress = 0.90;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-09-TAX-CREDENTIALS",
    reelNumber: "09 / 10",
    chapterTitle: "STATUTORY TAX CREDENTIALS",
    shutterSpeed: "1/48s",
    aperture: "T2.8",
    focalLength: "50mm Hasselblad",
    iso: 400,
    timecode: "00:09:05:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 9: TAX UTR & VAULT SECURED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.55, 1.1] as [number, number, number],
      target: [0.0, 0.92, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.25, 0.65] as [number, number, number],
      target: [0.0, 0.88, 0.0] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private letterGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private hmrcLogo: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1500;
    this.canvas.height = 2000;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    this.hmrcLogo = new Image();
    this.hmrcLogo.crossOrigin = "anonymous";
    this.hmrcLogo.src = "/assets/partners/hmrc.png";
    this.hmrcLogo.onload = () => {
      this.renderLetter();
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Executive Leather Desk Surface Pad
    const padGeo = new THREE.BoxGeometry(1.2, 0.015, 0.85);
    const padMat = this.materials.getLeatherDeskMat();
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(0, 0.76, 0);
    this.sceneGroup.add(pad);

    // 2. Physical Official HMRC Letter
    this.renderLetter();
    const letterGeo = new THREE.PlaneGeometry(0.58, 0.78);
    const letterMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      roughness: 0.85,
      metalness: 0.05,
    });
    const letter = new THREE.Mesh(letterGeo, letterMat);
    letter.rotation.x = -Math.PI / 2;
    letter.position.set(-0.16, 0.77, 0);
    this.letterGroup.add(letter);

    // 3. WebFiling Authentication Code Security Key Card
    const cardGeo = new THREE.BoxGeometry(0.24, 0.008, 0.15);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Obsidian Black
      metalness: 0.9,
      roughness: 0.2,
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.position.set(0.32, 0.772, 0.05);
    card.rotation.y = THREE.MathUtils.degToRad(-15);
    this.letterGroup.add(card);

    // Glowing Emerald Vault Stamping Emblem on card
    const badgeGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.004, 24);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.8 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0.32, 0.778, 0.05);
    this.letterGroup.add(badge);

    this.sceneGroup.add(this.letterGroup);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.55 + (1.25 - 1.55) * t;
    const camZ = 1.1 + (0.65 - 1.1) * t;

    const targetX = 0.0;
    const targetY = 0.92 + (0.88 - 0.92) * t;
    const targetZ = 0.0;

    const fov = 34 + (24 - 34) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.letterGroup.rotation.y = Math.sin(sceneProgress * 0.4) * 0.01;
  }

  private renderLetter(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Archival stationery white
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);

    // HMRC Logo / Header
    if (this.hmrcLogo && this.hmrcLogo.complete) {
      ctx.drawImage(this.hmrcLogo, 80, 80, 240, 68);
    } else {
      ctx.fillStyle = "#007a3d";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("HM Revenue & Customs", 80, 120);
    }

    ctx.fillStyle = "#1e293b";
    ctx.font = "22px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Corporation Tax Services", w - 80, 100);
    ctx.fillText("HM Revenue & Customs, BX9 1AX", w - 80, 130);
    ctx.fillText("Date: 25 March 2026", w - 80, 160);
    ctx.textAlign = "start";

    // Recipient Address
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("The Directors", 80, 260);
    ctx.fillText("Vance Technologies Ltd", 80, 295);
    ctx.font = "24px sans-serif";
    ctx.fillText("Office 1006, 85 Dunstall Hill, Wolverhampton & London EC1", 80, 330);

    // Subject Bar
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("Notice of New Company & Unique Taxpayer Reference (UTR)", 80, 440);

    // Golden UTR Box
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(80, 500, w - 160, 160, 16);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("CORPORATION TAX UNIQUE TAXPAYER REFERENCE (UTR)", 120, 550);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px monospace";
    ctx.fillText("94820 18402", 120, 620);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("✓ HMRC STATUS: ACTIVE", w - 120, 610);
    ctx.textAlign = "start";

    // Explanatory Legal Body
    ctx.fillStyle = "#334155";
    ctx.font = "24px sans-serif";
    const body = [
      "Companies House has notified us that your new company was registered on 24 March 2026.",
      "Company registration number: 16994903.",
      "",
      "Your company is automatically enrolled for Corporation Tax with HM Revenue and Customs.",
      "Please keep this reference safe. You will need your UTR when filing company tax returns",
      "and communicating with HMRC.",
    ];

    body.forEach((line, idx) => {
      ctx.fillText(line, 80, 740 + idx * 45);
    });

    // WebFiling Key Section
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(80, 1100, w - 160, 220, 16);
    ctx.fill();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px monospace";
    ctx.fillText("COMPANIES HOUSE WEB-FILING AUTHENTICATION KEY", 120, 1160);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px monospace";
    ctx.fillText("W8F-92X", 120, 1240);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Required for filing Annual Confirmation Statements and Director appointments", 120, 1285);

    // Vault Security Seal
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(80, 1420, w - 160, 120, 16);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("🔒 CREDENTIALS SAFELY ENCRYPTED IN DIGIFORMATION CLIENT VAULT", 120, 1490);

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
