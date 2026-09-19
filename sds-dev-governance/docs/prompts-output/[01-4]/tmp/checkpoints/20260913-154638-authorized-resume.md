# Sentinel — estado guardado y continuación autorizada

Timestamp: 2026-09-13T15:46:38.549442+00:00. Estado: PARCIAL, pausa solicitada para clear.
R/KIT: `/Users/hrms/MAC-DEV-PROJECTS/sds-dev-governance`. Branch `main`, HEAD `79aa7ffce2563e0e3abc189b19054187daf1a43d`.
Git y huellas: [20260913-154638-authorized-resume-state.json](20260913-154638-authorized-resume-state.json); inventario, no backup de contenido.
Worktree con cambios anteriores y propios sin commit; índice preservado. No reset/clean/stash,
no incorporar cambios ajenos a commits. `.git` de esta sesión es solo lectura.

## Instrucción vigente del propietario

Último mensaje literal:

> guarda estado y te autorizo, me preparas el meta mensaje para continuar después de que guardes (y yo haga clear).

Se conserva su autorización para **retomar y continuar automáticamente el trabajo de Sentinel**
ya encargado: completar laboratorio, implementación y comparación verificable. No pedir otra
confirmación genérica ni volver a pedir la autorización de discovery, ya aprobada y ejecutada.
Ahora solo guardar estado y entregar el met mensaje; continuar ejecución después de clear.

Esta autorización no aporta por sí misma un cliente seleccionado, una ruta de autenticación
dedicada ni una cifra de gasto. Son datos pendientes, no una autorización genérica pendiente.
Al reanudar, descubrir lo disponible sin secretos y resolver decisiones técnicas reversibles
con criterio. Preguntar solo un dato imprescindible que realmente falte, mientras se avanza
lo independiente. No inferir gasto ilimitado ni copiar credenciales personales a la VM/chat.
No habilita uso ordinario de Sentinel, otros proyectos, sudo/globales ni bypass de plataforma.

## Objetivo y significado de A/B

A = sin Sentinel, conservando controles nativos previos. B = candidato Sentinel.
Las revisiones v1/v2/v3 de sondas S0 NO son brazos A/B. Comparar mismo cliente/modelo/esfuerzo,
tareas/fixtures/contexto/entorno; congelar corpus, métricas, orden y presupuesto antes de medir.
Sobrecoste estricto `<8 %`: `100*(B-A)/A < 8` cuando A>0 y magnitudes comparables.
Separar tokens/coste/tiempo, construcción/operación/incidentes. Cero denominador = null.
A/B/A2/B2/restauración no ejecutados; no presentar tests ni barrera exterior como eficacia B.

## Hechos comprobados

1. Supervisor Tart corregido: recolección tras TERM/EPERM, grupo completo y señales INT/TERM
   que marcan estado sin interrumpir cleanup. Sumidero tiene PGID propio, caduca180s y cierra
   al perder padre. Ante SIGKILL del supervisor no se promete recuperación universal.
2. Tart2.37.0 e imagen pública ya descargados. Root host exclusivo:
   `/private/tmp/sds-sentinel-tart-KoUNwE`, VM `sentinel-lab`. No redescargar/prune/borrar por rutina.
3. Smokes de45s ejecutados mediante contexto de escalación aprobado por auto-review;
   arranque restringido previo falló SIGABRT/AppKit. No cambiar ejecutor para eludir denegación.
4. Discovery guest completado: macOS26.6.2/build25G83, uid501/admin y grupo80; esto no acredita
   root ni una identidad sin capacidad de elevar privilegios. PATH resuelve Python/Node/
   sandbox-exec; Codex/Claude no resuelven en ese PATH. No shares host enumerados; utunIPv6 y
   egress siguen sin demostrar. No se usó sudo ni se instalaron clientes.
5. `tart_host.command(exec-admin)` corrigió -- literal: Tart captureForPassthrough lo remitía
   como executable. Test dirigido nuevo PASS y discovery real exit0. El primer exit125 se guarda.
6. Sonda v1 falló antes de ejecutar sujeto: sh requiere variante bash. v2 permitió ambos y
   **FALLÓ**: Y/W denegados por ruta, pero FD9 heredado alteró canarioY. No borrar ese resultado.
7. v3 (`sentinel/s0_probe.sh`) añade Node spawnSync con stdin ignore, stdout/stderr pipe,
   env-i, timeout5s/maxBuffer64KiB y sin FD extras; luego aplica el mismo perfil Seatbelt.
   Node24.20.0 de la imagen: enlace/hash comprobados ANTES de ejecución; FD9 dev/ino igual a
   canario antes del lanzamiento. Cuatro positivos PASS; P/X0; Y/W1; FD9=1 BadFD; Y/W intactos.
   PASS **solo ese subconjunto de archivos y ese lanzamiento**, no S0 completo/S7.
8. El oráculo SÍ exige FD_STATUS no0: línea42 hace exit78 si0, Node propaga status y el padre
   exige subject_status0. Una nota menor del revisor fue corregida por lectura/hash del código.
9. Último cierre observado: VM stopped; Tart21099/sink21100/cliente21247 ausentes y listener
   control cerrado tras45,141s. Root guest v3 `/private/tmp/sds-sentinel-s0.zfvoHq` retenido.
   Este guardado no arranca ni vuelve a inspeccionar la VM; conserva esa evidencia previa.

## Fuente mínima para continuar

- [Informe vigente](../../guest-discovery-report.md).
- [Cierre](../../evidence/guest-discovery/closure.json), [resultado v3](../../evidence/guest-discovery/s0-v3-result.json)
  y [fallo v2](../../evidence/guest-discovery/s0-v2-failure.json).
- [Prerregistro y hash v3](../../evidence/guest-discovery/s0-probe-preregistration.json),
  [revisión](../../evidence/guest-discovery/s0-review.md), [admisión sondas](../../evidence/guest-discovery/s0-probe-admission.md).
- Ledger actual `docs/governance/capability-registry.md`: único estado efectivo de admisiones.
- Código: `sentinel/tart_host.py`, `net_sink.py`, `s0_probe.sh`, `lab.py`, `recovery.py`,
  `evaluation.py`; leer solo las superficies a modificar. `s0_probe.sh` es solo para invitado.
- Contrato/prompt: `sentinel/contract.md`, `runbook.md`, y
  `docs/prompts/[01-4-alpha]sentinel-implementacion-evaluacion.md` por secciones necesarias.

## Trabajo pendiente y siguiente paso exacto

S0: custodia adversarial, identidad efectiva, egress, señales/IPC, política/runtime,
procesos/FD previos y revocación. Después backend real/cliente/B, snapshots/rollback,
A/B/A2/B2 y campaña completa con métricas preregistradas. `lab.integration` y `run` general
siguen78; no quitarlos como atajo. No hay B operativo ni autorización para integración ordinaria.

Al retomar: verificar estado/hashes y ledger; seguir validación S0 y preparación del cliente
mediante modos concretos revisados, dentro del laboratorio. No repetir smokes/tests sin delta
ni reinsistir en permiso genérico. Para sesiones completas faltan elección/ruta de autenticación
exclusiva/tope total de gasto; localizar datos no secretos disponibles antes de preguntar.
Avanzar código/pruebas independientes de esos datos. Modelo/sesiones de pago solo con lo necesario
concretado. Mantener host real protegido aunque las barreras candidatas fallen.

No rechazo actual de auto-review pendiente: el anterior de discovery fue resuelto por owner;
las sondas posteriores recibieron aprobación de plataforma. Ante nuevo rechazo, registrarlo y
seguir la ruta prevista; no usar otro shell/MCP/API para conseguir el efecto denegado.
No MCP utilizado; Hostinger mantiene su bloqueo y necesita identidad/admisión exactas antes de uso.
Subagentes solo para revisión independiente exigida por prompt, no por defecto.

## Verificación y límites del guardado

Pruebas anteriores:14 lifecycle +3 sink; nueva regresión argv1 PASS; smokes/discovery y sondas
reales conservados. Reuso por funciones sin delta; no se afirmó una nueva suite15/15 completa.
Guardado documental: V0, huella v3 coincide y vínculos/JSON se validan; sin nuevas pruebas runtime.
No cambios en código, metadatos Git, settings o capacidades durante este guardado. No procesos
nuevos persistentes. Estado guardado en archivos locales, no commit ni backup de todo el repo.
