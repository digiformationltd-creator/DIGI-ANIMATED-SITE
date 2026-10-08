import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";
import { SilverLogoSignage } from "./SilverLogoSignage";

/**
 * OfficeInterior
 * Realistic corporate executive office suite for DigiFormation Limited.
 * Features:
 * - Slatted walnut feature wall with physical machined silver DigiFormation logo
 * - Modern executive workstation with dual curved monitors displaying live Companies House & HMRC formation pipelines
 * - Believable office architecture: acoustic wood/carpet flooring, glass partitions, linear ceiling luminaires, credenzas
 */
export class OfficeInterior {
  private group: THREE.Group = new THREE.Group();
  private materials = MaterialFactory.getInstance();
  private interiorLogo: SilverLogoSignage;
  private canvasTextures: THREE.CanvasTexture[] = [];
  private monitorScreenTexture: THREE.CanvasTexture | null = null;

  constructor() {
    // 1. Build Physical Interior Silver Logo on Feature Wall
    this.interiorLogo = new SilverLogoSignage(2.8, 1.5, 0.06, false);
    this.buildOfficeEnvironment();
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  private buildOfficeEnvironment(): void {
    // A. Executive Flooring: Deep Charcoal Terrazzo Tile with Chevron Inlay
    const floorGeo = new THREE.PlaneGeometry(24, 20);
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext("2d");
    if (fCtx) {
      fCtx.fillStyle = "#0c111a";
      fCtx.fillRect(0, 0, 1024, 1024);

      // Fine grid lines simulating high-spec architectural stone tiles
      fCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      fCtx.lineWidth = 1.5;
      for (let x = 0; x < 1024; x += 128) {
        fCtx.beginPath();
        fCtx.moveTo(x, 0); fCtx.lineTo(x, 1024);
        fCtx.stroke();
      }
      for (let y = 0; y < 1024; y += 128) {
        fCtx.beginPath();
        fCtx.moveTo(0, y); fCtx.lineTo(1024, y);
        fCtx.stroke();
      }

      // Chevron wood plank runner in executive path
      fCtx.fillStyle = "#141b27";
      fCtx.fillRect(256, 0, 512, 1024);
      fCtx.strokeStyle = "rgba(0, 0, 0, 0.35)";
      for (let y = 0; y < 1024; y += 48) {
        fCtx.beginPath();
        fCtx.moveTo(256, y);
        fCtx.lineTo(512, y + 24);
        fCtx.lineTo(768, y);
        fCtx.stroke();
      }
    }

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(floorTexture);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.42,
      metalness: 0.22,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0.0, -1.0);
    floorMesh.receiveShadow = true;
    this.group.add(floorMesh);

    // B. Rear Slatted Walnut Acoustic Feature Wall (Z = -4.5m)
    const wallGeo = new THREE.PlaneGeometry(24, 5.0);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      roughness: 0.75,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const rearWall = new THREE.Mesh(wallGeo, wallMat);
    rearWall.position.set(0, 2.5, -4.5);
    this.group.add(rearWall);

    // Vertical Acoustic Timber Slats
    const slatMat = this.materials.getDarkWalnutWood();
    for (let x = -8.5; x <= 8.5; x += 0.20) {
      if (Math.abs(x) < 2.0) continue; // Keep space behind center logo plate clean
      const slatGeo = new THREE.BoxGeometry(0.06, 4.95, 0.04);
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(x, 2.5, -4.48);
      this.group.add(slat);
    }

    // Mount Physical Interior Silver Logo Signage
    const logoGroup = this.interiorLogo.getGroup();
    logoGroup.position.set(0, 2.45, -4.44);
    this.group.add(logoGroup);

    // Warm LED Wall-Wash Downlights illuminating the Silver Logo
    const wallWashLight = new THREE.SpotLight(0xfff7ed, 3.2, 10, Math.PI / 3, 0.4);
    wallWashLight.position.set(0, 3.5, -3.2);
    wallWashLight.target = logoGroup;
    this.group.add(wallWashLight);

    // C. Ceiling & Recessed Linear LED Luminaires (Y = 3.6m)
    const ceilingGeo = new THREE.PlaneGeometry(24, 20);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x070b12,
      roughness: 0.85,
      side: THREE.DoubleSide,
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.set(0, 3.6, -1.0);
    this.group.add(ceilingMesh);

    // Linear Architectural Recessed Lights
    for (let z = 2.0; z >= -4.0; z -= 1.4) {
      const lightGeo = new THREE.BoxGeometry(8.5, 0.04, 0.10);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
      const lightMesh = new THREE.Mesh(lightGeo, lightMat);
      lightMesh.position.set(0, 3.58, z);
      this.group.add(lightMesh);
    }

    // D. Smoked Glass Privacy Partitions (X = ±5.5m)
    const glassMat = this.materials.getSmokedGlass();
    const lPartGeo = new THREE.BoxGeometry(0.08, 3.6, 6.5);
    const lPart = new THREE.Mesh(lPartGeo, glassMat);
    lPart.position.set(-5.5, 1.8, -2.0);
    this.group.add(lPart);

    const rPart = new THREE.Mesh(lPartGeo, glassMat);
    rPart.position.set(5.5, 1.8, -2.0);
    this.group.add(rPart);

    // E. Architectural Realism: Walls, Lounge, and Workstation
    this.buildArchitecturalWalls();
    this.buildExecutiveLounge();
    this.buildWorkstation();
  }

  // Workstation with Dual Monitors & Companies House / HMRC Live Pipeline
  private buildWorkstation(): void {
    const desk = new THREE.Group();
    desk.position.set(0, 0, -1.1);

    // Dark walnut tabletop with brushed titanium perimeter
    const topGeo = new THREE.BoxGeometry(2.3, 0.05, 0.95);
    const topMesh = new THREE.Mesh(topGeo, this.materials.getDarkWalnutWood());
    topMesh.position.set(0, 0.72, 0);
    topMesh.castShadow = true;
    desk.add(topMesh);

    const trimGeo = new THREE.BoxGeometry(2.32, 0.02, 0.97);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.getBrushedTitanium());
    trimMesh.position.set(0, 0.71, 0);
    desk.add(trimMesh);

    // Matte black steel legs & modesty panel
    const legGeo = new THREE.BoxGeometry(0.06, 0.7, 0.85);
    const legMat = this.materials.getMatteBlackMetal();
    const lLeg = new THREE.Mesh(legGeo, legMat);
    lLeg.position.set(-1.05, 0.35, 0);
    desk.add(lLeg);

    const rLeg = new THREE.Mesh(legGeo, legMat);
    rLeg.position.set(1.05, 0.35, 0);
    desk.add(rLeg);

    // Leather desk mat
    const matGeo = new THREE.BoxGeometry(1.3, 0.005, 0.52);
    const matMesh = new THREE.Mesh(matGeo, this.materials.getLeatherDeskMat());
    matMesh.position.set(0, 0.748, 0.08);
    desk.add(matMesh);

    // Dual Curved Ultra-Wide Studio Displays
    const screenW = 1.05;
    const screenH = 0.44;
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);

    const monitorCanvas = document.createElement("canvas");
    monitorCanvas.width = 1024;
    monitorCanvas.height = 512;
    const mCtx = monitorCanvas.getContext("2d");
    if (mCtx) {
      // Dark corporate operating system UI
      mCtx.fillStyle = "#070b14";
      mCtx.fillRect(0, 0, 1024, 512);

      // Header Bar
      mCtx.fillStyle = "#0f172a";
      mCtx.fillRect(0, 0, 1024, 54);
      mCtx.fillStyle = "#38bdf8";
      mCtx.font = "bold 20px monospace";
      mCtx.fillText("DIGIFORMATION OPERATING SYSTEM · ENTERPRISE RAILS", 24, 34);

      mCtx.fillStyle = "#22c55e";
      mCtx.font = "bold 16px monospace";
      mCtx.fillText("● SYSTEM ONLINE · COMPANIES HOUSE DIRECT API", 680, 34);

      // Left Panel: Customer Formation Dossier
      mCtx.fillStyle = "rgba(30, 41, 59, 0.7)";
      mCtx.fillRect(24, 74, 460, 410);
      mCtx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      mCtx.lineWidth = 1.5;
      mCtx.strokeRect(24, 74, 460, 410);

      mCtx.fillStyle = "#ffffff";
      mCtx.font = "bold 22px 'Inter', sans-serif";
      mCtx.fillText("ORDER VERIFICATION IN PROGRESS", 44, 114);

      mCtx.fillStyle = "#94a3b8";
      mCtx.font = "16px monospace";
      mCtx.fillText("CLIENT: DAVID VANCE (DIRECTOR)", 44, 150);
      mCtx.fillText("FORMATION: UK PRIVATE LIMITED (LTD)", 44, 180);
      mCtx.fillText("JURISDICTION: ENGLAND & WALES", 44, 210);
      mCtx.fillText("SHARE CAPITAL: 1,000 GBP · 100 ORDINARY", 44, 240);
      mCtx.fillText("REG. OFFICE: 71-75 SHELTON ST, LONDON", 44, 270);

      // Status Bar
      mCtx.fillStyle = "rgba(34, 197, 94, 0.15)";
      mCtx.fillRect(44, 305, 420, 42);
      mCtx.fillStyle = "#4ade80";
      mCtx.font = "bold 16px monospace";
      mCtx.fillText("✓ IDENTITY VERIFIED · PASSPORT #GB499102", 58, 332);

      mCtx.fillStyle = "rgba(56, 189, 248, 0.15)";
      mCtx.fillRect(44, 360, 420, 42);
      mCtx.fillStyle = "#38bdf8";
      mCtx.font = "bold 16px monospace";
      mCtx.fillText("➔ DISPATCHING STATUTORY FILING TO GATEWAY", 58, 387);

      // Right Panel: 5 Synchronized Formation Pipelines
      mCtx.fillStyle = "rgba(30, 41, 59, 0.7)";
      mCtx.fillRect(510, 74, 490, 410);
      mCtx.strokeRect(510, 74, 490, 410);

      mCtx.fillStyle = "#ffffff";
      mCtx.font = "bold 20px 'Inter', sans-serif";
      mCtx.fillText("ENTERPRISE PATHWAY STATUS", 530, 114);

      const pathways = [
        ["01 UK LTD FORMATION", "COMPANIES HOUSE + HMRC", "99.8% SUCCESS"],
        ["02 US LLC FORMATION", "WYOMING SECRETARY OF STATE", "IRS EIN RAILS"],
        ["03 STATUTORY COMPLIANCE", "CONFIRMATION STATEMENT", "ANNUAL ACCOUNTS"],
        ["04 DIGITAL PRODUCT SUITE", "3D WEBGL WEB & E-COM", "LIVE FORGE"],
        ["05 DIGI BIZ OS", "700+ AUTONOMOUS AGENTS", "ENTERPRISE READY"],
      ];

      pathways.forEach(([name, sub, stat], idx) => {
        const py = 145 + idx * 64;
        mCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
        mCtx.fillRect(530, py, 450, 50);
        mCtx.fillStyle = "#38bdf8";
        mCtx.font = "bold 16px monospace";
        mCtx.fillText(name, 545, py + 22);
        mCtx.fillStyle = "#94a3b8";
        mCtx.font = "13px sans-serif";
        mCtx.fillText(sub, 545, py + 42);
        mCtx.fillStyle = "#4ade80";
        mCtx.font = "bold 13px monospace";
        mCtx.fillText(stat, 860, py + 30);
      });
    }

    this.monitorScreenTexture = new THREE.CanvasTexture(monitorCanvas);
    this.monitorScreenTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(this.monitorScreenTexture);

    const monitorMat = new THREE.MeshStandardMaterial({
      map: this.monitorScreenTexture,
      roughness: 0.18,
      metalness: 0.6,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: this.monitorScreenTexture,
      emissiveIntensity: 0.45,
    });

    const monitorMesh = new THREE.Mesh(screenGeo, monitorMat);
    monitorMesh.position.set(0, 1.05, -0.2);
    desk.add(monitorMesh);

    // Bezel and Stand
    const bezelGeo = new THREE.BoxGeometry(screenW + 0.03, screenH + 0.03, 0.03);
    const bezel = new THREE.Mesh(bezelGeo, this.materials.getMatteBlackMetal());
    bezel.position.set(0, 1.05, -0.218);
    desk.add(bezel);

    const standGeo = new THREE.BoxGeometry(0.12, 0.32, 0.12);
    const stand = new THREE.Mesh(standGeo, this.materials.getBrushedTitanium());
    stand.position.set(0, 0.88, -0.22);
    desk.add(stand);

    // Ergonomic Executive Mesh Chair
    const chair = new THREE.Group();
    chair.position.set(0, 0, 0.42);

    const seatGeo = new THREE.BoxGeometry(0.55, 0.08, 0.52);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.6 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.48, 0);
    chair.add(seat);

    const backGeo = new THREE.BoxGeometry(0.52, 0.62, 0.05);
    const back = new THREE.Mesh(backGeo, seatMat);
    back.position.set(0, 0.82, -0.24);
    chair.add(back);

    const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.46, 16);
    const pole = new THREE.Mesh(poleGeo, this.materials.getPolishedChrome());
    pole.position.set(0, 0.23, 0);
    chair.add(pole);
    desk.add(chair);

    this.group.add(desk);
  }

  // Architectural Walls & Daylight Window Boundary
  private buildArchitecturalWalls(): void {
    // 1. Left Wall with Warm Architectural Drywall & Baseboard (X = -8.0m)
    const lWallGeo = new THREE.BoxGeometry(0.14, 4.2, 20);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x111620,
      roughness: 0.85,
      metalness: 0.05,
    });
    const lWall = new THREE.Mesh(lWallGeo, wallMat);
    lWall.position.set(-8.0, 1.8, -1.0);
    this.group.add(lWall);

    // Architectural Baseboard
    const baseboardGeo = new THREE.BoxGeometry(0.16, 0.14, 20);
    const baseboardMat = this.materials.getDarkWalnutWood();
    const baseboard = new THREE.Mesh(baseboardGeo, baseboardMat);
    baseboard.position.set(-7.98, 0.07, -1.0);
    this.group.add(baseboard);

    // 2. Right Architectural Glass Curtain Wall with Structural Mullions (X = 6.8m)
    // Looking out toward the daylight campus exterior
    const mullionMat = this.materials.getMatteBlackMetal();
    for (let z = 4.0; z >= -6.5; z -= 1.8) {
      const mullionGeo = new THREE.BoxGeometry(0.12, 4.0, 0.12);
      const mullion = new THREE.Mesh(mullionGeo, mullionMat);
      mullion.position.set(6.8, 1.8, z);
      this.group.add(mullion);
    }

    const windowGlassGeo = new THREE.PlaneGeometry(16, 3.8);
    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      transmission: 0.85,
      opacity: 0.95,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      side: THREE.DoubleSide,
    });
    const windowGlass = new THREE.Mesh(windowGlassGeo, windowGlassMat);
    windowGlass.rotation.y = -Math.PI / 2;
    windowGlass.position.set(6.78, 1.8, -1.0);
    this.group.add(windowGlass);

    // Soft daylight bounce fill from the window
    const daylightBounce = new THREE.DirectionalLight(0xdbeafe, 1.4);
    daylightBounce.position.set(5.8, 2.5, -1.0);
    daylightBounce.target.position.set(0, 1.2, -1.0);
    this.group.add(daylightBounce);
    this.group.add(daylightBounce.target);
  }

  // Luxury Executive Lounge: Leather Sofa, Low Marble Table, and Arc Floor Lamp
  private buildExecutiveLounge(): void {
    const loungeGroup = new THREE.Group();
    loungeGroup.position.set(-2.8, 0, -1.4);
    loungeGroup.rotation.y = 0.28; // Subtle welcoming angle towards room center

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x141821, // Deep espresso / rich midnight executive leather
      roughness: 0.42,
      metalness: 0.18,
    });

    // 1. Sofa Main Base Plinth
    const baseGeo = new THREE.BoxGeometry(1.85, 0.14, 0.82);
    const sofaBase = new THREE.Mesh(baseGeo, leatherMat);
    sofaBase.position.set(0, 0.18, 0);
    sofaBase.castShadow = true;
    loungeGroup.add(sofaBase);

    // Brushed titanium legs
    const legGeo = new THREE.CylinderGeometry(0.022, 0.015, 0.12, 16);
    const legMat = this.materials.getBrushedTitanium();
    const legPositions = [
      [-0.85, 0.06, 0.35],
      [0.85, 0.06, 0.35],
      [-0.85, 0.06, -0.35],
      [0.85, 0.06, -0.35],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      loungeGroup.add(leg);
    });

    // 2. Dual Deep Leather Seat Cushions
    for (let i = -1; i <= 1; i += 2) {
      const seatCushionGeo = new THREE.BoxGeometry(0.85, 0.18, 0.72);
      const seatCushion = new THREE.Mesh(seatCushionGeo, leatherMat);
      seatCushion.position.set(i * 0.44, 0.34, 0.02);
      seatCushion.castShadow = true;
      loungeGroup.add(seatCushion);

      // Tufted Backrest Cushions
      const backCushionGeo = new THREE.BoxGeometry(0.84, 0.42, 0.18);
      const backCushion = new THREE.Mesh(backCushionGeo, leatherMat);
      backCushion.position.set(i * 0.44, 0.62, -0.28);
      backCushion.castShadow = true;
      loungeGroup.add(backCushion);
    }

    // Armrests Left & Right
    const armGeo = new THREE.BoxGeometry(0.14, 0.34, 0.80);
    const lArm = new THREE.Mesh(armGeo, leatherMat);
    lArm.position.set(-0.92, 0.42, 0);
    loungeGroup.add(lArm);

    const rArm = new THREE.Mesh(armGeo, leatherMat);
    rArm.position.set(0.92, 0.42, 0);
    loungeGroup.add(rArm);

    // 3. Low Executive Marble / Smoked Glass Coffee Table
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, 0.72);

    const tableTopGeo = new THREE.BoxGeometry(0.92, 0.03, 0.52);
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f18,
      roughness: 0.15,
      metalness: 0.85,
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.set(0, 0.32, 0);
    tableTop.castShadow = true;
    tableGroup.add(tableTop);

    // Table Titanium Frame
    const frameGeo = new THREE.BoxGeometry(0.94, 0.015, 0.54);
    const frame = new THREE.Mesh(frameGeo, legMat);
    frame.position.set(0, 0.305, 0);
    tableGroup.add(frame);

    const tLegGeo = new THREE.BoxGeometry(0.03, 0.30, 0.03);
    [[-0.42, 0.15, 0.22], [0.42, 0.15, 0.22], [-0.42, 0.15, -0.22], [0.42, 0.15, -0.22]].forEach(([tx, ty, tz]) => {
      const tl = new THREE.Mesh(tLegGeo, legMat);
      tl.position.set(tx, ty, tz);
      tableGroup.add(tl);
    });

    loungeGroup.add(tableGroup);

    // 4. Modern Architectural Arc Floor Lamp
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-1.3, 0, -0.65);

    // Heavy Granite Base Disc
    const lampBaseGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.04, 32);
    const lampBase = new THREE.Mesh(lampBaseGeo, this.materials.getPolishedGranite());
    lampBase.position.set(0, 0.02, 0);
    lampGroup.add(lampBase);

    // Curved Slender Stem Tube
    const stemCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.04, 0),
      new THREE.Vector3(0, 2.3, 0),
      new THREE.Vector3(0.65, 2.1, 0.4)
    );
    const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.015, 12, false);
    const stem = new THREE.Mesh(stemGeo, this.materials.getPolishedChrome());
    lampGroup.add(stem);

    // Frosted Luminaire Dome Shade
    const shadeGeo = new THREE.SphereGeometry(0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xffeedd,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(0.65, 2.1, 0.4);
    shade.rotation.x = Math.PI;
    lampGroup.add(shade);

    // Warm Ambient Light illuminating the executive lounge
    const warmLight = new THREE.PointLight(0xffedd5, 1.8, 5.0, 1.8);
    warmLight.position.set(0.65, 1.95, 0.4);
    warmLight.castShadow = true;
    lampGroup.add(warmLight);

    loungeGroup.add(lampGroup);

    this.group.add(loungeGroup);
  }

  public update(time: number): void {
    this.interiorLogo.update(time);
  }

  public dispose(): void {
    this.canvasTextures.forEach((t) => t.dispose());
    this.interiorLogo.dispose();
  }
}
