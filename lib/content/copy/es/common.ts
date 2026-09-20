import type { Copy } from "../types";

/** CROSS-CUTTING INTERFACE TEXT (es): navigation, accessibility, states, footer. */
export const metadata: Copy["metadata"] = {
  title: "JIA · Jornadas de Innovación de Almería",
  description:
    "Dos jornadas para explorar nuevas formas de enseñar, compartir experiencias y llevar la creatividad del cine al aula. Programa, talleres, experiencias y materiales para el profesorado de Almería.",
};

export const nav: Copy["nav"] = {
  skip: "Saltar al contenido",
  home: "Inicio",
  areas: {
    jornadas: "Jornadas",
    dosieres: "Dosieres",
    experiencias: "Experiencias",
    propuestas: "Propuestas",
    acoge: "Acoge JIA",
    // The same name the section itself carries; the menu renders it in capitals.
    socios: "Quiénes somos",
  },
  jornadas: { programa: "Programa", comoFuncionan: "Cómo funcionan", talleres: "Talleres" },
  studio: "Contacta con South Desert Studio",
};

export const a11y: Copy["a11y"] = {
  wordmark: "JIA",
  badge: "Distintivo #JIA26 de las Jornadas de Innovación de Almería",
  heroImage:
    "Un grupo de docentes con sombreros y ropa de estilo western contempla desde una loma la ciudad de Almería, con la Alcazaba y el mar al fondo.",
  cartel: "Cartel de las Jornadas de Innovación de Almería #JIA26 con fechas y lugares",
  posterOf: "Cartel del taller {title}",
  cardOf: "Tarjeta de {name}, {role}",
  sheetOf: "Ficha: {title}",
  teamRegion: "Equipo de las jornadas",
  venueMap: "Cómo ir a {venue}: abrir en Google Maps (pestaña nueva)",
  waypointsRegion: "Atajos a las secciones principales",
  mainNav: "Navegación principal",
  provisionalMark: "Contenido provisional",
};

export const states: Copy["states"] = {
  provisional: "Provisional",
  demo: "Demostración",
  pending: "Pendiente",
  fromPoster: "Datos leídos del cartel, pendientes de confirmación oficial",
  sheetPending: "Ficha pendiente",
  dateTbc: "Fecha por confirmar",
  venueTbc: "Lugar por confirmar",
  hoursTbc: "Horario por confirmar",
};
