# JIA-2026-09-18-02 — Fundido del hero, paleta de hover, cursor SDS y footer

**Prompt:** `docs/prompts/JIA-2026-09-18-02-hero-fundido-paleta-cursor-footer.md` · **Fecha:** 2026-09-18

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Fundido del hero | Eliminado el fundido inferior: la fotografía llega hasta la regla de la siguiente sección. El fundido izquierdo ya no es un degradado recto: una máscara SVG (gradiente desplazado con ruido fractal) reproduce el borde irregular, «rasgado», del render `hero-3.png`. | `app/globals.css` (`--hero-dissolve`), `components/site/Hero.module.css` |
| Color de hover | Nuevo token **Arena profunda** `#e2cfb2` (`--jia-sand-deep`), un paso por debajo de arena y por encima de línea. Se usa en los atajos bajo el hero, el submenú, el botón secundario y «Cerrar» del diálogo. Papel `#f1e7d8` y tinta JIA `#2f180b` intactos. | `app/theme/palette.css` + los cuatro módulos CSS |
| Fichas demo | Recuperados los sólidos oliva y cobre (con grano y chincheta, la «variante acorde»). El segundo panel de Acoge vuelve a oliva. | `lib/content/data/experiences.ts`, `lib/content/sections/acoge.ts` |
| Cursor | Portada la «marca de registro» de `south-desert-main-web` (`assets/js/cursor.js` + CSS) como componente cliente. Colores JIA: aro en tinta secundaria, punto en tinta JIA, cruz en terracota al pasar sobre elementos accionables. Solo puntero fino y sin `prefers-reduced-motion`; táctil conserva el nativo. | `components/site/CursorMark.tsx` + `.module.css`, `app/layout.tsx`, `app/globals.css` |
| Footer | Quitados el aviso «Boceto de trabajo…» y «Volver arriba». «Centro del Profesorado de Almería» → «CEP de Almería» (organizador, crédito, texto del equipo). Títulos de columna de 12 px a 14 px. Sin marca «provisional» en Organiza/Colabora. | `lib/content/copy/es/common.ts`, `site.ts`, `data/organizations.ts`, `SiteFooter.tsx/.module.css` |

Nota de trazabilidad: la identidad §2 cita «Centro del Profesorado de Almería» como denominación oficial; la forma corta la pide el promotor y queda registrada en `provenance.note`.

## Verificación

- `tsc --noEmit`, `check:content` (46 medios) y `next build`: OK.
- Capturas (`node scripts/qa-screenshots.mjs`, ahora con una toma `desktop-hover` que mueve el puntero real sobre «Programa»): hero a 1440 y 390, hover, footer y fichas demo en `evidence/`.
- La toma `desktop-hover` muestra el hover en arena profunda y la marca de cursor abierta (aro terracota con cruz) sobre «Programa». No probado con ratón físico en navegador real.

## Riesgos

- Moderado: la máscara SVG con `feDisplacementMap` se rasteriza por el navegador en cada tamaño; en Safari antiguo puede degradar a borde recto. Sin efecto en contenido.
- Moderado: «CEP de Almería» contradice la denominación oficial citada en la identidad; decisión del promotor, registrada.
- Sin críticos nuevos.
