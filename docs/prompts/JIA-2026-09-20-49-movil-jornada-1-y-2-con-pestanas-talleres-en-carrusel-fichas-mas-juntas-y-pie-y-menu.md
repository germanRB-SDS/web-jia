# JIA-2026-09-20-49 — El móvil: «Jornada 1 / Jornada 2» con pestañas, los talleres en carrusel, las fichas más juntas, la hoguera bajo el título y el pie (y el menú) rematados

## PREFACE — NON-EXECUTABLE

> Mini-memoria del prompt. **No se ejecuta.** La ejecución empieza en `## Status`.
>
> - **Qué cambia:** seis ajustes de composición **exclusivos de la vista móvil vertical** (salvo dos
>   excepciones declaradas en el punto 6, que el promotor pide también en escritorio): el programa de las
>   jornadas pasa de dos bloques apilados a dos pestañas deslizables; los talleres pasan de rejilla a
>   carrusel con botones redondos; las fichas de «Ideas que ya han pasado por el aula» pierden el aire
>   muerto que hay sobre «Ver ficha»; la foto de la hoguera sube justo debajo del título «Tu propuesta
>   JIA»; el pie enseña la parte derecha del establo; y la franja del pie y el menú se rematan (nota de
>   los estepicursores fuera en móvil, marca del estudio un 15 % mayor, crédito un punto —móvil— o dos
>   —de 760 px en adelante— más grande, y una entrada nueva «Contacta con South Desert Studio»).
> - **Por qué:** en un teléfono la página se lee en una sola columna y hoy paga tres peajes: el programa
>   obliga a un scroll largo para llegar a la segunda jornada, los seis talleres son una tira vertical
>   interminable, y las fichas y las secciones se pegan unas a otras sin frontera visible.
> - **Qué implica:** un componente cliente nuevo para el programa (hoy `Jornadas.tsx` es servidor puro) y
>   otro para el carrusel de talleres; CSS acotado por `@media` en cinco módulos; una cadena nueva de copy
>   y una entrada nueva de navegación en `lib/content/`.
> - **Cómo lo hace:** los dos carruseles se construyen sobre **scroll con `scroll-snap` nativo**, no sobre
>   gestos escritos a mano: el dedo ya sabe deslizar, el teclado ya sabe tabular y el lector de pantalla ya
>   sabe leer una región con scroll. El JavaScript sólo sincroniza qué pestaña está marcada y mueve el
>   scroll cuando se pulsa una pestaña o una flecha.
> - **Consecuencias:** `Jornadas.tsx` deja de ser enteramente servidor (dos islas cliente nuevas, sin datos
>   nuevos); las anclas `#programa`, `#talleres` y `#talleres-<id>` y los enlaces internos de las sesiones
>   tienen que seguir funcionando; el `<dialog>` de la ficha se abre en la capa superior y no lo recorta el
>   carrusel; la marca del estudio crece con `transform`, así que los estepicursores (que se escalan con la
>   altura de su caja) no cambian de tamaño.
> - **Análisis de severidad:** **moderado**. No toca datos, contratos, seguridad ni despliegue. El riesgo
>   real es de accesibilidad y de regresión visual en el tramo 640–900 px, y se acota midiendo en el
>   navegador en cada punto.

---

## Status

**Fecha:** 2026-09-20 · **Origen:** mensaje del promotor en chat, con cinco capturas de la web en un
teléfono (iPhone, Safari en navegación privada).
**Nivel:** LEVEL 2 (composición y comportamiento de interfaz en varias secciones; sin datos, sin
contratos, sin seguridad).
**tmp/scratch:** **no aplica** — seis puntos cortos en una sola capa, una sesión; se registra `N/A` en el
informe.
**Rama:** `main` (rama compartida del proyecto). Push por
`sds-dev-governance/scripts/git-safe-push.sh origin main`.
**Estado:** EJECUTADO (2026-09-21) — informe en `docs/prompts-output/JIA-2026-09-20-49/report.md`, con
los informes de fase `phase-a-report.md` y `phase-b-report.md`.

## Texto del promotor

> «Todo lo que voy a expresar se refiere a la vista móvil es vista móvil vertical. Dentro de las jornadas,
> quiero que para la vista solo y solo para la vista móvil, las jornadas aparezcan una al lado de la otra,
> no tanto como un carousel sino debajo de PROGRAMA que tenga más Espacio y ponga JORNADA 1 y JORNADA 2. Y
> una linea con algo de grosor en JORNADA 1 que está seleccionada por defecto, pero si se pulsa JORNADA 2
> -> la linea aparece en la JORNADA 2 desapareciendo de la 1 como mecanismo de resaltar cuál está
> seleccionada. También si se hace slide para el otro lado, se selecciona la otra jornada, tanto en el
> label como en el horario (tabla) y luego en la seccion TALLERES, también la siguiente modificación es
> exclusivamente para la vista móvil... aquí sí necesitamos que haya un carousel. Los botones izquierda y
> derecha pueden tener la estética de los botones que aparecen en escritorio en el video (circular, etc.)
> con una flecha > (o pueden tener la estética del circulo con flecha de la tarjeta de colaboradores ->
> decide cuál se vería y encajaría mejor. Luego, en la sección ideas que ya han pasado por un aula, las
> fichas (color verde oliva y la marron) ambas están con mucho espacio respecto al botón "VER FICHA". ese
> padding/separación que quede bien /impeccable (solo modificamos en móvil) pero que sea pequeña dicha
> separación. Y en la versión móvil, vamos a poner debajo de TU PROPUESTA JIA la foto de la propuesta jia
> (es decir la imagen de la hoguera con el indio y el sheriff) por qué?, para que ayude a distinguir de la
> siguiente section. Y en el footer, que se vea la zona derecha de la imagen real que hay (ese es el
> extremo izquierdo, pero podría mostrarse el derecho)? Y en el menú que haya una sección CONTACTA CON
> SOUTH DESERT STUDIO y si hace click lleva a la página de south desert studio ;) en la vista móvil además,
> la frase + enlace de "sí son estepicursores" no se verá (no se muestra) y el icono de south desert studio
> lo aumentamos un 15% y el "Diseñado por South Desert studio" lo subimos un tamaño de letra más grande. ->
> en el footer de resoluciones mayores a movil vertical -> sí se muestra el "SÍ, SON ESTEPICURSORES" pero
> también se aumenta un 15% el tamaño del logo de South Desert Studio y se aumenta en 2 tamaño de letra más
> grande la frase de "Diseñado por South Desert Studio".»

## Qué se entiende por «vista móvil vertical»

Un único umbral para todo lo que este prompt llama móvil: **`max-width: 759.98px`**. Es el que ya separa
en el proyecto las dos jornadas en columnas (`Jornadas.module.css`, `@media (min-width: 760px)`) y el que
ya reordena la franja del pie (`SiteFooter.module.css`, `@media (max-width: 759.98px)`); reutilizarlo evita
inventar una frontera nueva. Dos puntos tienen su propio corte porque su composición ya está escrita en
otro sitio, y se dice en cada uno: la foto de «Tu propuesta JIA» (el `split` arranca en 900 px) y la
entrada de menú (el panel del menú existe por debajo de 960 px).

Nada de lo que sigue puede cambiar el aspecto de la vista de escritorio, **salvo** las dos cosas que el
promotor pide explícitamente para todas las resoluciones en el punto 6 (tamaño de la marca del estudio y
tamaño del crédito).

## Estado de partida (medido en el navegador, 390 × 844, `next dev`)

| Hecho medido | Valor de hoy |
|---|---|
| Programa | Las dos jornadas apiladas; hay que bajar toda la tabla de la Jornada 1 para ver el rótulo de la 2 |
| Talleres | Rejilla de una columna, `358px`: seis fichas una debajo de otra |
| Ficha de «Ideas…» | Del borde inferior del título al botón «Ver ficha» hay **84 px** de aire vacío |
| «Tu propuesta JIA» | La foto de la hoguera va **al final** de la sección, y justo debajo empieza la foto a sangre de «Acoge JIA»: las dos fotos se tocan |
| Pie | `--post-x: calc(100cqw + 38cqh)`: el poste queda fuera por la derecha y se ve el **extremo izquierdo** del establo |
| Marca del estudio | Caja de `2rem` dibujada a `scale(1.15)` |
| Crédito «Diseñado por…» | `0.875rem` |

**De dónde salen los 84 px de la ficha.** La tarjeta (`SheetCard.module.css`) ocupa **siete filas de la
rejilla de la sección** mediante `grid-template-rows: subgrid` (foto, título, subtítulo, quién, tema, «Ver
ficha», dosier), y reserva dos líneas de alto mínimo en el título, el subtítulo, el «quién» y el «tema».
Eso es exactamente lo que debe hacer en escritorio, donde varias fichas comparten fila y sus dos botones
tienen que quedar a la misma altura. En el teléfono hay **una sola columna**: no hay vecina con la que
alinearse, las experiencias de demostración no tienen subtítulo, ni personas, ni tema, y las tres filas
vacías más sus medianiles se convierten en un agujero de 84 px sobre «Ver ficha». **El arreglo es retirar
esa alineación en móvil, no sumar un margen negativo.**

## Encargo

Seis puntos. Cada punto cierra con su propio commit de implementación en verde (ver `## Cierre`).

### 1. El programa: «Jornada 1 / Jornada 2», con línea y deslizable

Sólo por debajo de 760 px. De 760 px en adelante, las dos jornadas siguen exactamente como están, en dos
columnas separadas por su filete vertical: no se toca ni un píxel.

En móvil, debajo del rótulo «PROGRAMA» y **con más aire del que hay hoy** entre ese rótulo y lo que viene
después, aparece una tira con los dos rótulos, **JORNADA 1** y **JORNADA 2**, uno al lado del otro. Bajo el
seleccionado, una **línea con grosor** (2–3 px, terracota del tema); el otro rótulo va apagado y sin línea.
Arranca seleccionada la Jornada 1.

Debajo, las dos jornadas enteras —fecha, lugar, horario, «Cómo ir» y la tabla de sesiones— viven en una
**pista horizontal con `scroll-snap`**: una jornada por vista, ancho completo de la columna de contenido.

Las dos direcciones tienen que funcionar y quedar sincronizadas:

- Pulsar un rótulo lleva la pista a esa jornada (`scrollIntoView`/`scrollTo` con `behavior: "smooth"`, o
  `"auto"` bajo `prefers-reduced-motion: reduce`).
- Deslizar con el dedo hacia el otro lado mueve la línea al rótulo que corresponde. La detección se hace
  sobre el **scroll real** de la pista (posición del scroll o `IntersectionObserver` sobre los paneles),
  nunca con un manejador de gestos propio.

Requisitos que no se pueden saltar:

- **El rótulo no se dice dos veces.** Hoy cada jornada lleva su `h4` «Jornada 1» dentro del panel. En móvil
  el rótulo visible es el de la pestaña; el `h4` del panel se oculta **visualmente** (patrón `sr-only`, que
  ya existe en `SheetCard.module.css`) para no romper el esquema de encabezados del documento. En
  escritorio vuelve a verse tal cual.
- **Semántica.** La pista es una región con nombre accesible (texto nuevo en `lib/content/copy/es/`, nunca
  escrito a mano en el componente). Cada rótulo es un `<button type="button">` con `aria-controls` al panel
  de su jornada y el estado de selección expuesto (`aria-selected` con `role="tab"`/`role="tablist"`, o
  `aria-current`; decídase uno y quede escrito en el comentario del componente). Los dos paneles siguen en
  el árbol de accesibilidad: **ninguno se oculta con `hidden`**, porque los dos son alcanzables deslizando.
- **Teclado.** Con el foco en los rótulos, `←` y `→` cambian de jornada. El foco visible no puede perderse.
- **Anclas.** `#programa` sigue apuntando al bloque. Los enlaces de una sesión a su taller
  (`#talleres-<id>`) siguen funcionando.
- **Nada de datos nuevos.** El componente cliente recibe el mismo modelo que hoy (`jornadas.program.days`);
  no se duplica el marcado de la jornada: se renderiza en bucle, como ahora.

Dónde: una isla cliente nueva (p. ej. `components/site/programa-dias/ProgramaDias.tsx` con su módulo CSS),
que `Jornadas.tsx` usa dentro de la `SubSection` del programa. `Jornadas.tsx` sigue siendo servidor.

### 2. Los talleres: carrusel en móvil

Sólo por debajo de 760 px; de ahí en adelante, la rejilla actual intacta.

Las seis fichas pasan a una **pista horizontal con `scroll-snap`** (`scroll-snap-type: x mandatory`,
`scroll-snap-align: start`). Cada ficha mide algo menos que la columna —`min(78%, 19rem)` como punto de
partida— para que **asome la siguiente** y se vea que aquello se desliza. Hay que dejar aire arriba en la
pista: la chincheta de la ficha sobresale 6 px por encima de su foto y no puede quedar recortada por el
`overflow`.

Debajo de la pista (o sobre ella, si queda mejor medido), **dos botones redondos** de 2,75 rem, izquierda y
derecha, que mueven el carrusel una ficha. En los extremos el botón correspondiente queda **desactivado**
(`disabled`, atenuado), no se envuelve el carrusel.

**Estética de los botones — decisión tomada:** la del **círculo con flecha de la tarjeta de colaboradores**
(`CollaboratorsCarousel.module.css`, `.go`: 2,75 rem, aro de 1 px, fondo transparente, chevrón girado, y
relleno terracota al pulsar), **no** la de los controles del vídeo. Los controles del vídeo (`.control`)
llevan fondo de tinta translúcido y `backdrop-filter`: eso existe para que se lean sobre una imagen en
movimiento. Los talleres están sobre papel, y ahí ese botón se vería como una mancha oscura pegada. El aro
del colaborador es el mismo gesto, más callado, y es lo que encaja con el papel. Se adapta el color al
fondo claro: aro en `--jia-line`, chevrón en `--jia-terracotta`, y al pulsar/enfocar relleno terracota con
el chevrón en marfil, igual que hace la tarjeta.

Requisitos:

- Nombres accesibles de los dos botones desde `lib/content/copy/es/` (no cadenas sueltas).
- Zona de toque de 44 px como mínimo.
- El `<dialog>` de la ficha se abre con `showModal()` y sale en la capa superior: hay que **comprobarlo**
  dentro del carrusel, porque es el sitio donde un `overflow` mal puesto se nota.
- La ficha se abre al tocarla; deslizar la pista **no** puede abrir la ficha. Con `scroll-snap` nativo esto
  ya sale bien (el navegador no dispara `click` tras un desplazamiento), pero hay que verificarlo.
- `#talleres-<id>` sigue llevando a su ficha.

Dónde: una isla cliente nueva (p. ej. `components/site/talleres-carrusel/`), usada por `Jornadas.tsx` en la
`SubSection` de talleres, que en escritorio se limita a devolver la rejilla de hoy.

### 3. Las fichas de «Ideas que ya han pasado por el aula»: fuera el aire muerto

Sólo en móvil. Por debajo de 760 px, la tarjeta deja de alinearse con la rejilla de la sección: se retira
el `subgrid` y las **alturas mínimas de dos líneas** del título, el subtítulo, el «quién» y el «tema». Con
una sola columna no hay nada con lo que alinearse y esas reservas sólo producen el agujero medido.

Objetivo medido: del borde inferior del título (o de la última línea de texto que la ficha tenga) a «Ver
ficha», una separación **pequeña y regular**, del orden de **8–12 px**, la misma en la ficha verde oliva y
en la marrón, y la misma en las fichas de talleres (comparten componente: cualquier cambio aquí hay que
comprobarlo también en el carrusel del punto 2). El botón conserva sus 44 px de zona de toque: lo que se
quita es aire vacío, no accesibilidad.

### 4. «Tu propuesta JIA»: la hoguera justo debajo del título

Sólo en la pila de móvil, es decir por debajo de **900 px**, que es donde `Section` con `layout="split"`
apila la columna de texto y la visual.

Hoy la foto de la hoguera va la última de la sección y choca con la fotografía a sangre de «Acoge JIA», que
empieza inmediatamente después: dos fotografías pegadas, sin frontera. La foto sube y se coloca **entre el
bloque de cabecera (título «TU PROPUESTA JIA» + subtítulo) y los párrafos**, de modo que la sección termine
en su texto y su botón, y la fotografía de la sección siguiente arranque contra papel.

- De 900 px en adelante no cambia nada: la foto sigue siendo la columna de la derecha, a sangre y a la
  altura de la banda de arriba (`JIA-2026-09-20-47`).
- La foto sigue siendo decorativa (`aria-hidden`, `alt=""`) y sigue saliendo de `propuestas.media`: **no se
  duplica la imagen** ni se añade otra entrada en `media.ts`.
- La reordenación se hace en el orden del DOM o con `order` dentro de la pila; lo que no vale es dejar dos
  copias de la foto y esconder una con `display: none` (dos descargas, dos veces el mismo píxel).
- Hay que mirar el encuadre en vertical: la foto es 1672 × 941 con foco en `x: 78`; tal como quede en la
  pila, el jefe indio y el sheriff tienen que verse.

### 5. El pie: que se vea la derecha del establo

Sólo en móvil. El establo del pie se coloca por su **poste**, no por sus bordes: `--post-x` dice dónde cae
el centro del poste dentro del bloque. Hoy en móvil vale `calc(100cqw + 38cqh)` —el poste, muy fuera por la
derecha— y por eso se ve el extremo izquierdo de la imagen. Hay que traerlo dentro para que lo que se vea
sea la **zona derecha** de la fotografía: el poste y la puerta iluminada.

Condiciones:

- Los tres bloques de enlaces (SECCIONES, ORGANIZA, COLABORA) tienen que **seguir leyéndose** sobre la luz
  de la puerta. El velo (`.stableGround::after`) se disuelve justo antes del poste; si al traerlo se pierde
  contraste, se ajusta el velo **en móvil** hasta que el texto vuelva a ser legible. Contraste mínimo
  AA (4.5:1) del texto de los enlaces sobre lo que quede detrás: hay que medirlo, no estimarlo.
- La herradura 3D no se dibuja en ventanas pequeñas: este punto no la toca.
- De 760 px en adelante, `--post-x` se queda exactamente como está.

### 6. La franja del pie y el menú

**6.1 — «Sí, son estepicursores» fuera en móvil.** Por debajo de 760 px, el enlace `.weedsNote` no se
muestra. Tiene sentido además de por lo que pide el promotor: los estepicursores sólo ruedan con un puntero
que entra en el pie, y en un teléfono no hay puntero, así que la nota explica algo que allí nunca ocurre. De
760 px en adelante **se sigue viendo**, sin cambios.

**6.2 — La marca del estudio, un 15 % mayor, en todas las resoluciones.** Hoy se dibuja a `scale(1.15)`
sobre una caja de `2rem`. El promotor pide un 15 % **sobre lo que se ve hoy**: el factor pasa a
`1.15 × 1.15 = 1.3225`. Se mantiene el mecanismo actual —la caja maquetada sigue midiendo `2rem` y el
crecimiento es una transformación— por la razón que ya está escrita en el CSS: la altura de la franja y el
tamaño de los estepicursores se calculan con la altura de ese elemento. Hay que **comprobar** que la marca
crecida no se come el hueco con el texto ni se sale de la franja; si roza, se aumenta el `gap` del enlace,
nunca la caja.

**6.3 — «Diseñado por South Desert Studio», más grande.** La escala de tipo de interfaz del proyecto va de
`0,0625rem` en `0,0625rem` (…0,8125 · 0,875 · 0,9375 · 1…). El crédito está en `0,875rem`. Un punto más en
móvil → **`0,9375rem`**; dos puntos de 760 px en adelante → **`1rem`**. El brillo del nombre del estudio y
su color se quedan como están.

**6.4 — «Contacta con South Desert Studio» en el menú.** Entrada nueva al final del panel del menú, con ese
rótulo, que abre `https://southdesertstudio.com` en una pestaña nueva (`target="_blank"`,
`rel="noopener noreferrer"`).

- La URL **no se escribe en el componente**: sale de `productionStudio.url` en `lib/content/site.ts`, que
  es ya el punto de entrada del negocio para el estudio (lo usa la franja del pie). Una sola fuente.
- El rótulo va en `lib/content/copy/es/common.ts` (`nav.*`), con su tipo en `copy/types.ts`.
- La entrada se modela como un ítem de navegación **externo**, no como una ancla: `NavItem` sólo tiene
  `href`, así que hay que distinguir el destino externo (campo nuevo en el modelo, p. ej.
  `external?: boolean`, resuelto en `assemble.ts`) para que el enlace salga con `target`/`rel` y con la
  indicación de «se abre en una pestaña nueva» para el lector de pantalla.
- **Dónde se ve:** en el menú, es decir en el panel desplegable, que existe por debajo de 960 px. En la
  barra de escritorio (≥ 960 px) **no** se muestra: el promotor habla del menú y esa barra lleva las cinco
  áreas de la página; meter ahí una llamada externa larga rompería la fila.
- Visualmente se separa de las secciones de la página (un filete fino por encima, dentro del panel) para
  que se lea como lo que es: un enlace que se va fuera.

## Verificación exigida

En cada punto, antes de su commit:

- `npx tsc --noEmit`, `npm run check:content` y `npx next build` en verde (con el runtime fijado:
  `source "$HOME/.nvm/nvm.sh" && nvm use` en la misma orden).
- Medición en el navegador (CDP, como `scripts/qa-screenshots.mjs`) a **390 px** y a **360 px**, y
  comprobación de no-regresión a **768 px**, **1024 px** y **1440 px**.

Además, por puntos:

| Punto | Qué hay que demostrar |
|---|---|
| 1 | La línea salta al rótulo correcto al pulsar y al deslizar; `←`/`→` cambian de jornada; el `h4` sigue en el árbol de accesibilidad; a 768 px las dos jornadas siguen en dos columnas |
| 2 | El carrusel desliza y los botones mueven una ficha; se desactivan en los extremos; la chincheta no se recorta; la ficha abre su diálogo **dentro** del carrusel; un deslizamiento no abre la ficha |
| 3 | Separación título → «Ver ficha» medida en las dos fichas de «Ideas…» y en las de talleres, y comparada con los 84 px de partida; sin cambio a 1440 px |
| 4 | La foto va debajo del título en la pila; una sola descarga de la imagen; a 900 px y más, la banda intacta |
| 5 | Se ve el poste y la puerta; contraste del texto de los enlaces medido ≥ 4.5:1; de 760 px en adelante, sin cambio |
| 6 | La nota no aparece a 390 px y sí a 768 px; marca y crédito medidos en px a 390 y a 1440; la entrada del menú abre el sitio del estudio en pestaña nueva y no aparece a 1440 px |

Capturas de antes y después (390 px completo, y los recortes de cada punto) en
`docs/prompts-output/JIA-2026-09-20-49/evidence/`.

## Cierre

Práctica 14, con las fases definidas así:

- **Fase A — el móvil de las jornadas:** puntos 1 y 2. Un commit de implementación por punto, cada uno con
  su verificación en verde. Al cerrar la fase, informe (`phase-a-report.md`) con resumen, análisis de
  riesgo moderado/severo/crítico y soluciones propuestas, mostrado por terminal y commiteado **aparte**,
  con el resumen y el análisis íntegros en la descripción del commit.
- **Fase B — fichas, propuestas, pie y menú:** puntos 3, 4, 5 y 6. Un commit de implementación por punto y,
  al cerrar, su informe `phase-b-report.md` y su commit documental aparte, igual que la fase A.

Al terminar, `docs/prompts-output/JIA-2026-09-20-49/report.md` con el resumen del prompt completo y el
estado de cada punto, y push por `sds-dev-governance/scripts/git-safe-push.sh origin main`.

Los commits se hacen **con rutas explícitas**: el promotor trabaja con Fork y puede tener otras cosas en el
índice; nada ajeno a este prompt entra en estos commits. En particular, `next-env.d.ts` (regenerado por
`next dev`) y el material de `[48-0]` se quedan fuera.
