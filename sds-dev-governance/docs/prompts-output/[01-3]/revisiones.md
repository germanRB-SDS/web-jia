# Revisiones independientes de la preparación 01-3

Fecha: 2026-09-13. Dos subagentes separados del autor, con lecturas propias de fuentes y revisión
del prompt resultante. No son auditoría externa certificada ni ejecuciones de Claude/Gemini.
No ejecutaron código, campañas, restauraciones ni MCP. Alcance: seguridad del contrato futuro
y validez del diseño experimental, no funcionamiento de Sentinel.

| Revisor | Pasadas | Resultado |
|---|---|---|
| `/root/security_review` | Inspección de candidato/antecedentes, borrador y ajustes finales | Sin hallazgos bloqueantes documentales; custodia/confinamiento runtime pendientes de pruebas futuras. |
| `/root/measurement_review` | Inspección de medidas/runner, borrador y confirmación de tres correcciones | Tres precisiones incorporadas; sin bloqueantes pendientes de medición del diseño. |

## Seguridad — hallazgos y resolución

| ID | Hallazgo / riesgo | Resolución en prompt 01-4 |
|---|---|---|
| SEC-1 | Crítico si se extrapola: códec/contador puro y runner sin backend no demuestran integración. | S1/S4/S5/S7: efecto por canal, backend acreditado y veto a PASS documental. No afirmar remediación runtime. |
| SEC-2 | Crítico: hook no invocado, fallos abiertos, IPC/FD/MCP y procesos fuera del control. | S2–S5: base confiable, canales, prueba de todas las formas de fallo y barrera independiente del script imprescindible. |
| SEC-3 | Crítico: hashes, 444 y misma cuenta no acreditan custodia de controles/padres. | S2/S4/S5: control efectivo y reemplazo, entorno/intérprete/dependencias, observador exterior. |
| SEC-4 | Severo: snapshots históricos no demuestran rollback de configuración/concurrencia/enlaces. | S5: pre/postimágenes, restauración por precondiciones, exclusión/atomicidad, conflicto preservado, A2/B2 y metadatos. |
| SEC-5 | Moderado: identidad del baseline real frente laboratorio sintético poco explícita. | S5: mapa de rutas/configuración A→P/X; adaptaciones iguales en A/B y límites de generalización, sin copiar trust personal/credenciales. |

El revisor validó el borrador sin bloqueantes y propuso SEC-5 como mejora de precisión.
Se añadió también la condición posterior del propietario: integración solo tras pruebas S7
en el modo exacto y ámbito autorizado; control nativo/local con mínimo contexto estático.

## Medición — hallazgos y resolución

| ID | Hallazgo / riesgo | Resolución en prompt 01-4 |
|---|---|---|
| EXP-1 | Severo si se extrapola: selector RAM, ejemplos de mensajes y A histórica no miden Sentinel. | S1/S5/S6: baseline actual, oráculos independientes y población por canal. |
| EXP-2 | Severo: prevención y falsos negativos usaban denominadores distintos. | S6: población idéntica de intentos indebidos elegibles. Errores/inconclusos se conservan fuera de las tasas atribuibles y en cobertura. |
| EXP-3 | Severo: «invocación ausente» podía excluir un bloqueo correcto antes del payload. | S6: dispatch al punto real de control cuenta; deny allí registrado es válido sin syscall, con control positivo de capacidad. Petición verbal no cuenta. |
| EXP-4 | Moderado: congelación antes de B frente uso de piloto para decidir tamaño. | S6: preregistro del piloto antes de sus A/B; confirmación separada y congelada antes de su campaña. |
| EXP-5 | Severo: sesgos de corpus/atribución, caché y contadores, umbrales arbitrarios. | S5–S7: barrera X/Y, todos los resultados visibles, contabilidad nativa deduplicada, categorías separadas, muestra y tolerancias justificadas. |
| EXP-6 | Moderado: matriz documental A/B/C confundible con brazos A/B. | S6 y output 01-3: corrección aritmética aportada, fuente original ausente, índices sin eficacia empírica ni pesos heredados. |

Confirmación final del revisor experimental: EXP-2/3/4 resueltos por lectura focal; sin otros
bloqueantes. No hay validación estadística de datos inexistentes ni PASS de protección.
