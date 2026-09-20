# JIA-2026-09-20-45 — Informe de fase

**Prompt:** `docs/prompts/JIA-2026-09-20-45-jornadas-foto-de-los-dos-jinetes-banda-mas-baja-y-rotulo-de-tiza-en-la-pizarra.md`
**Fecha de ejecución:** 2026-09-20 · **Nivel:** LEVEL 2 · **Agente:** Claude Code (Opus 5)
**tmp/scratch:** usado — `tmp/checkpoint.md`; evidencia en `evidence/`.
**Fase:** única (el prompt no define fases; su cierre es el cierre de la fase).

## Resumen

Cinco encargos, todos en la capa de presentación y de contenido. Ninguno toca datos, API, permisos ni build.

### 1. La fotografía de «Las jornadas»

La banda pasa del jinete solo a los **dos jinetes sobre el valle** (`jornadas-jinete-niña.png`, 1983 × 793,
RMSE 0 contra el adjunto del promotor). Entra por la vía de contenido de siempre: original intacto en `assets/`,
derivados WebP desde `scripts/build-assets.sh` (`jinete-nina-960.webp`, `jinete-nina-1983.webp`) y entrada nueva
`jornadas-jinete-nina` en `lib/content/media.ts`. El jinete anterior se queda con su entrada y sus derivados, sin
uso, como ya se hizo con los dos heros anteriores.

El hueco de la foto es mucho más vertical que el encuadre, así que sólo se ve una franja de su ancho. **Punto
focal elegido midiendo**, no a ojo: el grupo —de la cola del caballo al hocico— ocupa de **13,5 % a 33 %** del
ancho del original, y con `focal: { x: 16, y: 50 }` la franja visible es:

| Ventana | Franja visible de la imagen | ¿Grupo entero dentro? |
|---|---|---|
| 1920 × 1080 | 8,3 % → 56,3 % | sí |
| 1440 × 900 | 10,3 % → 45,8 % | sí |
| 1024 × 900 | 10,6 % → 44,4 % | sí |
| 900 × 1080 (el caso más estrecho) | 11,7 % → 38,4 % | sí |
| 390 × 844 | 5,8 % → 69,6 % | sí |

De paso, `Jornadas.tsx` deja de pasar un `ratio={1916 / 821}` escrito a mano que el CSS anulaba en las dos
disposiciones — la misma mentira que `JIA-2026-09-20-44` retiró del hero.

Evidencia: `evidence/banda-1440.webp`, `banda-900.webp`, `banda-390.webp`.

### 2. La vertical de la banda

El promotor autorizó gastar dos tramos. Medido en el navegador **antes y después**:

| Tramo | Regla | Antes (1440 px) | Después (1440 px) |
|---|---|---|---|
| Aire superior | `padding-top` de `.jornadasMapa` | 56 px | 56 px (sin tocar) |
| Texto | contenido | 428,3 px | 428,3 px (sin tocar) |
| Hueco texto → camino | `gap` de `.jornadasMapa` | 48 px | **23 px** |
| Camino 3D | `aspect-ratio` del layout | 367,1 px | 367,1 px (sin tocar) |
| Fila de controles | `margin-bottom` de `.route` | 36 px | 36 px (**revertido**, ver abajo) |
| Aire inferior | `padding-bottom` de `.jornadasMapa` | 80 px | **40 px** |
| **Altura de `.band`** | | **1015,4 px** | **950,5 px** (−64,9 px, −6,4 %) |

A 1920 px la banda queda en **935,5 px**; a 900 px y a 390 px el recorte también se aplica (los `clamp` bajan de
`1,75rem`/`3rem` a `0,875rem`/`1,5rem` como mínimos).

**La fila de controles se intentó recortar y se dejó como estaba.** El prompt fijaba el límite por delante: si al
medir la fila se quedaba corta, se volvía a `2,25rem`. Medido: el botón de repetir mide **33,2 px** (icono de
22 px más `0,35rem` de `padding` a cada lado), así que `1,75rem` (28 px) no lo contiene. Se revirtió y el
comentario del CSS ahora lleva la medida delante, para que nadie repita el intento. Ese tramo es un control, no
aire.

### 3. El rótulo de tiza en la pizarra del aula

«Jornadas de Innovación de Almería» aparece **escrito a mano con tiza** en la pizarra del fondo de la fotografía
de «Ideas que ya han pasado por el aula».

- **La imagen no se retoca**: es texto del sitio dibujado encima. El original sigue intacto y el rótulo sale de la
  capa de constantes (`copy.experiencias.board`, tres líneas, porque el hueco libre de pizarra mide 185 × 130 px
  del original).
- **Cae siempre sobre la pizarra** gracias a una caja de referencia que reproduce el rectángulo en el que la foto
  se dibuja de verdad: altura completa, su propio ratio y pegada a la izquierda, que es como `object-fit: cover`
  resuelve esta imagen en las dos disposiciones de la sección. Dentro de ella los porcentajes son porcentajes **de
  la imagen** y el cuerpo va en `cqw`, así que el rótulo escala con la foto y no con la ventana.

  Comprobado: la caja coincide con la imagen dibujada dentro de una décima de píxel (1920 → 1920,0; 1440 →
  1440,7 vs 1440,7; 1100 → 1608,9 vs 1609,0; 390 → 570,4 vs 571,2) y **las tres líneas caen en los mismos píxeles
  de la imagen a todas las anchuras**: x 54 → 213, y 149 → 242, dentro de la pizarra (x 42 → 232, y 135 → 255) y
  sin llegar al hombro de la maestra.
- **Aspecto**: Homemade Apple (`--f-script`), inclinación de −1,1°, `blur` de 0,12 % del ancho de la foto (≈ 2,3 px
  a 1920) para compartir el desenfoque del fondo, y color `--jia-chalk` (`#d7c9b2`) al 55 % de opacidad — un token
  nuevo de la paleta, muestreado entre el `#3C3024` de la pizarra y el crema de la pared.
- **Decorativo**: vive bajo el `aria-hidden` del fondo. El nombre ya está en el `<title>`, en el `h1` y en el sello.
- La fuente manuscrita había quedado **sin ningún uso** al retirarse la nota del hero en `JIA-2026-09-20-44`; su
  rol declarado en `media.ts` y el comentario de `app/layout.tsx` se han puesto al día.
- De paso, `--aula-ratio` pasa de `1916 / 821` a `1919 / 820`, el ratio real de la imagen: era una copia desfasada
  que estiraba la sección un 0,3 % y recortaba la foto de lado.

Evidencia: `evidence/pizarra-1920.webp` (a tamaño real) y `evidence/pizarra-medida-1920.webp` (con la retícula de
coordenadas del original encima).

### 4. El texto de «Tu propuesta JIA» (añadido a mitad de ejecución)

Sustitución literal de los dos párrafos. Siguen siendo dos, así que la flecha dibujada que `Proposals.tsx`
engancha al final del último sigue apuntando al botón; ahora el texto lo dice además en voz alta («al pulsar aquí
abajo»). Título, subtítulo, acción y componente sin tocar.

Evidencia: `evidence/propuestas-1440.webp`.

### 5. «Quiénes somos» en el menú (añadido a mitad de ejecución)

La sección de socios se renombra a **«Quiénes somos»** y entra en el menú con ese nombre, la última, porque es la
última sección de la página. El menú se arma desde `navStructure` y el rótulo sale del diccionario, así que basta
una `key` nueva; el ancla la declara la propia sección y la columna de secciones del pie, derivada de los mismos
items, lo recoge sola.

El nombre se guarda acentuado y en caja natural; el menú y el título lo suben a versales por CSS. Comprobado en el
navegador: el enlace apunta a `#socios`, cabe en la barra horizontal a 1440, 1100, 1024 y 960 px (por debajo de
900 px manda el panel del teléfono) y aparece tanto en ese panel como en el pie.

Evidencia: `evidence/menu-1440.webp`, `menu-390.webp`, `quienes-somos-1440.webp`.

## Verificación

| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — `ok (6 workshops, 38 people, 2 experiences, 0 resources, 60 media)` |
| `npx next build` | verde — 4 páginas estáticas |
| `npm run assets` | ejecutado; `done: 127 files, 53M` |
| Banda medida antes/después | 1015,4 → 950,5 px a 1440 px; 935,5 px a 1920 px |
| Encuadre de la foto | grupo entero dentro a 1920, 1440, 1024, 900 y 390 px |
| Rótulo de tiza | mismos píxeles de imagen a 1920, 1440, 1280, 1100 y 390 px |
| Menú | rótulo nuevo a 1440, 1100, 1024, 960 px, panel de teléfono y pie |

## Análisis de riesgo (estado posterior al cambio)

### Críticos

**Ninguno nuevo.** No hay superficie de datos, autenticación, permisos ni despliegue en este cambio: todo es
presentación y texto estático, prerenderizado. Se buscaron explícitamente: regresión de contenido (cubierta por
`check:content`, que valida que cada medio registrado exista en disco), pérdida del original (no se sobrescribe ni
se renombra ninguno) y ruptura de tipos (`tsc` en verde con el campo nuevo del diccionario).

### Severos

**Ninguno nuevo.**

### Moderados

| # | Riesgo | Estado | Solución propuesta | Destino |
|---|---|---|---|---|
| M1 | **El rótulo de tiza está anclado a una fotografía concreta.** Las coordenadas (x 2,4 %, y 18,4 %, ancho 9,2 %) son las de `aula-maestra3.png`. Si el promotor cambia esa foto —ya ha cambiado dos veces—, el rótulo caerá fuera de la pizarra sin que ningún check lo detecte. | Documentado en el CSS con las medidas del original delante. | Cuando llegue la siguiente versión del aula, volver a medir la pizarra antes de publicar. Si la foto del aula se cambia a menudo, convertir la caja en cuatro variables CSS junto al `mediaId`, para que se ajuste sin tocar la hoja de estilos. | Fase futura / al cambiar la foto |
| M2 | **El anillo de foco del botón de repetir del camino 3D se sale de su fila.** El botón mide 33,2 px y su `outline` está a 3 px de distancia: necesita 43,2 px y la fila reserva 36. **Es anterior a este prompt** (la fila siempre midió `2,25rem`), pero el cambio lo acerca: el aire inferior de la banda, que es donde ese anillo se desborda, ha pasado de 80 px a 40 px. Sigue sobrando margen (40 px > 7,2 px) y `.band` recorta con `overflow: clip`, así que hoy no se ve cortado en ninguna anchura revisada. | Verificado: no se corta a 1920, 1440, 900 ni 390 px. | Darle a `.controls` la altura real del botón más su anillo (`2,75rem`) o acercar el `outline-offset` a 2 px. Es un arreglo de un minuto, pero cambia una medida de accesibilidad y merece su propio cambio, no una esquina de éste. | Fase futura |
| M3 | **A 390 px el rótulo de tiza es un trazo ilegible.** El cuerpo escala con la foto (7,3 px a esa anchura), que es lo correcto —forma parte de la imagen—, pero no se lee. | Revisado en el navegador: parece escritura a tiza en la pizarra, no un defecto. | Ninguna acción. Si el promotor lo quiere legible en el teléfono, la salida no es agrandar la letra (se saldría de la pizarra) sino recortar la foto hacia la pizarra por debajo de cierta anchura. | Decisión del promotor |
| M4 | **La entrada `jornadas-jinete` y sus derivados siguen en el repositorio sin uso**, como ya ocurre con `hero-1`, `hero-2` y los dos originales anteriores del aula. Es la convención de la casa (los originales no se borran), pero el registro de medios y `public/` crecen con material muerto: 60 medios registrados, de los cuales varios no los pinta nadie. | Consciente y deliberado. | Una limpieza única, en su propio prompt, que liste qué medios no referencia ningún `mediaId` y decida con el promotor cuáles se retiran de `public/` conservando el original en `assets/`. | Fase futura |

### Observaciones sin riesgo

- El único cambio de comportamiento fuera de lo pedido es `--aula-ratio` (0,3 % de altura de la sección de
  Experiencias). Era necesario para que la caja de referencia del rótulo coincidiera con la imagen, y corrige un
  valor que estaba mal.
- El velo de la banda, el sello, el camino 3D y sus rótulos de parada no se han tocado; el camino sigue animando
  (estado `playing` verificado en el navegador).

## Cierre

Commits de implementación:

- `d485d77` — la banda pasa a los dos jinetes
- `969d706` — la banda cierra antes
- `a138b13` — el rótulo de tiza en la pizarra
- `f07b56c` — texto nuevo de «Tu propuesta JIA»
- `6dd2fd0` — «Quiénes somos» en el menú y en su sección

Este informe se commitea aparte, con el resumen y el análisis de riesgo íntegros en la descripción (práctica 14).
Push por `sds-dev-governance/scripts/git-safe-push.sh origin main`.
