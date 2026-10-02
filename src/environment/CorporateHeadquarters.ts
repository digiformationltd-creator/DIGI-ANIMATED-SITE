import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";
import { SilverLogoSignage } from "./SilverLogoSignage";

/**
 * CorporateHeadquarters
 * Photorealistic 3D recreation of the Google-style corporate campus from the reference photograph:
 * - Bright, natural daylight sky with soft clouds and sun atmosphere
 * - Right wing: Monumental curved 8-story crescent wing with architectural concrete grid frames & reflective blue glass
 * - Center wing: Soaring curved blue reflective glass curtain wall with horizontal titanium louvers
 * - Left wing: Stepped corporate wing with cantilevered white concrete balconies & ribbon glass
 * - Multi-story central glass atrium entrance with transparent tempered doors
 * - Courtyard: Interlocking stone pavers walkway curving toward the entrance
 * - Landscaped earth mounds with warm brown mulch beds, green grass, mature shade tree, and saplings
 * - Foreground Entrance Monument: Heavy textured granite plinth with real physical machined silver DigiFormation logo
 * - Crown Parapet: Heavy-gauge brushed silver steel architectural signage
 */
export class CorporateHeadquarters {
  private group: THREE.Group = new THREE.Group();
  private materials = MaterialFactory.getInstance();
  private canvasTextures: THREE.CanvasTexture[] = [];
  private monumentLogo: SilverLogoSignage | null = null;
  private crownLogo: SilverLogoSignage | null = null;
  private windowGlassMesh: THREE.Mesh | null = null;

  constructor() {
    this.buildCampus();
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  private buildCampus(): void {
    // ========================================================
    // 1. DAYLIGHT SKYDOME & ATMOSPHERIC CLOUD BACKDROP
    // ========================================================
    const skyGeo = new THREE.SphereGeometry(95, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 2048;
    skyCanvas.height = 1024;
    const sCtx = skyCanvas.getContext("2d");
    if (sCtx) {
      // Natural daylight gradient: Zenith blue -> Radiant azure -> Soft horizon haze
      const skyGrad = sCtx.createLinearGradient(0, 0, 0, 1024);
      skyGrad.addColorStop(0, "#1d4ed8");    // Vibrant zenith blue
      skyGrad.addColorStop(0.35, "#3b82f6"); // Natural daylight azure
      skyGrad.addColorStop(0.72, "#93c5fd"); // Soft atmosphere
      skyGrad.addColorStop(0.92, "#e0f2fe"); // Horizon haze
      skyGrad.addColorStop(1.0, "#ffffff");  // Sun horizon glint
      sCtx.fillStyle = skyGrad;
      sCtx.fillRect(0, 0, 2048, 1024);

      // Realistic soft white cumulus clouds (as in reference photo)
      const cloudClusters = [
        [320, 360, 260, 80],
        [780, 280, 340, 110],
        [1350, 320, 420, 130],
        [1820, 290, 280, 90],
        [540, 480, 220, 60],
        [1120, 460, 300, 75],
      ];

      cloudClusters.forEach(([cx, cy, rx, ry]) => {
        const cGrad = sCtx.createRadialGradient(cx, cy, 10, cx, cy, rx);
        cGrad.addColorStop(0, "rgba(255, 255, 255, 0.92)");
        cGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.65)");
        cGrad.addColorStop(0.85, "rgba(240, 249, 255, 0.25)");
        cGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
        sCtx.fillStyle = cGrad;
        sCtx.beginPath();
        sCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        sCtx.fill();
      });
    }

    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(skyTexture);

    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, -4, 0);
    this.group.add(skyMesh);

    // ========================================================
    // 2. COURTYARD PLAZA & INTERLOCKING STONE PAVERS
    // ========================================================
    // Ground Base (60m x 80m)
    const groundGeo = new THREE.PlaneGeometry(75, 85);
    const groundCanvas = document.createElement("canvas");
    groundCanvas.width = 1024;
    groundCanvas.height = 1024;
    const gCtx = groundCanvas.getContext("2d");
    if (gCtx) {
      // Warm stone plaza ground
      gCtx.fillStyle = "#e2e8f0";
      gCtx.fillRect(0, 0, 1024, 1024);

      // Cobblestone interlocking paver grid (matching the reference walkway)
      gCtx.strokeStyle = "rgba(100, 116, 139, 0.35)";
      gCtx.lineWidth = 1.5;
      for (let x = 0; x <= 1024; x += 32) {
        gCtx.beginPath();
        gCtx.moveTo(x, 0); gCtx.lineTo(x, 1024);
        gCtx.stroke();
      }
      for (let y = 0; y <= 1024; y += 18) {
        gCtx.beginPath();
        gCtx.moveTo(0, y); gCtx.lineTo(1024, y);
        gCtx.stroke();
      }

      // Natural tone variations on pavers
      for (let i = 0; i < 600; i++) {
        const px = Math.floor(Math.random() * 32) * 32;
        const py = Math.floor(Math.random() * 56) * 18;
        const tone = Math.random() > 0.5 ? "rgba(203, 213, 225, 0.4)" : "rgba(241, 245, 249, 0.5)";
        gCtx.fillStyle = tone;
        gCtx.fillRect(px + 1, py + 1, 30, 16);
      }
    }

    const groundTexture = new THREE.CanvasTexture(groundCanvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(4, 5);
    groundTexture.colorSpace = THREE.SRGBColorSpace;
    this.canvasTextures.push(groundTexture);

    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.55,
      metalness: 0.15,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, 0, 15);
    groundMesh.receiveShadow = true;
    this.group.add(groundMesh);

    // ========================================================
    // 3. LANDSCAPED MULCH BERMS & MANICURED BERM MOUNDS
    // ========================================================
    // Left & Right warm brown mulch beds (exactly like the photo)
    const mulchMat = new THREE.MeshStandardMaterial({
      color: 0x8a624a, // Warm cedar mulch brown
      roughness: 0.95,
      metalness: 0.05,
    });

    // Left curved berm
    const lBermGeo = new THREE.CylinderGeometry(14, 18, 0.45, 32);
    const lBerm = new THREE.Mesh(lBermGeo, mulchMat);
    lBerm.position.set(-16, 0.2, 18);
    lBerm.scale.set(1.4, 1, 1.8);
    lBerm.receiveShadow = true;
    this.group.add(lBerm);

    // Right curved berm
    const rBermGeo = new THREE.CylinderGeometry(11, 15, 0.4, 32);
    const rBerm = new THREE.Mesh(rBermGeo, mulchMat);
    rBerm.position.set(15, 0.18, 22);
    rBerm.scale.set(1.2, 1, 1.6);
    rBerm.receiveShadow = true;
    this.group.add(rBerm);

    // ========================================================
    // 4. TREES & NATURAL FOLIAGE (MATCHING REFERENCE PHOTO)
    // ========================================================
    // Left Foreground Mature Shade Tree
    this.createMatureTree(-13, 14);

    // Landscaped saplings on the berms with bamboo support stakes
    this.createSaplingWithStakes(-6.5, 23);
    this.createSaplingWithStakes(7.5, 24);
    this.createSaplingWithStakes(12.5, 18);
    this.createSaplingWithStakes(-18, 26);

    // ========================================================
    // 5. ENTRANCE MONUMENT (FOREGROUND GRANITE PLINTH & LOGO)
    // ========================================================
    // Heavy Textured Architectural Granite Plinth Block (matching photo)
    const plinthGeo = new THREE.BoxGeometry(4.8, 2.5, 0.85);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Medium architectural granite
      roughness: 0.38,
      metalness: 0.25,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(2.2, 1.25, 18.0);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    this.group.add(plinth);

    // Polished Silver Chrome Top Coping on Monument
    const plinthCapGeo = new THREE.BoxGeometry(4.92, 0.08, 0.92);
    const plinthCap = new THREE.Mesh(plinthCapGeo, this.materials.getPolishedChrome());
    plinthCap.position.set(2.2, 2.52, 18.0);
    this.group.add(plinthCap);

    // Mount Official Machined Silver Logo Plaque on left side of Monument (matching campus-reference.jpg)
    // Using the exact uploaded official silver logo (/assets/brand/digiformation-silver-logo-official.jpg)
    this.monumentLogo = new SilverLogoSignage(2.1, 2.1, 0.08, true);
    const monLogoGroup = this.monumentLogo.getGroup();
    monLogoGroup.position.set(1.05, 1.25, 18.45);
    this.group.add(monLogoGroup);

    // ========================================================
    // 6. CORPORATE HEADQUARTERS ARCHITECTURE
    // ========================================================
    const buildingHeight = 24.0; // 8 floors @ 3m

    // A. Right Wing: Grand Curved Concrete Grid Facade (Radius = 26m)
    this.buildCurvedConcreteGridWing(buildingHeight);

    // B. Center Wing: Soaring Curved Blue Glass Curtain Wall
    this.buildCenterGlassCurtainWing(buildingHeight);

    // C. Left Wing: Stepped Modern Office Wing
    this.buildLeftSteppedWing(buildingHeight);

    // D. Multi-Story Transparent Glass Atrium Entrance
    this.buildGlassAtriumEntrance(buildingHeight);

    // E. Building Crown Architectural Silver Steel Logo Signage
    this.buildCrownSilverSignage(buildingHeight);
  }

  // Right Wing: Curved Architectural Concrete Grid (8 floors, rectangular recessed bays)
  private buildCurvedConcreteGridWing(height: number): void {
    const wingGroup = new THREE.Group();
    const radius = 28;
    const startAngle = -0.25;
    const endAngle = 0.85;
    const floors = 8;
    const floorHeight = height / floors;

    // Concrete material
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // Light grey architectural concrete
      roughness: 0.5,
      metalness: 0.15,
    });

    // Deep blue reflective solar glass material
    const solarGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e40af, // Deep vibrant architectural blue
      roughness: 0.04,
      metalness: 0.88,
      transmission: 0.6,
      ior: 1.52,
    });

    // Build repeating curved columns & spandrels
    const bayCount = 14;
    for (let b = 0; b <= bayCount; b++) {
      const angle = startAngle + (b / bayCount) * (endAngle - startAngle);
      const x = Math.sin(angle) * radius + 12;
      const z = Math.cos(angle) * radius - 26;

      // Vertical concrete structural column
      const colGeo = new THREE.BoxGeometry(0.45, height, 0.65);
      const col = new THREE.Mesh(colGeo, concreteMat);
      col.position.set(x, height / 2, z);
      col.rotation.y = angle;
      col.castShadow = true;
      wingGroup.add(col);
    }

    // Horizontal concrete floor spandrels
    for (let f = 0; f <= floors; f++) {
      const y = f * floorHeight;
      const spandrelGeo = new THREE.CylinderGeometry(radius, radius, 0.42, 36, 1, true, startAngle, endAngle - startAngle);
      const spandrel = new THREE.Mesh(spandrelGeo, concreteMat);
      spandrel.position.set(12, y, -26);
      wingGroup.add(spandrel);
    }

    // Recessed Blue Glass Window Surface
    const glassGeo = new THREE.CylinderGeometry(radius - 0.25, radius - 0.25, height, 48, 8, true, startAngle, endAngle - startAngle);
    const glass = new THREE.Mesh(glassGeo, solarGlassMat);
    glass.position.set(12, height / 2, -26);
    wingGroup.add(glass);

    this.group.add(wingGroup);
  }

  // Center Wing: Soaring Curved Blue Glass Curtain Wall with Titanium Louvers
  private buildCenterGlassCurtainWing(height: number): void {
    const centerGroup = new THREE.Group();
    const radius = 32;
    const startAngle = Math.PI - 0.55;
    const arc = 0.95;

    // High-performance reflective curtain glass
    const curtainGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb, // High-performance sky-reflective blue
      roughness: 0.03,
      metalness: 0.92,
      transmission: 0.5,
      ior: 1.55,
    });

    const glassGeo = new THREE.CylinderGeometry(radius, radius, height, 48, 8, true, startAngle, arc);
    const glassMesh = new THREE.Mesh(glassGeo, curtainGlassMat);
    glassMesh.position.set(-6, height / 2, -30);
    centerGroup.add(glassMesh);

    // Horizontal Brushed Titanium Sun Louvers
    const louverMat = this.materials.getBrushedTitanium();
    for (let y = 3; y <= height; y += 3) {
      const louverGeo = new THREE.CylinderGeometry(radius + 0.35, radius + 0.35, 0.08, 48, 1, true, startAngle, arc);
      const louver = new THREE.Mesh(louverGeo, louverMat);
      louver.position.set(-6, y, -30);
      centerGroup.add(louver);
    }

    this.group.add(centerGroup);
  }

  // Left Wing: Stepped Modern Office Wing with Balconies
  private buildLeftSteppedWing(height: number): void {
    const leftGroup = new THREE.Group();
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.42,
      metalness: 0.15,
    });
    const ribbonGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.05,
      metalness: 0.85,
      transmission: 0.65,
    });

    const floors = 7;
    for (let f = 0; f < floors; f++) {
      const y = f * 3.4;
      const stepOffset = f * 0.45;

      // Balcony slab
      const slabGeo = new THREE.BoxGeometry(16, 0.38, 9);
      const slab = new THREE.Mesh(slabGeo, concreteMat);
      slab.position.set(-24 - stepOffset, y + 0.2, -6 - stepOffset * 0.5);
      slab.castShadow = true;
      leftGroup.add(slab);

      // Ribbon window pane
      const winGeo = new THREE.BoxGeometry(15.6, 2.8, 0.1);
      const win = new THREE.Mesh(winGeo, ribbonGlassMat);
      win.position.set(-24 - stepOffset, y + 1.8, -1.8 - stepOffset * 0.5);
      leftGroup.add(win);
    }

    this.group.add(leftGroup);
  }

  // Center Grand Glass Atrium & Double-Glazed Window Entry Portal
  private buildGlassAtriumEntrance(height: number): void {
    const atriumGroup = new THREE.Group();

    // Atrium Glass Canopy
    const canopyGeo = new THREE.BoxGeometry(14, 0.3, 7);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.85,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 4.8, 4.5);
    canopy.castShadow = true;
    atriumGroup.add(canopy);

    // Chrome Entrance Frame Posts
    const postGeo = new THREE.BoxGeometry(0.35, 4.8, 0.35);
    const leftPost = new THREE.Mesh(postGeo, this.materials.getPolishedChrome());
    leftPost.position.set(-5.5, 2.4, 4.5);
    atriumGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, this.materials.getPolishedChrome());
    rightPost.position.set(5.5, 2.4, 4.5);
    atriumGroup.add(rightPost);

    // Sliding Tempered Glass Entrance Doors (Parted open for camera pass-through)
    const doorGeo = new THREE.BoxGeometry(2.4, 4.2, 0.08);
    const doorMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.85,
      transmission: 0.85,
    });
    const lDoor = new THREE.Mesh(doorGeo, doorMat);
    lDoor.position.set(-3.2, 2.1, 1.05);
    atriumGroup.add(lDoor);

    const rDoor = new THREE.Mesh(doorGeo, doorMat);
    rDoor.position.set(3.2, 2.1, 1.05);
    atriumGroup.add(rDoor);

    // Double-Glazed Executive Window (Z = 1.02)
    const winGeo = new THREE.PlaneGeometry(8.5, 4.2);
    const winMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.85,
      roughness: 0.04,
      metalness: 0.88,
      transmission: 0.75,
      ior: 1.5,
    });
    this.windowGlassMesh = new THREE.Mesh(winGeo, winMat);
    this.windowGlassMesh.position.set(0, 2.1, 1.02);
    atriumGroup.add(this.windowGlassMesh);

    this.group.add(atriumGroup);
  }

  // Building Crown: Real Machined Silver Steel DIGIFORMATION Signage
  private buildCrownSilverSignage(height: number): void {
    // Crown Architectural Parapet
    const parapetGeo = new THREE.BoxGeometry(26, 3.2, 1.2);
    const parapetMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.75,
    });
    const parapet = new THREE.Mesh(parapetGeo, parapetMat);
    parapet.position.set(-2, height + 1.2, -1.0);
    this.group.add(parapet);

    // Polished Silver Coping Trim
    const copingGeo = new THREE.BoxGeometry(26.4, 0.25, 1.4);
    const coping = new THREE.Mesh(copingGeo, this.materials.getPolishedChrome());
    coping.position.set(-2, height + 2.8, -1.0);
    this.group.add(coping);

    // Mount Physical Machined Silver Logo on Building Crown
    this.crownLogo = new SilverLogoSignage(12.5, 3.8, 0.12, false);
    const crownGroup = this.crownLogo.getGroup();
    crownGroup.position.set(-2, height + 1.2, -0.35);
    this.group.add(crownGroup);
  }

  // Create Left Foreground Mature Shade Tree
  private createMatureTree(x: number, z: number): void {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);

    // Natural curved trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x473427, roughness: 0.95 });
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.65, 5.5, 12);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 2.75, 0);
    trunk.rotation.z = -0.08;
    trunk.castShadow = true;
    tree.add(trunk);

    // Leafy green canopy clusters
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32, // Natural lush green foliage
      roughness: 0.75,
      metalness: 0.05,
    });

    const leafOffsets = [
      [0, 5.5, 0, 2.6],
      [-1.2, 6.2, 0.8, 2.2],
      [1.4, 5.8, -0.6, 2.4],
      [0.6, 7.2, 0.4, 1.9],
      [-1.6, 4.8, -0.8, 1.8],
    ];

    leafOffsets.forEach(([lx, ly, lz, r]) => {
      const foliageGeo = new THREE.DodecahedronGeometry(r, 1);
      const foliage = new THREE.Mesh(foliageGeo, leafMat);
      foliage.position.set(lx, ly, lz);
      foliage.castShadow = true;
      tree.add(foliage);
    });

    this.group.add(tree);
  }

  // Landscaped saplings with diagonal support stakes (matching photo)
  private createSaplingWithStakes(x: number, z: number): void {
    const sapling = new THREE.Group();
    sapling.position.set(x, 0, z);

    // Slender trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.8, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 1.9, 0);
    sapling.add(trunk);

    // Diagonal bamboo stakes
    const stakeMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.7 });
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 / 3) * i;
      const stakeGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6);
      const stake = new THREE.Mesh(stakeGeo, stakeMat);
      stake.position.set(Math.cos(angle) * 0.45, 1.0, Math.sin(angle) * 0.45);
      stake.rotation.z = Math.cos(angle) * 0.28;
      stake.rotation.x = Math.sin(angle) * 0.28;
      sapling.add(stake);
    }

    // Foliage
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 });
    const foliageGeo = new THREE.DodecahedronGeometry(1.2, 1);
    const foliage = new THREE.Mesh(foliageGeo, leafMat);
    foliage.position.set(0, 3.6, 0);
    foliage.castShadow = true;
    sapling.add(foliage);

    this.group.add(sapling);
  }

  public update(sceneProgress: number, delta: number): void {
    const time = Date.now() * 0.001;
    if (this.monumentLogo) this.monumentLogo.update(time);
    if (this.crownLogo) this.crownLogo.update(time);

    // Dynamic window glass transition:
    // When progress crosses between 0.72 and 0.84, dissolve the exterior glass reflection smoothly into the interior!
    if (this.windowGlassMesh) {
      if (sceneProgress < 0.72) {
        (this.windowGlassMesh.material as THREE.MeshPhysicalMaterial).opacity = 0.85;
        this.windowGlassMesh.visible = true;
      } else if (sceneProgress < 0.84) {
        const t = (sceneProgress - 0.72) / 0.12;
        (this.windowGlassMesh.material as THREE.MeshPhysicalMaterial).opacity = (1 - t) * 0.85;
        this.windowGlassMesh.visible = true;
      } else {
        this.windowGlassMesh.visible = false;
      }
    }
  }

  public dispose(): void {
    this.canvasTextures.forEach((t) => t.dispose());
    if (this.monumentLogo) this.monumentLogo.dispose();
    if (this.crownLogo) this.crownLogo.dispose();
  }
}
