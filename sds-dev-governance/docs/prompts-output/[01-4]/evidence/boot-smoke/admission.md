# GOV-SAFETY — reapertura de smoke Tart acotado

2026-09-13. Owner: propietario del repositorio. Autoridad: continuación explícita de
RETOMAR-SENTINEL y su checkpoint. Scope: KIT + /private/tmp/sds-sentinel-tart-KoUNwE.
Revisión exacta de fuentes/intérprete/wrapper: revision.json; Tart2.37.0 hash en preflight.json,
igual al fijado en tart-run2. Imagen ya descargada por digest histórico; sin descarga nueva.

Modo admitido: Python identificado con `-I -B`, inserción explícita de la ruta KIT/sentinel en sys.path e
invocación `tart_host.main([root, "boot-smoke"])`, una invocación de
45s máximo de captura + cierre TERM/KILL22s + inspección. Sin comandos de invitado, shares,
clipboard/audio/TTY ni payloads. `inspect`/`get` bajo mismo supervisor y root: observación.
PS/lsof solo lectura para PID/PGID/helper/control socket propios. Contexto gestionado actual;
una denegación requiere ruta de aprobación de plataforma, nunca otro ejecutor ni señales
alternativas para conseguir el efecto denegado. `run` general sigue78.

| Gate | Evaluación |
|---|---|
| G1 | PASS_WITH_CONSTRAINTS: arrancar/detener solo VM sintética propia ya descargada; no acceso provider, publicación ni aprovisionamiento nuevo. |
| G2 | PASS_WITH_CONSTRAINTS: resultados raw retenidos; smoke es evaluación de vida, no aprobación de S0/S7. |
| G3 | PASS_WITH_CONSTRAINTS: escrituras solo estado/logs VM; ningún setting global, HOME, instalación, SUID/firewall. |
| G4 | PASS: mismo supervisor; helper sigue siendo sumidero propio, no Softnet comercial ni Sentinel B. |
| G5 | PASS_WITH_CONSTRAINTS: preflight rutas sin enlaces, UID y permisos, reserva10GiB. Env mínimo; Softnet.swift fija AF_UNIX sin NAT fallback, pipe evita SUID. Sin payloads ni datos reales. |
| G6 | PASS_WITH_CONSTRAINTS para smoke: supervisor señala flag en TERM/INT; cierre no abortado por señal durante finally. Tests14/14. Sink se cierra al perder padre o en180s aunque Foundation use otro PGID; comprobar ausencia real y VM stopped después, o FAIL. |

Revisión independiente detectó excepciones asíncronas y posible helper fuera PGID; corregidos
con flag y vida propia del sumidero. Tests sink3/3; falta prueba con Tart, objeto exacto del smoke.
SIGKILL del supervisor no es capturable; no se admite campaña desatendida ni se afirma rollback
tras ese evento. Un fallo de cierre conserva recibo y bloquea continuación.
ControlSocket.swift: Unix listener local bajo VM, proxy hacia puerto virtio invitado8080;
no listener IP; observar cierre. Archivo residual no equivale a listener activo.

Verification: V3 | tests-final2.log + tests-sink.log + preflight.json | PASS para tests,
NOT VERIFIED para Tart hasta recibos. Caminos: señales→capture→grupo; Tart→Foundation→sink;
VM→red/control socket→host. No reejecutar suites de evaluación/registry sin delta.

Primera invocación directa con -I falló antes de importar módulo local public_registry;
no lanzó procesos. Se corrige la entrada Python aislada, sin cambio de identidad/permisos.

Reapertura de contexto: intento restringido PID12629 abortó6 en Darwin.graphicsDevice → AppKit RegisterApplication; inspect confirmó stopped. PS fue denegado por plataforma. Solicitar exactamente el mismo smoke con revisión automática de escalación, sin ejecutor alternativo, datos invitados ni flags nuevos. G1/G5/G6 conservan restricciones; ejecución solo si plataforma aprueba. El fallo original permanece en crash-summary.json y recibos.
