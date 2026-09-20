# JIA-2026-09-20-46 — Informe de fase

**Prompt:** `docs/prompts/JIA-2026-09-20-46-propuestas-la-hoguera-de-los-nuevos-temas-con-el-borde-izquierdo-disuelto.md`
**Fecha de ejecución:** 2026-09-20 · **Nivel:** LEVEL 2 · **Agente:** Claude Code (Opus 5)
**Estado:** IMPLEMENTADO
**tmp/scratch:** `N/A` — un solo encargo, una pasada, sin estado parcial que reanudar. Evidencia en `evidence/`.
**Fase:** única (el prompt no define fases; su cierre es el cierre de la fase).

## Resumen

Un encargo, en la capa de presentación y de contenido: la columna visual de «Tu propuesta JIA» pasa de la cámara
acorazada a la conversación junto al fuego sobre la siguiente temática, y su borde interior deja de estar velado
para estar **disuelto**. Ninguna superficie de datos, API, permisos, build ni despliegue.

### 1. La fotografía

`assets/images-website/hoguera-nuevos-temas.png` (1672 × 941, ratio 1,777) entra por la vía de contenido de
siempre: original intacto, derivados en `scripts/build-assets.sh` → `public/propuestas/hoguera-960.webp` y
`hoguera-1672.webp`, entrada nueva `propuestas-hoguera` en `lib/content/media.ts` y `mediaId` en
`lib/content/sections/propuestas.ts`. Sin recorte al construir: quién se lee y quién no lo decide el degradado.

`propuestas-camara` queda **sin uso**, con su entrada y su derivado en su sitio: los originales no se sobrescriben
ni se borran.

`Proposals.tsx` deja de pasar un `ratio` escrito a mano (`1059 / 755`) y lo toma del medio, como ya hacen `Host`,
`Experiences` y, desde `JIA-2026-09-20-44`, `Hero`. De paso, su `sizes` pasa de `50vw` a `53vw`, que es el ancho
real de la columna.

### 2. El velo pasa a ser una máscara

El `<span>` que pintaba `sand-deep` al 40 % encima de la foto desaparece. En su lugar,
`Proposals.module.css` **quita** la superficie por el borde interior con `mask-image`, de modo que lo que se ve
por debajo es el propio fondo de la sección.

Es lo que hacía falta, y no sólo por elegancia: el fondo de la sección (`--jia-bg-deep`) es un degradado vertical
que va de `mix(sand-deep 72 %, vellum-5)` arriba a `sand-deep` abajo, así que **ningún color plano puede casar con
él a todas las alturas**. Con la máscara no hay color en juego: el `#e3d0b4` que pedía el promotor es, a un punto
por canal, `--jia-sand-deep`, el color al que ese fondo llega, y ahora sale de la paleta solo.

### 3. Los tramos, y por qué se sostienen

Los tramos están escritos en porcentajes de la fotografía:

| Tramo de la foto | Quién está ahí | Opacidad |
|---|---|---|
| 0–12 % | el trípode y el humo | 0 → 0,02 |
| 9–24 % | la maestra de la izquierda del todo | 0,01 → 0,08 |
| 24–53 % | el jefe indio (su cara, 33–45 %) | 0,08 → 1 |
| ≥ 54 % | el micrófono, la entrevistadora y el sheriff | 1 |

El detalle que había que comprobar: **una máscara se mide sobre la caja, no sobre la imagen**, y por encima de
900 px la caja no comparte ratio con la foto, así que `object-fit: cover` se come parte del ancho. Lo que mantiene
las dos escalas juntas es el punto focal horizontal. Medido en el navegador, con el rectángulo realmente dibujado
y no estimado, el punto en que la máscara despeja cae en:

| Ventana | Caja | Despeja en la foto |
|---|---|---|
| 2560 | 1357 × 553 | 54,0 % |
| 1920 | 1018 × 469 | 54,0 % |
| 1440 | 763 × 469 | 53,7 % |
| 1280 | 678 × 469 | 53,3 % |
| 1024 | 543 × 483 | 52,5 % |
| 900 | 477 × 452 | 52,4 % |

Es decir, **1,6 puntos de deriva en todo el rango de escritorio**: el corte cae siempre entre la rodilla del jefe
indio y la mano que sostiene el micrófono, que es lo que pedía el encargo.

El punto focal vertical (40 %) resuelve el otro recorte: donde la caja es mucho más apaisada que la imagen, el alto
sobra. A 1920 px se va el 7,2 % por arriba y el 10,9 % por abajo; el sombrero del sheriff empieza en el 12,5 % del
alto, así que queda dentro, y la hoguera sigue ardiendo en el borde inferior.

### 4. Por debajo de 900 px

Allí la foto va sola bajo el texto, sin nada a su izquierda que proteger: borrarle media imagen no tendría
destinatario. Se le deja sólo el borde interior suavizado (0,35 → 1 en el primer tercio) y el grupo entero se lee.

## Ficheros

| Acción | Fichero |
|---|---|
| Creado | `assets/images-website/hoguera-nuevos-temas.png` (aportado por el promotor, entra al repositorio) |
| Creado | `public/propuestas/hoguera-960.webp`, `public/propuestas/hoguera-1672.webp` |
| Modificado | `scripts/build-assets.sh`, `lib/content/media.ts`, `lib/content/sections/propuestas.ts` |
| Modificado | `components/site/Proposals.tsx`, `components/site/Proposals.module.css` |
| Creado | este informe y `evidence/` |

## Verificación

`Verification: V1 | tsc + check:content + next build + medición y capturas en 6 anchuras | PASS`

Superficie no compartida: `Proposals.module.css` es un CSS Module de un solo componente y `propuestas-hoguera` es
un id nuevo que no referencia nadie más; `grep` de `propuestas-camara`, `visualVeil` y `propuestas-hoguera` en
`app/`, `components/`, `lib/` y `scripts/` no deja ningún consumidor fuera de los ficheros tocados. El proyecto no
tiene suite de tests automatizados, así que esa modalidad es `N/A` (no se instala ninguna para este cambio).

| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — `ok (6 workshops, 38 people, 2 experiences, 0 resources, 61 media)` |
| `npx next build` | verde — 4 páginas estáticas |
| `npm run assets` | ejecutado; `done: 129 files, 54M` |
| Punto de despeje | 52,4 %–54,0 % de la foto a 900, 1024, 1280, 1440, 1920 y 2560 px |
| Recorte vertical | 7,2 % arriba a 1920 px; sombrero del sheriff en el 12,5 %, dentro |
| Capturas | 1920, 1440, 1024 y 390 px, más un zoom al 300 % del borde izquierdo, en `evidence/` |

## Análisis de riesgo (estado posterior al cambio)

### Críticos

**Ninguno nuevo.** No hay superficie de datos, autenticación, permisos, secretos ni despliegue en este cambio:
todo es presentación estática, prerenderizada. Se buscaron explícitamente: regresión de contenido (la cubre
`check:content`, que valida que cada medio registrado exista en disco), pérdida del original (no se sobrescribe ni
se renombra ninguno), ruptura de tipos (`tsc` en verde) y pérdida de la fotografía entera por una máscara mal
puesta (medida en seis anchuras, no estimada).

### Severos

**Ninguno nuevo.**

### Moderados

| # | Riesgo | Estado | Solución propuesta | Destino |
|---|---|---|---|---|
| M1 | **Los tramos de la máscara están atados a la composición de esta fotografía concreta.** «9–24 % es la maestra» y «24–53 % es el jefe indio» son hechos de `hoguera-nuevos-temas.png`. Si el promotor cambia la foto —ya ha cambiado dos veces la del aula y dos la del hero—, el degradado borrará a quien no toca y **ningún check lo detectará**: `check:content` sólo comprueba que el fichero exista. | Documentado en el CSS y en el registro de medios con las medidas delante. | Volver a medir al sustituir la foto. Si la columna cambia de imagen a menudo, mover los tramos a variables CSS declaradas junto al `mediaId`, para ajustarlos sin tocar la hoja de estilos. | Fase futura / al cambiar la foto |
| M2 | **Por encima de ~2700 px de ventana el sombrero del sheriff empieza a recortarse por arriba.** La caja crece en ancho con la ventana pero su alto lo manda la columna de texto, así que cada vez es más apaisada y `cover` se come más alto. Medido: a 2560 px se va el 11 % por arriba y el sombrero empieza en el 12,5 %, con 1,5 puntos de margen; el cruce cae en torno a 2700 px. | Verificado a 2560 px: todavía dentro. Es una propiedad que la sección ya tenía con la cámara acorazada; la foto nueva la hace visible porque ahora hay caras arriba. | Dar a la columna visual un `max-height` o un `aspect-ratio` máximo por encima de cierta anchura, para que deje de estirarse a lo ancho. Es un cambio de composición de la sección, no de esta imagen, y merece su propio encargo. | Fase futura |
| M3 | **La máscara depende de `mask-image`.** Se declara con su pareja `-webkit-mask-image`, que es lo que la casa ya hace en `Hero.module.css`, `SiteFooter.module.css` y `BulletHole.module.css`, así que no introduce una técnica nueva. Pero si un navegador ignorase ambas, la foto se vería **entera y a plena opacidad** contra el texto, no rota. | Verificado en Chromium (el navegador del QA del proyecto). No verificado en WebKit ni Firefox por no haber aquí con qué; el prefijo está puesto. | Comprobar la sección en Safari y Firefox en el próximo repaso de navegadores del proyecto, junto con las otras tres máscaras que ya existen. | Fase futura / repaso de navegadores |
| M4 | **`propuestas-camara` se suma a la pila de medios registrados sin uso**, junto a `hero-1`, `hero-2`, `jornadas-jinete` y los originales anteriores del aula. Es la convención de la casa (los originales no se borran), pero el registro y `public/` crecen con material muerto: 61 medios registrados, varios de los cuales no los pinta nadie. | Consciente y deliberado. Es el mismo M4 del informe de `JIA-2026-09-20-45`, un punto peor. | Una limpieza única, en su propio prompt, que liste qué medios no referencia ningún `mediaId` y decida con el promotor cuáles se retiran de `public/` conservando el original en `assets/`. | Fase futura |

### Observaciones sin riesgo

- En el teléfono la sección **encoge unos 59 px**: la caja de la foto pasa de ratio 1,403 (el `ratio` escrito a
  mano que había en el componente) a 1,777 (el ratio real de la imagen), así que a 390 px mide 390 × 219 en vez de
  390 × 278. Es la consecuencia buscada de quitar el ratio a mano, y la foto ya no se recorta por los lados.
- La maestra de la izquierda no desaparece del todo: queda entre el 1 % y el 8 % de opacidad, un rastro que a
  tamaño real se lee como humo de la hoguera y no como una persona. Es la lectura literal de «prácticamente no
  visible» y deja el fundido continuo; si el promotor la quiere borrada del todo, es mover dos paradas del
  degradado, no rehacer nada. Adjunto un zoom al 300 % en `evidence/borde-izquierdo-1920-zoom300.webp` para que
  pueda decidirlo viendo exactamente lo que hay.
- El resto de la sección —título, subtítulo, los dos párrafos de `JIA-2026-09-20-45`, la flecha dibujada y el
  botón— no se ha tocado.

## Siguiente paso

Ninguno obligatorio. Queda abierta la decisión del promotor sobre el rastro de la maestra (observación de arriba) y
las cuatro moderadas, todas con destino propuesto.

## Cierre

Commits de implementación:

- `55d3405` — la hoguera de los nuevos temas y el borde izquierdo disuelto

Este informe se commitea aparte, con el resumen y el análisis de riesgo íntegros en la descripción (práctica 14).
Push por `sds-dev-governance/scripts/git-safe-push.sh origin main`.
