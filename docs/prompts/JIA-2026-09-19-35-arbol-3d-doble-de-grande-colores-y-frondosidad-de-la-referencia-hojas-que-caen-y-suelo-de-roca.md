# JIA-2026-09-19-35 — Árbol 3D de «Experiencias»: el doble de grande, con el color y la frondosidad de la referencia, hojas que caen arrancadas por la brisa, suelo de roca y musgo, y sin «crecer»

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat tras ver JIA-2026-09-19-34, con una **secuencia de
cuatro capturas** de la referencia «Cicada» (freefrontend.com/javascript-reveal-effects, CodePen de Zajno) en las que se
aprecia el movimiento del árbol.
**Nivel:** LEVEL 2 (evolución de un componente con WebGL + su integración) · tmp/scratch: **aplica** →
`docs/prompts-output/JIA-2026-09-19-35/tmp/progress.md` y `evidence/`.
**Estado:** EJECUTADO (2026-09-19) — informe en `docs/prompts-output/JIA-2026-09-19-35/report.md`. Decisiones de ejecución: árbol girado 180°, posición anclada a la columna y montaje desde **1680 px** (a 1440 tapaba el título de la tarjeta). Sin push (no se pidió).

## Contexto (lo anterior: JIA-2026-09-19-34, ejecutado, sin push)

- `components/tree-3d/` es un **componente portable**: árbol procedural con Three.js, solo importa `react` y `three`,
  sin modelos ni GSAP; paleta y opciones por *props* (colores CSS o tokens); README propio. **Esa regla sigue en pie:**
  todo lo de este encargo se hace dentro del componente como opciones con valores por defecto neutros, y el sitio
  decide los suyos en `lib/content/sections/experiencias.ts` › `experienciasTree`.
- Está integrado de fondo en «Experiencias» (`components/site/ExperiencesTree.tsx`, `.tree` en
  `Experiences.module.css`): por encima de la foto y del fondo, por detrás del contenido. En JIA-34 se montaba solo
  desde 1680 px y pequeño (≈ 390 × 500 px a 1920) **para no pasar por detrás de ningún texto**, con hojas
  marfil/cobre/oliva, montículo liso de tierra y una animación de crecimiento al entrar en pantalla.

## Lo que pide el promotor (y cómo se interpreta)

1. **«El árbol que sea el doble de alto y grande.»** El árbol visible medía ≈ 385 px de alto a 1920; el doble (≈ 770 px)
   es prácticamente **todo el alto de la sección** (822 px). Se dimensiona por el alto de la sección, pegado abajo a la
   derecha. **Consecuencia asumida:** la copa pasa por detrás de la segunda tarjeta y de parte del texto. La regla de
   JIA-34 («nunca detrás de texto») **queda sustituida por decisión del promotor**; lo que se sigue exigiendo es que el
   texto **se lea bien** (la copa de la referencia es clara y el texto es tinta oscura: comprobar con capturas y, si
   hace falta, desplazar el árbol a la derecha dejando que sangre por el borde de la ventana, como en la referencia).
2. **«Las hojas caen como arrancadas por una brisa… hacia abajo-izquierda.»** Además del vaivén, **hojas sueltas que se
   desprenden de la copa y se van flotando hacia abajo y a la izquierda**, girando sobre sí mismas, y se desvanecen
   antes de tocar nada. Continuo y discreto (decenas de hojas, no una tormenta). Todo en el *shader* (posición en
   función del tiempo y de una fase por hoja): la CPU no mueve nada. Con `prefers-reduced-motion`, ninguna.
3. **«Me gusta el color de la foto para el árbol… que luzca igual, y la frondosidad también.»** Colores de la
   referencia: copa de **lila en la sombra a crema rosado en la luz**, tronco pardo rosado, luz desde arriba a la
   derecha. Frondosidad: copa **maciza en varios lóbulos redondeados**, hojas puntiagudas bien visibles, solapadas como
   plumas, sin huecos; tronco de **varios tallos finos** que se retuercen desde el pie y **raicillas/lianas finas que
   cuelgan** de la copa.
   - **¿Three.js o Sass?** **Three.js.** Sass es un preprocesador de CSS: no dibuja 3D (en la referencia el Sass solo
     coloca un `<video>`). Se sigue **sin usar ese vídeo** (de terceros, sin licencia).
   - **Paleta:** esos colores no existen en `app/theme/palette.css`. Como el sitio no admite HEX fuera de la paleta, se
     añaden allí como **extensión** (tokens `--jia-tree-*`, muestreados de la referencia, de uso exclusivo del árbol).
     La paleta sepia de JIA-34 se conserva en la configuración como alternativa (`palettes.sepia`) para poder volver
     cambiando una palabra.
4. **«Que el suelo se parezca al de la foto.»** En la referencia el árbol sale de un **afloramiento de rocas
   facetadas gris-lila cubiertas de musgo amarillo-verdoso**, no de un montículo liso. Se sustituye el montículo por
   rocas de caras planas apiladas + una loma de musgo al pie del tronco; el musgo tiñe las caras que miran hacia arriba.
5. **«Que el árbol no crezca: que aparezca desde el primer momento todo generado, y con la brisa y las hojas.»** La
   aparición por crecimiento **se desactiva** (queda como opción del componente, apagada por defecto). Desde el primer
   fotograma: árbol completo, brisa y hojas cayendo.

## Cambios en el componente (`components/tree-3d/`, sigue siendo portable)

- `config.ts`: `shape.trunk.stems` (tallos), `shape.vines` (lianas), hojas en **cáscara de lóbulo** (`leaves.shell`,
  tamaño y número mayores), `mound` → loma de musgo + `rocks`, **`fall`** (nº de hojas, dirección, distancia, duración,
  giro, deriva), `grow.enabled: false`, `camera.air` (aire extra por cada lado del encuadre, para que las hojas que
  caen no se corten en el borde del canvas). `TreePalette` gana `moss` y `mossDark` (`ground`/`groundDark` pasan a ser
  la roca). El gradiente de `leaves` va **del lado iluminado al de sombra**, siguiendo la posición del sol.
- `tree-builder.ts`: varios tallos; lóbulos en las puntas y en las horquillas; hojas sobre la cáscara de cada lóbulo,
  apuntando hacia fuera y algo caídas, con normal mezclada lóbulo/copa (cada lóbulo tiene su volumen) y sombra propia
  por debajo; lianas; rocas facetadas con musgo por orientación de cara; puntos de partida de las hojas que caen.
- `wind.ts`: parche para las hojas que caen (trayectoria, giro, vida) reutilizando el vaivén común.
- `tree-scene.ts`: segunda malla instanciada para las hojas que caen; encuadre con `camera.air`; sin crecimiento por
  defecto; movimiento reducido = árbol quieto y sin hojas cayendo.
- `README.md`: actualizar opciones, paleta y comportamiento.

## Cambios en el sitio

- `app/theme/palette.css`: bloque «Árbol del saber (extensión)» con los tokens `--jia-tree-*`.
- `lib/content/sections/experiencias.ts`: `experienciasTree` con `palettes.cicada` (activa) y `palettes.sepia`, luz
  desde la derecha, y el umbral de montaje que resulte de las capturas (objetivo: todo el diseño ancho, ≥ 1280 px, si
  el texto se lee bien; si no, el umbral más bajo en que se lea).
- `Experiences.module.css`: caja del árbol por **alto de sección** (≈ todo el alto), pegada abajo a la derecha, más
  ancha hacia la izquierda para el vuelo de las hojas; sin scroll horizontal (la sección ya recorta).

## Reglas de ejecución

- Prompt **commiteado antes de ejecutar**; después se lee y se ejecuta; **commit al terminar**. Sin push (no se ha
  pedido): preguntar al cerrar.
- Un commit por fase; `git add` **solo de ficheros propios** (el promotor edita en paralelo `site.ts`, `jornadas.ts`,
  `.impeccable/design.json`, recursos de `assets/`…).
- Verificación: `tsc`, `npm run check:content`, `next build`, Chrome real por CDP con SwiftShader contra `next dev`
  (:3000, ya en marcha; no arrancar otro) a 1920, 1440 y 390; comparar lado a lado con la captura de la referencia;
  fotogramas separados para ver las hojas caer; fotograma con movimiento reducido; `scrollWidth`; `grep` de
  portabilidad.

| Fase | Contenido | Cierre |
|---|---|---|
| 0 | este prompt | commit **(antes de ejecutar)** |
| 1 | componente: forma, frondosidad, suelo, hojas que caen, sin crecimiento, README | commit |
| 2 | sitio: tokens, configuración, tamaño y posición + evidencias | commit |
| 3 | `report.md` (resumen + riesgos + propuestas) y estado del prompt | commit |

## Riesgos previstos

- **Moderado — legibilidad:** copa grande detrás de títulos y entradilla. Decisión del promotor; mitigar con posición,
  colores claros y capturas. Anotar en el informe lo que quede tapado.
- **Moderado — coherencia de marca:** un árbol lila sobre una página sepia rompe la paleta cálida por decisión
  expresa; se deja la alternativa sepia a una palabra de distancia.
- **Moderado — coste:** más hojas, canvas mucho mayor (≈ todo el alto de la sección) y DPR 2. Mitigar: una llamada de
  dibujo por malla, sin `shadowMap`, parado fuera de pantalla; dejar `leaves.count` y `render.maxPixelRatio` a mano.
- **Menor — parecido:** es un árbol procedural en tiempo real frente a un render offline; se busca la misma familia
  visual (color, masa, luz, movimiento), no una copia píxel a píxel.
