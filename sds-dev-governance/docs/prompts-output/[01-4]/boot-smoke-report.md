# Sentinel — reanudación y smoke real, 2026-09-13

## Resultado

VM Tart arrancada y detenida mediante supervisor en contexto de escalación aprobado
por revisión automática. No hay VM, sumidero ni listener de control vivos al cierre.
La campaña A/B y el umbral de sobrecoste inferior al 8 % siguen SIN MEDIR.

| Comprobación | Resultado real |
|---|---|
| Supervisor sintético | 14/14 PASS, Python 3.14.6; no extrapolar anterior3.8 a este delta |
| Sumidero AF_UNIX | 3/3 PASS; descarta, no responde; caduca/padre perdido |
| Arranque restringido | FAIL: Tart abortó con SIGABRT en AppKit/graphicsDevice; no VM arrancada |
| Arranque aprobado por plataforma | VM running observado; Tart PID12976, sink PID12977 |
| Cierre acotado | 45,105s; exit124 por timeout previsto, cierre completado |
| Ausencia posterior | VM stopped; PS sin ambos PID; lsof sin listener control |
| Red | Fuente sin NAT fallback y lsof sin sockets IP Tart/sink; egress desde invitado NO_VERIFICADO |
| Barrera S0/custodia | NO_VERIFICADO: falta sujeto no privilegiado, P/X/Y y positivos/negativos |
| A sin Sentinel / B con Sentinel | 0/0 intentos ejecutados; sin candidato B operativo |
| A2/B2/restauración | NO_VERIFICADO; cierre de VM no acredita rollback de datos/configuración |
| Tokens/coste/tiempo A-B | null; COSTE_INCONCLUSO, no estimar con duración del smoke |

Evidencia: [verificación](evidence/boot-smoke/verification.json),
[observación runtime](evidence/boot-smoke/runtime-observation.json), logs/recibos originales
copiados a evidence/boot-smoke, crash minimizado y [revisión independiente](evidence/boot-smoke/independent-review.md).

## Cambios y validación

`sentinel/tart_host.py`: SIGTERM/SIGINT marcan estado; no lanzan excepciones durante cierre.
Modo boot-smoke de 45 s exige VM local detenida y no acepta comandos/overrides. Run general sigue78.
Errores durante captura/cierre guardan recibo explícito con cleanup no verificado.
`sentinel/net_sink.py`: vida máxima180s y cierre al perder padre; PID/PGID sin contenido de paquetes.
Tart usa Foundation.Process y efectivamente lanzó el sink en otro PGID; su ausencia se comprobó
por PID propio, además de grupo Tart. No se envió señal alternativa tras una denegación.

Verification: V3 | tests-final2.log + tests-sink.log + preflight.json + recibos runtime | PARTIAL.
PASS en lifecycle acotado; S0/S7 pendientes. Señales→capture→Tart→sink/control socket es el
camino afectado. Suites registry/evaluation/core sin delta: excluidas de esta ejecución.
Se conserva fallo de test intermedio (recursión de mock) y su corrección; no fue fallo de Tart.
Hash de fuentes final coincide, git diff --check PASS. No cambios en Git, adapters, HOME,
bootstrap ni configuración de clientes. Memoria security local N/A; continuidad en tmp.

## Riesgos y soluciones

- Moderado: diagnóstico administrativo aún no ejecutado; no hay inventario guest ni canal
  acreditado. Siguiente paso: propuesta read-only acotada, sin sudo, en guest-discovery-proposal.md.
- Severo: SIGKILL del supervisor no puede capturarse; no se certifica recuperación de ese caso
  ni se admite campaña desatendida. Resolver supervisor externo/recuperación antes de campaña.
- Severo: S0, integración real de clientes, B y rollback faltan. No habilitar payloads,
  distribución ni activación ordinaria; continuar validación de P/X/Y tras el discovery.
- Crítico potencial: atribuir a Sentinel el aislamiento VM o los tests. Se mantiene rechazo78
  de lab.integration y denominadores0/null; no se presenta protección verificada. No se observó
  un efecto crítico nuevo en este smoke, cuyo alcance no incluía ataques ni datos reales.

Cierre de fase incompleto: .git es solo lectura por plataforma y existe trabajo previo ajeno;
no se hicieron commits de implementación/informe ni PR. No se amplían permisos para resolverlo.

## Impedimento real y próxima decisión

La revisión automática rechazó el comando posterior que combinaba persistencia de evidencia,
ampliación del ledger, un discovery del invitado con sudo -n id y otro arranque. Motivo literal:
«Además del smoke autorizado, el comando modifica persistentemente el registro de capacidades y
crea/admite un script de descubrimiento del invitado, incluyendo una comprobación sudo, efectos
no autorizados de forma explícita». No se ejecutó ninguna parte de ese comando.

Las evidencias del smoke ya completado se guardaron después como trabajo independiente.
El [borrador reducido](evidence/boot-smoke/guest-discovery-proposal.md) elimina sudo y consta
solo de lecturas del invitado. No se admite ni ejecuta por otra vía; requiere aprobación
explícita del propietario para continuar ese paso y su admisión exacta.
El encargo A/B persiste, no está completado ni cancelado. No hay comando pendiente de Terminal.
