/**
 * JORNADAS · INAUGURACIÓN ([70-0]) — la franja bajo la Intro que lleva al vídeo de la inauguración en YouTube.
 *
 * Único sitio donde se decide A DÓNDE lleva. La franja entera es un enlace que se abre en otra pestaña. `null` = sin
 * vídeo: la franja sigue, pero al pulsarla explica que el vídeo no está disponible (nunca un enlace roto).
 *
 * `YOUTUBE_ID` permite comprobar, cuando el visitante muestra intención (puntero encima, foco, pulsación), si YouTube
 * sigue teniendo el vídeo: su miniatura pública vuelve como un marcador de 120×90 px cuando el vídeo ya no existe.
 * No se pide nada a YouTube al cargar la página.
 */
export const JORNADAS_INAUGURACION_URL: string | null = "https://www.youtube.com/watch?v=LKWcO_QzofA";
export const JORNADAS_INAUGURACION_YOUTUBE_ID: string | null = "LKWcO_QzofA";

/** Ancla de la franja (`#inauguracion`). */
export const JORNADAS_INAUGURACION_ANCHOR = "inauguracion";

export const jornadasInauguracion = {
  anchor: JORNADAS_INAUGURACION_ANCHOR,
  href: JORNADAS_INAUGURACION_URL,
  youtubeId: JORNADAS_INAUGURACION_YOUTUBE_ID,
} as const;
