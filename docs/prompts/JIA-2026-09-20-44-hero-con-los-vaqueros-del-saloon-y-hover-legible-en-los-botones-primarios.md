# JIA-2026-09-20-44 — Hero: la fotografía de los vaqueros del saloon, y el hover legible en los botones primarios

**Fecha:** 2026-09-20 · **Origen:** un mensaje del promotor en chat, con la imagen adjunta (1916 × 821: tres figuras
en el porche de un saloon, la mujer de pie en el centro entre las puertas batientes y un hombre recostado a cada
lado; el tercio izquierdo se disuelve en un crema plano).
**Nivel:** LEVEL 2 (imagen nueva en el hero + corrección de un defecto de contraste en un primitivo compartido) ·
tmp/scratch: **no aplica** (tarea corta, dos encargos independientes) → se registra `N/A` en el informe.
**Estado:** PENDIENTE DE EJECUTAR.

## Texto del promotor

> «vas a copiar esta imagen en la carpeta del proyecto donde corresponda pero va a pasar a ser la imagen del hero.
> solo sustituyes la imagen, y que el height de la imagen sea del tamaño máximo del height que tiene ahora mismo.
> Y un detalle más, cuando se hace hover a explorar las jornadas, el color del texto se vuelve de otro color oscuro
> y apenas se ve. ¿podríamos solucionar el hover? con el estilo de la paleta que más funcione?»

## Estado de partida (medido)

**La imagen.** Ya está en el árbol sin seguir, como `assets/images-website/hero-salloon-vaqueros.png`
(1916 × 821). Es exactamente la que adjuntó el promotor: comprobado píxel a píxel contra el adjunto, **RMSE 0**
(los hashes difieren sólo por la recodificación PNG del adjunto).

**El hero hoy.** `heroConfig.mediaId` es `hero-1`, un **recorte** de `hero-almeria-docentes.png`
(`crop 1021x941+300+0`, ratio 1021/941 ≈ 1,09) que existe para dejar fuera unas palabras horneadas en el original.
La altura de la banda **no la manda la imagen**:

- Escritorio (≥ 960 px): `.hero` y `.content` tienen `min-height: min(75vh, 770px)`; `.photo` es absoluta a la
  derecha, `width: 66%`, `height: 100%`, y `.surface` la llena con `object-fit: cover` y una máscara SVG que
  deshilacha su borde izquierdo contra el papel.
- Móvil (≤ 959 px): `.surface` fuerza `aspect-ratio: 4 / 3` y la foto va debajo del texto, fundida hacia arriba.

`Hero.tsx` pasa además un `ratio={1672 / 941}` escrito a mano que el CSS anula en ambos casos
(`aspect-ratio: auto !important` en escritorio, `4 / 3 !important` en móvil).

**El hover.** Medido en el navegador sobre el export estático, en «Explorar las jornadas»:

| | texto | fondo | contraste |
|---|---|---|---|
| reposo | `rgb(246 238 223)` (`--jia-ivory`) | `rgb(137 72 46)` (`--jia-terracotta`) | 6,9:1 |
| hover | `rgb(112 57 35)` | `rgb(112 57 35)` | **1:1** |

La etiqueta no es que «apenas se vea»: **desaparece**, porque texto y fondo acaban siendo el mismo
`--jia-terracotta-deep`.

Causa raíz: `app/globals.css:92` declara `a:hover { color: var(--jia-terracotta-deep); }`. Ese selector tiene
especificidad (0,1,1), mayor que el (0,1,0) de `.primary { color: var(--jia-ivory) }` de
`components/primitives/Action.module.css`. Como `.primary:hover` sólo cambia fondo y borde, al pasar el puntero
gana la regla global y el texto se tiñe del mismo color que su fondo. El mismo defecto se parcheó **sólo para el
caso deshabilitado** en `JIA-2026-09-18-13` (`.primary.disabled:hover { color: var(--jia-ivory) }`), sin corregir
la causa.

`.secondary` arrastra la misma fuga en silencio: su texto es `--jia-ink` en reposo y pasa a `--jia-terracotta-deep`
en hover sin que nadie lo haya pedido (queda legible sobre `--jia-sand-deep`, así que no se ve como fallo).

## Encargo 1 — La fotografía del hero

- La imagen entra por la **vía de contenido** del proyecto, como siempre: derivados WebP con
  `scripts/build-assets.sh` → `public/hero/`, entrada nueva en `lib/content/media.ts` y `mediaId` en
  `lib/content/sections/hero.ts`. Nada de rutas ni medidas en el componente; de paso, `Hero.tsx` deja de llevar su
  `ratio` escrito a mano y lo toma del medio, como ya hacen `Host` y `Experiences`.
- **Sólo se sustituye la imagen.** La banda conserva su altura actual: `min(75vh, 770px)` en escritorio y `4 / 3`
  en móvil. «Que el height de la imagen sea del tamaño máximo del height que tiene ahora mismo» se ejecuta como:
  la foto **llena esa altura máxima a sangre**, sin recortarse en vertical ni dejar aire. Con `object-fit: cover`
  y una imagen más apaisada que su hueco, eso significa que el alto se usa entero y lo que sobra se va por los
  lados; el punto focal decide **qué lado** se va.
- El original anterior y su recorte se quedan donde están, sin uso: los originales no se sobrescriben ni se borran.
- A comprobar tras ejecutar, porque es el riesgo real de esta imagen: el hueco de la foto en escritorio es bastante
  más vertical (≈ 1,23 a 1440 px) que la imagen (2,33), así que se verá **algo más de la mitad de su ancho**. Hay
  que elegir el punto focal para que las tres figuras y las puertas batientes queden dentro y el borde deshilachado
  caiga sobre el crema plano de la izquierda, no sobre una figura. Si no cabe con dignidad, la salida es un recorte
  propio en `build-assets.sh`, como ya hace `hero-1`, **no** estirar la imagen ni bajar la banda.

## Encargo 2 — El hover de los botones

- `.primary:hover` y `.primary:focus-visible` fijan **explícitamente** `color: var(--jia-ivory)`. Es la pareja que
  el resto del sitio ya usa sobre terracota y la que el parche del caso deshabilitado eligió en su día: marfil sobre
  `--jia-terracotta-deep` da **7,9:1**, holgadamente por encima del 4,5:1 exigido, y no introduce ningún color nuevo.
- `.secondary:hover` y `.secondary:focus-visible` fijan también su color (`--jia-ink`), para cerrar la misma fuga
  antes de que se convierta en otro fallo. El primitivo pasa a ser dueño de sus propios colores en hover en vez de
  heredarlos de la regla global de enlaces.
- No se toca `app/globals.css`: la regla `a:hover` es correcta para los enlaces de texto del sitio; lo que estaba
  mal era que un botón dependiera de ella.
- El parche de `JIA-2026-09-18-13` sobre `.primary.disabled:hover` queda redundante una vez corregida la causa;
  se retira y se anota en el informe.

## Verificación exigida

- `npx tsc --noEmit`, `npm run check:content` y `npx next build` en verde.
- Hero revisado a 1920, 1440, 960 y 390 px, comprobando que la banda conserva su altura (medida antes y después) y
  que la foto la llena sin aire.
- Hover medido en el navegador, no a ojo: color de texto y de fondo en reposo y en hover, con su contraste, para el
  botón primario y el secundario.

## Cierre

Práctica 14: commits de implementación con su verificación en verde, después informe en
`docs/prompts-output/JIA-2026-09-20-44/` con resumen y análisis de riesgo, y commit documental aparte. Push por
`sds-dev-governance/scripts/git-safe-push.sh origin main`.
