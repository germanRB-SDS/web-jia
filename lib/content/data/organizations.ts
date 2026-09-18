import type { Organization } from "./types";

const CARTEL = "assets/cep/CARTEL #JIA26 (9).png";

/**
 * ORGANISERS AND COLLABORATORS, as printed under "ORGANIZA" / "COLABORA" on
 * the event poster. Names only: the poster logos were not supplied as separate
 * files and are not cropped from it. The collaborators' URLs were given by the promoter
 * (chat, 18-09-2026, JIA-2026-09-18-16); the Junta's is unknown (null). South Desert Studio
 * is not on the poster: the promoter added it at the head of "Colabora".
 */
export const organizations: readonly Organization[] = [
  { id: "o-junta", name: "Junta de Andalucía · Consejería de Educación", relation: "organiza", url: null, logoMediaId: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-cep-almeria", name: "CEP de Almería", relation: "organiza", url: "https://www.juntadeandalucia.es/educacion/portales/web/cep-almeria", logoMediaId: null, status: "provisional", provenance: { source: CARTEL, note: "Forma corta pedida por el promotor (18-09-2026); la identidad §2 cita «Centro del Profesorado de Almería» como denominación oficial." } },
  { id: "o-cep-ejido", name: "CEP de El Ejido", relation: "organiza", url: "https://www.juntadeandalucia.es/educacion/portales/web/cep-ejido/datos-del-cep", logoMediaId: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-cep-cuevas", name: "CEP de Cuevas-Olula", relation: "organiza", url: "https://www.juntadeandalucia.es/educacion/portales/web/cep-cuevas-olula", logoMediaId: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-south-desert-studio", name: "South Desert Studio", relation: "colabora", url: "https://southdesertstudio.com", logoMediaId: null, status: "provisional", provenance: { source: "Promotor (chat, 18-09-2026)", note: "No figura en el cartel; el promotor pide que encabece «Colabora» (JIA-2026-09-18-10)." } },
  { id: "o-minihollywood", name: "Minihollywood Oasys Theme Park", relation: "colabora", url: "https://minihollywoodoasys.com/", logoMediaId: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-leonardo", name: "Leonardo Atrezzo", relation: "colabora", url: "https://www.armerialeonardo.es/", logoMediaId: null, status: "provisional", provenance: { source: CARTEL } },
  { id: "o-kichigarcia", name: "Kichi García Films", relation: "colabora", url: "https://www.kichigarciafilms.com/", logoMediaId: null, status: "provisional", provenance: { source: CARTEL, note: "Impreso como «KICHIGARCIAFILMS»; grafía por confirmar." } },
  { id: "o-gata-purpura", name: "La Gata Púrpura", relation: "colabora", url: "https://www.instagram.com/lagatapurpuraimpro", logoMediaId: null, status: "provisional", provenance: { source: CARTEL } },
];
