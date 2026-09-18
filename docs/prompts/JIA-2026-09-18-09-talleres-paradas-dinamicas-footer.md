# JIA-2026-09-18-09 — Talleres como constantes y paradas dinámicas, botón circular de repetir, pie sin JIA26 y crédito South Desert Studio

**Fecha:** 2026-09-18 · **Origen:** mensajes del promotor en chat durante la ejecución de JIA-2026-09-18-08.
Cierre pedido: «guarda esto como input, commit, ejecuta, commit al terminar y gh push».

## Encargo (transcripción de los mensajes del promotor)

1. «Y ahora, guarda el nombre de los talleres "Por un puñado de bloques", "Dos renders, un destino", "El bueno, el feo y
   el plano", "Siete legos para siete planos", "La profe que pintó a Liberty Valance" y "La muerte tenía un micro" ->
   guardalos en strings, en esta edición JIA son 6 talleres y esos nombres, pero que vaya en un fichero de configuración
   el número de talleres (pues será variable) y se llame en inglés "NUMERO_DE_TALLERES" = 6 en este caso, pero que en
   otro cambie. Y en string const cada uno de los talleres con nombre TALLER_1 = "Por un puñado de bloques" TALLER_2=...
   y así. Y que si el día de mañana hay 8 talleres, haya 8 paradas en el recorrido ;) y aparezcan en la parada el
   nombre.»
2. «Otro detalle asegúrate de que de la animación quita el "Pausar Animación" pero el "REPETIR RECORRIDO" cámbialo por
   una flecha en forma de círculo (sin texto) que si se toca -> lo reproduce de nuevo ;)»
3. «y quita del footer la imagen de JIA26 (abajo a la derecha)»
4. «E incluye en el prompt, que la parada sea la mitad de tiempo ;) en la animación»
5. «Además, un detalle (la y (coordenada y) de cada punto de parada, que no COINCIDA con la y del resto de puntos de
   parada - si lo analizamos en la web como unas coordenadas cartesianas - de esa manera evitamos que el texto de los
   talleres pueda solaparse!! ;)»
6. «y mira ../maryna-ventura y pones en la parte de abajo del footer, debajo de la línea el icono (cópialo de
   maryna-ventura de South Desert Studio) y "diseñado por South Desert Studio" con el gradient dinámico sobre "South
   Desert Studio" y enlace a https://southdesertstudio.com»

## Notas de ejecución

- Nombre del contador: el promotor pide «en inglés» pero dicta literalmente `NUMERO_DE_TALLERES`; se usa el identificador
  dictado.
- Los títulos dictados difieren en dos casos de los transcritos de los carteles en `lib/content/data/workshops.ts`
  («Dos renders y un destino», «El bueno, el feo… y el plano»). Las constantes usan la forma dictada; los datos de los
  carteles no se tocan. Decisión pendiente del promotor: unificar.
- La lectura de `../maryna-ventura` es solo de referencia (copiar icono y gradiente); no se escribe en ese repositorio.
