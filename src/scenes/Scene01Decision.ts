import * as THREE from "three";
import { CinematicScene, CameraKeyframe, TelemetryData, SceneTransition } from "../types/cinema";
import { ProceduralWorkspace } from "../environment/ProceduralWorkspace";
import { HardwarePrimitives } from "../environment/HardwarePrimitives";
import { ScreenSurface } from "../environment/ScreenSurface";
import { CinematicCameraController } from "../core/CinematicCameraController";

export class Scene01Decision implements CinematicScene {
  public id = "scene-01-decision";
  public title = "The Decision";
  public label = "The Decision";
  public kicker = "01 · INITIATION & DISCOVERY";
  public description = "In the stillness of an executive London workspace, an international entrepreneur researches how to establish his UK corporate entity. Navigating through the statutory landscape, he discovers DigiFormation — and takes the decisive first step.";
  public statutoryNote = "England & Wales Jurisdiction · Companies Act 2006 · ECCT Act 2023 Ready";
  public metricBadge = "JURISDICTION · GB-LTD";
  public startProgress = 0.0;
  public endProgress = 0.10;

  public transition: SceneTransition = {
    type: "SCREEN",
    duration: 0.18,
  };

  public telemetry: TelemetryData = {
    reelId: "REEL-01-DECISION",
    reelNumber: "01 / 10",
    chapterTitle: "THE DECISION",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "50mm Master Prime",
    iso: 800,
    timecode: "00:01:12:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 1: CORPORATE SELECTION",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 2.25, 4.2] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 46,
    },
    end: {
      position: [0.0, 0.965, 0.18] as [number, number, number],
      target: [0.0, 0.965, -0.10] as [number, number, number],
      fov: 22,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private workspace: ProceduralWorkspace | null = null;
  private hardware: HardwarePrimitives = new HardwarePrimitives();
  private screenSurface: ScreenSurface | null = null;
  private laptopGroup: THREE.Group | null = null;
  private phoneGroup: THREE.Group | null = null;
  private notebookGroup: THREE.Group | null = null;

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    // 1. Screen Surface with 3-phase dynamic rendering (Research -> Discovery -> Selection)
    this.screenSurface = new ScreenSurface({
      width: 0.38,
      height: 0.238,
      resolution: [1920, 1200],
    });

    // 3. Precision MacBook Pro hardware
    this.laptopGroup = this.hardware.createLaptop(this.screenSurface);
    this.laptopGroup.position.set(0, 0.775, -0.05);
    this.sceneGroup.add(this.laptopGroup);

    // 4. Smartphone beside laptop (subtle angled placement)
    this.phoneGroup = this.hardware.createSmartphone();
    this.phoneGroup.position.set(0.38, 0.775, 0.08);
    this.phoneGroup.rotation.y = THREE.MathUtils.degToRad(-15);
    this.sceneGroup.add(this.phoneGroup);

    // 5. Ceramic Studio Coffee Cup
    const cup = this.hardware.createCoffeeCup();
    cup.position.set(-0.42, 0.775, -0.08);
    this.sceneGroup.add(cup);

    // 6. Leather Notebook & Pen on left desk side
    this.notebookGroup = this.createNotebook();
    this.notebookGroup.position.set(-0.38, 0.775, 0.12);
    this.notebookGroup.rotation.y = THREE.MathUtils.degToRad(12);
    this.sceneGroup.add(this.notebookGroup);

    threeScene.add(this.sceneGroup);
  }

  // Multi-point curved camera trajectory preventing character/chair obstruction
  public updateCamera(cameraController: CinematicCameraController, progress: number): void {
    const p = Math.max(0, Math.min(1, progress));

    // Smooth forward camera glide from wide penthouse office into laptop screen
    const t = this.smoothstep(p);
    const camX = 0.0;
    const camY = 1.65 + (0.965 - 1.65) * t;
    const camZ = 2.8 + (0.22 - 2.8) * t;

    const targetX = 0.0;
    const targetY = 0.95 + (0.965 - 0.95) * t;
    const targetZ = 0.0 + (-0.08 - 0.0) * t;

    const fov = 46 + (22 - 46) * t;

    cameraController.setSplinePose([camX, camY, camZ], [targetX, targetY, targetZ], fov);
  }

  private smoothstep(x: number): number {
    return x * x * (3 - 2 * x);
  }

  // Create subtle leather notebook and executive fountain pen
  private createNotebook(): THREE.Group {
    const group = new THREE.Group();
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x1a1c22, roughness: 0.7 });
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xefede8, roughness: 0.85 });
    const penMat = new THREE.MeshStandardMaterial({ color: 0xc4c7cc, metalness: 0.95, roughness: 0.15 });

    const bookGeo = new THREE.BoxGeometry(0.14, 0.012, 0.21);
    const book = new THREE.Mesh(bookGeo, coverMat);
    book.castShadow = true;
    group.add(book);

    const pagesGeo = new THREE.BoxGeometry(0.136, 0.01, 0.206);
    const pages = new THREE.Mesh(pagesGeo, paperMat);
    pages.position.set(0.002, 0, 0);
    group.add(pages);

    const penGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.14, 16);
    const pen = new THREE.Mesh(penGeo, penMat);
    pen.rotation.x = Math.PI / 2;
    pen.position.set(0.09, 0.004, 0);
    pen.castShadow = true;
    group.add(pen);

    return group;
  }

  public enter(): void {
    this.sceneGroup.visible = true;
  }

  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    // 1. Update Dynamic Screen Surface content (Research -> DigiFormation -> UK LTD Selection)
    if (this.screenSurface) {
      this.screenSurface.renderByProgress(sceneProgress);

      // Emissive backlight increases as camera gets closer
      const emissive = 0.55 + sceneProgress * 0.55;
      this.screenSurface.setEmissiveIntensity(emissive);
    }

    // 3. Dynamic Narrative & Telemetry update
    if (sceneProgress < 0.35) {
      this.kicker = "01 · INITIATION & MARKET RESEARCH";
      this.description = "In an executive London workspace, a founder evaluates the requirements for establishing a UK corporate entity. The search begins with statutory compliance.";
      this.telemetry.statutoryStep = "STEP 1: CORPORATE RESEARCH";
    } else if (sceneProgress < 0.70) {
      this.kicker = "01 · DIGIFORMATION DISCOVERY";
      this.description = "Arriving at DigiFormation.co.uk. Official Companies House registration, London registered office, and complete statutory banking rails presented with clarity.";
      this.telemetry.statutoryStep = "STEP 2: PLATFORM ARRIVAL";
    } else {
      this.kicker = "01 · UK LTD FORMATION INITIATED";
      this.description = "Decision made. The founder selects UK LTD Formation. The corporate journey transitions from physical workspace into the live incorporation pipeline.";
      this.telemetry.statutoryStep = "STEP 3: FORMATION SELECTED";
    }
  }

  public exit(): void {
    this.sceneGroup.visible = false;
  }

  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    if (this.screenSurface) {
      this.screenSurface.dispose();
    }
  }
}
