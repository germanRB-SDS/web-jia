# Sentinel — continuación S0 y umbral <8 %

> Actualización posterior autorizada: [8 % ideal y continuación hasta<40 %](cost-policy-update.md).
> Cifras y resultados de este informe conservan su fecha; el umbral anterior queda sustituido.

## 0. Metadata

2026-09-13. Continuación autorizada de01-4 después de clear; Codex, ingeniería y revisión
independiente de seguridad/medición. LEVEL3, security. Estado PARCIAL. KIT/R conservados,
main/HEAD79aa7ffce2563e0e3abc189b19054187daf1a43d, sin commit; `.git` solo lectura.
Memoria local security inexistente; checkpoint y fuentes concretas recuperados sin MCP.

## 1. Objetivo

Completar comparación A sin Sentinel/B con Sentinel bajo condiciones equivalentes y sobrecoste
estricto <8 %. Esta continuación avanza S0 y análisis offline; no abre campaña sin su barrera.
Autorización del propietario vigente: no falta otra confirmación genérica del laboratorio.

## 2. Resumen ejecutivo

Una ejecución real de la nueva sonda pasó positivos, negativos y positivos posteriores.
Negativo:11 operaciones EPERM; P/X escribibles; manifiestos de controles intactos; cero señales
recibidas y cero nonces en los receptores. VM detenida al cierre. El analizador incorpora
comparación descriptiva estricta del8 %, con40 pruebas PASS. **S0 completo, B, A/B/A2/B2,
rollback y coste operativo siguen NO_VERIFICADOS/COSTE_INCONCLUSO.**

## 3. Ficheros involucrados

Nuevo `sentinel/s0_surface_probe.sh`; delta en `sentinel/evaluation.py` y sus tests/docs.
Contrato/runbook precisan estado parcial. Ledger admite solo el modo guest revisado.
Fuentes, hash, prerregistro, revisión, logs completos y cierre en [evidence/s0-surfaces](evidence/s0-surfaces/README.md).
No se reescriben ni reclasifican pruebas v1/v2/v3 ni cambios previos ajenos. Sin settings,
bootstrap, adapters, instalación, secretos, producción o Git metadata nuevos.

## 4. Mapa de impacto

| Camino | Evidencia |
|---|---|
| Host supervisor existente → Tart/virtio → shell/Node guest → Seatbelt → réplicas/IPC → observador | Una ejecución positiva/negativa/postpositiva, output completo9057bytes; exit0 |
| Supervisor45s → fin grupo/sink → inspect y PID/socket propios | VM stopped; supervisor124 por plazo esperado45.104s; procesos propios ausentes |
| Plan/registros → emparejamiento → porcentaje/umbral → JSON | Baseline0/null/incomparable no recibe porcentaje;8 exacto no cumple; cancelaciones permanecen |

BBDD/API/clientes UI: N/A, tooling local sin consumidores de producto. Consumidores del campo
nuevo: analizador offline, pruebas y documentación; ningún launcher lo usa como autorización.

## 5. Verificación BBDD

N/A — no base de datos ni datos reales.

## 6. Verificación API

N/A — no invocaciones a modelos/proveedores. Web pública consultada solo para resolver señal
reservada Node; no MCP ni cuentas. No normalización nueva de tokens ni tarifas monetarias.

## 7. Tests y validación

[Prerregistro](evidence/s0-surfaces/preregistration.json), [resultado](evidence/s0-surfaces/result.json),
[revisión](evidence/s0-surfaces/review.md), [cierre](evidence/s0-surfaces/closure.json),
[tests40](evidence/s0-surfaces/evaluation-tests.log), [verification](evidence/s0-surfaces/verification.json).

- Positivos antes/después: mutaciones en réplicas observadas, SIGUSR2 recibido1, un nonce por
  TCP4/TCP6/UNIX. Misma identidad uid501/gid20/grupos en las tres fases.
- Negativo: write/chmod/unlink/replace/política-réplica/launcher-réplica/creación en padre,
  SIGUSR2 y conexiones TCP4/TCP6/UNIX:11 EPERM. Contenido/dev/ino/modo/owner/nlink intactos.
- P/X escribibles; testigo vivo y receptores útiles después. Exit0 más cleanup explícito:
  listeners_closed y witness_closed. Un marcador PASS aislado nunca basta.
- Shell/JS parse PASS. Suite inicial38 PASS; revisor identificó overflow de int enorme y
  mediana de dos floats enormes. Corregidos con rechazo controlado/media exacta y suite40 PASS.
- Fuente/sink/supervisor y sonda v3 coinciden con huellas anteriores: lifecycle14/sink3/v3
  reutilizados para sus funciones sin delta; no se presentan como reejecutados.

Verification: V3 | sonda real + cierre + tests40 + revisión independiente | PARTIAL.
La suite valida lógica, no eficacia de Sentinel ni coste operativo.

## 8. Resultados y fallos conservados

| Evidencia | Resultado y alcance |
|---|---|
| v1 anterior | FAIL arranque sh→bash; intacto |
| v2 anterior | FAIL: FD9 heredado alteró canarioY; intacto |
| v3 anterior | PASS solo archivos/lanzamiento que excluye FD9; no revocación de Seatbelt |
| Nueva sonda | PASS del subconjunto de réplicas/señal/conectividad local; una ejecución |
| Diseño previo nuevo | SIGUSR1 sustituido antes de ejecutar por SIGUSR2 tras revisión; borrador sin ejecutar conservado |
| Comprobación host | ps restringido denegado; misma comprobación escalada aprobada, sin coincidencias. lsof inicial sin AND no válido; consulta exacta corregida sin coincidencias |
| A/B y umbral global | Cero sesiones, coste relativo null; no estimación de facturación ni aceptación |

## 9. Checklist E2E

- [x] Identidad/hash de fuentes existentes antes de retomar; VM stopped antes/después.
- [x] Positivos/negativos/oráculos y cleanup guest del subconjunto.
- [x] Evidencia fuera de restauración; resultados fallidos previos preservados.
- [x] Cálculo descriptivo <8 %, desconocidos y fallos conservados; revisión numérica.
- [ ] Custodia del runtime efectivo/dependencias/padres y privilegios no elevables.
- [ ] Egress exterior, Mach/XPC/servicios previos, revocación y árboles de procesos arbitrarios.
- [ ] Cliente real, autenticación exclusiva, presupuesto, backend y B operativo.
- [ ] Snapshot/rollback con metadata/ACL/xattrs/topología/Git; A/B/A2/B2 y S7.

## 10. Decisiones y riesgos

Crítico potencial conservado: FD previo elude denegación por ruta (v2); no habilitar sesiones
persistentes o afirmar revocación sin detener/aislar ejecutores y demostrarlo. No se observó
nuevo daño crítico a datos reales: solo fixtures sintéticos, VM offline con sumidero existente.

Severo: cuenta admin y runtime/custodia todavía incompletos. W es réplica de control, no Node
real ni sus dependencias. TCP4/TCP6 son loopback del invitado, no prueba de egress externo.
UNIX puede combinar denegación file/network; no atribuir una sola capa sin aislarla. La sonda
no cubre Mach/XPC, procesos/FD previos, hijos arbitrarios, elevación ni rollback completo.
Solución: mantener S0/general integration78 y continuar modos específicos revisados antes del corpus.

Moderado: una ejecución exploratoria y oráculos de metadata seleccionada; no ACL/xattrs ni
estimación poblacional. Porcentajes de latencia son descriptivos sobre valores ya cargados,
no coste ni precisión arbitraria del JSON original. Construction/provisión y operación se separan.
El fallo del comparador general ante valores extremos queda corregido/testeado, sin cambiar S7.

## 11. Continuidad

[Checkpoint vigente](tmp/RETOMAR-SENTINEL.md). Contrato/runbook apuntan al presente estado.
No cambios en instrucciones activas/instalaciones; ledger y log local registran modo acotado.
El revisor verificó logs/estados de VM; ps/lsof son observaciones del agente principal.

## 12. Siguiente paso

Continuar S0 con custodia efectiva, privilegios/canales/revocación; backend/snapshots, selección
de cliente y congelación A/B después. Faltan datos del propietario para sesiones con modelo:
cliente/modelo, referencia o método de autenticación exclusivo de laboratorio y tope total con
moneda. Se solicitaron sin pedir secretos ni nueva autorización genérica. Cero gasto de nuevas
sesiones guest; coste de construcción de esta conversación no disponible, no se declara cero.
