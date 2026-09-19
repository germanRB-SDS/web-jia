# Governance Evaluation

Evaluacion periodica de outputs y eficacia de la gobernanza. No cargar esta carpeta en trabajo normal.

## Cuando cargar

Cargar esta carpeta solo si el prompt pide:

- Reevaluar outputs.
- Optimizar consumo de tokens.
- Revisar plantillas de output.
- Mejorar la gobernanza.
- Analizar calidad de checkpoints.
- Medir si `LEVEL 0-3` esta bien calibrado.

## Protocolo

1. Seleccionar una muestra de outputs reales.
2. Clasificar cada output por nivel (`LEVEL 0-3`).
3. Medir coste, utilidad y capacidad de reanudacion.
4. Registrar resultados en `output-review-template.md` copiado para la revision.
5. Convertir propuestas en entradas de `improvement-backlog.md`.
6. No aplicar cambios de gobernanza sin prompt explicito.

## Metricas objetivas

| Metrica | Definicion | Objetivo |
|---|---|---|
| `output_line_count` | Lineas del output | Menor sin perder utilidad |
| `sections_used` | Secciones con informacion real | Alta senal |
| `sections_na` | Secciones marcadas `N/A` | Detectar exceso de plantilla |
| `documentation_ratio` | Lineas de output / ficheros cambiados | Proporcional al cambio |
| `loaded_memories_total` | Memorias cargadas | Minimizar |
| `loaded_memories_needed` | Memorias realmente necesarias | Maximizar precision |
| `context_efficiency` | `needed / total` | Ideal cercano a 1 |
| `time_to_resume` | Tiempo estimado para retomar | Bajo |
| `checkpoint_quality` | 0-2 segun utilidad para reanudar | 2 |
| `missing_validation` | Validaciones ausentes | 0 |
| `duplicated_context` | Repeticion de codigo/contratos/logs | 0 |
| `risk_not_documented` | Riesgos reales no anotados | 0 |

## Escala de puntuacion

| Valor | Significado |
|---|---|
| 0 | Ausente o deficiente |
| 1 | Aceptable |
| 2 | Bueno |

## Criterios de decision

- Si `LEVEL 1` supera 40 lineas de media, crear plantilla compacta especifica.
- Si `sections_na / total_sections` supera 50% en `LEVEL 2`, compactar plantilla o crear variante.
- Si `context_efficiency` baja de 0.7, ajustar reglas de inferencia de areas.
- Si `checkpoint_quality` es menor que 2 en trabajos parciales, endurecer checkpoint.
- Si aparece `duplicated_context`, reforzar la regla de referenciar rutas en lugar de copiar contenido.
- Si falta validacion repetidamente, anadir checks automaticos o runbooks.

## Resultado esperado

La evaluacion debe producir propuestas accionables, no narrativa larga. Registrar cambios propuestos en `improvement-backlog.md`.
