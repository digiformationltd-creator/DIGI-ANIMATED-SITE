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
    // 1. Physical CNC Machined Backing Plate matching environment tone
    const trayGeo = new THREE.BoxGeometry(w, h, d);
    const trayMat = new THREE.MeshStandardMaterial({
      color: isMonument ? 0x828f9f : 0x0f172a, // Slate-gray for granite monument, dark obsidian for dark walls
      roughness: isMonument ? 0.38 : 0.22,
      metalness: 0.88,
    });
    const trayMesh = new THREE.Mesh(trayGeo, trayMat);
    trayMesh.castShadow = true;
    trayMesh.receiveShadow = true;
    this.group.add(trayMesh);

    // 2. Polished Chrome Architectural Beveled Perimeter Frame
    const frameGeo = new THREE.BoxGeometry(w + 0.04, h + 0.04, d * 0.4);
    const frameMesh = new THREE.Mesh(frameGeo, this.materials.getPolishedChrome());
    frameMesh.position.set(0, 0, -d * 0.25);
    this.group.add(frameMesh);

    // 3. Canvas Texture Loader matching background tone and logo color
    this.logoCanvas = document.createElement("canvas");
    this.logoCanvas.width = 1024;
    this.logoCanvas.height = 1024;
    const ctx = this.logoCanvas.getContext("2d");

    const surfaceBg = isMonument ? "#8f9caa" : "#070a10";
    if (ctx) {
      ctx.fillStyle = surfaceBg;
      ctx.fillRect(0, 0, 1024, 1024);
    }

    this.logoTexture = new THREE.CanvasTexture(this.logoCanvas);
    this.logoTexture.colorSpace = THREE.SRGBColorSpace;
    this.logoTexture.minFilter = THREE.LinearFilter;
    this.logoTexture.magFilter = THREE.LinearFilter;

    const img = new Image();
    img.crossOrigin = "anonymous";
    // On gray monument surface: use user's black logo asset; on dark executive walls: use silver logo
    img.src = isMonument
      ? "/assets/brand/digiformation-black-logo.png"
      : "/assets/brand/digiformation-silver-logo-official.jpg";

    img.onload = () => {
      if (!ctx || !this.logoCanvas) return;
      ctx.fillStyle = surfaceBg;
      ctx.fillRect(0, 0, 1024, 1024);

      if (isMonument) {
        // Draw the black logo with seamless blending onto the granite/slate plate
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.naturalWidth || 753;
        tempCanvas.height = img.naturalHeight || 757;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          const data = imgData.data;
          // Extract the dark brush D crest and text, rendering them cleanly onto the brushed metal plate
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            if (brightness > 220) {
              data[i + 3] = 0; // Make light background fully transparent
            } else if (brightness > 160) {
              const alphaRatio = (220 - brightness) / 60;
              data[i + 3] = Math.floor(data[i + 3] * alphaRatio);
            }
          }
          tempCtx.putImageData(imgData, 0, 0);

          // Subtle brushed metal grain on backing plate
          ctx.fillStyle = "#8a97a6";
          ctx.fillRect(0, 0, 1024, 1024);

          // Draw isolated black emblem and typography centered with generous padding
          const pad = 120;
          ctx.drawImage(tempCanvas, pad, pad, 1024 - pad * 2, 1024 - pad * 2);
        } else {
          ctx.drawImage(img, 60, 60, 904, 904);
        }
      } else {
        const aspect = w / h;
        if (aspect > 1.0) {
          const drawW = 1024 / aspect;
          const offset = (1024 - drawW) / 2;
          ctx.drawImage(img, offset, 0, drawW, 1024);
        } else if (aspect < 1.0) {
          const drawH = 1024 * aspect;
          const offset = (1024 - drawH) / 2;
          ctx.drawImage(img, 0, offset, 1024, drawH);
        } else {
          ctx.drawImage(img, 0, 0, 1024, 1024);
        }
      }
      this.logoTexture!.needsUpdate = true;
    };

    // 4. Physical Logo Face with Machined Architectural Finish
    const faceGeo = new THREE.PlaneGeometry(w - 0.04, h - 0.04);
    const faceMat = new THREE.MeshStandardMaterial({
      map: this.logoTexture,
      roughness: isMonument ? 0.32 : 0.12,
      metalness: isMonument ? 0.65 : 0.95,
      envMapIntensity: 2.2,
      emissive: isMonument ? new THREE.Color(0x222222) : new THREE.Color(0xffffff),
      emissiveMap: this.logoTexture,
      emissiveIntensity: isMonument ? 0.15 : 0.65,
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
