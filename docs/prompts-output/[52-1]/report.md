# [52-1] Audio de los modos de vídeo y línea del programa

## Metadata y objetivo

- Fecha: 2026-09-25. Agente: Codex. Estado: IMPLEMENTADO. Nivel: LEVEL 1. Área: frontend. Memoria cargada: `docs/memory/frontend.md`. Change ID: `REL-2026-09-25-01`.
- Objetivo: que entrar en pantalla completa o imagen en imagen active el sonido si estaba silenciado, y quitar la línea corta bajo “Agradecimientos y despedida” dejando comentada su regla CSS.
- Continuidad temporal: N/A; ejecución corta sin estado parcial.

## Resumen de fase

`components/site/IntroVideo.tsx` desactiva `video.muted` y sincroniza el botón de sonido antes de solicitar pantalla completa o imagen en imagen. El autoplay inicial conserva el silencio y salir de esos modos no cambia el volumen. `components/site/programa-dias/ProgramaDias.module.css` conserva comentada la regla de borde inferior global y la aplica solo al último bloque del primer día; el cierre del segundo día queda sin línea.

## Impacto y verificación

- Navegador Chromium en la copia aislada: el vídeo empezó con `muted: true`; al entrar en pantalla completa pasó a `muted: false` y el botón a “Quitar el sonido”. Después de volver a silenciarlo, entrar en imagen en imagen volvió a activar el audio y actualizó el botón. La fila “Agradecimientos y despedida” mostró borde inferior de `0px`.
- `npx tsc --noEmit`, `npm run check:content`, `git diff --check` y `npx next build` pasaron. El build aislado con Webpack no pudo descargar Google Fonts por DNS del entorno; el build de `main` con Turbopack pasó en el mismo estado de código y contenido.
- Verification: V2 | ambos controles en navegador, CSS computado, TypeScript, contenido y build de `main` | PASS.
- Backend, API, BBDD y datos persistidos: N/A; comportamiento local de UI. Fuente de copy y assets: sin cambios.

## Análisis de riesgo y soluciones propuestas

- Moderado: la ruta nativa de pantalla completa en iOS Safari no se ejecutó en esta máquina. La desactivación de `muted` está situada antes de `webkitEnterFullscreen`; destino: comprobación manual en un iPhone cuando esté disponible.
- Severo: ninguno detectado; los controles existentes, el silencio inicial y el build se preservaron. Crítico: ninguno nuevo detectado; no hay cambios de seguridad ni datos.
- Memoria permanente: N/A; el comportamiento queda en el componente y esta evidencia. La edición concurrente del aula, la foto y las luces no forma parte del commit ni del push.
