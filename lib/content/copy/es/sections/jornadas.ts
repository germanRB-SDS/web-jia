import type { Copy } from "../../types";

/** JORNADAS: programme, how it works, team and workshops. Editorial text is a proposal (brief §5), pending validation. */
export const jornadas: Copy["jornadas"] = {
  title: "Las jornadas",
  intro:
    "Un punto de encuentro para docentes que quieren explorar nuevas maneras de enseñar y compartir lo que sucede en sus aulas. El cine y el universo western almeriense son el hilo conductor.",
  /** Labels are exactly these six (promoter, JIA-2026-09-18-08); no titles, times or venues are invented. */
  route: {
    regionLabel: "Camino de las jornadas: seis paradas",
    stops: ["Parada 1", "Parada 2", "Parada 3", "Parada 4", "Parada 5", "Parada 6"],
  },
  program: {
    title: "Programa",
    dayLabel: "Jornada {n}",
    venueLabel: "Lugar",
    hoursLabel: "Horario",
    note: "Secuencia orientativa. El programa definitivo concretará horas, espacios, talleres y la dinámica de participación.",
    sessions: {
      "s-1-1": "Bienvenida",
      "s-1-2": "Presentación del reto",
      "s-1-3": "Primer encuentro con las propuestas educativas",
      "s-2-1": "Talleres",
      "s-2-2": "Experiencias compartidas entre bloques",
      "s-2-3": "Cierre de las jornadas",
    },
  },
  how: {
    title: "Cómo funcionan",
    paragraphs: [
      "La propuesta combina talleres prácticos, experiencias compartidas y materiales de apoyo. Se trata de descubrir herramientas, conocer otros enfoques y pensar cómo adaptarlos a cada etapa, grupo y contexto de aprendizaje.",
      "Entre los talleres, las experiencias educativas permiten conversar sobre propuestas llevadas a la práctica: cómo se desarrollaron, qué se aprendió y qué conviene tener en cuenta antes de trasladarlas a otra aula.",
    ],
    status: "provisional",
  },
  team: {
    title: "Quién está detrás",
    lede: "Las personas del CEP de Almería y quienes colaboran en esta edición, en sus tarjetas de la campaña. Desliza para verlas todas.",
    count: "{count} personas",
    roles: {
      tallerista: "Tallerista",
      "asesoria-cep": "Asesoría CEP",
      coordinacion: "Coordinación",
      "coordinacion-cep": "Coordinación CEP",
      colaboracion: "Colaboración",
    },
  },
  workshops: {
    title: "Talleres",
    lede: "Cada taller lleva nombre de película y una propuesta práctica para el aula. Abre la ficha para ver quién lo imparte y de qué trata.",
    peopleLabel: "Imparte",
    themeLabel: "Temática",
    summaryLabel: "De qué trata",
    objectivesLabel: "Objetivos",
    objectivesPending: "Los objetivos y aprendizajes del taller se publicarán cuando la organización los facilite.",
    stagesLabel: "Etapas",
    durationLabel: "Duración",
    placeLabel: "Lugar",
    requirementsLabel: "Requisitos",
    relatedExperiences: "Experiencias relacionadas",
    relatedResources: "Materiales relacionados",
  },
};
