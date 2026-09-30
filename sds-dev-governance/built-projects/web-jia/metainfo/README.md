# Información y procedencia del modelo

- Proyecto fuente: web-jia. Revisión: `4fa5c890ed73a41bfa72515dfc4a5b38999d3d0d`.
- Fecha de conservación: 2026-09-30. Change ID: REL-2026-09-30-01.
- Solicitud: propietario del proyecto; conservar estructura/estilo, screenshots, skill inactiva,
  esqueleto, código y configuración para reutilización futura.
- [Prompt ejecutado](prompts/[64-1]catalogar-web-jia.md).
- [Manifest de fuentes](source-manifest.json): archivos originales y huellas; additions explícitas.
- [Manifest de capturas](../project-screenshots/manifest.json): orden de adjuntos, dimensiones y huellas.
- [Validación y límites](VALIDATION.md) · [Aceptación para la siguiente adaptación](ACCEPTANCE.md).

## Autoridad y mantenimiento

Este modelo es referencia opcional, no gobernanza obligatoria ni memoria precargada. La skill manual
está fuera de rutas de descubrimiento del proyecto; allow_implicit_invocation false refuerza la intención
si alguna vez se incorpora al catálogo de un agente. La mera copia no la instala ni admite herramientas.

El código congelado explica la referencia exacta. Los exports neutrales de resources tienen sus propios
manifiestos y validación; son el owner de sus componentes portables. No sincronizar ambos por intuición:
una corrección del export no cambia el snapshot histórico. Actualizar el modelo requiere identificar
nueva revisión, capturas pertinentes y diferencias, no sobrescribir evidencia sin trazabilidad.

## Límites de evidencia

Las capturas14 son originales del usuario, no resultados de QA generados aquí. No conocemos su
viewport, navegador ni zoom; las dimensiones PNG no equivalen a CSS pixels del viewport. No hay
captura específica de Acoge JIA, del mazo móvil ni del reverso del popup. Están documentados desde el
código. Tampoco se puede deducir velocidad, foco o estado reduced motion de un frame estático.

Los documentos de diseño originales en reference y comentarios del código pueden incluir rutas o
relatos históricos. Se preservan por procedencia; no dan instrucciones actuales de despliegue ni
permisos al agente. Para decisiones de reutilización seguir este índice y contratos del destino.
