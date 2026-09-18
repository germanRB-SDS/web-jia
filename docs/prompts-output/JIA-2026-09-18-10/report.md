# JIA-2026-09-18-10 — Camino según el boceto, bloque «Intro» con vídeo, entradilla del equipo, «Colabora» y cubo 3D de tarjetas WANTED

**Prompt:** `docs/prompts/JIA-2026-09-18-10-camino-boceto-intro-video.md` (con la ampliación del promotor previa a la ejecución) ·
**Fecha:** 2026-09-18 · **Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 ·
tmp/scratch: `tmp/checkpoint.md` (actualizado al cierre).

**Commits:** `57258db` prompt ampliado · `dc7c525` fases 1–4 (**punto de rollback previo al cubo**) · `7182dcc` «Colabora» ·
`1b2af7f` cubo 3D. Para deshacer solo el cubo: `git revert 1b2af7f`.

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Camino | Trazado del boceto: rabo inicial, parada 1 abajo-izquierda, subida hacia un **lazo cerrado** (parada 2 en su lado izquierdo), salida por el cruce hasta la parada 3, curva y tramo casi vertical (4, 5) y curva final a la derecha (6). Discos irregulares («patatas», armónicos sembrados por parada) y trazo de ancho irregular. | `components/site/jornadas-route/config.ts`, `route-scene.ts` |
| Slots | Cada slot pasa a tener punto de diseño `at` + tramo de búsqueda (el cruce del lazo nunca captura una parada) + colocación de etiqueta (`side`, `dx`, `dy`): la 2 va a la izquierda (a la derecha caería dentro del lazo), la 3 baja, la 6 se separa del carruaje. `chooseSlots()` compartido por escena y componente. Siguen 8 slots para N talleres. | `config.ts`, `JornadasRoute.tsx/.module.css` |
| Radio de giro | Lazo con R ≈ 10 u; la escala del carruaje baja a 4,0 (escritorio) / 3,6 (móvil) para respetar R ≥ batalla / tan 35°. El lazo se mantiene, como pidió el promotor. | `config.ts` |
| Intro | Bloque a sangre antes de `#programa` con rótulo «Intro» y vídeo `cover` cuya altura no pasa de la del velo del jinete. Carga diferida (solo se pide al acercarse a pantalla), autoplay en silencio, pausa fuera de pantalla, nunca autoplay con movimiento reducido, póster de respaldo. Botones circulares arriba a la derecha: pausa/play (referencia) y sonido (el vídeo tiene locución). | `components/site/IntroVideo.tsx/.module.css`, `components/icons/index.tsx` |
| Constantes del vídeo | `JORNADAS_INTRO_VIDEO_URL`, `…_POSTER`, `…_MAX_HEIGHT` (`min(78vh, 780px)`), `…_ASPECT`, `…_AUTOPLAY`, `…_LOOP`. Textos en copy (`jornadas.introVideo`, `buttons.video`). | `lib/content/sections/jornadas-intro-video.ts` |
| Vídeo web | Del original 4K de 2,1 GB (fuera de git) a **MP4 H.264 High 720p, +faststart, AAC 96k: 40 MB** (4 min 32 s, ~1,2 Mb/s) + póster WebP. Paso añadido a `build-assets.sh` (usa `ffmpeg` si existe; si no, conserva los derivados). | `public/jornadas/intro/`, `scripts/build-assets.sh` |
| Entradilla del equipo | Texto nuevo, solo en el fichero de copy (`grep` confirma una única aparición). Se corrige «su talentos» → «sus talentos». | `lib/content/copy/es/sections/jornadas.ts` |
| Colabora | «South Desert Studio» encabeza «Colabora», encima de Minihollywood, en las dos secciones (socios y pie) desde una sola entrada de datos, con enlace al estudio. Petición en chat durante la ejecución. | `lib/content/data/organizations.ts` |
| Cubo 3D | Componente independiente `components/cube-carousel/` (config, motor GSAP + Draggable, componente, estilos, índice): prisma de 4 caras que gira sobre Y; **la cara que queda detrás se recarga con la tarjeta siguiente/anterior**, así el giro recorre 1…29 y vuelve a empezar en ambos sentidos. No conoce Jornadas: recibe `items` y `labels`. | `components/cube-carousel/*`, `components/site/Jornadas.tsx` |
| Cara del cubo | Fondo `--jia-ink` (a juego con el borde quemado de los carteles), tarjeta centrada con la altura del cubo como límite (margen de pegatina del 2,5 %), sombra mínima de pegatina. La «luz» del ejemplo (opacidad) pasa a ser un tinte por ángulo, porque aquí el fondo es claro y la opacidad dejaría ver el interior. | `CubeCarousel.module.css`, `cube-engine.ts` |
| Cubo usado | Aristas verticales en cuarto de cilindro (3 facetas iluminadas por separado), esquinas gastadas (arco de la cara cortado donde empiezan las facetas, facetas escalonadas), núcleo oscuro interior contra costuras de antialias, sombra de contacto. | `CubeCarousel.module.css` |
| Interacción | Arrastre (proxy de Draggable con el escenario como disparador; scroll vertical táctil intacto), inercia y encaje a la cara más cercana, flechas circulares, teclas ←/→, giro en reposo cada 3,4 s solo en pantalla que **cesa a la primera interacción** y se detiene con hover/foco. | `cube-engine.ts`, `config.ts` |
| Accesibilidad | El cubo es decorativo para lectores de pantalla; reciben la lista completa de 29 personas, los botones y una leyenda `aria-live` (activa solo tras interacción). Con movimiento reducido: sin autoplay y pasos instantáneos. | `CubeCarousel.tsx` |
| QA | `qa-route.mjs` ampliado (Intro, entradilla) y nuevo `qa-cube.mjs` (arrastre con eventos reales, secuencia completa, teclado, overflow). | `scripts/`, `evidence/` |

## Verificación

- `tsc --noEmit`, `check:content`, `next build`: OK. Consola sin errores (único aviso: el test con GLB bloqueado, esperado).
- Camino (`evidence/qa-route-report.json`): 6 paradas; reproducción completa en escritorio, portátil y móvil; repetir OK; capturas de inicio, parada 3, final, movimiento reducido y sin GLB.
- Intro: justo antes de `#programa`; ancho = viewport; alto 702 px ≤ 789 px del velo (escritorio) y 219 ≤ 244 px (móvil); reproduce en silencio; pausa → `paused: true` y etiqueta «Reproducir el vídeo».
- Cubo (`evidence/cubo-*-report.json`, escritorio y móvil): autoplay 1→2; arrastre de 144 px → giro de 44,8° en seguimiento y encaje en la tarjeta 3; **29 tarjetas distintas, en el orden de la lista, con vuelta al inicio**; 0 caras sin imagen cargada; ← retrocede; sin overflow horizontal; `out/index.html` ya no contiene la tira.
- «Colabora»: «South Desert Studio» precede a «Minihollywood…» en ambas secciones del HTML exportado.
- **No verificado con herramienta:** el cubo en Safari/iOS y Firefox reales (solo Chrome headless); arrastre táctil real; sonido del vídeo; lector de pantalla real; el recorrido completo en tablet (mismo límite de SwiftShader que en -09).

## Riesgos

- **Moderado — peso en git:** `intro-720.mp4` (40 MB) queda versionado para que el export estático funcione tal cual. *Propuesta:* al publicar, alojarlo en el hosting/CDN o en un servicio de vídeo y poner su URL absoluta en `JORNADAS_INTRO_VIDEO_URL`; después se puede sacar del repo. No servir desde Drive (sin peticiones de rango ni CORS fiables).
- **Moderado — servidor con rangos:** el servidor local de `:3005` (SimpleHTTP) no atiende `Range`; el vídeo reproduce gracias a `+faststart`, pero el salto en la línea de tiempo y Safari piden rangos. *Propuesta:* comprobar `Accept-Ranges: bytes` en el hosting definitivo.
- **Moderado — recorte del vídeo:** con `cover` y la altura máxima, en escritorio se pierde ~13 % vertical; los rótulos incrustados cerca del borde («Taller de cortometraje») pueden quedar justos. *Propuesta:* subir `…_MAX_HEIGHT` o usar `contain` si el promotor lo prefiere.
- **Moderado — carruaje más pequeño:** la escala baja de 5,2 a 4,0 por el radio del lazo. *Propuesta:* si se quiere más grande, agrandar el lazo en `config.ts` (R y escala van ligados).
- **Moderado — autoplay del cubo:** WCAG 2.2.2 pide poder detener lo que se mueve solo más de 5 s; aquí se detiene con hover/foco y cesa definitivamente a la primera interacción, pero no hay botón de pausa explícito. *Propuesta:* `CUBE_CONFIG.autoplay.enabled = false` o añadir un botón si se audita.
- **Moderado — negro/blanco literales en el cubo:** el tinte de luz y el brillo usan `rgb(0 0 0)`/`rgb(255 255 255)` con alfa (neutros, no de marca); el color del cubo sí es token (`--cube-color: var(--jia-ink)`).
- **Moderado — cifra de la entradilla:** el texto habla de «Directores CEP», pero los roles de las tarjetas son Coordinación/Asesoría/Colaboración. *Propuesta:* que el promotor confirme el rótulo de rol si procede.
- Sin severos ni críticos.

## Siguiente paso

Revisar el cubo en un iPhone y en Safari de escritorio; decidir el alojamiento definitivo del vídeo y pegar la URL en la constante.
