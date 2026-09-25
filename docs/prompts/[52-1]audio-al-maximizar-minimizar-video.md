# [52-1] Audio al maximizar o minimizar el vídeo

## PREFACE — NON-EXECUTABLE

Execute from `## Status` onward. Completa los controles del vídeo de Jornadas: al entrar en pantalla completa o imagen en imagen, el audio pasa a activo si estaba silenciado. El autoplay inicial continúa silenciado. También se comenta la regla que dibuja la línea inferior del programa, bajo “Agradecimientos y despedida”. Riesgo moderado: posibles diferencias de permisos de pantalla completa e imagen en imagen entre navegadores. No modifica datos ni API.

## Status

Petición del usuario del 2026-09-25. `LEVEL 1`, área `frontend`. Cambiar `components/site/IntroVideo.tsx` y comentar la regla indicada en `components/site/programa-dias/ProgramaDias.module.css`. Verificar los controles, su estado de sonido y la ausencia de la línea inferior. Guardar commits de implementación e informe sin incluir la edición concurrente de Experiencias.
