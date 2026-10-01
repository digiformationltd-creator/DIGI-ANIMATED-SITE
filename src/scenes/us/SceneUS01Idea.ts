import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { ProceduralWorkspace } from "../../environment/ProceduralWorkspace";
import { HardwarePrimitives } from "../../environment/HardwarePrimitives";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS01Idea implements CinematicScene {
  public id = "scene-us-01-idea";
  public title = "The American Business Idea";
  public label = "01 IDEA";
  public kicker = "01 · US MARKET EXPANSION";
  public description = "In a modern executive workspace, a founder evaluates establishing a United States legal presence. Navigating state jurisdictional boundaries and federal tax structures, he initiates the US LLC formation journey.";
  public statutoryNote = "United States Commercial Law · Limited Liability Company (LLC) · Pass-Through Taxation";
  public metricBadge = "JURISDICTION · US-LLC";
  public startProgress = 0.0;
  public endProgress = 0.11;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-01-IDEA",
    reelNumber: "01 / 09",
    chapterTitle: "THE AMERICAN BUSINESS IDEA",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "50mm Master Prime",
    iso: 800,
    timecode: "00:01:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 1: US EXPANSION INITIATED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 2.25, 4.2] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 46,
    },
    end: {
      position: [0.0, 0.965, 0.22] as [number, number, number],
      target: [0.0, 0.965, -0.08] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private workspace: ProceduralWorkspace | null = null;
  private hardware: HardwarePrimitives = new HardwarePrimitives();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private monitorMesh: THREE.Mesh | null = null;
  private logoImg: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1280;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTexture.minFilter = THREE.LinearFilter;
    this.canvasTexture.magFilter = THREE.LinearFilter;

    this.logoImg = new Image();
    this.logoImg.crossOrigin = "anonymous";
    this.logoImg.src = "/assets/brand/digiformation-logo-official.png";
    this.logoImg.onload = () => {
      this.renderScreen(0);
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Executive Workspace Architecture
    this.workspace = new ProceduralWorkspace();
    this.sceneGroup.add(this.workspace.getGroup());

    // 2. Large 32" 4K Curved Display on Desk
    const screenGeo = new THREE.PlaneGeometry(1.2, 0.75);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.1,
    });
    this.monitorMesh = new THREE.Mesh(screenGeo, screenMat);
    this.monitorMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.monitorMesh);

    const bezelGeo = new THREE.BoxGeometry(1.22, 0.77, 0.02);
    const bezelMat = this.materials.getAnodizedAluminum();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.012);
    this.sceneGroup.add(bezel);

    // 3. Desk Accessories (Smartphone, Executive Notebook, Coffee)
    const phone = this.hardware.createSmartphone();
    phone.position.set(0.55, 0.775, 0.2);
    phone.rotation.y = THREE.MathUtils.degToRad(-18);
    this.sceneGroup.add(phone);

    const cup = this.hardware.createCoffeeCup();
    cup.position.set(-0.55, 0.775, 0.05);
    this.sceneGroup.add(cup);

    this.renderScreen(0);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 2.05 + (1.05 - 2.05) * t;
    const camZ = 3.6 + (1.4 - 3.6) * t;

    const targetX = 0.0;
    const targetY = 0.95 + (1.05 - 0.95) * t;
    const targetZ = 0.0;

    const fov = 44 + (30 - 44) * t;
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
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // Browser Chrome Header
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, w, 90);

    // Browser URL Pill
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.roundRect(w * 0.25, 20, w * 0.5, 50, 25);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px monospace";
    ctx.fillText("🔒 https://www.digiformation.co.uk/us-llc-formation", w * 0.25 + 30, 52);

    // DigiFormation Brand Logo
    if (this.logoImg && this.logoImg.complete) {
      ctx.drawImage(this.logoImg, 50, 24, 180, 42);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("DigiFormation", 50, 58);
    }

    // Flag / Jurisdiction Badge
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(w - 240, 20, 190, 50, 12);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px monospace";
    ctx.fillText("🇺🇸 UNITED STATES", w - 220, 52);

    // Hero Headline
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 22px monospace";
    ctx.fillText("STAGE 01 / 09 · US STRATEGIC EXPANSION", 80, 160);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText("Form Your US Limited Liability Company", 80, 230);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText(
      "Establish a sovereign legal footprint in the United States. Access global capital, US Stripe accounts, and domestic ACH rails.",
      80,
      280
    );

    // 3 Value Pillar Cards
    const cardWidth = (w - 220) / 3;
    const cards = [
      {
        title: "01 · CHOOSE YOUR STATE",
        desc: "Compare Wyoming, Delaware & New Mexico for privacy, asset protection and zero state tax.",
        accent: "#38bdf8",
      },
      {
        title: "02 · FEDERAL EIN & ITIN",
        desc: "Direct IRS Form SS-4 filing for your official Federal Employer Identification Number.",
        accent: "#a855f7",
      },
      {
        title: "03 · US FINTECH RAILS",
        desc: "Seamless connectivity with Mercury, Relay, Wise US, Airwallex and domestic ACH settlement.",
        accent: "#10b981",
      },
    ];

    cards.forEach((card, idx) => {
      const x = 80 + idx * (cardWidth + 30);
      const y = 350;

      ctx.fillStyle = "#111827";
      ctx.strokeStyle = idx === 0 && p > 0.4 ? "#38bdf8" : "#1f2937";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, cardWidth, 420, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = card.accent;
      ctx.font = "bold 20px monospace";
      ctx.fillText(card.title, x + 30, y + 60);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(idx === 0 ? "Wyoming / DE" : idx === 1 ? "IRS Federal Tax" : "USD Banking", x + 30, y + 120);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "22px sans-serif";
      this.wrapText(ctx, card.desc, x + 30, y + 180, cardWidth - 60, 34);

      // Interactive status indicator at card bottom
      ctx.fillStyle = idx === 0 && p > 0.4 ? "rgba(56, 189, 248, 0.15)" : "#1e293b";
      ctx.beginPath();
      ctx.roundRect(x + 30, y + 330, cardWidth - 60, 50, 10);
      ctx.fill();

      ctx.fillStyle = idx === 0 && p > 0.4 ? "#38bdf8" : "#64748b";
      ctx.font = "bold 18px monospace";
      ctx.fillText(idx === 0 && p > 0.4 ? "✓ STATE SELECTION READY" : "PARAMETRIC STAGE", x + 50, y + 362);
    });

    // Primary Call to Action Button
    ctx.fillStyle = p > 0.6 ? "#0284c7" : "#1d4ed8";
    ctx.beginPath();
    ctx.roundRect(80, 830, w - 160, 90, 18);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      p > 0.6 ? "PROCEED TO STATE CONFIGURATION →" : "EXPLORE US LLC FORMATION OPTIONS",
      w / 2,
      886
    );
    ctx.textAlign = "start";

    this.canvasTexture.needsUpdate = true;
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
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
