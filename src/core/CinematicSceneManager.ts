import * as THREE from "three";
import { CinematicScene } from "../types/cinema";
import { CinematicCameraController } from "./CinematicCameraController";
import { AudioAtmosphereEngine } from "./AudioAtmosphereEngine";

export class CinematicSceneManager {
  private scenes: CinematicScene[] = [];
  private activeSceneIndex: number = 0;
  private cameraController: CinematicCameraController;
  private threeScene: THREE.Scene;
  private lastMilestoneIndex: number = -1;

  constructor(threeScene: THREE.Scene, cameraController: CinematicCameraController) {
    this.threeScene = threeScene;
    this.cameraController = cameraController;
  }

  public registerScene(scene: CinematicScene): void {
    const isFirst = this.scenes.length === 0;
    this.scenes.push(scene);
    scene.setup(this.threeScene, this.cameraController.getCamera());
    if (isFirst) {
      scene.enter();
    } else {
      scene.exit();
    }
  }

  public update(progress: number, delta: number): void {
    if (this.scenes.length === 0) return;

    // Find the active scene for current progress
    let newActiveIndex = 0;
    for (let i = 0; i < this.scenes.length; i++) {
      const s = this.scenes[i];
      if (progress >= s.startProgress && progress <= s.endProgress) {
        newActiveIndex = i;
        break;
      }
      if (progress > s.endProgress) {
        newActiveIndex = i;
      }
    }

    // Trigger enter/exit lifecycle and audio shutter click
    if (newActiveIndex !== this.activeSceneIndex) {
      this.activeSceneIndex = newActiveIndex;
      if (this.lastMilestoneIndex !== newActiveIndex) {
        this.lastMilestoneIndex = newActiveIndex;
        AudioAtmosphereEngine.getInstance().playShutterClick();
      }
    }

    // Strictly enforce visibility: active scene visible, others hidden
    for (let i = 0; i < this.scenes.length; i++) {
      if (i === this.activeSceneIndex) {
        this.scenes[i].enter();
      } else {
        this.scenes[i].exit();
      }
    }

    const currentScene = this.scenes[this.activeSceneIndex];
    if (currentScene) {
      // Calculate local progress inside the scene range (0.0 -> 1.0)
      const range = currentScene.endProgress - currentScene.startProgress;
      const local = range > 0 ? (progress - currentScene.startProgress) / range : 0;
      const clampedLocal = Math.max(0, Math.min(1, local));

      // Update camera waypoint or curved spline interpolation
      if ("updateCamera" in currentScene && typeof (currentScene as any).updateCamera === "function") {
        (currentScene as any).updateCamera(this.cameraController, clampedLocal);
      } else {
        this.cameraController.setWaypoints(
          currentScene.cameraWaypoints.start,
          currentScene.cameraWaypoints.end,
          clampedLocal
        );
      }

      // Update scene-specific objects
      currentScene.update(clampedLocal, progress, delta);
    }
  }

  public getActiveScene(): CinematicScene | null {
    return this.scenes[this.activeSceneIndex] || null;
  }

  public getScenes(): CinematicScene[] {
    return this.scenes;
  }

  public clearScenes(): void {
    for (const scene of this.scenes) {
      scene.exit();
      scene.cleanup(this.threeScene);
    }
    this.scenes = [];
    this.activeSceneIndex = 0;
    this.lastMilestoneIndex = -1;
  }

  public dispose(): void {
    for (const scene of this.scenes) {
      scene.cleanup(this.threeScene);
    }
    this.scenes = [];
  }
}
