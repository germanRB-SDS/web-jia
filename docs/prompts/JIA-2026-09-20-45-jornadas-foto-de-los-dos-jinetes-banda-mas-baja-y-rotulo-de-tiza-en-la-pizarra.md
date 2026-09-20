# JIA-2026-09-20-45 — Las jornadas: la foto de los dos jinetes, la banda más baja, y el rótulo de tiza en la pizarra del aula

**Fecha:** 2026-09-20 · **Origen:** un mensaje del promotor en chat, con la imagen adjunta (1983 × 793: un hombre y
una niña a caballo sobre una loma, al atardecer, con el valle, el río y el camino abriéndose a la derecha).
**Nivel:** LEVEL 2 (sustitución de imagen + ajuste de ritmo vertical + elemento nuevo sobre una fotografía, todo en
la capa de presentación; sin datos, sin API, sin seguridad).
**tmp/scratch:** **sí aplica** — tres encargos independientes con verificación en navegador entre medias;
checkpoint en `docs/prompts-output/JIA-2026-09-20-45/tmp/checkpoint.md`.
**Estado:** EJECUTADO (2026-09-20) — informe en `docs/prompts-output/JIA-2026-09-20-45/report.md`. Un encargo
añadidos por el promotor a mitad de ejecución: **el texto nuevo de «Tu propuesta JIA»** (encargo 4) y
**«Quiénes somos» en el menú** (encargo 5).

## Texto del promotor

> «La foto del caballo en "LAS JORNADAS" la vamos a sustituir por [imagen adjunta], esa imagen la guardas dentro del
> proyecto donde corresponda. Y tenemos que cuidar la vertical de esta sección porque tiene que ser menor de lo que
> es actualmente. Si hay que prescindir de algo, podemos reducir el espacio desde la animación 3d hasta el borde
> inferior de esta sección y también reducir el espacio que hay entre la animación 3d del carruaje y el texto que
> tiene encima. Y en la sección de ideas que han pasado por el aula, genera con estilo "tiza" en la pizarra
> "Jornadas de Innovación de Almería", el estilo de la tiza utilizado tiene que encajar como si fuera parte de la
> foto, en tono/estilo/lavado de color para que encaje como un color de tiza, en dicha pizarra (y quizá un pelín de
> blur pero que se lea? para que encaje con el ligero blur que tiene la pizarra?).»

## Estado de partida (medido)

### La imagen

Ya está en el árbol sin seguir, como `assets/images-website/jornadas-jinete-niña.png` (1983 × 793, ratio 2,500).
Es exactamente la que adjuntó el promotor: comprobado contra el adjunto, **RMSE 0**. El nombre lleva `ñ`; se
conserva tal cual (los originales no se renombran, y `build-assets.sh` ya entrecomilla rutas con espacios y `#`).

Medido sobre el original, el grupo —cola del caballo a hocico— ocupa **de 13,5 % a 33 %** del ancho. El resto es
valle, río y camino. La foto en uso hoy, `jornadas-jinete.png` (1916 × 821, ratio 2,334), queda **sin uso**, y su
entrada `jornadas-jinete` de `lib/content/media.ts` se conserva sin borrar, como ya se hizo con `hero-1`/`hero-2`.

### La vertical de la banda (medida a 1440 × 900, servidor de desarrollo)

`.band` mide **1015,4 px**. Se descompone así, dentro de `#jornadas-mapa`:

| Tramo | Regla | A 1440 px |
|---|---|---|
| Aire superior | `.jornadasMapa` `padding-top: clamp(2rem, 5vw, 3.5rem)` | 56 px |
| Texto (título + declaración con el sello) | contenido | 428,3 px |
| **Hueco entre el texto y el camino 3D** | `.jornadasMapa` `gap: clamp(1.75rem, 4vw, 3rem)` | **48 px** |
| Camino 3D (lienzo) | `aspect-ratio` del layout `wide` (100/77) | 367,1 px |
| **Fila de controles bajo el camino** | `.route` `margin-bottom: 2.25rem` + `.controls` `min-height: 2.25rem` | **36 px** |
| **Aire inferior** | `.jornadasMapa` `padding-bottom: clamp(3rem, 7vw, 5rem)` | **80 px** |

Del lienzo del camino al borde inferior de la banda hay, por tanto, **116 px**. En escritorio (≥ 900 px) la banda
es una rejilla 58/42 con `min-height: min(78vh, 780px)`: esa altura mínima **no manda**, manda el contenido de la
columna derecha. Bajar los tres tramos marcados en negrita baja la banda entera.

La altura **no depende del ratio de la foto**: `.bandPhoto` sólo fija `aspect-ratio: 16 / 10` por debajo de 900 px,
y en escritorio se estira a la altura de la fila. Cambiar de 2,334 a 2,500 no mueve la vertical; sólo cambia
cuánto ancho de la imagen cabe en el hueco.

`Jornadas.tsx` pasa además un `ratio={1916 / 821}` escrito a mano que el CSS anula en los dos casos: la misma
mentira que `JIA-2026-09-20-44` quitó de `Hero.tsx`.

### La pizarra del aula

`experiencias-aula` es `assets/images-website/aula-maestra3.png` (1919 × 820). La pizarra está **al fondo a la
izquierda**, desenfocada. Medido sobre el original:

- marco de madera: de y ≈ 98 a y ≈ 440; su banda vertical derecha, en x ≈ 235–250;
- pizarra (la parte oscura, `#3C3024`–`#403528`): x ≈ 42 → 235, y ≈ 135 → 420;
- la maestra la tapa: su pelo entra por x ≈ 250 arriba y el hombro cruza x ≈ 195 a y ≈ 260 y x ≈ 160 a y ≈ 300.

**El hueco realmente libre y legible es x 45 → 230, y 140 → 270**: 185 × 130 px del original, o sea
**2,4 % → 12 % del ancho y 17 % → 33 % del alto**. Es un hueco pequeño: el rótulo tiene que ir en tres líneas.

Geometría en pantalla, que es lo que permite colocar algo encima con precisión:

- **≥ 1280 px**: `.section` mide `100vw / (1919/820)` de alto y `.photo` es absoluta a `inset: 0`. La caja tiene
  exactamente el ratio de la imagen, así que la foto se dibuja **1:1 con la caja**: un % de la imagen es un % de
  la caja.
- **< 1280 px**: `.photo` es `aspect-ratio: 16 / 10` (más vertical que la imagen) y `.surface img` va con
  `object-fit: cover` y `object-position: 0% 50%` (`focal: {x: 0, y: 50}`). Cubrir se resuelve **por altura**: la
  imagen se dibuja con la altura de la caja, ancho = altura × 2,340, **pegada al borde izquierdo**.

En los dos casos la imagen dibujada es «altura de la caja × su propio ratio, pegada a la izquierda». Eso da una
caja de referencia común y exacta, sin `@media` que adivinar.

La fuente manuscrita del proyecto, **Homemade Apple** (`--f-script`, OFL, `preload: false`), quedó **sin ningún
uso** al retirar `JIA-2026-09-20-44` la nota «Almería siempre inspira». Su rol declarado en `media.ts` y el
comentario de `app/layout.tsx` siguen hablando de aquella nota del hero.

## Encargo 1 — La fotografía de las jornadas

- Entra por la vía de contenido de siempre: derivados WebP en `scripts/build-assets.sh` → `public/jornadas/`,
  entrada nueva en `lib/content/media.ts` y `bandMediaId` en `lib/content/sections/jornadas.ts`. Ninguna ruta ni
  medida en el componente.
- Id nuevo: `jornadas-jinete-nina`, dos anchos (960 y 1983) como el resto de fotografías de banda. La entrada
  `jornadas-jinete` se queda donde está, sin uso; el original antiguo tampoco se toca.
- **Punto focal.** Es el único ajuste fino: el hueco de la foto es mucho más vertical que la imagen, así que sólo
  se ve una franja de su ancho (≈ 33 % a 1440 px, menos según estrecha la ventana). El punto focal tiene que dejar
  **dentro el grupo entero, de la cola al hocico (13,5 % → 33 %)** a 1920, 1440, 1024 y 900 px, que es donde la
  franja es más estrecha. Se parte de `x: 24, y: 50` y se corrige con lo medido en el navegador.
- `Jornadas.tsx` deja de llevar el `ratio` escrito a mano y lo toma del medio, como ya hacen `Hero`, `Host` y
  `Experiences`.
- El velo (`.veil`) y su degradado no se tocan: la imagen nueva tiene el mismo papel que la anterior.

## Encargo 2 — La vertical de la banda

Se recorta sólo donde el promotor ha autorizado: **entre el texto y el camino**, y **del camino al borde
inferior**. El aire superior, el texto, el sello y el lienzo del camino se quedan como están.

| Regla | Hoy | Pasa a | A 1440 px |
|---|---|---|---|
| `.jornadasMapa` `gap` | `clamp(1.75rem, 4vw, 3rem)` | `clamp(0.875rem, 1.6vw, 1.5rem)` | 48 → 23 px |
| `.jornadasMapa` `padding-bottom` | `clamp(3rem, 7vw, 5rem)` | `clamp(1.5rem, 3vw, 2.5rem)` | 80 → 43 px |
| `.route` `margin-bottom` + `.controls` `min-height` | `2.25rem` | `1.75rem` | 36 → 28 px |

Baja la banda **≈ 70 px a 1440 px** (≈ 7 %), y proporcionalmente más en ventanas anchas, donde los `clamp` iban
por el tramo `vw`. La fila de controles sigue reservada con altura fija: el botón de repetir no puede desplazar
nada al aparecer, que es para lo que existe ese margen.

**Límite que no se cruza:** el botón de repetir mide 1,9 rem con su `padding` y su foco necesita
`outline-offset: 3px`. 1,75 rem de fila lo deja justo; por debajo, el anillo de foco se sale. Si al medir en el
navegador la fila se queda corta, se vuelve a 2,25 rem y se anota en el informe: la accesibilidad no se recorta
para ganar 8 px.

## Encargo 3 — El rótulo de tiza en la pizarra

Es **texto del sitio dibujado sobre la fotografía**, no una imagen retocada: el original no se altera (regla de la
casa) y el rótulo sale de la capa de constantes, no del componente.

- **Texto.** `lib/content/copy/es/sections/experiencias.ts`, campo nuevo `board: string[]` (con su tipo en
  `copy/types.ts`), en tres líneas: `["Jornadas de", "Innovación", "de Almería"]`. El corte de línea es una
  decisión editorial y por eso vive con el texto, no en el CSS.
- **Colocación.** Dentro de `.photo` (que ya es `aria-hidden`), una caja de referencia que reproduce exactamente
  el rectángulo dibujado de la imagen — `position: absolute; left: 0; top: 0; height: 100%; aspect-ratio:
  var(--aula-ratio)` — y, dentro de ella, el rótulo en porcentajes **de la imagen**: `left: 2.4%`, `width: 9.6%`,
  `top: 17%`, `height: 16%`. Una sola regla sirve para todas las anchuras porque la caja de referencia sigue a la
  imagen. El tamaño de letra se expresa en `cqw` sobre esa caja (`container-type: size`), de modo que el rótulo
  escala con la foto y nunca se sale de la pizarra.
- **Aspecto.** `--f-script` (Homemade Apple), una inclinación mínima (≈ −1°) para que no parezca compuesto,
  `filter: blur(...)` en la misma unidad relativa (≈ 0,1 % del ancho de la foto, ≈ 2 px a 1920) para que comparta
  el desenfoque del fondo, y un color de **tiza** nuevo en `app/theme/palette.css` (`--jia-chalk`), muestreado
  para caer entre el `#3C3024` de la pizarra y el crema de la pared: la paleta sigue siendo la única dueña del
  color. Se remata con opacidad para que sea polvo de tiza y no pintura.
- **Accesibilidad.** Va dentro del fondo decorativo, con `aria-hidden`: el nombre de las jornadas ya está en el
  `<title>`, en el `h1` y en el distintivo. No se añade ruido al lector de pantalla ni un segundo `h`.
- **Criterio de aceptación, a ojo y medido:** se lee a 1920, 1440 y 1280 px; no se sale de la zona oscura de la
  pizarra en ninguna anchura ≥ 900 px; no pisa el hombro ni la cara de la maestra; y no parece un rótulo pegado —
  si a 1280 px no cabe con dignidad dentro de la pizarra, se reduce el cuerpo antes que invadir el marco.
- Al quedar `--f-script` otra vez en uso, se corrigen su rol en `lib/content/media.ts` y el comentario de
  `app/layout.tsx`, que siguen describiendo la nota del hero que ya no existe.

## Encargo 4 — El texto de «Tu propuesta JIA» (añadido a mitad de ejecución)

> «El texto actual "Tus ideas son un auténtico tesoro para las cámaras de la JIA. […] Aquí encontrarás la
> información para presentar tu propuesta cuando se concrete el proceso de participación." cámbialo por "Tu
> participación nos ayudaría (¡mucho!) para preparar las próximas JIA. Envíanos tu idea respecto a qué temática te
> gustaría que se utilizara como hilo conductor para la próxima edición. Toda la información la encontrarás al
> pulsar aquí abajo."»

Sustitución literal de los dos párrafos de `lib/content/copy/es/sections/propuestas.ts`. Siguen siendo dos, así
que la flecha dibujada que `Proposals.tsx` engancha al final del último párrafo sigue apuntando al botón: ahora,
además, el texto lo dice en voz alta («al pulsar aquí abajo»). No se toca ni el título, ni el subtítulo, ni la
acción, ni el componente.

## Encargo 5 — «Quiénes somos» en el menú (añadido a mitad de ejecución)

> «Añade en el menú como botón "QUIENES SOMOS"; al ser pulsado lleva a la sección "Quién hace posible las JIA",
> que se renombra a "QUIENES SOMOS" ;)»

- La sección de socios (`#socios`) se renombra en `lib/content/copy/es/sections/partners.ts`.
- El menú se arma desde `lib/content/sections/nav.ts` y el rótulo sale del diccionario: basta una `key` nueva
  (`socios`) con su ancla, que declara la propia sección. Va **la última**, porque es la última sección de la
  página (jornadas → experiencias → propuestas → acoge → socios).
- La columna de secciones del pie se deriva de esos mismos items (`assemble.ts`), así que lo recoge sola. Es lo
  correcto: el pie y el menú no deben divergir.
- El nombre se guarda **acentuado y en caja natural** («Quiénes somos»), como todos los rótulos del sitio; el
  menú y el título de sección lo suben a versales por CSS, y el acento se conserva en mayúsculas, como manda la
  ortografía española.

## Verificación exigida

- `npx tsc --noEmit`, `npm run check:content` y `npx next build` en verde.
- `npm run assets` ejecutado; los derivados nuevos de `public/jornadas/` entran en el commit.
- Banda de jornadas medida en el navegador **antes y después** a 1920, 1440 y 900 px: altura de `.band` y los tres
  tramos recortados. La reducción tiene que ser real y estar en el informe, no estimada.
- Encuadre de la foto nueva revisado a 1920, 1440, 1024, 900 y 390 px: el grupo entero dentro.
- Rótulo de tiza revisado a 1920, 1440, 1280, 900 y 390 px, con captura recortada de la pizarra.
- Revisión de que nada más de la página se ha movido: el camino 3D sigue animando y los rótulos de sus paradas
  siguen donde estaban (el `margin-bottom` que se toca es el que reserva su fila de controles).
- «Tu propuesta JIA» revisada en el navegador: dos párrafos, la flecha al final del segundo y el botón debajo.
- Menú revisado a 1440, 1100, 1024 y 960 px (la barra horizontal) y en el panel del teléfono a 390 px, más el
  pie: el rótulo nuevo cabe, apunta a `#socios` y no empuja a los demás.

## Cierre

Práctica 14: commits de implementación con su verificación en verde, después informe en
`docs/prompts-output/JIA-2026-09-20-45/` con resumen y análisis de riesgo (moderado/severo/crítico), y commit
documental aparte. Push por `sds-dev-governance/scripts/git-safe-push.sh origin main`.
