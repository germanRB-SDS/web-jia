# Revisión independiente: hallazgos previos a corrección

2026-09-14, native_review, lectura estática sin ejecución.

Sensor beta: P1 confianza9/10, last_tick avanzaba sin datos y un canario antiguo
permitía health() sano indefinidamente con productor vivo bloqueado. Exigir desafío
periódico atribuible/caducidad independiente; silencio natural no equivale a fallo.
P2 confianza10/10: EOF perdía buffer parcial y poll(exit) precedía drenaje.
Conservar raw tras cerrar el control, con drenaje acotado y completitud explícita.

Canario v1 sin ejecutar (guest dc73b0d868f5fce4fe38020ecdfa2908e28da1b97f65d037b47f1a2d32ae5db6):
P1: UNEXPECTED_SUCCESS/originales alterados no hacían fallar ni detenían casos.
P2: falta deadline antes de preparar/lanzar siguiente sujeto.
P2: dscl con timeout después de escribir podía dejar created=false en vez de UNKNOWN.
G2/G5 FAIL, G6 UNKNOWN antes de correcciones; no se ejecutó esa revisión.

Datos fase3 cotejados por revisor: cuatro copias y stdout tienen hashes correctos;
83 líneas, esquema1/mensaje10 y tipos32/11/9/15. Exec cambia pidversion entre
process.audit_token y event.exec.target.audit_token: conservar ambos y seguir target.
No hay canario ni activación protegida en esa evidencia.
