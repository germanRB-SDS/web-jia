# JIA-2026-09-18-15 — Fondos: un sistema de degradados casi imperceptibles que desemboca en #ece2d2

**Prompt:** `docs/prompts/JIA-2026-09-18-15-fondos-sistema-de-degradados-sutiles.md` · **Fecha:** 2026-09-18 ·
**Agente:** Claude Code (criterio `/impeccable`, refinamiento) · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 ·
tmp/scratch: N/A.

## Estrategia

El papel de la página pasa a ser **un único suelo continuo** en vez de bloques de color. La referencia del hero (papel
que se abre y una luz marfil en una esquina) se traduce en una escala de pergamino de cinco pasos y tres recetas; las
superficies vecinas comparten el color de su junta, así que ninguna sección empieza con un escalón, y la página se va
asentando hasta llegar a `#ece2d2`.

## Resumen

- `app/theme/palette.css`: escala `--jia-vellum-1…5` (`#f6eee2`, `#f3eadc`, `#efe5d6`, `#ece2d2`, `#e8ddcc`), la luz de
  esquina `--jia-bg-light` y las recetas `--jia-bg-open` (2 → 3 + luz), `--jia-bg-rest` (3 → 2 → 3), `--jia-bg-arrive`
  (3 → 4, sostenido el último tercio) y `--jia-bg-arrived` (4 + luz). Ningún HEX nuevo fuera de la paleta.
- Aplicación: «Por dónde empezar» 1 → 2; pliegos de Jornadas `open` (ahora a todo el ancho, con el mismo margen);
  tono `paper` de `Section` (Experiencias) `rest`; tono `sand` (Propuestas) `arrive`; «Quién hace posible» `arrived`;
  última banda con base `#ece2d2` y su degradado de junta superior, que antes quedaba tapado por la fotografía,
  ahora visible y en ese mismo color.
- Descartado al probarlo: una luz de esquina en Experiencias y un sombreado inferior en «Quién hace posible» hacían
  un escalón de 5 niveles en la esquina al caer sobre una junta de papel. La luz solo se usa donde la junta superior
  no es papel (vídeo, fotografía). El paso 5 queda en reserva.
- `DESIGN.md`: «The Vellum Ground Rule».

## Verificación (una ronda, 1440 y 390 px)

- Juntas medidas en captura de página completa (borde izquierdo, final → inicio): pliegos `#efe5d6` → Experiencias
  `#efe5d6` → Propuestas `#efe5d6`…`#ece2d2` → «Quién hace posible» `#ece2d2`…`#ece2d2` → última banda `#ece2d2`
  (móvil: `#ece2d2` arriba y abajo). Punto de llegada cumplido.
- Contraste calculado de `--jia-text-muted` `#71604d`: 5,24 / 5,06 / 4,84 / **4,70** / 4,49 sobre los pasos 1–5; los
  fondos de texto usan solo 1–4 (≥ 4,5:1). Texto 8,3–9,3:1; terracota 5,4–6,0:1; tinta ≥ 13:1.
- Sin desbordamiento horizontal. `tsc`, `check:content`, `next build`: OK. Capturas en `evidence/`.

## Riesgos

- **Moderado:** los pliegos de Jornadas ya no dejan ver el grano de papel del `body` (ahora tienen fondo propio); la
  zona pasa de papel + grano (≈ `#ece2d2` percibido) a `#f3eadc` → `#efe5d6` liso, algo más clara. Propuesta si se
  echa de menos la textura: añadir `--paper-grain` como primera capa de las recetas y bajar medio paso la escala.
- **Moderado:** las tarjetas (`--jia-card` `#eee3d1`) quedan a un nivel de los pasos 3–4; se sostienen por su borde y
  sombra. Propuesta: si alguna se funde, subirla a `--jia-vellum-1`.
- **Moderado:** el degradado de junta de la última banda vela el 22 % superior de la fotografía (el pelo del arquero
  se desvanece). Propuesta: bajar `height` a 14 % si se prefiere más foto.
- Sin severos ni críticos.
