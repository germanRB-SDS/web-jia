# JIA-2026-09-18-22 — Hotfix de contenido: entradilla de «Las jornadas»

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat. **Nivel:** LEVEL 1 (solo copy; sin informe de fase:
no hay cambio ejecutable).

## Encargo

Sustituir «Un punto de encuentro para docentes que quieren explorar nuevas maneras de enseñar y compartir lo que
sucede en sus aulas. El cine y el universo western almeriense son el hilo conductor.» por:

«Un punto de encuentro para docentes que quieran realizar un viaje de exploración hacia nuevas maneras de enseñar y
de compartir lo que sucede en sus aulas. El cine y el universo western almeriense son el hilo conductor de esta
edición.»

Corregidas dos erratas del mensaje original: «queiran» → «quieran» y «hijo conductor» → «hilo conductor».
Único sitio: `lib/content/copy/es/sections/jornadas.ts` (`intro`). Comprobado a 1440 y 390 px: cabe en el panel
(cinco líneas en escritorio) sin tocar el camino. `tsc`, `check:content`, `next build`: OK.
