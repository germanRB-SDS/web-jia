# JIA-2026-09-18-03 — Ritmo de fondos, hero cinematográfico, Jornadas y Acoge a la manera de maryna-ventura, socios

**Fecha:** 2026-09-18 · **Origen:** tercera ronda del promotor tras revisar la landing en localhost.
**Referencias:** `../maryna-ventura` (hero y sección «Sobre Maryna»), `../fields-web` (sección «Con quién trabajamos»), imagen del arquero aportada por el promotor.

## Encargo (transcripción del promotor)

1. **Hero (hotfix).** Mirar el hero de `../maryna-ventura` y copiar el efecto con el que aparecen los
   botones en el hero de web-jia. Si el hero puede tener un efecto de luces, mejor: cinematográfico
   pero sencillo.
2. **Sección «Las jornadas».** Ahora se ve vacía (título, párrafo y cartel pequeño). Usar el formato
   visual de la sección oscura de maryna-ventura («La fotografía capta tu esencia»): fondo de tinta,
   titular grande a la izquierda, imagen grande a la derecha sangrando por el borde.
3. **Sección «Acoge JIA».** Copiar ese mismo elemento visual. El texto pasa a ser
   **«Dispara tu centro. Acoge las próximas JIA»** y la imagen de la sección es la del arquero
   aportada (se incorpora a `assets/images-website/`).
4. **Etiquetas.** Quitar todas las etiquetas «Demostración» y «Provisional».
5. **Socios.** Mirar la sección «Con quién trabajamos» de `../fields-web` (kicker con regla, título,
   párrafo a la derecha, banda clara redondeada con logotipos en gris) y copiarla adaptada a nuestro
   estilo y paleta para Organiza / Colabora.
6. **Ritmo de fondos.** En maryna-ventura el cambio de fondo entre secciones (claro → oscuro) funciona
   muy bien para presentar secciones distintas, con degradados en puntos clave que aportan elegancia
   manteniéndose minimalista y profesional. Rediseñar la web con ese concepto en mente.
7. **/impeccable** para pulir.
8. Elaborar este prompt, guardarlo, commit; ejecutarlo y commit al terminar.

## Decisiones de ejecución

- Ritmo de fondos propuesto: hero (papel + foto) → atajos (papel) → **Jornadas, banda de tinta** con
  el cartel sangrando → programa / cómo funcionan / talleres (papel) → dosieres (arena → papel) →
  experiencias (papel) → propuestas (arena) → **socios (marfil)** → **Acoge, banda fotográfica**
  con el arquero a sangre y el texto sobre el fondo despejado de la imagen → pie (tinta). Cada cambio
  de fondo lleva un degradado corto en el borde de entrada.
- Luces del hero: una luz cálida lateral que «expone» la fotografía al cargar (radial + máscara
  cónica como en maryna-ventura), sin bucle; respeta `prefers-reduced-motion`.
- Aparición de los botones: `rise` (opacidad + 0,75 rem) con retardo escalonado, como en
  maryna-ventura; el lettering aparece con `focus-in` (interletrado que se asienta).
- Los logotipos de socios no se han entregado como archivos: la banda muestra los nombres en
  tipografía de rótulo hasta que la organización los aporte (`logoMediaId` por organización).
- Las etiquetas desaparecen apagando `site.preview.markProvisional`; los estados editoriales siguen
  registrados en datos.

## Salida

`docs/prompts-output/JIA-2026-09-18-03/report.md`
