# 02 — Sistema de prompts [NN-R]

## Problema que resuelve

Sin convencion de prompts, las instrucciones a agentes se pierden, se duplican o no se pueden correlacionar con sus resultados.

## Convencion de nombrado

Formato: `[NN-R]nombre-descriptivo.md`

- `NN` = numero de hilo o prompt principal (01, 02, ...).
- `R` = iteracion ejecutable dentro del mismo hilo:
  - `-0` = prompt base.
  - `-1`, `-2`, `-3`... = siguientes ejecuciones relacionadas con el mismo prompt/hilo.

Sufijos pre-ejecucion: usar `-alpha`, `-beta`, `-gamma`, `-delta`, `-epsilon` sobre la misma
iteracion cuando se prepara o refina un prompt **antes de ejecutarlo**. Ejemplo:
`[16-2-alpha]...` refina `[16-2]...` sin haberlo ejecutado. Cuando ese refinamiento se ejecuta,
la siguiente instruccion relacionada pasa a `[16-3]...`. Si el alcance deja de estar relacionado,
abrir el siguiente `NN`.

Inserciones pre-iteracion planificada: si una iteracion futura `[NN-R]` ya existe como prompt
planificado o reservado, y tras ejecutar cualquier variante de la iteracion anterior
(`[NN-(R-1)]*`) surge trabajo nuevo que debe ejecutarse antes de `[NN-R]`, usar letras compactas
pegadas al numero de iteracion futura: `[NN-Ra]`, `[NN-Rb]`, `[NN-Rc]`... Ejemplo: tras ejecutar
`[40-0]`, `[40-0-alpha]` o `[40-0-beta]`, si `[40-1]` ya esta planificado pero aparece un prompt
intermedio, nombrarlo `[40-1a]`; otro intermedio posterior seria `[40-1b]`. Estas inserciones son
identificadores ejecutables propios, no refinamientos. Sus refinamientos pre-ejecucion usan los
sufijos normales sobre el identificador completo: `[40-1a-alpha]`, `[40-1a-beta]`.

No usar letras sueltas como iteracion ejecutada (`[16-0-b]`) ni mezclar fases operativas con el
identificador. La excepcion permitida son las inserciones pre-iteracion planificada compactas
(`[NN-Ra]`, `[NN-Rb]`...), sin guion entre `R` y la letra. La fase/subfase va en el titulo o cuerpo
del prompt.

Ejemplos:
- `[01-0]prompt-audit-backend.md`
- `[01-1]review-audit-backend.md`
- `[02-0]implement-user-registration.md`
- `[16-2]ui-admin-settings-business-images.md`
- `[16-2-alpha]ui-admin-settings-business-images.md`
- `[16-3]ui-admin-settings-business-images-execution.md`
- `[40-1a]tenant-delete-order-fk-manifest-reconciliation.md`
- `[40-1a-alpha]tenant-delete-order-fk-manifest-reconciliation.md`

## Ubicacion

`docs/prompts/`

## Reglas

1. Todo prompt con impacto en codigo se guarda en `docs/prompts/`.
2. Cada prompt debe generar un output trazable en `docs/prompts-output/`.
3. El prompt puede usar punto o guion: `[NN.R]` o `[NN-R]`. El output siempre usa guion.
4. Todo nuevo prompt debe incluir o cumplir por referencia el protocolo de output.
5. Todo prompt debe declarar areas afectadas o permitir que el agente las infiera antes de cargar contexto.
6. Todo prompt debe declarar o inferir nivel de gobernanza (`LEVEL 0-3`) antes de decidir el output requerido.
7. Al nombrar un prompt, aplicar la convencion de iteracion/sufijo anterior antes de crear el fichero.

## Areas afectadas

Areas validas:

- `frontend`
- `backend`
- `api-openapi`
- `database`
- `security`
- `deployment`

Si el prompt no declara areas, el agente debe inferirlas desde objetivo, rutas, ficheros mencionados o tipo de cambio. No se deben cargar todas las memorias por defecto.

## Relacion prompt → output

- Prompt: `docs/prompts/[02.1]review-something.md`
- Output: `docs/prompts-output/[02-1]prompt-output.md`
- Preflight read-only persistido: `docs/prompts-output/[02-1]preflight.md`.
- Multiples preflights del mismo prompt: conservar el prefijo canonico y numerar desde la segunda
  pasada: `docs/prompts-output/[02-1]preflight-2.md`, `docs/prompts-output/[02-1]preflight-3.md`, etc.

Normalizacion: punto en prompt → guion. Guion se conserva. Inserciones compactas (`[NN-Ra]`) se
conservan como parte del identificador canonico y sus outputs usan el mismo prefijo
(`docs/prompts-output/[NN-Ra]...`). Sufijos pre-ejecucion (`-alpha`, etc.) solo se usan en prompts
no ejecutados; el output corresponde a la iteracion ejecutada.

## Prefacio no-ejecutable

Todo prompt `LEVEL 2` o `LEVEL 3` debe abrir con un bloque de prefacio **no-operativo** marcado
`## PREFACE — NON-EXECUTABLE`, seguido por la primera seccion ejecutable (`## Status`, `## Nivel de
gobernanza` o equivalente). En `LEVEL 0-1` es opcional.

Reglas:

- El bloque es **documentacion / mini-memoria del prompt**, no instrucciones: no se ejecuta. Debe indicar
  explicitamente "execute from `## Status` onward" (o la primera seccion operativa).
- **Tokens:** el marcador "skip" **no** ahorra tokens por si solo si el prompt ya esta cargado en el
  contexto del modelo; solo ahorra si un loader/script excluye el bloque antes de la ejecucion (stripping
  efectivo). Su valor primario es trazabilidad y seguridad, no ahorro de tokens.
- **Campos minimos:** que cambia · por que · que implica · como lo hace · consecuencias sobre otras partes
  del software · **analisis de severidad** (moderado / severo / critico; si puede inducir inestabilidad o
  vulnerabilidades graves o criticas). La taxonomia de severidad reutiliza
  `practices/14-phase-commit-report.md` **por referencia**, sin duplicar el informe de fase (el prefacio es
  pre-ejecucion; el informe de fase es post-ejecucion).
- Plantilla en `scaffold/docs/prompts/preface-template.md`; ejemplos en `examples/prompts/level-2-*.md`
  y `level-3-*.md`.

`check-governance.sh` valida la presencia del marcador en la plantilla y en los ejemplos `LEVEL 2-3`
(no en cada prompt del proyecto).

## Revision pre-ejecucion de prompts

Los prompts de riesgo (`LEVEL 2-3`) pueden revisarse antes de ejecutarse con la plantilla
`docs/prompts/prompt-revision-preflight.md`, copiada desde
`sds-dev-governance/scaffold/docs/prompts/prompt-revision-preflight.md` durante el bootstrap.

Los adapters deben tratar como disparadores de esta revision expresiones como "preflight de
desarrollo", "dev preflight", "development preflight", "preflight del prompt" o equivalentes cuando
el usuario las acompana de una ruta de prompt, prompt pegado o inicio de prompt.

Esta revision es **solo lectura**: no ejecuta el prompt objetivo, no modifica codigo, no edita
prompts, no genera migraciones y no hace commits. Su funcion es auditar el prompt como propuesta de
contrato contra la realidad del repositorio, SDS Governance y las memorias afectadas. La evidencia
del repositorio determina que existe hoy en la revision/entorno inspeccionados, pero no decide por si
sola que intencion contractual debe prevalecer. Si aparece una contradiccion normativa, aplicar
`Contract Authority And Contradiction Gate` antes de autorizar ejecucion. El preflight debe reportar
bloqueos criticos, riesgos severos, falsos verdes, estado de baseline y siguiente accion.

Cuando el usuario pida persistir el resultado, guardarlo como
`docs/prompts-output/[NN-R]preflight.md`. Si ya existe o se trata de una segunda pasada, usar
`docs/prompts-output/[NN-R]preflight-2.md`; para una tercera, `preflight-3.md`, y asi
sucesivamente. No usar un nuevo `R`: el preflight no es una ejecucion del prompt objetivo.

Usarla especialmente cuando un prompt toca BBDD, API/OpenAPI, seguridad, autorizacion, auditoria,
multi-tenant, despliegue, gobernanza o flujos publicos/admin. Todo preflight debe cargar y aplicar
`practices/15-contract-authority.md`; no es un add-on de superficie. Despues solo se cargan las
fuentes contractuales y memorias del alcance afectado, nunca carpetas completas por defecto.

### Preflight modular y carga selectiva

`docs/prompts/prompt-revision-preflight.md` es el unico entrypoint de revision. Lee
`docs/prompts/preflight-module-index.md` como arbol/router liviano y puede derivar a add-ons
especializados, pero solo despues de inferir areas afectadas desde el prompt objetivo, rutas
mencionadas y evidencia del repositorio.

Add-ons canonicos:

- `docs/prompts/preflight-frontend-ui.md`: cargar solo si el prompt toca frontend/UI, contenido
  renderizado en navegador, copy, estado cliente, formularios, responsive, design tokens, assets
  visibles o consumo frontend de API.
- `docs/prompts/preflight-frontend-security.md`: cargar solo si el prompt toca frontera de seguridad
  del navegador, auth/session UX, cookies, tokens, OAuth/login, mutaciones disparadas desde UI,
  CSP/headers, embeds/assets de terceros, pagos, visibilidad admin/tenant o datos personales/
  privilegiados en UI.

No cargar estos add-ons para prompts backend-only, DB-only, API-only, deployment-only o de
documentacion salvo que el prompt o la evidencia del repo muestren impacto browser/UI. Si no aplican,
marcarlos como `N/A` en la checklist. El objetivo es cubrir practicas que no pueden faltar cuando
aplican sin gastar tokens ni tiempo en superficies irrelevantes.

Los adapters de agentes (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, Cursor y nested adapters) deben
mantener solo el trigger minimo hacia el entrypoint principal. No deben duplicar las checklists de
los add-ons ni cargar el arbol completo en memoria estatica.

Cuando se anadan futuros preflights especializados, deben registrarse en
`docs/prompts/preflight-module-index.md` con un trigger preciso y una condicion explicita de no
carga. Ningun modulo nuevo debe aumentar el contexto base de prompts no relacionados: se carga
solo si el prompt objetivo o la evidencia del repo activa su superficie.

El add-on frontend UI refuerza, como gate de preflight, que no debe haber informacion visible
hardcodeada fuera de constants/config/i18n salvo instruccion explicita del usuario y justificacion
documentada. El add-on frontend security revisa proporcionalmente cookies/sesion, CSRF/origin,
XSS/DOM injection, CSP/headers, storage frontend, exposicion de tokens/OAuth, privacidad,
dependencias runtime web y OWASP Web/API Top 10 relevante.

## Prompts as Deltas, Not Duplicate Sources of Truth

New implementation prompts must not duplicate large blocks of governance rules already defined in
SDS governance. If a rule already exists, the prompt should reference it or convert it into a
validation gate.

Repeating security, SQL, output, OpenAPI, UI-safety, design-system, or resilience rules across
prompts is allowed only when necessary for local clarity. If a prompt intentionally changes an
existing rule, it must state that it supersedes or refines the previous rule.

Avoid creating multiple inventories for the same purpose. If Phase -1 or another governance step
owns an inventory, later phases should consume or validate it instead of recreating a competing
source of truth.

## Context-Driven Extensibility

SDS core governance defines stack-agnostic expectations. Stack-specific implementation details
belong in adapters, skills, scaffold templates, project overlays, or explicitly discovered project
conventions.

The core defines what must be true; adapters or project-specific layers define how it is achieved
for a given stack. Do not put technology-specific rules in general practices unless the rule is
clearly conditional.

During prompt execution, discover the applicable stack, adapter, skill, or project convention
before enforcing technology-specific guidance. If no applicable adapter or convention exists, apply
only the stack-agnostic governance rule and record stack-specific guidance as `N/A`.

## Contract Artifacts and Validators Move Together

When a change modifies public API behavior, schemas, DTOs, route contracts, generated clients,
event contracts, database schema contracts, design tokens, OpenAPI files, custom linters, or
contract validators, the prompt must require those artifacts to be reviewed together.

Contract checks should happen as early as practical before or alongside business-logic
implementation. Do not assume OpenAPI exists in every project, and do not assume contract-first
development is already adopted in every project.

If no contract artifact or validator exists, record it as `N/A`. If a custom validator exists,
update or run it according to discovered project scripts. If contract artifacts exist but are not
the source of truth, document the discovered source of truth before changing generated or derived
code.

Do not generate or rewrite broad contract systems unless explicitly requested.

## Frontend Constants and Business Portability in Prompts

Any prompt that creates or changes frontend-rendered content must include a constants/configuration
gate before implementation:

- discover the project constants layer and its ownership map;
- put translatable UI copy in the i18n/copy catalog instead of hardcoding it in views, templates,
  components, or scripts;
- put business-exclusive data in the business constants entry point instead of UI copy catalogs;
- include user-facing media references such as photos, logos, icons, and social/metadata images in
  the constants/assets ownership map;
- require a single discoverable business-info entry point for the full business profile. It may
  aggregate smaller files, but must not duplicate values.

If the project has no existing constants layer, the prompt must define one before adding frontend
content. If the project uses another stack-specific convention, discover it from the adapter,
memory, scaffold, or source tree and document the mapping in the prompt output.

## Referencias ejecutables selectivas

Al generar un prompt largo que se leerá por fases, usar archivo + códigos H2 estables, una selección
inicial explícita y sus dependencias (también entre archivos). Incluir comandos realmente instalados
`./sds-dev-governance/scripts/sds-text list|get|check`, budgets y condición de recarga por SHA.
No anunciar prototipos como herramientas disponibles. Rango de líneas es metadato calculado, no
identidad. El módulo `practices/modules/01-selective-text.md` define el dialecto y comandos exactos;
si el prompt es corto o requiere lectura íntegra, el método nativo basta. El prefacio no ejecutable
se conserva al recuperar contexto; nunca eliminar una restricción universal para ahorrar tokens.
