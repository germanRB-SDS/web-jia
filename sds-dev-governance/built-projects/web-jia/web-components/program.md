# Programa / presentación de opciones

[Fuente](../project-skeleton/reference/components/site/programa-dias/ProgramaDias.tsx) ·
[CSS](../project-skeleton/reference/components/site/programa-dias/ProgramaDias.module.css) ·
[reloj](../project-skeleton/reference/components/site/programa-dias/clock.ts) · [captura](../project-screenshots/06-programa.png).

Entradas reales: days, clock, copy, markLabels, showMarks. Los días y sesiones se ensamblan desde
`lib/content/data/program.ts` + diccionario; respetar relaciones por ID, zona horaria y semántica
de los intervalos. La hora no se infiere del texto mostrado. El SVG temático es decorativo y opcional.

Desktop ≥760px muestra dos columnas con línea vertical; etiquetas de día slab1.5–2.125rem,
fecha1.25rem cursiva, metadatos flex que envuelven. Filas con columnas 2.25rem/5.75rem/resto:
numeral romano, horario tabular y descripción. Hay filas sin numeración vinculadas al tramo previo.

Móvil: botones con `aria-controls` y `aria-current` dentro de role group, no tablist; lista horizontal
scroll-snap con un día por vista. Se puede arrastrar y navegar por botones/teclado. Los encabezados
de cada panel permanecen accesibles aunque se oculten visualmente. ResizeObserver ajusta altura al
día seleccionado. Motion reduce elimina transiciones y evita scroll animado.

Para productos/servicios: conservar layout comparativo, usar etiquetas/atributos del negocio y
retirar reloj, fechas, mapa o numerales cuando carezcan de significado. Más de dos opciones requiere
adaptar el grid desktop (actualmente dos columnas), probar overflow y navegación; no es una capacidad
probada por el screenshot de dos jornadas.
