# Preparación de actualización del sitio existente — informe de fase

Registro histórico de preparación. La activación posterior está completada y verificada en [deployment-closure.md](deployment-closure.md).

2026-09-25 · REL-2026-09-25-02 · LEVEL 3 · implementación b410b77 · PARCIAL: preparado y transferido, no activado.

## Resumen

Se registra la autorización excepcional del propietario para una única ocasión de SSH. Se identifica por clave pública la instalación real: Caddy sirve /srv/web-jia/current -> releases/20260920-5b4d363 en /almeria-2026. No se han leído contraseñas ni usado wrappers de otros proyectos. Sudo requiere autenticación; consultas acotadas de metadatos Keychain no encontraron coincidencias accesibles.

Se descubre en la rama histórica de despliegue la ruta/canonical no integrada en main. Se recupera la compatibilidad usando una página de edición que reutiliza la landing actual, canonical desde constantes y export plano. No se cambia la interfaz aprobada. El paquete 20260925-b410b77 excluye la preview de raíz y contiene 203 archivos (~50 MB), con huellas en production-release.json; sustituye el primer paquete de raíz 6ec0109.

Se prepara un actualizador del mismo sitio: bloqueo, destino anterior esperado, snapshot root del upload, checksum y validación de archivo, nueva release, conservación de assets con hash, cambio atómico del enlace, comprobación HTTPS y rollback inicial. No modifica Caddy, dominios ni otros servicios. Paquete/script/launcher transferidos al staging privado /home/sdsadmin/web-jia-release-review-Xstzs4 con hashes verificados; activación NO ejecutada.

Guía solicitada completada en sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md, con hechos, procedimiento, Keychain/sudo, rollback y mejoras futuras claramente separadas. Se actualiza memoria de despliegue y continuidad.

## Verificación

Verification: V3 | ruta/config de export -> artefacto -> Caddy existente -> actualización/rollback acotados a web-jia | PARTIAL (privilegio/activación pendientes).

- TypeScript, contenido, build webpack y sintaxis Bash: PASS. Primer build sandbox falló por DNS de Google Fonts; build con red autorizada PASS y fuentes incorporadas al export.
- HTML de edición, canonical y 44 referencias de recursos: PASS, sin ausencias.
- Siete aserciones Chrome para la ruta de edición: PASS, móvil/escritorio sin excepciones JS. Las 66 pruebas previas del UI se conservan como evidencia anterior, no se atribuyen a esta ejecución.
- Cinco simulaciones Linux sin sudo en fixtures privados: éxito, checksum incorrecto, estado concurrente, enlace inseguro y fallo de salud con rollback: PASS. Caddy/curl simulados; no equivale a rollback de producción.
- SSH/inventario/origen y HTTPS público antiguo: PASS. Transferencia con checksum: PASS. Nueva producción y su smoke público: NOT RUN, falta autenticar sudo.

## Riesgos y soluciones

Moderado: credencial sudo no localizada, aunque SSH funciona. Solución operativa pendiente: nombre exacto de entrada Keychain para entrega directa a sudo, o ejecución del launcher por el propietario en su terminal. La autorización de despliegue no se pide de nuevo y no se amplía a acceso permanente.

Severo mitigado: activar un export de raíz contra Caddy configurado para la edición rompería la ruta. Corregido antes de transferir con ruta/canonical/export compatibles. El actualizador comprueba estado previo y salud, y conserva rollback. Activación real todavía no probada; verificación pública posterior obligatoria antes de declarar éxito.

Moderado: cachés de HTML antiguo pueden solicitar chunks previos; el actualizador conserva assets con hash antiguos. La retención/limpieza posterior queda recomendada, no ejecutada. Un cambio concurrente requiere reinspección; no forzar el actualizador.

Crítico: no se detectaron riesgos críticos nuevos tras revisar argumentos, extracción y alcance del actualizador. No se han expuesto secretos, cambiado permisos persistentes, borrado releases ni alterado otros sitios. Autenticación y pruebas productivas continúan pendientes.

## Continuidad y rollback

Current permanece en releases/20260920-5b4d363; no hay cambio productivo que revertir. Ante fallo después de activar, el script restaura el enlace si conserva la versión esperada. Antes de un rollback posterior, tomar el mismo bloqueo, verificar estado y cambiar solo el enlace hacia la release anterior conservada. Guía y checkpoint describen el siguiente paso exacto. Commit de implementación seguido de este informe documental separado. No se crea PR ni se atribuye una firma humana.
