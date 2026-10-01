import * as THREE from "three";
import { CameraKeyframe } from "../types/cinema";

export class CinematicCameraController {
  private camera: THREE.PerspectiveCamera;
  private currentPos: THREE.Vector3 = new THREE.Vector3();
  private currentTarget: THREE.Vector3 = new THREE.Vector3();
  private targetPos: THREE.Vector3 = new THREE.Vector3();
  private targetLookAt: THREE.Vector3 = new THREE.Vector3();
  private baseFov: number = 38;
  private currentFov: number = 38;
  private isMobile: boolean = false;
  private time: number = 0;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.checkMobile();
    this.updateFov();
  }

  public checkMobile(): void {
    if (typeof window !== "undefined") {
      this.isMobile = window.innerWidth < 768;
      this.updateFov();
    }
  }

  private updateFov(): void {
    // Adaptive FOV: Wider on mobile portrait to ensure objects never clip at edges
    const targetFov = this.isMobile ? this.baseFov + 14 : this.baseFov;
    this.camera.fov = targetFov;
    this.camera.updateProjectionMatrix();
  }

  public setSplinePose(
    position: [number, number, number],
    target: [number, number, number],
    fov: number
  ): void {
    this.targetPos.set(position[0], position[1], position[2]);
    this.targetLookAt.set(target[0], target[1], target[2]);
    this.baseFov = fov;
    this.currentFov = this.isMobile ? fov + 14 : fov;
  }

  public setWaypoints(
    start: CameraKeyframe,
    end: CameraKeyframe,
    localProgress: number,
    ease: boolean = true
  ): void {
    // Cinematic cubic smoothstep easing
    const t = ease ? this.smoothstep(Math.max(0, Math.min(1, localProgress))) : localProgress;

    // Interpolate camera position
    this.targetPos.set(
      start.position[0] + (end.position[0] - start.position[0]) * t,
      start.position[1] + (end.position[1] - start.position[1]) * t,
      start.position[2] + (end.position[2] - start.position[2]) * t
    );

    // Interpolate lookAt target
    this.targetLookAt.set(
      start.target[0] + (end.target[0] - start.target[0]) * t,
      start.target[1] + (end.target[1] - start.target[1]) * t,
      start.target[2] + (end.target[2] - start.target[2]) * t
    );

    // Interpolate FOV
    const keyframeFov = start.fov + (end.fov - start.fov) * t;
    this.baseFov = keyframeFov;
    this.currentFov = this.isMobile ? keyframeFov + 14 : keyframeFov;
  }

  public update(delta: number): void {
    this.time += delta;

    // Organic handheld micro-drift (subtle physical cinema camera breathing)
    const driftX = Math.sin(this.time * 0.8) * 0.003;
    const driftY = Math.cos(this.time * 0.6) * 0.003;
    const driftZ = Math.sin(this.time * 1.1) * 0.002;

    // Heavy camera crane lerp (damping ratio)
    this.currentPos.lerp(
      new THREE.Vector3(
        this.targetPos.x + driftX,
        this.targetPos.y + driftY,
        this.targetPos.z + driftZ
      ),
      0.14
    );

    this.currentTarget.lerp(this.targetLookAt, 0.14);

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);

    if (Math.abs(this.camera.fov - this.currentFov) > 0.1) {
      this.camera.fov += (this.currentFov - this.camera.fov) * 0.1;
      this.camera.updateProjectionMatrix();
    }
  }

  public resize(width: number, height: number): void {
    this.checkMobile();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private smoothstep(x: number): number {
    return x * x * (3 - 2 * x);
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getPosition(): THREE.Vector3 {
    return this.camera.position;
  }

  public getTarget(): THREE.Vector3 {
    return this.currentTarget;
  }
}
