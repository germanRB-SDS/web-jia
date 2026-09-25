# [53-1] Fichas móviles a pantalla completa y retorno a la baraja

## PREFACE — NON-EXECUTABLE

Execute from `## Status` onward. El propietario valida la baraja y autoriza guardar/publicar en main, añadiendo fichas móviles a pantalla completa: cartel un 10 % menor a la derecha, texto alrededor y Cerrar fijo. Al salir de la zona de talleres mediante scroll, la baraja vuelve a contraerse. Se conserva el diálogo nativo para foco/Escape y se adapta únicamente su presentación móvil. Riesgo moderado: dimensiones, scroll y foco del contenedor compartido; se limita a talleres. No cambia servicios, datos ni dependencias.

## Status

2026-09-25, continuación de [53-0], `LEVEL 2`, frontend, Change ID `REL-2026-09-25-02`. La aprobación del usuario levanta el gate de publicación anterior e incluye estos ajustes; no volver a pedir aprobación para hacer push.

## Cambio

- Solo fichas de talleres por debajo de 760 px: vista a pantalla completa, sin aspecto de popup ni márgenes exteriores.
- Cartel un 10 % más pequeño respecto a su medida móvil anterior, situado a la derecha, debajo de Cerrar. Texto fluye por su izquierda y continúa debajo al superar la altura de la imagen.
- Cerrar queda fijo arriba a la derecha. El contenido desplazable pasa debajo; respetar áreas seguras, teclado, foco de retorno y movimiento reducido.
- Al salir de la zona de talleres mediante scroll vertical, hacia arriba o hacia abajo, contraer la baraja y reiniciar su posición. Al regresar aparece cerrada. No contraer al deslizar horizontalmente ni mientras una ficha esté abierta.
- Mantener escritorio, otros diálogos y añadidos ya aprobados; conservar todos los datos de cada ficha.
- Reutilizar copy/media y tokens del proyecto, sin nuevas cadenas visibles ni dependencias.

## Verificación y entrega

Medir y revisar visualmente 320/390/440/759 px, comprobar scroll con Cerrar estable, seis fichas, salida/retorno arriba y abajo, y escritorio. Ejecutar TypeScript, check:content, build y diff check; V2 para el flujo de ficha y consumidores compartidos. Registrar evidencia en `docs/prompts-output/[53-1]/evidence/` y continuidad en `tmp/`. Commit de implementación verde, informe de fase por separado (práctica 14). Integrar [53-0] y [53-1] en main tras revisar cambios concurrentes y publicar por `git-safe-push.sh origin main`, sin incluir ficheros ajenos. Prompt/output y guía Impeccable/gstack conforme a SDS. No modificar maestra/aula/foto/luces.
