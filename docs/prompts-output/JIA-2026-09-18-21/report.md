# JIA-2026-09-18-21 — Pie: los estepicursores con el ratón en cualquier punto del pie, nota enlazada y disparos

**Prompt:** `docs/prompts/JIA-2026-09-18-21-pie-hover-en-todo-el-pie-nota-estepicursores-y-disparos.md` ·
**Fecha:** 2026-09-18 · **Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

## Resumen

- **Disparo de la animación:** `StudioStrip` escucha `pointerenter/leave` y `focusin/out` en el `<footer>`; el campo,
  su frecuencia (2–5 s) y el tope de 8 no cambian (`tumbleweeds/config.ts` intacto).
- **Nota:** enlace «Sí, son estepicursores» (11 px, mayúsculas, extremo derecho de la franja; bajo el crédito en
  < 760 px), pestaña nueva, nombre accesible con «(se abre en una pestaña nueva)». El crédito sigue en el eje de la
  página (720 / 720 px a 1440; 300 / 300 a 600).
- **Textos por sección:** los del pie salen de `copy/es/common.ts` a `copy/es/sections/footer.ts` (con la nota y el
  aviso de pestaña nueva); la URL y el tope de balazos, a `lib/content/sections/footer.ts`. Revisados los componentes
  nuevos de la sesión (`StudioStrip`, `FooterShots`, `IntroVideo`, `Jornadas`, `Proposals`, `Experiences`): ningún
  texto visible en el código.
- **Balazos:** el agujero del cubo pasa a ser una pieza compartida (`primitives/BulletHole`, con
  `--hole-size / --hole-ink-rgb / --hole-paper-rgb`); el cubo y el pie la usan. En el pie, `FooterShots` ignora los
  clics sobre enlaces y controles, guarda los 12 últimos y no intercepta el puntero. Sobre tinta, grietas y cerco van
  en terracota profunda (nuevo canal `--jia-terracotta-deep-rgb` en la paleta).

## Verificación (Chrome real por CDP)

Ratón en la columna de marca del pie (lejos del crédito): 1 estepicursor a los 0,7 s y 3 a los ~6,5 s; al salir del
pie, 3 → 3 en 6 s (ningún nacimiento). Dos clics en fondo liso → agujeros en el píxel del clic (±1 px); clic sobre un
enlace → sin agujero. El cubo sigue marcando sus disparos en el píxel exacto. `tsc`, `check:content`, `next build`: OK.

## Ajuste posterior (mismo encargo)

A petición del promotor, la nota «Sí, son estepicursores» pasa de la rejilla del contenedor a la esquina inferior
derecha de la franja: pegada a la línea donde termina (2 px) y a 8 px del borde derecho, en 1440 y en 390 px, sin
solaparse con el crédito, que sigue centrado (720 / 720 y 195 / 195). En < 760 px la franja gana 0,5 rem de pie para
que quepa bajo el crédito. Capturas `nota-esquina-*.png`.

## Riesgos

- **Moderado:** los agujeros del pie se colocan en porcentaje del pie; si el pie cambia de alto (giro de pantalla) se
  desplazan con él. Aceptable para un adorno efímero (no se guardan entre visitas).
- **Moderado:** `scripts/qa-cube.mjs` sigue esperando que el clic avance el cubo (pendiente desde JIA-14).
- Sin severos ni críticos.
