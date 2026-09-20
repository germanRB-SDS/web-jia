# JIA-2026-09-18-12 — Hotfix: flechas dentro de la anchura del cubo y nueva pista

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat tras JIA-2026-09-18-11. Hotfix ejecutado en la misma sesión.

## Encargo (transcripción)

«Genial. gh push. Que las flechas no sobresalgan de la anchura del cubo. Y que el texto diga "Desliza el cubo en
horizontal. Prueba suerte." -> input y hotfix.»

## Alcance

1. La fila de flechas + leyenda mide exactamente lo que el cubo (`--cube-size`), en todos los anchos.
2. `copy.jornadas.team.cube.hint` = «Desliza el dado en horizontal. Prueba suerte.» (solo en el fichero de copy).
3. Verificación medida (bordes de las flechas frente a los del cubo), commit y push.
