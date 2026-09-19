# [01-1] Sentinel — candidato preparado, integración no verificada

## 0. Metadata

- Prompt: [`[01-1]sentinel-implementacion-verificable.md`](../prompts/%5B01-1%5Dsentinel-implementacion-verificable.md).
- Fecha: 2026-09-13. Agente: Codex. Rol principal: Software Architect; revisiones de
  Security/Privacy y QA/calidad-rendimiento realizadas por el mismo agente, sin subagentes.
- Estado: **PARCIAL**. Conclusión runtime: **INCONCLUSO**. Candidato **sin activar**.
- LEVEL 3, área security, cambio high-risk de gobernanza. Un solo repositorio; sin Change ID de release.
- Baseline: main, HEAD `79aa7ffce2563e0e3abc189b19054187daf1a43d`, versión publicada 1.27.0.

## 1. Objetivo y aterrizaje

Guardar el encargo y preparar una mejora mínima sustentada en el repositorio. El descubrimiento
encontró antecedentes de Sentinel, pero ningún motor/hook Sentinel previo. Se implementa fuente
candidata y verificación pura. El mandato de §6 excluye pruebas con efectos sin barrera exterior.

R, KIT, versiones, ejecutores y configuración observada están documentados en
[fuentes y cobertura](%5B01-1%5D/fuentes-y-cobertura.md). R no se amplió al padre por su AGENTS.md.
No se ejecutaron scripts encontrados sin revisar, Graphify sin grafo, MCP, servicios ni modelos de ensayo.

## 2. Resumen ejecutivo

Se guardó el prompt completo y se prepararon contrato, plantillas Codex/Claude, códecs puros,
contador de referencia y plan de laboratorio cerrado. Se corrigió la selección de exportación
de configuraciones personales y evidencias, conservando la identidad de controles. **24 tests
puros pasan. No se ha demostrado prevención, parada ni rollback en ningún harness.**

La prueba de arranque de `--version` con envoltura adicional de solo lectura/sin red terminó
antes de lanzar Codex: `sandbox_apply: Operation not permitted`, salida 71. No se intentó
escalación. No hay VM/contenedor autorizado acreditado; no se probaron borrados en el Mac.

## 3. Ficheros involucrados

| Cambio | Archivos / motivo |
|---|---|
| Contrato/candidato | [`sentinel/`](../../sentinel/README.md): razones y límites; configuración nativa sin permisos personales; Gemini DECLARADO |
| Funciones puras | [`core.py`](../../sentinel/core.py): mensajes escapados, deny por protocolo, conteo acotado/concurrente y atribución de prevención |
| Preparación del ensayo | [`lab.py`](../../sentinel/lab.py): 16 familias, 62 variantes por harness y gate de integración sin bypass |
| Exportación/identidad | [`governance_tree.py`](../../scripts/governance_tree.py), [`bootstrap.py`](../../scripts/bootstrap.py), `.gitignore`: separación de vistas y exclusiones exactas |
| Verificación | [`test-sentinel.py`](../../tests/test-sentinel.py), [`measure-sentinel.py`](../../tests/measure-sentinel.py): pruebas y medidas puras |
| Trazabilidad | Input/output [01-1], índices de prompts/gobernanza, README, CHANGELOG sin publicar; manifiesto de cierre E06 |

No se borró ningún archivo. Se preservaron los antecedentes no versionados, .DS_Store y otros
outputs locales. Sin stash, commit, push, fetch, cambio de rama, modificación de permisos activos,
HOME o configuración global. El veto expreso del usuario resuelve las excepciones a prácticas
05/14; no se solicitó permiso redundante. VERSION y ledger permanecen sin cambios.

## 4. Mapa de impacto

Camino modificado: clasificación por componentes → snapshot de exportación → bootstrap.
Camino de identidad: inventory/snapshot → fingerprint → clasificador/freshness; conserva settings
mixtos para detectar cambios de seguridad. Una diferencia personal puede causar revisión de
identidad: no se oculta el archivo completo para evitar ese coste. Otros archivos de permisos
con nombres arbitrarios no se reclasifican automáticamente ni se consideran seguros para exportar.

Las plantillas viven fuera de directorios de carga nativa. Los códecs no son hooks instalables:
no existe clasificación fiable de efectos arbitrarios ni observador con custodia. La exportación
solo conoce tres rutas personales concretas; no es un escáner universal de secretos o permisos.
La UI de Codex puede guardar aprobaciones permanentes en usuario, no localmente al proyecto.
No se ofrece esa opción como equivalente a la permanencia local pedida.

BBDD, backend de producto, API, iOS, Android y web: N/A. Bootstrap/copy/freshness son consumidores
del cambio de inventario; su integración con filesystem está pendiente, no cubierta por el test puro.

## 5. Verificación BBDD

N/A — no bases de datos, migraciones ni registros personales de autorizaciones.

## 6. Verificación API

N/A — sin API de producto ni servicios reales. Se contrastaron contratos públicos de harness
con [fuentes oficiales/versionadas](%5B01-1%5D/fuentes-y-cobertura.md), sin inferir carga efectiva.

## 7. Tests y validación

- E01/E02: baseline selectivo antes de cambiar código y descubrimiento saneado.
- E03: plan/criterios congelados antes de medir B; cero sesiones de modelo autorizadas en el plan.
- E04: **24/24 tests puros**, incluyendo denegaciones duplicadas/concurrentes, objeto Git por
  repositorio, turno ausente, estado agotado, permisos nuevos sin borrar historial, escapes de
  mensajes, contratos de salida y falso PASS por contención exterior.
- E05: cinco pares alternados de selección en RAM y nueve mensajes sintéticos; valores crudos,
  fórmulas y alcance en [métricas](%5B01-1%5D/metricas.md).
- E06: sintaxis, manifiesto/digests, estructura y preservación de archivos ajenos al cambio.

**Verification: V3 | pruebas puras + análisis estático del camino compartido | PARTIAL.**
Integración/E2E: **NO_VERIFICADO**. No se ejecutaron suites heredadas con trap/teardown destructivo
ni el checker general que puede invocar superficies ajenas al candidato. Esta exclusión responde
al límite de laboratorio del usuario; no se presenta como suites verdes. No se repitieron las
24 pruebas tras su éxito porque no cambió el código que cubren.

## 8. Resultados por dimensión

| Dimensión | Resultado y alcance |
|---|---|
| Seguridad de selección | En el caso puro, B excluye 3/3 rutas personales y A 0/3; cinco rutas legítimas conservadas. A es reconstrucción de la selección inicial, no ejecución de bootstrap. |
| Seguridad runtime | INCONCLUSO: ningún intento con efectos; no hay prueba del primer bloqueo, custodia o protección interna. |
| Utilidad | Igual selección legítima en el caso puro; tareas ordinarias reales de harness pendientes. |
| Rendimiento | Mediana de selección A 0.005542 ms, B 0.009041 ms; +0.003499 ms. Muestra pequeña, sin mejora de rendimiento reclamada. |
| Reintentos | Conteo de referencia validado dentro de un proceso; sin parada del bucle, sin contador nativo interprocesos y sin persistencia entre sesiones. |
| Mensajes | Seis criterios técnicos pasan en nueve ejemplos; 143–159 caracteres, 145–161 bytes de texto. Canal real y comprensión humana NO_VERIFICADOS. |
| Tokens/coste | Tokens de construcción y operación NO_DISPONIBLE; cero sesiones de modelo de ensayo. No estimación bytes/4 ni ahorro económico. |
| Recuperación | Datos A/B, B→A y A2 NO_VERIFICADOS; parches preparados no cuentan como rollback probado. |

La [tabla A/B por adaptador](%5B01-1%5D/metricas.md) conserva A/B/Δ en null. No hay resultados
de una ejecución inexistente. El corpus de 62 variantes por harness es planificación pendiente,
no cobertura ejecutada. No se agregan dimensiones en una nota que compense pérdida con velocidad.

## 9. Checklist E2E

- [x] Fuente del encargo, convención y antecedentes conservados.
- [x] Candidato revisable y comprobaciones puras.
- [x] Sin activación/propagación ni blancos reales en pruebas.
- [ ] Barrera exterior y W_A/W_B/W_E independientes.
- [ ] Configuración cargada, permisos, trust, confinamiento y custodia por versión/canal.
- [ ] Efectos reales positivos/negativos, reintentos, fin de hijos y parada nativa.
- [ ] Consentimiento humano, mensajes en canal real, persistencia y revocación.
- [ ] Rollback de datos y gobernanza con nueva carga A2.

## 10. Revisión, decisiones y riesgos

**Seguridad:** crítico para activación: no hay barrera exterior acreditada; no ejecutar los
casos con efectos. Severo: una raíz escribible permite pérdida interna y un intérprete puede
ejecutar código externo legible; estos helpers no lo resuelven. Severo: contador y fuentes
editables no tienen custodia independiente; los hashes no conceden esa garantía. No se han
introducido permisos activos ni un bypass para superar estas limitaciones.

**Calidad/rendimiento:** severo: faltan ensayos de integración y rollback, por lo que activar
excedería la evidencia. Moderado: cambió la selección de snapshot usada por bootstrap; comprobar
E2E en el futuro laboratorio antes de distribuir. Moderado: la comparación pura reconstruye
la selección A y mide una función muy corta; no estima latencia de hook/modelo. Durante revisión
se corrigieron la atribución de integridad final inconsistente y una comprobación tautológica
de etiqueta antes de medir; no quedan como resultados verdes ficticios.

Revisión técnica de claridad hecha por el agente; ninguna firma humana ni PR/MR. El gate de
aseguramiento IA se consultó al cierre; no se inventa sign-off de propietario. No es entrega
lista para merge/publicación. Soluciones y precondiciones concretas: [activación y reversión](%5B01-1%5D/activacion-y-reversion.md).

## 11. Memoria y evidencia conservada

Checkpoint: [`tmp/continuidad.md`](%5B01-1%5D/tmp/continuidad.md). Evidencias y propuestas:
[`evidence/`](%5B01-1%5D/evidence/README.md). Tamaño exacto de archivos enumerados en E06; no hay
fixtures destructivas ni worktrees que limpiar. La zona se conserva, sin traps ni limpieza
automática. W_E no se ha creado y staging no se etiqueta como custodia verificada.

## 12. Siguiente paso

La preparación independiente está terminada. Para continuar hace falta un entorno aislado con
identidad desechable y un backend específico que acredite observación/custodia. Después se podrá
ejecutar el plan congelado y resolver las brechas de protección interna y parada antes de
considerar activación. No se pide desproteger esta sesión ni acceso general al equipo.

Usar este [procedimiento revisable](%5B01-1%5D/activacion-y-reversion.md); no volver a ejecutar
todo el prompt ni las pruebas puras si sus digests no han cambiado. El resultado runtime sigue
**INCONCLUSO**, sin forzar una conclusión favorable.
