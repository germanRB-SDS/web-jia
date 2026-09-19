# JIA-2026-09-19-39 — Hotfix: «Experiencias» — la columna llega al mismo borde derecho que las tarjetas de la sección anterior

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat (con el texto de la sección y el HTML del título y la
entradilla). **Nivel:** LEVEL 1 (hotfix; resultado al final de este prompt, sin `report.md`). tmp/scratch: N/A.
**Estado:** SIN EJECUTAR

## Encargo

En «Experiencias» («Ideas que ya han pasado por el aula»), **ampliar las dos tarjetas, proporcionalmente**, de modo que
la sección tenga **por la derecha la misma separación con el borde que las tarjetas de la sección anterior**
(Talleres, en «Las jornadas»). Se amplía por tanto el ancho permitido de la columna, y también el del **título**
(`h2#experiencias-title`) y el de la **entradilla** (`p.lede`). Todo sigue siendo adaptativo.

## Medidas de partida (Chrome real, `next dev` :3000)

| Ventana | Tarjetas de Talleres: hueco a la derecha | Tarjetas de Experiencias: hueco a la derecha | Tarjeta de Experiencias |
|---|---|---|---|
| 1920 | 320 px | 416 px | 243 px de ancho |
| 1440 | 80 px | 152 px | 262 px |
| 1280 | 51 px (margen del contenedor) | 115 px | 243 px |

La diferencia es exactamente el 5 % de JIA-2026-09-19-36 (`--aula-shift`), que movió la columna **entera** a la
izquierda restando el 5 % a la izquierda y **sumándolo a la derecha**. Las tarjetas de Talleres acaban en el borde
derecho del contenedor: `max(var(--gutter), (100% - var(--container)) / 2)`.

## Qué hacer (solo `components/site/Experiences.module.css`, diseño ancho ≥ 1280 px)

- El margen derecho de la columna vuelve a ser el del contenedor (se quita el `+ var(--aula-shift)`); el izquierdo se
  queda como está (`--aula-clear − --aula-shift`). La columna **se ensancha un 5 % del ancho de la sección** en lugar de
  estar desplazada: las tarjetas crecen en ancho y, por su proporción 16/9, en alto.
- El título y la entradilla dejan de tener tope propio dentro de esta sección (`max-width: none` en la cabecera y en su
  párrafo): ocupan el ancho de la columna.
- La sección mide lo que la fotografía (alto fijo): comprobar que el contenido, ahora algo más alto, **sigue cabiendo**
  a 1280, 1440 y 1920.

## Reglas

Prompt commiteado antes de ejecutar; commit al terminar; sin push salvo que se pida. `git add` solo de ficheros
propios. Verificación: medir de nuevo los huecos (deben coincidir con los de Talleres), `tsc`, `check:content`,
`next build`, capturas a 1920, 1440 y 1280, `scrollWidth`.
