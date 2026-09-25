# Cierre final de producción — popup [54-0], fase G

Resumen: 20260925-b1adf52 activada y verificada en https://jornadasdeinnovacion.com/almeria-2026. Código b1adf52, informe 48b3518 y staging 249a528 ya subidos a main. El propietario renovó expresamente el permiso de publicación y autenticó sudo en el nuevo launcher. Sustituye a 20260925-5ff471c, conservada para rollback. La primera publicación y su evidencia permanecen en deployment-closure.md.

Comportamiento final: popup automático sin aceptación previa, excepto Mac/iPad/iPhone; se conserva el comportamiento gráfico de Apple. Fondo de cristal difuminado, activación de 60px, etiquetas exactas Activar animaciones / Dejar sin animaciones. Sin control Animaciones en footer ni botón Cerrar. Aceptar guarda únicamente cookie on180d y no vuelve a mostrar; declinar/Escape mantiene sin efectos esa visita y pregunta de nuevo en la siguiente carga fuera de Apple. Las tarjetas de Talleres conservan la compactación publicada.

Paquete: 203 archivos, 50.5MB, SHA-256 7dbf8a5f34af8a9c5b0fb1d0d7c6bc14e3c19c87c9081e2b131fef9a87a9800d. HTML local/origen/público coincidente: 4c860935b95fefe122a0b80d2af6b8004e94f5e0b62a7225ce38d0d454e8c23b. current=releases/20260925-b1adf52; anterior releases/20260925-5ff471c conservada. Caddy activo; actualizador confirmó proceso y configuración sin cambios. Aviso cp -n no fatal, sin modificar el actualizador durante esta publicación.

Verification: V3 | producción HTTP 10 PASS (43 recursos, canonical, redirects con query, 404, vídeo Range206); navegador público 27 PASS | PASS. Se verifica cookie HTTPS Secure/Lax/Path=/180d, rechazo sin storage, reload, inválida/bloqueada, foco/teclado, ausencia del footer, CTA/blur, tamaños y exclusiones Apple. JSON/capturas/origen en evidence/popup-production. TypeScript/contenido/build/governance/assurance y Chrome+Edge locales 27+27 ya PASS antes de publicar. No se repiten suites ajenas tras cambios solo documentales.

Moderado: la detección Apple usa navigator.platform por petición explícita; privacidad o identidad modificada pueden cambiar la oferta. Las identidades y touch se simulan sobre Chrome macOS para probar la rama, no son certificación de iOS/Android/Windows físicos. Destino: QA física cuando se disponga de equipos. La retirada de una aceptación se hace eliminando la cookie desde el navegador, conforme al control de footer eliminado por el propietario.

Severo: rollback operativo requiere el mismo lock y verificar current antes de restaurar atómicamente releases/20260925-5ff471c. Mitigado por release anterior conservada, hashes y expected-current, sin sobrescribir concurrentes. Sin defectos severos abiertos detectados en el alcance verificado.

Crítico: no se detectan críticos nuevos ni secretos publicados. No cambia backend, DNS, configuración del dispositivo, audio, permisos sudo ni servicios de otros proyectos. MCP sigue sin admisión. Autorización SSH limitada a esta publicación, consumida al cerrar; no es permiso permanente.

Estado final IMPLEMENTADO Y PUBLICADO. Prompt histórico, memoria deployment, conocimiento de despliegue y continuidad actualizados; cierre documental con commit/push seguro. next-env.d.ts ajeno permanece intacto y fuera de commits.
