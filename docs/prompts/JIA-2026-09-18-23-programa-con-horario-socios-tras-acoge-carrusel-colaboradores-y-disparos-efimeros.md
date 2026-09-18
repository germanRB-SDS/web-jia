# JIA-2026-09-18-23 — Programa con horario, «Quién hace posible las JIA» tras Acoge con carrusel de colaboradores, y disparos efímeros en el pie

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat (con captura de referencia del carrusel).
**Nivel:** LEVEL 2 · tmp/scratch: N/A (cuatro cambios acotados, una sola fase).

## Encargo

### 1. Programa: las sesiones pasan a ser el horario real

Se mantiene la numeración romana de la lista; donde hoy va el texto orientativo va **la hora y la actividad en una
misma línea**, una sesión por línea.

**Jornada 1** (I–V):

| | Hora | Actividad |
|---|---|---|
| I | 16:00–17:00 h | Recepción |
| II | 17:00–17:30 h | Inauguración |
| III | 17:30–18:00 h | Apertura |
| IV | 18:00–19:00 h | Conferencia inaugural: Creatividad en educación |
| V | 19:00–20:30 h | Exposición de Buenas Prácticas de la provincia de Almería |

**Jornada 2** (I–IX):

| | Hora | Actividad |
|---|---|---|
| I | 10:00–11:30 h | Talleres (1) |
| II | 11:30–12:15 h | Desayuno |
| III | 12:30–14:00 h | Talleres (2) |
| IV | 14:00–16:00 h | Comida |
| V | 16:00–17:30 h | Talleres (3) |
| VI | 19:00–20:00 h | Dinámica de cierre. Juego: El duelo |
| VII | 20:00–20:30 h | Clausura de las jornadas |
| VIII | — | Vídeo de cierre de las jornadas |
| IX | — | Agradecimientos y despedida |

Normalización tipográfica del mensaje (sin cambiar contenido): raya entre horas, «h» tras el tramo, sin punto final,
«19:00: 20:30» → «19:00–20:30», «20: 00» → «20:00», doble punto de la conferencia eliminado, mayúscula inicial en
«Clausura», «JUEGO: EL DUELO» en caja normal. Cualquier otra duda de redacción se anota en el informe, no se inventa.

Reglas:

- La **hora va en datos** (`lib/content/data/program.ts`, campo `time` de cada sesión) y la **actividad en copy**
  (`copy/es/sections/jornadas.ts`, `program.sessions[id]`); el sufijo «h» sale de copy, no del componente.
- `kind`: `workshop` para Talleres, `break` para Desayuno y Comida, `block` para el resto.
- En la línea: romano · hora (cifras tabulares, columna de ancho estable para que las actividades arranquen alineadas)
  · actividad. Las dos sesiones sin hora (VIII, IX) alinean su texto con las demás actividades.
- No se tocan `hours`, fecha ni sede de cada jornada. Si el horario nuevo contradice el «Horario» impreso en la ficha,
  se **señala en el informe** y no se corrige por cuenta propia.

### 2. «Quién hace posible las JIA» se mueve debajo de Acoge

Orden nuevo del final de la página: … Propuestas → **Acoge («Dispara tu centro»)** → **Socios** → pie. Hay que
resolver las dos costuras que cambian: Acoge ya no termina contra la tinta del pie sino contra el fondo de Socios, y
Socios pasa a ser lo último antes del pie. Actualizar el comentario de orden de `app/page.tsx`.

### 3. Socios: fuera el colofón, entra un carrusel de colaboradores

- **Se mantiene** la cabecera tal cual: antetítulo «Organiza y colabora» con su filete, título, y el párrafo con los
  tres CEP enlazados. **Se mantiene la línea horizontal** que separaba cabecera y colofón.
- **Se quita** el colofón (columnas «Organiza» / «Colabora») y la nota «Los logotipos se incorporarán…». Se limpia el
  modelo, el copy y el CSS que queden sin uso. Los organizadores siguen citados en el párrafo y en el pie.
- **Entra un carrusel** bajo la línea, con una tarjeta por entidad de «Colabora», en el orden de
  `data/organizations.ts`: South Desert Studio, Minihollywood Oasys Theme Park, Leonardo Atrezzo, Kichi García Films,
  La Gata Púrpura. Nombres y URL salen de esa misma fuente (la que ya usa el pie); **no se duplican**.

**La tarjeta** («tarjeta-colaboradores»; en el código `CollaboratorCard`, PascalCase como el resto de componentes).
Referencia: la captura aportada (tarjetas oscuras de esquinas redondeadas con la foto dentro), adaptada así:

- Tarjeta contenedora oscura, vertical, con la **imagen** dentro (rectángulo apaisado con su propio radio).
- **Título** (nombre de la entidad) en **blanco y centrado** en el hueco que queda bajo la imagen.
- **Sin importe, sin descripción y sin botón «+».** En su lugar, un **círculo con una flecha «>»** que es el **enlace
  a la web de la entidad** (pestaña nueva, `rel="noopener noreferrer"`, nombre accesible con el aviso de pestaña nueva).
- **Imagen provisional: color sólido** de la paleta (uno distinto por tarjeta, vía tokens `--jia-surface-*`), hasta
  que el promotor entregue las fotos con el logotipo. Cuando lleguen bastará con rellenar `logoMediaId` en
  `organizations.ts`: la tarjeta pinta la imagen en el mismo hueco. El color de cada entidad va en configuración de
  sección, no en el componente.

**El carrusel:**

- Se arrastra con clic mantenido (ratón) o con el dedo, **a izquierda y a derecha**, con inercia al soltar; el
  desplazamiento vertical de la página no se bloquea en táctil.
- Sin fin: con solo cinco tarjetas tiene que poder arrastrarse en cualquier ancho de pantalla. Las copias que lo hacen
  posible quedan fuera del árbol de accesibilidad y del orden de tabulación.
- Un arrastre no dispara el enlace; un clic limpio sobre la flecha, sí. El clic en el resto de la tarjeta no navega.
- Teclado: las flechas de cada tarjeta son alcanzables con Tab y la tarjeta enfocada entra en vista; con el carrusel
  enfocado, ← / → lo mueven una tarjeta.
- `prefers-reduced-motion`: sin inercia ni transiciones; el arrastre sigue funcionando.
- Sin dependencias nuevas. Ningún texto en el componente (etiqueta de región, ayuda de arrastre y aviso de pestaña
  nueva, en el copy de la sección).

### 4. Pie: cada disparo se desvanece a los 3 s

Cada balazo del pie, por separado, empieza a desvanecerse 3 s después de aparecer y se retira del DOM al terminar.
Duraciones en `lib/content/sections/footer.ts`. Los balazos del cubo **no cambian** (la pieza compartida
`primitives/BulletHole` recibe el desvanecimiento como opción). Con movimiento reducido desaparece sin transición.
El tope `maxShots` se conserva.

### 5. Cierre

`tsc`, `check:content` y `next build` en verde; comprobación en Chrome real a 1440 y 390 px (programa, costuras
Acoge→Socios→pie, arrastre en los dos sentidos, clic en flecha frente a arrastre, teclado, vida de 3 s del balazo);
capturas en `docs/prompts-output/JIA-2026-09-18-23/evidence/`; nota de actualización en `DESIGN.md`; commit de
implementación, informe de fase con riesgos, commit del informe y **push**.

## Fuera de alcance

Fotos o logotipos reales de los colaboradores (pendientes del promotor), cambios en el pie más allá de los balazos,
y cualquier corrección del «Horario», fecha o sede de las jornadas.
