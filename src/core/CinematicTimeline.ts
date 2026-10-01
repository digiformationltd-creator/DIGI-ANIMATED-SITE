import Lenis from "lenis";
import { TimelineState } from "../types/cinema";

type ProgressListener = (state: TimelineState) => void;

export class CinematicTimeline {
  private lenis: Lenis | null = null;
  private progress: number = 0;
  private smoothProgress: number = 0;
  private velocity: number = 0;
  private lastProgress: number = 0;
  private direction: "down" | "up" | "idle" = "idle";
  private listeners: Set<ProgressListener> = new Set();
  private rafId: number = 0;
  private isDestroyed: boolean = false;
  private reducedMotion: boolean = false;
  private mediaQueryList: MediaQueryList | null = null;
  private onMotionChange: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    this.checkReducedMotion();
    this.initLenis();
    this.bindEvents();
    this.startLoop();
  }

  private checkReducedMotion(): void {
    if (typeof window !== "undefined") {
      this.mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reducedMotion = this.mediaQueryList.matches;
      this.onMotionChange = (e: MediaQueryListEvent) => {
        this.reducedMotion = e.matches;
      };
      this.mediaQueryList.addEventListener("change", this.onMotionChange);
    }
  }

  private initLenis(): void {
    if (typeof window === "undefined") return;

    try {
      this.lenis = new Lenis({
        duration: this.reducedMotion ? 0.3 : 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !this.reducedMotion,
        touchMultiplier: 1.5,
      });
    } catch (err) {
      console.warn("[CinematicTimeline] Lenis fallback to standard window scroll:", err);
    }
  }

  private bindEvents(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("scroll", this.onWindowScroll, { passive: true });
    window.addEventListener("resize", this.onWindowScroll, { passive: true });
    window.addEventListener("keydown", this.onKeyDown);
  }

  private onWindowScroll = (): void => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const raw = scrollHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollHeight)) : 0;
    this.progress = raw;

    const delta = raw - this.lastProgress;
    if (Math.abs(delta) > 0.0001) {
      this.direction = delta > 0 ? "down" : "up";
    } else {
      this.direction = "idle";
    }
    this.velocity = delta;
    this.lastProgress = raw;
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const step = 0.1; // 10% scroll jump per key

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      this.scrollTo(Math.min(1, this.progress + step));
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      this.scrollTo(Math.max(0, this.progress - step));
    } else if (e.key === "Home") {
      e.preventDefault();
      this.scrollTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      this.scrollTo(1);
    }
  };

  public scrollTo(targetProgress: number, duration: number = 1.2): void {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = targetProgress * maxScroll;

    if (duration === 0) {
      this.progress = targetProgress;
      this.smoothProgress = targetProgress;
      if (this.lenis) {
        this.lenis.scrollTo(targetY, { immediate: true });
      } else {
        window.scrollTo({ top: targetY, behavior: "instant" });
      }
      return;
    }

    if (this.lenis) {
      this.lenis.scrollTo(targetY, { duration });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }

  private startLoop = (): void => {
    const tick = (time: number) => {
      if (this.isDestroyed) return;

      if (this.lenis) {
        this.lenis.raf(time);
      }

      // Spring damped lerp for camera crane inertia (0.12 factor gives majestic cinematic weight)
      const lerpSpeed = this.reducedMotion ? 0.35 : 0.12;
      this.smoothProgress += (this.progress - this.smoothProgress) * lerpSpeed;

      const state: TimelineState = {
        progress: this.progress,
        smoothProgress: this.smoothProgress,
        activeSceneIndex: 0,
        velocity: this.velocity,
        direction: this.direction,
        isScrubbing: Math.abs(this.progress - this.smoothProgress) > 0.001,
      };

      this.notifyListeners(state);
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  };

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(state: TimelineState): void {
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  public getProgress(): number {
    return this.progress;
  }

  public getSmoothProgress(): number {
    return this.smoothProgress;
  }

  public isReducedMotion(): boolean {
    return this.reducedMotion;
  }

  public destroy(): void {
    this.isDestroyed = true;
    cancelAnimationFrame(this.rafId);
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.onWindowScroll);
      window.removeEventListener("resize", this.onWindowScroll);
      window.removeEventListener("keydown", this.onKeyDown);
      if (this.mediaQueryList && this.onMotionChange) {
        this.mediaQueryList.removeEventListener("change", this.onMotionChange);
        this.mediaQueryList = null;
        this.onMotionChange = null;
      }
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    this.listeners.clear();
  }
}
