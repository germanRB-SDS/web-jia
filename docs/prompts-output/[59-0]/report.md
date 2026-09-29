# [59-0] Informe — Cubo final, intro plegable con barra de reproducción, Talleres en una fila con fondo

**Estado:** EXECUTED (29-09-2026). Prompt: [`docs/prompts/[59-0]cubo-final-intro-plegable-y-talleres-en-una-fila.md`](../../prompts/[59-0]cubo-final-intro-plegable-y-talleres-en-una-fila.md).
Tmp/scratch: N/A. Commits: 3f9a8b5 (prompt) · 53052bf (A) · 2f8b8fa (B) · 30cbb55 (C) · informe.

## Resumen

- **A — Cubo:** muestra exactamente las 49 tarjetas de `assets/cube-staff-final/` (10–58), en su numeración y con el
  arranque aleatorio de siempre («14 de 49» en la captura). Cada tarjeta se leyó una a una (`evidence/cubo-lectura-*`).
  Los 9 talleristas entran en el cubo; 11 personas nuevas (Rafa Fortis, Javier Montoya, Nerea Mazuecos, Germán Roche y
  7 colaboradores jóvenes); roles nuevos `conferenciante` y `creacion-web`. Salen las 7 de «Experiencia de éxito»
  (siguen en los datos, sin tarjeta). Medios `cubo-N` → `public/cubo/` (98 WebP, 6,9 MB); `card-N` y `public/equipo/`
  retirados. Los 49 PNG originales se versionan (189 MB); el zip, que es su archivo comprimido, no.
- **B — Intro:** desde 760 px, al bajar más allá del vídeo se pliega a su barra «INTRO — Jornadas de Innovación de
  Almería», pausado donde iba; a la derecha, un botón redondo (estilo de los controles del vídeo) con la flecha hacia
  abajo, que despliega con transición y reanuda desde el mismo segundo. El pliegue ocurre fuera de pantalla y se
  compensa el scroll. En móvil no se pliega. Sobre el vídeo, abajo, una barra con play/pausa, un deslizador para
  avanzar/retroceder (con texto accesible «0:05 de 4:32») y el tiempo (oculto en móvil); el play/pausa ya no está
  arriba a la derecha.
- **C — Talleres:** desde 760 px, una fila de 3 que se desplaza de tarjeta en tarjeta, con «<» a la izquierda y «>» a
  la derecha (desactivadas en los extremos), a la altura del centro de los carteles. Las tarjetas conservan cartel,
  título, subtítulo, acciones y su efecto al pasar el ratón. Debajo, `subsection-talleres.png` a sangre, atenuada
  (55 %) y fundida arriba y abajo. En móvil, la baraja de siempre.

## Verificación

- `npx tsc --noEmit`, `npm run check:content` (56 personas, 89 medios), `npx next build`: OK. `out/index.html`
  referencia las 49 tarjetas `cubo-N` y ninguna de `/equipo/`.
- Intro en Chrome (1440): en pantalla reproduciendo → bajar más allá: plegado, pausado en 6,04 s, lo que se lee no se
  mueve (281 → 281 px) → subir: sigue plegado → botón: desplegado y reproduciendo desde 6,04 s → deslizador a 5 s: OK.
  A 390 px: sin pliegue, pausa/reanuda al salir/entrar como antes.
- Talleres en Chrome (1440): inicio [1,2,3], «<» desactivada → «>» ×3: [2,3,4], [3,4,5], [4,5,6] y «>» desactivada
  → «<»: [3,4,5]. La tira es alcanzable con el teclado.

## Riesgos (moderado / severo / crítico)

- **Moderado — tamaño del repositorio:** los 49 originales suman 189 MB (unos 4 MB cada uno, ninguno pasa el límite de
  GitHub). El push será largo. *Propuesta:* si molesta, mover los originales a Git LFS o fuera del repo.
- **Moderado — rótulos transcritos tal cual:** Nerea Mazuecos y cuatro de las jóvenes llevan «Colaborador» impreso.
  Figuran como `provisional`. *Propuesta:* confirmarlo con el promotor.
- **Moderado — el pliegue depende del scroll:** se ha probado en Chrome. Safari no tiene anclaje de scroll y aquí la
  compensación es propia, así que debería comportarse igual, pero no se ha probado en Safari real.
- **Moderado — en móvil la barra de reproducción ocupa parte del vídeo**, que es bajo a esa anchura.
- Sin riesgos severos ni críticos.
