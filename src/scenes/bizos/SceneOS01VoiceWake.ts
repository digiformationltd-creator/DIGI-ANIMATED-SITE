import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneOS01VoiceWake implements CinematicScene {
  public id = "scene-os-01-voicewake";
  public title = "Voice Command Wake & Neural Core";
  public label = "01 VOICE WAKE";
  public kicker = "01 · REAL-TIME VOICE COMMAND INTERFACE";
  public description = "Instant voice orchestration: Speak naturally to command your business. Live audio waveform analysis, low-latency intent recognition, and multi-agent dispatch.";
  public statutoryNote = "Neural Acoustic Modeling · Real-Time Full-Duplex Voice Engine · Private Telemetry";
  public metricBadge = "VOICE ENGINE: LISTENING";
  public startProgress = 0.0;
  public endProgress = 0.2;

  public transition: SceneTransition = { type: "PHYSICAL", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-OS-01-VOICE",
    reelNumber: "01 / 05",
    chapterTitle: "VOICE COMMAND INTERFACE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "35mm Prime",
    iso: 350,
    timecode: "00:01:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 1: VOICE WAKE",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.8] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 38,
    },
    end: {
      position: [0.0, 1.15, 1.1] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 30,
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
      roughness: 0.55,
      metalness: 0.0,
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
    ctx.fillText("DIGI BIZ OS · THE VOICE-CONTROLLED BUSINESS OPERATING SYSTEM", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("MICROPHONE: ARMED · LOW LATENCY", w - 60, 44);
    ctx.textAlign = "start";

    // Main Terminal Card
    ctx.fillStyle = "#17120a";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.fillText("VOICE COMMAND RECOGNITION", 110, 180);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px monospace";
    ctx.fillText("Natural speech control: Operate companies, finances, and digital tools with ambient voice", 110, 220);

    // Audio Waveform Visualizer
    ctx.fillStyle = "#0d0904";
    ctx.beginPath();
    ctx.roundRect(110, 270, w - 220, 240, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
    ctx.stroke();

    // Draw Simulated Harmonic Waveform
    const numBars = 72;
    const barWidth = 14;
    const gap = (w - 220 - numBars * barWidth) / (numBars + 1);

    for (let i = 0; i < numBars; i++) {
      const bx = 110 + gap + i * (barWidth + gap);
      const heightFactor = Math.sin((i / numBars) * Math.PI) * (0.3 + 0.7 * Math.sin(i * 0.45));
      const bh = Math.max(12, heightFactor * 180);
      const by = 270 + 120 - bh / 2;

      ctx.fillStyle = i > 25 && i < 48 ? "#f59e0b" : "#78350f";
      ctx.beginPath();
      ctx.roundRect(bx, by, barWidth, bh, 6);
      ctx.fill();
    }

    // Voice Transcription Prompt Box
    ctx.fillStyle = "#221708";
    ctx.beginPath();
    ctx.roundRect(110, 550, w - 220, 160, 12);
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 16px monospace";
    ctx.fillText("VOICE PROMPT TRANSCRIBED:", 150, 595);

    ctx.fillStyle = "#ffffff";
    ctx.font = "italic bold 28px sans-serif";
    ctx.fillText('“Hey Digi, check Vance Technologies compliance status and dispatch today’s VAT return.”', 150, 645);

    // 3 Architecture Indicators
    const specs = [
      { k: "Voice Engine", v: "Ambient Wake-Word & Stream", c: "#fbbf24" },
      { k: "Intent Resolution", v: "Under 120ms to Sub-Agent Swarm", c: "#34d399" },
      { k: "Security Model", v: "Biometric Voice Authentication", c: "#38bdf8" },
    ];
    const sw = (w - 280) / 3;
    specs.forEach((s, idx) => {
      const sx = 110 + idx * (sw + 30);
      ctx.fillStyle = "#201507";
      ctx.beginPath();
      ctx.roundRect(sx, 750, sw, 180, 12);
      ctx.fill();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px monospace";
      ctx.fillText(s.k, sx + 24, 795);

      ctx.fillStyle = s.c;
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(s.v, sx + 24, 840);
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
