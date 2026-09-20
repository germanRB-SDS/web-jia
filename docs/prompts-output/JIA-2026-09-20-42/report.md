# JIA-2026-09-20-42 — Informe

**Origen:** petición conversacional del promotor (sin fichero de prompt).
**Fecha:** 2026-09-20 · **Rama:** `main`

| Fase | Commit | Contenido |
|---|---|---|
| 1 | `037ce81` | La banda «Dispara tu centro» pasa al nuevo indio, con velo a su derecha. |
| 1 | `2cf4a2c` | Los derivados del distintivo #JIA26 vuelven a coincidir con su original. |
| — | (este) | Informe. |

## Resultado

**1 · La imagen.** La sección Acoge pasa del arquero anterior al indio nuevo del promotor
(`assets/images-website/indio.png`, 1916×821, contenido sustituido el 20-09). Entra por la vía de contenido
de siempre: derivados en `public/acoge/indio-{960,1916}.webp` vía `scripts/build-assets.sh`, medio
`acoge-indio` en `lib/content/media.ts` y `mediaId` en `lib/content/sections/acoge.ts`. Además `Host.tsx`
deja de llevar el ratio escrito a mano (`1922 / 818`): lo toma del medio, que es lo que `Surface` hace por
defecto, así que el componente vuelve a no conocer medidas de ninguna imagen.

**2 · El velo.** La imagen nueva **no es pálida por la derecha**: termina en polvo cálido del desierto, y la
llamada quedaba encima. Un degradado sobre la foto la funde al papel de la página (`--jia-vellum-4`), de modo
que la derecha llega igual que en la referencia. Tres decisiones:

- **Dónde se vuelve sólido.** No en un número redondo sino en el **borde izquierdo de la propia columna de
  texto**, calculado con la misma geometría que usan `.inner` y `.text`. A la anchura de la referencia cae en
  torno al 50 % de la banda, que es lo pedido, y se adelanta según la ventana se estrecha y la columna
  arranca antes. **Hacía falta:** a 1024 px el texto empieza en el 48 % y a 900 px en el 43 %, así que un
  50 % fijo habría dejado la copia sobre el polvo justo en esas anchuras.
- **La rampa es suave**, un smoothstep repartido en el 12 % anterior a ese borde, no una recta: una recta
  deja una costura visible donde empieza. Era la condición que puso el promotor («sin opacidad lineal»).
- **El primer tope conserva un 0,5 % del color** en vez de `transparent`, para que la interpolación no pase
  por gris (`transparent` es negro con alfa 0 y ensucia el tramo).

El velo viaja en la misma capa que la costura inferior con Socios, porque `::before` ya lleva la superior. En
móvil sigue apagado, que es donde la foto va entera arriba y el texto debajo.

Los derivados del arquero anterior salen de `public/`. **Su original se queda intacto** en
`assets/images-website/acoge-arquero.png`, como manda la regla de no tocar ni borrar originales, así que
volver atrás es cambiar tres líneas.

**3 · El distintivo #JIA26.** `assets/cep/logo-variantes/#jIA26 LOGO.png` cambió de contenido en `ade60b7`
(«ASSETS img») pero sus derivados de `public/brand/` no se regeneraron: la cabecera seguía sirviendo el
distintivo anterior. Salen de `npm run assets` sin tocar el script. Se detectó al generar los derivados de
Acoge y va en su propio commit por no mezclar ámbitos.

## Verificación

| Check | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — 6 talleres, 38 personas, 2 experiencias, 58 medios |
| `npx next build` | verde — export estático, 4 rutas |

Muestreo del fondo de la banda a la altura del texto, sobre el export estático (Chrome headless por CDP):

| | 50 % | 58 % | 62 % | 75 % | 99 % |
|---|---|---|---|---|---|
| sin velo (1440 px) | `#e7c8a7` | `#e4c5a3` | `#debf9d` | `#e1c19f` | `#e2c3a2` |
| con velo (1440 px) | `#e8caaa` | `#ebdfcd` | `#ece2d2` | `#ece2d2` | `#ece2d2` |

El fondo bajo el texto es `#ece2d2` exacto —el `--jia-vellum-4` de la página— y la rampa sube sin escalones.

Anchura por anchura, dónde arranca la columna de texto y dónde el papel ya es sólido:

| Ventana | Empieza el texto | Papel sólido desde |
|---|---|---|
| 1920 px | 57,5 % | 58 % |
| 1440 px | 60,3 % | 62 % |
| 1024 px | 48 % | 50 % |
| 900 px | 43 % | 45 % |
| 390 px | bajo la foto | velo apagado (diseño de móvil) |

Evidencia en `evidence/`: `acoge-nueva-imagen-sin-velo-1440.webp` (el problema) y `acoge-{1920,1440,1024,900,390}.webp`.

## Análisis de riesgo

**Críticos: ninguno. Severos: ninguno.**

**Moderados (2):**

1. **El velo replica la geometría de la columna de texto.** `--veil-solid` repite en `Host.module.css` el
   ancho de `.text` (28rem), su `margin-right` y el `min(100% - 2 × gutter, container)` de `.inner`. Si
   alguien cambia cualquiera de esos tres valores y no toca el velo, el borde sólido deja de coincidir con
   el texto y la copia puede volver a caer sobre el polvo. No hay nada que lo vigile.
   *Destino:* documentado en el comentario de la regla, con el porqué. La salida limpia, si vuelve a tocarse
   esa zona, es sacar la medida a una custom property compartida por `.text` y el velo.

2. **El velo tapa el arco y la punta de la flecha a anchuras medias.** A 1920 px la flecha se ve entera; a
   1440 px el arco ya se disuelve en el papel y a 900 px se pierde casi todo el gesto. Es consecuencia
   directa de anclar el velo al texto, y a 900 px es la única forma de que la copia se lea. Se lee como
   polvo en suspensión y encaja con la escena, pero es una pérdida de la imagen.
   *Destino:* aceptado. Si molesta, la salida es un recorte propio para anchuras medias (otra variante en
   `media.ts`), no aflojar el velo.

**Pre-existente que conviene anotar (no agravado):** los derivados de `public/` no tienen ninguna
comprobación que verifique que siguen correspondiendo a su original. El caso del distintivo #JIA26 llevaba
así desde `ade60b7` y se encontró por casualidad. `npm run check:content` comprueba que el fichero **existe**,
no que esté al día.
*Destino:* candidato a fase futura — un check que compare la fecha o el hash del original con la del
derivado. No entra aquí para no mezclar ámbitos.

## Pendiente de decisión del promotor

Quedan **sin seguir** dos aportaciones suyas que aparecieron en el árbol y que nadie ha pedido tocar:

- `assets/images-website/indio-gen.png` — copia del indio anterior (idéntica, comprobado por hash, al
  contenido que `indio.png` tenía en `ade60b7`). El histórico ya guarda esa versión, así que el fichero es
  redundante salvo que quieras tenerlo a mano en el árbol.
- `assets/images-minihollywood/` — material nuevo, sin uso todavía en la web.

Dime si los quieres dentro y los añado.
