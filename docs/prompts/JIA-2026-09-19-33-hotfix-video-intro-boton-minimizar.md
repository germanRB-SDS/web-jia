# JIA-2026-09-19-33 — Hotfix: botón «minimizar» (vídeo en ventana flotante) en la intro de «Las jornadas»

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat, con captura (el navegador ya ofrece su propio botón
flotante de «imagen en imagen» sobre el vídeo). **Nivel:** LEVEL 1 (hotfix; resultado dentro) · tmp/scratch: N/A.
**Estado:** EJECUTADO (2026-09-19); guardado junto con su ejecución (petición encadenada por chat).

## Encargo (palabras del promotor)

«El vídeo tiene un botón de "minimizar" y reproducir minimizado → ¿se puede poner como botón **entre el botón de
pantalla completa y el de volumen**? Con el **mismo estilo de botón** y el **mismo padding entre botones**.»

## Resultado

- `IntroVideo.tsx`: control nuevo entre pantalla completa y sonido, con la misma clase `.control` (redondo, 44 px,
  separación de 10 px igual que el resto: 1178 · 1232 · 1286 · 1340). Usa la API estándar **Picture-in-Picture**
  (`video.requestPictureInPicture()` / `document.exitPictureInPicture()`); solo se pinta donde el navegador la tiene
  (`document.pictureInPictureEnabled`: Chrome, Edge, Safari; Firefox no la expone y ahí no aparece).
- Minimizado, el vídeo **sigue reproduciéndose aunque la página se desplace** (antes se pausaba al salir de pantalla);
  al devolverlo a la página estando fuera de pantalla, descansa como siempre. El estado sigue a los eventos del
  propio vídeo (`enter/leavepictureinpicture`), así que también responde al cierre desde la ventana flotante. Si
  estaba a pantalla completa, sale antes de minimizar.
- Iconos nuevos `PictureInPictureIcon` / `PictureInPictureExitIcon` (misma rejilla y trazo). Textos en
  `copy/es/buttons.ts`: «Ver el vídeo minimizado, en una ventana flotante» / «Devolver el vídeo a la página».
- Verificado en Chrome (CDP, 1440): orden y separación; clic → `pictureInPictureElement` activo, `aria-pressed=true`;
  scroll arriba → sigue reproduciéndose; salir estando fuera de pantalla → pausa. Consola limpia. `tsc`,
  `check:content`, `next build` en verde. Evidencia: `docs/prompts-output/JIA-2026-09-19-33/evidence/`.
- Nota: el botón flotante propio de Edge sobre el vídeo lo pinta el navegador; no se puede quitar sin desactivar la
  función (`disablePictureInPicture`), que dejaría sin efecto este botón. Sin probar en iPhone (Safari iOS usa su
  propio reproductor para esto).
