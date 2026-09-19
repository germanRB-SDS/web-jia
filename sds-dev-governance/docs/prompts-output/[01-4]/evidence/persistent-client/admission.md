# GOV-SAFETY — cliente guest persistente y sonda stdio v2

Owner: autorización persistente de continuación Sentinel01-4; diagnóstico previo conservado.
G1 PASS_WITH_CONSTRAINTS: mismo ejecutable público por stdin regular; nuevo root guest
/Users/Shared/sds-sentinel-client-4f85982624b3, mkdir sin-p falla si existe. Umask077;
no mounts ni host auth ni redIP. Shared es parent guest, no compartición con host.
G2 PASS_WITH_CONSTRAINTS: comprobar hash/tamaño/version y posteriormente presencia/hash
tras nuevo boot antes de handshake/pwd. La desaparición previa de /private/tmp queda
observada; no atribuir mecanismo no probado. fsync no sustituye comprobación tras reboot.
G3 PASS_WITH_CONSTRAINTS: estado/HOME/tmp bajo root guest propio; sin settings/global
installs. Parent compartido no prueba custodia frente a terceros y no se afirma protección.
G4 PASS: transferencia administrativa y luego ejecutor administrativo benigno solo pwd;
ningún modelo/auth/cuenta del propietario ni payload adversarial.
G5 PASS_WITH_CONSTRAINTS: hashes actuales en revision.json; Nodeguest prechecked solo
fsync delFD del binario propio. Protocolo/observer previo sin delta salvo ruta y mensajes
preflight específicos. Nunca se elimina guard para hacer avanzar una precondición fallida.
G6 PASS_WITH_CONSTRAINTS: stage25s/VM45s; segundo boot45s para sonda12/15/25s,
EOF nativo y stopped/PID/socket tras cada boot. Sin run general ni servicios permanentes.

Dos fases únicas, separadas por cierre comprobado:1staging,2sonda que verifica persistencia.
Revisión independiente antes, plataforma antes de cada ejecución. No alternativas tras
rechazo. Preservar todos los logs/fixtures y no sobreescribir directorio existente.
Pruebas del delta:2 StageSourceTests PASS y1 método/12 escenarios observer PASS.
