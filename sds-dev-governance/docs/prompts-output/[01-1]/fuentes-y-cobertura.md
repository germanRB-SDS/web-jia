# Fuentes y cobertura — [01-1]

Consulta: 2026-09-13. Las fuentes actuales describen producto; solo el tag de Codex fija
versión. No sustituyen cargar el binario ni probar integración. No se usaron MCP ni servicios.

## Evidencia local y rutas

E01: `evidence/baseline.json` y copia textual de `governance_tree.py` previa al cambio.
E02: `evidence/discovery.json`, observaciones saneadas de instalación/configuración.
Los symlinks y cadenas del binario identifican instalaciones Codex 0.154.0 y Claude 2.1.270
(INFERIDO); `--version` no se pudo ejecutar bajo protección adicional de solo lectura.
`sandbox-exec` devolvió 71, `sandbox_apply: Operation not permitted`; no se escaló.
No se confunde el CLI instalado con la versión del ejecutor de esta conversación.

KIT = raíz Git del repositorio de este informe, HEAD `79aa7ffce2563e0e3abc189b19054187daf1a43d`.
R = KIT y los temporales explícitos del runtime (`/private/tmp` y SESSION_TMPDIR, el directorio
temporal de sesión identificado en environment_context). El padre de KIT no es raíz autorizada.
`.git`, `.agents` y `.codex` de KIT figuran como solo lectura en el perfil gestionado real.
La sesión declara workspace-write, red restringida y approvals_reviewer=auto_review.
Sus ejecutores son exec_command/write_stdin y apply_patch; web es lectura externa del host.
No se han certificado sus capas con payloads. No hay supervisor independiente descubierto.
El LAB con P/X/Y y W_A/W_B/W_E NO está provisionado; `evidence/` es staging documental.

Se leyó configuración de usuario Codex, de su padre y de usuario Claude, seleccionando campos
sin copiar credenciales ni comandos. En Codex, trust de KIT y padre figura como trusted y
revisor auto_review; `hooks.state` es estado, no un evento PreToolUse. No hay settings nativos
en KIT. En Claude se observó una entrada allow de usuario y ausencia de sandbox declarado
en ese archivo; esto NO identifica configuración efectiva ni implica ausencia de otras capas.
Trust activo de Claude, políticas MDM/cloud, flags iniciales del CLI y exclusiones heredadas:
NO_VERIFICADO. No se inspeccionaron cuentas, credenciales, transcripciones ni servicios.

## Fuentes oficiales contrastadas

| ID | Fuente y constatación | Límite |
|---|---|---|
| O1 | [Esquema Codex rust-v0.154.0](https://raw.githubusercontent.com/openai/codex/rust-v0.154.0/codex-rs/core/config.schema.json): sandbox_mode=workspace-write, approval_policy=on-request, approvals_reviewer=user; SandboxWorkspaceWrite usa exclude_slash_tmp y exclude_tmpdir_env_var. | Compatibilidad estructural; carga del candidato pendiente. |
| O2 | [PreToolUse 0.154.0](https://raw.githubusercontent.com/openai/codex/rust-v0.154.0/codex-rs/hooks/src/events/pre_tool_use.rs): session_id, turn_id, tool_use_id y tool_input; denegación distinta de campos no soportados. | Parsear un esquema no prueba implementación de cada campo; el códec solo emite deny. |
| O3 | [Hooks Codex](https://developers.openai.com/codex/hooks): ask y campos de parada de Claude no funcionan en PreToolUse; PostToolUse continúa desde feedback. [Código PostToolUse fijado](https://raw.githubusercontent.com/openai/codex/rust-v0.154.0/codex-rs/hooks/src/events/post_tool_use.rs) devuelve feedback, no prueba fin del bucle. | El nombre de un test “stops” no demuestra parada del agente; se requiere observar el consumidor. |
| O4 | [Rules](https://developers.openai.com/codex/rules): reglas allow pueden conceder ejecución exterior; no son confinamiento de efectos. | No se genera ninguna regla allow ni aprobación automática. |
| O5 | [Configuración básica](https://learn.chatgpt.com/docs/config-file/config-basic): flags, capas de proyecto confiable, perfil, usuario, defaults cloud/sistema y defaults internos tienen precedencia; requirements impone restricciones aparte. [Código 0.154.0](https://raw.githubusercontent.com/openai/codex/rust-v0.154.0/codex-rs/core/src/config/mod.rs) distingue selección explícita de perfil y ajustes legacy. | No mezclar plantillas con permisos gestionados ni asumir que un archivo leído está cargado. |
| O6 | [Seguridad Codex](https://developers.openai.com/codex/security) y [referencia](https://developers.openai.com/codex/config-reference): sandbox y revisor son ejes distintos. | El revisor user no revisa por sí mismo operaciones ya permitidas dentro del sandbox. |
| C1 | [Sandbox Claude](https://code.claude.com/docs/en/sandboxing): permite exigir disponibilidad, desactivar reintento exterior y configurar exclusiones; se aplica a Bash/hijos. filesystem.disabled tiene restricciones de ámbito y no se establece desde settings de proyecto. | Una lista vacía local no retira exclusiones heredadas. No acredita control de Write/Edit ni protección interna. |
| C2 | [Hooks Claude](https://code.claude.com/docs/en/hooks): PreToolUse puede denegar; continue:false tiene semántica propia. ConfigChange puede impedir recarga de cambios, no deshacer el archivo alterado. | Timeout/fallo de hook no debe venderse como cierre seguro; no hay prueba viva de parada, muerte de hijos o reinicio. |
| C3 | [Settings Claude](https://code.claude.com/docs/en/settings): managed > CLI > proyecto-local > proyecto > usuario; listas se combinan. [Changelog](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) publica 2.1.270. | Defaults/variables concretas deben revisarse en la instalación; no se copiaron settings personales. |
| G1 | [Configuración Gemini](https://geminicli.com/docs/reference/configuration/): settings y sandbox dependen de sistema/versión y flags; no se obtiene equivalencia interactiva de una sesión headless. | Gemini no encontrado en PATH; ninguna versión/configuración probada. |
| G2 | [Políticas Gemini](https://geminicli.com/docs/reference/policy-engine/): distingue capas admin, usuario, workspace, extensiones y defaults; la tabla actual marca workspace deshabilitado. | No ofrecer un archivo de políticas de usuario como permiso local de proyecto. Revalidar versión futura. |
| G3 | [Hooks Gemini](https://geminicli.com/docs/hooks/reference/): BeforeTool acepta decision=deny y reason. | Traducción pura preparada, sin interfaz de consentimiento ni parada verificada. |
| G4 | [Seguridad de hooks Gemini](https://geminicli.com/docs/hooks/best-practices/): identidad por nombre/comando y aviso de hooks nuevos. | No acredita digest del cuerpo del script ni custodia frente al mismo usuario. |
| Git | [git-worktree](https://git-scm.com/docs/git-worktree): los worktrees tienen administración compartida. | No se crearon worktrees en el original; repositorio independiente futuro obligatorio. |

La lectura local de cadenas de esquema/función no confirma que una opción esté activa.
La ayuda local de CLI quedó pendiente para evitar efectos de arranque en HOME; la lectura
de ayuda del antecedente ya registraba un intento de crear aliases. No se usa ese antecedente
como prueba nueva. La tentativa actual de envoltura falló antes de lanzar el CLI.

## Matriz por canal

Cada celda expresa mecanismo candidato / estado de integración. Versiones: O1/E02 y C3/E02;
Gemini sin versión. DECLARADO es despliegue; NO_VERIFICADO es resultado de prueba pendiente.

| Canal/control | Codex | Claude | Gemini |
|---|---|---|---|
| Shell/perímetro | workspace-write, O1/O6; NO_VERIFICADO | Sandbox Bash requerido, C1; NO_VERIFICADO | Descubrir sandbox, G1; DECLARADO |
| Hijos/intérpretes | Confinamiento heredado por probar; ejecución externa legible LÍMITE | Igual límite; C1; NO_VERIFICADO | DECLARADO |
| Escritura nativa | apply_patch separado del proceso shell; comprobar O3 por versión; NO_VERIFICADO | Write/Edit y permisos propios; NO_VERIFICADO | write_file/replace, G1/G3; DECLARADO |
| Pérdida interna | Raíz escribible permite sobrescrituras: LÍMITE | Mismo límite con Bash auto permitido: LÍMITE | Sin implementación; LÍMITE |
| Sesión interactiva/entrada posterior | write_stdin puede actuar en proceso ya abierto; NO_VERIFICADO | No hay ensayo de entradas posteriores; NO_VERIFICADO | DECLARADO |
| Hooks/custodia | O2/O3, códec puro; sin hook instalado; NO_VERIFICADO | C2, códec puro; sin hook instalado; NO_VERIFICADO | G3/G4, códec puro; DECLARADO |
| Subagentes | Herencia real de control/contador no probada; NO_VERIFICADO | Igual; NO_VERIFICADO | DECLARADO |
| Conector local/servidor | Proceso servidor puede quedar fuera: NO_VERIFICADO | Igual: NO_VERIFICADO | DECLARADO |
| Consentimiento/persistencia/revocación | Mecanismo nativo; copia local ignorada, no probada; NO_VERIFICADO | settings.local.json con ámbito por comprobar; NO_VERIFICADO | No equivalencia global/local; DECLARADO |
| Reintentos/parada | Contador puro sin observador operativo, no parada nativa acreditada: LÍMITE | Contrato nativo documentado, sin integración observada: LÍMITE | Sin versión/supervisor: LÍMITE |
| Fallo/ausencia/corrupción/timeout | Solo fixtures futuras; NO_VERIFICADO | Solo fixtures futuras; NO_VERIFICADO | DECLARADO |

No hay control verificado del primer intento ni de la parada en ningún harness. La alternativa
concreta a la pérdida interna es custodiar originales como solo lectura y permitir cambios
en copias de trabajo con revisión por objeto; cambia el flujo ordinario y debe evaluarse como
compromiso. Lectura amplia + intérpretes permitidos no impide toda ejecución de código externo.
Las barreras de rutas y un códec de hooks no satisfacen por sí solos ese requisito.
