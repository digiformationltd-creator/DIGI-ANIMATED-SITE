import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneOS02SubAgents implements CinematicScene {
  public id = "scene-os-02-subagents";
  public title = "700+ Autonomous Sub-Agents Swarm";
  public label = "02 SUB-AGENTS";
  public kicker = "02 · 700+ AUTONOMOUS SPECIALISTS";
  public description = "A private digital workforce of 700+ specialized sub-agents coordinating autonomously: legal researchers, tax accountants, code reviewers, and market analysts.";
  public statutoryNote = "Multi-Agent State Machine · Hierarchical Delegation · Zero Human Bottlenecks";
  public metricBadge = "700+ SUB-AGENTS ACTIVE";
  public startProgress = 0.2;
  public endProgress = 0.4;

  public transition: SceneTransition = { type: "SCREEN", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-OS-02-AGENTS",
    reelNumber: "02 / 05",
    chapterTitle: "700+ SUB-AGENTS SWARM",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "45mm Prime",
    iso: 350,
    timecode: "00:02:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 2: AGENT SWARM",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.35, 1.5] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.1, 0.95] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 26,
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

    ctx.fillStyle = "#0c0a06";
    ctx.fillRect(0, 0, w, h);

    // Header bar
    ctx.fillStyle = "#291b07";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGI BIZ OS SWARM ORCHESTRATION · 700+ AUTONOMOUS SUB-AGENTS", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("SWARM HEALTH: 100% OPERATIONAL", w - 60, 44);
    ctx.textAlign = "start";

    // Main Swarm Matrix
    ctx.fillStyle = "#17120a";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.fillText("700+ SPECIALIZED SUB-AGENTS CLUSTER", 110, 180);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "20px monospace";
    ctx.fillText("Autonomous Task Force: Each agent handles a specific enterprise responsibility", 110, 220);

    // 4 Agent Cluster Groups
    const clusters = [
      {
        title: "LEGAL & COMPLIANCE",
        count: "140 Agents",
        roles: ["Companies House Monitor", "IRS Tax Form Preparer", "GDPR Data Auditor", "Statutory Deadline Tracker"],
        color: "#38bdf8",
      },
      {
        title: "FINANCE & TREASURY",
        count: "165 Agents",
        roles: ["Multi-Bank Ledger Sync", "Automated Payroll Engine", "Foreign FX Optimizer", "Stripe Dispute Defender"],
        color: "#34d399",
      },
      {
        title: "ENGINEERING & 3D",
        count: "215 Agents",
        roles: ["Fullstack Code Generator", "Three.js Scene Optimizer", "Bug & Vulnerability Patcher", "CI/CD Auto-Deployer"],
        color: "#c084fc",
      },
      {
        title: "GROWTH & OPERATIONS",
        count: "180 Agents",
        roles: ["Inbound Voice Qualifier", "Enterprise CRM Enricher", "Customer Support Copilot", "Contract Lifecycle Agent"],
        color: "#f59e0b",
      },
    ];

    const cw = (w - 180) / 4;
    clusters.forEach((c, idx) => {
      const cx = 100 + idx * (cw + 24);
      ctx.fillStyle = "#221708";
      ctx.beginPath();
      ctx.roundRect(cx, 280, cw, 680, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();

      ctx.fillStyle = c.color;
      ctx.font = "bold 14px monospace";
      ctx.fillText(c.count, cx + 24, 330);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(c.title, cx + 24, 375);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px monospace";
      ctx.fillText("CLUSTER SPECIALISTS", cx + 24, 408);

      c.roles.forEach((r, rIdx) => {
        const ry = 460 + rIdx * 56;
        ctx.fillStyle = c.color;
        ctx.font = "bold 15px sans-serif";
        ctx.fillText("●", cx + 24, ry);
        ctx.fillStyle = "#fef3c7";
        ctx.font = "14px sans-serif";
        ctx.fillText(r, cx + 46, ry);
      });

      // Bottom Status
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.roundRect(cx + 24, 860, cw - 48, 40, 8);
      ctx.fill();

      ctx.fillStyle = c.color;
      ctx.font = "bold 12px monospace";
      ctx.fillText("✓ STANDBY & ACTIVE", cx + 38, 885);
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
