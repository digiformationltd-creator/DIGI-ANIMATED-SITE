import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneOS03ToolsSkills implements CinematicScene {
  public id = "scene-os-03-toolskills";
  public title = "200+ Tools & 600+ Skills Pipeline";
  public label = "03 TOOLS & SKILLS";
  public kicker = "03 · 200+ TOOLS · 600+ DOMAIN SKILLS";
  public description = "Extensible execution fabric connecting 200+ native execution tools and 600+ specialized industry skills across database queries, cloud shells, government APIs, and payments.";
  public statutoryNote = "Model Context Protocol (MCP) · Direct System Execution · Sandboxed Security";
  public metricBadge = "200+ TOOLS · 600+ SKILLS";
  public startProgress = 0.4;
  public endProgress = 0.6;

  public transition: SceneTransition = { type: "OBJECT", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-OS-03-TOOLS",
    reelNumber: "03 / 05",
    chapterTitle: "200+ TOOLS & 600+ SKILLS",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "50mm Prime",
    iso: 350,
    timecode: "00:03:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 3: TOOLS & SKILLS",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.4] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.1, 0.85] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private monitorMesh: THREE.Mesh | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1152;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.renderScreen();
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const tableGeo = new THREE.BoxGeometry(2.0, 0.04, 1.1);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.75, 0);
    this.sceneGroup.add(table);

    const screenGeo = new THREE.PlaneGeometry(1.2, 0.68);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.monitorMesh = new THREE.Mesh(screenGeo, screenMat);
    this.monitorMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.monitorMesh);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private renderScreen(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = "#0a0805";
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#291b07";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGI BIZ OS CAPABILITY PIPELINE · 200+ TOOLS · 600+ DOMAIN SKILLS", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("ALL PIPELINES BOUND", w - 60, 44);
    ctx.textAlign = "start";

    // Main Card
    ctx.fillStyle = "#17120a";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.fillText("THE CAPABILITY ARSENAL", 110, 180);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "20px monospace";
    ctx.fillText("200+ Native Tools  ·  600+ Domain Skills  ·  Full Hardware & Cloud Access", 110, 220);

    // 2 Major Columns: Tools & Skills
    const colW = (w - 160) / 2;

    // Col 1: 200+ Tools
    ctx.fillStyle = "#221708";
    ctx.beginPath();
    ctx.roundRect(100, 270, colW, 680, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.font = "900 32px sans-serif";
    ctx.fillText("200+ Tools", 140, 335);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px monospace";
    ctx.fillText("LOW-LEVEL SYSTEM & API INTEGRATIONS", 140, 370);

    const tools = [
      { name: "Terminal & Shell Runner", desc: "Execute safe sandboxed PowerShell, Bash & Python" },
      { name: "PostgreSQL & Vector DBs", desc: "Direct structured data queries with zero latency" },
      { name: "Playwright Headless Browser", desc: "Automate form submissions and web verification" },
      { name: "Companies House & IRS Gateways", desc: "Official XML transmission for real-time lodgement" },
      { name: "Stripe & Banking Ledgers", desc: "Process balance transfers, invoices, and payouts" },
    ];

    tools.forEach((t, idx) => {
      const ty = 430 + idx * 95;
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`⚡ ${t.name}`, 140, ty);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "15px sans-serif";
      ctx.fillText(t.desc, 140, ty + 26);
    });

    // Col 2: 600+ Skills
    ctx.fillStyle = "#221708";
    ctx.beginPath();
    ctx.roundRect(140 + colW, 270, colW, 680, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.25)";
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.font = "900 32px sans-serif";
    ctx.fillText("600+ Skills", 180 + colW, 335);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px monospace";
    ctx.fillText("CURATED DOMAIN-SPECIFIC EXPERTISE", 180 + colW, 370);

    const skills = [
      { name: "UK Company Law & PSC Rules", desc: "Companies Act 2006 statutory filing rules" },
      { name: "US Wyoming / Delaware LLC", desc: "State-specific operating agreements & registered agents" },
      { name: "Three.js & WebGL 3D Shaders", desc: "Physically based materials and lighting pipelines" },
      { name: "Tax Returns (CT600 & 1120)", desc: "Corporate tax calculation and compliance" },
      { name: "Conversion Rate Optimization", desc: "High-ticket checkout funnels and UX flows" },
    ];

    skills.forEach((s, idx) => {
      const sy = 430 + idx * 95;
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`★ ${s.name}`, 180 + colW, sy);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "15px sans-serif";
      ctx.fillText(s.desc, 180 + colW, sy + 26);
    });

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void { this.sceneGroup.visible = true; }
  public exit(): void { this.sceneGroup.visible = false; }
  public update(sceneProgress: number, globalProgress: number, delta: number): void {}
  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
