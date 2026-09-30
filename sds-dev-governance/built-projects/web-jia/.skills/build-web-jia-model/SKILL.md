---
name: build-web-jia-model
description: Componer una web a partir del modelo editorial modular web-jia, o reutilizar uno de sus bloques, cuando el usuario elija expresamente esta referencia.
---

# Construir con el modelo web-jia

Skill archivada de uso explícito. No está instalada ni activada. Su carpeta forma parte del catálogo
`built-projects`, no del catálogo automático de skills del agente. La petición de usar el modelo
selecciona una referencia de diseño; no autoriza publicar ni instalar herramientas.

## Entrada mínima

Leer [INDEX](../../INDEX.md) y [STYLE-GUIDE](../../STYLE-GUIDE.md). Identificar negocio, acción
principal y módulos elegidos a partir de la petición/contexto. Si falta una decisión esencial,
preguntar por ella mientras se avanza en lo independiente. No imponer western, JIA ni todos los bloques.

## Selección y composición

- Para página completa: seguir [COMPOSITION](../../project-skeleton/COMPOSITION.md); proponer orden
  por función de contenido. El orden original es una opción. `Jornadas` agrupa varios hijos en la
  referencia: separar wrappers si se quiere reordenarlos. Mantener IDs/anchors y jerarquía semántica.
- Para una pieza: abrir solo su fila en [componentes](../../web-components/INDEX.md) y la ficha
  seleccionada. Preferir exports P de resources para cubo, película y colaboradores; incluyen
  soporte, estilos, fixtures y validación. Los demás son fuente histórica R que requiere adaptación.
- Para detalle visual: consultar la captura concreta en [galería](../../project-screenshots/README.md).
  No asumir que una imagen prueba movimiento, tap o responsive; contrastar con código y fichas.
- Para foto/3D: leer [composición de capas](../../web-components/photo-composition.md). Registrar
  ratio/focal/máscara/oclusión/ancla y conservar GLB+fuente. El cubo y el film no son escenas WebGL.

## Implementación en el destino

Usar el stack existente si permite mantener los contratos. Si se parte de cero, la
[referencia reconstruible](../../project-skeleton/README.md) incluye código, config, lockfile y medios.
[Stack/i18n](../../server-config-info/STACK-I18N.md) identifica propietarios de negocio/copy/media.
Sustituir identidad, datos, assets y metadata por los del destino antes de publicar. Las capturas y
medios JIA documentan una referencia, no se transfieren como identidad comercial de otra empresa.

Mantener relaciones tipográficas y ritmo editorial al cambiar fuentes/paleta. Al reordenar bloques,
recalcular seams, contraste y dependencias de altura. Tratar hover como mejora: mismo contenido por
tap/click/teclado. Conservar reduced motion, pausa fuera de pantalla, foco de modales y cleanup.
No trasladar automáticamente la política de consentimiento específica de JIA.

## Comprobación y entrega

Aplicar [ACCEPTANCE](../../metainfo/ACCEPTANCE.md) a los módulos utilizados. Validar cada interacción
requerida y declarar límites de dispositivo/API; una build verde no prueba fidelidad visual.
La adaptación nueva necesita sus propias capturas/evidencias. Entregar orden, componentes y
configuración usados, diferencias respecto a la referencia y resultados comprobados.

Las capacidades y operaciones del agente siguen la gobernanza del proyecto de destino. Esta skill
no la modifica ni se autoactiva; cualquier instalación/admisión futura se tramita en ese proyecto.
