import * as THREE from "three";

/**
 * JupiterParticleSphere
 * Authentic mathematical particle sphere recreated directly from DIGI BIZ OS (JupiterGlobe.tsx):
 * - 2,200 Fibonacci golden-spiral particles arranged on a sphere
 * - Tilted planetary axis (-0.28 rad) with continuous rotation
 * - Depth-faded luminous cyan/teal particles (#2fe0c8 / #00f2fe) with soft core aura
 */
export class JupiterParticleSphere {
  private group: THREE.Group = new THREE.Group();
  private pointsMesh: THREE.Points;
  private glowSphere: THREE.Mesh;
  private particlePositions: Float32Array;
  private originalPoints: { x: number; y: number; z: number }[] = [];
  private pointCount = 2200;
  private radius: number;

  constructor(radius = 0.55) {
    this.radius = radius;

    // 1. Generate Fibonacci Golden Spiral Points on Sphere
    const golden = Math.PI * (3 - Math.sqrt(5));
    const positions = new Float32Array(this.pointCount * 3);
    const colors = new Float32Array(this.pointCount * 3);

    for (let i = 0; i < this.pointCount; i++) {
      const y = 1 - (i / (this.pointCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;

      const px = Math.cos(theta) * r;
      const py = y;
      const pz = Math.sin(theta) * r;

      this.originalPoints.push({ x: px, y: py, z: pz });

      positions[i * 3] = px * radius;
      positions[i * 3 + 1] = py * radius;
      positions[i * 3 + 2] = pz * radius;

      // Soft teal/cyan/azure depth gradient
      const depth = (py + 1) / 2;
      colors[i * 3] = 0.18 + depth * 0.15;      // R
      colors[i * 3 + 1] = 0.88 + depth * 0.10;  // G
      colors[i * 3 + 2] = 0.82 + depth * 0.18;  // B
    }

    this.particlePositions = positions;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle sprite texture with soft radial falloff
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pCtx = particleCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      grad.addColorStop(0.3, "rgba(47, 224, 200, 0.85)");
      grad.addColorStop(0.7, "rgba(0, 180, 240, 0.35)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const particleTex = new THREE.CanvasTexture(particleCanvas);

    const pointsMat = new THREE.PointsMaterial({
      size: 0.026,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.pointsMesh = new THREE.Points(geometry, pointsMat);
    this.group.add(this.pointsMesh);

    // 2. Soft Internal Core Glow Sphere
    const innerGeo = new THREE.SphereGeometry(radius * 0.82, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x073642,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.glowSphere = new THREE.Mesh(innerGeo, innerMat);
    this.group.add(this.glowSphere);

    // 3. Planetary Orbital Equatorial Ring
    const ringGeo = new THREE.RingGeometry(radius * 1.25, radius * 1.48, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x2fe0c8,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + 0.28;
    this.group.add(ring);

    // Initial axis tilt matching DigiBiz OS
    this.group.rotation.z = -0.28;
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public update(time: number, delta: number): void {
    // Planetary axial spin
    this.pointsMesh.rotation.y += delta * 0.35;
    this.glowSphere.rotation.y -= delta * 0.15;

    // Subtle gentle floating oscillation
    this.group.position.y += Math.sin(time * 1.5) * 0.0006;
  }

  public dispose(): void {
    this.pointsMesh.geometry.dispose();
    if (Array.isArray(this.pointsMesh.material)) {
      this.pointsMesh.material.forEach((m) => m.dispose());
    } else {
      this.pointsMesh.material.dispose();
    }
    this.glowSphere.geometry.dispose();
    (this.glowSphere.material as THREE.Material).dispose();
  }
}
