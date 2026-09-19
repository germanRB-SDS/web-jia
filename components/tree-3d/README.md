# tree-3d

Árbol 3D procedural sobre un montículo de tierra, mecido por el viento, dibujado con Three.js en un `<canvas>`
transparente. Pensado como **decoración de fondo**. Es una carpeta autónoma: se copia tal cual a otro proyecto.

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
    ground: "var(--brand-sand)",
    groundDark: "var(--brand-copper)",
    shadow: "var(--brand-ink)",
  }}
  options={{ wind: { strength: 0.8 }, leaves: { count: 8000 } }}
/>
```

### Props

| Prop | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `palette` | `Partial<TreePalette>` | `TREE_DEFAULT_PALETTE` (árbol verde corriente) | Colores. Cada valor es **cualquier color CSS o una propiedad personalizada** (`"var(--token)"`, `color-mix(...)`): se resuelve con `getComputedStyle` sobre el propio elemento, así que sigue a la página. `leaves` es una lista de 2–4 tonos que recorre la copa del lado iluminado al opuesto. |
| `options` | `DeepPartial<TreeOptions>` | `TREE_DEFAULTS` | Cualquier ajuste de `config.ts`, tan profundo como haga falta: forma (`shape`), hojas (`leaves`), montículo (`mound`), viento (`wind`), aparición (`grow`), cámara, luz, sombra y render. |
| `seed` | `number` | `7` | Semilla del generador. |
| `className`, `style` | — | — | La caja del árbol. |

Las props son datos planos: el árbol se reconstruye cuando cambia su **contenido**, no su identidad (se pueden pasar
objetos literales sin `useMemo`).

## Comportamiento

- **Aparición:** la primera vez que entra en pantalla crece desde el suelo y las hojas se abren de dentro afuera
  (`grow.ms`, 1,6 s). Después solo queda el **viento**: vaivén lento de la copa (crece con el cuadrado de la altura; la
  madera y las hojas comparten la misma función, así que ninguna hoja se separa de su rama) y aleteo de cada hoja con
  fase propia, en rachas. Todo en el *vertex shader* (`wind.ts`): la CPU no mueve nada.
- **Rendimiento:** las hojas son un `InstancedMesh` (una llamada de dibujo; 12.000 por defecto), sin `shadowMap` (la
  sombra es un disco con degradado), sin posprocesado, DPR limitado (`render.maxPixelRatio`). **Solo dibuja mientras
  está en pantalla** (`IntersectionObserver`) y con la pestaña visible. `render.maxFps` limita los fotogramas si se quiere.
- **Movimiento reducido** (`prefers-reduced-motion: reduce`): un único fotograma del árbol ya crecido, sin bucle.
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
| `tree-builder.ts` | Geometría procedural pura (sin DOM): tubos que se afinan, hojas instanciadas en masas, montículo y piedras. |
| `wind.ts` | Parche de *shader* (`onBeforeCompile`): viento, apertura de hojas y normales de copa. |
| `config.ts` | `TREE_DEFAULTS`, `TREE_DEFAULT_PALETTE`, tipos y `mergeOptions`. |
| `index.ts` | Exportaciones públicas. |

## Origen

JIA-2026-09-19-34 (web-jia). Inspirado en el árbol de la referencia «Cicada» (CodePen de Zajno), que es un vídeo
pre-renderizado de terceros: aquí **no se usa ni se enlaza** ese vídeo; el árbol se genera en tiempo real.
