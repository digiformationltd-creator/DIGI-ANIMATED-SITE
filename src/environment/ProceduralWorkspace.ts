import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";

export class ProceduralWorkspace {
  private materials = MaterialFactory.getInstance();
  private group: THREE.Group = new THREE.Group();

  constructor() {
    this.buildWorkspace();
  }

  private buildWorkspace(): void {
    // 1. Studio Floor (Dark Polished Slate Tile)
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      roughness: 0.45,
      metalness: 0.25,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    this.group.add(floorMesh);

    // 2. Executive Cantilever Desk (Width 2.2m, Depth 1.0m, Height 0.74m)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 0);

    // Desktop surface
    const deskTopGeo = new THREE.BoxGeometry(2.2, 0.05, 1.0);
    const deskTopMesh = new THREE.Mesh(deskTopGeo, this.materials.getDarkWalnutWood());
    deskTopMesh.position.set(0, 0.74, 0);
    deskTopMesh.castShadow = true;
    deskTopMesh.receiveShadow = true;
    deskGroup.add(deskTopMesh);

    // Brushed steel perimeter bevel trim
    const trimGeo = new THREE.BoxGeometry(2.22, 0.02, 1.02);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.getBrushedTitanium());
    trimMesh.position.set(0, 0.73, 0);
    deskGroup.add(trimMesh);

    // Desk Legs (Matte Black steel cantilever trestles)
    const legGeo = new THREE.BoxGeometry(0.06, 0.72, 0.88);
    const legMat = this.materials.getMatteBlackMetal();

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.95, 0.36, 0);
    leftLeg.castShadow = true;
    deskGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.95, 0.36, 0);
    rightLeg.castShadow = true;
    deskGroup.add(rightLeg);

    // Leather desk mat runner
    const padGeo = new THREE.BoxGeometry(1.2, 0.004, 0.55);
    const padMesh = new THREE.Mesh(padGeo, this.materials.getLeatherDeskMat());
    padMesh.position.set(0, 0.767, 0.05);
    padMesh.receiveShadow = true;
    deskGroup.add(padMesh);

    // Aluminum Monitor Stand (Weighted base & vertical riser column)
    const standMat = this.materials.getAnodizedAluminum();
    const standBaseGeo = new THREE.BoxGeometry(0.26, 0.008, 0.22);
    const standBase = new THREE.Mesh(standBaseGeo, standMat);
    standBase.position.set(0, 0.771, -0.08);
    standBase.castShadow = true;
    standBase.receiveShadow = true;
    deskGroup.add(standBase);

    const standRiserGeo = new THREE.BoxGeometry(0.065, 0.34, 0.035);
    const standRiser = new THREE.Mesh(standRiserGeo, standMat);
    standRiser.position.set(0, 0.935, -0.10);
    standRiser.castShadow = true;
    deskGroup.add(standRiser);

    // Slim Aluminum Wireless Keyboard
    const kbGeo = new THREE.BoxGeometry(0.36, 0.008, 0.12);
    const kb = new THREE.Mesh(kbGeo, standMat);
    kb.position.set(-0.04, 0.773, 0.18);
    kb.castShadow = true;
    kb.receiveShadow = true;
    deskGroup.add(kb);

    // Precision Glass Magic Trackpad
    const tpGeo = new THREE.BoxGeometry(0.12, 0.006, 0.11);
    const tpMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.3,
    });
    const tp = new THREE.Mesh(tpGeo, tpMat);
    tp.position.set(0.24, 0.772, 0.18);
    tp.castShadow = true;
    tp.receiveShadow = true;
    deskGroup.add(tp);

    this.group.add(deskGroup);

    // 3. Architectural Penthouse Window & London Twilight Backdrop
    const backdropGeo = new THREE.PlaneGeometry(14, 8);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Twilight gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#080c16");
    grad.addColorStop(0.6, "#131a2a");
    grad.addColorStop(0.95, "#252f44");
    grad.addColorStop(1, "#1e2638");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Distant London skyline silhouette & bokeh lights
    ctx.fillStyle = "#0c101c";
    for (let i = 0; i < 40; i++) {
      const bw = 15 + Math.random() * 35;
      const bh = 40 + Math.random() * 180;
      const bx = i * 26;
      ctx.fillRect(bx, 512 - bh, bw, bh);

      // Random window lights
      ctx.fillStyle = "rgba(255, 230, 180, 0.6)";
      for (let w = 0; w < 6; w++) {
        if (Math.random() > 0.4) {
          ctx.fillRect(bx + 4 + (w % 3) * 6, 512 - bh + 10 + Math.floor(w / 3) * 12, 3, 4);
        }
      }
      ctx.fillStyle = "#0c101c";
    }

    const backdropTexture = new THREE.CanvasTexture(canvas);
    const backdropMat = new THREE.MeshBasicMaterial({ map: backdropTexture });
    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.set(0, 4, -4.5);
    this.group.add(backdropMesh);

    // Architectural Mullions (Window frame columns)
    const frameMat = this.materials.getMatteBlackMetal();
    for (let x = -6; x <= 6; x += 3) {
      const mullionGeo = new THREE.BoxGeometry(0.08, 8, 0.12);
      const mullionMesh = new THREE.Mesh(mullionGeo, frameMat);
      mullionMesh.position.set(x, 4, -4.4);
      this.group.add(mullionMesh);
    }
  }

  public getGroup(): THREE.Group {
    return this.group;
  }
}
