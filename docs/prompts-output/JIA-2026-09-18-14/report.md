# JIA-2026-09-18-14 — Cubo a sangre con velo y pose inicial, barra de cine, título de edición, sin Dosieres, localización

**Prompt:** `docs/prompts/JIA-2026-09-18-14-cubo-borde-velo-pose-barra-cine-titulo-dosieres-localizacion.md` ·
**Fecha:** 2026-09-18 · **Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

## Resumen

- **Cubo:** la tarjeta mide lo que la cara (341 = 341 px en 1440; 227 = 227 px en 390). La rejilla de la cara tiene
  ahora una celda definida, porque `height: 100%` no se resolvía y la imagen se recortaba. Velo nuevo
  (`--jia-gradient-cube-veil` en `palette.css`): terracota 5–7 % en el centro, terracota profunda 26 % y tinta 58 %
  hacia las esquinas, bajo los reflejos y el sombreado.
- **Pose inicial:** `CUBE_CONFIG.initialTurn = 14`; está también en el marcado para que no salte al llegar el motor.
  El primer paso, arrastre o giro automático lo deja frontal; si lo primero es un giro vertical, antes se endereza.
- **Duración:** giro vertical y horizontal comparten `STEP_SECONDS = 0,9` (medido ≈ 0,94 s y 0,91 s; antes 1,05 s).
- **Barra de cine** (`IntroVideo`): franja de tinta de 59 px (48 px en móvil) con el título de la edición en la
  cursiva de edición y el rótulo «INTRO» a la izquierda sobre el filete.
- **Título de edición:** «Aulas de cine: el duelo», estado `confirmed` (desaparece el aviso del pie). README, DESIGN y
  PRODUCT actualizados; «El reto» queda como alternativa histórica en `site.ts`.
- **Dosieres:** sección, componente, entrada de menú y atajo del hero eliminados; la fila de atajos reparte sus
  columnas según cuántos haya. Textos y modelo de dosieres se conservan (los usa «Descargar dosier» de cada taller).
- **Propuestas, pie, programa y «Quién hace posible»:** según el encargo. El pin del mapa reutiliza los trazos de
  `assets/icons/map.svg` en tres tonos de la paleta (terracota, cobre, tinta), en un aro de 44 px.
- **Sin confirmar, incluidos y señalados en el prompt:** tipografía de «Cómo funcionan» y disparo al hacer clic.

## Verificación

`tsc`, `check:content`, `next build`: OK. Sin desbordamiento horizontal a 1440 y 390 px. Agujeros medidos en el píxel
del clic (3 de 3; el clic fuera de la cara se ignora). Crédito del estudio: centro 720 / 720 px. Capturas en `evidence/`.

## Riesgos

- **Moderado:** `scripts/qa-cube.mjs` aún comprueba que un clic en el cubo avanza; con el disparo esa comprobación
  falla. Propuesta: actualizarla cuando el promotor confirme el disparo (o revertir `onShot`).
- **Moderado:** en la pose inicial girada el clic no dispara (solo con el cubo de frente). Propuesta: tomar el punto
  con `offsetX/offsetY` de la cara pulsada si el disparo se queda.
- **Moderado:** si algún día se cargan recursos, los enlaces «ver dosier» de las fichas apuntan a `#dosieres-…`, que
  ya no existe. Propuesta: redirigirlos a la descarga del taller al cargar el primer recurso.
- Sin severos ni críticos.
