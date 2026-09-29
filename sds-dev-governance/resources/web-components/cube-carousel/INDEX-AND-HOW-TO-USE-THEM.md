# Cubo con imágenes y carrusel continuo

ID estable: `cube-carousel` · referencia opcional · versión de recurso 1.0.0 · origen web-jia.
Cargar sólo al pedir este componente, sus aliases o esta ruta. No es política de diseño obligatoria.

## Qué copiar

Copia **esta carpeta completa** para probarla; para integrar copia `component/` completo sin
cambiar su estructura. No necesita ninguna otra hoja de resources ni acceso a web-jia.
Una vez exportado, el código de `component/` se copia sin modificaciones; la neutralización inicial
respecto al origen está registrada en `provenance.json`.

- `component/CubeCarousel.tsx`: seis caras CSS, imágenes, leyenda y lista accesible.
- `component/cube-engine.ts`: rotación/drag GSAP, asignación de caras ocultas y autoplay.
- `component/config.ts`: giro 0.9 s, roll vertical cada cuatro pasos, precarga ±4 imágenes.
- `component/support/BulletHole.*`: marca decorativa de clic/tap conservada del original.

`integration/palette.css` es el mapa de tokens de ejemplo, no la identidad de un negocio.
`demo/app/content.ts` es el único punto de entrada de textos, datos e imágenes del ejemplo.
`demo/public/media/` contiene fixtures geométricos SVG propios; no contiene fotografías reales.
`provenance.json` identifica commit, archivos originales y SHA-256 de entrada/salida.

## Ejecutar la demo de forma independiente

Desde esta carpeta (no desde `demo/`):

```bash
# Si utilizas nvm: seleccionar el runtime fijado en .nvmrc.
source "$HOME/.nvm/nvm.sh" && nvm use
npm ci
npm run typecheck
npm run build
npm run dev -- --port 3000
```

Abrir el puerto elegido. Build exporta HTML estático en `demo/out/`. Requiere Node 24.19.0 para
reproducir la validación; versiones exactas y lock en package.json/package-lock.json.
React 19 + CSS Modules + GSAP 3.15.0 (incluye Draggable); no Three.js/WebGL/modelos. Next 16.3.4 sólo aporta el entorno de demo; el componente usa React normal y CSS Modules,
no next/image, next/link ni aliases `@/`. Un bundler alternativo debe soportar imports dinámicos y
CSS Modules. GSAP sólo es dependencia del cubo.

## Integración mínima

```tsx
import { CubeCarousel } from "./cube-carousel/component/index";
// content sale de constantes/config/i18n del proyecto receptor.
<CubeCarousel items={content.items} labels={content.labels} />
```

1. Mapear todos los tokens de `integration/palette.css` a la paleta/typografía del destino.
   RGB usan tripletas separadas por espacios; no pasar un HEX a una variable `*-rgb`.
2. Copiar o sustituir imágenes; servirlas desde el host y corregir referencias de content.
   En despliegues con prefijo/basePath, prefijar URLs de medios desde configuración.
3. Mantener CSS Modules junto a sus archivos; importar el mapa de tokens en el layout global.
4. Conectar `component/support/policy.ts` a la autoridad de movimiento del destino si existe.
   La demo usa sólo prefers-reduced-motion, sin cookies ni excepciones por dispositivo. No mezclar
   JS con una política y CSS con otra: actualizar selectores/media conjuntamente si el host permite
   override explícito. Los tres recursos deben compartir esa autoridad al integrarse juntos.
5. Conservar botones, etiquetas, copias aria-hidden y limpieza de efectos. Reprobar después de
   cambios de geometría, cantidad de elementos, paleta, fuentes o política de movimiento.

## API y datos

`CubeItem` y `CubeLabels` se exportan desde `component/index.ts`. Cada elemento: id, title,
subtitle opcional, alt e image `{src,srcSet?,width,height} | null`. `labels`: region, prev, next,
position (`{current}`/`{total}`), hint, list. Array vacío renderiza null; uno no necesita autoplay.
Mantener la lista y el orden estables mientras esté montado: para sustituir/reordenar un conjunto
usar `key` de versión en el componente y remontar (índices, marcas y giro pertenecen al conjunto).
Las caras son decorativas (`aria-hidden`); título/subtítulo y lista representan el contenido.
`alt` no se lee en las caras: si la imagen transmite información adicional, incluirla en texto
accesible del host. No convertir este cubo en la única representación de información esencial.

## Interacciones y ajustes

Seis caras visibles como un cubo real; los elementos pueden ser más de seis: la cara oculta se
recicla. Cada cuarto avance hace roll vertical; al retroceder revierte ese límite. Flechas,
teclado, drag/swipe. Autoplay sólo en pantalla; termina con la primera interacción.
Hover/foco lo retienen. Inicio aleatorio posterior a hidratación, con HTML inicial determinista.
Clic/tap en cara frontal añade una marca decorativa, no abre visor ni navega. Máximo seis marcas
por elemento. `CUBE_CONFIG.randomStart=false` da inicio determinista; `autoplay.enabled=false`
desactiva autoplay. `--cube-size`, `--cube-ground`, `--cube-veil` y RGB controlan el aspecto.
Reduced motion conserva navegación, sin reproducción automática ni transición animada.

## Entorno, lifecycle y límites

SSR genera contenido sin acceder a window en render; los motores arrancan en efectos cliente.
Los motores cancelan RAF/GSAP, listeners y observers al desmontar; imports tardíos comprueban
si el componente sigue montado. Sin JS queda contenido estático; no prometer controles activos.
Requiere navegador moderno con ResizeObserver, IntersectionObserver, Pointer Events, CSS
custom properties y transforms. Tira: también dialog/showModal, container query units y CSS round().
No se certifican navegadores antiguos, lectores de pantalla ni dispositivos físicos por emulación.
La galería está pensada para colecciones cortas; no virtualiza miles de elementos.

## Procedencia, licencia y preservación

Fuente exacta: `germanRB-SDS/web-jia@46065c560c246d804979dd5a0ea0a9ec654ba38c`.
Exportación solicitada por su propietario el 2026-09-29 para reutilización en proyectos SDS.
Se conserva el algoritmo probado; adaptaciones explícitas en provenance.json. No se concede aquí
una licencia pública nueva al código original. React, Next y GSAP conservan sus propias licencias;
se instalan como dependencias, no se redistribuyen sus fuentes dentro del recurso.
Fotos, logos, carteles, dibujo original de película y fuentes de la web quedan excluidos: su uso
en la web no demuestra permiso de redistribución. Para reproducir exactamente la apariencia original,
obtener esos medios autorizados, mantener proporciones y mapear tokens desde la paleta del origen.
La demo neutra es completa sin ellos; no es una copia visual exacta de la identidad de web-jia.

## Validación y aceptación

Consultar `VALIDATION.md` para evidencia y límites, y `preview/` para la apariencia de la demo.
Antes de adoptar: ejecutar tipos/build; comprobar desktop y 390 px, imágenes cargadas, sin overflow,
hover/foco, navegación, drag/tap, reduced motion y desmontaje/reentrada. No dar por válida una nueva
integración sólo porque el origen funcionaba.
