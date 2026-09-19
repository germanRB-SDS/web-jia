# Inicialización SDS de proyecto o hub

## PREFACE — NON-EXECUTABLE

Este prompt prepara archivos de gobernanza con el mismo motor que `init.sh`.
Corrige la copia recursiva, el opt-out incompleto y las escrituras sobre archivos
ajenos. Riesgo severo: confundir bootstrap con actualización o instalación global.
Execute from `## Status` onward. No sustituye las reglas portables del kit.

## Status

Entradas: nombre, destino, modo `project` o `hub`, opciones de instalación y,
sólo en un monorepo autorizado, `SDS_NESTED_MODULES=path|name|type|branch;...`.
Usar rutas reales descubiertas; no asumir un remoto, rama o identidad compartida.
Leer `GOVERNANCE.md`, `practices/INDEX.md`, las prácticas seleccionadas con sus
 dependencias y `skills/README.md`. `practices/15-contract-authority.md` sólo se
carga cuando su router lo exige. Guardar continuidad cuando corresponda en
`docs/prompts-output/<PROMPT_ID>/tmp/` y evidencia en el sibling `evidence/`.

## Inspección y plan

1. Resolver físicamente origen/destino. Identificar proyecto individual, monorepo,
   hub y repos/worktrees independientes; no descubrir módulos para escribir en ellos.
2. Confirmar que se usa una revisión del kit probada y autorizada. Si el kit ya
   existe en destino, sólo se acepta idéntico al origen, incluido su material local.
   Bootstrap nunca actualiza un kit antiguo, dirty, adelantado o incubado.
3. Obtener el plan con la revisión elegida:

```bash
# Sustituir NAME y TARGET por los valores del proyecto; preservar las comillas.
./init.sh "NAME" "TARGET" --mode project --files-only --dry-run
# Hub: ninguna instalación ni adapter anidado en repos hijos.
./init.sh "NAME" "TARGET" --mode hub --files-only --dry-run
```

El JSON declara destinos concretos, conflictos, revisión por huella y efectos.
No escribe en dry-run. Revisar el plan antes de aplicar. El propietario que ya
ha autorizado el alcance no tiene que repetir su aprobación rutinaria.

## Materialización equivalente

Ejecutar exactamente el comando revisado quitando `--dry-run`. No recrear a mano
el algoritmo mediante `cp -R`, `find`, sustituciones globales o una segunda lista
de archivos: la paridad se obtiene invocando el mismo motor de `init.sh`.
Si no están disponibles Bash/Python stdlib, informar el bloqueo; no improvisar.

- Copia completa del kit sin `.git`, `.DS_Store` ni `__pycache__`; no copia Git del
  origen ni sigue symlinks del kit. Conserva resources, scaffold, adapters y checker.
- Crea los archivos de `scaffold/`, los adapters Claude/Codex/Gemini/Cursor,
  `check-governance.sh`, `.gitignore`, `docs/governance/workspace-mode` y las tres
  políticas vacías con slug del proyecto. No altera políticas existentes.
- Sustituye `{{NOMBRE_PROYECTO}}` y `{{RUTA_LOCAL}}` sólo al renderizar archivos
  de esta invocación; nunca busca placeholders en el destino o los repos hijos.
- Archivos idénticos: no-op. Distintos: conserva original y propone `.sds-new`;
  si ese sibling existe y difiere, falla antes de escribir. Conflictos retornan 3
  y no disparan instalación de capacidades. No sobrescribe enlaces/directorios.
- El plan se valida antes de crear archivos, que se abren con exclusión y sin seguir
  enlaces en ningún padre. Si una carrera o interrupción deja un plan parcial,
  conservar el JSON y revisar los residuos. No borrar archivos preexistentes ni
  restaurar un árbol entero. Un kit parcial requiere reconciliación explícita.
- Los módulos son rutas relativas normalizadas, sin escapes, solapamientos ni
  fronteras Git independientes. Sólo project acepta módulos explícitos.
- Hub: las reglas y archivos del padre gobiernan su propio ámbito; cada hijo usa
  su raíz, adapters, memoria, credenciales, ramas, remotos y autoridad locales.
  Nunca propagar la gobernanza del hub implícitamente a los hijos.

## Capacidades y opt-out

Project conserva los defaults `SDS_INSTALL_SKILLS=1` y `SDS_INSTALL_PLUGINS=1`.
Para un bootstrap sólo de archivos usar `--files-only`, que prevalece sobre env.
Hub siempre es sólo archivos y rechaza flags explícitos de instalación.

- `--skip-skills` / `SDS_INSTALL_SKILLS=0`: omite todo `install-skills.sh`, también
  bundled-only y Graphify. `--skip-graphify` omite sólo `install-graphify.sh` dentro
  del catálogo de skills. `--skip-plugins` / `SDS_INSTALL_PLUGINS=0` omite plugins.
- Sin exclusión, el motor llama una vez a `scripts/install-skills.sh` y una vez a
  `scripts/install-plugins.sh`; un error de cualquiera se propaga, sin éxito falso.
- No repetir esas instalaciones después por seguir este prompt. No ejecutar pasos
  UI, Graphify o bridges extra por el hecho de que existan en el catálogo.
- `skills/r8-analyzer.md` y su bundle se conservan siempre como archivos del kit;
  su instalación global sólo ocurre si las skills están habilitadas.
- No copiar fuentes de skills desde el padre del kit. Sus instalaciones existentes
  divergentes se preservan para reconciliación; instalar no admite capacidades.
- El ledger `docs/governance/capability-registry.md` nace sin admisiones. El tracking
  local de plugins queda ignorado:

```gitignore
.sds/state/
```

OAuth, cambios de cuenta y despliegues requieren su ámbito propio. No abrir OAuth
ni afirmar conexión por un registro de plugin. Los helpers opcionales afectan
stores globales y adapters; leer la auditoría y el ledger antes de invocarlos.

## Verificación y Git

1. Revisar originales, propuestas `.sds-new`, permisos y el delta contra el plan.
2. Ejecutar `./check-governance.sh "TARGET"` desde la revisión materializada.
3. Comprobar conservación de repos hijos y cambios previos; el checker del hub
   omite la inspección de adapters hijos. Las demás reglas siguen aplicando.
4. Completar sólo memorias pertinentes, mapa de repos y ownership de constantes
   frontend cuando aplique. Recursos son lazy: empezar por su índice; se preservan
   `expandable-search-filter-panel`, `notification-toast-stack`,
   `procedural-horizon-hero`, `grounded-editorial-studio`, `grounded-studio-reference`
   y `mobile-sample-code/swiftui-paypal-donation-link`, sin integrarlos en productos.
5. Git es una fase separada: no ejecutar `git init`, renombrar ramas, cambiar remotos
   o `git add .` implícitamente. Definir exclusiones del hub antes de cualquier add;
   versionar sólo rutas del plan revisadas, sin gitlinks/custodia incidentales.
6. Registrar output, validación, conflictos, riesgos y recuperación. No afirmar
   instalación completa si hay conflictos, dependencias ausentes o comprobaciones fallidas.

El kit incluye el lector opcional `scripts/sds-text` y el informe de frescura
`scripts/governance-freshness.sh`. Al escribir prompts largos, usar códigos/dependencias y comandos
probados según `practices/modules/01-selective-text.md`. Su presencia no dispara consultas de red ni
actualiza la revisión activa durante init; usar nativo cuando una lectura completa corta sea suficiente.

El kit copia también el tooling MCP opcional (`mcp/README.md`). Init nunca configura
clientes globales, arranca proveedores ni admite capacidades; la instalación MCP
requiere su propio alcance autorizado.
