import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneOS04AutonomousOps implements CinematicScene {
  public id = "scene-os-04-ops";
  public title = "Autonomous Enterprise Operations";
  public label = "04 OPERATIONS";
  public kicker = "04 · SELF-DRIVING BUSINESS EXECUTION";
  public description = "From customer order to fulfillment without human intervention. Automated invoice dispatch, real-time ledger balancing, and proactive statutory compliance.";
  public statutoryNote = "End-to-End Enterprise Automation · Human-in-the-Loop Safeguards · Event-Driven Architecture";
  public metricBadge = "AUTONOMOUS OPS 100%";
  public startProgress = 0.6;
  public endProgress = 0.8;

  public transition: SceneTransition = { type: "SCREEN", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-OS-04-OPS",
    reelNumber: "04 / 05",
    chapterTitle: "AUTONOMOUS OPERATIONS",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "40mm Prime",
    iso: 350,
    timecode: "00:04:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 4: AUTONOMOUS OPS",
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

    ctx.fillStyle = "#0c0a06";
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#291b07";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGI BIZ OS LIVE EXECUTION ENGINE · AUTONOMOUS OPERATIONS FEED", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("PIPELINE STATUS: ZERO HUMAN OVERHEAD", w - 60, 44);
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
    ctx.fillText("AUTONOMOUS EXECUTION FLOW", 110, 180);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "20px monospace";
    ctx.fillText("Every business function executes as an automated, verifiable background pipeline", 110, 220);

    // 4 Live Event Cards
    const events = [
      {
        time: "12:44:02 UTC",
        title: "INBOUND ENTERPRISE LEAD QUALIFIED",
        detail: "Voice engine transcribed customer enquiry, scored budget £12,000, generated tailored proposal PDF and dispatched via sendgrid.",
        status: "SUCCESS · 1.4s",
        color: "#38bdf8",
      },
      {
        time: "12:44:18 UTC",
        title: "STRIPE SETTLEMENT & RECONCILIATION",
        detail: "Received $4,950 merchant payout. Ledger agent matched payment intent against invoice #VA-8492 and synced QuickBooks ledger.",
        status: "BALANCED · 0.8s",
        color: "#34d399",
      },
      {
        time: "12:44:39 UTC",
        title: "STATUTORY COMPLIANCE AUTO-DEFENSE",
        detail: "Audit agent checked UK Companies House registry for Vance Technologies Ltd. Confirmed Confirmation Statement CS01 filed & active.",
        status: "VERIFIED · 0.3s",
        color: "#c084fc",
      },
      {
        time: "12:45:01 UTC",
        title: "3D WEBGL ASSET RE-INDEXING",
        detail: "Three.js spatial assets compressed to WebP and deployed across 280 edge POPs with zero downtime canary rollout.",
        status: "DEPLOYED · 2.1s",
        color: "#f59e0b",
      },
    ];

    events.forEach((ev, idx) => {
      const ey = 270 + idx * 170;
      ctx.fillStyle = "#221708";
      ctx.beginPath();
      ctx.roundRect(110, ey, w - 220, 145, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();

      ctx.fillStyle = ev.color;
      ctx.font = "bold 15px monospace";
      ctx.fillText(`● [${ev.time}]`, 140, ey + 40);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(ev.title, 340, ey + 40);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "16px sans-serif";
      ctx.fillText(ev.detail, 140, ey + 82);

      ctx.fillStyle = ev.color;
      ctx.font = "bold 14px monospace";
      ctx.fillText(ev.status, 140, ey + 118);
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
