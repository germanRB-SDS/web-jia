# Aseguramiento de código generado por IA

> Área **agentic-engineering** de SDS. Regla canónica de aseguramiento de código IA. Enlazada desde
> `GOVERNANCE.md` y desde `practices/10-pre-pr-checklist.md`. Cambio de gobernanza sincronizado según
> `practices/11-governance-evolution.md`.

## Problema que resuelve

El código redactado por un agente puede compilar y pasar el happy path sin ser correcto:
dependencias/símbolos inexistentes o mal usados, rutas no-felices sin cubrir, tests que solo
confirman lo que el propio código hace (falso verde), secretos o patrones inseguros, y supuestos
ocultos (locale, zona horaria, escala, multi-tenant). Sin un gate específico, esos defectos entran
en la PR y nadie asume su autoría real.

## La Regla de Oro (rendición de cuentas)

El código IA cambia el trabajo del ingeniero de **escribir** a **editar y auditar**. La firma de un
revisor/autor en una PR significa que **asume el 100% de la propiedad de ese código, con
independencia de si lo redactó una persona o una máquina**. «Lo escribió la IA» nunca es una
explicación válida de un defecto.

Cada PR nombra a **un único responsable (accountable owner)** que firma haber auditado cada línea.
El responsable por defecto de toda PR lo fija la instancia del proyecto (materializado en la
plantilla de PR del repo). El kit portable usa el placeholder `{{ACCOUNTABLE_OWNER}}`; la instancia
lo concreta y NO se hardcodea el nombre en el kit.

## Cuándo se carga (disciplina de carga — NO estática)

Este documento **no se precarga como contexto estático**. Se carga en UN punto: **al cerrar un
cambio que aterriza código ejecutable en una PR/MR (pre-PR / pre-handoff)** — misma familia «lands
executable changes» que la Práctica 14, disparada al cierre. Ni durante la redacción del código (aún
no hay nada que auditar) ni en trabajo analysis-only.

Criterios ponderados para elegir el punto óptimo:

| Criterio | Peso | Por qué |
|---|---|---|
| Accionabilidad / fidelidad de señal | 0.35 | El checklist solo es útil con el cambio completo y el diff final (deps/tests reales). |
| Economía de contexto (no estático) | 0.30 | Cargar ~1 página una vez por PR; evitar recarga por commit o carga permanente. |
| Cobertura sin escape + comprobabilidad | 0.20 | Se ancla al template de PR/MR + `check-ai-pr-assurance.sh` (CI): gate no evitable en el merge. |
| Captura de propiedad (firma) | 0.15 | El sign-off del responsable solo tiene sentido al crear la PR/MR. |

Puntuación (0–5 × peso): **pre-PR/pre-handoff = 5.0 (óptimo)** · revisión humana 3.4 · por-commit
2.35 · durante-generación 1.65 · estático = el peor (siempre cargado). Punto óptimo: **fin del
desarrollo, al preparar la PR/MR**, con refuerzo en CI (comprobación máquina al abrir la PR).
El disparo vive en los adapters como *AI-Code Assurance Trigger (conditional)*.

## Regla

Toda PR/MR debe usar la plantilla de aseguramiento IA y superar sus comprobaciones antes de
integrarse. La plantilla se materializa en el repo del proyecto:

- GitHub: `.github/PULL_REQUEST_TEMPLATE.md`
- GitLab: `.gitlab/merge_request_templates/Default.md`

con su fuente portable (placeholder de owner) en `sds-dev-governance/scaffold/.github/` y
`sds-dev-governance/scaffold/.gitlab/`, que `init.sh` copia a proyectos nuevos.

### Checklist de aseguramiento (mejorada)

Todas las casillas deben quedar marcadas o justificadas en línea como `N/A: <motivo>`.

1. **Dependencia y realidad de API** — cada librería, símbolo, método/ruta/campo importado EXISTE de
   verdad (verificado en el repo, no asumido) y se usa con su firma real; sin claves de config, env
   vars, endpoints, paths o flags alucinados; llamadas acordes a la versión INSTALADA (nada
   deprecado/eliminado en esa versión).
2. **Resiliencia (rutas no-felices)** — null/undefined/vacío, retornos de error, timeouts y fallos
   de red/IO tratados explícitamente; sin errores tragados; la operación degradada nunca burla en
   silencio un control de seguridad o consistencia; escrituras en contención definen
   concurrencia/idempotencia/dedup.
3. **Validez de tests (anti falso-verde)** — los tests asertan comportamiento/lógica real: un bug
   plausible (mutación) los haría fallar; no solo happy path ni tautologías; el test se vio fallar
   antes del fix o la aserción es demostrablemente no trivial; sin sobre-mockeo que oculte el código
   bajo prueba; los tests existentes pasan.
4. **Seguridad, secretos y supuestos** — sin secretos/credenciales/tokens/connection strings/PII
   hardcodeados ni logueados; validación en la frontera de confianza; autorización/scoping por
   tenant (anti-IDOR) preservado; sin patrones inseguros/deprecados; supuestos ocultos (locale, zona
   horaria, forma de datos, escala, single-tenant) declarados y seguros para todos los usuarios/tenants.
5. **Contrato y alcance** — linaje de contrato transversal (entrada → persistencia/externo →
   respuesta); contratos públicos (schemas/DTOs/OpenAPI/eventos) revisados juntos donde se tocan; sin
   fuentes de verdad duplicadas; cambio mínimo y quirúrgico (sin refactor oportunista).

### Comprobación posterior (máquina)

La plantilla incluye un pie machine-checkable con el marcador `<!-- sds-ai-assurance:v1 -->`, el
bloque delimitado `sds-ai-assurance:begin/end` y la firma del responsable. El validador
`sds-dev-governance/agentic-engineering/check-ai-pr-assurance.sh` verifica:

- marcador presente (plantilla correcta),
- cero casillas de aseguramiento sin marcar,
- firma de propiedad confirmada (`- [x] Confirmed`),
- (opcional) que el `Accountable owner` coincide con el esperado.

Uso:
`gh pr view <n> --json body -q .body | sds-dev-governance/agentic-engineering/check-ai-pr-assurance.sh - --owner "<Nombre>"`.
Puede cablearse en CI (workflow de PR) para bloquear el merge si falla.

## Relación con otras prácticas

- Extiende `practices/10-pre-pr-checklist.md`: este es el gate específico de código IA; el checklist
  10 sigue aplicando.
- Se apoya en `practices/06-non-regression.md`, `practices/07-security-baseline.md` y las reglas de
  linaje de contrato y resiliencia de mutación ya vigentes.
- Como cambio de gobernanza, sincronizado según `practices/11-governance-evolution.md`.

## Anti-patrones

- «Lo escribió la IA» como excusa de un defecto.
- Marcar casillas sin auditar (firma vacía de contenido).
- Tests autogenerados que solo repiten el happy path.
- Hardcodear el nombre del responsable en el kit portable (usar placeholder; concretar en la
  instancia).
