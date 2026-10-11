# DIGIFORMATION — MASTER 3D / THREE.JS ARCHITECTURE, CURRENT AUDIT & MASTER AI PROMPT
> **Target Audience:** ChatGPT / OpenAI o1 / Claude 3.5 Sonnet / Astra 6 / Senior WebGL & Three.js Architects  
> **Repository:** `https://github.com/digiformationltd-creator/DIGI-ANIMATED-SITE.git` (Branch: `main`)  
> **Local Server:** Port `4173` (`node scripts/serve.js`)  
> **Version:** 2.0.0 Production Blueprint  

---

## 1. EXECUTIVE SUMMARY & CURRENT PROJECT CONDITION

### 1.1 What DigiFormation Is
**DigiFormation** (`https://digiformation.co.uk`) is an international premium corporate formation and digital business infrastructure platform for global entrepreneurs. It offers:
1. **UK LTD Formation** (Companies House official filing, Registered London Office, Director KYC, Digital Certificate of Incorporation, VAT).
2. **US LLC Formation** (Delaware, Wyoming, New Mexico state filings, IRS EIN generation, Operating Agreements, US Registered Agent).
3. **Global Banking & Compliance** (Stripe, Mercury, Wise business accounts, AML/KYC biometric passport checks, corporate IBANs).
4. **Digital Build** (Custom enterprise websites, e-commerce, cloud servers, branding, corporate identity).
5. **Digi Biz OS** (The proprietary enterprise operating system for real-time company management, tax tracking, invoicing, and autonomous workflows).

---

### 1.2 Current Condition & Reality Audit (What is Built vs. What is Cartoonish)

| Layer | Component | Status | Visual Quality | Notes |
|---|---|---|---|---|
| **Hero Opening (0% - 16% Scroll)** | `HeroSequencePlayer.tsx` | **100% Complete** | **1080p / 4K Photorealistic Film** | 60 ultra-crisp frames (`/assets/hero-sequence-hq/frame_001.jpg` to `frame_060.jpg`). Drone descends from London skyline, enters glass window into luxury executive office, landing right before the black marble desk with chair, mug, laptop, and 3D silver wall logo. |
| **Scroll Engine** | `CinematicTimeline.ts` + `Lenis` | **100% Complete** | **Silky Smooth 60 FPS** | 600vh scroll container. `smoothProgress` lerped between 0.0 and 1.0. |
| **Audio Atmosphere** | `AudioAtmosphereEngine.ts` | **100% Complete** | **Acoustic Corporate Tone** | Web Audio API procedural brownian/pink room ambience and UI micro-clicks. |
| **HUD & Navigation** | `CinemaNavigation.tsx`, `CinemaOverlay.tsx` | **100% Complete** | **Cinematic Anamorphic Film Rig** | Top reel switcher (NEXUS, 01 UK LTD, 02 US LLC, 03 COMPLIANCE, 04 DIGITAL BUILD, DIGI BIZ OS), timecode, camera telemetry (35mm T1.4, 24 FPS, ISO 320). |
| **Post-Hero 3D Scenes (16% - 100% Scroll)** | `CinemaViewport.tsx`, `SceneMasterPortals.ts`, `ProceduralWorkspace.ts` | **Needs Total Overhaul** | **Currently Synthetic / Cartoonish (3D Boxes)** | **THE CORE PROBLEM:** The 3D scenes after the hero video are rendered with basic Three.js geometric boxes and planes (`THREE.BoxGeometry`). They look like a WebGL game or prototype, NOT a luxury photorealistic film! |

---

## 2. THE MASTER REDESIGN VISION (THE "EXECUTIVE LAPTOP WORKSTATION")

### The Flaw with the Old 3D Approach:
In the old approach, scrolling past 16% revealed procedural 3D rooms (floating boxes, cartoon walls, generic textures). This broke the cinematic immersion established by the 4K opening video.

### The New Master Solution (User-Approved):
1. **Frame 60 Arrival:** The drone camera lands inside the London executive office facing the back of the DigiFormation laptop lid resting on the black marble desk.
2. **Seamless 180° Camera Orbit (Scroll 16% → 20%):**  
   As the user scrolls, the camera physically glides around the marble desk in an orbit/pan maneuver, settling behind the CEO leather armchair.
3. **The Background:**  
   Behind the laptop, the panoramic floor-to-ceiling glass curtain wall remains visible, showing the glowing London twilight dusk skyline and subtle reflections on the marble desk.
4. **The Centerpiece (Executive Laptop Display):**  
   The laptop screen is open, angled perfectly toward the viewer in a crisp, cinematic close-up.
5. **The Interactive 3D Workstation:**  
   As the user continues scrolling (20% → 100%), the **laptop screen itself becomes the dynamic high-resolution interactive viewport** displaying the authentic DigiFormation corporate engines:
   * **Reel 01 (UK LTD):** Live Companies House portal filing, digital certificate stamping, London office assignment.
   * **Reel 02 (US LLC):** Delaware/Wyoming state registration, IRS EIN certificate generation, Operating Agreement.
   * **Reel 03 (Banking & Compliance):** Stripe & Mercury corporate account activation, AML/KYC passport scanning.
   * **Reel 04 (Digital Build):** Enterprise server architecture, web platform deployment.
   * **Reel 05 (Digi Biz OS):** The full enterprise command dashboard with revenue telemetry, invoice manager, and tax compliance vault.

---

## 3. FULL REPOSITORY ARCHITECTURE & FILE MAP

```
c:\Users\user\Documents\DIGI 3D FINAL\
├── public/
│   ├── assets/
│   │   ├── hero-sequence-hq/       # 60 Ultra-HD 1080p/4K master JPEGs (frame_001.jpg - frame_060.jpg)
│   │   ├── hero-sequence/          # 50 ezgif legacy frames (backup)
│   │   ├── brand/                  # DigiFormation logos, badges, and icons
│   │   ├── partners/               # Stripe, Wise, Companies House, HMRC, IRS, Mercury logos
│   │   └── verification/           # KYC passport, ID card sample assets
├── scripts/
│   └── serve.js                    # High-performance zero-dependency HTTP server on port 4173
├── src/
│   ├── App.tsx                     # Master Root Component orchestrating Timeline, Canvas & Overlays
│   ├── main.tsx                    # React 18 DOM mount
│   ├── index.css                   # Tailwind CSS, cinematic vignette, film grain, and HUD styles
│   ├── components/
│   │   ├── HeroSequencePlayer.tsx  # 60-Frame 24 FPS Canvas sequence player with DOM telemetry
│   │   ├── RealisticCinemaEngine.tsx # Photochemical grain, lens vignette, audio manager
│   │   ├── CinemaViewport.tsx      # Three.js WebGL canvas wrapper (camera, lights, render loop)
│   │   ├── CinemaNavigation.tsx    # Header reel navigator (NEXUS, UK, US, COMPLIANCE, BUILD, BIZOS)
│   │   ├── CinemaOverlay.tsx       # Text narrative, kickers, statutory badges, and CTA cards
│   │   ├── FilmTimelineIndicator.tsx# Right vertical scroll track with interactive chapter dots
│   │   ├── CinematicLoader.tsx     # Smooth fade loader with asset readiness tracking
│   │   ├── CinemaSEO.tsx           # Dynamic meta tags & structured data per chapter
│   │   └── DebugHUD.tsx            # Real-time WebGL telemetry (FPS, camera x/y/z, DPR)
│   ├── core/
│   │   ├── CinematicTimeline.ts    # Lenis-backed smooth scroll timeline (0.0 to 1.0)
│   │   ├── CinematicCameraController.ts # Three.js Camera rig with smooth damping
│   │   ├── CinematicSceneManager.ts# Multi-scene transitions and lifecycle
│   │   ├── FilmRegistry.ts         # Metadata, chapters, statutory notes for all 6 films
│   │   ├── LightingRig.ts          # Studio 3-point lights + ambient dusk fill
│   │   ├── MaterialFactory.ts      # PBR Material cache (Titanium, Marble, Glass, Velvet)
│   │   ├── AudioAtmosphereEngine.ts# Web Audio ambient generator
│   │   └── PerformanceMonitor.ts   # Auto-detects device tier (HIGH, MED, LOW) & adjusts DPR
│   ├── environment/
│   │   ├── PhotorealisticLaptop.ts # Procedural 3D executive laptop model (aluminum, glass screen)
│   │   ├── ProceduralWorkspace.ts  # Marble desk, leather mat, metal bevels
│   │   ├── CorporateHeadquarters.ts# Exterior building geometry (used in legacy 3D)
│   │   ├── OfficeInterior.ts       # Interior office room geometry
│   │   ├── ScreenSurface.ts        # Dynamic CanvasTexture screen content renderer
│   │   └── SilverLogoSignage.ts    # Brushed stainless steel 3D wall logo
│   └── scenes/                     # Chapter scene definitions
│       ├── master/                 # Nexus chapter scenes
│       ├── uk/                     # UK LTD 10-step incorporation scenes
│       ├── us/                     # US LLC 9-step formation scenes
│       ├── compliance/             # KYC/AML 5-step compliance scenes
│       ├── digital/                # Digital Build 5-step engineering scenes
│       └── bizos/                  # Digi Biz OS 5-step sovereign dashboard scenes
```

---

## 4. TECHNICAL SPECIFICATIONS FOR THREE.JS IMPLEMENTATION

### 4.1 Rendering & Lighting Pipeline
* **Three.js Version:** `0.168.0+`
* **Tone Mapping:** `THREE.ACESFilmicToneMapping` with exposure `1.15`
* **Color Space:** `THREE.SRGBColorSpace` (Linear workflow for accurate PBR reflections)
* **Shadows:** `THREE.PCFSoftShadowMap` with 2048x2048 shadow cascades
* **Anti-Aliasing:** Native WebGL MSAA + sub-pixel jitter elimination

### 4.2 Realistic Laptop Model Specs (`PhotorealisticLaptop.ts`)
* **Chassis:** Space Gray / Midnight anodized aluminum (`metalness: 0.88`, `roughness: 0.22`).
* **Hinge:** Beveled cylindrical brushed steel with realistic 115° opening angle.
* **Bezel:** Ultra-thin dark border (`roughness: 0.95`) with webcam notch/indicator LED.
* **Keyboard Deck:** Recessed anodized plate with individually backlit chicklet keys.
* **Trackpad:** Frosted glass finish with subtle specular highlight.
* **Screen Display Plane:**
  * 16:10 aspect ratio high-density plane (`width: 0.35m`, `height: 0.22m`).
  * Emissive texture powered by a dynamic `HTMLCanvasElement` (`CanvasTexture`) updated via `requestAnimationFrame` only when content changes.
  * Screen shader includes subtle anti-glare matte coating (`clearcoat: 0.1`, `roughness: 0.35`).

### 4.3 Camera Orbit Math (`CinematicCameraController.ts`)
Between `progress = 0.16` and `progress = 0.22`:
```typescript
// Smooth 180-degree orbit around the desk
const orbitProgress = Math.min(1, Math.max(0, (progress - 0.16) / 0.06));
const easedOrbit = easeInOutCubic(orbitProgress);

// Interpolate camera from front of desk to behind the laptop
const startPos = new THREE.Vector3(0.0, 1.15, 1.20);   // Facing desk & wall
const endPos   = new THREE.Vector3(0.0, 0.95, -0.65);  // Facing laptop screen & window

camera.position.lerpVectors(startPos, endPos, easedOrbit);
camera.lookAt(laptopScreenCenter);
```

---

## 5. MASTER PROMPT FOR CHATGPT / ASTRA 6 / CLAUDE 3.5

Copy and paste the entire prompt below directly into ChatGPT (o1 / GPT-4o) or Astra 6:

```markdown
You are an Elite WebGL, Three.js, and Creative Director specializing in AAA, photorealistic, cinematic corporate web experiences (resembling Apple Keynote, Stripe Press, and high-end automotive configurators).

### PROJECT CONTEXT:
I have a full-stack production codebase for **DigiFormation** (an international corporate formation platform at digiformation.co.uk) hosted on GitHub:
Repository: https://github.com/digiformationltd-creator/DIGI-ANIMATED-SITE.git (branch: main)
Tech Stack: React 18, Vite 5, Three.js 0.168, Tailwind CSS, Lenis Smooth Scroll, TypeScript.

### CURRENT STATE AUDIT:
1. The opening hero sequence (0% to 16% scroll) is ALREADY a stunning, photorealistic 1080p/4K 60-frame film sequence (in `HeroSequencePlayer.tsx`). The camera glides down from the London dusk sky, enters a curved glass headquarters, and settles in an executive office right before a black marble desk with a laptop, coffee mug, and 3D silver DigiFormation wall logo.
2. HOWEVER, after 16% scroll, the current 3D scenes look synthetic, boxy, and cartoonish (rendered with basic Three.js BoxGeometries in `ProceduralWorkspace.ts` and `src/scenes/`).

### YOUR MISSION:
Transform the entire post-hero experience (16% to 100% scroll) into a **hyper-realistic 3D executive laptop workstation** controlled by scroll:

1. **Seamless Camera Orbit (16% -> 20% scroll):**
   * As the user scrolls past the 60-frame film, the Three.js camera smoothly orbits 180 degrees around the marble desk.
   * The background shows the realistic floor-to-ceiling glass window overlooking the glowing London sunset skyline.
   * The foreground features an ultra-photorealistic laptop workstation (metallic chassis, backlit keyboard, matte screen).

2. **The Dynamic Interactive Laptop Screen (20% -> 100% scroll):**
   The laptop screen must serve as the primary interactive viewport that scrubs through 5 real corporate formation stages:
   * **Stage 1 (UK LTD):** Live Companies House filing interface, company name verification check, official incorporation certificate stamping, London registered address assignment.
   * **Stage 2 (US LLC):** Delaware & Wyoming state filing console, IRS EIN Tax ID certificate, Operating Agreement generation.
   * **Stage 3 (Banking & Compliance):** Stripe & Mercury corporate account approval, real-time KYC/AML biometric passport verification.
   * **Stage 4 (Digital Build):** Secure cloud deployment, domain management, enterprise web stack.
   * **Stage 5 (Digi Biz OS):** The full sovereign business dashboard with revenue metrics, invoice generator, and annual compliance calendar.

3. **Code & Engineering Standards:**
   * Write production-ready, clean TypeScript code compatible with the existing `src/components/CinemaViewport.tsx` and `src/environment/` structure.
   * Use `THREE.MeshPhysicalMaterial` or custom GLSL shaders with PBR properties (roughness, metalness, clearcoat, normal maps).
   * Ensure 60 FPS performance by utilizing dynamic `CanvasTexture` or DOM-based 3D overlays without memory leaks.
   * Never introduce boxy/cartoonish primitives. Every element must look like a high-end corporate documentary film.

Please review the architecture and provide the exact TypeScript implementations for:
1. `src/environment/PhotorealisticWorkstation.ts` (The complete executive desk, window skyline, and realistic laptop).
2. The updated camera orbit math in `src/core/CinematicCameraController.ts`.
3. The interactive dynamic screen renderer for the 5 formation stages.
```

---

## 6. VERIFICATION & RUNTIME CHECKLIST
* [x] **Local Server:** Port 4173 active and serving production build (`scripts/serve.js`).
* [x] **GitHub Sync:** Origin remote set to `https://github.com/digiformationltd-creator/DIGI-ANIMATED-SITE.git`, branch `main`.
* [x] **Asset Verification:** 60 high-definition frames in `public/assets/hero-sequence-hq/` (11.75 MB total).
* [x] **Zero Memory Leaks:** WebGL renderer disposes geometries/materials cleanly on route unmount.
