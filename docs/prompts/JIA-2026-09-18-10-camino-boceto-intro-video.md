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

## Alcance previsto al ejecutar

1. Trazado y paradas según el boceto (con lazo) en `components/site/jornadas-route/config.ts`; discos irregulares.
2. Nuevo bloque «Intro» antes de `#programa` en `components/site/Jornadas.tsx`: título desde copy
   (`copy.jornadas.intro*`), vídeo a ancho completo con altura máxima igual a la banda del jinete, definida en una
   constante propia en `lib/content/sections/jornadas-intro-video.ts` (URL del vídeo + altura máxima + poster).
3. Botón pausa/play circular discreto arriba a la derecha (referencia adjunta), accesible.
4. Evidencias con `scripts/qa-route.mjs` ampliado; commit de implementación + informe; push.
