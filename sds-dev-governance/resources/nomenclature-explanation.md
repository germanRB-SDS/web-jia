# Nomenclature Explanation

This file is optional know-how. Do not load it during normal SDS startup. Load it only when the
user or active prompt explicitly asks about nomenclature, naming help, naming conventions,
know-how, or how to name SDS artifacts.

Este fichero es know-how opcional. No se carga durante el arranque normal de SDS. Cargarlo solo
cuando el usuario o el prompt activo pregunte explicitamente por nomenclatura, ayuda de nombres,
convenciones de nombres, know-how o como nombrar artefactos SDS.

## Prompt Identifiers

### English

Canonical prompt files live in `docs/prompts/` and use:

```text
[NN-R]descriptive-name.md
```

- `NN` is the prompt thread or main sequence.
- `R` is the executable iteration inside that thread.
- `[NN-0]` is the base executable prompt.
- `[NN-1]`, `[NN-2]`, etc. are later related executable iterations.

Example:

```text
docs/prompts/[40-1]platform-safe-boot-and-request-scoped-admin.md
```

### Espanol

Los prompts canonicos viven en `docs/prompts/` y usan:

```text
[NN-R]nombre-descriptivo.md
```

- `NN` es el hilo o secuencia principal del prompt.
- `R` es la iteracion ejecutable dentro de ese hilo.
- `[NN-0]` es el prompt ejecutable base.
- `[NN-1]`, `[NN-2]`, etc. son iteraciones ejecutables relacionadas posteriores.

Ejemplo:

```text
docs/prompts/[40-1]platform-safe-boot-and-request-scoped-admin.md
```

## Pre-Execution Refinements

### English

Use `-alpha`, `-beta`, `-gamma`, `-delta`, `-epsilon` when refining a prompt before executing that
same identifier.

```text
[40-1-alpha]...
[40-1-beta]...
```

When a refinement is executed, the next related executable prompt normally increments `R`.

### Espanol

Usa `-alpha`, `-beta`, `-gamma`, `-delta`, `-epsilon` para refinar un prompt antes de ejecutar ese
mismo identificador.

```text
[40-1-alpha]...
[40-1-beta]...
```

Cuando un refinamiento se ejecuta, el siguiente prompt ejecutable relacionado normalmente
incrementa `R`.

## Planned-Iteration Insertions

### English

Use compact insertions when `[NN-R]` already exists as a planned future prompt, but new executable
work appears after any executed `[NN-(R-1)]*` variant and before `[NN-R]`.

```text
[40-1a]...
[40-1b]...
```

These are executable prompt identifiers. They are not refinements and they are not ad hoc lettered
executions. Their refinements use the normal suffix on the full identifier:

```text
[40-1a-alpha]...
[40-1a-beta]...
```

Do not write the compact insertion with an extra hyphen such as `[40-1-a]`.

### Espanol

Usa inserciones compactas cuando `[NN-R]` ya existe como prompt futuro planificado, pero aparece
trabajo ejecutable nuevo despues de cualquier variante ejecutada `[NN-(R-1)]*` y antes de `[NN-R]`.

```text
[40-1a]...
[40-1b]...
```

Son identificadores ejecutables propios. No son refinamientos y no son ejecuciones con letras ad
hoc. Sus refinamientos usan el sufijo normal sobre el identificador completo:

```text
[40-1a-alpha]...
[40-1a-beta]...
```

No escribir la insercion compacta con un guion extra, como `[40-1-a]`.

## Prompt Outputs

### English

Executable prompt outputs live in `docs/prompts-output/`. Use the executed prompt identifier as the
output prefix:

```text
docs/prompts-output/[40-1]/final-report.md
docs/prompts-output/[40-1a]prompt-output.md
```

Long or multi-gate prompts can use:

```text
docs/prompts-output/<PROMPT_ID>/tmp/
docs/prompts-output/<PROMPT_ID>/evidence/
```

`tmp/` stores recoverable execution checkpoints. `evidence/` stores heavy evidence or long command
output. Do not put scratch memory under `docs/prompts/`.

### Espanol

Los outputs de prompts ejecutables viven en `docs/prompts-output/`. Usa el identificador ejecutado
como prefijo del output:

```text
docs/prompts-output/[40-1]/final-report.md
docs/prompts-output/[40-1a]prompt-output.md
```

Los prompts largos o multi-gate pueden usar:

```text
docs/prompts-output/<PROMPT_ID>/tmp/
docs/prompts-output/<PROMPT_ID>/evidence/
```

`tmp/` guarda checkpoints recuperables de ejecucion. `evidence/` guarda evidencia pesada o salidas
largas de comandos. No guardar scratch memory bajo `docs/prompts/`.

## Preflight Outputs

### English

Preflight reviews are read-only reviews of a target prompt. They do not increment `R`.

```text
docs/prompts-output/[NN-R]preflight.md
docs/prompts-output/[NN-R]preflight-2.md
docs/prompts-output/[NN-R]preflight-3.md
```

### Espanol

Los preflights son revisiones read-only de un prompt objetivo. No incrementan `R`.

```text
docs/prompts-output/[NN-R]preflight.md
docs/prompts-output/[NN-R]preflight-2.md
docs/prompts-output/[NN-R]preflight-3.md
```

## Feature, Decision, And Governance IDs

### English

- Features use `FTR-NNN`, for example `FTR-001`.
- Architecture decisions use `DEC-NNN-short-title.md`, for example
  `DEC-001-naming-brand-strategy.md`.
- Governance change log entries use `GOV-YYYY-MM-DD-NN`, for example `GOV-2026-07-04-01`.

### Espanol

- Las funcionalidades usan `FTR-NNN`, por ejemplo `FTR-001`.
- Las decisiones de arquitectura usan `DEC-NNN-titulo-corto.md`, por ejemplo
  `DEC-001-naming-brand-strategy.md`.
- Las entradas del log de gobernanza usan `GOV-YYYY-MM-DD-NN`, por ejemplo
  `GOV-2026-07-04-01`.

## Public Policy Placeholders

### English

Public policy placeholders live under:

```text
docs/<project-name>-policies/
```

Canonical file names:

```text
<project-name>-cookies-policy.md
<project-name>-privacy-policy.md
<project-name>-terms-of-service.md
```

### Espanol

Los placeholders de politicas publicas viven en:

```text
docs/<project-name>-policies/
```

Nombres canonicos:

```text
<project-name>-cookies-policy.md
<project-name>-privacy-policy.md
<project-name>-terms-of-service.md
```

