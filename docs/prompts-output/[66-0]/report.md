# [66-0] «¡Ver el corto completo!» con el corto de Google Drive · informe de fase

- Prompt: `docs/prompts/[66-0]corto-completo-drive.md` · LEVEL 2 · área `frontend`
- Commits: `99a5d0c` (prompt) · `75ca60d` (implementación) · tmp/: N/A (una fase corta)
- Rollback (si la estética no convence): `git revert 75ca60d`. Para quitar solo el botón sin revertir:
  `JORNADAS_FULL_SHORT_EMBED = null` en `lib/content/sections/jornadas-intro-video.ts`.

## Resumen

- Bajo el clip de Intro, una segunda franja de tinta (los «créditos») gemela de la barra superior, con el botón
  primario de cuero «¡Ver el corto completo! ▸». Va dentro del pliegue: en escritorio se pliega con el vídeo.
- El botón abre un `<dialog>` modal con el mismo fondo que el visor del rollo: el reproductor `/preview` de Drive en
  16:9 (hasta 1280 px; 344 px de ancho en un móvil de 390), una X redonda en la esquina y, debajo, el enlace
  «¿No arranca? Ábrelo en Google Drive». El iframe solo existe mientras el diálogo está abierto: no se pide nada a
  Google hasta que el visitante quiere ver el corto, y al cerrar se detiene la reproducción.
- El clip se pausa al abrir y sigue al cerrar si se estaba viendo. Se cierra con la X, con Escape o pulsando fuera.

## Verificación

- `…/preview` responde 200 sin sesión y sin `X-Frame-Options`; el sitio no tiene CSP que lo bloquee.
- tsc PASS · check:content PASS · next build PASS.
- CDP 1440/390: iframe 1280×720 / 344×194, foco en «Cerrar el corto», clip en pausa, 0 iframes tras cerrar;
  el reproductor de Drive carga y muestra su botón de reproducción (`evidence/`).
- Verification: V1. No se reprodujo el corto entero ni se probó en un iPhone real.

## Riesgos moderados y soluciones

1. **Cuota de Drive.** Si muchas personas lo ven a la vez, Drive puede mostrar «se ha superado la cuota». El enlace de
   rescate no lo evita. Solución: subirlo a YouTube (oculto) y cambiar solo `EMBED`/`LINK`.
2. **Nombre del archivo visible.** El reproductor de Drive muestra «Copia de juntocorregido.mp4» al pasar el ratón.
   Solución (promotor): renombrarlo en Drive, p. ej. «JIA26 · Aulas de cine: el duelo».
3. **Interfaz y cookies de Google** dentro de la ventana (botón «abrir en una ventana nueva» de Drive). Solo al
   abrirla, nunca al cargar la página. Destino: decisión del promotor si se añade un aviso de cookies.
4. **La estética la decide el promotor**; rollback de un solo commit, o `EMBED = null`.

## Riesgos severos/críticos

Ninguno nuevo: sin backend, auth ni secretos. El archivo ya era público por enlace. Nada subido a `origin`.

## Hotfix on the fly 1

- Las dos franjas de cine de Intro miden lo mismo: la de abajo (botón de 48 px + relleno) manda; variables
  `--intro-band-pad` / `--intro-band` en `IntroVideo.module.css`. Medido: 88/88 px a 1440, 76/76 px a 390.
- Estepicursores en la barra superior, por detrás de las palabras: el mismo campo GSAP del pie
  (`tumbleweeds/tumbleweed-field.ts`), cargado la primera vez que la barra entra en pantalla, parado fuera de ella,
  nunca con movimiento reducido (también en móvil: aquí es ambiente, no depende del hover). Tamaño ligado a la
  franja (`.weedScale`, 60 % de su altura), tonos cobre/duna/arena al 85 %. Etiqueta «Intro» y botón de desplegar
  quedan por encima. Verificación: tsc, next build PASS; CDP 1440/390 (`evidence/hotfix1-barra-*.webp`).
- Riesgo moderado: animación continua mientras la barra está visible (≤ 8 elementos GSAP, solo transform).
  Destino: aceptado; se apaga fuera de pantalla y con movimiento reducido.
