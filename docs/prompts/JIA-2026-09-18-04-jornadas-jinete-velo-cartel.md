# JIA-2026-09-18-04 — «Las jornadas» con el jinete, velo degradado y cartel encajado; sin avisos de no disponibilidad

**Fecha:** 2026-09-18 · **Origen:** cuarta ronda del promotor. Imágenes aportadas: jinete mirando el valle (banda de Jornadas) y muestra de degradado cálido (velo sobre la foto).

## Encargo (transcripción del promotor)

1. Quitar los textos «El canal de presentación todavía no está disponible.» y «El formulario de acogida
   todavía no está disponible.».
2. La imagen del jinete pasa a ser la de la sección «Las jornadas». Se va hacia un degradado similar
   al de la muestra aportada (degradado de color por encima, con opacidad; jugar con ella para que
   quede bien).
3. El título «Las jornadas» tendrá el mismo tamaño y color de fuente que «Tu propuesta puede formar
   parte de las JIA». La sección vuelve a tener un color acorde con las dos imágenes y con la paleta.
4. El párrafo «Un punto de encuentro para docentes…» tendrá el mismo color, fuente y tamaño que el
   párrafo de Dosieres («Este espacio reunirá los dosieres…»).
5. El desafío es encajar visualmente el cartel (¿hover? ¿slide?). /impeccable: el mejor trabajo en esa
   sección.
6. Guardar el prompt, commit, ejecutar y commit al terminar.

## Decisiones de ejecución

- Velo: dos tonos nuevos de la paleta tomados de la muestra (**Duna** `#b7a38b` y **Duna clara**
  `#d7c4aa`), aplicados como degradado horizontal con opacidad decreciente sobre la fotografía (más
  denso a la izquierda, donde va el texto, abierto a la derecha, donde queda el valle) y un fundido a
  papel en el borde inferior para entrar en las hojas del cuaderno.
- Cartel: tarjeta de pergamino pinchada, ligeramente girada, que se endereza y se levanta al pasar el
  cursor; el botón «Ver cartel» (ratón, teclado y toque) lo abre a tamaño completo en el mismo diálogo
  de las fichas. Sin librerías.
- Acciones sin URL: el botón sigue mostrándose deshabilitado; el aviso pasa a ser opcional (`null`).

## Salida

`docs/prompts-output/JIA-2026-09-18-04/report.md`
