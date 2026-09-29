# [59-0] Cubo con las 49 tarjetas finales, intro plegable con barra de reproducción, Talleres en una fila con fondo

## PREFACE — NON-EXECUTABLE

Prompt del promotor (chat, 29-09-2026), refinado y aterrizado a `web-jia` tras inspeccionar el repositorio y el
material. Esta sección es memoria: **execute from `## Status` onward**.

> «En el cubo de la subsección CÓMO FUNCIONAN, todas las imágenes que se van a mostrar son las que están en la
> carpeta `assets/cube-staff-final`, todos los .png. [Intro, versión no móvil]: que aparezca al bajar del vídeo, pero
> luego, al hacer scroll hacia arriba, cuando vamos a llegar a esa sección, que esté plegada. Que ponga INTRO —
> Jornadas de Innovación de Almería y esté como está ahora, pero a la derecha, con el estilo de los botones que se
> ven en el vídeo, una flecha ">" apuntando hacia abajo, como botón, para desplegar y empezar a reproducir de nuevo
> el vídeo (plegado = y pausado por donde iba). Cuando se ve el vídeo (de primeras o porque se despliega), ¿podría
> tener por encima una barra de desplazamiento para avanzar o retroceder? El botón de pausa/play lo pondríamos ahí,
> quitándolo de la esquina superior derecha. Commit al hacer las imágenes y otro después del vídeo/reproductor. En
> TALLERES: en lugar de dos filas de 3, una fila de 3 con botón "<" a la izquierda de las tarjetas y ">" a la
> derecha, como un carrusel de una única fila, manteniendo el efecto que tienen, y con `subsection-talleres.png` de
> fondo atenuado en esa zona.»

### Fase A — Cubo (material verificado tarjeta a tarjeta)

`assets/cube-staff-final/` (sin versionar) trae 49 PNG, del 10 al 58, de 1414×2000 como las actuales, más un zip
con los mismos 49 ficheros (es solo el archivo comprimido: no se usa ni se versiona). Lectura de las 49:

| Nº | Persona · rótulo de la tarjeta | Hoy |
|---|---|---|
| 10–32 | Las 23 asesorías CEP, en el mismo orden que ahora (Herrador … Silvia Cruz) · Asesor/a CEP | tarjetas 6–28 |
| 33–41 | Araceli Merino, Ismael Navarro, Inma Contreras, José Carlos Hernández, Christian Padial, Fran Bello, Mariola Martín, Manuel Salmerón, Ámina Pallarés · Tallerista | 2 con tarjeta; el cubo excluye talleristas |
| 42 | Rafa Fortis · Conferenciante | no está en `people.ts` |
| 43–44 | Alberto Romero, Adolfo Ariño · Coordinación | 39–40 |
| 45–47 | Rubén Rubio Troyano, Raúl Torres Gordon, María Hernández · Colaborador/a | 41–43 |
| 48–49 | Javier Montoya · Colaborador; Nerea Mazuecos · Colaborador | nuevas |
| 50 | Germán Roche · Web Creator | nueva |
| 51–57 | Belén González, Natalia Oller, Antonio García, Andrés García, Lucía López, Emna Lafront, Marina Heredia · Colaborador | nuevas |
| 58 | Almudena Bernal · Coordinación CEP | 46 |

- «Todas las imágenes que se van a mostrar son las de la carpeta»: el cubo muestra **exactamente estas 49** y
  nada más. Salen las 7 de «Experiencia de éxito» de [55-0] (59–67), que no están en la carpeta; sus personas se
  quedan en los datos, sin tarjeta.
- Los talleristas entran en el cubo (hoy se excluyen porque ya salen en su taller): sus tarjetas están en la carpeta.
- Orden del cubo: el de la numeración de la carpeta (10 → 58), que es el orden del promotor. El arranque aleatorio de
  [55-0] se mantiene.
- Rótulos transcritos tal cual. Nerea Mazuecos y las niñas de 51–57 llevan «Colaborador» impreso; se registra así y
  se señala. «Fran Bello» es Francisco J. Bello Plaza (misma persona, forma corta en la tarjeta).
- Roles nuevos: `conferenciante` y `creacion-web` (etiquetas «Conferenciante» y «Web Creator», como en la tarjeta).
- Medios nuevos `cubo-N` → `public/cubo/cubo-N-420/800.webp` (misma calidad que los actuales). Los `card-N` y sus
  derivados en `public/equipo/` se retiran; los originales antiguos (`assets/images-staff/`,
  `assets/whatsapp/item-cubo/`) se quedan donde están.

### Fase B — Intro plegable y barra de reproducción

- **Plegado (solo ≥ 760 px):** cuando el visitante ha bajado por completo más allá del vídeo (su borde inferior
  queda por encima de la pantalla), el bloque se pliega: queda solo la barra «INTRO — Jornadas de Innovación de
  Almería», y el vídeo, pausado donde iba. El pliegue ocurre fuera de pantalla y se compensa el scroll para que lo
  que se está leyendo no salte. A la derecha de la barra, un botón redondo con el estilo de los controles del vídeo
  y una flecha que apunta hacia abajo: despliega (con una transición de altura) y reanuda la reproducción donde iba.
  Si se vuelve a bajar más allá, se vuelve a plegar. En móvil (< 760 px) no hay pliegue.
- **Barra de reproducción (todas las anchuras):** sobre el vídeo, abajo, una franja con play/pausa, un control
  deslizante para avanzar y retroceder (`input type=range`, accesible con teclado) y el tiempo transcurrido/total.
  El play/pausa sale de la esquina superior derecha (se quedan compartir, pantalla completa, minimizar y sonido).
- Textos nuevos en `lib/content/copy/` («Desplegar el vídeo y reproducirlo», «Avanzar o retroceder el vídeo»).

### Fase C — Talleres en una fila

- **≥ 760 px:** una sola fila de 3 tarjetas que se desplaza (scroll-snap, de tarjeta en tarjeta), con un botón «<»
  a la izquierda y otro «>» a la derecha, con el mismo estilo que las flechas del carrusel móvil. Las tarjetas
  mantienen su efecto (se elevan y muestran el resumen al pasar el ratón) y su contenido (cartel, título, subtítulo,
  acciones). La tira se puede recorrer con teclado.
- **Fondo:** `assets/images-website/subsection-talleres.png` (2164×727, la mesa de la cantina en acuarela) como fondo
  atenuado de la subsección Talleres en escritorio, derivado a WebP y registrado en `media.ts`.
- **< 760 px:** sin cambios (la baraja).

- **Severidad prevista:** moderada (scroll al plegar; accesibilidad de la barra; recorte de la sombra de las tarjetas
  en la tira). Nada severo ni crítico previsto.

## Status

**EXECUTED** (29-09-2026): fase A 53052bf, fase B 2f8b8fa, fase C 30cbb55; informe en [`docs/prompts-output/[59-0]/report.md`](../prompts-output/[59-0]/report.md). Push pendiente del OK del promotor.

## Alcance y autoridad

- LEVEL 3 (tres fases, un comportamiento nuevo con scroll). Área: frontend. Sin API, BBDD ni seguridad.
- SDS: prácticas 02, 06, 12, 14 y 16. Impeccable como criterio. Textos en `lib/content/copy/`, colores solo con
  tokens, medios en `media.ts`, derivados con `scripts/build-assets.sh`; originales intactos.
- Commits con rutas explícitas; fuera de los commits: `next-env.d.ts`, `assets/downloadable-content/` y el zip.
- Un commit al terminar cada fase (A, B, C). **Push: el promotor no lo ha pedido; se le pregunta al terminar.**
- Tmp/scratch: N/A (una sesión; el estado queda en este prompt y en los commits de fase).

## Ejecución

1. **A:** versionar los 49 PNG; `build-assets.sh` genera `public/cubo/` desde `assets/cube-staff-final/*.png`;
   `media.ts` con `cubo-N`; `people.ts` con las 49 tarjetas (personas nuevas incluidas, `cardRoleLabel` literal);
   `assemble.ts` muestra en el cubo a toda persona con tarjeta, en el orden de su número. Retirar `card-N`.
   Verificar: `check:content`, el cubo tiene 49 caras, no queda ninguna referencia a `/equipo/`. Commit.
2. **B:** pliegue y barra en `IntroVideo`. Verificar en Chrome: bajar más allá → subir → plegado y pausado; botón →
   desplegado y reproduciendo desde el mismo segundo; sin salto de scroll; la barra avanza y retrocede con ratón y
   teclado; a 390 px sin pliegue. Commit.
3. **C:** fila única con flechas laterales y fondo. Capturas a 1440, 1024 y 390 px. Commit.
4. Informe en `docs/prompts-output/[59-0]/report.md`, commit, y preguntar por el push.

## Corrección en ejecución (promotor, chat, 29-09-2026)

> «La imagen utilizada en TALLERES, que en escritorio se vea un 20 % menos, más suave.»

- El fondo de Talleres pasa de una opacidad del 55 % al 44 % (un 20 % menos), solo desde 760 px, donde es el único
  sitio en que se muestra (`components/site/Section.module.css`, `.backdrop`). Comprobado con captura a 1440 px.
