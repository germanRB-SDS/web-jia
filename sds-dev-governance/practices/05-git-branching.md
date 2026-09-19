# 05 — Git branching + Change ID

## Problema que resuelve

En proyectos multi-repo (backend + iOS + web + Android), los cambios cruzados necesitan un identificador humano compartido. Sin el, no se puede correlacionar que commit de backend va con que commit de iOS.

## Change ID

Formato: `REL-YYYY-MM-DD-NN`

Ejemplo: `REL-2026-05-26-01`

Uso obligatorio en:
- nombre de rama
- commits relevantes
- PR/MR
- documentacion de output
- validaciones manuales
- rollback/hotfix

## Branching

1. No trabajar sobre ramas compartidas (ej: `dev`, `main`, `roots-dev`).
2. Crear rama corta de trabajo desde la rama compartida vigente.
3. Naming: `feat/REL-YYYY-MM-DD-NN-descripcion-corta`

Ejemplos:
- `feat/REL-2026-05-26-01-backend-tax-address`
- `feat/REL-2026-05-26-01-ios-tax-address`

## Modelo de promocion (dev-local -> dev -> prod)

Para proyectos que adoptan promocion por entornos (complementa, no sustituye, el Change ID + ramas cortas):

1. Cada desarrollador trabaja en su rama local de maquina: `dev-local` o variante `dev-local-<maquina>`
   (ej. `dev-local-hrms`, donde `hrms` es el nombre de la maquina).
2. Commits y push se hacen en esa rama `dev-local-*`.
3. Cuando el trabajo esta verde y validado, se promueve a `dev` (integracion compartida).
4. Tras las pruebas finales en `dev`, se promueve a `prod` (release).
5. Las ramas `dev` y `prod` se crean si no existen.
6. `dev-local-*`, `dev` y `prod` son ramas compartidas a efectos de las reglas de Rollback (nunca
   `push --force`; usar `git revert`).
7. El Change ID (`REL-YYYY-MM-DD-NN`) y la Clasificacion de cambios siguen aplicando en todas las ramas.

## Escritores concurrentes: aislamiento y staging explicito

Un repositorio puede tener varias sesiones de agente, varios worktrees y ficheros sucios ajenos al
trabajo en curso. El modelo por defecto es:

`una tarea -> una rama aislada -> preferiblemente un worktree aislado -> staging por rutas
explicitas -> inspeccion del diff en stage -> commit`.

Reglas vinculantes:

1. Antes de tocar nada: `git fetch --all --prune`, `git status --short`, `git branch --show-current`,
   `git rev-parse HEAD`, `git worktree list --porcelain` y `git branch -vv`. Registrar el resultado.
2. Nunca modificar, limpiar ni borrar el worktree o la rama de otra sesion.
3. **`git add -A` y `git add .` estan prohibidos cuando el arbol puede contener trabajo ajeno o
   concurrente.** Se usan rutas explicitas. La excepcion admitida es un worktree recien creado y
   verificablemente limpio para esta tarea, y sigue exigiendo la inspeccion del punto 4.
4. Antes de cada commit: `git status --short`, `git diff --cached --stat` y `git diff --cached`. El
   conjunto en stage se inspecciona; un commit no puede contener ficheros que la tarea no toco.
5. Una fase que falla se repara o se revierte dentro de su rama aislada. No se corrige tocando ramas
   compartidas ni reescribiendo historia publicada.
6. Antes de publicar: volver a hacer fetch, comprobar si la rama base cambio durante el trabajo y
   revalidar lo material si cambio.

Motivo: un `git add -A` en un arbol compartido ya commiteo silenciosamente nueve ficheros de otra
sesion. El fallo se detecto y se reparo, pero la regla existe para que no dependa de la deteccion.

## Integracion

1. `git fetch` antes de integrar.
2. Revalidar despues de actualizar con base remota.
3. Si hay conflicto funcional (no solo textual), parar y reevaluar.
4. Documentar commits remotos nuevos que aparecieron durante el trabajo.

## Rollback

- Formato: `ROLLBACK-REL-YYYY-MM-DD-NN`
- Usar `git revert` sobre commits nuevos (no `reset --hard` ni rebase destructivo en ramas compartidas).
- Nunca `push --force` sobre ramas compartidas.

## Remote refs: deletion and rewrite are owner-manual only

An agent never deletes a remote branch or tag and never performs a non-fast-forward update on any
remote ref. This prohibition has no conversational exception and applies to shared and feature refs.
The owner may perform a genuinely required deletion manually in the GitHub UI or their own terminal;
the agent may explain the steps and verify the result read-only, but must not prepare or execute it.

For agent pushes, use `sds-dev-governance/scripts/git-safe-push.sh` with one explicit remote and one
explicit refspec. Do not use raw `git push`, `--force`, `--force-with-lease`, `--delete`, `--mirror`,
`--prune`, a leading `+`, an empty refspec side, or a bypass of the governed pre-push hook. Install
the versioned hook per clone with `scripts/install-git-guardrails.sh`; if another `core.hooksPath`
already exists, stop and merge manually instead of replacing it.

Normal local, reviewable patch/commit work is distinct from a GitHub remote resource deletion. It
does not authorize history loss, remote file/API deletion, or deletion of GitHub-side resources.

## Clasificacion de cambios

Antes de tocar codigo, clasificar:

| Tipo | Riesgo | Requiere mapa de impacto |
|---|---|---|
| `UI-only` | Bajo | No |
| `client-only` | Bajo | No |
| `backend-internal` | Medio | Recomendado |
| `contract-change` | Alto | Obligatorio |
| `schema/data-change` | Alto | Obligatorio |
| `high-risk` | Alto | Obligatorio |
