import React, { useEffect, useState, useRef, useCallback } from "react";
import { CinematicTimeline } from "./core/CinematicTimeline";
import { PerformanceMonitor } from "./core/PerformanceMonitor";
import { AudioAtmosphereEngine } from "./core/AudioAtmosphereEngine";
import { FILM_REGISTRY, FILM_LIST, getFilmByRoute, getFilmById } from "./core/FilmRegistry";
import { CinemaViewport } from "./components/CinemaViewport";
import { CinemaOverlay } from "./components/CinemaOverlay";
import { CinemaNavigation } from "./components/CinemaNavigation";
import { FilmTimelineIndicator } from "./components/FilmTimelineIndicator";
import { CinematicLoader } from "./components/CinematicLoader";
import { CinemaSEO } from "./components/CinemaSEO";
import { DebugHUD } from "./components/DebugHUD";
import { CinematicScene, QualityTier } from "./types/cinema";
import { FilmConfig, FilmId } from "./types/film";

export function App() {
  const [ready, setReady] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [activeScene, setActiveScene] = useState<CinematicScene | null>(null);
  const [fps, setFps] = useState(60);
  const [qualityTier, setQualityTier] = useState<QualityTier>("HIGH");
  const [isDebug, setIsDebug] = useState(false);
  const [camPos, setCamPos] = useState<[number, number, number]>([0, 1.85, 3.4]);
  const [camTarget, setCamTarget] = useState<[number, number, number]>([0, 1.05, 0]);

  // Route & Active Film State
  const [currentFilm, setCurrentFilm] = useState<FilmConfig>(() => {
    if (typeof window !== "undefined") {
      return getFilmByRoute(window.location.pathname);
    }
    return FILM_REGISTRY.master;
  });

  const timelineRef = useRef<CinematicTimeline | null>(null);

  // Switch film and update browser history
  const handleSelectFilm = useCallback((filmId: FilmId) => {
    const nextFilm = getFilmById(filmId);
    setCurrentFilm(nextFilm);
    if (typeof window !== "undefined") {
      window.history.pushState({ filmId }, "", nextFilm.route);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    if (timelineRef.current) {
      timelineRef.current.scrollTo(0);
    }
    AudioAtmosphereEngine.getInstance().emitEvent("service:selected", { filmId });
  }, []);

  const handleNavigateRoute = useCallback((route: string) => {
    const nextFilm = getFilmByRoute(route);
    handleSelectFilm(nextFilm.id);
  }, [handleSelectFilm]);

  useEffect(() => {
    // 1. Initialize Cinematic Timeline
    const timeline = new CinematicTimeline();
    timelineRef.current = timeline;
    (window as any).__timeline = timeline;

    const unsubscribe = timeline.subscribe((state) => {
      setProgress(state.progress);
      setSmoothProgress(state.smoothProgress);
    });

    // 2. Simulated progressive loading sequence for realistic asset readiness
    const interval = setInterval(() => {
      setLoadPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          return 100;
        }
        return prev + 20;
      });
    }, 60);

    // 3. Listen to Performance quality tier changes
    const perf = PerformanceMonitor.getInstance();
    setQualityTier(perf.getQualityTier());
    const unsubTier = perf.onQualityChange((tier) => setQualityTier(tier));

    // 4. Keyboard shortcuts: 'D' for HUD toggle, '1'-'5' for instant reel jump
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        setIsDebug((prev) => !prev);
      } else if (e.key === "0") {
        handleSelectFilm("master");
      } else if (e.key === "1") {
        handleSelectFilm("uk-ltd");
      } else if (e.key === "2") {
        handleSelectFilm("us-llc");
      } else if (e.key === "3") {
        handleSelectFilm("compliance");
      } else if (e.key === "4") {
        handleSelectFilm("digital-build");
      } else if (e.key === "5") {
        handleSelectFilm("biz-os");
      }
    };
    window.addEventListener("keydown", handleKey);

    // 5. Browser Back / Forward History Integration (popstate)
    const handlePopState = () => {
      const matched = getFilmByRoute(window.location.pathname);
      setCurrentFilm(matched);
      window.scrollTo({ top: 0, behavior: "instant" });
      if (timelineRef.current) {
        timelineRef.current.scrollTo(0);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearInterval(interval);
      unsubscribe();
      unsubTier();
      timeline.destroy();
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleSelectFilm]);

  const handleJump = (targetProgress: number) => {
    if (timelineRef.current) {
      timelineRef.current.scrollTo(targetProgress);
    }
  };

  return (
    <div className="relative min-h-[500vh] bg-[#07090c] text-white overflow-x-hidden">
      {/* Dynamic SEO & DOM Accessibility Layer */}
      <CinemaSEO film={currentFilm} />

      {/* Cinematic Asset Loader */}
      <CinematicLoader ready={ready} progressPercent={loadPercent} />

      {/* Fixed Fullscreen Cinema Canvas Viewport (Shared WebGL Renderer) */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <CinemaViewport
          progress={progress}
          smoothProgress={smoothProgress}
          film={currentFilm}
          onSceneChange={(scene) => setActiveScene(scene)}
          onFpsUpdate={(val) => setFps(val)}
          onCameraUpdate={(pos, target) => {
            setCamPos(pos);
            setCamTarget(target);
          }}
          qualityTier={qualityTier}
        />
      </div>

      {/* Top Header Navigation & Filmstrip Switcher */}
      <CinemaNavigation
        currentFilm={currentFilm}
        onSelectFilm={handleSelectFilm}
        onToggleDebug={() => setIsDebug(!isDebug)}
        isDebug={isDebug}
      />

      {/* Cinematic HUD Overlay, Narrative, & Cross-Film Bridge */}
      {activeScene && (
        <CinemaOverlay
          progress={smoothProgress}
          telemetry={activeScene.telemetry}
          title={activeScene.title}
          kicker={activeScene.kicker}
          description={activeScene.description}
          statutoryNote={activeScene.statutoryNote}
          metricBadge={activeScene.metricBadge}
          nextFilmRoute={currentFilm.nextFilmRoute}
          nextFilmLabel={currentFilm.nextFilmLabel}
          onNavigateFilm={handleNavigateRoute}
        />
      )}

      {/* Vertical Film Timeline Indicator (Dynamic to Active Film's Reels) */}
      <FilmTimelineIndicator
        progress={smoothProgress}
        steps={currentFilm.timelineSteps}
        onJump={handleJump}
      />

      {/* Debug Telemetry HUD (Toggleable via [D] or HUD button) */}
      {isDebug && activeScene && (
        <DebugHUD
          progress={smoothProgress}
          fps={fps}
          qualityTier={qualityTier}
          sceneId={activeScene.id}
          camPos={camPos}
          camTarget={camTarget}
          onTierChange={(tier) => {
            PerformanceMonitor.getInstance().setQualityTier(tier);
            setQualityTier(tier);
          }}
        />
      )}

      {/* Mobile Touch Scrub Guide */}
      <div className="fixed bottom-6 right-6 md:hidden z-30 pointer-events-none text-[10px] font-mono text-slate-400 bg-black/60 px-3 py-1 rounded-full border border-white/10">
        SCRUB TO ADVANCE FILM
      </div>
    </div>
  );
}

export default App;
