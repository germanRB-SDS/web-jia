# [58-0] «Tu propuesta JIA»: nueva hoguera y «Comunica tu idea»; Talleres vuelve a la rejilla fuera del móvil

## PREFACE — NON-EXECUTABLE

Prompt del promotor (chat, 29-09-2026), refinado y aterrizado a `web-jia` tras inspeccionar el repositorio. Esta
sección es memoria: **execute from `## Status` onward**.

> «Utiliza esta imagen como reemplazo de la imagen de la section "TU PROPUESTA JIA". Cambias el botón de DISPARA TU
> IDEA en esa misma section por "COMUNICA TU IDEA". Pero volvemos atrás: los talleres en pantalla completa que se
> vean como estaban antes de hacer el cambio de la baraja. En móvil se ven como una baraja, pero en el resto de
> resoluciones no: como estaba.»

- **Imagen:** la adjunta es `assets/images-website/hoguera-02.png` (sin versionar, 1672×941, RGB). Tiene la misma escena y
  el mismo encuadre que la actual `hoguera-nuevos-temas.png` (media `propuestas-hoguera`); solo cambia la mujer de la
  izquierda. El original anterior se conserva (los originales no se sobrescriben); cambian los derivados
  `public/propuestas/hoguera-960/1672.webp` y el `original` del medio.
  - **A vigilar:** el punto focal `x: 78` (JIA-2026-09-20-47) deja fuera del recorte a la mujer de la izquierda
    (9–24 % del ancho) desde 1280 px. Si la sustitución busca que se la vea, habría que reencuadrar. **No se toca el
    encuadre** sin que lo pida el promotor: se comprueba con capturas y se le pregunta.
- **Botón:** «Dispara tu idea» → «Comunica tu idea» (`lib/content/copy/es/buttons.ts`, `proposals.present`). Se
  pinta en mayúsculas por CSS. Se actualiza el comentario de `lib/content/config/enlaces.ts` que cita el rótulo.
- **Talleres:** se deshace [57-0] (commit a732974) con `git revert`: el móvil conserva la baraja (nunca cambió) y
  desde 760 px vuelve la rejilla de 3×2 con título y subtítulo. [57-0] queda como **no adoptado**.
- **Severidad prevista:** baja. Nada severo ni crítico.

## Status

**PENDING**

## Alcance y autoridad

- LEVEL 1–2 (contenido + reversión de una presentación). Área: frontend. Sin API, BBDD ni seguridad.
- SDS: prácticas 02, 06, 12, 14 y 16. Textos en `lib/content/copy/`; medios en `lib/content/media.ts`; derivados con
  `scripts/build-assets.sh`.
- Commits con rutas explícitas; `next-env.d.ts` y `assets/downloadable-content/` (del promotor, ajeno a este encargo)
  fuera de los commits. El promotor pidió commit y ejecución, sin mencionar el push: se le pregunta al terminar y,
  con su OK, se sube con `sds-dev-governance/scripts/git-safe-push.sh origin main`.

## Ejecución

1. **Talleres:** `git revert a732974`. En `[57-0]`, `Status` = no adoptado, revertido por [58-0]; se borra su
   carpeta de evidencias sin versionar.
2. **Imagen:** versionar `hoguera-02.png`; en `build-assets.sh`, los derivados de la hoguera salen de ella (misma
   calidad); en `media.ts`, `original` y licencia (aportada el 29-09-2026) apuntan a ella. Regenerar solo esos dos
   WebP.
3. **Botón:** `proposals.present = "Comunica tu idea"`; actualizar el comentario de `config/enlaces.ts`.
4. **Verificación:** `tsc`, `check:content`, `next build`; `out/index.html` contiene «Comunica tu idea» y no
   «Dispara tu idea»; capturas de la sección a 1440 y 390 px y de Talleres a 1440 (rejilla) y 390 (baraja).
5. Commits por fase, informe en `docs/prompts-output/[58-0]/report.md` y commit del informe. Push solo con el OK del
   promotor.
