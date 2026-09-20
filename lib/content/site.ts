/**
 * SITE / EVENT CONFIGURATION (brief §10.2 "config/site").
 * Identity of the event, edition facts, preview options. Proper names are data
 * (not translated); interface wording lives in ./copy.
 */
import { DEFAULT_LOCALE, LOCALES } from "./languages";
import type { EditorialStatus } from "./data/types";

export const event = {
  /** Public short name. Always JIA, never GIA. */
  shortName: "JIA",
  /** Full name as printed on the official badge and poster. */
  fullName: "",
  /** Three-line lockup used next to the wordmark (render composition). */
  nameLines: ["Jornadas de", "Innovación de", "Almería"] as const,
  /** Edition hashtag printed on every official asset. */
  hashtag: "#JIA26",
  organizerName: "CEP de Almería",
} as const;

/**
 * EDITION TITLE — decided by the promoter on 18-09-2026 (JIA-2026-09-18-14): «Aulas de cine: el duelo»,
 * the wording of every printed asset (event poster + 9 workshop posters, 15-09-2026, which print
 * «Almería, aulas de cine: El duelo»). The brief of 17-09-2026 said «Aula de cine: El reto»; it is
 * kept below as an alternate so the history stays readable.
 */
export const edition = {
  title: "Jornadas de Innovación de Almería",
  titleStatus: "confirmed" as EditorialStatus,
  titleAlternates: [
    { value: "Almería, aulas de cine: El duelo", source: "assets/cep/CARTEL #JIA26 (9).png and talleres-carteles/*.png" },
    { value: "Aula de cine: El reto", source: "assets/requirements/JIA-boceto-requisitos-y-metaprompt.md (brief, 17-09-2026), superseded" },
  ],
  year: 2026,
  /** Confirmed by the brief: two days. Dates live in data/program.ts. */
  dayCount: 2,
} as const;

/** Production credit requested by the promoter (JIA-2026-09-18-09); mark copied from the studio's own site kit. */
export const productionStudio = {
  name: "South Desert Studio",
  url: "https://southdesertstudio.com",
  mark: { src: "/brand/south-desert-studio.png", width: 400, height: 400 },
} as const;

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  preview: {
    /**
     * While true, provisional/demo content shows a small visible mark so
     * reviewers can tell proposals from confirmed facts. Set to false only
     * after every marked item has been validated or removed (brief §12).
     */
    markProvisional: false,
  },
} as const;
