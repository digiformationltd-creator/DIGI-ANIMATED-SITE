import { FilmConfig, FilmId } from "../types/film";
// UK LTD
import { Scene01Decision } from "../scenes/Scene01Decision";
import { Scene02Order } from "../scenes/Scene02Order";
import { Scene03Verification } from "../scenes/Scene03Verification";
import { Scene04Address } from "../scenes/Scene04Address";
import { Scene05CompaniesHouse } from "../scenes/Scene05CompaniesHouse";
import { Scene06Certificate } from "../scenes/Scene06Certificate";
import { Scene07SoftwareForge } from "../scenes/Scene07SoftwareForge";
import { Scene08Banking } from "../scenes/Scene08Banking";
import { Scene09TaxCredentials } from "../scenes/Scene09TaxCredentials";
import { Scene10Complete } from "../scenes/Scene10Complete";

// US LLC
import { SceneUS01Idea } from "../scenes/us/SceneUS01Idea";
import { SceneUS02State } from "../scenes/us/SceneUS02State";
import { SceneUS03Address } from "../scenes/us/SceneUS03Address";
import { SceneUS04LLCFiling } from "../scenes/us/SceneUS04LLCFiling";
import { SceneUS05EIN } from "../scenes/us/SceneUS05EIN";
import { SceneUS06ITIN } from "../scenes/us/SceneUS06ITIN";
import { SceneUS07Website } from "../scenes/us/SceneUS07Website";
import { SceneUS08Banking } from "../scenes/us/SceneUS08Banking";
import { SceneUS09Ready } from "../scenes/us/SceneUS09Ready";

// Compliance
import { SceneComp01Active } from "../scenes/compliance/SceneComp01Active";
import { SceneComp02Due } from "../scenes/compliance/SceneComp02Due";
import { SceneComp03Issue } from "../scenes/compliance/SceneComp03Issue";
import { SceneComp04Intervention } from "../scenes/compliance/SceneComp04Intervention";
import { SceneComp05UpToDate } from "../scenes/compliance/SceneComp05UpToDate";

// Digital Build
import { SceneDigi01Idea } from "../scenes/digital/SceneDigi01Idea";
import { SceneDigi02Website } from "../scenes/digital/SceneDigi02Website";
import { SceneDigi03Spatial } from "../scenes/digital/SceneDigi03Spatial";
import { SceneDigi04Agentic } from "../scenes/digital/SceneDigi04Agentic";
import { SceneDigi05System } from "../scenes/digital/SceneDigi05System";

// Digi Biz OS
import { SceneOS01VoiceWake } from "../scenes/bizos/SceneOS01VoiceWake";
import { SceneOS02SubAgents } from "../scenes/bizos/SceneOS02SubAgents";
import { SceneOS03ToolsSkills } from "../scenes/bizos/SceneOS03ToolsSkills";
import { SceneOS04AutonomousOps } from "../scenes/bizos/SceneOS04AutonomousOps";
import { SceneOS05SovereignOS } from "../scenes/bizos/SceneOS05SovereignOS";

// Master Space
import { SceneMasterPortals } from "../scenes/master/SceneMasterPortals";

export const FILM_REGISTRY: Record<FilmId, FilmConfig> = {
  master: {
    id: "master",
    route: "/",
    title: "DIGIFORMATION NEXUS",
    subtitle: "BUILD YOUR BUSINESS. BUILD YOUR DIGITAL FUTURE.",
    shortLabel: "MASTER NEXUS",
    kicker: "ARCHITECTURAL PORTAL",
    badge: "5 CINEMATIC PATHWAYS",
    description: "Welcome to the DigiFormation ecosystem. Select an enterprise pathway to enter its dedicated scroll-driven cinematic journey.",
    seoTitle: "DigiFormation — Cinematic Business Ecosystem & Enterprise Solutions",
    seoDescription: "Explore DigiFormation's 5 cinematic service experiences: UK LTD Formation, US LLC Formation, Company Compliance, Digital Product Build, and Digi Biz OS.",
    timelineSteps: [
      { label: "01 UK LTD", pos: 0.1 },
      { label: "02 US LLC", pos: 0.3 },
      { label: "03 COMPLY", pos: 0.5 },
      { label: "04 BUILD", pos: 0.7 },
      { label: "05 BIZ OS", pos: 0.9 },
    ],
    createScenes: () => [new SceneMasterPortals()],
  },

  "uk-ltd": {
    id: "uk-ltd",
    route: "/uk-ltd-formation",
    title: "UK LTD FORMATION",
    subtitle: "Sovereign British Corporate Entity",
    shortLabel: "01 UK LTD",
    kicker: "CINEMATIC CHAPTER 01 · 10 REELS",
    badge: "ENGLISH COMMON LAW",
    description: "The complete UK LTD incorporation journey: from name selection and identity verification to Companies House submission, official certificate, banking rails, and tax credentials.",
    seoTitle: "UK LTD Formation — DigiFormation Cinematic Film",
    seoDescription: "Official UK Limited Company incorporation film with Companies House integration, registered office address, business banking, and HMRC credentials.",
    nextFilmRoute: "/digital-build",
    nextFilmLabel: "NEXT CHAPTER: DIGITAL BUILD →",
    timelineSteps: [
      { label: "01 DECISION", pos: 0.0 },
      { label: "02 ORDER", pos: 0.1 },
      { label: "03 VERIFY", pos: 0.2 },
      { label: "04 ADDRESS", pos: 0.3 },
      { label: "05 DISPATCH", pos: 0.4 },
      { label: "06 CREATED", pos: 0.5 },
      { label: "07 WEBSITE", pos: 0.6 },
      { label: "08 BANKING", pos: 0.7 },
      { label: "09 UTR KEY", pos: 0.8 },
      { label: "10 LAUNCH", pos: 0.9 },
    ],
    createScenes: () => [
      new Scene01Decision(),
      new Scene02Order(),
      new Scene03Verification(),
      new Scene04Address(),
      new Scene05CompaniesHouse(),
      new Scene06Certificate(),
      new Scene07SoftwareForge(),
      new Scene08Banking(),
      new Scene09TaxCredentials(),
      new Scene10Complete(),
    ],
  },

  "us-llc": {
    id: "us-llc",
    route: "/us-llc-formation",
    title: "US LLC FORMATION",
    subtitle: "American Sovereign Commercial Entity",
    shortLabel: "02 US LLC",
    kicker: "CINEMATIC CHAPTER 02 · 9 REELS",
    badge: "AMERICAN JURISDICTION",
    description: "The American venture journey: State selection, registered agent in Cheyenne, Articles of Organization filing, IRS EIN issuance, ITIN, and US commercial checking rails.",
    seoTitle: "US LLC Formation — DigiFormation Cinematic Film",
    seoDescription: "Incorporate a US LLC in Wyoming or Delaware with registered agent, IRS EIN tax ID, domestic US business banking, and e-commerce infrastructure.",
    nextFilmRoute: "/digital-build",
    nextFilmLabel: "NEXT CHAPTER: DIGITAL BUILD →",
    timelineSteps: [
      { label: "01 IDEA", pos: 0.0 },
      { label: "02 STATE", pos: 0.11 },
      { label: "03 AGENT", pos: 0.22 },
      { label: "04 FILING", pos: 0.33 },
      { label: "05 EIN IRS", pos: 0.44 },
      { label: "06 ITIN", pos: 0.55 },
      { label: "07 STORE", pos: 0.66 },
      { label: "08 BANKING", pos: 0.77 },
      { label: "09 READY", pos: 0.88 },
    ],
    createScenes: () => [
      new SceneUS01Idea(),
      new SceneUS02State(),
      new SceneUS03Address(),
      new SceneUS04LLCFiling(),
      new SceneUS05EIN(),
      new SceneUS06ITIN(),
      new SceneUS07Website(),
      new SceneUS08Banking(),
      new SceneUS09Ready(),
    ],
  },

  compliance: {
    id: "compliance",
    route: "/company-compliance",
    title: "COMPANY COMPLIANCE",
    subtitle: "Annual Statutory Maintenance & Good Standing",
    shortLabel: "03 COMPLY",
    kicker: "CINEMATIC CHAPTER 03 · 5 REELS",
    badge: "GOOD STANDING SHIELD",
    description: "Protecting your corporate entity: Confirmation Statements (CS01), statutory accounts, address amendments (AD01), and Companies House authentication code recovery.",
    seoTitle: "Company Compliance & Secretarial — DigiFormation Cinematic Film",
    seoDescription: "Automate company compliance with Companies House confirmation statements, statutory filings, registered office address changes, and penalty protection.",
    nextFilmRoute: "/digital-build",
    nextFilmLabel: "NEXT CHAPTER: DIGITAL BUILD →",
    timelineSteps: [
      { label: "01 STATUS", pos: 0.0 },
      { label: "02 DUE DATE", pos: 0.2 },
      { label: "03 ISSUE", pos: 0.4 },
      { label: "04 RESOLVE", pos: 0.6 },
      { label: "05 SECURE", pos: 0.8 },
    ],
    createScenes: () => [
      new SceneComp01Active(),
      new SceneComp02Due(),
      new SceneComp03Issue(),
      new SceneComp04Intervention(),
      new SceneComp05UpToDate(),
    ],
  },

  "digital-build": {
    id: "digital-build",
    route: "/digital-build",
    title: "WEBSITE · 3D WEBGL · AGENTIC SOFTWARE",
    subtitle: "Sovereign Digital Product Architecture",
    shortLabel: "04 BUILD",
    kicker: "CINEMATIC CHAPTER 04 · 5 REELS",
    badge: "DIGITAL FORGE",
    description: "DigiFormation does not build ordinary webpages: High-performance React web applications, 3D WebGL spatial computing, and autonomous agentic software systems.",
    seoTitle: "Website, 3D WebGL & Agentic Software — DigiFormation",
    seoDescription: "Custom engineering for high-performance websites, real-time 3D Three.js experiences, and autonomous AI agentic software for modern businesses.",
    nextFilmRoute: "/digi-biz-os",
    nextFilmLabel: "NEXT CHAPTER: DIGI BIZ OS →",
    timelineSteps: [
      { label: "01 BLUEPRINT", pos: 0.0 },
      { label: "02 WEB APP", pos: 0.2 },
      { label: "03 3D WEBGL", pos: 0.4 },
      { label: "04 AGENTS", pos: 0.6 },
      { label: "05 SYSTEM", pos: 0.8 },
    ],
    createScenes: () => [
      new SceneDigi01Idea(),
      new SceneDigi02Website(),
      new SceneDigi03Spatial(),
      new SceneDigi04Agentic(),
      new SceneDigi05System(),
    ],
  },

  "biz-os": {
    id: "biz-os",
    route: "/digi-biz-os",
    title: "DIGI BIZ OS",
    subtitle: "The Voice-Controlled Business Operating System",
    shortLabel: "05 BIZ OS",
    kicker: "CINEMATIC CHAPTER 05 · 5 REELS",
    badge: "VOICE OS · 700+ AGENTS",
    description: "The premier enterprise operating system: Ambient voice commands, 200+ tools, 700+ sub-agents, and 600+ skills autonomously running your enterprise.",
    seoTitle: "Digi Biz OS — The Voice-Controlled Business Operating System",
    seoDescription: "Operate your entire commercial enterprise with ambient voice intelligence: 200+ tools, 700+ autonomous sub-agents, and 600+ skills.",
    nextFilmRoute: "/",
    nextFilmLabel: "RETURN TO MASTER NEXUS ↺",
    timelineSteps: [
      { label: "01 VOICE", pos: 0.0 },
      { label: "02 SWARM", pos: 0.2 },
      { label: "03 TOOLS", pos: 0.4 },
      { label: "04 AUTONOMY", pos: 0.6 },
      { label: "05 SYSTEM", pos: 0.8 },
    ],
    createScenes: () => [
      new SceneOS01VoiceWake(),
      new SceneOS02SubAgents(),
      new SceneOS03ToolsSkills(),
      new SceneOS04AutonomousOps(),
      new SceneOS05SovereignOS(),
    ],
  },

  "digi-biz-os": {
    id: "digi-biz-os",
    route: "/digi-biz-os",
    title: "DIGI BIZ OS",
    subtitle: "The Voice-Controlled Business Operating System",
    shortLabel: "05 BIZ OS",
    kicker: "CINEMATIC CHAPTER 05 · 5 REELS",
    badge: "VOICE OS · 700+ AGENTS",
    description: "The premier enterprise operating system: Ambient voice commands, 200+ tools, 700+ sub-agents, and 600+ skills autonomously running your enterprise.",
    seoTitle: "Digi Biz OS — The Voice-Controlled Business Operating System",
    seoDescription: "Operate your entire commercial enterprise with ambient voice intelligence: 200+ tools, 700+ autonomous sub-agents, and 600+ skills.",
    nextFilmRoute: "/",
    nextFilmLabel: "RETURN TO MASTER NEXUS ↺",
    timelineSteps: [
      { label: "01 VOICE", pos: 0.0 },
      { label: "02 SWARM", pos: 0.2 },
      { label: "03 TOOLS", pos: 0.4 },
      { label: "04 AUTONOMY", pos: 0.6 },
      { label: "05 SYSTEM", pos: 0.8 },
    ],
    createScenes: () => [
      new SceneOS01VoiceWake(),
      new SceneOS02SubAgents(),
      new SceneOS03ToolsSkills(),
      new SceneOS04AutonomousOps(),
      new SceneOS05SovereignOS(),
    ],
  },
};

export const FILM_LIST: FilmConfig[] = [
  FILM_REGISTRY.master,
  FILM_REGISTRY["uk-ltd"],
  FILM_REGISTRY["us-llc"],
  FILM_REGISTRY.compliance,
  FILM_REGISTRY["digital-build"],
  FILM_REGISTRY["biz-os"],
];

export function getFilmByRoute(pathname: string): FilmConfig {
  const trimmed = pathname.trim().replace(/\/+$/, "");
  const normalized = trimmed === "" ? "/" : trimmed;
  const found = FILM_LIST.find((f) => f.route === normalized);
  return found || FILM_REGISTRY.master;
}

export function getFilmById(id: FilmId): FilmConfig {
  return FILM_REGISTRY[id] || FILM_REGISTRY.master;
}
