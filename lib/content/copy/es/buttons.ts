import type { Buttons } from "../types";

/** BUTTON LABELS (es), grouped by section. Shared actions appear once. */
export const buttons: Buttons = {
  hero: { explore: "Explorar las jornadas", workshops: "Ver talleres" },
  sheet: { open: "Ver ficha", close: "Cerrar", viewDocument: "Ver documento original", viewPoster: "Ver cartel", downloadDossier: "Descargar dosier", dossierPending: "Dosier disponible próximamente" },
  dossiers: { consult: "Consultar material", view: "Ver dosier", download: "Descargar" },
  proposals: { present: "Presentar una propuesta" },
  host: { host: "Quiero acoger las JIA" },
  nav: { menu: "Menú", close: "Cerrar menú", submenu: "Mostrar apartados de Jornadas" },
  route: { replay: "Repetir recorrido" },
  cube: { prev: "Tarjeta anterior", next: "Tarjeta siguiente" },
  video: {
    play: "Reproducir el vídeo",
    pause: "Pausar el vídeo",
    mute: "Quitar el sonido",
    unmute: "Activar el sonido",
    fullscreen: "Ver el vídeo a pantalla completa",
    exitFullscreen: "Salir de pantalla completa",
    share: "Compartir el enlace de las jornadas",
  },
};
