import React from "react";
import { ArrowRight } from "lucide-react";
import { TelemetryData } from "../types/cinema";

interface CinemaOverlayProps {
  progress: number;
  telemetry: TelemetryData;
  title: string;
  kicker: string;
  description: string;
  statutoryNote: string;
  metricBadge?: string;
  nextFilmRoute?: string;
  nextFilmLabel?: string;
  onNavigateFilm?: (route: string) => void;
}

export const CinemaOverlay: React.FC<CinemaOverlayProps> = ({
  progress,
  telemetry,
  title,
  kicker,
  description,
  statutoryNote,
  metricBadge,
  nextFilmRoute,
  nextFilmLabel,
  onNavigateFilm,
}) => {
  // Format percentage as timecode frame string
  const totalFrames = Math.floor(progress * 1440);
  const seconds = Math.floor(totalFrames / 24);
  const frames = totalFrames % 24;
  const timecodeString = `00:01:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;

  return (
    <>
      {/* 2.39:1 Cinema Letterbox Bars */}
      <div className="cinema-letterbox-top flex items-center justify-between px-6 sm:px-8 text-[11px] font-mono text-slate-400">
        <div className="hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">REC</span>
          </span>
          <span className="text-slate-400">{telemetry.aspectRatio}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{telemetry.focalLength}</span>
        </div>
      </div>

      <div className="cinema-letterbox-bottom flex items-center justify-between px-4 sm:px-8 text-[10px] sm:text-[11px] font-mono text-slate-400">
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-slate-400">SHUTTER {telemetry.shutterSpeed}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">APERTURE {telemetry.aperture}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">ISO {telemetry.iso}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 font-semibold">{timecodeString}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{telemetry.fps} FPS</span>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-sans">REEL:</span>
            <span className="text-slate-200 font-bold">{telemetry.reelNumber}</span>
          </div>
          <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
            {telemetry.statutoryStep}
          </span>
        </div>
      </div>

      {/* Atmospheric Film Grain & Vignette */}
      <div className="cinema-grain" aria-hidden="true" />
      <div className="cinema-vignette" aria-hidden="true" />

      {/* Narrative Storytelling Layer (Bottom Left) */}
      <div className="fixed bottom-14 sm:bottom-20 left-4 sm:left-8 md:left-14 max-w-[calc(100vw-2rem)] sm:max-w-xl z-30 pointer-events-none select-none transition-all duration-500">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono text-slate-300 uppercase tracking-widest mb-1.5 sm:mb-3">
          {kicker}
        </div>

        <h1 className="text-xl sm:text-3xl md:text-5xl font-bold font-display tracking-tight text-white drop-shadow-md mb-1.5 sm:mb-3">
          {title}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-sans mb-1.5 sm:mb-3 drop-shadow line-clamp-2 sm:line-clamp-none">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-slate-400">
          <span className="truncate max-w-[240px] sm:max-w-none">{statutoryNote}</span>
          {metricBadge && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 whitespace-nowrap">
              {metricBadge}
            </span>
          )}
        </div>
      </div>

      {/* Cross-Film Continuation Bridge (Section 7) */}
      {progress > 0.88 && nextFilmRoute && onNavigateFilm && (
        <div className="fixed bottom-14 sm:bottom-20 right-4 sm:right-28 z-40 pointer-events-auto animate-fade-in">
          <button
            onClick={() => onNavigateFilm(nextFilmRoute)}
            className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-black font-mono text-[11px] sm:text-xs font-bold tracking-wider hover:bg-slate-200 transition shadow-2xl border border-white/40"
          >
            <span>{nextFilmLabel || "NEXT CHAPTER →"}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </>
  );
};
