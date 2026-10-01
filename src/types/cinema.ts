import * as THREE from "three";

export type QualityTier = "HIGH" | "MEDIUM" | "LOW";

export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  roll?: number;
}

export interface TelemetryData {
  reelId: string;
  reelNumber: string;
  chapterTitle: string;
  shutterSpeed: string;
  aperture: string;
  focalLength: string;
  iso: number;
  timecode: string;
  fps: number;
  aspectRatio: string;
  statutoryStep: string;
}

export interface SceneTransition {
  type: "PHYSICAL" | "SCREEN" | "ENVIRONMENTAL" | "OBJECT" | "LIGHT" | "MATCH_CUT" | "DEPTH";
  duration: number; // In normalized scroll range
}

export interface CinematicScene {
  id: string;
  title: string;
  label: string;
  kicker: string;
  description: string;
  statutoryNote: string;
  metricBadge?: string;
  startProgress: number;
  endProgress: number;
  transition: SceneTransition;
  telemetry: TelemetryData;

  setup(scene: THREE.Scene, camera: THREE.PerspectiveCamera): Promise<void> | void;
  enter(): void;
  update(sceneProgress: number, globalProgress: number, delta: number): void;
  exit(): void;
  cleanup(scene: THREE.Scene): void;

  cameraWaypoints: {
    start: CameraKeyframe;
    end: CameraKeyframe;
  };
}

export interface TimelineState {
  progress: number;        // Normalized 0.0 -> 1.0 (actual target)
  smoothProgress: number;  // Damped / interpolated progress
  activeSceneIndex: number;
  velocity: number;
  direction: "down" | "up" | "idle";
  isScrubbing: boolean;
}
