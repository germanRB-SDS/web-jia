# 14 — Cierre de fase: dos commits + informe de riesgo

## Problema que resuelve

Las fases de implementacion se cierran con un unico commit y el analisis de riesgo (si existe) se
queda en el chat del agente: no es trazable, no sobrevive a la sesion y no llega a revisores ni a
otros agentes. Esta practica hace que cada cierre de fase deje DOS artefactos git: la implementacion
y su informe de riesgo, separados y correlacionables.

## Carga condicional (regla de bajo consumo)

Esta practica NO se carga por defecto. Los adapters solo llevan el trigger; este fichero se lee
unicamente cuando la tarea APLICA.

**APLICA — la tarea aterriza cambios ejecutables:**

| # | Escenario |
|---|---|
| A1 | Implementacion de codigo (features, fases de un plan/prompt/tracker) |
| A2 | Correccion de errores (bugfix, hotfix) |
| A3 | Migraciones de esquema/datos o cambios de infra/config ejecutable (CI, deploy, scripts) |
| A4 | Refactors sobre codigo de runtime |
| A5 | Cambios operativos de seguridad (hardening, permisos, manejo de secretos) |
| A6 | Cambios solo-tests o de dependencias con efecto en runtime |
| A7 | Prompts mixtos: si aterriza CUALQUIER cambio ejecutable, aplica |

**NO APLICA — trabajo de solo analisis (no cargar este fichero, cero tokens extra):**

| # | Escenario |
|---|---|
| N1 | Evaluacion, contraste, auditoria (outputs de analisis) |
| N2 | Documentacion pura (docs, memorias, trackers, outputs) |
| N3 | Diagramas, diseno, especificaciones, gates de decision |
| N4 | Preguntas, consultas y exploracion de codigo sin cambios |
| N5 | Cambios de la propia gobernanza o de prompts sin codigo de runtime (siguen la practica 11) |

## Regla obligatoria

Se aplica SIEMPRE que el escenario corresponda, aunque el prompt no lo pida, en todos los agentes
(Claude, Codex, Gemini, Cursor).

Al cerrar cada Phase:

1. **Commit(s) de implementacion.** Una fase puede aterrizar como una serie de commits de
   implementacion consecutivos cuando el prompt/tracker lo autorice o el tamano/riesgo lo haga
   proporcional. Cada checkpoint debe quedar con su evidencia de verificacion en verde (tests,
   validaciones, smokes) y el checkpoint de continuidad actualizado. El ultimo commit de
   implementacion cierra la phase y dispara el informe + commit documental.
2. **Informe de fase.** Generar y MOSTRAR por terminal un informe con:
   - **Resumen**: que se hizo y con que evidencia verificable.
   - **Analisis de riesgo**: puntos **moderados**, **severos** y **criticos** detectados tras la
     implementacion (estado post-cambio; incluye pre-existentes agravados o acercados por el cambio).
   - **Soluciones propuestas** para cada punto, con destino registrado (fase futura, decision
     humana, fix inmediato).
   - Si no hay criticos nuevos, afirmarlo explicitamente; nunca dejar la seccion vacia sin evidencia.
   El informe se guarda en `docs/prompts-output/` (fichero propio o seccion del output del prompt activo).
3. **Commit 2 — informe.** Commitea el fichero del informe (mas la actualizacion de
   tracker/checkpoint si existe) con el resumen + analisis de riesgo INTEGROS en la descripcion
   del commit.

**Definicion de Phase:** la unidad de fase del prompt/plan/tracker activo. Si el prompt no define
fases, el cierre del prompt completo cuenta como una unica phase.

## Anti-patrones

- Mezclar informe e implementacion en un solo commit.
- Dejar el informe solo en el chat (no mostrado por terminal o no commiteado).
- Analisis de riesgo "sin riesgos" sin evidencia de haberlos buscado.
- Cargar esta practica en tareas de solo analisis o documentacion (N1–N5).
- Repetir el texto completo de esta regla en adapters o `GOVERNANCE.md` (solo el trigger).

## Relacion con tmp/scratch memory

Los checkpoints temporales bajo `docs/prompts-output/<PROMPT_ID>/tmp/` y la evidencia pesada bajo
`docs/prompts-output/<PROMPT_ID>/evidence/` ayudan a recuperar ejecuciones largas y a sostener el
informe de fase con evidencia verificable.

No sustituyen:

- commit boundary;
- phase report;
- final report;
- continuity state;
- rollback note;
- governance check.

Al cerrar la fase, consolidar lo util de tmp/evidence en el informe de fase o en el output del prompt
activo, y verificar que no quedan secretos ni contradicciones con el estado real del repo.

Referencia canonical: `sds-dev-governance/GOVERNANCE.md`.
