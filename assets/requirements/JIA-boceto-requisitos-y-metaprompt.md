# JIA — Contenido web, boceto de requisitos y metaprompt de implementación

**Proyecto:** JIA · Jornadas de Innovación de Almería  
**Título de las jornadas:** «Aula de cine: El reto»  
**Versión:** 0.1 · 17 de septiembre de 2026  
**Estado:** boceto evolutivo para una primera aproximación, no especificación cerrada.  
**Destinatario:** agente con acceso al repositorio y a sus assets reales.

> Este documento organiza la intención del promotor, propone el contenido que falta y establece cómo aterrizarlo sin convertir las suposiciones en información oficial. La parte I contiene el boceto; la parte II es el metaprompt de ejecución y remite a ella, sin duplicarla.

## Parte I — Boceto de requisitos

### 1. Objetivo, alcance y margen de decisión

Crear una landing de las Jornadas de Innovación de Almería dirigida al profesorado de distintas etapas educativas de la provincia. Debe presentar las jornadas, explicar su funcionamiento, facilitar la consulta del programa y los talleres, dar visibilidad a experiencias educativas transferibles y preparar los canales de participación.

La identidad conecta educación, innovación y cine western almeriense. El resultado debe ser limpio, visual y reconocible, no una plantilla genérica de evento con decoración western superpuesta.

El agente tiene libertad para decidir composición, jerarquía, proporciones, distribución de imágenes, componentes, microinteracciones y nombres de navegación. Debe conservar la intención de las cinco áreas principales y fundamentar sus decisiones en los assets existentes. No es obligatorio reproducir píxel a píxel el render ni adoptar las propuestas de diseño de este documento.

La primera entrega será un **boceto funcional y responsive**, con contenido provisional donde falte información y una estructura fácil de actualizar. No incluye por defecto backend, base de datos, autenticación, CMS, inscripciones, envío de formularios, analítica ni publicación en producción.

#### Cómo distinguir el grado de certeza

| Estado | Qué significa | Cómo tratarlo |
|---|---|---|
| Confirmado en el briefing | Intención o condición expresada por el promotor. | Conservarla, salvo una incompatibilidad que deba explicarse. |
| Propuesta de este boceto | Solución de diseño, redacción o implementación sugerida. | Se puede mejorar o sustituir con justificación breve. |
| Pendiente de comprobar | Dato, archivo, relación o contenido todavía no verificado. | Resolver con el repositorio o representarlo como pendiente; nunca inventarlo como definitivo. |

Son condiciones del briefing: las cinco áreas, la duración de dos jornadas, el uso de los assets y la identidad existentes, la edición de contenido sin tocar componentes, la preparación multidioma, los enlaces configurables y el tratamiento visual digno de lo que todavía no está disponible.

### 2. Fuentes, assets y comprobaciones previas

**Limitación de este documento:** no se ha inspeccionado el repositorio ni se ha podido leer aquí el Markdown de identidad. Las rutas siguientes proceden de la descripción verbal. El agente que implemente debe comprobarlas y leer el documento real antes de decidir paleta, tipografía o composición.

La carpeta raíz fue deletreada como **WEB-JIA**, con J. Se utiliza `web-jia` como referencia lógica, no como afirmación sobre las mayúsculas del sistema de archivos. El nombre público es siempre **JIA**, no GIA.

| Referencia descrita | Contenido esperado | Comprobación del agente |
|---|---|---|
| `web-jia/assets/` | Recursos del proyecto. | Localizar la raíz y conservar las rutas reales. |
| Carpeta mencionada como `ZEP` | Logo, variantes y carteles de talleres. | Verificar si se llama `ZEP`, `CEP` u otra cosa; no corregir ni renombrar por intuición. |
| `assets/fonts/` | Fuentes de estilo western. | Identificar familias, pesos, formatos y condiciones de uso disponibles. |
| `assets/images-staff/` | Fotos o tarjetas de participantes. | Inventariar archivos y comprobar identidades y asociaciones documentadas. |
| `assets/images-website/` | Imágenes de la web. | Distinguir referencias de diseño de imágenes destinadas a publicarse. |
| `JIA-render-base.png` o variante real | Render de referencia del conjunto. | Abrirlo e inspeccionarlo visualmente. Verificar grafía y mayúsculas. |
| Imagen de hero terminada en `.png` | Imagen que se integrará en la cabecera. | Identificar el archivo exacto y su encuadre; no inventar el nombre. |
| Carpeta `style` y Markdown de identidad JIA | Paleta, tipografía y criterios visuales. | Localizar su ubicación real y **leer el MD completo**. |

#### Orden de trabajo con las fuentes

Primero, inspeccionar las instrucciones y convenciones del repositorio. Después, leer la identidad visual y observar el render y el hero. Por último, relacionar logos, carteles, fotografías y contenidos con los datos de la web.

Para cada decisión, utilizar la fuente adecuada: este briefing para la intención funcional; el MD para los tokens y reglas de marca; el render para la composición; y los documentos o assets oficiales para datos del evento y participantes. Una contradicción material debe registrarse, no resolverse silenciosamente. El render no autoriza a copiar como hechos fechas, textos o nombres que pudieran ser demostrativos.

El contexto visual previo apunta a papel o pergamino claro, sepias y terracota, fotografía cálida cinematográfica, lettering JIA western e iconografía artesanal monocroma. Es orientación complementaria: **no sustituye los valores ni las decisiones del MD real**. No mezclar automáticamente exploraciones visuales anteriores con la referencia actualmente seleccionada.

Si falta un archivo, continuar con la parte no bloqueada y declarar la carencia. No afirmar que se ha leído, visto o integrado un recurso inaccesible.

### 3. Arquitectura de información y navegación

Se propone una landing con anclas y, cuando resulte útil, paneles o vistas de detalle. No es obligatorio crear cinco páginas independientes ni fijar ahora el sistema de rutas.

| Orden | Etiqueta propuesta | Área que representa | Contenido o destino |
|---|---|---|---|
| 1 | **Jornadas** | Organización y funcionamiento. | Submenú: Programa, Cómo funcionan, Talleres. |
| 2 | **Dosieres** | Dosieres didácticos. | Recursos y materiales, con estado vacío hasta disponer de ellos. |
| 3 | **Experiencias** | Experiencias de éxito. | Casos educativos puestos en práctica y sus fichas. |
| 4 | **Propuestas** | Presenta tu propuesta. | Invitación a participar y futuro canal de presentación. |
| 5 | **Acoge JIA** | Acogida de futuras ediciones. | Invitación a ofrecer un centro o espacio y futuro formulario externo. |

«Jornadas» se propone porque abarca mejor programa, funcionamiento y talleres que «Organización», que también podría interpretarse como el equipo organizador. Las etiquetas son editables. No sacrificar claridad por reducir todos los elementos a una palabra.

**Experiencias ocupa la tercera posición, entre las cinco entradas.** Esa centralidad se refiere al orden del menú; no obliga a centrar geométricamente el enlace en toda la pantalla. En móvil se conserva el orden y se adapta el patrón de navegación.

La secuencia orientativa de lectura es: hero → Jornadas, con sus tres bloques → Dosieres → Experiencias → Propuestas → Acoge JIA → pie. El agente puede introducir destacados o conexiones entre áreas sin repetir secciones completas.

Los enlaces del menú navegan a secciones existentes aunque sus formularios o documentos todavía no estén disponibles. La ausencia de una URL de envío no debe inutilizar la navegación hasta la información de esa sección.

### 4. Hero y dirección visual

#### Contenido propuesto

| Elemento | Redacción inicial |
|---|---|
| Identificación | Jornadas de Innovación de Almería |
| Título | Aula de cine: El reto |
| Texto de apoyo | Dos jornadas para explorar nuevas formas de enseñar, compartir experiencias y llevar la creatividad del cine al aula. |
| Acción principal | Explorar las jornadas |
| Acción secundaria, opcional | Ver talleres |

Los destinos iniciales serán las secciones de Jornadas y Talleres. No presentar «Inscríbete» ni otra acción transaccional sin un proceso definido.

#### Integración del hero

Integrar la imagen de hero real para construir una primera pantalla similar o inspirada en `JIA-render-base.png`. Mantener textos y controles como elementos reales de la interfaz; no convertir una captura del render en toda la web ni depender del texto incrustado en una fotografía.

El agente decidirá si la imagen funciona mejor a sangre, en una composición dividida, integrada con el fondo o mediante otro tratamiento coherente. Los tamaños, puntos focales y recortes se deben comprobar en móvil y escritorio, no fijarse suponiendo que la composición de escritorio sirve para todo.

Usar las fuentes western como recurso de identidad, especialmente en marca o titulares. Para textos largos, navegación y fichas, priorizar una lectura cómoda. No es necesario que cada palabra parezca un cartel del oeste.

La textura, los iconos y los detalles cinematográficos deben acompañar el contenido. Evitar ornamentación repetitiva, efectos intensos y una colección de tarjetas idénticas para todas las secciones. No introducir colores de marca arbitrarios ni una estética alternativa sin contrastarla con el MD.

### 5. Jornadas: programa, funcionamiento y talleres

#### 5.1. Programa de dos días

Representar el cronograma como un timeline, dos bloques por jornada u otra solución que facilite entender la secuencia. La estructura debe permitir incorporar horas, espacios, sesiones y relaciones con talleres o experiencias cuando se confirmen.

Está confirmada la duración de **dos jornadas**, pero no sus horarios completos. En el contexto previo se mencionó el **sábado 17 de octubre** para los talleres. El agente debe contrastar el año y las fechas completas con fuentes del proyecto; no deducir y publicar automáticamente la fecha de la otra jornada.

Mientras falten esos datos, utilizar «Jornada 1» y «Jornada 2», con las fechas y horas sin valor. El siguiente contenido es únicamente una propuesta de secuencia para el boceto:

| Jornada | Bloques orientativos, no programa oficial |
|---|---|
| Jornada 1 | Bienvenida, presentación del reto y primer encuentro con las propuestas educativas. |
| Jornada 2 | Talleres, experiencias compartidas entre bloques y cierre de las jornadas. |

No inventar horas, aulas, ponentes, pausas, aforos, itinerarios ni un sistema de rotación. La mención a experiencias «entre talleres» expresa la intención de integrarlas en el desarrollo del evento; no demuestra una distribución temporal concreta.

Cada sesión podrá enlazar con un taller o una experiencia mediante su identificador. Sus nombres y descripciones se obtienen de la entidad correspondiente, no se copian a mano dentro del cronograma.

#### 5.2. Cómo funcionan

**Texto editorial propuesto, pendiente de validación:**

> Las JIA son un punto de encuentro para docentes que quieren explorar nuevas maneras de enseñar y compartir lo que sucede en sus aulas. Durante dos jornadas, el cine y el universo western almeriense sirven como hilo conductor de un recorrido por la creatividad y la innovación educativa.
>
> La propuesta combina talleres prácticos, experiencias compartidas y materiales de apoyo. Se trata de descubrir herramientas, conocer otros enfoques y pensar cómo adaptarlos a cada etapa, grupo y contexto de aprendizaje.
>
> Entre los talleres, las experiencias educativas permitirán conversar sobre propuestas llevadas a la práctica: cómo se desarrollaron, qué se aprendió y qué conviene tener en cuenta antes de trasladarlas a otra aula. El programa definitivo concretará los tiempos y la dinámica de participación.

No añadir promesas sobre certificación, créditos, gratuidad, materiales incluidos, selección de talleres o requisitos de asistencia mientras no se disponga de información oficial.

#### 5.3. Talleres

El número aproximado mencionado es **siete**, pero no está cerrado. Usarlo para comprobar la composición del boceto, no como constante funcional, titular definitivo o límite de la colección.

Cada taller debe disponer de una ficha y una representación resumida en la landing. Su estructura contemplará título, descripción, temática, objetivos o aprendizajes, persona o personas responsables, cartel o imagen y relación con el programa. Etapas educativas, duración, lugar y requisitos se muestran únicamente cuando exista contenido para ellos.

Temáticas mencionadas en el contexto previo, pendientes de contrastar con los carteles:

| Referencia de contenido | Qué puede prepararse |
|---|---|
| Vídeo y producción audiovisual | Un taller sobre creación de piezas audiovisuales con aplicación educativa. |
| Podcast | Un taller sobre el formato sonoro y sus posibilidades en el aula. |
| Scratch: «Por un puñado de bloques» | La denominación mencionada previamente, pendiente de comprobación en los assets. |
| Ilustración | Un taller relacionado con creación visual y expresión gráfica. |
| Resto hasta la aproximación de siete | Entradas de demostración marcadas como pendientes, sin inventar responsables o temáticas oficiales. |

Los resúmenes anteriores describen una intención, no sustituyen los objetivos oficiales. Si los carteles aportan información concreta, incorporarla a las constantes y registrar su procedencia.

No asociar automáticamente una fotografía a un taller por parecido visual, orden de archivos o una coincidencia débil de nombres. Una asociación desconocida queda sin asignar. No deducir la identidad de una persona por su rostro.

Cuando falte el cartel, la tarjeta conserva su espacio visual con un color sólido de la paleta. Cuando exista, sustituir la referencia del recurso debe bastar para utilizarlo sin rehacer el componente.

### 6. Dosieres didácticos

El contenido de esta sección todavía no está definido. Preparar un contenedor de recursos flexible, sin asumir un dosier por taller, un número de documentos ni un formato exclusivo.

**Título propuesto:** «Materiales para llevar las ideas al aula».

**Texto propuesto:**

> Este espacio reunirá los dosieres didácticos y materiales de apoyo de las jornadas. Un lugar al que volver para consultar orientaciones, recuperar recursos y seguir desarrollando las propuestas en el aula.

**Estado sin recursos:** «Los dosieres didácticos se incorporarán a esta sección cuando estén disponibles».

Un recurso podrá tener título, resumen, formato, URL, idioma y relaciones con talleres o experiencias. El tamaño, el número de páginas y la fecha de actualización son opcionales: no mostrarlos si no se conocen.

Usar acciones coherentes con el destino, como «Consultar material» o «Ver dosier». Reservar «Descargar» para una acción de descarga realmente implementada. No crear botones activos para archivos inexistentes.

### 7. Experiencias de éxito y fichas técnicas

Esta sección presenta experiencias que el profesorado ya ha llevado a la práctica y puede compartir con otros docentes. **No es una segunda lista de los talleres de las JIA.** Puede relacionarse con ellos por temática, recursos o presencia en el programa.

**Título propuesto:** «Ideas que ya han pasado por el aula».

**Texto propuesto:**

> Conoce experiencias educativas llevadas a la práctica y descubre cómo se desarrollaron, qué se aprendió y qué aspectos conviene adaptar a otros contextos. Propuestas para inspirarte, plantear preguntas y encontrar nuevas posibilidades para tu aula.

La ficha debe ayudar a comprender el contexto, la propuesta y su transferencia: quién la presenta, etapa o destinatarios, necesidad abordada, desarrollo, recursos utilizados, aprendizajes o resultados aportados y posibles adaptaciones. No todos los campos tienen que estar completos en el boceto.

La expresión «de éxito» no autoriza a inventar métricas, testimonios, reconocimientos o evidencias. No presentar un caso de demostración como experiencia validada. Si todavía no hay casos identificados, mostrar una composición de ejemplo claramente provisional o un estado de contenido pendiente.

#### Interacción de las tarjetas

La imagen o superficie de color puede revelar información de la ficha al pasar el cursor, como pidió el promotor. Si la ficha es extensa, mostrar una vista previa legible y un acceso explícito a la ficha completa; no comprimir un documento entero sobre la fotografía.

La misma información debe poder abrirse mediante teclado y toque. El hover es una mejora, no el único acceso. Mantener un control claro, como «Ver ficha», y una forma predecible de cerrar o volver. Si se utiliza un modal, comprobar el foco, el cierre con Escape y la devolución del foco al elemento que lo abrió.

Este mecanismo puede compartirse con las fichas de talleres, conservando la diferencia entre ambos tipos de contenido.

#### Fuentes de una ficha técnica

La configuración de cada ficha debe declarar **una fuente principal** y cómo representarla:

| Fuente | Datos de entrada | Tratamiento propuesto |
|---|---|---|
| Texto directo | Contenido editorial o campos estructurados. | Renderizar como HTML semántico. |
| Archivo de texto | URL o ruta a un archivo admitido. | Importar o procesar de forma controlada, según el stack, y convertirlo a contenido de la web. |
| PDF | URL o ruta al documento. | Evaluar extracción editorial a HTML, visualización incrustada o enlace al original. |

**Preferencia para el boceto:** contenido estructurado directo o preparado antes de servir la página. No introducir un lector y extractor pesado en cada tarjeta para resolver una posibilidad futura.

Si se extrae un PDF, conservar su referencia, revisar la fidelidad y definir cómo se actualiza el contenido derivado cuando cambie el original. No mantener dos versiones editables independientes de la misma ficha. Si no se puede obtener texto fiable, usar un resumen disponible y el acceso al documento; no inventar una transcripción ni exigir OCR por defecto.

Antes de incrustar o recuperar documentos externos, comprobar que ese origen permite la operación y que el resultado funciona en los dispositivos previstos. Debe existir una alternativa mediante enlace. Una URL a un PDF, por sí sola, no se considera una ficha HTML ya resuelta.

No insertar contenido externo como HTML sin el tratamiento correspondiente. No construir un proxy genérico de URLs ni un sistema de carga de documentos ajenos como parte de este boceto.

### 8. Presenta tu propuesta

La dinámica de presentación está por definir. Esta sección debe servir como invitación y como lugar preparado para incorporar posteriormente el proceso acordado.

**Título propuesto:** «Tu propuesta puede formar parte de las JIA».

**Texto propuesto:**

> ¿Has desarrollado una propuesta educativa que te gustaría compartir? Las JIA quieren abrir un espacio a ideas, experiencias y nuevas formas de trabajar que puedan inspirar a otros docentes.
>
> Aquí encontrarás la información para presentar tu propuesta cuando se concrete el proceso de participación.

**Acción prevista:** «Presentar una propuesta».  
**Mensaje mientras falte el canal:** «El canal de presentación todavía no está disponible».

No inventar convocatoria, plazos, criterios de selección, requisitos, condiciones de aceptación ni un formulario que simule enviar datos. Puede diseñarse la composición con una acción no operativa y una explicación visible, o mostrar únicamente el mensaje de disponibilidad.

La configuración debe permitir incorporar posteriormente un enlace o el mecanismo que se apruebe. No anticipar una implementación de formulario interno.

### 9. Acoge JIA

Esta sección invita a interesarse por la acogida de **futuras ediciones**. No formularla como un compromiso anual ni asegurar que las jornadas se celebran cada año.

**Título propuesto:** «La próxima edición podría empezar en tu centro».

**Texto propuesto:**

> Las buenas ideas crecen cuando encuentran un lugar para reunirse. ¿Te gustaría que tu centro o espacio acogiera una futura edición de las Jornadas de Innovación de Almería?
>
> Comparte tu interés y ayúdanos a imaginar un nuevo punto de encuentro para aprender, crear y conectar a la comunidad docente.

**Acción prevista:** «Quiero acoger las JIA».  
**Mensaje mientras falte el enlace:** «El formulario de acogida todavía no está disponible».

La acción dirigirá a un formulario externo cuya URL proporcionará la organización. El envío y su recepción corresponderán al sistema de ese formulario; no se presupone que esta web vaya a procesar los datos.

La sección tendrá una o varias superficies visuales, según convenga al diseño. Mientras falten fotografías, utilizar colores sólidos de la paleta. Como orientación para una futura imagen: un espacio educativo acogedor o un encuentro docente con tratamiento editorial coherente con la identidad. No generar ni buscar imágenes nuevas como paso obligatorio si los bloques de color ya resuelven el boceto.

### 10. Contenido, constantes e internacionalización

#### 10.1. Qué significa «nada hardcodeado»

Ningún texto editorial, etiqueta de interfaz, URL configurable, ruta de asset de contenido ni valor de color de marca debe quedar incrustado y disperso dentro de los componentes o manejadores de interacción.

Esto incluye títulos, párrafos, navegación, botones, estados vacíos, mensajes de error, disponibilidad, textos alternativos, etiquetas accesibles, metadatos y textos de detalle.

Los valores se escriben una vez en sus fuentes canónicas de contenido o configuración. **No se pretende eliminar todos los literales del lenguaje:** identificadores técnicos, claves, etiquetas HTML, nombres de clases e importaciones no son contenido editorial. Externalizarlos mecánicamente no aporta la editabilidad que se está pidiendo.

#### 10.2. Organización mínima propuesta

Adaptar nombres y extensiones al stack y a las convenciones que ya existan. No crear una arquitectura paralela si el repositorio ya resuelve estas responsabilidades.

| Responsabilidad | Ubicación orientativa | Regla |
|---|---|---|
| Paleta | `theme/palette.*` | Un archivo canónico con los colores del MD y su uso mediante tokens. Puede ser CSS con variables si encaja mejor. |
| Configuración común | `config/site.*` | Identidad del evento, locales disponibles, datos de edición y opciones globales justificadas. |
| Recursos visuales | `config/media.*` | Registro de imágenes, logos, fuentes y variantes mediante identificadores estables. |
| Botones | `content/es/buttons.*` | Etiquetas agrupadas por sección y acciones compartidas realmente iguales. |
| Interfaz común | `content/es/common.*` | Navegación, estados, mensajes y otros textos transversales. |
| Contenido de cada área | `sections/<seccion>/content/es.*` | Textos de esa sección y de sus entidades. |
| Configuración de cada área | `sections/<seccion>/config.*` | Enlaces, referencias a medios, relaciones y opciones de presentación. |

Cada sección debe poder exponer un objeto ensamblado con **textos, acciones, URLs, medios y estado**. Las etiquetas se importan del fichero de botones; los medios, del registro correspondiente. Así se mantiene una vista agrupada por sección sin duplicar las mismas cadenas en varios lugares.

Una URL propia de Acoge JIA debe tener su definición canónica en la configuración de esa sección, no desperdigada entre el botón, el componente y otro archivo global. Los enlaces compartidos se referencian, no se copian.

No hace falta un fichero por frase ni una biblioteca de internacionalización para justificar esta organización. Elegir la solución mínima compatible con el repositorio.

#### 10.3. Preparación multidioma

El idioma inicial es español. Organizar las claves de manera que se pueda añadir otro idioma sin reescribir los componentes. No inventar traducciones ni mostrar un selector con idiomas inexistentes.

Los identificadores internos no deben depender de las etiquetas traducidas. Evitar construir frases visibles uniendo fragmentos que después no puedan traducirse con naturalidad. Fechas, cantidades y plurales deben contemplarse como datos y contenido localizable.

Los textos alternativos y etiquetas accesibles también forman parte del contenido traducible. El lenguaje de la página y los metadatos deben corresponder al idioma realmente servido.

### 11. Modelo de contenido y conexiones

No se pide construir una base de datos. Estas entidades pueden ser objetos o archivos de contenido. Deben facilitar la edición sin repetir datos o acoplar el diseño al número inicial de elementos.

| Entidad | Información principal |
|---|---|
| Evento | Nombre, título, audiencia, datos confirmados de edición y configuración de idioma. |
| Jornada y sesión | Identificador, orden, fecha y horas opcionales, tipo y referencias a actividades. |
| Taller | Identificador, contenido, responsables, cartel, ficha y estado editorial. |
| Persona participante | Identificador, nombre confirmado, rol, fotografía y datos opcionales. |
| Experiencia | Identificador, contenido, contexto, responsables, ficha y evidencias aportadas, cuando existan. |
| Recurso o dosier | Identificador, contenido, formato, localización, disponibilidad y asociaciones. |
| Ficha técnica | Fuente principal, modo de representación y, cuando proceda, documento original. |

**Relaciones previstas:** el programa puede apuntar a talleres y experiencias; ambos pueden apuntar a personas y fichas; los dosieres pueden vincularse con uno o varios talleres o experiencias.

Definir cada asociación en un lugar canónico y derivar la navegación inversa. No mantener manualmente dos listas contrapuestas que puedan quedar desincronizadas. Las relaciones inciertas permanecen vacías.

Distinguir dos estados independientes: **estado editorial** del contenido y **disponibilidad técnica** del recurso o acción. Un PDF puede existir y seguir pendiente de revisión; un texto validado puede no tener todavía una fotografía.

Los datos desconocidos se representan con ausencia explícita, por ejemplo `null`, y no mediante fechas ficticias, nombres inventados o URLs de ejemplo. No confundir el texto de un mensaje de estado con el valor real del dato.

### 12. Comportamiento con información incompleta

La web debe seguir siendo visualmente coherente sin todas las imágenes, fichas, personas o enlaces.

| Situación | Comportamiento esperado |
|---|---|
| Falta una imagen | Superficie de color de la paleta, con proporción y espacio reservados. Sin icono de archivo roto. |
| Falta la fotografía de una persona | No inventar un retrato ni sustituirlo por el de otra persona. |
| Falta una URL de acción | Mensaje de disponibilidad; sin enlace falso, `href="#"` ni simulación de envío. |
| Falta una ficha | Estado de ficha pendiente, sin abrir un panel vacío. |
| No hay dosieres o experiencias | Estado editorial cuidado, sin una cuadrícula de documentos ficticios aparentemente disponibles. |
| Cambia el número de talleres | La colección se adapta sin modificar el componente. |
| Un recurso falla al cargar | Alternativa legible y, cuando exista, acceso al original. |

Si se utilizan datos de demostración, marcarlos como tales en la previsualización. Antes de una eventual publicación, revisar qué contenido puede mostrarse y sustituir u ocultar las afirmaciones no verificadas. No equiparar «la web compila» con «la información está lista para publicarse».

Las sugerencias para fotografías futuras pueden documentarse junto a los recursos pendientes, pero no deben aparecer como instrucciones de producción dentro de la web pública.

### 13. Revisión cruzada y criterios de calidad

Este contraste añade las implicaciones necesarias sin convertir el boceto en un proyecto de mayor alcance:

| Perspectiva | Riesgo detectado | Decisión incorporada |
|---|---|---|
| Producto y contenido | Confundir talleres con experiencias, o publicar suposiciones como datos del evento. | Entidades distintas, relaciones explícitas y estados editoriales. |
| Arquitectura frontend | Interpretar «constantes» como cientos de archivos o duplicar valores para agruparlos por sección. | Fuentes canónicas pequeñas y objetos de sección ensamblados por referencia. |
| UX y accesibilidad | Que el hover sea el único acceso a una ficha. | Acceso equivalente con toque y teclado, y detalle legible. |
| Integración de contenidos | Dar por hecho que cualquier URL de PDF se convierte en texto útil. | Fuente tipada, estrategia explícita y alternativa sin extracción. |
| Calidad de entrega | Presentar botones ficticios como funcionalidades terminadas. | Disponibilidad real, destinos comprobados y límites declarados. |

El diseño debe comprobarse, como propuesta de pruebas, a 360, 390, 768 y 1440 píxeles de ancho, además de los puntos problemáticos que detecte el agente. Revisar navegación móvil, textos largos, recortes del hero, carteles verticales, foco visible y ampliación del texto.

Usar estructura de encabezados comprensible, contraste suficiente, controles identificables y movimiento prescindible. Las imágenes decorativas no deben anunciarse como contenido informativo. Si el stack permite servir el contenido esencial directamente como HTML, favorecerlo frente a una carga cliente innecesaria.

Optimizar imágenes y fuentes según su uso real. No añadir vídeo, 3D, carruseles, librerías de animación, buscadores o dependencias de PDF solo para ornamentar la entrega. Si una dependencia es necesaria, justificar el problema concreto que resuelve.

El pie puede reservar lugar para organizadores, colaboradores, contacto y enlaces informativos, utilizando únicamente datos facilitados o verificados. No atribuir patrocinios, certificaciones o titularidades por encontrar un logo aislado.

### 14. Comprobaciones de aceptación del boceto

Estas comprobaciones evalúan la primera aproximación. No exigen que todos los contenidos del evento sean definitivos.

| Comprobación | Evidencia esperada |
|---|---|
| Inspección de referencias | Rutas reales del MD, render, hero y principales assets; lectura y revisión visual declaradas con precisión. |
| Fidelidad visual | Paleta y tipografía trazables al MD; capturas que permitan comparar la implementación con el render. |
| Estructura | Cinco áreas principales; Jornadas contiene programa, funcionamiento y talleres. |
| Contenido editable | Cambiar un título, una etiqueta de botón o una URL no requiere editar componentes. |
| Agrupación por sección | Se puede localizar el texto, los medios y las acciones de un área sin seguir valores duplicados. |
| Preparación multidioma | Español completo en fuentes de contenido; componentes independientes del idioma de las cadenas. |
| Relaciones | Talleres, personas, experiencias, sesiones y recursos se enlazan mediante referencias válidas. |
| Colecciones variables | Prueba con cero, uno, siete y más de siete talleres, sin asumir una cantidad fija. |
| Fallback visual | Quitar una imagen mantiene la composición y no produce una imagen rota. |
| Disponibilidad de acciones | Sin URL no hay envío ni destino fingido; al proporcionar una URL válida se habilita la acción prevista. |
| Fichas | Acceso por ratón, teclado y toque; texto completo consultable; origen y alternativa del documento identificados. |
| Navegación y responsive | Menú, submenús, anclas y detalles comprobados en móvil y escritorio. |
| Integridad editorial | Sin horarios, nombres, resultados o formularios inventados presentados como oficiales. |
| Validación técnica | Comandos disponibles de construcción, comprobación y pruebas ejecutados, con resultados y limitaciones. |

No declarar una prueba superada si no se ha ejecutado. Si no hay documentos reales para probar una integración de PDF, dejar ese camino como no verificado; no bloquear por ello una ficha de texto que sí funcione.

## Parte II — Metaprompt para el agente con acceso al proyecto

### Encargo

Actúa como un equipo coordinado de dirección de arte, arquitectura de información, redacción UX, desarrollo frontend y QA de accesibilidad. **Aterriza e implementa una primera landing funcional de JIA usando este documento completo y los assets reales del repositorio.** No te limites a devolver otra propuesta textual.

La parte I es un boceto de intención, no una maqueta cerrada. Conserva sus condiciones explícitas y mejora sus soluciones propuestas cuando el repositorio, los assets o la usabilidad lo justifiquen. Tu libertad creativa no permite inventar datos oficiales ni sustituir la identidad seleccionada por una estética ajena.

### Paso 1 — Comprende el proyecto antes de modificarlo

Localiza la raíz referida como `web-jia`. Lee las instrucciones del repositorio y respeta el stack, las convenciones y las herramientas ya existentes. No presupongas React, Next, Astro ni una reescritura; si el proyecto está vacío, elige la solución más sencilla que cubra este alcance y explica brevemente la elección.

Realiza la inspección definida en §2: lee el Markdown de identidad, observa el render y el hero, y revisa logos, fuentes, carteles e imágenes de participantes. No consideres suficiente una lista de nombres de archivo para afirmar que has entendido las referencias visuales.

Registra las rutas exactas, los recursos utilizables, las relaciones confirmadas y las carencias. No renombres ni sobrescribas originales para adaptarlos a los nombres orientativos de este briefing. No atribuyas identidades o autorías por inferencia visual.

### Paso 2 — Resuelve la información y la estructura

Antes de maquetar, prepara una síntesis operativa: arquitectura de navegación, entidades de contenido, acciones disponibles y decisiones visuales derivadas de las referencias.

Utiliza §§3–9 como punto de partida para la estructura y la redacción. Distingue el programa, los talleres que se ofrecen durante las jornadas y las experiencias que el profesorado comparte por haberlas puesto en práctica. Relaciónalos cuando exista información, sin duplicar sus fichas.

Los textos propuestos pueden editarse para mejorar claridad, ritmo y coherencia con la identidad. Revisa el resultado y elimina redundancias. No los conviertas en datos oficialmente aprobados ni rellenes vacíos con información factual inventada.

No detengas el boceto por falta de imágenes, responsables, fechas o enlaces: aplica los estados de §§11–12. Si hay una contradicción material sin resolver, declara la decisión provisional y evita publicar como cierta la parte dudosa.

### Paso 3 — Prepara contenido y configuración

Implementa la separación de §10 con el menor número razonable de piezas. Deben existir una fuente canónica de paleta, un fichero de etiquetas de botones y contenido agrupado por secciones, preparado para añadir idiomas.

Los componentes consumen contenido y configuración; no guardan textos editoriales, URLs o rutas de imágenes dispersas. Incluye los textos accesibles y metadatos. Mantén los literales puramente técnicos donde corresponda, sin externalizaciones mecánicas.

Cada sección debe permitir localizar o componer sus textos, medios, acciones y destinos. Evita duplicaciones entre el fichero de botones y los módulos de sección. Los datos de demostración deben poder sustituirse sin cambiar el layout.

### Paso 4 — Construye la landing

Implementa primero el hero y el sistema visual que lo conecta con el resto de la página. Usa la imagen de hero suministrada e interpreta el render mediante HTML y componentes reales. Conserva la legibilidad y adapta el encuadre a los dispositivos.

Completa las cinco áreas, sus conexiones y los estados vacíos. La centralidad de Experiencias y el orden del menú se conservan; las decisiones de layout y composición permanecen abiertas.

Utiliza colores sólidos como sustitutos de imágenes ausentes. Las colecciones no deben depender de siete elementos. No añadas capacidades ajenas al alcance para hacer parecer más completa la demostración.

Implementa las fichas según §7. Da acceso mediante teclado y toque, además del hover. Resuelve el contenido directo y prepara una estrategia proporcional para documentos externos; no afirmes haber validado extracción o incrustación de PDFs sin probar recursos reales.

### Paso 5 — Contrasta desde otro perfil y verifica

Revisa tus decisiones de frontend desde UX/accesibilidad y desde producto/contenido, utilizando §13. Corrige lo que cambie tras ese contraste: navegación ambigua, información solo accesible con hover, duplicación de fuentes, acciones engañosas o datos no confirmados.

Ejecuta las comprobaciones de §14 y las pruebas que ya existan en el proyecto. Inspecciona capturas en los tamaños relevantes y compara el resultado con el render. No presentes una validación visual como realizada si solo has comprobado el código.

No corrijas problemas borrando trabajo preexistente o modificando archivos fuera del workspace autorizado. Respeta los mecanismos de seguridad y permisos del repositorio. No publiques, despliegues, hagas push ni conectes servicios externos sin autorización específica.

### Entrega requerida

Entrega la implementación local y un informe breve con estas evidencias, ajustando las ubicaciones documentales a las convenciones existentes:

| Resultado | Qué debe explicar |
|---|---|
| Assets y fuentes utilizados | Archivos realmente leídos, observados e integrados; diferencias con los nombres del briefing. |
| Decisiones de diseño e información | Cómo interpretaste el render y qué propuestas cambiaste, sin una memoria innecesariamente extensa. |
| Mapa de edición | Dónde cambiar paleta, botones, textos, imágenes, fichas, relaciones y enlaces de cada sección. |
| Pendientes | Datos y recursos que todavía necesita aportar la organización, separados de las decisiones técnicas. |
| Verificación | Comandos y resultados, capturas realizadas, pruebas no ejecutadas y límites del entorno. |

**Criterio final:** debe ser posible revisar un boceto visual atractivo y coherente con JIA, recorrer sus cinco áreas, comprender qué falta y sustituir contenidos o assets desde sus fuentes de configuración sin rehacer los componentes. La entrega no se considerará información oficial lista para publicación por el mero hecho de que la implementación funcione.
