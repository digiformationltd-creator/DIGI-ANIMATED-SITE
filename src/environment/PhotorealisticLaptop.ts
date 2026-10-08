import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";

/**
 * PhotorealisticLaptop
 * High-end cinematic 3D laptop (precision CNC space-gray anodized aluminum):
 * - Chamfered base chassis with recessed keyboard well and multi-touch glass trackpad
 * - Precision lid hinge tilted at 112 degrees
 * - Ultra-thin display bezel with true 16:10 aspect ratio screen
 * - Real DIGI BIZ OS texture support with live cycling between modules
 * - 3D cinematic rotation (Apple commercial style)
 */
export class PhotorealisticLaptop {
  private group: THREE.Group = new THREE.Group();
  private lidGroup: THREE.Group = new THREE.Group();
  private screenMesh: THREE.Mesh | null = null;
  private screenMaterial: THREE.MeshStandardMaterial | null = null;
  private textures: THREE.Texture[] = [];
  private activeTextureIndex = 0;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.buildChassis();
    this.loadScreenTextures();
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  private buildChassis(): void {
    const aluMat = new THREE.MeshStandardMaterial({
      color: 0x22272f,
      roughness: 0.32,
      metalness: 0.88,
    });

    // 1. Base Body (32cm x 22cm x 1.4cm)
    const baseGeo = new THREE.BoxGeometry(0.82, 0.024, 0.54);
    const baseMesh = new THREE.Mesh(baseGeo, aluMat);
    baseMesh.position.set(0, 0.012, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    // Recessed Keyboard Well
    const kbWellGeo = new THREE.BoxGeometry(0.72, 0.004, 0.28);
    const kbWellMat = new THREE.MeshStandardMaterial({
      color: 0x161a22,
      roughness: 0.6,
      metalness: 0.2,
    });
    const kbWell = new THREE.Mesh(kbWellGeo, kbWellMat);
    kbWell.position.set(0, 0.023, -0.06);
    this.group.add(kbWell);

    // Glass Trackpad
    const trackGeo = new THREE.BoxGeometry(0.32, 0.003, 0.18);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x2a313d,
      roughness: 0.25,
      metalness: 0.7,
    });
    const trackpad = new THREE.Mesh(trackGeo, trackMat);
    trackpad.position.set(0, 0.0235, 0.16);
    this.group.add(trackpad);

    // 2. Display Lid (Hinged at Z = -0.27)
    this.lidGroup.position.set(0, 0.024, -0.27);

    // Lid Back Plate
    const lidBackGeo = new THREE.BoxGeometry(0.82, 0.54, 0.014);
    const lidBack = new THREE.Mesh(lidBackGeo, aluMat);
    lidBack.position.set(0, 0.27, -0.007);
    lidBack.castShadow = true;
    this.lidGroup.add(lidBack);

    // Display Bezel
    const bezelGeo = new THREE.BoxGeometry(0.81, 0.53, 0.002);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 0.27, 0.001);
    this.lidGroup.add(bezel);

    // 16:10 Crisp Screen Plane
    const screenGeo = new THREE.PlaneGeometry(0.77, 0.49);
    this.screenMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.95,
      metalness: 0.0,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.95,
      side: THREE.DoubleSide,
    });
    this.screenMesh = new THREE.Mesh(screenGeo, this.screenMaterial);
    this.screenMesh.position.set(0, 0.27, 0.003);
    this.lidGroup.add(this.screenMesh);

    // Tilt open backwards at ~112 degrees (realistic ergonomic laptop angle)
    this.lidGroup.rotation.x = -0.38;

    this.group.add(this.lidGroup);
  }

  private basePosY: number = 0.74;

  public setBasePosition(x: number, y: number, z: number): void {
    this.basePosY = y;
    this.group.position.set(x, y, z);
  }

  private loadScreenTextures(): void {
    const loader = new THREE.TextureLoader();
    const paths = [
      "/assets/digibizos/os-main-dashboard.png",
      "/assets/digibizos/os-digi-ai-hub.png",
      "/assets/digibizos/os-skills.png",
      "/assets/digibizos/os-graph-full.png",
    ];

    paths.forEach((p, idx) => {
      loader.load(p, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        this.textures[idx] = tex;

        // Apply first loaded texture immediately
        if (idx === 0 && this.screenMaterial && !this.screenMaterial.map) {
          this.screenMaterial.map = tex;
          this.screenMaterial.emissiveMap = tex;
          this.screenMaterial.needsUpdate = true;
        }
      });
    });
  }

  public setScreenTexture(index: number): void {
    if (!this.screenMaterial || !this.textures[index]) return;
    this.activeTextureIndex = index;
    this.screenMaterial.map = this.textures[index];
    this.screenMaterial.emissiveMap = this.textures[index];
    this.screenMaterial.needsUpdate = true;
  }

  public setRotation(rx: number, ry: number, rz: number): void {
    this.group.rotation.set(rx, ry, rz);
  }

  public setLidAngle(angleRad: number): void {
    this.lidGroup.rotation.x = angleRad;
  }

  public update(time: number, scrollProgress: number): void {
    // Cinematic subtle float / pan without losing elevation
    this.group.position.y = this.basePosY + Math.sin(time * 1.2) * 0.006;

    // Cycle screens based on scroll progress in the OS chapter
    const cycle = Math.floor(scrollProgress * 4) % 4;
    if (cycle !== this.activeTextureIndex && this.textures[cycle]) {
      this.setScreenTexture(cycle);
    }
  }

  public dispose(): void {
    this.textures.forEach((t) => t.dispose());
    if (this.screenMaterial) this.screenMaterial.dispose();
  }
}
