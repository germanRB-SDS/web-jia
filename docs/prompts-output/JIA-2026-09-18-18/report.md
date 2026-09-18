# JIA-2026-09-18-18 — Experiencias: la fotografía del aula como fondo de la sección

**Prompt:** `docs/prompts/JIA-2026-09-18-18-experiencias-fondo-aula-maestra.md` · **Fecha:** 2026-09-18 ·
**Agente:** Claude Code (criterio `/impeccable`) · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

## Resumen

- Derivados `public/experiencias/aula-960.webp` (16 KB) y `aula-1916.webp` (46 KB); entrada `experiencias-aula` en
  `media.ts`; `experienciasConfig.mediaId` + superficie de sustitución; el modelo expone `media` y `fallback`.
- `Section` admite un `backdrop` (capa a sangre detrás del contenido) y una `className`.
- Escritorio (≥ 900 px): la foto va **entera**, de borde a borde y a su proporción, asentada en el suelo de la
  sección; su mitad izquierda es papel claro (`#f0e3d3`, a un nivel del paso 3) y ahí se apoyan título, entradilla y
  fichas; el 34 % superior se funde con el paso 3. La sección nunca es más baja que la foto. Primera versión
  descartada: con `cover` la foto se ampliaba y el aula quedaba detrás del texto.
- ≥ 1100 px: la rejilla de fichas se limita a 46 rem, así que termina antes de la maestra (a 1440 px las fichas
  acaban en x = 816 y la maestra empieza en ≈ 1075; a 1920 px, 1056 frente a ≈ 1430).
- Móvil y tableta (< 900 px): la foto pasa a ser una banda 16:10 sobre el título, recortada hacia la maestra, y su
  base se funde con el suelo.

## Verificación

Una ronda a 1440, 1920 y 390 px (capturas en `evidence/`). `tsc`, `check:content` (50 medios), `next build`: OK.

## Riesgos

- **Moderado:** con más de dos fichas la rejilla limitada a 46 rem crecerá en filas y la sección en altura; la foto
  sigue asentada abajo, así que las filas superiores quedarán sobre papel liso. Aceptable; revisar al cargar casos reales.
- **Moderado:** origen y licencia de la imagen por confirmar (anotado en `media.ts`, como el resto de fotografías
  aportadas por el promotor).
- Sin severos ni críticos.
