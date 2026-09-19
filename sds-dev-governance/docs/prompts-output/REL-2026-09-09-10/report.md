# REL-2026-09-09-10 — Reparación de bootstrap y clasificación

2026-09-09. Implementación autorizada por el propietario; v1.25.2. Base cdf80a7 (v1.25.0),
checkpoint previo 8c1ba0f, implementación verde 4517e9b, worktree aislado. PATH-00 ya estaba cerrado en el hub (067668c).
Veredicto: la inicialización files-only de proyecto/hub supera los gates de preservación.
La instalación real del hub queda para después de publicar y verificar esta revisión.

## Problema, decisión y alcance

El init original recorría el destino para sustituir placeholders, copiaba metadatos Git y ejecutaba
bundled skills incluso con exclusiones. El clasificador podía devolver éxito con solicitudes
inválidas y sugerir SAFE_UPGRADE sin conocer el árbol original. Son defectos reproducidos en la
base; actualizar simplemente a la incubación v1.25.1 no los arreglaba. Baseline-reproduction.json
conserva retornos, sentinelas y comandos; su script reconstruye la base desde Git.

Se eligió un wrapper Bash pequeño y un motor Python stdlib que construye el plan completo antes de
escribir. Python ya era una dependencia del clasificador/checker; repetir walkers recursivos en
Bash y en un prompt conservaría dos algoritmos difíciles de comparar. El metaprompt invoca el
mismo motor, con inspección previa. Esto prueba paridad de comandos, no el comportamiento de todos
los LLM posibles. El modo proyecto conserva los defaults de catálogo; el hub fuerza files-only.
Bootstrap y actualización/reconciliación son contratos separados: un kit divergente se rechaza.

## Auditoría de pasos y efectos

Se leyeron completamente init y metaprompt originales y sustitutos; helpers transitivos, checker,
adapters y superficies ejecutables/scaffold se inspeccionaron por frontera. El manifiesto de
fuentes fija hashes de las superficies revisadas. Esta tabla conserva cada grupo de pasos y su
recuperación; ningún helper opcional se instaló realmente durante la auditoría.

| Paso/superficie | Entradas, destino y ejecución | Existentes, red, Git y recuperación |
|---|---|---|
| CLI/env | NAME, TARGET, mode/flags, módulos explícitos; Bash → Python | Rechaza vacío, combinaciones inválidas y fuente incompleta; 2 error, 3 conflicto, 0 correcto. Python ausente no da éxito. |
| Raíces/kit | Raíz física, snapshot de archivos; ignora `.git` directorio/puntero y cachés declaradas | Sin autocopia; igual no-op, divergente se conserva y bloquea. Sin enlaces en kit. Snapshot por descriptores no-follow; no lectura recursiva del destino. |
| Scaffold | Templates docs y PR/MR ocultos, adapter raíz de cuatro agentes, checker, ignores y políticas vacías | Crea exclusivamente rutas del plan. No sustituye owner ni firma humana. Previos idénticos intactos; conflictos `.sds-new`; propuesta previa divergente bloquea antes de escribir. |
| Render | Placeholders de nombre/raíz y módulos en bytes nuevos | No busca ni altera docs, custodia o código preexistente. Modes de nuevos archivos normalizados, no chmod de existentes. |
| Módulos | Solo rutas normalizadas y explícitas en project | Rechaza escapes, solapamientos, enlaces y fronteras Git. Hub nunca crea adapters de hijos. Rutas de los cuatro adapters anidados corregidas por profundidad. |
| Escritura | Directorios/archivos bajo root fd; creación exclusiva, no-follow, fsync | Carreras de creación no sobrescriben. Interrupción puede dejar plan parcial: conservar JSON/residuos, reconciliar sin borrar/restaurar árbol. No transacción global ni protección contra un actor hostil que renombre árboles abiertos. |
| Skills/bundled | Un install-skills si habilitado; catálogo/runtime y homes explícitos | files-only/skip-skills no lo invoca. Bundled/ported: snapshot y copia exclusiva, divergencia conservada. Sin rsync --delete. |
| Impeccable/skillui | npx en destino; npm global o prefijo usuario | Opcional con red, runtime nvm descubierto. Revisiones reales/admisión deben evaluarse antes de uso. No ejercitado contra servicio real. |
| gstack/Three.js | Git externo, revisiones de catálogo, Bun y setup; stores usuario y enlaces | Opcional; temporales propios se limpian. gstack existente no certifica por sí solo revisión exacta; Bun mueve supply chain. Three.js conserva destinos previos; su provenance requiere revisión. |
| Graphify | uv/pipx/pip/venv, bin usuario, adapters proyecto | Opcional transitivo, omitido al saltar skills/Graphify. Puede actualizar paquete, reemplazar enlace bin y chmod rutas; no es files-only ni una actualización inocua. No invocado. |
| Plugins | CLI Claude; lectura/registro MCP Codex; tracking local `.sds/state` | Opcional con red/config usuario. OAuth diferido; endpoint divergente preservado. Escritura TOML append/tracking no tiene CAS fuerte; no ejecutar sobre configuración concurrente sin evaluación específica. |
| sync/index/status | Bridge --apply explícito, índice derivado, lectura tracking | sync report-only por defecto; apply crea enlaces/inventario. Generador escribe solo sin --check. No ejecución implícita del bridge al bootstrap. Checker solo --check/--check-policy. |
| Checker | Raíz explícita, estructura, portabilidad, routers, gates y suites temporales | Tmp privado, limpieza limitada a ese tmp. grep no sigue dirs enlazados. Hub omite solo adapters hijos; no inspecciona productos para certificarlos. No Git/admisión/instalación real. |
| Git guardrails | install hook local, gh-safe, safe-push, apply remoto separado | Bootstrap no los ejecuta. Hook reconoce kit canónico, proyecto y hub, preserva hook personalizado. Bash 3.2 sin expansión de mayúsculas de Bash 4. Publish solo ref exacto sin force; ninguna protección se modifica. |
| Metaprompt/Git final | Inspección → dry-run → mismo comando sin dry-run → validación → docs/Git acotados | No clonado implícito, sustitución global, instalador repetido, git init/add, cambio de rama/remoto, OAuth ni despliegue. Recuperación por archivo. |
| Clasificador | Roots/paths/stdin/original-baseline, inventario y Git read-only | Valida solicitud antes de filas, acepta cero descubrimientos; huella completa para comparar, prefijo solo visual. Symlinks por texto, tipos/mode incluidos, controles de transporte rechazados. No modifica nada. |

## Incubación y sincronización

Promovidos los cinco archivos del ejemplo SwiftUI PayPal y su índice desde Upnews v1.25.1,
con procedencia conservada. El test intercepta la URL mediante `.handled`: no abre navegador.
El changelog de la incubación atribuía arreglos de split/.git que ya existían en cdf80a7; se
aclara su historia y se conservan las pruebas. Ninguna copia downstream se actualizó en esta fase.

Owner/consumidores: Practice 11 controla preservación y distribución; 13 delimita el hub;
RULE-COVERAGE enlaza motor, adapters y checker. README, VERSION, changelog, skills bootstrap y
metaprompt sincronizados. Scaffold documental/ledger/PR se conserva: no requiere nuevas decisiones
ni firma. Kernel y router INDEX quedan iguales. Graphify N/A: no aporta autoridad ni es necesario
para esta frontera determinista. El change log lista cada archivo materializado.

## Verificación reproducible y límites

V3 por riesgo de sobrescritura/efectos globales, solo fixtures temporales. Python 3.14.6,
Bash 3.2.57 y 5.3.9, Git 2.50.1 Apple-155. Ejecutar desde el kit:

```bash
python3 tests/test-bootstrap-safety.py /bin/bash
python3 tests/test-bootstrap-safety.py /opt/homebrew/bin/bash
python3 tests/test-copy-safety.py /bin/bash
python3 tests/test-copy-safety.py /opt/homebrew/bin/bash
python3 docs/prompts-output/REL-2026-09-09-10/evidence/verify-release.py
```

12 grupos adversariales por shell y seis de clasificación por shell PASS. Incluyen nombres Unicode,
espacios, rutas físicas/. /../barra final, enlaces, permisos, dependencia ausente, docs dirty,
.sds-new, kit diferente/idéntico/autocopia, no-Git/Git hubs, child/worktree/custodia con sentinelas,
índice intacto, módulos y rutas reales, fallos de instalador e interrupción. Los dobles de comandos
fallan ante red/instalación files-only; defaults opcionales se prueban con catálogos dry-run y suites
existentes con stores temporales. No se modifica HOME.

Acceptance.json: cuatro suites heredadas y checker completo project/hub, ambos shells con PATH
que fija también el Bash de hijos, 12/12 PASS. Tras retirar la dependencia rsync ya obsoleta,
skills-final.log vuelve a verificar esa única superficie modificada. Swift-resource-verified.log:
tres tests PASS, scratch/module cache temporales, sin browser. Los fallos iniciales de permisos de
caché/sandbox fueron ambientales; no se cuentan como tests verdes. No se ejecutaron builds de apps,
BD, OAuth ni servicios reales. Una prueba adicional de rutas detectó un comando con argumentos en
el parser de la aserción; se corrigió la prueba para comprobar el path, no el comando entero.

## Aseguramiento y riesgos

Revisión del diff y dependencias stdlib/CLI instaladas; pruebas atacan los defectos reproducidos,
no solo el camino feliz. Contratos y rutas se validan antes de escribir; no hay secretos ni cargas
a servicios en el modo instalado. El catálogo de herramientas no constituye admisión. No se ha
inventado una firma del responsable humano ni una revisión externa/PR; la publicación directa está
expresamente autorizada por el propietario y las protecciones se consultan antes del push.

- **Crítico, corregido:** mutación accidental de repositorios hijos/archivos previos. Frontera de
  plan + pruebas de hashes/índices; no quedan hallazgos críticos abiertos en files-only.
- **Severo, corregido:** falso éxito/opt-out incompleto y falsa recomendación de upgrade. Retornos
  propagados, cero helpers en files-only, original-baseline exacto para SAFE_UPGRADE.
- **Severo, condicional abierto:** instalación global opcional puede alterar stores/adapters y
  supply chain móvil; ciertos helpers no protegen concurrent writers. No se activa en hub. Su uso
  real exige evaluación de revisión, destino y concurrencia; mejorar esos instaladores es backlog
  separado, no condición para la ruta que no los invoca.
- **Moderado:** interrupción deja archivos nuevos parciales. Plan y residuos explícitos; no rollback
  destructivo ni promesa transaccional. Mantener fuente/target estables durante la ejecución.
- **Moderado:** clasificador antiguo sin baseline original exige revisión manual; deliberadamente
  conservador. Las huellas v2 no son comparables con hashes v1 históricos; evidencia conserva ambos.
- **Moderado:** un bootstrap sin recursos Python no funciona; falla claramente y antes de escribir.
  Windows fuera de matriz; las primitivas POSIX se verificaron en macOS, Linux queda por comprobar.

Recuperación: mantener el kit anterior y el plan; forward-fix o revert revisado de commits propios,
no reset/restore recursivo. Los productos, copias incubadas y reportes históricos se conservan.

## Evaluación de capacidades para publicación

G1 PASS_WITH_CONSTRAINTS: propietario autoriza publicar gobernanza; solo origin del canónico,
main/tag exactos probados. G2 PASS: evidencia versionada, sin atribución/firma humana inventada.
G3 PASS_WITH_CONSTRAINTS: hook local propio, no reemplazar hooks existentes; sin stores globales.
G4 PASS: wrappers canónicos únicos. G5 PASS_WITH_CONSTRAINTS: Git/gh instalados, wrappers auditados
con hashes en manifiesto; GET REST, credencial existente sin mostrarla, payload de push solo kit.
G6 PASS_WITH_CONSTRAINTS: refs persistentes recuperables por revisión futura, sin borrados; wrapper
no impide leer la gobernanza. Estado exacto en docs/governance/capability-registry.md, no en catálogo.

Hook layouts: canonical/project/hub PASS; custom hooksPath conservado. Hook local del canónico
instalado con hooksPath=hooks (antes sin valor); no otros clones/configuraciones alterados.
Reglas remotas observadas: deletion + non_fast_forward activas en main; sin cambios de protección.
