# Fase 3 — sensor nativo observado y cerrado

2026-09-14 · REL-2026-09-14-01 · LEVEL 3 / V3. Implementación eeb7205 sin cambios.

## Resumen y resultados

La autorización explícita del propietario fue registrada y la plataforma permitió
el único sondeo root/launchd/eslogger en la VM propia offline. Diez hashes coinciden
con la revisión independiente previa. No se modificaron cuentas, TCC, SIP ni host.
Siete pruebas sintéticas previas se reutilizan; aquí sí hubo ejecución nativa.

83 eventos reales: 37 unlink, 14 fork, 27 exec y 5 exit; 227.996 bytes de stdout,
0 bytes de stderr. Esquema 1, versión de mensaje 10; global_seq_num 0–82 y secuencias
por tipo sin huecos observados. Línea máxima 3.864 bytes. Ventana de colección
programada 4 s; timestamps de primer/último evento 07:00:59.310882725Z y
07:01:02.396492979Z. No equivalen a un cronometraje de latencia ni cobertura completa.

Servicio observado running; bootout exit 0, print final exit 113 con ausencia exacta
del label, sin errores de persistencia/cierre. Guest exit 0, supervisor VM exit 124
por el límite previsto, ciclo exterior 46,050341 s. Inspección posterior:
sentinel-lab stopped / Running=false. Consultas aprobadas ps y lsof limitadas a
93200,93201,93203,93204,93317,93881: sin filas (ambas exit 1); no señales enviadas.
El lsof se ejecutó por separado porque ps sin filas cortó el primer encadenamiento.

Logs/recibo originales exportados byte a byte con SHA-256; stdout decodificado
a sensor-run-stdout.jsonl y resumen en evidence/sensor-run-analysis.json.
El recibo JSONL final es la referencia, no el result.json previo del invitado.

## Conclusiones y riesgos

Acceso operativo a eslogger acreditado solo para este contexto exacto. No se ha
inspeccionado el ajuste FDA ni hace falta concederlo para explicar este éxito.
Canario atribuible, cuenta dedicada/custodia, integración, aislamiento y clientes
siguen pendientes; 01-5 PARCIAL y protección nativa QUARANTINED. No inicia 01-6.

Severo: presentar el diagnóstico como protección permitiría lanzar un sujeto sin
custodia/cobertura probadas. Destino: mantener cerrado el launcher y verificar las
puertas nativas por fases. Moderado: cuatro segundos sin huecos no certifican
resistencia a saturación, reinicio ni pérdida; conservar pruebas negativas separadas.
Moderado: eventos incluyen actividad del SO invitado; raw local restringido a 0600,
dashboard solo agregados. No se han observado efectos críticos nuevos sobre datos
reales en este sondeo; no constituye certificación general.

Siguiente: revisión independiente del canario con sujeto de UID separado, comprobación
de identidad/grupo y custodia, nueva admisión exacta y revisión de plataforma.
