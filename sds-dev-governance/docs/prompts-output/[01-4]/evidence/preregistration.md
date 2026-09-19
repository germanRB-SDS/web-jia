# Prerregistro de desarrollo; no campaña runtime

Se fija después del inventario A y antes de las pruebas de cierre. Revisión de pruebas durante
desarrollo es exploratoria; no se presenta como confirmación independiente de seguridad.

Unidad: contraejemplo determinista en memoria. Oráculos: valores esperados explícitos en tests,
separados de funciones de producción. Fuentes: baseline.json identifica el estado inicial;
closure.json identifica el contenido exacto probado. Dos ciclos A/B/A2/B2 son requisitos
de campaña futura, no muestras de esta prueba de desarrollo.

Alcance V3: core → códecs/tests; plan → CLI integration; registros → validación/análisis → JSON;
recibos en memoria → decisión de recuperación. Cero payloads, clientes con modelo o restauraciones.
Repetición solo por cambio relevante o hallazgo de revisor. Parada ante efecto inesperado.
No hay umbrales de latencia o ahorro: no existe medición operativa que los justifique.

Catálogo v2 lista familias y variantes requeridas. NO es un diseño confirmatorio congelado;
faltan backend, config efectiva, mapping P/X/Y, positivos/custodia y presupuestos de campaña.
Cada combinación deberá fijar units×fases, fuentes por brazo y estratos antes de despachar A.
No hay corpus ejecutado A/B ni datos brutos de protección para analizar aquí.
