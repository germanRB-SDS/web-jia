# [51-0] Experiencias: cuatro capas de profundidad, los rayos de sol por la ventana y la tiza que se escribe

## PREFACE — NON-EXECUTABLE

Este documento recoge la instrucción del propietario del 25 de septiembre de 2026 y su añadido del mismo día sobre el rótulo de la pizarra. Es documentación del prompt: **no se ejecuta**. La ejecución empieza en `## Status`.

- **Qué cambia:** el fondo de la sección «Experiencias» deja de ser una sola fotografía y pasa a ser una pila de cuatro capas: la fotografía del aula (`layer1`), unos rayos de sol dibujados con Three.js sobre lienzo transparente (`layer2`), la maestra recortada sin fondo (`layer3`) y, encima de todo, el texto y las tarjetas que ya existen (`layer4`). Además, el rótulo de tiza de la pizarra pierde un punto de desenfoque y se escribe solo, en 2,5 s, al mismo tiempo que entra la luz.
- **Por qué:** el propietario aporta el recorte de la maestra con fondo transparente y quiere profundidad real. Con la luz **entre** el aula y la maestra, los rayos pasan por detrás de ella y ella los tapa; eso es lo que convierte una fotografía plana en una escena con fondo, aire y primer plano.
- **Qué implica:** el recorte tiene que caer **exactamente** sobre la maestra de la fotografía maestra, a cualquier ancho de pantalla, sin un solo píxel de desplazamiento. Si se desplaza, se ve doble y el efecto se cae.
- **Cómo lo hace:** el recorte se rellena a las medidas exactas del original (1919 × 820) y se dibuja con la misma caja, el mismo `object-fit` y el mismo punto focal que la fotografía, de modo que el recorte es imposible que se mueva respecto a ella. Los rayos viven en un lienzo con la proporción del original, el mismo rectángulo en el que la fotografía se dibuja de verdad, que es el truco que ya usa el rótulo de tiza de la pizarra.
- **Consecuencias:** cambia el fondo de una sección; no cambia su texto, sus tarjetas, sus enlaces ni su semántica. Añade una dependencia de tiempo de ejecución que ya está en el proyecto (Three.js) y un lienzo decorativo más, con la misma postura de fallo que la herradura del pie: sin WebGL no se dibuja nada y la sección se queda como está hoy.
- **Análisis de severidad:** moderada por coste de pintado de una capa más a pantalla completa, por un recorte mal registrado que duplique la figura, y por movimiento no deseado en quien pide movimiento reducido. Severa solo si la capa nueva tapara el texto o robara el puntero, o si el rótulo de la pizarra quedara invisible cuando la animación no llega a dispararse. Crítica: no se prevé; no hay datos, red, permisos ni secretos en juego. La evaluación definitiva corresponde a cada fase conforme a la práctica 14.
- **Estado de evidencia:** el registro del recorte sobre la fotografía está **medido**, no supuesto: rellenado a 1919 × 820 y compuesto sobre el original teñido, la silueta encaja sin orla. La ventana está **medida** sobre el original. La dirección de la luz es una **decisión** de diseño razonada, no una medición.

---

## Status

`PENDIENTE DE EJECUCIÓN`. Escrito el 25-09-2026 a partir de la instrucción del propietario. Output previsto:
`docs/prompts-output/[51-0]prompt-output.md`.

Objetivo: dar profundidad real a la sección «Experiencias» separando la fotografía en capas y metiendo entre ellas
una entrada de luz por la ventana del aula, breve, fina y que se retira sola.

## Punto de rollback (vinculante)

El punto al que se vuelve si el propietario pide deshacer «la luz», «la ventana» o «la maestra» es el estado del
repositorio **anterior a este prompt y anterior incluso a guardarlo**:

| Campo | Valor |
|---|---|
| Commit | `4781e7a0850a9fbea436d4dc1f53825454e4b2ab` |
| Rótulo | `REsources upload` |
| Rama | `main` |
| Árbol | limpio en el momento de medirlo |

Reglas del rollback:

1. A la orden del propietario («rollback», «quita la luz», «quita la ventana», «vuelve a la maestra de antes»,
   «deja la pizarra como estaba» o equivalente), se vuelve a `4781e7a`, no a un punto intermedio de este prompt.
2. El rollback se hace **revirtiendo hacia adelante** (`git revert` de los commits de este prompt, en orden
   inverso) o restaurando rutas explícitas. Nunca con `reset --hard` sobre historia ya publicada ni con
   `push --force`: la práctica 05 y el kernel lo prohíben, y el guardarraíl de `git-safe-push.sh` lo rechaza.
3. El rollback alcanza también a este prompt y a su output: el propietario pidió volver a «antes de guardar el
   prompt siquiera».
4. Los originales de `assets/` no se borran nunca, ni en un rollback. Dejar de referenciarlos basta.

## Gate de validación visual (vinculante)

El commit y el push **de la implementación** están bloqueados hasta que el propietario diga, después de verlo, que
está perfecto o que se queda. Ninguna otra señal lo sustituye: ni que los checks estén en verde, ni que las capturas
parezcan correctas, ni que el prompt esté escrito.

Excepción explícita, pedida por el propietario: **este fichero de prompt sí se commitea y se sube antes de
ejecutarlo**. El gate protege el código, no el prompt.

## Governance and scope

- Ejecución: **LEVEL 2**. Área: `frontend`. Backend, API, base de datos, seguridad y despliegue: N/A; no introducirlos.
- Aplicar el orden de lectura de `CLAUDE.md`, el router SDS y solo las prácticas que seleccione. La práctica 14
  gobierna el cierre de cada fase (aterriza código ejecutable). La práctica 16, el alcance de verificación. La 05,
  los commits y el push. La 06, el radio de impacto sobre la sección que se toca.
- Leer `docs/memory/frontend.md`. No cargar el resto de memorias.
- Aplicar `sds-dev-governance/skills/impeccable.md` al trabajo visual.
- Trabajar desde la raíz del proyecto. No hay `.nvmrc`: se usa el Node del sistema.
- Preservar los cambios del usuario. Commits con rutas explícitas, nunca `git add -A`. Push por
  `sds-dev-governance/scripts/git-safe-push.sh origin main`.
- Ficheros nuevos con nombre en inglés; la documentación y los comentarios, en español cuando el fichero ya lo esté.
- Ningún color literal fuera de `app/theme/palette.css`. Ningún texto visible fuera de `lib/content/copy/`.
  Ninguna referencia a imagen fuera de `lib/content/media.ts`.
- Continuidad: prompt corto, de una sola sesión. Tmp/scratch: **N/A**. Evidencia visual:
  `docs/prompts-output/[51-0]/evidence/`.
- Output: `docs/prompts-output/[51-0]prompt-output.md`, según `docs/prompts-output-template/output-template.md`.

## Lo que el propietario pidió, en sus términos

| Lo que dijo | Cómo se traduce aquí |
| --- | --- |
| «la imagen encima de la maestra exactamente, solapada» | Registro pixel a pixel del recorte sobre el original, a cualquier ancho (Phase B y Phase C) |
| «sin background, que sea transparente» | El recorte se sirve como WebP con canal alfa; nada de un rectángulo de color detrás |
| «layer1: el background actual» | La fotografía del aula tal como está hoy, con su rótulo de tiza |
| «layer2: los efectos» | El lienzo de los rayos, entre la fotografía y la maestra |
| «layer3: la maestra sola» | El recorte aportado |
| «layer4: el resto de texto, botones, etc.» | El contenido de la sección, que ya está por encima y no se toca |
| «rayos de sol al cargar ese section, por la ventana» | Se disparan cuando la sección entra en pantalla, no al cargar la página: la sección está a media página |
| «como si se moviera una nube» | La luz se abre de un lado a otro del abanico, como el borde de una nube que se retira |
| «1,2 s aprox y que desaparezcan» | Ciclo completo de 1,2 s: entra, se sostiene y se apaga. Una sola vez |
| «elegante, fino, acorde, minimalista» | Pocos haces, bordes suaves, opacidad baja, color muestreado de la propia fotografía |
| «evalúas si habría un pequeño glow o no» | Sí, uno muy contenido, y la Phase D dice por qué |
| «el texto de la pizarra, un poquito menos blurr» | Baja el desenfoque del rótulo de tiza, sin perder que la pizarra está fuera de foco (Phase E) |
| «y que se "escriban" durante 2,5 s» | El rótulo se escribe línea a línea, de izquierda a derecha, en 2,5 s, disparado en el mismo momento que la luz |

## Phase A — Descubrimiento y medición (solo lectura)

1. Dejar constancia del punto de rollback: `git rev-parse HEAD` debe seguir dando `4781e7a…` antes de tocar nada
   fuera de `docs/prompts/`. Si no coincidiera, parar y registrarlo.
2. Confirmar el estado de partida de los checks: `npx tsc --noEmit`, `npm run check:content`, `npx next build`.
   Los errores previos, si los hubiera, se registran aparte y no se atribuyen a este cambio.
3. Confirmar en `components/site/Experiences.module.css` cómo se dibuja hoy la fotografía y por qué `.boardFrame`
   resuelve el rectángulo real: `object-fit: cover` con una imagen más ancha que su caja se resuelve por altura y
   el punto focal la clava al borde izquierdo (`media.ts` › `experiencias-aula`, focal x 0). Las capas nuevas
   tienen que usar **esa misma regla**, no una propia.
4. Medir sobre el original `assets/images-website/aula-maestra3.png` (1919 × 820) el rectángulo del cristal de la
   ventana. Medición de referencia tomada al escribir el prompt, **a confirmar antes de usarla**:

   | Borde | Píxeles | % del original |
   | --- | --- | --- |
   | izquierda | 745 | 38,8 % |
   | derecha | 826 | 43,0 % |
   | arriba | 99 | 12,1 % |
   | abajo | 474 | 57,8 % |

5. Confirmar que el recorte aportado por el propietario mide 1918 × 820 y que, rellenado a 1919 × 820 anclado
   arriba a la izquierda, encaja sobre la maestra sin orla. Comprobación hecha al escribir el prompt componiéndolo
   sobre el original teñido de azul: no aparece azul alrededor de la silueta. Repetirla y guardar la prueba en
   `docs/prompts-output/[51-0]/evidence/`.
6. Confirmar el radio de impacto: la pila de capas vive dentro del `backdrop` de `Experiences.tsx`. Ninguna otra
   sección usa `Experiences.module.css`. Si apareciera otro consumidor, detenerse y registrarlo.

## Phase B — El recorte de la maestra como activo

1. Copiar el PNG aportado a `assets/images-website/aula-maestra3-cutout.png`. El nombre lo ata al original del que
   salió. **No** sobrescribir ni renombrar `aula-maestra-nobg.png`, que es otro recorte anterior y se queda donde
   está, sin usar: los originales no se tocan nunca.
2. En `scripts/build-assets.sh`, junto al bloque del aula y con su comentario en español, derivar las dos variantes
   web **con alfa**:
   - rellenar a 1919 × 820 con fondo transparente anclado arriba a la izquierda, para que la proporción sea
     idéntica a la de la fotografía;
   - `maestra-960.webp` y `maestra-1919.webp` bajo `public/experiencias/`.
   Verificar después que los dos WebP conservan el canal alfa; un WebP opaco arruinaría la capa.
3. En `lib/content/media.ts`, registrar `experiencias-maestra` junto a `experiencias-aula`: mismas variantes de
   ancho, `ratio: 1919 / 820` **idéntico**, `focal: { x: 0, y: 50 }` **idéntico**, `original` apuntando al PNG
   nuevo y `license` diciendo que lo aportó el propietario el 25-09-2026. El comentario debe explicar que su razón
   de ser es caer exactamente sobre `experiencias-aula`, y que si una de las dos cambia de proporción o de foco, la
   otra cambia con ella.
4. En `lib/content/sections/experiencias.ts`, añadir `cutoutMediaId` junto a `mediaId`, y propagarlo por
   `lib/content/assemble.ts` hasta el modelo de la sección como un `Media | null` más. Ninguna ruta de imagen se
   escribe en un componente.

## Phase C — Las cuatro capas

En `components/site/Experiences.tsx` y `components/site/Experiences.module.css`. El `backdrop` deja de ser una
fotografía y pasa a ser la pila. Dentro de `.photo`, que ya crea su propio contexto de apilado:

| Capa | Qué es | Nivel |
| --- | --- | --- |
| `layer1` | La fotografía del aula y el rótulo de tiza de la pizarra, tal como están hoy | 0 |
| `layer2` | El lienzo de los rayos | 1 |
| `layer3` | El recorte de la maestra | 2 |
| — | Los degradados de junta de `.photo` (`::before` y `::after`) | 3 |
| `layer4` | El contenido de la sección, ya existente | por encima, sin tocar |

Reglas:

1. **El registro es innegociable.** `layer3` se dibuja con la misma caja que `layer1`: misma clase de superficie,
   `position: absolute; inset: 0`, misma proporción, mismo `object-fit: cover` y mismo punto focal. No se le pone
   ni un `left`, ni un `transform`, ni un ancho propio. Si las dos capas comparten caja y comparten proporción, es
   imposible que se separen.
2. Los dos degradados de junta suben al nivel 3. Hoy están en el 1 y funden el pie de la fotografía con el papel de
   abajo; si se quedaran por debajo del recorte, la falda de la maestra quedaría recortada en seco sobre la junta.
   Este es el único cambio de niveles que se hace en el fichero.
3. `layer3` es decorativa: `alt=""`, dentro de un bloque ya `aria-hidden`. No añade nada al árbol de accesibilidad,
   porque no añade información: es la misma persona que ya se ve en `layer1`.
4. `layer3` no debe recibir el puntero: `pointer-events: none`. Nada de lo que hay debajo del texto puede robar un
   clic.
5. `layer1` se sigue cargando como hasta ahora. `layer3` se carga con la misma prioridad que `layer1`, para que no
   aparezca un fotograma con la maestra a medio pintar sobre la maestra de fondo.
6. El rótulo de tiza no se mueve: sigue colgado de su `.boardFrame` dentro de `layer1`, porque está escrito en la
   pizarra del fondo.

## Phase D — Los rayos de sol (Three.js)

Componente nuevo en `components/site/sun-rays/`, siguiendo el precedente de la herradura del pie
(`components/site/horseshoe/`): un envoltorio cliente, una escena y un fichero de configuración.

| Fichero | Qué contiene |
| --- | --- |
| `SunRays.tsx` | Cliente. Observa la entrada en pantalla, importa la escena en diferido, la monta y la suelta |
| `sun-rays-scene.ts` | La escena de Three.js: cámara ortográfica, un plano, un shader y el reloj |
| `config.ts` | La ventana medida, el abanico, los tiempos y el color. Un solo sitio donde tocar números |

### D.1 — Dónde se dibuja

El lienzo va en un marco con la misma regla que `.boardFrame`: `left: 0; top: 0; height: 100%;
aspect-ratio: var(--aula-ratio)`. Ese marco **es** el rectángulo en el que la fotografía se dibuja de verdad, así
que un porcentaje dentro de él es un porcentaje de la fotografía y la ventana cae en su sitio a cualquier ancho,
igual que el rótulo de tiza. El marco es `aria-hidden` y `pointer-events: none`.

La escena trabaja en unidades de «anchos de fotografía»: `x` de 0 a 1 de izquierda a derecha, `y` de 0 a
`1 / ratio` de abajo arriba. Así un ángulo es un ángulo de verdad y no se deforma con la pantalla.

### D.2 — Por dónde entra y hacia dónde va

La luz sale del rectángulo de cristal medido en la Phase A y entra **hacia abajo y hacia la izquierda**, hacia la
maestra y hacia el frente del aula. Esa es la dirección correcta, y se puede leer en la propia fotografía: del
marco de la ventana se ve la jamba izquierda de canto y la derecha apenas, luego el muro se aleja hacia la derecha
y el cristal mira al frente-izquierda. Es además la única dirección que hace visible la profundidad que pidió el
propietario: un haz que se fuera a la derecha no pasaría por detrás de nadie.

- Inclinación central respecto a la vertical: **30°** hacia la izquierda.
- Abanico: de **14°** a **46°**. El haz más abierto llega al suelo del encuadre por detrás de la falda de la
  maestra; ahí es donde se lee la profundidad.
- Alcance: hasta pasado el borde inferior del encuadre, con el haz adelgazando antes de llegar.

### D.3 — Cómo se dibujan

Un solo plano que cubre el marco y un shader de fragmento. Para cada píxel se calcula su distancia a lo largo del
haz (`s`) y su desplazamiento perpendicular (`q`), y de ahí sale todo:

1. **Los haces.** Una función suave y periódica de `q` da entre **seis y ocho** crestas separadas por valles
   oscuros, como los cuarterones de la ventana. Crestas suaves, nunca franjas de borde duro.
2. **El cono.** El abanico se ensancha con la distancia y se apaga por los lados antes de llegar a su borde, para
   que el haz no tenga contorno.
3. **El recorrido.** Nada por detrás del cristal (`s < 0`). Entrada rápida al salir de la ventana y desvanecimiento
   progresivo antes del final del alcance: el aire se come la luz, no la corta.
4. **La nube.** Un borde suave barre el abanico de un lado a otro. Es el borde de la nube que se retira. Es lo que
   convierte una opacidad que sube en una luz que entra.
5. **El resplandor.** Sí, uno, y por una razón: un haz sin fuente se lee como un adorno pegado encima. Una elipse
   muy suave sobre el propio cristal, con la proporción del cristal (alta y estrecha), ancla los haces en la
   ventana. Va contenido: su aporte máximo no pasa de una fracción del de los haces, y el cristal de la fotografía
   ya está casi quemado, así que pasarse lo convertiría en una mancha blanca. Si al verlo no aportara, se apaga
   desde `config.ts` sin tocar el shader.

Mezcla: el lienzo se compone sobre `layer1` con `mix-blend-mode: screen`, que es lo que hace la luz de verdad
—aclara y nunca ensucia—. `.photo` ya aísla la mezcla, así que no se escapa al resto de la página. Dentro del
lienzo, mezcla aditiva, sin prueba ni escritura de profundidad.

Color: token nuevo en `app/theme/palette.css`, **muestreado del propio cristal de la fotografía** (`#eedccb`,
medido sobre `aula-maestra3.png`), con el mismo precedente y el mismo comentario que `--jia-chalk`, que se muestreó
de esta misma foto. Un solo uso. La escena lo lee de `:root` con `getComputedStyle`, como ya hace
`components/site/jornadas-route/JornadasRoute.tsx`. Ningún color literal en el shader ni en el TypeScript.

### D.4 — Los 1,2 segundos

Un solo ciclo, con el reparto asimétrico que tiene la luz de verdad: entra más rápido de lo que se va.

| Tramo | Qué pasa |
| --- | --- |
| 0 → 0,55 s | La nube se retira: el barrido abre el abanico de lado a lado, con salida suave |
| 0 → 0,20 s | A la vez, la intensidad sube de cero a su máximo |
| 0,55 → 0,72 s | Pleno. El alcance crece un punto, lo justo para que respire |
| 0,72 → 1,20 s | Se apaga, con entrada y salida suaves |

Al terminar: se para el bucle, se limpia el lienzo y se sueltan los recursos de GPU. No se repite al volver a pasar
por la sección; una entrada de luz que se repite cada vez que uno baja y sube deja de ser un momento y se vuelve un
tic.

### D.5 — Condiciones de calidad, de obligado cumplimiento

- **Movimiento reducido.** Bajo `prefers-reduced-motion: reduce` no hay animación ninguna: se dibuja **un solo
  fotograma** con la luz al 55 % de su máximo y ahí se queda. La composición en profundidad se conserva; el
  movimiento desaparece. No es una excusa para no dibujar nada.
- **Sin WebGL, sin lienzo o si el módulo no carga:** no se dibuja nada y la sección se ve exactamente como hoy.
  Misma postura que la herradura del pie. Nada de mensajes de error al usuario.
- **Disparo.** `IntersectionObserver` sobre la sección, una sola vez, con un umbral que espere a que la ventana del
  aula esté realmente en pantalla. Si la sección ya estuviera visible al cargar, se dispara igual.
- **Coste.** Densidad de píxeles limitada (no pasar de 1,75) y ancho de lienzo con tope, porque el marco es más
  ancho que la caja visible en pantallas estrechas. Un shader, un plano, una llamada de dibujo.
- **Fuera de pantalla.** Si la pestaña se oculta a mitad de la animación, se para el reloj y se retoma al volver:
  nadie debe encontrarse la luz ya apagada sin haberla visto.
- **Accesibilidad.** El lienzo es `aria-hidden` y `pointer-events: none`. No hay texto encima de los rayos: el
  texto vive en la mitad derecha y los rayos van hacia la izquierda. Verificarlo, no suponerlo.
- **Limpieza.** Al desmontar, `dispose()` de geometría, material y renderizador, y desconexión del observador.

## Phase E — La tiza que se escribe

El rótulo de la pizarra (`.board` en `components/site/Experiences.module.css`, con el texto en
`lib/content/copy/es/` › `experiencias.board`) está escrito en la pizarra del fondo, así que pertenece a `layer1` y
ahí se queda. Cambian dos cosas.

### E.1 — Un punto menos de desenfoque

`filter: blur(0.12cqw)` baja a **`0.07cqw`**: de unos 2,3 px a unos 1,3 px sobre un encuadre de 1920. Sigue
habiendo desenfoque, porque la pizarra está fuera de foco y una tiza nítida sobre una pizarra borrosa se lee como
una pegatina; pero el rótulo se lee mejor, que es lo que pidió el propietario. La opacidad (`0.55`) no se toca en
el mismo movimiento: si al verlo hiciera falta, se ajusta después, de una en una, para saber cuál de las dos cosas
hizo el efecto. Actualizar el comentario del fichero, que hoy dice que el desenfoque iguala al de la pizarra.

### E.2 — Que se escriba, en 2,5 s

Las tres líneas se revelan de izquierda a derecha, una detrás de otra, como una mano que escribe.

1. **Técnica.** Una máscara de degradado por línea (`mask-image` sobre cada `span`), con el borde **suave**, y se
   anima su `mask-position`. Nada de `clip-path` con borde duro: un canto recto atravesando una letra manuscrita
   se lee como una persiana, no como una tiza. Nada de animar `width`, que recolocaría el texto en cada
   fotograma. La máscara se compone en GPU y no toca el diseño.
2. **Reparto.** Tres líneas, 2,5 s en total: cada línea tarda unos 0,9 s y arranca unos 0,8 s después de la
   anterior, de modo que la última termina en el segundo 2,5. Los números exactos salen del número real de líneas
   que haya en la constante; si un día son dos o cuatro, el reparto se recalcula para que el total siga siendo
   2,5 s. No escribir «3» a mano en ningún sitio: derivar el retardo del índice de la línea.
3. **Ritmo.** Casi lineal dentro de cada línea, con una salida suave al final: es el instante en que se levanta la
   tiza. Un `ease-in-out` completo se pararía en mitad de la palabra.
4. **Disparo.** El mismo instante que la luz. El componente cliente de la Phase D marca el contenedor de las capas
   con un atributo de dato cuando la sección entra en pantalla, y el CSS cuelga de ese atributo. Así la luz entra
   y la tiza se escribe a la vez, que es el momento que pidió el propietario.
5. **Sin JavaScript, sin WebGL o si el módulo no carga:** el rótulo se ve **entero y quieto**, como hoy. El estado
   por defecto del CSS es «escrito»; es el componente cliente el que, al montarse, lo arma en «por escribir» y
   luego lo suelta. Nunca al revés: un rótulo que depende de JavaScript para existir es un rótulo que un día no
   existe.
6. **Movimiento reducido.** Bajo `prefers-reduced-motion: reduce` el rótulo aparece entero, sin escribirse. El
   desenfoque más bajo sí se conserva: eso es legibilidad, no movimiento.
7. **Una sola vez.** No se reescribe al salir y volver a entrar en la sección.
8. El texto sigue viniendo de la capa de contenido. Ni una palabra en el componente ni en el CSS.

## Phase F — Verificación y evidencia

1. `npx tsc --noEmit`, `npm run check:content` y `npx next build`, los tres en verde.
2. Comprobar que los dos WebP de la maestra llevan canal alfa y que `check:content` encuentra los ficheros nuevos.
3. Levantar el servidor de desarrollo y capturar con CDP, en `docs/prompts-output/[51-0]/evidence/`:
   - la sección en escritorio ancho, **antes** de que entre la luz;
   - tres fotogramas del ciclo: la nube retirándose, el pleno y el apagado;
   - la sección ya en reposo, con la luz apagada;
   - la sección a ancho de móvil;
   - un recorte al 100 % del borde de la maestra, para enseñar que el recorte no se desplaza;
   - un recorte al 100 % de la pizarra a media escritura y otro con el rótulo terminado;
   - la misma vista con movimiento reducido activado.
4. Verificar a mano: que el texto y las tarjetas siguen por encima de todo; que el puntero llega a los botones;
   que la maestra no se mueve al redimensionar la ventana de forma continua entre 360 px y 2560 px; que la luz no
   vuelve a dispararse al salir y volver a entrar en la sección; que el rótulo de la pizarra se ve entero con
   JavaScript desactivado.
5. Cierre conforme a la práctica 14: commit(s) de implementación con rutas explícitas, informe de fase por
   terminal y en el output, y commit documental aparte con el resumen y el análisis de riesgo íntegros en su
   descripción.
6. Presentar el resultado al propietario y **parar**. El prompt queda `EJECUTADO — PENDIENTE DE VALIDACIÓN VISUAL`.

## Phase G — Cierre tras la validación visual

No ejecutar sin la validación visual explícita del propietario. Llegada esa validación:

1. Registrarla en el output con la fecha y las palabras del propietario.
2. `sds-dev-governance/scripts/git-safe-push.sh origin main`.
3. Actualizar el `## Status` de este prompt a `EJECUTADO Y CERRADO`.

Si en lugar de la validación llega una petición de rollback, aplicar el apartado `## Punto de rollback` y no
ejecutar esta fase.
