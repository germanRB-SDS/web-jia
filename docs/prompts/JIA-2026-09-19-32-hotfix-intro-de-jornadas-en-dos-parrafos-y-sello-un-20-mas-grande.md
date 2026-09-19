# JIA-2026-09-19-32 — Hotfix: la intro de «Las jornadas» en dos párrafos y el sello un 20 % más grande

**Fecha:** 2026-09-19 · **Origen:** mensajes del promotor en chat, mientras se cerraba JIA-31 («hotfix on the fly»).
**Nivel:** LEVEL 1 (hotfix; resultado dentro de este prompt) · tmp/scratch: N/A.
**Estado:** EJECUTADO (2026-09-19). Se guarda junto con su ejecución porque las peticiones llegaron encadenadas por chat.

## Encargo (palabras del promotor)

1. En la intro de «Las jornadas», que «Esperamos que disfrutes de los talleres que te listamos a continuación:» esté en
   **otro párrafo**, con **una línea en blanco** antes.
2. El sello de al lado (`.sealImg`), **un 20 % más grande**, «pero no la subas hacia arriba».
3. (Probado y retirado) «La bajas un poquito para que quede centrado respecto a la vertical del texto» → tras verlo:
   **«no bajes la imagen, corrige eso»**. Queda colgado de arriba, como estaba.

## Resultado

- `copy.jornadas.intro` pasa de `string` a `readonly string[]` (un elemento por párrafo): `copy/types.ts`,
  `copy/es/sections/jornadas.ts`, `assemble.ts`. `Jornadas.tsx` pinta un `<p>` por párrafo dentro de `.statement`;
  `.statement p + p { margin-top: 1.5em }` = exactamente una línea (medido: 32,4 px a 1440, 27 px a 390).
- Sello: `clamp(7.8rem, 38.4 %, 13.62rem)` (= × 1,2) **donde la columna tiene sitio** (container query ≥ 28rem, ventanas
  desde ≈ 1360 px): 218 px a 1920 (antes 182), 183 px a 1440 (antes 153). En columnas más estrechas conserva el tamaño
  anterior (125 px a 1180) para no estrangular el párrafo. `align-items: flex-start`: mismo borde superior que el
  texto (1039/1039 a 1920; 1028/1028 a 1440); crece hacia abajo y hacia el párrafo, nunca hacia arriba.
- Verificado en Chrome (CDP) a 1920, 1440, 1180, 900, 800 y 390; `tsc`, `check:content`, `next build` en verde.
  Evidencias en `docs/prompts-output/JIA-2026-09-19-32/evidence/`.
- Riesgo menor: a 1440 el párrafo queda en 262 px de ancho (≈ 28 caracteres por línea) al lado del sello de 183 px;
  si se ve apretado, bajar el 38.4 % o subir el umbral de 28rem en `Jornadas.module.css`.
- Nota: `copy/es/sections/jornadas.ts` tenía además un cambio local del promotor sin subir («Desliza el dado…»); este
  commit lleva solo el cambio de la intro y ese otro sigue en el árbol, sin tocar.

## Corrección posterior del promotor (2026-09-19, por chat) y resultado

«¿El párrafo de "Esperamos que disfrutes…" podría continuar **por debajo de la imagen circular**? Que continúe, no que
se corte, hasta el borde (con el mismo padding derecho que tiene la imagen de las JIA que está justo encima).»

- El sello pasa de columna aparte (flex) a **flotar arriba a la derecha dentro del texto** (`float: right`, mismo ancho
  y mismo borde superior): el texto va a su lado mientras dura y **ocupa todo el ancho por debajo**, hasta el mismo
  borde derecho que el sello. Desaparece `.statementRow`; `.statement` es el contenedor (`display: flow-root`, sin
  `max-width`, para que su borde derecho sea el del sello).
- Medido en Chrome (CDP): a 1920 el sello acaba en y = 1341 y el segundo párrafo empieza en 1354, a todo el ancho
  (su línea llega a x = 1814 de 1826); a 1440 ya las últimas líneas del primer párrafo pasan por debajo (x = 1372 de
  1384). A 800 px el sello es más alto que el texto y el segundo párrafo queda a su lado (comportamiento natural del
  contorneo). < 760 px y columnas < 22rem: sin sello, como antes. Evidencias a 1920 y 1440 en la misma carpeta.
