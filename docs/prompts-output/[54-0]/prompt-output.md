# Prompt Output — [54-0]

## 0. Metadata

2026-09-25 · Codex · implementación/revisión/QA · LEVEL 3 · REL-2026-09-25-03. Áreas frontend, security y deployment; memorias de esas áreas cargadas. Estado IMPLEMENTADO: release final 20260925-b1adf52 publicada y verificada; incluye todos los deltas autorizados.

## 1. Objetivo

Ejecutar [54-0]: preferencia compartida de animaciones, aceptación mínima, carteles móviles sin clipping y retorno al mazo por inactividad. Incluir modificación posterior de tarjetas compactas en historial del prompt y release. A descubrimiento, B política, C capacidades, D geometría, E interacción y F QA implementadas. G posterior: popup automático sin aceptación salvo Apple, cristal difuminado, CTA mayor, etiquetas finales y sin footer; implementada, verificada y publicada. Commit/push y producción forman parte del encargo; SSH requiere nueva autorización específica según guía vigente.

## 2. Resumen ejecutivo

Delta final G: popup al cargar sin aceptación salvo Mac/iPad/iPhone, con Activar animaciones / Dejar sin animaciones. Sin footer ni Cerrar; rechazo solo esa visita, aceptación persiste.

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

G: 27 checks en Chrome y 27 en Edge sobre HTTPS local; tsc/contenido/build/governance/assurance PASS. Capturas y JSON en evidence/popup-local y popup-edge. Producción final: 27 checks navegador y 10 HTTP (43 recursos/vídeo206) PASS; evidencia en popup-production. Harness vigente del popup: scripts/qa-motion-offer.mjs. Las expectativas B–F del popup son históricas de la primera release.

Node 24.19.0 (sin .nvmrc en raíz). npx tsc --noEmit PASS; npm run check:content PASS (6 talleres, 38 personas, 2 experiencias, 62 medios); NEXT_PUBLIC_SITE_URL=https://jornadasdeinnovacion.com npx next build --webpack PASS. Webpack por node_modules enlazado del worktree, sin nuevas dependencias. bash check-governance.sh y check-ai-pr-assurance.sh PASS; assurance firma exclusivamente técnica de Codex, no firma humana.

Chrome macOS sobre export HTTPS local: full 27, input 11, compact 3, extra 15, nojs 2; Edge macOS policy 13. Resiliencia dirigida previa 17. Evidencia qa-*.json/capturas; grupos solapados. Cookie atributos inspeccionados con CDP HTTPS, no inferidos de document.cookie. Motor WebGL SwiftShader, pointer/touch/teclado CDP y preferencias/viewport emulados. Ver compatibility.md: Windows/Linux/Guadalinex/Android/Samsung físicos NO VERIFICADOS. Sin JS probado fallback de reduce y presencia de contenido, no interacción que depende de JS. Dossiers sin enlace real no prueban una descarga inexistente. No se ejecuta script lint obsoleto basado en next lint; tsc/contenido/build sí.

## 8. Resultado

Release final activa: releases/20260925-b1adf52, código b1adf52, hashes local/origen/público coincidentes. Informe G 48b3518 y staging 249a528 subidos a main; cierre final en deployment-popup-closure.md y manifiesto evidence/release-popup.json. Caddy/proceso/configuración sin cambios; previa releases/20260925-5ff471c conservada. Propietario autenticó sudo tras renovación expresa del permiso de publicación.

Histórico: B c23e342 / 7eed176; D 1531e1a / 64d08de; E 479fa43 / 35268ed; F 5ff471c / ca77f86. Primera release 20260925-5ff471c publicada/verificada y posteriormente sustituida por G, con evidencia histórica en deployment-closure.md y release-prepared.json. No confundir sus estados de current con la release final vigente.

## 9. Checklist E2E

- [x] Política/cookie/rechazo/cambio del sistema y modal/foco; contrato final G y excepciones Apple. Retirada mediante cookie del navegador tras eliminación autorizada del control manual.
- [x] Efectos en vivo y parada, fallback sin WebGL, conservación de vídeo/scroll.
- [x] Geometría móvil, entrada touch/ratón/teclado, timer/guardas y reset de documento.
- [x] Delta compacto en seis tarjetas; ficha con datos completos.
- [x] Export y checks locales; contrato de publicación conservado.
- [x] Activación y smoke final: 10 checks HTTP, 43 recursos, vídeo 206 y 27 checks del popup PASS; ver deployment-popup-closure.md. Los 42 checks de la primera release permanecen como evidencia histórica.
- [ ] Plataformas físicas: no disponibles; no se confunden con emulación.

## 10. Decisiones y riesgos

Moderado: alcance de compatibilidad limitado al entorno indicado y resets locales en extra (sin excepción JS), con smoke público completado sin excepciones JS. Severo: riesgo operativo de activación mitigado por artefacto único, checksum, expected-current, lock y rollback del actualizador existente; ejecutado y verificado. Críticos nuevos: ninguno detectado. No hay storage de rechazo ni detección de distribución Linux; la excepción Apple explícita usa navigator.platform. No hay override global de matchMedia, remount global o cambio de audio. Histórico del prompt registra MODIFICATION para compactar escritorio solo en tarjetas de Talleres. Informes por fase conservan riesgos y soluciones.

## 11. Actualizaciones de memoria

Frontend: store, consumidores, constantes, geometría/timer y delta compacto. Security: cookie mínima, limitaciones y controles de acceso. Deployment: release activa, autorización de una sola ocasión y evidencia de producción actualizadas; guía knowledge sincronizada. Inventario técnico de cookies actualizado, sin inventar texto legal. Checkpoint tmp/execution-checkpoint.md mantiene estado recuperable; tmp aplica por LEVEL 3 y fases.

## 12. Siguiente paso

Trabajo solicitado completado y publicado. Conservar release anterior y evidencia para rollback. No hay fase funcional ni activación pendiente. QA física sigue como limitación declarada, sin fingir cobertura. La excepción SSH de esta publicación queda consumida; no reutilizar launcher ni inferir acceso permanente.
