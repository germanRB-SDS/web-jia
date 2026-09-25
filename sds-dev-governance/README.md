# SDS Dev Governance

Framework portable de gobernanza de desarrollo para proyectos gestionados con agentes IA (Claude Code, Codex, etc.).

Extraido de las practicas operativas del proyecto FIELDS (2026-05). Version actual: v1.30.0.

## Que contiene

```
sds-dev-governance/
├── README.md                    ← este fichero
├── GOVERNANCE.md                ← nucleo neutral canonico SDS
├── VERSION.md                   ← version del kit
├── CHANGELOG.md                 ← historial de versiones
├── init-project-prompt.md       ← prompt que bootstrapea un proyecto nuevo
├── init.sh                      ← script que hace lo mismo automaticamente
├── check-governance.sh          ← validador automatico de gobernanza
├── adapters/                    ← adapters raiz para agentes
│   ├── CLAUDE.md
│   ├── AGENTS.md
│   ├── GEMINI.md
│   └── cursor-rules/
│       └── sds-governance.mdc
├── skills/                      ← skills base y herramientas de referencia
│   ├── README.md                ← router siempre leido: catalogo y admision
│   ├── catalog-authority.md     ← quien posee cada dato de catalogo; bajo demanda
│   ├── bootstrap-and-agents.md  ← instalacion y alcance por agente; bajo demanda
│   ├── INDEX.md                 ← indice ordenado generado; nunca se edita a mano
│   ├── impeccable.md
│   ├── gstack.md
│   ├── skillui.md
│   ├── design-references.md
│   ├── graphify.md
│   ├── threejs.md
│   ├── vercel-skills.md
│   ├── r8-analyzer.md
│   ├── spline.md
│   ├── pstack.md                ← plugin de skills pstack: seleccion, exclusion y verificacion
│   ├── cross-agent-availability.md
│   ├── install-catalog.tsv      ← catalogo declarativo de instalacion
│   ├── cross-agent-portability.tsv  ← politica fail-closed LINK/PORT/CLAUDE_ONLY
│   └── runtime/
│       └── sds-r8-analyzer/     ← bundle versionado para Claude Code y Codex
├── plugins/                     ← indice base lazy; no se precarga
│   ├── README.md
│   └── base-catalog.tsv
├── scripts/
│   ├── gh-safe.sh
│   ├── git-safe-push.sh
│   ├── install-git-guardrails.sh
│   ├── apply-github-guardrails.sh
│   ├── install-skills.sh
│   ├── install-plugins.sh
│   ├── plugin-status.sh
│   ├── install-graphify.sh
│   ├── sync-agent-skills.sh     ← puente Claude/Codex/Gemini, dry-run por defecto
│   ├── generate-skills-index.sh ← regenera INDEX.md, --check detecta drift
│   └── governance-copies.sh     ← inventario y estado de las copias distribuidas (0..N)
├── github/
│   └── ruleset-anti-deletion.json
├── hooks/
│   └── pre-push
├── tests/
│   ├── test-github-guardrails.sh
│   ├── test-skill-bootstrap.sh
│   ├── test-plugin-bootstrap.sh
│   └── test-pstack-integration.sh
├── examples/                    ← ejemplos canonicos
│   ├── prompts/
│   ├── outputs/
│   └── memory/
├── knowledge/                   ← recetas y experiencias reutilizables (ios/, android/…), bajo demanda
├── resources/                   ← recursos opcionales bajo demanda
│   ├── nomenclature-explanation.md ← know-how bilingue de nomenclatura SDS
│   ├── frontend-patterns/       ← componentes, animaciones, paletas y composiciones exportables
│   │   ├── ui-components/
│   │   │   ├── expandable-search-filter-panel/ ← panel plegable + busqueda/filtros progresivos
│   │   │   ├── notification-toast-stack/       ← avisos info/success/error (`notificaciones-01`)
│   │   │   └── procedural-horizon-hero/        ← hero fallback-first + Three.js opcional
│   │   └── site-compositions/
│   │       └── grounded-editorial-studio/      ← ritmo y secuencia de landing editorial
│   └── web-components/          ← componentes completos y validados, promocionados desde proyectos
│       └── tree-3d/             ← arbol 3D procedural animado (Three.js): fuente, integracion, demo sin build
│   └── frontend-external-sample-code/
│       └── grounded-studio-reference/          ← sample clean-room neutral y ejecutable
├── practices/                   ← reglas de gobernanza documentadas
│   ├── INDEX.md                 ← router semantico obligatorio y ligero
│   ├── RULE-COVERAGE.md         ← ledger de auditoria; no se precarga
│   ├── 01-agent-memory.md
│   ├── 02-prompt-system.md
│   ├── 03-output-traceability.md
│   ├── 04-feature-tracking.md
│   ├── 05-git-branching.md
│   ├── 06-non-regression.md
│   ├── 07-security-baseline.md
│   ├── 08-role-system.md
│   ├── 09-docs-structure.md
│   ├── 10-pre-pr-checklist.md
│   ├── 11-governance-evolution.md
│   ├── modules/
│   │   └── 11-capability-admission.md
│   ├── 12-governance-proportionality.md
│   ├── 13-multi-agent.md
│   ├── 14-phase-commit-report.md
│   └── 15-contract-authority.md
└── scaffold/                    ← docs base para copiar al proyecto nuevo
    └── docs/
        ├── <project-name>-policies/     ← creado por init.sh con nombre dinamico
        │   ├── <project-name>-cookies-policy.md
        │   ├── <project-name>-privacy-policy.md
        │   └── <project-name>-terms-of-service.md
        ├── prompts/
        │   ├── preface-template.md
        │   ├── prompt-revision-preflight.md
        │   ├── preflight-module-index.md
        │   ├── preflight-frontend-ui.md
        │   └── preflight-frontend-security.md
        ├── prompts-output-template/
        │   └── output-template.md
        ├── prompts-output/
        │   └── README.md
        ├── governance/
        │   ├── README.md
        │   ├── capability-registry.md
        │   ├── governance-change-log.md
        │   └── evaluation/
        │       ├── README.md
        │       ├── output-review-template.md
        │       └── improvement-backlog.md
        ├── memory/
        │   ├── README.md
        │   ├── frontend.md
        │   ├── backend.md
        │   ├── api-openapi.md
        │   ├── database.md
        │   ├── security.md
        │   └── deployment.md
        ├── features/
        │   └── features-index.md
        ├── contracts/
        │   └── README.md
        ├── runbooks/
        │   └── README.md
        ├── architecture/
        │   └── README.md
        ├── decisions/
        │   ├── README.md
        │   └── DEC-000-template.md
        ├── operations/
        │   └── README.md
        ├── security/
        │   └── README.md
        └── repositories/
            └── README.md
```

## Como usar

Dos caminos alternativos:

### Opcion A — Script automatico

```bash
./sds-dev-governance/init.sh "MiProyecto" ~/Development/MiProyecto
```

El bootstrap crea tambien `docs/miproyecto-policies/` con tres ficheros vacios:
`miproyecto-cookies-policy.md`, `miproyecto-privacy-policy.md` y
`miproyecto-terms-of-service.md`.

El bootstrap instala o verifica por defecto el catalogo declarado en
`skills/install-catalog.tsv`: Impeccable, gstack, skillui, el paquete modular de Three.js, Graphify
y la skill empaquetada `sds-r8-analyzer`. `--skip-skills` o `SDS_INSTALL_SKILLS=0` desactiva el
catalogo instalable; `--skip-graphify` o `SDS_INSTALL_GRAPHIFY=0` excluye solo Graphify. Las filas
de alcance `bundled` solo se instalan cuando las skills estan habilitadas; `--skip-skills`
tambien las omite. Una instalacion existente divergente se preserva para reconciliacion explicita.
Tambien instala o verifica por defecto el indice lazy `plugins/base-catalog.tsv`. Su entrada Figma
registra una sola integracion oficial con capacidades Design y Make para Claude Code y Codex.
`--skip-plugins` o `SDS_INSTALL_PLUGINS=0` es el opt-out explicito. OAuth no se abre durante init:
el estado queda `auth-pending` hasta que el owner autoriza cada harness.
Instalacion no equivale a admision: solo el modo/revision marcado `ADMITTED` o
`ADMITTED_WITH_CONSTRAINTS` en `docs/governance/capability-registry.md` puede usarse para trabajo
SDS. Un proyecto nuevo recibe un ledger vacio y fail-closed. La invocacion rutinaria de un modo que
coincide exactamente usa el ledger; admision, delta o mismatch cargan bajo demanda
`practices/modules/11-capability-admission.md`.

`--install-skills` se conserva como alias compatible para forzar el comportamiento por defecto:

```bash
./sds-dev-governance/init.sh "MiProyecto" ~/Development/MiProyecto --install-skills
```

Ese flujo verifica o crea `sds-r8-analyzer` y despues instala/verifica las skills opcionales.
La derivada evita los scripts ausentes en la revision oficial observada y se documenta en
`skills/r8-analyzer.md`.

El catalogo de plugins no se carga en lecturas rutinarias. El instalador conserva tracking local,
acotado y gitignored en `.sds/state/base-plugins.tsv`; consultarlo bajo demanda:

```bash
./sds-dev-governance/scripts/plugin-status.sh .
```

Para crear adapters anidados en subproyectos:

```bash
SDS_NESTED_MODULES="backend|Backend|backend|dev;ios-app|iOS App|ios|dev" \
  ./sds-dev-governance/init.sh "MiProyecto" ~/Development/MiProyecto
```

Formato: `path|name|type|branch;path|name|type|branch`.

### Hub y modo solo archivos

```bash
./sds-dev-governance/init.sh "MiHub" /ruta/fisica/MiHub --mode hub --files-only --dry-run
./sds-dev-governance/init.sh "MiHub" /ruta/fisica/MiHub --mode hub --files-only
```

`--files-only` no invoca instaladores, red, Git ni configuracion global. El hub siempre usa ese
modo y conserva repositorios hijos independientes. `SDS_NESTED_MODULES` solo sirve para modulos
explicitos de un unico repositorio, nunca para registrar hijos de un hub. El plan JSON enumera
escrituras antes de aplicarlas; codigos: 0 correcto, 2 error, 3 originales preservados con
conflictos `.sds-new`. Una copia de gobernanza divergente requiere reconciliacion previa; init no
actualiza versiones. Python 3 es dependencia explicita; wrappers probados en Bash 3.2/5.3.
El metaprompt usa este mismo motor y los mismos comandos. Para alcance, recuperacion y efectos
opcionales ver `init-project-prompt.md` y el informe `docs/prompts-output/REL-2026-09-09-10/report.md`.

### Guardrails GitHub: borrado siempre manual

SDS no delega a agentes el borrado de repositorios o recursos remotos GitHub ni el debilitamiento
de protecciones. La regla no admite excepciones por chat: el owner ejecuta manualmente cualquier
borrado; el agente solo guia y verifica read-only. Una edicion local normal y revisable no equivale
a autorizar una llamada destructiva a GitHub.

Para cada clon, instalar el hook sin sustituir un `core.hooksPath` ya existente:

```bash
./sds-dev-governance/scripts/install-git-guardrails.sh .
```

Los agentes usan `scripts/gh-safe.sh` para GitHub CLI y `scripts/git-safe-push.sh` para un push de
un unico ref explicito. Antes de aplicar proteccion remota, admitir en el capability ledger la
revision/modo exactos de `gh`, auditar y revisar el resultado:

```bash
./sds-dev-governance/scripts/apply-github-guardrails.sh --owner LOGIN --all-owned
./sds-dev-governance/scripts/apply-github-guardrails.sh --owner LOGIN --all-owned --apply
```

El ruleset protege ramas contra deletion y non-fast-forward, pero no puede impedir por si solo el
borrado del repositorio. Por eso se mantiene ausente `delete_repo`. GitHub Free no habilita
rulesets/protected branches en repos privados: el auditor marca `UNAVAILABLE_ON_PLAN` y termina no
verde; nunca hace publico un repo ni finge cobertura. Cuentas personales tampoco heredan una regla
global, por lo que los repos nuevos requieren auditoria.

### Opcion B — Prompt para agente

Ejecutar `init-project-prompt.md` como primer prompt del proyecto nuevo. El agente crea la estructura, adapta CLAUDE.md y hace el primer commit.

Ambos caminos producen el mismo resultado. El script es mas rapido; el prompt permite que el agente adapte mas a medida.

## Modelo multi-agente

`sds-dev-governance/GOVERNANCE.md` es la fuente canonica neutral. Los ficheros de la raiz del
proyecto son adapters generados:

| Agente | Adapter |
|---|---|
| Claude Code | `CLAUDE.md` |
| Codex | `AGENTS.md` |
| Gemini | `GEMINI.md` |
| Cursor | `.cursor/rules/sds-governance.mdc` |

Todos siguen el mismo contrato portable: cargar siempre el kernel `GOVERNANCE.md`, despues
`practices/INDEX.md`, y desde ahi solo las practicas que el router seleccione para el alcance real,
incluidas sus dependencias declaradas. `skills/README.md`, el adapter y las memorias afectadas se
leen despues; no se precarga la carpeta completa de practicas. Si aparece alcance nuevo, se enruta
de nuevo antes de decidir o mutar. Este protocolo no depende de un proveedor de agente.

## Frontend exportable

En proyectos con UI, SDS exige que la informacion renderizada en frontend salga de constantes,
configuracion o catalogos i18n, no de literales hardcodeados en vistas o scripts. Cada proyecto debe
definir ownership para copy/i18n, business info y assets/fotos visibles. La informacion de negocio
debe tener un unico entry point o agregador que permita portar la UI a otro negocio cambiando
constantes, textos localizados y media, sin tocar codigo de presentacion.

Los adapters apuntan al kernel, al INDEX semantico, al indice de skills y al mapa de memorias; el
contenido detallado se abre bajo demanda.

## Preflight modular

`docs/prompts/prompt-revision-preflight.md` es el entrypoint unico de revision pre-ejecucion. Lee
`docs/prompts/preflight-module-index.md` como arbol/router liviano y, para evitar coste de contexto
innecesario, solo carga add-ons cuando el prompt toca esa superficie:

- `docs/prompts/preflight-frontend-ui.md`: frontend/UI, copy, formularios, responsive, design tokens,
  assets visibles y consumo frontend de API. Refuerza que la informacion visible no se hardcodea
  fuera de constants/config/i18n salvo instruccion explicita.
- `docs/prompts/preflight-frontend-security.md`: frontera browser/security, cookies, sesiones, CSRF,
  XSS/DOM injection, CSP, storage frontend, tokens/OAuth, privacidad, dependencias runtime web y
  OWASP Web/API Top 10 relevante.

Para prompts backend-only, DB-only, API-only, deployment-only o documentales, estos add-ons se
marcan `N/A` salvo evidencia de impacto UI/browser.

Los adapters de agente (Claude, Codex, Gemini, Cursor u otros) no duplican estas checklists: solo
llevan el trigger minimo hacia el entrypoint. Esto mantiene la memoria estatica pequena y deja la
especializacion en el arbol de preflight.

Los preflights especializados futuros se anaden al mismo indice con trigger preciso y condicion de
no carga. No se cargan en bloque.

## Autoridad contractual y contradicciones

`GOVERNANCE.md` y los adapters conservan solo un router breve. La regla completa vive en
`practices/15-contract-authority.md` y **no se precarga**: se lee unicamente al crear, revisar,
aprobar, delegar, ejecutar o reanudar prompts/instrucciones con efecto normativo; al comparar la
intencion con repositorio, runtime, tests, schemas o documentacion; o cuando una revision, auditoria,
QA, diagnostico o handoff detecta senales materiales de contradiccion.

No se carga para Q&A casual, estado, navegacion, inventario factual, checkpoints deterministas ya
autorizados ni ediciones mecanicas de comportamiento inequivoco. Si uno de esos trabajos descubre
una contradiccion, el agente carga entonces la practica antes de cualquier mutacion dependiente.
Esta separacion mantiene pequena la memoria estatica sin debilitar el gate.

Cuando dos decisiones normativas incompatibles siguen activas y la autoridad o supersesion no esta
clara, el agente limita la investigacion a solo lectura, se detiene antes de escribir, migrar,
commitear o aprobar la ejecucion y pregunta al owner. La resolucion se registra como `ERROR`,
`CLARIFICATION`, `ADDITION`, `MODIFICATION` o `IMPROVEMENT`; repositorio y runtime prueban la realidad
observada, pero no deciden por si solos la intencion contractual.

## Compartimentacion de contexto

En proyectos con submodulos o subproyectos grandes, el adapter raiz debe ser ligero. Cada
subproyecto puede tener adapters propios (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`,
`.cursor/rules/sds-governance.mdc`). El agente solo los carga cuando el prompt toca ese subproyecto
o cuando hay un contrato cross-layer.

## Skills base

Ver `skills/README.md`.

| Skill | Tipo |
|---|---|
| Impeccable | Skill frontend multi-harness por proyecto |
| gstack | Workflows de especialistas, Claude-first |
| skillui | CLI de extraccion de diseno bajo demanda |
| awesome-design-md | Catalogo de referencias `DESIGN.md` |
| Graphify | CLI de knowledge graph y adapters multi-agente |
| Three.js | Paquete modular OpenAEC para Claude compartido con Codex |
| Vercel Agent Skills | Deploy/configuracion/optimizacion Vercel bajo admision explicita |
| sds-r8-analyzer | Derivada SDS versionada para analizar R8 Android en modo read-only; global en Claude Code y Codex |
| pstack | Plugin de skills de ingenieria (fork portable de Cursor pstack) por tarea, fase y riesgo; «sin pstack» lo excluye; sin instalacion por bootstrap |

`skills/README.md` es el router portable de admision. El estado canonico de plugins, MCP, skills
auto-descubiertas, hooks, comandos, conectores y tooling externo vive solo en el ledger condicional
del proyecto, por revision y modo efectivos; una entrada de catalogo o instalacion personal no basta.
`plugins/README.md` es el router lazy del indice base instalable y se lee solo para install/status,
validacion o delta de capacidad; sus filas y timestamps no forman parte del contexto normal.

## Recursos bajo demanda

`sds-dev-governance/resources/` contiene material opcional lazy-loaded. No forma parte de la carga
normal de contexto. Un agente solo debe leer un recurso si el usuario o el prompt activo lo pide
explicitamente.

- `nomenclature-explanation.md`: cargar solo si se pregunta por nomenclatura, ayuda de nombres,
  convenciones, know-how o como nombrar artefactos SDS.
- `frontend-patterns/`: cargar solo si se pide explicitamente un patron frontend, componente,
  animacion, carousel, glow, boton, modal o paleta.
- `frontend-patterns/ui-components/expandable-search-filter-panel/`: recuadro plegable con busqueda
  expandible y filtros alineados que preservan estado y comparten criterios con autocompletado.
- `frontend-patterns/ui-components/notification-toast-stack/`: avisos `info`, `success` y `error`
  con 3,5 segundos de lectura, entrada/salida animada y cierre inmediato al pulsar; alias de
  descubrimiento `notificaciones-01`.
- `frontend-patterns/ui-components/procedural-horizon-hero/`: hero de paisaje fallback-first con
  corredor de copy estable, relevo determinista y Three.js diferido opcional.
- `frontend-patterns/site-compositions/grounded-editorial-studio/`: secuencia y ritmo completos de
  una landing de estudio editorial basada en hairlines, evidencia y contexto.
- `web-components/`: componentes completos y validados promocionados desde un proyecto (fuente en
  `component/`, integracion validada en `integration/`, procedimiento para el agente). Cargar solo si se
  pide ese componente.
- `web-components/tree-3d/`: arbol 3D procedural animado con Three.js (sin modelos ni video): copa en
  lobulos, hojas que la brisa arranca hacia el espectador, rocas, paleta por tokens CSS; wrapper React,
  `mountTree` sin framework y demo HTML sin build. Alias: `arbol 3d`, `árbol del saber`.
- `frontend-external-sample-code/grounded-studio-reference/`: implementacion neutral generada desde
  configuracion que demuestra ambos patrones y permanece completa sin JavaScript/WebGL/CDN.

**Empieza por el indice, no por las carpetas.** Lee primero
`sds-dev-governance/resources/index-of-resources-and-working-patters.md` (indice unico de todos los
recursos) para saber que existe y donde, y abre solo esa carpeta. Rastrear carpeta a carpeta gasta
contexto y coste.

Cada patron frontend incluye un `INDEX-AND-HOW-TO-USE-THEM.md` y ejemplos pequenos en HTML/CSS/JS.

**Regla restrictiva:** al anadir, renombrar, mover o eliminar un recurso que funcione, hay que
actualizar el indice en el mismo cambio. Lo verifica `check-governance.sh`.

## Que NO es

- No es un generador de codigo.
- No sustituye a Git, CI/CD ni herramientas de proyecto.
- No contiene logica de negocio ni dominio.
- No es obligatorio usar todo: cada practica es independiente.

## Practicas portables (resumen)

| # | Practica | Impacto |
|---|---|---|
| 01 | Memoria de agentes y adapters | Continuidad entre sesiones |
| 02 | Sistema de prompts [NN-R] | Trazabilidad de instrucciones |
| 03 | Output trazable por prompt | Saber que paso y por que |
| 04 | Tracking de features (FTR-NNN) | Compartimentalizar funcionalidades |
| 05 | Git branching + Change ID | Integracion segura multi-repo |
| 06 | No regresion E2E | No romper lo que funciona |
| 07 | Seguridad baseline | No filtrar secretos ni degradar controles silenciosamente |
| 08 | Roles operativos | Outputs con informacion obligatoria por capa |
| 09 | Estructura de docs/ | Organizacion predecible |
| 10 | Checklist pre-PR | No subir PRs rotas |
| 11 | Evolucion y admision agentic | Sincronizacion por delta y capacidades autorizadas por revision/modo |
| 12 | Gobernanza proporcional | Documentar segun riesgo real, no por burocracia |
| 13 | Modelo multi-agente | Adapters para Claude, Codex, Gemini, Cursor y futuros agentes |
| 14 | Cierre de fase | Commits e informes separados para fases con cambios ejecutables |
| 15 | Autoridad contractual | Router condicional, clasificacion de evidencia y stop-and-ask ante contradicciones |

## Carga selectiva de contexto

`GOVERNANCE.md` conserva el kernel portable y `practices/INDEX.md` conserva el contrato de
seleccion. Las practicas numeradas siguen conteniendo el 100% del detalle normativo y se cargan solo
cuando su trigger aplica; `RULE-COVERAGE.md` sirve para auditoria, no para contexto normal. Los
adapters de agente contienen runtime y contexto especifico. Las memorias de `docs/memory/` son
contexto tecnico compacto por area y se cargan solo cuando aplican.

Los prompts nuevos deben actuar como deltas contra la gobernanza existente. Las reglas ya definidas
se referencian o se convierten en gates de validacion; los detalles de stack se aplican desde
adapters, skills, scaffold, overlays o convenciones descubiertas.

Naming compacto: `[NN-R]...`, donde `R` incrementa solo cuando una iteracion se ejecuta. Refinamientos
pre-ejecucion usan `-alpha`, `-beta`, etc. sobre la misma iteracion; al ejecutarse, el siguiente
prompt relacionado pasa a `R+1`. Si `[NN-R]` ya esta planificado y aparece trabajo nuevo que debe
ejecutarse tras cualquier `[NN-(R-1)]*` pero antes de `[NN-R]`, usar inserciones compactas
`[NN-Ra]`, `[NN-Rb]`...; sus refinamientos son `[NN-Ra-alpha]`, `[NN-Ra-beta]`, etc.

Areas estandar:

- `frontend`
- `backend`
- `api-openapi`
- `database`
- `security`
- `deployment`

Si el prompt no declara areas, el agente debe inferirlas desde objetivo, rutas, ficheros mencionados o tipo de cambio.

### Lectura de secciones y frescura (v1.26.0)

Desde un proyecto gobernado, con el ejemplo portable instalado:

```bash
./sds-dev-governance/scripts/sds-text list sds-dev-governance/examples/prompts/selective-context.md
./sds-dev-governance/scripts/sds-text get sds-dev-governance/examples/prompts/selective-context.md CHECK-20 --max-lines 180 --max-bytes 24000
./sds-dev-governance/scripts/sds-text check sds-dev-governance/examples/prompts/selective-context.md
```

El lector conserva el preambulo y resuelve dependencias declaradas del mismo archivo. Un SHA
esperado detecta revisiones cambiadas; presupuestos incluyen metadatos. `index` imprime rangos
derivados sin modificar el documento. Para textos breves o lecturas completas basta `cat`/`rg`.
No es un parser CommonMark universal ni decide requisitos semanticos por el agente.

`./sds-dev-governance/scripts/governance-freshness.sh --kit sds-dev-governance
--active-revision FULL_COMMIT_SHA --remote origin --timeout 5` (en una sola linea) consulta sin
fetch/pull ni actualizacion. La opcion `--offline` informa que la frescura no pudo verificarse.
Usar el SHA real adoptado por la fase. Cambiar de revision sigue siendo una decision registrada.
Contrato completo bajo demanda: `practices/modules/01-selective-text.md`; evidencia y comparacion
nativo/wrapper/indice en `docs/prompts-output/REL-2026-09-09-11/`.

## Gobernanza proporcional

Cada trabajo se clasifica como:

- `LEVEL 0`: trivial, sin output obligatorio.
- `LEVEL 1`: pequeno, output compacto.
- `LEVEL 2`: normal, output completo.
- `LEVEL 3`: transversal o critico, output completo + checkpoint.

No se crea documentacion nueva si el cambio no modifica comportamiento, no conserva una decision tecnica y el output seria mas largo que el cambio.

Antes de ejecutar prompts `LEVEL 2-3` con riesgo de BBDD, API, seguridad, multi-tenant,
gobernanza, despliegue o falsos verdes, usar `docs/prompts/prompt-revision-preflight.md` como
revision de solo lectura. El preflight contrasta el prompt con el repositorio, memorias afectadas,
contratos, baseline y rollback/recovery, y no debe modificar ficheros ni ejecutar el prompt objetivo.
Los adapters de Claude, Codex y Gemini activan este modo cuando el usuario pide "preflight de
desarrollo", "dev preflight", "development preflight", "preflight del prompt" o equivalente junto a
una ruta de prompt, prompt pegado o inicio de prompt.

Cuando el resultado del preflight se persiste, el primer informe usa
`docs/prompts-output/[NN-R]preflight.md`. Re-preflights del mismo prompt se numeran como
`[NN-R]preflight-2.md`, `[NN-R]preflight-3.md`, etc.; no incrementan `R` porque no ejecutan el prompt
objetivo.

Para prompts largos, `LEVEL 3`, multi-gate, release, migraciones, refactors, fixes de seguridad o
tareas con alto riesgo de perdida de contexto, usar memoria temporal en
`docs/prompts-output/<PROMPT_ID>/tmp/`. La evidencia pesada o salidas largas van en
`docs/prompts-output/<PROMPT_ID>/evidence/`. No guardar scratch memory en `docs/prompts/`, que debe
quedar como corpus limpio de prompts fuente. Tmp/evidence debe ser secret-safe y consolidarse en el
final report, phase report, continuity state o memoria permanente relevante antes de cerrar.

Los cambios al sistema de gobernanza se registran en `docs/governance/governance-change-log.md`.
Cada entrada debe indicar prompt base, ficheros tocados, motivo por fichero, sistema de utilizacion
(scaffold, init, check, indice, grafo/Graphify, memoria, output), fecha de incorporacion, fecha de
ultima modificacion, verificacion, riesgos residuales y rollback/recuperacion.

La sincronizacion es incremental: `practices/RULE-COVERAGE.md` identifica propietario, consumidores
candidatos y senales de reapertura. Graphify puede proponer relaciones cuando existe un grafo local,
pero no sustituye ese indice ni la autoridad canonica. Una regla se implementa una vez en su owner;
los consumidores solo cambian ante un delta real.

Para reducir coste, las memorias de `docs/memory/` incluyen `Contexto minimo`. El agente debe leer esa seccion primero y cargar solo secciones concretas cuando sea suficiente.

En outputs completos, las secciones no aplicables se marcan como `N/A - motivo`; no se desarrollan por rellenar.

## Evaluacion diferida

`docs/governance/evaluation/` sirve para reevaluar outputs, coste de tokens, checkpoints y niveles `LEVEL 0-3` en un momento posterior. No se carga en trabajo normal; solo cuando el prompt pide optimizar o auditar la gobernanza.

## Validacion automatica

Para validar un proyecto gobernado:

```bash
./check-governance.sh .
```

El script comprueba estructura, placeholders, referencias obsoletas, tamano de memorias, plantilla de output y reglas principales en `CLAUDE.md`.

### MCP control (v1.27.0)

Optional offline `scripts/sds-mcp inventory|check|doctor` and atomic Codex/Claude
configuration staging. [MCP guide](mcp/README.md) documents safe closed gateways,
synthetic batch/custody tests and the Hostinger 1.58.0 dependency lock. Real provider
access remains blocked pending independent secret isolation and human authorization
infrastructure. Bootstrap copies tooling only; it never activates a global MCP.
