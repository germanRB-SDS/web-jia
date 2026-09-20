# JIA-2026-09-20-46 — «Tu propuesta JIA»: la hoguera de los nuevos temas, con el borde izquierdo disuelto

**Fecha:** 2026-09-20 · **Origen:** un mensaje del promotor en chat, con la imagen adjunta (1672 × 941: cuatro
personas sentadas alrededor de una hoguera al atardecer — una maestra a la izquierda, un jefe indio con tocado de
plumas, una mujer con micrófono entrevistándole y un sheriff), reclamando un encargo que **no se ejecutó** en
`JIA-2026-09-20-45`.
**Nivel:** LEVEL 2 (sustitución de la fotografía de una sección + cambio del velo que la funde con el papel) ·
tmp/scratch: **no aplica** (tarea corta, un solo encargo en una sola capa) → se registra `N/A` en el informe.
**Estado:** EJECUTADO (2026-09-20) — informe en `docs/prompts-output/JIA-2026-09-20-46/report.md`.

## Texto del promotor

> «vale pero en el ultim prompt te pedi incluir la nueva imagen que viene en la seccion TU PROPUESTA JIA, la cula
> es: [imagen adjunta] y (utiliza el efecto gradient con color #e3d0b4 la persona de la izquierda de todo sí debe
> estar practicamente no visible con el gradient ;) pero el indio puede estar solo parcialmente, su cara, etc y de
> ahi para la dercha tiene que ser todo perfectamente visible.»

## Qué se quedó fuera de `JIA-2026-09-20-45`

Aquel prompt recogió como «encargo 4» **sólo el texto** de «Tu propuesta JIA» (dos párrafos nuevos en
`lib/content/copy/es/sections/propuestas.ts`). La imagen que acompañaba a ese mismo mensaje no llegó a entrar en el
encargo, así que la columna visual de la sección sigue mostrando la cámara acorazada. Este prompt cierra esa parte.

## Estado de partida (medido)

**La imagen.** Ya está en el árbol sin seguir, como `assets/images-website/hoguera-nuevos-temas.png` (1672 × 941,
ratio 1,777). Es exactamente la que adjuntó el promotor.

**Dónde va.** `lib/content/sections/propuestas.ts` → `mediaId: "propuestas-camara"`, que
`components/site/Proposals.tsx` pinta en la columna derecha de un `Section` con `layout="split"` y `tone="sand"`.
La cámara acorazada (`propuestas-camara`, 1059 × 821, recortada un 8 % por abajo al construir) queda **sin uso**, y
su entrada y su derivado se conservan: los originales no se sobrescriben ni se borran.

**El hueco.** El `split` da a la columna visual el **53 % del ancho de la ventana** y toda la altura de la sección,
que la manda la columna de texto. Medido en el navegador sobre el servidor de desarrollo:

| Ventana | Caja de la foto | Ratio de la caja |
|---|---|---|
| 1920 | 1018 × 469 | 2,171 |
| 1440 | 763 × 469 | 1,628 |
| 1024 | 543 × 483 | 1,124 |
| 390 | 390 × 278 | 1,403 (= el `ratio` escrito a mano en `Proposals.tsx`) |

Con `object-fit: cover`, por encima de 900 px la caja no comparte ratio con la imagen (1,777), así que **parte del
ancho se va por los lados** y el punto focal decide cuánto y de qué lado. Por debajo de 900 px la columna se apila
bajo el texto y la caja toma el ratio que `Proposals.tsx` le pasa a mano.

**El velo de hoy.** `Proposals.module.css` pinta un `<span>` hermano de la foto,
`linear-gradient(90deg, sand-deep al 40 % → transparente al 30 %)`. Es un velo **muy suave** y, además, un color
plano: el fondo de la sección no es plano, es `--jia-bg-deep`, un degradado vertical que va de
`mix(sand-deep 72 %, vellum-5)` arriba a `sand-deep` abajo. Un velo opaco de un solo color no podría casar con ese
fondo a todas las alturas.

**El color pedido.** `#e3d0b4` es, a un punto por canal, `--jia-sand-deep` (`#e2cfb2`), el color al que llega el
fondo de la sección. No se añade ningún HEX nuevo a la paleta.

## Encargo — La fotografía y su borde disuelto

- La imagen entra por la **vía de contenido** de siempre: derivados WebP en `scripts/build-assets.sh` →
  `public/propuestas/`, entrada nueva en `lib/content/media.ts` y `mediaId` en
  `lib/content/sections/propuestas.ts`. Sin recorte al construir: quién se lee y quién no lo decide el velo.
- `Proposals.tsx` deja de llevar su `ratio` escrito a mano y lo toma del medio, como ya hacen `Host`,
  `Experiences` y, desde `JIA-2026-09-20-44`, `Hero`.
- **El velo pasa a ser una máscara.** En vez de pintar un color encima, se disuelve el borde izquierdo de la
  superficie con `mask-image`, de modo que lo que se ve por debajo es **el propio fondo de la sección**: el
  degradado casa con el papel a cualquier altura y no hay color nuevo en juego. El `<span>` del velo desaparece.
- **Los tramos del degradado**, leídos en porcentajes de la fotografía:

  | Tramo de la foto | Quién está ahí | Qué debe verse |
  |---|---|---|
  | 9–24 % | la maestra de la izquierda del todo | prácticamente nada |
  | 24–53 % | el jefe indio (su cara, 33–45 %) | sólo parcialmente, emergiendo |
  | ≥ 54 % | el micrófono, la entrevistadora y el sheriff | todo, sin velo |

- Los porcentajes de una máscara se miden sobre **la caja**, no sobre la imagen, así que hay que comprobar que las
  dos escalas no se separan: con punto focal horizontal al 50 % el punto en que la máscara despeja cae entre el
  **52 % y el 54 % de la fotografía** en todo el rango de escritorio (900, 1024, 1440 y 1920 px). Si al medir no
  fuera así, el ajuste es el punto focal, no estirar la imagen.
- **Punto focal vertical.** A 1920 px la caja es más apaisada que la imagen y se recorta ≈ 18 % de alto. El
  sombrero del sheriff empieza al 12,5 % de alto, así que el focal vertical tiene que dejarlo dentro.
- **Por debajo de 900 px no se aplica este degradado.** Allí la foto va sola bajo el texto, sin nada a su
  izquierda que proteger: borrarle media imagen no tendría destinatario. Se le deja sólo el borde izquierdo
  suavizado.

## Verificación exigida

- `npx tsc --noEmit`, `npm run check:content` y `npx next build` en verde.
- Sección revisada a 1920, 1440, 1024 y 390 px, con el punto en que la máscara despeja **medido** sobre la imagen
  dibujada, no estimado a ojo, y comprobando que los sombreros no se recortan por arriba.
- Capturas de la sección en `docs/prompts-output/JIA-2026-09-20-46/evidence/`.

## Cierre

Práctica 14: commit(s) de implementación con su verificación en verde, después informe en
`docs/prompts-output/JIA-2026-09-20-46/` con resumen y análisis de riesgo, y commit documental aparte. Push por
`sds-dev-governance/scripts/git-safe-push.sh origin main`.
