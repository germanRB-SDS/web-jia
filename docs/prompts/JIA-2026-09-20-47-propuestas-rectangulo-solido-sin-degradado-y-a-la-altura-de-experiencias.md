# JIA-2026-09-20-47 — «Tu propuesta JIA»: el rectángulo sólido de siempre, sin degradado, y a la altura de «Experiencias»

**Fecha:** 2026-09-20 · **Origen:** un mensaje del promotor en chat, revisando el resultado de
`JIA-2026-09-20-46`.
**Nivel:** LEVEL 2 (composición de una sección: se retira un efecto y cambia la altura de la banda) ·
tmp/scratch: **no aplica** (tarea corta, un encargo en una sola capa) → se registra `N/A` en el informe.
**Estado:** PENDIENTE.

## Texto del promotor

> «Está genial commit. pero Vamos a mantener la estética visual que había antes un rectángulo de color solido en
> la mitad izquierda sobre la foto (y el texxto y boton por encima del color solido claro) y quitamos el efecto
> degradado horizontal que iba hacia el indio. puedes aumentar el height d ela section para que tenga el mismo
> height que el de la section anterior "IDEAS QUE HAN PASADO POR EL AULA".»

Se lee como tres cosas, en este orden: **(1)** vuelve la composición de dos mitades limpias, la izquierda maciza
con el texto y el botón encima; **(2)** fuera la máscara horizontal que disolvía el borde hacia el jefe indio;
**(3)** la sección crece hasta la altura de la de arriba, «Ideas que ya han pasado por el aula».

## Estado de partida (medido)

**La composición de hoy.** La sección es un `Section` con `layout="split"`: rejilla de dos columnas, 47 % para el
texto y 53 % para la foto, y de fondo `--jia-bg-deep`. Desde `JIA-2026-09-20-46` la superficie de la foto lleva
una `mask-image` que la disuelve por el borde interior. La mitad izquierda ya es, y era antes, un bloque macizo
del fondo de la sección: lo que el promotor llama «rectángulo de color sólido» es ese fondo, y sobre él van el
título, el subtítulo, los dos párrafos y el botón. **No hay que inventar un rectángulo nuevo: hay que quitar la
máscara** y devolverle a la foto su borde recto en el 47 %.

El fondo de la sección se queda como está. No es un color plano sino `--jia-bg-deep`, y tiene que seguir siéndolo:
la sección de arriba funde el suelo de su fotografía justo contra el color del borde superior de ese degradado
(`Experiences.module.css`, `.photo::after`). Aplanarlo rompería esa costura.

**Las alturas.** Medidas en el navegador:

| Ventana | «Ideas que ya han pasado por el aula» | «Tu propuesta JIA» |
|---|---|---|
| 1920 | 820 | 469 |
| 1440 | 615 | 469 |
| 1280 | 547 | 469 |
| 1024 | 1476 | 483 |
| 900 | 1326 | 452 |
| 390 | 1407 | 664 |

De 1280 px en adelante la sección de «Experiencias» mide **exactamente su fotografía a sangre**:
`height: calc(100vw / (1919 / 820))`, que da 820, 615 y 547 px. Por debajo de 1280 px esa sección es otra cosa —
una banda de foto y debajo una pila de fichas— y su altura (1326–1476 px) no significa nada aquí. Así que
«el mismo height» se ejecuta **en el mismo tramo en que esa regla existe: de 1280 px en adelante**.

**Consecuencia sobre el encuadre, que es lo que hay que medir.** Con la sección a esa altura, la columna de la
foto pasa a tener una proporción **constante** en todo el tramo: `0,53 × 1919 / 820 = 1,240`. Como la imagen es
1,777, `object-fit: cover` resuelve **por altura**: no se recorta nada por arriba ni por abajo (adiós al riesgo M2
del informe anterior, el sombrero del sheriff) y se ve el **69,9 % del ancho** de la foto, siempre el mismo. Qué
69,9 % lo decide el punto focal horizontal, que hoy está en 50 y habrá que mover.

## Encargo

### 1. Fuera el degradado horizontal

Se retira la `mask-image` de la columna visual, en escritorio y en móvil. La foto recupera su borde recto contra
el bloque de la izquierda. No se sustituye por un velo suave ni por nada: el promotor pide dos mitades limpias.

### 2. La altura de la banda de arriba

De 1280 px en adelante, la sección mide lo mismo que «Experiencias». La proporción `1919 / 820` deja de estar
escrita sólo dentro de `Experiences.module.css` y pasa a ser un **token compartido** en `app/globals.css`, que
consumen las dos secciones: si un día cambia la foto del aula, las dos bandas siguen midiendo lo mismo sin que
nadie se acuerde de tocar la segunda.

Dos detalles de composición que hay que resolver, no dar por hechos:

- **La columna de texto no debe estirarse.** La rejilla del `split` tiene dos filas (cabecera y contenido). Si la
  sección crece sin más, esas filas se reparten el aire sobrante y el título se separa de los párrafos. El bloque
  de texto tiene que conservar su tamaño y **centrarse entero** en la altura nueva.
- **La foto sí debe llenar la altura entera.** Si se queda dentro de las filas de la rejilla, medirá lo que mida
  el texto y dejará fondo arriba y abajo. Va anclada a la banda, como ya hace la foto del hero.

### 3. El punto focal

Con el 69,9 % del ancho visible hay que elegir qué se ve. El encargo anterior sigue vigente en lo esencial: la
maestra de la izquierda del todo (9–24 % del ancho) **no** tiene que verse, y el jefe indio **sí**, ahora entero y
sin velo. El punto focal horizontal debe dejar el borde de corte pegado al arranque de su tocado, y hay que
**medirlo** sobre el rectángulo realmente dibujado, no estimarlo.

Por debajo de 1280 px la columna es más estrecha y se verá menos ancho de foto: hay que comprobar hasta 900 px
que la cara del jefe indio sigue dentro, y por debajo de 900 px que la foto se sigue viendo entera bajo el texto.

## Verificación exigida

- `npx tsc --noEmit`, `npm run check:content` y `npx next build` en verde.
- Altura de las dos secciones medida y **coincidente** a 1920, 1440 y 1280 px.
- Ventana visible de la foto medida a 1920, 1440, 1280, 1024 y 900 px, y encuadre revisado.
- Capturas de la sección en `docs/prompts-output/JIA-2026-09-20-47/evidence/`.

## Cierre

Práctica 14: commit(s) de implementación con su verificación en verde, después informe en
`docs/prompts-output/JIA-2026-09-20-47/` con resumen y análisis de riesgo, y commit documental aparte. Push por
`sds-dev-governance/scripts/git-safe-push.sh origin main`.
