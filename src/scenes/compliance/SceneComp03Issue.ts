import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneComp03Issue implements CinematicScene {
  public id = "scene-comp-03-issue";
  public title = "Address Notice & Authentication Impediment";
  public label = "03 IMPEDIMENT";
  public kicker = "03 · AD01 14-DAY NOTICE & MISSING AUTH CODE";
  public description = "Director relocation requires Form AD01 submission to update the Registered Office. Crucially, the 6-character Companies House WebFiling authentication code is lost or expired.";
  public statutoryNote = "Form AD01 · Change of Registered Office Address · Auth Code Required";
  public metricBadge = "IMPEDIMENT DETECTED";
  public startProgress = 0.4;
  public endProgress = 0.6;

  public transition: SceneTransition = { type: "OBJECT", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-COMP-03-ISSUE",
    reelNumber: "03 / 05",
    chapterTitle: "ADDRESS NOTICE & AUTH CODE ISSUE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "50mm Master Prime",
    iso: 500,
    timecode: "00:03:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 3: COMPLIANCE BLOCKER",
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

    // Official Companies House Statutory Compliance Dossier Folder on desk
    const dossierGroup = new THREE.Group();
    dossierGroup.position.set(0.42, 0.76, 0.15);
    dossierGroup.rotation.y = -0.18;

    // Oxblood leather dossier folder
    const folderGeo = new THREE.BoxGeometry(0.24, 0.02, 0.32);
    const folderMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d, // Deep statutory oxblood red leather
      roughness: 0.65,
      metalness: 0.1,
    });
    const folder = new THREE.Mesh(folderGeo, folderMat);
    folder.castShadow = true;
    folder.receiveShadow = true;
    dossierGroup.add(folder);

    // Official gold brass spine binding
    const spineGeo = new THREE.BoxGeometry(0.025, 0.022, 0.322);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Polished statutory gold brass
      metalness: 0.85,
      roughness: 0.25,
    });
    const spine = new THREE.Mesh(spineGeo, brassMat);
    spine.position.x = -0.11;
    dossierGroup.add(spine);

    // Embossed gold Companies House seal medallion
    const sealGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.003, 24);
    const seal = new THREE.Mesh(sealGeo, brassMat);
    seal.position.set(0.04, 0.012, 0.05);
    dossierGroup.add(seal);

    this.sceneGroup.add(dossierGroup);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private renderScreen(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = "#0d090a";
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#3b070c";
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = "#fca5a5";
    ctx.font = "bold 20px monospace";
    ctx.fillText("COMPANIES HOUSE EXCEPTION DETECTED · FORM AD01 / AUTHENTICATION CODE", 60, 44);

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "right";
    ctx.fillText("STATUS: SUBMISSION BLOCKED", w - 60, 44);
    ctx.textAlign = "start";

    // 2 Impediment Cards
    const colW = (w - 160) / 2;

    // Card 1: AD01 Address Issue
    ctx.fillStyle = "#1c1114";
    ctx.beginPath();
    ctx.roundRect(60, 110, colW, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 20px monospace";
    ctx.fillText("STATUTORY OBSTACLE 01", 95, 165);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 32px sans-serif";
    ctx.fillText("Form AD01 Address Amendment", 95, 215);

    const adPoints = [
      { k: "Required Change", v: "Registered office relocation to commercial address" },
      { k: "Old Address", v: "Residential location (privacy exposure)" },
      { k: "New Address", v: "71-75 Shelton Street, Covent Garden, WC2H 9JQ" },
      { k: "Statutory Rule", v: "Must be filed within 14 days of premises change" },
      { k: "Delivery Impediment", v: "Requires company authorization signature or valid Auth Code" },
    ];

    adPoints.forEach((p, idx) => {
      const py = 280 + idx * 75;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText(p.k, 95, py);
      ctx.fillStyle = "#fee2e2";
      ctx.font = "bold 17px monospace";
      ctx.fillText(p.v, 95, py + 26);
    });

    // Card 2: Missing Authentication Code
    ctx.fillStyle = "#1c1114";
    ctx.beginPath();
    ctx.roundRect(100 + colW, 110, colW, 950, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 20px monospace";
    ctx.fillText("SECURITY OBSTACLE 02", 135 + colW, 165);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 32px sans-serif";
    ctx.fillText("Companies House Auth Code Missing", 135 + colW, 215);

    const authPoints = [
      { k: "Credential", v: "6-character alphanumeric digital security code" },
      { k: "Function", v: "Equivalent to company director signature online" },
      { k: "Current State", v: "Lost / Not received / Expired on legacy register" },
      { k: "Risk", v: "Cannot submit CS01 or AD01 through government gateway" },
      { k: "Standard Postal Time", v: "5 to 10 working days via physical mail" },
    ];

    authPoints.forEach((p, idx) => {
      const py = 280 + idx * 75;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText(p.k, 135 + colW, py);
      ctx.fillStyle = "#fee2e2";
      ctx.font = "bold 17px monospace";
      ctx.fillText(p.v, 135 + colW, py + 26);
    });

    // Bottom Action Banner
    ctx.fillStyle = "#450a0a";
    ctx.beginPath();
    ctx.roundRect(95, 780, w - 190, 110, 12);
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.stroke();

    ctx.fillStyle = "#fca5a5";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DIGIFORMATION ESCALATION INITIATED · LEGAL REPRESENTATIVE DISPATCH", w / 2, 825);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.fillText("DigiFormation API activates authorized digital retrieval and expedited address lodgement.", w / 2, 855);
    ctx.textAlign = "start";

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
