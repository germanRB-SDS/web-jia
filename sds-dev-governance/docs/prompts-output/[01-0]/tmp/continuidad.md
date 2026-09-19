# Continuidad de la revisión Sentinel

Fecha: 2026-09-12. Alcance autorizado: guardar el texto recibido, analizarlo y redactar un prompt final; no activar Sentinel. Raíz: repositorio canónico actual; HEAD observado `79aa7ff`.

Observado: macOS/Darwin, `codex-cli 0.154.0`, `Claude Code 2.1.269`; no equivalen a identificar la implementación que sirve esta conversación. Contexto de la sesión declara lectura de `/`, escritura en proyecto y temporales, auto-review. No se han probado denegaciones ni hooks.

Hallazgo prioritario: `init.sh` delega en `scripts/bootstrap.py`; `snapshot(KIT)` en `scripts/governance_tree.py` ignora solo `.git`, `.DS_Store`, `__pycache__`, no `.gitignore`. Un JSON local dentro del kit afecta copia y fingerprint. No crearlo con permisos reales en esta tarea.

Controles existentes: kernel/router selectivos; presupuestos 1700/1000/3000 palabras; `check-governance.sh` incluye suites y temporales, no es un guard ligero por llamada; wrappers GitHub; ledger de capacidades. Graphify no tiene fila exacta en el ledger de este proyecto ni se encontró grafo; no se invoca ni instala.

Entregados: fuente histórica en `docs/prompts/SDS-REVISION-sentinel-perimetro-local-2026-09-12.md`, prompt en `docs/prompts/[01-0-alpha]sentinel-perimetro-local.md`, informe en `docs/prompts-output/[01-0]sentinel-revision-aterrizada.md` e índice. La precisión posterior del usuario exige costes fijos mínimos y cálculo local mediante Bash: incorporada en objetivos y §5 del prompt. No son archivos de carga habitual.

Validación V0 documental: enlaces locales, estructura, cobertura H-01–H-20, recuentos y ausencia de modificaciones ejecutables. Evidencia en `docs/prompts-output/[01-0]/evidence/verificacion-documental.json`. Preservado el directorio previo sin seguimiento `docs/prompts-output/2026-09-10-mcp-minimal-analysis/`. Trabajo documental completo; Fase 0 y activación de Sentinel siguen sin ejecutar.

No hace falta clear. Para retomar, leer el informe final si ya existe y este checkpoint; no volver a cargar la revisión histórica completa salvo necesidad concreta.
