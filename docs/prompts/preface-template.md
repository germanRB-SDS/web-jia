# [NN-R]nombre-descriptivo.md

## PREFACE — NON-EXECUTABLE

> Plantilla del prefacio **no-operativo**. Obligatorio en prompts `LEVEL 2-3`; opcional en `LEVEL 0-1`.
> Es documentacion / mini-memoria del prompt: **NO se ejecuta**. Ejecutar desde `## Status` (o la primera
> seccion operativa) en adelante.
>
> **Tokens:** el marcador "skip" no ahorra tokens por si solo si el prompt ya esta en contexto; solo ahorra
> si un loader/script excluye este bloque antes de la ejecucion (stripping efectivo). Su valor primario es
> trazabilidad y seguridad.
>
> Rellenar (ver `sds-dev-governance/practices/02-prompt-system.md`):
>
> - **Que cambia:** _..._
> - **Por que:** _..._
> - **Que implica:** _..._
> - **Como lo hace:** _..._
> - **Consecuencias:** _efectos previstos sobre otras partes del software._
> - **Analisis de severidad:** _moderado / severo / critico; ¿puede inducir inestabilidad o
>   vulnerabilidades graves o criticas?_ (taxonomia de `practices/14-phase-commit-report.md`, por
>   referencia, sin duplicar el informe de fase).

---

## Status

(Primera seccion ejecutable del prompt: estado, nivel de gobernanza, areas afectadas, fases, etc.)

### Authoring note: long phased prompts

For a long generated prompt, convert its operational H2 headings to stable codes, define initial
selection/dependencies, and include tested calls to `sds-dev-governance/scripts/sds-text`. Read
`practices/modules/01-selective-text.md` on demand. Preserve this non-executable preface and all
universal requirements. Use native full reads for short prompts; do not paste an uninstalled command.
