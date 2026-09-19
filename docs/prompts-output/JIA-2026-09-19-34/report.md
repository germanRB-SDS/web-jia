# JIA-2026-09-19-34 — Informe

**Prompt:** `docs/prompts/JIA-2026-09-19-34-experiencias-texto-nuevo-y-arbol-3d-de-fondo-como-componente-portable.md`
**Fecha:** 2026-09-19 · **Rama:** `main` · **Push:** no realizado (no se pidió en el encargo).

## Resumen

| Fase | Commit | Contenido |
|---|---|---|
| 0 | `a34ae14` | Prompt (antes de ejecutar). |
| 1 | `8bd6687` | Entradilla nueva de «Experiencias» en `lib/content/copy/es/sections/experiencias.ts`. |
| 2 | `2a3c881` | `components/tree-3d/`: componente portable del árbol 3D. |
| 3 | `0474105` | Integración en «Experiencias» + evidencias. |
| 4 | (este) | Informe y estado del prompt. |

### 1 · Texto

«Cultiva las experiencias educativas desde la práctica. Disfruta de estas propuestas para tu aula, ¡el árbol del saber
está aquí mismo!». **Única diferencia con lo dictado:** se añadió el signo de apertura «¡» (obligatorio en español). Si
el promotor lo quiere sin él, es un carácter.

### 2 · Componente `components/tree-3d/` (portable)

- **Árbol propio, en tiempo real, procedural.** El árbol de la referencia «Cicada» es un vídeo de terceros
  (`cdn.zajno.com`): **no se enlaza ni se copia**. Se genera en código con una semilla: tronco y ramas como tubos que se
  afinan (recursivo), **12.000 hojas** en un solo `InstancedMesh`, montículo de tierra con piedras y sombra de contacto.
- **Portabilidad comprobada:** dentro de la carpeta solo se importa `react`, `three` y ficheros propios (`grep` de
  imports: `react` ×1, `three` ×3, el resto relativos; ninguna aparición de `@/` ni de `jia`). Sin GSAP, sin GLB, sin
  paso de Blender ni entrada en `build-assets.sh`. Los valores por defecto son **neutros** (árbol verde); la paleta y los
  ajustes llegan por *props*. Los colores admiten cualquier color CSS o un token (`var(--…)`, `color-mix(…)`): se
  resuelven con `getComputedStyle` + un canvas de 1 px. `README.md` explica cómo usarlo en otro proyecto.
- **Animación:** la primera vez que entra en pantalla **crece desde el suelo** (1,6 s) y las hojas se abren de dentro
  afuera; después, **viento** tranquilo y continuo (vaivén de la copa + aleteo de cada hoja en rachas), todo en el
  *vertex shader* (`wind.ts`). La madera y las hojas comparten la función de vaivén: ninguna hoja se despega de su rama.
- **Coste contenido:** una llamada de dibujo para las hojas, sin `shadowMap`, sin posprocesado, DPR ≤ 2, **parado fuera
  de pantalla** y con la pestaña oculta. `prefers-reduced-motion`: un fotograma quieto del árbol crecido, sin bucle.
  Sin WebGL 2 no pinta nada y no lanza errores. Decorativo: `aria-hidden`, `pointer-events: none`.

### 3 · Integración en «Experiencias»

- **Capa:** dentro de `backdrop` de `Section`, después de la foto → por encima del fondo y de la fotografía, **por
  detrás de todo lo demás** (`.inner` va a `z-index: 1`). Se excluyó `.tree` de la regla
  `.section > :not(.photo)` que da márgenes al contenido.
- **Sitio:** borde derecho de la ventana, montículo a la altura de «Ver ficha», copa junto a las tarjetas, como el
  garabato. **Colores de la paleta** (solo tokens, en `lib/content/sections/experiencias.ts` › `experienciasTree`):
  hojas marfil → duna clara → cobre → oliva; tronco terracota profunda/tinta; tierra duna/cobre; luz marfil.
- **Decisión tomada con capturas — «el texto manda»:** a 1280–1600 px la copa quedaba **detrás del título de la segunda
  tarjeta** («…animación en stop motion»). Solución: la caja del árbol se dimensiona por el **margen libre** a la
  derecha del contenedor (`margen × 1,22`), de modo que la copa acaba donde acaba la columna, y el árbol **solo se
  monta desde 1680 px** (`experienciasTree.media`). Por debajo no se crea ni el contexto WebGL.
  Consecuencia: a 1920 px el árbol mide ≈ 390 × 500 px (algo menor que el garabato, que lo dibuja ≈ 15 % más alto); a
  1440 px y en móvil no hay árbol.
- `components/site/ExperiencesTree.tsx` es el único puente entre el sitio y el componente (media query + props).

## Verificación

- `tsc --noEmit`: ok · `npm run check:content`: ok (6 talleres, 38 personas, 2 experiencias, 57 medios) ·
  `next build`: ok (estático).
- Chrome real por CDP (SwiftShader) contra `next dev` :3000 — `evidence/`:
  `experiencias-con-arbol-1920.png`, `experiencias-con-arbol-1680-umbral-2x.png` (ancho mínimo: la copa roza el final
  del título sin ponerse detrás), `experiencias-sin-arbol-1440.png`, `experiencias-texto-nuevo-390.png`,
  `arbol-detalle-1920-2x.png`, `arbol-crecimiento-inicio-1920.png` (brote sobre el montículo),
  `arbol-viento-fotograma-a/b-1920.png` (fotogramas distintos: hay viento), `arbol-movimiento-reducido-1920.png`.
- **Scroll horizontal:** `scrollWidth = clientWidth` a 1920, 1680, 1600, 1536 y 1440. A **1280 (1290 px) y 390
  (438 px) hay desbordamiento, pero es el previo y ajeno** (medido sin árbol montado; ya anotado desde JIA-27:
  «Cómo funcionan» / `CubeCarousel`).
- Consola: sin errores. Un aviso de Three.js (`PCFSoftShadowMap has been removed`) que viene de la **herradura**, no
  de este componente (el árbol no usa `shadowMap`).

## Riesgos

**Críticos:** ninguno. **Graves:** ninguno.

**Moderados**
1. **El árbol solo se ve en ventanas ≥ 1680 px.** En un portátil de 1440–1536 px no aparece. Es la consecuencia de no
   tapar texto. *Propuesta:* si el promotor lo quiere también ahí, las opciones son (a) un árbol pequeño (~180 px) dentro
   del margen, o (b) permitir que la copa pase por detrás de la **imagen** de la tarjeta subiendo el árbol y acortando
   el título; ambas son un hotfix de `experienciasTree` + CSS, sin tocar el componente.
2. **Rendimiento real sin medir en GPU modesta.** Las capturas son por software (SwiftShader) y no sirven como medida.
   Es el tercer contexto WebGL de la página (carruaje, herradura, árbol), aunque cada uno se para fuera de pantalla.
   *Propuesta:* probar en el portátil del promotor; si hiciera falta, `options.leaves.count: 8000` y
   `options.render.maxFps: 40` desde la configuración del sitio.
3. **Aspecto «procedural».** De cerca (captura 2×) las hojas son tarjetas planas; a tamaño real funciona como fondo. Si
   el promotor quiere el acabado del vídeo de la referencia, la vía es un GLB de Blender cargado por este mismo
   componente (habría que añadirle un cargador opcional): encargo aparte.

**Menores**
- A 1680 px exactos alguna hoja suelta del borde roza la «n» final del título; no queda detrás del texto.
- iOS/Safari sin probar (no aplica hoy: no se monta por debajo de 1680 px).
- El aviso `PCFSoftShadowMap` de la herradura merece un hotfix propio (`PCFShadowMap`).

## Ficheros del promotor no tocados

Siguen sin commitear, como estaban: `lib/content/site.ts`, `lib/content/copy/es/sections/jornadas.ts`,
`.impeccable/design.json`, `docs/prompts/JIA-2026-09-18-12-…md`, `#jIA26 LOGO.png` y los recursos sin seguimiento de
`assets/`.
