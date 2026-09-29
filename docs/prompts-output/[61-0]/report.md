# [61-0] Informe — Experiencias: carrete de cine con los siete carteles de éxito y visor ampliado

**Estado:** EXECUTED (29-09-2026). Prompt: [`docs/prompts/[61-0]experiencias-carrete-de-cine-con-carteles-y-visor.md`](../../prompts/[61-0]experiencias-carrete-de-cine-con-carteles-y-visor.md).
Punto de rollback: `7732f31`. Commits: `75623c7` (prompt) · `f92e290` (implementación y textos) · informe.
Tmp/scratch: N/A.

## Resumen

- **Qué se ve:** en «Ideas de cine que ya han pasado por el aula», las tarjetas de ejemplo dejan paso a una tira de
  película que se desliza despacio (18 px/s, **de izquierda a derecha** a petición del promotor) con `exito-1…7` en
  sus fotogramas, en orden. Con `experienciasConfig.display = "cards"` vuelven las tarjetas de [60-0].
- **Archivos:** `components/site/film-reel/` (nuevo: `FilmReel`, `reel-engine.ts`, `ReelViewer`, `config.ts`,
  CSS), `components/site/Experiences.tsx`/`.module.css`, `components/primitives/Picture.tsx` (opción `eager`),
  `lib/content/{media,assemble,index}.ts`, `lib/content/sections/experiencias.ts`, `lib/content/copy/…`
  (textos del carrete, título, entradilla, línea del índice del hero), `scripts/build-assets.sh`,
  `public/experiencias/reel/`. Reutilizados: `Picture`, `CloseIcon`/`ArrowIcon`/`PauseIcon`/`PlayIcon`, la
  política de movimiento (`lib/motion/policy`) y el patrón de `<dialog>` nativo y el botón de cierre de
  `SheetDialog` (su maqueta de ficha no servía para un cartel suelto).
- **Encaje:** el PNG no tiene alfa, su paso es irregular (397–402 px) y cada perforación enseña una mancha distinta,
  así que no se repite tal cual. Se deriva un **módulo** de un fotograma (400×412, cortado por el centro de las
  divisiones) con las perforaciones igualadas a partir de un solo hueco del dibujo; la unión cae en una división y
  no se ve. Cada fotograma es una caja con ese módulo de fondo y el cartel colocado en % del módulo (ventana medida:
  x 14–383, y 61–350), `object-fit: contain`, con el 5,5 % de margen arriba y abajo. El ancho del módulo es un número
  entero de píxeles (`round()`), así que no hay costuras. Las **manchas** son una capa fija derivada del original
  con el papel convertido en transparencia: sin rectángulo crema sobre el fondo de la sección.
- **Bucle:** período = 7 módulos; la pista lleva `2 + ⌈ancho/período⌉` copias y se envuelve por período con una
  sola `translate3d`. La copia real (botones, nombres accesibles) se pinta siempre dentro de una ventana de
  desplazamientos que permite llevar cualquiera de sus carteles a la zona clara; las demás son `aria-hidden` y sin
  tabulación, solo para el ratón.
- **Límite del aula:** medido sobre `aula-maestra3.png`, el aula (pupitres, niños, ventana) se deshace en bruma
  entre el 50 y el 52 % del ancho: `--aula-guard: 52%`. Desde 1280 px la sección es contenedor (`cqw`) y la tira
  empieza en `max(columna, 52 %)`, con una máscara que va de opacidad 0 en esa línea a 1 tras `min(22 %, 160 px)`,
  `overflow: clip` y un escudo invisible sobre la mitad más tenue del fundido (no deja tocar carteles que apenas se
  ven). Por la derecha llega al borde de la pantalla. Por debajo de 1280 px ocupa su franja propia de borde a borde
  con un fundido de `min(16 %, 72 px)` a la izquierda. La altura se adapta a lo que deja el titular.
- **Movimiento:** pausa con ratón encima, foco de teclado dentro, visor abierto (parada en seco), botón
  «Pausar/Reanudar la película», fuera de pantalla y pestaña oculta; arranque suave. **Arrastre** con ratón o dedo
  (ganancia 1,6) e impulso al soltar; `touch-action: pan-y` deja el gesto vertical a la página; un arrastre nunca
  abre un cartel. Movimiento reducido: sin deriva ni impulso; flechas «Fotograma anterior/siguiente» y los siete
  botones por Tab (el foco trae su cartel a la zona clara).
- **Visor:** `<dialog>` modal (capa superior, fondo inerte, foco en la X), fondo tinta al 62 % con desenfoque,
  entrada y salida de unos 200 ms. Imagen de 1000/1414 px (nunca la miniatura) con su proporción. Anchura:
  móvil `min(70vw, …)` / 80dvh; ≥ 760 px `min(60vw, 560px)` / 75dvh; ≥ 1280 px `min(40vw, 640px)` / 70dvh, siempre
  limitada por la altura y los márgenes seguros. X redonda de 44×44 («Cerrar imagen») sobre la esquina superior
  derecha. Cierra con la X, clic/tap en el fondo (solo si la pulsación empezó en el fondo), Escape y —solo con
  ratón— al salir del conjunto imagen+X tras haber entrado, a los 150 ms, cancelable. Bloquea el scroll de la
  página y lo devuelve; el foco vuelve al botón real del mismo cartel.

## Verificación

Ejecutado: `npx tsc --noEmit` OK · `npm run check:content` OK (96 medios) · `npx next build` OK (estático).
Chrome real por CDP (`evidence/qa.mjs`, informes `qa-*.json`, capturas `reel-*.png` y `viewer-*.png`) a 1440×900,
2560×1440, 1280×800, 768×1024 táctil, 390×844 táctil, 844×390 táctil (horizontal), 360×740 táctil, y con
movimiento reducido a 1440 y a 390:

| Criterio | Resultado |
| --- | --- |
| 1. Siete carteles en orden y enteros | OK en todas: 7 botones en orden, imágenes cargadas, proporción 0,707 |
| 2. Alineados con los huecos al moverse y al cambiar de tamaño | OK: mismo % en los 7 fotogramas y estable en el tiempo en cada ancho |
| 3. Dos ciclos sin salto | OK: 224 pasos de arrastre a 1280/1440/2560: solo 2 envoltorios de exactamente un período, 0 saltos más, la pista cubre siempre la ventana |
| 4. Desaparece antes del aula | OK: la ventana empieza exactamente en el 52 % (748,8 px a 1440; 665,6 a 1280; 998,4 a 1920) y el fundido parte de opacidad 0 |
| 5. Sin scroll horizontal | OK: la sección no añade nada. A 1280 la página mide 1290 px **también sin la sección** (viene de «Jornadas», previo) |
| 6. Cada cartel abre el suyo, con su proporción | OK en todas |
| 7. X visible y utilizable | OK: 44×44 dentro de la pantalla en todas, también 844×390 |
| 8. Cierres | OK: fondo, Escape, X (táctil), salida del ratón (abierto a 80 ms, cerrado tras 150 ms) |
| 9. No se cierra al abrir ni yendo a la X | OK: fuera antes de entrar no cierra; imagen→X no cierra; clic en la imagen no cierra |
| 10. Foco, pausa y movimiento reducido | OK: Tab recorre los 7 y cada uno queda entero en la zona clara; Intro abre; el foco vuelve; con movimiento reducido no hay deriva y salen las flechas |

Deriva: 27 px cada 1,5 s de izquierda a derecha (`evidence/drift-probe-1440.txt`). Arrastre: a la izquierda y a la
derecha, con impulso al soltar. Sin errores de consola.

No ejecutado: Safari/iOS y Firefox reales (solo Chrome); lector de pantalla real (sí la estructura: una sola copia
anunciada, sin ids duplicados); un iPhone físico para el gesto de arrastre frente al scroll vertical.

## Riesgos (moderado / severo / crítico)

- **Moderado — pruebas de tiempo en Chrome sin interfaz:** en una pasada la deriva arrancó más tarde (el observador
  de visibilidad tarda ~1,5 s en avisar) y midió 0 en su ventana de 3 s; dos sondeos aparte dan 18 px/s estables.
  *Propuesta:* verlo en el equipo del promotor.
- **Moderado — `--aula-guard: 52%` atado a la foto del aula:** es el cuarto dato que depende de
  `aula-maestra3.png` (con la altura, la tiza y «Tu propuesta»). Si cambia la foto, hay que volver a medir.
  *Propuesta:* lista de comprobación al cambiar esa imagen.
- **Moderado — peso:** 7 miniaturas cargan con la página (~20–60 KB cada una) porque entran de lado y la carga
  diferida del navegador las dejaría en blanco; el visor pide 1000/1414 px (160–400 KB). Los PNG originales no se
  sirven (4 MB cada uno).
- **Moderado — texto del cartel 1:** la imagen dice «blibioteca»; el nombre accesible va bien escrito. *Propuesta:*
  corregir el cartel en origen.
- **Moderado — sin tarjetas de experiencias:** mientras se use el carrete, los enlaces a una experiencia concreta
  (fichas de taller, programa) llevan a la sección. Son experiencias `demo`.
- Sin riesgos severos ni críticos.

Quedan sin versionar (no son de este encargo o no caben en GitHub): los `.zip` de `assets/` (uno de 198 MB),
`assets/images-staff-success-stories/originales/` y `assets/downloadable-content/`.
