import * as THREE from "three";

export class LightingRig {
  private ambientLight: THREE.AmbientLight;
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    // 1. Ambient environmental tone (Natural Daylight Sky Blue)
    this.ambientLight = new THREE.AmbientLight(0xdbeafe, 1.25);
    scene.add(this.ambientLight);

    // 2. Primary directional sun key light (Bright Natural Daylight Sun)
    this.keyLight = new THREE.DirectionalLight(0xfffdf0, 2.6);
    this.keyLight.position.set(24, 38, 28);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 120;
    this.keyLight.shadow.camera.left = -30;
    this.keyLight.shadow.camera.right = 30;
    this.keyLight.shadow.camera.top = 30;
    this.keyLight.shadow.camera.bottom = -30;
    this.keyLight.shadow.bias = -0.0003;
    this.keyLight.shadow.radius = 2.0;
    scene.add(this.keyLight);

    // 3. Daylight fill light (Sky bounce)
    this.fillLight = new THREE.DirectionalLight(0x93c5fd, 0.95);
    this.fillLight.position.set(-20, 25, 20);
    scene.add(this.fillLight);

    // 4. Specular sun glint (Metallic luster for silver logo and architectural glass)
    this.rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.rimLight.position.set(10, 20, -25);
    scene.add(this.rimLight);

  // 5. No harsh specular point light / flashlight on screens
  }

  public setScreenIntensity(_intensity: number): void {
    // Disabled to prevent white flashlight hotspot
  }

  // Consistent, bright cinematic daylight
  public setAtmosphere(_progress: number): void {
    this.ambientLight.intensity = 1.2;
    this.keyLight.intensity = 2.5;
    this.fillLight.intensity = 0.9;
    this.rimLight.intensity = 1.6;
  }

  public setQuality(quality: "HIGH" | "MEDIUM" | "LOW"): void {
    if (quality === "LOW") {
      this.keyLight.castShadow = false;
    } else {
      this.keyLight.castShadow = true;
      this.keyLight.shadow.mapSize.width = quality === "HIGH" ? 2048 : 1024;
      this.keyLight.shadow.mapSize.height = quality === "HIGH" ? 2048 : 1024;
    }
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.ambientLight);
    scene.remove(this.keyLight);
    scene.remove(this.fillLight);
    scene.remove(this.rimLight);
  }
}
