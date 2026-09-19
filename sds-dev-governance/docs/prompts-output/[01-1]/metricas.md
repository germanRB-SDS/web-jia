# Diccionario de métricas y comparación — [01-1]

Los campos crudos de E04/E05 usan este diccionario como metadatos; no hay datos de sesiones
de integración. null = desconocido. Un cero solo representa una cuenta observada del runner.
Evidencia generada por el agente de desarrollo, sin sujeto ensayado con escritura; no se afirma
custodia independiente W_E. Los hashes identifican bytes, no autoría o inmutabilidad.

| Campo / métrica | Unidad | Clase | Método / fuente / alcance |
|---|---|---|---|
| pure-tests.exit | código de salida | OBSERVADO | subprocess del test puro; E04 |
| pure-tests.elapsed_ms | ms | OBSERVADO | perf_counter_ns antes/después del proceso, incluye arranque y unittest; E04 |
| runs.elapsed_ms | ms | OBSERVADO | perf_counter_ns antes/después de seleccionar diez rutas en RAM; E05, sin E/S de fixtures |
| latency.A/B median/min/max | ms | INFERIDO | statistics sobre los cinco run_id del mismo brazo, E05 |
| latency.delta_median | ms | INFERIDO | median(B) − median(A), entradas E05 |
| latency.paired_deltas[i] | ms | INFERIDO | elapsed(pair-i-B) − elapsed(pair-i-A), entradas E05 |
| personal_selected | rutas de 3 posibles | OBSERVADO | cardinalidad de intersección de selección con tres rutas sintéticas; E05 |
| legitimate_selected | rutas de 5 posibles | OBSERVADO | cardinalidad de intersección con cinco fuentes/controles/informe; E05 |
| messages.chars / utf8_bytes | caracteres / bytes | OBSERVADO | len(text) / len(text.encode('utf-8')); texto exacto E05 |
| messages.wire_utf8_bytes | bytes | OBSERVADO | JSON nativo serializado, incluye envoltorio; E05 |
| messages.simulated_duplicates | mensajes | OBSERVADO | una construcción por incidente sintético; sin canal real; E05 |
| messages.simulated_messages_per_incident | mensajes/incidente | OBSERVADO | una respuesta por entrada sintética; E05 |
| messages.technical_criteria | booleano/null | OBSERVADO | código, objeto decodificado, estado simulado, transición, inyección y redundancia; E05 |
| mensajes: comprensión humana/visibilidad | evaluación/booleano | NO_DISPONIBLE | no hubo persona ni canal nativo; null, NO_VERIFICADO |
| prompts/retries/model_calls en runs | llamadas | OBSERVADO | función pura no invoca modelo ni herramienta evaluada; E05: 0 |
| token_usage_reported | tokens proveedor | NO_DISPONIBLE | no se dispone de usage de construcción; no hubo sesiones de integración |
| token_text_estimate | tokens de texto | NO_DISPONIBLE | no tokenizer/modelo compatible calibrado; no regla bytes/4 |
| tiempo/CPU/RSS runtime o incidente | ms/CPU/bytes | NO_DISPONIBLE | no hay ensayo de harness |
| instrucciones cargadas por candidato | bytes runtime | OBSERVADO | 0: no se activaron plantillas/hooks; no es ahorro A/B de la conversación |
| mantenimiento | archivos/líneas/dependencias | OBSERVADO | inventario de archivos del cierre E06; dependencias nuevas = 0, solo stdlib |
| rollbacks/A2 | intentos/verificaciones | OBSERVADO/NO_DISPONIBLE | 0 intentos de integración; equivalencia física desconocida |

Los restantes campos de run_id/pair_id/case_id/phase/arm/seed/método/capa/outcome son etiquetas
de procedencia y resultado, no métricas numéricas. Sus digests se calculan con SHA-256 sobre
los archivos exactos. expected_decision se fija antes de medir; actual_decision conserva las
rutas seleccionadas. attempt_observed=false significa que no hubo intento de efecto sobre
filesystem; no convierte los tests de selección en pruebas de prevención.

## Comparación pura de selección

A es una reconstrucción explícita en memoria de la selección del visit() inicial (componentes
IGNORED extraídos como datos de la copia E01, sin ejecutarla); B llama la función candidata.
Ambos procesan las mismas diez rutas, sin filesystem, harness o permisos. Esta comparación
NO es ejecutar el baseline de bootstrap ni el protocolo A/B de Sentinel solicitado para agentes.
La hipótesis medida es omitir datos locales sin omitir las cinco fuentes legítimas del caso.
Calentamiento separado, cinco pares en orden AB/BA/AB/BA/AB; muestras crudas E05.

| Métrica | A | B | Δ = B − A | Unidad / favorable |
|---|---:|---:|---:|---|
| Rutas personales seleccionadas | 3/3 | 0/3 | −3 | rutas; menor |
| Rutas legítimas seleccionadas | 5/5 | 5/5 | 0 | rutas; mayor |
| Latencia mediana de selección | 0.005542 | 0.009041 | +0.003499 | ms; menor |
| Latencia mínima | 0.005334 | 0.008125 | +0.002791 | ms; menor |
| Latencia máxima | 0.012459 | 0.039375 | +0.026916 | ms; menor |

Resultados por dimensión: selección cumple en B sobre este corpus; utilidad de selección igual;
coste local mayor en la mediana observada, con muestra pequeña y ruido visible. No hay percentiles
estables, significación estadística ni mejora de rendimiento reclamada. No se amplía la campaña
porque no resolvería las brechas de integración. No hay cálculo de ahorro económico ni relativo.

## A/B por adaptador (integración)

| Harness | A | B | Δ | Rollback datos | B → A / A2 | Conclusión |
|---|---|---|---|---|---|---|
| Codex 0.154.0 instalado, inferido | null | null | null | NO_VERIFICADO | NO_VERIFICADO | INCONCLUSO |
| Claude 2.1.270 instalado, inferido | null | null | null | NO_VERIFICADO | NO_VERIFICADO | INCONCLUSO |
| Gemini no encontrado | null | null | null | NO_VERIFICADO | NO_VERIFICADO | DECLARADO / INCONCLUSO |

Unidades de futuras comparaciones: efectos no autorizados, tareas correctas/intentadas,
preguntas innecesarias, denegaciones por caso/turno, llamadas posteriores, ms y tokens reportados
según categorías del proveedor. No hay observaciones A/B comparables de estos valores.
Las 16 familias / 62 variantes por harness de E03 son alcance planificado, no 186 intentos
ejecutados. Se conservan como pendientes; disponibilidad de GNU sed/canales decide aplicabilidad
solo tras descubrimiento, nunca convirtiendo un caso ausente en PASS.

## Mensajes y consumo

Nueve ejemplos sintéticos (tres por códec) conservan texto y JSON exactos; 143–159 caracteres y
145–161 bytes UTF-8 de texto por ejemplo. Los seis criterios técnicos automatizados pasan;
visibilidad real queda null. Hay revisión técnica de claridad, no evaluación de comprensión
humana. Se prueba rechazo de una afirmación TURNO_DETENIDO sin soporte, escape de controles,
ausencia de payload y no prometer aprobación para autoalteración de controles.

No hay ahorro de tokens observado: bytes de plantillas son texto candidato, no instrucciones
efectivamente cargadas en A/B. El coste de construir esta solución incluye esta conversación,
cuya contabilidad del proveedor no está disponible; ni cero sesiones de ensayo ni un hook
determinista significan cero consumo de construcción. Caché, razonamiento, contexto reenviado
y tiempo humano permanecen desconocidos. No se suman categorías de usage inexistentes.
