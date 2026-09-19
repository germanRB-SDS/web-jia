# [01-4] Sentinel — implementación y evaluación

**Cierre vigente: [NO_GO del candidato actual; batería real de borrados]([01-4]/deletion-expanded-report.md)**.
La comparación ampliada de plantilla nativa perdió datos en 62/62 casos por condición:
41 archivos borrados, 21 alterados y ninguno intacto (0 % de reducción de pérdidas). Sin integración/parada propia; no activar ni publicar.
El contenido anterior conservado a continuación documenta fases históricas.


> Criterio económico actualizado: [8 % ideal;8–<40 % permite continuar/anotar](%5B01-4%5D/cost-policy-update.md).
> 42 tests PASS; ninguna sesión A/B nueva. Esta modificación sustituye el8 % como límite anterior.

> Estado vigente: [continuación S0 y umbral <8 %](%5B01-4%5D/s0-surfaces-report.md).
> Nueva sonda de custodia de réplicas, señal y conectividad local PASS con positivos antes/después;
> VM detenida;40 tests del analizador PASS. Fallo FD v2 conservado, v3 mantiene alcance acotado.
> S0 completo, B, A/B/A2/B2 y coste<8 % pendientes. Autorización vigente sin confirmación genérica.
> Los banners y secciones siguientes conservan historia, no el estado vigente.

> Estado vigente de reanudación: [smoke real de VM completado](%5B01-4%5D/boot-smoke-report.md).
> Arranque/cierre45s verificados; supervisor14/14 y sumidero3/3 PASS. VM detenida al final.
> S0, A/B y coste<8% pendientes. Discovery posterior rechazado por auto-review; borrador
> reducido sin sudo preparado y pendiente de aprobación explícita. Los banners siguientes
> son historia conservada y no describen el estado actual del arranque.

> Actualización posterior: [fallo del supervisor corregido](%5B01-4%5D/supervisor-fix.md).
> 11/11 tests PASS con Python 3.14.6 y 3.8.10 sin escalación; el EPERM reproducido procedía
> de la secuencia de cierre/recolección. VM, aislamiento, A/B y sobrecoste <8 % siguen pendientes.
> El cierre Tart que sigue es histórico; se conserva su evidencia de 3/5 y dos errores.

> Actualización tras instalar Tart2.37.0: [informe de laboratorio](%5B01-4%5D/tart-laboratory-report.md)
> y [métricas regenerables](%5B01-4%5D/evidence/tart-run2/dashboard.json).
> Estado actual PARCIAL/BLOQUEADO:64 tests unitarios PASS; supervisor3/5 PASS y2 ERROR
> por EPERM al controlar grupos de procesos. No VM arrancada, ni campaña A/B, ni activación.
> Protección/compatibilidad protegida/rollback: null, denominador0. No utilizar como protección.
> Las secciones siguientes conservan el cierre de la fase anterior; sus afirmaciones de
> «sin cambios en ledger» y «58 tests» describen esa fase, no la reanudación enlazada.

## 0. Metadata

2026-09-13. Prompt ejecutado: [01-4-alpha](../prompts/%5B01-4-alpha%5Dsentinel-implementacion-evaluacion.md),
desde Status. Codex, responsable de ingeniería; revisores independientes de seguridad y medición.
LEVEL 3, área security. Estado **PARCIAL**: desarrollo offline verificado; integración,
activación, protección y rollback real NO_VERIFICADOS. Change ID N/A, un repositorio, sin release.

## 1. Objetivo

Implementar/evaluar con controles locales/nativos, sin contexto añadido a adapters, y solo
integrar si supera S7. S1–S3: descubrimiento y decisiones completados en el ámbito observable;
S4–S6: helpers, catálogo, analizador y pruebas puras completados; campaña de efectos bloqueada
por barrera independiente no acreditada. S7: revisiones concluidas; aceptación no superada.
Se aplica la salida explícita de S5 para completar partes seguras sin presentar otra propuesta
documental como implementación de protección.

## 2. Resumen ejecutivo

Se corrigieron garantías y umbrales de los helpers y se implementó análisis reproducible de
elegibilidad, denominadores, capas y pares, más decisiones puras de recuperación. **58 pruebas
pasan**. El runner conserva salida 78 sin payload. No se ha activado B ni integrado Sentinel.

## 3. Ficheros involucrados

Inventario inicial: [baseline.json](%5B01-4%5D/evidence/baseline.json). R=raíz autorizada KIT,
Git/cwd `/Users/hrms/MAC-DEV-PROJECTS/sds-dev-governance`; HEAD
`79aa7ffce2563e0e3abc189b19054187daf1a43d`, main, kit v1.27.0, índice vacío. Diez tracked
modificados y material anterior sin seguimiento, atribuidos al propietario/sesiones previas.
443 archivos en manifiesto; ignored relevantes consultados; hashes no son backup/custodia.

Modificados: `sentinel/core.py`, `lab.py`, `contract.md`, `README.md`, `tests/test-sentinel.py`.
Creados: `sentinel/evaluation.py`, `recovery.py`, `evaluation.md`, `runbook.md`,
`tests/test-sentinel-evaluation.py`, este informe y carpeta 01-4 de evidencia/continuidad.
No se elimina ningún archivo. Cambios previos fuera de esos cinco archivos conservados;
ver [closure.json](%5B01-4%5D/evidence/closure.json). Bootstrap, distribución, adapters,
settings cargables, ledger, versión y documentación previa no reciben cambios propios.

Leídos: prompt completo, preparación 01-3, fuentes/tests afectados, gobernanza y dependencias
enrutadas, plantilla de output, memoria security del hub solo como referencia sin importar
autorizaciones. No hay memoria security local. No se precargaron dossiers ni todo docs.

## 4. Mapa de impacto

| Flujo | Cambio y comprobación |
|---|---|
| Eventos → helpers → mensajes/códecs | Validación de pendiente, Unicode y capa; nunca autoautoriza/parada falsa |
| Denegaciones → contador | Umbrales None por defecto; 2/3 solo ensayo explícito histórico, no control de bucle |
| Plan + JSONL → analizador → resumen JSON | Tipos, correlación, estratos/tratamientos, duplicados, faltantes y atribución verificados |
| Imágenes/recibo → decisión de recuperación | Conflicto/ABA suministrado o destino nuevo; no escribe ni afirma rollback |
| CLI laboratorio → rechazo | 78, attempt_observed=false, sin backend ni payload |

BBDD, backend/API de producto, iOS, Android, web: N/A, sin cambios. No se modifica flujo
operativo de agentes. Riesgo principal del delta: convertir observaciones incompletas en verde;
resuelto para contraejemplos revisados, sin afirmar exhaustividad del corpus.

## 5. Verificación BBDD

N/A, sin base de datos ni restauración de datos reales. Git/ACL/xattrs/hardlinks figuran como
requisitos futuros; no se presentan tests de objetos en RAM como recuperación de esos activos.

## 6. Compatibilidad, fuentes y configuración

[Arquitectura, amenazas y matriz por combinación](%5B01-4%5D/architecture-and-compatibility.md).
[Observación seleccionada de entorno](%5B01-4%5D/evidence/runtime.json): Codex CLI 0.154.0,
Claude 2.1.270, macOS 26.6.2 arm64, Python 3.14.6. Gemini y provisionadores consultados no
localizados en PATH. Build del ejecutor gestionado ≠ versión CLI observada. La sesión declara
workspace-write/auto_review/red restringida; no es prueba de confinamiento por canal.

Fuentes administradas fusionadas, carga desde subcarpeta/reinicio/reanudación/otra raíz,
configuración de sesiones reales y modos/canales siguen NO_VERIFICADOS. Sin MCP usado;
sin admisión ni lectura de credenciales. Hostinger conserva su bloqueo. Instalación no autoriza.

## 7. Tests y validación

Verification: V3 | [verification.json](%5B01-4%5D/evidence/verification.json) | PARTIAL.
Paths: core→códecs/tests; plan→CLI; esquema→análisis; recibos→decisiones. Modalidades puras,
contrato y smoke de CLI sin efectos; integración/E2E del control NO_VERIFICADOS.

- Baseline local: 24 tests anteriores pasaron antes de cambios, observación en terminal.
- Cierre: 24 tests Sentinel + 34 tests de evaluación/diagnósticos/recuperación: PASS.
- `python3 -B sentinel/lab.py integration`: 78 esperado, sin intento ni efecto observado.
- AST de seis fuentes/tests Python y `git diff --check`: PASS.
- Conservación por hashes/modos contra A, adapters sin delta y estado Git: closure.json.
- Dos revisiones independientes y contraejemplos en memoria: [resoluciones](%5B01-4%5D/reviews.md).

No ejecutados: campaña de efectos A/B/A2/B2, modelos de ensayo, bypass/carreras reales,
recuperación de disco/configuración/FD, sesiones interactivas/headless. S5 impide hacerlo sin
contención acreditada. El microbenchmark histórico no se repitió ni se usa como A. Suite global
de bootstrap/gobernanza excluida: consumidores operativos no cambiados por esta entrega.

## 8. Resultado y medición

| Garantía / métrica | Resultado actual |
|---|---|
| Helpers/validación/denominadores sobre fixtures en RAM | PASS en 58 tests; no eficacia de protección |
| Barrera independiente y custodia | NO_VERIFICADO; sesión puede escribir KIT real y temporales |
| Prevención Sentinel / falsos negativos en clientes | NO_VERIFICADO; n intentos elegibles reales=0; tasa indefinida |
| Falsos positivos / utilidad de tareas reales | NO_VERIFICADO; sin tareas de campaña iniciadas |
| Rollback de efectos/configuración, compatibilidad por canal | NO_VERIFICADO; ninguna activación B ni restauración requerida ejecutadas |
| Coste, latencia operativa, tokens/factura | COSTE_INCONCLUSO; contadores completos NO_DISPONIBLES |
| Contexto estático añadido a adapters | 0 palabras; contenido y modos comparados contra A |
| Integración/uso ordinario | No realizado; S7 pendiente |

Denominador cero produce null, nunca ahorro 100 %. No hay corpus de efectos congelado ni
datos A/B reales: [prerregistro de desarrollo](%5B01-4%5D/evidence/preregistration.md) y
[catálogo v2](%5B01-4%5D/evidence/catalogue-v2.json) se distinguen de campaña confirmatoria.
No se calculan porcentajes históricos como probabilidades de protección. Entrada/salida/caché/
razonamiento se mantienen sin suma hasta disponer de esquema nativo verificado. Tokens de
construcción/revisiones tampoco disponibles; cero llamadas LLM en helpers no significa coste total cero.

## 9. Checklist E2E

- [x] Código y contrato candidato actualizados juntos; pruebas y revisiones con hallazgos resueltos.
- [x] Denegación 78 conserva ausencia de backend; no se simula ejecución A/B.
- [x] Cambios previos preservados fuera del delta declarado; adapters sin contexto añadido.
- [ ] Barrera exterior, positivos/custodia, canales y configuración efectiva demostrados.
- [ ] A/B/A2/B2, interrupciones y rollback de datos/configuración/FD ejecutados y observados.
- [ ] Métricas operativas/tokens y tolerancias justificadas antes de campaña confirmatoria.
- [ ] S7 y ámbito de despliegue comprobados antes de integrar.

## 10. Decisiones y riesgos — informe de fase

Resumen: desarrollo offline completado y verificado; no se activa ni integra. Conservación
de A como comportamiento operativo, catálogo actualizado, analizador estricto y propuestas
de recuperación en memoria; pruebas limitadas a ese alcance.

Autoridad: 01-4 encargado por propietario es ACTIVE_CONTRACT para esta ejecución y sustituye
las recetas anteriores de Sentinel. Cambios derivados corregidos como ERROR (garantías) y
MODIFICATION autorizada (contador 2/3 deja de ser default operativo). No se alteran permisos de
plataforma ni gobernanza portable. Prácticas 05/14 leídas; `.git` bajo lectura impide rama,
fetch y commits de fase. No se intentó eludir. Informe persistido/mostrado por terminal;
cierre por commits pendiente, sin staging de trabajo ajeno ni publicación.

Crítico residual: integrar sin barrera/custodia/canales o con configuración ampliable permitiría
pérdidas. Mitigación actual: B no activado, integración rechazada. Destino: laboratorio externo
y S7. No se detectaron críticos nuevos de ejecución en helpers que no lanzan efectos; no se
afirma inexistencia de vulnerabilidades en el sistema no probado.

Severo residual: restauración real sin exclusión puede perder cambios concurrentes. Aquí solo
se propone destino nuevo/conflicto, nunca se restaura. Destino: backend con recibos, metadatos
y observador exterior. Los hallazgos severos del analizador fueron corregidos y revisados.

Moderado residual: análisis offline depende de autenticidad externa y captura/normalización
incompletas; carga/mantenimiento y coste real desconocidos. Destino: instrumentación nativa,
piloto presupuestado y metadatos de sesión. Código sin commits es evidencia de checkout, no
release reproducible. Estos límites impiden certificar, no se compensan con tests verdes.

## 11. Memoria y contexto

Adapters, reglas de arranque y memorias estáticas: 0 palabras añadidas. Solo fuentes optativas y
docs de ejecución. Contrato Sentinel actualizado; ninguna política activa instalada. Se usó la
referencia manual SDS de revisión/seguridad, sin invocar skills externas no admitidas. Fuente
del prompt preservada; su prefacio histórico no se cambia para fingir estado ejecutado.

## 12. Continuidad

Siguiente requisito: disponer del laboratorio independiente descrito en
[runbook.md](../../sentinel/runbook.md), con identidad desechable, P/X/Y, supervisor/E fuera
de escritura del sujeto y sin acceso a datos/servicios reales. Entonces implementar el backend
por combinación, congelar su A real y ejecutar el ciclo completo antes de considerar integración.
No basta aprobar una activación en este checkout ni instalar un cliente.

[Checkpoint](%5B01-4%5D/tmp/continuidad.md). Estado final: A continúa sin cambios de
configuración propios; B nunca activado. Esto no equivale a rollback A2 comprobado.
