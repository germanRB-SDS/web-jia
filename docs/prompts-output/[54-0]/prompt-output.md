# Prompt Output — [54-0]

## 0. Metadata

2026-09-25 · Codex · implementación/revisión/QA · LEVEL 3 · REL-2026-09-25-03. Áreas frontend, security y deployment; memorias de esas áreas cargadas. Estado PARCIAL: código y verificación terminados, publicación pendiente de acceso expresamente autorizado.

## 1. Objetivo

Ejecutar [54-0]: preferencia compartida de animaciones, aceptación mínima, carteles móviles sin clipping y retorno al mazo por inactividad. Incluir modificación posterior de tarjetas compactas en historial del prompt y release. A descubrimiento, B política, C capacidades, D geometría, E interacción y F QA implementadas. Commit/push y producción forman parte del encargo; SSH requiere nueva autorización específica según guía vigente.

## 2. Resumen ejecutivo

La elección activa efectos en vivo sin recargar ni reiniciar vídeo/carruseles. Talleres conserva reserva de tilt y vuelve a mazo tras 5s sin explorar, con protecciones de interacción. Tarjetas sin Imparte/Temática y acciones más próximas; datos completos conservados en ficha.

## 3. Ficheros involucrados

Leídos: governance/router/prácticas seleccionadas, guías SDS Impeccable/gstack, memorias frontend/security/deployment, prompt y guía de despliegue. Creados: lib/motion/*, components/motion/*, copy/es/motion.ts, config de Talleres, script CDP y evidencias/informes. Modificados: consumidores enumerados en motion-consumers.md, copy, SheetCard, TalleresCarrusel y sus estilos; memorias e inventario de cookies. No hay archivos funcionales eliminados. Diff completo desde bb284af para inventario exacto. next-env.d.ts preexistente en root permanece fuera de commits.

## 4. Mapa de impacto

Web: estado compartido → atributo efectivo CSS + suscripciones JS → cleanup/update por motor. Cookie on → aceptación en memoria → estado efectivo; retirada borra solo esa cookie. Talleres gesto real → actividad de documento → timer/guardas → expansión. API/BBDD/backend/apps nativas: N/A, export estático.

## 5. Verificación BBDD

N/A: sin base de datos ni migración.

## 6. Verificación API

N/A: sin endpoints nuevos. Se conserva ruta /almeria-2026 y canonical de producción; export preparado para el Caddy existente.

## 7. Tests y validación

Node 24.19.0 (sin .nvmrc en raíz). npx tsc --noEmit PASS; npm run check:content PASS (6 talleres, 38 personas, 2 experiencias, 62 medios); NEXT_PUBLIC_SITE_URL=https://jornadasdeinnovacion.com npx next build --webpack PASS. Webpack por node_modules enlazado del worktree, sin nuevas dependencias. bash check-governance.sh y check-ai-pr-assurance.sh PASS; assurance firma exclusivamente técnica de Codex, no firma humana.

Chrome macOS sobre export HTTPS local: full 27, input 11, compact 3, extra 15, nojs 2; Edge macOS policy 13. Resiliencia dirigida previa 17. Evidencia qa-*.json/capturas; grupos solapados. Cookie atributos inspeccionados con CDP HTTPS, no inferidos de document.cookie. Motor WebGL SwiftShader, pointer/touch/teclado CDP y preferencias/viewport emulados. Ver compatibility.md: Windows/Linux/Guadalinex/Android/Samsung físicos NO VERIFICADOS. Sin JS probado fallback de reduce y presencia de contenido, no interacción que depende de JS. Dossiers sin enlace real no prueban una descarga inexistente. No se ejecuta script lint obsoleto basado en next lint; tsc/contenido/build sí.

## 8. Resultado

Código verificado y artefacto preparado, aún no publicado. B c23e342 / 7eed176; D 1531e1a / 64d08de; E 479fa43 / 35268ed; F 5ff471c y commit documental siguiente. Release 20260925-5ff471c: inventario/hash/archivo local en evidence/release-prepared.json. Nuevo acceso SSH aún no usado; no se ha inferido permiso de la excepción anterior. Los fallos instrumentales y límites de red se detallan en phase-f-report.md.

## 9. Checklist E2E

- [x] Política/cookie/rechazo/retirada/cambio del sistema y modal/foco.
- [x] Efectos en vivo y parada, fallback sin WebGL, conservación de vídeo/scroll.
- [x] Geometría móvil, entrada touch/ratón/teclado, timer/guardas y reset de documento.
- [x] Delta compacto en seis tarjetas; ficha con datos completos.
- [x] Export y checks locales; contrato de publicación conservado.
- [ ] Activación y smoke en producción: pendiente de nueva autorización SSH.
- [ ] Plataformas físicas: no disponibles; no se confunden con emulación.

## 10. Decisiones y riesgos

Moderado: alcance de compatibilidad limitado al entorno indicado y resets locales en extra (sin excepción JS), con smoke público pendiente. Severo: riesgo operativo de activación mitigado por artefacto único, checksum, expected-current, lock y rollback del actualizador existente; todavía no ejecutado. Críticos nuevos: ninguno detectado. No hay storage de rechazo ni UA sniffing, override global de matchMedia, remount global o cambio de audio. Histórico del prompt registra MODIFICATION para compactar escritorio solo en tarjetas de Talleres. Informes por fase conservan riesgos y soluciones.

## 11. Actualizaciones de memoria

Frontend: store, consumidores, constantes, geometría/timer y delta compacto. Security: cookie mínima, limitaciones y controles de acceso. Deployment: normalización de encabezado requerido por validador; no falsear release activa. Inventario técnico de cookies actualizado, sin inventar texto legal. Checkpoint tmp/execution-checkpoint.md mantiene estado recuperable; tmp aplica por LEVEL 3 y fases.

## 12. Siguiente paso

Integrar por fast-forward en main y push mediante git-safe-push.sh; comprobar SHA remoto. Solicitar únicamente autorización nueva SSH al sitio existente con el artefacto listo. Tras autorización inspeccionar current real y sudo; transferir/verificar/activar con update-web-jia-release.sh y hacer smoke público, después documentar publicación y commit/push del cierre. Si sudo requiere intervención, entregar launcher concreto de esa release. No reutilizar launcher histórico ni modificar DNS/Caddy/otros sitios.
