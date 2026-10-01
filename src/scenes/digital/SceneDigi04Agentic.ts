import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneDigi04Agentic implements CinematicScene {
  public id = "scene-digi-04-agentic";
  public title = "Agentic Software & Autonomous Workflows";
  public label = "04 AGENTIC AI";
  public kicker = "04 · AUTONOMOUS AGENT FORGE";
  public description = "Integrating autonomous AI sub-agents equipped with tools, skills, and memory to execute customer operations, inbound lead qualification, and real-time business logistics.";
  public statutoryNote = "Enterprise MCP Protocols · Tool-Calling Swarm · Multi-Agent State Machine";
  public metricBadge = "AGENT SWARM ACTIVE";
  public startProgress = 0.6;
  public endProgress = 0.8;

  public transition: SceneTransition = { type: "SCREEN", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-DIGI-04-AGENTIC",
    reelNumber: "04 / 05",
    chapterTitle: "AGENTIC SOFTWARE FORGE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "40mm Prime",
    iso: 350,
    timecode: "00:04:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 4: AGENTIC FORGE",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.4, 1.6] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 36,
    },
    end: {
      position: [0.0, 1.15, 1.05] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 28,
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

    ctx.fillStyle = "#070c18";
    ctx.fillRect(0, 0, w, h);

    // Header bar
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGIFORMATION AGENTIC FORGE · AUTONOMOUS WORKFLOW ORCHESTRATOR", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("AGENT SWARM: 4 ACTIVE DISPATCHERS", w - 60, 44);
    ctx.textAlign = "start";

    // Main Card
    ctx.fillStyle = "#0d1326";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.fillText("AGENTIC SOFTWARE WORKSPACE", 110, 180);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px monospace";
    ctx.fillText("Beyond chatbots: Autonomous software executing mission-critical company operations", 110, 220);

    // 4 Agent Nodes
    const agents = [
      {
        name: "LEGAL & COMPLIANCE AGENT",
        role: "Registry Telemetry & Filings",
        tasks: ["Monitors statutory deadlines 24/7", "Drafts Companies House XML payloads", "Alerts on officer address updates"],
        color: "#38bdf8",
      },
      {
        name: "FINTECH & TREASURY AGENT",
        role: "Ledger Reconciliation & ACH",
        tasks: ["Reconciles Stripe settlements", "Flags high-value chargebacks", "Generates monthly cash-flow reports"],
        color: "#34d399",
      },
      {
        name: "GROWTH & INBOUND AGENT",
        role: "Lead Qualification & Voice Intake",
        tasks: ["Scores enterprise website visitors", "Schedules partner demonstrations", "Enriches B2B CRM contacts"],
        color: "#a855f7",
      },
      {
        name: "DEVOPS & SECURITY AGENT",
        role: "Continuous Delivery & Integrity",
        tasks: ["Performs zero-trust token rotation", "Guarantees 99.99% uptime monitoring", "Executes automated canary rollouts"],
        color: "#f59e0b",
      },
    ];

    const aw = (w - 180) / 4;
    agents.forEach((ag, idx) => {
      const ax = 100 + idx * (aw + 24);
      ctx.fillStyle = "#161f38";
      ctx.beginPath();
      ctx.roundRect(ax, 280, aw, 680, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();

      ctx.fillStyle = ag.color;
      ctx.font = "bold 14px monospace";
      ctx.fillText(`SWARM NODE 0${idx + 1}`, ax + 24, 330);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(ag.name, ax + 24, 375);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px monospace";
      ctx.fillText(ag.role, ax + 24, 408);

      ag.tasks.forEach((t, tIdx) => {
        const ty = 460 + tIdx * 56;
        ctx.fillStyle = ag.color;
        ctx.font = "bold 15px sans-serif";
        ctx.fillText("⚡", ax + 24, ty);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "14px sans-serif";
        ctx.fillText(t, ax + 48, ty);
      });

      // Status pill at bottom
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.roundRect(ax + 24, 860, aw - 48, 40, 8);
      ctx.fill();

      ctx.fillStyle = ag.color;
      ctx.font = "bold 13px monospace";
      ctx.fillText("● AUTONOMOUS: ACTIVE", ax + 40, 885);
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
