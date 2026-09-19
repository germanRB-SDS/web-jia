# Canario y cuenta dedicada — admisión exacta

2026-09-14 · owner: propietario del repositorio · LEVEL 3 / V3.
Autorización: completar 01-5-beta, incluida provisión del invitado, con nuevo go de hoy.
No modifica la identidad del host ni concede permisos a clientes cotidianos.

Revisión independiente native_review: G1–G6 PASS_WITH_CONSTRAINTS tras corregir
los tres hallazgos anteriores (conservados en resumption-review-findings.md).
Diez hashes cotejados en canary-discovery-revision.json: guest 4788a217cebcd9672af2cbab34f28df5eb13eb3ba4d121db440b9102a3675c3c,
controlador75ff7f59a710383e82d619730c81cae501225a32bf13fa45bd9b79688e522dd5.

G1/G5: efectos nuevos solo en la VM propia offline: cuenta/grupo _sds_sentinel
UID/GID551 si ambos nombres y números están libres; sujeto no-login sin contraseña,
sin membresía sudo y con grupos suplementarios retirados. Cinco fuentes Node fijas
con setgid/setuid, cada una en grupo/sesión nuevos; sin modelo ni herramientas arbitrarias.
Fixtures sintéticas nuevas test-a/test-b; controles/originales root; canario unlink,
lectura/escritura legítimas y denegaciones esperadas read/write/kill0/setuid0.
G2: éxito inesperado aborta; no se continúa ni se llama protegido. Identidad/error/
contenido se comprueban; atribución ES queda PENDING_RAW_ANALYSIS. Estado incierto
de dscl se registra antes del comando. Se preservan raw y todos los errores.
G3/G6: cuenta/grupo y fixtures permanecen para trazabilidad; no borrar/reparar una
colisión ni reintentar una creación incierta. Servicio launchd transitorio, fuera
de autoload, retirado por label exacto. La gobernanza base no depende de la cuenta.
G4: los nombres/IDs se comprueban antes de toda escritura; sin reutilizar cuentas.

Límites: captura4s, 2MiB/64KiB sensor,8192bytes/salida del hijo,600ms por hijo,
guest25s/VM45s, cleanup/inspect igual al supervisor congelado. Guardia de plazo
antes de preparar/lanzar cada caso. children_closed no prueba cobertura de grupos
o futuros descendientes: exige además cierre externo VM/PIDs/socket.

Se admite primero sintaxis Node26.0.0 --check (sin ejecución guest) y AST Python,
15s externos, sin dependencias nuevas. Solo tras sintaxis verde, una ejecución
python3 -B sentinel/canary_preflight.py --run con require_escalated.
La revisión de plataforma sigue siendo obligatoria. Rechazo implica QUARANTINED
y no otra vía. Sin TCC/SIP, credenciales, APIs, red IP, shares ni protección activa.
