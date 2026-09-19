# Continuidad 01-2

2026-09-13. main, HEAD 79aa7ffce2563e0e3abc189b19054187daf1a43d; árbol con candidato
01-1 previo y cambios locales 01-2. Sin commits, ramas, stash, push ni permisos activos.

Objetivo: prompt de guard local macOS para borrados fuera del proyecto, consumo casi nulo;
regresión sencilla pre-Sentinel; init/metaprompt prohíben instalación HOME; porcentajes y
exclusiones en conclusiones y terminal. Preparación terminada, guard no implementado.

Completado: snapshots de 363/406 archivos y recuperación a carpetas nuevas verificada;
protección HOME/raíz con alias antes de planificar; 10 tests y 3 smokes de entrada;
prompt 01-2-alpha, revisión para Claude y conclusiones sin porcentajes inventados.
Inciso completado: `knowledge/how-to-convert-from-image-to-svg.md`, Potrace (no Potrage),
receta recuperada de evidencia Maryna Ventura; cero ediciones en ese otro proyecto.

Pendiente: revisión de Claude y encargo explícito del piloto. Sandbox macOS con carga y
canales reales no verificado; ensayo con efectos depende de laboratorio independiente.
No invocar el guard propuesto: scripts/sds-guard aún no existe. No repetir el fallo 71
por otro ejecutor. Coste total tokens no disponible; 0 llamadas propias es hipótesis de diseño.

Regresión: [procedimiento](../regresion.md). Conservar la protección HOME independiente
si se retira Sentinel. No extraer archivos sobre el árbol actual ni borrar datos ajenos.

Siguiente paso exacto: usar `docs/prompts-output/[01-2]/revision-claude.md` para el preflight;
después corregir la propuesta. No hay motivo para repetir tests de ubicación sin cambio.
