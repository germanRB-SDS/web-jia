# JIA-2026-09-19-35 — Informe

**Prompt:** `docs/prompts/JIA-2026-09-19-35-arbol-3d-doble-de-grande-colores-y-frondosidad-de-la-referencia-hojas-que-caen-y-suelo-de-roca.md`
**Fecha:** 2026-09-19 · **Rama:** `main` · **Push:** no realizado (no se pidió). Tampoco está subido JIA-34.

## Resumen

| Fase | Commit | Contenido |
|---|---|---|
| 0 | `152b431` | Prompt (antes de ejecutar). |
| 1 | `e49f231` | `components/tree-3d/`: forma, frondosidad, suelo, hojas que caen, sin crecimiento, README. |
| 2 | `af36e06` | Tokens `--jia-tree-*`, configuración del sitio, tamaño y posición, evidencias. |
| 3 | (este) | Informe y estado del prompt. |

Lo pedido, punto por punto:

1. **El doble de grande.** El árbol ocupa **todo el alto de la sección**: ≈ 700 px de alto a 1920 (antes ≈ 385 px →
   ≈ 1,8×; el doble exacto, 770 px, no cabe bajo el borde superior sin cortar la copa). Pegado al suelo de la sección,
   a la derecha; lo que no cabe **sangra por el borde de la ventana**, como en la referencia.
2. **Hojas arrancadas por la brisa, hacia abajo‑izquierda.** 120 hojas en una segunda malla instanciada: salen de donde
   ya hay una hoja de la copa, arrancan despacio, cogen velocidad, serpentean, giran sobre sí mismas y se desvanecen
   antes de posarse (vidas de 6–11 s, desfasadas: siempre hay unas cuantas en el aire). Todo en el *vertex shader*.
3. **Color y frondosidad de la referencia — con Three.js.** Sass no dibuja 3D (es un preprocesador de CSS; en la
   referencia solo coloca un `<video>`), así que se hizo en Three.js y **sin usar el vídeo de terceros**. Copa **maciza en
   lóbulos redondeados** (22.000 hojas colocadas sobre la «cáscara» de cada lóbulo, solapadas como plumas, con la normal
   del lóbulo para que cada masa tenga volumen), **de crema rosado en la luz a lila en la sombra**, luz desde arriba a
   la derecha, **tres tallos finos** que se retuercen desde el pie y **lianas** colgando de la copa.
   Los colores viven en `app/theme/palette.css` como extensión (`--jia-tree-*`, solo para el árbol). La paleta sepia de
   JIA-34 sigue en `experiencias.ts`: cambiar `treePalette` de `"cicada"` a `"sepia"` la recupera.
4. **Suelo como el de la foto.** Afloramiento de **rocas facetadas gris‑lila** apiladas alrededor de una loma de
   **musgo amarillo‑verdoso**; el musgo tiñe las caras de roca que miran al cielo.
5. **Sin crecer.** El árbol está entero desde el primer fotograma, con brisa y hojas (`grow.enabled: false`; la opción
   se conserva en el componente).

**Portabilidad intacta:** `grep` de imports en `components/tree-3d/` → `react` ×1, `three` ×3, el resto relativos; ninguna
referencia a `@/` ni a `jia`. Todo lo nuevo son opciones con valores por defecto neutros; README actualizado.

## Decisiones tomadas con capturas

- **Giro de 180° (`shape.turnDeg`)**: con la semilla actual la copa caía hacia el texto; girado, la masa va hacia el
  borde de la ventana y el lado lila (sombra) queda hacia el texto, como en la referencia.
- **Posición anclada a la columna**, no a la ventana (`right: calc(margen − 29,7vw)`): la copa empieza un poco dentro
  del borde derecho de la columna a cualquier ancho.
- **Umbral de montaje: 1680 px** (el prompt aspiraba a 1280). A 1440 la copa tapaba el título de la segunda tarjeta y
  las rocas pisaban su «Ver ficha →» (`evidence/descartado-1440-…png`). A 1680 y 1920 todo el texto se lee.

## Verificación

- `tsc --noEmit` ok · `check:content` ok · `next build` ok.
- Chrome real por CDP (SwiftShader) contra `next dev` :3000 — `evidence/`: sección a 1920 y 1680; detalle 2×; secuencia
  `hojas-que-caen-{200,1600,3000,4400}-ms` (fotogramas distintos; el de 200 ms ya muestra el árbol entero: no crece);
  movimiento reducido (árbol quieto, **ninguna hoja en el aire**); 390 sin árbol.
- `scrollWidth = clientWidth` a 1920, 1680 y 1440 aunque la caja sobresale por la derecha (la sección recorta). A 390
  siguen los 438 px previos y ajenos (sin árbol montado).

## Riesgos

**Críticos:** ninguno. **Graves:** ninguno.

**Moderados**
1. **Legibilidad, por decisión del promotor.** A 1920 los finales de las dos primeras líneas de la entradilla
   («…la práctica.», «…árbol del») quedan sobre el borde de la copa. Se leen (tinta sobre lila claro) pero con ruido.
   *Propuesta:* si molesta, estrechar la medida de la entradilla en esta sección o subir 2–3 vw el desplazamiento.
2. **Coherencia de marca.** Árbol lila y musgo verde‑amarillo sobre una página sepia: llama más la atención que un
   fondo. Es lo pedido; la alternativa sepia está a una palabra (`treePalette`).
3. **Coste sin medir en GPU real.** Canvas de ≈ 1190 × 820 px (× DPR 2), 22.000 hojas, tercer contexto WebGL de la
   página. Las capturas son por software y no miden. *Propuesta:* probar en el equipo del promotor; palancas desde la
   configuración del sitio: `leaves.count`, `render.maxPixelRatio: 1.5`, `render.maxFps: 40`.
4. **Solo ≥ 1680 px.** En portátiles de 1440–1536 no hay árbol. *Propuesta:* variante más pequeña para esos anchos
   (otra entrada de opciones por media query) si el promotor la quiere.

**Menores**
- Parecido, no copia: render en tiempo real con hojas planas frente a un render offline con hojas modeladas.
- Parte de la copa y de las rocas queda fuera de la ventana por la derecha (recorte deliberado, como la referencia).
- Aviso `PCFSoftShadowMap` en consola: viene de la herradura, no del árbol.

## Ficheros del promotor no tocados

`lib/content/site.ts`, `lib/content/copy/es/sections/jornadas.ts`, `.impeccable/design.json`,
`docs/prompts/JIA-2026-09-18-12-…md`, `#jIA26 LOGO.png` y los recursos sin seguimiento de `assets/`.
