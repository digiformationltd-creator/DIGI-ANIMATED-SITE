import * as THREE from "three";

export class MaterialFactory {
  private static instance: MaterialFactory;
  private cache: Map<string, THREE.Material> = new Map();

  private constructor() {}

  public static getInstance(): MaterialFactory {
    if (!MaterialFactory.instance) {
      MaterialFactory.instance = new MaterialFactory();
    }
    return MaterialFactory.instance;
  }

  // Matte Black Anodized Aluminum (MacBook, Monitor Bezel)
  public getMatteBlackMetal(): THREE.MeshStandardMaterial {
    const key = "matteBlackMetal";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x131518),
        roughness: 0.38,
        metalness: 0.85,
        envMapIntensity: 1.2,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Anodized Aluminum (Slate gray)
  public getAnodizedAluminum(): THREE.MeshStandardMaterial {
    const key = "anodizedAluminum";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x282c34),
        roughness: 0.35,
        metalness: 0.88,
        envMapIntensity: 1.3,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Brushed Titanium (Card, Phone chassis, Desk Inlays)
  public getBrushedTitanium(): THREE.MeshStandardMaterial {
    const key = "brushedTitanium";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x7c828c),
        roughness: 0.28,
        metalness: 0.92,
        envMapIntensity: 1.4,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Polished Chrome (Card accents, Hardware fasteners)
  public getPolishedChrome(): THREE.MeshStandardMaterial {
    const key = "polishedChrome";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xe5e7eb),
        roughness: 0.08,
        metalness: 0.98,
        envMapIntensity: 1.8,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Smoked Obsidian Glass (Office partition, desk pedestal)
  public getSmokedGlass(): THREE.MeshPhysicalMaterial {
    const key = "smokedGlass";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x0c0e12),
        transparent: true,
        opacity: 0.88,
        roughness: 0.06,
        metalness: 0.1,
        transmission: 0.75,
        ior: 1.52,
        thickness: 0.6,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshPhysicalMaterial;
  }

  // Dark Walnut Desk Wood (Cantilevered executive desk)
  public getDarkWalnutWood(): THREE.MeshStandardMaterial {
    const key = "darkWalnutWood";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x1a1614),
        roughness: 0.65,
        metalness: 0.05,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Leather Desk Mat (Fine textured desk runner)
  public getLeatherDeskMat(): THREE.MeshStandardMaterial {
    const key = "leatherDeskMat";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x16181b),
        roughness: 0.78,
        metalness: 0.02,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // High-Density Bond Paper (Statutory Certificate, HMRC document)
  public getStatutoryPaper(): THREE.MeshStandardMaterial {
    const key = "statutoryPaper";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf6f6f4),
        roughness: 0.85,
        metalness: 0.0,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Architectural Brass (Directory Plaque, Seal)
  public getArchitecturalBrass(): THREE.MeshStandardMaterial {
    const key = "architecturalBrass";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xd4af37),
        roughness: 0.22,
        metalness: 0.9,
        envMapIntensity: 1.5,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Screen Surface Material (Emissive Anti-Glare Matte Display)
  public createScreenMaterial(texture: THREE.Texture): THREE.MeshStandardMaterial {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.48, // Anti-glare matte cinema display finish
      metalness: 0.02,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: texture,
      emissiveIntensity: 0.88, // Clean, authentic backlit display
    });
  }

  // Dark Architectural Floor Tile
  public getDarkFloorTile(): THREE.MeshStandardMaterial {
    const key = "darkFloorTile";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0a0c10),
        roughness: 0.25,
        metalness: 0.4,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  // Polished Black Granite / Marble
  public getPolishedGranite(): THREE.MeshStandardMaterial {
    const key = "polishedGranite";
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0e1117),
        roughness: 0.12,
        metalness: 0.65,
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key) as THREE.MeshStandardMaterial;
  }

  public disposeAll(): void {
    for (const mat of this.cache.values()) {
      mat.dispose();
    }
    this.cache.clear();
  }
}
