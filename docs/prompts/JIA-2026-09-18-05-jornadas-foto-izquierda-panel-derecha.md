# JIA-2026-09-18-05 — «Las jornadas» como «Servicios» de maryna-ventura: foto a la izquierda, panel de texto a la derecha

**Fecha:** 2026-09-18 · **Origen:** quinta ronda del promotor. Referencia: sección «Servicios» de `../maryna-ventura` (panel de texto sólido a un lado, fotografía a sangre al otro; sin carrusel ni flechas).

## Encargo (transcripción del promotor)

1. El velo sobre la foto del jinete: **0 % de opacidad a la izquierda**, donde está el vaquero, y que
   termine a la derecha con la opacidad que ya tiene.
2. Usar el estilo texto + imagen de «Servicios» de maryna-ventura, sin flechas (no hay carrusel), pero
   **al revés**: en web-jia la imagen va a la izquierda y el texto a la derecha.
3. El cartel: más pequeño, debajo del texto.
4. **Adenda (mismo turno):** el botón no disponible («Quiero acoger las JIA») apenas se ve: darle un
   borde visible, por ejemplo el color de relleno del hover.
5. **Adenda:** todos los elementos con hover (enlaces, botones, imágenes interactivas) cambian el puntero
   circular al de la cruz.
6. **Adenda:** rediseñar el recuadro de «quién organiza y colabora» (/impeccable). Si solo hay texto, mucho
   más pequeño; puede dejar de ser un recuadro.
7. Generar el prompt con este input, guardarlo, commit, ejecutar, commit y push a GitHub.

## Decisiones de ejecución

- Composición de escritorio: fotografía a sangre en la columna izquierda (~58 %), panel sólido de
  Duna a la derecha con título, párrafo y el cartel pequeño (10 rem) debajo, siempre abrible a tamaño
  completo. El velo se funde desde transparente sobre el jinete hasta Duna sobre el panel, y el panel
  continúa ese color, de modo que foto y texto son una sola superficie.
- Móvil: foto arriba (con el mismo velo, vertical), panel de texto y cartel debajo.

- Botón no disponible: borde continuo de 1,5 px; se probó Arena profunda (color del hover) y sobre la
  fotografía de Acoge no bastaba, así que se usa **Cobre mate** (`--jia-copper`) con texto en tinta de
  lectura; sigue sin ser un enlace.
- Cursor: la marca abre la cruz sobre `a`, `button`, controles de formulario y cualquier elemento con
  `data-cursor="open"` (las superficies con hover que no son enlaces, como las tarjetas de ficha y el
  cartel), además de todo lo que ya cubría.

- Organiza / colabora: deja de ser una placa. Pasa a ser un **colofón de imprenta**: dos columnas
  bajo una regla fina, etiqueta pequeña en terracota y los nombres en sans de 0,875 rem separados por
  puntos, en tinta secundaria; cuando haya archivo de logotipo se sustituye el nombre en su sitio.

## Salida

`docs/prompts-output/JIA-2026-09-18-05/report.md`
