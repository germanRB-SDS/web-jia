import type { Buttons } from "../types";

/** BUTTON LABELS (es), grouped by section. Shared actions appear once. */
export const buttons: Buttons = {
  hero: { explore: "Explorar las jornadas", workshops: "Ver talleres" },
  sheet: { open: "Ver ficha", close: "Cerrar", viewDocument: "Ver documento original", viewPoster: "Ver cartel" },
  dossiers: { consult: "Consultar material", view: "Ver dosier", download: "Descargar" },
  proposals: { present: "Presentar una propuesta" },
  host: { host: "Quiero acoger las JIA" },
  nav: { menu: "Menú", close: "Cerrar menú", submenu: "Mostrar apartados de Jornadas" },
};
