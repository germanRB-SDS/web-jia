import type { Copy } from "../../types";

/** JORNADAS: programme, how it works, team and workshops. Editorial text is a proposal (brief §5), pending validation. */
export const jornadas: Copy["jornadas"] = {
  title: "Las jornadas",
  intro:
    "Un punto de encuentro para docentes que quieran realizar un viaje de exploración hacia nuevas maneras de enseñar y de compartir lo que sucede en sus aulas. El cine y el universo western almeriense son el hilo conductor de esta edición.",
  /** Stop labels are the workshop names from config/talleres.ts (promoter, JIA-2026-09-18-09). */
  route: { regionLabel: "Camino de las jornadas: los talleres" },
  introVideo: { title: "Intro", videoLabel: "Vídeo de presentación de las jornadas" },
  program: {
    title: "Programa",
    dayLabel: "Jornada {n}",
    venueLabel: "Lugar",
    hoursLabel: "Horario",
    locationLabel: "Localización",
    directions: "Cómo ir",
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
    lede: "Todas las personas que lo hacen realidad: Coordinadores, Directores CEP, asesores y colaboradores. Las JIA no esconden sus talentos: conoce a quienes lanzan los dados ;)",
    cube: {
      hint: "Desliza el cubo en horizontal. Prueba suerte.",
      position: "{current} de {total}",
      list: "Todas las personas del equipo",
    },
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
