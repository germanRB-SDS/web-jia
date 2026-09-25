# [52-0] Vídeo de introducción sin recorte vertical

## Metadata y objetivo

- Fecha: 2026-09-25. Agente: Codex. Estado: IMPLEMENTADO. Nivel: LEVEL 2. Área y memoria: frontend, `docs/memory/frontend.md`. Change ID: `REL-2026-09-25-01` (rama aislada).
- Objetivo: mantener el MP4 web en 16:9 y a la altura máxima actual, mostrando todo su fotograma en el bloque de Jornadas y llenando los márgenes de pantallas anchas con una extensión discreta del póster.
- Continuidad temporal: N/A; ejecución de una fase, sin estado parcial ni evidencia extensa que requiera `tmp/`.

## Resumen de fase

El original es H.264/AAC 3840×2160, 25 fps, 272,6 s y 2.103.755.320 bytes. El antiguo derivado también era 16:9 (1280×720); el recorte vertical provenía de `object-fit: cover` cuando el marco llegaba a `min(86vh, 858px)`. El nuevo MP4 se regeneró desde el original con H.264 High, AAC 96 kb/s, CRF 28, `preset slow`, escalado Lanczos y `faststart`: 38.823.483 bytes, un 6,5 % menos que los 41.533.732 bytes anteriores. La vista normal usa `contain` y un póster desenfocado y oscurecido en los lados. La vista fullscreen conserva el vídeo completo y el fondo tinta.

Ficheros de implementación: `public/jornadas/intro/intro-720.mp4`, `components/site/IntroVideo.module.css`, `lib/content/sections/jornadas-intro-video.ts`, `scripts/build-assets.sh`. El original de `assets/videos-website/` queda intacto. La URL, el póster, los controles, el audio y el tiempo de carga diferida siguen sus contratos actuales. `docs/prompts/[52-0]intro-video-sin-recorte.md` registra la instrucción.

## Impacto y verificación

- UI: el marco sigue ocupando el ancho y la altura definidos en las constantes. En 1920 px, la inspección del navegador midió un marco de 1905×858 px, `object-fit: contain` y el póster como fondo lateral; se comprobó visualmente que los bordes superior e inferior del fotograma permanecen visibles. En 390 px el marco mide 390×219,375 px y muestra el 16:9 completo.
- Medio: `ffprobe` confirmó H.264/AAC, 1280×720, 25 fps y 272,6 s. `ffmpeg -xerror -i ... -f null -` decodificó el archivo entero sin error. Se compararon fotogramas del original, derivado anterior y nuevo a los 8 s y 120 s.
- Código y export estático: `bash -n scripts/build-assets.sh`, `git diff --check`, `npx tsc --noEmit`, `npm run check:content` y `npx next build` pasaron con Node 24.19.0. El export contiene el nuevo MP4.
- Backend, API, BBDD, iOS y Android: N/A; cambio de medio y presentación web. Persistencia y linaje de datos: N/A; presentación solamente. Checklist E2E: fuente → derivado → URL de contenido → reproductor → marco ancho/móvil comprobados.
- Verification: V2 | decodificación completa, inspección del reproductor y consumidores, TypeScript, contenido, build | PASS. Capturas temporales de la inspección local: `/private/tmp/jia-wide-video.png` y `/private/tmp/jia-mobile-video.png`.

## Análisis de riesgo y soluciones propuestas

- Moderado: el MP4 de 38,8 MB sigue versionado y servido desde el sitio. Destino: decisión de despliegue futura; moverlo a un origen con peticiones de rango si el tráfico lo exige.
- Moderado: la extensión lateral utiliza el póster fijo; en escenas posteriores sus colores pueden diferir del fotograma. Destino: revisión visual del promotor; si resulta perceptible, ajustar el tratamiento del fondo sin recortar el vídeo.
- Severo: ninguno detectado; reproducción, duración y audio se mantuvieron y el archivo se decodificó entero. Crítico: ninguno nuevo detectado; no se tocaron seguridad, datos ni contratos externos.
- Memoria permanente: N/A; la decisión queda en constantes, CSS y este informe. La implementación se integró en `main` por rutas explícitas, preservando la edición concurrente de Experiencias.
