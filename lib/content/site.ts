/**
 * SITE / EVENT CONFIGURATION (brief §10.2 "config/site").
 * Identity of the event, edition facts, preview options. Proper names are data
 * (not translated); interface wording lives in ./copy.
 */
import { DEFAULT_LOCALE, LOCALES } from "./languages";

export const event = {
  /** Public short name. Always JIA, never GIA. */
  shortName: "JIA",
  /** Full name as printed on the official badge and poster. */
  fullName: "Jornadas de Innovación de Almería",
  /** Three-line lockup used next to the wordmark (render composition). */
  nameLines: ["Jornadas de", "Innovación de", "Almería"] as const,
  /** Edition hashtag printed on every official asset. */
  hashtag: "#JIA26",
  organizerName: "CEP de Almería",
} as const;

/**
 * EDITION TITLE — OPEN DECISION.
 * The brief (17-09-2026) states «Aula de cine: El reto». Every printed asset
 * (event poster + 9 workshop posters, 15-09-2026) prints «Almería, aulas de
 * cine: El duelo». The brief is the later, explicit statement of the promoter,
 * so it is displayed; the poster wording is kept here so switching is a
 * one-line change. Status stays provisional until the organisation confirms.
 */
export const edition = {
  title: "Aula de cine: El reto",
  titleStatus: "provisional" as const,
  titleAlternates: [
    { value: "Almería, aulas de cine: El duelo", source: "assets/cep/CARTEL #JIA26 (9).png and talleres-carteles/*.png" },
  ],
  year: 2026,
  /** Confirmed by the brief: two days. Dates live in data/program.ts. */
  dayCount: 2,
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
    markProvisional: true,
  },
} as const;
