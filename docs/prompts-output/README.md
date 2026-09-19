# Prompts Output Log

Resultados trazables de cada prompt ejecutado desde `docs/prompts/`.

## Relacion prompt → output

- Prompt: `docs/prompts/[NN.R]nombre.md` → Output: `docs/prompts-output/[NN-R]prompt-output.md`
- Punto se convierte en guion. Guion se conserva.

## Que debe contener

Cada output sigue la plantilla de `docs/prompts-output-template/output-template.md`.

Debe indicar las areas afectadas y las memorias de `docs/memory/` cargadas o descartadas.

Si un prompt queda parcial, bloqueado o sin verificar, debe incluir un checkpoint de continuidad con la informacion minima para reanudar sin releer todo el contexto.

## Tmp/scratch memory y evidencia

Para prompts largos, `LEVEL 3`, multi-gate, release, migraciones, refactors, fixes de seguridad o
tareas con alto riesgo de interrupcion, usar:

```text
docs/prompts-output/<PROMPT_ID>/tmp/
```

para checkpoints temporales de ejecucion, y:

```text
docs/prompts-output/<PROMPT_ID>/evidence/
```

para logs largos, resultados de comandos, validaciones o evidencia pesada.

No guardar scratch memory bajo `docs/prompts/`: esa carpeta es el corpus limpio de prompts fuente.
Antes de cerrar el prompt, consolidar lo util en el final report, phase report, continuity state o
memoria permanente relevante.

## Que NO debe contener

- Diffs enormes
- Logs completos
- Secretos, tokens, claves, contrasenas
- Datos personales no necesarios
- Estado duplicado que ya vive en Git, issues o memorias tematicas

## Fuente de verdad

Este directorio no sustituye a Git. Si hay contradiccion, prevalece el codigo real y Git.
