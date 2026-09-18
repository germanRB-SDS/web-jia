# JIA-2026-09-18-10 — Camino según el boceto a mano y bloque «Intro» con vídeo antes del Programa

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat tras cerrar JIA-2026-09-18-09. Estado: **guardado,
NO ejecutado** (el promotor limpia la sesión tras el commit; se ejecuta en una sesión nueva).

**Adjuntos copiados al repo (`docs/prompts/assets/`):**

- `JIA-2026-09-18-10-boceto-camino.png` — boceto a mano del trazado y de las seis paradas (imagen 34).
- `JIA-2026-09-18-10-ref-video-estilo.png` — referencia de estilo del vídeo (Apple TV «Wolfs»: fotograma a
  sangre en ancho, altura contenida, botón de pausa circular arriba a la derecha) (imagen 36).
- `JIA-2026-09-18-10-ref-video-boton.png` — detalle del botón pausa/play circular (imagen 37).

## Encargo (transcripción del promotor)

«¿Podrías utilizar ese boceto a mano para hacer un camino similar a la línea trazada y que los puntos de parada también
sean similares a los "círculos" (parecen más bien patatas) en ubicación sobre la línea?

Y crea un div antes de este: `<div id="programa" class="Section-module…sub" aria-labelledby="programa-title"
role="region">…Programa…</div>` [el bloque «Programa» de Jornadas]. Ahí pondrá "INTRO" (sabes que no hardcodeado ->
sino en string todo el texto) y habrá un vídeo sobre el estilo [de las referencias adjuntas] -> ocupará el width, pero
el height no será excesivo, por lo que el height máximo será `<span class="Jornadas-module…veil"></span>` -> como el
definido en ese segmento; pero tendrá su propia variable definitoria (en un fichero de constantes de su sección por si el
día de mañana se cambia -> y ese será fichero-nombreseccion-intro-video y el valor: seguramente esté alojado en un
drive y se deba descargar (conforme la página se renderiza).

Otro detalle sobre el vídeo, ¿sería conveniente convertirlo a otro formato para su óptima visualización web? ->
respóndeme a esto último. Guardas este input en forma de prompt. Commit. Y hago clear (por tanto después del commit
guarda estado).»

## Lectura del boceto (para la ejecución)

Cuadrícula de puntos; la línea va de abajo-izquierda (inicio, un pequeño rabo antes de la parada 1) a arriba-derecha
(parada 6). Orden y posición aproximada en un lienzo 100 × 70 (x derecha, y abajo):

| Parada | Posición aprox. | Contexto de la línea |
|---|---|---|
| 1 | (18, 82 %) | justo tras el inicio; el trazo sube hacia la derecha |
| 2 | (40, 60 %) | a la salida de un **bucle** cerrado (lazo) que la línea dibuja sobre sí misma entre 2 y 3 |
| 3 | (48, 74 %) | tras cerrar el lazo, la línea baja y vuelve a subir hacia la derecha |
| 4 | (65, 53 %) | inicio del tramo casi vertical |
| 5 | (66, 36 %) | mismo tramo vertical |
| 6 | (73, 17 %) | final, la línea termina en la parada con una ligera curva a la derecha |

Los discos deben parecer irregulares («patatas»), no círculos perfectos, y el trazo puede conservar un carácter de
línea a mano (grosor ligeramente irregular). Con el lazo hay que comprobar el radio de giro del carruaje (ver
`HANDOFF-SPLINE.md` §2 y `config.ts`: R ≥ 12 u con la escala actual) o reducir la escala del carruaje; el promotor
pidió expresamente el lazo, así que se ajusta escala/radio, no se elimina el lazo.

## Vídeo: respuesta a la pregunta del promotor

Sí, hay que convertirlo. El original en `assets/videos-website/capitulo2corregidofran.mp4` pesa **2,1 GB**: es
inviable como recurso web (descarga completa antes de reproducir en muchos navegadores, coste de datos, y Google Drive
no sirve vídeo con peticiones de rango ni CORS de forma fiable, además de limitar descargas). Recomendación:

- Codificar una versión web: **MP4 H.264 (perfil High, `yuv420p`, `-movflags +faststart`)** a 1080p o 720p, 24–30 fps,
  ~3–5 Mb/s para 1080p (≈ 25–40 MB por minuto), y opcionalmente **WebM VP9/AV1** como segunda fuente más ligera.
- Si va en autoplay silencioso como fondo: sin pista de audio, `muted`, `playsinline`, `loop`, con `poster` y
  `preload="metadata"`; carga diferida cuando el bloque entra en pantalla.
- Alojar el archivo con el sitio (CDN/hosting con soporte de rango) o en un servicio de vídeo (Cloudflare Stream, Mux,
  Vimeo, YouTube) y guardar solo la URL en la constante de la sección; no servir desde Drive.
- Comando orientativo (ffmpeg no está instalado en esta máquina; `brew install ffmpeg`):

```
ffmpeg -i capitulo2corregidofran.mp4 -vf "scale=-2:1080" -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 23 -preset slow -movflags +faststart -an intro-1080.mp4
ffmpeg -i capitulo2corregidofran.mp4 -vf "scale=-2:720" -c:v libvpx-vp9 -b:v 0 -crf 33 -an intro-720.webm
```

## Ampliación del promotor (2026-09-18, antes de ejecutar)

### A. Texto de «Quién está detrás»

Sustituir la entradilla actual («Las personas del CEP de Almería y quienes colaboran en esta edición, en sus tarjetas
de la campaña. Desliza para verlas todas.») por:

> «Todas las personas que lo hacen realidad: Coordinadores, Directores CEP, asesores y colaboradores. Las JIA no
> esconden su talentos: conoce a quienes lanzan los dados ;)»

El texto solo puede existir en un fichero de constantes (hoy `lib/content/copy/es/sections/jornadas.ts`,
`team.lede`); comprobar con `grep` que no aparece en ningún componente. *Nota de ejecución:* se corrige la
concordancia a «sus talentos» (errata evidente del dictado); el resto va literal.

### B. Fase final — tarjetas WANTED en un cubo 3D

«La última fase es cambiar la forma de presentación de las tarjetas WANTED de los participantes. Actualmente están
[en una tira horizontal `ul.stripList` con `figure.member` + `figcaption`]. Y quiero que las pongas en un cubo 3D.
Dicho cubo, como cualquier cubo, tiene 6 lados. Pero hay muchos más participantes. ¿Entonces? Vas a analizar la
animación 3D del cubo [del ejemplo], pero cuando se rota se pasa de la foto 1 a la foto n, mostrando la secuencia
completa (dado que no es un cubo real y no tiene por qué mostrar solo 6 lados distintos, y podemos hacerlo girar y
girar). […] que dicho cubo sea un módulo (fichero[s] aparte) independiente para que sea un componente (escríbelo en
componentes). […] Ejecuta todo; antes de empezar la fase del cubo, commit (por si tenemos que hacer rollback). Las
fotos de WANTED son rectangulares: dentro de la cara del cubo, el height del cubo determina la altura máxima de la
foto, que va centrada en cada lado, y a los lados un color oscuro que haga match con el borde de la imagen (mismo
color de "fondo" del cubo), donde el cartel WANTED es como una "pegatina" pegada encima. Opcionalmente, si el cubo en
lugar de ángulos rectos perfectos pudiera asemejarse a un cubo usado, con aristas y esquinas redondeadas por el uso
(elegante, minimalista), bien; si no, déjalo como está.»

Código de ejemplo a aterrizar (GSAP + Draggable; cuatro `.face` rotadas `i*90°` sobre Y con
`transformOrigin: "50% 50% -150px"`, `z: 150`, `backfaceVisibility: hidden`; una capa `#dragger` invisible cuyo
arrastre horizontal suma `rotationY` al cubo y, en cada `onUpdate`, ajusta la opacidad de cada cara con
`1 - wrapYoyo(0, 90, |rotationY + i*90|) / 90` para sugerir una fuente de luz):

```html
<div class="container"><div id="cube"><div class="face"></div>×4</div></div><div id="dragger"></div>
```
```css
.container { width:300px; height:300px; perspective:1500px; left:50%; top:50%; transform:translate(-50%,-50%); }
#cube, .face { width:100%; height:100%; transform-style:preserve-3d; user-select:none; position:absolute; }
```
```js
gsap.timeline().set(".face", { rotateY:(i)=>i*90, transformOrigin:"50% 50% -150px", z:150, backfaceVisibility:'hidden' })
Draggable.create(dragger, { onDrag:(e)=> gsap.to(cube, { rotationY:'+='+((Math.round(e.clientX)-pos.x)%360),
  onUpdate:()=> gsap.set('.face', { opacity:(i)=> 1-gsap.utils.wrapYoyo(0,90, Math.abs(gsap.getProperty(cube,'rotationY')+i*90))/90 }) }) })
```

Lectura para la ejecución: un prisma de cuatro caras laterales que gira sobre Y; la cara que queda oculta detrás se
recarga con la tarjeta siguiente (o anterior) de la secuencia, de modo que girando se recorre 1…n y se vuelve a
empezar. Componente independiente en `components/` (sin conocer Jornadas: recibe la lista de tarjetas y etiquetas),
textos desde copy, teclado y lector de pantalla, `prefers-reduced-motion`, y la lista completa de personas sigue
siendo accesible.

## Alcance previsto al ejecutar

1. Trazado y paradas según el boceto (con lazo) en `components/site/jornadas-route/config.ts`; discos irregulares.
2. Nuevo bloque «Intro» antes de `#programa` en `components/site/Jornadas.tsx`: título desde copy
   (`copy.jornadas.intro*`), vídeo a ancho completo con altura máxima igual a la banda del jinete, definida en una
   constante propia en `lib/content/sections/jornadas-intro-video.ts` (URL del vídeo + altura máxima + poster).
3. Botón pausa/play circular discreto arriba a la derecha (referencia adjunta), accesible.
4. Entradilla de «Quién está detrás» (ampliación A), solo en el fichero de copy.
5. Evidencias con `scripts/qa-route.mjs` ampliado; **commit de implementación de las fases 1–4** (punto de rollback).
6. Fase final: cubo 3D de tarjetas WANTED (ampliación B) como componente independiente; commit propio.
7. Informe de fase + commit del informe; push.
