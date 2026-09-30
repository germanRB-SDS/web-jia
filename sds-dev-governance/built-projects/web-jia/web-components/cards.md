# Tarjetas: grid, baraja móvil, hover y ficha con flip

Fuentes conservadas: [TalleresCarrusel](../project-skeleton/reference/components/site/talleres-carrusel/TalleresCarrusel.tsx),
[SheetCard](../project-skeleton/reference/components/primitives/SheetCard.tsx),
[SheetDialog](../project-skeleton/reference/components/primitives/SheetDialog.tsx),
[TiltCard](../project-skeleton/reference/components/tilt-card/TiltCard.tsx),
[FlipCard](../project-skeleton/reference/components/flip-card/FlipCard.tsx). Cada una requiere su CSS;
los motores Tilt y Flip necesitan config y motion. No están publicados todavía como export neutral único.

## Composición

Cartel vertical1414/2000 sobre superficie con pin centrado terracota; título slab en tinta,
subtítulo serif cursiva, acción de ficha y dosier. Preview omite Imparte/Temática; el diálogo conserva
esos campos y el detalle. La celda alinea filas con vecinas; no quitar filas sin comprobar la parrilla.
El espaciado de subtítulo a «Ver ficha» es4px en escritorio. Fondo suave solo desde760px, opacity.44,
fundido arriba/abajo; decorativo y fuera de puntero.

## Estados e interacción

| Estado | Comportamiento |
|---|---|
| Grid desktop | n tarjetas; auto-fill mínimo240px, gap fluido. Sin carril con overflow que corte la tarjeta ampliada. |
| Hover/foco | Surface sube3px; resumen aparece sobre velo oscuro inferior. Tilt usa puntero fino con hover: escala1.07, tope12°, perspectiva1500px y brillo siguiendo el puntero. |
| Reposo móvil <760px | Cartas superpuestas como baraja; acción explícita para desplegar. No ocultar acceso a las otras fichas tras un hover inexistente. |
| Exploración móvil | Carril horizontal con snap, flechas y navegación; cartel con reserva5% por lado. Umbral gesto6px; cola750ms. |
| Retorno a baraja | Tras5000ms sin explorar, con guardas de foco, modal, pointer y visibilidad; actividad se recuerda en memoria del documento. No cerrar bajo el dedo ni robar foco. |
| Abrir ficha | Imagen y «Ver ficha» son botones reales, aria-haspopup dialog. Tap/click/teclado abren el mismo contenido. |
| Diálogo desktop | Nativo showModal; max62rem y altura de viewport menos2rem; fondo tinta55% + blur2px. Botón cerrar, Escape, click en fondo y restauración explícita del foco. |
| Diálogo móvil | Talleres: ocupa100dvh; panel scrolleable, cerrar fijo con safe-area; bloquea scroll raíz y restituye estado. |
| Flip al abrir | Frente→reverso1000ms, pausa400ms con sello, vuelta1000ms con sine.inOut. Perspectiva3000px. Después tilt fino máx12°; con reduce queda frente estático. |

Los datos proceden de `SheetModel`: título/subtítulo, personas/meta, media, sheet y acciones;
labels y contenido extendido están en copy. `flipBack` opcional es media independiente. Conservar
reverso y su proporción; el screenshot10 captura el frente y **no** documenta visualmente el reverso.

## Adaptación y aceptación

Sustituir talleres por ofertas reales; cada botón debe mostrar contenido distinto según ID.
Conservar alt, disponibilidad de dosier y estados vacíos. Validar card0/1/n, títulos largos,
imagen ausente, links externos, 5s idle con modal abierto, swipe que no abre diálogo, foco dentro de
una ficha, resize móvil→desktop y motion toggle. La referencia usa la política JIA; para extraer,
inyectar política del destino o soporte neutral de los exports, sin una segunda fuente de motion.

[Normal](../project-screenshots/08-tarjetas.png) · [Hover](../project-screenshots/09-tarjetas-hover.png) ·
[Modal](../project-screenshots/10-ficha-modal.png). No hay captura móvil adjunta; consultar CSS/engine
antes de describir el mazo como pixel-perfect respecto a una imagen inexistente.
