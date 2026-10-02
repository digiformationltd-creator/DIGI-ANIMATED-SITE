import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";

/**
 * CorporateHeadquarters
 * Procedural 3D Google-style corporate headquarters campus.
 * Features:
 * - Monumental multi-story curved glass & architectural steel building
 * - Silver brushed steel / chrome "DIGIFORMATION LIMITED" logo on the upper parapet
 * - Ground entrance plaza with reflecting water pools, bollard lighting, and entrance monument
 * - Grand cantilevered entrance canopy with glass atrium
 * - Warm interior executive lobby visible through the glass facade
 */
export class CorporateHeadquarters {
  private group: THREE.Group = new THREE.Group();
  private materials = MaterialFactory.getInstance();
  private logoMesh: THREE.Mesh | null = null;
  private canvasTextures: THREE.CanvasTexture[] = [];
  private logoLights: THREE.SpotLight[] = [];

  constructor() {
    this.buildCampus();
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  private buildCampus(): void {
    // ==========================================
    // 1. EXTERIOR PLAZA & APPROACH GROUNDS
    // ==========================================
    // Wide dark granite plaza (width: 50m, length: 60m)
    const plazaGeo = new THREE.PlaneGeometry(50, 60);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x080b10,
      roughness: 0.35,
      metalness: 0.3,
    });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.rotation.x = -Math.PI / 2;
    plazaMesh.position.set(0, 0, 15);
    plazaMesh.receiveShadow = true;
    this.group.add(plazaMesh);

    // Center Grand Walkway (lighter brushed stone runner leading into entrance)
    const walkGeo = new THREE.PlaneGeometry(8, 55);
    const walkMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.25,
      metalness: 0.4,
    });
    const walkMesh = new THREE.Mesh(walkGeo, walkMat);
    walkMesh.rotation.x = -Math.PI / 2;
    walkMesh.position.set(0, 0.01, 15);
    walkMesh.receiveShadow = true;
    this.group.add(walkMesh);

    // Inlaid illuminated LED runway strip lights along walkway
    const stripGeo = new THREE.PlaneGeometry(0.08, 48);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const leftStrip = new THREE.Mesh(stripGeo, stripMat);
    leftStrip.rotation.x = -Math.PI / 2;
    leftStrip.position.set(-3.95, 0.02, 16);
    this.group.add(leftStrip);

    const rightStrip = new THREE.Mesh(stripGeo, stripMat);
    rightStrip.rotation.x = -Math.PI / 2;
    rightStrip.position.set(3.95, 0.02, 16);
    this.group.add(rightStrip);

    // Modern Reflecting Pools (Water features on both sides of walkway)
    const poolGeo = new THREE.PlaneGeometry(14, 28);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.05,
      metalness: 0.9,
    });
    const leftPool = new THREE.Mesh(poolGeo, poolMat);
    leftPool.rotation.x = -Math.PI / 2;
    leftPool.position.set(-13, 0.015, 18);
    this.group.add(leftPool);

    const rightPool = new THREE.Mesh(poolGeo, poolMat);
    rightPool.rotation.x = -Math.PI / 2;
    rightPool.position.set(13, 0.015, 18);
    this.group.add(rightPool);

    // Architectural Bollard Lights along pools
    for (let z = 6; z <= 30; z += 6) {
      this.createBollard(-4.5, z);
      this.createBollard(4.5, z);
    }

    // ==========================================
    // 2. MONUMENTAL HEADQUARTERS BUILDING
    // ==========================================
    // Dimensions: Width 42m, Height 22m, Depth 24m
    const buildingWidth = 42;
    const buildingHeight = 22;
    const buildingDepth = 24;

    // Structural Concrete Core & Interior Back Wall
    const coreGeo = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e17,
      roughness: 0.6,
      metalness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, buildingHeight / 2, -buildingDepth / 2 + 1);
    this.group.add(coreMesh);

    // Floor Slabs (Levels 1 to 5) visible through glass
    const floorLevels = [4.5, 9.0, 13.5, 18.0];
    floorLevels.forEach((levelY) => {
      const slabGeo = new THREE.BoxGeometry(buildingWidth + 0.4, 0.45, 18);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x151c28,
        roughness: 0.4,
        metalness: 0.5,
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, levelY, -7);
      this.group.add(slab);

      // Floor Edge LED Accent Light
      const ledGeo = new THREE.BoxGeometry(buildingWidth + 0.5, 0.06, 0.06);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0, levelY - 0.2, 1.05);
      this.group.add(led);
    });

    // Glass Curtain Wall (Google-style expansive floor-to-ceiling glass facade)
    const glassGeo = new THREE.PlaneGeometry(buildingWidth, buildingHeight);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.45,
      roughness: 0.08,
      metalness: 0.85,
      transmission: 0.65,
      ior: 1.5,
    });
    const glassFacade = new THREE.Mesh(glassGeo, glassMat);
    glassFacade.position.set(0, buildingHeight / 2, 1.0);
    this.group.add(glassFacade);

    // Architectural Steel Mullions (Vertical and Horizontal Grid)
    const mullionMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.9,
    });

    // Vertical structural columns
    for (let x = -buildingWidth / 2; x <= buildingWidth / 2; x += 4.2) {
      const colGeo = new THREE.BoxGeometry(0.2, buildingHeight, 0.35);
      const colMesh = new THREE.Mesh(colGeo, mullionMat);
      colMesh.position.set(x, buildingHeight / 2, 1.02);
      this.group.add(colMesh);
    }

    // Horizontal structural louvers
    for (let y = 2.2; y <= buildingHeight; y += 2.25) {
      const louvGeo = new THREE.BoxGeometry(buildingWidth, 0.12, 0.3);
      const louvMesh = new THREE.Mesh(louvGeo, mullionMat);
      louvMesh.position.set(0, y, 1.02);
      this.group.add(louvMesh);
    }

    // ==========================================
    // 3. GRAND ENTRANCE CANOPY & ATRIUM FOYER
    // ==========================================
    // Projecting entrance canopy (Width: 16m, Depth: 7m, Height: 4.8m)
    const canopyGeo = new THREE.BoxGeometry(16, 0.3, 7);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.88,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 4.8, 4.5);
    this.group.add(canopy);

    // Canopy perimeter fascia trim (Brushed titanium)
    const canopyTrimGeo = new THREE.BoxGeometry(16.2, 0.35, 7.2);
    const canopyTrimMat = this.materials.getBrushedTitanium();
    const canopyTrim = new THREE.Mesh(canopyTrimGeo, canopyTrimMat);
    canopyTrim.position.set(0, 4.8, 4.5);
    this.group.add(canopyTrim);

    // Canopy underside warm architectural downlights
    const downlightPositions = [
      [-5, 4.62, 3],
      [0, 4.62, 3],
      [5, 4.62, 3],
      [-5, 4.62, 6],
      [0, 4.62, 6],
      [5, 4.62, 6],
    ];
    downlightPositions.forEach(([x, y, z]) => {
      const fixtureGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
      const fixtureMat = new THREE.MeshBasicMaterial({ color: 0xfff7ed });
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(x, y, z);
      this.group.add(fixture);
    });

    // Grand Glass Revolving & Sliding Doors
    const doorFrameGeo = new THREE.BoxGeometry(9.0, 3.8, 0.2);
    const doorFrameMat = this.materials.getPolishedChrome();
    const doorFrame = new THREE.Mesh(doorFrameGeo, doorFrameMat);
    doorFrame.position.set(0, 1.9, 1.1);
    this.group.add(doorFrame);

    // Center Revolving Door Cylinder
    const revGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.6, 24, 1, true);
    const revMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.5,
    });
    const revolvingDoor = new THREE.Mesh(revGeo, revMat);
    revolvingDoor.position.set(0, 1.8, 1.1);
    this.group.add(revolvingDoor);

    // ==========================================
    // 4. UPPER PARAPET & SILVER STEEL LOGO
    // ==========================================
    // Building top crown / architectural parapet fascia (Width: 36m, Height: 3.5m)
    const parapetGeo = new THREE.BoxGeometry(36, 3.5, 1.4);
    const parapetMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.35,
      metalness: 0.75,
    });
    const parapet = new THREE.Mesh(parapetGeo, parapetMat);
    parapet.position.set(0, buildingHeight + 1.2, 1.1);
    this.group.add(parapet);

    // Polished Silver Brushed Steel Parapet Coping
    const copingGeo = new THREE.BoxGeometry(36.4, 0.25, 1.6);
    const copingMat = new THREE.MeshStandardMaterial({
      color: 0xd8e1ec,
      roughness: 0.15,
      metalness: 0.95,
    });
    const coping = new THREE.Mesh(copingGeo, copingMat);
    coping.position.set(0, buildingHeight + 3.0, 1.1);
    this.group.add(coping);

    // ========================================================
    // 5. THE SILVER STEEL "DIGIFORMATION LIMITED" LOGO
    // ========================================================
    // High-resolution Canvas texture rendering the metallic 3D logo
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 2048;
    logoCanvas.height = 512;
    const lCtx = logoCanvas.getContext("2d");

    if (lCtx) {
      // Dark slate background for backing plate
      lCtx.fillStyle = "#070a0f";
      lCtx.fillRect(0, 0, 2048, 512);

      // Silver Brushed Steel Border
      const borderGrad = lCtx.createLinearGradient(0, 0, 2048, 512);
      borderGrad.addColorStop(0, "#cbd5e1");
      borderGrad.addColorStop(0.3, "#f8fafc");
      borderGrad.addColorStop(0.5, "#94a3b8");
      borderGrad.addColorStop(0.7, "#ffffff");
      borderGrad.addColorStop(1, "#64748b");
      lCtx.strokeStyle = borderGrad;
      lCtx.lineWidth = 10;
      lCtx.strokeRect(20, 20, 2008, 472);

      // Inner subtle metallic panel
      lCtx.fillStyle = "#0c1017";
      lCtx.fillRect(30, 30, 1988, 452);

      // Silver Metallic Gradient for Text and Emblem
      const steelGrad = lCtx.createLinearGradient(0, 100, 0, 380);
      steelGrad.addColorStop(0, "#ffffff");
      steelGrad.addColorStop(0.2, "#f1f5f9");
      steelGrad.addColorStop(0.45, "#cbd5e1");
      steelGrad.addColorStop(0.52, "#64748b");
      steelGrad.addColorStop(0.7, "#94a3b8");
      steelGrad.addColorStop(0.85, "#e2e8f0");
      steelGrad.addColorStop(1, "#ffffff");

      // Emblem Icon (Architectural Hexagonal Cube / Monolith mark)
      lCtx.save();
      lCtx.translate(280, 256);

      // Outer silver hexagon
      lCtx.strokeStyle = steelGrad;
      lCtx.lineWidth = 14;
      lCtx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = 90 * Math.cos(angle);
        const y = 90 * Math.sin(angle);
        if (i === 0) lCtx.moveTo(x, y);
        else lCtx.lineTo(x, y);
      }
      lCtx.closePath();
      lCtx.stroke();

      // Inner geometric cube facets (DigiFormation core symbol)
      lCtx.fillStyle = "rgba(56, 189, 248, 0.85)"; // Subtle cyan electric core
      lCtx.beginPath();
      lCtx.arc(0, 0, 28, 0, Math.PI * 2);
      lCtx.fill();
      lCtx.restore();

      // Main Monumental Lettering: DIGIFORMATION LIMITED
      lCtx.fillStyle = steelGrad;
      lCtx.font = "900 112px 'Inter', 'Segoe UI', system-ui, sans-serif";
      lCtx.textAlign = "left";
      lCtx.shadowColor = "rgba(255, 255, 255, 0.4)";
      lCtx.shadowBlur = 18;
      lCtx.fillText("DIGIFORMATION LIMITED", 430, 275);
      lCtx.shadowBlur = 0;

      // Sub-heading: GLOBAL HEADQUARTERS & CORPORATE CAMPUS
      lCtx.fillStyle = "#94a3b8";
      lCtx.font = "bold 32px 'JetBrains Mono', monospace";
      lCtx.fillText("GLOBAL CORPORATE HEADQUARTERS · SOVEREIGN DIGITAL CAMPUS", 435, 345);

      // Top statutory indicator
      lCtx.fillStyle = "#38bdf8";
      lCtx.font = "bold 24px 'JetBrains Mono', monospace";
      lCtx.fillText("ENTERPRISE FORMATIONS & AUTONOMOUS SYSTEMS", 435, 170);
    }

    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.minFilter = THREE.LinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;
    this.canvasTextures.push(logoTexture);

    // 3D Physical Logo Plaque mounted on upper parapet
    const logoPlateGeo = new THREE.PlaneGeometry(18.0, 4.5);
    const logoPlateMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      roughness: 0.12,
      metalness: 0.95, // High metallic silver steel
      emissive: new THREE.Color(0xffffff),
      emissiveMap: logoTexture,
      emissiveIntensity: 0.45,
    });
    this.logoMesh = new THREE.Mesh(logoPlateGeo, logoPlateMat);
    this.logoMesh.position.set(0, buildingHeight + 1.2, 1.85);
    this.group.add(this.logoMesh);

    // 3D Steel Frame around the Logo Plaque
    const frameGeo = new THREE.BoxGeometry(18.2, 4.7, 0.25);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // Polished silver metal
      roughness: 0.15,
      metalness: 0.98,
    });
    const logoFrame = new THREE.Mesh(frameGeo, frameMat);
    logoFrame.position.set(0, buildingHeight + 1.2, 1.73);
    this.group.add(logoFrame);

    // Dedicated Spotlights illuminating the Silver Logo from below
    const spotLeft = new THREE.SpotLight(0xf8fafc, 3.5, 20, Math.PI / 5, 0.4);
    spotLeft.position.set(-6, buildingHeight - 4, 6);
    spotLeft.target = this.logoMesh;
    this.group.add(spotLeft);
    this.logoLights.push(spotLeft);

    const spotRight = new THREE.SpotLight(0xf8fafc, 3.5, 20, Math.PI / 5, 0.4);
    spotRight.position.set(6, buildingHeight - 4, 6);
    spotRight.target = this.logoMesh;
    this.group.add(spotRight);
    this.logoLights.push(spotRight);

    // ==========================================
    // 6. CAMPUS ENTRANCE MONUMENT (Plaza Sign)
    // ==========================================
    // Granite Plinth at plaza entrance (Like Google's iconic campus entrance monument)
    const monumentGeo = new THREE.BoxGeometry(6.5, 2.0, 1.2);
    const monumentMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f17,
      roughness: 0.3,
      metalness: 0.5,
    });
    const monument = new THREE.Mesh(monumentGeo, monumentMat);
    monument.position.set(-8.5, 1.0, 26);
    this.group.add(monument);

    // Silver Steel Faceplate on Monument
    const mPlateGeo = new THREE.PlaneGeometry(5.8, 1.4);
    const mPlateMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      roughness: 0.15,
      metalness: 0.95,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: logoTexture,
      emissiveIntensity: 0.35,
    });
    const mPlate = new THREE.Mesh(mPlateGeo, mPlateMat);
    mPlate.position.set(-8.5, 1.0, 26.62);
    this.group.add(mPlate);

    // Monument Uplight
    const mLight = new THREE.PointLight(0x38bdf8, 1.5, 5);
    mLight.position.set(-8.5, 0.2, 27.5);
    this.group.add(mLight);
  }

  private createBollard(x: number, z: number): void {
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
    const postMat = this.materials.getBrushedTitanium();
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(x, 0.45, z);
    this.group.add(post);

    const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16);
    const capMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(x, 0.88, z);
    this.group.add(cap);
  }

  public update(progress: number, delta: number): void {
    // Subtle specular shimmer on logo
    const time = Date.now() * 0.001;
    if (this.logoMesh) {
      const mat = this.logoMesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.4 + Math.sin(time * 1.5) * 0.08;
      }
    }
  }

  public dispose(): void {
    this.canvasTextures.forEach((t) => t.dispose());
  }
}
