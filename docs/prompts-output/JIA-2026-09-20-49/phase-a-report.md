# JIA-2026-09-20-49 · Informe de fase A — el móvil de las jornadas

**Fecha:** 2026-09-21 · **Prompt:** `docs/prompts/JIA-2026-09-20-49-movil-jornada-1-y-2-con-pestanas-talleres-en-carrusel-fichas-mas-juntas-y-pie-y-menu.md`
**Puntos:** 1 (programa con pestañas) y 2 (talleres en carrusel) · **Nivel:** LEVEL 2 · **tmp/scratch:** N/A
**Commits de implementación:** `12fffed`, `a9ba29f`, `97bd3fc`

## Resumen

**Punto 1 — el programa.** Por debajo de 760 px las dos jornadas dejan de apilarse. Bajo el rótulo
«PROGRAMA», con 28 px de aire (antes 16), aparecen los dos rótulos **JORNADA 1** y **JORNADA 2**, y bajo el
que se está leyendo una línea terracota de 3 px. Las dos jornadas viven en una pista horizontal con
`scroll-snap`, una por vista. Deslizar mueve la línea; pulsar un rótulo mueve la pista; `←` y `→` cambian de
jornada desde el teclado. El `h4` de cada jornada se oculta **sólo visualmente** en móvil, de modo que el
esquema de encabezados del documento no cambia. La pista mide lo que mide la jornada abierta (725 px con la
Jornada 1, 874 px con la Jornada 2 a 390 px), medido con un `ResizeObserver`.

El marcado del programa y su CSS se mudan a `components/site/programa-dias/`; `Jornadas.tsx` sigue siendo un
componente de servidor. De 760 px en adelante la composición es la misma de siempre: dos columnas de 337 px
a 768 y de 480 px a 1440, con su filete vertical y el `h4` visible.

**Punto 2 — los talleres.** Por debajo de 760 px las seis fichas pasan a una pista con `scroll-snap`: cada
ficha mide `min(78%, 19rem)` (279 px a 390 px de ventana) y la siguiente asoma a 315 px, de modo que se ve
que aquello se desliza. La pista deja 10 px de aire arriba para no recortar la chincheta. Debajo, dos
botones redondos de 44 × 44 px mueven una ficha (paso medido: 299 px = ficha + medianil) y se desactivan en
los extremos.

Estética elegida para los botones: el aro de la tarjeta de colaboradores llevado al papel (aro `--jia-line`,
chevrón terracota, relleno terracota al pulsar o enfocar), **no** el control del vídeo. El control del vídeo
lleva disco de tinta translúcido y `backdrop-filter` porque tiene que leerse sobre película en marcha; sobre
este papel sería una mancha oscura.

De 760 px en adelante, la rejilla de siempre: dos columnas a 768 px, tres a 1440 px, sin botones, sin
`overflow` y con la alineación de siete filas (`subgrid`) intacta.

## Evidencia

| Comprobación | Resultado |
|---|---|
| `npx next build` | verde (4/4 páginas) |
| `npx tsc --noEmit` | verde |
| `npm run check:content` | `ok (6 workshops, 38 people, 2 experiences, 0 resources, 61 media)` |
| Pestañas a 390 px | pulsar → `scrollLeft` 0 / 358; deslizar → `data-active` salta al rótulo correcto; `aria-current="true"` sólo en uno |
| No regresión a 768 / 1440 px | tira oculta (`display: none`), dos/tres columnas, `h4` en `position: static`, filete de 1 px |
| Carrusel a 390 px | ficha 279 px, asoma la siguiente a 315 px, chincheta no recortada (10 px de aire), botones 44 × 44, desactivados en los extremos |
| Diálogo dentro del carrusel | abre (`position: fixed`, ancho 358 px) y el foco va al botón «Cerrar»; mismo comportamiento que en «Experiencias», fuera del carrusel |

Capturas: `evidence/mobile-390-programa-jornada-1.png`, `evidence/mobile-390-programa-jornada-2.png`,
`evidence/mobile-390-talleres-carrusel.png`.

## Análisis de riesgo

**Críticos nuevos: ninguno.** No se ha tocado dato, contrato, permiso, secreto ni ruta de despliegue; el
cambio es de composición y de comportamiento de interfaz, y las tres verificaciones del proyecto están en
verde.

**Severos: ninguno.**

**Moderados:**

1. **`Jornadas.tsx` deja de ser servidor puro en dos puntos.** El programa y la pista de talleres son ahora
   islas cliente. No añaden datos ni peticiones —el modelo es el mismo y las fichas se pasan como
   `children` ya renderizadas—, pero sí JavaScript en el cliente que antes no había.
   *Solución propuesta:* aceptado, es el precio del encargo; queda acotado a dos componentes pequeños sin
   estado compartido. Si algún día pesa, el programa admite una versión sin JS (la pista se desliza igual;
   lo que se perdería es la sincronía de la línea).

2. **Sincronía de la línea atada a `Math.round(scrollLeft / clientWidth)`.** Con un deslizamiento que se
   queda a medio camino y sin `snap` resuelto —un navegador que ignore `scroll-snap-stop`— la línea podría
   marcar la jornada que ocupa más de la mitad de la vista aunque el dedo apuntara a la otra.
   *Solución propuesta:* aceptado. `scroll-snap-type: x mandatory` obliga al navegador a resolver a una de
   las dos posiciones, así que el estado intermedio no persiste. Revisar en un dispositivo real en la
   próxima pasada de QA (fase futura).

3. **Alto de la pista del programa calculado en el cliente.** Antes de la hidratación la pista no tiene
   `--programa-alto` y toma el alto de la jornada más larga; tras hidratar se ajusta. En una conexión lenta
   eso es un salto de ~150 px en el primer pintado.
   *Solución propuesta:* aceptable porque el salto ocurre **antes** de que el bloque entre en pantalla en un
   recorrido normal (el programa está a 2 300 px del inicio). Si molestara, se puede fijar el alto de la
   primera jornada en CSS con una `min-height` de arranque; queda anotado para una fase futura, no se hace
   ahora para no clavar un número que depende del texto.

4. **Un salto de tabulación nuevo por pista con scroll.** La pista de talleres es focalizable mientras se
   pueda desplazar (requisito de accesibilidad para una caja con scroll). En escritorio no lo es, porque
   allí no desplaza nada: se comprueba en el propio componente con el estado de los extremos.
   *Solución propuesta:* ya resuelto así; nada pendiente.

## Pendiente

Fase B: puntos 3 (aire muerto sobre «Ver ficha»), 4 (la hoguera bajo el título), 5 (el establo por su
derecha) y 6 (franja del pie y menú). El punto 3 afecta también a las fichas de este carrusel: la separación
antes de «Ver ficha» sigue siendo la de hoy hasta que se ejecute.
