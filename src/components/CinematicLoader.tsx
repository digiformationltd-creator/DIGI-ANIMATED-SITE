import React from "react";

interface CinematicLoaderProps {
  ready: boolean;
  progressPercent: number;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ ready, progressPercent }) => {
  if (ready) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07090c] flex flex-col items-center justify-center p-8 transition-opacity duration-700 select-none">
      {/* Brand Watermark */}
      <img
        src="/assets/brand/digiformation-logo-official.png"
        alt="DigiFormation"
        className="h-10 w-auto mb-8 opacity-90 object-contain"
      />

      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold font-display tracking-widest text-white uppercase mb-2">
          UK LTD FORMATION
        </h2>
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-8">
          CINEMATIC REAL-TIME EXPERIENCE
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden mb-4 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-slate-400 to-white transition-all duration-300"
            style={{ width: `${Math.max(15, progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>INITIALIZING OPTICS & RUNTIME</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
      </div>
    </div>
  );
};
