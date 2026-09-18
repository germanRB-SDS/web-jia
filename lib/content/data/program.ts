import type { ProgramDay, Session } from "./types";

const CARTEL = "assets/cep/CARTEL #JIA26 (9).png";

/**
 * PROGRAMME. Dates, venues and hours are transcribed from the event poster and
 * remain `provisional` until the organisation confirms them (brief §5.1). Set
 * `date`/`venue` to null to fall back to "Jornada N" with no value shown.
 * Sessions link to workshops/experiences by id; none are scheduled yet.
 */
export const programDays: readonly ProgramDay[] = [
  {
    id: "day-1",
    order: 1,
    date: "2026-10-16",
    venue: "Conservatorio de Danza Kina Jiménez",
    mapUrl: "https://maps.app.goo.gl/MDXPqw58MyVPHpJM6",
    hours: ["16:30–20:30"],
    sessionIds: ["s-1-1", "s-1-2", "s-1-3"],
    status: "provisional",
    provenance: { source: CARTEL, note: "Leído del cartel #JIA26. Pendiente de confirmación oficial." },
  },
  {
    id: "day-2",
    order: 2,
    date: "2026-10-17",
    venue: "CEIP Freinet",
    mapUrl: "https://maps.app.goo.gl/sZwSShPJP5c2idPs8",
    hours: ["9:30–14:30", "16:30–20:30"],
    sessionIds: ["s-2-1", "s-2-2", "s-2-3"],
    status: "provisional",
    provenance: { source: CARTEL, note: "Leído del cartel #JIA26. Pendiente de confirmación oficial." },
  },
];

/** Orientative blocks (brief §5.1 table). Their wording lives in copy: sections.jornadas.program.sessions[id]. */
export const sessions: readonly Session[] = [
  { id: "s-1-1", order: 1, time: null, kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-1-2", order: 2, time: null, kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-1-3", order: 3, time: null, kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-1", order: 1, time: null, kind: "workshop", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-2", order: 2, time: null, kind: "experience", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-3", order: 3, time: null, kind: "block", workshopId: null, experienceId: null, status: "provisional" },
];
