# JIA-2026-09-20-43 — Informe

**Origen:** petición conversacional del promotor (sin fichero de prompt).
**Fecha:** 2026-09-20 · **Rama:** `main`

| Fase | Commit | Contenido |
|---|---|---|
| 1 | `c74bb20` | La sección «Ideas que ya han pasado por el aula» estrena la maestra que mira al aula. |
| — | (este) | Informe. |

## Resultado

El fondo de Experiencias pasa a la tercera versión de la imagen del aula
(`assets/images-website/aula-maestra3.png`, 1919×820): la maestra ya no está de espaldas, mira a la clase.
Entra por la vía de contenido de siempre: derivados en `public/experiencias/aula-{960,1919}.webp` vía
`scripts/build-assets.sh` y medio `experiencias-aula` en `lib/content/media.ts`. El `mediaId` de la sección
no se toca, porque el medio conserva su identidad.

`Experiences.tsx` deja además de llevar el ratio escrito a mano (`1916 / 821`): lo toma del medio, que es lo
que `Surface` hace por defecto. Con esto, los dos componentes que aún guardaban medidas de imagen (`Host` en
la fase anterior y `Experiences` ahora) vuelven a no conocer ninguna.

**Procedencia del fichero.** Ya estaba en el árbol sin seguir, como `maestra-defintiva.png`. Se renombra al
entrar para continuar la serie `aula-maestra*`. Es la misma imagen que el promotor adjuntó al chat:
comprobado **píxel a píxel, RMSE 0**; los hashes difieren sólo por la recodificación PNG del adjunto. Se usa
la copia del proyecto, no la del adjunto, por ser la de origen.

**No hace falta velo**, a diferencia de la banda de Acoge de la fase anterior. Barriendo ambas imágenes por
columnas (luminancia media y desviación vertical, que delata si queda detalle), las dos se aplanan y aclaran
en el mismo punto:

| Columna | 45 % | 50 % | 55 % | 60 % | 100 % |
|---|---|---|---|---|---|
| `aula-maestra2` (anterior) | L191 / sd14 | L220 / sd6 | L228 / sd1 | L229 / sd0 | L229 / sd0 |
| `aula-maestra3` (nueva) | L188 / sd16 | L223 / sd6 | L231 / sd1 | L232 / sd1 | L232 / sd1 |

Es decir, un reemplazo directo: el recorte 16/10, el punto focal `{x: 0, y: 50}` y la costura inferior con
el suelo de la página siguen valiendo tal cual.

Las dos versiones anteriores (`aula-maestra-clase.png` y `aula-maestra2.png`) se quedan a su lado, sin uso:
los originales no se sobrescriben ni se borran, así que volver atrás son tres líneas.

## Verificación

| Check | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — 6 talleres, 38 personas, 2 experiencias, 58 medios |
| `npx next build` | verde — export estático, 4 rutas |

Revisado sobre el export estático (Chrome headless por CDP) a 1920, 1440, 900 y 390 px: la maestra sostiene
la izquierda, y el título, la entradilla y las dos fichas se leen sobre el papel despejado de la derecha. En
móvil, la banda arriba y el texto debajo, como antes.

Evidencia en `evidence/`: `experiencias-antes-1440.webp` (la maestra de espaldas) y
`experiencias-{1920,1440,900,390}.webp`.

## Análisis de riesgo

**Críticos: ninguno. Severos: ninguno.**

**Moderado (1):** la sección depende de que la mitad derecha de la imagen siga despejada, y nada lo
comprueba. La composición que lo garantiza vive fuera del repositorio —en la imagen que aporte el promotor—,
así que una cuarta versión con el sujeto desplazado rompería la lectura del título y las fichas sin que
ningún check lo avise. Esta vez se verificó a mano con el barrido de columnas de arriba.
*Destino:* aceptado. La condición queda escrita en el comentario de `build-assets.sh` y en el del medio en
`media.ts` («she holds the left and the right half is clear paper»), que es donde la leerá quien sustituya la
imagen la próxima vez.

Sigue vigente el moderado pre-existente anotado en `JIA-2026-09-20-42`: los derivados de `public/` no tienen
ninguna comprobación que verifique que siguen correspondiendo a su original.

## Pendiente de decisión del promotor

Siguen **sin seguir** en git tres aportaciones suyas que nadie ha pedido tocar:

- `assets/images-website/aula-maestra-clase-original.png` — copia byte a byte de `aula-maestra2.png`
  (comprobado por hash), que ya está en el repositorio. Redundante.
- `assets/images-website/indio-gen.png` — copia del indio anterior, ya guardada en el histórico.
- `assets/images-minihollywood/` — material nuevo, sin uso todavía en la web.

Dime si los quieres dentro y los añado.
