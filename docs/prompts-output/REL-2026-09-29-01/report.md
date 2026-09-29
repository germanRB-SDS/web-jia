# Publicación de web-jia — REL-2026-09-29-01

## 0. Metadata

29-09-2026 · Codex · release/seguridad · LEVEL 3 · Estado: IMPLEMENTADO y verificado.
Artefacto: `bf682a8`; producto previamente implementado: `0fa2287`. Activación: propietario en su terminal.

## 1. Objetivo

Push a GitHub, árbol limpio y actualización del sitio existente del VPS Hostinger sin duplicarlo. Captura de contraseña mediante Keychain solicitada por el propietario. Explicación documental de la intervención manual solicitada al cierre.

## 2. Resumen

Los 22 commits pendientes y la preparación se publicaron mediante push protegido a main. Se versionó la plantilla PDF nueva; dos ZIP (56 PNG) y siete originales idénticos por SHA-256 se conservaron en disco y se excluyeron de Git. Build aislado correcto. Paquete estático de 287 archivos transferido y verificado. El revisor automático rechazó dos intentos de activación del agente antes de ejecutarlos; el propietario activó el paquete manualmente. La verificación posterior confirma la release nueva, integridad pública/origen y Caddy sin cambios.

## 3. Ficheros

Preparación: `.gitignore`, `assets/downloadable-content/ficha-descargable.pdf` (plantilla sin datos cumplimentados). Cierre: esta carpeta, memoria deployment y entrada de último despliegue en la guía canónica. Código de aplicación y actualizador sin cambios en esta tarea. Memorias leídas: deployment, security y contexto frontend. Documento solicitado: [por qué fue necesaria la activación manual](por-que-activacion-manual.md).

## 4. Impacto

Mismo sitio/ruta/configuración: `current -> releases/20260929-bf682a8`. Anterior `releases/20260925-b1adf52` conservada. Sin segundo sitio ni cambios DNS/TLS/Caddy. Git fast-forward protegido. Keychain almacena el secreto local por petición del propietario; no se incorporó a Git, logs o argumentos. MCP no usado.

## 5. BBDD

N/A — sitio estático.

## 6. API

N/A — sin backend; lectura de filesystem y HTTPS para verificar publicación.

## 7. Verificación

Verification: V4 | build de release bf682a8: TypeScript, check:content (96 medios), Next 16.3.4 webpack / Node 24.19.0 | PASS, REUSED tras activación: mismo artefacto, sin recompilar.
Trigger: gate canónico de release. Paths: contenido → export → paquete → staging → current → HTTPS → navegador.

- SHA-256 paquete/script coincidente en local/remoto; detalles en `evidence/release.json`.
- Build/origen/HTML público: SHA-256 `8e1c09cbcfa4b9faf047852fe061b87eb51105aa85c13f03e2abf3412c15c51b`.
- Current y registro del actualizador confirman release `20260929-bf682a8` y anterior retenida. Caddy activo, PID 9241 y timestamp de arranque 220329065170; hashes de Caddyfile y web-jia.caddy conservados.
- HTTPS público con curl: 8 checks PASS, incluida canonical, tres redirects preservando query, 404 desconocido, 193 recursos disponibles y vídeo `206` / 1024 bytes / `video/mp4`. `evidence/production-http.json`.
- Chrome público 1440×900 y 390×844 táctil: siete carteles ordenados y cargados, deriva ~18 px/s, visor, cierres, pausa, teclado/foco y dimensiones correctos; sin errores de consola. `evidence/production-qa-*.json`. Harness [61-0], cambiando solo URL; no certifica dispositivos físicos ni Safari/Firefox.
- QA local previa conservada en `evidence/qa-*.json`.
- Primera comprobación HTTP con Python urllib: 403, conservada en `production-http-python-403.json`. Contraste motivado por ese fallo: curl local, curl desde VPS (público/origen) y Chrome funcionan. No se determinó la causa del rechazo de ese cliente; no se cambió ningún control para hacer pasar la prueba.
- Preparación/documentación: `git diff --check` PASS. Diff histórico tenía advertencia menor de línea vacía final en people.ts:78; no se cambió producto por formato.
- PR/MR assurance: N/A para cierre operativo/documental sin código nuevo ni PR/MR. No se firma una auditoría humana inexistente.

## 8. Resultado

Nueva versión activa y verificada en https://jornadasdeinnovacion.com/almeria-2026. El bloqueo del agente se conserva como antecedente explicado en el documento solicitado; la ejecución manual del propietario resolvió la entrega, sin otorgar admisión permanente al agente.

## 9. Checklist E2E

- [x] Build y contenido.
- [x] Push protegido.
- [x] Staging e integridad.
- [x] Activación por propietario y lectura posterior del estado.
- [x] HTTPS, redirects, recursos y vídeo.
- [x] Navegador público escritorio/móvil.

## 10. Riesgos y soluciones

- **Moderado:** futuras publicaciones del agente siguen sujetas a admisión/custodia; Keychain no lo sustituye. Solución propuesta: publicador restringido o pipeline evaluado, descritos en el documento solicitado; no implementados aquí.
- **Moderado:** urllib recibió 403 mientras curl/Chrome acceden correctamente. Si ese cliente es necesario, diagnosticar por separado; evidencia íntegra conservada. No afecta a las verificaciones satisfactorias de navegador realizadas.
- **Moderado preexistente:** retención de releases/staging para rollback y peso de originales en Git. No se ejecuta limpieza remota; ZIP redundantes excluidos. Límites de dispositivos físicos y riesgos de interfaz documentados en [59-0]/[61-0] se mantienen.
- **Severos nuevos:** ninguno observado tras activación/verificación; bloqueo de automatización resuelto para esta entrega por intervención del propietario.
- **Críticos nuevos:** ninguno observado; sin secretos expuestos, cambios de permisos ni protecciones debilitadas.

## 11. Memoria

Deployment y guía canónica reflejan release activa; manifiesto y checkpoint consolidados. `activate-manually.md` queda marcado como histórico, no volver a ejecutarlo. Autorización puntual consumida al cierre. Scratch aplicado; evidencia sin secretos.

## 12. Siguiente paso

Ninguno para esta publicación. Si se desea automatizar futuras activaciones, evaluar y admitir el publicador/acceso protegido como tarea independiente. Revertir solo con la guía canónica, bloqueo y comprobación del current real; no borrar releases ni volver a ejecutar el launcher de esta entrega.
