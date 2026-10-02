import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";
import { SilverLogoSignage } from "./SilverLogoSignage";

/**
 * OfficeInterior
 * Realistic corporate executive office suite for DigiFormation Limited.
 * Features:
 * - Slatted walnut feature wall with physical machined silver DigiFormation logo
 * - Modern executive workstation with dual curved monitors displaying live Companies House & HMRC formation pipelines
 * - Professional male corporate officer (Director Muhammad Haroon) actively reviewing a customer formation order
 * - Believable office architecture: acoustic wood/carpet flooring, glass partitions, linear ceiling luminaires, credenzas
 */
export class OfficeInterior {
  private group: THREE.Group = new THREE.Group();
  private materials = MaterialFactory.getInstance();
  private interiorLogo: SilverLogoSignage;
  private canvasTextures: THREE.CanvasTexture[] = [];
  private officerMesh: THREE.Mesh | null = null;
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
    // A. Flooring: Chevron Dark Oak & Slate Acoustic Carpet Tiles
    const floorGeo = new THREE.PlaneGeometry(14, 12);
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext("2d");
    if (fCtx) {
      fCtx.fillStyle = "#0c111a";
      fCtx.fillRect(0, 0, 1024, 1024);

      // Acoustic carpet tile texture grid
      fCtx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      fCtx.lineWidth = 2;
      for (let x = 0; x <= 1024; x += 128) {
        fCtx.beginPath();
        fCtx.moveTo(x, 0); fCtx.lineTo(x, 1024);
        fCtx.stroke();
      }
      for (let y = 0; y <= 1024; y += 128) {
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
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0.02, -2.8);
    floorMesh.receiveShadow = true;
    this.group.add(floorMesh);

    // B. Rear Slatted Walnut Acoustic Feature Wall (Z = -4.2m)
    const wallGeo = new THREE.PlaneGeometry(14, 4.2);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      roughness: 0.75,
      metalness: 0.15,
    });
    const rearWall = new THREE.Mesh(wallGeo, wallMat);
    rearWall.position.set(0, 2.1, -4.2);
    this.group.add(rearWall);

    // Vertical Acoustic Timber Slats
    const slatMat = this.materials.getDarkWalnutWood();
    for (let x = -6.8; x <= 6.8; x += 0.18) {
      if (Math.abs(x) < 1.8) continue; // Keep space behind center logo plate clean
      const slatGeo = new THREE.BoxGeometry(0.06, 4.15, 0.04);
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(x, 2.1, -4.18);
      this.group.add(slat);
    }

    // Mount Physical Interior Silver Logo Signage
    const logoGroup = this.interiorLogo.getGroup();
    logoGroup.position.set(0, 2.4, -4.14);
    this.group.add(logoGroup);

    // Warm LED Wall-Wash Downlights illuminating the Silver Logo
    const wallWashLight = new THREE.SpotLight(0xfff7ed, 3.2, 8, Math.PI / 3, 0.4);
    wallWashLight.position.set(0, 3.8, -3.2);
    wallWashLight.target = logoGroup;
    this.group.add(wallWashLight);

    // C. Ceiling & Recessed Linear LED Luminaires (Y = 3.8m)
    const ceilingGeo = new THREE.PlaneGeometry(14, 12);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x070b12, roughness: 0.8 });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.set(0, 3.8, -2.8);
    this.group.add(ceilingMesh);

    // Linear Architectural Recessed Lights
    for (let z = -0.5; z >= -4.0; z -= 1.2) {
      const lightGeo = new THREE.BoxGeometry(7.5, 0.04, 0.08);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
      const lightMesh = new THREE.Mesh(lightGeo, lightMat);
      lightMesh.position.set(0, 3.78, z);
      this.group.add(lightMesh);
    }

    // D. Smoked Glass Privacy Partitions (X = ±4.5m)
    const glassMat = this.materials.getSmokedGlass();
    const lPartGeo = new THREE.BoxGeometry(0.08, 3.6, 5.5);
    const lPart = new THREE.Mesh(lPartGeo, glassMat);
    lPart.position.set(-4.5, 1.8, -2.5);
    this.group.add(lPart);

    const rPart = new THREE.Mesh(lPartGeo, glassMat);
    rPart.position.set(4.5, 1.8, -2.5);
    this.group.add(rPart);

    // E. Executive Workstation & Credenza
    this.buildWorkstation();

    // F. First Human Scene: Male Corporate Officer / Director Muhammad Haroon
    this.buildHumanOfficer();
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

  // First Human Scene: Male Corporate Officer (Muhammad Haroon, Director)
  private buildHumanOfficer(): void {
    const officerGroup = new THREE.Group();
    officerGroup.position.set(0, 0, -0.68);

    // Load authentic photographic portrait of Muhammad Haroon (Director of DigiFormation LTD)
    const loader = new THREE.TextureLoader();
    const officerTex = loader.load("/assets/brand/founder-haroon.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
    });

    // Realistic seated officer plane positioned naturally behind workstation desk
    const officerGeo = new THREE.PlaneGeometry(0.85, 1.15);
    const officerMat = new THREE.MeshStandardMaterial({
      map: officerTex,
      transparent: true,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    this.officerMesh = new THREE.Mesh(officerGeo, officerMat);
    this.officerMesh.position.set(0, 1.05, 0);
    officerGroup.add(this.officerMesh);

    // Realistic desk working shadow
    const shadowGeo = new THREE.PlaneGeometry(0.9, 0.4);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, 0.749, 0.08);
    officerGroup.add(shadow);

    this.group.add(officerGroup);
  }

  public update(time: number): void {
    this.interiorLogo.update(time);

    // Subtle natural breathing / executive posture micro-motion
    if (this.officerMesh) {
      this.officerMesh.position.y = 1.05 + Math.sin(time * 1.2) * 0.003;
    }
  }

  public dispose(): void {
    this.canvasTextures.forEach((t) => t.dispose());
    this.interiorLogo.dispose();
  }
}
