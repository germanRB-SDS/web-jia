# JIA-2026-09-19-26 — Hotfix: sombra en las tarjetas de colaboradores, costura Experiencias→Propuestas y pantalla completa del vídeo

**Fecha:** 2026-09-19 · **Origen:** tres mensajes del promotor en chat (dos con captura).
**Nivel:** LEVEL 1 (tres ajustes acotados de presentación; sin informe de fase aparte: el resultado va aquí).

## Encargo

1. La tarjeta del carrusel de colaboradores (`CollaboratorsCarousel` › `.card`): una ligera sombra,
   «como si la luz estuviera encima de la tarjeta».
2. La sección Acoge tiene arriba un degradado desde el color de su fondo hacia su fotografía. Usar el
   mismo efecto en la costura anterior a «Tu propuesta JIA», pero hacia arriba: en la parte de abajo de la
   imagen de Experiencias, fundiendo hacia el color de Propuestas.
3. En el vídeo de intro, con el mismo estilo de botón y la misma separación que los dos existentes, un
   botón para maximizar el vídeo (pantalla completa).

## Resultado

- **Tarjeta con luz cenital.** La sombra pasa de una sola ambiental a un modelado de cuatro capas: filo
  superior iluminado (marfil 22 %), borde inferior en sombra, sombra de contacto corta (1 px / 2 px) y la
  ambiental larga que ya existía. La fotografía queda un escalón por debajo del marco: un `::after` sobre
  `.image` con sombra interior en el borde superior y un filete de tinta al 12 %. Sin cambios de medidas.
- **Costura Experiencias → Propuestas.** Solo a ≥ 1280 px, donde la fotografía del aula ocupa toda la
  sección y toca a Propuestas: `.photo::after` con un degradado hacia arriba (22 % de alto) desde el color
  de arranque del fondo de Propuestas. Ese fondo (`--jia-bg-deep`) es en sí un gradiente y un gradiente
  no puede ser parada de otro (la regla se descartaba entera), así que se toma su color superior:
  `color-mix(in srgb, var(--jia-sand-deep) 72%, var(--jia-vellum-5))`. Por debajo de 1280 px la foto ya
  se funde con el fondo de Experiencias y no linda con Propuestas: no aplica.
- **Pantalla completa.** Tercer botón redondo, el primero por la izquierda, mismo `.control` y mismo hueco
  (0,625 rem). Iconos nuevos en la familia (`FullscreenIcon` / `FullscreenExitIcon`, cuatro esquinas que
  se abren o se cierran, trazo 4 como el resto de controles). Se pone a pantalla completa el marco del
  vídeo, no el `<video>`, para que los propios botones sigan en pantalla; el marco pierde el límite de
  alto y el vídeo se ve entero (`contain`) sobre tinta. En iOS Safari (sin API de elemento) se usa el
  reproductor nativo con `webkitEnterFullscreen`; si no hay ninguna API, el botón no se muestra. El estado
  sigue a `fullscreenchange` (también al salir con Esc). Textos accesibles en `lib/content/copy/es/buttons.ts`:
  «Ver el vídeo a pantalla completa» / «Salir de pantalla completa».
- Comprobado en Chrome real a 1440 y 390 px (capturas en `docs/prompts-output/JIA-2026-09-19-26/evidence/`);
  los tres botones responden con sus etiquetas. `tsc`, `check:content` (56 medios) y `next build`: OK.

## Riesgos

- **Moderado:** la salida de pantalla completa por iOS nativo no dispara `fullscreenchange`; el botón
  no cambia de estado allí, pero el reproductor nativo ya trae su propio cierre. *Propuesta:* probar en
  un iPhone real antes de publicar.
- **Menor:** la sombra interior sobre la fotografía oscurece 2–5 px del borde superior de cada logotipo;
  ninguno de los seis llega a esa franja.
