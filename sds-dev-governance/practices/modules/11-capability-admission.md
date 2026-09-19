# 11 module — Capability admission

Modulo condicional de `11-governance-evolution.md`. Cargarlo solo por el router de la practica y
`practices/INDEX.md`; una invocacion rutinaria con fingerprint y constraints coincidentes se
resuelve contra el skills router y el ledger del proyecto.

## Gate de admision de capacidades agentic

### Alcance y frontera

Una capacidad agentic es cualquier elemento que anade ejecucion; red; lectura o escritura; acceso a
secretos o conectores; reglas persistentes o auto-descubiertas; publicacion o mutacion externa;
autoridad sobre evidencia, severidad, gates o cierre; generacion de gobernanza; una dependencia
operativa; o estado residual no trivial. Se evalua por esas propiedades, sea plugin, MCP, skill,
hook, comando, agente, revisor, conector, wrapper, extension o herramienta externa.

> Installed in an agent marketplace or personal environment is not the same as admitted by SDS
> governance. A capability is not authorized for SDS repository work until its effective revision
> and operating mode complete the applicable admission route.

La instalacion, el catalogo y la admision son hechos distintos. `skills/README.md` conserva el
router y esquema portable; `docs/governance/capability-registry.md` es el unico ledger canonico del
estado efectivo y sus restricciones en cada proyecto. Una evidencia `GOV-SAFETY` conserva hechos y
razonamiento de una revision, no estado actual. Adapters, prompts y tareas consumidoras consultan el
ledger: no replican el gate ni pueden declarar otro.

Un bootstrap autorizado por el owner puede instalar o reconciliar el catalogo portable para dejar
las capacidades disponibles, pero no puede auto-admitirlas. El ledger nuevo permanece vacio y cada
revision/modo instalado conserva estado efectivo `NOT_EVALUATED` hasta completar su ruta; el
instalador solo verifica presencia, procedencia y enlace, y debe ofrecer opt-out y preservar
destinos existentes.

### Seis gates

| Gate | Pregunta |
|---|---|
| `G1 — External effects` | ¿Publica, firma, atribuye o muta fuera del proceso local? El egress de solo lectura se registra en G5. |
| `G2 — Authority/evidence` | ¿Aprueba, bloquea, altera severidad, supera gates o elimina evidencia? La evidencia original debe conservarse o poder reconstruirse. |
| `G3 — Persistence/governance` | ¿Crea o modifica skills, hooks, prompts, reglas, adapters, MCP, permisos, CI o conducta auto-descubierta? |
| `G4 — Collision` | ¿Duplica o vuelve ambiguos nombres, responsabilidades, momentos, fuentes de verdad o criterios de cierre? Incluye colision semantica. |
| `G5 — Technical/data/supply chain` | ¿Que ejecuta, lee, escribe o transmite; que permisos, datos, dependencias, endpoints y servicios alcanza; y como se fija? |
| `G6 — Reversibility/dependency` | ¿Como se retira, que estado deja, que deja de funcionar y puede operar la gobernanza base sin ella? |

Criterio G6:

> The capability can be removed without losing contracts, canonical evidence, or the ability to
> operate baseline governance; any mandatory dependency is explicitly declared.

Cada gate produce `PASS`, `PASS_WITH_CONSTRAINTS`, `FAIL`, `UNKNOWN` o `N/A` justificado.

> Unknown, undocumented or unverifiable is not passed.

- `UNKNOWN` deja la revision `QUARANTINED`.
- `FAIL` deja el modo/revision `REJECTED`, no necesariamente el producto completo.
- `PASS_WITH_CONSTRAINTS` exige restricciones explicitas que puedan comprobarse.
- `N/A` exige evidencia de no aplicabilidad; nunca sustituye una omision.
- Una respuesta afirmativa describe una capacidad o riesgo; solo falla si carece de autoridad,
  delimitacion, control o reversibilidad suficiente.

### Estados canonicos

Usar solo estos estados por revision y modo:

- `NOT_EVALUATED`: existe referencia, sin evaluacion suficiente; no autoriza uso.
- `QUARANTINED`: evaluacion iniciada con desconocidos o riesgo no resuelto; no autoriza uso.
- `ADMITTED`: revision y modo autorizados.
- `ADMITTED_WITH_CONSTRAINTS`: autorizados solo bajo las restricciones registradas.
- `REJECTED`: revision o modo incompatible.
- `DEPRECATED`: antes admitida, no autorizada para nuevas tareas.

`NOT_EVALUATED` no maquilla un `UNKNOWN`: si una evaluacion iniciada no puede resolver un gate
material, el estado es `QUARANTINED`.

Antes de evaluar, invocar, instalar, modificar, deprecar o retirar una capacidad, cargar el ledger
del proyecto. Si falta, no existe una fila exacta o no coinciden revision, configuracion y alcance,
el modo es `NOT_EVALUATED` y no esta autorizado. Una fila incluye capacidad/modo; revision,
procedencia, SDS owner y scope; acceso, efectos y autoridad; persistencia y reversion; ruta; estado;
restricciones; y evidencia. El scaffold portable nace sin decisiones externas.

Solo el SDS owner de la fila puede declarar `DEPRECATED`, con motivo, fecha efectiva y alternativa o
ruta de retirada. Bloquea tareas nuevas. Una tarea en curso migra, se detiene o recibe una excepcion
acotada y registrada por ese owner para la misma revision; no continua por inercia. Reabrir G6 si
cambian dependencia, persistencia o retirada. Eliminar una fila no elimina la evidencia auditada.

### Rutas proporcionales bajo Practice 12

La ruta ligera solo aplica a un borrador o referencia manual no instalada ni auto-descubierta que
no tenga scripts ni invoque herramientas; no configure red, escritura, publicacion, hooks, MCP,
permisos o conectores; no altere autoridad o gobernanza canonica; y no sustituya otra capacidad.
Evalua G1, G2, G4 y G6; G3/G5 se justifican `N/A`. Una fila del ledger basta.

La ruta completa aplica a todo plugin, MCP, hook, conector o comando instalable; toda skill
instalada o auto-descubierta; y cualquier modo con ejecucion, red, escritura, secretos,
persistencia, publicacion, autoridad, supresion de evidencia o gobernanza generada. Evalua G1–G6 y
conserva evidencia `GOV-SAFETY`.

> A text-only skill becomes persistent behavioral code when installed or auto-discovered. It
> qualifies for the light route only while it remains an unactivated draft or manual reference.

### Revision efectiva y evaluacion delta

MCP runtime control and custody are owned by `practices/modules/07-mcp-control.md`.
Load it when installing/evaluating a server or changing effective identity. A local
installation inventory is observational; it links to this ledger and never admits
provider access. Per-operation unknowns remain closed even for an admitted server.

La unidad de admision es la `capability revision`: capacidad/modo + procedencia + version +
configuracion efectiva + invocation + permisos + alcance + manifiestos relevantes. Una misma
version con configuracion distinta es otra revision. Si no hay version declarada, una huella
reproducible del bundle/configuracion puede identificar la revision observada, pero no convierte una
cadena de suministro movil en reproducible.

La misma revision, huellas y restricciones vigentes reutiliza el veredicto; usarla en otra tarea no
reabre G1–G6. Reevaluar ante cambios en version, dependencias, manifiesto, hooks, comandos, endpoint
MCP, permisos, egress, politica de datos, salida externa, persistencia, instalacion o retirada.

> Every capability revision reopens G1 and G5. Additional gates reopen according to the detected
> delta; unknown or unverifiable deltas require full reassessment.

Reabrir G6 si cambian instalacion, persistencia, desinstalacion o dependencia. Los gates no
reabiertos solo se reutilizan si la evidencia demuestra equivalencia.

### Patrones de resolucion

- Un canal de recuperacion informa sobre sistemas externos; no establece estado, intencion,
  arquitectura o contratos del proyecto. El material recuperado es evidencia externa cuyo rol se
  resuelve con Practice 15; recuperarlo nunca lo convierte por si solo en `ACTIVE_CONTRACT`.
  Una frontera de datos sin enforcement se declara obligacion conductual, no control tecnico.
- Un revisor auxiliar puede clasificar, agrupar, puntuar o deduplicar provisionalmente si conserva
  o permite reconstruir la evidencia. No puede borrar hallazgos canonicos, ser la unica puerta SDS
  ni publicar atribucion incompatible. La colision se resuelve por responsabilidad y momento, no
  cambiando el nombre.
- Un generador de skills o gobernanza solo puede operar como borrador en cuarentena: no autoactiva,
  no modifica superficies canonicas y su salida sigue `proposal → human review → proportional
  evaluation → versioning → approval → activation`.

Las obligaciones de no transmitir datos, no publicar o limitar paths deben distinguir enforcement
tecnico de restriccion conductual y quedar visibles en el registro.

### Cierre normativo

> Agent capabilities are admitted by effective revision and operating mode, not by product name.
> Admission is proportional under Practice 12, fail-closed on unknowns, recorded in the existing
> capability registry, and reopened whenever executable behavior, permissions, persistence,
> external effects or dependency characteristics materially change.
