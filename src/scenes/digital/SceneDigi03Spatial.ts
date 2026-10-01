import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneDigi03Spatial implements CinematicScene {
  public id = "scene-digi-03-spatial";
  public title = "3D Spatial WebGL Experience";
  public label = "03 3D WEBGL";
  public kicker = "03 · REAL-TIME SPATIAL COMPUTING";
  public description = "Moving beyond flat 2D surfaces into real-time WebGL / Three.js 3D environments. ACES Filmic tone mapping, physically based shaders, and interactive products.";
  public statutoryNote = "WebGL 2.0 / WebGPU Pipeline · 60 FPS Locked · Procedural Physical Materials";
  public metricBadge = "60 FPS · ACES FILMIC";
  public startProgress = 0.4;
  public endProgress = 0.6;

  public transition: SceneTransition = { type: "OBJECT", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-DIGI-03-SPATIAL",
    reelNumber: "03 / 05",
    chapterTitle: "3D SPATIAL WEBGL",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "50mm Prime",
    iso: 400,
    timecode: "00:03:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 3: 3D WEBGL ENGINE",
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
  private torusMesh: THREE.Mesh | null = null;
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

    // Dynamic 3D Spatial Geometry floating beside screen
    const torusGeo = new THREE.TorusKnotGeometry(0.12, 0.035, 128, 32);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x3b0764,
      emissiveIntensity: 0.5,
    });
    this.torusMesh = new THREE.Mesh(torusGeo, torusMat);
    this.torusMesh.position.set(0.48, 1.05, 0.15);
    this.sceneGroup.add(this.torusMesh);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private renderScreen(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = "#090915";
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#1e1035";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#d8b4fe";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGIFORMATION SPATIAL 3D ENGINE · REAL-TIME WEBGL SHADER PIPELINE", 60, 44);

    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("PIPELINE: LOCKED 60 FPS", w - 60, 44);
    ctx.textAlign = "start";

    // Spatial Dashboard
    ctx.fillStyle = "#140f26";
    ctx.beginPath();
    ctx.roundRect(60, 110, w - 120, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px sans-serif";
    ctx.fillText("REAL-TIME 3D SPATIAL CAPABILITY", 110, 180);

    ctx.fillStyle = "#c084fc";
    ctx.font = "20px monospace";
    ctx.fillText("Cinematic Scrollytelling · Physically Based Rendering · Procedural Geometry", 110, 220);

    // 3 Feature Cards
    const features = [
      {
        num: "01",
        title: "PHYSICALLY BASED SHADERS",
        sub: "Roughness · Metalness · Clearcoat",
        items: ["Custom GLSL vertex & fragment passes", "ACES Filmic tone mapping curve", "Micro-surface roughness perturbation", "Screen-space ambient occlusion"],
      },
      {
        num: "02",
        title: "SCROLL-LINKED CHOREOGRAPHY",
        sub: "Cinematic Camera Splines",
        items: ["Hermite spline camera translation", "Smooth progressive damping", "Dynamic focal length adjustments", "Zero-jank RAF synchronized render loop"],
      },
      {
        num: "03",
        title: "INTERACTIVE PRODUCT NODES",
        sub: "360° Real-time Inspection",
        items: ["Exploded architectural assemblies", "Sub-surface scattering for realism", "Integrated responsive touch controls", "Zero WebGL context loss recovery"],
      },
    ];

    const fw = (w - 240) / 3;
    features.forEach((f, idx) => {
      const fx = 110 + idx * (fw + 24);
      ctx.fillStyle = "#1f153a";
      ctx.beginPath();
      ctx.roundRect(fx, 280, fw, 660, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();

      ctx.fillStyle = "#c084fc";
      ctx.font = "bold 24px monospace";
      ctx.fillText(f.num, fx + 28, 330);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(f.title, fx + 28, 375);

      ctx.fillStyle = "#a855f7";
      ctx.font = "14px monospace";
      ctx.fillText(f.sub, fx + 28, 408);

      f.items.forEach((item, iIdx) => {
        const iy = 460 + iIdx * 48;
        ctx.fillStyle = "#c084fc";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("◆", fx + 28, iy);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "15px sans-serif";
        ctx.fillText(item, fx + 52, iy);
      });
    });

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void { this.sceneGroup.visible = true; }
  public exit(): void { this.sceneGroup.visible = false; }
  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    if (this.torusMesh) {
      this.torusMesh.rotation.x += delta * 0.8;
      this.torusMesh.rotation.y += delta * 0.6;
    }
  }
  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
