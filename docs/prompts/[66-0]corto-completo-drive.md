# [66-0] «¡Ver el corto completo!»: el corto entero desde Google Drive en una ventana emergente

- Fecha: 2026-10-15 · Rama: `main` · LEVEL 2 (UI, un servicio externo incrustado; sin backend/auth)
- Áreas: `frontend` · Prácticas: 05, 06, 12, 14, 16 · skill Impeccable
- Salida: `docs/prompts-output/[66-0]/report.md` (+ `evidence/`)
- Rollback previsto: el promotor puede pedirlo si no le gusta la estética → `git revert` de los commits de implementación.

## Entrada del promotor

El clip del bloque «Intro» de Las jornadas no es el corto completo. Decisión tras evaluar opciones (2026-10-15):
botón «¡Ver el corto completo!» que abre el corto alojado en Google Drive en una ventana emergente, no autoplay
desde Drive. Fuente: https://drive.google.com/file/d/1QjV8iwomCHMMbeQmm51h4S8WaxLyGUyV/view

## Comprobado antes de empezar

- `…/preview` responde 200 sin sesión y sin `X-Frame-Options`: el archivo es público y se puede incrustar.
- El sitio no declara CSP propia (`frame-src`) que lo impida.
- El reproductor de Drive muestra el nombre del archivo («Copia de juntocorregido.mp4»): conviene renombrarlo en Drive.

## Alcance

1. URL de incrustación y de rescate en `lib/content/sections/jornadas-intro-video.ts` (un solo sitio; `null` = sin botón).
2. Textos en `lib/content/copy/` (botón, nombre del diálogo, título del iframe, cerrar, enlace de rescate).
3. Botón en una franja de tinta bajo el vídeo, dentro del pliegue; diálogo modal nativo como el visor del rollo,
   con el `iframe` de Drive en 16:9 creado solo al abrir; el clip se pausa mientras está abierto y sigue al cerrar.
4. Verificación: `tsc`, `check:content`, `next build`, CDP a 1440 y 390 px.

## Hotfix on the fly 1 (2026-10-15)

- La barra superior de Intro («Intro · Jornadas de Innovación de Almería») pasa a tener la misma altura que la franja
  inferior del botón «¡Ver el corto completo!» (hoy más alta).
- Estepicursores animados sobre el fondo marrón de la barra, por detrás de las palabras.
