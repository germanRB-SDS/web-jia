/**
 * EL CIERRE DE TIZASECA ([71-0]) — la despedida de las JIA 2026, entre «Dispara tu centro» y «Quiénes somos».
 *
 * `aftermovieUrl` es a dónde lleva «Ver el aftermovie» (YouTube, otra pestaña). `null` = sin vídeo: el botón explica
 * que no está disponible en vez de llevar a un enlace roto. `youtubeId` permite comprobar, al primer gesto del
 * visitante, si YouTube sigue teniendo el vídeo (lib/media/use-youtube-check.ts); nunca al cargar la página.
 */
export const cierreConfig = {
  id: "cierre",
  aftermovieUrl: "https://www.youtube.com/watch?v=wBjSQhmkqe8" as string | null,
  youtubeId: "wBjSQhmkqe8" as string | null,
  /** Columna visual de la derecha; null deja una superficie de pergamino. */
  mediaId: "cierre-tizaseca" as string | null,
} as const;
