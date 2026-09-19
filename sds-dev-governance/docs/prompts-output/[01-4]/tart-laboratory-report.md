# Sentinel01-4 — reanudación del laboratorio Tart

> Actualización posterior: [corrección del supervisor](supervisor-fix.md), 11/11 tests PASS
> en Python 3.14.6 y 3.8.10. El fallo sintético de cierre queda resuelto sin ampliar permisos.
> El informe siguiente conserva la fase previa; VM/S0/S7 y A/B siguen sin ejecutar/verificar.

2026-09-13; LEVEL3/security; mismo KIT y HEAD que el informe principal. Encargo del propietario:
Tart instalado, ejecutar laboratorio real, guardar métricas precisas y documentar en know-to/
si funciona. Estado: **PARCIAL / BLOCKED_SUPERVISOR_LIFECYCLE**. No se activa ni integra Sentinel.

## Conclusión de uso

**No utilizar Sentinel como protección demostrada.** Instalar y descargar Tart no acredita
el laboratorio. Esta sesión devuelve `PermissionError: [Errno 1] Operation not permitted`
al intentar controlar exclusivamente grupos propios (`os.killpg`), tanto restringida como
en la ejecución con escalación solicitada y admitida. La causa profunda no está establecida.
Sin parada fiable no se arranca la VM ni se ejecutan payloads. Ambos runners rechazan con78.

La revisión de seguridad confirma el bloqueo; la de medición prohíbe convertir tests unitarios
en eficacia. No se emite porcentaje global de seguridad. El procedimiento completo aún no
«va bien»: no se publica una receta validada en know-to/. Queda pendiente cumplir esa condición.

## Métricas exactas y dashboard

| Indicador | Numerador / denominador | Resultado | Qué significa |
|---|---:|---:|---|
| Helpers/códecs |24/24|100%|Tests sintéticos, 0.005s según unittest |
| Evaluación/recuperación pura |34/34|100%|Tests sintéticos, 0.006s |
| Sumidero Unix |2/2|100%|Sockets sintéticos, 0.503s; no NIC de VM probada |
| Mirror público |4/4|100%|Handler en memoria, 0.002s; no prueba end-to-end de transporte |
| Supervisor, contexto restringido |3/5|60%|2 ERROR; 4.400s, sin VM |
| Supervisor, escalación solicitada |3/5|60%|Los mismos2 ERROR; 4.389s; repetición dependiente |
| Protección Sentinel |0/0|null|Ningún intento elegible de integración |
| Compatibilidad protegida |0/0|null|Ninguna combinación certificada |
| Rollback real |0/0|null|Ningún ciclo A/B/A2/B2 ejecutado |
| Seguridad global |N/A|null|No existe un porcentaje defendible con esta evidencia |
| Palabras añadidas a adapters |0|0|Sin cambios a adapters ni instrucciones de arranque |
| Tokens/factura del trabajo |No disponibles|null|COSTE_INCONCLUSO; no equiparar con coste cero |

No agrupar ambas ejecuciones del supervisor como diez observaciones independientes ni promediar
un bloqueo crítico con tests verdes. Sin intento no hay falso negativo observado, pero tampoco
prueba de protección. `null` debe verse como **Sin medir**, no convertirse a0 en el dashboard.

Datos: [unit-results.json](evidence/tart-run2/unit-results.json),
[supervisor-results.json](evidence/tart-run2/supervisor-results.json),
[dashboard.json](evidence/tart-run2/dashboard.json). Regeneración desde KIT:

```sh
python3 -B sentinel/lab_dashboard.py 'docs/prompts-output/[01-4]/evidence/tart-run2'
```

## Implementación y provisión

- Tart2.37.0 arm64: hash binario y firma comprobados; `codesign --verify --strict` dio0
  en comprobación solo lectura escalada. El fallo previo en sandbox no prueba binario corrupto.
- Almacén dedicado0700: `/private/tmp/sds-sentinel-tart-KoUNwE`. No cambiar HOME, SUID,
  firewall, settings globales, adapters ni permisos de la sesión. Sin MCP ni secretos personales.
- Imagen pública fijada: `ghcr.io/cirruslabs/macos-tahoe-base@sha256:1b093499716409d29e8b5336844528e1cae375db97d2ad8e5aeff78cf0da201e`.
  Capas comprimidas: **27312483923 bytes**, manifest con96 capas. No son tamaño RAM ni disco final.
- GHCR rechaza Basic vacío403; petición pública sin Authorization obtiene token anónimo200.
  Mirror GET temporal en loopback solo permite rutas fijadas por manifest. Tart no recibe401
  y, según fuente2.37.0, no consulta proveedores de credenciales en ese flujo. No es un proxy general.
- Tart2.37.0 no ofrece `--net-none`: candidato de NIC recibe/descarta datagramas Unix mediante
  helper propio llamado softnet solo en PATH dedicado. No se ejecuta el producto Softnet.
  El arranque previsto omite shares/audio/clipboard/TTY; no se afirma confinamiento observado.
- Candidato supervisor:16MiB de log por invocación, reserva10GiB de disco, timeout1800s de
  clone/7200s de VM, identidad de componentes comprobada y grupo propio. Son límites preventivos
  del piloto, no umbrales de aceptación de eficacia. Lifecycle no validado: `run` bloqueado78.

Estado final de descarga y recibo: ver sección de cierre al final. Descargar no cambia S0/S7.
La fuente usada por clone es la revisión de provisión registrada en admission.md; las mejoras
posteriores no se atribuyen retroactivamente al proceso ya iniciado.

## Alcance, conservación y garantías pendientes

Fuentes nuevas: tart_host.py, public_registry.py, net_sink.py, lab_dashboard.py y tres suites
de infraestructura. README Sentinel y ledger/README/log de gobernanza actualizados únicamente
para admisión local, descubrimiento y bloqueo; no modificación del contrato portable/release.
Preimágenes de documentos solapados guardadas antes de editar; conservación final por manifiesto.
No borrado general, git reset/clean/stash, commits, cambios de bootstrap ni propagación.

S0 pendiente: arranque real y NIC efectiva, canarios positivos/negativos, ningún acceso a datos
reales, sujeto sin privilegios y observador/supervisor/backups/E fuera de su escritura. Una
carpeta0700 del host no acredita por sí sola esa custodia si el sujeto comparte identidad host.
S5/S7 pendientes: controles A reales, B congelado, canales/clientes/configuración efectiva,
fallos del control, corpus elegible, pérdida interior, metadatos/ACL/xattrs/Git, permisos,
concurrencia, rollback de datos/configuración y reanudación con A2/B2. Buffers de editor no
guardados siguen fuera de recuperación de snapshots de disco. Ningún modelo de ensayo iniciado.

## Desbloqueo mínimo

El propietario debe probar el supervisor en un contexto autorizado fuera de las restricciones
observadas, sin conceder acceso a secretos. Test sintético solicitado desde su Terminal:

```sh
cd /Users/hrms/MAC-DEV-PROJECTS/sds-dev-governance
python3 -B tests/test-sentinel-tart-host.py
```

Esperado: cinco tests PASS. No usa VM ni red; crea procesos Python propios y prueba su cierre.
Un PASS allí no concede capacidad a esta sesión: habrá que admitir ese contexto exacto como
supervisor exterior, controlar el laboratorio desde él y probar S0 antes del corpus. No se pide
desactivar globalmente el sandbox ni entregar contraseñas/claves. No se elimina el bloqueo de
arranque por mera presencia de Tart o por declaración documental.

Revisiones y resoluciones: [reviews.md](evidence/tart-run2/reviews.md).
Admisión/fuentes/hashes: [admission.md](evidence/tart-run2/admission.md).

## Cierre observado de provisión

Clone terminó con **exit0**, en **650.7716798750043 segundos** de reloj monotónico del
supervisor (incluye arranque/cierre del mirror).97 respuestas completas verificadas por hash,
**27312517392 bytes** servidos por ese mirror,0 rutas rechazadas y0 errores upstream.
El conteo corresponde a cuerpos de respuesta; no incluye overhead TLS/HTTP ni mide tráfico
total de la máquina. Log1269 bytes. [Recibo](evidence/tart-run2/clone-receipt.json) y
[log escapado](evidence/tart-run2/clone-log.json). El mirror temporal terminó con el proceso.

Inspección posterior de Tart: `sentinel-lab`, **State=stopped, Running=false**; también caché
OCI detenida. Configuración observada:4 CPU y8589934592 bytes de RAM configurada, no consumida
por una VM arrancada. `du -sk` devuelve65070316 KiB para el árbol; APFS puede contabilizar
clones compartidos varias veces: NO se presenta como consumo físico exclusivo. `df -k`
muestra124927904 KiB libres en el volumen al cierre. [Estado](evidence/tart-run2/vm-state.json).
No borrar automáticamente imagen/caché: se conservan para el siguiente contexto autorizado.

Conservación respecto al manifiesto inicial443 archivos:435 iguales en contenido/modo,
8 cambios esperados (5 de la fase anterior y3 documentos de gobernanza en esta reanudación),
0 ausentes y0 diferencias no previstas;8 adapters sin delta. [Cierre](evidence/tart-run2/closure.json).
Sin restauración A/B que verificar: B nunca se activó. La eliminación exhaustiva de grupos
propios sigue NO_VERIFICADA; no inferirla de State=stopped o del tiempo transcurrido.
No se han ejecutado fixtures adversariales ni tocado datos reales como blancos de prueba.

Verificación final adicional: AST14 fuentes/tests PASS, dashboard idéntico al regenerado,
0 enlaces locales rotos en ambos informes, `git diff --check` PASS e índice sin cambios.
[Recibo de verificación](evidence/tart-run2/verification.json). Estas comprobaciones no
sustituyen integración, E2E ni validación del contexto supervisor pendiente.
