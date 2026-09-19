# JIA-2026-09-19-28 — Hotfixes del pie: la herradura cae al suelo en 3D, vuelve a los 5 s, y la nota de los estepicursores en la línea del crédito

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat (con tres capturas del pie tras JIA-27).
**Nivel:** LEVEL 1 (ajustes acotados sobre `components/site/horseshoe` y el colofón; el resultado va aquí).
**Reglas:** commit + push del prompt antes de ejecutar; commit + push al terminar.

## Encargo

1. **La herradura cae al suelo, no a la pared.** Hoy, al pulsarla, cae y queda «apoyada en un suelo verticalmente»,
   plana contra la pared (el plano del pie). Se pide que **caiga y quede sobre el suelo**, viéndose **su grosor**: la
   cámara un poco **por encima**, en **perspectiva**, como si la herradura estuviera colgada en una pared, cayese al
   suelo y se quedase en él **ligeramente inclinada** (no del todo plana). El suelo es la línea horizontal del pie.
2. **Vuelve sola a la pared a los 5 s** de quedar en el suelo (hoy 3,6 s).
3. **«Sí, son estepicursores»** en la **misma línea y alineado** con «Diseñado por South Desert Studio» (hoy va
   pegado a la esquina inferior derecha de la franja, más abajo que el crédito).

Además, visto en las capturas: tras pulsar con el ratón, el botón que sigue a la herradura deja un **anillo blanco**
de foco alrededor; se quita para el ratón y se conserva para el teclado.

## Resultado

- **Cámara en perspectiva** (`config.camera`: 20° de campo, elevada 150 px sobre el centro del bloque): a la
  distancia que deja la pared a escala 1:1, la herradura colgada se ve igual que antes y aparece un **suelo**
  (plano receptor de sombra en la línea del pie, 420 px hacia la cámara). La caída pasa a ser en tres dimensiones:
  balanceo en la pared, caída con giro, el vuelco hacia delante (`lay.rotation.x` → −80°, «inclinada», no plana) con
  un cuarto de vuelta de guiñada, dos rebotes y descanso **sobre el suelo, con el grosor y la sombra a la vista**; a
  los **5 s** sube de nuevo a su clavo y recupera el plano de la pared. Grupo anidado `lay` para la tumbada; el
  giro en el plano se reparte entre el pivote (colgada) y `lay` (tumbada) sin salto visual. El botón que la sigue
  proyecta las ocho esquinas de su caja con la cámara nueva.
- **5 s** en `config.fall.restMs`.
- **Nota de los estepicursores** en la fila del crédito: la franja pasa a una rejilla de tres columnas
  (`1fr auto 1fr`) con el crédito centrado y la nota al final de la tercera columna, a la misma altura; por debajo
  de 760 px (una sola columna) la nota queda bajo el crédito, alineada a la derecha.
- Sin anillo tras un clic de ratón (`onMouseDown` evita el foco por puntero); con teclado sigue el contorno marfil.
- Verificación: `tsc`, `check:content`, `next build`; Chrome por CDP a 1920 (colgada, tumbada en el suelo con
  sombra, vuelta a los 5 s) y 1440/390 (franja del crédito). Capturas en
  `docs/prompts-output/JIA-2026-09-19-28/evidence/`.

## Riesgos

- **Menor:** con la cámara elevada la pared sufre un ligero trapecio (≈ 9°) que en la herradura colgada apenas se
  nota; si molestara, bajar `camera.elevationPx`.
- **Menor:** el suelo es invisible salvo por la sombra; en pantallas muy anchas la herradura tumbada puede acercarse
  a la columna «Colabora» (a 1600 px queda a unos 20 px).
