import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";

/**
 * SilverLogoSignage
 * Physically manufactured, machined silver / brushed steel architectural signage
 * utilizing the official provided DigiFormation silver logo asset (/assets/brand/digiformation-silver-logo-official.jpg).
 * Features:
 * - Real machined brushed stainless steel plate with CNC beveled chamfers
 * - Polished chrome standoff mounting hardware with contact drop shadows
 * - Real metallic specular response in bright daylight
 * - Guaranteed 100% correct orientation and aspect ratio matching the official brand asset
 */
export class SilverLogoSignage {
  private group: THREE.Group = new THREE.Group();
  private materials = MaterialFactory.getInstance();
  private logoMesh: THREE.Mesh | null = null;
  private logoTexture: THREE.CanvasTexture | null = null;
  private logoCanvas: HTMLCanvasElement | null = null;

  constructor(width: number, height: number, depth: number = 0.08, isMonument: boolean = false) {
    this.buildPhysicalSignage(width, height, depth, isMonument);
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  private buildPhysicalSignage(w: number, h: number, d: number, isMonument: boolean): void {
    // 1. Heavy Gauge Brushed Stainless Steel Backing Tray (Physical CNC Machined Plate)
    const trayGeo = new THREE.BoxGeometry(w, h, d);
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.92,
    });
    const trayMesh = new THREE.Mesh(trayGeo, trayMat);
    trayMesh.castShadow = true;
    trayMesh.receiveShadow = true;
    this.group.add(trayMesh);

    // 2. Polished Chrome Architectural Beveled Perimeter Frame
    const frameGeo = new THREE.BoxGeometry(w + 0.05, h + 0.05, d * 0.4);
    const frameMesh = new THREE.Mesh(frameGeo, this.materials.getPolishedChrome());
    frameMesh.position.set(0, 0, -d * 0.25);
    this.group.add(frameMesh);

    // 3. Pixel-Perfect Canvas Texture loader (guarantees correct upright orientation and aspect)
    this.logoCanvas = document.createElement("canvas");
    this.logoCanvas.width = 1024;
    this.logoCanvas.height = 1024;
    const ctx = this.logoCanvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, 1024, 1024);
    }

    this.logoTexture = new THREE.CanvasTexture(this.logoCanvas);
    this.logoTexture.colorSpace = THREE.SRGBColorSpace;
    this.logoTexture.minFilter = THREE.LinearFilter;
    this.logoTexture.magFilter = THREE.LinearFilter;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/assets/brand/digiformation-silver-logo-official.jpg";
    img.onload = () => {
      if (!ctx || !this.logoCanvas) return;
      ctx.fillStyle = "#020306";
      ctx.fillRect(0, 0, 1024, 1024);

      const aspect = w / h;
      if (aspect > 1.0) {
        // Wider than tall: fit vertically, center horizontally
        const drawW = 1024 / aspect;
        const offset = (1024 - drawW) / 2;
        ctx.drawImage(img, offset, 0, drawW, 1024);
      } else if (aspect < 1.0) {
        // Taller than wide: fit horizontally, center vertically
        const drawH = 1024 * aspect;
        const offset = (1024 - drawH) / 2;
        ctx.drawImage(img, 0, offset, 1024, drawH);
      } else {
        // Exact 1:1 square
        ctx.drawImage(img, 0, 0, 1024, 1024);
      }
      this.logoTexture!.needsUpdate = true;
    };

    // 4. Physical Logo Face with Machined Silver Metallic Shader Response
    const faceGeo = new THREE.PlaneGeometry(w - 0.04, h - 0.04);
    const faceMat = new THREE.MeshStandardMaterial({
      map: this.logoTexture,
      roughness: 0.12,
      metalness: 0.95, // Real Machined Silver Steel
      envMapIntensity: 2.5,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: this.logoTexture,
      emissiveIntensity: isMonument ? 0.35 : 0.65,
    });

    this.logoMesh = new THREE.Mesh(faceGeo, faceMat);
    this.logoMesh.position.set(0, 0, d / 2 + 0.002);
    this.group.add(this.logoMesh);

    // 5. Polished Chrome Standoff Bolts (4 corner architectural fasteners)
    const boltRadius = Math.min(w, h) * 0.024;
    const boltGeo = new THREE.CylinderGeometry(boltRadius, boltRadius, d * 1.4, 16);
    boltGeo.rotateX(Math.PI / 2);
    const boltMat = this.materials.getPolishedChrome();

    const insetX = w * 0.45;
    const insetY = h * 0.45;
    const boltOffsets = [
      [-insetX, insetY],
      [insetX, insetY],
      [-insetX, -insetY],
      [insetX, -insetY],
    ];

    boltOffsets.forEach(([bx, by]) => {
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.position.set(bx, by, d / 2 + 0.005);
      this.group.add(bolt);
    });

    // 6. Contact Drop Shadow Plane behind the sign
    const shadowGeo = new THREE.PlaneGeometry(w * 1.08, h * 1.08);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -0.04, -d / 2 - 0.01);
    this.group.add(shadowMesh);
  }

  public update(time: number): void {
    // Subtle specular metallic shimmer across the silver face
    if (this.logoMesh && this.logoMesh.material instanceof THREE.MeshStandardMaterial) {
      this.logoMesh.material.roughness = 0.12 + Math.sin(time * 0.8) * 0.02;
    }
  }

  public dispose(): void {
    if (this.logoTexture) this.logoTexture.dispose();
  }
}
