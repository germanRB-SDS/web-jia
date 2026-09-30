# Seleccionar y reordenar bloques

IDs estables definidos en el [índice](../INDEX.md). La referencia actual compone Home con componentes
React explícitos: **no** contiene un page-builder ni un renderer JSON genérico. El manifiesto de
abajo es una receta de selección para una adaptación futura, no una API existente.

| Receta propuesta | Orden | Cambios semánticos |
|---|---|---|
| Evento / jornadas | menu → hero → waypoints → jornadas → video → program → cube → cards → experiences → split-hard → split-soft → partners → footer | Estructura de referencia. |
| Servicios profesionales | menu → hero → waypoints → split-soft → cards → partners → split-hard → footer | Talleres→servicios; jornadas/ruta/video opcionales. Un CTA comercial claro. |
| Portfolio / estudio | menu → hero → experiences → cards → cube → split-hard → footer | Film→proyectos o galería; equipo en cubo solo si aporta lectura. |
| Producto con variantes | menu → hero → video → program → cards → split-soft → partners → footer | El comparador usa atributos reales de variantes, sin horas ni numerales de agenda si no aplican. |

## Contrato de ensamblaje

1. Elegir módulos por función de contenido, no por llenar todas las filas. Definir objetivo, audiencia,
   acción primaria, marca y medios disponibles. Formular solo preguntas que bloqueen esa selección.
2. Mantener IDs únicos; rehacer nav, subnav, waypoints y footer a partir de las secciones elegidas.
   No dejar anclas a bloques retirados ni varios IDs al duplicar una plantilla.
3. Separar `Jornadas` si se necesita reordenar sus hijos: hoy engloba banda + vídeo + programa +
   cómo funcionan/cubo + talleres. Conservar props y modelos de contenido al extraer wrappers.
4. Mantener un H1; recalcular jerarquía de H2/H3/H4 al sacar una subsección. Respetar orden DOM
   comprensible; no resolver todas las reordenaciones con CSS `order`.
5. Declarar color de suelo de entrada y salida de cada banda. Hero y Host usan velos; el footer,
   tinta. Al mover bloques, recalcular seams y `--jia-band-aula-ratio`, que enlaza Experiencias y
   Propuestas desde 1280px. No imponer esa altura a otro negocio sin la misma composición.
6. Copiar la unidad de dependencia completa desde el catálogo. Cambiar negocio por constantes y
   copy; configurar media, alt, ratio y focal. No usar las capturas como imágenes de producción.
7. Conservar policy y cleanup en motores; lazy import de escenas, visibilidad, fallback estático.
   No remontear toda la página para apagar movimiento. CSS3D y WebGL no son intercambiables.
8. Volver a comprobar desktop/móvil, teclado/touch, reduced motion, modales, fuentes, enlaces y
   assets. [Plan de aceptación](../metainfo/ACCEPTANCE.md).

## Datos mínimos de un módulo en el proyecto de destino

| Grupo | Contenido |
|---|---|
| Identidad | ID único, título, nivel semántico, aparición en navegación. |
| Texto | Kicker, subtitle, lede, párrafos, labels, aria y estados en diccionario. |
| Medios | src/srcSet, dimensiones, ratio, alt o decorativo, focal, permiso de uso. |
| Acciones | Texto, destino real, externo/interno, disponibilidad; nunca `href="#"` provisional. |
| Composición | Variante hard/soft, posición visual, contraste, ritmo de entrada/salida. |
| Interacción | Opcional/autoplay, pausa, teclado/tap, política motion y fallback. |

Estas son responsabilidades de configuración, no props inventadas de los componentes originales.
Las APIs existentes están en los tipos TS conservados y las guías de los exports.
