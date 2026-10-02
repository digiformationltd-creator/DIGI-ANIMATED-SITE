import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import { FilmConfig } from "../types/film";

interface RealisticCinemaEngineProps {
  progress: number;
  film: FilmConfig;
  onReady?: () => void;
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const RealisticCinemaEngine: React.FC<RealisticCinemaEngineProps> = ({
  progress,
  film,
  onReady,
}) => {
  const [hudVisible, setHudVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Notify ready on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      onReady?.();
    }, 200);
    return () => clearTimeout(timer);
  }, [onReady]);

  // Audio atmosphere synthesis (authentic corporate room tone & acoustic ambience)
  const toggleSound = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        output[i] = (b0 + b1 + b2) * 0.07;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = film.id === "biz-os" ? 580 : 380;

      const gain = ctx.createGain();
      gain.gain.value = 0.05;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      noiseNodeRef.current = gain;
      setSoundEnabled(true);
    } else {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
        setSoundEnabled(true);
      } else {
        audioCtxRef.current.suspend();
        setSoundEnabled(false);
      }
    }
  };

  // Rolling real-time cinema timecode (e.g. 00:01:24:18)
  const totalFrames = Math.floor(progress * 1920);
  const seconds = Math.floor(totalFrames / 24);
  const frames = totalFrames % 24;
  const minutes = Math.floor(seconds / 60);
  const timecode = `00:${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;

  // Optical Camera Crane Matrix: Smooth dynamic push-in and pan along scroll timeline
  const isMaster = film.id === "master";
  
  // Transition between Campus Establishing plate and Executive Office Interior plate
  const campusOpacity = isMaster ? Math.max(0, 1 - Math.max(0, (progress - 0.58) / 0.18)) : 0;
  const officeOpacity = isMaster ? clamp((progress - 0.62) / 0.18) : 1;

  // Continuous Camera Dolly Transform (Smooth 35mm optical push-in toward the entrance monument)
  const scale = 1.0 + progress * 0.45;
  const panX = -progress * 6.8;
  const panY = -progress * 4.5;

  return (
    <div
      ref={containerRef}
      className="realistic-cinema-engine"
      aria-label="Real camera documentary film"
    >
      {/* 1. Chapter 00: Real Corporate Campus Establishing Cinema Plate (Google-Style Glass Architecture) */}
      {isMaster && (
        <div
          className="cinema-plate-layer campus-plate"
          style={{
            opacity: campusOpacity,
            transform: `scale(${scale}) translate(${panX}%, ${panY}%)`,
          }}
        >
          <img
            src="/assets/brand/campus-digiformation-hq.jpg"
            alt="DigiFormation Global Headquarters Campus"
            className="cinema-still-poster"
          />
        </div>
      )}

      {/* 2. Executive Office Interior Cinema Plate featuring Director Haroon & Vance */}
      <div
        className="cinema-plate-layer office-plate"
        style={{
          opacity: officeOpacity,
          transform: isMaster
            ? `scale(${1.0 + (progress - 0.6) * 0.15})`
            : `scale(${1.0 + progress * 0.08})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] via-[#090d15]/80 to-[#0c121d]" />
        {/* Real Executive Suite Architectural Slat Wall and Mood Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(30,58,138,0.25)_0%,transparent_70%)]" />
      </div>

      {/* 3. Authentic 35mm Photochemical Film Grain Overlay */}
      <div className="cinema-film-grain" aria-hidden="true" />

      {/* 4. Anamorphic Cine Lens Peripheral Vignette */}
      <div className="cinema-anamorphic-vignette" aria-hidden="true" />

      {/* 5. Real Film Telemetry / Cinema Camera Monitor HUD */}
      {hudVisible && (
        <aside className="cinema-hud" aria-label="Cinema Camera Information">
          <div className="cinema-hud-top-left">
            <span className="cinema-rec-dot" aria-hidden="true" />
            <span className="cinema-rec-label">REC</span>
            <span className="cinema-timecode">{timecode}</span>
          </div>

          <div className="cinema-hud-top-right">
            <span className="cinema-hud-spec">35mm Anamorphic · T1.4</span>
            <span className="cinema-hud-spec">24.000 FPS</span>
            <span className="cinema-hud-spec">ISO 320</span>
            {film.id === "biz-os" && (
              <span className="cinema-hud-spec text-amber-400 flex items-center gap-1">
                <img
                  src="/assets/brand/digibiz-hat-logo.png"
                  alt="DigiBiz Hat Logo"
                  className="w-3.5 h-3.5 rounded-full inline"
                />
                DIGI BIZ OS
              </span>
            )}
          </div>

          <div className="cinema-hud-bottom-right">
            <button
              type="button"
              className="cinema-audio-btn"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Mute ambient audio" : "Play ambient audio"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={13} className="inline mr-1 text-emerald-400" />
                  <span>Ambience Active</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} className="inline mr-1 opacity-60" />
                  <span>Ambience Off</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="cinema-hud-toggle"
              onClick={() => setHudVisible(false)}
              aria-label="Hide Cinema HUD overlay"
            >
              <EyeOff size={12} className="inline mr-1 opacity-70" />
              <span>Hide HUD</span>
            </button>
          </div>
        </aside>
      )}

      {!hudVisible && (
        <button
          type="button"
          className="cinema-hud-restore-btn"
          onClick={() => setHudVisible(true)}
          aria-label="Show Cinema HUD"
        >
          <Eye size={12} className="inline mr-1" />
          <span>HUD</span>
        </button>
      )}
    </div>
  );
};
