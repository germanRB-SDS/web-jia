# web-jia — modelo editorial modular

**Referencia:** Jornadas de Innovación de Almería, edición 2026. Conservada el 30-09-2026.
**Idea de diseño:** un cuaderno de campo: titulares de imprenta, lectura serif, metadatos compactos,
separadores finos y fotografías integradas en el papel. El ritmo alterna bandas visuales y bloques
editoriales. La temática western es una piel sustituible; la jerarquía y la composición son reutilizables.

[Guía de estilo](STYLE-GUIDE.md) · [Skill manual](.skills/build-web-jia-model/SKILL.md) ·
[Reordenar secciones](project-skeleton/COMPOSITION.md) · [Código y arranque](project-skeleton/README.md) ·
[Catálogo de componentes](web-components/INDEX.md) · [Tecnología y servidor](server-config-info/README.md) ·
[Galería de las 14 capturas](project-screenshots/README.md) · [Procedencia y validación](metainfo/README.md)

## Patrón de diseño, del menú al footer

Los números expresan el orden observado. Los IDs sirven para seleccionar y reordenar piezas sin
arrastrar su texto JIA. «Pestañas» describe la apariencia móvil del programa: técnicamente son
botones de navegación sobre una lista desplazable, con `aria-current`, no un `tablist`.

| Orden / ID | Bloque y propósito | Composición y jerarquía | Adaptación e interacción | Referencia visual |
|---|---|---|---|---|
| 1 · `menu` | Menú superior. Orientación y acceso persistente. | Marca + nombre pequeño a la izquierda; navegación UI en mayúsculas a la derecha; sello final. Fondo papel translúcido con borde fino. | Sticky en escritorio; fijo + panel móvil bajo 960px. Submenú, Escape, bloqueo de scroll y cierre al navegar. | [01](project-screenshots/01-menu.png) |
| 2 · `hero` | Presentación de identidad, fecha y propuesta de valor. | Marca/sello grandes; regla con símbolo; título serif cursiva; fecha UI; entradilla; CTA principal material + secundario de contorno. Foto derecha con disolución orgánica hacia la izquierda. | Desde 960px: foto absoluta 66% y texto protegido. Debajo: texto primero + foto 4:3 con fundido superior; acciones pueden envolver. | [02](project-screenshots/02-hero.png) |
| 3 · `waypoints` | Subhero de enlaces rápidos. | Pequeño rótulo «Por dónde empezar»; tres destinos de icono + título slab + línea descriptiva + flecha; reglas entre columnas. | Columnas iguales desde 1100px, auto-fit desde 640px, filas en pequeño. Hover/foco colorea superficie y desplaza flecha. Número variable de enlaces. | [03](project-screenshots/03-enlaces.png) |
| 4 · `jornadas` | Sección 1: relato y recorrido. | Foto izquierda fundida hacia duna; derecha H2 + prosa alrededor de sello; debajo, itinerario con paradas y carruaje 3D. | Dos columnas 58/42 desde 900px, apilado debajo; ruta cambia geometría bajo 600px. Texto/enlaces siguen disponibles si falla WebGL. | [04](project-screenshots/04-jornadas.png) |
| 5 · `video` | Sección 2: relato audiovisual. | Barra oscura «Intro» + título centrado serif cursiva; vídeo íntegro; controles circulares arriba, transporte con progreso y tiempos abajo. | Play/pause, seek, sonido, fullscreen y PiP según API; compartir en móvil compatible. Carga cercana, pausa fuera de pantalla. Desde 760px puede plegarse al pasar de largo. | [05](project-screenshots/05-video.png) |
| 6 · `program` | Sección 3.1: cronograma/comparador. | Etiqueta de margen «Programa» con regla terracota. Dos jornadas: título slab, fecha cursiva, metadatos UI, filas con numeral romano/hora/descripción. | Dos columnas desde 760px; un día por pantalla con snap y botones encima del carril. Altura medida del panel activo. Reutilizable para variantes/servicios con campos semánticos propios. | [06](project-screenshots/06-programa.png) |
| 7 · `cube` | Sección 3.2: explicación + personas/productos destacados. | Margen «Cómo funcionan»; prosa y H4 «Quién está detrás»; cubo sobre luz/sombra; leyenda, flechas, contador y pista. | Cubo CSS 3D + GSAP; drag horizontal, teclado y botones. Autoplay inicial se detiene al interactuar. Se apila con la prosa bajo 900px. | [07](project-screenshots/07-cubo.png) |
| 8 · `cards` | Sección 3.3: catálogo de talleres/oferta. | Carteles verticales con pin, título slab, subtítulo cursiva, «Ver ficha» y dosier. Fondo fotográfico sutil desde 760px. Modal con imagen grande y texto. | Grid de n cards en escritorio; baraja expandible/deslizable en móvil. Tilt/zoom/velo en hover; click/tap abre ficha con blur y flip. | [08](project-screenshots/08-tarjetas.png) · [09 hover](project-screenshots/09-tarjetas-hover.png) · [10 modal](project-screenshots/10-ficha-modal.png) |
| 9 · `experiences` | Sección 4: prueba, casos o experiencias. | Foto izquierda + velo a papel; derecha H2 grande, entradilla y tira de película con carteles. Capas de luz y recorte del sujeto añaden profundidad. | Composición lateral desde 1280px; apilada debajo. Film desplazable, pausa y visor al tap/click. La película es DOM/CSS; la luz es Three.js. | [11](project-screenshots/11-experiencias-film.png) |
| 10 · `split-hard` | Sección 5A: invitación/CTA con división recta. | Texto izquierdo sobre color sólido (47%); foto derecha (53%) a sangre; H2, subtítulo cursiva, prosa, pista y botón. Sin degradado en el encuentro. | Desde 900px foto derecha absoluta; móvil: título → foto → texto → CTA. Desde 1280px comparte proporción mínima con experiencias. | [12](project-screenshots/12-propuestas-corte-recto.png) |
| 11 · `split-soft` | Sección 5B: alternativa o sección adicional «Acoge JIA». | Foto izquierda que se disuelve hacia columna derecha de 28rem; H2, subtítulo, párrafos y CTA. Velo ligado al límite real del texto. | En móvil <900px foto 16:9 y texto debajo; desaparece el velo lateral. Puede sustituir 5A o convivir con ella si cada CTA tiene un objetivo distinto. | Sin captura adjunta; [fuente conservada](project-skeleton/reference/components/site/Host.tsx) |
| 12 · `partners` | Sección 6: quiénes somos y colaboradores. | Kicker + H2 a la izquierda; explicación y enlaces a la derecha; debajo tira de tarjetas oscuras, imagen, título y flecha circular. | Cabecera 0.9/1.1 desde 900px; tira continua con drag/swipe/rueda horizontal y teclado; pausa con hover/foco; tilt en puntero fino. | [13](project-screenshots/13-quienes-somos.png) |
| 13 · `footer` | Sección 7: cierre, navegación y autoría. | Fondo tinta; marca, columnas de enlaces, escena fotográfica fundida en 2D y herradura 3D registrada sobre un poste. Banda inferior de crédito y enlace adicional. | Columnas se apilan; foto móvil se recorta con su propio encuadre. Herradura solo ≥1100px; doble click o Enter/Espacio activa caída/rebotes/regreso. | [14](project-screenshots/14-footer.png) |

## Cómo pedir este modelo

> Usa la skill manual `built-projects/web-jia/.skills/build-web-jia-model/SKILL.md`.
> Prepara una web para [negocio] con menu, hero, waypoints, cards, split-soft y footer.
> Conserva la jerarquía editorial y sustituye la temática, contenidos y medios por los de [marca].

También se puede pedir solo «el cubo», «las tiras de Quiénes somos», «la baraja de talleres» o
«el footer con foto y objeto 3D». [El catálogo](web-components/INDEX.md) dirige a la implementación adecuada.
La skill queda guardada aquí; no está instalada en los agentes ni activada en la raíz.
