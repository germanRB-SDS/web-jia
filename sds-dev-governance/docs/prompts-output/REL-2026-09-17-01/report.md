# REL-2026-09-17-01 — Integración declarativa de pstack

## 0. Metadata

2026-09-17. Claude Code (Fable 5.1). Gobernanza, LEVEL 3 (cambia routers, adapters y checker).
Base v1.27.0 `79aa7ff`; rama `feat/REL-2026-09-17-01-pstack-integration`, worktree aislado,
staging por rutas. Encargo: aterrizar pstack sin re-evaluar su calidad. Tmp/scratch: N/A (una
sesión, evidencia directa en `evidence/`).

## 1. Qué existía y qué se reutiliza

- Router de skills siempre leído `skills/README.md` + nodos lazy por capacidad (`spline.md`,
  `r8-analyzer.md`): pstack entra como un nodo más, `skills/pstack.md`, con una fila de router.
- Ledger por proyecto `docs/governance/capability-registry.md` y módulo 11 de admisión: sin cambio;
  instalación ≠ admisión sigue siendo la regla. El nodo propone el modo inicial de la fila.
- Prácticas 06/10/16 (no regresión, pre-PR, proporcionalidad de verificación): pstack las complementa;
  la tabla de selección declara alternativa nativa y precedencia por skill.
- Checkpoint de continuidad (03/11) y práctica 13: reciben la "restricción activa del usuario" para
  que la exclusión sobreviva a handoff y delegación.
- Checker `check-governance.sh`: puertas `contains`, `route_fixture` y lista de ficheros requeridos.
- Instalación real: plugin Claude Code `pstack@pstack` 1.1.0 (`04830a9`, marketplace
  `painhardcore/pstack`, fork portable del pstack de Cursor de poteto/Lauren Tan, pin upstream
  `46756f8`). Enabled en `~/.claude/settings.json`; no instalado para Codex ni Gemini. Comprobado con
  `claude plugin list --json` y con el árbol del cache.

## 2. Alternativas y decisión

| Opción | Veredicto |
|---|---|
| A. Extensión declarativa | **Elegida**: fila en el router + nodo lazy + un bullet por adapter |
| B. Resolver ligero | Descartada: no hay resolver ejecutable de skills en el Kit; crear uno sólo para pstack sería un segundo router paralelo |
| C. Adapters finos por agente | **Elegida en mínimo**: una línea por adapter (Claude `/pstack:<skill>`, Codex `$ pstack:<skill>`, Gemini sin paquete → alternativa nativa) |
| D. Sin nueva infraestructura | **Elegida**: sin instalador, sin fila en catálogos de instalación, sin puente cross-agent, sin copia vendorizada |

Coste: +1 fila always-read compensada con recortes (3000 → 2986 palabras); nodo lazy 1512 palabras /
10.6 KB sólo cuando se enruta. Fiabilidad: invariantes deterministas en checker y test. Mantenimiento:
una referencia (plugin instalado + revisión anotada). Portabilidad: cada host instala la misma revisión
por su propia ruta de plugins. Compatibilidad: ninguna ruta previa cambia; `INDEX.md` y la política de
portabilidad no se tocan (`--check-policy` verde).

## 3. Ficheros y mecanismo

Ficheros y motivo en `docs/governance/governance-change-log.md` (GOV-2026-09-17-01).
Mecanismo final: `skills/README.md` (fila con trigger «sin pstack») → `skills/pstack.md` (fuente y
revisión, invocación por host, tabla de selección con usar / no usar / alternativa sin pstack /
precedencia, `poteto-mode` no global ni recursivo, perfil de proyecto e invalidación, exclusión con
alcance heredado, perfiles de verificación por superficie, clasificación de fallos, admisión y
retirada). Adapters sólo llevan invocación + exclusión. La selección sigue siendo razonamiento del
agente sobre metadatos; no hay resolver.

## 4. Uso, desactivación y restauración

Tarea ordinaria (Claude Code, proyecto con fila `ADMITTED` para `pstack@pstack 1.1.0`):

```text
Diagnostica por qué el login iOS devuelve 401 tras la migración; no cambies código todavía.
```

El router lleva a `skills/pstack.md`; la tarea es diagnóstico de un flujo poco conocido → `how`
(`/pstack:how` o selección implícita), práctica 06 para la traza real; sin `architect`, sin
`interrogate`, sin implementación aunque `how` la ofrezca.

Sin pstack:

```text
Haz esta tarea sin pstack: revisa el impacto de cambiar el token de auth compartido.
```

Exclusión activa para la tarea, subagentes y continuaciones (checkpoint 03 + brief 13); impacto y
revisión se hacen con práctica 06/16 y gstack; ningún `/pstack:*`, alias ni copia.

Desactivar: exclusión (tarea) · `claude plugin disable pstack@pstack` (host) · quitar/deprecar fila del
ledger (proyecto). Restaurar comportamiento anterior del Kit: borrar `skills/pstack.md`, su fila del
router, el bullet de los seis adapters y las puertas del checker; ningún script depende de pstack.

## 5. Checks, resultados y coste

Evidencia en `evidence/`: `acceptance-summary.log`, `check-project.log`, `check-hub.log`, logs por
test, variantes Bash 3.2. Línea base previa (main `79aa7ff`): checker proyecto 621 OK; suite verde
salvo `test-governance-freshness.py` (timeout → exit 2, preexistente, falla igual con Python 3.8 y
3.14) y `test-mcp-control.py` (sólo falla con Python 3.8 del PATH por `tomllib`; verde con 3.14).

| Caso (§11 del encargo) | Cobertura | Tipo |
|---|---|---|
| Router previo conservado | fixtures previas siguen verdes; `--check-policy`; instaladores dry-run sin pstack | determinista |
| Tarea documental Android → sin ARTEMIS/batería | fixture R8/UI/3D/migración/seguridad/grafo prohíben `pstack.md`; regla "nunca por tipo de proyecto" | determinista + ensayo |
| Consulta de funcionamiento → sólo `how` | fixture "unknown subsystem" → `pstack.md`; regla lectura ≠ implementar | determinista + ensayo |
| Cambio pequeño → sin arquitectura/revisión múltiple | tabla "no usar"; una revisión por propósito | ensayo |
| Auth/contrato sensible → impacto+revisión+consumidores | `blast-radius`/`interrogate` + 06/16 | ensayo |
| JS sin TS → sin skill TS | fila TS: "comprobar lenguaje primero" | ensayo |
| Monorepo/híbrido | perfil por componente afectado | ensayo |
| Contexto insuficiente | lectura selectiva; pregunta concreta | ensayo |
| Exclusión y variantes | variantes en nodo/router/adapters; alcance heredado | determinista (texto) + ensayo |
| Exclusión con delegación/handoff | 03/11 checkpoint + 13 Delegation Brief | determinista (texto) + ensayo |
| Skill no disponible | Gemini sin paquete → alternativa nativa; test de interfaz nombra la skill ausente | determinista |
| Fallo de entorno/herramienta | clasificación `ENVIRONMENT`/`PREREQ_BLOCKED`, sin modificar producto | ensayo |
| Verificación existente se reutiliza | regla "descubrir antes de generar" | ensayo |
| Cambio relevante de perfil | invalidación declarada | ensayo |
| Desactivación | test: sin dependencia en scripts/bootstrap/catálogos | determinista |

"Ensayo" = comportamiento que depende del razonamiento del agente sobre el nodo; verificado por
lectura y segundo pase, no por test automático. No se afirma más.

Coste medido: always-read 3000 → 2986 palabras. Adapters +22/+33/+38 palabras. Prácticas 03/11 +13,
13 +64. Nodo lazy 10.6 KB. Carga por skill seleccionada (plugin instalado): `how` 2.7 KB (13.7 KB con
referencias), `blast-radius` 4.1 KB, `architect` 6.1 KB, `interrogate` 5.2 KB (21.9 KB con
referencias), `tdd` 3.5 KB, TS 2.5 KB, verificación 5.8/5.0 KB; `poteto-mode` 7.5 KB + 60.8 KB de
playbooks → razón para no hacerlo global. Descubrimiento del host: 41 descripciones ≈ 10.3 KB, coste
del plugin habilitado independiente de SDS. Estimaciones en bytes/palabras, no tokens exactos.

## 6. Limitaciones y no verificado

- Invocación real `/pstack:<skill>` no ejercitada en esta sesión (el plugin se instaló tras el
  arranque de la sesión y no expone sus skills hasta una sesión nueva); comprobado sólo `claude plugin
  list --json` y el árbol de skills. Codex/Gemini: sin pstack instalado; sólo documentado.
- Sin resolver ejecutable: la selección semántica es del agente. Los tests prueban estructura.
- No se admite pstack en ningún ledger: cada proyecto añade su fila (modo inicial propuesto en el nodo).
- Bootstrap no instala pstack; decisión deliberada, reversible con una fila de catálogo futura.
- Copia de `roots/sds-dev-governance` (files-only v1.27.0) no actualizada: distribución sigue el módulo
  11 (`governance-copies.sh`) tras publicar la release.

## 7. Segundo pase (mismo agente, rol mantenedor + QA)

Regresiones del router: ninguna (fixtures previas + `--check-policy`). Coste permanente: negativo.
Duplicación: `interrogate` vs gstack `/review` resuelta por "una revisión por propósito"; playbooks de
continuidad/PR ceden a 01/03/05/14. Exclusión: nodo + router + 6 adapters + 03/11/13. Diferencias por
agente: Claude invoca, Codex condicionado a instalación, Gemini sin paquete. Permisos: el nodo no amplía
ejecución; `why`/`recall`/Postman/MCP sólo bajo fila admitida. Riesgo moderado: el nodo (1512 palabras)
es el mayor nodo de skill del Kit; mitigado por carga lazy. Riesgo severo: ninguno nuevo. Crítico:
ninguno.
