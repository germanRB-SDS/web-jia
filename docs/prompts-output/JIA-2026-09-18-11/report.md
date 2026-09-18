# JIA-2026-09-18-11 — Vídeo un 10 % más alto, línea de «Programa» oculta, «Cómo funcionan» sin huecos y cubo perfecto con giro vertical

**Prompt:** `docs/prompts/JIA-2026-09-18-11-intro-alto-programa-linea-cubo-vertical.md` · **Fecha:** 2026-09-18 ·
**Agente:** Claude Code (Impeccable · layout) · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

**Commits:** `9bc5f6e` prompt · `15fee87` implementación. Rollback: `git revert 15fee87`.

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Vídeo | `JORNADAS_INTRO_VIDEO_MAX_HEIGHT`: `min(78vh, 780px)` → `min(86vh, 858px)` (+10 %). En 1440×900 el bloque pasa de 702 a 774 px: se recorta menos fotograma. | `lib/content/sections/jornadas-intro-video.ts` |
| Línea de «Programa» | La regla `border-top` de los pliegos queda **comentada** con su motivo; los pliegos siguientes la conservan con `.sub + .sub`. Medido: `#programa` 0 px, `#como-funcionan` 1 px. | `components/site/Section.module.css` |
| «Cómo funcionan» | Una sola columna de lectura (prosa → «Quién está detrás» → entradilla, separadas por un único intervalo) y el cubo a la derecha, alineado con la primera línea. Columna de texto más estrecha (`1fr / auto`) para que ambas columnas terminen a alturas parecidas. En móvil, apilado en el mismo orden. | `components/site/Jornadas.tsx/.module.css` |
| «29 personas» | Retirado del render, del modelo y del copy. | `assemble.ts`, `copy/types.ts`, `copy/es/sections/jornadas.ts` |
| Degradados | Tokens nuevos de paleta (solo combinan tokens existentes): `--jia-gradient-spotlight` (foco cálido tras el cubo), `--jia-gradient-floor` (suelo terracota) y `--jia-gradient-cube` (barniz de las caras). Se desvanecen a transparente: sin bordes. | `app/theme/palette.css` |
| Cubo perfecto | Cubo real de **seis caras y aristas vivas**; se retiran las facetas y esquinas gastadas (dejaban pequeños escalones laterales en reposo). Cubo cerrado: las juntas de antialias dejan ver el interior oscuro, nunca la página. | `components/cube-carousel/*` |
| Fondo con reflejos | Cada cara lleva el barniz en degradado (terracota profunda → tinta → tinta oscurecida), un destello en la esquina superior y un reflejo diagonal que se desliza según el ángulo (`--cube-sheen`), también sobre la tarjeta. | `CubeCarousel.module.css`, `cube-engine.ts` |
| Giro vertical cada 4 | El paso de la 4.ª a la 5.ª tarjeta (8.ª→9.ª, …) rueda sobre X: la cara superior trae la siguiente, con la tarjeta siempre derecha (`--cube-spin`). Al retroceder por esa frontera entra la cara inferior y gira al revés. Al aterrizar, la cara frontal recibe la tarjeta sin verse y el cubo vuelve a estar derecho. El cubo encoge un 14 % a mitad de giro para no pisar la leyenda. | `cube-engine.ts`, `config.ts` (`verticalEvery`, `roll`) |
| Arrastre | El arrastre horizontal se mantiene dentro del tramo de 4; en una frontera, el mismo gesto hace rodar el cubo en vertical (se completa o se cancela al soltar). Cola de pasos para clics rápidos. | `cube-engine.ts` |
| Clic/tap | Un clic o toque en el cubo pasa a la siguiente (el clic que cierra un arrastre no cuenta). Flechas intactas. | `cube-engine.ts` |
| Pista | En mayúsculas, 11 px (antes 13), tracking 0.1em, equilibrada a dos líneas. | `CubeCarousel.module.css` |

## Verificación

- `tsc --noEmit`, `check:content`, `next build`: OK. Consola sin errores.
- `scripts/qa-cube.mjs` sobre el export (escritorio con ratón, móvil con eventos táctiles reales): 29 tarjetas distintas en orden con vuelta al inicio; 0 caras sin cargar; cubo siempre derecho al terminar cada paso; **giros verticales exactamente al salir de 4, 8, 12, 16, 20, 24, 28** (y cada 4 pasos tras la vuelta); retroceso por la frontera con inclinación de signo contrario (+35° frente a −35°); clic/tap avanza 5→6; arrastre 2→3 sin doble paso; sin overflow horizontal.
- Capturas: `evidence/como-funcionan-desktop.png`, `-mobile.png`, `cubo-giro-horizontal-y-vertical.png`, `intro-desktop.png`, serie `cubo-*`.
- **No verificado con herramienta:** Safari/iOS y Firefox reales; contraste percibido del reflejo sobre las tarjetas en pantallas de baja gama; lector de pantalla real.

## Riesgos

- **Moderado — interpretación de «perfecto»:** se ha leído como cubo geométricamente perfecto (aristas vivas). Si se quería conservar el redondeo, es un `git revert` parcial del CSS; el giro vertical complica redondear las 12 aristas.
- **Moderado — `color-mix()` y `mix-blend-mode`** en el barniz y el reflejo: soportados en navegadores de 2023+; en anteriores la cara cae a `--jia-ink` liso (hay valor de respaldo) y el reflejo se ve algo más plano.
- **Moderado — autoplay sin botón de pausa** (igual que en -10): cesa a la primera interacción y se detiene con hover/foco.
- **Moderado — negro literal** en el tinte de luz y la sombra de la pegatina (neutro, no de marca).
- Sin severos ni críticos.

## Siguiente paso

Revisión del promotor en dispositivo real (iPhone/Safari) del giro vertical y del reflejo.
