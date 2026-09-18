/**
 * JORNADAS · INTRO — el vídeo que abre la sección, antes del Programa (JIA-2026-09-18-10).
 *
 * Este fichero es el único sitio donde se decide QUÉ vídeo se ve y CUÁNTO ocupa. Para cambiar
 * de vídeo (otra edición, otro alojamiento) basta tocar estas constantes; el componente
 * `components/site/IntroVideo.tsx` no conoce ninguna URL.
 *
 * El vídeo no se descarga con la página: el navegador solo lo pide cuando el bloque se acerca
 * a la pantalla. El original (assets/videos-website, 4K, 2,1 GB) no es un recurso web; la
 * versión ligera la genera `scripts/build-assets.sh`. En producción conviene alojarla en un
 * servicio con peticiones de rango (hosting propio/CDN o un servicio de vídeo) y pegar aquí su
 * URL absoluta. Google Drive no sirve vídeo de forma fiable a una etiqueta <video>.
 */

/** URL del vídeo (ruta del sitio o URL absoluta https://…). `null` deja solo el póster. */
export const JORNADAS_INTRO_VIDEO_URL: string | null = "/jornadas/intro/intro-720.mp4";

/** Tipo MIME de la URL anterior. */
export const JORNADAS_INTRO_VIDEO_TYPE = "video/mp4";

/** Fotograma que se ve mientras el vídeo no ha cargado (y si no llega a cargar). */
export const JORNADAS_INTRO_VIDEO_POSTER: string | null = "/jornadas/intro/intro-poster.webp";

/**
 * Altura máxima del bloque: la misma que la banda del jinete (el velo de «Las jornadas»,
 * `min-height: min(78vh, 780px)` en Jornadas.module.css). El vídeo ocupa todo el ancho y se
 * recorta (cover) para no pasar de aquí.
 */
export const JORNADAS_INTRO_VIDEO_MAX_HEIGHT = "min(78vh, 780px)";

/** Proporción del vídeo (ancho / alto): reserva el hueco antes de que cargue. */
export const JORNADAS_INTRO_VIDEO_ASPECT = 16 / 9;

/** Arranca solo y en silencio al entrar en pantalla (nunca con «reducir movimiento»); en bucle. */
export const JORNADAS_INTRO_VIDEO_AUTOPLAY = true;
export const JORNADAS_INTRO_VIDEO_LOOP = true;

/** Ancla del bloque (`#intro`). */
export const JORNADAS_INTRO_ANCHOR = "intro";

export const jornadasIntroVideo = {
  anchor: JORNADAS_INTRO_ANCHOR,
  src: JORNADAS_INTRO_VIDEO_URL,
  type: JORNADAS_INTRO_VIDEO_TYPE,
  poster: JORNADAS_INTRO_VIDEO_POSTER,
  maxHeight: JORNADAS_INTRO_VIDEO_MAX_HEIGHT,
  aspect: JORNADAS_INTRO_VIDEO_ASPECT,
  autoplay: JORNADAS_INTRO_VIDEO_AUTOPLAY,
  loop: JORNADAS_INTRO_VIDEO_LOOP,
} as const;
