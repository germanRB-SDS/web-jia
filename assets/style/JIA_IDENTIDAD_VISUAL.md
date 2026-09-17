# JIA — Guía de identidad visual y generación de imágenes

**Proyecto:** Jornadas Innovación Almería  
**Dirección artística:** Western editorial almeriense  
**Versión:** 1.0 · 17 de septiembre de 2026  
**Referencia visual:** render de landing aprobado por el promotor en esta conversación, archivo `jia_almería_siempre_inspira.png`.

> Una identidad de educación y encuentro entre profesionales, ambientada en un western cálido y cinematográfico: papel claro, tinta marrón, terracota, paisaje almeriense y docentes caracterizados. La composición es contemporánea; su carácter visual, de imprenta y aventura.

## 1. Alcance y decisiones fijadas

Esta guía convierte el render aprobado en instrucciones reutilizables para diseño, generación de imágenes y desarrollo web. No propone una identidad alternativa.

**Se conserva:** el aspecto del lettering «JIA», el cactus integrado en la A, la familia de iconos del render, la base cromática de pergamino y tierra, y la combinación de fotografía cinematográfica con composición editorial.

**Se especifica aquí:** una paleta operativa, reglas de construcción, tamaños orientativos, prompts y criterios de revisión. Estas medidas son decisiones de normalización, no propiedades técnicas recuperadas del archivo original.

**Queda pendiente de producción:** el logotipo vectorial maestro, los SVG definitivos de los iconos, la selección y licencia de las fuentes complementarias y las imágenes finales en sus diferentes encuadres. Este documento no contiene esos archivos ni identifica una fuente tipográfica original.

Cuando una instrucción genérica de «western» contradiga el render, prevalece el render. No sustituir esta línea por arquitectura futurista, brutalismo, estética tecnológica ni la dirección visual «nuevo mh».

## 2. Contexto y significado de la marca

JIA se dirige a profesorado de distintas etapas y disciplinas. Su propósito es comunicar un encuentro para compartir, aprender y llevar buenas prácticas educativas al aula. La caracterización western es el lenguaje narrativo; la educación sigue siendo el contenido principal.

No presentar como confirmados talleres, ponentes, horarios, actividades, lugares concretos, apertura de inscripciones o colaboraciones que no hayan sido aprobados. Las categorías del render son bloques conceptuales de presentación, no una programación cerrada.

**Precisión institucional:** la denominación publicada por la Junta de Andalucía es «Centro del Profesorado de Almería». El desarrollo de CEP que aparece en el render debe corregirse; su símbolo de libro no debe considerarse un logotipo institucional oficial.[^cep]

El dominio visible en el navegador del render es parte del concepto generado, no una dirección web confirmada. La barra de navegador tampoco forma parte de la identidad.

## 3. Principio creativo

### 3.1. Fórmula visual

**Fotografía cinematográfica cálida + composición editorial despejada + materiales de imprenta + detalles western selectivos.**

El minimalismo se aplica a la jerarquía, el número de elementos y el espacio. No obliga a eliminar la riqueza del paisaje, la textura natural de la ropa o el carácter del lettering.

La imagen debe sugerir curiosidad, camino compartido, territorio y posibilidades para el aula. No debe parecer una atracción turística, una tienda de disfraces, un videojuego de vaqueros ni una campaña de armas.

### 3.2. Elementos que construyen el estilo

- Fondos claros de papel cálido, sin blanco clínico como superficie dominante.
- Letras oscuras con personalidad de rótulo impreso; textos secundarios mucho más sobrios.
- Fotografía de personas adultas caracterizadas, con materiales y gestos creíbles.
- Paisaje árido almeriense, horizonte amplio, arquitectura evocadora y luz lateral cálida.
- Iconografía monocroma terracota y ornamentación fina, aplicada con moderación.

### 3.3. Límites de la dirección artística

Evitar neón, cian eléctrico, púrpura tecnológico, cromados, cristales flotantes, degradados multicolor, madera como fondo de toda la web, carteles de «se busca», retratos caricaturescos, filtros de sepia extrema y acumulaciones de estrellas, cuerdas o revólveres.

Sombreros, ponchos, pañuelos, cuero y cactus son recursos del vocabulario. No deben aparecer todos en cada composición. No reproducir personajes, carteles o escenas reconocibles de películas concretas.

## 4. Paleta de colores

### 4.1. Procedencia y criterio

La referencia es una imagen rasterizada con textura, iluminación y variación tonal: no contiene un único HEX por elemento ni permite recuperar un sistema CSS original.

Los colores marcados como **muestreados** son valores representativos obtenidos de zonas del render. Los marcados como **extensión** completan el sistema para la interfaz. Desde esta guía se adoptan como valores operativos para mantener consistencia; no se afirma que fueran los colores originales de un diseño editable.

### 4.2. Colores y funciones

| Nombre | HEX | Procedencia | Función |
|---|---|---|---|
| Papel editorial | `#F1E7D8` | Muestreado | Fondo principal de la página y continuidad entre secciones. |
| Marfil de luz | `#F6EEDF` | Extensión | Zonas más luminosas y texto sobre botones oscuros. |
| Arena del hero | `#EDDDC7` | Muestreado | Transición hacia fotografía, calidez y profundidad de fondo. |
| Pergamino de tarjeta | `#EEE3D1` | Muestreado | Superficies secundarias con contraste suave respecto al fondo. |
| Tinta JIA | `#2F180B` | Muestreado | Lettering, títulos de máxima jerarquía y detalles de marca. |
| Tinta de lectura | `#443D37` | Muestreado | Párrafos y contenido informativo. |
| Tinta secundaria | `#71604D` | Extensión | Metadatos y textos de menor jerarquía, con contraste verificado. |
| Terracota principal | `#89482E` | Muestreado | Botón principal, iconos, flechas y acentos activos. |
| Terracota profunda | `#703923` | Extensión | Hover, énfasis o estados activos sobre superficies claras. |
| Línea de arena | `#C9B79F` | Extensión | Separadores y bordes puramente decorativos. |
| Cobre mate | `#AD754D` | Extensión | Detalles gráficos secundarios, no texto pequeño sobre papel. |
| Oliva seco | `#72715B` | Extensión opcional | Vegetación, textiles o acentos muy puntuales. No introducirlo como segundo color protagonista. |

### 4.3. Distribución

Como orientación para las superficies de interfaz, mantener aproximadamente un 75 % de tonos claros, un 18 % de tinta y un 7 % de acentos. No aplicar esta proporción a los píxeles de la fotografía.

El paisaje y las personas pueden contener matices fuera de estos HEX. La paleta dirige su temperatura y saturación, pero no debe convertir la fotografía en una ilustración de colores planos.

Evitar negro y blanco puros como colores dominantes de marca. Las necesidades de legibilidad tienen prioridad sobre esta preferencia estética.

### 4.4. Contraste

Para texto normal, aplicar el umbral de contraste de al menos 4,5:1 del criterio WCAG 1.4.3; para texto grande, el umbral es 3:1 según su definición. Los logotipos tienen una excepción en ese criterio, que no se extiende automáticamente al resto de los títulos.[^contraste]

Comprobación calculada para los colores planos definidos en esta guía:

| Combinación | Ratio aproximado | Uso previsto |
|---|---:|---|
| Tinta JIA / Papel editorial | 13,66:1 | Marca y títulos. |
| Tinta de lectura / Papel editorial | 8,72:1 | Texto principal. |
| Tinta secundaria / Papel editorial | 4,93:1 | Texto secundario. |
| Terracota principal / Papel editorial | 5,66:1 | Enlaces e iconos. |
| Marfil de luz / Terracota principal | 6,01:1 | Texto del botón principal. |
| Cobre mate / Papel editorial | 3,16:1 | Decoración; no texto normal. |
| Oliva seco / Papel editorial | 4,06:1 | Acento; no texto normal. |

Los ratios son cálculos propios mediante luminancia relativa sRGB, redondeados para presentación. No certifican la accesibilidad de una página. Con textura, fotografía, transparencias o degradados se debe comprobar la combinación realmente visible y no únicamente los tokens.[^contraste]

## 5. Lettering «JIA»

### 5.1. Definición

«JIA» es un **logotipo tipográfico de construcción propia**, basado en la forma aprobada. No debe tratarse como tres caracteres intercambiables de cualquier fuente western.

Su lenguaje combina mayúsculas muy pesadas, proporción vertical, remates anchos y ensanchados, espolones angulares a media altura y desgaste de tinta sobre papel. Debe conservar una lectura inmediata.

No se ha identificado una fuente exacta a partir del render. No atribuirlo a una tipografía comercial o gratuita sin una comprobación independiente.

### 5.2. Rasgos que deben conservarse

**J:** asta vertical gruesa; remate superior ancho; curva inferior profunda y redondeada; terminal izquierdo corto y robusto. El arco inferior da peso y estabilidad, sin parecer una herradura añadida.

**I:** columna vertical con extremos ensanchados. Los remates superior e inferior forman una silueta compacta, acompañada de pequeñas salientes angulares laterales a media altura.

**A:** estructura gruesa y estable, pies abiertos y contraforma interior clara. El vacío interior ofrece espacio al cactus sin destruir la lectura de la letra.

**Cactus:** silueta oscura, del mismo color que la marca, situada dentro del espacio claro inferior de la A. Tiene un tallo central y dos brazos ascendentes. El cactus no es un agujero blanco, no sustituye toda la A y no debe flotar fuera de la letra.

**Conjunto:** las tres letras se perciben como un bloque compacto. Ajustar el espaciado de manera óptica; no separar las letras con un tracking editorial amplio.

### 5.3. Color y textura

Versión principal en Tinta JIA sobre papel o marfil. El desgaste consiste en pequeñas pérdidas de tinta, motas claras e irregularidad controlada. La silueta exterior debe permanecer reconocible.

El efecto es de impresión envejecida, no de letras quemadas, piedra tallada, cuero cosido o metal oxidado. No añadir bisel, volumen 3D, contornos gruesos ni sombras dramáticas.

Como punto de partida de producción, hacer que las pérdidas de tinta ocupen una parte pequeña de la superficie, aproximadamente un 2–4 %, y revisar visualmente. Ese porcentaje es una pauta nueva, no una medición del render.

### 5.4. Variantes previstas

| Variante | Aplicación | Tratamiento |
|---|---|---|
| Principal | Hero y piezas grandes | Silueta completa y desgaste fino. |
| Limpia | Cabecera y tamaños reducidos | Misma construcción, sin microtextura. |
| Invertida | Fondos de tinta | Marca marfil con contraformas transparentes, revisada manualmente. |
| Micro | Favicon o espacios mínimos | Simplificación específica; pendiente de validación, no reducción automática. |

Como regla inicial, reservar alrededor del bloque una zona libre equivalente al 15 % de su altura. Probar las variantes al tamaño real antes de fijar mínimos definitivos: si desaparecen el cactus o las contraformas, utilizar la versión limpia o una variante micro aprobada.

### 5.5. Producción del archivo maestro

Reconstruir el contorno como vector a partir del recorte de referencia. Comparar la silueta sin textura antes de añadir desgaste. Después, revisar proporciones, cactus, remates y espaciado frente al original.

Una vez aprobado, reutilizar siempre ese archivo maestro. No pedir al generador que vuelva a inventar «JIA» para cada nueva imagen: un prompt por sí solo no garantiza identidad geométrica entre resultados.

## 6. Tipografía complementaria

La expresividad principal reside en el logotipo. Los demás niveles deben permitir leer y orientarse con facilidad.

| Nivel | Dirección tipográfica | Pauta de uso |
|---|---|---|
| Nombre completo de las jornadas | Serif alta, relativamente estrecha, editorial y de remates definidos | Mayúsculas, interletrado moderado y líneas bien separadas. |
| Títulos de sección | Serif con personalidad compatible, sin desgaste | Más sobria que JIA; evitar competir con la marca. |
| Párrafos | Serif de lectura, contraste moderado y buena altura de minúsculas | Cálida, legible y sin condensación artificial. |
| Navegación y botones | Sans serif sobria y ligeramente estrecha | Etiquetas breves; espaciado moderado, sin letras diminutas. |
| Notas manuscritas | Escritura natural fina, inclinada y elegante | Un gesto decorativo ocasional, nunca información esencial. |

**Jerarquía inicial para prototipado:** texto de lectura de 17–19 px en escritorio y 16–18 px en móvil; interlineado aproximado de 1,5–1,65; párrafos de unas 45–65 letras por línea. Son referencias, no medidas rígidas.

En titulares breves en mayúsculas, empezar con `letter-spacing` entre `0.08em` y `0.16em`. Ajustarlo según la fuente, sin aplicarlo al lettering JIA.

Antes de seleccionar una fuente concreta, verificar licencia de uso web y representación de «Almería», «innovación», «pedagogía», «didáctica», «ñ», «¿» y «¡». No falsear la condensación de una fuente mediante deformaciones horizontales.

## 7. Sistema de iconos

### 7.1. Nombre y carácter

**Familia: JIA — Tinta de frontera.**

Iconos pequeños, monocromos y de apariencia dibujada a tinta, con contornos limpios y un carácter artesanal contenido. Deben parecer parte de la misma edición impresa, no una mezcla de packs.

**Matiz fundamental del render:** la familia no es completamente outline. El sombrero, la rosa de los vientos y el farol son principalmente lineales; el cactus funciona como una silueta sólida. Conservar esta diferencia deliberada.

### 7.2. Iconos fundacionales

| Icono | Construcción visual | Asociación conceptual |
|---|---|---|
| Sombrero vaquero | Copa con pequeñas ondulaciones superiores, banda sencilla y ala ancha curvada; forma horizontal. | Identidad, encuentro, «Qué es JIA». |
| Cactus | Tallo central y dos brazos redondeados de altura desigual; silueta compacta rellena. | Territorio, crecimiento, buenas prácticas. |
| Rosa de los vientos | Circunferencia fina con ejes y puntas; estructura radial de inspiración cartográfica, sin exceso de detalle. | Orientación, transversalidad, nuevos caminos. |
| Farol | Asa superior, cuerpo vertical, base estable y vidrio sugerido por diagonales interiores. | Inspiración, descubrimiento, ideas para el aula. |

Estas asociaciones son usos narrativos del diseño, no nombres de actividades confirmadas.

### 7.3. Reglas de dibujo

Trabajar sobre una retícula maestra sugerida de 64 × 64 unidades, con margen óptico interior. No forzar el sombrero, que es ancho, a ocupar la misma proporción que el farol, que es vertical.

Para las versiones lineales, comenzar con un grosor de 2–2,5 unidades en esa retícula. Ajustar el peso óptico del cactus relleno mediante su anchura y superficie, no añadiendo detalles.

Usar curvas suaves en sombrero, cactus y farol. Mantener las puntas definidas de la rosa de los vientos: no redondear toda la familia de forma indiscriminada.

Color principal: Terracota `#89482E`. Color alternativo: Tinta JIA. Sin degradados, sombras, volúmenes, fondos de color dentro del pictograma ni efectos metálicos.

La sensación artesanal procede de la forma, no de ensuciar el icono. En tamaños pequeños debe ser limpio. Una textura casi imperceptible solo tiene sentido en versiones grandes y decorativas.

### 7.4. Tamaños y contexto

En tarjetas, comenzar con una presencia visual de 36–48 px, revisada según el icono. Para controles de interfaz de 20–24 px, crear variantes simplificadas o usar símbolos funcionales sobrios compatibles; no comprimir un farol detallado hasta hacerlo ilegible.

Los iconos acompañan etiquetas de texto. Un cactus no sustituye por sí solo el nombre de una acción. Los iconos decorativos no deben anunciarse como contenido adicional a tecnologías de asistencia.

En botones pequeños, conservar una flecha fina y sencilla. No convertir todas las flechas en flechas de arquero, todas las viñetas en estrellas de sheriff ni cada control en un objeto western.

### 7.5. Extensión de la familia

Se pueden incorporar cuaderno, libro, mapa plegado, lápiz o una pequeña silueta de montañas con el mismo lenguaje. Introducir solo los necesarios para el contenido real.

El sistema base no requiere armas. Revólveres, munición, duelos y otros elementos asociados a la violencia no serán los signos principales de una actividad educativa. La personalidad western ya queda expresada mediante el resto de recursos.

Entregar los iconos como SVG individuales, con un criterio común de tamaño y color. Los archivos finales deben revisarse visualmente: una imagen generada no constituye por sí sola una familia vectorial lista para producción.

## 8. Dirección de fotografía e imágenes

### 8.1. Tipo de imagen

Fotografía editorial cinematográfica de apariencia realista. Debe sentirse preparada con dirección de fotografía y vestuario, no como una ilustración infantil ni un montaje publicitario de objetos aislados.

La escena cuenta una historia sencilla: profesionales que comparten un camino y miran hacia nuevas posibilidades educativas.

### 8.2. Territorio y paisaje

Evocar Almería mediante tonos ocres, terreno erosionado, montañas secas, vegetación escasa y luz cálida. La referencia aprobada añade una fortaleza sobre la ciudad y una franja de costa como anclajes visuales.

No presentar ese panorama generado como una vista geográfica exacta. Para mostrar un monumento o un lugar concreto con fidelidad documental, utilizar referencias verificadas y conservar su estructura. En una escena evocadora, mantener la coherencia de escalas, perspectiva y horizonte.

No convertir el paisaje en una caricatura del desierto norteamericano. Los cactus pueden funcionar como símbolos gráficos western sin que tengan que dominar todo el entorno fotográfico.

### 8.3. Personas y caracterización

Personas adultas que se perciban como participantes en una iniciativa educativa. Pueden llevar sombreros de fieltro, prendas de algodón, ponchos discretos, chalecos, pañuelos y bolsos de cuero o lona.

Los materiales deben tener textura natural y desgaste moderado. Evitar disfraces brillantes, vestuario sexualizado, uniformidad artificial o poses agresivas. La caracterización no exige una recreación histórica rigurosa.

Favorecer grupos pequeños, posturas relajadas y gestos de observación, conversación o intercambio. Los cuadernos y libros pueden sugerir la dimensión educativa; no hace falta convertir a cada persona en un expositor de accesorios.

Las personas generadas son representaciones conceptuales. No sugerir que son asesores identificados, asistentes reales o una fotografía de unas jornadas ya celebradas.

### 8.4. Composición del hero

Para reproducir la lógica del render, reservar aproximadamente el 40–45 % izquierdo como área tranquila para texto y marca. Situar las figuras principales en el centro-derecha y dejar que el paisaje se extienda hacia el fondo.

Esas proporciones son una configuración inicial. Se pueden invertir cuando el diseño lo requiera, pero no debe invertirse accidentalmente el significado de carteles o elementos reconocibles.

Organizar tres planos: vegetación o detalles discretos en primer término, participantes en plano medio y ciudad o montañas al fondo. Evitar que sombreros, cabezas o carteles coincidan con los bordes de los títulos.

El grupo no tiene que mirar a cámara. Una vista de espaldas o de tres cuartos ayuda a expresar exploración sin convertir el hero en un retrato corporativo convencional.

### 8.5. Cámara y profundidad

Como vocabulario orientativo de generación, pedir un encuadre equivalente a una focal de 35–50 mm, perspectiva natural y profundidad de campo moderada. No son metadatos recuperados del render.

Mantener ropa y figuras principales suficientemente nítidas. El fondo debe suavizarse por distancia y atmósfera, pero conservar información reconocible. Evitar un bokeh tan intenso que Almería desaparezca.

### 8.6. Luz y tratamiento de color

Luz lateral de final de la tarde, cálida pero no naranja intensa. Sombras largas y suaves; polvo ambiental fino; brillo contenido en bordes de sombreros, cabello, tejidos y piedra.

Trabajar un rango de arena, ámbar suave, marrones y terracota. Conservar matices naturales en piel, vegetación y cielo. Los tonos fríos, cuando aparezcan, deben quedar contenidos, no eliminados por completo.

Las sombras son marrones profundas con detalle, no masas negras empastadas. Las luces se aproximan al marfil del fondo, sin quemar el cielo o la piel.

La textura cinematográfica es fina. Evitar grano grueso, sobreenfoque, halos, HDR agresivo y un filtro sepia uniforme sobre toda la escena.

### 8.7. Fusión con el papel

La fotografía debe integrarse con el fondo claro sin parecer una tarjeta rectangular pegada. Para el hero de referencia, una transición suave en el lado del texto y cierta continuidad tonal en el borde inferior ayudan a conseguirlo.

Preparar preferentemente una imagen limpia y resolver la transición con una máscara o capa de interfaz. No hornear un rectángulo beige rígido dentro de todas las imágenes.

Mantener margen de encuadre alrededor de las figuras y evitar fades que borren parcialmente una cara o una mano. El texto debe descansar sobre una superficie estable y tranquila, no depender de encontrar casualmente una zona clara en la fotografía.

### 8.8. Uso del texto dentro de imágenes

Separar dos productos:

**Render de presentación:** puede incluir navegación, titulares, botones y notas manuscritas para enseñar la propuesta completa.

**Asset para la web:** debe generarse sin interfaz, sin logotipos institucionales, sin botones y, por defecto, sin texto. Los títulos y llamadas a la acción se incorporarán como elementos reales de la web; el lettering se añadirá desde su archivo maestro.

Las frases de carteles, mochilas y piedras del render son recursos conceptuales. No hay que reproducirlas todas: demasiados mensajes compiten con el contenido principal.

## 9. Método para generar imágenes consistentes

### Paso 1. Adjuntar la referencia

Utilizar el render aprobado como referencia de estilo cuando el generador lo permita. Para trabajo de marca o iconos, adjuntar además sus recortes específicos. No asumir que la herramienta recuerda archivos de otra conversación.

### Paso 2. Fijar lo que no cambia

Mantener la temperatura, la familia cromática, el realismo, los materiales, la suavidad de la luz y la proporción entre ambiente y detalle. Estos aspectos forman el estilo.

### Paso 3. Cambiar solo la escena necesaria

Definir participantes, acción, lugar y encuadre. No variar al mismo tiempo vestuario, color, iluminación, composición y tipo de fotografía, porque se perdería la referencia compartida.

### Paso 4. Generar sin elementos de marca definitivos

Crear la fotografía o el fondo. Incorporar después el logotipo, los iconos y los textos ya aprobados. Una generación nueva no debe redefinir los elementos que se pretende conservar.

### Paso 5. Revisar y corregir

Comprobar anatomía, perspectiva, vestuario, materiales, zona de lectura y fidelidad cromática. Rechazar resultados con manos deformadas, sombreros fusionados, texto accidental o símbolos ajenos a la identidad.

### Paso 6. Preparar recortes

Trabajar una composición horizontal para escritorio y una versión específica para móvil. Si el recorte elimina el grupo o el espacio de lectura, recomponer la escena; no limitarse a aplicar un corte centrado.

## 10. Prompts reutilizables

Los siguientes bloques están escritos como instrucciones completas. Los valores entre corchetes se sustituyen antes de usarlos.

### 10.1. Prompt maestro — Fotografía de hero sin interfaz

```text
Genera una imagen fotográfica editorial cinematográfica para las Jornadas Innovación Almería, JIA. Utiliza la imagen adjunta como referencia prioritaria de estilo y conserva su atmósfera western cálida, elegante y vinculada a Almería.

La imagen representa a [NÚMERO REDUCIDO] personas adultas de una comunidad educativa, caracterizadas de western con naturalidad. Llevan sombreros de fieltro, prendas de algodón, un poncho discreto y complementos de cuero o lona en tonos tierra. Incorporar uno o dos cuadernos de manera orgánica, sin convertir la escena en una exposición de accesorios. Actitud de curiosidad y colaboración, gestos relajados, sin poses agresivas.

Situar al grupo [EN EL CENTRO-DERECHA], de espaldas o de tres cuartos, observando [PAISAJE O ACCIÓN]. El entorno evoca Almería: tierra ocre, montañas secas, relieve erosionado, vegetación escasa y arquitectura coherente con las referencias aportadas. La escena es conceptual, no pretende documentar unas jornadas celebradas ni un punto de vista geográfico exacto.

Reservar aproximadamente un 40–45 % del lado [IZQUIERDO] como espacio visual tranquilo, luminoso y con poco detalle, preparado para incorporar después texto oscuro. Mantener un horizonte amplio y tres planos de profundidad. Proteger las cabezas y los elementos importantes frente a futuros recortes.

Luz lateral de final de la tarde, sombras suaves y largas, polvo fino en suspensión y ligera perspectiva atmosférica. Perspectiva fotográfica natural, equivalente orientativamente a 35–50 mm. Figuras y tejidos nítidos; fondo suavizado, pero reconocible. No usar desenfoque extremo.

La gradación de color se integra con esta identidad: papel #F1E7D8, marfil #F6EEDF, arena #EDDDC7, marrón profundo #2F180B y terracota #89482E. Usar esos valores como dirección cromática, sin convertir la fotografía en una imagen de tintas planas. Piel natural, verdes apagados, luces suaves y negros no empastados.

Materiales táctiles, composición editorial despejada y textura de película muy fina. La imagen debe poder fundirse suavemente con un fondo de pergamino claro.

Entregar únicamente la escena, sin interfaz web, sin marco de navegador, sin JIA, sin logotipos, sin palabras, sin carteles legibles y sin botones. Formato [HORIZONTAL 16:9 / ENCUADRE VERTICAL RECOMPUESTO], resolución suficiente para el uso previsto.
```

### 10.2. Restricciones visuales comunes

```text
No reproducir películas, actores o personajes concretos. Sin estética de parque temático, cartel de “se busca”, neón, arquitectura futurista, brutalismo, interfaz tecnológica, 3D plástico ni caricatura. Sin armas como protagonistas, poses de duelo ni disfraces brillantes. Sin sepia monocromo intenso, HDR agresivo, grano grueso, sobresaturación, halos o viñeteado oscuro. Sin manos deformadas, rostros duplicados, objetos fusionados, texto aleatorio, marcas de agua o logotipos institucionales inventados. No llenar de elementos la zona reservada para lectura.
```

### 10.3. Prompt — Otra escena de la misma familia

```text
Mantén la dirección visual del render JIA adjunto: fotografía cinematográfica cálida, tierra y pergamino, vestuario western sobrio, materiales naturales y atmósfera almeriense.

Cambia únicamente la escena por [DESCRIPCIÓN DE LA ESCENA], manteniendo el mismo criterio de color, iluminación y realismo. El foco narrativo es [COLABORACIÓN / DESCUBRIMIENTO / INTERCAMBIO DE IDEAS], no un espectáculo western.

Composición [ENCUADRE], con zona tranquila en [POSICIÓN] para incorporar texto posteriormente. Genera solo la imagen, sin interfaz, sin palabras y sin rediseñar la marca. Aplica las restricciones visuales comunes de la guía JIA.
```

### 10.4. Prompt — Exploración de iconos

```text
Usa el recorte adjunto de los iconos de JIA como referencia principal. Desarrolla [ICONO SOLICITADO] dentro de esa misma familia: dibujo monocromo de tinta terracota #89482E, contorno limpio, carácter artesanal contenido y simplificación elegante.

Conserva la lógica existente: sombrero, rosa de los vientos y farol principalmente lineales; cactus como silueta rellena. No convertir toda la familia a un único tratamiento por automatismo. Equilibrar el peso visual con los iconos de referencia.

Forma centrada, fondo uniforme claro, sin palabras, sin sombras, sin degradados ni efectos tridimensionales. Contornos preparados para una reconstrucción vectorial posterior; no afirmar que el resultado rasterizado es un SVG.
```

### 10.5. Instrucción — Reconstrucción del lettering

```text
Reconstruye el lettering JIA tomando el recorte aprobado como referencia geométrica, no como inspiración libre. Conserva la J de curva inferior profunda, la I gruesa de extremos ensanchados, los espolones angulares y la A con cactus oscuro dentro de su contraforma clara.

Primero presenta la silueta limpia en #2F180B. No añadas desgaste hasta que se hayan comparado y aprobado las proporciones y el espaciado. Después aplica pérdidas finas de tinta en una variante separada. No sustituirlo por una fuente western aproximada y darlo por idéntico.

Entregables previstos para producción: archivo maestro vectorial limpio, variante texturizada y variantes de tamaño revisadas. La generación visual es una referencia de trabajo; cualquier SVG debe construirse y comprobarse realmente.
```

## 11. Aplicación a la landing

### 11.1. Cabecera

Marca compacta a la izquierda; navegación breve; presencia institucional con recursos oficiales. Evitar reproducir todas las opciones del mockup si aún no existen secciones útiles detrás.

### 11.2. Hero

Lettering JIA dominante, nombre completo de las jornadas, una frase introductoria y un párrafo corto. Una llamada principal y una secundaria como máximo.

Conservar el equilibrio entre bloque editorial y fotografía. El separador fino con una estrella puede utilizarse como detalle, sin convertirse en un patrón repetido en todos los componentes.

**Precisión funcional:** «Próximamente» comunica un estado. Mientras no exista una acción real, debe ser una etiqueta o aviso, no un botón que aparenta funcionar. «Conoce la iniciativa» puede enlazar al bloque explicativo si ese contenido existe.

### 11.3. Tarjetas

Superficie de pergamino, icono terracota, título editorial y una descripción breve. Radios discretos —como punto de partida, 8–12 px— y separación suficiente. Sin sombras flotantes pronunciadas.

«Qué es JIA», «Buenas prácticas», «Aprendizaje transversal» e «Inspiración para el aula» pueden servir como bloques informativos. Revisar que cada uno aporte una idea distinta y que no repitan el mismo párrafo con otras palabras.

### 11.4. Móvil

No reducir toda la captura de escritorio. Recomponer para priorizar marca, nombre, propósito y acción. Situar la fotografía detrás de una zona protegida o en un bloque propio, según el resultado de las pruebas.

Simplificar adornos antes que reducir la letra. Evitar texto pequeño sobre montañas, figuras cortadas de forma accidental y una primera pantalla ocupada solo por decoración.

## 12. Tokens de implementación

El siguiente bloque fija colores y parámetros iniciales. No es una implementación completa ni identifica las fuentes del render.

```css
:root {
  --jia-paper: #f1e7d8;
  --jia-ivory: #f6eedf;
  --jia-sand: #edddc7;
  --jia-card: #eee3d1;
  --jia-ink: #2f180b;
  --jia-text: #443d37;
  --jia-text-muted: #71604d;
  --jia-terracotta: #89482e;
  --jia-terracotta-deep: #703923;
  --jia-line: #c9b79f;
  --jia-copper: #ad754d;
  --jia-olive: #72715b;

  --jia-radius-button: 4px;
  --jia-radius-card: 10px;
  --jia-body-leading: 1.6;
  --jia-label-tracking: 0.12em;
}
```

La textura debe ser una capa independiente y sutil. Evitar filtros que también alteren textos, controles o fotografías ya tratadas. La integración del hero requiere revisar posiciones de imagen, máscaras y contraste para cada encuadre.

## 13. Revisión cruzada antes de aprobar

### Dirección de arte

¿Se reconoce el render original como familia? ¿El lettering mantiene su silueta? ¿Los cuatro iconos conservan su carácter? ¿La fotografía parece cálida y natural, en vez de una ilustración sepia? ¿Hay espacio suficiente para respirar?

### Diseño de producto y contenido

¿Se entiende que son jornadas educativas? ¿El mensaje funciona para docentes de distintas disciplinas? ¿Se han evitado programas, sedes o inscripciones inventadas? ¿Cada enlace conduce a algo útil? ¿Se han eliminado lemas y textos redundantes?

### Desarrollo frontend y accesibilidad

¿Los textos informativos siguen siendo texto real? ¿Existe un encabezado principal semántico con el nombre de las jornadas? ¿Marca e iconos están separados del fondo? ¿La lectura funciona con teclado, zoom y en móvil? ¿El contraste se ha medido sobre el resultado final?

Las imágenes decorativas no deben duplicar información en la lectura asistida. Los controles necesitan nombres comprensibles y un foco visible. Las transiciones o animaciones, si se añaden, serán discretas y deberán contemplar la preferencia de movimiento reducido. Estas son condiciones de aceptación del proyecto; deben validarse en la implementación, no presumirse a partir del render.

### Rendimiento y mantenimiento

Preparar tamaños de imagen adecuados para cada contexto. Reutilizar el logotipo maestro y los SVG de iconos en lugar de regenerarlos o incrustar una captura completa. No introducir una librería pesada únicamente para cuatro pictogramas o una textura de papel.

La estructura debe seguir siendo comprensible cuando la imagen tarde en cargar. No se fijan aquí límites de peso ni una tecnología concreta: se decidirán según la implementación y las mediciones reales.

## 14. Entregables futuros y control de coherencia

Nombres sugeridos, no archivos ya incluidos:

```text
jia-wordmark-primary.svg
jia-wordmark-clean.svg
jia-wordmark-inverse.svg
jia-icon-hat.svg
jia-icon-cactus.svg
jia-icon-compass.svg
jia-icon-lantern.svg
jia-hero-desktop.[formato_final]
jia-hero-mobile.[formato_final]
jia-paper-texture.[formato_final]
```

Los cambios en la forma del lettering, la construcción del cactus o el lenguaje de la familia de iconos requieren validación visual. Adaptar el encuadre de una fotografía o simplificar el desgaste para tamaños pequeños no implica cambiar la identidad.

**Criterio final:** que cada nueva pieza parezca pertenecer a la misma publicación y al mismo universo educativo almeriense, sin repetir necesariamente los mismos personajes, objetos o paisaje.

---

## Referencias y alcance de las fuentes

La fuente visual y de aprobación es el render aportado en esta conversación. La descripción estética, las pautas de producción, los prompts y los valores de normalización son elaboración propia a partir de esa referencia. No se presentan como documentación institucional ni como decisiones ya tomadas sobre la programación del evento.

[^cep]: Junta de Andalucía, «El CEP — Centro del Profesorado de Almería». Consulta: 17 de septiembre de 2026. `https://www.juntadeandalucia.es/educacion/portales/web/cep-almeria`. Esta fuente respalda la denominación del centro, no la autoría institucional de los símbolos generados ni la organización concreta de estas jornadas.

[^contraste]: W3C, «Understanding Success Criterion 1.4.3: Contrast (Minimum)». Consulta: 17 de septiembre de 2026. `https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html`. Referencia para los umbrales de contraste y el cálculo mediante luminancia relativa. Los ratios de esta guía se han calculado para sus propios colores; no equivalen a una auditoría de accesibilidad.
