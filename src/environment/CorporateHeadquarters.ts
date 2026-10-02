import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";

/**
 * CorporateHeadquarters
 * Photorealistic 3D Google-style corporate headquarters campus.
 * Features:
 * - Real photographic glass curtain facade with warm interior office floor depths
 * - Authentic official DigiFormation Limited silver steel / brushed chrome metallic logo
 * - Grand architectural entrance canopy with glass revolving doors and illuminated foyer
 * - Real granite entrance plaza with water reflecting pools, architectural trees, and runway lighting
 * - Panoramic twilight skyline backdrop with distant architectural high-rises and city bokeh
 */
export class CorporateHeadquarters {
  private group: THREE.Group = new THREE.Group();
  private materials = MaterialFactory.getInstance();
  private logoMesh: THREE.Mesh | null = null;
  private canvasTextures: THREE.CanvasTexture[] = [];
  private logoImg: HTMLImageElement | null = null;
  private logoWhiteImg: HTMLImageElement | null = null;
  private logoCanvas: HTMLCanvasElement | null = null;
  private logoTexture: THREE.CanvasTexture | null = null;

  constructor() {
    this.buildCampus();
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  private buildCampus(): void {
    // ========================================================
    // 1. DISTANT PHOTOREALISTIC SKYLINE & TWILIGHT BACKDROP
    // ========================================================
    const skyGeo = new THREE.PlaneGeometry(120, 60);
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 2048;
    skyCanvas.height = 1024;
    const sCtx = skyCanvas.getContext("2d");
    if (sCtx) {
      // Twilight sky gradient (deep indigo to dusk gold/cyan haze at horizon)
      const skyGrad = sCtx.createLinearGradient(0, 0, 0, 1024);
      skyGrad.addColorStop(0, "#030712");
      skyGrad.addColorStop(0.4, "#0b1220");
      skyGrad.addColorStop(0.75, "#151e32");
      skyGrad.addColorStop(0.92, "#1e293b");
      skyGrad.addColorStop(1.0, "#2a374f");
      sCtx.fillStyle = skyGrad;
      sCtx.fillRect(0, 0, 2048, 1024);

      // Realistic soft cloud wisps
      sCtx.fillStyle = "rgba(148, 163, 184, 0.04)";
      for (let i = 0; i < 12; i++) {
        sCtx.beginPath();
        sCtx.ellipse(150 + i * 160, 450 + (i % 3) * 60, 200, 35, 0, 0, Math.PI * 2);
        sCtx.fill();
      }

      // Distant London / Tech Campus Skyline Silhouettes
      sCtx.fillStyle = "#070b14";
      for (let i = 0; i < 75; i++) {
        const bx = i * 28;
        const bw = 18 + ((i * 37) % 24);
        const bh = 100 + ((i * 73) % 260);
        sCtx.fillRect(bx, 1024 - bh, bw, bh);

        // Window lighting bokeh dots
        sCtx.fillStyle = "rgba(254, 240, 138, 0.45)";
        for (let r = 0; r < Math.floor(bh / 22); r++) {
          for (let c = 0; c < 3; c++) {
            if ((i + r + c) % 4 === 0) {
              sCtx.fillRect(bx + 4 + c * 5, 1024 - bh + 14 + r * 18, 3, 5);
            }
          }
        }
        sCtx.fillStyle = "#070b14";
      }

      // Atmospheric horizon mist
      const mistGrad = sCtx.createLinearGradient(0, 750, 0, 1024);
      mistGrad.addColorStop(0, "rgba(30, 41, 59, 0.0)");
      mistGrad.addColorStop(1, "rgba(15, 23, 42, 0.85)");
      sCtx.fillStyle = mistGrad;
      sCtx.fillRect(0, 750, 2048, 274);
    }

    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(skyTexture);

    const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 24, -32);
    this.group.add(skyMesh);

    // ========================================================
    // 2. EXTERIOR PLAZA GROUNDS & WATER REFLECTING POOLS
    // ========================================================
    // Dark Honed Granite Plaza Pavers (55m x 65m)
    const plazaGeo = new THREE.PlaneGeometry(55, 65);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.32,
      metalness: 0.45,
    });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.rotation.x = -Math.PI / 2;
    plazaMesh.position.set(0, 0, 18);
    plazaMesh.receiveShadow = true;
    this.group.add(plazaMesh);

    // Center Grand Walkway with Inlaid Brushed Stainless Runners
    const walkGeo = new THREE.PlaneGeometry(9, 60);
    const walkMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.22,
      metalness: 0.55,
    });
    const walkMesh = new THREE.Mesh(walkGeo, walkMat);
    walkMesh.rotation.x = -Math.PI / 2;
    walkMesh.position.set(0, 0.01, 18);
    this.group.add(walkMesh);

    // Inlaid Ground LED Runway Lighting Strips
    const stripGeo = new THREE.PlaneGeometry(0.12, 54);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const leftStrip = new THREE.Mesh(stripGeo, stripMat);
    leftStrip.rotation.x = -Math.PI / 2;
    leftStrip.position.set(-4.4, 0.02, 18);
    this.group.add(leftStrip);

    const rightStrip = new THREE.Mesh(stripGeo, stripMat);
    rightStrip.rotation.x = -Math.PI / 2;
    rightStrip.position.set(4.4, 0.02, 18);
    this.group.add(rightStrip);

    // Water Reflecting Pools (Flanking both sides of grand walkway)
    const poolGeo = new THREE.PlaneGeometry(16, 32);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.04,
      metalness: 0.95,
    });
    const leftPool = new THREE.Mesh(poolGeo, poolMat);
    leftPool.rotation.x = -Math.PI / 2;
    leftPool.position.set(-15, 0.015, 20);
    this.group.add(leftPool);

    const rightPool = new THREE.Mesh(poolGeo, poolMat);
    rightPool.rotation.x = -Math.PI / 2;
    rightPool.position.set(15, 0.015, 20);
    this.group.add(rightPool);

    // Architectural Perimeter Bollard Lights
    for (let z = 6; z <= 34; z += 5.5) {
      this.createBollard(-4.9, z);
      this.createBollard(4.9, z);
      this.createBollard(-23.5, z);
      this.createBollard(23.5, z);
    }

    // Landscaped Architectural Planters / Hedgerows
    for (let z = 10; z <= 30; z += 8) {
      this.createPlanter(-7.5, z);
      this.createPlanter(7.5, z);
    }

    // ========================================================
    // 3. PHOTOREALISTIC CORPORATE HEADQUARTERS ARCHITECTURE
    // ========================================================
    // Building Dimensions: Width 44m, Height 24m, Depth 26m
    const buildingWidth = 44;
    const buildingHeight = 24;
    const buildingDepth = 26;

    // Real Architectural High-Rise Facade Texture
    // Renders realistic office floor depths, warm window lights, and steel grid
    const facadeCanvas = document.createElement("canvas");
    facadeCanvas.width = 2048;
    facadeCanvas.height = 1024;
    const fCtx = facadeCanvas.getContext("2d");
    if (fCtx) {
      // Base dark tinted architectural glass
      fCtx.fillStyle = "#0c1322";
      fCtx.fillRect(0, 0, 2048, 1024);

      // Sky reflection gradient on glass
      const reflGrad = fCtx.createLinearGradient(0, 0, 0, 1024);
      reflGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
      reflGrad.addColorStop(0.3, "rgba(30, 41, 59, 0.4)");
      reflGrad.addColorStop(0.7, "rgba(15, 23, 42, 0.65)");
      reflGrad.addColorStop(1, "rgba(2, 6, 23, 0.85)");
      fCtx.fillStyle = reflGrad;
      fCtx.fillRect(0, 0, 2048, 1024);

      // Floor Dividers (6 distinct levels)
      const numFloors = 6;
      const floorH = 1024 / numFloors;
      for (let f = 0; f < numFloors; f++) {
        const fy = f * floorH;

        // Structural Spandrel Glass Band (Floor slab divider)
        fCtx.fillStyle = "#1e293b";
        fCtx.fillRect(0, fy + floorH - 24, 2048, 24);
        fCtx.strokeStyle = "#475569";
        fCtx.lineWidth = 2;
        fCtx.strokeRect(0, fy + floorH - 24, 2048, 24);

        // Office Window Bays with Warm Interior Illumination
        const numBays = 22;
        const bayW = 2048 / numBays;
        for (let b = 0; b < numBays; b++) {
          const bx = b * bayW + 8;
          const bw = bayW - 16;
          const bh = floorH - 36;

          // Warm office interior glow (3000K soft executive light)
          const isLit = (f + b * 3) % 5 !== 0;
          if (isLit) {
            const officeGrad = fCtx.createLinearGradient(0, fy + 8, 0, fy + 8 + bh);
            officeGrad.addColorStop(0, "rgba(254, 243, 199, 0.35)");
            officeGrad.addColorStop(0.4, "rgba(251, 191, 36, 0.18)");
            officeGrad.addColorStop(1, "rgba(15, 23, 42, 0.5)");
            fCtx.fillStyle = officeGrad;
            fCtx.fillRect(bx, fy + 8, bw, bh);

            // Subtle interior office blinds / louvers
            fCtx.fillStyle = "rgba(15, 23, 42, 0.4)";
            const blindsLines = 4 + (b % 4);
            for (let l = 0; l < blindsLines; l++) {
              fCtx.fillRect(bx, fy + 12 + l * 10, bw, 2);
            }
          } else {
            fCtx.fillStyle = "rgba(15, 23, 42, 0.75)";
            fCtx.fillRect(bx, fy + 8, bw, bh);
          }

          // Architectural Window Frames
          fCtx.strokeStyle = "rgba(71, 85, 105, 0.6)";
          fCtx.lineWidth = 3;
          fCtx.strokeRect(bx, fy + 8, bw, bh);
        }
      }

      // Ground Level Double-Height Grand Glass Atrium Foyer
      fCtx.fillStyle = "rgba(254, 243, 199, 0.45)";
      fCtx.fillRect(350, 780, 1348, 244);
      fCtx.strokeStyle = "#38bdf8";
      fCtx.lineWidth = 4;
      fCtx.strokeRect(350, 780, 1348, 244);

      // Atrium Welcome Inscription
      fCtx.fillStyle = "#ffffff";
      fCtx.font = "900 36px 'Inter', sans-serif";
      fCtx.textAlign = "center";
      fCtx.fillText("DIGIFORMATION LIMITED · EXECUTIVE FOYER", 1024, 880);
      fCtx.fillStyle = "#94a3b8";
      fCtx.font = "bold 20px monospace";
      fCtx.fillText("GLOBAL HEADQUARTERS · LONDON JURISDICTION", 1024, 920);
    }

    const facadeTexture = new THREE.CanvasTexture(facadeCanvas);
    facadeTexture.colorSpace = THREE.SRGBColorSpace;
    facadeTexture.minFilter = THREE.LinearFilter;
    facadeTexture.magFilter = THREE.LinearFilter;
    this.canvasTextures.push(facadeTexture);

    // Front Upper Glass Curtain Wall Mesh (Levels 2 to 6, Y: 4.8m to 24m)
    const upperFacadeH = buildingHeight - 4.8;
    const facadeGeo = new THREE.PlaneGeometry(buildingWidth, upperFacadeH);
    const facadeMat = new THREE.MeshStandardMaterial({
      map: facadeTexture,
      roughness: 0.12,
      metalness: 0.88,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: facadeTexture,
      emissiveIntensity: 0.55,
    });
    const facadeMesh = new THREE.Mesh(facadeGeo, facadeMat);
    facadeMesh.position.set(0, 4.8 + upperFacadeH / 2, 1.0);
    this.group.add(facadeMesh);

    // Ground Floor Side Glass Panels (Flanking the central grand entrance portal)
    const sideGlassW = (buildingWidth - 12) / 2; // 16m each
    const sideGlassGeo = new THREE.PlaneGeometry(sideGlassW, 4.8);
    const sideGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.4,
      roughness: 0.08,
      metalness: 0.85,
      transmission: 0.65,
    });

    const lSideGlass = new THREE.Mesh(sideGlassGeo, sideGlassMat);
    lSideGlass.position.set(-6 - sideGlassW / 2, 2.4, 1.0);
    this.group.add(lSideGlass);

    const rSideGlass = new THREE.Mesh(sideGlassGeo, sideGlassMat);
    rSideGlass.position.set(6 + sideGlassW / 2, 2.4, 1.0);
    this.group.add(rSideGlass);

    // Building Open Architectural Perimeter Enclosure (Allows unobstructed interior office view)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.65,
      metalness: 0.25,
    });

    // Rear Atrium Wall (Z = -14.0m)
    const rearWallGeo = new THREE.BoxGeometry(buildingWidth, buildingHeight, 0.6);
    const rearWall = new THREE.Mesh(rearWallGeo, wallMat);
    rearWall.position.set(0, buildingHeight / 2, -14.0);
    this.group.add(rearWall);

    // Left Exterior Wall (X = -22m)
    const sideWallGeo = new THREE.BoxGeometry(0.6, buildingHeight, 15.5);
    const lSideWall = new THREE.Mesh(sideWallGeo, wallMat);
    lSideWall.position.set(-buildingWidth / 2, buildingHeight / 2, -6.5);
    this.group.add(lSideWall);

    // Right Exterior Wall (X = +22m)
    const rSideWall = new THREE.Mesh(sideWallGeo, wallMat);
    rSideWall.position.set(buildingWidth / 2, buildingHeight / 2, -6.5);
    this.group.add(rSideWall);

    // Roof Slab (Y = 24m)
    const roofGeo = new THREE.BoxGeometry(buildingWidth, 0.6, 15.5);
    const roofMesh = new THREE.Mesh(roofGeo, wallMat);
    roofMesh.position.set(0, buildingHeight, -6.5);
    this.group.add(roofMesh);

    // Architectural Steel Mullions / Exterior Louvers
    const mullionMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.25,
      metalness: 0.92,
    });

    for (let x = -buildingWidth / 2; x <= buildingWidth / 2; x += 4.0) {
      if (Math.abs(x) < 3.5) continue; // Keep grand entrance open for camera
      const colGeo = new THREE.BoxGeometry(0.18, buildingHeight, 0.45);
      const colMesh = new THREE.Mesh(colGeo, mullionMat);
      colMesh.position.set(x, buildingHeight / 2, 1.05);
      this.group.add(colMesh);
    }

    // ========================================================
    // 4. GRAND ENTRANCE CANOPY & SLIDING GLASS PORTAL
    // ========================================================
    // Cantilevered Architectural Canopy (18m wide x 8m deep)
    const canopyGeo = new THREE.BoxGeometry(18, 0.35, 8);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.9,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 5.0, 5.0);
    this.group.add(canopy);

    // Brushed Titanium Canopy Fascia Trim
    const canopyTrimGeo = new THREE.BoxGeometry(18.25, 0.4, 8.2);
    const canopyTrim = new THREE.Mesh(canopyTrimGeo, this.materials.getBrushedTitanium());
    canopyTrim.position.set(0, 5.0, 5.0);
    this.group.add(canopyTrim);

    // Recessed Canopy Warm Architectural Downlights
    for (let cx = -6; cx <= 6; cx += 4) {
      for (let cz = 3; cz <= 7; cz += 4) {
        const fixGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
        const fixMat = new THREE.MeshBasicMaterial({ color: 0xfff7ed });
        const fix = new THREE.Mesh(fixGeo, fixMat);
        fix.position.set(cx, 4.82, cz);
        this.group.add(fix);
      }
    }

    // Grand Entrance Door Portal Frame (Polished Chrome Steel Posts & Header)
    const postGeo = new THREE.BoxGeometry(0.4, 4.4, 0.4);
    const leftPost = new THREE.Mesh(postGeo, this.materials.getPolishedChrome());
    leftPost.position.set(-4.5, 2.2, 1.15);
    this.group.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, this.materials.getPolishedChrome());
    rightPost.position.set(4.5, 2.2, 1.15);
    this.group.add(rightPost);

    const headerGeo = new THREE.BoxGeometry(9.4, 0.4, 0.4);
    const headerMesh = new THREE.Mesh(headerGeo, this.materials.getPolishedChrome());
    headerMesh.position.set(0, 4.4, 1.15);
    this.group.add(headerMesh);

    // Architectural Automatic Sliding Glass Doors (Parted Open for Smooth Camera Pass-Through)
    const doorGeo = new THREE.BoxGeometry(2.4, 4.0, 0.08);
    const doorMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.8,
      transmission: 0.85,
      ior: 1.5,
    });
    const leftDoor = new THREE.Mesh(doorGeo, doorMat);
    leftDoor.position.set(-3.2, 2.0, 1.15);
    this.group.add(leftDoor);

    const rightDoor = new THREE.Mesh(doorGeo, doorMat);
    rightDoor.position.set(3.2, 2.0, 1.15);
    this.group.add(rightDoor);

    // ========================================================
    // 5. CROWN PARAPET & REAL SILVER STEEL DIGIFORMATION LOGO
    // ========================================================
    // Building Top Architectural Parapet (38m wide x 3.8m high)
    const parapetGeo = new THREE.BoxGeometry(38, 3.8, 1.5);
    const parapetMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f18,
      roughness: 0.4,
      metalness: 0.8,
    });
    const parapet = new THREE.Mesh(parapetGeo, parapetMat);
    parapet.position.set(0, buildingHeight + 1.4, 1.1);
    this.group.add(parapet);

    // Silver Brushed Steel Parapet Coping
    const copingGeo = new THREE.BoxGeometry(38.4, 0.3, 1.8);
    const coping = new THREE.Mesh(copingGeo, this.materials.getPolishedChrome());
    coping.position.set(0, buildingHeight + 3.3, 1.1);
    this.group.add(coping);

    // Prepare Silver Steel Logo Canvas and 3D Plaque
    this.initSilverSteelLogo(buildingHeight);

    // ========================================================
    // 6. CAMPUS ENTRANCE MONUMENT (Google-Style Driveway Sign)
    // ========================================================
    const monPlinthGeo = new THREE.BoxGeometry(7.2, 2.2, 1.4);
    const monPlinthMat = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      roughness: 0.28,
      metalness: 0.6,
    });
    const monPlinth = new THREE.Mesh(monPlinthGeo, monPlinthMat);
    monPlinth.position.set(-9.5, 1.1, 28);
    this.group.add(monPlinth);

    // Polished Silver Steel Monument Accent Frame
    const monTrimGeo = new THREE.BoxGeometry(7.35, 0.15, 1.55);
    const monTrim = new THREE.Mesh(monTrimGeo, this.materials.getPolishedChrome());
    monTrim.position.set(-9.5, 2.2, 28);
    this.group.add(monTrim);
  }

  private initSilverSteelLogo(buildingHeight: number): void {
    this.logoCanvas = document.createElement("canvas");
    this.logoCanvas.width = 2048;
    this.logoCanvas.height = 512;

    this.logoTexture = new THREE.CanvasTexture(this.logoCanvas);
    this.logoTexture.colorSpace = THREE.SRGBColorSpace;
    this.logoTexture.minFilter = THREE.LinearFilter;
    this.logoTexture.magFilter = THREE.LinearFilter;
    this.canvasTextures.push(this.logoTexture);

    // Load real official DigiFormation logo images
    this.logoImg = new Image();
    this.logoImg.crossOrigin = "anonymous";
    this.logoImg.src = "/assets/brand/digiformation-logo-official.png";

    this.logoWhiteImg = new Image();
    this.logoWhiteImg.crossOrigin = "anonymous";
    this.logoWhiteImg.src = "/assets/brand/logo-white.png";

    this.logoImg.onload = () => this.drawSilverLogo();
    this.logoWhiteImg.onload = () => this.drawSilverLogo();

    // Initial render
    this.drawSilverLogo();

    // 3D Physical Silver Steel Logo Plaque
    const logoPlateGeo = new THREE.PlaneGeometry(19.0, 4.8);
    const logoPlateMat = new THREE.MeshStandardMaterial({
      map: this.logoTexture,
      roughness: 0.12,
      metalness: 0.98, // Real Silver Stainless Steel / Chrome
      emissive: new THREE.Color(0xffffff),
      emissiveMap: this.logoTexture,
      emissiveIntensity: 0.5,
    });
    this.logoMesh = new THREE.Mesh(logoPlateGeo, logoPlateMat);
    this.logoMesh.position.set(0, buildingHeight + 1.4, 1.9);
    this.group.add(this.logoMesh);

    // Heavy-gauge Polished Stainless Steel Architectural Mounting Frame
    const frameGeo = new THREE.BoxGeometry(19.25, 5.0, 0.3);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.1,
      metalness: 0.98,
    });
    const logoFrame = new THREE.Mesh(frameGeo, frameMat);
    logoFrame.position.set(0, buildingHeight + 1.4, 1.75);
    this.group.add(logoFrame);

    // Architectural Floodlights illuminating the Silver Logo from below
    const spotL = new THREE.SpotLight(0xf8fafc, 4.5, 24, Math.PI / 4, 0.35);
    spotL.position.set(-7, buildingHeight - 3, 7);
    spotL.target = this.logoMesh;
    this.group.add(spotL);

    const spotR = new THREE.SpotLight(0xf8fafc, 4.5, 24, Math.PI / 4, 0.35);
    spotR.position.set(7, buildingHeight - 3, 7);
    spotR.target = this.logoMesh;
    this.group.add(spotR);
  }

  private drawSilverLogo(): void {
    if (!this.logoCanvas || !this.logoTexture) return;
    const ctx = this.logoCanvas.getContext("2d");
    if (!ctx) return;

    // Dark titanium backplate
    ctx.fillStyle = "#070a10";
    ctx.fillRect(0, 0, 2048, 512);

    // Brushed Silver Steel Border with Specular Highlights
    const borderGrad = ctx.createLinearGradient(0, 0, 2048, 512);
    borderGrad.addColorStop(0, "#94a3b8");
    borderGrad.addColorStop(0.25, "#ffffff");
    borderGrad.addColorStop(0.5, "#cbd5e1");
    borderGrad.addColorStop(0.75, "#f8fafc");
    borderGrad.addColorStop(1, "#64748b");
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 12;
    ctx.strokeRect(18, 18, 2012, 476);

    // Inner Metallic Plate
    ctx.fillStyle = "#0c111a";
    ctx.fillRect(30, 30, 1988, 452);

    // Draw real white emblem if available
    let textStartX = 440;
    if (this.logoWhiteImg && this.logoWhiteImg.complete && this.logoWhiteImg.naturalWidth > 0) {
      ctx.drawImage(this.logoWhiteImg, 120, 96, 260, 260);
      textStartX = 420;
    } else if (this.logoImg && this.logoImg.complete && this.logoImg.naturalWidth > 0) {
      ctx.drawImage(this.logoImg, 100, 110, 320, 180);
      textStartX = 460;
    } else {
      // Procedural fallback silver geometric mark
      ctx.save();
      ctx.translate(220, 256);
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 14;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const px = 85 * Math.cos(a);
        const py = 85 * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Heavy-gauge Silver Steel Metallic Gradient for Typographic Lettering
    const steelGrad = ctx.createLinearGradient(0, 120, 0, 390);
    steelGrad.addColorStop(0, "#ffffff");
    steelGrad.addColorStop(0.2, "#f1f5f9");
    steelGrad.addColorStop(0.48, "#cbd5e1");
    steelGrad.addColorStop(0.55, "#64748b");
    steelGrad.addColorStop(0.72, "#94a3b8");
    steelGrad.addColorStop(0.88, "#e2e8f0");
    steelGrad.addColorStop(1, "#ffffff");

    // Monolithic Brand Name: DIGIFORMATION LIMITED
    ctx.fillStyle = steelGrad;
    ctx.font = "900 114px 'Inter', 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.shadowColor = "rgba(255, 255, 255, 0.45)";
    ctx.shadowBlur = 16;
    ctx.fillText("DIGIFORMATION LIMITED", textStartX, 275);
    ctx.shadowBlur = 0;

    // Sub-title Architectural Signage
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 32px 'JetBrains Mono', monospace";
    ctx.fillText("GLOBAL CORPORATE HEADQUARTERS · SOVEREIGN DIGITAL CAMPUS", textStartX, 345);

    // Statutory Kicker
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px 'JetBrains Mono', monospace";
    ctx.fillText("ENTERPRISE FORMATIONS · 3D ARCHITECTURES · AGENTIC SYSTEMS", textStartX, 170);

    this.logoTexture.needsUpdate = true;
  }

  private createBollard(x: number, z: number): void {
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.95, 16);
    const post = new THREE.Mesh(postGeo, this.materials.getBrushedTitanium());
    post.position.set(x, 0.47, z);
    this.group.add(post);

    const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16);
    const capMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(x, 0.92, z);
    this.group.add(cap);
  }

  private createPlanter(x: number, z: number): void {
    const boxGeo = new THREE.BoxGeometry(1.6, 0.65, 3.2);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.5, metalness: 0.3 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(x, 0.32, z);
    this.group.add(box);

    const hedgeGeo = new THREE.BoxGeometry(1.4, 0.8, 3.0);
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9, metalness: 0.05 });
    const hedge = new THREE.Mesh(hedgeGeo, hedgeMat);
    hedge.position.set(x, 0.72, z);
    this.group.add(hedge);
  }

  public update(progress: number, delta: number): void {
    const time = Date.now() * 0.001;
    if (this.logoMesh) {
      const mat = this.logoMesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        // Specular gleam across the silver steel logo
        mat.emissiveIntensity = 0.42 + Math.sin(time * 1.6) * 0.08;
      }
    }
  }

  public dispose(): void {
    this.canvasTextures.forEach((t) => t.dispose());
  }
}
