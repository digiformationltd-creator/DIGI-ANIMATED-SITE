import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneComp04Intervention implements CinematicScene {
  public id = "scene-comp-04-intervention";
  public title = "DigiFormation Compliance Resolution";
  public label = "04 RESOLUTION";
  public kicker = "04 · DIRECT GOV GATEWAY INTERVENTION";
  public description = "DigiFormation takes legal custody of the compliance workflow: filing electronic AD01 address amendment and retrieving replacement Companies House authentication credentials.";
  public statutoryNote = "DigiFormation Authorized Gateway · Automated XML WebFiling Protocol";
  public metricBadge = "INTERVENTION SUCCESSFUL";
  public startProgress = 0.6;
  public endProgress = 0.8;

  public transition: SceneTransition = { type: "SCREEN", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-COMP-04-INTERVENTION",
    reelNumber: "04 / 05",
    chapterTitle: "GOV GATEWAY INTERVENTION",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "40mm Master Prime",
    iso: 400,
    timecode: "00:04:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 4: GATEWAY RESOLUTION",
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

    ctx.fillStyle = "#070e17";
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#6ee7b7";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIGIFORMATION STATUTORY GATEWAY ENGINE · AUTOMATED FILING RELAY", 60, 44);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("TRANSACTION: ACCEPTED BY COMPANIES HOUSE", w - 60, 44);
    ctx.textAlign = "start";

    // 3 Resolution Columns
    const colW = (w - 180) / 3;

    // Col 1: AD01 Lodged
    ctx.fillStyle = "#0f2027";
    ctx.beginPath();
    ctx.roundRect(60, 110, colW, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 18px monospace";
    ctx.fillText("01 · AD01 REGISTERED", 90, 165);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Address Updated", 90, 210);

    const r1 = [
      { k: "Document", v: "Form AD01 Digital" },
      { k: "New Office", v: "71-75 Shelton St, London" },
      { k: "Postcode", v: "WC2H 9JQ" },
      { k: "Filing Status", v: "Officially Recorded" },
      { k: "Public Register", v: "Updated in Real Time" },
    ];
    r1.forEach((item, idx) => {
      const py = 260 + idx * 70;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(item.k, 90, py);
      ctx.fillStyle = "#d1fae5";
      ctx.font = "bold 17px monospace";
      ctx.fillText(item.v, 90, py + 26);
    });

    // Col 2: Auth Code Retrieved
    ctx.fillStyle = "#0f2027";
    ctx.beginPath();
    ctx.roundRect(80 + colW, 110, colW, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px monospace";
    ctx.fillText("02 · AUTH CODE KEY", 110 + colW, 165);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Code Secured", 110 + colW, 210);

    const r2 = [
      { k: "Credential", v: "Companies House Auth Code" },
      { k: "Key Value", v: "7K9-B2X-UK" },
      { k: "Vault Location", v: "DigiFormation Secure Vault" },
      { k: "WebFiling Status", v: "Direct Integration Active" },
      { k: "Re-issue Protocol", v: "Pre-authorized Delivery" },
    ];
    r2.forEach((item, idx) => {
      const py = 260 + idx * 70;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(item.k, 110 + colW, py);
      ctx.fillStyle = "#e0f2fe";
      ctx.font = "bold 17px monospace";
      ctx.fillText(item.v, 110 + colW, py + 26);
    });

    // Col 3: CS01 Lodged
    ctx.fillStyle = "#0f2027";
    ctx.beginPath();
    ctx.roundRect(100 + colW * 2, 110, colW, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
    ctx.stroke();

    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 18px monospace";
    ctx.fillText("03 · CS01 STATEMENT", 130 + colW * 2, 165);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("Confirmation Filed", 130 + colW * 2, 210);

    const r3 = [
      { k: "Statutory Return", v: "Form CS01 Confirmation" },
      { k: "Filing Submission", v: "Electronic Gateway Ack" },
      { k: "Directors / PSC", v: "Fully Verified" },
      { k: "Next Review Date", v: "14 February 2027" },
      { k: "Compliance Health", v: "100% Good Standing" },
    ];
    r3.forEach((item, idx) => {
      const py = 260 + idx * 70;
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(item.k, 130 + colW * 2, py);
      ctx.fillStyle = "#f3e8ff";
      ctx.font = "bold 17px monospace";
      ctx.fillText(item.v, 130 + colW * 2, py + 26);
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
