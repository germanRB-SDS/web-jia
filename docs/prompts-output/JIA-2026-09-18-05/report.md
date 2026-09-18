# JIA-2026-09-18-05 — «Las jornadas»: foto a la izquierda, panel de texto a la derecha

**Prompt:** `docs/prompts/JIA-2026-09-18-05-jornadas-foto-izquierda-panel-derecha.md` · **Fecha:** 2026-09-18

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Velo | Empieza al 0 % sobre el vaquero y el valle (transparente hasta el 38 % del ancho), sube al 55 % y termina en Duna sólida justo donde empieza el panel, de modo que foto y panel son una sola superficie sin costura. En móvil el mismo velo va de arriba (0 %) a abajo (Duna) hacia el panel. | `components/site/Jornadas.module.css` (`.veil`) |
| Composición | Rejilla 58/42 en escritorio como «Servicios» de maryna-ventura, invertida: fotografía a sangre a la izquierda, panel sólido de Duna a la derecha con título y párrafo (mismas voces que el resto de secciones). Sin flechas ni carrusel. Móvil: foto arriba, panel debajo. | `Jornadas.tsx`, `Jornadas.module.css` |
| Cartel | Variante `size="small"` de la tarjeta pinchada (10 rem), bajo el párrafo, girada −2°; sigue abriéndose a tamaño completo con clic, teclado o toque. | `components/site/PosterCard.tsx/.module.css` |

## Verificación

- `tsc --noEmit` y `next build`: OK. Capturas a 1440 y 390 en `evidence/`.

## Riesgos

- Sin cambios respecto a la ronda anterior (imagen aportada sin licencia documentada). Sin críticos.
