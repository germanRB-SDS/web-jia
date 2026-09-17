/**
 * CONTENT INTEGRITY CHECK (brief §14: "Relaciones", "Fallback visual",
 * "Disponibilidad de acciones", "Colecciones variables").
 * Verifies that every id reference resolves, every registered media file
 * exists on disk, every entity has its copy, and no action points at "#".
 * Run: npm run check:content
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getLanding } from "../lib/content/assemble";
import { experiences } from "../lib/content/data/experiences";
import { people } from "../lib/content/data/people";
import { programDays, sessions } from "../lib/content/data/program";
import { resources } from "../lib/content/data/resources";
import { workshops } from "../lib/content/data/workshops";
import { LOCALES } from "../lib/content/languages";
import { MEDIA } from "../lib/content/media";
import { getDictionary } from "../lib/content/copy/dictionaries";

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);
const PUBLIC = join(__dirname, "..", "..", "public");

const personIds = new Set(people.map((p) => p.id));
const workshopIds = new Set(workshops.map((w) => w.id));
const experienceIds = new Set(experiences.map((x) => x.id));
const sessionIds = new Set(sessions.map((s) => s.id));

// Unique ids
for (const [name, list] of [["people", people], ["workshops", workshops], ["experiences", experiences], ["resources", resources], ["sessions", sessions], ["days", programDays]] as const) {
  const seen = new Set<string>();
  for (const item of list as readonly { id: string }[]) {
    if (seen.has(item.id)) fail(`${name}: duplicate id ${item.id}`);
    seen.add(item.id);
  }
}

// Media files exist
for (const m of Object.values(MEDIA)) {
  for (const v of m.variants) {
    if (!existsSync(join(PUBLIC, v.src))) fail(`media ${m.id}: missing file public${v.src} (run npm run assets)`);
  }
}

// Relations resolve
for (const p of people) if (p.cardMediaId && !MEDIA[p.cardMediaId]) fail(`person ${p.id}: unknown media ${p.cardMediaId}`);
for (const w of workshops) {
  for (const pid of w.personIds) if (!personIds.has(pid)) fail(`workshop ${w.id}: unknown person ${pid}`);
  for (const mid of w.posterMediaIds) if (!MEDIA[mid]) fail(`workshop ${w.id}: unknown media ${mid}`);
  if (w.sheet && w.sheet.kind !== "text" && !w.sheet.url) fail(`workshop ${w.id}: sheet without url`);
}
for (const x of experiences) {
  for (const pid of x.personIds) if (!personIds.has(pid)) fail(`experience ${x.id}: unknown person ${pid}`);
  for (const wid of x.relatedWorkshopIds) if (!workshopIds.has(wid)) fail(`experience ${x.id}: unknown workshop ${wid}`);
  if (x.mediaId && !MEDIA[x.mediaId]) fail(`experience ${x.id}: unknown media ${x.mediaId}`);
}
for (const r of resources) {
  for (const wid of r.relatedWorkshopIds) if (!workshopIds.has(wid)) fail(`resource ${r.id}: unknown workshop ${wid}`);
  for (const xid of r.relatedExperienceIds) if (!experienceIds.has(xid)) fail(`resource ${r.id}: unknown experience ${xid}`);
}
for (const d of programDays) for (const sid of d.sessionIds) if (!sessionIds.has(sid)) fail(`day ${d.id}: unknown session ${sid}`);
for (const s of sessions) {
  if (s.workshopId && !workshopIds.has(s.workshopId)) fail(`session ${s.id}: unknown workshop ${s.workshopId}`);
  if (s.experienceId && !experienceIds.has(s.experienceId)) fail(`session ${s.id}: unknown experience ${s.experienceId}`);
}

// Every entity has copy in every locale; every session has a text
for (const locale of LOCALES) {
  const copy = getDictionary(locale);
  for (const w of workshops) if (!copy.entities.workshops[w.id]) fail(`[${locale}] missing copy for workshop ${w.id}`);
  for (const x of experiences) if (!copy.entities.experiences[x.id]) fail(`[${locale}] missing copy for experience ${x.id}`);
  for (const r of resources) if (!copy.entities.resources[r.id]) fail(`[${locale}] missing copy for resource ${r.id}`);
  for (const s of sessions) if (!copy.jornadas.program.sessions[s.id]) fail(`[${locale}] missing text for session ${s.id}`);

  // Assembled model: no "#" hrefs, unavailable actions carry a note
  const model = getLanding(locale);
  const actions = [...model.hero.actions, model.propuestas.action, model.acoge.action, ...model.dosieres.items.map((i) => i.action)];
  for (const a of actions) {
    if (a.href === "#") fail(`[${locale}] action ${a.id} points at "#"`);
    if (a.kind === "unavailable" && !a.note) fail(`[${locale}] unavailable action ${a.id} has no visible note`);
    if (a.kind !== "unavailable" && !a.href) fail(`[${locale}] action ${a.id} has no href`);
  }
  for (const w of model.jornadas.workshops.items) if (!w.title) fail(`[${locale}] workshop ${w.id} without title`);
  for (const wp of model.waypoints) if (!wp.label || !wp.href) fail(`[${locale}] waypoint ${wp.id} incomplete`);
}

if (errors.length) {
  console.error(`content check: ${errors.length} problem(s)`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log(`content check: ok (${workshops.length} workshops, ${people.length} people, ${experiences.length} experiences, ${resources.length} resources, ${Object.keys(MEDIA).length} media)`);
