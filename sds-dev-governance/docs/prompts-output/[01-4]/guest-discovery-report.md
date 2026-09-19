# Sentinel — discovery autorizado y primeras sondas reales

> Continuación posterior: [S0 superficies y análisis del8 %](s0-surfaces-report.md).
> Este informe conserva los ensayos v1/v2/v3 y sus límites.

2026-09-13, LEVEL3 security; continuidad de01-4. El propietario autorizó explícitamente el
discovery de lectura sin sudo. Se completó y se continuó el laboratorio con sondas sintéticas
revisadas y aprobadas por la plataforma. Ninguna instalación, credencial o dato real empleado.

## Resultado

**Discovery completado y subconjunto de controles de archivos v3 comprobado. S0 completo,
Sentinel B, A/B/A2/B2 y sobrecoste inferior al 8 % siguen NO_VERIFICADOS/SIN MEDIR.**
VM detenida al final; Tart21099, sink21100 y cliente21247 ausentes; listener control ausente.

| Ensayo real | Resultado |
|---|---|
| Discovery inicial | exit125 sin salida; supervisor añadía -- literal al comando Tart |
| Discovery corregido | exit0, macOS26.6.2 build25G83; UID501 admin, grupo80 |
| Herramientas | PATH resuelve Python/Node/sandbox-exec; no resuelve Codex/Claude |
| Mounts/red | Sin shares host en mount table; IPv6 utun con rutas por defecto, sin prueba de egress |
| Sonda v1 | FAIL: perfil permitía sh pero macOS necesitó bash; sujeto no arrancó |
| Sonda v2 | FAIL real: P/X permiten, Y/W por ruta bloqueados, FD9 heredado altera canarioY |
| Sonda v3 | PASS acotado: cuatro positivos, P/X permiten, Y/W bloqueados, FD9 cerrado y canarios intactos |
| Cierre v3 | VM stopped, procesos/listener propios ausentes;45,141s |

No son brazos A/B: son revisiones exploratorias de la barrera exterior del laboratorio.
Los fallos permanecen; v3 no demuestra revocación de FD por Seatbelt. Node spawnSync excluye
el descriptor antes de iniciar sujeto, y Seatbelt restringe las escrituras por ruta.
Ninguna duración de estas invocaciones es latencia normal ni sobrecoste de Sentinel.

## Código, evidencia y verificación

- `sentinel/tart_host.py`: corregido argv exec-admin, conserva argumentos del invitado sin
  insertar executable --. Test directo nuevo PASS y discovery real corregido exit0.
- `sentinel/s0_probe.sh`: setup de nuevo root sintético guest, positivos, perfil candidato,
  lanzador con hash/env/FD/stdout acotados y oráculo administrativo. Solo modo invitado admitido;
  no instalador ni backend general de lab.integration, que sigue78.
- `tests/test-sentinel-tart-host.py`: regresión de argv, sin ejecutar VM desde el unit test.
- Ledger/evidencia: autorización resuelta, revisiones/modos exactos y resultados originales.

[Datos discovery](evidence/guest-discovery/summary.json), [fallo v2](evidence/guest-discovery/s0-v2-failure.json),
[resultado v3](evidence/guest-discovery/s0-v3-result.json), [prerregistro](evidence/guest-discovery/s0-probe-preregistration.json),
[revisión independiente](evidence/guest-discovery/s0-review.md), [cierre](evidence/guest-discovery/closure.json).

Verification: V3 | unit dirigido argv + discovery + sondas reales v1/v2/v3 + cierre | PARTIAL.
Camino: argv→Tart/virtio→shell guest→Node/FD→Seatbelt→archivos→oráculo→cierre VM.
Reuso de14 tests lifecycle y3 sink anteriores: comportamiento de esas funciones sin delta;
no se presenta suite15/15 como reejecutada. AST, sh parse, JSON, hashes y git diff --check PASS.
La consulta documental de ArgumentParser main apoya la causa del separador; Tart exacto2.37.0
usa captureForPassthrough y pasa command[0] al invitado. La documentación de main no se presenta
como lectura de1.6.1: esa descarga no estuvo disponible. La ejecución corregida confirmó salida.
Fuente: https://raw.githubusercontent.com/apple/swift-argument-parser/main/Sources/ArgumentParser/Parsable%20Properties/Argument.swift

## Riesgos y decisiones

- Crítico potencial: descriptores previos eluden el perfil de archivos; **observado solo en
  canario sintético v2**. Solución acotada verificada: excluir FD al crear el sujeto. Revocación
  durante una sesión, otros FD/IPC y procesos preexistentes siguen pendientes. No certificar
  Seatbelt solo para la garantía de revocación.
- Severo: sujeto usa la cuenta admin; su capacidad de elevación y la custodia adversarial no están probadas; tampoco egress,
  señales contra supervisor, política/interprete/dependencias ni canales reales de clientes.
  Mantener S0/S7 cerrados y evaluar esas superficies antes del corpus.
- Severo: no cliente/modelo integrado, snapshot/rollback A/B ni autenticación de laboratorio.
  No copiar credenciales personales; definir cliente, ruta de autenticación y tope de gasto.
- Moderado: oráculo textual de valores fijos, sin integridad binaria/metadatos/topología general;
  ampliar cuando se implemente restauración. Node24.20.0 y su ejecutable están identificados;
  dependencias de la imagen pública no tienen attestation individual de producción.
- No se observó daño crítico a datos reales: todos los targets creados fueron sintéticos dentro
  de la VM. Eso no elimina el fallo de garantía de v2.

## Continuación y estado

Autorización de discovery ya resuelta: **no volver a pedirla**. No hay rechazo de auto-review
pendiente para las acciones de esta sesión, todas admitidas/aprobadas en sus modos concretos.
Queda pendiente respuesta a la consulta de cliente/autenticación exclusiva/tope de gasto para
sesiones completas. Es información imprescindible antes de sesiones de pago; no enviar secretos.
Trabajo independiente siguiente: ampliar S0/custodia/egress, runner con clientes reales,
snapshots y rollback, y congelar piloto A/B antes de medir. No confundir v1/v2/v3 de sonda con A/B.

Fuentes/evidencias guardadas; índice Git preservado. No commits ni PR: .git solo lectura y
cierre de fase/S0 incompleto. Sin cambios en settings, adapters, bootstrap, HOME o consumidores.


## Guardado antes de clear — 2026-09-13T15:46:38.549442+00:00

El propietario pide guardar estado y autoriza continuar. Esta autorización persiste tras clear;
no repetir confirmación genérica ni permiso de discovery. No concreta cliente, autenticación o
importe de gasto. [Checkpoint vigente](tmp/checkpoints/20260913-154638-authorized-resume.md) y
[entrada de reanudación](tmp/RETOMAR-SENTINEL.md). Solo documentos/inventario actualizados:
ninguna nueva ejecución de VM, código o campaña; último estado runtime conserva su fecha previa.
