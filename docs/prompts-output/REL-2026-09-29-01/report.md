# Publicación de web-jia — REL-2026-09-29-01

## 0. Metadata

29-09-2026 · Codex · release/seguridad · LEVEL 3 · Estado: PARCIAL, activación BLOQUEADA.
Commit preparado/publicado: `bf682a8`; producto previamente implementado: `0fa2287`.

## 1. Objetivo

Push a GitHub, árbol limpio y actualización del sitio existente del VPS Hostinger sin duplicarlo. Captura de contraseña mediante Keychain solicitada por el propietario.

## 2. Resumen

Los 22 commits pendientes y la preparación se publicaron mediante push protegido a `origin/main`. Se versionó la plantilla PDF nueva; dos ZIP (56 PNG) y siete originales idénticos por SHA-256 se conservaron en disco y se excluyeron de Git. Build aislado correcto. Paquete estático de 287 archivos / 59.049.642 bytes transferido y verificado. La activación no se ejecutó: revisión automática la rechazó dos veces por falta de admisión Hostinger y custodia independiente verificadas, incluso después de aportar la autorización SSH vigente y la excepción prevista por la guía.

## 3. Ficheros

Modificados: `.gitignore`; añadido: `assets/downloadable-content/ficha-descargable.pdf` (plantilla sin datos cumplimentados). Evidencia/decisión/checkpoint en esta carpeta; memoria deployment actualizada. Código de aplicación y actualizador sin cambios en esta tarea. Leídos: gobernanza/prácticas seleccionadas, guía canónica de despliegue, memorias deployment/security/frontend y diffs de publicación.

## 4. Impacto

Web: mismo export/ruta/configuración. Git: fast-forward protegido sin reescribir historia. Servidor: staging privado nuevo, sin cambio de current, DNS, TLS ni Caddy. Keychain: secreto almacenado localmente a petición del propietario y probado por stdin a sudo, sin exposición en argumentos, archivos o logs. MCP no usado.

## 5. BBDD

N/A — sitio estático.

## 6. API

N/A — sin backend; publicación mediante filesystem y HTTPS.

## 7. Verificación

Verification: V4 | gate canónico de publicación sobre bf682a8: TypeScript, check:content (96 medios), Next 16.3.4 webpack con Node 24.19.0 | PASS.
Trigger: ejecución autoritativa del build de release. Paths: contenido → export estático → paquete → staging; activación y HTTPS del nuevo código pendientes.

- Hashes locales/remotos de paquete y actualizador coinciden; identificadores en `evidence/release.json`.
- SSH/sudo comprobados con StrictHostKeyChecking; espacio remoto 179 GB disponible.
- GitHub verificado por `git ls-remote`: main = bf682a8 antes del commit documental de cierre.
- QA Chrome sobre el export local a 1440×900 y 390×844: ver `evidence/qa-*.json`; referencia al harness original [61-0], solo cambiando URL a `/almeria-2026.html`.
- `git diff --check` de la preparación: PASS. Histórico pendiente de push: advertencia menor preexistente de línea vacía final en `lib/content/data/people.ts:78`; no se alteró producto para corregir formato.
- No se afirma smoke productivo de la nueva versión: no ha sido activada. Safari/Firefox y dispositivos físicos no ejecutados.
- Aseguramiento PR/MR: N/A para este cierre operativo sin código ejecutable nuevo ni PR/MR; se conserva el código e informes de implementación ya existentes. No se firma una revisión humana inexistente.

## 8. Resultado y bloqueo

GitHub actualizado y artefacto listo. Producción comprobada sigue en `releases/20260925-b1adf52`.
La auto-revisión exige admisión exacta de proyecto y custodia independiente para Hostinger. No se cambia el ledger ni se intenta otra vía para eludirla. `activate-manually.md` contiene el comando concreto para el propietario y los controles de integridad/rollback.

## 9. Checklist E2E

- [x] Build y contenido de release.
- [x] Publicación Git mediante wrapper y hook SDS.
- [x] Staging privado e integridad SHA-256.
- [ ] Activación: bloqueada antes de ejecutar.
- [ ] HTTPS y navegador de nueva versión en producción: pendientes de activación.

## 10. Riesgos y soluciones

- **Moderado:** GitHub y producción difieren hasta activar. Solución: propietario ejecuta la activación preparada o regulariza el acceso gobernado; después verificar HTTPS y navegador.
- **Moderado:** se retienen staging y releases para reanudación/rollback. No hay segundo sitio; no se ejecuta limpieza remota ni se duplica otra instalación. Retención futura requiere alcance explícito.
- **Moderado preexistente:** originales de imágenes aumentan el repositorio; ZIP redundantes quedan excluidos. Conservar límites de navegador y contenido indicados en [59-0]/[61-0].
- **Severo operativo:** autorización del usuario y excepción de guía no satisfacen al revisor automático. Solución: intervención manual del propietario o admisión/custodia verificadas, sin bypass.
- **Críticos nuevos:** ninguno observado. No se ha mutado producción, expuesto contraseñas ni debilitado permisos/protecciones.

## 11. Memoria

Memoria deployment enlaza este estado parcial. Scratch aplicado en `tmp/checkpoint.md`; evidencia separada. La guía canónica conserva el procedimiento sin duplicarlo. Autorización SSH solo para esta entrega; almacenamiento en Keychain no concede acceso permanente.

## 12. Siguiente paso

Propietario: ejecutar una vez el comando de `activate-manually.md` en su terminal, o resolver admisión/custodia. Después comprobar current, hash público/origen, redirects, recursos y vídeo Range, y registrar cierre. No volver a subir ni compilar el mismo paquete salvo cambio de código o artefacto.
