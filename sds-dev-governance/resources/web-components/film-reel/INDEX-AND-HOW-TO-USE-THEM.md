# Tira de cine con carteles y visor

ID estable: `film-reel` · referencia opcional · versión de recurso 1.0.0 · origen web-jia.
Cargar sólo al pedir este componente, sus aliases o esta ruta. No es política de diseño obligatoria.

## Qué copiar

Copia **esta carpeta completa** para probarla; para integrar copia `component/` completo sin
cambiar su estructura. No necesita ninguna otra hoja de resources ni acceso a web-jia.
Una vez exportado, el código de `component/` se copia sin modificaciones; la neutralización inicial
respecto al origen está registrada en `provenance.json`.

- `component/FilmReel.tsx`: tira, copias, controles y selección del cartel.
- `component/reel-engine.ts`: desplazamiento infinito, drag, inercia, foco y pausa.
- `component/ReelViewer.tsx`: diálogo nativo, bloqueo de scroll y devolución del foco.
- `component/config.ts`: geometría medida, sentido, velocidad, umbrales y temporización.

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
React 19 + CSS Modules; motor DOM sin GSAP ni Three.js. Next 16.3.4 sólo aporta el entorno de demo; el componente usa React normal y CSS Modules,
no next/image, next/link ni aliases `@/`. Un bundler alternativo debe soportar imports dinámicos y
CSS Modules. GSAP sólo es dependencia del cubo.

## Integración mínima

```tsx
import { FilmReel } from "./film-reel/component/FilmReel";
// content sale de constantes/config/i18n del proyecto receptor.
<FilmReel reel={content.reel} />
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

`ReelModel` en `component/support/types.ts`: `posters: {id,media,label,alt}[]` y `labels`
(region, pause, play, previous, next, close). Identificadores únicos; `media.variants` no vacío,
ordenado por anchura ascendente, dimensiones positivas y `ratio` real. Array vacío renderiza null.
Imágenes visibles son datos del host. La piel usa `--reel-frame-image: url(...)` y
`--reel-stains-image: url(...)` (opcional, `none` por defecto), definidas por el registro de medios
en un contenedor; ver `demo/app/page.tsx` y `content.ts`. Copiar también la piel: sin ella se ven
los carteles pero no el marco de película.

## Interacciones y ajustes

Hover con ratón amplía la miniatura a 1.08; clic, tap, Enter o Space abren el visor grande.
El modal NO se abre automáticamente por hover. Cierra con X, Escape, fondo y salida del ratón
tras entrar en la imagen (150 ms). Touch no dispara cierre por salida. El foco vuelve al botón
real, incluso si se abrió desde una copia. Pausa manual y automática con hover/foco/modal,
fuera de pantalla y pestaña oculta. En reduce: sin drift/inercia; flechas disponibles.
Drag/swipe preservan scroll vertical y suprimen el clic tras superar 6 px.
`--reel-band`, `--reel-fade`, `--reel-controls-inset` ajustan composición sin tocar motor.
La piel neutra mide 400×412; ventana x14/y61/370×290. Carteles 1414/2000 centrados, contain.
Para otra piel, medir y actualizar `FILM_REEL.module/window/stains` como conjunto; no ajustar
coordenadas a ojo. `reelGeometry()` calcula porcentajes de todo el módulo.

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
