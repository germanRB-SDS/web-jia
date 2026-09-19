# Evidencia local de preparación — [01-1]

No es W_E ni repositorio independiente. No hay sujeto de ensayo ni custodia acreditada.
Ningún manifiesto de esta carpeta concede permisos. No hay limpieza automática.

| ID | Archivo | Qué acredita |
|---|---|---|
| E01 | baseline.json, baseline-governance_tree.py.txt | Bytes selectivos previos al cambio de código; no snapshot completo de configuración activa |
| E02 | discovery.json | Observaciones saneadas y fallo del arranque read-only de ayuda/versión |
| E03 | frozen-plan.json | Familias/variantes, presupuesto y criterios congelados antes de medir B |
| E04 | pure-tests.json, pure-tests.txt | 24 tests puros y tiempo total del proceso |
| E05 | pure-measurements.json | Diez observaciones de selección en memoria, nueve mensajes sintéticos |
| E06 | closure.json, patch-check.json | Sintaxis, estructura, hashes, preservación y check textual inverso |
| Propuestas | proposals/*.patch | Cambios de fuente y configuración, no aplicados en controles activos |

E01 se tomó tras archivar input/checkpoint, antes de cambiar fuente. Su git_status incluye esos
dos archivos nuevos de esta tarea; el manifiesto de baseline solo contiene fuentes/antecedentes
anteriores. No se ha modificado E01 tras medir B. El estado inicial leído en terminal tenía
únicamente .DS_Store y documentación previa sin versionar; no había cambios tracked.

El tamaño de contenido enumerado al cierre figura en closure.json (no bloques físicos en disco).
No se crearon fixtures de destrucción. Si se decide retirar estos artefactos en el futuro,
revisar procedencia y ubicación; conservar ahora los informes, intentos fallidos y métricas.
