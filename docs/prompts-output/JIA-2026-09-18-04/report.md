# JIA-2026-09-18-04 — «Las jornadas» con el jinete, velo degradado y cartel encajado

**Prompt:** `docs/prompts/JIA-2026-09-18-04-jornadas-jinete-velo-cartel.md` · **Fecha:** 2026-09-18

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Avisos de no disponibilidad | Quitados los dos textos. El botón deshabilitado se mantiene; la nota bajo una acción sin URL es ahora opcional (`unavailable: null`). | `lib/content/copy/es/sections/propuestas.ts`, `acoge.ts`, `copy/types.ts`, `scripts/check-content.ts` |
| Imagen y velo | La foto del jinete (`assets/images-website/jornadas-jinete.png`, 1916×821) va a sangre detrás de la apertura de Jornadas. Encima, el velo: degradado horizontal con dos tonos nuevos muestreados de la muestra aportada, **Duna** `#c0ac94` y **Duna clara** `#ddccb5`, con opacidad 0,93 a la izquierda (donde está el texto) y 0,16 a la derecha (donde se abre el valle y el camino), más un fundido corto a papel en el pie para entrar en las hojas del cuaderno. En móvil el velo es vertical: claro arriba, denso donde va el texto. | `app/theme/palette.css`, `components/site/Jornadas.module.css` (`.veil`) |
| Título y párrafo | «Las jornadas» usa la misma voz que «Tu propuesta puede formar parte de las JIA» (Rokkitt, `--t-h2`, tinta); el párrafo la misma que el de Dosieres (Alegreya, `--t-lede`, tinta de lectura). El fondo de la sección pasa de tinta a Duna. | `Jornadas.module.css` (`.bandTitle`, `.statement`) |
| Cartel | Tarjeta pinchada con chincheta, girada 2,5° en reposo; al pasar el cursor o enfocar se endereza y se levanta, y aparece «Ver cartel». Al pulsar (ratón, teclado o toque) se abre a tamaño completo en el mismo diálogo de las fichas (Escape cierra, el foco vuelve). En táctil el botón está siempre visible. | `components/site/PosterCard.tsx/.module.css` |
| Impeccable | Pase de pulido sobre capturas: opacidad del velo afinada para que la foto se lea sin perder contraste del texto; hover del cartel verificado con puntero real. | — |

## Verificación

- `tsc --noEmit`, `check:content` (48 medios) y `next build`: OK.
- Capturas en `evidence/`: banda de Jornadas (1440 y 390), cartel en hover, Acoge sin aviso.
- No verificado con ratón físico: la apertura del cartel en diálogo (probada por código y con el mecanismo ya verificado de las fichas).

## Riesgos

- Moderado: la imagen del jinete la aporta el promotor sin origen ni licencia documentados (registrado en `media.ts`).
- Moderado: sin nota bajo el botón deshabilitado, el visitante no sabe por qué no funciona; el estado visual (borde discontinuo, texto apagado) es la única pista.
- Sin críticos nuevos.
