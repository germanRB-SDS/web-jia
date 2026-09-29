import type { Copy } from "../../types";

export const experiencias: Copy["experiencias"] = {
  title: "Ideas de cine que ya han pasado por el aula",
  lede: "Cultiva las experiencias educativas desde la práctica. Disfruta de la experiencia tal y como nos muestran nuestros compañeros de cine.",
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
    poster: "Experiencia de éxito {n} de {total}: {name}. Recompensa: {reward}. Ver cartel",
    alt: "Cartel «Wanted» de la experiencia de éxito de {name}. Recompensa: {reward}.",
    pause: "Pausar la película",
    play: "Reanudar la película",
    previous: "Fotograma anterior",
    next: "Fotograma siguiente",
    close: "Cerrar imagen",
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
