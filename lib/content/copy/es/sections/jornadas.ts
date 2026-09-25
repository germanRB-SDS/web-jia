import type { Copy } from "../../types";

/** JORNADAS: programme, how it works, team and workshops. Editorial text is a proposal (brief §5), pending validation. */
export const jornadas: Copy["jornadas"] = {
  title: "Las jornadas",
  /** Two paragraphs, a blank line between them (promoter, 19-09-2026). */
  intro: [
    "Un punto de encuentro para docentes que quieran realizar un viaje de exploración hacia nuevas maneras de enseñar y de compartir lo que sucede en sus aulas. El cine y el universo western almeriense son el hilo conductor de esta edición.",
    "Esperamos que disfrutes de los talleres que te listamos a continuación:",
  ],
  /** Stop labels are the workshop names from config/talleres.ts (promoter, JIA-2026-09-18-09). */
  route: { regionLabel: "Camino de las jornadas: los talleres" },
  introVideo: {
    title: "Intro",
    videoLabel: "Vídeo de presentación de las jornadas",
    shareText: "Jornadas de Innovación de Almería: vídeo de presentación",
  },
  program: {
    title: "Programa",
    dayLabel: "Jornada {n}",
    /** Phone: the two labels above the track of days (JIA-2026-09-20-49). */
    daysRegion: "Jornadas del programa: desliza para cambiar de jornada",
    venueLabel: "Lugar",
    hoursLabel: "Horario",
    locationLabel: "Localización",
    directions: "Cómo ir",
    /** `{time}` is the slot from data/program.ts (e.g. "16:00–17:00"). */
    timeFormat: "{time} h",
    sessions: {
      "s-1-1": "Recepción",
      "s-1-2": "Inauguración",
      "s-1-3": "Apertura",
      "s-1-4": "Conferencia inaugural: Creatividad en educación",
      "s-1-5": "Exposición de Buenas Prácticas de la provincia de Almería",
      "s-2-1": "Talleres (1)",
      "s-2-2": "Desayuno",
      "s-2-3": "Talleres (2)",
      "s-2-4": "Comida",
      "s-2-5": "Talleres (3)",
      "s-2-6": "Dinámica de cierre. Juego: El duelo",
      "s-2-7": "Clausura de las jornadas",
      "s-2-8": "Vídeo de cierre de las jornadas",
      "s-2-9": "Agradecimientos y despedida",
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
      hint: "Desliza el dado en horizontal. Prueba suerte.",
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
    /** Phone: the cards are a carousel (JIA-2026-09-20-49). */
    carouselLabel: "Talleres de la edición: desliza para ver los demás",
    mobileTitle: "Talleres en el Saloon",
    expandDeck: "Toca para desplegar los talleres",
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
