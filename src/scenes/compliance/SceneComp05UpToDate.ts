import * as THREE from "three";
import { CinematicScene, TelemetryData, SceneTransition } from "../../types/cinema";
import { MaterialFactory } from "../../core/MaterialFactory";

export class SceneComp05UpToDate implements CinematicScene {
  public id = "scene-comp-05-uptodate";
  public title = "Company Compliance Up To Date";
  public label = "05 UP TO DATE";
  public kicker = "05 · FULL STATUTORY GOOD STANDING";
  public description = "All statutory filings completed. Vance Technologies Ltd is in verified Good Standing on the UK Companies House register with zero penalty exposure.";
  public statutoryNote = "Company No. 16994903 · Fully Compliant · Next Review: 12 Months";
  public metricBadge = "COMPANY COMPLIANCE: UP TO DATE";
  public startProgress = 0.8;
  public endProgress = 1.0;

  public transition: SceneTransition = { type: "MATCH_CUT", duration: 0.15 };
  public telemetry: TelemetryData = {
    reelId: "REEL-COMP-05-UPTODATE",
    reelNumber: "05 / 05",
    chapterTitle: "COMPLIANCE UP TO DATE",
    shutterSpeed: "1/48s",
    aperture: "T1.4",
    focalLength: "24mm Master Prime",
    iso: 400,
    timecode: "00:05:00:00",
    fps: 24,
    aspectRatio: "2.39:1 Anamorphic",
    statutoryStep: "STEP 5: GOOD STANDING CONFIRMED",
  };

  public cameraWaypoints = {
    start: {
      position: [0.0, 1.25, 1.2] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 36,
    },
    end: {
      position: [0.0, 1.75, 2.6] as [number, number, number],
      target: [0.0, 0.95, 0.0] as [number, number, number],
      fov: 46,
    },
  };

  private sceneGroup: THREE.Group = new THREE.Group();
  private canvas: HTMLCanvasElement;
  private canvasTexture: THREE.CanvasTexture;
  private ctaMesh: THREE.Mesh | null = null;
  private materials = MaterialFactory.getInstance();

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2048;
    this.canvas.height = 1280;
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;
    this.renderCanvas();
  }

  public setup(threeScene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const tableGeo = new THREE.BoxGeometry(2.1, 0.04, 1.1);
    const tableMat = this.materials.getDarkWalnutWood();
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.75, 0);
    this.sceneGroup.add(table);

    // Green Gold Seal
    const sealGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 32);
    const sealMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9, roughness: 0.2 });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.set(-0.25, 0.775, 0.15);
    seal.rotation.x = THREE.MathUtils.degToRad(10);
    this.sceneGroup.add(seal);

    const ctaGeo = new THREE.PlaneGeometry(1.4, 0.88);
    const ctaMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      emissive: 0xffffff,
      emissiveMap: this.canvasTexture,
      emissiveIntensity: 0.92,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.ctaMesh = new THREE.Mesh(ctaGeo, ctaMat);
    this.ctaMesh.position.set(0, 1.25, -0.2);
    this.sceneGroup.add(this.ctaMesh);

    threeScene.add(this.sceneGroup);
    this.sceneGroup.visible = false;
  }

  private renderCanvas(): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark titanium backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#081210");
    grad.addColorStop(1, "#020605");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top Header Badge
    ctx.fillStyle = "#064e3b";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 260, 48, 520, 44, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText("DIGIFORMATION · COMPANY COMPLIANCE", w / 2, 75);

    // Title Headline
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 52px sans-serif";
    ctx.fillText("COMPLIANCE UP TO DATE", w / 2, 175);

    ctx.fillStyle = "#a7f3d0";
    ctx.font = "20px sans-serif";
    ctx.fillText("Vance Technologies Ltd (No. 16994903) · Status: Active in Good Standing", w / 2, 215);

    // 4 Badges
    const cols = [
      { num: "01", title: "CONFIRMATION (CS01)", sub: "Companies House", tag: "SUBMITTED & PAID", color: "#34d399" },
      { num: "02", title: "OFFICE ADDRESS (AD01)", sub: "Covent Garden, London", tag: "RECORDED LIVE", color: "#38bdf8" },
      { num: "03", title: "AUTH CODE VAULT", sub: "WebFiling Connected", tag: "ACTIVE 7K9B2X", color: "#a855f7" },
      { num: "04", title: "ZERO PENALTIES", sub: "Late Filing Risk", tag: "0.00 GBP DUE", color: "#10b981" },
    ];

    const boxW = 430;
    const startX = (w - (4 * boxW + 3 * 28)) / 2;
    const cardY = 270;

    cols.forEach((col, idx) => {
      const cx = startX + idx * (boxW + 28);
      ctx.fillStyle = "rgba(6, 78, 59, 0.4)";
      ctx.beginPath();
      ctx.roundRect(cx, cardY, boxW, 200, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
      ctx.stroke();

      ctx.fillStyle = col.color;
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "left";
      ctx.fillText(col.num, cx + 24, cardY + 38);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(col.title, cx + 24, cardY + 76);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText(col.sub, cx + 24, cardY + 110);

      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.roundRect(cx + 24, cardY + 138, 170, 32, 8);
      ctx.fill();

      ctx.fillStyle = col.color;
      ctx.font = "bold 12px monospace";
      ctx.fillText(`✓ ${col.tag}`, cx + 38, cardY + 159);
    });

    // 3 Compliance Plans
    const tierY = 520;
    const tierW = 590;
    const tierStartX = (w - (3 * tierW + 2 * 32)) / 2;

    const tiers = [
      { name: "CONFIRMATION STATEMENT", price: "£69", fee: "per filing", feat: ["Companies House CS01 submission", "Statutory £34 filing fee included", "Directors & PSC register check", "Digital confirmation certificate"] },
      { name: "ANNUAL STATUTORY SHIELD", price: "£199", fee: "/ year", feat: ["Confirmation statement (CS01)", "Dormant / Micro Accounts", "Registered office address service", "Automated deadline protection"], highlighted: true },
      { name: "TOTAL CORPORATE SECRETARY", price: "£349", fee: "/ year", feat: ["All Statutory Shield services", "Form AD01 & AP01 officer changes", "HMRC CT600 Corporate Tax return", "Dedicated UK corporate secretary"] },
    ];

    tiers.forEach((tier, idx) => {
      const tx = tierStartX + idx * (tierW + 32);
      ctx.fillStyle = tier.highlighted ? "rgba(6, 78, 59, 0.7)" : "rgba(15, 23, 42, 0.75)";
      ctx.beginPath();
      ctx.roundRect(tx, tierY, tierW, 370, 16);
      ctx.fill();
      ctx.strokeStyle = tier.highlighted ? "#34d399" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = tier.highlighted ? 2 : 1;
      ctx.stroke();

      if (tier.highlighted) {
        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.roundRect(tx + tierW - 140, tierY - 14, 120, 26, 13);
        ctx.fill();
        ctx.fillStyle = "#022c22";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("RECOMMENDED", tx + tierW - 80, tierY + 4);
      }

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "left";
      ctx.fillText(tier.name, tx + 32, tierY + 46);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 48px sans-serif";
      ctx.fillText(tier.price, tx + 32, tierY + 104);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText(tier.fee, tx + 160, tierY + 98);

      tier.feat.forEach((f, fIdx) => {
        const fy = tierY + 155 + fIdx * 42;
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("✓", tx + 32, fy);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "15px sans-serif";
        ctx.fillText(f, tx + 60, fy);
      });
    });

    // Bottom Cross-Service CTA
    const botY = 940;
    ctx.fillStyle = "rgba(6, 78, 59, 0.5)";
    ctx.beginPath();
    ctx.roundRect(140, botY, w - 280, 200, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NEXT CHAPTER: BUILD YOUR DIGITAL BUSINESS ONLINE", w / 2, botY + 65);

    ctx.fillStyle = "#a7f3d0";
    ctx.font = "18px sans-serif";
    ctx.fillText("Now that your compliance is fully secured, empower your venture with custom digital architecture.", w / 2, botY + 110);

    const btnW = 340;
    const btnY = botY + 140;

    // Button 1: WhatsApp Support
    ctx.fillStyle = "#25d366";
    ctx.beginPath();
    ctx.roundRect(w / 2 - btnW - 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("WHATSAPP COMPLIANCE TEAM", w / 2 - btnW / 2 - 20, btnY + 29);

    // Button 2: Next Film
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(w / 2 + 20, btnY, btnW, 46, 23);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("ENTER DIGITAL BUILD FILM →", w / 2 + btnW / 2 + 20, btnY + 29);

    this.canvasTexture.needsUpdate = true;
  }

  public enter(): void { this.sceneGroup.visible = true; }
  public exit(): void { this.sceneGroup.visible = false; }
  public update(sceneProgress: number, globalProgress: number, delta: number): void {
    if (this.ctaMesh) {
      this.ctaMesh.position.y = 1.25 + Math.sin(Date.now() * 0.001) * 0.015;
    }
  }
  public cleanup(threeScene: THREE.Scene): void {
    threeScene.remove(this.sceneGroup);
    this.canvasTexture.dispose();
  }
}
