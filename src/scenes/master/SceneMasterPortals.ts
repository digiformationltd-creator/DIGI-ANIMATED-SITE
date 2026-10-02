import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";
import { CorporateHeadquarters } from "../../environment/CorporateHeadquarters";

export class SceneMasterPortals implements CinematicScene {
  public id = "scene-master-portals";
  public title = "DigiFormation Limited";
  public label = "00 MASTER";
  public kicker = "00 · GLOBAL HEADQUARTERS";
  public description = "Global Headquarters & Sovereign Digital Campus. Scroll down to enter the executive office and explore the 5 enterprise formations.";
  public statutoryNote = "DigiFormation Limited · Registered in England & Wales · Corporate Headquarters";
  public metricBadge = "CAMPUS EXTERIOR · LONDON HQ";
  public startProgress = 0.0;
  public endProgress = 1.0;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.2,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-MASTER-PORTAL",
    reelNumber: "MASTER",
    chapterTitle: "GLOBAL HEADQUARTERS",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "28mm Anamorphic Wide",
    iso: 320,
    timecode: "00:00:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "CAMPUS APPROACH",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 18.0, 36.0] as [number, number, number],
      target: [0.0, 14.5, 0.0] as [number, number, number],
      fov: 48,
    },
    end: {
      position: [0.0, 1.55, 3.2] as [number, number, number],
      target: [0.0, 1.15, -0.2] as [number, number, number],
      fov: 34,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private headquarters: CorporateHeadquarters;
  private officeGroup: THREE.Group = new THREE.Group();
  private portalMeshes: THREE.Mesh[] = [];
  private canvasTextures: THREE.CanvasTexture[] = [];
  private titleMesh: THREE.Mesh | null = null;
  private deskMesh: THREE.Group | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.headquarters = new CorporateHeadquarters();
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Add Google-style Monumental Corporate Headquarters Campus
    this.sceneGroup.add(this.headquarters.getGroup());

    // 2. Add Interior Executive Office Suite (Situated inside behind glass entrance)
    this.buildExecutiveOffice();
    this.sceneGroup.add(this.officeGroup);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private buildExecutiveOffice(): void {
    // A. Executive Dark Walnut Floor inside office (Width: 26m, Depth: 16m)
    const floorGeo = new THREE.PlaneGeometry(26, 16);
    const floorMat = this.materials.getDarkFloorTile();
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.02, -5);
    floor.receiveShadow = true;
    this.officeGroup.add(floor);

    // B. Executive Cantilever Desk in Center of Office
    const desk = new THREE.Group();
    desk.position.set(0, 0, 0.4);

    // Dark walnut tabletop with titanium trim
    const topGeo = new THREE.BoxGeometry(2.4, 0.06, 1.1);
    const topMesh = new THREE.Mesh(topGeo, this.materials.getDarkWalnutWood());
    topMesh.position.set(0, 0.74, 0);
    topMesh.castShadow = true;
    desk.add(topMesh);

    const trimGeo = new THREE.BoxGeometry(2.42, 0.02, 1.12);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.getBrushedTitanium());
    trimMesh.position.set(0, 0.73, 0);
    desk.add(trimMesh);

    // Cantilever Legs
    const legGeo = new THREE.BoxGeometry(0.06, 0.72, 0.95);
    const legMat = this.materials.getMatteBlackMetal();
    const lLeg = new THREE.Mesh(legGeo, legMat);
    lLeg.position.set(-1.05, 0.36, 0);
    desk.add(lLeg);

    const rLeg = new THREE.Mesh(legGeo, legMat);
    rLeg.position.set(1.05, 0.36, 0);
    desk.add(rLeg);

    // Leather Mat on Desk
    const matGeo = new THREE.BoxGeometry(1.3, 0.005, 0.55);
    const matMesh = new THREE.Mesh(matGeo, this.materials.getLeatherDeskMat());
    matMesh.position.set(0, 0.772, 0.08);
    desk.add(matMesh);

    // Sleek Studio Display on Desk
    const dispGeo = new THREE.PlaneGeometry(0.75, 0.45);
    const dispCanvas = document.createElement("canvas");
    dispCanvas.width = 1024;
    dispCanvas.height = 600;
    const dCtx = dispCanvas.getContext("2d");
    if (dCtx) {
      dCtx.fillStyle = "#090d16";
      dCtx.fillRect(0, 0, 1024, 600);
      dCtx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      dCtx.lineWidth = 4;
      dCtx.strokeRect(10, 10, 1004, 580);

      dCtx.fillStyle = "#38bdf8";
      dCtx.font = "bold 28px monospace";
      dCtx.fillText("DIGIFORMATION OPERATING SYSTEM", 50, 70);

      dCtx.fillStyle = "#ffffff";
      dCtx.font = "900 42px sans-serif";
      dCtx.fillText("EXECUTIVE SUITE ACTIVE", 50, 140);

      dCtx.fillStyle = "#94a3b8";
      dCtx.font = "24px sans-serif";
      dCtx.fillText("5 ENTERPRISE PATHWAYS SYNCHRONIZED", 50, 200);

      // Mini status bars
      ["UK LTD · READY", "US LLC · READY", "COMPLIANCE · ACTIVE", "DIGITAL BUILD · EDGE", "BIZ OS · AUTONOMOUS"].forEach((txt, i) => {
        dCtx.fillStyle = "rgba(255, 255, 255, 0.08)";
        dCtx.fillRect(50, 260 + i * 55, 924, 40);
        dCtx.fillStyle = "#38bdf8";
        dCtx.font = "bold 20px monospace";
        dCtx.fillText(`● ${txt}`, 70, 288 + i * 55);
      });
    }
    const dispTexture = new THREE.CanvasTexture(dispCanvas);
    dispTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(dispTexture);

    const dispMat = new THREE.MeshStandardMaterial({
      map: dispTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: dispTexture,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.1,
    });
    const dispMesh = new THREE.Mesh(dispGeo, dispMat);
    dispMesh.position.set(0, 1.05, -0.15);
    desk.add(dispMesh);

    // Bezel for display
    const bezelGeo = new THREE.BoxGeometry(0.77, 0.47, 0.02);
    const bezel = new THREE.Mesh(bezelGeo, this.materials.getAnodizedAluminum());
    bezel.position.set(0, 1.05, -0.162);
    desk.add(bezel);

    this.deskMesh = desk;
    this.officeGroup.add(desk);

    // C. Center Architectural Monolith (Behind Desk)
    const monolithGeo = new THREE.BoxGeometry(0.8, 3.8, 0.8);
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });
    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    monolith.position.set(0, 1.9, -3.2);
    this.officeGroup.add(monolith);

    // D. Glowing Title Plaque in Mid-Air
    const titleCanvas = document.createElement("canvas");
    titleCanvas.width = 1600;
    titleCanvas.height = 400;
    const tCtx = titleCanvas.getContext("2d");
    if (tCtx) {
      tCtx.fillStyle = "rgba(7, 9, 12, 0.95)";
      tCtx.fillRect(0, 0, 1600, 400);

      tCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      tCtx.lineWidth = 2;
      tCtx.strokeRect(10, 10, 1580, 380);

      tCtx.fillStyle = "#38bdf8";
      tCtx.font = "bold 22px monospace";
      tCtx.textAlign = "center";
      tCtx.fillText("DIGIFORMATION CINEMATIC ECOSYSTEM", 800, 65);

      tCtx.fillStyle = "#ffffff";
      tCtx.font = "900 46px sans-serif";
      tCtx.fillText("BUILD YOUR BUSINESS.", 800, 140);
      tCtx.fillText("BUILD YOUR DIGITAL FUTURE.", 800, 205);

      tCtx.fillStyle = "#94a3b8";
      tCtx.font = "20px sans-serif";
      tCtx.fillText("FIVE INTEGRATED CINEMATIC REELS · SELECT A PATHWAY BELOW", 800, 275);
    }
    const tTexture = new THREE.CanvasTexture(titleCanvas);
    tTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(tTexture);

    const titleGeo = new THREE.PlaneGeometry(3.6, 0.9);
    const titleMat = new THREE.MeshStandardMaterial({
      map: tTexture,
      emissive: 0xffffff,
      emissiveMap: tTexture,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.titleMesh = new THREE.Mesh(titleGeo, titleMat);
    this.titleMesh.position.set(0, 2.7, -1.2);
    this.officeGroup.add(this.titleMesh);

    // E. Five Spatial Portals / Processes inside the Office
    const films = [
      {
        num: "01",
        title: "UK LTD FORMATION",
        sub: "Companies House · HMRC · Banking",
        tag: "10 CHAPTERS",
        color: "#38bdf8",
        badge: "ENGLISH COMMON LAW",
      },
      {
        num: "02",
        title: "US LLC FORMATION",
        sub: "Wyoming · IRS EIN · Domestic ACH",
        tag: "9 CHAPTERS",
        color: "#60a5fa",
        badge: "AMERICAN JURISDICTION",
      },
      {
        num: "03",
        title: "COMPANY COMPLIANCE",
        sub: "Confirmation Statements · Accounts · AD01",
        tag: "5 CHAPTERS",
        color: "#34d399",
        badge: "GOOD STANDING",
      },
      {
        num: "04",
        title: "DIGITAL BUILD",
        sub: "2D Web · 3D WebGL · Agentic Software",
        tag: "5 CHAPTERS",
        color: "#a855f7",
        badge: "DIGITAL PRODUCT SUITE",
      },
      {
        num: "05",
        title: "DIGI BIZ OS",
        sub: "Voice Operating System · 700+ Agents",
        tag: "5 CHAPTERS",
        color: "#f59e0b",
        badge: "ENTERPRISE AUTONOMY",
      },
    ];

    const portalWidth = 0.95;
    const portalHeight = 1.55;
    const spacing = 1.3;
    const startX = -((films.length - 1) * spacing) / 2;

    films.forEach((film, idx) => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 800;
      pCanvas.height = 1280;
      const ctx = pCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 1280);
        grad.addColorStop(0, "#0f172a");
        grad.addColorStop(1, "#020617");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 1280);

        ctx.strokeStyle = film.color;
        ctx.lineWidth = 6;
        ctx.strokeRect(16, 16, 768, 1248);

        ctx.fillStyle = film.color;
        ctx.font = "bold 64px monospace";
        ctx.textAlign = "left";
        ctx.fillText(film.num, 50, 110);

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "right";
        ctx.fillText(film.tag, 750, 95);

        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.roundRect(50, 150, 360, 48, 24);
        ctx.fill();
        ctx.fillStyle = film.color;
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`● ${film.badge}`, 75, 182);

        ctx.fillStyle = "#ffffff";
        ctx.font = "900 48px sans-serif";
        ctx.fillText(film.title, 50, 310);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "26px sans-serif";
        ctx.fillText(film.sub, 50, 370);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.arc(400, 680, 60 + i * 36, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = film.color;
        ctx.beginPath();
        ctx.arc(400, 680, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.beginPath();
        ctx.roundRect(50, 1050, 700, 150, 20);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ENTER CINEMATIC FILM →", 400, 1135);

        ctx.fillStyle = "#64748b";
        ctx.font = "20px monospace";
        ctx.fillText("DIGIFORMATION PRODUCTION", 400, 1175);
      }

      const pTexture = new THREE.CanvasTexture(pCanvas);
      pTexture.colorSpace = THREE.SRGBColorSpace;
      this.canvasTextures.push(pTexture);

      const pGeo = new THREE.PlaneGeometry(portalWidth, portalHeight);
      const pMat = new THREE.MeshStandardMaterial({
        map: pTexture,
        emissive: 0xffffff,
        emissiveMap: pTexture,
        emissiveIntensity: 0.8,
        roughness: 0.15,
        metalness: 0.2,
      });

      const pMesh = new THREE.Mesh(pGeo, pMat);
      const posX = startX + idx * spacing;
      const posZ = -0.6 - Math.abs(idx - 2) * 0.28;
      const rotY = (idx - 2) * -0.09;

      pMesh.position.set(posX, 1.25, posZ);
      pMesh.rotation.y = rotY;
      this.portalMeshes.push(pMesh);
      this.officeGroup.add(pMesh);

      const baseGeo = new THREE.BoxGeometry(portalWidth + 0.1, 0.08, 0.4);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(posX, 0.04, posZ);
      base.rotation.y = rotY;
      this.officeGroup.add(base);
    });
  }

  public enter(): void {
    this.sceneGroup.visible = true;
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  // Multi-point cinematic camera flight: Campus Sky -> Plaza -> Glass Entrance -> Office Suite
  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));

    let camPos: [number, number, number];
    let camTarget: [number, number, number];
    let fov: number;

    if (p < 0.35) {
      // Stage 1: High Elevation Exterior Sky & Campus Approach
      // Camera looks up at Google-style headquarters building and Silver Steel DigiFormation Limited logo
      const t = p / 0.35;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        THREE.MathUtils.lerp(0.0, 0.0, ease),
        THREE.MathUtils.lerp(18.0, 3.8, ease),
        THREE.MathUtils.lerp(36.0, 10.5, ease),
      ];
      camTarget = [
        THREE.MathUtils.lerp(0.0, 0.0, ease),
        THREE.MathUtils.lerp(14.5, 2.5, ease),
        THREE.MathUtils.lerp(0.0, 0.8, ease),
      ];
      fov = THREE.MathUtils.lerp(48, 40, ease);
    } else if (p < 0.55) {
      // Stage 2: Gliding through the Grand Glass Facade / Entrance Atrium
      const t = (p - 0.35) / 0.20;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(3.8, 1.85, ease),
        THREE.MathUtils.lerp(10.5, 4.2, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(2.5, 1.25, ease),
        THREE.MathUtils.lerp(0.8, 0.0, ease),
      ];
      fov = THREE.MathUtils.lerp(40, 36, ease);
    } else {
      // Stage 3: Inside Executive Office Suite & 5 Processes
      const t = (p - 0.55) / 0.45;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(1.85, 1.55, ease),
        THREE.MathUtils.lerp(4.2, 3.2, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(1.25, 1.15, ease),
        THREE.MathUtils.lerp(0.0, -0.2, ease),
      ];
      fov = THREE.MathUtils.lerp(36, 34, ease);
    }

    cameraController.setWaypoints(
      { position: camPos, target: camTarget, fov },
      { position: camPos, target: camTarget, fov },
      1.0
    );
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    const time = Date.now() * 0.001;

    // Update headquarters animations (logo gleam, lights)
    this.headquarters.update(sceneProgress, delta);

    // Subtle floating breath on portals
    this.portalMeshes.forEach((mesh, idx) => {
      mesh.position.y = 1.25 + Math.sin(time + idx * 0.8) * 0.015;
    });

    if (this.titleMesh) {
      this.titleMesh.position.y = 2.7 + Math.cos(time * 0.5) * 0.012;
    }

    // Dynamic HUD context switching between Exterior Campus and Interior Office Suite
    if (sceneProgress < 0.40) {
      this.kicker = "00 · GLOBAL HEADQUARTERS";
      this.title = "DigiFormation Limited";
      this.description = "Global Headquarters & Sovereign Digital Campus. Scroll down to enter the executive office and explore the 5 enterprise formations.";
      this.statutoryNote = "DigiFormation Limited · Registered in England & Wales · Corporate Headquarters";
      this.metricBadge = "CAMPUS EXTERIOR · LONDON HQ";
      this.telemetry.statutoryStep = "CAMPUS APPROACH";
      this.telemetry.chapterTitle = "GLOBAL HEADQUARTERS";
    } else {
      this.kicker = "00 · EXECUTIVE OFFICE SUITE";
      this.title = "DigiFormation Master Nexus";
      this.description = "Inside the executive suite. Select an enterprise pathway below to enter its dedicated scroll-driven cinematic journey.";
      this.statutoryNote = "5 Sovereign Commercial Experiences · Select a Process Below";
      this.metricBadge = "OFFICE SUITE · 5 PROCESSES ACTIVE";
      this.telemetry.statutoryStep = "PORTAL DISCOVERY";
      this.telemetry.chapterTitle = "EXECUTIVE OFFICE SUITE";
    }
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.headquarters.dispose();
    this.canvasTextures.forEach((t) => t.dispose());
  }
}
