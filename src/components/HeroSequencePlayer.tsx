import React, { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";

interface HeroSequencePlayerProps {
  progress: number; // Global scroll progress (0.0 to 1.0)
  isMaster: boolean;
  onLoaded?: () => void;
  onFrameChange?: (frameIndex: number) => void;
}

const TOTAL_FRAMES = 60;
const CHAPTER_RANGE = 0.16; // First chapter covers 0% to 16% of scroll timeline

export const HeroSequencePlayer: React.FC<HeroSequencePlayerProps> = ({
  progress,
  isMaster,
  onLoaded,
  onFrameChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(true);
  
  // Direct DOM refs for high-frequency telemetry to avoid React re-renders during playback
  const frameTextRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const phaseTextRef = useRef<HTMLDivElement | null>(null);

  const introFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const lastTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);
  const userHasScrolledRef = useRef<boolean>(false);
  const isLoadedRef = useRef<boolean>(false);

  // Pad frame index to 3 digits (e.g. 1 -> "001")
  const getFramePath = (index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/assets/hero-sequence-hq/frame_${padded}.jpg`;
  };

  // Update telemetry DOM elements directly with zero React re-render overhead
  const updateTelemetryDOM = useCallback((frameNum: number) => {
    if (frameTextRef.current) {
      frameTextRef.current.textContent = `FRAME ${String(frameNum).padStart(2, "0")} / ${TOTAL_FRAMES}`;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(frameNum / TOTAL_FRAMES) * 100}%`;
    }
    if (phaseTextRef.current) {
      phaseTextRef.current.textContent =
        frameNum <= 18
          ? "AERIAL APPROACH"
          : frameNum <= 36
          ? "CAMPUS FACADE"
          : frameNum <= 50
          ? "WINDOW THRESHOLD"
          : "EXECUTIVE SUITE";
    }
  }, []);

  // Draw specific frame onto canvas with high quality & cover aspect ratio
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameNum - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover math (preserving aspect ratio and filling 100% of viewport)
    const scale = Math.max(cw / iw, ch / ih);
    const sw = Math.round(iw * scale);
    const sh = Math.round(ih * scale);
    const sx = Math.round((cw - sw) / 2);
    const sy = Math.round((ch - sh) / 2);

    // High quality bicubic filtering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Direct draw over canvas without clearRect to prevent single-frame flashing
    ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);

    currentFrameRef.current = frameNum;
    updateTelemetryDOM(frameNum);
    onFrameChange?.(frameNum);
  }, [onFrameChange, updateTelemetryDOM]);

  const [framesReady, setFramesReady] = useState<boolean>(false);
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  // Preload all 50 frames ONCE on mount with zero intermediate React re-renders
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          // Render first frame immediately so screen is ready instantly
          drawFrame(1);
        }
        if (loadedCount >= TOTAL_FRAMES && !isLoadedRef.current) {
          isLoadedRef.current = true;
          setFramesReady(true);
          onLoadedRef.current?.();
        }
      };
      images[i - 1] = img;
    }
    imagesRef.current = images;

    // Safety fallback: if images take longer than 350ms, mark ready anyway
    const fallbackTimer = setTimeout(() => {
      if (!isLoadedRef.current) {
        isLoadedRef.current = true;
        setFramesReady(true);
        onLoadedRef.current?.();
      }
    }, 350);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [drawFrame]);

  // Window resize handler with crisp high DPI pixel alignment
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      // Re-draw current frame
      const currentFrame = userHasScrolledRef.current
        ? Math.min(TOTAL_FRAMES, Math.max(1, Math.round((progress / CHAPTER_RANGE) * (TOTAL_FRAMES - 1)) + 1))
        : introFrameRef.current;
      drawFrame(currentFrame);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame, progress]);

  // Scroll timeline scrub synchronization
  useEffect(() => {
    if (!isMaster) return;

    if (progress > 0.005) {
      userHasScrolledRef.current = true;
      setIsPlayingIntro(false);
      const scrollNorm = Math.min(1, Math.max(0, progress / CHAPTER_RANGE));
      const targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(scrollNorm * (TOTAL_FRAMES - 1)) + 1));
      drawFrame(targetFrame);
    }
  }, [drawFrame, isMaster, progress]);

  // Auto-play intro animation on initial page load (silky 24 FPS)
  useEffect(() => {
    if (!isMaster || !isPlayingIntro || !framesReady) return;

    let active = true;
    const fps = 24;
    const frameInterval = 1000 / fps;

    const loop = (timestamp: number) => {
      if (!active || userHasScrolledRef.current) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;

      if (delta >= frameInterval) {
        lastTimeRef.current = timestamp - (delta % frameInterval);

        if (introFrameRef.current < TOTAL_FRAMES) {
          const nextFrame = introFrameRef.current + 1;
          const nextImg = imagesRef.current[nextFrame - 1];
          if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
            introFrameRef.current = nextFrame;
            drawFrame(nextFrame);
          }
        } else {
          // Reached the executive office (frame 50) - hold on this frame
          setIsPlayingIntro(false);
        }
      }

      if (introFrameRef.current < TOTAL_FRAMES && !userHasScrolledRef.current) {
        animFrameIdRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [drawFrame, isMaster, isPlayingIntro, framesReady]);

  // Manual replay button handler
  const handleReplay = () => {
    userHasScrolledRef.current = false;
    introFrameRef.current = 1;
    setIsPlayingIntro(true);
    lastTimeRef.current = 0;
    drawFrame(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Chapter 00 opacity fade out smoothly into Chapter 01 (UK LTD) as scroll passes 0.16
  const chapterOpacity = isMaster
    ? Math.max(0, 1 - Math.max(0, (progress - 0.14) / 0.04))
    : 0;

  if (!isMaster || chapterOpacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-300"
      style={{ opacity: chapterOpacity }}
      aria-label="DigiFormation Hero Visual Sequence"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none hero-sequence-canvas"
        style={{
          display: "block",
          imageRendering: "auto",
        }}
      />

      {/* Cinematic Film Overlay Badges */}
      <div className="absolute top-20 left-6 sm:left-12 z-20 pointer-events-auto flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono text-cyan-300 tracking-wider shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>CINEMATIC AERIAL DRONE REEL</span>
        </div>

        {!isPlayingIntro && progress < 0.02 && (
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-[11px] font-mono text-slate-200 transition shadow-lg"
            title="Replay Fly-Through"
          >
            <RotateCcw size={12} />
            <span>REPLAY FLY-THROUGH</span>
          </button>
        )}
      </div>

      {/* Subtle bottom progress bar indicator showing frame sequence scrub */}
      <div className="absolute bottom-10 left-6 sm:left-12 right-6 sm:right-12 z-20 pointer-events-none flex items-center gap-3">
        <div ref={frameTextRef} className="text-[10px] font-mono text-slate-300 min-w-[90px]">
          FRAME 01 / {TOTAL_FRAMES}
        </div>
        <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-cyan-400 transition-all duration-75"
            style={{ width: "2%" }}
          />
        </div>
        <div ref={phaseTextRef} className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider min-w-[120px] text-right">
          AERIAL APPROACH
        </div>
      </div>
    </div>
  );
};
