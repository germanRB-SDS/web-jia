# JIA-2026-09-19-36 — Hotfix: el árbol baja hasta casi la foto siguiente, sombra bajo las rocas y rocas en ocre de la paleta

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat con captura de `localhost:3000` («el diseño está
sublime») tras JIA-2026-09-19-35. **Nivel:** LEVEL 1 (hotfix; resultado al final de este prompt, sin `report.md`).
tmp/scratch: N/A. **Estado:** EJECUTADO (2026-09-19) — ver «Resultado» y «Corrección del promotor durante la ejecución» al final.

## Encargo

1. **Más grande, creciendo hacia abajo.** Por arriba la copa se queda **aproximadamente donde está**; por abajo las
   rocas deben llegar **prácticamente hasta la foto de la sección siguiente** («Propuestas»). Hoy queda un hueco de
   ≈ 55–60 px entre el pie de las rocas y esa foto. Solo cambia la caja del árbol en `Experiences.module.css` (y, si
   hace falta, el aire del encuadre en `experienciasTree`); el árbol escala entero, así que la copa se ensancha un poco:
   comprobar que el texto se sigue leyendo como ahora.
2. **Sombreado debajo de las rocas.** La sombra de contacto actual casi no se ve (lila, tenue, y vista tan rasante que
   queda oculta tras las rocas). Hacerla visible: más ancha, con más fondo hacia el espectador y más opaca, cálida
   (`--jia-ink`), en dos pasos: un núcleo oscuro pegado a las rocas y un halo amplio y suave. Dentro del componente como
   opciones (`shadow.depth`, `shadow.core`), sin `shadowMap`; valores del sitio en `experienciasTree`. Debe caber por
   debajo de las rocas sin que la corte el borde de la sección.
3. **Rocas en ocre de nuestra paleta.** `ground`/`groundDark` de la paleta `cicada` pasan a ocres hechos con tokens
   existentes (`--jia-copper`, `--jia-dune-light`, `--jia-terracotta-deep` vía `color-mix`). **El resto de colores del
   árbol no se toca** (copa, tallos, musgo). Los tokens `--jia-tree-rock`, `--jia-tree-rock-deep` y
   `--jia-tree-shadow` dejan de usarse: se retiran de `palette.css`.

## Reglas

Prompt commiteado antes de ejecutar; commit al terminar; sin push (no se ha pedido). `git add` solo de ficheros propios.
Verificación: `tsc`, `check:content`, `next build`, Chrome por CDP a 1920 y 1680 (y al ancho del promotor, ≈ 1835 px);
medir el hueco entre el pie de las rocas y la foto de «Propuestas»; `scrollWidth`; portabilidad de `tree-3d`.

## Corrección del promotor durante la ejecución (por chat, «hotfix on the fly»)

4. **Todo el texto de la sección un 5 % más a la izquierda**, sin dejar de ser adaptativo. Se mueve **la columna entera**
   (título, entradilla y tarjetas) sin cambiarle el ancho: `--aula-shift: 5%` en `Experiences.module.css`, restado al
   margen izquierdo y sumado al derecho (porcentaje del ancho de la sección, así que escala con la ventana). Solo en el
   diseño ancho (≥ 1280 px), que es donde existe esa columna.

## Resultado (2026-09-19)

- **Tamaño:** la caja del árbol pasa a `height: 108%` y `bottom: -5.6%` (la sección recorta lo que sobra). La copa
  empieza donde empezaba (≈ 100 px bajo el borde superior a 1788–1920) y las rocas acaban a ≈ 15–20 px de la foto de
  «Propuestas» (antes ≈ 55–60 px). La sombra ancha ya **no cuenta para el encuadre** (solo su núcleo): al principio lo
  ensanchaba y el árbol encogía.
- **Sombra bajo las rocas:** halo amplio + núcleo oscuro, en tinta (`--jia-ink`), con fondo hacia el espectador; nuevas
  opciones del componente `shadow.depth` y `shadow.core` (valores por defecto discretos; los del sitio en
  `experienciasTree`). Sin `shadowMap`. Evidencia: `rocas-ocre-y-sombra-2x.png`.
- **Rocas ocre:** `color-mix` de `--jia-copper` con `--jia-dune-light` (claro) y con `--jia-terracotta-deep` (oscuro).
  Copa, tallos y musgo, intactos. Retirados de `palette.css` los tokens que quedaron sin uso
  (`--jia-tree-rock`, `--jia-tree-rock-deep`, `--jia-tree-shadow`).
- **Texto 5 % a la izquierda** (punto 4). Efecto añadido: la copa ya no toca el título, y apenas roza el final de una
  línea de la entradilla a 1788–1920.
- **Posición del árbol:** `right: calc(margen − 34,2vw)` (antes 29,7vw) para compensar la caja más grande.
- **Umbral de montaje: 1440 px (antes 1680).** Con la columna movida, a 1440 la copa no tapa ningún texto; el árbol
  asoma desde el borde de la ventana, con parte de la copa y de las rocas fuera (`experiencias-1440-nuevo-umbral.png`).
  Si el promotor prefiere no verlo cortado en portátiles, volver a `1680px` es un valor en `experienciasTree.media`.
- **Verificación:** `tsc`, `check:content` y `next build` ok; Chrome por CDP a 1920, 1788, 1440 y 390 (sin árbol);
  `scrollWidth = clientWidth` a 1920, 1788 y 1440; `tree-3d` sigue importando solo `react` y `three`.
- **Riesgos (moderados):** (1) el título de la sección arranca ahora sobre la zona ya desvanecida de la fotografía
  (51 % del ancho): se lee bien en las capturas, pero conviene que el promotor lo mire en su pantalla; (2) rendimiento
  aún sin medir en su equipo: la caja del árbol es un 8 % más alta. Sin graves ni críticos.
- Evidencias en `docs/prompts-output/JIA-2026-09-19-36/evidence/`. Sin push (no se pidió): 12 commits por delante de
  `origin/main` (JIA-34, -35 y -36).
