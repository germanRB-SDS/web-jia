# Arquitectura y compatibilidad 01-4

Decisión: conservar controles A y no activar B. Desarrollar evaluación determinista fuera del
camino de operaciones; cero hooks instalados, cero referencias añadidas a adapters. La ausencia
de laboratorio independiente impide comparar efectos, no obliga a inventar un nuevo lanzador.

## Selección por requisito

| Requisito | Nativo existente / brecha | Candidato | Evidencia, coste, custodia y reversión | Decisión |
|---|---|---|---|---|
| Escrituras fuera de R | Sesión declara workspace-write con KIT/temporales; efectividad por canal no ensayada | Conservar control nativo | Sin coste incremental de control por esta entrega; supervisión/coste total desconocidos | Conservar A, no certificar |
| Pérdidas internas | Un ámbito escribible permite pérdida; Git no cubre todos los activos | Restricción por activo + recuperación custodiada | Requiere identificación de activos, escritor exclusivo y preimágenes. Decisor puro no restaura | Pendiente |
| Elusión por hijos/FD/stdin | Hook no cubre todos los canales ni procesos ya abiertos | Barrera SO/contexto exterior por brecha demostrada | Seatbelt tuvo denegación histórica; no se atribuye causa ni se repite vía alternativa | No backend aquí |
| Fallos de hooks | Start/timeout/salida inválida pueden fallar abiertos según cliente | Hook solo si otra barrera hace imposible el efecto | Códec no es hook cargado; 0 llamadas LLM del helper no acredita coste de sesión | No instalar |
| Custodia/autoautorización | KIT escribible; sin separación demostrada sujeto/supervisor | Identidad/VM con permisos independientes | Evidencias locales editables no son custodia; actualizaciones/revocación bajo supervisor | Pendiente S5 |
| Delegación local/remota | Sandbox del cliente no confina receptor remoto | Receptor sintético admitido/confinado o canal impedido | Sin MCP usado ni nuevas admisiones; no se usan credenciales reales | NO_VERIFICADO |
| Mensajes y análisis | Booleanos/2–3 histórico podían inducir garantía excesiva | Helpers corregidos + analizador de plan y JSONL | Pruebas puras y revisión; sin activación/desactivación operativa que revertir | Adoptar solo desarrollo |
| Distribución opcional/plugin | Empaquetado no crea aislamiento | Ninguno | Ningún cambio bootstrap/distribución/ledger; el archivo fuente anterior ya estaba en KIT | No integrar sin S7 |

## Compatibilidad final

Fuente de entorno: [runtime.json](evidence/runtime.json). Fuentes efectivas fusionadas,
trust resuelto, estado mínimo de arranque y observador de efectos siguen sin acreditarse.

| Combinación | Canal / identidad y configuración observada | Control | Estado y límite |
|---|---|---|---|
| Codex sesión gestionada / macOS 26.6.2 arm64 | exec/apply_patch/subagentes de construcción; build del ejecutor desconocido; política del contexto | workspace-write/auto_review declarados, no Sentinel | NO_VERIFICADO para protección; esta construcción no es ensayo adversarial |
| Codex CLI 0.154.0 / mismo SO / interactivo | Versión instalada; config usuario gpt-6-astra/high, trust KIT; no proyecto config | Nativo, carga efectiva no probada | NO_VERIFICADO; no inicio/reinicio en laboratorio |
| Codex CLI 0.154.0 / mismo SO / headless | Shell/hijos/apply_patch/stdin/subagentes/MCP requieren filas de efectos | Plantilla no cargada | NO_VERIFICADO; no se infiere desde CLI --version |
| Claude Code 2.1.270 / mismo SO / interactivo | Config usuario seleccionada; modelo configurado no identifica sesión de prueba | Sandbox no declarado en archivo consultado | NO_VERIFICADO; sin /status,/permissions,/sandbox efectivos |
| Claude Code 2.1.270 / mismo SO / headless | Bash/hijos y Write/Edit separados; flags/exclusiones por comprobar | Plantilla no cargada | NO_VERIFICADO; hook no basta ante fallo de arranque |
| Gemini / macOS / interactivo | No localizado en PATH | Ninguno observado | NO_DISPONIBLE por búsqueda; compatibilidad NO_VERIFICADA |
| Gemini / macOS / headless | Sin versión/esquema runtime ni ensayo | Ninguno observado | NO_VERIFICADO; no se instala para llenar matriz |
| App / IDE / SDK / remoto / otros SO | Sin ejecutor identificado ni campaña | No acreditado | NO_VERIFICADO; CLI instalado no acredita estas interfaces |

No hay fila INCOMPATIBLE de cliente: no se ejecutó una prueba de incompatibilidad. No hay fila
de modo protegido. Raíz/subcarpeta/reinicio/reanudación/otra raíz sintética quedan pendientes
para cada combinación, al igual que todos los canales accesibles que puedan invalidar la garantía.

## Amenazas y activos

Errores de ruta/limpieza/reemplazo, elusión inducida por contenido no confiable y procesos
delegados. Propietario autorizado mantiene política por ruta trazable; no es adversario.
R real=KIT actual para esta tarea; temporales autorizados por plataforma no amplían el
objetivo de protección. No se confunde cwd o prefijo textual con autoridad.

Datos exteriores y previos dentro de R, tracked/untracked/ignored, configuración/credenciales,
buffers del editor y evidencia tienen necesidades distintas. No se abre ni copia ningún secreto
para probar. Snapshot de disco no recupera buffers sin guardar. `baseline.json` guarda hashes,
modos e inventario de 443 archivos; no contenidos recuperables, ACL/xattrs ni un A inmutable completo.
No se presenta como backup. La campaña futura deberá capturar su A efectivo antes de mutaciones.

TCB futura: kernel/SO, ejecutor exacto y sus padres, configuración/política, intérprete,
dependencias/PATH/env, supervisor y E, receptores. Fuente actual modificable por desarrollador;
no es control efectivo custodiado. Para cada componente, el supervisor exterior debe fijar
owner y revisión, actualizar solo con recibos/preimágenes y revocar sesiones/FD al cambiar
política. Aquí no hay implementación acreditada de esa custodia ni actualización/revocación.

## Fuentes, revisadas 2026-09-13

DOCUMENTADO, no OBSERVADO en integración. Se buscó fuente/esquema local de Codex bajo el destino
resuelto de su instalación; no se encontraron .rs/.md/schema en esa búsqueda, se consultó oficial.

- [Codex hooks](https://developers.openai.com/codex/hooks/): stdin posterior no dispara de nuevo
  PreToolUse y existen vías especiales fuera del hook. Build objetivo requiere prueba local.
- [Claude sandbox](https://code.claude.com/docs/en/sandboxing): Bash e hijos; herramientas de
  archivo nativas usan controles distintos. No acredita confinamiento de receptores externos.
- [Claude hooks](https://code.claude.com/docs/en/hooks): fallos de arranque y ciertas salidas
  inválidas pueden continuar; el tipo/evento/versionado importan. No inferir fallo cerrado universal.
- [Gemini hooks](https://geminicli.com/docs/hooks/): referencia consultada; no versión local
  encontrada. No se afirma protocolo o manejo de fallo ejecutado aquí.

HIPÓTESIS: configuración nativa suficiente para algún subconjunto. La resuelve un control
positivo y observación por canal en A. NO_VERIFICADO: beneficio de B, costes operativos,
pruebas de custodia/rollback y cobertura de todos los activos. El material histórico no localizado
en 01-3 no se usa para fundamentar umbrales ni eficacia.
