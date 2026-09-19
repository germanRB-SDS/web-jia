# Revisiones independientes de reanudación

2026-09-13. Revisores distintos del implementador: security_review y measurement_review.
Solo revisión de fuentes/evidencia y razonamiento; no se atribuyen pruebas VM a los revisores.

## Seguridad

- Diseño del sumidero Unix viable como hipótesis de NIC offline: no forwarding AF_INET,
  sin NAT de respaldo en ruta --net-softnet observada en fuente Tart2.37.0. Falta cableado real.
- Hallazgo severo: salida sin cuota puede llenar disco host. Candidato cambia a captura16MiB,
  reserva10GiB y parada por presupuesto; prueba de parada ERROR, no resuelto operacionalmente.
- Hallazgo de lifecycle: matar solo padre deja helpers. Candidato crea grupo propio y trata
  TERM/KILL, pero EPERM impide validarlo. Dos ejecuciones preservadas, no se repite por otra vía.
- Custodia: añadir hash wrapper/sink/intérprete además de Tart. Implementado preflight candidato;
  no acredita aún identidad del sujeto/observador, custodia de RPC ni S0.
- Mirror: verificar precedencia credenciales al cambiar hostname. Fuente exacta confirma que
  lookup solo sucede tras401/challenge; mirror no emite401. Proxies observados lista vacía.
  Candidato posterior elimina filtrohostname y utiliza opener sin proxies ambientales.
- Dictamen final: NO arrancar VM ni ejecutar payloads en este contexto. `tart stop`, pipes,
  otros ejecutores o señales alternativas no acreditan eliminación de descendientes.
  Necesario contexto supervisor expresamente admitido y evidencia real de lifecycle.
- Resolución de contención actual: `run` e integración devuelven78; sin VM/corpus activados.
  No se afirma haber arreglado la causa profunda de EPERM.

## Medición

- Protección, compatibilidad protegida y rollback: null con denominador0, no 0% de eficacia.
- Sumidero2/2=100% y supervisor3/5=60% describen pruebas de infraestructura, nunca seguridad.
- Preservar ambos contextos del supervisor; son repeticiones dependientes, no10 ensayos
  independientes. La solicitud de escalación no demuestra capacidades efectivas nuevas.
- Los58 tests previos no contarían como reejecutados sin prueba: se volvieron a ejecutar
  después de la revisión y sus salidas completas están en unit-results.json (24+34 PASS).
- No porcentaje global de seguridad ni compensación de bloqueantes con éxitos unitarios.
- Descarga porcentual solo mide transferencia, no avance hacia protección demostrada.
- Terminal del propietario, si aporta resultado, será una observación de contexto diferente.

Estado: revisiones terminadas; bloqueante de lifecycle sin resolver; aceptación S7 no superada.
