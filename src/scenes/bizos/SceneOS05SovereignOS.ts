import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneOS05SovereignOS implements CinematicScene {
  public id = "scene-os-05-sovereign";
  public title = "Digi Biz OS Sovereign Operating System";
  public label = "05 SOVEREIGN OS";
  public kicker = "05 · THE VOICE-CONTROLLED BUSINESS OPERATING SYSTEM";
  public description = "The ultimate operating system for modern business: Voice control, 200+ tools, 700+ sub-agents, and 600+ skills managing companies, banking, and digital software with total autonomy.";
  public statutoryNote = "Digi Biz OS Enterprise Edition · Sovereign Private Deployment · Zero Vendor Lock-in";
  public metricBadge = "DIGI BIZ OS: OPERATIONAL";
  public startProgress = 0.8;
  public endProgress = 1.0;

  public transition: SceneTransition = { type: "MATCH_CUT", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-OS-05-SOVEREIGN",
    reelNumber: "05 / 05",
    chapterTitle: "SOVEREIGN OPERATING SYSTEM",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "24mm Master Prime",
    iso: 400,
    timecode: "00:05:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 5: SOVEREIGN OS ACTIVE",
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
  private materials = MaterialFactory.getInstance();

  private hatLogo: HTMLImageElement | null = null;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1280;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.renderCanvas();

    // Load official Fedora Hat Logo
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/assets/brand/digibiz-hat-logo.png";
    img.onload = () => {
      this.hatLogo = img;
      this.renderCanvas();
      this.canvasTexture.needsUpdate = true;
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const tableGeo = new THREE.BoxGeometry(2.1, 0.04, 1.1);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.75, 0);
    this.sceneGroup.add(table);

    // Amber Gold Crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.1, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0xb45309,
      emissiveIntensity: 0.6,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(-0.25, 0.82, 0.15);
    this.sceneGroup.add(crystal);

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

    // Dark amber-black backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#140e06");
    grad.addColorStop(1, "#040301");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top Header Badge
    ctx.fillStyle = "#291b07";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 280, 48, 560, 44, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText("DIGIFORMATION · DIGI BIZ OS PRODUCTION", w / 2, 75);

    // Title Headline with Official Fedora Hat Logos
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 50px sans-serif";
    ctx.fillText("DIGI BIZ OS", w / 2, 165);

    if (this.hatLogo) {
      ctx.drawImage(this.hatLogo, w / 2 - 240, 118, 56, 56);
      ctx.drawImage(this.hatLogo, w / 2 + 184, 118, 56, 56);
    }

    ctx.fillStyle = "#fbbf24";
    ctx.font = "20px monospace";
    ctx.fillText("THE VOICE-CONTROLLED BUSINESS OPERATING SYSTEM", w / 2, 210);

    // 4 Ecosystem Super-Metric Cards
    const cols = [
      { num: "200+", title: "NATIVE TOOLS", sub: "Terminal, DB, Stripe, APIs", tag: "ALL CONNECTED", color: "#38bdf8" },
      { num: "700+", title: "SUB-AGENTS", sub: "Specialized Task Swarm", tag: "AUTONOMOUS", color: "#fbbf24" },
      { num: "600+", title: "DOMAIN SKILLS", sub: "Legal, Tax, Code, Growth", tag: "CURATED EXPERTISE", color: "#34d399" },
      { num: "VOICE", title: "AMBIENT CONTROL", sub: "Real-Time Natural Speech", tag: "ZERO LATENCY", color: "#c084fc" },
    ];

    const boxW = 430;
    const startX = (w - (4 * boxW + 3 * 28)) / 2;
    const cardY = 260;

    cols.forEach((col, idx) => {
      const cx = startX + idx * (boxW + 28);
      ctx.fillStyle = "rgba(41, 27, 7, 0.7)";
      ctx.beginPath();
      ctx.roundRect(cx, cardY, boxW, 200, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
      ctx.stroke();

      ctx.fillStyle = col.color;
      ctx.font = "900 36px monospace";
      ctx.textAlign = "left";
      ctx.fillText(col.num, cx + 24, cardY + 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(col.title, cx + 24, cardY + 86);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText(col.sub, cx + 24, cardY + 118);

      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.roundRect(cx + 24, cardY + 144, 170, 32, 8);
      ctx.fill();

      ctx.fillStyle = col.color;
      ctx.font = "bold 12px monospace";
      ctx.fillText(`✓ ${col.tag}`, cx + 38, cardY + 165);
    });

    // 3 Enterprise Deployment Tiers
    const tierY = 510;
    const tierW = 590;
    const tierStartX = (w - (3 * tierW + 2 * 32)) / 2;

    const tiers = [
      { name: "PILOT SUITE", price: "$499", fee: "/ mo", feat: ["Voice Command Terminal", "50+ Active Sub-Agents", "Standard FinTech & CRM tools", "Continuous cloud backup"] },
      { name: "ENTERPRISE SOVEREIGN", price: "$1,299", fee: "/ mo", feat: ["Full 700+ Sub-Agent Swarm", "200+ Tools & 600+ Skills", "Direct Companies House & IRS integration", "Private dedicated server cluster"], highlighted: true },
      { name: "UNLIMITED BESPOKE", price: "Custom", fee: "annual", feat: ["Self-hosted on-premise hardware", "Custom neural voice training", "Dedicated AI systems engineer", "24/7 priority SLA support"] },
    ];

    tiers.forEach((tier, idx) => {
      const tx = tierStartX + idx * (tierW + 32);
      ctx.fillStyle = tier.highlighted ? "rgba(65, 41, 9, 0.85)" : "rgba(30, 20, 5, 0.7)";
      ctx.beginPath();
      ctx.roundRect(tx, tierY, tierW, 370, 16);
      ctx.fill();
      ctx.strokeStyle = tier.highlighted ? "#fbbf24" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = tier.highlighted ? 2 : 1;
      ctx.stroke();

      if (tier.highlighted) {
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.roundRect(tx + tierW - 140, tierY - 14, 120, 26, 13);
        ctx.fill();
        ctx.fillStyle = "#451a03";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("RECOMMENDED", tx + tierW - 80, tierY + 4);
      }

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "left";
      ctx.fillText(tier.name, tx + 32, tierY + 46);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 48px sans-serif";
      ctx.fillText(tier.price, tx + 32, tierY + 104);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText(tier.fee, tx + (tier.price === "Custom" ? 220 : 170), tierY + 98);

      tier.feat.forEach((f, fIdx) => {
        const fy = tierY + 155 + fIdx * 42;
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("✓", tx + 32, fy);

        ctx.fillStyle = "#fef3c7";
        ctx.font = "15px sans-serif";
        ctx.fillText(f, tx + 60, fy);
      });
    });

    // Bottom Ecosystem Return CTA
    const botY = 930;
    ctx.fillStyle = "rgba(65, 41, 9, 0.6)";
    ctx.beginPath();
    ctx.roundRect(140, botY, w - 280, 210, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EXPERIENCE COMPLETE · ENTER THE DIGIFORMATION ECOSYSTEM", w / 2, botY + 65);

    ctx.fillStyle = "#fef3c7";
    ctx.font = "18px sans-serif";
    ctx.fillText("From corporate legal formation to autonomous voice-controlled operation — All under DigiFormation.", w / 2, botY + 110);

    const btnW = 340;
    const btnY = botY + 145;

    // Button 1: WhatsApp Concierge
    ctx.fillStyle = "#25d366";
    ctx.beginPath();
    ctx.roundRect(w / 2 - btnW - 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("REQUEST DIGI BIZ OS DEMO", w / 2 - btnW / 2 - 20, btnY + 29);

    // Button 2: Return to Master Portal
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(w / 2 + 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("RETURN TO MASTER SPACE ↺", w / 2 + btnW / 2 + 20, btnY + 29);

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void { this.sceneGroup.visible = true; }
  public exit(): void { this.sceneGroup.visible = false; }
  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    if (this.ctaMesh) {
      this.ctaMesh.position.y = 1.25 + Math.sin(Date.now() * 0.001) * 0.015;
    }
  }
  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
