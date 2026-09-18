# JIA-2026-09-18-20 — Pie: estepicursores que cruzan la franja del crédito mientras se pasa el ratón por él

**Prompt:** `docs/prompts/JIA-2026-09-18-20-pie-estepicursores-al-pasar-por-el-credito.md` · **Fecha:** 2026-09-18 ·
**Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

## Resumen

- **GSAP**, no three.js: son unos pocos elementos 2D; GSAP ya es dependencia y el módulo se carga con el primer hover.
- `components/site/tumbleweeds/`: `config.ts` (todos los ajustes), `tumbleweed-field.ts` (nacimientos, rodadura,
  saltos, rachas, limpieza) y `StudioStrip.tsx` (la franja del pie como componente cliente: enlace + capa decorativa).
- Cada estepicursor es un SVG generado (dos aros irregulares y 12–18 ramas) en cobre, duna y línea de la paleta.
  Nace a una profundidad aleatoria: tamaño 80 % → 15 % del logotipo, base 0 → 70 % de la franja, velocidad
  150 → 48 px/s, opacidad 1 → 0,5. Gira lo que avanza (ángulo = distancia / radio), salta cada 0,9–2,6 s con un
  rebote corto, y una racha hace oscilar su velocidad (×0,75–1,35).
- Disparo: puntero (no táctil) o foco de teclado sobre el enlace del crédito; el primero sale al instante y los
  siguientes tras 2–5 s; al salir no nacen más y los vivos terminan. Máximo 8 a la vez. Con
  `prefers-reduced-motion` no se carga nada. La capa es `aria-hidden`, sin eventos, por detrás del enlace.

## Verificación (Chrome real por CDP, 1440 px)

Nacimientos a 0,2 s, 4,7 s y 9,4 s de hover (esperas de 4,5 y 4,7 s). Tamaño máximo visto 0,48 × logotipo (tope
0,80); base máxima 0,54 × franja (tope 0,70); 0 retrocesos en x. Tras salir el ratón: 0 nacimientos en 6,5 s y la
capa queda vacía a los 20 s. Sin errores de consola. `tsc`, `check:content`, `next build`: OK. Captura en `evidence/`.

## Riesgos

- **Moderado:** los del fondo miden 4–5 px (15 % de un logotipo de 32 px), casi un punto; es lo que pide el tope.
  Si se quieren más legibles, subir `size.back` en `config.ts`.
- **Moderado:** en táctil no hay animación (sin hover), por diseño.
- Sin severos ni críticos.
