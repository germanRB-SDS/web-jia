import type { Copy } from "../types";

/**
 * ENTITY TEXT (es). Keyed by the ids in ../../data. Subtitles are printed on the
 * posters; summaries are provisional one-liners derived only from those
 * subtitles; objectives are unknown (null) until the organisation provides them.
 */
export const workshops: Copy["entities"]["workshops"] = {
  "w-scratch": {
    subtitle: "Animación con Scratch",
    theme: "Programación creativa",
    summary: "Crear animaciones con bloques de programación y pensar cómo convertirlas en una actividad de aula.",
    objectives: null, stages: null, duration: null, place: null, requirements: null,
    status: "provisional",
  },
  "w-canva": {
    subtitle: "Creación y edición de vídeos con Canva",
    theme: "Vídeo y producción audiovisual",
    summary: "Grabar, montar y editar piezas de vídeo con Canva para contar historias desde el aula.",
    objectives: null, stages: null, duration: null, place: null, requirements: null,
    status: "provisional",
  },
  "w-corto": {
    subtitle: "Del aula a la gran pantalla: crea un cortometraje desde 0",
    theme: "Cortometraje",
    summary: "Recorrer el proceso completo de un cortometraje, de la idea al plano, con el alumnado como equipo de rodaje.",
    objectives: null, stages: null, duration: null, place: null, requirements: null,
    status: "provisional",
  },
  "w-stopmotion": {
    subtitle: "Dar vida a las ideas: stop motion para el aula",
    theme: "Stop motion",
    summary: "Animar fotograma a fotograma con materiales sencillos y llevar la técnica a proyectos de clase.",
    objectives: null, stages: null, duration: null, place: null, requirements: null,
    status: "provisional",
  },
  "w-album": {
    subtitle: "Crea un álbum ilustrado de película",
    theme: "Ilustración",
    summary: "Construir un álbum ilustrado a partir de una película: personajes, escenas y narrativa visual.",
    objectives: null, stages: null, duration: null, place: null, requirements: null,
    status: "provisional",
  },
  "w-podcast": {
    subtitle: "Radio / Podcast",
    theme: "Radio y podcast",
    summary: "Explorar el formato sonoro, de la escaleta a la grabación, y sus posibilidades en el aula.",
    objectives: null, stages: null, duration: null, place: null, requirements: null,
    status: "provisional",
  },
};

export const experiences: Copy["entities"]["experiences"] = {
  "x-demo-1": {
    title: "Ejemplo de ficha: un podcast escolar",
    lede: "Esta tarjeta muestra cómo se presentará una experiencia real cuando el profesorado la comparta.",
    presents: "Docente o equipo que la llevó al aula",
    audience: "Etapa educativa o grupo destinatario",
    need: "Qué necesidad del aula quiso resolver",
    development: "Cómo se desarrolló, paso a paso, y con qué tiempos",
    resources: "Materiales, herramientas y espacios utilizados",
    learnings: "Qué aprendió el grupo y qué aprendió quien la impartió",
    adaptations: "Qué conviene ajustar antes de trasladarla a otro contexto",
    status: "demo",
  },
  "x-demo-2": {
    title: "Ejemplo de ficha: animación en stop motion",
    lede: "Segunda ficha de demostración, sin fotografía, para comprobar el fallback de color y la apertura por teclado.",
    presents: "Docente o equipo que la llevó al aula",
    audience: "Etapa educativa o grupo destinatario",
    need: null,
    development: "Cómo se desarrolló, paso a paso, y con qué tiempos",
    resources: null,
    learnings: null,
    adaptations: "Qué conviene ajustar antes de trasladarla a otro contexto",
    status: "demo",
  },
};

export const resources: Copy["entities"]["resources"] = {};
