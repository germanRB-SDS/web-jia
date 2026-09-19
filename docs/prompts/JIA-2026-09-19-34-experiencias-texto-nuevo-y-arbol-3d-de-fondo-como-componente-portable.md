# JIA-2026-09-19-34 — «Experiencias»: texto nuevo de la entradilla · Árbol 3D animado de fondo, a la derecha, como componente portable (`components/tree-3d/`)

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat, con dos imágenes: (a) la referencia «Cicada» de
freefrontend.com/javascript-reveal-effects (CodePen de Zajno: HTML + Sass + JS con GSAP; el árbol es un **vídeo**
pre-renderizado con alfa, lila, servido desde `cdn.zajno.com`) y (b) una captura de la sección «Experiencias» a
~1910 px con un garabato rosa a la derecha de las tarjetas: **copa** (el círculo), **tronco** (la línea) y **montículo
de tierra** (la mancha de abajo), que marca dónde va el árbol.
**Nivel:** LEVEL 2 (un cambio de texto + un componente nuevo con WebGL + su integración) · tmp/scratch: **aplica** →
`docs/prompts-output/JIA-2026-09-19-34/tmp/progress.md` (una línea por fase) y `evidence/` (capturas).
**Estado:** SIN EJECUTAR

## Reglas de ejecución

- Este prompt se **commitea antes de ejecutarse**. Después se lee y se ejecuta; **commit al terminar**. El promotor no
  ha pedido push en este mensaje: **no se sube**; se pregunta al cerrar.
- **Un commit por fase** (rollback limpio). `git add` **solo de ficheros propios**: el promotor edita el árbol de
  trabajo en paralelo (`lib/content/site.ts`, `jornadas.ts`, `.impeccable/design.json`, imágenes sin seguimiento…); nada
  de eso entra en estos commits.
- Textos en `lib/content/copy/`; medidas, tiempos y colores en `config.ts`; colores **solo por tokens** de
  `app/theme/palette.css` (ningún HEX en el sitio). Verificación habitual: `tsc`, `npm run check:content`,
  `next build`, y Chrome real por CDP (con `--use-angle=swiftshader --enable-unsafe-swiftshader` para el canvas WebGL)
  a **1920, 1440 y 390**. `next dev` ya está en marcha en el **3000**: no arrancar otro.

## Encargo 1 — Texto de la entradilla de «Experiencias»

`lib/content/copy/es/sections/experiencias.ts` → `lede`. Sustituir

> Experiencias educativas llevadas a la práctica: cómo se desarrollaron, qué se aprendió y qué conviene adaptar a otros
> contextos. Propuestas para inspirarte, plantear preguntas y encontrar nuevas posibilidades para tu aula.

por

> Cultiva las experiencias educativas desde la práctica. Disfruta de estas propuestas para tu aula, ¡el árbol del saber
> está aquí mismo!

(Única diferencia con lo dictado: el signo de apertura «¡», que en español es obligatorio. Avisar al promotor.) La frase
parecida de `jornadas.ts` («…propuestas llevadas a la práctica…») **no se toca**: es otro texto y ese fichero lo está
editando el promotor.

## Encargo 2 — Árbol 3D animado, como **componente portable**

### Qué se toma de la referencia y qué no

- **Solo el árbol** (animado). Nada de cabecera, titulares que entran, alas de cigarra, diagrama de ramas, círculos,
  botón de sonido ni audio. Tampoco su `scrollTrigger`: aquí el árbol es **decoración de fondo**, no una escena.
- El árbol de la referencia es un **vídeo de terceros** (`cicada_tree.mov/.webm`). **No se enlaza ni se copia**: no
  tenemos licencia, es lila y no se puede repintar bien con filtros. Se hace **un árbol 3D propio en tiempo real con
  Three.js** (ya es dependencia del proyecto), de la misma familia visual: copa frondosa de hojas menudas en varias
  masas, tronco fino y retorcido con un par de ramas a la vista, sobre un **montículo de tierra**. Hojas mecidas por el
  viento.

### Requisito del promotor: componente, en ficheros independientes, que sirva aquí **y en otros proyectos**

Carpeta **`components/tree-3d/`**, al nivel de `flip-card`, `tilt-card` y `cube-carousel`. Se «llama» desde la sección;
no vive dentro de ella. Reglas de portabilidad (son el criterio de aceptación de este encargo):

1. **Cero imports del proyecto.** Dentro de la carpeta solo se importa `react`, `three` y ficheros de la propia
   carpeta. Nada de `@/lib/...`, `@/components/...`, ni CSS del sitio. Sin GSAP (el viento va en el *shader*; la
   aparición, con un reloj propio). Copiar la carpeta a otro proyecto con React + Three.js debe bastar.
2. **Sin ficheros de modelo.** El árbol es **procedural** (se genera en código con una semilla): no hay GLB que
   copiar, ni paso de Blender, ni entrada en `build-assets.sh`. Misma semilla → mismo árbol.
3. **Ningún color ni medida del sitio dentro del componente.** Los valores por defecto de `config.ts` son **neutros**
   (un árbol verde/pardo corriente). El proyecto que lo usa le pasa su paleta y sus ajustes por *props*. Los colores
   admiten cualquier color CSS **o un token** (`"var(--jia-olive)"`): el motor los resuelve con `getComputedStyle`
   sobre su propio elemento, así el sitio sigue sin HEX y otro proyecto puede pasar los suyos.
4. **El componente no se coloca a sí mismo.** Rellena la caja que le den (`className`/`style` del que lo llama); la
   posición en la página es cosa del sitio.

Ficheros:

| Fichero | Contenido |
|---|---|
| `Tree3D.tsx` | Envoltorio React (`"use client"`). Monta un `<canvas aria-hidden>` en un `div`, importa el motor con `import()` dinámico, `ResizeObserver`, limpieza al desmontar. Props: `palette?`, `options?` (parcial y profundo sobre `TREE_DEFAULTS`), `seed?`, `className?`, `style?`. Sin WebGL no pinta nada (sin errores). |
| `tree-scene.ts` | Motor sin React: `WebGLRenderer` transparente (`alpha`, `powerPreference: "low-power"`, DPR ≤ 2), cámara, luces, sombra de contacto bajo el árbol, bucle. **Solo renderiza mientras se ve** (`IntersectionObserver`) y con la pestaña visible; con `prefers-reduced-motion` dibuja **un fotograma quieto** y no arranca bucle. `dispose()` libera geometrías, materiales y el contexto. |
| `tree-builder.ts` | Geometría procedural, pura (sin DOM): tronco y ramas como tubos que se afinan (recursivo, con semilla), hojas como **`InstancedMesh`** (una sola llamada de dibujo) agrupadas en masas alrededor de las puntas de las ramas, y montículo (casquete achatado con ruido). Colores por vértice/instancia mezclando los tonos de la paleta. |
| `wind.ts` | El viento: parche de *shader* (`onBeforeCompile`) que mece cada hoja según su posición y una fase propia, más un vaivén lento y pequeño de la copa entera. Uniformes `uTime`, `uStrength`. |
| `config.ts` | `TREE_DEFAULTS` (forma, nº de hojas, viento, cámara, luz, aparición, DPR máx.) y `TREE_DEFAULT_PALETTE` (neutra). Tipos `TreeOptions`, `TreePalette`. |
| `Tree3D.module.css` | Lo mínimo: el `div` y el `canvas` rellenan la caja; `pointer-events: none`. |
| `index.ts` | Exporta `Tree3D`, los tipos y los valores por defecto. |
| `README.md` | Cómo usarlo en otro proyecto: dependencias, props, ejemplo, paleta por tokens, rendimiento y accesibilidad. |

Paleta (`TreePalette`): `leaves: string[]` (2–4 tonos que se mezclan por hoja), `trunk`, `trunkDark`, `ground`,
`groundDark`, `shadow`. Animación: **aparición** una sola vez al entrar en pantalla (el árbol crece desde el suelo,
~1,4 s, y las hojas se abren escalonadas) y después **viento** continuo y tranquilo. Es fondo: nada que llame la
atención más que el texto.

Rendimiento: ≤ ~6.000 hojas instanciadas, 1 sombra barata (disco con degradado, **sin** `shadowMap`), sin
posprocesado, sin entorno PMREM. Parado fuera de pantalla.

Accesibilidad: puramente decorativo → `aria-hidden`, sin foco, sin texto alternativo, `pointer-events: none` (no roba
clics a las tarjetas ni al cursor propio del sitio).

## Encargo 3 — Integración en «Experiencias»

- **Dónde:** a la derecha de las tarjetas, donde está el garabato: el **montículo** abajo a la derecha, más o menos a la
  altura de «Ver ficha»; el **tronco** sube por el margen derecho de la ventana; la **copa** queda a la altura de la
  entradilla y asoma un poco por detrás de la columna de contenido. Referencia medida sobre la captura (~1910 px): caja
  del árbol ≈ 15 % del ancho de la ventana y ≈ 57 % del alto de la sección, pegada al borde derecho, con el suelo al
  ≈ 87 % del alto.
- **Capa:** **por detrás de todos los elementos de la sección, excepto la fotografía y el color de fondo** (promotor).
  Orden: fondo `--jia-vellum-3` → fotografía (`.photo`, z 0) → **árbol** (z 0, después en el DOM) → contenido
  (`.inner`, z 1). Se pasa dentro de `backdrop` de `Section`, junto a la foto. Ojo con
  `.section > :not(.photo)` de `Experiences.module.css` (≥ 1280 px), que da márgenes a todo lo que no sea la foto:
  excluir también la capa del árbol.
- **Colores de nuestra paleta**, para que se integre con el papel y la foto sepia: hojas entre `--jia-olive`,
  `--jia-copper`, `--jia-dune` y un toque de `--jia-terracotta`; tronco `--jia-ink` / `--jia-terracotta-deep`; tierra
  `--jia-dune` / `--jia-copper`; sombra `--jia-ink`. La mezcla exacta se decide **viendo el resultado** en Chrome y se
  deja en la configuración del sitio, no en el componente.
- **Configuración del sitio:** `lib/content/sections/experiencias.ts` gana `tree` (`enabled`, `media` a partir de la
  cual se monta, paleta por tokens, semilla y ajustes). `Experiences.tsx` lo lee del modelo (`experiencias.tree`) y
  llama a `<Tree3D />`; la caja y su posición, en `Experiences.module.css`.
- **Solo en el diseño ancho** (≥ 1280 px, donde la sección mide lo que la foto y existe ese hueco a la derecha). Por
  debajo **no se monta** (como la herradura): en móvil no hay sitio y no merece el coste de WebGL. Si entre 1280 y
  ~1600 px la copa queda detrás del **texto corrido** y le quita legibilidad, se reduce o se sube el umbral: **el texto
  manda**. Decidir con las capturas y anotarlo.
- **No debe** crear scroll horizontal (la sección ya tiene `overflow: clip`), ni mover nada de lo que hay, ni tapar el
  degradado de la costura con «Propuestas».

Evidencias: sección completa a 1920 y 1440 (con árbol) y a 390 (sin árbol, texto nuevo); dos o tres fotogramas
separados para ver el viento; fotograma con `prefers-reduced-motion`; `scrollWidth` = `clientWidth` a los tres anchos;
comprobación de portabilidad (`grep` de imports dentro de `components/tree-3d/`).

## Fases y commits

| Fase | Contenido | Cierre |
|---|---|---|
| 0 | este prompt | commit **(antes de ejecutar)** |
| 1 | Encargo 1 (texto) | commit |
| 2 | Encargo 2 (`components/tree-3d/`, sin integrar) | commit |
| 3 | Encargo 3 (integración + evidencias) | commit |
| 4 | `report.md` (resumen + riesgos moderados/graves/críticos + propuestas) y estado del prompt | commit |

## Riesgos previstos

- **Moderado — legibilidad:** la copa por detrás de la entradilla o de los títulos de las tarjetas a 1280–1600 px.
  Mitigación: umbral de montaje y tamaño en la configuración; decidir con capturas.
- **Moderado — aspecto:** un árbol procedural puede quedar «de juguete» al lado de una fotografía. Mitigación: muchas
  hojas pequeñas, tonos apagados de la paleta, luz cálida lateral como la de la foto, sombra de contacto; iterar en
  Chrome antes de dar la fase por buena. Si no convence, la alternativa (fuera de este encargo) es un GLB de Blender
  cargado por el mismo componente.
- **Menor — coste:** un segundo contexto WebGL en la página (con la herradura y el carruaje). Mitigación: bucle parado
  fuera de pantalla, DPR ≤ 2, una llamada de dibujo para las hojas.
- **Menor — SwiftShader:** las capturas por CDP renderizan por software; los tiempos de fotograma de las evidencias no
  son representativos del rendimiento real.
