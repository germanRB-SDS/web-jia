# JIA-2026-09-18-19 — Experiencias: la maestra a la izquierda, el contenido a la derecha y la sección a la altura de la foto

**Prompt:** `docs/prompts/JIA-2026-09-18-19-experiencias-foto-a-la-izquierda-altura-de-la-imagen.md` ·
**Fecha:** 2026-09-18 · **Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

## Resumen

- Nueva fotografía `assets/images-website/aula-maestra2.png` (la maestra a la izquierda); derivados regenerados con
  los mismos nombres (`public/experiencias/aula-960.webp`, `aula-1916.webp`), `media.ts` y `build-assets.sh`
  actualizados. El original anterior (`aula-maestra-clase.png`) queda sin uso en `assets/`.
- ≥ 1280 px: la sección mide exactamente lo que la foto (`100vw × 821 / 1916`) y no tiene margen propio; el
  contenido ocupa la columna que va desde donde la foto se aclara (56 % del ancho) hasta el borde del contenedor,
  centrado en vertical. Para caber: título y entradilla con escala propia de la sección, fichas en dos columnas y
  con imagen 16:9 (`SheetCard` admite `mediaRatio`).
- < 1280 px: la foto es una banda 16:10 sobre el título, recortada hacia la maestra, con la base fundida en el suelo;
  el contenido va debajo. Tampoco ahí hay nada encima de la foto.

## Verificación

Medido (sección / foto / esperado · aire sobre y bajo el contenido · inicio del contenido):
1280 → 548/548/548 · 42/42 · x = 717; 1440 → 617/617/617 · 59/59 · x = 806; 1680 → 720/720/720 · 95/95 · x = 941;
1920 → 823/823/823 · 100/100 · x = 1075; 2560 → 1097/1097/1097 · 226/226 · x = 1434.
`tsc`, `check:content`, `next build`: OK. Capturas a 1440, 1920, 1024 y 390 px en `evidence/`.

## Riesgos

- **Moderado:** la altura fija solo admite el contenido actual (dos fichas). Con más fichas o títulos más largos el
  contenido desbordará la sección a 1280–1440 px. Propuesta: al cargar casos reales, pasar a carrusel horizontal dentro
  de la columna o subir el umbral del modo «banda».
- **Moderado (previo a este cambio):** a 1280 px la página mide 10 px más que la ventana en horizontal; ocurre
  igual sin estos cambios. Propuesta: localizarlo en una tarea propia.
- Sin severos ni críticos.
