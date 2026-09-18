# JIA-2026-09-18-09 — Talleres como constantes y paradas dinámicas, botón circular de repetir, pie sin JIA26 y crédito South Desert Studio

**Prompt:** `docs/prompts/JIA-2026-09-18-09-talleres-paradas-dinamicas-footer.md` · **Fecha:** 2026-09-18 · **Agente:** Claude Code ·
**Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Talleres | `NUMERO_DE_TALLERES = 6` y `TALLER_1…TALLER_6` con los nombres dictados; `TALLERES` toma las N primeras y falla en build si N supera las constantes. El recorrido dibuja una parada por taller y muestra su nombre. | `lib/content/config/talleres.ts`, `assemble.ts` |
| Paradas dinámicas | Cada disposición define «slots» (tramo recto + Y de pantalla + prioridad). Con N talleres se toman las N prioridades más bajas y se reordenan por el sentido de marcha; todas las Y son distintas dentro de la disposición (medido en escritorio: 314/238/248/196/143/90 px). Capacidad 8 sin degradación; con más, reparto uniforme con aviso. | `components/site/jornadas-route/config.ts`, `route-scene.ts` |
| Trazado | Nueva forma en «N» de abajo-izquierda a arriba-derecha: tramo ascendente a la izquierda, curva amplia, diagonal descendente, curva amplia, tramo ascendente a la derecha (radios ≥ 12 u, dirección tope 35°). Escala del carruaje por disposición (5,2 escritorio / 4,6 móvil). | `config.ts` |
| Etiquetas | Nombres de taller en Barlow, mayúsculas con tracking reducido, ajuste a 2–3 líneas con ancho máximo por disposición; siempre a la derecha del disco. | `JornadasRoute.tsx`, `.module.css` |
| Controles | Sin «Pausar/Reanudar». «Repetir recorrido» pasa a botón circular solo icono (`ReplayIcon`, familia Tinta de frontera) con `aria-label`, visible al terminar. | `JornadasRoute.tsx`, `components/icons/index.tsx` |
| Espera | Parada de 0,85 s → 0,42 s. | `config.ts` |
| Pie | Retirado el distintivo #JIA26 (los datos `brand.badge` y el archivo siguen). Colofón bajo la línea: marca de South Desert Studio (copiada de maryna-ventura a `public/brand/`) + «Diseñado por South Desert Studio» con el shimmer del estudio sobre el nombre y enlace externo a southdesertstudio.com; sin animación con movimiento reducido. | `components/site/SiteFooter.tsx/.module.css`, `lib/content/site.ts` (`productionStudio`), `copy/es/common.ts` |
| QA | Script actualizado: prueba del botón de repetir, conteo y Y de las paradas, comprobación del pie, tablet solo estado inicial. | `scripts/qa-route.mjs`, `evidence/` |

## Verificación

- `tsc --noEmit`, `check:content`, `next build`: OK. Consola sin errores (el único aviso es el del test con GLB bloqueado, esperado).
- Medido (`evidence/qa-route-report.json`): 6 paradas; Y distintas; botón de repetir sin texto, con SVG y nombre accesible; tras pulsarlo, 0 etiquetas y estado `playing`; pie: 0 imágenes del distintivo, enlace al estudio con texto «Diseñado por South Desert Studio».
- Capturas: escritorio y portátil (inicio, parada 3, final), móvil (inicio, parada 3, final), tablet (inicio), movimiento reducido, sin GLB, pie.
- **No verificado con herramienta:** el recorrido completo en tablet (render por software demasiado lento; el componente se limita a 36 rem en una columna) y el comportamiento con N = 8 (el mecanismo de slots está implementado y documentado; no se ha probado cambiando la constante).

## Riesgos

- Moderado: dos nombres dictados difieren de los transcritos de los carteles (`data/workshops.ts`): «Dos renders, un destino» / «Dos renders y un destino» y «El bueno, el feo y el plano» / «El bueno, el feo… y el plano». Decisión del promotor: unificar en una u otra fuente.
- Moderado: los tres tonos del shimmer del estudio son HEX ajenos a la paleta JIA (excepción documentada en el CSS, como en maryna-ventura).
- Sin severos ni críticos nuevos.

## Siguiente paso

Confirmar los nombres definitivos de los talleres y, si procede, unificar `data/workshops.ts` con `config/talleres.ts`.
