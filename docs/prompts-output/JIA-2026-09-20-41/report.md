# JIA-2026-09-20-41 — Informe

**Origen:** petición conversacional del promotor (sin fichero de prompt).
**Fecha:** 2026-09-20 · **Rama:** `main`

| Fase | Commit | Contenido |
|---|---|---|
| 1 | `493f361` | La regla del colofón se enciende con el degradado de South Desert Studio en hover. |
| 2 | `f0b4a01` | La marca del estudio se dibuja un 15 % mayor sin que la franja crezca. |
| — | `bb13307` | Informe de las fases 1–2. |
| 3 | `d18aa41` | El flujo corre de izquierda a derecha, al 90 % de opacidad, y el bucle cierra exacto. |
| 4 | `7dec9b5` | Las tres columnas del pie miden 240 px cada una, centradas. |
| — | (este) | Informe de las fases 3–4. |

## Resultado

**1 · La regla animada.** La línea horizontal que separa el cuerpo del pie del colofón deja de ser un
`border-top` y pasa a ser una capa de 1 px sobre `.bottom`. En reposo es la misma raya tenue de siempre
(`rgb(var(--jia-paper-rgb) / 0.12)`). Mientras el puntero —o el foco de teclado— está sobre `.bottomInner`
(el crédito del estudio y la nota de los estepicursores), un `::before` de 1 px funde su opacidad a 1 en
260 ms y muestra el degradado de marca del estudio, que además se desplaza en bucle.

El degradado es `linear-gradient(90deg, …)`: **horizontal, el color cambia de izquierda a derecha**. Es
simétrico (rosa · naranja · oro · naranja · rosa), de modo que dos baldosas contiguas se unen sobre el mismo
color. Todo en CSS: el TSX no se ha tocado. (El sentido del desplazamiento y el tamaño del fondo se
corrigieron en la fase 3; ver más abajo.)

Geometría intacta: el `padding-block-start: 1px` de `.bottom` devuelve el píxel que aportaba el borde.

**2 · La marca, un 15 % mayor.** El icono del estudio se pinta un 15 % más grande mediante
`transform: scale(1.15)` sobre una caja de maquetación que sigue midiendo 2rem. No se han tocado `width`
ni `height` a propósito, por dos razones que se verificaron midiendo:

- La marca es justo lo que fijaba la altura de la franja (32 px de marca + 2 × 20 px de `padding-block`
  = los 72 px de la fila). Agrandar la caja real habría estirado la franja, que es lo que el promotor
  pidió evitar.
- `components/site/tumbleweeds/tumbleweed-field.ts:88` dimensiona cada estepicursor a partir del
  `offsetHeight` de este mismo elemento. Una caja mayor habría agrandado también los estepicursores,
  que nadie pidió tocar.

## Decisiones tomadas con el promotor

- **Paleta:** `--color-brand-gradient` de `teragenda-colors-palette` (#e05a6b · #f4874a · #f5c242), la
  marca de South Desert Studio, frente a los azules/violetas por defecto de `gradient-flow-button`
  (que son de Auragenda) o a repetir los tonos del shimmer del nombre.
- **Disparador:** `.bottomInner`, la fila exacta que señaló el promotor, no el pie entero.
- **Corazón descartado:** se llegó a poner `"Diseñado con ❤️ por"` en `lib/content/copy/es/sections/footer.ts`
  y el promotor pidió volver al original. Revertido; ese fichero no aparece en ningún commit de esta fase.

## Excepción de paleta

Los tres tonos del degradado son marca del socio, no tokens de `app/theme/palette.css`. Es la **misma
excepción explícita ya documentada** en este fichero unas líneas más abajo para el shimmer del nombre
«South Desert Studio», y queda anotada en el comentario de la regla. No se ha introducido ningún color
nuevo fuera de ese ámbito.

## Patrón de origen

`sds-dev-governance/resources/frontend-patterns/ui-components/gradient-flow-button/`. Se respetan sus
cuatro modos de fallo documentados: degradado simétrico, `background-size` sincronizado con el final de
los keyframes, animación en el estado de hover y no en la regla base, y sin halo.

## Verificación

| Check | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — 6 talleres, 38 personas, 2 experiencias, 58 medios |
| `npx next build` | verde — export estático, 4 rutas |
| CSS compilado | el `:has()` sobrevive con las clases cifradas de CSS Modules |

Medición sobre el export estático servido (`out/`, Chrome headless por CDP, 1440 × 900):

| Medida | Antes | Después |
|---|---|---|
| Altura de la fila `.bottomInner` | 72 px | 72 px |
| Altura de la franja `.bottom` | 73 px | 73 px |
| Caja de maquetación de la marca | 32 × 32 px | 32 × 32 px |
| Marca pintada | 32 × 32 px | 36,8 × 36,8 px |

Muestreo del color de la regla a lo ancho (`evidence/`, 9 puntos del 0 % al 100 %):

| Fotograma | izquierda → centro → derecha |
|---|---|
| reposo | `#463124` plano en todo el ancho |
| hover +0,0 s | `#f1814e` → `#f5b843` (oro) → `#ee7954` |
| hover +0,8 s | `#f07e50` → `#e15b6b` (rosa) → `#ea715b` |
| hover +1,6 s | `#e86c5e` → `#f5b943` (oro) → `#f59f47` |

El color varía a lo ancho y el oro viaja del 44 % al 75 % del ancho entre fotogramas: el degradado es
horizontal y corre de izquierda a derecha.

## Evidencia

- `evidence/rule-rest.png` — la regla en reposo.
- `evidence/rule-hover-{a,b,c}.png` — tres instantes de un bucle, con el puntero sobre la franja.
- `evidence/strip-hover.png` — la franja completa: regla encendida, marca al 115 % y un estepicursor
  rodando a su tamaño de siempre.

## Análisis de riesgo

**Críticos: ninguno nuevo.** Se buscaron explícitamente en las tres superficies que el cambio toca
—maquetación de la franja, accesibilidad del colofón y el campo de estepicursores— y se midió cada una.

**Severos: ninguno nuevo.**

**Moderados (2):**

1. **`:has()` no tiene repliegue.** El encendido de la regla depende de `.bottom:has(.bottomInner:hover)`.
   En un navegador sin `:has()` la regla se queda sencillamente en su raya tenue de siempre: degradación
   limpia, nada se rompe ni se descoloca. El soporte es universal desde Firefox 121 (dic-2023).
   *Destino:* aceptado, sin acción. Se revisará sólo si el proyecto declarase alguna vez un objetivo de
   navegadores anterior a 2024.

2. **El escalado de la marca es de pintado, no de maquetación.** Si alguien cambia más adelante el
   `--mark-box` de 2rem, o el `padding-block` de `.bottomInner`, la compensación deja de cuadrar y la
   franja sí podría moverse; y un futuro `will-change: transform` sobre la marca podría hacer que el
   navegador la rasterice a 1× antes de escalar, con pérdida de nitidez. El porqué queda escrito en el
   comentario de la regla, junto a la referencia a `tumbleweed-field.ts:88`.
   *Destino:* documentado en el código; sin acción inmediata.

**Pre-existente que conviene anotar (no agravado por este cambio):** `scripts/qa-screenshots.mjs` pasa el
`clip` de `Page.captureScreenshot` en coordenadas de viewport, cuando el protocolo las espera en
coordenadas de documento. Hoy no falla porque todos sus recortes son de página completa con `y: 0`, pero
cualquier recorte parcial futuro saldría de la zona equivocada. Se detectó al capturar esta evidencia y se
resolvió en el script auxiliar de esta fase, que es temporal y no se commitea.
*Destino:* candidato a arreglo en una fase futura del script de QA; no entra aquí para no mezclar ámbitos.


---

# Fase 3 — Sentido del flujo, opacidad y cierre del bucle

Commit: `d18aa41`.

## Resultado

**1 · Opacidad al 90 %.** El degradado encendido pasa de `opacity: 1` a `0.9`. Los tonos se apagan lo justo
sobre la tinta del pie: el extremo izquierdo del fotograma A pasa de `#f1814e` a `#de734e`.

**2 · El flujo corre ahora de izquierda a derecha.** Iba al revés, y el promotor lo detectó a ojo. La causa:
con un fondo más ancho que su caja, **subir** `background-position` desplaza la imagen hacia la **izquierda**,
porque el porcentaje interpola sobre `(contenedor − imagen)`, que es negativo. Los keyframes ahora cuentan
hacia atrás, de `200%` a `0%`, y la imagen viaja hacia la derecha. El eje del degradado sigue siendo `90deg`,
que es el horizontal en CSS (`0deg` apunta arriba, `180deg` abajo); lo que se ha invertido es el sentido del
recorrido, no el eje.

**3 · `background-size` de 220 % a 200 %.** Salió al comprobar lo anterior: **el 220 % que recomienda el
patrón del kit no cierra el bucle.** Con `background-position` en porcentaje el desplazamiento es
`posición × (contenedor − imagen)`, así que recorrer 0–220 % con una imagen del 220 % mueve 264 % del ancho,
mientras el patrón se repite cada 220 %: 1,2 baldosas, con salto visible al reiniciar. La condición de cierre
es `|(100 − S)/100| = 1`, que sólo cumple `S = 200`. Con 200 % el recorrido es de exactamente una baldosa.

## Verificación determinista del sentido

Fijando `background-position` sin animación (`evidence/pos-*.png`) y localizando el pico dorado (canal verde:
oro `#f5c242` tiene G=194; rosa `#e05a6b`, G=90):

| `background-position` | pico dorado | pico rosa |
|---|---|---|
| 200 % | 100 % del ancho | 0 % |
| 150 % | fuera de cuadro (G máx. 123) | 49 % |
| 100 % | **0 %** | 99 % |
| 50 % | **50 %** | 0 % |
| 0 % | **100 %** | 0 % |

La animación recorre 200 % → 0 %, luego el oro **entra por la izquierda, cruza el centro y sale por la
derecha**. Y el fotograma de 0 % es idéntico al de 200 %: el bucle cierra sobre sí mismo sin salto, que es
justo lo que el 220 % no conseguía.

En los fotogramas animados, el oro pasa del 25 % al 87 % del ancho entre +0,8 s y +1,6 s.

## Verificación

`npx tsc --noEmit`, `npm run check:content` y `npx next build` en verde; el `:has()` sigue en el CSS
compilado. Geometría sin cambios respecto a la fase 2: fila 72 px, franja 73 px, marca 32 × 32 px de caja y
36,8 × 36,8 px pintada.

## Análisis de riesgo

**Críticos: ninguno nuevo. Severos: ninguno nuevo.**

**Moderados (1 nuevo, y uno que esta fase cierra):**

1. **Nuevo — divergencia con el patrón del kit.** Este componente usa `background-size: 200%` mientras
   `gradient-flow-button` documenta 220 % y pide explícitamente mantener ambos alineados. Quien copie el
   patrón del kit a otro sitio reproducirá el salto. El porqué queda escrito en el comentario de la regla.
   *Destino:* candidato a corrección del recurso del kit y de su lista de modos de fallo, en una promoción
   futura de `sds-dev-governance` (fuera del ámbito de este proyecto). Decisión del promotor.

2. **Cerrado — el salto del bucle.** El riesgo de reinicio brusco que el patrón del kit daba por resuelto
   con el 220 % existía de verdad y queda eliminado, con la evidencia `pos-0.png` ≡ `pos-200.png`.

Los dos moderados del informe anterior (`:has()` sin repliegue; el escalado de la marca es de pintado y no
de maquetación) siguen vigentes y sin cambios.


---

# Fase 4 — Las tres columnas, del mismo ancho

Commit: `7dec9b5`.

## Resultado

Secciones, Organiza y Colabora tenían anchos distintos: cada columna se ajustaba a su contenido
(`grid-auto-columns: minmax(0, max-content)`) y sólo Organiza, la de textos más largos, alcanzaba el tope de
`15rem` que imponía `.cols .col { max-width: 15rem }`. Ahora el ancho lo fija la pista de la rejilla
—`grid-auto-columns: 15rem`— así que las tres miden **240 px exactos**, y el `max-width` de `.col` sobra y
desaparece.

El grupo **sigue centrado respecto a la ventana**, que era la condición conseguida en `JIA-2026-09-19-40`:
las zonas laterales de `.inner` siguen siendo iguales (`minmax(min-content, 1fr)` · `auto` ·
`minmax(0, 1fr)`) y el grupo, ahora más ancho, se las come por igual.

## Verificación

Medido sobre el export estático (Chrome headless por CDP):

| Ventana | Anchos de columna | Separaciones | Centro del grupo | Centro de la ventana |
|---|---|---|---|---|
| 1920 px | 240 · 240 · 240 | 64 · 64 | 960 | 960 ✓ |
| 1440 px | 240 · 240 · 240 | 57,6 · 57,6 | 720 | 720 ✓ |
| 1280 px | 240 · 240 · 240 | 51,2 · 51,2 | 640 | 640 ✓ |
| 1100 px | 240 · 240 · 240 | 44 · 44 | 550 | 550 ✓ |

Por debajo de 1100 px nada cambia: sigue el diseño de tablet de cuatro columnas con la marca (medido a
1000 px → 187,3 px cada una, y a 760 px → 137,1 px cada una; el grupo no está centrado en la ventana ahí
**por diseño**, porque se disuelve en la rejilla junto a la marca). En móvil, apiladas.

`npx tsc --noEmit`, `npm run check:content` y `npx next build` en verde. Evidencia: `evidence/footer-1440.png`.

## Análisis de riesgo

**Críticos: ninguno. Severos: ninguno.**

**Moderado (1):** las columnas dejan de encogerse con el contenido entre 1100 px y el ancho del contenedor.
Con los textos actuales sobra sitio en las cuatro anchuras medidas, pero una entrada futura notablemente más
larga en `lib/content/sections/footer.ts` partiría palabras dentro de sus 240 px en lugar de ensanchar la
columna, y a 1100 px justo el margen libre es el más estrecho (44 px de separación).
*Destino:* aceptado; es exactamente el comportamiento pedido. Si alguna vez molesta, la salida es bajar
`grid-auto-columns` a `minmax(0, 15rem)` con `justify-content: center`, que conserva la igualdad sólo
mientras quepa.

El moderado nuevo de la fase 3 (divergencia con el `background-size` del patrón del kit) y los dos de las
fases 1–2 (`:has()` sin repliegue; el escalado de la marca es de pintado, no de maquetación) siguen vigentes
y sin cambios.
