# JIA-2026-09-19-27 — Minor fixes: programa, tarjetas de talleres, compartir el vídeo, Socios y herradura en el pie

**Prompt:** `docs/prompts/JIA-2026-09-19-27-minor-fixes-tarjetas-talleres-3d-compartir-socios-y-herradura.md` ·
**Fecha:** 2026-09-19 · **Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 3 · tmp/scratch:
`tmp/progress.md`.
**Commits (en orden, todos subidos):** `8876512` prompt · `6f01724` fase 1 · `0a9d5d7` hotfix texto Socios ·
`644797c` fase 2 · `f495444` fase 3 · `50528fa` punto 8 · `0caaf05` punto 9 · `bc79132` hotfix hero ·
`19b832d` punto 10 · `ba25a38` punto 11.

## Resumen

- **0. Histórico JIA-26** documentado en el prompt (sombra cenital de las tarjetas de colaboradores, costura
  Experiencias→Propuestas, pantalla completa del vídeo). No se reejecutó.
- **1. Programa.** Las dos últimas líneas de la jornada 2 («Vídeo de cierre…», «Agradecimientos y despedida») siguen
  en la lista sin numeral: `numbered: false` en `data/program.ts`; el contador CSS no las cuenta. Nada más cambia.
- **2. Hover de los carteles.** El resumen ocupa la mitad inferior del cartel (`inset: 50% 0 0 0`) en todas las
  anchuras, con el mismo degradado; texto de 1 rem a 1.0625 rem (17 px medidos).
- **3. Acciones alineadas.** `SheetCard` pasa a siete filas de subgrid del `grid` de la sección: «Ver ficha» y
  «Descargar dosier» comparten altura en toda la fila (861/905 px en la primera fila y 1660/1704 en la segunda a
  1440). Título, subtítulo, Imparte y Temática recortados a dos líneas con alto mínimo de dos líneas; el texto
  completo se muestra al pasar el ratón o recibir foco y va también en `title`.
- **4 y 6. Tarjeta 3D.** `components/tilt-card/` (`TiltCard.tsx`, `tilt-card.ts`, `config.ts`, CSS): el cartel gira
  hacia el puntero (medido: eje −1,1/−0,9, 9,9°, escala 1,07), brillo radial que sigue al ratón (soft-light) y sombra
  corta en reposo / larga y cálida al levantarse. Solo con `(hover: hover) and (pointer: fine)` y sin movimiento
  reducido; en táctil el cartel queda plano (medido a 390: `matrix(1,0,0,1,0,0)`).
- **Hotfixes del promotor (fase 2).** La marca del cursor queda por delante del diálogo modal: es un *popover* manual
  que se vuelve a mostrar (un fotograma después) al abrirse un diálogo; verificado con `DOM.getTopLayerElements`:
  `[::backdrop, dialog, ::backdrop, marca]`. Y un clic en el cartel abre la misma ficha que «Ver ficha».
- **5. Compartir.** Botón redondo a la izquierda de pantalla completa, solo con `navigator.share` y puntero grueso;
  comparte la URL anclada al vídeo con título y texto de copy. Verificado: presente a 390 con puntero grueso, ausente
  a 1440.
- **7. Socios.** Primer párrafo acortado hasta «…Junta de Andalucía.» y segundo párrafo con la redacción final del
  promotor («Agradecemos muy especialmente la valiosa y altruista colaboración…»).
- **Hotfix del promotor (punto 9).** «Ver talleres» a la derecha de «Explorar las jornadas» desde 960 px (entre 960
  y ~1250 px la columna del hero medía menos que los dos botones); por debajo siguen apilados.
- **8. Herradura.** Creada en **Blender 5.2 LTS headless** (el puente MCP no estaba conectado) con
  `assets/3d/herradura/make-herradura.py`: U con talones, barra biselada, siete agujeros (cuatro y tres), desgaste
  por ruido, óxido en color de vértice; origen en el agujero de colgar. `herradura.blend` + `herradura.glb` (176 KB);
  `build-assets.sh` lo copia a `public/footer/`. `components/site/horseshoe/` la pinta con three.js (cámara
  ortográfica en px) sobre un canvas transparente que no toma el puntero; un botón real sigue su caja (nombre
  accesible en copy). Alto = 50 % del bloque sobre la línea (166 de 332 px a 1920), con tope.
- **9. Colgada.** Inclinada −14° sobre el clavo. Por indicación del promotor en chat: **a la derecha del pie**, junto
  al margen derecho de la ventana, y **solo a ≥ 1600 px**; a 1440 y en móvil no se monta (verificado).
- **10. Cae al clic.** GSAP: balanceo (0,42 s), caída con giro (0,72 s), dos rebotes sobre la línea del pie, 3,6 s
  tumbada y vuelta al clavo (1,2 s). Render solo mientras se mueve; sin animación con movimiento reducido; un cambio
  de tamaño la devuelve al clavo. Fotogramas en `evidence/f6-*`.
- **11. Luz, sombra y reflejos.** Sol cálido desde arriba a la izquierda con mapa de sombras sobre un plano receptor
  (`ShadowMaterial`) a 10 px tras la herradura, cielo suave, `RoomEnvironment` por PMREM (0,5) sobre el metal y
  tonemapping ACES (0,92). Todo en `config.render`.

## Verificación

- `tsc`, `check:content` (56 medios) y `next build`: OK tras el punto 11.
- Chrome real por CDP (con SwiftShader para los canvas WebGL): capturas en `evidence/` por fase (programa, talleres,
  Socios, tarjeta 3D, cursor sobre diálogo, compartir a 390, hero a 1200, herradura a 1600/1920 colgada, cayendo y con
  sombra; ausencia a 1440 y 390).

## Riesgos

- **Moderado — scroll horizontal previo, ajeno a este prompt.** Por bisección: `#jornadas` › «Cómo funcionan» / el
  cubo del equipo (`CubeCarousel`) ensancha la página (983 px a 960; 438 a 390). Existía antes de JIA-27 y no se ha
  tocado. *Propuesta:* hotfix propio (`overflow: clip` en el contenedor del cubo o revisar su `margin`).
- **Moderado — subgrid.** La alineación de acciones depende de `grid-template-rows: subgrid` (Chrome 117+, Safari
  16+, Firefox 71+). Sin soporte, cada tarjeta alinea sus filas por su cuenta y los altos mínimos de dos líneas
  mantienen la alineación en el caso normal.
- **Moderado — iOS.** Pantalla completa nativa (JIA-26) y `navigator.share` sin probar en iPhone real.
- **Menor — texto recortado.** Un texto de más de dos líneas solo se lee completo con ratón/foco o en la ficha; en
  táctil no hay hover. Hoy ningún taller supera las dos líneas a 1440.
- **Menor — herradura.** Solo a ≥ 1600 px; a 1600 la puntera tumbada pasa a ~20 px del final de «Minihollywood Oasys
  Theme Park». El botón que la sigue es su caja alineada a los ejes (algo mayor que la silueta). GLB de 176 KB se
  carga solo en ventanas grandes.
- Sin severos ni críticos.
