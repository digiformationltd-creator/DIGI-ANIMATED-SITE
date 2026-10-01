import React from "react";
import { FilmStep } from "../types/film";

interface FilmTimelineIndicatorProps {
  progress: number;
  steps: FilmStep[];
  onJump: (progress: number) => void;
}

export const FilmTimelineIndicator: React.FC<FilmTimelineIndicatorProps> = ({
  progress,
  steps,
  onJump,
}) => {
  return (
    <aside
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 bg-black/40 backdrop-blur-md px-3 py-6 rounded-full border border-white/10 shadow-2xl pointer-events-auto"
      aria-label="Cinematic Film Reel Transport"
    >
      {/* Top Sprocket Hole */}
      <div className="w-2.5 h-1.5 rounded-sm bg-white/20 border border-white/10" />

      {/* Progress Track Line */}
      <div className="relative h-56 w-0.5 bg-white/15 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white to-slate-400 transition-all duration-75"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {/* Milestone ticks */}
      <div className="flex flex-col items-center gap-2">
        {steps.map((step, idx) => {
          const isActive = Math.abs(progress - step.pos) < 0.08;
          return (
            <button
              key={idx}
              onClick={() => onJump(step.pos)}
              className="group relative flex items-center justify-center p-1"
              title={step.label}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white scale-150 ring-2 ring-white/40"
                    : "bg-white/30 group-hover:bg-white/70"
                }`}
              />
              {/* Flyout chapter label on hover */}
              <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 border border-white/10 pointer-events-none">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Percentage Readout */}
      <div className="text-[10px] font-mono text-slate-400 select-none">
        {Math.round(progress * 100)}%
      </div>

      {/* Bottom Sprocket Hole */}
      <div className="w-2.5 h-1.5 rounded-sm bg-white/20 border border-white/10" />
    </aside>
  );
};
