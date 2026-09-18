import type { ProgramDay, Session } from "./types";

const CARTEL = "assets/cep/CARTEL #JIA26 (9).png";

/**
 * PROGRAMME. Dates, venues and hours are transcribed from the event poster and
 * remain `provisional` until the organisation confirms them (brief §5.1). Set
 * `date`/`venue` to null to fall back to "Jornada N" with no value shown.
 * Sessions carry the promoter's timetable and can link to workshops/experiences by id; none are linked yet.
 */
export const programDays: readonly ProgramDay[] = [
  {
    id: "day-1",
    order: 1,
    date: "2026-10-16",
    venue: "Conservatorio de Danza Kina Jiménez",
    mapUrl: "https://maps.app.goo.gl/MDXPqw58MyVPHpJM6",
    hours: ["16:30–20:30"],
    sessionIds: ["s-1-1", "s-1-2", "s-1-3", "s-1-4", "s-1-5"],
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
    sessionIds: ["s-2-1", "s-2-2", "s-2-3", "s-2-4", "s-2-5", "s-2-6", "s-2-7", "s-2-8", "s-2-9"],
    status: "provisional",
    provenance: { source: CARTEL, note: "Leído del cartel #JIA26. Pendiente de confirmación oficial." },
  },
];

/**
 * The timetable, as given by the promoter (chat, 18-09-2026, JIA-2026-09-18-23). `time` is the slot without its
 * unit (copy adds it: jornadas.program.timeFormat); the last two blocks of day 2 have none. The wording lives in
 * copy: sections.jornadas.program.sessions[id].
 */
export const sessions: readonly Session[] = [
  { id: "s-1-1", order: 1, time: "16:00–17:00", kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-1-2", order: 2, time: "17:00–17:30", kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-1-3", order: 3, time: "17:30–18:00", kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-1-4", order: 4, time: "18:00–19:00", kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-1-5", order: 5, time: "19:00–20:30", kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-1", order: 1, time: "10:00–11:30", kind: "workshop", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-2", order: 2, time: "11:30–12:15", kind: "break", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-3", order: 3, time: "12:30–14:00", kind: "workshop", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-4", order: 4, time: "14:00–16:00", kind: "break", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-5", order: 5, time: "16:00–17:30", kind: "workshop", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-6", order: 6, time: "19:00–20:00", kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-7", order: 7, time: "20:00–20:30", kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-8", order: 8, time: null, kind: "block", workshopId: null, experienceId: null, status: "provisional" },
  { id: "s-2-9", order: 9, time: null, kind: "block", workshopId: null, experienceId: null, status: "provisional" },
];
