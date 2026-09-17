import type { Workshop } from "./types";

const POSTERS = "assets/cep/talleres-carteles";

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
    posterMediaIds: ["poster-1"],
    fallbackSurface: "sand",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS}/1.png` },
  },
  {
    id: "w-canva",
    title: "Dos renders y un destino",
    personIds: ["p-christian-padial", "p-francisco-bello"],
    posterMediaIds: ["poster-2", "poster-3"],
    fallbackSurface: "copper",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS}/2.png, ${POSTERS}/3.png` },
  },
  {
    id: "w-corto",
    title: "El bueno, el feo… y el plano",
    personIds: ["p-ismael-navarro", "p-araceli-merino"],
    posterMediaIds: ["poster-4", "poster-5"],
    fallbackSurface: "olive",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS}/4.png, ${POSTERS}/5.png` },
  },
  {
    id: "w-stopmotion",
    title: "Siete legos para siete planos",
    personIds: ["p-inmaculada-contreras"],
    posterMediaIds: ["poster-6"],
    fallbackSurface: "card",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS}/6.png` },
  },
  {
    id: "w-album",
    title: "La profe que pintó a Liberty Valance",
    personIds: ["p-amina-pallares"],
    posterMediaIds: ["poster-7"],
    fallbackSurface: "terracotta",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS}/7.png` },
  },
  {
    id: "w-podcast",
    title: "La muerte tenía un micro",
    personIds: ["p-mariola-martin", "p-jose-carlos-hernandez"],
    posterMediaIds: ["poster-8", "poster-9"],
    fallbackSurface: "sand",
    sheet: { kind: "text" },
    status: "confirmed",
    provenance: { source: `${POSTERS}/8.png, ${POSTERS}/9.png` },
  },
];
