# WEB-JIA · Jornadas de Innovación de Almería

Landing de las JIA («Aulas de cine: el duelo», edición #JIA26) construida a partir del boceto
`assets/requirements/JIA-boceto-requisitos-y-metaprompt.md` y de la identidad
`assets/style/JIA_IDENTIDAD_VISUAL.md`. Primera aproximación funcional y responsive: sin backend,
sin formularios, sin CMS. Todo el contenido visible se edita desde `lib/content/`.

## Arrancar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # exporta HTML estático a out/
npm run typecheck
npm run check:content   # integridad de ids, medios y acciones
npm run assets          # regenera public/ desde assets/ (necesita ImageMagick)
bash scripts/qa-screenshots.sh   # capturas de revisión en .impeccable/review/ (Chrome + ImageMagick)
```

Stack: Next.js 16 (App Router, React 19, TypeScript, CSS Modules), exportación estática. Sin
dependencias de terceros en runtime. Las fuentes (Rokkitt, Alegreya, Barlow Semi Condensed,
Homemade Apple; licencia OFL) se autoalojan en el build con `next/font`.

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Paleta de marca (única fuente) | `app/theme/palette.css` |
| Tipografías | `app/layout.tsx` (declaración) · `lib/content/media.ts` (`fonts`, registro) |
| Escala tipográfica, espaciados, easing | `app/globals.css` |
| Nombre del evento, hashtag, **título de la edición** (decisión abierta) | `lib/content/site.ts` |
| Marcas «Provisional» visibles (apagar antes de publicar) | `lib/content/site.ts` → `site.preview.markProvisional` |
| Etiquetas de botones | `lib/content/copy/es/buttons.ts` |
| Navegación, accesibilidad, estados, pie | `lib/content/copy/es/common.ts` |
| Textos del hero y atajos | `lib/content/copy/es/sections/hero.ts` |
| Textos de Jornadas (programa, cómo funcionan, equipo, talleres) | `lib/content/copy/es/sections/jornadas.ts` |
| Textos de Dosieres / Experiencias / Propuestas / Acoge | `lib/content/copy/es/sections/*.ts` |
| Descripciones de talleres, fichas de experiencias, dosieres | `lib/content/copy/es/entities.ts` |
| Personas (nombres, roles, tarjeta) | `lib/content/data/people.ts` |
| Talleres (título, responsables, carteles, ficha) | `lib/content/data/workshops.ts` |
| Programa (fechas, lugares, horas, sesiones y sus enlaces) | `lib/content/data/program.ts` |
| Experiencias (casos; hoy dos demostraciones) | `lib/content/data/experiences.ts` |
| Dosieres (documentos; hoy vacío) | `lib/content/data/resources.ts` |
| Organiza / colabora | `lib/content/data/organizations.ts` |
| Registro de imágenes (rutas, tamaños, origen, licencia) | `lib/content/media.ts` |
| Imagen del hero (y alternativa `hero-2`) | `lib/content/sections/hero.ts` |
| Orden y anclas del menú | `lib/content/sections/nav.ts` |
| **URL de «Presentar una propuesta»** | `lib/content/sections/propuestas.ts` → `url` |
| **URL de «Quiero acoger las JIA»** y superficies de color | `lib/content/sections/acoge.ts` |
| Ensamblado de cada sección (textos + acciones + medios + estado) | `lib/content/assemble.ts` |

Reglas: los componentes (`components/`) no contienen textos, URLs ni rutas de imágenes. Un dato
desconocido es `null`, nunca un valor inventado: la interfaz muestra un estado honesto. Una acción
sin URL se pinta como no disponible con su mensaje; al poner la URL se activa sola.

### Añadir un idioma

1. `lib/content/languages/language-<xx>.ts` y registrarlo en `languages/index.ts`.
2. `lib/content/copy/<xx>/…` con la misma forma que `es/` (el tipo `Copy` obliga a completar todo).
3. Registrarlo en `lib/content/copy/dictionaries.ts`.
4. Añadir el segmento de ruta `[lang]` cuando haya más de un idioma (hoy se sirve `/` en español).

### Fichas (talleres y experiencias)

Cada entidad declara `sheet`: `{ kind: "text" }` (contenido estructurado en el diccionario),
`{ kind: "file", url, format }` o `{ kind: "pdf", url, summaryOnly: true }` (resumen en el
diccionario + enlace al original). Con `sheet: null` la tarjeta muestra «Ficha pendiente» y no abre
nada. La ficha se abre por ratón, teclado y toque (botón «Ver ficha» + `<dialog>` nativo).

## Assets

Los originales de `assets/` no se tocan. `scripts/build-assets.sh` deriva los WebP/PNG de `public/`.
`public/brand/jia-wordmark-derived.svg` es un vector **provisional** trazado del render aprobado;
debe sustituirse por el archivo maestro cuando exista (identidad §5.5).

## Pendientes de la organización

Ver `docs/prompts-output/JIA-2026-09-18-01/report.md` (sección «Pendientes»).
