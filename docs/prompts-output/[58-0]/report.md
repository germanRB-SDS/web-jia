# [58-0] Informe — Nueva hoguera y «Comunica tu idea» en «Tu propuesta JIA»; Talleres vuelve a la rejilla fuera del móvil

**Estado:** EXECUTED (29-09-2026). Prompt: [`docs/prompts/[58-0]propuesta-nueva-hoguera-boton-y-talleres-como-antes.md`](../../prompts/[58-0]propuesta-nueva-hoguera-boton-y-talleres-como-antes.md).
Tmp/scratch: N/A (tarea corta).

## Resumen

- **Talleres:** revertido [57-0] (27db415 revierte a732974). `components/` queda idéntico al estado anterior a la
  baraja (`git diff 65c2990 HEAD -- components/` vacío): baraja en móvil, rejilla de 3×2 desde 760 px. [57-0] marcado
  como no adoptado (09cd9eb); su carpeta de evidencias sin versionar, borrada.
- **Imagen:** `hoguera-02.png` (versionada, 1672×941) sustituye a `hoguera-nuevos-temas.png` como fuente de
  `public/propuestas/hoguera-960/1672.webp`; el original anterior se conserva. `media.ts` y `build-assets.sh`
  actualizados. Mismo encuadre (punto focal `x: 78`).
- **Botón:** «Dispara tu idea» → «Comunica tu idea» (`copy/es/buttons.ts`), mismo enlace al formulario.

## Verificación

- `npx tsc --noEmit`, `npm run check:content`, `npx next build`: OK. `out/index.html`: «Comunica tu idea» ×1,
  «Dispara tu idea» ×0.
- Capturas en Chrome (`evidence/`): la sección a 1440 y 390 px, y Talleres a 1440 (rejilla) y 390 (baraja plegada).

## Riesgos (moderado / severo / crítico)

- **Moderado — encuadre en escritorio.** Con el punto focal heredado (`x: 78`, JIA-2026-09-20-47), desde 1280 px la
  columna recorta la izquierda del fotograma y **la mujer de la izquierda —lo único que cambia en la imagen nueva—
  no se ve**; en móvil sale entera. *Propuesta:* si el promotor quiere que se la vea en escritorio, reencuadrar
  (punto focal más a la izquierda); el coste es perder parte del hombre de la derecha. Pendiente de su decisión.
- **Moderado — la licencia y el origen de la imagen siguen por confirmar**, como los de la anterior.
- Sin riesgos severos ni críticos.

## Commits

14e0eec (prompt) · 27db415 · 09cd9eb · 71e003e · informe (este commit). Push: pendiente del OK del promotor.
