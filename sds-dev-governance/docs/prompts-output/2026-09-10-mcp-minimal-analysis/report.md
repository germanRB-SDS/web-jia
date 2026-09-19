# Análisis del refinamiento mínimo de SDS para MCP

## 0. Metadata

2026-09-10 · Codex · LEVEL 3 analítico, áreas security/deployment.
Análisis COMPLETADO; propuestas NO IMPLEMENTADAS. Kit v1.27.0, rama `main`,
HEAD `79aa7ffce2563e0e3abc189b19054187daf1a43d`.

Decisión final del propietario, 2026-09-10: «recoge que no es necesario implementarlo».
**CERRADO SIN IMPLEMENTACIÓN NECESARIA.** Las propuestas se archivan como referencia,
sin trabajo pendiente ni reanudación automática al volver a abrir Codex o la terminal.

Informe puntual solicitado por el propietario. No es una regla portable, una admisión ni un
documento de carga habitual. Sólo se han creado este output y su evidencia; el hub tenía trabajo
anterior/concurrente que se ha preservado. No se han usado herramientas MCP del proveedor.

## 1. Objetivo y alcance

Determinar qué parte de la revisión web aporta una mejora demostrable, considerando que el OAuth
oficial ya funciona. La instrucción actual pide análisis, admite un resultado pequeño o nulo y
prevalece sobre los encargos de implementación incrustados en los documentos de referencia.

Trabajo realizado: resolver autoridad y estado; contrastar propuestas con código y evidencias;
reproducir defectos locales; decidir qué conservar, corregir o posponer; fijar aceptación y coste.
No se ejecutan las fases del prompt anterior ni se genera otro prompt extenso por inercia.

## 2. Veredicto

**No hace falta ejecutar el refinamiento completo para usar el modo VPS/DNS ya autorizado.**
El expediente del hub registra una excepción temporal explícita y cuatro lecturas reales correctas.
La propuesta anterior partía de un estado previo: su dossier fue exportado antes de esa conexión.

La evaluación identificó dos correcciones posibles del tooling offline, conservadas sólo como
referencia tras la decisión final de no implementar:

1. Conservar los motivos concretos en `check` y mostrarlos en `doctor`.
2. Incluir `cwd` en la huella de configuración observada.

Ambas corrigen comportamientos reproducidos, sin un servicio nuevo ni contexto permanente adicional.
Mejoran la exactitud del diagnóstico; **no hay ahorro de tokens medido**, ni evidencia de que deban
interrumpir ahora el trabajo con Auragenda. Si el tooling offline no se va a utilizar próximamente,
posponer ambas también es una decisión razonable.

No recomiendo nuevas reglas generales, otro login, cinco comandos nuevos, cachés, un broker,
una plataforma de aprobaciones, un refactor transversal ni una migración de todos los MCP.
La custodia independiente queda como requisito del modo gestionado, todavía cerrado; no se declara
satisfecha ni innecesaria porque haya funcionado OAuth bajo una excepción.

## 3. Fuentes, hechos y hallazgos

El [manifiesto](evidence/source-manifest.json) identifica 27 fuentes, sus hashes y el alcance de
lectura. Se consultó el índice del dossier D01–D57, D55/D56 y las fuentes originales pertinentes.
D02 coincide con su original inspeccionado. **No se leyó ni se auditó el dossier entero.**
Los ledgers y recibos del hub son instantáneas locales, algunas aún sin commit; los hashes no
acreditan por sí solos autoridad. La resolución explícita del propietario está en el ledger.

| ID | Hallazgo y evidencia | Clase y alcance | Consecuencia / cambio mínimo / aceptación |
|---|---|---|---|
| F01 | El [ledger del hub](../../../../docs/governance/capability-registry.md) admite temporalmente OAuth y tres herramientas VPS/DNS para Auragenda. El [recibo REL-07](../../../../docs/prompts-output/REL-2026-09-10-07/evidence/hostinger-initial-read.json), fechado a las 15:38:22 UTC, registra cuatro llamadas correctas. | Contrato local explícito + evidencia histórica de ejecución, no repetida en este análisis. No acredita titular OAuth por un endpoint independiente, SSH, despliegue ni permisos generales. | No rehacer login ni conexión como prerrequisito de este análisis. Para futuras operaciones, comprobar vigencia y alcance del modo exacto. |
| F02 | [Gateway](../../../mcp/gateway.py), [perfil](../../../mcp/hostinger.json) y [CLI](../../../mcp/cli.py) siguen cerrados. `check` siempre devuelve `allowed:false`. | Hecho del código v1.27.0; cierre intencional, no defecto de conexión. | No añadir un interruptor de habilitación ni convertir un PASS documental en permiso. El OAuth temporal es otro modo. |
| F03 | [Módulo MCP](../../../practices/modules/07-mcp-control.md), [admisión](../../../practices/modules/11-capability-admission.md) y [lector selectivo](../../../practices/modules/01-selective-text.md) ya cubren controles por operación, reutilización sin delta y consulta documental acotada. | Contrato vigente e implementación existente del lector. | Reutilizar. No crear `sds-mcp doc`, otro índice ni repetir G1–G6 por cada consulta sin cambios. |
| F04 | Sin ledger, check dice `LEDGER_MISSING` y doctor sólo `BLOCKED_SECRET_ISOLATION`. Con identidad cambiada ocurre lo mismo. Con capas Codex duplicadas, inventario dice `BLOCKED_CONFIG_AMBIGUITY`, pero check devuelve `NOT_EVALUATED`. | Reproducciones sintéticas actuales en [observations.json](evidence/observations.json); causa en `cli.py`. El bloqueo genérico de doctor sigue siendo cierto, pero oculta defectos locales concretos. | Candidato A. No ampliar permisos; conservar el motivo y devolver diagnóstico del cliente solicitado. |
| F05 | `public_revision()` omite `cwd`. Dos configuraciones con distinto directorio tienen la misma huella; la segunda observación devuelve `revision_changed:false`. | Reproducción actual + [inventory.py](../../../mcp/inventory.py). Afecta la señal de cambio; no se demostró acceso indebido. | Candidato B. Un cambio sólo de cwd debe cambiar la huella y detectarse, sin imprimir la ruta. |
| F06 | Check y doctor llaman a `observe()`: descubren configuraciones de varios clientes y escriben inventario. Un check repetido produjo una escritura atómica; se crearon `inventory.json` y `lock`. | Código y fixture local. No se midió un cuello de botella ni efecto remoto. | Declarar efectos locales. Posponer separación check/refresh y optimización del recorrido hasta medir una necesidad real. |
| F07 | El registro de herramientas de esta sesión anuncia tres lecturas Hostinger y un `hostinger-hosting/sds_status`. La copia de configuración revisada ya limita VPS a dos herramientas y DNS a una. | Observación de metadatos del harness y copia documental; no invocación, inspección de procesos ni medición de schemas dentro del modelo. | No partir de un catálogo completo hipotético. Revisar el status sobrante sólo si se decide ajustar la configuración de ese cliente. |
| F08 | El conjunto que mide el checker —kernel, INDEX y skills/README— suma 3.000 palabras, 22.130 bytes. La revisión web ocupa 23.879 bytes y el dossier 414.427 bytes. | Conteos de archivos; no tokens. No incluyen adapters, ledger, mensajes ni schemas. | No incorporar informe, revisión o dossier a routers/adapters. No aumentar el límite para acomodarlos. |
| F09 | La [evaluación de la excepción](../../../../docs/governance/evaluation/2026-09-10-auragenda-hostinger-exception.md) declara OAuth bajo el mismo usuario y allowlist del cliente, sin aislamiento OS ni broker. | Riesgo severo ya aceptado temporalmente; no nuevo incidente ni prueba de exfiltración. | No generalizar la excepción. Si se exige impedir técnicamente acceso al secreto o a recursos ajenos, hará falta una frontera comprobable. |
| F10 | El parser del ledger sólo observa estados restrictivos de una fila específica entre marcadores. La excepción temporal tiene su resolución fuera de ese bloque y conserva otra ruta de control. | Código + contrato local explícito. Es un límite intencional del checker cerrado. | No mover la excepción ni ampliar el parser para fabricar un `allowed:true`. Explicar el alcance del diagnóstico. |
| F11 | El dossier de las 13:31:49 UTC dice que no se había aprobado la excepción; las fuentes posteriores registran su aprobación y las lecturas. | Historia frente a contrato local posterior explícito; no dos contratos activos incompatibles para el mismo modo. | No usar el dossier como estado actual ni bloquear el análisis esperando repetir decisiones resueltas. |
| F12 | REL-02 conserva tiempos y tests del gateway cerrado. No hay comparación equivalente entre ese gateway y las lecturas reales. | Evidencia histórica con alcance distinto; no benchmark de ahorro. | No usar su latencia, el 85/100 ni los objetivos 512 bytes/100 ms como retorno demostrado de la propuesta. |

La advertencia de la revisión web sobre tokens está bien fundada: la ejecución local puede reducir
el material que llega al modelo, pero también añade infraestructura y mantenimiento. La decisión
depende del trabajo y del cliente, no de llamar al procedimiento «comando».
[Anthropic, Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp).

## 4. Cambios candidatos e impacto

### A. Diagnóstico que preserve la causa

Problema: F04 obliga a reconstruir mediante inventario o lectura de código información que el
programa ya conoce. `check` filtra por `effective` antes de preservar la causa de ambigüedad;
`doctor` devuelve un estado fijo sin usar los hallazgos de identidad del cliente solicitado.

Cambio mínimo propuesto: seleccionar las observaciones del cliente/servidor, conservar sus motivos
de denegación y hacer que doctor los muestre de forma compacta. Distinguir el cierre general del
runtime de los problemas locales encontrados. Una función pura pequeña en la CLI puede evitar
duplicar esa selección; **no hace falta crear un motor de autorización ni cambiar el gateway**.

Mantener `allowed:false`, los códigos de salida y las denegaciones. Si se añaden campos al JSON,
comprobar sus consumidores; no hacer que `NOT_EVALUATED` o un modo no soportado parezcan admitidos.
La documentación del comando debe indicar que diagnostica el modo gestionado cerrado y no evalúa
excepciones con otra ruta. Esa aclaración cabe en la documentación MCP existente, bajo demanda.

Aceptación: fixtures de ledger ausente, identidad distinta, capas duplicadas, configuración cerrada
esperada y cliente ajeno. Cada caso identifica su causa sin errores crudos, rutas ni credenciales;
ninguno abre acceso ni recomienda saltarse una denegación. Probar los consumidores de esa salida.

Beneficio verificable: desaparece la pérdida de información reproducida. Menos rondas de diagnóstico
es una expectativa, no una medición. Coste limitado a CLI, tests afectados y documentación del
comando; sin dependencias, caché, proceso residente ni nuevas instrucciones de arranque.

### B. Detectar cambios de cwd

Problema: F05. El directorio puede cambiar resolución de scripts relativos y configuración cargada;
la propia copia Hostinger revisada lo declara. La huella actual no registra esa diferencia.

Cambio mínimo propuesto: incorporar `cwd` a los campos observados por `public_revision()`, manteniendo
la salida saneada. No resolver rutas mediante ejecución, abrir secretos ni publicar el contenido
de la configuración. No describir esta huella como identidad efectiva completa: las superficies
no observables y el entorno continúan teniendo sus límites explícitos.

Aceptación: misma configuración produce igual huella; cambio sólo de cwd produce huella distinta
y `revision_changed:true`; el valor de cwd no aparece en stdout/stderr. Reutilizar el estado previo
como observación histórica, sin tratar la nueva huella como nueva admisión.

Beneficio verificable: desaparece el falso negativo de cambio. No promete menor consumo de tokens.
Coste: una corrección de inventario y pruebas de esa señal. No exige rediseñar la configuración.

Ambos candidatos pueden resolverse en un único cambio pequeño, o de forma independiente. Su
corrección no equivale a una auditoría completa de seguridad. Se entregarían con una nueva revisión
según el proceso normal; el instalador rechaza contenido diferente bajo la misma versión. Corregir
el canónico no actualiza automáticamente la copia global instalada ni la admisión de los proyectos.

| Superficie | Delta propuesto si se implementan A/B |
|---|---|
| `mcp/cli.py` | CHANGE por A. |
| `mcp/inventory.py` | CHANGE por B. |
| `tests/test-mcp-control.py` | CHANGE: regresiones de los casos reproducidos, sin repetir pruebas ajenas. |
| `mcp/README.md` | CHANGE pequeño por diagnóstico y efectos locales, si la descripción queda incompleta. |
| Gateway, custodia, lotes, OAuth, perfil y lockfile | N/A: no cambia acceso ni integración. |
| Kernel, prácticas, INDEX, skills, adapters y scaffold | N/A: no aparece regla ni ruta nueva. |
| `init.sh`, motor de bootstrap y metaprompt | N/A: no cambia materialización ni interfaz. |
| Versión/changelog/evidencia de release | Sólo cuando se entregue una revisión de código; no se hace ahora. |
| Instalación personal, ledgers y repositorios hijos | Sin cambio implícito. Una adopción futura requiere su alcance y revisión propios. |

## 5. Persistencia y BBDD

Sin BBDD de producto ni migraciones. La persistencia observada es el inventario local (F06).
Separar consulta y refresh podría reducir I/O, pero añade una decisión de frescura y compatibilidad.
No se propone ahora: falta evidencia de frecuencia, coste relevante o fallos que lo justifiquen.
No añadir caché para evitar una escritura de inventario sin medir primero el problema.

## 6. API, seguridad y comandos

No se llamó a Hostinger, no se ejecutó login ni se leyeron credenciales. El recibo anterior demuestra
las cuatro lecturas a su fecha; no verifica vigencia de la sesión ahora. Además, registra que las
zonas consultadas no eran el DNS público autoritativo: una respuesta correcta no demuestra que
Hostinger controle el efecto deseado sobre esos dominios. No implica que debamos consultar otro
proveedor durante este análisis.

Un PASS previo nunca sustituye la autorización de una operación. Esto ya está en SDS. Repetirlo
en otro documento obligatorio no añade enforcement. Tampoco `enabled_tools` impide por sí solo
acceder mediante shell a lo que permita la identidad del sistema: en este caso el ledger declara
esa limitación. La documentación MCP también distingue los riesgos de servidores locales y sus
restricciones técnicas. [MCP, Local MCP Server Compromise](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices#local-mcp-server-compromise).

| Propuesta web | Situación comprobada | Decisión |
|---|---|---|
| `sds-mcp doc <ID>` | Existe `scripts/sds-text` con list/get/check/index y dependencias documentales. | No duplicar. Para archivos cortos, lectura directa. |
| `sds-mcp check --json` | Existe check y ya emite JSON. No existe ni hace falta ese flag. Escribe inventario local, no consulta al proveedor y siempre deniega el modo gestionado actual. | Corregir diagnóstico A; conservar interfaz cuando sea posible. |
| `sds-mcp doctor --json` | Existe doctor, ya emite JSON y escribe observación local. Su diagnóstico es demasiado genérico. | Corregir A; no crear un segundo comando. |
| `sds-mcp verify --offline --json` | Hay tests sintéticos existentes; no existe este subcomando. | No envolver la suite sólo para renombrarla. No añadir un paso a cada sesión. |
| `sds-mcp read ...` | No existe una lectura real mediante el gateway SDS. El cliente ya dispone de tres herramientas admitidas en el modo temporal del hub. | No crear una CLI paralela por eficiencia supuesta. Un modo protegido sería otro proyecto técnico. |

Ninguno de esos nombres propuestos debe copiarse como comando ejecutable. El análisis matemático,
un catálogo universal y los workers automáticos tampoco cubren una necesidad demostrada aquí.

## 7. Validación y medición

**Verification: V0 | evidencia documental y reproducciones diagnósticas acotadas | PASS.**
PASS significa que el informe y los hallazgos tienen evidencia; no que los defectos estén corregidos
o que el acceso gestionado esté aprobado. Sin delta ejecutable, no se reejecuta la suite completa.

Comprobaciones realizadas:

- 14 archivos MCP relacionados coinciden con el manifiesto de implementación anterior.
- Fixtures con Python 3.14.6 reproducen F04/F05 y la persistencia de F06; se interceptaron creación
  de subprocess y sockets durante el diagnóstico. Esto no demuestra aislamiento OS.
- Salidas check observadas: 132–142 bytes, según el caso; doctor: 189 bytes. Son respuestas
  sintéticas, no tamaños del proveedor ni del contexto total.
- Conteos de bytes/palabras de F08, fuentes fechadas, D02 cotejado y revisión de coherencia del informe.
- [Reproducción](evidence/reproduce.md), [resultados](evidence/observations.json) y
  [fuentes](evidence/source-manifest.json) separados del informe, sin copiar el dossier.
- [Validación documental](evidence/validation.json): enlaces locales, fuentes estables,
  JSON y sintaxis del bloque reproducible comprobados; sólo se añade este output al canónico.

No ejecutado: API real, pruebas de login/renovación, tests de aislamiento del host, benchmarks del
cliente, procesos/RAM, medición de tokens, instalaciones, suite general ni publicación. No son
necesarios para verificar los dos defectos locales y no hay evidencia nueva de esas garantías.

La consulta pública recuperó la referencia Anthropic y la guía MCP. El README Hostinger de la
revisión exacta no se recuperó por web; sus detalles históricos se contrastaron con D55/D56 y el
expediente local. No se tomó la rama actual de GitHub como sustituto de la revisión instalada.

## 8. Eficiencia bajo demanda y propuestas descartadas

**Objetivo razonable: cero crecimiento de contexto permanente por esta mejora, no contexto cero.**
Las instrucciones existentes, el descubrimiento de una herramienta y su resultado tienen coste.
Los documentos en disco que el cliente no lee no son por sí solos contexto del modelo; sí ocupan
espacio de almacenamiento. No se justifica una infraestructura para ahorrar unos archivos de texto.

Ruta suficiente con los mecanismos existentes:

| Situación | Carga / operación necesaria |
|---|---|
| Trabajo sin MCP | No abrir guía MCP, dossier o este análisis; no añadir un check de MCP al arranque general. |
| Uso de un modo exactamente admitido | Ledger y restricciones del proyecto, identidad/revisión y ruta de control de ese modo; herramienta/operación necesaria. No nueva auditoría integral sin delta. |
| Cambio de versión, permisos, configuración o alcance | Sólo módulos y gates afectados; el control vuelve a negar lo no admitido. |
| Fallo de configuración gestionada | Check concreto y doctor local cuando aporte información; no repetir login automáticamente ni usar otro modo como fallback. |
| Evaluación de seguridad o nuevo modo | Módulo MCP y admisión bajo demanda; la excepción de otro proyecto no se hereda. |

La sesión ya presenta una superficie pequeña: tres lecturas y un status local en el
[registro observado de herramientas](evidence/tool-metadata.json). Sus descripciones suman
1.061 caracteres, pero ese conteo **no** incluye schemas,
serialización o mecanismos de descubrimiento y **no** permite calcular tokens facturados. El
status de hosting puede ser candidato a retirada de esa configuración si no tiene una finalidad;
no se atribuye su origen a un archivo concreto ni se modifica a ciegas.

Para decidir un ajuste adicional del cliente basta una comparación pequeña, cuando exista una
tarea repetida real: misma versión/superficie, tarea y datos; sesión nueva con selección actual y
con selección mínima nativa; resultado útil y errores equivalentes. Registrar herramientas realmente
ofrecidas, bytes entregados al modelo, llamadas/reintentos, tiempo y contador de tokens si está
disponible. Sin ese contador, publicar bytes y dejar el ahorro de tokens desconocido. No comparar
un gateway que sólo deniega con una lectura útil ni calcular p95 sin muestras suficientes y método.

| Alternativa | Decisión actual | Condición concreta para reabrir |
|---|---|---|
| No modificar más SDS | Válida; el acceso temporal ya tiene ruta propia. | Que los defectos diagnósticos obstaculicen uso del tooling, o se quiera corregir su exactitud. |
| Reducir módulos/status mediante configuración nativa | Opcional del cliente; no requiere una nueva regla SDS. | Identificar su origen y necesidad; comparar superficie nueva y preservar herramientas requeridas. |
| Check puro o descubrimiento por cliente | Pospuesto; hay I/O adicional, no impacto medido. | Repetición relevante, latencia o dependencia de estado que cause un problema reproducible. |
| Proyección de respuestas antes del modelo | No implementar ahora un wrapper. Es una buena propiedad ya exigida para la frontera protegida. | Respuestas realmente grandes/sensibles y un punto admitido donde reducirlas conservando lo necesario. Filtrar después de mostrarlas llega tarde. |
| Caché de política, schemas o respuestas | Descartada en este alcance. | Necesidad medida y reglas de invalidación/revocación demostrables. Nunca cachear un permiso antiguo para eludir control. |
| Nuevo login o copia de tokens | Descartado. | Sólo otra identidad/modo expresamente seleccionado que necesite autenticación propia. |
| Broker/custodio con servicio separado | No justificado como optimización. | Requisito explícito de aislamiento técnico, operaciones más amplias o sustitución del modo temporal; aceptación OS y mantenimiento propios. |
| Canal de dos confirmaciones/destrucción | Fuera del problema de lectura. | Encargo específico de operaciones que lo requieran, sin alterar la regla GitHub manual-owner-only. |
| Refactor común de todos los MCP / activador universal | Descartado. | Duplicación y beneficio observados en varios modos concretos, con límites de cada proveedor y cliente. |
| Nuevo inventario/ledger/índice/vector store/framework de métricas | Descartado. | Los existentes ya cubren esta necesidad; no hay carencia comprobada que lo justifique. |

## 9. Checklist de cierre por capas

- [x] Contrato portable, excepción local e historia distinguidos.
- [x] Propuesta contrastada con código; dos correcciones acotadas con aceptación.
- [x] Ningún permiso, autenticación, configuración personal ni producto modificado.
- [x] Informe fuera de la carga habitual; sin nuevas reglas, comandos o dependencias.
- [x] Evidencia reproducible y límites de medición explícitos.
- [ ] Acceso gestionado con custodia independiente: no entregado, fuera de este análisis.
- BBDD, APIs de producto, web, Android, iOS y despliegue: N/A, sin cambios.

## 10. Riesgos, alternativas y recuperación

Severo existente: el modo temporal no aporta aislamiento OS. El login correcto no elimina ese
riesgo; tampoco obliga a construir ahora un custodio en este encargo analítico. Su expiración,
revocación o ampliación reabre la decisión aplicable. Este informe no convierte lo temporal en
permanente ni anticipa la decisión del propietario.

Moderados: un diagnóstico demasiado genérico puede orientar a repetir acciones inútiles; omitir
cwd puede ocultar un cambio observado. A/B corrigen esos efectos, pero hoy todas las rutas del
checker gestionado siguen cerradas. No se ha demostrado que causen acceso indebido.

Riesgo de sobreingeniería: nuevos servicios, política compilada, actualización protegida y caches
introducen obligaciones permanentes para resolver una lectura que ya tiene una vía autorizada.
No hay retorno medido que justifique ese alcance por eficiencia. Si se exige aislamiento técnico,
su coste corresponde a ese requisito de seguridad y debe valorarse separadamente.

No se detectó ni provocó un incidente crítico en este análisis. Esto no certifica ausencia de
vulnerabilidades en Hostinger, el host o todos los caminos alternativos.

Recuperación de A/B si se implementan: revisión correctiva o revert revisado de los archivos
afectados, manteniendo el cierre de acceso y sin restaurar configuraciones personales a ciegas.
No reinstalar encima de la versión fija existente ni cambiar credenciales para corregir diagnóstico.
Este análisis sólo añade documentos; no requiere recuperación de runtime.

## 11. Memoria y trazabilidad

No se actualizan memorias permanentes, adapters, ledgers ni documentos normativos. No se copia la
excepción del hub al kit portable. Este informe y su evidencia quedan en el output de la tarea;
no se añaden enlaces a ningún archivo siempre leído. Tmp aplica por LEVEL 3 y continuidad.

Práctica 14 y AI assurance: N/A por análisis sin cambios ejecutables. No hay commits ni publicación.
La documentación de release y la revisión/admisión de código sólo corresponderían a una futura
implementación autorizada. El informe no marca esas propuestas como terminadas.

## 12. Siguiente paso y continuidad

**Cerrado por decisión del propietario: no es necesario implementar este refinamiento.**
No ejecutar el prompt largo anterior ni A/B. Los candidatos y su evidencia quedan archivados,
sin tareas pendientes de esta iniciativa. Una reapertura requeriría un encargo nuevo explícito;
cerrar y volver a abrir Codex o la terminal no la reanuda.

Esta decisión no amplía permisos ni cambia la vigencia de la excepción MCP existente.
El análisis y la continuidad están guardados en disco para poder cerrar la sesión.

Antes de un trabajo futuro, revalidar las fuentes locales que pueden haber cambiado y la vigencia
de su autoridad. [Checkpoint](tmp/checkpoint.md). Los hallazgos son del HEAD identificado; la
evidencia de acceso real conserva su fecha anterior, y el rendimiento del cliente sigue sin medir.
