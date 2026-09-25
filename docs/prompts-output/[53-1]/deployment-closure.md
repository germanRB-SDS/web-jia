# Cierre del despliegue de web-jia

## 0. Metadata
2026-09-25 · Codex · REL-2026-09-25-02 · LEVEL 3 · IMPLEMENTADO.

## 1. Objetivo
Publicar la interfaz aprobada en el sitio VPS existente y documentar el procedimiento reproducible, manteniendo rutas, dominio y otros proyectos.

## 2. Resumen
El propietario ejecutó el launcher preparado y autenticó sudo en su terminal. La release 20260925-b410b77 está activa en https://jornadasdeinnovacion.com/almeria-2026. Verificación independiente posterior PASS. No se duplicó el sitio ni se cambió Caddy.

## 3. Ficheros
Código servido: b410b7746ee4d2e30f11519647a1a977652f562f. Paquete y hashes: evidence/production-release.json. En esta fase solo se actualizan guía, memoria, estado e informe y se añade evidencia productiva; no cambia el código ejecutable.

## 4. Impacto
Web estática: current apunta a releases/20260925-b410b77. Release anterior releases/20260920-5b4d363 conservada. Configuraciones Caddy (incluida Fields), PID 9241 y fecha de inicio del servicio intactos. DNS/TLS y demás servicios sin mutaciones del despliegue.

## 5. BBDD
N/A: export estático.

## 6. API
N/A: sin backend. Contrato de publicación /almeria-2026 y redirecciones preservado.

## 7. Tests y validación
Verification: V3 | artefacto -> enlace activo -> origen TLS -> dominio público -> UI móvil/escritorio | PASS.

- Activación: registro remoto y current confirman nueva release; origen TLS y dominio público tienen el SHA esperado 369b27981351628cb0d3fab53d3008dace40c622b3db777b2e8016d9a1f08169.
- 10 checks HTTP PASS: edición 200, seis redirects con/sin query, inexistente 404, 42 recursos HTML cargados, vídeo Range 206 (1024 bytes, video/mp4).
- 7 checks Chrome PASS: canonical, baraja hidratada, ficha móvil a pantalla completa, cabecera visible al desplazar, baraja contraída al salir de sección, modal de escritorio y ausencia de excepciones JS no capturadas. Capturas móvil/escritorio guardadas.
- Primera prueba con urllib recibió 403; Chrome y curl accedieron correctamente. Se completó el smoke con curl sin cambiar controles del servidor. No se atribuye causa específica a ese 403.
- Build/TypeScript/contenido, 44 referencias locales y cinco fixtures Linux del actualizador ya pasaron en la fase anterior; se reutilizan porque no cambia código. Las 66 aserciones UI anteriores tampoco se presentan como reejecutadas.
- No se provocó rollback real ni se probó reproducción audiovisual completa en dispositivo físico. El vídeo se verifica por disponibilidad/MIME/Range; rollback simulado previamente y versión anterior conservada.

## 8. Resultado
Producción actualizada y verificada. El aviso de cp -n sobre portabilidad fue no fatal; el launcher terminó ACTIVATED y todos los checks posteriores pasaron. No se recuperaron ni almacenaron contraseñas. La autenticación fue realizada por el propietario.

## 9. E2E
- [x] Origen y dominio público sirven el artefacto esperado.
- [x] Rutas, recursos, vídeo parcial, móvil y escritorio comprobados.
- [x] Configuración y proceso de Caddy intactos; anterior disponible.
- [x] Guía y memoria reflejan estado activo y forma de volver atrás.

## 10. Decisiones y riesgos
Moderado: aviso de portabilidad de cp -n y dependencia de sudo personal. No impidieron esta entrega. Mejoras propuestas en guía: --update=none tras comprobar soporte, publicador dedicado limitado a web-jia y empaquetado/CI reproducibles; no se conceden permisos permanentes en este cierre.

Moderado: conservar assets anteriores evita roturas por caché, pero requiere política futura de retención. No se borraron releases ni recursos. Un rollback posterior debe tomar el bloqueo y comprobar current para no pisar otra entrega.

Severo mitigado: publicación de ruta incompatible o sustitución accidental de otro sitio. Ruta de edición probada, paquete validado, enlace actual y SHA confirmados; cuatro configuraciones Caddy sin cambios. No quedan hallazgos severos abiertos de esta entrega.

Crítico: no se detectaron nuevos riesgos críticos dentro del alcance comprobado. Excepción SSH autorizada solo para esta ocasión; queda consumida al cerrar el despliegue. MCP sigue sin activarse; futuros accesos necesitan su autorización/admisión propia.

## 11. Memoria
Actualizadas docs/memory/deployment.md, guía knowledge/web-jia/how-to-deploy/README.md, release-status y checkpoint. Evidencias production-* separadas de pruebas locales anteriores.

## 12. Siguiente paso
Entrega terminada. El commit de cierre es documental y no requiere volver a desplegar. No reejecutar activate-once.sh. Para futuras entregas seguir la guía y preparar nueva release contra el current vigente.
