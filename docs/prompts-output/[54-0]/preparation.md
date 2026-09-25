# [54-0] Preparación del prompt — sin ejecución

## 0. Metadata
2026-09-25 · Codex · REL-2026-09-25-03 · preparación IMPLEMENTADA; prompt PREPARED — NOT EXECUTED. Base e2d34ef. Alcance de ejecución previsto LEVEL 3.

## 1. Objetivo
Comprobar viabilidad y código afectado; redactar y guardar prompt, commit local, parar para clear y ejecución futura. Áreas futuras frontend/security; sin despliegue durante preparación.

## 2. Resumen
Se formaliza el popup con copy exacta, aceptación persistente y rechazo efímero, política común CSS/JS, compatibilidad por capacidades, reserva para tilt y timer de mazo condicionado a no explorar en esa visita.

## 3. Ficheros
Prompt docs/prompts/[54-0]preferencia-animaciones-y-talleres-movil.md; dos referencias visuales originales en evidence; este informe y tmp/preparation-checkpoint.md. No se modifica código, dependencias, configuración ejecutable ni archivos generados ajenos.

## 4. Impacto
Preparación documental únicamente. La ejecución futura afectará política transversal de movimiento, dialog/cookie y Talleres móvil. El sitio seguirá siendo export estático. El prompt especifica límites sobre vídeo/audio, escritorio y trabajo concurrente.

## 5. BBDD
N/A: sin persistencia de servidor.

## 6. API
N/A: no requiere backend. Cookie de preferencia cliente, no autenticación.

## 7. Comprobaciones
Inspección de TalleresCarrusel, SheetCard, TiltCard/config, SheetDialog, layout y catálogo ES. Búsqueda transversal de prefers-reduced-motion y ausencia de cookie/localStorage en app/lib/components. TILT escala 1.07, rotación hasta 12° y scroller horizontal con recorte respaldan el mecanismo del clipping de la captura; la medición visual del arreglo queda para ejecución.

Fuentes primarias MDN/BCD enlazadas en prompt: detección Linux/Android y Samsung Internet, cookies Secure/SameSite/__Host- y limitación HttpOnly. No se probó hardware Linux/Guadalinex/Samsung; el prompt exige distinguir compatibilidad documentada y prueba real. No se ejecutaron build, tests de producto ni despliegue porque no hay implementación nueva.

## 8. Resultado
Prompt autosuficiente y con criterios de aceptación. No ejecutado. Incluye ruta de continuación sin depender de imágenes temporales del chat.

## 9. E2E
N/A durante preparación. Matriz y pruebas de interacción/persistencia definidas para la implementación futura.

## 10. Decisiones y riesgos
Se interpreta «sesión» como vida del documento y «click en otra carta» como interacción con cualquier ficha después del primer gesto de desplegar. Decisiones explícitas en prompt; TTL propuesto 180 días, geometría inicial ~90% sujeta a medición. La cookie no puede ser HttpOnly en este export cliente y no guarda secretos. No se garantiza compatibilidad con navegadores históricos de Guadalinex. No existe bloqueo que impida preparar el prompt.

## 11. Memoria
Checkpoint de preparación y diagnóstico anterior referenciados. No se registra comportamiento futuro como ya implementado en memoria técnica.

## 12. Siguiente paso
Hacer clear y ordenar ejecutar el archivo del prompt. Preparación cierra con commit local; no push ni acceso a producción. Revisar y validar visualmente la futura implementación antes de pedir publicación, salvo que la instrucción de continuación autorice otra secuencia explícita.
