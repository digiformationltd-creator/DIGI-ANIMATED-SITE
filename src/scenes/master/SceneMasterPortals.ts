import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { CinematicCameraController } from "../../core/CinematicCameraController";

/**
 * SceneMasterPortals
 * Ultra-Lightweight Chapter 00 (Nexus Opening) Controller:
 * Zero WebGL overhead - fully powered by the real 50-frame 24 FPS cinema reel
 * (ezgif-1a92572ee0957838-jpg) for maximum photorealism, instant loading, and zero GPU stutter.
 */
export class SceneMasterPortals implements CinematicScene {
  public id = "scene-master-portals";
  public title = "DigiFormation Limited";
  public label = "00 MASTER";
  public kicker = "00 · CORPORATE HEADQUARTERS";
  public description = "Monumental curved glass corporate campus with reflecting waters, architectural concrete grid, and landscaped stone courtyard.";
  public statutoryNote = "Global Headquarters · Sovereign Digital Campus · London";
  public metricBadge = "CAMPUS GROUNDS";
  public startProgress = 0.0;
  public endProgress = 1.0;

  public transition: SceneTransition = {
    type: "PHYSICAL",
    duration: 0.2,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-MASTER-PORTAL",
    reelNumber: "MASTER",
    chapterTitle: "CORPORATE CAMPUS",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "35mm Prime",
    iso: 320,
    timecode: "00:00:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "CAMPUS ARRIVAL",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.85, 3.4] as [number, number, number],
      target: [0.0, 1.05, 0.0] as [number, number, number],
      fov: 42,
    },
    end: {
      position: [0.0, 1.45, 0.28] as [number, number, number],
      target: [0.0, 1.15, -1.8] as [number, number, number],
      fov: 36,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private threeScene: THREE.Scene | null = null;

  constructor() {}

  public setup(threeScene: THREE.Scene, _camera: THREE.PerspectiveCamera): void {
    this.threeScene = threeScene;
    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  public enter(): void {
    this.sceneGroup.visible = false;
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    // Smooth camera waypoints in sync with timeline
    const p = Math.max(0, Math.min(1, progress));
    const camPos: [number, number, number] = [
      0.0,
      THREE.MathUtils.lerp(1.85, 1.45, p),
      THREE.MathUtils.lerp(3.4, 0.28, p),
    ];
    const camTarget: [number, number, number] = [
      0.0,
      THREE.MathUtils.lerp(1.05, 1.15, p),
      THREE.MathUtils.lerp(0.0, -1.8, p),
    ];
    const fov = THREE.MathUtils.lerp(42, 36, p);

    cameraController.setWaypoints(
      { position: camPos, target: camTarget, fov },
      { position: camPos, target: camTarget, fov },
      1.0
    );
  }

  public update(sceneProgress: number, _globalProgress: number, _delta: number): void {
    // Keep Three.js background transparent and WebGL idle
    if (this.threeScene) {
      this.threeScene.background = null;
    }
    this.sceneGroup.visible = false;

    // Dynamic HUD Telemetry & Narrative Synchronization
    if (sceneProgress < 0.22) {
      this.kicker = "00 · CORPORATE HEADQUARTERS";
      this.title = "DigiFormation Campus London";
      this.description = "Monumental curved glass corporate campus with reflecting waters, architectural concrete grid, and landscaped stone courtyard.";
      this.statutoryNote = "Global Headquarters · Sovereign Digital Campus · London";
      this.metricBadge = "CAMPUS GROUNDS";
      this.telemetry.statutoryStep = "CAMPUS ARRIVAL";
      this.telemetry.chapterTitle = "CORPORATE HEADQUARTERS";
      this.telemetry.focalLength = "35mm Prime";
    } else if (sceneProgress < 0.45) {
      this.kicker = "00 · ARCHITECTURAL SIGNAGE";
      this.title = "Machined Silver Steel Identity";
      this.description = "Physical brushed silver architectural insignia mounted with heavy-gauge precision hardware and specular metal luster.";
      this.statutoryNote = "DigiFormation Limited · Registered Trademark & Sovereign Crest";
      this.metricBadge = "SILVER LOGO LOCK";
      this.telemetry.statutoryStep = "LOGO MOMENT";
      this.telemetry.chapterTitle = "EXTERIOR SILVER LOGO";
      this.telemetry.focalLength = "50mm Cine Lens";
    } else if (sceneProgress < 0.65) {
      this.kicker = "00 · BUILDING FACADE";
      this.title = "Executive Suite Window Selection";
      this.description = "Tracking along the architectural glass curtain wall. Targeting the executive operational suite window.";
      this.statutoryNote = "Floor-to-Ceiling Curtain Glass · Acoustic Double-Glazing";
      this.metricBadge = "WINDOW SELECTION";
      this.telemetry.statutoryStep = "FACADE SCAN";
      this.telemetry.chapterTitle = "WINDOW TARGETING";
      this.telemetry.focalLength = "40mm Anamorphic";
    } else if (sceneProgress < 0.80) {
      this.kicker = "00 · OPTICAL TRANSITION";
      this.title = "Crossing Glass Boundary";
      this.description = "Continuous VFX optical pass-through gliding through exterior glass reflections directly into the climate-controlled office.";
      this.statutoryNote = "VFX Optical Threshold · Dissolving Glass Reflection";
      this.metricBadge = "WINDOW ENTRY";
      this.telemetry.statutoryStep = "INTERIOR CROSSING";
      this.telemetry.chapterTitle = "GLASS THRESHOLD";
      this.telemetry.focalLength = "35mm Anamorphic";
    } else if (sceneProgress < 0.92) {
      this.kicker = "00 · EXECUTIVE OFFICE SUITE";
      this.title = "DigiFormation Operational Suite";
      this.description = "Inside the real corporate office. Feature slatted walnut wall with interior silver logo, dual curved displays, and executive workstations.";
      this.statutoryNote = "Physical Interior Silver Signage · Operating Headquarters";
      this.metricBadge = "OFFICE REVEAL";
      this.telemetry.statutoryStep = "OFFICE DISCOVERY";
      this.telemetry.chapterTitle = "EXECUTIVE SUITE";
      this.telemetry.focalLength = "32mm Prime";
    } else {
      this.kicker = "00 · LIVE FORMATION WORKFLOW";
      this.title = "Statutory Order Processing";
      this.description = "Automated statutory gateway active on Companies House and HMRC portal. Select an enterprise pathway below to begin.";
      this.statutoryNote = "5 Sovereign Commercial Pathways · Order In Progress";
      this.metricBadge = "WORKFLOW ACTIVE";
      this.telemetry.statutoryStep = "PORTAL READY";
      this.telemetry.chapterTitle = "SERVICE INITIALIZATION";
      this.telemetry.focalLength = "28mm Anamorphic Wide";
    }
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
  }
}
