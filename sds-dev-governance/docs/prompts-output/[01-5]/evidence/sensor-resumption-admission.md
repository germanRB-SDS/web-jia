# Reanudación exacta del sondeo — 2026-09-14

Owner: propietario del repositorio; Codex; LEVEL 3; REL-2026-09-14-01.
Base edf9917705f92c5d21f95102328162c65ac0fc5d, rama
feat/REL-2026-09-14-01-sentinel-integration; cambios ajenos previos preservados.

El usuario, después de recibir la descripción precisa root/launchd/eslogger, captura
4 s/VM 45 s, autoriza «Ejecuta todo lo que falta» y «go». Autorización materializada
en el prompt beta. El rechazo previo se conserva íntegro y no acredita fallo FDA.

Revisión congelada: sensor-discovery-revision.json, SHA-256
e8eb5a217dfbc422eb463bad7641db68daccaf647151f30ac67ed80eb215824c.
Comprobación actual: diez de diez hashes coinciden, incluido Python real 3.14.6,
Tart 2.37.0, sink/wrapper, Node 26.0.0 y fuentes/pruebas del sondeo.
Se reutilizan las revisiones independientes sensor-discovery-review-v2.md y
sensor-discovery-final-review.md: código, efectos, alcance, límites y dependencias
sin delta. No se vuelven a ejecutar los siete tests sintéticos sin cambio.

G1/G5: PASS_WITH_CONSTRAINTS; nuevo dato de autorización humana para los mismos
efectos privilegiados en invitado offline. Sin ampliación de captura ni datos.
G2/G3/G4/G6: PASS_WITH_CONSTRAINTS reutilizados; evidencia preservada, raíz privada
nueva, label único temporal, cierre exacto, sin autoload ni modificación TCC/SIP.
El modo solo queda ADMITTED_WITH_CONSTRAINTS sujeto a nueva revisión de plataforma.

Única ejecución: python3 -B sentinel/sensor_preflight.py --run, require_escalated.
Sin sujeto/canario, cuentas, TCC/SIP, host shares, modelos, credenciales ni proveedor.
Captura 4 s y 2 MiB/64 KiB; guest 25 s, VM 45 s, espera 55 s, cleanup 30 s,
inspección 10 s. Verificar recibo final, exportar bytes/hash y cierre VM/PIDs/socket.
Un exit 0 no prueba FDA/canario/cobertura. Rechazo de plataforma devuelve el modo
a QUARANTINED; no otro ejecutor, API ni sensor alternativo.

Verification: V3 | runtime pendiente; hashes 10/10 REUSED | PARTIAL.
Paths: launchd guest → eslogger/FIFO → recibo JSONL → supervisor VM → cierre externo.
No se inicia integración protegida ni cargas destructivas antes de sus puertas.
