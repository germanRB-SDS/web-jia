# 03 — Output trazable por prompt

## Problema que resuelve

Sin registro de lo que hizo cada prompt, no se puede saber que cambio, por que, que quedo pendiente ni como continuar.

## Regla

Todo prompt con impacto en codigo debe generar un fichero en `docs/prompts-output/` usando la plantilla de `docs/prompts-output-template/output-template.md`.

## Estructura del output (12 secciones)

| # | Seccion | Contenido |
|---|---|---|
| 0 | Metadata | Prompt, fecha, agente, rol, estado, Change ID |
| 1 | Objetivo | Nivel de gobernanza, areas afectadas y desglose jerarquico de tareas |
| 2 | Resumen ejecutivo | 1-3 lineas |
| 3 | Ficheros involucrados | Leidos, creados, modificados, eliminados |
| 4 | Mapa de impacto | Por capa: BBDD, backend, API, iOS, Android, web |
| 5 | Verificacion BBDD | Estado previo, cambios, arbol de diagnostico |
| 6 | Verificacion API | Endpoints, compatibilidad, arbol de diagnostico |
| 7 | Tests y validacion | Ejecutados + no ejecutados con motivo |
| 8 | Resultado | Fallos, bloqueos, soluciones propuestas |
| 9 | Checklist E2E | Checkboxes por capa |
| 10 | Decisiones y riesgos | Decisiones, riesgos, inconsistencias |
| 11 | Actualizaciones de memoria | CLAUDE.md, memorias tematicas, contratos |
| 12 | Siguiente paso | Accion concreta y checkpoint de continuidad si aplica |

## Estados validos

- `IMPLEMENTADO` — todo hecho y verificado.
- `PARCIAL` — parte hecha, parte pendiente.
- `BLOQUEADO` — no se puede continuar sin resolver algo.
- `NO VERIFICADO` — hecho pero sin validacion suficiente.

## Anti-patron

No copiar diffs completos, logs enormes ni secretos en el output. Funcion: contexto operativo, no pseudo-Git.

## Excepcion por proporcionalidad

Los cambios `LEVEL 0` no requieren output obligatorio. Los cambios `LEVEL 1` pueden usar output compacto. `LEVEL 2` y `LEVEL 3` usan la plantilla completa; `LEVEL 3` requiere checkpoint.

En outputs completos, las secciones no aplicables se marcan como `N/A - motivo`; no se desarrollan por rellenar.

## Checkpoint de continuidad

Obligatorio si el estado final es `PARCIAL`, `BLOQUEADO` o `NO VERIFICADO`. Recomendado para prompts largos.

Debe contener solo estado minimo para reanudar:

- Objetivo activo.
- Estado actual.
- Ultimo fichero o modulo tocado.
- Cambios ya aplicados.
- Cambios pendientes inmediatos.
- Verificaciones ejecutadas.
- Restricciones activas del usuario (p. ej. exclusion de una capacidad como pstack).
- Prompt o comando exacto para continuar.

## Tmp/scratch memory y evidencia

Para prompts largos, `LEVEL 3`, multi-gate, release closure, migraciones, refactors, fixes de
seguridad/scoping, tareas con alto riesgo de tokens/contexto o ejecuciones que producen evidencia
sustancial antes del reporte final, usar checkpoints temporales en:

```text
docs/prompts-output/<PROMPT_ID>/tmp/
```

Guardar salidas largas, logs extensos, dumps de rutas, validaciones OpenAPI, resultados de tests,
resumenes read-only de BBDD u otra evidencia pesada en:

```text
docs/prompts-output/<PROMPT_ID>/evidence/
```

No usar `docs/prompts/` para scratch memory. Los prompts fuente viven ahi; tmp/evidence es estado
de ejecucion y pertenece a `docs/prompts-output/`.

Los checkpoints tmp deben ser proporcionales. No son obligatorios para prompts simples de una sola
pasada. Pueden commitearse cuando aportan valor real de recuperacion o auditoria, pero no se exige
un commit por cada microestado.

Al cerrar el prompt, verificar que:

- el contenido util de tmp quedo reflejado en final report, phase report, continuity state o memoria
  permanente aplicable;
- tmp/evidence no contradice el reporte final, la memoria, la gobernanza ni el estado real del repo;
- no queda ningun tmp/evidence requerido sin trackear por accidente;
- no hay secretos ni datos personales innecesarios en tmp/evidence.

## Evidencia de selección de contexto

En una evaluación de contexto registrar corpus/revisión, códigos requeridos/seleccionados, lecturas
posteriores, bytes, tokenizer/encoding, metadatos, gobernanza fija y latencia. Distinguir llamadas
locales de llamadas al modelo y coste estimado de factura real. No atribuir completitud semántica
independiente a una comparación de bloques elegidos por el mismo autor. Protocolo bajo demanda:
`practices/modules/01-selective-text.md`.
