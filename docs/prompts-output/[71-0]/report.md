# [71-0] Informe — «El cierre de Tizaseca»

- Fecha: 2026-11-03 · Prompt: `docs/prompts/[71-0]el-cierre-de-tizaseca.md` · Estado: implementado, pendiente de
  validación visual del promotor; **sin push ni despliegue** (igual que [70-0]).

## Resumen

- Sección nueva `#cierre` entre «Dispara tu centro.» (`#acoge`) y «Quiénes somos» (`#socios`), comprobado el orden en
  el DOM a 1440 y 390.
- Misma anatomía que «Tu propuesta JIA»: título, subtítulo «Hasta el próximo duelo», tres párrafos con la flecha
  dibujada hacia el botón y foto a la derecha (53 %, a sangre, sin velo); desde 1280 px, la misma altura de banda. En
  < 900 px la foto va bajo el título, recortada a 5:4 por la derecha.
- Fondo `--jia-vellum-4`, el mismo en que acaba Acoge y empieza Socios: sin costuras (`evidence/costuras-*.png`).
- Botón de cuero «Ver el aftermovie ▶» → YouTube `wBjSQhmkqe8` en otra pestaña.
- Vídeo retirado o sin URL: la pulsación no navega y despliega bajo el botón una nota explicativa (cerrable, Escape).
  La comprobación vive ahora en `lib/media/use-youtube-check.ts`, compartida con la franja de inauguración de [70-0].
- Foto original versionada en `assets/images-website/cierre-tizaseca.png`; variantes `public/cierre/*.webp` (44 y
  125 KB) desde `scripts/build-assets.sh`; entrada `cierre-tizaseca` en `media.ts` con procedencia.
- No se añade al menú principal (no se pidió).

## Verificación

- `npx tsc --noEmit` OK · `npm run check:content` OK (100 media) · `npx next build` OK.
- CDP a 1440 y 390 contra el `next dev` del promotor (puerto 3000): `evidence/qa.mjs` → `qa.json` + capturas. Sin
  errores de consola propios.

## Riesgos (moderados o superiores)

- **Moderado — texto editorial propuesto.** Escrito sin cifras ni hechos no facilitados, en la voz del sitio; marcado
  `provisional`. Requiere el visto bueno del promotor (y confirmar que «Tizaseca» es el pueblo de la narrativa).
- **Moderado — detección de vídeo retirado** basada en la miniatura de YouTube (igual que [70-0]); si falla, degrada a
  enlace normal.
- **Moderado — licencia de la imagen** por confirmar (como el resto de imágenes del promotor).
- Sin riesgos graves o críticos. Rollback: revert del commit de implementación de [71-0].
