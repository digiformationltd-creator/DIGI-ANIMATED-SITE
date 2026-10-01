import * as THREE from "three";

export class LightingRig {
  private ambientLight: THREE.AmbientLight;
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;
  private screenBounceLight: THREE.PointLight;

  constructor(scene: THREE.Scene) {
    // 1. Ambient environmental tone (Deep Slate / Indigo)
    this.ambientLight = new THREE.AmbientLight(0x1a202c, 0.85);
    scene.add(this.ambientLight);

    // 2. Primary directional key light (Soft warm executive studio key)
    this.keyLight = new THREE.DirectionalLight(0xf1f5f9, 2.2);
    this.keyLight.position.set(4, 7, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -4;
    this.keyLight.shadow.camera.right = 4;
    this.keyLight.shadow.camera.top = 4;
    this.keyLight.shadow.camera.bottom = -4;
    this.keyLight.shadow.bias = -0.0003;
    this.keyLight.shadow.radius = 2.5; // Soft cinematic penumbra
    scene.add(this.keyLight);

    // 3. Controlled fill light (Cool steel tint)
    this.fillLight = new THREE.DirectionalLight(0x94a3b8, 0.9);
    this.fillLight.position.set(-5, 4, 3);
    scene.add(this.fillLight);

    // 4. Sharp specular rim light (Outlines silhouettes and hardware edges)
    this.rimLight = new THREE.DirectionalLight(0xdbeafe, 1.8);
    this.rimLight.position.set(0, 5, -5);
    scene.add(this.rimLight);

    // 5. Emissive monitor bounce light (Illuminates desk and keyboard from screen)
    this.screenBounceLight = new THREE.PointLight(0xdce7f5, 1.5, 3.5, 1.8);
    this.screenBounceLight.position.set(0, 1.3, 0.2);
    scene.add(this.screenBounceLight);
  }

  public setScreenIntensity(intensity: number): void {
    this.screenBounceLight.intensity = intensity;
  }

  // Smooth cinematic illumination curve starting from near-darkness
  public setAtmosphere(progress: number): void {
    // Reveal curve: 0.0 is near-darkness (0.15), fades up to full brilliance by 0.35
    const reveal = Math.min(1, Math.max(0, (progress - 0.02) / 0.33));
    const smoothReveal = reveal * reveal * (3 - 2 * reveal);

    this.ambientLight.intensity = 0.18 + smoothReveal * 0.72;
    this.keyLight.intensity = 0.35 + smoothReveal * 1.95;
    this.fillLight.intensity = 0.15 + smoothReveal * 0.85;
    this.rimLight.intensity = 0.25 + smoothReveal * 1.65;

    // Screen emissive bounce intensifies as camera approaches display
    const screenFocus = Math.min(1, Math.max(0, (progress - 0.2) / 0.8));
    this.screenBounceLight.intensity = 0.3 + screenFocus * 2.2;
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
    scene.remove(this.screenBounceLight);
  }
}
