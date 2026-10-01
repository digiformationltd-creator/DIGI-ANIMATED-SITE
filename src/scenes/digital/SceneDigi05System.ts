import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneDigi05System implements CinematicScene {
  public id = "scene-digi-05-system";
  public title = "Complete Digital Business System";
  public label = "05 SYSTEM";
  public kicker = "05 · SOVEREIGN DIGITAL SYSTEM COMPLETE";
  public description = "The ultimate digital foundation: High-performance web application + 3D WebGL spatial experience + Agentic software pipeline unified into one sovereign enterprise engine.";
  public statutoryNote = "Custom Sovereign IP · Full Source Ownership · Automated Global Scale";
  public metricBadge = "DIGITAL BUSINESS SYSTEM LIVE";
  public startProgress = 0.8;
  public endProgress = 1.0;

  public transition: SceneTransition = { type: "MATCH_CUT", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-DIGI-05-SYSTEM",
    reelNumber: "05 / 05",
    chapterTitle: "DIGITAL BUSINESS SYSTEM COMPLETE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "24mm Master Prime",
    iso: 400,
    timecode: "00:05:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 5: SOVEREIGN DIGITAL SYSTEM",
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

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1280;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.renderCanvas();
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const tableGeo = new THREE.BoxGeometry(2.1, 0.04, 1.1);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.75, 0);
    this.sceneGroup.add(table);

    // Purple Titanium Prism
    const prismGeo = new THREE.ConeGeometry(0.08, 0.16, 4);
    const prismMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.95, roughness: 0.1 });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(-0.25, 0.83, 0.15);
    prism.rotation.y = Math.PI / 4;
    this.sceneGroup.add(prism);

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
    grad.addColorStop(0, "#0e091a");
    grad.addColorStop(1, "#030207");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top Header Badge
    ctx.fillStyle = "#1e1035";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 280, 48, 560, 44, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText("DIGIFORMATION · DIGITAL BUILD PRODUCTION", w / 2, 75);

    // Title Headline
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 48px sans-serif";
    ctx.fillText("DIGITAL BUSINESS SYSTEM", w / 2, 165);

    ctx.fillStyle = "#c084fc";
    ctx.font = "20px monospace";
    ctx.fillText("WEBSITE · 3D WEBSITE · AGENTIC SOFTWARE · COMPLETE ENTERPRISE SUITE", w / 2, 210);

    // 4 Built Artifact Pillars
    const cols = [
      { num: "01", title: "RESPONSIVE WEB", sub: "React / Vite / Edge", tag: "SUB-100MS LIVE", color: "#38bdf8" },
      { num: "02", title: "3D SPATIAL WEBGL", sub: "Three.js / PBR Shaders", tag: "60 FPS CINEMA", color: "#c084fc" },
      { num: "03", title: "AGENTIC AUTOMATION", sub: "Multi-Agent Forge", tag: "SWARM ONLINE", color: "#34d399" },
      { num: "04", title: "FINTECH CHECKOUT", sub: "Stripe & Global Rails", tag: "SETTLEMENT ACTIVE", color: "#f59e0b" },
    ];

    const boxW = 430;
    const startX = (w - (4 * boxW + 3 * 28)) / 2;
    const cardY = 260;

    cols.forEach((col, idx) => {
      const cx = startX + idx * (boxW + 28);
      ctx.fillStyle = "rgba(30, 16, 53, 0.6)";
      ctx.beginPath();
      ctx.roundRect(cx, cardY, boxW, 200, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
      ctx.stroke();

      ctx.fillStyle = col.color;
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "left";
      ctx.fillText(col.num, cx + 24, cardY + 38);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(col.title, cx + 24, cardY + 76);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText(col.sub, cx + 24, cardY + 110);

      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.roundRect(cx + 24, cardY + 138, 170, 32, 8);
      ctx.fill();

      ctx.fillStyle = col.color;
      ctx.font = "bold 12px monospace";
      ctx.fillText(`✓ ${col.tag}`, cx + 38, cardY + 159);
    });

    // 3 Digital Architecture Packages
    const tierY = 510;
    const tierW = 590;
    const tierStartX = (w - (3 * tierW + 2 * 32)) / 2;

    const tiers = [
      { name: "HIGH-PERF WEB APP", price: "$1,499", fee: "turnkey", feat: ["Modern React & TypeScript", "Ultra-fast Lighthouse 100/100", "Mobile-optimized responsive UX", "Stripe payment integration"] },
      { name: "3D SPATIAL IMMERSIVE", price: "$2,999", fee: "turnkey", feat: ["All Web App capabilities", "Interactive 3D Three.js product viewer", "Scroll-choreographed camera splines", "Custom physically based materials"], highlighted: true },
      { name: "SOVEREIGN AGENTIC SYSTEM", price: "$5,499", fee: "turnkey", feat: ["All 3D Spatial capabilities", "Multi-agent autonomous swarm", "Custom MCP tool integration", "Self-hosted private deployment"] },
    ];

    tiers.forEach((tier, idx) => {
      const tx = tierStartX + idx * (tierW + 32);
      ctx.fillStyle = tier.highlighted ? "rgba(49, 18, 90, 0.75)" : "rgba(20, 10, 35, 0.7)";
      ctx.beginPath();
      ctx.roundRect(tx, tierY, tierW, 370, 16);
      ctx.fill();
      ctx.strokeStyle = tier.highlighted ? "#c084fc" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = tier.highlighted ? 2 : 1;
      ctx.stroke();

      if (tier.highlighted) {
        ctx.fillStyle = "#c084fc";
        ctx.beginPath();
        ctx.roundRect(tx + tierW - 140, tierY - 14, 120, 26, 13);
        ctx.fill();
        ctx.fillStyle = "#2e1065";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("RECOMMENDED", tx + tierW - 80, tierY + 4);
      }

      ctx.fillStyle = "#c084fc";
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "left";
      ctx.fillText(tier.name, tx + 32, tierY + 46);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 48px sans-serif";
      ctx.fillText(tier.price, tx + 32, tierY + 104);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(tier.fee, tx + 210, tierY + 98);

      tier.feat.forEach((f, fIdx) => {
        const fy = tierY + 155 + fIdx * 42;
        ctx.fillStyle = "#c084fc";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("✓", tx + 32, fy);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "15px sans-serif";
        ctx.fillText(f, tx + 60, fy);
      });
    });

    // Bottom Cross-Service CTA
    const botY = 930;
    ctx.fillStyle = "rgba(49, 18, 90, 0.5)";
    ctx.beginPath();
    ctx.roundRect(140, botY, w - 280, 210, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(192, 132, 252, 0.35)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NEXT CHAPTER: THE VOICE-CONTROLLED BUSINESS OPERATING SYSTEM", w / 2, botY + 65);

    ctx.fillStyle = "#e9d5ff";
    ctx.font = "18px sans-serif";
    ctx.fillText("Operate your enterprise via voice commands with Digi Biz OS — 200+ tools, 700+ sub-agents, 600+ skills.", w / 2, botY + 110);

    const btnW = 340;
    const btnY = botY + 145;

    // Button 1: WhatsApp Engineering
    ctx.fillStyle = "#25d366";
    ctx.beginPath();
    ctx.roundRect(w / 2 - btnW - 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("CONSULT LEAD ARCHITECT", w / 2 - btnW / 2 - 20, btnY + 29);

    // Button 2: Next Film
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(w / 2 + 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("ENTER DIGI BIZ OS FILM →", w / 2 + btnW / 2 + 20, btnY + 29);

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
