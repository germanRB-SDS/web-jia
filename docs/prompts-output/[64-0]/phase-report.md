# [64-0] Exportación portable de componentes — informe de fase

## 0. Metadata
2026-09-29 · Codex · ingeniería frontend / gobernanza · REL-2026-09-29-01.
Estado final: IMPLEMENTADO. Recursos publicados en main del canónico y distribución local verificada.
Commit de implementación canónico: c70bacc9a16741d863a74a8610e4df43a23c9f02.

## 1. Objetivo
LEVEL 3. Áreas frontend y gobernanza/distribución. Exportar tres recursos independientes,
conservar motores probados, completar dependencias y registrar su adopción entre proyectos.
Prompt ejecutado: `tmp/portable-ui-export/[64-0]exportar-componentes.md` en el kit, por petición
explícita del propietario; no se ha creado un prompt en docs/prompts del proyecto.

## 2. Resumen ejecutivo
Se exportaron Quiénes somos/carrusel/tilt, tira de cine/visor y cubo CSS/GSAP a resources/web-components.
Cada carpeta incluye fuente, tipos, configuración, motion, tokens, demo instalable, lock, SVG
neutros, guía, hashes y capturas. Índice existente ampliado; receta de arquitectura en knowledge.

## 3. Ficheros involucrados
Tres hojas nuevas en resources/web-components, índice principal y README de categoría;
knowledge/web-jia/portable-interactive-components.md y sus índices; README/VERSION/CHANGELOG;
prompt/distribuidor temporal y logs/evidencia. Sin cambios al runtime de web-jia.
Inventario fuente exacto por archivo: provenance.json de cada hoja.

## 4. Mapa de impacto
Presentación: props/modelos → media → motores → CSS → navegador, todo local a cada recurso.
Distribución: sólo hojas nuevas e índices append-only; la versión que gobierna cada receptor
se conserva. El recurso v1.31.0 no implica adopción completa del kit v1.31.0.
Backend, API, DB, Android/iOS runtime: N/A, los recursos son referencias opcionales.

## 5. Verificación BBDD
N/A — sin persistencia.

## 6. Verificación API
N/A — sin endpoints. Imports relativos y dependencias externas declaradas comprobados.

## 7. Tests y validación
Verification: V2 | tipos/build + 9 escenarios Chrome CDP + auditoría de imports/hashes/locks | PASS.
Tres escenarios por recurso: desktop 1440×1000, touch 390×844 y reduced motion.
Se comprobaron imágenes visibles, overflow, drift/autoplay, hover, navegación/drag, lista accesible,
visor, Escape, Enter, bloqueo de scroll y restitución del foco según el componente.
`npm ci` y build con dependencias propias del cubo: PASS. No hay enlaces locales en los lockfiles.
Checker SDS: PASS tras retirar artefactos de build, que no son parte del kit publicable.
Suite canónica completa: 9 archivos de tests PASS; `test-governance-freshness.py` falla por un
timeout de 0.2 s en una consulta Git local. Reproducido también en c63d175, sin este cambio.
No se altera ese test ni se presenta la suite global como verde. Sintaxis/imports del distribuidor
verificados; dry-run, preservación, idempotencia y rechazo de conflicto en fixture: PASS.
No ejecutado: dispositivo físico, Safari/Firefox, lector de pantalla, desmontaje en harness real.

## 8. Resultado
Implementación y recursos verificados. Correcciones de harness: limitar carga a imágenes visibles
(las copias usan lazy loading); Enter envía texto y el puntero evita cierre mouse-leave intencional.
Cambios de exportación: imports/tipos locales, --wc-* en lugar de --jia-*, policy de sistema,
hover 1.08 de película, guard de vacío y limpieza de temporizador del visor. No se reescriben motores.

## 9. Checklist E2E
- [x] Datos/configuración → componentes → motor/CSS → navegador.
- [x] Demos estáticas y dependencias instalables separadas del proyecto fuente.
- [x] Índice → guía → fuentes/ejemplo; SHA de procedencia verificados.
- [x] Distribuidor no reemplaza recursos diferentes ni reglas locales; idempotencia probada.
- [x] Push canónico verificado y overlay aplicado en 12 copias activas; recheck idempotente sin cambios.

## 10. Decisiones y análisis de riesgo
**Moderados:** (1) medios/fuentes/ilustración originales no redistribuidos: solución incluida,
fixtures neutros completos y contrato para suministrar medios autorizados del destino.
(2) Validación sólo Chromium emulado: probar Safari y dispositivos reales al adoptar.
(3) Carrusel conserva pausa por hover/foco/reduce, sin control persistente propio: añadir control
si lo exige el contexto accesible receptor; no declarar certificación WCAG integral.
(4) Failure preexistente de freshness: diagnóstico futuro separado; no agrava este delta.
(5) Copias con reglas divergentes: distribuir overlay identificado por recibo y mantener VERSION;
no sustituir árboles ni promocionar sentinel/deployment ajenos a esta tarea.
**Severos nuevos:** ninguno detectado; no toca auth, datos, despliegues, reglas o lógica de negocio.
**Críticos nuevos:** ninguno detectado; revisión sin secretos/PII de origen ni borrado/rewrite remoto.
Rollback: revertir commits propios; para overlays usar recibo, comprobar hashes y preservar
cualquier cambio posterior. Nunca reset/force ni eliminación remota por API.

## 11. Actualizaciones de memoria
Cargada memoria frontend de web-jia y contexto pertinente de receptores. Knowledge conserva
aprendizajes reutilizables. No hay nuevo hecho de runtime que justifique cambiar memoria frontend.
Matriz: CHANGE resources/índices/knowledge/metadatos/logs; N/A kernel/prácticas/adapters/scaffold/
bootstrap/validators/capabilities, porque no cambian contratos ni admisión.

## 12. Siguiente paso y continuidad
Rama feat/REL-2026-09-29-01-portable-ui; canon base c63d175; fuente web-jia 46065c5.
Canónico publicado: c70bacc (implementación) + 9c59842 (informe de fase). SHA remoto comprobado.
Web-jia: f6cdd8d (implementación local); cierre documental en commit separado.
Distribución aplicada e idempotencia comprobada. Targets descubiertos, no hardcodeados en el kit.
Excluidos de escritura: backup histórico y copia upnews anidada explícitamente read-only.
No se modifican ni publican las ramas de los otros proyectos.

## Cierre de publicación y distribución

Se actualizaron las copias activas de auragenda-home, fields-android, fields-web/fieldsapp-web-main,
maryna-ventura, roots, sds-dev-governance (checkout local), south-desert-main-web/web-sds, teragenda,
upnews, upnews-android, web-3d y web-jia. `evidence/sds-ui-distribution-result.json` registra efectos;
`evidence/sds-ui-distribution-recheck.json` confirma cero cambios en una segunda planificación.
Cada copia conserva recibo `resources/web-components/web-jia-resource-pack.json` con SHA de cada
archivo y revisión canónica. Los overlays de los otros proyectos quedan locales, sin commit/push
ni cambio de rama; su integración Git corresponde a sus propios ciclos de trabajo.

Excepción de integración necesaria: maryna-ventura/tsconfig.json ahora excluye sds-dev-governance
para que las demos no entren en su compilación. Verificado mediante tsc --listFilesOnly;
no se tocaron sus cambios ajenos existentes. Esta modificación queda local junto al overlay.
Backup histórico y copia anidada Upnews read-only se preservaron; no son destinos activos de escritura.

La ausencia de medios originales y las pruebas sólo Chromium siguen siendo límites de adopción,
no dependencias ocultas: la demo neutra es completa y el how-to describe cómo sustituirlos.
Sin nuevos riesgos severos o críticos tras distribuir; el riesgo moderado de divergencia se evita
sin actualizar VERSION ni reemplazar reglas de los receptores. No hay despliegue web.
