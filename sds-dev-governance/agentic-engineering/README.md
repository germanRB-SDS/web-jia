# agentic-engineering — SDS

Área de gobernanza para trabajar con agentes de IA de forma segura y auditable.

## Contenido

- `ai-code-assurance.md` — regla canónica: **La Regla de Oro** (propiedad 100% del firmante) +
  checklist mejorada de aseguramiento de código generado por IA.
- `check-ai-pr-assurance.sh` — validador de cuerpo de PR/MR (comprobación posterior, cableable en CI).
- `ci-cd_to_catch_hallucinations.md` — guía CI/CD (stack-aware) para atrapar alucinaciones y fallos
  típicos de agentes IA antes de la revisión humana: drift de lockfile vs. imports alucinados, matriz
  de controles, protocolo de alta de dependencias, niveles de adopción y ejemplos adaptables.

## Cómo se materializa

- Plantilla de PR/MR en el repo del proyecto: `.github/PULL_REQUEST_TEMPLATE.md` (GitHub) y
  `.gitlab/merge_request_templates/Default.md` (GitLab). Concretan el `Accountable owner`.
- Fuente portable (placeholder `{{ACCOUNTABLE_OWNER}}`) en `sds-dev-governance/scaffold/.github/` y
  `sds-dev-governance/scaffold/.gitlab/`, copiada a proyectos nuevos por `init.sh`.

## La Regla de Oro

El código IA cambia el trabajo del ingeniero de **escribir** a **editar y auditar**. La firma en una
PR significa **100% de propiedad** del código, lo haya redactado una persona o una máquina. «Lo
escribió la IA» no es una explicación válida de un defecto.

## Comprobación posterior

```bash
gh pr view <n> --json body -q .body \
  | sds-dev-governance/agentic-engineering/check-ai-pr-assurance.sh - --owner "<Nombre>"
```

Enlazada desde `GOVERNANCE.md` y `practices/10-pre-pr-checklist.md`. Cambios sincronizados según
`practices/11-governance-evolution.md`.
