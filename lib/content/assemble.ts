/**
 * SECTION ASSEMBLY. Turns data + config + copy into one view model per section
 * (brief §10.2: "un objeto ensamblado con textos, acciones, URLs, medios y estado").
 * Components consume this model and never reach into the raw sources.
 * Relations are resolved here by id; inverse relations are derived, never stored twice.
 */
import { format } from "./copy";
import { getDictionary } from "./copy/dictionaries";
import type { Copy } from "./copy/types";
import { experiences } from "./data/experiences";
import { organizations } from "./data/organizations";
import { people, TEAM_ROLE_ORDER } from "./data/people";
import { programDays, sessions } from "./data/program";
import { resources } from "./data/resources";
import type { EditorialStatus, Organization, Person, SurfaceToken, Workshop } from "./data/types";
import { workshops } from "./data/workshops";
import { LANGUAGE_BY_CODE, type Language, type Locale } from "./languages";
import { brand, getMedia, type Media } from "./media";
import { acogeConfig } from "./sections/acoge";
import { dosieresConfig } from "./sections/dosieres";
import { experienciasConfig } from "./sections/experiencias";
import { heroConfig } from "./sections/hero";
import { jornadasConfig } from "./sections/jornadas";
import { navStructure } from "./sections/nav";
import { propuestasConfig } from "./sections/propuestas";
import { edition, event, site } from "./site";

export type MarkKind = "provisional" | "demo" | "pending";

export type Action = {
  id: string;
  label: string;
  href: string | null;
  kind: "anchor" | "external" | "unavailable";
  /** Visible explanation while unavailable. */
  note: string | null;
};

export type NavItem = { key: string; label: string; href: string; children?: NavItem[] };

export type SheetSection = { label: string; body: string | string[] };

export type SheetModel = {
  id: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  meta: string | null;
  people: { id: string; name: string }[];
  media: Media | null;
  alt: string;
  fallback: SurfaceToken;
  marks: MarkKind[];
  sections: SheetSection[];
  related: { label: string; items: { label: string; href: string }[] }[];
  document: { label: string; href: string } | null;
  /** True when no sheet source exists: the card shows "ficha pendiente" and opens nothing. */
  pending: boolean;
};

export type RouteModel = {
  glb: string | null;
  regionLabel: string;
  stops: { id: string; label: string }[];
  controls: { replay: string; pause: string; resume: string };
};

export type DayModel = {
  id: string;
  label: string;
  dateText: string | null;
  dateIso: string | null;
  venue: string | null;
  hours: string[];
  marks: MarkKind[];
  provenanceNote: string | null;
  sessions: { id: string; text: string; time: string | null; link: { label: string; href: string } | null }[];
};

export type TeamCard = { id: string; name: string; roleLabel: string; media: Media | null; alt: string; fallback: SurfaceToken };

export type ResourceModel = {
  id: string;
  title: string;
  summary: string;
  formatLabel: string;
  action: Action;
  marks: MarkKind[];
};

export type LandingModel = {
  locale: Locale;
  language: Language;
  copy: Copy;
  event: typeof event;
  edition: typeof edition;
  markProvisional: boolean;
  nav: { items: NavItem[]; homeHref: string };
  brand: { wordmark: typeof brand.wordmark; badge: Media | null };
  hero: {
    id: string;
    media: Media | null;
    fallback: SurfaceToken;
    alt: string;
    nameLines: readonly string[];
    fullName: string;
    title: string;
    titleMarks: MarkKind[];
    lede: string;
    note: string | null;
    dateline: string | null;
    datelineMarks: MarkKind[];
    actions: Action[];
  };
  waypoints: { id: string; icon: "hat" | "cactus" | "compass" | "lantern"; label: string; line: string; href: string }[];
  jornadas: {
    id: string;
    anchors: typeof jornadasConfig.anchors;
    title: string;
    intro: string;
    band: Media | null;
    bandAlt: string;
    poster: Media | null;
    hashtag: string;
    /** The animated road under the intro. */
    route: RouteModel;
    program: { title: string; note: string; days: DayModel[] };
    how: { title: string; paragraphs: string[]; marks: MarkKind[] };
    team: { title: string; lede: string; count: string; cards: TeamCard[] } | null;
    workshops: { title: string; lede: string; hint: string; marks: MarkKind[]; items: SheetModel[] };
  };
  dosieres: { id: string; title: string; lede: string; empty: string; items: ResourceModel[]; marks: MarkKind[] };
  experiencias: { id: string; title: string; lede: string; hint: string; empty: string; demoNotice: string | null; items: SheetModel[]; marks: MarkKind[] };
  propuestas: { id: string; title: string; subtitle: string; paragraphs: string[]; action: Action; media: Media | null; marks: MarkKind[] };
  partners: {
    id: string;
    kicker: string;
    title: string;
    /** Text split into plain runs and organisation links, in order. */
    text: ({ kind: "text"; value: string } | { kind: "org"; id: string; name: string; url: string | null })[];
    logosPending: string | null;
    groups: { key: "organiza" | "colabora"; label: string; items: { id: string; name: string; url: string | null; logo: Media | null }[] }[];
  };
  acoge: { id: string; title: string; subtitle: string; paragraphs: string[]; action: Action; media: Media | null; alt: string; fallback: SurfaceToken; marks: MarkKind[] };
  footer: {
    organiza: Organization[];
    colabora: Organization[];
    sections: { label: string; href: string }[];
    credit: string;
    editionTitleNotice: string | null;
    marks: MarkKind[];
  };
};

const anchor = (id: string) => `#${id}`;

function marksOf(status: EditorialStatus | null | undefined): MarkKind[] {
  if (status === "provisional") return ["provisional"];
  if (status === "demo") return ["demo"];
  if (status === "pending") return ["pending"];
  return [];
}

function personById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

function externalOrUnavailable(id: string, label: string, url: string | null, note: string | null): Action {
  return url
    ? { id, label, href: url, kind: "external", note: null }
    : { id, label, href: null, kind: "unavailable", note };
}

function formatDate(iso: string | null, language: Language): string | null {
  if (!iso) return null;
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat(language.htmlLang, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

function dateline(language: Language): string | null {
  const dates = [...programDays].sort((a, b) => a.order - b.order).map((d) => d.date);
  if (dates.some((d) => !d)) return null;
  const fmt = new Intl.DateTimeFormat(language.htmlLang, { day: "numeric", month: "long", year: "numeric" });
  const first = new Date(`${dates[0]}T12:00:00`);
  const last = new Date(`${dates[dates.length - 1]}T12:00:00`);
  return dates.length === 1 ? fmt.format(first) : fmt.formatRange(first, last);
}

function workshopSheet(w: Workshop, copy: Copy): SheetModel {
  const text = copy.entities.workshops[w.id];
  const labels = copy.jornadas.workshops;
  const poster = getMedia(w.posterMediaIds[0] ?? null);
  const persons = w.personIds.map(personById).filter((p): p is Person => Boolean(p));
  const relatedExperiences = experiences
    .filter((x) => x.relatedWorkshopIds.includes(w.id) && (experienciasConfig.showDemo || x.status !== "demo"))
    .map((x) => ({ label: copy.entities.experiences[x.id]?.title ?? x.id, href: anchor(`${experienciasConfig.id}-${x.id}`) }));
  const relatedResources = resources
    .filter((r) => r.relatedWorkshopIds.includes(w.id))
    .map((r) => ({ label: copy.entities.resources[r.id]?.title ?? r.id, href: anchor(`${dosieresConfig.id}-${r.id}`) }));

  const sections: SheetSection[] = [];
  if (text) {
    sections.push({ label: labels.summaryLabel, body: text.summary });
    sections.push({ label: labels.objectivesLabel, body: text.objectives ?? labels.objectivesPending });
    if (text.stages) sections.push({ label: labels.stagesLabel, body: text.stages });
    if (text.duration) sections.push({ label: labels.durationLabel, body: text.duration });
    if (text.place) sections.push({ label: labels.placeLabel, body: text.place });
    if (text.requirements) sections.push({ label: labels.requirementsLabel, body: text.requirements });
  }

  const marks = new Set<MarkKind>([...marksOf(w.status), ...marksOf(text?.status)]);
  return {
    id: w.id,
    title: w.title,
    subtitle: text?.subtitle ?? null,
    summary: text?.summary ?? null,
    meta: text?.theme ?? null,
    people: persons.map((p) => ({ id: p.id, name: p.name })),
    media: poster,
    alt: format(copy.a11y.posterOf, { title: w.title }),
    fallback: w.fallbackSurface,
    marks: [...marks],
    sections,
    related: [
      ...(relatedExperiences.length ? [{ label: labels.relatedExperiences, items: relatedExperiences }] : []),
      ...(relatedResources.length ? [{ label: labels.relatedResources, items: relatedResources }] : []),
    ],
    document: w.sheet && w.sheet.kind !== "text" ? { label: copy.buttons.sheet.viewDocument, href: w.sheet.url } : null,
    pending: w.sheet === null,
  };
}

function experienceSheet(id: string, copy: Copy): SheetModel | null {
  const x = experiences.find((e) => e.id === id);
  const text = x && copy.entities.experiences[x.id];
  if (!x || !text) return null;
  const f = copy.experiencias.fields;
  const persons = x.personIds.map(personById).filter((p): p is Person => Boolean(p));
  const sections: SheetSection[] = (
    [
      [f.presents, text.presents],
      [f.audience, text.audience],
      [f.need, text.need],
      [f.development, text.development],
      [f.resources, text.resources],
      [f.learnings, text.learnings],
      [f.adaptations, text.adaptations],
    ] as const
  )
    .filter((pair): pair is readonly [string, string] => Boolean(pair[1]))
    .map(([label, body]) => ({ label, body }));
  const relatedWorkshops = x.relatedWorkshopIds
    .map((wid) => workshops.find((w) => w.id === wid))
    .filter((w): w is Workshop => Boolean(w))
    .map((w) => ({ label: w.title, href: anchor(`${jornadasConfig.anchors.talleres}-${w.id}`) }));
  return {
    id: x.id,
    title: text.title,
    subtitle: null,
    summary: text.lede,
    meta: null,
    people: persons.map((p) => ({ id: p.id, name: p.name })),
    media: getMedia(x.mediaId),
    alt: "",
    fallback: x.fallbackSurface,
    marks: [...new Set<MarkKind>([...marksOf(x.status), ...marksOf(text.status)])],
    sections,
    related: relatedWorkshops.length ? [{ label: copy.experiencias.relatedWorkshops, items: relatedWorkshops }] : [],
    document: x.sheet && x.sheet.kind !== "text" ? { label: copy.buttons.sheet.viewDocument, href: x.sheet.url } : null,
    pending: x.sheet === null,
  };
}

export function getLanding(locale: Locale): LandingModel {
  const copy = getDictionary(locale);
  const language = LANGUAGE_BY_CODE[locale];
  const markProvisional = site.preview.markProvisional;

  const navItems: NavItem[] = navStructure.map((area) => ({
    key: area.key,
    label: copy.nav.areas[area.key],
    href: anchor(area.anchor),
    children: area.children?.map((c) => ({ key: c.key, label: copy.nav.jornadas[c.key], href: anchor(c.anchor) })),
  }));

  // Programme: day → sessions → linked workshop/experience by id.
  const days: DayModel[] = [...programDays]
    .sort((a, b) => a.order - b.order)
    .map((d) => ({
      id: d.id,
      label: format(copy.jornadas.program.dayLabel, { n: d.order }),
      dateText: formatDate(d.date, language),
      dateIso: d.date,
      venue: d.venue,
      hours: d.hours,
      marks: marksOf(d.status),
      provenanceNote: d.status === "provisional" ? copy.states.fromPoster : null,
      sessions: d.sessionIds
        .map((sid) => sessions.find((s) => s.id === sid))
        .filter((s): s is (typeof sessions)[number] => Boolean(s))
        .sort((a, b) => a.order - b.order)
        .map((s) => {
          const w = s.workshopId ? workshops.find((x) => x.id === s.workshopId) : null;
          const x = s.experienceId ? copy.entities.experiences[s.experienceId] : null;
          const link = w
            ? { label: w.title, href: anchor(`${jornadasConfig.anchors.talleres}-${w.id}`) }
            : x && s.experienceId
              ? { label: x.title, href: anchor(`${experienciasConfig.id}-${s.experienceId}`) }
              : null;
          return { id: s.id, text: copy.jornadas.program.sessions[s.id] ?? "", time: s.time, link };
        }),
    }));

  // Team strip: everyone with a card, grouped by role order, talleristas excluded (they appear on their workshop).
  const teamCards: TeamCard[] = TEAM_ROLE_ORDER.flatMap((role) =>
    people
      .filter((p) => p.role === role && p.cardMediaId)
      .map((p) => {
        const roleLabel = p.cardRoleLabel ?? copy.jornadas.team.roles[p.role];
        return {
          id: p.id,
          name: p.name,
          roleLabel,
          media: getMedia(p.cardMediaId),
          alt: format(copy.a11y.cardOf, { name: p.name, role: roleLabel }),
          fallback: "card" as SurfaceToken,
        };
      }),
  );

  const visibleExperiences = experiences.filter((x) => experienciasConfig.showDemo || x.status !== "demo");
  const experienceItems = visibleExperiences.map((x) => experienceSheet(x.id, copy)).filter((s): s is SheetModel => Boolean(s));

  const resourceItems: ResourceModel[] = resources.map((r) => {
    const text = copy.entities.resources[r.id];
    const label = r.format === "pdf" ? copy.buttons.dossiers.view : copy.buttons.dossiers.consult;
    return {
      id: r.id,
      title: text?.title ?? r.id,
      summary: text?.summary ?? "",
      formatLabel: copy.dosieres.formats[r.format],
      action: externalOrUnavailable(`dossier-${r.id}`, label, r.url, copy.dosieres.unavailable),
      marks: [...new Set<MarkKind>([...marksOf(r.status), ...marksOf(text?.status)])],
    };
  });

  return {
    locale,
    language,
    copy,
    event,
    edition,
    markProvisional,
    nav: { items: navItems, homeHref: anchor(heroConfig.id) },
    brand: { wordmark: brand.wordmark, badge: getMedia("badge-jia26") },
    hero: {
      id: heroConfig.id,
      media: getMedia(heroConfig.mediaId),
      fallback: heroConfig.fallbackSurface,
      alt: copy.a11y.heroImage,
      nameLines: event.nameLines,
      fullName: event.fullName,
      title: edition.title,
      titleMarks: marksOf(edition.titleStatus),
      lede: copy.hero.lede,
      note: copy.hero.note || null,
      dateline: dateline(language),
      datelineMarks: programDays.some((d) => d.status !== "confirmed") ? ["provisional"] : [],
      actions: [
        { id: "hero-explore", label: copy.buttons.hero.explore, href: anchor(heroConfig.actions.primary.target), kind: "anchor", note: null },
        { id: "hero-workshops", label: copy.buttons.hero.workshops, href: anchor(heroConfig.actions.secondary.target), kind: "anchor", note: null },
      ],
    },
    waypoints: heroConfig.waypoints.map((w) => ({
      id: w.id,
      icon: w.icon,
      label: copy.waypoints.items[w.id]?.label ?? w.id,
      line: copy.waypoints.items[w.id]?.line ?? "",
      href: anchor(w.target),
    })),
    jornadas: {
      id: jornadasConfig.id,
      anchors: jornadasConfig.anchors,
      title: copy.jornadas.title,
      intro: copy.jornadas.intro,
      band: getMedia(jornadasConfig.bandMediaId),
      bandAlt: "",
      poster: getMedia(jornadasConfig.posterMediaId),
      route: {
        glb: jornadasConfig.routeGlb,
        regionLabel: copy.jornadas.route.regionLabel,
        stops: copy.jornadas.route.stops.map((label, i) => ({ id: `parada-${i + 1}`, label })),
        controls: copy.buttons.route,
      },
      hashtag: event.hashtag,
      program: { title: copy.jornadas.program.title, note: copy.jornadas.program.note, days },
      how: { title: copy.jornadas.how.title, paragraphs: copy.jornadas.how.paragraphs, marks: marksOf(copy.jornadas.how.status) },
      team: jornadasConfig.showTeam && teamCards.length
        ? { title: copy.jornadas.team.title, lede: copy.jornadas.team.lede, count: format(copy.jornadas.team.count, { count: teamCards.length }), cards: teamCards }
        : null,
      workshops: {
        title: copy.jornadas.workshops.title,
        lede: copy.jornadas.workshops.lede,
        hint: copy.states.hoverHint,
        marks: workshops.some((w) => copy.entities.workshops[w.id]?.status === "provisional") ? ["provisional"] : [],
        items: workshops.map((w) => workshopSheet(w, copy)),
      },
    },
    dosieres: {
      id: dosieresConfig.id,
      title: copy.dosieres.title,
      lede: copy.dosieres.lede,
      empty: copy.dosieres.empty,
      items: resourceItems,
      marks: marksOf(copy.dosieres.status),
    },
    experiencias: {
      id: experienciasConfig.id,
      title: copy.experiencias.title,
      lede: copy.experiencias.lede,
      hint: copy.states.hoverHint,
      empty: copy.experiencias.empty,
      demoNotice: experienceItems.some((x) => x.marks.includes("demo")) ? copy.experiencias.demoNotice : null,
      items: experienceItems,
      marks: marksOf(copy.experiencias.status),
    },
    propuestas: {
      id: propuestasConfig.id,
      title: copy.propuestas.title,
      subtitle: copy.propuestas.subtitle,
      paragraphs: copy.propuestas.paragraphs,
      media: getMedia(propuestasConfig.mediaId),
      action: externalOrUnavailable("proposals-present", copy.buttons.proposals.present, propuestasConfig.url, copy.propuestas.unavailable),
      marks: marksOf(copy.propuestas.status),
    },
    partners: {
      id: "socios",
      kicker: copy.partners.kicker,
      title: copy.partners.title,
      text: copy.partners.text.split(/(\{o-[a-z-]+\})/).filter(Boolean).map((part) => {
        const m = part.match(/^\{(o-[a-z-]+)\}$/);
        const org = m ? organizations.find((o) => o.id === m[1]) : undefined;
        return org ? { kind: "org" as const, id: org.id, name: org.name, url: org.url } : { kind: "text" as const, value: part };
      }),
      logosPending: organizations.some((o) => !o.logoMediaId) ? copy.partners.logosPending : null,
      groups: (["organiza", "colabora"] as const).map((key) => ({
        key,
        label: copy.partners[key],
        items: organizations.filter((o) => o.relation === key).map((o) => ({ id: o.id, name: o.name, url: o.url, logo: getMedia(o.logoMediaId) })),
      })),
    },
    acoge: {
      id: acogeConfig.id,
      title: copy.acoge.title,
      subtitle: copy.acoge.subtitle,
      paragraphs: copy.acoge.paragraphs,
      action: externalOrUnavailable("host-apply", copy.buttons.host.host, acogeConfig.url, copy.acoge.unavailable),
      media: getMedia(acogeConfig.mediaId),
      alt: "",
      fallback: acogeConfig.fallbackSurface,
      marks: marksOf(copy.acoge.status),
    },
    footer: {
      organiza: organizations.filter((o) => o.relation === "organiza"),
      colabora: organizations.filter((o) => o.relation === "colabora"),
      sections: navItems.map((n) => ({ label: n.label, href: n.href })),
      credit: copy.footer.credit,
      editionTitleNotice: markProvisional && edition.titleStatus === "provisional" ? copy.footer.editionTitleNotice : null,
      marks: [],
    },
  };
}
