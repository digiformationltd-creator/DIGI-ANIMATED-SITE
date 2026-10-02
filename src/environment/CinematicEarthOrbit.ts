import * as THREE from "three";

export class CinematicEarthOrbit {
  private group: THREE.Group = new THREE.Group();
  private earthMesh: THREE.Mesh | null = null;
  private cloudMesh: THREE.Mesh | null = null;
  private atmosphereMesh: THREE.Mesh | null = null;
  private targetReticle: THREE.Group = new THREE.Group();
  private starfield: THREE.Points | null = null;
  private sunLight: THREE.DirectionalLight | null = null;
  private canvasTexture: THREE.CanvasTexture | null = null;
  private cloudTexture: THREE.CanvasTexture | null = null;

  constructor() {
    this.buildDeepSpace();
    this.buildEarthGlobe();
    this.buildAtmosphere();
    this.buildLocationReticle();
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  // 1. Deep Space Starfield & Distant Solar Illumination
  private buildDeepSpace(): void {
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 280 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Subtle celestial hues: icy white, soft blue, warm stellar amber
      const tint = Math.random();
      if (tint > 0.8) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1.0;
      } else if (tint > 0.6) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.8;
      } else {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.95;
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.group.add(this.starfield);

    // Distant Solar Key Light
    this.sunLight = new THREE.DirectionalLight(0xfffdf4, 2.4);
    this.sunLight.position.set(120, 80, 160);
    this.group.add(this.sunLight);

    const ambientSpace = new THREE.AmbientLight(0x060d1a, 0.4);
    this.group.add(ambientSpace);
  }

  // 2. Photorealistic High-Altitude Earth Globe
  private buildEarthGlobe(): void {
    const radius = 36;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);

    // Generate high-resolution procedural Earth texture with realistic continents, oceans, and night lights
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Deep Ocean Base
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      oceanGrad.addColorStop(0, "#031024");
      oceanGrad.addColorStop(0.5, "#061b36");
      oceanGrad.addColorStop(1, "#020a17");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Ocean Continental Shelves & Shallow Waters
      ctx.fillStyle = "rgba(14, 116, 144, 0.28)";
      ctx.beginPath();
      ctx.ellipse(1080, 360, 360, 220, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Landmass Formations (Europe, United Kingdom, Atlantic coastline)
      ctx.fillStyle = "#1e293b"; // Rich slate/earth terrain
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 4;

      // Continental Europe & Scandinavia
      ctx.beginPath();
      ctx.moveTo(1020, 220); // Norway
      ctx.lineTo(1100, 240);
      ctx.lineTo(1160, 310); // Baltic
      ctx.lineTo(1180, 420); // Central Europe
      ctx.lineTo(1100, 490); // Mediterranean
      ctx.lineTo(980, 520);  // Iberian peninsula
      ctx.lineTo(990, 430);  // France coastline
      ctx.lineTo(1050, 340); // North Sea coast
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // United Kingdom & London Island Formation (Primary Target)
      ctx.fillStyle = "#166534"; // Verdant UK Isle
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1005, 310); // Scotland
      ctx.lineTo(1025, 335); // England east coast
      ctx.lineTo(1022, 385); // Kent / Dover
      ctx.lineTo(975, 395);  // Cornwall
      ctx.lineTo(985, 355);  // Wales
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ireland
      ctx.beginPath();
      ctx.ellipse(960, 360, 18, 30, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Subtle London Urban Night Lights / Commercial Glow
      const londonX = 1012;
      const londonY = 376;
      const glowGrad = ctx.createRadialGradient(londonX, londonY, 2, londonX, londonY, 32);
      glowGrad.addColorStop(0, "rgba(254, 240, 138, 0.95)");
      glowGrad.addColorStop(0.3, "rgba(234, 179, 8, 0.65)");
      glowGrad.addColorStop(1, "rgba(234, 179, 8, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(londonX, londonY, 32, 0, Math.PI * 2);
      ctx.fill();

      // European Metropolises Grid Glow
      const metroNodes = [
        [1035, 410], // Paris
        [1070, 360], // Amsterdam / Brussels
        [1110, 370], // Berlin
        [1125, 440], // Milan
        [1005, 480], // Madrid
      ];
      metroNodes.forEach(([nx, ny]) => {
        const mg = ctx.createRadialGradient(nx, ny, 1, nx, ny, 16);
        mg.addColorStop(0, "rgba(254, 215, 170, 0.7)");
        mg.addColorStop(1, "rgba(254, 215, 170, 0)");
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    this.canvasTexture = new THREE.CanvasTexture(canvas);
    this.canvasTexture.colorSpace = THREE.SRGBColorSpace;

    const earthMat = new THREE.MeshStandardMaterial({
      map: this.canvasTexture,
      roughness: 0.35,
      metalness: 0.15,
    });

    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    // Align United Kingdom to face the camera trajectory
    this.earthMesh.rotation.y = -Math.PI * 0.42;
    this.earthMesh.rotation.x = 0.28;
    this.earthMesh.position.set(0, -28, -5);
    this.group.add(this.earthMesh);

    // 3. Dynamic Atmospheric Cloud Swirls
    const cloudGeo = new THREE.SphereGeometry(radius + 0.55, 48, 48);
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cCtx = cloudCanvas.getContext("2d");
    if (cCtx) {
      cCtx.fillStyle = "rgba(0, 0, 0, 0)";
      cCtx.fillRect(0, 0, 1024, 512);

      // Natural atmospheric cloud bands & cyclone formations
      cCtx.fillStyle = "rgba(255, 255, 255, 0.55)";
      for (let i = 0; i < 45; i++) {
        const cx = Math.random() * 1024;
        const cy = 100 + Math.random() * 300;
        const rx = 40 + Math.random() * 90;
        const ry = 15 + Math.random() * 35;
        cCtx.beginPath();
        cCtx.ellipse(cx, cy, rx, ry, Math.random() * 0.4, 0, Math.PI * 2);
        cCtx.fill();
      }
    }

    this.cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: this.cloudTexture,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    this.cloudMesh.position.copy(this.earthMesh.position);
    this.cloudMesh.rotation.copy(this.earthMesh.rotation);
    this.group.add(this.cloudMesh);
  }

  // 4. Rayleigh Atmospheric Rim Shader
  private buildAtmosphere(): void {
    const atmoGeo = new THREE.SphereGeometry(37.2, 48, 48);

    const atmoShader = {
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
          fresnel = pow(fresnel, 3.2);
          vec3 atmoColor = vec3(0.22, 0.62, 0.98); // Rayleigh blue limb
          gl_FragColor = vec4(atmoColor, fresnel * 0.72);
        }
      `,
    };

    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: atmoShader.vertexShader,
      fragmentShader: atmoShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    });

    this.atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    this.atmosphereMesh.position.copy(this.earthMesh!.position);
    this.group.add(this.atmosphereMesh);
  }

  // 5. Subtle Cinematic Location Target Ring
  private buildLocationReticle(): void {
    const ringGeo = new THREE.RingGeometry(1.2, 1.35, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    this.targetReticle.add(ring);

    // Crosshairs
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const hPoints = [new THREE.Vector3(-2.2, 0, 0), new THREE.Vector3(2.2, 0, 0)];
    const hGeo = new THREE.BufferGeometry().setFromPoints(hPoints);
    this.targetReticle.add(new THREE.Line(hGeo, lineMat));

    const vPoints = [new THREE.Vector3(0, -2.2, 0), new THREE.Vector3(0, 2.2, 0)];
    const vGeo = new THREE.BufferGeometry().setFromPoints(vPoints);
    this.targetReticle.add(new THREE.Line(vGeo, lineMat));

    // Place at London latitude / longitude coordinate offset
    this.targetReticle.position.set(1.5, 4.2, 29.5);
    this.targetReticle.lookAt(new THREE.Vector3(0, 20, 80));
    this.group.add(this.targetReticle);
  }

  public update(progress: number, delta: number): void {
    // Atmospheric cloud drift
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += delta * 0.015;
    }

    // Reticle subtle pulse
    const time = Date.now() * 0.003;
    const scale = 1.0 + Math.sin(time) * 0.06;
    this.targetReticle.scale.set(scale, scale, 1);

    // Visibility Management: Earth is prominent from 0.0 to 0.28, then fades out smoothly as camera reaches campus
    if (progress <= 0.32) {
      this.group.visible = true;
      const fade = progress < 0.22 ? 1.0 : (0.32 - progress) / 0.10;
      this.group.position.y = -progress * 60;
      this.group.scale.setScalar(1.0 + progress * 2.2);
      
      if (this.earthMesh && this.earthMesh.material instanceof THREE.Material) {
        this.earthMesh.material.opacity = Math.max(0, fade);
        this.earthMesh.material.transparent = true;
      }
    } else {
      this.group.visible = false;
    }
  }

  public dispose(): void {
    if (this.canvasTexture) this.canvasTexture.dispose();
    if (this.cloudTexture) this.cloudTexture.dispose();
  }
}
