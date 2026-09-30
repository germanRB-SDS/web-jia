# Stack, librerías y propietarios

Fuente: [package.json](../project-skeleton/reference/package.json),
[lockfile](../project-skeleton/reference/package-lock.json),
[layout](../project-skeleton/reference/app/layout.tsx) y [config](../project-skeleton/reference/next.config.ts).

| Tecnología | Revisión de referencia | Uso |
|---|---|---|
| Node | 24.19.0 comprobado; .nvmrc añadido al snapshot | Build/desarrollo, no necesario para servir out. |
| Next.js | 16.3.4 | App Router, static export; imágenes prederivadas. |
| React / React DOM | 19.2.8 | Componentes SSR y wrappers cliente. |
| TypeScript | 5.9.3 resuelto en lock | Modelos/tipos, strict y alias `@/*`. |
| GSAP | 3.15.0 resuelto en lock | Animación/Draggable de cubo, transformaciones e interacciones. |
| Three.js | 0.186.0 resuelto en lock | Carruaje, luz y herradura; loader GLTF. |
| CSS Modules + CSS variables | Sin framework de estilos adicional | Aislamiento local, tokens y media queries. |
| Blender | Fuentes/generadores conservados; versión de entorno no fijada por package.json | Edición/export de carruaje/herradura; no requerido por build de web. |
| Fuentes | Alegreya, Rokkitt, Barlow Semi Condensed, Homemade Apple | next/font/google las descarga en build y las sirve localmente. |

Las versiones con rangos en package.json se fijan mediante package-lock. Copiar ambos y usar npm ci.
No hay CMS, DB ni backend en este modelo. Las acciones externas son enlaces, no endpoints internos.

## Ownership de configuración

| Información | Archivo/carpeta en reference |
|---|---|
| Entrada de negocio | `lib/content/index.ts` agrega site/event/datos/modelos. |
| Ensamblaje | `lib/content/assemble.ts`: resuelve relaciones + diccionario + media a props. |
| Entidades | `lib/content/data/`: programa, talleres, experiencias, personas, organizaciones y recursos. |
| Secciones | `lib/content/sections/`: configuración por módulo, incluidas geometría/medios del bloque. |
| Textos visibles y aria | `lib/content/copy/types.ts`, `copy/es/` y dictionaries. |
| Idiomas | `lib/content/languages/`; DEFAULT_LOCALE resuelto una vez en Home. |
| Fotos/logos/medios | `lib/content/media.ts`; srcSet, ratio, focal, origen y licencia. |
| Colores | `app/theme/palette.css`; tipografía/espacio en globals.css. |
| Parámetros de motores | config.ts de cada componente; no mezclar títulos/datos de negocio ahí. |
| Movimiento | `lib/motion/policy.ts`, config y hook; HTML data-motion y wrappers. |

## i18n real y adaptación

Solo ES está registrado. No hay selector de idioma mientras haya uno. Los diccionarios tipados
permiten añadir idiomas, pero eso no prueba que rutas SEO multilingües existan. Añadir un idioma
requiere language-xx, diccionario, registros en languages y dictionaries y validación de todas
las claves. Resolver además rutas, lang, metadata/OpenGraph, fechas, labels, alt y navegación.
No traducir IDs técnicos ni nombres propios arbitrariamente.

`check:content` verifica relaciones, ids, media files y copy; el snapshot trae archivos que satisfacen
el registro, incluidos algunos recursos históricos. Eliminar un bloque no permite borrar sus datos
sin revisar referencias del ensamblador y los checks.

## Motion del origen

JIA mantiene política central, aceptación y excepciones Apple en su configuración. No es un
requisito de este estilo. En otro proyecto usar una sola política conforme a sus necesidades,
respetando prefers-reduced-motion, sin reiniciar toda la landing. Los recursos portables ya usan
un soporte neutral basado en el sistema. No afirmar que el vídeo reacciona dinámicamente a cualquier
cambio de policy sin verificar sus listeners; comprobar cada motor por separado.
