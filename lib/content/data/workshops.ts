import type { Workshop } from "./types";

const POSTERS = "assets/cep/talleres-carteles";
/** Current posters (2026-09-29, [55-0]): one per workshop, numbered in the order below; they replace the nine above. */
const POSTERS_2026_09_29 = "assets/whatsapp/section-talleres";

/**
 * WORKSHOPS. Six distinct workshops were read from nine posters. Titles and
 * subtitles are printed facts; descriptions and objectives are NOT on the
 * posters and live as provisional/pending copy in the dictionary (entities.workshops).
 * The collection length is not a constant anywhere: add or remove entries freely.
 */
export const workshops: readonly Workshop[] = [
  {
    id: "w-scratch",
    title: "Por un puñado de bloques",
    personIds: ["p-manuel-salmeron"],
    posterMediaIds: ["poster-2026-09-29-1"],
    fallbackSurface: "sand",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS_2026_09_29}/1.png`, note: `Título leído también en ${POSTERS}/1.png` },
  },
  {
    id: "w-canva",
    title: "Dos renders y un destino",
    personIds: ["p-christian-padial", "p-francisco-bello"],
    posterMediaIds: ["poster-2026-09-29-2"],
    fallbackSurface: "copper",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS_2026_09_29}/2.png`, note: `Título leído también en ${POSTERS}/2.png, ${POSTERS}/3.png` },
  },
  {
    id: "w-corto",
    title: "El bueno, el feo… y el plano",
    personIds: ["p-ismael-navarro", "p-araceli-merino"],
    posterMediaIds: ["poster-2026-09-29-3"],
    fallbackSurface: "olive",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS_2026_09_29}/3.png`, note: `Título leído también en ${POSTERS}/4.png, ${POSTERS}/5.png` },
  },
  {
    id: "w-stopmotion",
    title: "Siete legos para siete planos",
    personIds: ["p-inmaculada-contreras"],
    posterMediaIds: ["poster-2026-09-29-4"],
    fallbackSurface: "card",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS_2026_09_29}/4.png`, note: `Título leído también en ${POSTERS}/6.png` },
  },
  {
    id: "w-album",
    title: "La profe que pintó a Liberty Valance",
    personIds: ["p-amina-pallares"],
    posterMediaIds: ["poster-2026-09-29-5"],
    fallbackSurface: "terracotta",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS_2026_09_29}/5.png`, note: `Título leído también en ${POSTERS}/7.png` },
  },
  {
    id: "w-podcast",
    title: "La muerte tenía un micro",
    personIds: ["p-mariola-martin", "p-jose-carlos-hernandez"],
    posterMediaIds: ["poster-2026-09-29-6"],
    fallbackSurface: "sand",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS_2026_09_29}/6.png`, note: `Título leído también en ${POSTERS}/8.png, ${POSTERS}/9.png` },
  },
];
