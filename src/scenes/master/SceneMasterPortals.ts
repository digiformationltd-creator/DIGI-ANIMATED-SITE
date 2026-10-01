import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneMasterPortals implements CinematicScene {
  public id = "scene-master-portals";
  public title = "DigiFormation Master Nexus";
  public label = "00 MASTER";
  public kicker = "MASTER ARCHITECTURAL PORTAL";
  public description = "Welcome to the DigiFormation ecosystem. Select an enterprise pathway to enter its dedicated scroll-driven cinematic journey.";
  public statutoryNote = "DigiFormation Global Group · 5 Sovereign Commercial Experiences · Select a Film Below";
  public metricBadge = "5 CINEMATIC PATHWAYS ACTIVE";
  public startProgress = 0.0;
  public endProgress = 1.0;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.2,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-MASTER-PORTAL",
    reelNumber: "MASTER",
    chapterTitle: "CINEMATIC ENTERPRISE PORTALS",
    shutterSpeed: "1/48s",
    aperture: "T1.3",
    focalLength: "35mm Master Prime",
    iso: 320,
    timecode: "00:00:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "PORTAL SELECT",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 2.2, 5.5] as [number, number, number],
      target: [0.0, 1.2, 0.0] as [number, number, number],
      fov: 46,
    },
    end: {
      position: [0.0, 1.6, 3.2] as [number, number, number],
      target: [0.0, 1.2, 0.0] as [number, number, number],
      fov: 38,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private portalMeshes: THREE.Mesh[] = [];
  private canvasTextures: THREE.CanvasTexture[] = [];
  private titleMesh: THREE.Mesh | null = null;
  private materials = MaterialFactory.getInstance();

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Dark reflective floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = this.materials.getDarkFloorTile();
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.sceneGroup.add(floor);

    // 2. Center Architectural Monolith
    const monolithGeo = new THREE.BoxGeometry(0.8, 4.0, 0.8);
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });
    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    monolith.position.set(0, 2.0, -3.0);
    this.sceneGroup.add(monolith);

    // 3. Glowing Title Plaque in Mid-Air
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
      tCtx.fillText("FIVE INTEGRATED CINEMATIC REELS · SCROLL OR SELECT A PATHWAY BELOW", 800, 275);
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
    this.titleMesh.position.set(0, 2.8, -1.0);
    this.sceneGroup.add(this.titleMesh);

    // 4. Five Spatial Portals / Architectural Pillars
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

    const portalWidth = 1.0;
    const portalHeight = 1.6;
    const spacing = 1.35;
    const startX = -((films.length - 1) * spacing) / 2;

    films.forEach((film, idx) => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 800;
      pCanvas.height = 1280;
      const ctx = pCanvas.getContext("2d");
      if (ctx) {
        // Portal backdrop
        const grad = ctx.createLinearGradient(0, 0, 0, 1280);
        grad.addColorStop(0, "#0f172a");
        grad.addColorStop(1, "#020617");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 1280);

        // Frame
        ctx.strokeStyle = film.color;
        ctx.lineWidth = 6;
        ctx.strokeRect(16, 16, 768, 1248);

        // Top Number
        ctx.fillStyle = film.color;
        ctx.font = "bold 64px monospace";
        ctx.textAlign = "left";
        ctx.fillText(film.num, 50, 110);

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "right";
        ctx.fillText(film.tag, 750, 95);

        // Badge pill
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.roundRect(50, 150, 360, 48, 24);
        ctx.fill();
        ctx.fillStyle = film.color;
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`● ${film.badge}`, 75, 182);

        // Large Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 48px sans-serif";
        ctx.fillText(film.title, 50, 310);

        // Subtitle
        ctx.fillStyle = "#94a3b8";
        ctx.font = "26px sans-serif";
        ctx.fillText(film.sub, 50, 370);

        // Architectural geometric pattern in middle
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.arc(400, 680, 60 + i * 36, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Center Glow Icon Node
        ctx.fillStyle = film.color;
        ctx.beginPath();
        ctx.arc(400, 680, 24, 0, Math.PI * 2);
        ctx.fill();

        // Bottom CTA block
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
      // Slight curve arc
      const posZ = -Math.abs(idx - 2) * 0.22;
      const rotY = (idx - 2) * -0.08;

      pMesh.position.set(posX, 1.25, posZ);
      pMesh.rotation.y = rotY;
      this.portalMeshes.push(pMesh);
      this.sceneGroup.add(pMesh);

      // Light column base under portal
      const baseGeo = new THREE.BoxGeometry(portalWidth + 0.1, 0.08, 0.4);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(posX, 0.04, posZ);
      base.rotation.y = rotY;
      this.sceneGroup.add(base);
    });

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  public enter(): void {
    this.sceneGroup.visible = true;
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    const time = Date.now() * 0.001;

    // Subtle floating breath on portals
    this.portalMeshes.forEach((mesh, idx) => {
      mesh.position.y = 1.25 + Math.sin(time + idx * 0.8) * 0.02;
    });

    if (this.titleMesh) {
      this.titleMesh.position.y = 2.8 + Math.cos(time * 0.5) * 0.015;
    }
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTextures.forEach((t) => t.dispose());
  }
}
