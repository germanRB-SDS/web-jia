# Revisiones independientes de 01-4

Dos subagentes de esta sesión, autorizados por el requisito de revisión independiente de S7,
sin sesiones externas Claude/Gemini, MCP o efectos adversariales. Son revisores de código y
diseño experimental; no observadores independientes de una campaña runtime inexistente.
Referencia manual: SDS `skills/gstack.md`; no se invocó una skill/plugin instalado sin admisión.

## Seguridad

Hallazgos iniciales: PASS sin positivo/capa/observador; Unicode surrogate al abreviar etiqueta;
pendiente nativo incoherente para controles; plan incompleto y presupuestos heredados.
Corregidos en core/lab, tests de regresión, contrato actualizado.

Hallazgo severo durante revisión del analizador: metadatos False/vacíos o identidad de cliente
ausente producían PASS; restore_manifest_id=False contaba restauración. Corregido validando
tipos/estructura/identidad y referencias. El revisor reprodujo primero los tres contraejemplos
en memoria y comprobó después rechazo o NO_VERIFICADO. Cierre: sin hallazgos moderados/severos
abiertos en el delta revisado. No acredita protección runtime.

## Medición

Hallazgos: correlación/identidad débil; clientes distintos agregados bajo un stratum libre;
pares con orden/fuente no congelados; pérdidas de llamadas error/cancelled fuera del denominador;
legítimos observables sin positivo excluidos. Se fijaron metadatos por stratum y fuentes/config
por brazo, órdenes/expectativas compatibles y poblaciones separadas. Todos cuentan con tests.

Residual moderado: dos tratamientos A bajo mismo stratum/brazo se agregaban. Corregido con
unicidad (config_id,source_id) por (stratum_id,arm). El revisor verificó rechazo de mezcla y
admisión de comparación A/B con tratamientos distintos declarados. Cierre: sin hallazgos de
medición pendientes en alcance revisado; evaluación parcial offline, sin certificar S7.

## Límites que impiden aceptación

Ambos revisores coinciden: se necesita barrera exterior con sujeto/identidad desechables,
custodia E/política/supervisor, canales exactos, configuración efectiva y rollback real.
No son requisitos resueltos por estas revisiones. Estado de S7: NO_VERIFICADO.
