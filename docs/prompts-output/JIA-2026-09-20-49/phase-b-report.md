# JIA-2026-09-20-49 · Informe de fase B — fichas, propuestas, pie y menú

**Fecha:** 2026-09-21 · **Puntos:** 3, 4, 5 y 6 · **Nivel:** LEVEL 2 · **tmp/scratch:** N/A
**Commits de implementación:** `0ca224a`, `dd7a676`, `58e62c0`, `f1888ae`

## Resumen

**Punto 3 — el aire muerto sobre «Ver ficha».** Las siete filas de la tarjeta (`subgrid`) existen para que
dos fichas **una al lado de otra** alineen sus filas y sus dos acciones queden a la misma altura: por eso el
título, el subtítulo, el «quién» y la «temática» guardan sitio para dos líneas aunque tengan una o ninguna.
En el teléfono hay una ficha por vista y no hay vecina con la que alinearse, así que esas reservas eran aire
vacío. Por debajo de 760 px la tarjeta se maqueta sola: sin `subgrid`, sin colocación explícita de filas y
sin alturas mínimas. **Medido a 390 px: de 84 px a 11 px** en las dos fichas de «Ideas que ya han pasado por
el aula» y en las de talleres; la ficha verde oliva pasa de 406 px a 295 px de alto. El botón conserva sus
44 px de zona de toque. A 1440 px no cambia nada: los seis «Ver ficha» de talleres y los dos de experiencias
siguen a la misma altura.

**Punto 4 — la hoguera bajo el título.** Apilada (por debajo de 900 px) la foto cerraba la sección y la
siguiente, «Acoge JIA», abre con otra fotografía a sangre: dos imágenes pegadas sin frontera. Ahora va entre
la cabecera y los párrafos. Medido a 390 px: cabecera (5949) → foto (6118, a sangre, 390 px) → texto (6366),
y **una sola descarga** de la imagen. De 900 px en adelante la banda de dos mitades queda intacta.

**Punto 5 — la zona derecha del establo.** La fotografía se coloca por su poste, y en móvil ese poste
quedaba fuera de la pantalla; además, dimensionada por el **alto** del bloque —muy alto en un teléfono— la
imagen salía de 3 941 px de ancho y la ventana caía sobre un décimo de ella. Por debajo de 760 px se
dimensiona por su **ancho** (936 × 312 px), centrada en el bloque, con el poste al 62 %: la ventana enseña
del **54 % al 95 %** de la imagen (patas del caballo, poste iluminado, cuerda y barreño). Como la banda ya no
llena el bloque, la imagen se funde también por arriba y por abajo. El velo se reescribe para este tramo
(0,82 → 0,66 → 0,42 de tinta) porque el de ventanas anchas se abre a nada justo antes del poste.

**Punto 6 — la franja del pie y el menú.**

- **6.1** «Sí, son estepicursores» no se muestra por debajo de 760 px (y tiene sentido: las plantas rodadoras
  sólo ruedan bajo un puntero que entra en el pie, y un teléfono no tiene puntero). De 760 px en adelante
  sigue como estaba.
- **6.2** La marca del estudio, un 15 % mayor que lo que se dibujaba: `1,15 → 1,3225` de su caja, en todas
  las resoluciones. Caja maquetada 32 px, dibujada 42 px. Sigue siendo una transformación y no una caja
  mayor, porque la altura de la franja y el tamaño de los estepicursores se calculan con esa caja.
- **6.3** «Diseñado por South Desert Studio» sube por la escala de interfaz del proyecto: un punto en móvil
  (15 px) y dos de 760 px en adelante (16 px).
- **6.4** Entrada nueva al final del panel del menú, separada por un filete: «Contacta con South Desert
  Studio», que abre `southdesertstudio.com` en pestaña nueva. La dirección sale de `productionStudio.url`
  (`lib/content/site.ts`) y el rótulo de `lib/content/copy/es/common.ts`. Se modela como ítem de navegación
  externo en `nav.studio`, **fuera de `nav.items`**, para que la lista SECCIONES del pie —que se construye
  con `nav.items`— no la herede. No aparece en la barra de escritorio (≥ 960 px).

## Evidencia

| Comprobación | Resultado |
|---|---|
| `npx next build` · `npx tsc --noEmit` · `npm run check:content` | verde |
| Separación título → «Ver ficha» a 390 px | 84 px → **11 px** (oliva, marrón y talleres) |
| Alineación a 1440 px | los ocho «Ver ficha» siguen a la misma altura por fila |
| Orden en «Tu propuesta JIA» a 390 px | cabecera → foto (a sangre) → texto; una sola descarga |
| Ventana del establo a 390 px | 54 %–95 % de la imagen; poste y puerta dentro |
| Contraste de los enlaces del pie a 390 px | peor caso **9,57:1** (AA pide 4,5:1), compuesto sobre la captura sin texto |
| Franja del pie | nota oculta a 390 px, visible a 768 y 1440; marca 42 px dibujados; crédito 15 px (móvil) / 16 px (≥ 760) |
| Menú | «Contacta con South Desert Studio» a 390 px con `target="_blank"`, `rel="noopener noreferrer"` y aviso de pestaña nueva; oculto a 1440 px; SECCIONES del pie sin cambios |

Capturas en `evidence/`: `mobile-390-experiencias-fichas.png`, `mobile-390-propuestas-hoguera.png`,
`mobile-390-pie-establo.png`, `mobile-390-pie-franja-estudio.png`, `mobile-390-menu-contacta.png`,
`mobile-390-pagina-completa.png`, `desktop-1440-talleres.png`.

## Análisis de riesgo

**Críticos nuevos: ninguno.** Ningún dato, contrato, permiso, secreto ni ruta de despliegue cambia. Las tres
verificaciones del proyecto están en verde y la no-regresión de escritorio está medida.

**Severos: ninguno.**

**Moderados:**

1. **Cuatro reglas de este prompt dependen del ORDEN dentro de su hoja.** Las sobrescrituras de móvil de
   `.stable`, `.stableImg`, `.stableGround::after` y `.weedsNote` tienen la misma especificidad que las
   reglas base, así que ganan sólo por ir después. Durante la ejecución tres de ellas se escribieron antes y
   no se aplicaban; se detectó midiendo el estilo calculado, no leyendo el fichero.
   *Solución propuesta:* quedan escritas después de su regla base y con un comentario que lo dice. Para el
   futuro: cuando se toque `SiteFooter.module.css`, comprobar el estilo **calculado** en el navegador y no
   dar por hecho que una `@media` gana por serlo. No se sube la especificidad a propósito: hacerlo
   escondería el problema en vez de dejarlo a la vista.

2. **El velo del pie en móvil se afinó contra una fotografía concreta.** El margen es amplio (9,57:1 frente
   a 4,5:1), pero si mañana se cambia `footer-establo` por una imagen más clara, el contraste baja sin que
   nadie lo note.
   *Solución propuesta:* repetir la medición de contraste al cambiar esa imagen. Queda anotado aquí y en el
   informe del prompt; no se automatiza ahora porque el proyecto no tiene todavía un banco de pruebas
   visuales.

3. **El modelo de navegación gana un camino que no es un ancla.** `NavItem.external` y `nav.studio` abren la
   puerta a mezclar destinos internos y externos en el mismo tipo.
   *Solución propuesta:* aceptado y acotado: `nav.studio` es un campo aparte, no un elemento más de
   `nav.items`, precisamente para que ningún consumidor (el pie, por ejemplo) lo trate como una sección de
   la página. Si algún día hubiera más enlaces externos, conviene una lista propia.

4. **La tarjeta tiene ahora dos maquetaciones.** Por debajo de 760 px fluye y por encima se alinea con la
   rejilla. Un cambio futuro en las filas de la tarjeta hay que pensarlo dos veces.
   *Solución propuesta:* el bloque de móvil está junto a las reglas que anula y explica por qué existe. Sin
   trabajo pendiente.
