export class AudioAtmosphereEngine {
  private static instance: AudioAtmosphereEngine;
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isEnabled: boolean = false;

  private constructor() {}

  public static getInstance(): AudioAtmosphereEngine {
    if (!AudioAtmosphereEngine.instance) {
      AudioAtmosphereEngine.instance = new AudioAtmosphereEngine();
    }
    return AudioAtmosphereEngine.instance;
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
      return this.isEnabled;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
      this.isEnabled = true;
    } else if (this.ctx.state === "running") {
      this.ctx.suspend();
      this.isEnabled = false;
    }
    return this.isEnabled;
  }

  private init(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      this.ctx = ctx;

      // Soft binaural atmospheric hum
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.075;
        b2 = 0.969 * b2 + white * 0.153;
        output[i] = (b0 + b1 + b2) * 0.05;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 340; // Soft warm executive room resonance

      const gain = ctx.createGain();
      gain.gain.value = 0.04;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      this.gainNode = gain;
      this.noiseNode = whiteNoise;
      this.isEnabled = true;
    } catch (err) {
      console.warn("[AudioAtmosphereEngine] Audio init suppressed:", err);
    }
  }

  // Play subtle cinematic shutter click when scrolling reaches a milestone
  public playShutterClick(): void {
    if (!this.ctx || this.ctx.state !== "running") return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  // Milestone confirmation chime (used when company created / verified)
  public playConfirmationChime(): void {
    if (!this.ctx || this.ctx.state !== "running") return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1); // E5

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {}
  }

  public getStatus(): boolean {
    return this.isEnabled;
  }

  // Cinematic Event Hooks for Future Sound Design (Prompt Section 19)
  public emitEvent(
    event:
      | "film:start"
      | "scene:change"
      | "service:selected"
      | "verification:complete"
      | "company:incorporated"
      | "compliance:resolved"
      | "website:complete"
      | "3d:activated"
      | "voice:command"
      | "agent:processing"
      | "agent:complete"
      | "film:complete",
    payload?: any
  ): void {
    if (this.isEnabled) {
      if (event === "scene:change") this.playShutterClick();
      if (event === "company:incorporated" || event === "compliance:resolved" || event === "film:complete") {
        this.playConfirmationChime();
      }
    }
    // Dispatch custom DOM event for decoupled sound design systems
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(`cinema:${event}`, { detail: payload }));
    }
  }
}
