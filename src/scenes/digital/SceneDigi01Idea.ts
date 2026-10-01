import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneDigi01Idea implements CinematicScene {
  public id = "scene-digi-01-idea";
  public title = "Architectural Idea & Blueprint";
  public label = "01 BLUEPRINT";
  public kicker = "01 · THE ARCHITECTURAL SPECIFICATION";
  public description = "Transforming the commercial venture into an engineered digital asset. Wireframes, component hierarchies, low-latency micro-frontends, and strict design systems.";
  public statutoryNote = "DigiFormation Engineering Standards · Scalable Full-Stack Architecture";
  public metricBadge = "SYSTEM DESIGN ACTIVE";
  public startProgress = 0.0;
  public endProgress = 0.2;

  public transition: SceneTransition = { type: "PHYSICAL", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-DIGI-01-BLUEPRINT",
    reelNumber: "01 / 05",
    chapterTitle: "ARCHITECTURAL BLUEPRINT",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "35mm Prime",
    iso: 320,
    timecode: "00:01:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 1: ARCHITECTURAL DESIGN",
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

    ctx.fillStyle = "#060913";
    ctx.fillRect(0, 0, w, h);

    // Architectural Blueprint Grid
    ctx.strokeStyle = "rgba(147, 51, 234, 0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Bar
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGIFORMATION DIGITAL FORGE · ARCHITECTURAL SYSTEM DESIGN", 60, 44);

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("SPECIFICATION: PRODUCTION GRADE", w - 60, 44);
    ctx.textAlign = "start";

    // Blueprint Layout
    ctx.fillStyle = "#0d1326";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.fillText("ENTERPRISE SYSTEM BLUEPRINT", 110, 180);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px monospace";
    ctx.fillText("Design Philosophy: Speed · Scalability · 3D Immersive · Autonomous Agent Integration", 110, 220);

    // 4 Architecture Pillars
    const pillars = [
      { num: "01", title: "HIGH-PERF WEB", sub: "React / Vite / SSR", desc: "Sub-second load times, SEO-optimized semantic tree, responsive on every viewport.", color: "#38bdf8" },
      { num: "02", title: "3D WEBGL SPATIAL", sub: "Three.js / WebGL2", desc: "Interactive spatial product showcase with ACES Filmic lighting and physically based materials.", color: "#c084fc" },
      { num: "03", title: "AGENTIC LOGIC", sub: "Autonomous Workflows", desc: "Multi-agent pipelines executing customer interactions, lead triage, and billing ops automatically.", color: "#34d399" },
      { num: "04", title: "SOVEREIGN DATA", sub: "PostgreSQL / Edge DB", desc: "Complete data ownership with zero third-party platform lock-in.", color: "#f59e0b" },
    ];

    const pw = (w - 180) / 4;
    pillars.forEach((p, idx) => {
      const px = 100 + idx * (pw + 24);
      ctx.fillStyle = "#161f38";
      ctx.beginPath();
      ctx.roundRect(px, 280, pw, 680, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();

      ctx.fillStyle = p.color;
      ctx.font = "bold 28px monospace";
      ctx.fillText(p.num, px + 28, 335);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(p.title, px + 28, 385);

      ctx.fillStyle = "#a855f7";
      ctx.font = "bold 15px monospace";
      ctx.fillText(p.sub, px + 28, 420);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px sans-serif";
      // Multi-line wrap
      const words = p.desc.split(" ");
      let line = "";
      let y = 470;
      for (const w of words) {
        if ((line + w).length > 22) {
          ctx.fillText(line, px + 28, y);
          line = w + " ";
          y += 28;
        } else {
          line += w + " ";
        }
      }
      ctx.fillText(line, px + 28, y);
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
