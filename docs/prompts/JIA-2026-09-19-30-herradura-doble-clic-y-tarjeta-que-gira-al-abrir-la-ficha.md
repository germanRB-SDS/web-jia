# JIA-2026-09-19-30 — Herradura: doble clic con caída simplificada hacia atrás · Ficha de taller: el cartel gira sobre su eje vertical al abrirse (tarjeta 3D con el sello detrás) · Sombra elegante del sello en «Las jornadas»

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat, con la referencia «Immersive 3D Tilt Card Modal»
(freefrontend.com/javascript-cards, CodePen: HTML + SCSS + JS con GSAP) y la imagen del sello #JIA26.
**Nivel:** LEVEL 2 (tres encargos independientes; uno crea un componente nuevo con animación) · tmp/scratch: **aplica**
→ `docs/prompts-output/JIA-2026-09-19-30/tmp/progress.md` (una línea por fase) y `evidence/` (capturas).
**Estado:** EJECUTADO (2026-09-19) — informe en `docs/prompts-output/JIA-2026-09-19-30/report.md`; ver «Correcciones del promotor durante la ejecución» al final.

## Reglas de ejecución

- Este prompt ya está **commiteado y subido antes de ejecutarse** (commit del prompt). Al terminar: **commit + push**
  de la ejecución (y del informe, si el nivel lo pide: aquí basta el resultado dentro de cada fase + `report.md` corto).
- Tres fases, **un commit + push por fase**: fase 1 herradura, fase 2 tarjeta que gira, fase 3 sombra del sello.
  Antes de cada fase, commit de la anterior (rollback limpio).
- Textos en `lib/content/copy/`; medidas, tiempos y colores en `config.ts` de cada componente; colores solo por
  tokens de `app/theme/palette.css`. Verificación habitual: `tsc`, `check:content`, `next build`, Chrome real por
  CDP (1920 para el pie; 1440 y 390 para la ficha), capturas en `evidence/`.
- Contexto previo: la herradura vive en `components/site/horseshoe/` (JIA-27…29: cámara en perspectiva con «grúa»
  `setCamera()`, suelo elevado por clic, `poseBox()` para medir poses, rodadura a la derecha). El sello #JIA26 ya es el
  medio `sello-jia26` (`lib/content/media.ts`, JIA-29) y llega al modelo como `jornadas.seal`. Las fichas de taller son
  `components/primitives/SheetCard.tsx` (variante `poster`) con el diálogo `SheetDialog` (nativo `<dialog>`).

## Encargo 1 — Herradura: doble clic y caída simplificada hacia atrás

- **La posición inicial (colgada, de frente) es perfecta: no se toca.**
- El disparador pasa a ser el **doble clic** sobre la herradura (el botón que la sigue). Un clic simple **no hace
  nada** (supuesto del ejecutor: el promotor pide «cuando se haga doble clic»; si quisiera conservar algo en el clic
  simple, lo dirá). Con teclado, activar el botón (Enter/Espacio) dispara lo mismo (no existe «doble Enter»). El doble
  clic no debe seleccionar texto ni disparar los balazos del pie (`FooterShots` ya ignora botones).
- **Animación simplificada** (sustituye a la rodadura de JIA-29): **cae** desde el clavo (sin balanceo previo o con
  uno mínimo), **un ligero rebote** en el suelo (la línea del pie) y **se «cae hacia atrás»**: vuelca hacia la pared
  hasta quedar tumbada, **vista con algo de perspectiva** (la grúa de cámara ya existente sube el ojo durante la
  caída, así que la tumbada muestra su cara superior y el grosor). No rueda, no se desplaza a la derecha. Regla de
  signo aprendida en JIA-29: `landTipDeg` **positivo** vuelca hacia la pared (hacia atrás), negativo hacia el ojo.
- **Entera sobre la línea** (JIA-28) y a los **5 s** vuelve sola al clavo, como ahora. Movimiento reducido: nada.
- **Importante (promotor): el clavo que la fija a la pared no se mueve.** Se queda exactamente como está durante toda
  la secuencia (caída, rebote, vuelco, descanso y vuelta): es un objeto aparte del pivote (`this.nail`, colocado en
  `nailAt` en `place()`) y ninguna línea de tiempo lo toca; la herradura se desengancha de él y vuelve a él. Verificar
  en las capturas que el clavo y su sombra siguen en su sitio con la herradura en el suelo.
- Código: `config.fall` pierde `roll` (o queda `roll.enabled: false` si se prefiere conservar el camino; mejor
  quitarlo y simplificar `drop()`), gana `trigger: "dblclick"`, `bounce` único (`share`, `ms`) y `landTipDeg`
  positivo (≈ +70°) con `forwardPx` pequeño (la herradura cae al pie de la pared). `Horseshoe.tsx`: `onDoubleClick`
  en el botón (+ `onKeyDown` Enter/Espacio → `drop()`); `onMouseDown` sigue evitando el anillo de foco.
- Evidencias a 1920: colgada (igual que antes), tumbada hacia atrás con perspectiva, de vuelta tras 5 s. Anotar en
  el resultado el tiempo total de la secuencia.

## Encargo 2 — Ficha de taller: el cartel gira sobre su eje vertical al abrirse (componente aparte)

Al pulsar una tarjeta de Talleres se abre la ficha (`SheetDialog`) con el cartel a la izquierda
(`.sheetMedia` › `Surface` › `img` `/talleres/cartel-N-1000.webp`). Se pide que, **para todas las fichas de taller**,
el cartel de la ficha sea una **tarjeta 3D** que, al abrirse la ventana, **gira sobre un eje vertical** (la animación
de la referencia: la tarjeta parte de `rotateY(180deg)` y gira hasta `0`) y **termina exactamente donde está hoy el
cartel** dentro de la ficha (mismo hueco, mismo tamaño: 320 px a ≥ 900 px, 60 vw por debajo).

- **Componente aparte:** `components/flip-card/` → `FlipCard.tsx` (envoltorio React: `front`, `back`, `open`),
  `flip-card.ts` (motor DOM sin React: giro de entrada con GSAP y, después, inclinación suave que sigue al puntero,
  como en la referencia: `quickSetter` de `rotateX`/`rotateY` con interpolación 0,125 hacia el ratón, límite ±12°),
  `config.ts` (duración del giro ≈ 900 ms, `ease: "power3.out"`, perspectiva 3000 px como la referencia, límites y
  velocidad de la inclinación, color de fondo del reverso por token) y `FlipCard.module.css`.
- **Sin ghouls:** nada de risers, logos, números ni QR de la referencia. **El frontal es íntegramente la imagen** que se
  pulsó (el mismo `Surface`/`Picture` del cartel, proporción 1414/2000, esquinas `--jia-radius-card`).
- **Reverso:** la imagen del **sello #JIA26** (`jornadas.seal`, medio `sello-jia26`) **centrada**, ocupando **casi todo
  el ancho** de la tarjeta (≈ 88 %), sobre un **color de fondo adecuado** de la paleta: propuesta `--jia-ink` (la tinta
  del pie, que ya convive con el sello en el cubo) o `--jia-surface-copper`; decidir viendo el resultado y dejarlo en
  `config.ts`. `backface-visibility: hidden` en ambas caras; el reverso `rotateY(180deg)` y `translateZ(-1px)`.
- **Cuándo gira:** en cada apertura del diálogo (`open` → true), desde el reverso hasta el frontal; al cerrar, la
  tarjeta vuelve a su estado inicial sin animar (para que la siguiente apertura gire de nuevo). Con
  `prefers-reduced-motion`, sin giro ni inclinación: se muestra el frontal quieto.
- **Puntero:** la inclinación que sigue al ratón solo con `(hover: hover) and (pointer: fine)`; en táctil, nada. Los
  eventos van sobre el diálogo (o `document` mientras el diálogo esté abierto) y se retiran al cerrar. Nunca tapa el
  botón «Cerrar» ni el texto de la ficha (la tarjeta gira dentro de su hueco; `overflow` visible del hueco para no
  recortar el giro, `perspective` en el contenedor).
- **Integración:** `SheetCard` recibe `flipBack?: Media | null`; `Jornadas.tsx` pasa `jornadas.seal` solo a las
  fichas de taller (variante `poster`). Las fichas de Experiencias **no cambian**. Sin `flipBack`, la ficha se
  comporta como hoy.
- Evidencias: fotogramas del giro a 1440 (inicio con el reverso, medio giro, final en su sitio) y 390; medir que la
  posición y el tamaño finales coinciden con los actuales (caja del cartel antes/después, misma `left/top/width`).

## Encargo 3 — Sombra elegante del sello #JIA26 en «Las jornadas»

La imagen del sello que está a la derecha del texto de introducción de la sección «Las jornadas» (JIA-29:
`Jornadas.tsx` › `.statementRow` › `.seal` › `.sealImg`, medio `sello-jia26`, un PNG con fondo transparente) recibe
un **sombreado elegante**:

- Como el sello es redondo y el PNG es transparente, la sombra va con **`filter: drop-shadow(...)`** sobre la imagen
  (una `box-shadow` dibujaría un cuadrado). Dos capas: una **sombra de contacto** corta y otra **larga, cálida y
  difusa**, ambas con la tinta de la paleta a baja opacidad (`rgb(var(--jia-ink-rgb) / …)`), en la línea de las
  sombras de JIA-27 (tarjetas de talleres y de colaboradores): p. ej. `drop-shadow(0 2px 3px ink/0.25)
  drop-shadow(0 18px 28px ink/0.28)`. Nada de negro puro ni de HEX.
- Sutil: el sello sigue pareciendo pegado al papel del fondo, con un ligero levantamiento; sin brillo ni borde.
- Estático (sin hover): es decoración junto a un párrafo. Opcional y solo si queda bien: una transición de 320 ms si
  en el futuro se le da hover; por ahora, no.
- Sigue oculto por debajo de 760 px (no cambia). Tokens y valores en el CSS del módulo, no en el componente.
- Evidencia: captura a 1440 del bloque, antes y después.

## Fases y commits

| Fase | Contenido | Cierre |
|---|---|---|
| 0 | prompt + estructura | commit + push **(hecho al guardar este prompt)** |
| 1 | Encargo 1 (herradura) | commit + push |
| 2 | Encargo 2 (flip-card + integración) | commit + push |
| 3 | Encargo 3 (sombra del sello) | commit + push |
| 4 | `report.md` breve (resumen + riesgos) | commit + push |

## Riesgos previstos

- **Moderado:** el giro dentro de un `<dialog>` nativo con `perspective`: el diálogo puede tener `transform`/`overflow`
  que recorten la tarjeta a medio giro; verificar y, si hace falta, dar `overflow: visible` al `.sheetMedia`.
- **Menor:** el doble clic tarda ~300 ms en resolverse; el clic simple no debe dejar la herradura «a medias».
- **Menor:** el sello (1080×1080) al 88 % del ancho de una tarjeta de 320 px se sirve de la variante de 480 px, que
  a densidad 2 puede verse algo blanda; si molesta, añadir una variante de 640 px en `build-assets.sh` y `media.ts`.

## Correcciones del promotor durante la ejecución (2026-09-19, por chat, «hotfix on the fly»)

1. **Herradura (encargo 1), prevalece sobre el texto de arriba.** Con ejes x = ancho, y = alto, z = profundidad: en la
   caída **solo cambia la y** (x y z fijas); **rebota dos veces** (solo cambia la y) y queda apoyada en el suelo; **después**
   «cae hacia atrás»: los extremos de la U se alejan de la cámara. Ese vuelco es **más lento al principio y acelera un
   poquito**, y **no rebota**. Movimiento orgánico. Consecuencias: `bounces` vuelve a ser una lista de dos; se descarta
   `forwardPx`; y el signo: en este montaje **`landTipDeg` negativo** es el que manda los extremos de la U hacia atrás y
   enseña la cara superior al ojo elevado (con +70° la herradura se veía de canto: comprobado en Chrome).
2. **Colaboradores:** quitar la línea horizontal que hay encima de las tarjetas (hotfix aparte, tras la fase 1).
3. **Sello de «Las jornadas» (encargo 3):** un 10 % más grande, creciendo **hacia abajo** (anclado arriba, no centrado).
4. **Hero:** el rótulo «Jornadas de Innovación de Almería» junto a «JIA» se sustituye por el sello #JIA26, con la
   altura de las letras «JIA», adaptativo.
5. **Tarjeta de la ficha (encargo 2):** tras el giro actual (de más a menos velocidad), un **segundo giro de 1,2 s**
   con **parada de 0,1 s** cuando se ve el reverso.
6. **Colaboradores:** quitar la pista «Arrastra a izquierda o derecha».
7. **Herradura, lo último:** la animación se corta cuando, tras caer y rebotar, se apoya en el suelo (sin vuelco).
