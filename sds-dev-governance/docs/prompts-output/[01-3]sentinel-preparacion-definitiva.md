# [01-3] Sentinel — preparación definitiva y contraste

## 0. Metadata

Fecha: 2026-09-13. Agente: Codex. Rol: responsable de ingeniería y curador documental;
revisores independientes: seguridad de sistemas y diseño experimental, mediante dos subagentes
de esta sesión, sin invocar sesiones externas de Claude/Gemini. LEVEL 3, área security.
Prompt ejecutado: [01-3](../prompts/%5B01-3%5Dsentinel-preparacion-definitiva.md).
Estado: IMPLEMENTADO **solo el entregable documental de preparación**. Implementación,
campaña, integración y activación del prompt 01-4: todavía no ejecutadas. Change ID: N/A,
un repositorio, sin release. No hay admisión nueva de capacidades.

## 1. Objetivo

Preparar [el prompt definitivo 01-4](../prompts/%5B01-4-alpha%5Dsentinel-implementacion-evaluacion.md)
para implementar, verificar, comparar y concluir, con activación experimental reversible y
condición del propietario: **solo integrar si se demuestra que funciona**. Secuencia completada:
inspección relevante → diseño documental → dos revisiones independientes → ajustes → cierre.

Contexto aplicado: AGENTS del padre y las instrucciones del usuario; `GOVERNANCE.md`, INDEX,
prácticas 01/02/03/07/08/09/12/13/15 y routers de skills/ledger. Skill `spec` como guía de
redacción; revisión compatible con `skills/gstack.md`. Memoria security del hub consultada
como referencia, sin trasladar autorizaciones a este repositorio. No existe `docs/memory/`
local. Práctica 14, código/commits de fase, no aplica a esta ejecución documental.

## 2. Resumen ejecutivo

Se preserva el objetivo de control fuerte mediante mecanismos nativos/ejecución local con
mínimo contexto operativo. La solución se elegirá por garantías, utilidad y coste comprobados;
no se impone hook, Seatbelt, plugin ni tamaño del programa. Hoy no hay protección Sentinel
integrada demostrada. La preparación no añade palabras al contexto estático de adapters.

## 3. Archivos y evidencia del estado real

| Evidencia | Hallazgo y alcance |
|---|---|
| [Baseline de esta inspección](%5B01-3%5D/evidence/baseline.json) | HEAD comprobado `79aa7ffce2563e0e3abc189b19054187daf1a43d`, rama main, `VERSION.md` v1.27.0. Coinciden con el antecedente, pero se volvieron a consultar. 10 archivos tracked modificados, +143/−4 líneas y material sin seguimiento previo. Manifiesto de 431 archivos existentes, con hashes/modos; no es backup ni custodia independiente. |
| `sentinel/core.py`, `sentinel/contract.md` | Funciones de mensajes/códecs y contador en RAM. No determina autorización ni interpreta efectos; no conecta hooks ni detiene el agente. `canonical_object` valida cadenas; no demuestra confinamiento. |
| `sentinel/lab.py` | Plan de casos y presupuestos históricos. No contiene backend de integración; por inspección, `integration` devuelve 78/NO_VERIFICADO. No se ejecutó aquí. |
| `sentinel/templates/*`, `tests/test-sentinel.py` | Plantillas candidatas y pruebas puras. No son configuración cargada ni evidencia por canal. Los 24 tests registrados en 01-1 no se repitieron ni se presentan como protección runtime. |
| `tests/measure-sentinel.py`, `[01-1]/metricas.md` | Comparación de diez rutas en memoria y nueve mensajes sintéticos. Su A es reconstrucción del selector histórico, distinta de A de la futura campaña Sentinel. No mide integración, comprensión humana ni tokens de sesiones completas. |
| Diff de `scripts/bootstrap.py`, `scripts/governance_tree.py`, `init.sh`, `init-project-prompt.md` | Cambios anteriores para separación de distribución/identidad y rechazo de HOME/raíz. Se preservan; no constituyen Sentinel activo ni se vuelven a implementar. |
| `[01-2]/regresion.md`, manifiestos/evidencias referenciados | Recuperación histórica a carpetas nuevas, con contenido/inventario/modos ejecutables. Excluye `.git`, ignorados y credenciales globales; no prueba rollback activo, ACL/xattrs, concurrencia ni custodia exterior. No se extrajeron archivos ni se restauró nada ahora. |

Creados en esta fase: encargo 01-3, prompt futuro 01-4-alpha, este output, revisiones,
checkpoint y evidencia de inspección/validación bajo `[01-3]/`. Modificado únicamente el
índice existente `docs/prompts/README.md` para descubribilidad. No se elimina ningún archivo.

## 4. Compatibilidad y configuración

[Observación de entorno](%5B01-3%5D/evidence/runtime-observation.json) y
[campos seleccionados de configuración](%5B01-3%5D/evidence/config-inspection.json).

| Cliente | OBSERVADO en esta preparación | Efectivo o pendiente |
|---|---|---|
| Codex CLI | `command -v`, `--version`, `--help`: 0.154.0, macOS 26.6.2 arm64. Config de usuario: modelo `gpt-6-astra`, esfuerzo high, auto_review y trust de KIT/padre. `hooks.state` contiene referencias ajenas, no Sentinel. | La sesión actual declara workspace-write, auto_review, red restringida, KIT y temporales escribibles; `.git/.agents/.codex` bajo lectura. Esto procede del contexto gestionado, no de inferir configuración desde disco. No se ensayó confinamiento. Versión del CLI ≠ versión demostrada del ejecutor actual. |
| Claude Code | `--version` 2.1.270; help con modos de permisos, bare/safe/restricted, selección de fuentes y JSON/stream. Config usuario con una regla allow de Bash acotada; sin sandbox declarado en ese archivo. Sin settings de proyecto/local encontrados en KIT. | Configuración fusionada/runtime, modelo activo, hooks y sandbox NO_VERIFICADOS: no se arrancó sesión interactiva. El help advierte que print puede ignorar settings inválidos; no basta un archivo candidato válido. |
| Gemini CLI | `command -v gemini` sin resultado, exit 1; sin settings encontrados en las rutas consultadas. | NO_VERIFICADO; ausencia en PATH no prueba ausencia en todo el Mac. El procedimiento por versión/canal queda en S1/S3/S4 del prompt. No se instala nada para completar la tabla. |

Codex imprimió su versión con advertencia de no poder crear aliases PATH; se registra sin
convertirla en fallo Sentinel ni prueba de aislamiento. La inspección no enumera todos los
settings administrados remotos, interfaces GUI, plugins activos o servicios IPC del equipo.
La ausencia de archivos consultados no equivale a ausencia de controles externos.

Impacto actual: documentos solamente. BBDD, API, backend de producto, iOS, Android y web: N/A.
Distribución, bootstrap, adapters, configuración cargable, ledger y permisos: sin cambios propios.

## 5. Verificación BBDD

N/A — no hay cambios de datos/esquema ni campaña de restauración.

## 6. Fuentes externas y premisas contrastadas

Consulta oficial realizada el 2026-09-13, separada de soporte runtime local:

- [Claude sandbox](https://code.claude.com/docs/en/sandboxing): documenta aislamiento de Bash y
  sus hijos, composición de excepciones y vías sin sandbox. No acredita Write/Edit ni receptores
  externos. Se exige una prueba por canal; no se concede HOME para arreglar compatibilidad.
- [Claude hooks](https://code.claude.com/docs/en/hooks): un command hook que no arranca o vence
  su timeout puede dejar continuar la llamada; el callback SDK tiene contrato distinto.
  Corregida la idea de que un deny ante excepción interna garantiza todo fallo cerrado.
- [Gemini hooks](https://geminicli.com/docs/hooks/): especifica JSON y errores no bloqueantes;
  stdout inválido puede permitir continuar. Es documentación, no comportamiento local observado.
- [Codex hooks](https://developers.openai.com/codex/hooks/): documenta exec/apply_patch y límites,
  incluido stdin posterior sin nuevo PreToolUse. Se consultó como fallback: no se encontraron
  fuentes `.rs`/`.md`/schema en el paquete local inspeccionado. El esquema de cada build requiere
  contraste futuro. [Seguridad Codex](https://developers.openai.com/codex/security/) consultada
  como referencia, sin inferir nuevos permisos para esta sesión.

Faltan el informe Claude original con la matriz A/B/C y la propuesta de ~80 líneas. La búsqueda
focal encontró `revision-claude.md`, que es un encargo de revisión, no su respuesta. El archivo
histórico `SDS-REVISION-sentinel-perimetro-local-2026-09-12.md` es otro antecedente; el adjunto
`SDS-PROMPT-sentinel-perimetro-local.md` que cita tampoco se localizó. Quedan pendientes el
contraste de sus filas/pesos y la atribución contextual de afirmaciones, sin bloquear lo demás.

Con los sumandos **aportados por el usuario**, la aritmética es: 9,5/12 = **79,17 %**;
7/12 = **58,33 %**; 7,5/12 = **62,5 %**. No es una recomputación independiente de las filas
ausentes. Son índices documentales, no eficacia medida, y una ponderación no resuelve el
solapamiento de criterios. Se distinguen de los brazos experimentales A/B.

La salida 71 sí está en `[01-1]/evidence/discovery.json`, con `sandbox_apply: Operation not
permitted` y proceso objetivo no arrancado. Su causa no está demostrada. No se repitió el
intento ni se cambió de ejecutor para sortearlo. Arranque y confinamiento tendrán pruebas separadas.

## 7. Validación de esta fase

Inspección de fuentes, diff, versiones/help y campos de configuración; búsqueda focal de
antecedentes; revisión independiente de seguridad y medición. Validación documental y de
preservación registrada en [validation.json](%5B01-3%5D/evidence/validation.json).
Alcance: enlaces locales del entregable, secciones, JSON de evidencia, cambios propios y
comparación de contenido/modo contra manifiesto anterior. No verifica garantías de Sentinel.

No ejecutados por alcance explícito: tests Sentinel, microbenchmark, bootstrap, campañas A/B,
activación, extracción/restauración, sesiones con modelos de ensayo, MCP o cambios de políticas.
No se ejecuta suite general por una entrega exclusivamente documental. No se hace commit/push.

## 8. Decisiones y pendientes

| Propuesta | Decisión y razón |
|---|---|
| Control local fuerte, bajo contexto | Adoptar: control nativo/determinista por efecto; prompt solo de implementación, éxito silencioso cuando sea posible y mensajes mínimos. Ninguna nueva regla estática en adapters. |
| Configuración + hook | Candidato, no veredicto: útil para subconjunto probado; ausencia/timeout/errores del harness pueden invalidar una barrera única. |
| Lanzador Seatbelt o plugin obligatorio | Descartar obligación: justificar beneficio frente a A, custodia, canales y coste. Plugin es empaquetado; lanzador no es una barrera universal por arrancar. |
| Protección del perímetro = recuperación de todo | Corregir: diferenciar pérdidas exteriores, activos interiores, configuración/credenciales/evidencia, disco sin commit y buffers sin guardar. Cada garantía tiene límite explícito. |
| Ocho sesiones, ~80 líneas, tiempos y 10/15 % | No heredar como gates. Hay umbrales en 01-2, pero el encargo vigente autoriza revisarlos y exige fundamento. Muestra/precisión/coste se preregistran; no hay tiempo prometido ni ahorro calculado. |
| Pruebas puras y backups históricos como PASS | Rechazar extrapolación. Mantenerlos como evidencia limitada; integración y rollback necesitan pruebas reales independientes. |
| Solo integrar si funciona | Incorporar explícitamente por instrucción vigente. Construcción y B experimental en laboratorio son pasos previos; distribución/uso ordinario requieren S7 y ámbito autorizado. |

Pendientes futuros concretos: configuración efectiva/canales de clientes; barrera independiente
admisible en macOS; custodia efectiva y estado mínimo de arranque; prototipos/implementación;
pruebas por efecto y fallos; rollback activo concurrente; A/B y tokens nativos; compatibilidad
Gemini y otras interfaces. Ninguno se declara PASS. Si uno impide un modo, los demás adaptadores
y entregables independientes siguen adelante.

## 9. Checklist de cierre

- [x] Encargo archivado y prompt futuro separado; estado documental distinto de campaña pendiente.
- [x] Inspección real, fuentes/hipótesis/desconocidos separados y cambios ajenos preservados.
- [x] Contrato, matriz, laboratorio, A/B, rollback, métricas y criterios de integración preparados.
- [x] Dos revisiones independientes, con ajustes resueltos en el prompt.
- [ ] Implementación/activación/protección/rollback de 01-4: pendientes por encargo, no ejecutados.

## 10. Autoridad, revisiones y riesgos

El encargo actual y la aclaración posterior son ACTIVE_CONTRACT para esta preparación. Los
prompts previos conservan valor histórico; código/plantillas/mediciones son DERIVED_ARTIFACT,
no autorización ni decisión de arquitectura. MODIFICATION autorizada para el próximo encargo:
reabre receta 01-2 y exige evaluación por capacidades; CLARIFICATION de ciclo de vida y carga
estática; ERROR corregido en interpretación de métricas y garantías. No cambia el contrato
operativo de clientes ni la gobernanza portable. La resolución queda en el prompt fuente.

[Revisiones independientes y hallazgos resueltos](%5B01-3%5D/revisiones.md). Riesgo crítico futuro:
integrar sin evidencia de aislamiento/custodia, especialmente por un canal indirecto. Riesgo
severo: restauración que pierde cambios concurrentes o informes que cuentan negativos falsos
como bloqueos. Riesgo moderado: coste/fricción mayor que A. S4–S7 convierten estos riesgos en
pruebas y criterios previos, sin afirmar que estén mitigados en el runtime actual.

## 11. Memoria y carga de contexto

Adapters, `GOVERNANCE.md`, memorias estáticas, hooks e instrucciones por comando: **0 palabras
añadidas en esta fase**. Solo cambia el índice de prompts, que no es un loader automático.
El borrador tenía 4.127 palabras al responder la pregunta del propietario; el recuento final
está en la validación. Es contexto para el encargo futuro, no para cada comando del producto.
No hay contabilidad completa de tokens de esta conversación/revisores: NO_DISPONIBLE.
La preparación consume contexto de trabajo; eso no se confunde con memoria estática añadida
ni con coste del control futuro. No se introduce un vigilante LLM por operación.

## 12. Continuidad

Esta fase termina con documentos preparados y revisados. El siguiente encargo, cuando el usuario
lo indique, es ejecutar `docs/prompts/[01-4-alpha]sentinel-implementacion-evaluacion.md` desde
Status. Primero revalidar A y entorno; ninguna campaña queda iniciada por este cierre.
[Checkpoint](%5B01-3%5D/tmp/continuidad.md); resultados locales sin seguimiento intencional,
coherentes con el estado previo. No se publica ni integra Sentinel.
