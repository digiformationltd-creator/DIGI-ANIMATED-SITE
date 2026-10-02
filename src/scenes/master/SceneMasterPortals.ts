import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";
import { MaterialFactory } from "../../core/MaterialFactory";
import { CinematicEarthOrbit } from "../../environment/CinematicEarthOrbit";
import { CorporateHeadquarters } from "../../environment/CorporateHeadquarters";
import { OfficeInterior } from "../../environment/OfficeInterior";

/**
 * SceneMasterPortals
 * High-End Cinematic Opening Sequence for DigiFormation:
 * EARTH → HIGH ALTITUDE → FAST DESCENT → LOCATION LOCK → CORPORATE HEADQUARTERS →
 * EXTERIOR SILVER LOGO → BUILDING FACADE → WINDOW SELECTION → WINDOW ENTRY →
 * REAL DIGIFORMATION OFFICE → INTERIOR SILVER LOGO → MALE CORPORATE OFFICER → 5 ENTERPRISE PATHWAYS.
 */
export class SceneMasterPortals implements CinematicScene {
  public id = "scene-master-portals";
  public title = "DigiFormation Limited";
  public label = "00 MASTER";
  public kicker = "00 · PLANETARY APEX";
  public description = "High-altitude orbital view establishing international corporate formation infrastructure across sovereign jurisdictions.";
  public statutoryNote = "Orbital Apex · 35,786 KM · High Altitude Global Network";
  public metricBadge = "PLANETARY ESTABLISHING";
  public startProgress = 0.0;
  public endProgress = 1.0;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.2,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-MASTER-PORTAL",
    reelNumber: "MASTER",
    chapterTitle: "GLOBAL ORBIT",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "18mm Cosmic Ultra-Wide",
    iso: 320,
    timecode: "00:00:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "EARTH APEX",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 32.0, 85.0] as [number, number, number],
      target: [0.0, -10.0, -15.0] as [number, number, number],
      fov: 50,
    },
    end: {
      position: [0.0, 1.45, 0.28] as [number, number, number],
      target: [0.0, 1.15, -1.8] as [number, number, number],
      fov: 36,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private earthOrbit: CinematicEarthOrbit;
  private headquarters: CorporateHeadquarters;
  private officeInterior: OfficeInterior;
  private portalsGroup: THREE.Group = new THREE.Group();
  private portalMeshes: THREE.Mesh[] = [];
  private canvasTextures: THREE.CanvasTexture[] = [];
  private materials = MaterialFactory.getInstance();
  private threeScene: THREE.Scene | null = null;

  constructor() {
    this.earthOrbit = new CinematicEarthOrbit();
    this.headquarters = new CorporateHeadquarters();
    this.officeInterior = new OfficeInterior();
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    this.threeScene = threeScene;

    // 1. Add High-Altitude Cinematic Earth Orbit & Space
    this.sceneGroup.add(this.earthOrbit.getGroup());

    // 2. Add Photorealistic Corporate Headquarters Building & Campus
    this.sceneGroup.add(this.headquarters.getGroup());

    // 3. Add Real DigiFormation Office Suite & Male Officer
    this.sceneGroup.add(this.officeInterior.getGroup());

    // 4. Add Screen-Safe Interactive Enterprise Process Portals
    this.buildProcessPortals();
    this.sceneGroup.add(this.portalsGroup);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  public enter(): void {
    this.sceneGroup.visible = true;
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  // 5 Process Portal Cards arranged inside screen-safe boundaries
  private buildProcessPortals(): void {
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
        color: "#c084fc",
        badge: "SOFTWARE FORGE",
        heroSrc: "/assets/heroes/card-hero-web.jpg",
      },
      {
        num: "05",
        title: "DIGI BIZ OS",
        fullTitle: "DIGI BIZ OS",
        sub: "Voice OS & 700+ Agents",
        tag: "5 REELS",
        color: "#fbbf24",
        badge: "AUTONOMOUS OPS",
        heroSrc: "/assets/heroes/card-hero-banking.jpg",
      },
    ];

    const cardWidth = 0.46;
    const cardHeight = 0.88;
    const spacing = 0.52;
    const totalSpan = (films.length - 1) * spacing;
    const startX = -totalSpan / 2;
    const posZ = -2.2;

    films.forEach((film, idx) => {
      const cardCanvas = document.createElement("canvas");
      cardCanvas.width = 1024;
      cardCanvas.height = 1960;
      const ctx = cardCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#070b14";
        ctx.fillRect(0, 0, 1024, 1960);

        // Header
        ctx.fillStyle = film.color;
        ctx.font = "bold 92px monospace";
        ctx.fillText(film.num, 60, 140);

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 36px monospace";
        ctx.textAlign = "right";
        ctx.fillText(film.tag, 964, 130);
        ctx.textAlign = "left";

        // Jurisdiction Pill
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.roundRect(60, 190, 320, 56, 28);
        ctx.fill();
        ctx.fillStyle = film.color;
        ctx.beginPath();
        ctx.arc(88, 218, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px monospace";
        ctx.fillText(film.badge, 115, 227);

        // Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 68px 'Inter', sans-serif";
        ctx.fillText(film.fullTitle, 60, 340);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "38px sans-serif";
        ctx.fillText(film.sub, 60, 410);

        // Radar Graphic
        ctx.save();
        ctx.translate(512, 1020);
        for (let r = 80; r <= 360; r += 70) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = film.color;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // CTA Button
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
        ctx.beginPath();
        ctx.roundRect(80, 1680, 864, 160, 80);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "900 44px monospace";
        ctx.textAlign = "center";
        ctx.fillText("ENTER FILM →", 512, 1780);
      }

      const cardTex = new THREE.CanvasTexture(cardCanvas);
      cardTex.colorSpace = THREE.SRGBColorSpace;
      this.canvasTextures.push(cardTex);

      // Hero photographic texture
      const heroImg = new Image();
      heroImg.crossOrigin = "anonymous";
      heroImg.src = film.heroSrc;
      heroImg.onload = () => {
        if (!ctx) return;
        ctx.drawImage(heroImg, 60, 480, 904, 780);
        ctx.strokeStyle = film.color;
        ctx.lineWidth = 6;
        ctx.strokeRect(60, 480, 904, 780);
        cardTex.needsUpdate = true;
      };

      const geo = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const mat = new THREE.MeshStandardMaterial({
        map: cardTex,
        roughness: 0.18,
        metalness: 0.45,
        emissive: new THREE.Color(film.color),
        emissiveIntensity: 0.12,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const posX = startX + idx * spacing;
      mesh.position.set(posX, 1.15, posZ);
      mesh.userData = { filmId: films[idx].num };

      // Outer Glow Border
      const borderGeo = new THREE.BoxGeometry(cardWidth + 0.02, cardHeight + 0.02, 0.01);
      const borderMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(film.color),
        wireframe: true,
      });
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.position.z = -0.006;
      mesh.add(border);

      this.portalMeshes.push(mesh);
      this.portalsGroup.add(mesh);
    });
  }

  // Camera Trajectory: Earth -> Space Dive -> Location -> Campus -> Exterior Logo -> Window -> Office -> Male Officer
  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));

    let camPos: [number, number, number];
    let camTarget: [number, number, number];
    let fov: number;

    if (p < 0.10) {
      // Stage 1: Earth High-Altitude Orbit in Deep Space
      const t = p / 0.10;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(32.0, 26.0, ease),
        THREE.MathUtils.lerp(85.0, 68.0, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(-10.0, -8.0, ease),
        THREE.MathUtils.lerp(-15.0, -10.0, ease),
      ];
      fov = THREE.MathUtils.lerp(50, 46, ease);
    } else if (p < 0.25) {
      // Stage 2: Fast Kinetic Stratospheric Descent
      const t = (p - 0.10) / 0.15;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(26.0, 16.0, ease),
        THREE.MathUtils.lerp(68.0, 36.0, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(-8.0, 8.0, ease),
        THREE.MathUtils.lerp(-10.0, 10.0, ease),
      ];
      fov = THREE.MathUtils.lerp(46, 40, ease);
    } else if (p < 0.35) {
      // Stage 3: Regional London Spatial Lock & 3D Scan
      const t = (p - 0.25) / 0.10;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        THREE.MathUtils.lerp(0.0, -4.0, ease),
        THREE.MathUtils.lerp(16.0, 7.5, ease),
        THREE.MathUtils.lerp(36.0, 28.0, ease),
      ];
      camTarget = [
        THREE.MathUtils.lerp(0.0, -1.0, ease),
        THREE.MathUtils.lerp(8.0, 5.0, ease),
        THREE.MathUtils.lerp(10.0, 8.0, ease),
      ];
      fov = THREE.MathUtils.lerp(40, 38, ease);
    } else if (p < 0.48) {
      // Stage 4: Corporate Campus Grounds Arrival (Matching campus-reference.jpg composition)
      const t = (p - 0.35) / 0.13;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        THREE.MathUtils.lerp(-3.0, -1.8, ease),
        THREE.MathUtils.lerp(4.5, 3.2, ease),
        THREE.MathUtils.lerp(36.0, 29.0, ease),
      ];
      camTarget = [
        THREE.MathUtils.lerp(1.0, 1.0, ease),
        THREE.MathUtils.lerp(8.0, 7.5, ease),
        THREE.MathUtils.lerp(4.0, 4.0, ease),
      ];
      fov = THREE.MathUtils.lerp(42, 38, ease);
    } else if (p < 0.60) {
      // Stage 5: Exterior Silver Logo Focus Pull (Directly framing machined silver logo on granite monument)
      const t = (p - 0.48) / 0.12;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        THREE.MathUtils.lerp(-1.8, 1.05, ease),
        THREE.MathUtils.lerp(3.2, 1.25, ease),
        THREE.MathUtils.lerp(29.0, 21.5, ease),
      ];
      camTarget = [
        THREE.MathUtils.lerp(1.0, 1.05, ease),
        THREE.MathUtils.lerp(7.5, 1.25, ease),
        THREE.MathUtils.lerp(4.0, 18.45, ease),
      ];
      fov = THREE.MathUtils.lerp(38, 32, ease);
    } else if (p < 0.72) {
      // Stage 6: Facade Tracking & Executive Window Selection
      const t = (p - 0.60) / 0.12;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        THREE.MathUtils.lerp(1.05, 0.0, ease),
        THREE.MathUtils.lerp(1.25, 2.4, ease),
        THREE.MathUtils.lerp(21.5, 5.5, ease),
      ];
      camTarget = [
        THREE.MathUtils.lerp(1.05, 0.0, ease),
        THREE.MathUtils.lerp(1.25, 2.1, ease),
        THREE.MathUtils.lerp(18.45, 1.02, ease),
      ];
      fov = THREE.MathUtils.lerp(32, 36, ease);
    } else if (p < 0.84) {
      // Stage 7: Continuous Optical Window Pass-Through (VFX Crossing Glass into Interior)
      const t = (p - 0.72) / 0.12;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(2.4, 1.65, ease),
        THREE.MathUtils.lerp(5.5, 0.65, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(2.1, 1.45, ease),
        THREE.MathUtils.lerp(1.02, -1.2, ease),
      ];
      fov = 35;
    } else if (p < 0.94) {
      // Stage 8: Real DigiFormation Office Reveal & Feature Wall Interior Logo
      const t = (p - 0.84) / 0.10;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(1.65, 1.48, ease),
        THREE.MathUtils.lerp(0.65, 0.35, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(1.45, 1.25, ease),
        THREE.MathUtils.lerp(-1.2, -1.6, ease),
      ];
      fov = 35;
    } else {
      // Stage 9: First Human Workflow (Director Haroon) & 5 Enterprise Pathways
      const t = (p - 0.94) / 0.06;
      const ease = t * t * (3 - 2 * t);

      camPos = [
        0.0,
        THREE.MathUtils.lerp(1.48, 1.45, ease),
        THREE.MathUtils.lerp(0.35, 0.28, ease),
      ];
      camTarget = [
        0.0,
        THREE.MathUtils.lerp(1.25, 1.15, ease),
        THREE.MathUtils.lerp(-1.6, -1.8, ease),
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

    // Update dynamic background tone depending on altitude and environment
    if (this.threeScene) {
      if (sceneProgress < 0.25) {
        this.threeScene.background = new THREE.Color(0x020408);
      } else if (sceneProgress < 0.72) {
        this.threeScene.background = new THREE.Color(0x60a5fa); // Bright daylight sky blue matching campus photo
      } else {
        this.threeScene.background = new THREE.Color(0x0b1120);
      }
    }

    // Update Earth Atmosphere and Planetary Drift
    this.earthOrbit.update(sceneProgress, delta);

    // Update Campus & Building Lights / Window Opacity
    this.headquarters.update(sceneProgress, delta);

    // Update Office Interior (Director posture, interior silver logo)
    this.officeInterior.update(time);

    // Layer Visibility Management across the 9 continuous cinematic stages
    if (sceneProgress < 0.25) {
      this.earthOrbit.getGroup().visible = true;
      this.headquarters.getGroup().visible = false;
      this.officeInterior.getGroup().visible = false;
      this.portalsGroup.visible = false;
    } else if (sceneProgress < 0.35) {
      this.earthOrbit.getGroup().visible = true;
      this.headquarters.getGroup().visible = true;
      this.officeInterior.getGroup().visible = false;
      this.portalsGroup.visible = false;
    } else if (sceneProgress < 0.72) {
      this.earthOrbit.getGroup().visible = false;
      this.headquarters.getGroup().visible = true;
      this.officeInterior.getGroup().visible = false;
      this.portalsGroup.visible = false;
    } else {
      this.earthOrbit.getGroup().visible = false;
      this.headquarters.getGroup().visible = true;
      this.officeInterior.getGroup().visible = true;
      this.portalsGroup.visible = true;
    }

    // Dynamic HUD Telemetry & Narrative Synchronization
    if (sceneProgress < 0.10) {
      this.kicker = "00 · PLANETARY APEX";
      this.title = "DigiFormation Global Orbit";
      this.description = "High-altitude orbital view establishing international corporate formation infrastructure across sovereign jurisdictions.";
      this.statutoryNote = "Orbital Apex · 35,786 KM · High Altitude Global Network";
      this.metricBadge = "PLANETARY ESTABLISHING";
      this.telemetry.statutoryStep = "EARTH APEX";
      this.telemetry.chapterTitle = "GLOBAL ORBIT";
      this.telemetry.focalLength = "18mm Cosmic Ultra-Wide";
    } else if (sceneProgress < 0.25) {
      this.kicker = "00 · STRATOSPHERIC DESCENT";
      this.title = "Hypersonic Flight Vector";
      this.description = "Accelerated kinetic descent traversing upper atmospheric cloud layers toward the United Kingdom commercial jurisdiction.";
      this.statutoryNote = "Atmospheric Penetration · Mach 18 · UK Vector Locked";
      this.metricBadge = "RAPID DESCENT";
      this.telemetry.statutoryStep = "ATMOSPHERE DIVE";
      this.telemetry.chapterTitle = "STRATOSPHERIC ENTRY";
      this.telemetry.focalLength = "24mm Anamorphic";
    } else if (sceneProgress < 0.35) {
      this.kicker = "00 · REGIONAL LOCATION LOCK";
      this.title = "London Jurisdiction Acquired";
      this.description = "3D spatial coordinate verification complete: 51.5074° N, 0.1278° W. Identifying corporate campus boundaries.";
      this.statutoryNote = "Coordinates: 51.5074° N, 0.1278° W · London Headquarters";
      this.metricBadge = "SPATIAL SCAN ACTIVE";
      this.telemetry.statutoryStep = "LOCATION ACQUIRED";
      this.telemetry.chapterTitle = "REGIONAL SCAN";
      this.telemetry.focalLength = "28mm Anamorphic";
    } else if (sceneProgress < 0.48) {
      this.kicker = "00 · CORPORATE CAMPUS";
      this.title = "DigiFormation Headquarters";
      this.description = "Monumental curved glass corporate campus with reflecting waters, architectural louvers, and landscaped stone courtyard.";
      this.statutoryNote = "Global Headquarters · Sovereign Digital Campus · London";
      this.metricBadge = "CAMPUS GROUNDS";
      this.telemetry.statutoryStep = "CAMPUS APPROACH";
      this.telemetry.chapterTitle = "CORPORATE HEADQUARTERS";
      this.telemetry.focalLength = "35mm Prime";
    } else if (sceneProgress < 0.60) {
      this.kicker = "00 · ARCHITECTURAL SIGNAGE";
      this.title = "Machined Silver Steel Identity";
      this.description = "Physical brushed silver architectural insignia mounted with heavy-gauge precision hardware and specular metal luster.";
      this.statutoryNote = "DigiFormation Limited · Registered Trademark & Sovereign Crest";
      this.metricBadge = "SILVER LOGO LOCK";
      this.telemetry.statutoryStep = "LOGO MOMENT";
      this.telemetry.chapterTitle = "EXTERIOR SILVER LOGO";
      this.telemetry.focalLength = "50mm Cine Lens";
    } else if (sceneProgress < 0.72) {
      this.kicker = "00 · BUILDING FACADE";
      this.title = "Executive Suite Window Selection";
      this.description = "Tracking along the architectural glass curtain wall. Targeting the 3rd-floor executive operational suite window.";
      this.statutoryNote = "Floor-to-Ceiling Curtain Glass · Acoustic Double-Glazing";
      this.metricBadge = "WINDOW SELECTION";
      this.telemetry.statutoryStep = "FACADE SCAN";
      this.telemetry.chapterTitle = "WINDOW TARGETING";
      this.telemetry.focalLength = "40mm Anamorphic";
    } else if (sceneProgress < 0.84) {
      this.kicker = "00 · OPTICAL TRANSITION";
      this.title = "Crossing Glass Boundary";
      this.description = "Continuous VFX optical pass-through gliding through exterior glass reflections directly into the climate-controlled office.";
      this.statutoryNote = "VFX Optical Threshold · Dissolving Glass Reflection";
      this.metricBadge = "WINDOW ENTRY";
      this.telemetry.statutoryStep = "INTERIOR CROSSING";
      this.telemetry.chapterTitle = "GLASS THRESHOLD";
      this.telemetry.focalLength = "35mm Anamorphic";
    } else if (sceneProgress < 0.94) {
      this.kicker = "00 · EXECUTIVE OFFICE SUITE";
      this.title = "DigiFormation Operational Suite";
      this.description = "Inside the real corporate office. Feature slatted walnut wall with interior silver logo, dual curved displays, and executive workstations.";
      this.statutoryNote = "Physical Interior Silver Signage · Operating Headquarters";
      this.metricBadge = "OFFICE REVEAL";
      this.telemetry.statutoryStep = "OFFICE DISCOVERY";
      this.telemetry.chapterTitle = "EXECUTIVE SUITE";
      this.telemetry.focalLength = "32mm Prime";
    } else {
      this.kicker = "00 · LIVE FORMATION WORKFLOW";
      this.title = "Statutory Order Processing";
      this.description = "Director reviewing customer formation order on live Companies House gateway. Select an enterprise pathway below to begin.";
      this.statutoryNote = "5 Sovereign Commercial Pathways · Order In Progress";
      this.metricBadge = "WORKFLOW ACTIVE";
      this.telemetry.statutoryStep = "PORTAL READY";
      this.telemetry.chapterTitle = "SERVICE INITIALIZATION";
      this.telemetry.focalLength = "28mm Anamorphic Wide";
    }
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.earthOrbit.dispose();
    this.headquarters.dispose();
    this.officeInterior.dispose();
    this.canvasTextures.forEach((t) => t.dispose());
  }
}
