import * as THREE from "three";
import { MaterialFactory } from "../core/MaterialFactory";
import { ScreenSurface } from "./ScreenSurface";

export class HardwarePrimitives {
  private materials = MaterialFactory.getInstance();

  // Photorealistic Laptop (MacBook Pro styling)
  public createLaptop(screenSurface: ScreenSurface): THREE.Group {
    const group = new THREE.Group();
    const metalMat = this.materials.getMatteBlackMetal();
    const chromeMat = this.materials.getPolishedChrome();

    // 1. Laptop Base chassis (width 0.42m, depth 0.28m, height 0.012m)
    const baseGeo = new THREE.BoxGeometry(0.42, 0.012, 0.28);
    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 2. Keyboard recess well
    const wellGeo = new THREE.BoxGeometry(0.36, 0.002, 0.14);
    const wellMat = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, roughness: 0.8 });
    const wellMesh = new THREE.Mesh(wellGeo, wellMat);
    wellMesh.position.set(0, 0.0061, -0.02);
    group.add(wellMesh);

    // 3. Trackpad (Precision glass)
    const trackpadGeo = new THREE.BoxGeometry(0.14, 0.001, 0.09);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.22,
      metalness: 0.5,
    });
    const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpadMesh.position.set(0, 0.0062, 0.08);
    group.add(trackpadMesh);

    // 4. Laptop Lid & Screen (angled at ~105 degrees for realistic viewing)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.006, -0.14); // Hinge line

    // Lid chassis
    const lidGeo = new THREE.BoxGeometry(0.42, 0.27, 0.008);
    const lidMesh = new THREE.Mesh(lidGeo, metalMat);
    lidMesh.position.set(0, 0.135, -0.004);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Display bezel
    const bezelGeo = new THREE.BoxGeometry(0.41, 0.26, 0.001);
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x050709, roughness: 0.1 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 0.135, 0.0005);
    lidGroup.add(bezelMesh);

    // Embed the Screen Surface (16:10 aspect ratio: 0.38 x 0.238)
    const screenMesh = screenSurface.getMesh();
    screenMesh.position.set(0, 0.135, 0.0015);
    lidGroup.add(screenMesh);

    // Apple/Logo subtle gloss badge on back lid
    const badgeGeo = new THREE.CircleGeometry(0.015, 32);
    const badgeMesh = new THREE.Mesh(badgeGeo, chromeMat);
    badgeMesh.position.set(0, 0.135, -0.0085);
    badgeMesh.rotation.y = Math.PI;
    lidGroup.add(badgeMesh);

    // Rotate lid back 18 degrees
    lidGroup.rotation.x = THREE.MathUtils.degToRad(-18);
    group.add(lidGroup);

    return group;
  }

  // Modern Ergonomic Smartphone (Titanium frame)
  public createSmartphone(): THREE.Group {
    const group = new THREE.Group();
    const titaniumMat = this.materials.getBrushedTitanium();
    const glassMat = this.materials.getSmokedGlass();

    // Phone chassis (0.076m x 0.16m x 0.008m)
    const bodyGeo = new THREE.BoxGeometry(0.076, 0.008, 0.16);
    const bodyMesh = new THREE.Mesh(bodyGeo, titaniumMat);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Glass display face
    const screenGeo = new THREE.PlaneGeometry(0.072, 0.152);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.05,
      metalness: 0.9,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.rotation.x = -Math.PI / 2;
    screenMesh.position.y = 0.0042;
    group.add(screenMesh);

    return group;
  }

  // Ceramic Studio Coffee Cup
  public createCoffeeCup(): THREE.Group {
    const group = new THREE.Group();
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.2,
      metalness: 0.1,
    });

    const cupGeo = new THREE.CylinderGeometry(0.04, 0.032, 0.09, 32);
    const cupMesh = new THREE.Mesh(cupGeo, ceramicMat);
    cupMesh.position.y = 0.045;
    cupMesh.castShadow = true;
    group.add(cupMesh);

    return group;
  }
}
