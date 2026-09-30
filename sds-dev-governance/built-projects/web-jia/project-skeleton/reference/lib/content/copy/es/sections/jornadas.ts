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
    /** Read out with the session the revolver points at ([56-0]). */
    nowLabel: "Ahora",
    /** Headings of the programme poster of 29-09-2026 ([55-0]); the poster's longer descriptions are not transcribed. */
    sessions: {
      "s-1-1": "Registro de forajidos y docentes",
      "s-1-2": "Bienvenida de los sheriffs de la educación (The Grand Theatre)",
      "s-1-3": "Consejos del viajero del conocimiento: «Que la creatividad te acompañe», conferencia de Rafa Fortis",
      "s-1-4": "Cabalgata de éxitos de la frontera",
      "s-2-1": "Las lecciones del Oeste (Aulario del Correo): talleres prácticos 1",
      "s-2-2": "Desayuno del pionero (Cantina de Tiza Seca)",
      "s-2-3": "Las lecciones del Oeste (Aulario del Correo): talleres prácticos 2",
      "s-2-4": "Repostaje de víveres y agua (Cantina de Tiza Seca)",
      "s-2-5": "El desafío de las seis cartas (en las calles de Tiza Seca Town)",
      "s-2-6": "Las lecciones del Oeste (Aulario del Correo): talleres prácticos 3",
      "s-2-7": "Juego: El duelo final (Arenal de los desafíos)",
      "s-2-8": "El regreso a la frontera educativa (Saloon): clausura de las jornadas",
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
      "experiencia-exito": "Experiencia de éxito",
      conferenciante: "Conferenciante",
      "creacion-web": "Creación web",
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
