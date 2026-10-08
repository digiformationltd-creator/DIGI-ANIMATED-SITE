import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";
import { PhotorealisticLaptop } from "../../environment/PhotorealisticLaptop";

export class SceneOS01VoiceWake implements CinematicScene {
  public id = "scene-os-01-voicewake";
  public title = "Autonomous Voice OS & Multi-Agent Swarm";
  public label = "01 VOICE WAKE";
  public kicker = "05 · DIGI BIZ OS GRAND FINALE";
  public description = "Instant voice orchestration: Speak naturally to command your business. Live autonomous tools, low-latency intent recognition, and multi-agent execution on precision CNC aluminum hardware.";
  public statutoryNote = "Digi Biz OS Engine · Real-Time Voice Orchestration · Sovereign Local Deployment";
  public metricBadge = "VOICE ENGINE: ACTIVE";
  public startProgress = 0.0;
  public endProgress = 0.2;

  public transition: SceneTransition = { type: "PHYSICAL", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-OS-01-VOICE",
    reelNumber: "01 / 05",
    chapterTitle: "VOICE COMMAND INTERFACE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "35mm Prime",
    iso: 350,
    timecode: "00:01:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 1: VOICE WAKE",
  };

  // Camera focuses toward the right half where the 3D laptop is presented, leaving the left side open for narrative text
  public cameraWaypoints = {
    start: {
      position: [0.0, 1.35, 1.85] as [number, number, number],
      target: [0.28, 1.05, 0.0] as [number, number, number],
      fov: 38,
    },
    end: {
      position: [0.0, 1.25, 1.55] as [number, number, number],
      target: [0.28, 1.02, 0.0] as [number, number, number],
      fov: 34,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private laptop: PhotorealisticLaptop;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.laptop = new PhotorealisticLaptop();
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Executive Workstation Table
    const tableGeo = new THREE.BoxGeometry(2.6, 0.045, 1.25);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.74, 0);
    table.castShadow = true;
    table.receiveShadow = true;
    this.sceneGroup.add(table);

    const legMat = this.materials.getMatteBlackMetal();
    const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 1.05), legMat);
    lLeg.position.set(-1.15, 0.36, 0);
    this.sceneGroup.add(lLeg);

    const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 1.05), legMat);
    rLeg.position.set(1.15, 0.36, 0);
    this.sceneGroup.add(rLeg);

    // 2. Photorealistic CNC Aluminum Laptop (Placed on the RIGHT side)
    this.laptop.setBasePosition(0.55, 0.765, 0.08);
    const laptopGroup = this.laptop.getGroup();
    this.sceneGroup.add(laptopGroup);

    // Warm Key Spotlight illuminating laptop on the right side
    const spot = new THREE.SpotLight(0x2fe0c8, 3.2, 7.0, Math.PI / 3.5, 0.4);
    spot.position.set(1.1, 2.5, 1.1);
    spot.target = laptopGroup;
    this.sceneGroup.add(spot);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  public enter(): void { this.sceneGroup.visible = true; }
  public exit(): void { this.sceneGroup.visible = false; }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    const time = Date.now() * 0.001;

    // Update 3D Laptop with cinematic screen cycling
    this.laptop.update(time, sceneProgress);

    // Laptop positioned on the right side, gently angled inward toward center-left
    const turn = -0.22 + (1 - sceneProgress) * 0.12;
    this.laptop.setRotation(0.04, turn, 0);
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.laptop.dispose();
  }
}
