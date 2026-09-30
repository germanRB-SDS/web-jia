# Fotografía integrada, capas 2D y elementos 3D

Receta aplicable a cualquier sección con foto; no restringida al footer ni a una herradura.

| Capa / metadato | Qué preservar | Por qué |
|---|---|---|
| Base | Archivo, ratio intrínseco, focal, encuadre por breakpoint, derecho/origen. | Mantiene sujeto y espacio negativo al cambiar viewport. |
| Campo de lectura 2D | Color del suelo, máscara/velo y dirección; seam arriba/abajo. | Texto legible y continuidad con bandas vecinas. |
| Sujeto recortado | Alfa + misma caja/focal/ratio que la base. | Oculta luz/efectos detrás del sujeto sin duplicación visible. |
| Ancla | Coordenadas relativas a la imagen o marcador DOM, no píxeles del screenshot. | El objeto virtual sigue registrado con la foto al redimensionar. |
| Objeto 3D | Fuente editable, GLB, unidades/ejes/pivote/nodos, material/luz/sombra/cámara. | Permite modificar y volver a exportar sin romper interacción. |
| Lifecycle | Carga diferida, resize, visible/oculto, motion, dispose y fallo de carga/WebGL. | Evita procesos permanentes o una sección vacía. |
| Acceso | Enlaces/botones HTML, nombre accesible, fallback legible, decorativos aria-hidden. | La información no queda atrapada en canvas. |

## Itinerario con carruaje

[Route scene](../project-skeleton/reference/components/site/jornadas-route/route-scene.ts) y
[config](../project-skeleton/reference/components/site/jornadas-route/config.ts) se conservan completos.
Modelo creado con Blender, archivos .blend/.glb y generador en assets/3d/carruaje del snapshot.
La ruta y discos se construyen en Three.js; no son un vídeo renderizado en Blender.

Mapa en plano XZ, +Y arriba, cámara cenital. Dos layouts wide/narrow (corte600px); coordenadas de
caja de diseño se convierten a mundo. Nodos GLB: JIA_Wagon_ROOT, JIA_FrontSteer, cuerpo y cuatro
ruedas según config; forward−Z, rueda ejeX, dirección ejeY. Mantener nombres o adaptar loader.
Paradas se derivan de talleres; slots8 y fallback de reparto cuando no alcanzan. Si cambian cantidad
u orden, probar ruta, separación y enlaces al ID correcto. Fondo transparente para compartir duna.

## Aula con luz y oclusión

[Experiences](../project-skeleton/reference/components/site/Experiences.tsx), CSS y sun-rays:
foto → rótulo decorativo en coordenadas de pizarra → rayos → cutout de la misma profesora → contenido.
Un punto o porcentaje relativo a viewport rompería el registro al recortar la foto; usar el rectángulo
real donde se dibuja. En desktop1280px, altura por ratio1919/820; comprobar que título/tira caben.
La escena es una mejora visual: la tira y su visor no dependen de los rayos.

## Footer

[Footer](footer.md) documenta el poste y el objeto. Para otra temática elegir un objeto coherente
con la escena: producto, instrumento, escultura, etc.; registrar su apoyo/anclaje y dar un gesto con
respuesta clara. Si el 3D no añade significado, conservar la foto/velo y la lectura sin él.

La captura14 muestra el aspecto compuesto; la edición separada conserva la posibilidad de cambiar
una capa. No aplanar canvas/texto/botones dentro de una imagen final al reutilizar el patrón.
