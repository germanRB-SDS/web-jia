# 11 — Evolucion sincronizada de gobernanza

## Problema que resuelve

La gobernanza tambien cambia: se anaden criterios, se eliminan secciones, se endurecen practicas y se ajustan prompts de generacion. Si esos cambios se aplican solo en un fichero, los proyectos nuevos y los existentes divergen.

## Regla

Todo cambio de gobernanza se analiza transversalmente, pero se propaga solo por impacto real. La
regla completa vive una vez en su propietario canonico; routers, adapters, scaffold y consumidores
solo conservan el trigger, referencia o materializacion minima que necesiten. Una superficie sin
delta se marca `N/A — motivo`: no se relee, reescribe ni revalida por ceremonia.

Las superficies candidatas son:

- La practica propietaria en `sds-dev-governance/practices/`.
- El kernel o router si cambia el descubrimiento universal o condicionado.
- Scaffold, `init-project-prompt.md` e `init.sh` solo si cambia lo materializado.
- `check-governance.sh` solo para invariantes deterministas, estables y de bajo falso positivo.
- Adapters del kit y raiz solo si cambia su trigger o comportamiento operativo.
- Plantillas de output solo si cambia el contrato de trazabilidad.
- `README.md`, `VERSION.md` y `CHANGELOG.md` si cambia el contrato publicado.

## Protocolo de cambio

1. Clasificar el cambio:
   - `GOV-RULE`: regla o criterio operativo.
   - `GOV-STRUCTURE`: carpeta, fichero, plantilla o convencion.
   - `GOV-PROMPT`: comportamiento requerido en prompts.
   - `GOV-SAFETY`: seguridad, no regresion, permisos o secretos.
   - `GOV-CONTINUITY`: checkpoints, memorias o reanudacion.
2. Identificar el propietario y los consumidores candidatos con
   `practices/RULE-COVERAGE.md`; usar la matriz de sincronizacion para registrar `CHANGE` o
   `N/A — motivo`.
3. Editar primero la practica canonical en `practices/`.
4. Propagar solo el delta necesario a routers, scaffold, bootstrap, adapters o plantillas.
5. Actualizar `init.sh` solo si afecta a estructura creada o verificaciones post-init.
6. Actualizar `check-governance.sh` solo si la regla puede verificarse sin interpretar prosa.
7. Actualizar `CHANGELOG.md` con version, fecha y resumen.
8. Registrar el cambio en `docs/governance/governance-change-log.md` con prompt base, ficheros
   tocados, motivo por fichero, sistema de utilizacion, fecha de incorporacion, fecha de ultima
   modificacion, verificacion, riesgos residuales y rollback/recuperacion.
9. Ejecutar una verificacion local:
   - `bash -n sds-dev-governance/init.sh`
   - `bash -n sds-dev-governance/check-governance.sh`
   - `rg -n "/U[s]ers/|/h[o]me/|[A-Za-z]:\\\\|t[e]ragenda" sds-dev-governance` para detectar contaminacion local no portable; resultado esperado: sin matches salvo excepcion documentada.
   - `rg -n -F "auragenda-home" sds-dev-governance/adapters sds-dev-governance/init-project-prompt.md`
     para confirmar placeholders en templates sin persistir rutas locales.
   - Revision manual de `README.md`, `init-project-prompt.md`, `GOVERNANCE.md` y `adapters/`.
10. Registrar el cambio en un output de prompt si se hizo mediante agente.

## Sincronizacion incremental e idempotencia

`practices/RULE-COVERAGE.md` es el indice derivado de propietarios, consumidores conocidos y
senales que reabren sincronizacion. Se actualiza en el mismo cambio solo cuando aparece, desaparece
o cambia una relacion material; no es una segunda fuente normativa.

Cuando existe `graphify-out/graph.json`, Graphify puede reducir el descubrimiento a un subgrafo:

```bash
GRAPHIFY_QUERY_LOG_DISABLE=1 graphify query "What consumes the governance rule being changed?"
```

El grafo propone candidatos; no decide autoridad, cobertura ni `N/A`. Confirmar los candidatos
contra el propietario canonico, el indice, el diff y busquedas deterministas. Si el grafo falta o
esta obsoleto, usar `RULE-COVERAGE.md` + `rg`; la gobernanza base nunca depende de Graphify. El
output generado de Graphify sigue siendo local, derivado y no versionado.

Una regla ya aplicada no vuelve a ejecutar su proceso completo en cada consumidor. El consumidor
referencia el owner o estado canonico. Solo reabrir la parte afectada cuando cambie el owner, el
trigger, la materializacion, la revision efectiva o una restriccion con caducidad. Si las huellas y
el delta demuestran equivalencia, reutilizar la evidencia vigente.

## Admision de capacidades agentic (modulo condicional)

La admision conserva sus criterios completos en
`practices/modules/11-capability-admission.md`. Esta raiz sigue siendo el entrypoint numerado de
evolucion de gobernanza; el modulo se carga solo cuando la tarea evalua, admite, instala, modifica,
depreca o retira una capacidad, o cuando el ledger muestra modo ausente, revision/configuracion
distinta, alcance ambiguo o delta material.

Una invocacion rutinaria cuyo modo, revision, ownership, alcance y constraints coinciden exactamente
con una fila `ADMITTED` o `ADMITTED_WITH_CONSTRAINTS` consulta
`skills/README.md` + `docs/governance/capability-registry.md` y no carga el modulo completo.

## Distribucion y promocion entre repositorios (modulo condicional)

SDS Governance se distribuye a `N` proyectos y absorbe de vuelta las mejoras validadas en ellos. El
contrato completo — autoridad canonica, estados de una copia distribuida, seleccion de candidato,
barrido de regresion/preservacion, split de version, procedencia y regla de no sobrescribir copias
descendentes — vive en `practices/modules/11-governance-distribution.md`.

Cargar ese modulo solo cuando la tarea distribuye gobernanza a un proyecto, promociona gobernanza de
un proyecto al canonico, audita copias distribuidas o resuelve un conflicto de version entre copias.
El trabajo de gobernanza dentro de un unico repositorio no lo carga.

`scripts/governance-copies.sh` es la herramienta de inventario y clasificacion. Opera sobre `0..N`
copias descubiertas dinamicamente y no contiene nombres de proyecto.

## Log detallado de cambios de gobernanza

Cada proyecto SDS debe mantener `docs/governance/governance-change-log.md`.

Este log es el indice operativo de cambios de gobernanza. Debe detallar:

- prompt base o pedido de usuario que origina el cambio;
- tipo SDS (`GOV-RULE`, `GOV-STRUCTURE`, `GOV-PROMPT`, `GOV-SAFETY`, `GOV-CONTINUITY`,
  `GOV-AUTOMATION`);
- fecha de incorporacion y fecha de ultima modificacion;
- sistema de utilizacion o descubrimiento (scaffold, init, validador, adapters, indice humano,
  Graphify/grafo, memoria, plantilla, output);
- cada fichero tocado, accion realizada, por que se modifica y efecto esperado;
- verificaciones ejecutadas;
- riesgos residuales;
- rollback o recuperacion.

`docs/governance/README.md` funciona como indice/resumen humano. El log detallado conserva la
trazabilidad por fichero y debe actualizarse en el mismo cambio que modifica gobernanza.

## Matriz de sincronizacion

La tabla propone candidatos, no ediciones obligatorias. Abrir/editar solo los que tengan una arista
de impacto confirmada; registrar los demas como `N/A — motivo` en la evidencia del cambio.

| Tipo | Superficies candidatas | Verificacion |
|---|---|---|
| `GOV-RULE` | `GOVERNANCE.md`, `practices/*`, `adapters/*` si afecta agentes, `init-project-prompt.md`, `README.md`, `CHANGELOG.md` | La regla aparece en el kit y en proyectos nuevos |
| `GOV-STRUCTURE` | `scaffold/docs/*`, `init.sh`, `init-project-prompt.md`, `practices/09-docs-structure.md`, `README.md`, `CHANGELOG.md` | Script y prompt crean la misma estructura |
| `GOV-PROMPT` | `practices/02-prompt-system.md`, `init-project-prompt.md`, `scaffold/docs/prompts-output-template/output-template.md`, `adapters/*` si afecta agentes, `scaffold/docs/memory/README.md` | Los prompts nuevos heredan la regla |
| `GOV-SAFETY` | `practices/07-security-baseline.md`, `.gitignore` generado en `init.sh`, `init-project-prompt.md`, `GOVERNANCE.md`, `adapters/*` si afecta agentes | Secretos y permisos siguen cubiertos |
| `GOV-CONTINUITY` | `practices/01-agent-memory.md`, `practices/03-output-traceability.md`, `adapters/*`, `scaffold/docs/prompts-output/README.md`, `scaffold/docs/prompts-output-template/output-template.md`, `scaffold/docs/memory/*` | Existe estado minimo para reanudar |
| `GOV-AUTOMATION` | `check-governance.sh`, `init.sh`, `init-project-prompt.md`, `README.md`, `CHANGELOG.md` | Las reglas automatizables tienen check |

## Checkpoints de continuidad

Para prompts largos o cambios con riesgo de quedarse a medias por limite de tokens, el agente debe mantener un checkpoint minimo en el output del prompt.

### Donde se guarda

`docs/prompts-output/[NN-R]prompt-output.md`, seccion `12. Siguiente paso recomendado` y, si el trabajo esta en curso, una subseccion `Checkpoint de continuidad`.

Para prompts largos, `LEVEL 3`, multi-fase o con alto riesgo de interrupcion, el agente puede crear
checkpoints temporales adicionales bajo:

```text
docs/prompts-output/<PROMPT_ID>/tmp/
```

La evidencia pesada o salidas largas van bajo:

```text
docs/prompts-output/<PROMPT_ID>/evidence/
```

No se guarda scratch memory bajo `docs/prompts/`.

### Contenido minimo

- Objetivo activo.
- Estado actual: `DONE`, `IN_PROGRESS`, `BLOCKED` o `PENDING`.
- Ultimo fichero o modulo tocado.
- Cambios ya aplicados.
- Cambios pendientes inmediatos.
- Comandos de verificacion ejecutados y resultado.
- Restricciones activas del usuario (p. ej. exclusion de una capacidad como pstack).
- Comando o prompt exacto para continuar.

### Regla de actualizacion

El checkpoint se actualiza:

- Antes de tareas largas.
- Despues de cada bloque coherente de cambios.
- Antes de ejecutar verificaciones costosas.
- Al detectar bloqueo.
- Al cerrar el prompt, aunque el resultado sea parcial.

### Consolidacion tmp/evidence

Antes de cerrar un prompt con tmp/evidence:

- reflejar el contenido util en final report, phase report, continuity state o memoria permanente
  relevante;
- comprobar que tmp, final report, memory, governance y Git no se contradicen;
- decidir si los tmp aportan valor de recuperacion/auditoria y se commitean, o si quedan
  consolidados en otro artefacto;
- verificar que no hay secretos, connection strings completas, tokens, claves privadas, dumps de BBDD
  ni datos personales innecesarios.

## Memorias parciales

Las memorias parciales solo se crean si el estado no cabe de forma limpia en el output del prompt o si afecta a una funcionalidad de larga duracion.

Ubicaciones permitidas:

- `docs/features/FTR-NNN-action-memory.md` para una funcionalidad concreta.
- el shard seleccionado por `docs/memory/index-<area>.md` cuando exista; en caso contrario,
  `docs/memory/<area>.md` para hechos verificados de area tecnica.

No deben contener reglas duplicadas. Las reglas viven en `sds-dev-governance/GOVERNANCE.md` y en las practicas de gobernanza.

## Carga selectiva de contexto

Cada prompt debe declarar o inferir areas afectadas antes de cargar memorias tecnicas.

Areas validas:

- `frontend`
- `backend`
- `api-openapi`
- `database`
- `security`
- `deployment`

Si el usuario no declara areas, el agente debe inferirlas desde el objetivo, rutas, ficheros mencionados y tipo de cambio. Esta regla debe vivir en `GOVERNANCE.md` y estar referenciada por cada adapter.

## Politica de bajo consumo de contexto

La continuidad no debe depender de releer todo el proyecto. En proyectos gobernados por este framework, el agente debe cargar contexto en este orden:

1. `sds-dev-governance/GOVERNANCE.md`.
2. Adapter raiz del agente (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md` o `.cursor/rules/`).
3. Prompt activo en `docs/prompts/`.
4. Output/checkpoint asociado en `docs/prompts-output/`.
5. `docs/features/FTR-NNN-action-memory.md` si hay feature activa.
6. Entrypoint `docs/memory/index-<area>.md` y solo sus shards enrutados si el area usa arbol;
   memoria plana `docs/memory/<area>.md` solo si el area aplica y no existe ese indice.
7. Ficheros de codigo o contratos estrictamente necesarios.

Reglas de ahorro:

- Referenciar rutas en lugar de copiar contenido.
- Mantener outputs compactos y accionables.
- Evitar logs completos, diffs largos e historico narrativo.
- Partir trabajos grandes en prompts numerados.
- Registrar comandos canonicos de validacion en `docs/runbooks/` cuando se repitan.

## Criterio de terminado

Un cambio de gobernanza esta terminado cuando:

- La practica canonical esta actualizada.
- Los proyectos nuevos lo reciben solo si cambia la estructura o el contrato materializado; en otro
  caso bootstrap queda `N/A`.
- `GOVERNANCE.md`, adapters y copias materializadas cambian solo si necesitan un trigger,
  referencia o comportamiento nuevo.
- La documentacion publica (`README.md`, `CHANGELOG.md`) refleja el cambio.
- `docs/governance/governance-change-log.md` contiene la entrada detallada del cambio.
- La matriz documenta cada candidato como `CHANGE` o `N/A — motivo` y hay una verificacion local.

## Anti-patrones

- Cambiar solo un adapter raiz y olvidar `GOVERNANCE.md` o `adapters/`.
- Cambiar solo el prompt de inicializacion y olvidar `init.sh`.
- Crear memorias parciales con reglas duplicadas.
- Guardar logs extensos como checkpoint.
- Dejar outputs parciales sin siguiente accion concreta.
- Repetir una regla completa en cada consumidor o reabrir gates sin delta material.
- Tratar el output de Graphify como autoridad o segundo indice canonico.

## Bootstrap preservation boundary

Bootstrap is file creation, never an upgrade or reconciliation of an existing kit.
`--dry-run` computes the complete write plan; `--files-only` invokes no capability installer.
Only newly generated files receive placeholder substitution or executable modes.
Existing identical files are no-op, differing files remain with a bounded `.sds-new` proposal;
pre-existing proposals, directory conflicts and links are preserved. Failure is nonzero.
An explicit hub never writes into independent children or changes Git metadata.
The metaprompt invokes the same engine and flags; it must not add installations or Git actions.

## Frescura y revisión activa

Al iniciar una fase sobre una revisión fijada, `scripts/governance-freshness.sh` puede informar
HEAD/dirty y consultar el ref remoto con timeout; no hace fetch/pull ni cambia la revisión activa.
Offline, ancestro desconocido, divergencia e incubación siguen explícitos. Una adopción real conserva
el contrato de distribución y registra revisión anterior/nueva y materializaciones revisadas.
Comandos y modo vendored en `practices/modules/01-selective-text.md`; su uso no auto-admite
capacidades ni comparte identidades entre proyectos.
