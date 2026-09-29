# [60-0] Experiencias: nueva entradilla, tarjetas solo imagen y la luz de la ventana dos veces

## PREFACE — NON-EXECUTABLE

Prompt del promotor (chat, 29-09-2026), aterrizado a `web-jia` tras inspeccionar el repositorio. Esta sección es
memoria: **execute from `## Status` onward**.

> «En esta sección: Ideas que ya han pasado por el aula. Cambiamos: "Cultiva las experiencias educativas desde la
> práctica. Disfruta de estas propuestas para tu aula, ¡el árbol del saber está aquí mismo!" por "Cultiva las
> experiencias educativas desde la práctica. Disfruta de la experiencia tal y como nos muestran los compañeros ;)". Y
> [imagen] en esa sección quitamos el texto debajo del color sólido y ocultamos el VER FICHA. La animación de luz de
> la maestra, que ocurra dos veces y pare ;) Si se hace scroll down y scroll up, se ejecuta de nuevo, pero dos veces
> máximo igualmente.»

El mensaje citaba además un bloque pegado de 253 líneas y una imagen que **no llegaron a esta sesión** (solo sus
marcadores). Se aterriza lo que el texto dice de forma explícita; lo que viniera en ese bloque queda fuera y se
señala en el informe.

### Lectura del repositorio

- Entradilla: `lib/content/copy/es/sections/experiencias.ts` (`lede`). El título no cambia.
- Tarjetas: `components/site/Experiences.tsx` → `SheetCard` (`variant="wide"`, 16:9). Las dos experiencias son
  `demo` sin medio (`mediaId: null`), así que la imagen es la superficie de color sólido (`olive`, `copper`). Debajo
  van el título (fila 2) y «Ver ficha» (fila 3 en modo `compact`). Eso es «el texto debajo del color sólido».
- Luz: `components/site/sun-rays/sun-rays-scene.ts`. Desde [56-0] el ciclo (5 s) se repite sin fin, con 1 s de
  oscuridad entre uno y otro, mientras la banda esté en pantalla; `SunRays.tsx` llama a `start()` en cada llegada
  real (de fuera a dentro) y a `stop()` al salir.

### Decisiones

- **Tarjeta solo imagen** (opción de sección en `lib/content/sections/experiencias.ts`, `pictureOnly: true`): la
  tarjeta pinta solo la superficie. El título se queda en el DOM como texto solo para lectores de pantalla (es el
  nombre accesible del `article`). «Ver ficha» no se pinta; para no perder la entrada por teclado, la propia imagen
  pasa a ser el control: `role="button"`, `tabIndex=0`, Intro/Espacio abren la ficha, nombre accesible «Ficha de
  …» y anillo de foco visible. El clic en la imagen ya abría la ficha. Las marcas (p. ej. «Demostración») se
  mantienen bajo la imagen si `showMarks` las muestra: no son el texto que se pide quitar. Con `pictureOnly: false`
  vuelve la tarjeta de siempre.
- **Luz dos veces:** `SUN_RAYS.timing.cycles = 2`. Cada `start()` (cada llegada real de la banda) reinicia la
  cuenta; tras el segundo ciclo la ventana se queda a oscuras y no se piden más fotogramas. Salir y volver: otras
  dos, como máximo. La tiza sigue escrita una sola vez. Movimiento reducido: igual que antes (un fotograma fijo).

## Status

**EXECUTED** (29-09-2026); informe en [`docs/prompts-output/[60-0]/report.md`](../prompts-output/[60-0]/report.md). Push pendiente del OK del promotor.

## Alcance y autoridad

- LEVEL 1–2 (copia, una opción de tarjeta y una cuenta en la animación). Área: frontend. Sin API, BBDD ni seguridad.
- SDS: prácticas 02, 06, 12, 14 y 16. Impeccable como criterio. Textos en `lib/content/copy/`, colores solo con
  tokens.
- Commits con rutas explícitas; fuera de ellos: `next-env.d.ts`, los zip y las carpetas de `assets/` sin versionar
  que ya estaban (`downloadable-content/`, `images-staff-success-stories/`, `cine-fotogramas.png`).
- **Push: el promotor no lo ha pedido; se le pregunta al terminar.**
- Tmp/scratch: N/A (una sesión corta).

## Ejecución

1. Entradilla nueva en `experiencias.ts` (copy).
2. `pictureOnly` en la configuración de la sección → `LandingModel` → `Experiences` → `SheetCard` (prop `bare`).
   CSS: la tarjeta ocupa 2 filas (imagen y marcas), título `srOnly`, foco visible en la imagen.
3. `cycles` en `sun-rays/config.ts` y cuenta en `SunRaysScene` (reinicia en `start()`, se para al llegar a `cycles`).
4. Verificar: `npx tsc --noEmit`, `npm run check:content`, `npx next build`; Chrome por CDP a 1440 y 390 px: sin
   título ni «Ver ficha», la imagen abre la ficha con clic y con Intro; la luz hace exactamente dos ciclos y para;
   salir y volver: otros dos.
5. Commit de implementación; informe en `docs/prompts-output/[60-0]/report.md`, commit, y preguntar por el push.
