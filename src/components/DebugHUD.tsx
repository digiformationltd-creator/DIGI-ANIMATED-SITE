import React from "react";
import { QualityTier } from "../types/cinema";

interface DebugHUDProps {
  progress: number;
  fps: number;
  qualityTier: QualityTier;
  sceneId: string;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  onTierChange: (tier: QualityTier) => void;
}

export const DebugHUD: React.FC<DebugHUDProps> = ({
  progress,
  fps,
  qualityTier,
  sceneId,
  camPos,
  camTarget,
  onTierChange,
}) => {
  return (
    <div className="fixed top-20 right-6 z-50 bg-black/85 backdrop-blur-xl p-4 rounded-xl border border-amber-500/30 text-xs font-mono text-slate-300 shadow-2xl max-w-xs pointer-events-auto">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <span className="text-amber-400 font-bold">RUNTIME TELEMETRY</span>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
          DEV MODE
        </span>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">FPS:</span>
          <span className={`font-bold ${fps >= 55 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-rose-400"}`}>
            {fps} FPS
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">SCROLL PROGRESS:</span>
          <span className="text-white font-bold">{progress.toFixed(4)} ({(progress * 100).toFixed(1)}%)</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">ACTIVE SCENE:</span>
          <span className="text-cyan-300 font-bold">{sceneId}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">CAMERA POS:</span>
          <span className="text-slate-300">{camPos.map((n) => n.toFixed(2)).join(", ")}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">CAMERA TARGET:</span>
          <span className="text-slate-300">{camTarget.map((n) => n.toFixed(2)).join(", ")}</span>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-slate-500">QUALITY TIER:</span>
          <div className="flex gap-1">
            {(["HIGH", "MEDIUM", "LOW"] as QualityTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => onTierChange(tier)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  qualityTier === tier
                    ? "bg-amber-400 text-black"
                    : "bg-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
