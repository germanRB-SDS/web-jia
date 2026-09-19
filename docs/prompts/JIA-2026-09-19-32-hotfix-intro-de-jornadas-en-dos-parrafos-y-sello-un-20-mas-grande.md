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
