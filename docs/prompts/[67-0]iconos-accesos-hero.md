# [67-0] Iconos nuevos en los accesos directos del hero

- Fecha: 2026-10-15 · Rama: `main` · LEVEL 1 (UI, solo iconos) · área `frontend`
- Salida: `docs/prompts-output/[67-0]/report.md`

## Entrada del promotor

Tres iconos (`assets/icons/board-icon.svg`, `horseshoe-icon.svg`, `lantern-icon.svg`) sustituyen a los de los accesos
directos bajo el hero («Por dónde empezar»): Programa → dos herraduras, como los pasos de un caballo; Talleres → la
pizarra; Experiencias → la lámpara. Ejecutar, commit y push al terminar.

## Alcance

Originales en `assets/icons/`; los trazados se incorporan a la familia `components/icons` (`currentColor`, sin ficheros
sueltos en `public/`); mapa del hero en `lib/content/sections/hero.ts`. Verificación: tsc, check:content, next build,
captura a 1440 y 390 px.
