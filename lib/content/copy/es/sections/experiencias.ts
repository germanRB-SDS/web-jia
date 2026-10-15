import type { Copy } from "../../types";

export const experiencias: Copy["experiencias"] = {
  title: "Experiencias de éxito",
  lede: "Aquí puedes descargar las experiencias de éxito (pulsando en la imagen correspondiente) que ya han pasado por el aula. Probadas a tiza. Reconocidas hasta en (Mini)Hollywood.",
  empty: "Las experiencias se publicarán cuando el profesorado participante las confirme.",
  // Escrito con tiza en la pizarra de la fotografía. El corte de línea es editorial: el hueco libre de la
  // pizarra son 185 x 130 px del original, así que el rótulo cabe en tres líneas cortas y no en dos.
  board: ["Jornadas de", "Innovación", "de Almería"],
  fields: {
    presents: "Quién la presenta",
    audience: "Etapa o destinatarios",
    need: "Necesidad abordada",
    development: "Desarrollo",
    resources: "Recursos utilizados",
    learnings: "Aprendizajes",
    adaptations: "Posibles adaptaciones",
  },
  relatedWorkshops: "Talleres relacionados",
  reel: {
    label: "Experiencias de éxito",
    poster: "Experiencia de éxito {n} de {total}: {name}. Recompensa: {reward}. Ver cartel y descargar la experiencia",
    alt: "Cartel «Wanted» de la experiencia de éxito de {name}. Recompensa: {reward}.",
    pause: "Pausar la película",
    play: "Reanudar la película",
    previous: "Fotograma anterior",
    next: "Fotograma siguiente",
    close: "Cerrar imagen",
    download: "Descargar",
    downloadOf: "Descargar la experiencia de éxito de {name} (PDF)",
    // Transcrito de cada cartel. El 1 dice «blibioteca» en la imagen; aquí va bien escrito.
    posters: {
      "gabi-moral": { name: "Gabi Moral", reward: "Pase premium para la biblioteca" },
      "ruben-lopez": { name: "Rubén López", reward: "Este año, eliges tutoría" },
      "toni-navarro": { name: "Toni Navarro", reward: "Silla de profe tipo gamer" },
      "gonzalo-carretero": { name: "Gonzalo Carretero", reward: "Tiempo extra en aula digital" },
      "maria-lopez": { name: "María López", reward: "Doble docencia en tu clase" },
      "pilar-diaz": { name: "Pilar Díaz", reward: "Exención de ir al viaje de 6.º" },
      "cristina-robles-leon": { name: "Cristina Robles / León", reward: "+1 día de libre disposición" },
    },
  },
  status: "provisional",
};
