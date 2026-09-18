# JIA-2026-09-18-23 — Programa con horario, Socios tras Acoge con carrusel de colaboradores, y disparos efímeros en el pie

**Prompt:** `docs/prompts/JIA-2026-09-18-23-programa-con-horario-socios-tras-acoge-carrusel-colaboradores-y-disparos-efimeros.md` ·
**Fecha:** 2026-09-18 · **Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.
**Commit de implementación:** `46f9ee9`.

## Resumen

- **Programa:** Jornada 1 con cinco sesiones (I–V) y Jornada 2 con nueve (I–IX). La hora va en datos
  (`data/program.ts`, `time`), la actividad en copy (`program.sessions`) y el sufijo «h» en `program.timeFormat`.
  Cada fila: numeral · hora (Barlow, cifras tabulares, columna fija de 5,75 rem) · actividad; VIII y IX, sin hora,
  alinean con el resto. `kind`: `workshop` en Talleres, `break` en Desayuno y Comida.
- **Orden:** … Propuestas → Acoge → **Socios** → pie. La fotografía de Acoge ya no funde a tinta sino al vitela
  `--jia-vellum-4`, y Socios descansa sobre ese mismo vitela plano: no se ve la costura. Socios → pie es papel contra
  tinta, como el resto de entradas al pie.
- **Socios:** se conservan antetítulo, título, párrafo con los CEP enlazados y la línea. Fuera el colofón
  «Organiza / Colabora» y la nota de logotipos (modelo, copy y CSS limpiados; los organizadores siguen en el párrafo
  y en el pie). Entra `components/site/collaborators-carousel/`:
  - `CollaboratorCard` («tarjeta-colaboradores»): tarjeta oscura, imagen 4:3, nombre en marfil centrado en el eje de
    la tarjeta y círculo con «>» como único enlace (pestaña nueva, nombre accesible «Visitar la web de … (se abre en
    una pestaña nueva)»). Imagen provisional: color sólido por entidad en `lib/content/sections/socios.ts`
    (terracota, cobre, oliva, terracota profunda, duna; dos tokens de superficie nuevos). Con `logoMediaId` relleno
    en `organizations.ts` la foto ocupa el mismo hueco, sin tocar componentes.
  - `carousel-engine.ts`: pista sin fin movida por transformación; arrastre con ratón o dedo en ambos sentidos,
    inercia que asienta en una tarjeta, rueda lateral, ← / →, y la tarjeta enfocada con Tab entra en vista.
    `touch-action: pan-y` deja libre el desplazamiento vertical. Las copias van con `aria-hidden` y `tabindex="-1"`.
    Nombres y URL salen de `data/organizations.ts`, la misma fuente del pie. Sin dependencias nuevas.
- **Pie:** cada balazo vive 3 s (`shotLifeMs`), se desvanece en 700 ms (`shotFadeMs`) y sale del DOM. `BulletHole`
  recibe `leaving` como opción; el cubo no la usa y sus balazos no cambian.

## Verificación (Chrome real por CDP, 1440 y 390 px)

- Programa: 5 y 9 filas, numeración I–V / I–IX, actividades alineadas; sin desbordes a 390 px.
- Carrusel a 1440: primera tarjeta a 80 px = borde del contenedor (16 / 16 a 390). Arrastre a la izquierda
  −1520 → −2159 px y a la derecha cruzando el empalme, sin huecos. Arrastre iniciado sobre una flecha: **no** abre el
  enlace; clic limpio: abre `https://www.kichigarciafilms.com/`. `→` avanza una tarjeta (320 px). Foco en la 5.ª
  tarjeta (fuera de vista): queda en 80–376 px. 5 enlaces tabulables, 10 tarjetas-copia ocultas. Sin scroll
  horizontal de página en ninguno de los dos anchos.
- Balazos: dos disparos separados 1,5 s → opacidad 1 a los 2,9 s, 0,80 a los 3,3 s, 0,29 a los 3,6 s y fuera a los
  3,9 s; el segundo repite la curva 1,5 s después. Cada uno por su cuenta.
- Movimiento reducido: el arrastre funciona y la pista se queda donde se suelta (−1850 → −1850); el balazo
  desaparece de golpe a los 3 s.
- `tsc`, `check:content`, `next build`: OK. Capturas en `evidence/`.

## Incidencia durante la ejecución

El primer montaje entró en bucle: el contenedor del carrusel crecía con su pista, el motor medía un ancho mayor y
pedía más copias (2005 tarjetas y scroll horizontal). Corregido en la causa (`grid-template-columns: minmax(0, 1fr)`)
y con un tope defensivo (`maxCopies: 8`). Verificado después: 15 tarjetas a 1440 y a 390.

## Decisiones tomadas sin instrucción expresa

- «Título en blanco» se resuelve con el marfil de la paleta (`--jia-ivory`), el blanco del sistema; no hay `#fff`.
- La superficie vacía del sistema lleva una chincheta; en estas tarjetas se oculta porque se pidió color sólido.
- Se añade una ayuda visible, «Arrastra a izquierda o derecha» (en copy).
- El carrusel no avanza solo: solo se mueve con el gesto de quien visita.
- Redacción: «Exposición de Buenas Prácticas **de la** provincia de Almería» (el mensaje decía «Buenas Prácticas
  provincia de Almería») y «Juego: El duelo» en caja normal. Cambiar ambas es una línea en `jornadas.ts`.

## Riesgos

- **Moderado — contradicción de contenido visible.** El «Horario» de cada ficha sigue siendo el del cartel
  (Jornada 1: 16:30–20:30; Jornada 2: 9:30–14:30 · 16:30–20:30) y el horario nuevo empieza a las 16:00 y a las 10:00
  y no tiene pausa de 14:30 a 16:30. Además la Jornada 2 deja un hueco sin actividad de 17:30 a 19:00. No se ha
  corregido por estar fuera del encargo. *Propuesta:* que el promotor confirme los tramos y ajustar `hours` en
  `data/program.ts` (una línea por jornada).
- **Moderado:** los enlaces de las tarjetas-copia no son tabulables pero sí reciben clic (necesario: son las que
  se ven tras dar la vuelta). Un lector de pantalla con puntero virtual puede encontrarlos dentro de `aria-hidden`.
  *Propuesta:* aceptable con cinco entidades; si crece, virtualizar la pista en lugar de copiarla.
- **Moderado:** los colores provisionales de SDS y de Kichi García Films (terracota y terracota profunda) son
  vecinos; desaparece al llegar las fotografías.
- Sin severos ni críticos.
