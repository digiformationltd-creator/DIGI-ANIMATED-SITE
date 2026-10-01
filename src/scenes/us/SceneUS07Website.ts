import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneUS07Website implements CinematicScene {
  public id = "scene-us-07-website";
  public title = "US E-Commerce Storefront";
  public label = "07 E-COMMERCE";
  public kicker = "07 · GLOBAL DIGITAL COMMERCE";
  public description = "Engineering an enterprise US e-commerce storefront for Vance Apex LLC. Optimized for international conversions, domestic USD acquiring, mobile checkout, and edge CDN propagation.";
  public statutoryNote = "PCI-DSS Level 1 Compliant · Shopify & Stripe Commerce Rails · USD Native Checkout";
  public metricBadge = "STOREFRONT · LIVE";
  public startProgress = 0.66;
  public endProgress = 0.77;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.15,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-US-07-WEBSITE",
    reelNumber: "07 / 09",
    chapterTitle: "US E-COMMERCE STOREFRONT",
    shutterSpeed: "1/48s",
    aperture: "T1.8",
    focalLength: "35mm Cine Prime",
    iso: 500,
    timecode: "00:07:15:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 7: E-COMMERCE SYSTEM DEPLOYED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.35, 1.5] as [number, number, number],
      target: [0.0, 1.0, 0.0] as [number, number, number],
      fov: 34,
    },
    end: {
      position: [0.0, 1.05, 0.75] as [number, number, number],
      target: [0.0, 0.98, 0.0] as [number, number, number],
      fov: 24,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private monitorMesh: THREE.Mesh | null = null;
  private shopifyLogo: HTMLImageElement | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1152;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    this.shopifyLogo = new Image();
    this.shopifyLogo.crossOrigin = "anonymous";
    this.shopifyLogo.src = "/assets/partners/shopify.png";
    this.shopifyLogo.onload = () => {
      this.renderStore();
    };
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const screenGeo = new THREE.PlaneGeometry(1.3, 0.72);
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

    const bezelGeo = new THREE.BoxGeometry(1.32, 0.74, 0.03);
    const bezelMat = this.materials.getMatteBlackMetal();
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.05, -0.016);
    this.sceneGroup.add(bezel);

    this.renderStore();
    threeScene.add(this.sceneGroup);
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));
    const t = p * p * (3 - 2 * p);

    const camX = 0.0;
    const camY = 1.35 + (1.05 - 1.35) * t;
    const camZ = 1.5 + (0.75 - 1.5) * t;

    const targetX = 0.0;
    const targetY = 1.0 + (0.98 - 1.0) * t;
    const targetZ = 0.0;

    const fov = 34 + (24 - 34) * t;
    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    this.renderStore();
  }

  private renderStore(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark sleek storefront theme
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // E-com Navigation Bar
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, w, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("VANCE APEX", 60, 48);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 14px monospace";
    ctx.fillText("USA STORE", 230, 48);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px sans-serif";
    ctx.fillText("Products       Technology       Specs       Support", 420, 48);

    // Right Cart Pill
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(w - 260, 16, 200, 48, 24);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px monospace";
    ctx.fillText("🛒 CART (1) · $349", w - 240, 47);

    // Product Showcase Left Column
    const colW = (w - 180) / 2;

    // Left: Product Visual Card
    ctx.fillStyle = "#111a2e";
    ctx.beginPath();
    ctx.roundRect(60, 110, colW, 660, 18);
    ctx.fill();

    // Stylized Headphone Visual
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(60 + colW / 2, 400, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText("APEX PRO STUDIO HEADPHONES", 60 + colW / 2, 400);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px sans-serif";
    ctx.fillText("Active Noise Cancelling · 60h Battery", 60 + colW / 2, 440);
    ctx.textAlign = "start";

    // Right Column: Checkout & Cart Review
    ctx.fillStyle = "#111a2e";
    ctx.beginPath();
    ctx.roundRect(100 + colW, 110, colW, 660, 18);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px monospace";
    ctx.fillText("SECURE US CHECKOUT · DOMESTIC USD SETTLEMENT", 140 + colW, 160);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("Order Summary", 140 + colW, 220);

    const items = [
      { name: "Apex Pro Studio Acoustics", price: "$349.00" },
      { name: "Wyoming Registered Address Delivery", price: "FREE" },
      { name: "Domestic US Sales Tax (WY)", price: "$0.00" },
      { name: "Total Billed via Stripe US", price: "$349.00 USD" },
    ];

    items.forEach((item, idx) => {
      const iy = 280 + idx * 60;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "20px sans-serif";
      ctx.fillText(item.name, 140 + colW, iy);

      ctx.fillStyle = idx === 3 ? "#34d399" : "#ffffff";
      ctx.font = idx === 3 ? "bold 24px monospace" : "bold 20px monospace";
      ctx.textAlign = "right";
      ctx.fillText(item.price, 100 + colW * 2 - 40, iy);
      ctx.textAlign = "start";
    });

    // Express Checkout Buttons
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(140 + colW, 540, colW - 80, 70, 14);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(" Pay  /  G Pay  /  Stripe Express", 140 + colW + (colW - 80) / 2, 584);

    // Live Badge
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(140 + colW, 640, colW - 80, 60, 12);
    ctx.fill();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("✓ LIVE E-COMMERCE CONVERSION ENGINE", 140 + colW + (colW - 80) / 2, 678);
    ctx.textAlign = "start";

    // Bottom Banner
    ctx.fillStyle = "#0c172b";
    ctx.beginPath();
    ctx.roundRect(60, 800, w - 120, 80, 14);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓ US STOREFRONT ONLINE · PROCEEDING TO DOMESTIC US BANKING INFRASTRUCTURE", w / 2, 850);
    ctx.textAlign = "start";

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
