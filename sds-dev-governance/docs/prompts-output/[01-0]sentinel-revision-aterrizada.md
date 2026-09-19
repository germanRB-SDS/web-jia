# Sentinel: conclusiones y prompt aterrizado a SDS

## 0. Metadata

Fecha: 2026-09-12. Agente: Codex. Rol: revisión adversarial y especificación. LEVEL 3; área `security`; trabajo documental. Repositorio canónico: `sds-dev-governance`, HEAD observado `79aa7ff`, versión declarada v1.27.0. Change ID: N/A, sin cambio publicado ni propagación.

Estado: **IMPLEMENTADO, exclusivamente el entregable documental**. El candidato Sentinel no está implementado, configurado, admitido ni probado. [Prompt final](../prompts/%5B01-0-alpha%5Dsentinel-perimetro-local.md); [fuente histórica](../prompts/SDS-REVISION-sentinel-perimetro-local-2026-09-12.md).

## 1. Objetivo y dictamen

**El texto recibido sirve como revisión adversarial; no sirve, tal cual, como prompt de implementación.** Describe objeciones y pruebas pendientes, cita un adjunto ausente y no define un flujo ejecutable cerrado. El prompt revisado permite evaluar viabilidad y preparar un candidato concreto; la activación requiere evidencia que esta tarea documental no proporciona.

La petición actual autoriza archivar la revisión, corregir la propuesta y desarrollar ideas. Su precisión posterior exige contenido mínimo funcional y procesamiento local mediante comandos Bash. No autoriza ejecutar el diseño. No se han elevado los defectos citados del adjunto a hechos comprobados sobre este repositorio.

Trabajo realizado: preservar fuente → inspeccionar mecanismos y consumidores reales → contrastar documentación oficial → interrelacionar riesgos → redactar prompt con criterios → verificar los documentos. Frontend, API, BBDD, despliegue y proveedor remoto: N/A.

## 2. Hallazgos prioritarios y evidencia local

| ID / prioridad | Hecho y localización | Implicación para Sentinel |
|---|---|---|
| S1 — crítico antes de persistir permisos | [`scripts/governance_tree.py`](../../scripts/governance_tree.py), `IGNORED` y `snapshot`: ignora `.git`, `.DS_Store`, `__pycache__`; no interpreta `.gitignore`. [`bootstrap.py`](../../scripts/bootstrap.py) inventaría el kit y copia sus entradas. | Un JSON personal dentro del kit sería candidato a copia a otro proyecto. Debe excluirse explícitamente del contenido distribuible antes de contener permisos reales. No ha ocurrido tal copia en esta revisión. |
| S2 — severo, misma raíz causal | [`scripts/governance_copies.py`](../../scripts/governance_copies.py) calcula la identidad con `inventory`. `bootstrap.py` compara ese inventario para decidir si el kit existente difiere. | Una concesión local puede producir drift/fingerprint diferente, conflicto de reinicialización o `SPLIT_VERSION`, aun sin cambiar reglas. La exclusión de distribución y la identidad deben resolverse conjuntamente, con pruebas que sigan detectando cambios reales de gobernanza. |
| S3 — crítico para la garantía solicitada | El contexto efectivo suministrado a esta conversación declara lectura de `/`, escritura en proyecto y temporales y `approvals_reviewer = auto_review`. | Esta sesión no acredita lectura confinada ni revisión humana. Son hechos de configuración declarada por la plataforma, no resultados de intentos de acceso. No se ha alterado esa política. |
| S4 — severo para coste fijo | `wc -w` sobre kernel/INDEX/router produce **1.449 + 947 + 604 = 3.000 palabras**. [`check-governance.sh`](../../check-governance.sh) fija 1.700/1.000/3.000 como límites respectivos. | No queda margen en el conjunto siempre leído. Añadir otra checklist por defecto incumpliría el presupuesto. Buscar integración sin texto fijo nuevo; si hace falta router, recuperar espacio preservando obligaciones. Palabras no son tokens. |
| S5 — severo para latencia/fricción | `check-governance.sh` crea `CHECK_TMP`, limpia con `rm -rf` al salir e invoca tests de bootstrap de skills/plugins. | No es una función ligera de autorización por operación. Ejecutarlo siempre multiplicaría trabajo; un deny global a `rm` también chocaría con el cierre del validador. No se ha medido su duración ni ejecutado aquí. |
| S6 — relevante para instalación | [`init.sh`](../../init.sh) tiene 11 líneas y delega en `scripts/bootstrap.py`. El motor planifica escrituras, preserva originales, emite `.sds-new`, distingue `--files-only` y rechaza destinos dentro del kit fuente. | Integrar en el motor actual. No diseñar un generador paralelo ni correr el bootstrap real dentro del propio kit. Tampoco llamar no destructiva a una actualización de permisos sin probarla. |
| S7 — relevante para acceso opcional | No existen `graphify-out/graph.json`, `.codex/config.toml`, `.claude/settings.local.json`, adapters raíz ni `docs/memory/` en este checkout. El ledger no contiene una fila Graphify para este proyecto. | No atribuir configuración local a este checkout. Graphify puede seguir en el diseño como auxiliar, pero esta revisión no lo invoca ni lo instala. El documento `skills/graphify.md` no sustituye al ledger. |
| S8 — límite de la evidencia heredada | No se encontró `SDS-PROMPT-sentinel-perimetro-local.md`; tampoco está disponible la conversación anterior íntegra. | H-13/H-16 y otras comparaciones textuales se conservan como afirmaciones de la revisión aportada. No verificamos de nuevo su hash, las decisiones D completas ni su comparación con Claude. |

`command -v` encontró los dos CLI; `codex --version` devolvió **0.154.0** y `claude --version`, **2.1.269**. `uname -s` devolvió Darwin. Se leyó `codex --help`. Codex emitió un aviso de que no pudo crear aliases de PATH por permisos; no se intentó corregirlo. No equivale a identificar la revisión del servicio que ejecuta esta conversación. No se abrió una sesión Claude ni se usaron `/status`, `/permissions` o `/sandbox`.

## 3. Mecánica documentada: correcciones que cambian la propuesta

Codex documenta configuración local condicionada por confianza y precedencia. También documenta perfiles que restringen lectura externa con excepciones de runtime, por lo que **conviene probar primero esa vía nativa**. La sintaxis antigua de raíces escribibles no agota las opciones actuales. No mezclamos familias de configuración ni declaramos soporte local basándonos en la página. [Config basics](https://learn.chatgpt.com/docs/config-file/config-basic), [Permissions](https://learn.chatgpt.com/docs/permissions).

La referencia distingue raíces adicionales, excepciones de temporales y revisor humano/automático. Ninguna lista local por sí sola demuestra el perfil efectivo. [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference).

Claude documenta controles para lecturas exteriores, además del sandbox de Bash. El patrón de permisos de una herramienta y `denyRead`/`allowRead` del sandbox son sistemas distintos: no se debe trasladar la precedencia de uno al otro. Su cobertura debe evaluarse separadamente, incluidos hijos y canales que no usan Bash. [Permissions](https://code.claude.com/docs/en/permissions), [Sandboxing](https://code.claude.com/docs/en/sandboxing).

Los hooks tienen protocolos y fallos distintos. En Codex `write_stdin` no repite PreToolUse y `ask` no está soportado en ese evento; en Claude un hook que no arranca o expira no equivale a un bloqueo garantizado. Esto justifica que un hook sea complemento de una frontera efectiva, nunca prueba única de aislamiento. [Hooks Codex](https://learn.chatgpt.com/docs/hooks), [Hooks Claude](https://code.claude.com/docs/en/hooks).

Son páginas oficiales abiertas y consultadas el 2026-09-12; las URLs antiguas de Codex redirigieron a ChatGPT Learn. No son snapshots de la versión instalada ni resultados E2E. No se incorporan las notas históricas de versiones de la fuente como pruebas locales.

## 4. Premisas, consecuencias e interrelaciones

Premisas de diseño: **P1** libertad interna con SDS conservado; **P2** control de datos/efectos externos; **P3** independencia de la memoria del agente; **P4** mínimo contexto y cómputo local; **P5** permisos persistentes exactos dentro del kit; **P6** portabilidad sin contaminar otros proyectos. P5 y el uso de Graphify proceden de la revisión aportada; se conservan en la propuesta solicitada, sin afirmar haber visto la conversación anterior.

| Cruce | Cadena lógica si se cumple la condición | Qué hacer | Qué evitar y por qué |
|---|---|---|---|
| P1 + P4; H-05/09/14/20 | Veto general interno → tarea legítima bloqueada → aprobación ineficaz → reintentos y más contexto | Mantener operaciones ordinarias autorizadas; separar permiso concedible de prohibición existente | Detector general de «destructividad» basado en regex/tamaño: baja cobertura, falsos positivos y coste repetido |
| P2 + P3; H-01/04/06/07 | Hook cubre solo un canal → otro camino llega al recurso → protección depende del comportamiento del agente | Limitar el acceso en runtime/OS y comprobar cada canal activo | Equiparar script rápido o hook instalado con frontera completa |
| P3 + P5; H-03/08 | JSON editable por el agente → el agente añade permiso → verificador lo acepta → autoautorización | Separar intención, custodia de concesión y aplicación efectiva; proteger también el directorio/verificador | Confiar en 444, hash local o `approved_by`: no separan autoridades |
| P2 + P4; H-05/08/09 | Denegación sin transición válida → el usuario repite permiso → la operación sigue bloqueada | Una concesión comprobable y reanudación exacta; diagnosticar una vez el bloqueo no concedible | «Pregunta otra vez» o desactivar reglas para avanzar |
| P5 + P6; S1/S2, H-11/12/19 | Estado dentro del kit → copia física pese al ignore → ruta/permiso ajeno o drift → mantenimiento rompe fluidez | Excluir estado local de distribución e identidad; vincular permisos al proyecto receptor; verificar ambos | Cambiar solo `.gitignore` o excluir indiscriminadamente código del inventario |
| P1 + P2; H-18 | Prohibir cualquier lectura fuera → intérprete/librerías dejan de funcionar → se autoriza HOME entero para recuperarlo | Diferenciar recursos mínimos de runtime y datos personales; medir excepciones y semántica | Confundir ruta del binario con alcance de sus efectos |
| P3 + P4; H-10/20, S4/S5 | Precargar informe/autotest completo → cada sesión paga más → se empieza a omitir el control | Frontera permanente, verificación local acotada y diagnóstico bajo demanda | Cargar más Markdown para compensar una brecha técnica |
| P3 + P5; H-11/12 | Caché de permiso → revocación en JSON → proceso/sesión conserva acceso | Generación de política y revalidación; cierre/reinicio de afectados cuando sea necesario | Declarar revocación global al reiniciar una sola sesión |
| P1 + P3; H-13/15/17 | Protección incluye instalador y destinos → instalación queda bloqueada → se relaja sin contrato | Preparación inactiva, fixtures autorizadas desde el inicio, activación concreta por autoridad suficiente | Modificar HOME como fallback o presentar una fase con fixtures como «cero escrituras» |
| P4 + descubrimiento SDS; H-16/18 | Exigir reconstruir grafo siempre → coste/efectos innecesarios; prohibirlo siempre → perder descubrimiento útil | Graphify auxiliar cuando grafo y admisión existen; búsqueda determinista cuando no | Convertir herramienta opcional en requisito de arranque o prohibición universal |

La interrelación más importante es **P3 + P4 + P5**: el JSON pequeño y un script local pueden ahorrar inferencia, pero si el mismo agente puede editar ambos o decidir no ejecutarlos, no producen independencia de su memoria. El punto de control tiene que ser obligatorio y su autoridad resistente a modificaciones del proceso confinado. Esa propiedad tiene que existir en el harness/OS o requiere otro cambio de custodia; el prompt no puede fabricarla.

También hay una incompatibilidad que debe quedar visible: libertad de escritura interna implica capacidad técnica de perder datos internos. Sin restricciones adicionales o recuperación, Sentinel no puede garantizar a la vez libertad interna y ausencia universal de daños internos. Se conserva la protección SDS existente y no se promete una garantía nueva de cero pérdida.

## 5. Mejores decisiones de diseño y coste

La primera elección es **configuración nativa suficiente, sin guard propio**. Si resuelve el límite y la autorización, evita procesos, parseos, mantenimiento y contexto adicionales. Si queda una brecha concreta, un helper local pequeño puede resolverla; su ejecución debe quedar conectada a un punto obligatorio. Un wrapper voluntario sirve para operaciones controladas conocidas, pero no cubre canales alternativos por el hecho de existir.

El procesamiento determinista debe quedarse en Bash/procesos locales: resolver rutas, validar schema, consultar concesiones, comparar revisiones, medir y filtrar resultados. JSON y rutas complejas pueden procesarse con Python stdlib, ya usado por SDS. No pasar datos a `eval` ni interpretar como shell contenidos del ledger, de un documento o del modelo. Se agrupan lecturas independientes, sin mezclar autorizaciones de alcances diferentes.

| Momento | Cómputo local | Contexto necesario |
|---|---|---|
| Construcción/evaluación de Sentinel | Descubrimiento, fixtures, comparación de política y benchmarks | Prompt de esta tarea y secciones del informe realmente necesarias |
| Arranque ordinario | Identidad y carga de política acotadas, integración nativa cuando baste | Objetivo 0 texto fijo nuevo; si necesita router, objetivo ≤384 bytes y techo 512 |
| Operación ya permitida | Aplicación de la política en el punto de acceso; consulta local si procede | 0 texto Sentinel, 0 llamadas de inferencia añadidas |
| Permiso externo nuevo | Determinar recurso/operación, presentar una concesión exacta | Una solicitud breve y real, sin releer el informe |
| Fallo | Código y estado; evidencia mínima local | Causa + alcance + siguiente acción, máximo 512 bytes de texto propio |
| Cambio/revocación | Invalidar solo decisiones dependientes; revalidar sesiones afectadas | Delta material, no historial completo |

Estos límites son **presupuestos propuestos**, no resultados de benchmark ni sustitutos de exactitud. No se trata de comprimir con gzip/base64 o abreviar hasta volver opaco el contrato: hay que quitar redundancia, mantener semántica y dejar fuera del contexto lo que calcula la máquina.

Ejemplo de recordatorio funcional, únicamente si hace falta añadirlo: «Sentinel: el runtime aplica el perímetro y los permisos. Trabaja en el alcance vigente. Ante rechazo, usa su código y siguiente acción; no amplíes permisos ni reintentes sin cambio». No se ha instalado. Ese texto orienta; la protección tiene que existir sin él. El contador de 3.000 palabras corresponde a los tres archivos SDS indicados, no al total de instrucciones de plataforma, herramientas, adapters o mensajes.

Una comprobación local invisible al modelo puede ahorrar inferencia; pedirle que emita una tool call adicional para comprobar antes de cada operación introduce mensajes y potenciales continuaciones. El prompt distingue expresamente ambos casos. También exige medir los avisos que añade el harness aunque el script esté en silencio.

El tamaño fijo se mantiene en las solicitudes mientras siga en contexto. Por tanto, «se leyó una vez» no equivale a «se paga una vez». Un modelo más útil de consumo observado es la suma por solicitud de entrada, salida y caché identificadas; para atribuir el delta a Sentinel hay que comparar flujos equivalentes. Bytes, palabras, tokens e importe no son unidades intercambiables.

Objetivos locales de partida: mediana añadida ≤10 ms y p95 ≤25 ms por invocación, arranque incremental ≤250 ms. Medir 100 pares tras calentamiento sin llamar al modelo para cada par. El objetivo de 0 llamadas de inferencia añadidas aplica al flujo ordinario de Sentinel; no promete quitar la inferencia de la tarea ni del producto que la sirve. Si la evidencia no permite aislar un componente, declararlo sin inventar precisión.

El ejemplo de 120 operaciones solo sirve como sensibilidad: 120 × 25 ms = 3 s secuenciales. No dice nada sobre reintentos, esperas humanas o facturación real. Evitar una transición sin salida suele ser más valioso que reducir un milisegundo de un script.

## 6. Resolución de la revisión histórica

| Hallazgos | Tratamiento en el prompt final |
|---|---|
| H-01, H-02 | Inventario efectivo; primitivas actuales; pruebas de carga y raíces/temporales, sin fallback a HOME |
| H-03, H-04 | Custodia y cobertura por canal; escritura/chmod/reemplazo de fixtures separados |
| H-05, H-08, H-09 | Máquina de estados de consentimiento; actor humano; alcance/persistencia; fin de reintentos estériles |
| H-06, H-07 | Conexión real y fallos de hooks; límite crítico fuera de hooks omitibles |
| H-10, H-20 | Presupuesto en bytes y métricas de tokens identificadas; procesamiento local; baseline comparable; no checker completo por llamada |
| H-11, H-12 | Idempotencia, revocación, sesiones concurrentes y raíz física vinculada |
| H-13, H-15 | Bootstrap existente, mantenimiento con autoridad y ningún fallback global; no relajar `.git/` |
| H-14 | Se descarta añadir un detector completo de daño interno por patrones/tamaño |
| H-16 | Se preservan en la propuesta control de lectura exterior, JSON y libertad interna; Graphify bajo reglas reales SDS |
| H-17 | Escrituras de fixtures/evidencia permitidas desde Fase 0, separadas de activación |
| H-18, H-19 | Diferenciar runtime/datos, interfaces/raíces y mecanismos Git/distribución; S1/S2 amplían la prueba que faltaba |

No se actualizan las afirmaciones históricas dentro de la fuente archivada. Las correcciones y nuevos datos viven en este informe. Una evaluación incompleta de un requisito debe permanecer `NOT VERIFIED`, no desaparecer de la tabla.

## 7. Archivos y verificación

Creado: README de `docs/prompts/`, revisión recibida, prompt final, este informe y checkpoint en `docs/prompts-output/[01-0]/tmp/continuidad.md`. La revisión y el prompt tienen propósitos diferentes y ninguno entra en adapters o routers activos.

Leído: kernel/router; prácticas seleccionadas de prompts, trazabilidad, estructura, autoridad, seguridad, proporcionalidad y evolución; ledger; fuente y consumidores del bootstrap/inventario; tests pertinentes por lectura; guías Graphify; controles GitHub por inspección dirigida. Las habilidades de revisión/especificación fueron referencias manuales; no se ejecutaron sus workflows externos. Graphify no se invocó.

Inspecciones ejecutadas: estado Git, inventario dirigido, búsqueda de fuentes/consumidores, contenido de código, versiones/ayuda indicadas y conteo de palabras. `git ls-files -- .codex/config.toml .claude/settings.local.json` no mostró entradas. No prueba nada sobre otros posibles archivos personales.

Validación final documental: registro en `docs/prompts-output/[01-0]/evidence/verificacion-documental.json`, producido tras la revisión de estos entregables. Comprueba estructura, referencias locales y cobertura H-01–H-20, contabiliza bytes/palabras y conserva hash de la fuente transcrita. No prueba igualdad byte a byte con el adjunto ausente ni seguridad del diseño.

Verification: **V0 | revisión textual y validación estructural de documentos | PASS**. Seguridad runtime/E2E: **NOT VERIFIED**. No ejecutados `init.sh`, `check-governance.sh`, tests del repositorio, snapshots de código, hooks, nuevas sesiones de agentes, permisos de fixture, servicios ni MCP. La lectura de `--help` de Codex intentó crear aliases y el entorno lo denegó; no se corrigió ni reintentó fuera del sandbox. Se excluye suite completa porque solo se añaden documentos y el checker tiene efectos y alcance ajenos a esta validación.

## 8. Resultado, decisiones y riesgos

El resultado es una especificación accionable para probar viabilidad y preparar un candidato. No se vende una arquitectura universal: se prioriza el runtime existente y se exige justificar cualquier componente nuevo por una brecha observada.

Invariantes de aceptación del futuro candidato: límite independiente del contexto; concesión humana que continúa sin ampliar alcance; JSON con autoridad real; exclusión de distribución e identidad; fluidez ordinaria; ausencia de aumento indiscriminado de contexto. Una brecha en cualquiera de las garantías exigidas impide etiquetar ese modo como verificado, sin detener la documentación o el trabajo independiente.

No se cambian el ledger, el contrato publicado, VERSION/CHANGELOG, configuración real ni controles GitHub/Hostinger. Un documento propuesto no requiere distribuir reglas a otros proyectos. Las rutas personales no se han incluido en configuraciones nuevas ni en evidencias nuevas; las rutas genéricas citadas en la fuente histórica se preservan como parte de esa fuente.

## 9. Checklist E2E por capa

- [x] Documentos: fuente separada, trazabilidad, criterios y límites de evidencia.
- [x] Mapa de integración: bootstrap → inventario → copias → estado local → presupuesto de contexto.
- [ ] Runtime de Codex/Claude y proceso host: pruebas T1–T8 pendientes; no se ha activado Sentinel.
- [ ] Consentimiento humano, persistencia y revocación: comportamiento no verificado.
- [ ] Rendimiento del futuro candidato: no medido.
- [x] BBDD/API/frontend/despliegue: N/A, sin cambios en esas capas.

## 10. Seguridad y consecuencias residuales

El aislamiento por proceso limita lo que alcanza ese proceso. No acredita la cobertura de herramientas hospedadas, conectores, canales GUI, sockets o servicios que ejecutan fuera; deben estar cubiertos por su propia política efectiva o quedar fuera del modo activable. Tampoco una validación inicial conserva vigencia si luego cambian configuración o autoridad.

Los objetivos P1–P6 solo pueden satisfacerse conjuntamente si hay un punto de aplicación con custodia suficiente. Si no lo hay en la interfaz real, la conclusión útil será «no viable en este modo» con una brecha precisa. No se compensa con más tokens ni con un segundo agente vigilante permanente.

## 11. Memoria y continuidad

No se ha creado memoria normativa ni un nuevo adapter. Checkpoint en [`[01-0]/tmp/continuidad.md`](%5B01-0%5D/tmp/continuidad.md). El estado ajeno inicial `docs/prompts-output/2026-09-10-mcp-minimal-analysis/` se preserva. El trabajo documental termina aquí y no requiere `clear`.

## 12. Siguiente paso

Invocar explícitamente el [prompt final](../prompts/%5B01-0-alpha%5Dsentinel-perimetro-local.md) para iniciar su Fase 0 y preparación acotada. Las pruebas pendientes ya están definidas; no hace falta repetir esta revisión ni precargar su archivo histórico. La decisión de activar vendría al final, sobre configuración, evidencia y reversión concretas, si la evaluación demuestra viabilidad.
