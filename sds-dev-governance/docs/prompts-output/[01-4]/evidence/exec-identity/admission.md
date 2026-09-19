# GOV-SAFETY — identidad binaria y versión declarada distintas

G1/G3/G4/G6 sin delta de operaciones/targets/env/límites/cierre desde exec-stdio/admission.
G2/G5 delta explícito: el handshake nativo comprobó versión0.0.0 y proveedor de build.
El protocolo oficial codex-rs/exec-server-protocol/src/protocol.rs tagrust-v0.154.0 define
0.0.0 como desconocida. La identidad del ejecutable ya se fija por hash antes de spawn;
no convertir providerId ni versiónCLI en atestación de compatibilidad del protocolo.
Nuevo prerregistro: permite0.0.0 SOLO con providerId exacto previamente observado,
conserva la versión literal, executor_version_unknowntrue y version_compatibility_verifiedfalse.
Desconocida con otro/sinprovider o versión diferente falla. CLI0.154.0 sigue separada.

Fallo METADATA_MISMATCH previo retenido. Se permite únicamente avanzar el ensayo benigno
pwd/cierre bajo esa limitación; no se reclasifica resultado anterior ni acredita S0/auth/B/A-B.
Todos los oráculos cwd/status/pwd/exit/seq/closed/EOF y deadlines12/15/25/45 permanecen.
Owner continuación autorizada. Hashes actualizados en revision.json; tests sintéticos
correspondientes, revisión independiente y plataforma antes de una nueva sonda única.
Rechazo no se evita por alternativa. Boot/inspect/PID/socket propios incluidos.
