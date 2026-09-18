# JIA-2026-09-18-08 — Carruaje sobre un camino de seis paradas en «LAS JORNADAS» (Three.js + GSAP)

**Fecha:** 2026-09-18 · **Origen:** petición directa del promotor en chat, tras JIA-2026-09-18-07 (asset
Blender). Captura adjunta: la web real en `localhost:3005/#jornadas` (jinete, título, párrafo y cartel bajo
el párrafo). Cierre pedido por el promotor: «commit antes de ejecutar. Ejecuta. Commit al terminar. y gh push».

## Encargo (transcripción íntegra del promotor)

Actúa como desarrollador sénior de frontend y gráficos en tiempo real, con experiencia en Three.js, GSAP y dirección de movimiento para interfaces editoriales.

Implementa en el proyecto real web-jia una animación de un carruaje sobre un camino con seis paradas, integrada en la sección "LAS JORNADAS".

No te limites a explicar la solución: inspecciona el proyecto, implementa el componente, ejecútalo y valida el resultado con las herramientas disponibles.

CAMBIO DE DIRECCIÓN TÉCNICA

Esta petición sustituye la integración prevista con Spline.

El flujo será:

Blender → modelo GLB → Three.js + GSAP → web-jia.

No incorpores Spline a este componente. Conserva los archivos fuente de Blender existentes y reutiliza el modelo exportado.

No elimines dependencias o componentes ajenos a esta tarea.

────────────────────────────────────────
1. INSPECCIÓN Y ALCANCE
────────────────────────────────────────

Antes de modificar archivos:

- Lee las instrucciones de gobernanza aplicables al proyecto.
- Localiza la sección real "LAS JORNADAS".
- Revisa su estructura, estilos, comportamiento responsive y animaciones.
- Localiza la paleta y las fuentes ya utilizadas.
- Comprueba las versiones y la disponibilidad de Three.js y GSAP.
- Localiza el GLB del carruaje y su documentación de exportación.

Utiliza Impeccable si está disponible en el entorno, sin introducir una identidad visual nueva.

Respeta el stack existente. No migres la web a otro framework ni añadas React Three Fiber, motores físicos u otras capas innecesarias.

Trabaja únicamente dentro del workspace autorizado. No sobrescribas cambios del usuario, no hagas limpieza destructiva y no publiques en producción.

Si el GLB no está disponible, desarrolla el camino y sus estados con una representación provisional claramente identificada, mantén un fallback utilizable y comunica el bloqueo. No presentes el carruaje como integrado.

────────────────────────────────────────
2. INTEGRACIÓN EN LA SECCIÓN EXISTENTE
────────────────────────────────────────

La captura adjunta muestra la web real y define el contexto visual.

DEBE PERMANECER:

- La fotografía del jinete y el paisaje.
- Su encuadre, tratamiento de color y transición hacia el fondo.
- El título "LAS JORNADAS".
- El párrafo existente, sin reescribirlo.
- La tipografía, los colores y la composición general.

DEBE CAMBIAR:

Retira de esta sección el bloque del cartel situado debajo del párrafo, incluidos su adorno y pie si pertenecen al mismo bloque.

No borres los archivos del cartel del proyecto.

En ese espacio, debajo del texto y dentro de la columna derecha, integra el camino animado.

El componente debe utilizar el ancho disponible de esa columna, no limitarse al ancho del antiguo cartel.

No invadas la fotografía ni superpongas elementos sobre el párrafo.

No añadas una tarjeta, panel, borde, fondo rectangular o título adicional.

El fondo debe seguir siendo exactamente el de la sección: el canvas será transparente.

Ajusta el recorrido al espacio real. Evita aumentar innecesariamente la altura de la sección en escritorio o modificar con ello el encuadre de la fotografía.

────────────────────────────────────────
3. COMPOSICIÓN DEL CAMINO
────────────────────────────────────────

Diseña una ruta editorial cenital, apaisada y sinuosa, con seis paradas visualmente diferenciadas.

Debe parecer un camino trazado sobre el papel de la web, no una carretera de asfalto ni un circuito de videojuego.

Usa los colores reales del proyecto:
un tono arena o tierra para el recorrido y terracota para los estados destacados.

El camino debe tener presencia suficiente para leerse, pero menos peso visual que el carruaje y el contenido editorial.

PARADAS

Dibuja seis discos planos, ligeramente más anchos que el camino.

Como punto de partida visual, prueba un diámetro de aproximadamente 1,5–2 veces el grosor del trazado y ajústalo mediante capturas.

No los conviertas en botones gigantes, medallones, pines de mapas o carteles western.

Las etiquetas serán exactamente:

Parada 1
Parada 2
Parada 3
Parada 4
Parada 5
Parada 6

No inventes títulos de talleres, descripciones, horarios o destinos.

COMPOSICIÓN

Reserva desde el principio espacio a la derecha de cada círculo para su etiqueta.

"A la derecha" significa a la derecha en pantalla, independientemente de la dirección que lleve el carruaje.

Distribuye las paradas para que las etiquetas no se superpongan entre sí, con otros tramos del camino o con el vehículo.

No coloques dos paradas en una misma posición visual aunque la curva vuelva sobre esa zona.

Puedes incluir un regreso amplio o un pequeño bucle entre paradas si cabe con naturalidad. No fuerces un círculo cerrado que comprima la composición o exija un giro mecánicamente imposible.

Prioriza la claridad sobre la complejidad del trazado.

────────────────────────────────────────
4. SECUENCIA DE ANIMACIÓN
────────────────────────────────────────

La secuencia inicial será:

A. Se revela el trazado del camino.
B. Aparecen los seis círculos.
C. Aparece el carruaje al inicio.
D. Recorre la ruta y visita las seis paradas.
E. Termina detenido en la sexta.

Valores iniciales orientativos, centralizados en configuración:

- Revelado del camino: 0,8–1,2 segundos.
- Aparición de los círculos: breve y discreta.
- Aparición del carruaje: aproximadamente 0,25 segundos.
- Detención en cada parada: aproximadamente 0,7–1 segundo.
- Recorrido completo: aproximadamente 14–20 segundos.

Ajusta estos tiempos después de ver la animación dentro de la sección.

EN CADA PARADA

El carruaje debe desacelerar brevemente y detenerse.

Al llegar:

- El círculo adquiere un estado destacado discreto.
- Aparece a su derecha la etiqueta correspondiente.
- La etiqueta entra con opacidad y un desplazamiento mínimo.
- Permanece visible durante el resto del recorrido.
- Tras la espera, el vehículo continúa con un arranque suave.

Evita rebotes elásticos, grandes escalados o pulsaciones constantes.

AL TERMINAR

El carruaje queda en Parada 6.
Las seis etiquetas permanecen visibles.
La animación no vuelve a empezar automáticamente.

Incluye un control discreto "Repetir recorrido" y un control de "Pausar/Reanudar" mientras se reproduce.

No añadas sonidos.

────────────────────────────────────────
5. ESTRUCTURA DE THREE.JS
────────────────────────────────────────

Utiliza un único renderer para este componente y una cámara ortográfica cenital fija.

No incorpores OrbitControls ni movimientos de cámara.

Define explícitamente un sistema de coordenadas coherente; por ejemplo:

- Plano del mapa: XZ.
- Vertical del mundo: +Y.

Configura correctamente la orientación de la cámara cenital, sin utilizar un vector up paralelo a su dirección de mirada.

Comprueba la orientación real del GLB exportado desde Blender. No supongas que sus ejes locales coinciden con los del mundo.

Si hace falta, incorpora un grupo contenedor de movimiento y orientación, conservando la jerarquía interna del asset.

CAMINO

Usa CatmullRomCurve3, inicialmente de tipo centripetal, para definir el recorrido.

Los puntos de control dibujan la carretera.
Las seis paradas son posiciones sobre ella.
No confundas ambos conjuntos.

Representa el camino preferentemente mediante una cinta plana de geometría ligera.

No uses por defecto un tubo volumétrico que parezca una manguera.

El revelado del camino debe recorrer el trazado en orden, sin reconstruir toda su geometría en cada frame.

Los discos pueden ser CircleGeometry orientadas sobre el plano del mapa.

Resuelve correctamente el orden de dibujo y las pequeñas separaciones entre superficies para evitar parpadeos.

Toda la representación debe permanecer sobre el fondo transparente.

────────────────────────────────────────
6. MOVIMIENTO POR DISTANCIA
────────────────────────────────────────

Centraliza el desplazamiento en una sola variable:

distanceWorld

Su unidad debe ser coherente con la escala del mapa y del vehículo.

Utiliza:

routeLength = curve.getLength()
u = clamp(distanceWorld / routeLength, 0, 1)

Consulta con ese mismo u:

curve.getPointAt(u)
curve.getTangentAt(u)

No pases directamente distanceWorld a getPointAt().
No confundas el parámetro t de la curva con la distancia normalizada u.

Configura las paradas con identificador estable, etiqueta y posición normalizada de longitud de arco, ordenadas de principio a fin.

Calcula su distancia a partir de la longitud de la ruta.

Ajusta la resolución de la aproximación de longitud de arco si fuera necesario y actualiza su caché cuando cambie la curva.

ORIENTACIÓN

Orienta el carruaje según la tangente del recorrido, con un eje vertical estable y quaternions compatibles con la orientación de reposo del modelo.

No introduzcas saltos al cruzar 0/360 grados.
No permitas que ruede lateralmente o se incline por un cálculo de orientación incorrecto.

El balanceo de la carrocería se aplicará por separado.

BUCLES

Los regresos espaciales deben formar parte del trazado.

La distancia recorrida puede seguir aumentando mientras el camino vuelve hacia una zona anterior.

No simules ese regreso invirtiendo el tween ni haciendo girar la carreta sobre sí misma.

PARADAS Y GSAP

Utiliza un timeline con tramos de avance sobre distanceWorld y esperas temporizadas entre ellos.

Mantén una sola fuente de verdad para el desplazamiento, aunque existan varios tweens secuenciales.

No uses pause() como espera automática sin mecanismo de reanudación.

Relaciona la duración de los tramos con su longitud. Añade únicamente las aceleraciones y frenadas deliberadas de salida y llegada.

Evita oscilaciones de velocidad involuntarias entre puntos de control.

Las llegadas deben detectarse de forma robusta, sin depender de igualdad exacta entre números decimales.

Cada parada debe activarse una sola vez por reproducción.

────────────────────────────────────────
7. CARRUAJE Y TRAQUETEO
────────────────────────────────────────

Carga el GLB mediante GLTFLoader y comprueba los nodos disponibles.

Contrato esperado:

JIA_Wagon_ROOT
JIA_BodyMotion
JIA_FrontSteer
JIA_Wheel_FL
JIA_Wheel_FR
JIA_Wheel_RL
JIA_Wheel_RR

Confirma los nombres reales y conserva sus transformaciones de reposo.

Los valores mencionados anteriormente:

- Radio delantero: 0,35.
- Radio trasero: 0,44.
- Dirección: ±17°.

Deben contrastarse con el asset y su documentación.

No los conviertas en constantes definitivas sin comprobar sus unidades, escala y validación.

RUEDAS

La rotación se derivará de distancia recorrida / radio.

Utiliza el eje local de giro y el signo realmente comprobados en cada rueda; no presupongas rotation.x para todos los modelos.

Distancia y radio deben estar expresados en unidades compatibles después de aplicar la escala del vehículo.

Las ruedas deben detenerse cuando se detiene el carruaje.

Evita acumulaciones de error al repetir el recorrido: calcula la pose respecto a su estado inicial.

DIRECCIÓN

Controla JIA_FrontSteer según el giro del recorrido y el rango útil del modelo.

Comprueba que la escala del vehículo, la distancia entre ejes y el radio de las curvas son compatibles.

Limitar visualmente el ángulo de dirección no justifica que el carruaje atraviese una curva demasiado cerrada patinando.

Si ocurre, corrige el trazado o la escala.

TRAQUETEO

Introduce un balanceo muy pequeño durante la marcha y dos o tres irregularidades puntuales del camino.

Deben transmitir peso y rodadura, no un objeto flotante.

Aplica el movimiento principalmente a JIA_BodyMotion:

- Balanceo lateral mínimo.
- Cabeceo breve.
- Asentamiento amortiguado después de un bache.

Las ruedas deben seguir apoyadas de manera creíble.

Desde la vista cenital, comprueba que el traqueteo se percibe en la inclinación de la carrocería y su sombra, no únicamente mediante una traslación vertical.

No exageres el movimiento para hacerlo visible.

Define los baches en posiciones configurables del recorrido, preferentemente lejos de las paradas.

Utiliza una respuesta suave y reproducible; no generes ruido aleatorio diferente en cada frame.

La amplitud debe disminuir al frenar y desaparecer al detenerse, con un asentamiento breve si procede.

No sacudas la cámara ni desplaces lateralmente la raíz fuera del camino.

No incorpores simulación física, partículas de polvo o motion blur.

ILUMINACIÓN

Utiliza iluminación cálida y contenida que conserve la lectura de la madera y la lona.

Añade una sombra de contacto ligera si mejora la integración.

Evita postprocesado pesado y efectos que conviertan el componente en una escena visualmente independiente.

────────────────────────────────────────
8. ETIQUETAS HTML Y RESPONSIVE
────────────────────────────────────────

Representa las etiquetas con HTML y las fuentes existentes.

Ancla cada etiqueta a la posición proyectada de su círculo, con un desplazamiento horizontal hacia la derecha y separación suficiente.

Calcula sus posiciones respecto al contenedor real del componente y en píxeles CSS.

No posiciones textos con coordenadas absolutas del viewport.

Como las paradas y la cámara son estáticas durante la reproducción, no recalcules sus posiciones en cada frame si no es necesario.

Actualiza su colocación cuando cambien el contenedor, la cámara, las fuentes o el trazado.

RESPONSIVE

Diseña el recorrido para el espacio disponible bajo el párrafo.

En móvil puedes utilizar otra disposición de puntos de control, conservando las seis paradas y su orden.

No escales todo hasta que el carruaje y las etiquetas sean ilegibles.

Mantén las etiquetas a la derecha de los círculos ajustando la composición, los márgenes o la altura del componente.

Evita overflow horizontal y recortes de las ruedas al girar.

Si cambia el tamaño durante la animación, conserva la parada o tramo actual y su progreso relativo.

No reinicies la reproducción ni vuelvas a revelar etiquetas por un simple resize.

Reserva el espacio del componente antes de cargar el GLB para evitar saltos de layout.

────────────────────────────────────────
9. REPRODUCCIÓN, ACCESIBILIDAD Y RECURSOS
────────────────────────────────────────

Inicia la secuencia cuando el componente esté suficientemente visible y sus recursos estén preparados.

Para esta implementación no utilices scroll scrubbing ni pinning.

El desplazamiento de la página debe seguir siendo natural.

Pausa la reproducción cuando el componente salga de pantalla o la pestaña quede oculta.

Al regresar, continúa desde el mismo estado, salvo que el usuario haya pausado manualmente.

No reinicies automáticamente por volver a entrar en el viewport.

MOVIMIENTO REDUCIDO

Con prefers-reduced-motion:

- Muestra el camino y las seis etiquetas sin secuencia obligatoria.
- No reproduzcas desplazamiento ni traqueteo automáticos.
- Presenta una composición estática coherente.

ACCESIBILIDAD

Mantén las seis paradas disponibles como contenido HTML accesible sin obligar a esperar a la animación.

Evita duplicar su lectura con alternativas redundantes.

Los controles deben funcionar con teclado y mostrar foco visible.

No anuncies cada actualización de la animación mediante aria-live.

No conviertas las etiquetas en enlaces sin destinos reales.

FALLOS

Si falla WebGL o la carga del GLB, presenta una alternativa estática legible con las seis paradas.

No dejes un rectángulo vacío ni un indicador de carga permanente.

RENDIMIENTO Y LIMPIEZA

Carga los recursos de manera diferida cuando corresponda.

Utiliza un único bucle de actualización y renderizado para el componente; no combines varios bucles redundantes.

No alteres el ticker global ni las animaciones de otras secciones.

Limita razonablemente la densidad de píxeles según las pruebas.

Reutiliza vectores y quaternions en las actualizaciones frecuentes.

No recrees geometrías, materiales o elementos HTML por frame.

Detén el renderizado continuo al completar la animación, salvo que exista una transición local pendiente.

Al desmontar el componente, libera exclusivamente sus recursos, listeners, observadores, callbacks y animaciones.

────────────────────────────────────────
10. CONFIGURACIÓN Y VALIDACIÓN
────────────────────────────────────────

Centraliza en una configuración pequeña:

- Ruta del GLB.
- Puntos de control de cada disposición.
- Las seis paradas y sus etiquetas.
- Escala del carruaje.
- Dimensiones y ejes verificados del modelo.
- Colores y grosor del camino.
- Duraciones de avance, revelado y espera.
- Posición e intensidad de los baches.
- Parámetros de balanceo y dirección.

No construyas un editor visual ni un sistema genérico de mapas para esta tarea.

VALIDA COMO DESARROLLADOR

- La ruta tiene exactamente seis paradas.
- Se visitan en el orden correcto.
- Cada etiqueta aparece una sola vez por reproducción.
- Las etiquetas anteriores permanecen visibles.
- Las ruedas se detienen durante las esperas.
- La orientación es continua en todas las curvas.
- Los baches no desplazan el vehículo fuera del camino.
- Repetir restaura correctamente el estado inicial.
- Pausar y reanudar conserva el estado.
- Redimensionar no duplica eventos ni reinicia el recorrido.
- No se duplican renderers o listeners al montar de nuevo.
- Funcionan movimiento reducido y fallos de carga.

REVISA TAMBIÉN COMO DISEÑADOR DE INTERACCIÓN

- La fotografía, el título y el párrafo mantienen su composición.
- El camino parece integrado en el fondo.
- Las etiquetas quedan a la derecha y no colisionan.
- El carruaje se reconoce al tamaño real de uso.
- El movimiento acompaña al contenido sin competir con él.
- La sección no se convierte en un panel de videojuego.
- La versión móvil no pierde legibilidad.

Obtén evidencias en escritorio, tablet y móvil con las herramientas disponibles.

Captura al menos el estado inicial, una parada intermedia y el estado final.

Mide el peso del GLB y las métricas de renderizado relevantes. No prometas una tasa de fotogramas universal ni presentes estimaciones como mediciones.

ENTREGA

Implementación en el proyecto, archivos modificados, ubicación de la configuración, evidencias visuales y resultados de las pruebas ejecutadas.

Indica los bloqueos o las comprobaciones pendientes.

No marques como validada una prueba que no hayas realizado.

Empieza inspeccionando la sección y el modelo existente. Después implementa el componente y ajusta su composición dentro de la web real. -> commit antes de ejecutar. Ejecuta. Commit al terminar. y gh push ;) <3
