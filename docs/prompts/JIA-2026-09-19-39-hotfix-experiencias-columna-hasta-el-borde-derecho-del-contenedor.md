# JIA-2026-09-19-39 — Hotfix: «Experiencias» — la columna llega al mismo borde derecho que las tarjetas de la sección anterior

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat (con el texto de la sección y el HTML del título y la
entradilla). **Nivel:** LEVEL 1 (hotfix; resultado al final de este prompt, sin `report.md`). tmp/scratch: N/A.
**Estado:** EJECUTADO (2026-09-19) — ver «Resultado» al final.

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

## Resultado (2026-09-19)

| Ventana | Hueco a la derecha (Talleres = Experiencias) | Tarjeta: antes → ahora | Aire arriba/abajo del contenido |
|---|---|---|---|
| 1920 | 320 px = 320 px | 243 × 392 → 291 × 419 px | 89 px |
| 1440 | 80 px = 80 px | 262 × 369 → 298 × 389 px | 24 px |
| 1280 | 51 px = 51 px | 243 × 347 → 275 × 365 px | 11 px |

- `Experiences.module.css`: el margen derecho de la columna vuelve a ser el del contenedor (la columna empieza donde
  empezaba y es un 5 % del ancho de la sección más ancha); cabecera y entradilla con `max-width: none`. A 1920 el
  título pasa de tres líneas a dos y la entradilla de tres a dos.
- Título y entradilla van ahora de borde a borde de la columna (979–1600 px a 1920), igual que la fila de tarjetas.
- `tsc`, `check:content` y `next build` ok; `scrollWidth = clientWidth` a 1920 y 1440 (a 1280 siguen los 1290 px
  previos y ajenos). Capturas en `docs/prompts-output/JIA-2026-09-19-39/evidence/`.
- **Riesgo menor:** a 1280 px el contenido llena casi todo el alto de la sección (11 px de aire arriba y abajo;
  antes 20). Cabe, pero una entradilla más larga o un título de tarjeta de tres líneas desbordaría a ese ancho.
- **Nota de proceso:** el commit de este prompt falló en el primer intento por un `index.lock` del cliente Fork
  (`git add -A` del promotor, en curso); el cambio de CSS se aplicó antes de poder commitear el prompt. Se esperó a que
  Fork terminara y se commiteó con rutas explícitas, sin arrastrar lo que Fork dejó preparado. Sin push (no se pidió).
