# JIA-2026-09-19-36 — Hotfix: el árbol baja hasta casi la foto siguiente, sombra bajo las rocas y rocas en ocre de la paleta

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat con captura de `localhost:3000` («el diseño está
sublime») tras JIA-2026-09-19-35. **Nivel:** LEVEL 1 (hotfix; resultado al final de este prompt, sin `report.md`).
tmp/scratch: N/A. **Estado:** SIN EJECUTAR

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
