# JIA-2026-09-20-44 — Informe

**Prompt:** `docs/prompts/JIA-2026-09-20-44-hero-con-los-vaqueros-del-saloon-y-hover-legible-en-los-botones-primarios.md`
**Fecha:** 2026-09-20 · **Rama:** `main` · **tmp/scratch:** N/A (tarea corta; la evidencia va en `evidence/`)

| Fase | Commit | Contenido |
|---|---|---|
| 0 | `cedf634` | Prompt (antes de ejecutar). |
| 1 | `7b955ce` | El hero pasa a los tres vaqueros del saloon, con el encuadre corrido. |
| 1 | `6a2ebe3` | La nota «Almería siempre inspira» sale del hero, y con ella su maquinaria. |
| 1 | `6fc38c3` | El texto del botón primario deja de desaparecer al pasar el puntero. |
| — | (este) | Informe. |

## Encargo 1 — La fotografía del hero

`assets/images-website/hero-salloon-vaqueros.png` (1916 × 821), que ya estaba en el árbol sin seguir y es
exactamente la que adjuntó el promotor (**RMSE 0** contra el adjunto). Entra por la vía de contenido de siempre:
derivados en `public/hero/hero-saloon-{960,1916}.webp`, medio `hero-saloon` en `media.ts`, `mediaId` en
`sections/hero.ts`. `Hero.tsx` deja de llevar su `ratio` escrito a mano; lo toma del medio, como ya hacen `Host` y
`Experiences`. Con esto ya no queda ningún componente del sitio con medidas de imagen dentro.

**La altura no se ha movido.** Medida antes y después, idéntica en los cuatro anchos:

| Ventana | Banda del hero | Hueco de la foto |
|---|---|---|
| 1920 px | 1920 × **686** | 1267 × 686 |
| 1440 px | 1440 × **675** | 950 × 675 |
| 960 px | 960 × **675** | 634 × 675 |
| 390 px | 390 × **807** | 390 × 293 |

**El encuadre.** Midiendo el original por columnas oscuras, los tres están en el **39–49 %**, el **53–78 %** y el
**81–96 %** de su ancho, y el tercio izquierdo es crema plano. El hueco de la foto es mucho más vertical que el
encuadre (1,41 frente a 2,33 a 1440 px), así que sólo cabe algo más de la mitad del ancho. Con el foco centrado el
tercer vaquero quedaba fuera a 1440 px y **partido por la mitad** a 1920 px, que es peor
(`evidence/hero-foco-centrado-descartado-1440.webp`). El foco pasa al **92 %** y la ventana termina pasado el
tercero a todos los anchos.

Lo que cuesta es el crema de la izquierda: de portátil para abajo el borde deshilachado cae sobre el primer
vaquero. Es el cambio que pidió el promotor a mitad de ejecución — no se le ve la cara y el tercero tiene que
salir.

Se retira además el `object-position: 55% 45% !important` que el móvil forzaba. Su mitad vertical **nunca hizo
nada** (con la caja 4/3 mucho más vertical que el encuadre, `cover` sólo recorta por los lados, así que la `y` no
interviene) y la horizontal peleaba contra el foco y volvía a dejar fuera al tercero. Ahora manda el punto focal
del medio a todos los anchos, y en móvil entran los tres.

## Encargo 2 — La nota «Almería siempre inspira»

El promotor la quita del todo, así que no se deja en blanco: salen la clave `note` y su `noteStatus` de la copia,
el campo del contrato en `copy/types.ts`, el `note` del modelo y de su tipo en `assemble.ts`, la rama que la
pintaba en `Hero.tsx` y la regla `.note` de `Hero.module.css` con sus dos ajustes por punto de ruptura. No queda
maquinaria muerta detrás de un string vacío. Comprobado: la cadena no aparece en `out/index.html`.

## Encargo 3 — El hover del botón primario

No era que «apenas se viera»: **desaparecía**. Medido sobre el export estático:

| | texto | fondo | contraste |
|---|---|---|---|
| antes, reposo | `rgb(246 238 223)` | `rgb(137 72 46)` | 6,9:1 |
| antes, hover | `rgb(112 57 35)` | `rgb(112 57 35)` | **1:1** |
| ahora, hover | `rgb(246 238 223)` | `rgb(112 57 35)` | **7,9:1** |

**La causa está en la especificidad, no en el color.** `app/globals.css:92` declara
`a:hover { color: var(--jia-terracotta-deep) }`, con especificidad (0,1,1), por encima del (0,1,0) de
`.primary { color: var(--jia-ivory) }`. Como `.primary:hover` sólo cambiaba fondo y borde, al pasar el puntero
ganaba la regla global y la etiqueta se teñía justo del color al que su propio fondo acababa de virar.

`.primary:hover`/`:focus-visible` fijan ahora su color, que con (0,2,0) manda. Marfil sobre terracota profunda es
la pareja que el resto del sitio ya usa: no entra ningún color nuevo. `.secondary` arrastraba la misma fuga en
silencio (su texto pasaba de tinta a terracota profunda sin que nadie lo pidiera, legible pero no buscado), así
que fija también el suyo. `app/globals.css` no se toca: `a:hover` es correcta para los enlaces de texto; lo que
estaba mal era que un botón dependiera de ella. Se retira el parche de `JIA-2026-09-18-13` sobre
`.primary.disabled:hover`, que trataba el síntoma sólo en el caso deshabilitado y ahora sobra.

## Verificación

| Check | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — 6 talleres, 38 personas, 2 experiencias, 59 medios |
| `npx next build` | verde — export estático, 4 rutas |
| `npm run assets` | verde (ver el incidente de abajo) |

Evidencia en `evidence/`: `hero-{1920,1440,960,390}.webp`, `hero-foco-centrado-descartado-1440.webp` y el botón
primario en reposo y con el puntero encima.

## Incidente encontrado durante la ejecución

**`npm run assets` estaba roto.** Entre el commit del prompt y el cierre, dos originales **seguidos por git**
desaparecieron del disco sin que esta tarea los tocara:

- `assets/images-website/hero-3.png` → renombrado a `hero-3-gen.png` (mismo hash, contenido intacto; no lo usa
  ningún código).
- `assets/images-website/hero-almeria-docentes.png` → **borrado, sin reemplazo**. Es el original del que salen
  `hero-1` y `hero-1-full`, y `scripts/build-assets.sh:15` sigue derivando de él. `npm run assets` fallaba con
  `magick: unable to open image ... No such file or directory` y código de salida 1.

Los dos se han **restaurado desde git**, que recupera el contenido sin pérdida, y el script vuelve a pasar en
verde. Las eliminaciones **no se han commiteado**: consolidarlas habría dejado la pérdida fijada en el árbol y el
build de assets roto para todos. Si el promotor quiere el renombrado de `hero-3.png`, se hace con `git mv` y su
commit; si quiere retirar de verdad el hero anterior, hay que quitar antes sus entradas de `build-assets.sh` y
`media.ts`.

## Análisis de riesgo

**Críticos: ninguno.** **Severos: ninguno** (el que había —el build de assets roto— queda cerrado arriba).

**Moderados (3):**

1. **El encuadre del hero depende de dónde estén las figuras**, y nada lo comprueba. El foco al 92 % está elegido
   contra las posiciones medidas de este archivo concreto (39–49 %, 53–78 %, 81–96 %). Otra fotografía en el mismo
   medio descuadra sin aviso.
   *Destino:* las posiciones y el porqué quedan escritos en el comentario del medio en `media.ts`, que es donde lo
   leerá quien sustituya la imagen.

2. **A 960 px el primer vaquero se queda fuera.** El hueco de la foto sólo admite un 40 % del ancho del encuadre a
   esa anchura, así que entran la mujer y el tercero. Es el precio de garantizar al tercero.
   *Destino:* aceptado. Si molesta, la salida es un recorte propio para esa franja, no mover el foco.

3. **Los borrados de originales no tienen red.** Un original puede desaparecer del árbol y sólo se descubre cuando
   `npm run assets` falla —o peor, cuando no falla porque el derivado ya estaba generado—. Es la misma familia que
   el moderado ya anotado en `JIA-2026-09-20-42`: nada verifica que los derivados de `public/` correspondan a sus
   originales.
   *Destino:* candidato a fase futura, un check que valide que todo `original` declarado en `media.ts` existe en
   disco. Sería barato y habría cazado esto al instante.

## Pendiente de decisión del promotor

Siguen **sin seguir** en git estas aportaciones suyas, que nadie ha pedido tocar:
`assets/images-minihollywood/`, `aula-maestra-clase-original.png`, `hero-3-gen.png`, `indio-gen.png`,
`jornadas-jinete-niña.png` y `minihollywood-tres-individuos.jpg`. Dime cuáles quieres dentro.
