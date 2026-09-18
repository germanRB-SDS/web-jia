# JIA-2026-09-18-01 — Primera landing funcional de las JIA

**Fecha:** 2026-09-18 · **Repo:** `web-jia` (`https://github.com/germanRB-SDS/web-jia`) · **Agente:** Claude Code (Fable 5.1) con la skill Impeccable.
**Encargo:** aterrizar `assets/requirements/JIA-boceto-requisitos-y-metaprompt.md` con los assets reales y construir una primera landing funcional.

## 1. Resumen

Se ha construido una landing estática (Next.js 16, exportación HTML) con las cinco áreas del boceto
(Jornadas → Dosieres → Experiencias → Propuestas → Acoge JIA), hero real con la fotografía
suministrada y composición del render, seis talleres con sus carteles y fichas, programa de dos
jornadas con los datos del cartel, equipo con sus tarjetas, y estados honestos para dosieres,
experiencias y acciones sin URL. Todo el contenido, la paleta, las etiquetas de botón, los medios y
los enlaces viven en `lib/content/` y `app/theme/palette.css`; los componentes no contienen textos.
El repositorio se ha inicializado y sincronizado con GitHub. El servidor local queda corriendo.

## 2. Inspección de assets (rutas reales)

| Referencia del briefing | Ruta real | Observación |
|---|---|---|
| Carpeta «ZEP» | `assets/cep/` | Se llama `cep`, en minúsculas. No se renombra. |
| Logo y variantes | `assets/cep/logo-variantes/#jIA26 LOGO.png` (1080², **con alfa**), `1.png`, `2.png`, `3.png` (sin alfa) | Distintivo redondo #JIA26 con cámaras y cactus. Se usa el que tiene alfa. |
| Cartel del evento | `assets/cep/CARTEL #JIA26 (9).png` (2268×3440) | Fechas, lugares, horarios, «Organiza» y «Colabora». |
| Carteles de talleres | `assets/cep/talleres-carteles/1…9.png` (1414×2000) | 9 carteles → **6 talleres** y 9 personas (leídos, no deducidos). |
| Fuentes | `assets/fonts/` | **Vacía.** No se entregó ninguna fuente western. |
| Fotos de participantes | `assets/images-staff/` (31 PNG, 1414×2000) | Tarjetas «WANTED» con nombre y rol (Asesor/a CEP, Coordinación, Tallerista, Colaborador/a). |
| Render | `assets/images-website/JIA-render-base.png` (1672×941) | El MD de identidad lo cita como `jia_almería_siempre_inspira.png`; es el mismo concepto con otro nombre. |
| Hero | `assets/images-website/hero-almeria-docentes.png` y `hero-2-almeria-docentes.png` (1672×941) | Dos encuadres. Se integra `hero-1` (luz más parecida al render); `hero-2` queda registrado como alternativa. Ambos llevan texto horneado (mochila, señales). |
| Identidad | `assets/style/JIA_IDENTIDAD_VISUAL.md` | Leído completo: paleta HEX, tipografía por niveles, lettering, iconos, fotografía, tokens CSS. |
| (nuevo durante la sesión) | `assets/images-website/hero-3.png` (1554×508, añadido el 18-09 a las 08:40) | Segundo render de presentación en formato banner, con interfaz, textos y botones horneados. Se trata como **referencia de estilo**, no como asset publicable (identidad §8.8). Sus frases («Ideas sin fronteras…», «Próximamente», «La educación también deja huella») no se incorporan como contenido oficial. |

Inventario operativo implementado como código: `lib/content/media.ts` (registro de medios con origen
y licencia), `lib/content/data/people.ts`, `workshops.ts`, `program.ts`, `organizations.ts` (cada
entrada con `provenance` y `status`). No hay documentación duplicada que mantener a mano.

### Datos extraídos de los carteles

- Talleres: «Por un puñado de bloques» (Animación con Scratch · Manuel Salmerón Águila);
  «Dos renders y un destino» (Creación y edición de vídeos con Canva · Christian Padial Barcina,
  Francisco J. Bello Plaza — el cartel imprime «FRRANCISCO», se asume errata); «El bueno, el feo… y el
  plano» (Del aula a la gran pantalla: crea un cortometraje desde 0 · Ismael Navarro Membrilla, Araceli
  Merino Chacón); «Siete legos para siete planos» (Stop motion · Inmaculada Contreras Sedes); «La profe
  que pintó a Liberty Valance» (Álbum ilustrado de película · Ámina Pallarés Calvi); «La muerte tenía un
  micro» (Radio/Podcast · Mariola Martín Sáez, José Carlos Hernández Jiménez).
- Programa: 16/10/26 Conservatorio de Danza Kina Jiménez (16:30–20:30); 17/10/26 CEIP Freinet
  (9:30–14:30 y 16:30–20:30). Marcado **provisional** hasta confirmación oficial.
- Organiza: Junta de Andalucía · Consejería de Educación; CEP de Almería, CEP de El Ejido, CEP de Cuevas
  Olula. Colabora: Minihollywood Oasys, Leonardo Atrezzo, Kichi García Films, La Gata Púrpura. Solo texto
  (los logotipos no se entregaron como archivos separados).
- Asociaciones tarjeta ↔ tallerista por coincidencia de nombre y rol (marcadas provisionales):
  tarjeta 31 «Inma Contreras · Tallerista» ↔ Inmaculada Contreras Sedes; tarjeta 37 «Ámina Pallarés ·
  Tallerista» ↔ Ámina Pallarés Calvi. Ninguna otra persona se ha asociado a un taller.
- Los textos «REWARD» de las tarjetas son humor de campaña: se conservan en la imagen, no se transcriben como datos.

## 3. Contradicciones y decisiones registradas

| Tema | Fuentes en conflicto | Decisión (reversible) |
|---|---|---|
| Título de la edición | Briefing (17-09): «Aula de cine: El reto». Cartel y 9 carteles (15-09): «Almería, aulas de cine: El duelo». | Se muestra el del briefing (declaración posterior y explícita del promotor), marcado provisional; el otro queda en `lib/content/site.ts → edition.titleAlternates`. Aviso visible en el pie mientras `markProvisional` esté activo. |
| Fechas | Briefing: solo «sábado 17 de octubre» para talleres. Cartel: dos fechas completas. | Se usan las del cartel con procedencia registrada y marca provisional; poner `date: null` vuelve a «Jornada N» sin valor. |
| Fuentes tipográficas | Identidad: no identifica fuente; `assets/fonts/` vacía. | Cuatro familias OFL autoalojadas (Rokkitt, Alegreya, Barlow Semi Condensed, Homemade Apple). Sustituibles en `app/layout.tsx`. |
| Lettering JIA | Identidad: archivo maestro pendiente. | Vector provisional trazado del render (`public/brand/jia-wordmark-derived.svg`), con nota de origen dentro del SVG. |
| Denominación CEP | Render: «CEP Centro de Educación del Profesorado». Identidad §2: «Centro del Profesorado de Almería». | Se usa la denominación de la identidad. El símbolo del libro del render no se reproduce. |
| Tarjetas «WANTED» | Identidad §3.3: evitar carteles de «se busca» como lenguaje. | Las tarjetas se muestran como **contenido** (assets oficiales del equipo), no como lenguaje de la interfaz. Decisión revisable. |
| Cuatro bloques del render (Qué es JIA…) | Identidad §11.3 los propone; el boceto pide evitar redundancias. | Se convierten en cuatro atajos funcionales bajo el hero (Programa, Talleres, Experiencias, Dosieres) con los cuatro iconos de la familia. |

## 4. Síntesis de diseño e información

- **Navegación:** Jornadas (submenú Programa · Cómo funcionan · Talleres) · Dosieres · Experiencias · Propuestas · Acoge JIA. Experiencias en tercera posición. Móvil: botón Menú con panel y submenú abierto.
- **Entidades:** evento/edición, jornada, sesión, taller, persona, experiencia, recurso, organización; relaciones por id en un solo sitio (`data/`), navegación inversa derivada en `assemble.ts`.
- **Acciones:** `Action` con tres estados (ancla, externa, no disponible + mensaje). Sin `href="#"`.
- **Dirección visual (Impeccable):** contrato en `app/layout.tsx` (semilla `0634789a`, forma «cuaderno de campo del docente», candidato 7 de 7 repartido por el dado). Hero con la composición del render; márgenes con cabecera corrida para las tres hojas de Jornadas; carteles «pinchados» con un punto terracota; paleta exacta del MD; grano de papel como capa independiente.
- **Impeccable:** `context.mjs` → PRODUCT.md (init inferido del brief; sustitución de la entrevista declarada) → `concept-seed.mjs --scope surface --mode persuade` → `craft-floor.md` → build → `detect.mjs` (sin hallazgos) → revisor final y documentador ejecutados en subagentes frescos con las referencias `degraded/` (los agentes empaquetados no existen en este harness).

## 5. Mapa de edición

Ver `README.md` («Dónde se edita cada cosa»). Puntos clave: paleta `app/theme/palette.css`; botones
`lib/content/copy/es/buttons.ts`; textos por sección `lib/content/copy/es/sections/*`; medios
`lib/content/media.ts`; URLs de Propuestas y Acoge en `lib/content/sections/propuestas.ts` y `acoge.ts`;
título de edición y marcas provisionales en `lib/content/site.ts`.

## 6. Pendientes

### De la organización (datos y recursos)
1. Confirmar el **título de la edición** («El reto» vs «El duelo»).
2. Confirmar fechas, sedes y horarios del cartel; aportar horas, espacios y sesiones del programa.
3. Descripciones, objetivos, etapas y requisitos de cada taller (hoy resúmenes provisionales derivados del subtítulo y objetivos «pendientes»).
4. Confirmar las dos asociaciones tarjeta ↔ tallerista y la grafía «Francisco J. Bello Plaza».
5. URL del canal de propuestas y URL del formulario de acogida.
6. Dosieres (documentos) y experiencias reales (hoy dos fichas de demostración etiquetadas).
7. Logotipos de organizadores y colaboradores como archivos, y sus URLs.
8. Fuente(s) western con licencia, o aprobación de las cuatro familias OFL elegidas.
9. Archivo maestro vectorial del lettering JIA y SVG definitivos de los iconos.
10. Fotografía del hero sin texto horneado y sin la funda de la cadera (identidad §3.3, §8.8); versión móvil recompuesta.
11. Decidir si se publican las tarjetas «WANTED» y sus textos humorísticos.
12. Datos de contacto y textos legales del pie.

### Técnicos
- Antes de publicar: `site.preview.markProvisional = false` solo tras validar cada elemento marcado.
- Segundo idioma: añadir segmento `[lang]` (documentado en README).
- Estrategia PDF preparada en el modelo (`sheet.kind = "pdf"`), **no verificada** con documentos reales.

## 7. Verificación

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | OK (0 errores) |
| `npm run check:content` | OK: 6 talleres, 38 personas, 2 experiencias demo, 0 recursos, 44 medios; todas las referencias e imágenes resuelven; sin `href="#"` |
| `npm run build` | OK, exportación estática en `out/`; el contrato de dirección aparece en `out/index.html` |
| `detect.mjs --json app components` (Impeccable) | Sin hallazgos |
| Capturas (Chrome headless + arnés iframe `scripts/qa/shot.html`) | 1440 (hero, página completa, ficha abierta, pie), 768 (completa), 390 (hero, completa, menú abierto, ficha abierta), 360 (completa). Evidencia en `evidence/`. |
| Desbordamiento horizontal a 390 px | `scrollWidth = clientWidth = 390` (medido en iframe) |
| Quitar una imagen (fallback) | Ejecutado: taller sin `posterMediaIds` → `media: null`, superficie `sand`, sin imagen rota. |
| Ficha por teclado/toque | Botón «Ver ficha» + `<dialog>` nativo: Escape cierra, foco devuelto al botón (implementado y probado en captura; no probado con lector de pantalla) |
| Colecciones variables (0 / 1 / 7 / 9 talleres) | Ejecutado sobre la capa de ensamblado compilada: 0 → estado pendiente, 1/7/9 → rejilla con N fichas, sin títulos vacíos. Visualmente solo comprobado con los 6 reales (rejilla `auto-fill`). |
| Integración PDF / archivo | **No verificado** (no hay documentos reales). |
| Contraste | Tokens del MD (ratios calculados en la identidad); no medido sobre el resultado final con herramienta. |
| Revisión final Impeccable | Ver §8. |

Limitaciones del entorno: Chrome headless no abre ventanas de menos de ~500 px, por eso las capturas de móvil
se hacen dentro de un iframe del ancho pedido; las imágenes con carga diferida muy abajo en capturas de
página completa pueden no haberse cargado dentro del presupuesto de tiempo.

## 8. Revisión final (Impeccable) y análisis de riesgo

_(se completa al cierre)_
