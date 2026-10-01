import { CinematicScene } from "./cinema";

export type FilmId =
  | "master"
  | "uk-ltd"
  | "us-llc"
  | "compliance"
  | "digital-build"
  | "digi-biz-os"
  | "biz-os";

export interface FilmStep {
  label: string;
  pos: number;
}

export interface FilmConfig {
  id: FilmId;
  route: string;
  title: string;
  subtitle: string;
  shortLabel: string;
  kicker: string;
  badge: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  nextFilmRoute?: string;
  nextFilmLabel?: string;
  timelineSteps: FilmStep[];
  createScenes: () => CinematicScene[];
}
