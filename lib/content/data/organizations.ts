import type { Organization } from "./types";

const CARTEL = "assets/cep/CARTEL #JIA26 (9).png";

/**
 * ORGANISERS AND COLLABORATORS, as printed under "ORGANIZA" / "COLABORA" on
 * the event poster. Names only: the poster logos were not supplied as separate
 * files and are not cropped from it. URLs are unknown (null).
 */
export const organizations: readonly Organization[] = [
  { id: "o-junta", name: "Junta de Andalucía · Consejería de Educación", relation: "organiza", url: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-cep-almeria", name: "Centro del Profesorado de Almería", relation: "organiza", url: null, status: "provisional", provenance: { source: CARTEL, note: "Denominación oficial según JIA_IDENTIDAD_VISUAL.md §2." } },
  { id: "o-cep-ejido", name: "CEP de El Ejido", relation: "organiza", url: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-cep-cuevas", name: "CEP de Cuevas Olula", relation: "organiza", url: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-minihollywood", name: "Minihollywood Oasys Theme Park", relation: "colabora", url: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-leonardo", name: "Leonardo Atrezzo", relation: "colabora", url: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-kichigarcia", name: "Kichi García Films", relation: "colabora", url: null, status: "provisional", provenance: { source: CARTEL, note: "Impreso como «KICHIGARCIAFILMS»; grafía por confirmar." } },
  { id: "o-gata-purpura", name: "La Gata Púrpura", relation: "colabora", url: null, status: "provisional", provenance: { source: CARTEL } },
];
