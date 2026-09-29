# [61-0] Experiencias: carrete de cine animado con los siete carteles de éxito y visor ampliado

## PREFACE — NON-EXECUTABLE

Prompt del promotor (chat, 29-09-2026), aterrizado a `web-jia` tras inspeccionar el repositorio. Esta sección es
memoria: **execute from `## Status` onward**.

> «[imagen: `cine-fotogramas.png`] y todos los que van en los fotogramas serían: images-staff-success-stories →
> ¿cómo lo harías para la section Ideas que ya han pasado por el aula? (podrías no usar el fondo, eh), pero tiene que
> ser adaptative, y sí funcional la animación de los fotogramas; el "carrete" + fotogramas se puede animar? no lo sé.
> Commit antes de empezar porque seguramente hagamos rollback. Y ejecuta.»

Acompaña un encargo largo pegado en el chat (rol de frontend senior; carrusel cinematográfico con los carteles dentro
de los fotogramas y visor ampliado). Sus requisitos se resumen abajo, en «Encargo»; el texto completo manda si hay
dudas de interpretación.

Punto de rollback: `7732f31` (antes de este prompt; incluye [60-0] cerrado y los recursos tal cual llegaron).

### Lectura del repositorio

- Sección: `components/site/Experiences.tsx` (+ `.module.css`). Desde 1280 px la foto del aula es un fondo que ocupa
  toda la sección con su proporción exacta (`--jia-band-aula-ratio`, 1919/820, `cover`, foco x 0): % de la sección =
  % de la foto. La columna de contenido empieza en `--aula-clear − --aula-shift` = 51 % y llega al borde derecho del
  contenedor. Por debajo de 1280 px la foto es una banda propia encima del título y el contenido va debajo, sobre
  papel liso (`--jia-vellum-3`).
- Hoy la columna lleva dos `SheetCard` de experiencias `demo` sin imagen ([60-0], `pictureOnly`).
- Recursos: `assets/images-website/cine-fotogramas.png` (1774×887, RGB **sin alfa**) y
  `assets/images-staff-success-stories/exito-1…7.png` (1414×2000, verticales, sin alfa).
- Talleres: `SheetCard` → `SheetDialog` (`<dialog>` nativo con `showModal`, Escape, clic en el fondo, foco de vuelta
  al que lo abrió; botón «Cerrar» con texto en una píldora dentro de un panel de ficha). Sirve el mecanismo y el
  lenguaje visual, no la maqueta: el visor de un cartel no es una ficha.
- Movimiento: `lib/motion/policy.ts` (`subscribeMotion`, `isMotionReduced`, `html[data-motion]`); el carrusel de
  colaboradores (`components/site/collaborators-carousel/carousel-engine.ts`) ya resuelve una deriva infinita por
  transformaciones con copias y una copia «real» accesible. GSAP existe, pero no hace falta para esto.
- Imágenes: `lib/content/media.ts` (registro) + `scripts/build-assets.sh` (derivados WebP en `public/`) +
  `components/primitives/Picture.tsx` (`srcset`, ancho/alto intrínsecos: sin saltos de carga).

### Mediciones sobre los archivos reales

- **Carrete (px del original):** película y = 231…642 (412 px). Ventanas y = 292…581 (290 px); x = 100–474,
  502–871, 899–1269, 1297–1671 (anchos 370–375, paso 397–402: dibujado a mano, no periódico). Divisiones de 27 px.
  Perforaciones con paso ≈ 66,6 px (seis por fotograma) y centradas sobre las divisiones; cada hueco enseña una
  mancha distinta. Extremos con fotogramas partidos (0–72 y 1699–1773). **No se puede repetir el PNG entero** sin
  unión visible.
- **Colores:** papel del PNG ≈ rgb(243 229 211); película ≈ rgb(252 241 224); interior de ventana ≈
  rgb(238 219 198). La sección es `--jia-vellum-3` (#efe5d6): el papel del PNG pintado tal cual sería un rectángulo.
- **Foto del aula:** energía de detalle por columnas (bandas verticales 30–100 %): el aula (pupitres, alumnos,
  ventana) se deshace en bruma entre el 50 y el 52 % del ancho; a partir del 52 % es papel. Zona protegida: hasta el
  52 % de la foto.

### Decisiones

1. **Módulo repetible derivado** (`scripts/build-assets.sh`, el original intacto): un fotograma de 400×412 cortado
   del original por el centro de dos divisiones (x 488 → 888, y 231 → 642), así que cada módulo es «media división +
   ventana + media división» y la unión cae siempre en una división. Las perforaciones del módulo se repintan con un
   único hueco del propio dibujo (el de x 600) en sus posiciones medidas; el hueco partido por la unión es la misma
   pieza a cada lado y casa (comprobado con tres módulos seguidos). Ventana en el módulo: x 14…383, y 61…350.
2. **Manchas:** capa fija detrás de la película, derivada del original con el papel llevado a blanco (niveles por
   canal con el color del papel) y pintada con `mix-blend-mode: multiply`: el papel desaparece contra el fondo real de
   la sección y solo quedan las manchas. La película clara y sus ventanas van encima, opacas. Las manchas no se mueven
   (la película pasa sobre ellas); se funden arriba y abajo.
3. **Composición única:** cada fotograma es una caja con el módulo de fondo al 100 % y su cartel colocado en % del
   módulo (la ventana medida), con `object-fit: contain` y margen interior; el hueco lateral es el propio interior de
   la ventana. El ancho del módulo es un número entero de px (`round()`), derivado del alto disponible, para que los
   módulos no dejen costuras.
4. **Bucle:** período = 7 módulos (siete carteles, uno por fotograma, `exito-1…7`). La pista lleva las copias que
   pida el ancho; se mueve con `translate3d` desde un rAF propio a 18 px/s (configurable) y se envuelve por período.
   Solo una copia es accesible (botones reales); las demás son `aria-hidden`, sin tabulación y solo para el puntero.
5. **Pausas:** puntero de ratón sobre la tira, foco de teclado dentro, visor abierto, botón pausar/reanudar
   (discreto, bajo la tira a la derecha), fuera de pantalla, pestaña oculta. Al volver: arranque suave, respetando la
   pausa manual. Movimiento reducido: sin deriva; flechas «fotograma anterior/siguiente» y los siete botones reales
   por Tab; el foco trae su cartel a la zona clara.
6. **Límite del aula:** desde 1280 px la ventana visible empieza en `max(columna, 52 % de la sección)` (la sección es
   contenedor: `cqw`) y llega al borde derecho de la pantalla. Máscara horizontal sobre el conjunto (manchas,
   película, perforaciones, carteles): opacidad 0 en ese borde, 1 tras el tramo de fundido. `overflow: clip` como
   recorte geométrico. Los carteles con el centro dentro del fundido dejan de recibir clics. Por debajo de 1280 px la
   tira ocupa su franja propia de borde a borde de la pantalla, con el mismo fundido a la izquierda.
7. **Visor:** `<dialog>` nativo (capa superior: no lo recorta la tira ni se mueve con ella), fondo atenuado y la
   subida breve de `SheetDialog`. Imagen a resolución completa (1414 px, WebP de alta calidad derivado del original;
   la miniatura nunca se amplía). X de 44×44 con nombre «Cerrar imagen» sobre la esquina superior derecha, dentro del
   conjunto. Cierres: X, fondo, Escape, y salida del ratón del conjunto imagen+X (solo `pointerType: mouse`, armada
   tras la primera entrada, 150 ms cancelables). Tamaños: móvil ~70vw / 80dvh; ≥ 760 px hasta 60vw y 560 px / 75dvh;
   ≥ 1280 px hasta 40vw y 640 px / 70dvh; siempre por proporción.
8. **Configuración y reversibilidad:** `experienciasConfig.display: "reel" | "cards"` (con `"cards"` vuelve lo de
   [60-0]); carteles y su orden en `lib/content/sections/experiencias.ts`; textos (nombres accesibles, controles) en
   `lib/content/copy/es/sections/experiencias.ts`; componente portable en `components/site/film-reel/`.
9. Los enlaces a experiencias concretas (fichas de taller, programa) apuntan a la sección mientras se use el carrete.

## Status

**PENDING**

## Alcance y autoridad

LEVEL 2. Solo `web-jia`, rama `main`. Sin dependencias nuevas. Sin push (el promotor no lo ha pedido).
Tmp/scratch: N/A (una sola fase; evidencias en `docs/prompts-output/[61-0]/evidence/`).

## Encargo (resumen del texto pegado)

- Sustituir las tarjetas de ejemplo de «Ideas que ya han pasado por el aula» por una tira de película en movimiento
  con los siete carteles (`exito-1…7`, en orden) dentro de sus ventanas reales, enteros, alineados con los bordes y
  sin tapar divisiones ni perforaciones, escalando como una sola composición.
- Movimiento derecha → izquierda, lento y uniforme (≈ 18 px/s), bucle sin saltos; pausas por ratón/foco, visor
  abierto y botón accesible; `prefers-reduced-motion` sin desplazamiento y con navegación manual a los siete.
- Límite adaptativo: la tira se funde a opacidad 0 antes del aula y se recorta; sin zonas invisibles que capten clics
  o foco; sin scroll horizontal; se adapta al redimensionar y al apilar columnas.
- Visor centrado con la imagen original completa y nítida; X visible de ≥ 44×44 «Cerrar imagen»; cierre por X,
  fondo, Escape y salida del ratón (reglas de armado y retardo); foco atrapado y devuelto; sin saltos de scroll.
- Verificar a 360–390 (vertical y horizontal), 768, 1440 y más ancho, con un segundo pase de QA y accesibilidad.

## Verificación

`npx tsc --noEmit`, `npm run check:content`, `npx next build`, Chrome por CDP a 390×844, 844×390, 768, 1440 y 2560:
orden y encaje de los carteles, dos ciclos sin salto, opacidad 0 antes del 52 %, `scrollWidth` = ancho, visor
(tamaño, X, cierres), foco y movimiento reducido.
