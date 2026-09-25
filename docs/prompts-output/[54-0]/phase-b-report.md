# Fase B — política de movimiento

Resumen: c23e342 integra store de aceptación, popup nativo diferido ante otros diálogos, control de footer y todos los consumidores inventariados. CSS mantiene fallback antes de hidratación; JS reinicia solo motores decorativos o actualiza el motor conservando posición. No se remonta la landing ni se toca audio/tiempo del vídeo. Modelos asíncronos abandonados liberan recursos.

Verification: V3 | TypeScript, check:content, export webpack y 13 comprobaciones Chrome CDP | PASS. La corrección de especificidad de html se revisó estáticamente y se incluirá en la prueba autoritativa final. El primer ensayo del harness falló al serializar un nodo DOM; corregido a boolean. La inyección de un getter de cookie que lanza rompía el overlay de Next dev; se conserva como limitación del ensayo, se sustituyó por cookie bloqueada silenciosamente como en navegador. Evidencia: evidence/qa-policy.json; atributos Secure, Lax, Path=/ y duración observados vía CDP en localhost; HTTPS pendiente de fase F.

Riesgos moderados: compatibilidad física Linux/Guadalinex/Samsung no verificada; destino F documentar emulación y límites sin prometer esos dispositivos. Apertura repetida/destrucción de WebGL requiere ensayo final de estrés; destino F. Cookie de preferencia accesible a JS por export estático; sin datos sensibles, no HttpOnly, no alternativa localStorage.

Riesgos severos: forzar efectos sin aceptación o superponer diálogos; los casos iniciales, rechazo, override y bloqueo de cookie pasan; completar trap/deferencia y ausencia de WebGL en F. No se ha detectado riesgo crítico nuevo tras revisar persistencia, imports y controles; no hay backend/auth/datos privados nuevos.

Soluciones: completar pruebas dirigidas de F y registrar autorización antes del acceso SSH. No hay permisos de producción nuevos ni MCP activado.
