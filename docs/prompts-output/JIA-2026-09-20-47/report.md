# JIA-2026-09-20-47 — Informe de fase

**Prompt:** `docs/prompts/JIA-2026-09-20-47-propuestas-rectangulo-solido-sin-degradado-y-a-la-altura-de-experiencias.md`
**Fecha de ejecución:** 2026-09-20 · **Nivel:** LEVEL 2 · **Agente:** Claude Code (Opus 5)
**Estado:** IMPLEMENTADO
**tmp/scratch:** `N/A` — un encargo, una pasada, sin estado parcial que reanudar. Evidencia en `evidence/`.
**Fase:** única (el prompt no define fases; su cierre es el cierre de la fase).

## Resumen

Un encargo en la composición de «Tu propuesta JIA»: fuera el degradado horizontal, vuelven las dos mitades
limpias, y la banda crece hasta medir lo mismo que la de arriba. Ninguna superficie de datos, API, permisos ni
despliegue.

### 1. Fuera la máscara

Se retira la `mask-image` que introdujo `JIA-2026-09-20-46`, en escritorio y en móvil. La fotografía recupera su
borde recto contra el bloque de la izquierda, medido en el **47 %** exacto de la banda a 1920, 1440, 1280, 1024 y
900 px.

El «rectángulo de color sólido» que pedía el promotor **ya existía**: es el fondo de la sección bajo el título,
los párrafos y el botón. No había que inventarlo, y tampoco aplanarlo: sigue siendo `--jia-bg-deep`, un degradado
vertical, porque la sección de arriba funde el suelo de su fotografía justo contra el color de su borde superior
(`Experiences.module.css`, `.photo::after`). Un color plano habría roto esa costura.

### 2. La altura de la banda de arriba

De 1280 px en adelante las dos secciones miden lo mismo. Medido en el navegador:

| Ventana | «Ideas que ya han pasado por el aula» | «Tu propuesta JIA» antes | ahora |
|---|---|---|---|
| 1920 | 820 | 469 | **820** |
| 1440 | 615 | 469 | **615** |
| 1280 | 547 | 469 | **547** |
| 1024 | 1476 | 483 | 483 |
| 900 | 1326 | 452 | 452 |

Por debajo de 1280 px esa sección es una banda de foto sobre una pila de fichas, de 1326 a 1476 px: su altura no
significa nada aquí, así que ésta conserva la que le pide su texto.

La proporción `1919 / 820` sale de `Experiences.module.css` y pasa a ser `--jia-band-aula-ratio` en
`app/globals.css`, que leen las dos secciones. Si un día cambia la fotografía del aula, las dos bandas siguen
midiendo lo mismo sin que nadie tenga que acordarse de la segunda.

### 3. Dos detalles de composición que no eran gratis

- **La columna de texto no se estira.** La rejilla del `split` tiene dos filas, cabecera y contenido. Al darle un
  suelo a la sección, esas filas se repartían el aire nuevo y el título se separaba de los párrafos. El `split`
  gana por eso un suelo opcional, `--split-min`, acompañado de `align-content: center`: las filas conservan el
  tamaño de su contenido y el bloque entero se centra en la banda.
- **La foto se ancla a la banda, no a la rejilla.** Es la trampa que costó una medición: un elemento posicionado
  en absoluto que además es ítem de rejilla **toma su área de rejilla como bloque contenedor**, no el bloque
  padre. Anclada al `split` daba 539 × 469 px en el 71,9 % de la banda; anclada a la sección da 1018 × 820 px en
  el 47 %. Es el mismo recurso que usa la fotografía del hero.

### 4. El encuadre, que es la consecuencia a medir

A esa altura la columna de la foto tiene una proporción **constante**, `0,53 × 1919 / 820 = 1,240`, en todo el
tramo de 1280 px en adelante. Como la imagen es 1,777, `object-fit: cover` resuelve **por altura**:

- **no se recorta nada por arriba ni por abajo** en ninguna anchura medida, lo que cierra el riesgo M2 del
  informe anterior (el sombrero del sheriff);
- se ve el **69,7 % del ancho**, siempre el mismo.

El punto focal horizontal pasa de 50 a **78**, y con él la ventana visible queda así:

| Ventana | Caja de la foto | Ventana sobre la imagen |
|---|---|---|
| 1920 | 1018 × 820 (1,240) | 23,6 % – 93,3 % |
| 1440 | 763 × 615 (1,240) | 23,6 % – 93,3 % |
| 1280 | 678 × 547 (1,240) | 23,6 % – 93,3 % |
| 1024 | 543 × 483 (1,124) | 28,7 % – 91,9 % |
| 900 | 477 × 452 (1,055) | 31,7 % – 91,1 % |
| 390 | 390 × 219 (1,777) | 0 % – 100 % |

La maestra de la izquierda del todo (9–24 % del ancho) queda fuera del encuadre, y el tocado del jefe indio
arranca justo en el borde. En el teléfono la foto se sigue viendo entera bajo el texto.

## Ficheros

| Acción | Fichero |
|---|---|
| Modificado | `app/globals.css` (token `--jia-band-aula-ratio`) |
| Modificado | `components/site/Experiences.module.css` (consume el token) |
| Modificado | `components/site/Section.module.css` (suelo opcional del `split`) |
| Modificado | `components/site/Proposals.tsx`, `components/site/Proposals.module.css` |
| Modificado | `lib/content/media.ts` (punto focal 50 → 78) |
| Creado | este informe y `evidence/` |

## Verificación

`Verification: V2 | tsc + check:content + next build + alturas y encuadre medidos en 6 anchuras + captura de la sección vecina | PASS`

`Delta`: el token `--jia-band-aula-ratio` y el suelo del `split` son superficie compartida, no hoja de un solo
componente, así que el alcance sube de V1 a V2 y alcanza a sus dos consumidores.
`Paths`: (1) `--aula-ratio` de «Experiencias» pasa a leer el token compartido, y de él dependen la altura de esa
banda **y** las coordenadas del rótulo de tiza sobre la pizarra; verificado que sigue midiendo 820 px a 1920 px y
que el rótulo sigue sobre la pizarra (`evidence/experiencias-1920-sin-regresion.webp`). (2) `.split` es del
componente `Section`, compartido: `grep` de `layout="split"` devuelve un solo consumidor, `Proposals.tsx`, y el
suelo nuevo tiene valor por defecto `auto`, así que un `split` que no lo pida no cambia. El proyecto no tiene
suite de tests automatizados: esa modalidad es `N/A` (no se instala ninguna para este cambio).

| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — `ok (6 workshops, 38 people, 2 experiences, 0 resources, 61 media)` |
| `npx next build` | verde — 4 páginas estáticas |
| Alturas coincidentes | 820, 615 y 547 px a 1920, 1440 y 1280 px |
| Borde del bloque sólido | 47,0 % de la banda a 1920, 1440, 1280, 1024 y 900 px |
| Máscara | `mask-image: none` en las seis anchuras medidas |
| Recorte vertical | 0 % arriba y abajo en las seis anchuras |
| Capturas | 1920, 1440, 1280, 1024, 900 y 390 px, más «Experiencias» a 1920, en `evidence/` |

## Análisis de riesgo (estado posterior al cambio)

### Críticos

**Ninguno nuevo.** No hay superficie de datos, autenticación, permisos, secretos ni despliegue: todo es
presentación estática, prerenderizada. Se buscaron explícitamente: regresión de la sección vecina al mover su
proporción a un token compartido (verificada su altura y su rótulo de tiza), regresión del componente `Section`
para otros consumidores (`layout="split"` tiene uno solo, y el suelo nuevo es opcional con defecto `auto`), y
pérdida de encuadre por el punto focal nuevo (medido en seis anchuras, no estimado).

### Severos

**Ninguno nuevo.** Se cierra, además, el **M2 del informe anterior**: la caja ya no es más apaisada que la imagen
en ninguna anchura, así que el sombrero del sheriff no puede recortarse por arriba a ninguna resolución.

### Moderados

| # | Riesgo | Estado | Solución propuesta | Destino |
|---|---|---|---|---|
| M1 | **Las dos bandas están atadas por un token, y esa atadura es silenciosa.** `--jia-band-aula-ratio` es la proporción de la fotografía del aula: gobierna la altura de «Experiencias», las coordenadas del rótulo de tiza **y ahora la altura de «Propuestas»**. Cambiar la foto del aula mueve las tres cosas a la vez y ningún check lo detecta. | Es el efecto buscado para las alturas, y está documentado en los tres sitios. El rótulo de tiza ya arrastraba este riesgo (M1 del informe de `JIA-2026-09-20-45`). | Al sustituir la fotografía del aula, revisar de una vez las tres: altura de las dos bandas y caja del rótulo. | Al cambiar la foto del aula |
| M2 | **El encuadre depende ahora sólo del punto focal, sin nada que lo suavice.** Con la máscara, un focal mal puesto se notaba poco; con el borde recto, dos puntos de más dejan a la maestra asomando por el canto o le cortan el tocado al jefe indio. El margen real es estrecho: la ventana empieza en el 23,6 % y su tocado en el 24 %. | Medido en seis anchuras. Documentado en la entrada del medio con el número delante. | Si se cambia la foto de esta columna, medir el focal antes de publicar. Un recorte propio en `build-assets.sh` sería la salida si alguna foto futura no admitiera un focal único. | Al cambiar la foto |
| M3 | **Por debajo de 1280 px la banda deja de coincidir con la de arriba**, porque allí esa sección es otra cosa. El salto de altura en el propio umbral es visible si se redimensiona la ventana: 469 px a 1279 y 547 px a 1280. | Deliberado: es donde la regla de «Experiencias» existe. | Ninguna acción propuesta. Si molestara, se puede interpolar el suelo con un `clamp()` entre 900 y 1280 px, a cambio de que las alturas dejen de ser exactamente iguales en el tramo alto. | Decisión del promotor |
| M4 | **La columna de texto queda con mucho aire a 1920 px:** el bloque mide unos 340 px dentro de una banda de 820. Es la consecuencia directa de lo pedido, y centrado se sostiene, pero es una composición distinta de la que había. | Revisado en las capturas: el bloque cae centrado en la banda. | Si el promotor la ve vacía, las salidas son subir el cuerpo de la sección o dejar el suelo en un valor intermedio. Ambas son un ajuste de una línea. | Decisión del promotor |
| M5 | **`propuestas-camara` sigue registrada sin uso**, con `hero-1`, `hero-2`, `jornadas-jinete` y los originales anteriores del aula. | Consciente. Es el M4 del informe anterior, sin cambios. | La misma limpieza única ya propuesta. | Fase futura |

### Observaciones sin riesgo

- El riesgo M3 del informe anterior (dependencia de `mask-image`, sin verificar en WebKit ni Firefox) **desaparece**:
  ya no hay máscara en esta sección. Las otras tres del sitio siguen ahí y siguen pendientes de ese repaso.
- A 900 px el tocado del jefe indio se corta por la izquierda —la ventana empieza en el 31,7 %— pero su cara
  entra entera. Revisado en la captura: se lee como un encuadre cerrado, no como un fallo.
- El resto de la sección —título, subtítulo, los dos párrafos, la flecha dibujada y el botón— no se ha tocado.

## Siguiente paso

Ninguno obligatorio. Quedan dos decisiones del promotor: el salto de altura en el umbral de 1280 px (M3) y el aire
de la columna de texto a 1920 px (M4).

## Cierre

Commits de implementación:

- `574e4eb` — dos mitades limpias y la banda a la altura de «Experiencias»

Este informe se commitea aparte, con el resumen y el análisis de riesgo íntegros en la descripción (práctica 14).
Push por `sds-dev-governance/scripts/git-safe-push.sh origin main`.
