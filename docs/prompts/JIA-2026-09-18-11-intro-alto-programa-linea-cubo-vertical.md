# JIA-2026-09-18-11 — Vídeo un 10 % más alto, línea de «Programa» oculta, «Cómo funcionan» sin huecos y cubo perfecto con giro vertical

**Fecha:** 2026-09-18 · **Origen:** mensajes del promotor en chat tras cerrar JIA-2026-09-18-10. Estado: guardado y
ejecutado en la misma sesión.

**Adjunto:** `docs/prompts/assets/JIA-2026-09-18-11-como-funcionan-hueco.jpg` (captura de «Cómo funcionan» con el hueco
entre la prosa y «Quién está detrás»).

## Encargo (transcripción del promotor)

«Dos detalles: ¿podría el vídeo tener un 10 % más de vertical? ¿y verse? Y encima de "Programa" hay una línea
horizontal -> coméntala. Esa se queda oculta.

[Captura] En esa sección si haces click va al siguiente, pero usa /impeccable porque hay mucho hueco ENTRE el texto
"La propuesta combina talleres prácticos […] antes de trasladarlas a otra aula." y "Quién está detrás 29 personas"
(29 personas lo quitas). Y sobre el cubo -> que sea perfecto y que cada 4 hacia adelante se gire en vertical también
(o cada 4 hacia atrás, pero gira en sentido contrario). Los botones los dejas y el texto "Arrastra el cubo o usa las
flechas: cada giro trae a la siguiente persona." también, pero lo pones en mayúscula y un punto o dos más pequeño.
Juega con gradient (puedes añadir nuevos) a esa section y, ya te digo, sin huecos verticales. Genera prompt -> commit
y lo ejecutas.»

Añadido durante la ejecución: «¿El fondo del cubo podría ser un gradient con colores que funcionen y reflejos?»

## Lectura para la ejecución

1. **Vídeo Intro:** `JORNADAS_INTRO_VIDEO_MAX_HEIGHT` sube un 10 % (`min(78vh, 780px)` → `min(86vh, 858px)`), de modo
   que se recorta menos y se ve más fotograma. Solo cambia la constante.
2. **Línea sobre «Programa»:** comentar (no borrar) la regla CSS que la dibuja, solo para ese primer pliego.
3. **«Cómo funcionan» (Impeccable · layout):** una sola columna de lectura a la izquierda (prosa → «Quién está detrás» →
   entradilla, sin hueco) y el cubo a la derecha ocupando la altura; se quita «29 personas»; degradados nuevos como
   tokens de paleta (foco cálido tras el cubo); en móvil, apilado sin huecos.
4. **Cubo perfecto:** cubo real de seis caras y aristas vivas (se retiran facetas y esquinas gastadas, que dejaban
   pequeños escalones a los lados). Caras con degradado oscuro de la familia tinta/terracota y reflejos (brillo que se
   desplaza con el giro).
5. **Giro vertical cada 4:** al avanzar, el paso que entra en un múltiplo de 4 (3→4, 7→8, …) gira sobre X (la cara
   superior trae la tarjeta siguiente); al retroceder por esa misma frontera gira en sentido contrario (entra la cara
   inferior). El arrastre horizontal respeta la regla: en una frontera, el gesto hace rodar el cubo en vertical.
6. **Clic en el cubo:** pasa a la siguiente tarjeta. Botones intactos. Pista en mayúsculas y ~2 px más pequeña.
7. Verificación con `scripts/qa-cube.mjs` ampliado (pasos verticales), `qa-route.mjs` (altura del vídeo), tsc,
   check:content, build; commits de implementación + informe; push.
