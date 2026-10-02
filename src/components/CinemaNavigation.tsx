import React, { useState } from "react";
import { Volume2, VolumeX, MessageSquare, Terminal, ChevronLeft, Film } from "lucide-react";
import { AudioAtmosphereEngine } from "../core/AudioAtmosphereEngine";
import { FilmConfig, FilmId } from "../types/film";

interface CinemaNavigationProps {
  currentFilm: FilmConfig;
  onSelectFilm: (filmId: FilmId) => void;
  onToggleDebug: () => void;
  isDebug: boolean;
}

export const CinemaNavigation: React.FC<CinemaNavigationProps> = ({
  currentFilm,
  onSelectFilm,
  onToggleDebug,
  isDebug,
}) => {
  const [audioActive, setAudioActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleAudio = () => {
    const active = AudioAtmosphereEngine.getInstance().toggle();
    setAudioActive(active);
  };

  const navFilms: { id: FilmId; label: string; num: string }[] = [
    { id: "uk-ltd", label: "UK LTD", num: "01" },
    { id: "us-llc", label: "US LLC", num: "02" },
    { id: "compliance", label: "COMPLIANCE", num: "03" },
    { id: "digital-build", label: "DIGITAL BUILD", num: "04" },
    { id: "biz-os", label: "DIGI BIZ OS", num: "05" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between pointer-events-auto">
      {/* Brand Identity / Home Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSelectFilm("master")}
          className="group flex items-center gap-2 sm:gap-3 bg-black/60 sm:bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 hover:border-white/30 transition shadow-lg text-left"
          title="Return to DigiFormation Master Space"
        >
          {currentFilm.id !== "master" && (
            <ChevronLeft size={14} className="text-slate-400 group-hover:text-white transition-transform group-hover:-translate-x-0.5" />
          )}
          <img
            src="/assets/brand/digiformation-logo-official.png"
            alt="DigiFormation Logo"
            className="h-4 sm:h-5 w-auto object-contain brightness-110"
          />
          <div className="h-2.5 sm:h-3 w-px bg-white/20" />
          <span className="text-[9px] sm:text-[11px] font-mono tracking-widest text-slate-300 uppercase">
            {currentFilm.shortLabel}
          </span>
        </button>
      </div>

      {/* Center Minimal Cinematic Film-Strip Switcher (Desktop) */}
      <nav
        aria-label="Cinematic Film Switcher"
        className="hidden lg:flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 shadow-2xl"
      >
        <button
          onClick={() => onSelectFilm("master")}
          className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition ${
            currentFilm.id === "master"
              ? "bg-white text-black font-bold shadow-md"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          NEXUS
        </button>
        <div className="h-3 w-px bg-white/10 mx-1" />
        {navFilms.map((f) => {
          const isActive = currentFilm.id === f.id;
          const isBizOs = f.id === "biz-os";
          return (
            <button
              key={f.id}
              onClick={() => onSelectFilm(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isBizOs ? (
                <img
                  src="/assets/brand/digibiz-hat-logo.png"
                  alt="Digi Biz OS"
                  className="w-3.5 h-3.5 rounded-full object-cover border border-amber-400/50 shadow-sm"
                />
              ) : (
                <span className={isActive ? "text-slate-600" : "text-slate-500"}>{f.num}</span>
              )}
              <span>{f.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Film Selector Trigger */}
      <div className="lg:hidden relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-slate-300"
        >
          <Film size={12} className="text-sky-400" />
          <span>REELS</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl py-2 z-50 flex flex-col">
            <button
              onClick={() => {
                onSelectFilm("master");
                setMenuOpen(false);
              }}
              className={`px-3 py-2 text-left text-xs font-mono transition ${
                currentFilm.id === "master" ? "text-white bg-white/10 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              00 · MASTER NEXUS
            </button>
            <div className="h-px bg-white/10 my-1" />
            {navFilms.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onSelectFilm(f.id);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-left text-xs font-mono transition ${
                  currentFilm.id === f.id ? "text-white bg-white/10 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {f.id === "biz-os" && (
                  <img
                    src="/assets/brand/digibiz-hat-logo.png"
                    alt="Digi Biz OS"
                    className="w-4 h-4 rounded-full object-cover border border-amber-400/50"
                  />
                )}
                <span>{f.num} · {f.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Utility Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Debug HUD Toggle */}
        <button
          onClick={onToggleDebug}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono border transition backdrop-blur-md ${
            isDebug
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-black/40 text-slate-400 border-white/10 hover:text-white"
          }`}
          title="Toggle Technical Telemetry HUD [D]"
        >
          <Terminal size={11} />
          <span>HUD</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono border backdrop-blur-md transition ${
            audioActive
              ? "bg-white/15 text-white border-white/30"
              : "bg-black/40 text-slate-400 border-white/10 hover:text-white hover:border-white/20"
          }`}
          title="Toggle Ambient Audio"
        >
          {audioActive ? <Volume2 size={12} className="text-emerald-400" /> : <VolumeX size={12} />}
          <span className="hidden sm:inline">{audioActive ? "AUDIO ON" : "AUDIO MUTED"}</span>
          <span className="sm:hidden">{audioActive ? "ON" : "MUTE"}</span>
        </button>

        {/* WhatsApp Direct Action */}
        <a
          href="https://wa.me/923164467464"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-white text-black hover:bg-slate-200 transition shadow-md font-sans"
        >
          <MessageSquare size={13} />
          <span>Official Support</span>
        </a>
      </div>
    </header>
  );
};
