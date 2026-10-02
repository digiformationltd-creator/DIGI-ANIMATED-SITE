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
      position: [0.0, 16.0, 32.0] as [number, number, number],
      target: [0.0, 13.5, 0.0] as [number, number, number],
      fov: 46,
    },
    end: {
      position: [0.0, 1.55, 3.6] as [number, number, number],
      target: [0.0, 1.15, -0.2] as [number, number, number],
      fov: 36,
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
    // 1. Add Photorealistic Corporate Headquarters Building & Campus
    this.sceneGroup.add(this.headquarters.getGroup());

    // 2. Add Interior Executive Office Suite
    this.buildExecutiveOffice();
    this.sceneGroup.add(this.officeGroup);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private buildExecutiveOffice(): void {
    // A. Executive Dark Granite & Walnut Floor inside office
    const floorGeo = new THREE.PlaneGeometry(24, 16);
    const floorMat = this.materials.getDarkFloorTile();
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.02, -4);
    floor.receiveShadow = true;
    this.officeGroup.add(floor);

    // B. Executive Cantilever Desk in Office Center
    const desk = new THREE.Group();
    desk.position.set(0, 0, -1.0);

    // Dark walnut tabletop with brushed titanium perimeter
    const topGeo = new THREE.BoxGeometry(2.1, 0.05, 0.95);
    const topMesh = new THREE.Mesh(topGeo, this.materials.getDarkWalnutWood());
    topMesh.position.set(0, 0.72, 0);
    topMesh.castShadow = true;
    desk.add(topMesh);

    const trimGeo = new THREE.BoxGeometry(2.12, 0.02, 0.97);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.getBrushedTitanium());
    trimMesh.position.set(0, 0.71, 0);
    desk.add(trimMesh);

    // Matte black legs
    const legGeo = new THREE.BoxGeometry(0.06, 0.7, 0.85);
    const legMat = this.materials.getMatteBlackMetal();
    const lLeg = new THREE.Mesh(legGeo, legMat);
    lLeg.position.set(-0.95, 0.35, 0);
    desk.add(lLeg);

    const rLeg = new THREE.Mesh(legGeo, legMat);
    rLeg.position.set(0.95, 0.35, 0);
    desk.add(rLeg);

    // Leather Runner Mat
    const matGeo = new THREE.BoxGeometry(1.2, 0.005, 0.5);
    const matMesh = new THREE.Mesh(matGeo, this.materials.getLeatherDeskMat());
    matMesh.position.set(0, 0.748, 0.08);
    desk.add(matMesh);

    // Sleek Desktop Studio Display (Compact, safe height Y = 0.98m)
    const dispGeo = new THREE.PlaneGeometry(0.68, 0.38);
    const dispCanvas = document.createElement("canvas");
    dispCanvas.width = 1024;
    dispCanvas.height = 576;
    const dCtx = dispCanvas.getContext("2d");
    if (dCtx) {
      dCtx.fillStyle = "#070b14";
      dCtx.fillRect(0, 0, 1024, 576);
      dCtx.strokeStyle = "rgba(56, 189, 248, 0.5)";
      dCtx.lineWidth = 4;
      dCtx.strokeRect(12, 12, 1000, 552);

      dCtx.fillStyle = "#38bdf8";
      dCtx.font = "bold 26px monospace";
      dCtx.fillText("DIGIFORMATION OPERATING SYSTEM", 50, 65);

      dCtx.fillStyle = "#ffffff";
      dCtx.font = "900 38px 'Inter', sans-serif";
      dCtx.fillText("EXECUTIVE COMMAND SUITE", 50, 130);

      dCtx.fillStyle = "#94a3b8";
      dCtx.font = "22px sans-serif";
      dCtx.fillText("5 ENTERPRISE PATHWAYS FULLY SYNCHRONIZED", 50, 185);

      const items = [
        "01 UK LTD FORMATION · COMPANIES HOUSE GATEWAY",
        "02 US LLC FORMATION · WYOMING · IRS RAILS",
        "03 COMPANY COMPLIANCE · STATUTORY CONFIRMATION",
        "04 DIGITAL BUILD · 3D WEBGL & AGENTIC FORGE",
        "05 DIGI BIZ OS · 700+ AGENTS AUTONOMOUS PLATFORM",
      ];
      items.forEach((txt, idx) => {
        dCtx.fillStyle = "rgba(255, 255, 255, 0.06)";
        dCtx.fillRect(50, 235 + idx * 58, 924, 46);
        dCtx.fillStyle = "#38bdf8";
        dCtx.font = "bold 18px monospace";
        dCtx.fillText(`● ${txt}`, 70, 265 + idx * 58);
      });
    }

    const dispTexture = new THREE.CanvasTexture(dispCanvas);
    dispTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(dispTexture);

    const dispMat = new THREE.MeshStandardMaterial({
      map: dispTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: dispTexture,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.1,
    });
    const dispMesh = new THREE.Mesh(dispGeo, dispMat);
    dispMesh.position.set(0, 0.98, -0.15);
    desk.add(dispMesh);

    // Bezel for display
    const bezelGeo = new THREE.BoxGeometry(0.7, 0.4, 0.02);
    const bezel = new THREE.Mesh(bezelGeo, this.materials.getAnodizedAluminum());
    bezel.position.set(0, 0.98, -0.162);
    desk.add(bezel);

    this.deskMesh = desk;
    this.officeGroup.add(desk);

    // C. Glowing Title Plaque (Screen-Safe Dimensions & Height)
    const titleCanvas = document.createElement("canvas");
    titleCanvas.width = 1600;
    titleCanvas.height = 320;
    const tCtx = titleCanvas.getContext("2d");
    if (tCtx) {
      tCtx.fillStyle = "rgba(7, 10, 16, 0.95)";
      tCtx.fillRect(0, 0, 1600, 320);

      tCtx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      tCtx.lineWidth = 3;
      tCtx.strokeRect(10, 10, 1580, 300);

      tCtx.fillStyle = "#38bdf8";
      tCtx.font = "bold 20px monospace";
      tCtx.textAlign = "center";
      tCtx.fillText("DIGIFORMATION CINEMATIC ECOSYSTEM", 800, 52);

      tCtx.fillStyle = "#ffffff";
      tCtx.font = "900 42px 'Inter', sans-serif";
      tCtx.fillText("BUILD YOUR BUSINESS. BUILD YOUR DIGITAL FUTURE.", 800, 125);

      tCtx.fillStyle = "#94a3b8";
      tCtx.font = "18px sans-serif";
      tCtx.fillText("FIVE INTEGRATED CINEMATIC REELS · SELECT A PATHWAY BELOW", 800, 185);
    }
    const tTexture = new THREE.CanvasTexture(titleCanvas);
    tTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(tTexture);

    const titleGeo = new THREE.PlaneGeometry(2.3, 0.38);
    const titleMat = new THREE.MeshStandardMaterial({
      map: tTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: tTexture,
      emissiveIntensity: 0.85,
      roughness: 0.15,
      metalness: 0.1,
    });
    this.titleMesh = new THREE.Mesh(titleGeo, titleMat);
    this.titleMesh.position.set(0, 1.88, -2.0);
    this.officeGroup.add(this.titleMesh);

    // D. Five Spatial Process Stations (Screen-Safe Dimensions & Alignment)
    const films = [
      {
        num: "01",
        title: "UK LTD",
        fullTitle: "UK LTD FORMATION",
        sub: "Companies House & HMRC",
        tag: "10 REELS",
        color: "#38bdf8",
        badge: "ENGLISH LAW",
        heroSrc: "/assets/heroes/card-hero-uk-ltd.jpg",
      },
      {
        num: "02",
        title: "US LLC",
        fullTitle: "US LLC FORMATION",
        sub: "Wyoming & IRS EIN Rails",
        tag: "9 REELS",
        color: "#60a5fa",
        badge: "US JURISDICTION",
        heroSrc: "/assets/heroes/card-hero-us-llc.jpg",
      },
      {
        num: "03",
        title: "COMPLIANCE",
        fullTitle: "COMPANY COMPLIANCE",
        sub: "Statutory Filings & Accounts",
        tag: "5 REELS",
        color: "#34d399",
        badge: "GOOD STANDING",
        heroSrc: "/assets/heroes/card-hero-tax.jpg",
      },
      {
        num: "04",
        title: "DIGITAL BUILD",
        fullTitle: "DIGITAL PRODUCT SUITE",
        sub: "3D Web & Agentic Software",
        tag: "5 REELS",
        color: "#a855f7",
        badge: "SOFTWARE FORGE",
        heroSrc: "/assets/heroes/card-hero-web.jpg",
      },
      {
        num: "05",
        title: "BIZ OS",
        fullTitle: "DIGI BIZ OS",
        sub: "Voice OS & 700+ Agents",
        tag: "5 REELS",
        color: "#f59e0b",
        badge: "AUTONOMOUS OPS",
        heroSrc: "/assets/heroes/card-hero-banking.jpg",
      },
    ];

    const cardWidth = 0.46;
    const cardHeight = 0.88;
    const spacing = 0.52;
    const startX = -((films.length - 1) * spacing) / 2;

    films.forEach((film, idx) => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 640;
      pCanvas.height = 1100;
      const ctx = pCanvas.getContext("2d");

      const pTexture = new THREE.CanvasTexture(pCanvas);
      pTexture.colorSpace = THREE.SRGBColorSpace;
      this.canvasTextures.push(pTexture);

      const renderCard = (heroImage?: HTMLImageElement) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, 640, 1100);

        // Dark slate backdrop
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, 640, 1100);

        // Real Hero Photograph (if loaded)
        if (heroImage && heroImage.complete && heroImage.naturalWidth > 0) {
          ctx.drawImage(heroImage, 0, 0, 640, 360);
          // Dark gradient vignette overlay on photo bottom
          const photoGrad = ctx.createLinearGradient(0, 200, 0, 360);
          photoGrad.addColorStop(0, "rgba(9, 13, 22, 0.0)");
          photoGrad.addColorStop(1, "rgba(9, 13, 22, 1.0)");
          ctx.fillStyle = photoGrad;
          ctx.fillRect(0, 200, 640, 160);
        } else {
          // Fallback sleek geometric hero area
          const hGrad = ctx.createLinearGradient(0, 0, 0, 360);
          hGrad.addColorStop(0, "#1e293b");
          hGrad.addColorStop(1, "#090d16");
          ctx.fillStyle = hGrad;
          ctx.fillRect(0, 0, 640, 360);
        }

        // Card Frame with Brand Color
        ctx.strokeStyle = film.color;
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, 620, 1080);

        // Top Reel Number & Tag
        ctx.fillStyle = film.color;
        ctx.font = "bold 56px monospace";
        ctx.textAlign = "left";
        ctx.fillText(film.num, 40, 430);

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "right";
        ctx.fillText(film.tag, 600, 420);

        // Badge Pill
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.roundRect(40, 470, 320, 42, 21);
        ctx.fill();
        ctx.fillStyle = film.color;
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`● ${film.badge}`, 60, 498);

        // Title & Subtitle
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 40px 'Inter', sans-serif";
        ctx.fillText(film.fullTitle, 40, 590);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "24px sans-serif";
        ctx.fillText(film.sub, 40, 645);

        // Geometric Concentric Rings
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(320, 810, 40 + i * 28, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Center Node
        ctx.fillStyle = film.color;
        ctx.beginPath();
        ctx.arc(320, 810, 18, 0, Math.PI * 2);
        ctx.fill();

        // Bottom CTA Button
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.roundRect(40, 950, 560, 100, 16);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ENTER FILM →", 320, 1010);

        pTexture.needsUpdate = true;
      };

      // Load real hero image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = film.heroSrc;
      img.onload = () => renderCard(img);

      // Initial render
      renderCard();

      const pGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const pMat = new THREE.MeshStandardMaterial({
        map: pTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: pTexture,
        emissiveIntensity: 0.85,
        roughness: 0.15,
        metalness: 0.2,
      });

      const pMesh = new THREE.Mesh(pGeo, pMat);
      const posX = startX + idx * spacing;
      // Curved arc at Z = -2.2m
      const posZ = -2.2 - Math.abs(idx - 2) * 0.14;
      const rotY = (idx - 2) * -0.06;

      pMesh.position.set(posX, 1.15, posZ);
      pMesh.rotation.y = rotY;
      this.portalMeshes.push(pMesh);
      this.officeGroup.add(pMesh);

      // Sleek Brushed Titanium Base
      const baseGeo = new THREE.BoxGeometry(cardWidth + 0.06, 0.05, 0.3);
      const base = new THREE.Mesh(baseGeo, this.materials.getBrushedTitanium());
      base.position.set(posX, 0.025, posZ);
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

  // Camera trajectory: Exterior Drone Sky -> Plaza -> Revolving Doors -> Executive Suite Inside
  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));

    let camPos: [number, number, number];
    let camTarget: [number, number, number];
    let fov: number;

    if (p < 0.35) {
      // Stage 1: High Drone Aerial View framing the Google-Style Headquarters & Silver Steel Logo
      const t = p / 0.35;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(24.0, 3.2, ease),
        THREE.MathUtils.lerp(46.0, 8.5, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(18.5, 2.0, ease),
        THREE.MathUtils.lerp(1.0, 1.0, ease),
      ];
      fov = THREE.MathUtils.lerp(46, 38, ease);
    } else if (p < 0.55) {
      // Stage 2: Gliding through the grand entrance revolving doors into the executive foyer
      const t = (p - 0.35) / 0.20;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(3.2, 1.6, ease),
        THREE.MathUtils.lerp(8.5, 1.2, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(2.0, 1.15, ease),
        THREE.MathUtils.lerp(1.0, -2.0, ease),
      ];
      fov = THREE.MathUtils.lerp(38, 36, ease);
    } else {
      // Stage 3: Inside the Executive Suite - Desk & 5 Process Stations in Full Screen-Safe View
      const t = (p - 0.55) / 0.45;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(1.6, 1.45, ease),
        THREE.MathUtils.lerp(1.2, 0.4, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(1.15, 1.1, ease),
        THREE.MathUtils.lerp(-2.0, -2.2, ease),
      ];
      fov = 36;
    }

    cameraController.setWaypoints(
      { position: camPos, target: camTarget, fov },
      { position: camPos, target: camTarget, fov },
      1.0
    );
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    const time = Date.now() * 0.001;

    // Update headquarters animations (metallic logo gleams, night floodlights)
    this.headquarters.update(sceneProgress, delta);

    // Subtle floating breath on portals
    this.portalMeshes.forEach((mesh, idx) => {
      mesh.position.y = 1.15 + Math.sin(time + idx * 0.8) * 0.012;
    });

    if (this.titleMesh) {
      this.titleMesh.position.y = 1.88 + Math.cos(time * 0.5) * 0.008;
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
