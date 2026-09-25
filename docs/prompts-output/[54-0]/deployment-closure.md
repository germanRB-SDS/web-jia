# Cierre de producción — [54-0]

Resumen: release 20260925-5ff471c activada en https://jornadasdeinnovacion.com/almeria-2026 sobre el mismo sitio Caddy. Código 5ff471c, documentación principal ca77f86, autorización/staging 1e70525; todos subidos a main. El propietario dio permiso explícito nuevo por SSH y autenticó sudo ejecutando el launcher preparado. No se reutilizó el permiso histórico ni se activó MCP. El aviso cp -n fue no fatal; no se cambió el actualizador en este despliegue.

Paquete: 203 archivos, 50.5MB, solo export; SHA-256 001728823c08819013e60fbfcad3e6a810188726a81a8e68a90cfc062eb59e1a. HTML local/origen/público coincidente: 7858b3e953f8dd3aca5646943e1a6891d416bfde3b3e17dfe98e8187be956f88. current apunta a releases/20260925-5ff471c; releases/20260925-b410b77 conservada. Actualizador confirmó configuración y proceso Caddy sin cambios.

Verification: V3 | producción HTTP 10 checks PASS (43 recursos, redirects con query, canonical, 404 y vídeo Range 206); Chrome público policy 13, compact 3, input nativo 11, extra 15 PASS | PASS. Cookie real HTTPS Secure/Lax/Path=/, aceptación y retirada comprobadas. Extra valida cinco efectos, parada WebGL/tumbleweeds, fallback, modal/foco y conservación del vídeo. Captura compacta de producción inspeccionada: Imparte/Temática omitidos de tarjetas, subtítulo/acciones compactos, ficha conserva datos. JSON y capturas en evidence/production; sin excepciones JS. Extra registra una cancelación Media ERR_ABORTED al navegar después de comprobar vídeo, no un recurso fallido en reposo. La matriz física no disponible sigue declarada en compatibility.md.

Incidencias de comprobación: urllib recibió 403 mientras curl y Chrome recibieron 200; se completó el smoke con curl sin cambiar servidor, seguridad ni TLS. La primera búsqueda de vídeo en src SSR falló porque la carga es diferida; se verificó la ruta existente en la constante jornadas-intro-video y mediante Range, y la prueba de navegador cargó el vídeo real. Son incidencias de instrumentación, no pruebas omitidas ni cambios del producto.

Moderado: equipos físicos Windows/Linux/Guadalinex/Samsung no verificados. Destino: QA física cuando estén disponibles. Aviso de compatibilidad de cp -n preexistente; mejora futura --update=none solo tras comprobar coreutils, fuera del cambio visual actual.

Severo: rollback operativo requiere preservar la release previa y coordinar el mismo lock; mitigado por expected-current y evidencia de hashes. Si aparece una regresión, comprobar current, tomar lock web-jia-deploy y restaurar atómicamente releases/20260925-b410b77, sin sobrescribir una actualización concurrente. No hay defectos severos abiertos detectados en el alcance verificado.

Crítico: no se detectan críticos nuevos ni secretos publicados. La excepción SSH de esta ocasión queda consumida al cerrar; no es permiso permanente. No cambian DNS, configuración Caddy, servicios de otros proyectos ni permisos sudo.

Solución/estado final: IMPLEMENTADO Y PUBLICADO. Memorias y guía de despliegue actualizadas; commit documental final y push seguro cierran la trazabilidad. Cambio ajeno next-env.d.ts del workspace preservado y excluido.
