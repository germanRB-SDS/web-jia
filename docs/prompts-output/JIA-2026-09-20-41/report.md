# JIA-2026-09-20-41 — Informe

**Origen:** petición conversacional del promotor (sin fichero de prompt).
**Fecha:** 2026-09-20 · **Rama:** `main`

| Fase | Commit | Contenido |
|---|---|---|
| 1 | `493f361` | La regla del colofón se enciende con el degradado de South Desert Studio en hover. |
| 2 | `f0b4a01` | La marca del estudio se dibuja un 15 % mayor sin que la franja crezca. |
| — | (este) | Informe. |

## Resultado

**1 · La regla animada.** La línea horizontal que separa el cuerpo del pie del colofón deja de ser un
`border-top` y pasa a ser una capa de 1 px sobre `.bottom`. En reposo es la misma raya tenue de siempre
(`rgb(var(--jia-paper-rgb) / 0.12)`). Mientras el puntero —o el foco de teclado— está sobre `.bottomInner`
(el crédito del estudio y la nota de los estepicursores), un `::before` de 1 px funde su opacidad a 1 en
260 ms y muestra el degradado de marca del estudio, que además se desplaza en bucle.

El degradado es `linear-gradient(90deg, …)`: **horizontal, el color cambia de izquierda a derecha**, y el
desplazamiento viaja también de izquierda a derecha. Es simétrico (rosa · naranja · oro · naranja · rosa)
con `background-size: 220%` alineado al final de los keyframes, tal como exige el patrón del kit, para que
el bucle reinicie sin salto. Todo en CSS: el TSX no se ha tocado.

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
