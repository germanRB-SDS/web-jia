# Continuidad 01-4

## Corrección tras salida de Terminal del propietario — 2026-09-13

El usuario reprodujo 3/5 y dos EPERM con Python3.8.10. Diagnóstico local: TERM funciona,
KILL sobre hijo terminado no recogido devuelve EPERM; wait=-15 y grupo después ESRCH.
Corregido tart_host.py para recoger/verificar desaparición del grupo; nunca ignorar EPERM
persistente ni reenviar señal por otra vía. 11/11 tests con Python3.14.6 y3.8.10, sin escalación,
sin ResourceWarning. Ver ../supervisor-fix.md y evidence/supervisor-fix/ (hashes/salidas/admisión).
La nueva fila del ledger admite solo evaluación sintética. NO arrancada VM ni habilitado run;
S0/S7/backend/A/B/restauración pendientes. La petición anterior de probar otro contexto queda
superada para este fallo: no volver a pedir la misma prueba sin una razón nueva.

## Precisión posterior del propietario — 2026-09-13

El objetivo de coste es un incremento operativo inferior al 8 % frente a no usar Sentinel;
no se exige ahorro. Una reducción sería un beneficio adicional. Criterio y límites de medición
registrados en `sentinel/runbook.md`. No hay nuevos resultados A/B ni pruebas de supervisor
ejecutadas en esta aclaración. La revisión de código/recibos confirma el siguiente diagnóstico:
ejecutar la suite sintética desde la Terminal del propietario y conservar su salida; si pasa,
evaluar/admitir ese contexto exacto y demostrar S0 antes de habilitar arranque o corpus.
La causa profunda de EPERM sigue desconocida; no cambiar killpg por otra vía para eludirlo.

## Reanudación Tart — 2026-09-13

Actualización de cierre12:02UTC: imagen descargada exit0/650.7716798750043s,
27312517392 bytes mirror/97 peticiones/0 errores. Tart list: VM sentinel-lab stopped,false;
root /private/tmp/sds-sentinel-tart-KoUNwE conservado, no borrar/prune. No boot/payloads.
Bloqueante REAL killpg EPERM: supervisor3/5 PASS2ERROR tanto restringido como escalación
solicitada/admitida. NO reintentar por otro ejecutor. Usuario recibió pregunta asíncrona:
ejecutar tests/test-sentinel-tart-host.py en su Terminal y aportar salida. Un PASS allí exige
admitir ese nuevo contexto, no altera permisos de esta sesión. run ahora retorna78 antes de
proceso/estado; lab integration sigue78. Necesita lifecycle validado, después S0 antes de A/B.
64 unitarios PASS (24+34+2+4). Dashboard regenerable sentinel/lab_dashboard.py con evidence/
tart-run2; protección/compatibilidad/rollback null n0, no seguridadglobal%. Revisiones seguridad
y medición independientes terminadas, pendientes lifecycle/S0/S7. No know-to exitoso todavía.
Informe actual ../tart-laboratory-report.md y banner del principal; preservación435/443,
8 cambiosesperados,0ausentes,adapters8sin cambios. Fuentehost c23c0f2d... bloqueada.

Notas iniciales de esta reanudación (históricas):

Usuario instaló Tart2.37.0 y autoriza ejecutar laboratorio, métricas/dashboard y know-to si
funciona. Firma codesign falló en sandbox pero PASS en verificación solo lectura mediante
escalación aprobada. Binario SHA2564bb842d1c9284c1c9cb56f017dde916dfce6995ef9844913d5af89ea54126df7.
Directorio dedicado nuevo /private/tmp/sds-sentinel-tart-KoUNwE; no HOME ni settings globales.
Tart no tiene --net-none. Se desarrolla sumidero Unix de paquetes, explícitamente propio,
seleccionado por PATH dedicado/interfaz --net-softnet/noTTY, sin ejecutar Softnet ni sudo.
Revisión independiente considera diseño viable pero requiere pruebas. Próximo: completar
admisión exacta, verificar procedencia/credenciales de pull, provisionar VM y barreras.
No se ejecutaron payloads todavía. Evidencia incremental evidence/tart-run2/.

## Cierre previo (conservado)

2026-09-13; LEVEL 3/security. HEAD 79aa7ffce2563e0e3abc189b19054187daf1a43d;
main; índice vacío; diez tracked modificados y fuentes anteriores untracked preservados.
Objetivo: ejecutar 01-4 desde Status, solo integrar tras S7.
Estado PARCIAL. S1 completado en alcance observable; no barrera independiente ni backend
acreditados. No se repite Seatbelt denegado ni se activa otro ejecutor. S5 aplicado.
Completados core/lab v2, evaluation.py, recovery.py (decisor puro), contrato/runbook,
tests y dos revisiones con hallazgos resueltos. 58 tests PASS; integration devuelve78 sin
payload; AST/diff PASS. Inventario443, cinco fuentes previas cambiadas según alcance;
resto preservado, adapters0 palabras. Evidencia verification.json y closure.json.
No hay A/B real ni rollback/configuración efectiva ensayados; no presentar helpers como barrera.
Siguiente exacto: provisionar entorno independiente según sentinel/runbook.md; descubrir su
autoridad/configuración, implementar backend revisado, congelar A/corpus y ejecutar A/B/A2/B2.
No quitar gate78 por declaración JSON, no integrar antes de S7. Coste COSTE_INCONCLUSO.
Git real bajo lectura por plataforma: sin fetch/branch/commits; no eludir mediante otra ruta.
Configuración runtime intacta; baseline con hashes no equivale a backup/custodia exterior.
