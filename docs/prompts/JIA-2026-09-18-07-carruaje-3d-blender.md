# JIA-2026-09-18-07 — Carreta western cubierta en Blender (asset 3D para el mapa de Jornadas)

**Fecha:** 2026-09-18 · **Origen:** petición directa del promotor en chat (invocada como
`/mcp__blender__asset_creation_strategy`). Imagen de referencia aportada: `assets/images-website/carruaje.png`.

**Adendas del promotor durante la ejecución:**

- El mapa irá dentro del `div` ya existente `jornadas-mapa` (panel de texto de Jornadas), visualmente
  debajo del párrafo «Un punto de encuentro para docentes… son el hilo conductor.», sin ampliar la
  sección en anchura ni altura y sin salirse de la zona beis bajo el texto. (Contexto para la fase
  siguiente; esta petición no integra el mapa.)
- Guardar el input completo como nuevo prompt (este fichero).

## Encargo (transcripción íntegra del promotor)

Actúa como Technical Artist sénior especializado en Blender, modelado de assets estilizados para tiempo real y preparación de modelos para Spline e integración web.

Debes CREAR EN BLENDER una carreta western cubierta con lona, basada en la imagen adjunta. No te limites a explicar cómo hacerlo ni a devolver otro prompt: utiliza las herramientas disponibles para producir el modelo, su archivo fuente, su exportación y las evidencias de validación.

PROYECTO
web-jia — Jornadas de Innovación de Almería.

CONTEXTO DE USO
La carreta será un elemento móvil sobre un mapa interactivo con seis puntos de destino. Se verá principalmente desde arriba y recorrerá trayectorias curvas, con cambios de dirección y posibles bucles: por ejemplo, describir un círculo o regresar hacia una zona anterior antes de continuar.

Después importaremos el modelo en Spline v2 para trabajar la escena y la animación. La integración web se decidirá posteriormente, respetando el stack real de web-jia.

ALCANCE ACTUAL
Crear y validar el asset en Blender, preparado para esa siguiente fase.

No construyas todavía el mapa, la animación final en Spline ni la integración de la web. La preparación para animarlo sí forma parte del trabajo.

────────────────────────────────────────
1. INSPECCIÓN INICIAL Y ENTORNO
────────────────────────────────────────

Antes de modelar:

Localiza la raíz real del proyecto y revisa las instrucciones aplicables de gobernanza, los assets y la documentación de identidad visual. Respeta el nombre y las mayúsculas reales de las carpetas; no crees una segunda raíz del proyecto.

Busca especialmente la carpeta assets, las referencias visuales de JIA y los documentos de estilo existentes. No recorras indiscriminadamente otros proyectos ni cargues documentación ajena a esta tarea.

Localiza y abre la imagen de referencia de la carreta, adjunta a esta petición o disponible como carruaje.png. Si no puedes acceder a ella, solicita su ubicación: no la sustituyas por una referencia inventada.

Comprueba la versión de Blender y las herramientas realmente disponibles. Utiliza el MCP de Blender si está conectado y autorizado; alternativamente, usa Blender mediante un script Python con bpy.

No inventes herramientas, APIs ni operaciones ejecutadas.

Trabaja en un archivo nuevo. No borres la escena abierta del usuario, no sobrescribas originales y no cambies configuraciones globales. Respeta los controles de seguridad y permisos del proyecto.

Si Blender no puede ejecutarse, entrega un script reproducible y explica el bloqueo, sin afirmar que has generado o validado un .blend o un .glb.

────────────────────────────────────────
2. DIRECCIÓN ARTÍSTICA Y FIDELIDAD
────────────────────────────────────────

La referencia principal para la forma es la imagen adjunta.

Debes conservar:

- Caja de madera cálida construida con tablones y refuerzos verticales.
- Cubierta de lona clara, arqueada y alargada.
- Varios arcos o bandas transversales perceptibles en la cubierta.
- Cuatro ruedas de madera con radios, bujes y aros.
- Ejes y estructura inferior sencillos pero coherentes.
- Abertura frontal y pequeño conjunto frontal de madera asociado al puesto de conducción.

Reconstruye de forma plausible las partes que la imagen no muestra. No copies como geometría las deformaciones de su perspectiva: las ruedas de un mismo eje deben tener el mismo tamaño.

Puedes interpretar las ruedas traseras como ligeramente mayores que las delanteras, manteniendo las proporciones generales de la referencia.

ESTILO BUSCADO

Una miniatura tridimensional elegante, cálida y reconocible, compatible con el western editorial de web-jia.

Formas limpias, materiales mates, madera en tonos miel y marrón, lona crema y herrajes oscuros discretos. Usa la paleta existente cuando esté documentada.

Mantén un nivel de detalle contenido. El interés debe proceder de la silueta, los volúmenes, las proporciones y una iluminación cuidada.

No busco un juguete de plástico, una caricatura infantil ni un objeto hiperrealista cargado de suciedad, grietas y microtexturas.

No modernices la carreta con hormigón, neones o elementos tecnológicos aunque otras referencias del proyecto utilicen arquitectura contemporánea.

No añadas caballos, conductor, personas, armas, carteles, logotipos, equipaje ni grandes varales ausentes de la referencia.

────────────────────────────────────────
3. VISTA CENITAL: REQUISITO PRINCIPAL
────────────────────────────────────────

Construye un modelo 3D completo. La vista desde arriba debe conseguirse con la cámara, no aplanando el objeto.

Crea estas cámaras de revisión:

A. JIA_Camera_Top
Cámara ortográfica exactamente encima del modelo, mirando verticalmente hacia abajo. La parte frontal de la carreta debe apuntar hacia la parte superior de la imagen.

Esta es la vista principal y debe quedar activa al guardar el archivo.

B. JIA_Camera_TopTilt
Segunda cámara ortográfica con una desviación aproximada de 10–15 grados respecto a la vertical, solo para evaluar una alternativa con más lectura de volumen.

No sustituye a la cenital estricta.

C. JIA_Camera_Review
Vista de tres cuartos para comprobar que el modelo está construido correctamente.

LECTURA DESDE ARRIBA

La lona será la superficie dominante. Modela su curvatura y unas pocas variaciones suaves entre arcos para que no parezca una caja blanca o un cilindro perfecto.

El frontal debe distinguirse de la parte trasera mediante su geometría: abertura, asiento o volumen saliente. No añadas flechas ni texto para indicar el sentido de marcha.

Evita que la cubierta oculte por completo el tren de rodaje. Ajusta moderadamente la anchura de vía o el vuelo de la lona si resulta necesario, sin deformar la referencia.

En cenital estricta las ruedas se verán principalmente de canto. NO las tumbes ni las orientes hacia la cámara para mostrar los radios.

Comprueba la legibilidad a tamaños pequeños: aproximadamente 96, 160 y 256 píxeles de longitud visible del vehículo. Simplifica los detalles que se conviertan en ruido.

No uses desenfoque de profundidad de campo en estas pruebas.

────────────────────────────────────────
4. JERARQUÍA Y PIVOTES PARA ANIMACIÓN
────────────────────────────────────────

El asset no puede ser una única malla fusionada si eso impide mover sus componentes.

Organiza una jerarquía equivalente a esta, con nombres únicos, estables y sin espacios:

JIA_Wagon_ROOT
├── JIA_Chassis
├── JIA_BodyMotion
│   ├── JIA_Body
│   ├── JIA_Canvas
│   ├── JIA_DriverSeat
│   └── JIA_Details
├── JIA_FrontSteer
│   ├── JIA_FrontAxle
│   ├── JIA_Wheel_FL
│   └── JIA_Wheel_FR
├── JIA_Wheel_RL
└── JIA_Wheel_RR

ROOT, BodyMotion y FrontSteer deben funcionar como nodos de transformación; no necesitan geometría visible.

Puedes ajustar la distribución de las piezas estáticas, pero conserva este contrato de control y documenta cualquier cambio.

JIA_Wagon_ROOT
Controlará el desplazamiento y la orientación del vehículo completo. Sitúa su origen en el plano del suelo, centrado lateralmente y entre los ejes.

JIA_BodyMotion
Permitirá un balanceo muy sutil de la caja, lona y elementos asociados. Su pivote debe resultar adecuado para ese movimiento.

El balanceo de este nodo no debe levantar automáticamente las ruedas del suelo.

JIA_FrontSteer
Sitúa su pivote en el centro del eje delantero para permitir el giro conjunto del tren delantero alrededor del eje vertical.

No simules una dirección de automóvil con mecanismos complejos: prepara una solución sencilla y coherente con una carreta.

RUEDAS
Cada rueda debe tener el origen exactamente en el centro de su buje y un eje local de rotación correctamente orientado.

Izquierda y derecha se definirán desde la perspectiva de quien ocupa el vehículo mirando hacia delante, no desde la cámara.

Si las ruedas delanteras y traseras tienen radios diferentes, coloca sus centros a las alturas correspondientes para que las cuatro apoyen en el mismo plano.

Verifica que el giro de dirección no provoque intersecciones evidentes con la caja o el chasis. Documenta el rango útil comprobado.

COORDENADAS DE AUTORÍA EN BLENDER

- +Z: arriba.
- +Y: avance del vehículo.
- +X: derecha del vehículo.
- Suelo: Z = 0.
- Escala uniforme y positiva.

Usa una escala coherente y documentada; como referencia de trabajo puedes normalizar la longitud total del vehículo a unas tres unidades métricas, manteniendo las proporciones de la imagen.

Registra dimensiones, distancia entre ejes y radios de rueda.

Aplica las transformaciones necesarias sin destruir los pivotes ni las relaciones de parentesco. Comprueba la conversión de ejes del GLB exportado y documenta su orientación real; no supongas que todos los importadores mostrarán los mismos ejes locales.

────────────────────────────────────────
5. GEOMETRÍA, MATERIALES Y PRESUPUESTO
────────────────────────────────────────

GEOMETRÍA

Usa biseles pequeños donde aporten lectura de volumen.

Construye la lona con geometría ligera, curvatura suave, bordes resueltos y una abertura frontal creíble. Evita transparencias para simular un hueco que puede resolverse geométricamente.

No utilices simulación de tela, física, partículas, pelo ni subdivisiones excesivas.

Agrupa las piezas estáticas que no necesiten movimiento independiente. No conviertas cada clavo, radio o tablón en un objeto separado.

Conserva editabilidad razonable en el .blend y prepara una exportación limpia.

MATERIALES

Utiliza materiales PBR sencillos, orientados a una exportación glTF estándar.

Prioriza color base y rugosidad. Reserva el carácter metálico para los herrajes que realmente lo requieran.

Evita depender de nodos complejos exclusivos de Blender. Si empleas procedimientos para crear alguna textura necesaria, hornea el resultado a mapas compatibles antes de exportar.

No hornees iluminación direccional en el color base: la carreta cambiará de orientación en el mapa.

La lona debe seguir leyéndose sobre un fondo claro tipo pergamino. Resuélvelo con volumen, tonalidad y contraste contenido, no con contornos negros gruesos.

PRESUPUESTO INICIAL DEL ASSET

- Objetivo: aproximadamente 5.000–12.000 triángulos.
- Techo orientativo: 20.000 triángulos, justificando cualquier exceso.
- Hasta seis materiales compartidos como objetivo.
- GLB preferiblemente inferior a 1 MB; intenta no superar 2 MB.
- Sin texturas si el resultado visual lo permite.
- Cuando sean necesarias, usa mapas pequeños y evita 4K.

Estos son objetivos de diseño, no garantías de rendimiento. Mide el resultado.

Distingue entre número de objetos, mallas, materiales y primitivas exportadas. No presentes una estimación de draw calls como una medición real del navegador.

────────────────────────────────────────
6. PREPARACIÓN PARA EL RECORRIDO
────────────────────────────────────────

No animes todavía el itinerario definitivo ni lo incrustes en el GLB principal.

El modelo debe permanecer en pose de reposo, colocado en el origen y disponible para cualquier recorrido posterior.

Documenta cómo controlarlo para estas situaciones:

- Avance entre seis destinos.
- Curvas suaves y cambios de rumbo.
- Un bucle que regresa hacia una zona anterior y continúa.
- Paradas y reanudaciones.
- Balanceo discreto de la carrocería.
- Rotación de ruedas proporcional al desplazamiento.

El recorrido futuro deberá estar separado de la geometría del vehículo y ser configurable.

Los seis destinos no implican limitar la curva a seis puntos de control. Deja claro que los destinos y los puntos necesarios para dibujar el camino son conceptos distintos.

Para el handoff técnico, establece estos criterios:

El rumbo debe seguir la tangente de la trayectoria, sin saltos al cruzar 0/360 grados.

El progreso de movimiento debe poder relacionarse con distancia recorrida para evitar aceleraciones involuntarias entre tramos.

El giro de una rueda debe derivarse de la distancia recorrida y de su radio: ángulo en radianes = distancia / radio, con el signo que corresponda a sus ejes.

Una rueda no debe seguir girando cuando el vehículo está detenido.

Un círculo o un regreso por el mapa debe resolverse mediante la trayectoria, no haciendo girar la carreta sobre sí misma como una peonza.

Documenta que habrá que respetar un radio de giro compatible con la distancia entre ejes y el rango de dirección.

No implementes un simulador físico para resolver esta fase. Prepara un asset controlable y un contrato claro.

────────────────────────────────────────
7. EXPORTACIÓN Y SIGUIENTE FASE EN SPLINE
────────────────────────────────────────

Entrega como formato principal:

jia-carruaje.glb

Exporta únicamente el vehículo y sus nodos de control necesarios.

No incluyas cámaras de revisión, luces, suelo, imagen de referencia, marcadores de prueba ni escenarios.

Conserva nombres, jerarquía, materiales y pivotes. No fusiones las ruedas con la carrocería ni elimines los nodos de control durante la optimización.

El GLB principal debe estar sin animación de recorrido y sin depender de constraints o drivers de Blender.

Prepara primero una versión estándar sin Draco, Meshopt ni KTX2. No introduzcas compresiones o extensiones hasta comprobar su compatibilidad con el importador de destino.

Si existen texturas, intégralas en el GLB y evita rutas absolutas a archivos locales.

Reimporta el GLB en una escena de validación independiente y comprueba el resultado. No alteres el .blend fuente para realizar esta prueba.

IMPORTANTE SOBRE EL FLUJO POSTERIOR

No des por hecho que las animaciones o interacciones creadas en Spline se trasladarán a una exportación Three.js.

En el handoff diferencia:

A. Spline como entorno de escena y animación, con integración web mediante su runtime y control externo cuando sea necesario.

B. GLB cargado directamente en Three.js, con animación y recorrido implementados en código.

GSAP podrá utilizarse como controlador de tiempos o propiedades cuando aporte valor; no lo presentes como sustituto de un renderizador 3D.

La decisión de integración queda para la siguiente fase. No instales ahora runtimes web ni modifiques la aplicación.

No realices todavía la importación en Spline. Indica expresamente que la compatibilidad final allí queda pendiente de una prueba real.

────────────────────────────────────────
8. PREVISUALIZACIONES Y ENTREGABLES
────────────────────────────────────────

Usa una iluminación de presentación suave y cálida, con sombras contenidas y materiales legibles. Añade también una revisión con iluminación neutra para detectar problemas de materiales.

El acabado cinematográfico no debe depender de niebla, bloom intenso o efectos que oculten defectos.

Genera:

1. jia-carruaje.blend
   Fuente editable, organizada y guardada con la cámara cenital activa.

2. jia-carruaje.glb
   Asset limpio y preparado para importación.

3. generate-carruaje.py
   Script reproducible de generación o reconstrucción, con comentarios,
   comprobaciones de rutas y manejo de errores.

4. Archivo de configuración de generación
   Centraliza dimensiones, proporciones, paleta y parámetros relevantes.

5. previews/
   PNG con transparencia de la vista cenital principal,
   de la vista superior ligeramente inclinada
   y de la vista de tres cuartos.

6. HANDOFF-SPLINE.md
   Incluye jerarquía, nombres de control, pivotes, ejes, escala,
   radios de rueda, distancia entre ejes, configuración de cámaras,
   materiales, limitaciones y pasos de importación pendientes.

7. VALIDATION.md
   Incluye comprobaciones realizadas, resultados, métricas,
   advertencias y bloqueos.

Adapta la ubicación a las convenciones existentes. Si no hay una carpeta definida para modelos 3D, utiliza una subcarpeta assets/3d/carruaje/ dentro de la raíz real del proyecto.

Los scripts solo deben escribir en las rutas autorizadas. Al regenerar, no borres contenido ajeno ni sobrescribas versiones del usuario sin permiso.

────────────────────────────────────────
9. VALIDACIÓN Y REVISIÓN CRÍTICA
────────────────────────────────────────

Antes de dar el trabajo por terminado, revisa el resultado desde dos funciones:

ARTISTA 3D
Comprueba parecido con la referencia, proporciones, silueta cenital,
lectura del sentido de marcha, materiales y ausencia de ruido visual.

INGENIERO DE GRÁFICOS EN TIEMPO REAL
Comprueba jerarquía, pivotes, exportación, presupuesto, control de
componentes y riesgos de integración en Spline y web.

Pruebas mínimas:

- Abrir el .blend guardado.
- Reimportar el GLB y comparar su estructura y aspecto.
- Comprobar nombres únicos y los cuatro pivotes de rueda.
- Girar individualmente cada rueda 360 grados, sin que orbite alrededor
  de un punto incorrecto.
- Probar el giro del tren delantero a ambos lados.
- Girar la raíz del vehículo 360 grados y revisar todas las orientaciones.
- Confirmar que las cuatro ruedas apoyan en el mismo plano.
- Revisar normales, superficies desaparecidas, intersecciones relevantes
  y materiales ausentes.
- Verificar que el GLB no incluye elementos de presentación.
- Revisar legibilidad a los tamaños pequeños indicados.
- Restaurar la pose de reposo antes de la exportación definitiva.

Una reimportación correcta en Blender no acredita por sí sola una
importación correcta en Spline. Diferencia ambas validaciones.

Corrige los defectos encontrados antes de cerrar. No marques como PASS
una prueba no ejecutada ni afirmes que el asset está integrado en la web.

RESPUESTA FINAL

Entrega las rutas reales de los archivos creados, las previsualizaciones
y un resumen de:

- Qué se ha generado.
- Qué se ha validado efectivamente.
- Triángulos, mallas, materiales y peso del GLB.
- Qué queda pendiente para Spline.
- Cualquier limitación que pueda afectar a la animación posterior.

Empieza por inspeccionar la referencia y el entorno. Después ejecuta
la creación y validación del modelo, sin ampliar el alcance al mapa
ni a la web.
