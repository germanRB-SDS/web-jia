/**
 * THE COPY CONTRACT. Every locale file satisfies this type exactly, so a
 * missing string is a build error, not a blank. Proper names (event, people,
 * workshop titles, venues) are NOT copy: they live in ../site.ts and ../data.
 */
import type { EditorialStatus, PersonRole, Resource } from "../data/types";

export type Buttons = {
  hero: { explore: string; workshops: string };
  sheet: { open: string; close: string; viewDocument: string; viewPoster: string; downloadDossier: string; dossierPending: string };
  dossiers: { consult: string; view: string; download: string };
  proposals: { present: string };
  host: { host: string };
  nav: { menu: string; close: string; submenu: string };
  /** Control of the animated road in Jornadas (icon button: this is its accessible name). */
  route: { replay: string };
  /** Controls over the Jornadas intro video (icon buttons: these are their accessible names). */
  video: { play: string; pause: string; mute: string; unmute: string };
  /** Arrows of the team cube (icon buttons: these are their accessible names). */
  cube: { prev: string; next: string };
};

export type WorkshopCopy = {
  /** Subtitle as printed on the poster (kept verbatim, translated only if the poster is). */
  subtitle: string;
  theme: string;
  summary: string;
  objectives: string[] | null;
  stages: string | null;
  duration: string | null;
  place: string | null;
  requirements: string | null;
  status: EditorialStatus;
};

export type ExperienceCopy = {
  title: string;
  lede: string;
  presents: string | null;
  audience: string | null;
  need: string | null;
  development: string | null;
  resources: string | null;
  learnings: string | null;
  adaptations: string | null;
  status: EditorialStatus;
};

export type ResourceCopy = { title: string; summary: string; status: EditorialStatus };

export type Copy = {
  metadata: { title: string; description: string };
  nav: {
    skip: string;
    home: string;
    areas: { jornadas: string; dosieres: string; experiencias: string; propuestas: string; acoge: string };
    jornadas: { programa: string; comoFuncionan: string; talleres: string };
  };
  a11y: {
    wordmark: string;
    badge: string;
    heroImage: string;
    cartel: string;
    /** `{title}` */
    posterOf: string;
    /** `{name}`, `{role}` */
    cardOf: string;
    /** `{title}` */
    sheetOf: string;
    teamRegion: string;
    /** `{venue}` */
    venueMap: string;
    waypointsRegion: string;
    mainNav: string;
    provisionalMark: string;
  };
  states: {
    provisional: string;
    demo: string;
    pending: string;
    fromPoster: string;
    sheetPending: string;
    dateTbc: string;
    venueTbc: string;
    hoursTbc: string;
  };
  buttons: Buttons;
  hero: { lede: string; note: string; noteStatus: EditorialStatus };
  waypoints: { title: string; items: Record<string, { label: string; line: string }> };
  jornadas: {
    title: string;
    intro: string;
    /** The animated road under the intro (stop labels come from config/talleres.ts). */
    route: { regionLabel: string };
    /** The "Intro" block with the video, before the programme. */
    introVideo: { title: string; videoLabel: string };
    program: {
      title: string;
      /** `{n}` */
      dayLabel: string;
      venueLabel: string;
      hoursLabel: string;
      locationLabel: string;
      directions: string;
      sessions: Record<string, string>;
    };
    how: { title: string; paragraphs: string[]; status: EditorialStatus };
    team: {
      title: string;
      lede: string;
      roles: Record<PersonRole, string>;
      /** The cube that shows the cards: `position` takes `{current}` and `{total}`. */
      cube: { hint: string; position: string; list: string };
    };
    workshops: {
      title: string;
      peopleLabel: string;
      themeLabel: string;
      summaryLabel: string;
      objectivesLabel: string;
      objectivesPending: string;
      stagesLabel: string;
      durationLabel: string;
      placeLabel: string;
      requirementsLabel: string;
      relatedExperiences: string;
      relatedResources: string;
    };
  };
  dosieres: {
    title: string;
    lede: string;
    empty: string;
    formats: Record<Resource["format"], string>;
    unavailable: string;
    status: EditorialStatus;
  };
  experiencias: {
    title: string;
    lede: string;
    empty: string;
    fields: {
      presents: string;
      audience: string;
      need: string;
      development: string;
      resources: string;
      learnings: string;
      adaptations: string;
    };
    relatedWorkshops: string;
    status: EditorialStatus;
  };
  /** `unavailable` is the optional visible note under a disabled action; null shows the label alone. */
  propuestas: { title: string; subtitle: string; paragraphs: string[]; unavailable: string | null; status: EditorialStatus };
  acoge: { title: string; subtitle: string; paragraphs: string[]; unavailable: string | null; status: EditorialStatus };
  partners: { kicker: string; title: string; text: string; organiza: string; colabora: string; logosPending: string };
  footer: {
    organiza: string;
    colabora: string;
    sections: string;
    credit: string;
    editionTitleNotice: string;
    /** Prefix before the production studio's name in the colophon. */
    studioCreditPrefix: string;
  };
  entities: {
    workshops: Record<string, WorkshopCopy>;
    experiences: Record<string, ExperienceCopy>;
    resources: Record<string, ResourceCopy>;
  };
};
