# JIA-2026-09-18-13 — Camino uniforme con círculos, Talleres sin texto, «Descargar dosier» y hover legible

**Prompt:** `docs/prompts/JIA-2026-09-18-13-camino-uniforme-circulos-talleres-sin-texto.md` · **Fecha:** 2026-09-18 ·
**Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 1 · tmp/scratch: N/A.

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Camino | Mismo trazado con lazo; ancho constante y paradas circulares (`handDrawn: { width: 0, disc: 0 }`; los mandos siguen ahí por si se quiere volver). | `components/site/jornadas-route/config.ts` |
| Talleres | Eliminadas la entradilla («Cada taller lleva nombre de película…») y la pista («Pasa el cursor…») del render, del modelo y (la entradilla) del copy. La pista compartida sigue en Experiencias, que no se pidió tocar. La marca de provisional solo aparece si las marcas están activas. | `Jornadas.tsx`, `assemble.ts`, `copy/*` |
| Descargar dosier | Bajo «Ver ficha» en cada tarjeta de taller. Enlaces en `TALLER_1_DOSIER … TALLER_6_DOSIER` (hoy `null`): sin enlace se muestra en tono apagado con «Dosier disponible próximamente» (title + lector de pantalla), nunca un botón muerto; al pegar la URL pasa a enlace real en pestaña nueva. Icono `DownloadIcon` de la familia. | `lib/content/config/talleres.ts`, `SheetCard.tsx/.module.css`, `icons`, `copy/es/buttons.ts` |
| Hover del botón | El botón no disponible («Quiero acoger las JIA») ya oscurecía el fondo en hover; ahora el texto pasa a marfil (`--jia-ivory`, el token de texto sobre botón oscuro). | `components/primitives/Action.module.css` |

## Verificación

`tsc`, `check:content`, `next build`: OK. Medido sobre el export: sin entradilla ni pista en `#talleres`; 6 «Descargar
dosier», todos por debajo de «Ver ficha»; ninguno en Experiencias. Capturas: `evidence/camino-desktop.png`,
`camino-mobile.png`, `talleres-desktop.png`.
**No verificado con herramienta:** el estado hover del botón (regla CSS de mayor especificidad que la base; sin captura) y
el dosier con URL real (no hay ninguna todavía).

## Riesgos

- Moderado: el orden de `TALLER_N_DOSIER` va ligado al de `data/workshops.ts` por posición; si se reordenan talleres hay
  que reordenar ambos. *Propuesta:* pasar a un mapa por id si crece.
- Moderado: enlaces de Drive abren el visor, no descargan; para descarga directa usar el enlace `uc?export=download` o
  alojar el PDF en `public/`.
- Sin severos ni críticos.
