# Vídeo con transporte, fullscreen, PiP y plegado

[Fuente](../project-skeleton/reference/components/site/IntroVideo.tsx) ·
[CSS](../project-skeleton/reference/components/site/IntroVideo.module.css) · [captura](../project-screenshots/05-video.png).
Modelo en `lib/content/sections/jornadas-intro-video.ts`; MP4/poster conservados en public/jornadas/intro.

| Parte | Contrato observado |
|---|---|
| Entrada | IntroVideoModel: anchor, title, barText, src/type/poster, maxHeight/aspect, autoplay/loop, labels de controles y compartir. |
| Imagen | `object-fit: contain`; no recorta el vídeo. Marco puede rellenar con el poster. Mantener ratio real. |
| Carga | preload none; inserta source al aproximarse600px. Visibilidad umbral.35 gobierna autoplay/pausa. |
| Autoplay | Inicialmente muted y playsInline; solo permitido por configuración, motion y estado de pausa del usuario. play rechazado no rompe página. |
| Transporte | Play/pause; input range, min0/max duración/step.1; current/total; aria-valuetext localizado. |
| Sonido | Botón independiente. Entrar en fullscreen o PiP solicita sonido. Salir no significa automáticamente volver a silenciar. |
| Fullscreen | Marco si Fullscreen API; iOS usa webkitEnterFullscreen del vídeo. Estado sincronizado con plataforma. |
| Minimizar | Es Picture in Picture, no colapsar la sección. Solo se muestra si API disponible; sigue reproduciendo fuera de la página visible. |
| Compartir | Web Share API si existe y pointer coarse; comparte URL con anchor. |
| Plegado | Desde760px, al quedar totalmente por encima de viewport: pausa, pliega al rótulo y compensa altura perdida para no mover lectura. No durante fullscreen/PiP. Reabrir continúa. |
| Fallback | Poster/copy y controles condicionados a disponibilidad/error. No prometer controles de API no soportada. |

Adaptación: MP4 web optimizado, poster local, controles traducibles y subtítulos/transcripción
según el contenido de destino. La referencia no incluye pistas `<track>`: no declararla subtitulada
ni accesibilidad multimedia completa. Si se necesita, incorporar y verificar archivos VTT.

Verificar seek antes/después de metadata, reproducción rechazada, pausa manual persistente,
fullscreen/PiP en navegadores reales compatibles y plegado sin salto. API disponible en emulación
no certifica comportamiento físico de iOS. La captura solo muestra el reproductor en línea.
