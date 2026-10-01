import { QualityTier } from "../types/cinema";

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private fps: number = 60;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private qualityTier: QualityTier = "HIGH";
  private isTabActive: boolean = true;
  private listeners: Set<(tier: QualityTier) => void> = new Set();

  private constructor() {
    this.detectInitialTier();
    this.bindVisibility();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private detectInitialTier(): void {
    if (typeof window === "undefined") return;

    // Mobile / small screens default to MEDIUM for thermal comfort
    if (window.innerWidth < 768) {
      this.qualityTier = "MEDIUM";
      return;
    }

    // High performance hardware concurrency check
    const cores = navigator.hardwareConcurrency || 4;
    if (cores >= 8) {
      this.qualityTier = "HIGH";
    } else if (cores >= 4) {
      this.qualityTier = "MEDIUM";
    } else {
      this.qualityTier = "LOW";
    }
  }

  private bindVisibility(): void {
    if (typeof document === "undefined") return;

    document.addEventListener("visibilitychange", () => {
      this.isTabActive = document.visibilityState === "visible";
    });
  }

  public tick(): void {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = now;

      // Automatic downgrade if FPS drops below thresholds
      if (this.fps < 28 && this.qualityTier === "HIGH") {
        this.setQualityTier("MEDIUM");
      } else if (this.fps < 20 && this.qualityTier === "MEDIUM") {
        this.setQualityTier("LOW");
      }
    }
  }

  public setQualityTier(tier: QualityTier): void {
    if (this.qualityTier !== tier) {
      this.qualityTier = tier;
      for (const listener of this.listeners) {
        listener(tier);
      }
    }
  }

  public onQualityChange(listener: (tier: QualityTier) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getFps(): number {
    return this.fps;
  }

  public getQualityTier(): QualityTier {
    return this.qualityTier;
  }

  public shouldRender(): boolean {
    return this.isTabActive;
  }

  public getRecommendedDpr(): number {
    if (typeof window === "undefined") return 1;
    const maxDpr = this.qualityTier === "HIGH" ? 1.75 : this.qualityTier === "MEDIUM" ? 1.25 : 1.0;
    return Math.min(window.devicePixelRatio || 1, maxDpr);
  }
}
