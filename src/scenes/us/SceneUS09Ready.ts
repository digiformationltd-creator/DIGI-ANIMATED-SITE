import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS09Ready implements CinematicScene {
  public id = "scene-us-09-ready";
  public title = "US LLC Ready For Commerce";
  public label = "09 US READY";
  public kicker = "09 · AMERICAN ENTERPRISE COMPLETE";
  public description = "The American journey completes. Vance Apex LLC is officially formed in Wyoming, equipped with an IRS EIN, verified US commercial checking, and active digital storefront ready for international scale.";
  public statutoryNote = "Wyoming Filing ID: 2026-001928472 · IRS EIN: 32-9481729 · Sovereign US Legal Entity";
  public metricBadge = "STATUS: 100% OPERATIONAL";
  public startProgress = 0.88;
  public endProgress = 1.00;

  public transition: SceneTransition = {
    type: "MATCH_CUT",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-09-READY",
    reelNumber: "09 / 09",
    chapterTitle: "US LLC READY FOR COMMERCE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "24mm Master Prime",
    iso: 500,
    timecode: "00:09:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 9: US ECOSYSTEM COMPLETE",
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
    // 1. Sleek Central Ebony Executive Desk
    const tableGeo = new THREE.BoxGeometry(2.1, 0.04, 1.1);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.75, 0);
    this.sceneGroup.add(table);

    // 2. Leather Corporate Binder Portfolio with Wyoming Seal
    const binderGeo = new THREE.BoxGeometry(0.44, 0.03, 0.62);
    const binderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.1 });
    const binder = new THREE.Mesh(binderGeo, binderMat);
    binder.position.set(-0.55, 0.77, 0.05);
    binder.rotation.y = THREE.MathUtils.degToRad(-10);
    this.sceneGroup.add(binder);

    // 3. Gold Medallion / Seal Plaque
    const sealGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 32);
    const sealMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.set(-0.25, 0.775, 0.15);
    seal.rotation.x = THREE.MathUtils.degToRad(10);
    this.sceneGroup.add(seal);

    // 4. Central Large Interactive Brand & Launch Billboard
    this.renderCanvas();
    const ctaGeo = new THREE.PlaneGeometry(1.4, 0.88);
    const ctaMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.92,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.ctaMesh = new THREE.Mesh(ctaGeo, ctaMat);
    this.ctaMesh.position.set(0, 1.25, -0.2);
    this.sceneGroup.add(this.ctaMesh);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private renderCanvas(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark titanium backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#080c16");
    grad.addColorStop(1, "#020408");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid
    ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Header Badge
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 260, 48, 520, 44, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText("DIGIFORMATION · US LLC FORMATION COMPLETE", w / 2, 75);

    // Title Headline
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 52px sans-serif";
    ctx.fillText("VANCE APEX LLC", w / 2, 175);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Wyoming Filing No. 2026-001928472 · IRS EIN: 32-9481729", w / 2, 215);

    // 4 Ecosystem Component Columns
    const cols = [
      { num: "01", title: "WYOMING LLC", sub: "Secretary of State", tag: "ARTICLES FILED", color: "#38bdf8" },
      { num: "02", title: "IRS TAX ID", sub: "Form SS-4 / CP 575", tag: "EIN ASSIGNED", color: "#34d399" },
      { num: "03", title: "US BANKING", sub: "Mercury / Relay Rails", tag: "ACH ACTIVE", color: "#a855f7" },
      { num: "04", title: "GLOBAL PAY", sub: "Stripe & Shopify", tag: "SETTLEMENT LIVE", color: "#f59e0b" },
    ];

    const boxW = 430;
    const startX = (w - (4 * boxW + 3 * 28)) / 2;
    const cardY = 270;

    cols.forEach((col, idx) => {
      const cx = startX + idx * (boxW + 28);
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.beginPath();
      ctx.roundRect(cx, cardY, boxW, 200, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();

      ctx.fillStyle = col.color;
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "left";
      ctx.fillText(col.num, cx + 24, cardY + 38);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(col.title, cx + 24, cardY + 76);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(col.sub, cx + 24, cardY + 110);

      // Status pill
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.roundRect(cx + 24, cardY + 138, 170, 32, 8);
      ctx.fill();

      ctx.fillStyle = col.color;
      ctx.font = "bold 12px monospace";
      ctx.fillText(`● ${col.tag}`, cx + 38, cardY + 159);
    });

    // 3 Transparent Pricing / Setup Tiers
    const tierY = 520;
    const tierW = 590;
    const tierStartX = (w - (3 * tierW + 2 * 32)) / 2;

    const tiers = [
      { name: "STATE BASIC", price: "$199", fee: "+ State Fee", feat: ["Articles of Organization", "Cheyenne Registered Agent", "Operating Agreement", "Digital Certificate Archive"] },
      { name: "TURNKEY FULL", price: "$399", fee: "+ State Fee", feat: ["All State Basic Features", "Official IRS EIN Registration", "Form CP 575 Confirmation", "Mercury/Relay Banking Intro"], highlighted: true },
      { name: "GLOBAL ENTERPRISE", price: "$599", fee: "+ State Fee", feat: ["All Turnkey Features", "Certified IRS ITIN Processing", "Dedicated Account Concierge", "Stripe + Global E-Commerce Kit"] },
    ];

    tiers.forEach((tier, idx) => {
      const tx = tierStartX + idx * (tierW + 32);
      ctx.fillStyle = tier.highlighted ? "rgba(30, 41, 59, 0.95)" : "rgba(15, 23, 42, 0.75)";
      ctx.beginPath();
      ctx.roundRect(tx, tierY, tierW, 370, 16);
      ctx.fill();
      ctx.strokeStyle = tier.highlighted ? "#38bdf8" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = tier.highlighted ? 2 : 1;
      ctx.stroke();

      if (tier.highlighted) {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.roundRect(tx + tierW - 140, tierY - 14, 120, 26, 13);
        ctx.fill();
        ctx.fillStyle = "#020617";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("RECOMMENDED", tx + tierW - 80, tierY + 4);
      }

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "left";
      ctx.fillText(tier.name, tx + 32, tierY + 46);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 48px sans-serif";
      ctx.fillText(tier.price, tx + 32, tierY + 104);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(tier.fee, tx + 180, tierY + 98);

      tier.feat.forEach((f, fIdx) => {
        const fy = tierY + 155 + fIdx * 42;
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("✓", tx + 32, fy);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "15px sans-serif";
        ctx.fillText(f, tx + 60, fy);
      });
    });

    // Bottom Cross-Service CTA
    const botY = 940;
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.beginPath();
    ctx.roundRect(140, botY, w - 280, 200, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NEXT CHAPTER: BUILD YOUR DIGITAL BUSINESS ONLINE", w / 2, botY + 65);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px sans-serif";
    ctx.fillText("Scale Vance Apex LLC with an agentic website, 3D product showcase, and autonomous operations.", w / 2, botY + 110);

    // Two Action Buttons
    const btnW = 340;
    const btnY = botY + 140;

    // Button 1: WhatsApp Concierge
    ctx.fillStyle = "#25d366";
    ctx.beginPath();
    ctx.roundRect(w / 2 - btnW - 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("START US LLC ON WHATSAPP", w / 2 - btnW / 2 - 20, btnY + 29);

    // Button 2: Next Film
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(w / 2 + 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("EXPLORE DIGITAL BUILD →", w / 2 + btnW / 2 + 20, btnY + 29);

    // Subtle Legal Disclaimer footer
    ctx.fillStyle = "#475569";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DigiFormation is a registered corporate formation service provider and does not provide legal or tax advice. LLC approvals subject to state government filing timelines.", w / 2, h - 35);

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void {
    this.sceneGroup.visible = true;
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    const cp = this.cameraWaypoints.start.position;
    const ep = this.cameraWaypoints.end.position;
    const tp = this.cameraWaypoints.start.target;
    const et = this.cameraWaypoints.end.target;

    const easeT = sceneProgress * sceneProgress * (3 - 2 * sceneProgress);

    const x = THREE.MathUtils.lerp(cp[0], ep[0], easeT);
    const y = THREE.MathUtils.lerp(cp[1], ep[1], easeT);
    const z = THREE.MathUtils.lerp(cp[2], ep[2], easeT);

    const tx = THREE.MathUtils.lerp(tp[0], et[0], easeT);
    const ty = THREE.MathUtils.lerp(tp[1], et[1], easeT);
    const tz = THREE.MathUtils.lerp(tp[2], et[2], easeT);

    if (this.ctaMesh) {
      this.ctaMesh.position.y = 1.25 + Math.sin(Date.now() * 0.001) * 0.015;
    }
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
