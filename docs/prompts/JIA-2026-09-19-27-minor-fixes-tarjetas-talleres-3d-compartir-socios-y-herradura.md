# JIA-2026-09-19-27 — Minor fixes: programa, tarjetas de talleres (hover, alineación, 3D), compartir el vídeo, texto de Socios y herradura en el pie

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat (con dos capturas: tarjetas de talleres y pie).
**Nivel:** LEVEL 3 (once puntos, varias fases, 3D con Blender y three.js) · tmp/scratch: **aplica** →
`docs/prompts-output/JIA-2026-09-19-27/tmp/progress.md` (estado por fase) y `evidence/` (capturas).

## Reglas de ejecución (del promotor)

- Prompt y estructura de salida se **commitean y suben antes de empezar** a ejecutar.
- Del punto 8 al 11, **commit obligatorio antes de empezar cada punto** (para poder volver atrás) y commit al terminar
  cada uno. **Cada commit implica `git push`** (por `sds-dev-governance/scripts/git-safe-push.sh origin main`).
- Al terminar: informe de fase (`report.md`), commit del informe y push; y una frase breve para retomar tras `/clear`.
- Textos siempre en `lib/content/copy/`; medidas y ajustes en `config.ts` de cada componente; nada de HEX fuera de la
  paleta.

## 0. Histórico: JIA-2026-09-19-26 (ya ejecutado, se documenta aquí; no se vuelve a ejecutar)

Tres ajustes pedidos en chat el mismo día y cerrados en `824a483` (prompt) y `4b5b1bd` (código), con su propio
prompt en `docs/prompts/JIA-2026-09-19-26-hotfix-sombra-tarjetas-costura-experiencias-y-pantalla-completa.md`:

1. Tarjetas del carrusel de colaboradores con luz cenital (filo superior iluminado, borde inferior en sombra, sombra
   de contacto y foto un escalón por debajo del marco).
2. Costura Experiencias → Propuestas a ≥ 1280 px: el color de arranque del fondo de Propuestas sube en degradado por
   el pie de la fotografía del aula (como hace Acoge por arriba).
3. Botón de pantalla completa en el vídeo de intro (marco a pantalla completa; iOS con el reproductor nativo), con
   iconos y textos accesibles nuevos.

## Encargo

### 1. Programa, jornada 2: fuera los números VIII y IX

A las 20:00–20:30 h ocurren tres cosas: «Clausura de las jornadas» (VII), «Vídeo de cierre de las jornadas» (VIII) y
«Agradecimientos y despedida» (IX). Todo se queda **exactamente igual**, salvo que esas dos últimas líneas **pierden
su numeral** (VIII y IX): siguen en la lista, sin hora, con el texto alineado con las demás actividades.

Regla: es un dato de la sesión (`numbered: false` en `lib/content/data/program.ts` para `s-2-8` y `s-2-9`); el
componente lo expone (`data-unnumbered`) y el CSS no incrementa ni pinta el contador. Ninguna otra sesión cambia.

### 2. Tarjetas de Talleres: el degradado del hover ocupa el 50 % de la tarjeta y el texto sube un punto

En las tarjetas de la sección «Talleres» (`SheetCard`, variante `poster`), al pasar el ratón aparece un degradado con
el resumen del taller. Cambios, **en todas las resoluciones**:

- El bloque del degradado ocupa la **mitad inferior de la tarjeta** (`inset: 50% 0 0 0`; hoy va por el contenido).
- El texto del hover sube **un punto** de tamaño relativo: `1rem` → `1.0625rem`.
- El degradado (tinta 0,92 → 0,75 → transparente, hacia arriba) **se mantiene**; su transición también.
- En pantallas sin hover (táctil) sigue sin mostrarse: no hay hover que lo dispare, y la ficha completa está en el
  botón «Ver ficha». Con teclado, `:focus-within` lo muestra como hasta ahora.

### 3. «Ver ficha» y «Descargar dosier» alineados en toda la sección

Hoy cada tarjeta coloca «Ver ficha» donde acaba su texto (títulos y descripciones de distinto número de líneas). Se
pide que, **en cada fila de tarjetas**, el «Ver ficha» que más abajo cae marque la coordenada vertical de todos, y que
«Descargar dosier» quede por tanto alineado también. Solución acordada (propuesta del promotor, aceptada):

- Título, subtítulo, «Imparte» y «Temática» se limitan a **2 líneas** cada uno (`-webkit-line-clamp: 2`), con una
  **altura mínima fija de 2 líneas** (adaptativa a su tamaño de letra, pero definida), de modo que las posiciones de
  «Ver ficha» y «Descargar dosier» **no varían** de una tarjeta a otra ni de una fila a otra.
- Si un texto ocupa más de 2 líneas, **al pasar el ratón (o recibir foco) sobre él se muestra completo** (se libera
  el recorte). Además, `title` con el texto completo.
- Como red de seguridad, las filas de la tarjeta se alinean con la fila de tarjetas (`grid-template-rows: subgrid`
  en `.card`, `display: contents` en el cuerpo): si un texto se despliega, el resto de tarjetas de esa fila mantienen
  «Ver ficha» a la misma altura. Sin soporte de subgrid, cada tarjeta alinea sus filas por su cuenta (degradación
  limpia; las alturas mínimas ya cubren el caso normal).
- Se aplica a **toda ficha de taller**; las tarjetas de Experiencias (mismo componente, variante `wide`) heredan la
  alineación sin más cambios de diseño.

### 4. Efecto 3D en cada tarjeta (componente aparte)

Añadir a **la parte de imagen (cartel) de cada tarjeta de taller** el efecto de tarjeta 3D del ejemplo aportado
(rota hacia el puntero con `rotate3d`, escala 1,07 al entrar y un brillo `radial-gradient` que sigue al ratón), como
**componente propio en `components/tilt-card/`**: `TiltCard.tsx` (envoltorio React), `tilt-card.ts` (motor DOM sin
React: `pointerenter` toma el rectángulo, `pointermove` calcula el centro relativo, la distancia y aplica transform y
brillo; `pointerleave` limpia) y `config.ts` (escala, divisor de rotación, colores del brillo por tokens de la paleta,
duraciones). Reglas:

- **Solo con puntero fino y hover** (`(hover: hover) and (pointer: fine)`); en táctil y con `prefers-reduced-motion`
  el componente no hace nada (los hijos se pintan igual).
- La perspectiva (1500 px) la pone el envoltorio; el brillo es un `span` decorativo (`aria-hidden`, sin puntero).
- El cartel conserva su pin, su sombra y su hover actuales; el botón «Ver ficha» y el diálogo no cambian.

### 4 bis. Hotfixes del promotor durante la fase 2 (chat)

- **El cursor por delante del diálogo.** Al abrir «Ver ficha» la marca del cursor quedaba tras el fondo desenfocado del
  diálogo: el `<dialog>` modal vive en la capa superior del navegador, por encima de cualquier `z-index`. Sin tocar su
  estilo, la marca pasa a ser un *popover* manual (también en la capa superior) y, cada vez que se abre un diálogo, se
  vuelve a mostrar en el fotograma siguiente para quedar la última de esa capa (Chrome no la saca de la capa de forma
  síncrona al ocultarla). Sin soporte de *popover* queda como estaba.
- **Clic en la tarjeta = «Ver ficha».** Pulsar sobre el cartel abre la misma ficha que el botón; el botón sigue siendo
  el camino de teclado. Con la ficha pendiente, el cartel no abre nada.

### 5. Vídeo: botón «compartir» a la izquierda de pantalla completa, solo en móvil

En los controles del vídeo de intro, **a la izquierda del botón de pantalla completa**, un botón redondo igual a los
demás para **compartir el enlace** (Web Share API): `navigator.share({ title, text, url })` con la URL de la página
anclada al vídeo (`#intro`). Se muestra **solo en móvil**: `navigator.share` disponible **y** `(pointer: coarse)`. Si
la llamada falla o se cancela, no pasa nada. Icono nuevo en la familia (`ShareIcon`: caja con flecha hacia arriba,
trazo 4). Texto accesible en `copy/es/buttons.ts` (`video.share`) y el texto compartido en
`copy/es/sections/jornadas.ts` (`introVideo.shareText`).

### 6. Sombra sutil y «stylish» en las tarjetas 3D

Sobre el punto 4: en reposo, una sombra corta de contacto; al levantarse hacia el puntero, una sombra **larga, cálida
y difusa** (tinta de la paleta, baja opacidad), ambas con transición. Se define en el CSS del componente `tilt-card`,
por tokens (`--jia-ink-rgb`), y no toca la sombra propia del cartel (que sigue debajo).

### 7. Socios: texto en dos párrafos

- El párrafo actual se acorta: «Las Jornadas de Innovación de Almería las organizan el CEP de Almería, el CEP de El
  Ejido y el CEP de Cuevas-Olula, dentro de la Consejería de Educación de la Junta de Andalucía.»
- Debajo, **otro párrafo** (línea en blanco entre ambos). Redacción final (hotfix del promotor en chat, tras la
  fase 1): «Agradecemos muy especialmente la valiosa y altruista colaboración de todas las empresas participantes; su
  compromiso ha sido una pieza clave en esta edición de las jornadas.» (sustituye a «Queremos agradecer muy
  especialmente a todas las empresas colaboradoras pues su altruista ayuda ha sido clave para esta edición de las
  jornadas»).
- Copy: `partners.text` (con los enlaces a los CEP) y nuevo `partners.thanks`; modelo con ambos; el componente pinta
  dos `<p>` con la separación de párrafo del cuerpo.

### 8. Herradura de caballo, creada en Blender, colgada en el pie

- **Se crea en Blender** (5.2 LTS, instalado; el puente MCP no está conectado, así que se ejecuta **en modo headless**
  con un script Python versionado en `assets/3d/herradura/make-herradura.py`, que deja `herradura.blend` y
  `herradura.glb` en esa misma carpeta; `build-assets.sh` copia el GLB a `public/footer/`). Herradura **usada, no
  nueva**: U con talones, barra de sección rectangular con bisel, siete agujeros de clavo, ligera irregularidad de
  desgaste (ruido de desplazamiento), material PBR de hierro oscuro con tono oxidado (metálico 0,8 · rugosidad 0,55).
- **Cuelga en el pie**, de un clavo en el borde superior del footer, en el tercio derecho de la columna de la marca
  (a ≥ 760 px), donde no pisa la marca ni el nombre; en móvil, en la esquina superior derecha, más pequeña.
- **Tamaño:** alto ≈ **50 % de la altura del pie contada hasta la línea horizontal** (la del colofón), no hasta el
  final de la página; con tope (`config.ts`) para pantallas muy altas.
- Se pinta con **three.js** en un canvas transparente sobre el pie (mismo patrón que `jornadas-route`: WebGL
  comprobado, GLB por `GLTFLoader`, render solo cuando algo se mueve, pausa fuera de pantalla y con la pestaña
  oculta). Sin WebGL o sin el modelo, no se pinta nada (decoración pura). El canvas **no toma el puntero**: un botón
  transparente sigue la caja proyectada de la herradura para el clic y el nombre accesible (`copy/es/sections/footer.ts`:
  `horseshoe`); así los enlaces del pie y los disparos (`FooterShots`, que ignora botones) siguen funcionando.
- Componente en `components/site/horseshoe/` (`Horseshoe.tsx`, `horseshoe-scene.ts`, `config.ts`).

### 9. Colgada en U hacia arriba, pero torcida

Cuelga **con la abertura hacia arriba** (U), pero **inclinada**: girada unos grados sobre el clavo (en torno a −14°),
como una herradura que cuelga de un solo clavo y ha quedado ladeada. Ángulo en `config.ts`.

### 10. Al hacer clic, se anima y cae

Al pulsar (ratón, dedo o teclado sobre el botón): el clavo cede, la herradura **se balancea** un instante, **cae** con
gravedad girando, **rebota** un par de veces sobre la línea horizontal del pie (el suelo) y queda tumbada. Pasados unos
segundos vuelve a subir a su clavo (así nunca se queda tapando texto y el juego se repite). GSAP (ya en el proyecto),
tiempos en `config.ts`. Con `prefers-reduced-motion` no se anima (el clic no hace nada).

### 11. Luz, sombra y reflejos con three.js

Sobre el punto 8: luz direccional cálida desde arriba a la izquierda con **sombra** proyectada sobre un plano
receptor (`ShadowMaterial`) pegado a la «pared» del pie, luz de cielo suave, y **reflejos** por mapa de entorno
(`RoomEnvironment` + `PMREMGenerator`) sobre el material metálico, de modo que al balancearse y caer los brillos se
mueven. Intensidades y opacidad de la sombra en `config.ts`.

## Fases y commits

| Fase | Puntos | Cierre |
|---|---|---|
| 0 | prompt + estructura | commit + push antes de ejecutar |
| 1 | 1, 2, 3, 7 | commit + push |
| 2 | 4, 6 | commit + push |
| 3 | 5 | commit + push (deja el estado previo al punto 8 fijado) |
| 4 | 8 | commit + push |
| 5 | 9 | commit + push |
| 6 | 10 | commit + push |
| 7 | 11 | commit + push |
| 8 | informe | commit + push |

## Verificación

`tsc`, `check:content`, `next build`; Chrome real por CDP a 1440 y 390 px: programa (sin VIII/IX), tarjetas de talleres
(hover al 50 %, alineación de «Ver ficha»/«Descargar dosier», tarjeta inclinada bajo el puntero), controles del vídeo
(compartir solo con puntero grueso), Socios en dos párrafos, herradura colgada, inclinada, cayendo y con sombra.
Capturas en `evidence/`.
