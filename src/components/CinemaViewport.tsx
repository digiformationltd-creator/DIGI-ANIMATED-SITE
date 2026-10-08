import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CinematicCameraController } from "../core/CinematicCameraController";
import { LightingRig } from "../core/LightingRig";
import { CinematicSceneManager } from "../core/CinematicSceneManager";
import { PerformanceMonitor } from "../core/PerformanceMonitor";
import { CinematicScene, QualityTier } from "../types/cinema";
import { FilmConfig } from "../types/film";
import { AudioAtmosphereEngine } from "../core/AudioAtmosphereEngine";
import { ProceduralWorkspace } from "../environment/ProceduralWorkspace";

interface CinemaViewportProps {
  progress: number;
  smoothProgress: number;
  film: FilmConfig;
  onSceneChange: (scene: CinematicScene) => void;
  onFpsUpdate: (fps: number) => void;
  onCameraUpdate: (pos: [number, number, number], target: [number, number, number]) => void;
  qualityTier: QualityTier;
}

export const CinemaViewport: React.FC<CinemaViewportProps> = ({
  smoothProgress,
  film,
  onSceneChange,
  onFpsUpdate,
  onCameraUpdate,
  qualityTier,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sceneManagerRef = useRef<CinematicSceneManager | null>(null);
  const persistentWorkspaceRef = useRef<ProceduralWorkspace | null>(null);
  const lightingRigRef = useRef<LightingRig | null>(null);
  const cameraControllerRef = useRef<CinematicCameraController | null>(null);
  const smoothProgressRef = useRef<number>(smoothProgress);
  const filmRef = useRef<FilmConfig>(film);

  useEffect(() => {
    smoothProgressRef.current = smoothProgress;
  }, [smoothProgress]);

  useEffect(() => {
    filmRef.current = film;
  }, [film]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Initialize Scene & Perspective Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent background allowing RealisticCinemaEngine to display real documentary plates

    // Persistent Executive Workspace (Grounding all service films in executive suite)
    const persistentWorkspace = new ProceduralWorkspace();
    scene.add(persistentWorkspace.getGroup());
    persistentWorkspace.getGroup().visible = filmRef.current.id !== "master";
    persistentWorkspaceRef.current = persistentWorkspace;

    const camera = new THREE.PerspectiveCamera(
      46,
      container.clientWidth / container.clientHeight,
      0.1,
      350
    );

    const cameraController = new CinematicCameraController(camera);
    cameraControllerRef.current = cameraController;

    // 2. Initialize WebGLRenderer with ACES Filmic Tone Mapping and alpha transparency
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
        antialias: qualityTier !== "LOW",
        alpha: true,
        stencil: false,
        depth: true,
      });
    } catch (err) {
      console.error("[CinemaViewport] WebGL init failed:", err);
      return;
    }

    rendererRef.current = renderer;
    const perf = PerformanceMonitor.getInstance();
    renderer.setPixelRatio(perf.getRecommendedDpr());
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = qualityTier !== "LOW";
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Lighting Rig with cinematic atmosphere curve starting from near-darkness
    const lightingRig = new LightingRig(scene);
    lightingRig.setQuality(qualityTier);
    lightingRig.setAtmosphere(0.0);
    lightingRigRef.current = lightingRig;

    // 4. Scene Manager & Dynamic Initial Film Registration
    const sceneManager = new CinematicSceneManager(scene, cameraController);
    sceneManagerRef.current = sceneManager;

    const initialScenes = filmRef.current.createScenes();
    for (const sc of initialScenes) {
      sceneManager.registerScene(sc);
    }
    const active = sceneManager.getActiveScene();
    if (active) {
      onSceneChange(active);
    }

    // 5. Unified 60 FPS Render Loop
    let lastTime = performance.now();
    let isDisposed = false;
    let rafId = 0;

    let lastActiveSceneId = "scene-01-decision";
    const animate = (time: number) => {
      if (isDisposed) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      perf.tick();
      onFpsUpdate(perf.getFps());

      if (perf.shouldRender()) {
        cameraController.update(delta);
        sceneManager.update(smoothProgressRef.current, delta);
        lightingRig.setAtmosphere(smoothProgressRef.current);

        const active = sceneManager.getActiveScene();
        if (active && active.id !== lastActiveSceneId) {
          lastActiveSceneId = active.id;
          onSceneChange(active);
        }

        const camPos = cameraController.getPosition();
        const camTarget = cameraController.getTarget();
        onCameraUpdate(
          [camPos.x, camPos.y, camPos.z],
          [camTarget.x, camTarget.y, camTarget.z]
        );

        // In Master Nexus startup sequence (p < 0.14), keep WebGL idle and clear with transparent alpha
        if (filmRef.current.id === "master" && smoothProgressRef.current < 0.14) {
          renderer.setClearColor(0x000000, 0);
          renderer.clear();
        } else {
          renderer.render(scene, camera);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // 6. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraController.resize(w, h);
      renderer.setSize(w, h);
      renderer.setPixelRatio(perf.getRecommendedDpr());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      sceneManager.dispose();
      lightingRig.dispose(scene);
      if (persistentWorkspaceRef.current) {
        scene.remove(persistentWorkspaceRef.current.getGroup());
      }
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Swap scenes dynamically when film changes without tearing down WebGL canvas
  const isFirstMountRef = useRef(true);
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    const sceneManager = sceneManagerRef.current;
    if (!sceneManager) return;

    if (persistentWorkspaceRef.current) {
      persistentWorkspaceRef.current.getGroup().visible = film.id !== "master";
    }
    if (sceneRef.current) {
      sceneRef.current.background = null;
    }

    sceneManager.clearScenes();
    const newScenes = film.createScenes();
    for (const sc of newScenes) {
      sceneManager.registerScene(sc);
    }
    const active = sceneManager.getActiveScene();
    if (active) {
      onSceneChange(active);
    }
    AudioAtmosphereEngine.getInstance().emitEvent("film:start", { filmId: film.id });
  }, [film.id]);



  // Adjust quality tier changes
  useEffect(() => {
    if (rendererRef.current && lightingRigRef.current) {
      const perf = PerformanceMonitor.getInstance();
      rendererRef.current.setPixelRatio(perf.getRecommendedDpr());
      lightingRigRef.current.setQuality(qualityTier);
      rendererRef.current.shadowMap.enabled = qualityTier !== "LOW";
    }
  }, [qualityTier]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" />;
};
