# JIA-2026-09-18-12 — Hotfix: flechas dentro de la anchura del cubo y nueva pista

**Prompt:** `docs/prompts/JIA-2026-09-18-12-hotfix-flechas-cubo-y-pista.md` · **Fecha:** 2026-09-18 · **Agente:** Claude Code ·
**Estado:** IMPLEMENTADO · **Nivel:** LEVEL 1 (hotfix) · tmp/scratch: N/A.

## Resumen

- La fila de flechas + leyenda mide `--cube-size` (antes `min(100%, 26rem)`): las flechas coinciden con los bordes de la
  cara frontal. La pista toma el mismo ancho máximo. `components/cube-carousel/CubeCarousel.module.css`.
- Pista: «Desliza el cubo en horizontal. Prueba suerte.» en `lib/content/copy/es/sections/jornadas.ts` (único sitio).

## Verificación

`tsc`, `check:content`, `next build`: OK. Medido sobre el export (borde izq. de la flecha izquierda / borde der. de la
derecha frente a la cara frontal): 1440 px → 1020–1360 vs 1020–1361; 390 px → 82–308 vs 81–309; 320 px → 67–253 vs
67–253. Capturas en `evidence/`.

## Riesgos

- Moderado: en móvil la leyenda central se estrecha (~130 px); los nombres largos pasan a dos líneas (la altura mínima
  de la leyenda ya lo absorbe, sin saltos). Sin severos ni críticos.
