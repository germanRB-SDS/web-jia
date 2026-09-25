# Prompt Output — [51-0]

## 0. Metadata

| Campo | Valor |
|---|---|
| Prompt ejecutado | `docs/prompts/[51-0]experiencias-depth-layers-and-window-sunbeams.md` |
| Fecha | 2026-09-25 |
| Agente/herramienta | Claude Code |
| Rol principal | Frontend |
| Nivel de gobernanza | `LEVEL 2` |
| Áreas afectadas | `frontend` |
| Memorias cargadas | `docs/memory/frontend.md` |
| Estado final | `IMPLEMENTADO` (Phases A–G) |
| Change ID | `REL-2026-09-25-02` |
| Rama | `feat/REL-2026-09-25-02-experiencias-window-light`, integrada en `main` |
| Punto de rollback | `4781e7a0850a9fbea436d4dc1f53825454e4b2ab` |
| Validación visual | Concedida por el propietario el 25-09-2026: «sí, ha quedado perfecto, haz commit y push» |

## 1. Objetivo

Separar el fondo de la sección «Experiencias» en cuatro capas y meter luz entre ellas: la fotografía del aula,
los rayos de sol que entran por su ventana, la maestra recortada de esa misma fotografía y, encima de todo, el
texto y las tarjetas. La luz pasa **por detrás** de ella y ella la detiene: eso, y nada más, es lo que convierte
una fotografía plana en una habitación con aire. Además, el rótulo de tiza de la pizarra pierde un punto de
desenfoque y se escribe solo, letra a letra.

### 1.1 Áreas de contexto

| Área | Declarada | Inferida | Motivo | Memoria cargada |
|---|---|---|---|---|
| `frontend` | sí | — | Composición, CSS, un componente cliente y una escena de Three.js | sí |
| `backend` | no | no | N/A: no hay servidor en juego | no |
| `api-openapi` | no | no | N/A | no |
| `database` | no | no | N/A | no |
| `security` | no | no | N/A: sin datos, red, permisos ni secretos | no |
| `deployment` | no | no | N/A: la exportación estática no cambia de forma | no |

## 2. Qué se hizo

| ID | Fase | Estado |
|---|---|---|
| A | Medición de la ventana sobre el original y radio de impacto | `DONE` |
| B | El recorte de la maestra como activo con alfa | `DONE` |
| C | Las cuatro capas | `DONE` |
| D | Los rayos de sol con Three.js | `DONE` |
| E | La tiza: menos desenfoque y escritura letra a letra | `DONE` |
| F | Verificación y evidencia | `DONE` |
| G | Cierre: rama propia, commits e integración en `main` | `DONE` tras la validación visual |

### 2.1 Ficheros

| Fichero | Qué cambia |
|---|---|
| `assets/images-website/aula-maestra3-cutout.png` | Nuevo. El recorte que aportó el propietario, sin tocar (1918 × 820) |
| `scripts/build-assets.sh` | Deriva `maestra-960.webp` y `maestra-1919.webp` rellenando a 1919 × 820 y conservando el alfa |
| `public/experiencias/maestra-960.webp`, `maestra-1919.webp` | Nuevos. 20 KB y 71 KB, con canal alfa |
| `lib/content/media.ts` | Entrada `experiencias-maestra`, con la misma proporción y el mismo foco que `experiencias-aula` |
| `lib/content/sections/experiencias.ts` | `cutoutMediaId` |
| `lib/content/assemble.ts` | `cutout` en el modelo de la sección |
| `components/site/Experiences.tsx` | La pila de capas, `data-classroom`, y la pizarra partida en letras con su turno |
| `components/site/Experiences.module.css` | `.cutout`, `.lightFrame` y su velo, `.lightCanvas`, la escritura de la tiza, y las juntas al nivel 4 |
| `components/site/sun-rays/config.ts` | Nuevo. La ventana medida, el abanico, los tiempos y el reparto de la tiza |
| `components/site/sun-rays/sun-rays-scene.ts` | Nuevo. Cámara ortográfica, un plano, un shader y el reloj |
| `components/site/sun-rays/SunRays.tsx` | Nuevo. Observa la entrada en pantalla, arma la tiza y monta la escena |
| `app/theme/palette.css` | `--jia-sunbeam` y `--jia-sunbeam-rgb`, muestreados del cristal de la propia fotografía |

### 2.2 Las cuatro capas

| Capa | Qué es | Nivel dentro de `.photo` |
|---|---|---|
| 1 | La fotografía del aula y la tiza de su pizarra | 0 (y la pizarra, 1) |
| 2 | El velo radial de la ventana y el lienzo de los rayos | 2 |
| 3 | La maestra recortada | 3 |
| — | Las juntas de la banda con el papel de abajo | 4 |
| 4 | El encabezado y las fichas | por encima, sin tocar |

El registro de la capa 3 sobre la 1 no se confía a un ajuste: las dos comparten caja, proporción y punto focal,
así que `object-fit: cover` **no puede** resolverlas en rectángulos distintos. El recorte se rellenó a 1919 × 820
anclado arriba a la izquierda en vez de reescalarlo, porque reescalar habría remuestreado y la habría movido
medio píxel.

### 2.3 Ajustes que pidió el propietario mientras lo veía

Siete, todos de intensidad, tiempo, ángulo o disparo; ninguno tocó la arquitectura de capas. Están recogidos uno
a uno en el prompt, en `## Ajustes del propietario durante la ejecución`. En resumen: 45° en vez de 30°,
resplandor con opacidad propia y fuerte, luz entre los haces, haces más suaves y más dispersos, todas las curvas
`ease-in-out`, un velo radial permanente en la ventana, los haces un 20 % menos opacos, el ciclo de la luz a 5 s,
la tiza letra a letra en 2,5 s y la luz entrando **cada vez** que se vuelve a la sección.

## 3. Verificación

| Check | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — 62 medios (antes 61) |
| `npx next build` | verde — exportación estática de las 4 rutas |
| Alfa de los WebP nuevos | `alpha=Blend` en los dos |
| Registro del recorte | Compuesto sobre el original teñido de azul: sin orla alrededor de la silueta |
| Ventana medida | Rectángulo dibujado sobre el original y contrastado con los cuarterones |

Evidencia en `docs/prompts-output/[51-0]/evidence/`, capturada por CDP con WebGL real (SwiftShader) y con la
animación **congelada a mano**: se toma el control de `requestAnimationFrame` y se avanza el reloj a un
milisegundo concreto, así que cada fotograma de la evidencia es el instante que dice su nombre y no una
aproximación.

| Fichero | Qué enseña |
|---|---|
| `01-escritorio-nube-1.6s.webp` | La nube retirándose; la luz a medio entrar |
| `02-escritorio-pleno-3.1s.webp` | Pleno: la habitación llena de luz y la maestra oscura dentro de ella |
| `03-escritorio-apagado-5.0s.webp` | Final del ciclo |
| `04-escritorio-reposo.webp` | En reposo, con el velo de la ventana, que no se va |
| `05-pizarra-letra-a-letra.webp` | Tres momentos de la escritura: «Jornadas de / In…», «… de L.» y el rótulo entero |
| `06-movil-390.webp` | A 390 px: la banda recortada, con la ventana y la luz dentro del recorte |
| `07-movimiento-reducido.webp` | Con movimiento reducido: un fotograma quieto y el rótulo entero |
| `08-registro-recorte-sobre-original.webp` | La prueba del registro, sobre el original teñido |
| `09-ventana-medida.webp` | El rectángulo del cristal sobre el original |
| `10-la-luz-vuelve-al-regresar.webp` | Prueba del re-disparo en tiempo real: llegada (luz entrando), ciclo agotado (sin luz, rótulo escrito) y **regreso** tras subir arriba del todo (la luz entra otra vez) |

Comprobado además a mano: el texto y las fichas siguen por encima de todo; el puntero llega a las tarjetas; el
rótulo sale entero en el HTML servido, sin JavaScript; la luz vuelve a entrar en cada regreso y el rótulo no se
reescribe.

## 4. Análisis de riesgo

### Críticos

Ninguno nuevo. No hay datos, red, autenticación, permisos, secretos ni datos personales en este cambio, y la
exportación estática no cambia de forma. La sección sin WebGL se ve exactamente como antes del prompt.

### Severos

Ninguno nuevo. El caso severo previsto en el prefacio —que el rótulo de la pizarra quedara invisible cuando la
animación no llega a dispararse— está cerrado por construcción: el estado por defecto del CSS es «escrito», y el
recorte solo aparece cuando un componente cliente ya montado marca `data-chalk`. Sin JavaScript no hay atributo,
y sin atributo no hay recorte.

### Moderados

| # | Riesgo | Estado | Propuesta |
|---|---|---|---|
| M1 | `mix-blend-mode: screen` sobre un lienzo a sangre es trabajo de compositor en cada fotograma del ciclo | Acotado: un plano, un shader, densidad de píxeles limitada a 1,75 y lienzo con tope de 2400 px; al terminar se para el bucle y se limpia | Medir en un portátil modesto antes de subir la fuerza o la duración otra vez |
| M7 | El ciclo ya no es único: se repite en cada regreso a la banda, así que el renderizador se queda construido toda la vida de la página y un scroll insistente puede relanzarlo seguido | Acotado: entre visitas no se pide ni un fotograma, y solo cuenta la **llegada**, no el seguir estando, así que recorrer la sección de arriba abajo no la relanza. Soltar y reconstruir el renderizador en cada visita costaría mucho más que sostener un plano y un shader | Si alguna vez molestara, poner un tiempo mínimo entre dos entradas en `config.ts`; hoy no hace falta y añadirlo sería una regla sin problema que resolver |
| M2 | El marco de la luz es más ancho que la caja visible en pantallas estrechas: se pintan píxeles que nadie ve | Aceptado: es el mismo precio que ya paga el marco de la pizarra, y es lo que garantiza que la ventana caiga en su sitio | Si alguna vez pesara, recortar el marco por la derecha con `clip-path`, nunca cambiando su proporción |
| M3 | La pizarra pasa de tres nodos de texto a 31 cajas en línea, cada una con su `clip-path` durante 2,5 s | Aceptado: son 31 elementos decorativos dentro de un bloque `aria-hidden`, no llegan al árbol de accesibilidad, y el rótulo sigue viniendo entero de la capa de contenido | Si el rótulo creciera mucho, animar por palabras en vez de por letras |
| M4 | El velo radial de la ventana es permanente y suma brillo sobre una fotografía que ya está clara por la derecha | Acotado: el degradado muere a la izquierda del encuadre, que es donde la foto es más oscura, y el lado claro queda fuera de su radio | Medir el contraste del encabezado si algún día el velo se centra más a la derecha |
| M5 | El recorte depende de que su entrada de medios y la de la fotografía sigan teniendo la misma proporción y el mismo foco | Documentado en `media.ts`, en el comentario de la entrada, y en el CSS | Si se sustituye la fotografía, cambiar las dos entradas en el mismo movimiento |
| M6 | Se trabajó sobre un árbol vivo: durante la ejecución hubo ediciones ajenas en `scripts/build-assets.sh` (ajustes de `ffmpeg`) y apareció `docs/prompts-output/[52-0]/`, que no es de este prompt | Comprobado al cerrar: el diff de `build-assets.sh` contiene **solo** el bloque de [51-0]; las ediciones ajenas ya no están en el árbol | Los commits van con rutas explícitas y `[52-0]` queda fuera. Volver a mirar `git status` justo antes de commitear |

## 5. Cierre

El gate de validación visual se satisfizo el 25-09-2026 («sí, ha quedado perfecto, haz commit y push»), y solo
entonces se ejecutó la Phase G. El propietario pidió además rama aparte **y** `main`, así que el trabajo va en
`feat/REL-2026-09-25-02-experiencias-window-light` y de ahí se integra en `main`.

Trabajo ajeno en curso: Codex está trabajando en el vídeo de la intro y dejó en `main` los commits `0519d92` y
`b0cd81b` (`REL-2026-09-25-01`). Este cierre **no toca nada del vídeo**: los commits van con rutas explícitas y
el único fichero compartido, `scripts/build-assets.sh`, se commitea con un diff que contiene solo el bloque del
recorte de la maestra, verificado antes de commitear.

El punto de rollback sigue siendo `4781e7a`. Si alguna vez se pide deshacer («la luz», «la ventana», «la
maestra», «la pizarra»), se vuelve ahí revirtiendo hacia adelante, nunca reescribiendo historia publicada, y el
rollback alcanza también a este output y al propio prompt.
