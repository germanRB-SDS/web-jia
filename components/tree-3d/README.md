# tree-3d

Árbol 3D procedural —varios tallos finos, copa maciza en lóbulos de hojas, lianas colgantes— sobre un afloramiento de
rocas con musgo, mecido por la brisa, que además le arranca hojas. Dibujado con Three.js en un `<canvas>` transparente. Pensado como **decoración de fondo**. Es una carpeta autónoma: se copia tal cual a otro proyecto.

- **Dependencias:** `react` (≥ 18) y `three` (probado con 0.186). Nada más: ni GSAP, ni modelos GLB, ni imágenes.
- **Sin imports del proyecto:** dentro de la carpeta solo se importa `react`, `three` y ficheros de la propia carpeta.
- **Estilos:** un CSS Module mínimo (`Tree3D.module.css`). Si el proyecto de destino no usa CSS Modules, basta con dar al
  `div` `pointer-events: none; overflow: hidden`.
- **Next.js (App Router):** `Tree3D.tsx` ya lleva `"use client"`; el motor se carga con `import()` dinámico.

## Uso

```tsx
import { Tree3D } from "@/components/tree-3d";

// El componente rellena la caja que se le dé: el tamaño y la posición son del que lo llama.
<Tree3D
  className={styles.tree}            // p. ej. position: absolute; right: 0; bottom: 0; width: 24rem; aspect-ratio: .78
  seed={7}                           // misma semilla → mismo árbol
  palette={{
    leaves: ["var(--brand-cream)", "var(--brand-sand)", "var(--brand-copper)"],
    trunk: "#5b3a29",
    trunkDark: "var(--brand-ink)",
    ground: "var(--brand-stone)",      // la roca
    groundDark: "#6f6b64",
    moss: "var(--brand-moss)",         // la loma al pie y las caras de las rocas que miran al cielo
    mossDark: "#5f7036",
    shadow: "var(--brand-ink)",
  }}
  options={{ wind: { strength: 0.8 }, leaves: { count: 8000 } }}
/>
```

### Props

| Prop | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `palette` | `Partial<TreePalette>` | `TREE_DEFAULT_PALETTE` (árbol verde corriente) | Colores. Cada valor es **cualquier color CSS o una propiedad personalizada** (`"var(--token)"`, `color-mix(...)`): se resuelve con `getComputedStyle` sobre el propio elemento, así que sigue a la página. `leaves` es una lista de 2–4 tonos que recorre la copa **del lado iluminado al de sombra** (según `light.sunFrom`). |
| `options` | `DeepPartial<TreeOptions>` | `TREE_DEFAULTS` | Cualquier ajuste de `config.ts`, tan profundo como haga falta: forma (`shape`: tallos, niveles de ramas, lianas, giro), hojas (`leaves`: número, tamaño, lóbulos), suelo (`mound`: loma y rocas), viento (`wind`), hojas que caen (`fall`), aparición (`grow`), cámara (con `camera.air`), luz, sombra y render. |
| `seed` | `number` | `7` | Semilla del generador. |
| `className`, `style` | — | — | La caja del árbol. |

Las props son datos planos: el árbol se reconstruye cuando cambia su **contenido**, no su identidad (se pueden pasar
objetos literales sin `useMemo`).

## Comportamiento

- **Desde el primer fotograma, el árbol entero.** La aparición por crecimiento existe (`grow.enabled`, 1,6 s: sube
  desde el suelo y las hojas se abren de dentro afuera) pero viene **apagada**.
- **Viento:** vaivén lento de la copa (crece con el cuadrado de la altura; la madera y las hojas comparten la misma
  función, así que ninguna hoja se separa de su rama) y aleteo de cada hoja con fase propia, en rachas.
- **Hojas que caen** (`fall`): unas decenas de hojas se desprenden de donde ya hay una hoja de la copa, arrancan
  despacio, cogen velocidad en la dirección de la brisa (`fall.direction`, por defecto abajo‑izquierda), serpentean,
  giran sobre sí mismas y se desvanecen antes de posarse. `camera.air` reserva aire en el encuadre (a la izquierda, por
  ejemplo) para que no se corten en el borde del canvas. Viento y caída van en el *vertex shader* (`wind.ts`): la CPU
  no mueve nada.
- **Rendimiento:** las hojas son un `InstancedMesh` (una llamada de dibujo; 22.000 por defecto, más otra malla con las que caen), sin `shadowMap` (la
  sombra es un disco con degradado), sin posprocesado, DPR limitado (`render.maxPixelRatio`). **Solo dibuja mientras
  está en pantalla** (`IntersectionObserver`) y con la pestaña visible. `render.maxFps` limita los fotogramas si se quiere.
- **Movimiento reducido** (`prefers-reduced-motion: reduce`): un único fotograma del árbol quieto, sin bucle y sin hojas cayendo.
- **Accesibilidad:** decoración pura → `aria-hidden`, sin foco, `pointer-events: none`.
- **Sin WebGL 2:** no dibuja nada y no lanza errores (la caja queda vacía).
- **Encaje:** la cámara encuadra el árbol entero dentro de la caja, **apoyado en su borde inferior**; si sobra alto,
  el aire queda arriba.
- **Montaje condicional** (p. ej. solo en escritorio): es cosa del que lo llama; no montar `<Tree3D />` evita crear el
  contexto WebGL. Ver `components/site/ExperiencesTree.tsx` en este proyecto.

## Ficheros

| Fichero | Contenido |
|---|---|
| `Tree3D.tsx` | Envoltorio React: monta el `div`, carga el motor, `ResizeObserver`, limpieza. |
| `tree-scene.ts` | Motor sin React: renderer, cámara, luces, sombra de contacto, bucle, resolución de colores CSS, `dispose()`. |
| `tree-builder.ts` | Geometría procedural pura (sin DOM): tallos y ramas como tubos que se afinan, lianas, hojas instanciadas sobre la cáscara de lóbulos, loma de musgo, rocas facetadas y puntos de partida de las hojas que caen. |
| `wind.ts` | Parches de *shader* (`onBeforeCompile`): viento, normales de lóbulo, apertura de hojas y vuelo de las hojas que caen. |
| `config.ts` | `TREE_DEFAULTS`, `TREE_DEFAULT_PALETTE`, tipos y `mergeOptions`. |
| `index.ts` | Exportaciones públicas. |

## Origen

JIA-2026-09-19-34 y -35 (web-jia). Inspirado en el árbol de la referencia «Cicada» (CodePen de Zajno), que es un vídeo
pre-renderizado de terceros: aquí **no se usa ni se enlaza** ese vídeo; el árbol se genera en tiempo real.
