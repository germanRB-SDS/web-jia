# Cubo, película y colaboradores

Los exports portables completos, sus demos y QA están en resources. Sus guías son autoridad de
integración; esta ficha explica cómo se relacionan con la composición JIA.

| Pieza | Carpeta canónica | Qué reutilizar |
|---|---|---|
| Cubo | [cube-carousel](../../../resources/web-components/cube-carousel/INDEX-AND-HOW-TO-USE-THEM.md) | Componente, motor/config, CSS, soporte motion, paleta, datos y demo. |
| Tira de película | [film-reel](../../../resources/web-components/film-reel/INDEX-AND-HOW-TO-USE-THEM.md) | FilmReel, ReelViewer, motor, geometría y arte neutro, datos y demo. |
| Quiénes somos | [collaborators-carousel](../../../resources/web-components/collaborators-carousel/INDEX-AND-HOW-TO-USE-THEM.md) | Partners completo con cabecera + CollaboratorsCarousel + tarjeta Tilt; también admite solo tira. |

## Cubo

CSS `preserve-3d`, seis caras y GSAP Draggable: no Three.js ni un GLB. Recicla contenido en caras
ocultas para n elementos; flechas, keyboard y drag. Cada cuarto paso incorpora giro vertical.
Empieza en índice aleatorio después de hidratación. Autoplay3.4s, primera espera1.6s; deja de girar
automáticamente tras la primera interacción. Respeta visibilidad y motion. Caption/contador/lista
accesible preservan contenido. La perforación al tocar el frente es decorativa, hasta6 por item;
**no abre** la ficha de taller. No confundir ambos componentes.

Para embutirlo, pasar `items` con ID/title/subtitle/alt/image y labels; ver tipos exportados.
Usar wrapper de prosa propio y dimensiones del contenedor; la luz, sombra y caras pertenecen al
componente. El dataset JIA tiene49 tarjetas; la demo portable usa medios neutros.

## Película

La tira es DOM/CSS y un motor de desplazamiento. Arte original del módulo400×412; ventana
x14/y61/w370/h290; cartel1414/2000 e inset.055. Estos números pertenecen al arte y cambian juntos.
Velocidad18px/s, dirección configurada para izquierda→derecha; drag umbral6px/gain1.6, inercia
cap1.8px/ms y decay420ms. Fades laterales no deben interceptar puntero ni ofrecer carteles invisibles.

Hover del original: levanta2px. El **export portable** añade zoom1.08; no atribuir ese zoom al
snapshot histórico. Click/tap/Enter/Espacio abre visor nativo top-layer que sale del clipping de la
película, bloquea scroll y restaura foco. X/Escape/backdrop cierran; salida del ratón tras entrar
usa retardo150ms, no aplica a touch. Cleanup de timer incorporado en el export.

La escena aula es independiente: foto, luz WebGL, recorte del sujeto y letra decorativa.
Se puede usar la tira en un fondo liso, o sustituirla por otro carrusel con contrato equivalente.
La temática de fotogramas no se impone a todos los negocios.

## Quiénes somos

Header con kicker/rule/H2 y prosa enlazada; una tira a todo el ancho con cards oscuras. Motor
con deriva28px/s, drag/swipe/rueda horizontal y flechas de teclado. Hover, foco, fuera de pantalla
y pestaña oculta suspenden deriva. Repeticiones visuales aria-hidden/tabIndex-1 para evitar
multiplicar enlaces accesibles. Foco trae tarjeta visible. Tilt escala1.07/tope12° y brillo;
touch/reduce conserva tarjeta plana. La flecha es un enlace real, no exige conocer el gesto.

En otra marca, title/intro/partners/cards/labels son datos; sustituir los retratos de logos y
background por medios propios. La biblioteca incluye fixtures neutrales y palette de integración.
