# Evaluación delta del supervisor — 2026-09-13

Autoridad: continuación del diagnóstico solicitado por el propietario, que aporta el fallo
de su Terminal. Revisión exacta en revision.json. Modo exclusivo: pruebas sintéticas locales
de capture/terminate_group con procesos Python propios y temporales nuevos. No invocar CLI
Tart, VM, mirror/red, proveedores, credenciales, payloads ni activación Sentinel.

| Gate | Evaluación del modo sintético |
|---|---|
| G1 | PASS_WITH_CONSTRAINTS: procesos/grupos nuevos propios; señales por el mismo killpg, sin cambio de ejecutor/permisos. Señal denegada permite solo recoger/observar, no otra vía de terminación. |
| G2 | PASS_WITH_CONSTRAINTS: preservar errores históricos y salida del propietario; tests no acreditan S0/S7 ni eficacia Sentinel. |
| G3 | PASS_WITH_CONSTRAINTS: fuentes candidatas/tests/evidencia locales; no modificar settings, adapters, HOME o modo de arranque. |
| G4 | PASS: corrección del supervisor existente, sin introducir un supervisor paralelo. |
| G5 | PASS_WITH_CONSTRAINTS: stdlib, sin red ni secretos; scripts sintéticos con salida acotada y final natural; mocks de denegación no envían señales reales. Fuentes/intérprete identificados en revision.json. |
| G6 | PASS_WITH_CONSTRAINTS para evaluación: no VM; recolección del hijo y comprobación del grupo entero por ESRCH; EPERM persistente o grupo superviviente son error. Validar mediante tests antes de cualquier reconsideración de uso. |

El arranque sigue bloqueado por la fila Tart vigente. Esta admisión de pruebas no amplía esa
fila ni convierte un PASS sintético en aislamiento comprobado. Requiere registrar nueva revisión
si cambian fuentes. El procedimiento del 8 % se mantiene; no se mide overhead con estas pruebas.
