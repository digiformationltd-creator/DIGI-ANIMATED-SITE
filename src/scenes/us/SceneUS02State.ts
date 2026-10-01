import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS02State implements CinematicScene {
  public id = "scene-us-02-state";
  public title = "Choose Your State";
  public label = "02 STATE";
  public kicker = "02 · JURISDICTIONAL ARCHITECTURE";
  public description = "Comparing statutory legal frameworks across US territories. Selecting Wyoming as the premier corporate jurisdiction for international founders — offering 0% state tax, strict charging order asset protection, and full member privacy.";
  public statutoryNote = "Wyoming Limited Liability Company Act (W.S. 17-29-101) · Zero State Tax · Charging Order Protection";
  public metricBadge = "JURISDICTION · WYOMING LLC";
  public startProgress = 0.11;
  public endProgress = 0.22;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-02-STATE",
    reelNumber: "02 / 09",
    chapterTitle: "CHOOSE YOUR STATE",
    shutterSpeed: "1/48s",
    aperture: "T2.0",
    focalLength: "40mm Cine Prime",
    iso: 640,
    timecode: "00:02:15:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 2: WYOMING STATE SELECTED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.45, 1.6] as [number, number, number],
      target: [0.0, 1.05, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.05, 1.25] as [number, number, number],
      target: [0.0, 1.05, 0.0] as [number, number, number],
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
    this.canvas.height = 1280;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTexture.minFilter = THREE.LinearFilter;
    this.canvasTexture.magFilter = THREE.LinearFilter;
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Studio Display Screen
    const screenGeo = new THREE.PlaneGeometry(1.2, 0.75);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.1,
    });
    this.monitorMesh = new THREE.Mesh(screenGeo, screenMat);
    this.monitorMesh.position.set(0, 1.05, 0);
    this.sceneGroup.add(this.monitorMesh);

    // Bezel
    const bezelGeo = new THREE.BoxGeometry(1.22, 0.77, 0.02);
    const bezelMat = this.materials.getAnodizedAluminum();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.012);
    this.sceneGroup.add(bezel);

    // Initial render
    this.renderScreen(0);
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.45 + (1.05 - 1.45) * t;
    const camZ = 1.6 + (1.25 - 1.6) * t;

    const targetX = 0.0;
    const targetY = 1.05;
    const targetZ = 0.0;

    const fov = 34 + (28 - 34) * t;
    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.renderScreen(sceneProgress);
  }

  private renderScreen(p: number): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Canvas background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // Top Chrome Header
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, w, 80);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGIFORMATION · US STATE FORMATION ENGINE · WYOMING VS DELAWARE", 60, 48);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("LIVE STATUTORY COMPARATOR", w - 60, 48);
    ctx.textAlign = "start";

    // Title Section
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 20px monospace";
    ctx.fillText("STAGE 02 / 09 · STATE SELECTION MATRIX", 60, 140);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("Choose Your US Formation State", 60, 205);

    // 3 Major US States Grid
    const colW = (w - 180) / 3;
    const states = [
      {
        name: "WYOMING (RECOMMENDED)",
        tag: "BEST FOR PRIVACY & E-COMMERCE",
        stateTax: "0.0%",
        annualFee: "$60 / yr",
        privacy: "Maximum (Nominee Safe)",
        chargingOrder: "Sole Statutory Remedy",
        filingTime: "24-48 Hours",
        isSelected: true,
        accent: "#38bdf8",
      },
      {
        name: "DELAWARE",
        tag: "VENTURE CAPITAL & TECH",
        stateTax: "0.0% (Out-of-State)",
        annualFee: "$300 / yr Franchise",
        privacy: "High",
        chargingOrder: "Court of Chancery",
        filingTime: "3-5 Business Days",
        isSelected: false,
        accent: "#94a3b8",
      },
      {
        name: "NEW MEXICO",
        tag: "ULTRA-LOW MAINTENANCE",
        stateTax: "0.0% (Out-of-State)",
        annualFee: "$0 / yr (No Report)",
        privacy: "High (No Public Record)",
        chargingOrder: "Standard",
        filingTime: "2-4 Business Days",
        isSelected: false,
        accent: "#94a3b8",
      },
    ];

    states.forEach((st, idx) => {
      const x = 60 + idx * (colW + 30);
      const y = 250;

      // Card Box
      ctx.fillStyle = st.isSelected ? "#111c33" : "#0d131f";
      ctx.strokeStyle = st.isSelected ? "#38bdf8" : "#1f2937";
      ctx.lineWidth = st.isSelected ? 3 : 1;
      ctx.beginPath();
      ctx.roundRect(x, y, colW, 640, 16);
      ctx.fill();
      ctx.stroke();

      // State Title & Tag
      ctx.fillStyle = st.accent;
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(st.name, x + 25, y + 50);

      ctx.fillStyle = st.isSelected ? "#7dd3fc" : "#64748b";
      ctx.font = "bold 14px monospace";
      ctx.fillText(st.tag, x + 25, y + 80);

      // Divider
      ctx.strokeStyle = st.isSelected ? "rgba(56, 189, 248, 0.3)" : "#1e293b";
      ctx.beginPath();
      ctx.moveTo(x + 25, y + 105);
      ctx.lineTo(x + colW - 25, y + 105);
      ctx.stroke();

      // Metrics
      const metrics = [
        { label: "State Corporate Tax", val: st.stateTax, highlight: true },
        { label: "Annual State Filing Fee", val: st.annualFee, highlight: false },
        { label: "Owner Privacy Protection", val: st.privacy, highlight: st.isSelected },
        { label: "Creditor Protection", val: st.chargingOrder, highlight: false },
        { label: "Standard Formation Speed", val: st.filingTime, highlight: false },
      ];

      metrics.forEach((m, mIdx) => {
        const my = y + 150 + mIdx * 80;
        ctx.fillStyle = "#94a3b8";
        ctx.font = "16px sans-serif";
        ctx.fillText(m.label, x + 25, my);

        ctx.fillStyle = m.highlight ? "#34d399" : "#ffffff";
        ctx.font = "bold 22px monospace";
        ctx.fillText(m.val, x + 25, my + 30);
      });

      // Bottom Button / Badge
      ctx.fillStyle = st.isSelected ? "#0284c7" : "#1e293b";
      ctx.beginPath();
      ctx.roundRect(x + 25, y + 550, colW - 50, 60, 12);
      ctx.fill();

      ctx.fillStyle = st.isSelected ? "#ffffff" : "#94a3b8";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        st.isSelected ? (p > 0.4 ? "✓ WYOMING SELECTED" : "SELECT WYOMING") : "SELECT STATE",
        x + colW / 2,
        y + 588
      );
      ctx.textAlign = "start";
    });

    // Bottom Decision Banner
    ctx.fillStyle = "#0c172b";
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 920, w - 120, 100, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("SELECTED CONFIGURATION: WYOMING LLC · JURISDICTION RATIFIED", 90, 960);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px sans-serif";
    ctx.fillText("Next: Commercial Registered Agent & Official Cheyenne, Wyoming Registered Office Address.", 90, 995);

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void {
    this.sceneGroup.visible = true;
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
