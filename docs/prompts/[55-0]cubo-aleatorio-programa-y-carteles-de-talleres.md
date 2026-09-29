# [55-0] Cubo con 7 integrantes nuevos y arranque aleatorio, programa corregido y carteles nuevos de talleres

## PREFACE — NON-EXECUTABLE

Prompt del promotor (chat, 29-09-2026), refinado y aterrizado a `web-jia` tras inspeccionar el repositorio y el
material. Esta sección es memoria: **execute from `## Status` onward**.

- **Qué cambia:** 7 tarjetas WANTED nuevas en el cubo del equipo y el cubo empieza por un integrante aleatorio; el
  programa se corrige contra el cronograma nuevo; los 6 talleres pasan a mostrar su cartel nuevo en la tarjeta y en la
  cara delantera de la ficha giratoria.
- **Correcciones al prompt original (verificadas):**
  - El proyecto es `web-jia` (no «web-gia») y la carpeta es `assets/whatsapp/` en minúsculas (no `Assets/WhatsApp`).
  - Contenido real: `item-cubo/` 7 PNG (59, 60, 61, 62, 65, 66, 67; no hay 63 ni 64), 1414×2000 como las tarjetas
    actuales; `section-programa/` un PNG (`cartel-01 #JIA26 (11).png`, cartel general con fechas y lugares) y un JPEG
    (`cartel-02-con-programa-para-check-de-la-web.jpeg`, el cronograma); `section-talleres/` 6 PNG (1…6), 1414×2000.
  - Hay un fichero suelto fuera de las tres subcarpetas: `WhatsApp Image 2026-09-29 at 14.48.05.jpeg` (logotipo de
    «Aribaldi Circus», que aparece como colaborador en los carteles). **Fuera de alcance:** no se usa; se avisa al
    promotor.
  - Los 7 integrantes nuevos no son asesores ni coordinación: sus tarjetas dicen «Experiencia de éxito». Hace falta un
    rol nuevo (`experiencia-exito`) para que entren en el cubo, que se construye por roles
    (`TEAM_ROLE_ORDER`, `lib/content/data/people.ts`). La tarjeta 67 muestra a dos personas con el rótulo
    «CRISTINA ROBLES/ LEÓN»: se registra tal cual («Cristina Robles / León») y se señala para confirmar.
  - La web tiene **6 talleres, pero 9 carteles antiguos** (un cartel por persona: «Dos renders…», «El bueno, el
    feo…» y «La muerte tenía un micro» tenían dos). Los carteles nuevos son uno por taller, con todas las personas.
    Solo se muestra el primer cartel de cada taller (`workshopSheet`, `lib/content/assemble.ts`), y de ahí salen la
    tarjeta, el carrusel móvil y la cara delantera de la ficha: basta con cambiar `posterMediaIds` en
    `lib/content/data/workshops.ts`.
  - Emparejamiento comprobado por número y título (sin ambigüedad): 1 «Por un puñado de bloques» → `w-scratch`;
    2 «Dos renders y un destino» → `w-canva`; 3 «El bueno, el feo… y el plano» → `w-corto`; 4 «Siete legos para siete
    planos» → `w-stopmotion`; 5 «La profe que pintó a Liberty Valance» → `w-album`; 6 «La muerte tenía un micro» →
    `w-podcast`.
  - El cartel-01 coincide con la web en fechas, lugares y horarios de cada jornada. Las diferencias están en el
    cronograma (cartel-02): nombres y horas de las sesiones.
- **Severidad prevista:** moderada (destello del integrante 1 antes de la hidratación; textos de sesión más largos en
  móvil). No se prevé nada severo ni crítico; se comprueba en el informe.

## Status

**EXECUTED** (29-09-2026): commits c361568, 723b56c y 5b2c30c; informe en [`docs/prompts-output/[55-0]/report.md`](../prompts-output/[55-0]/report.md). Orden del promotor: ejecutar, commit al terminar y push a `origin/main`.

## Alcance y autoridad

- LEVEL 2 (comportamiento visible, una capa: contenido + un componente). Áreas: frontend. Sin API, BBDD ni seguridad.
- SDS: prácticas 02, 06, 12, 14 y 16. Impeccable solo como criterio: **no se cambia el diseño**.
- Textos en `lib/content/copy/`; medios registrados en `lib/content/media.ts`; derivados web con
  `scripts/build-assets.sh`. Los originales no se renombran, mueven ni sobrescriben: los nuevos se leen desde
  `assets/whatsapp/`.
- Commits con rutas explícitas (el promotor usa Fork y puede tener cosas en el stage). `next-env.d.ts` fuera de los
  commits.

## Fase A — Cubo

1. Registrar las 7 tarjetas igual que las actuales:
   - `scripts/build-assets.sh`: el bucle de tarjetas también recorre `assets/whatsapp/item-cubo/*.png` (mismo
     `card-N-420/800.webp` y la misma calidad). Generar solo los derivados nuevos (no regenerar el resto de `public/`).
   - `lib/content/media.ts`: añadir 59, 60, 61, 62, 65, 66, 67 a `CARD_NUMBERS`, con `original` en
     `assets/whatsapp/item-cubo/N.png`.
   - `lib/content/data/types.ts`: rol `experiencia-exito`; `copy.jornadas.team.roles["experiencia-exito"] =
     "Experiencia de éxito"`; `TEAM_ROLE_ORDER` lo añade al final (los integrantes actuales no cambian de orden).
   - `people.ts`: Gabi Moral (59), Rubén López (60), Gonzalo Carretero (61), María López (62), Pilar Díaz (65),
     Toni Navarro (66), Cristina Robles / León (67), `cardRoleLabel: "Experiencia de éxito"`. Los nombres se
     transcriben de las tarjetas; nadie se identifica por la cara.
2. Arranque aleatorio en `components/cube-carousel/`: en cada carga, después de montar, el cubo elige un
   desplazamiento `start` en `[0, n)` y todos los índices que muestra (caras, tapas, subtítulo, «X de N», agujeros de
   bala, precarga) se desplazan con él. El motor no se toca: la rotación, el autoplay, el arrastre y los volteos
   verticales siguen igual, y la numeración de «X de N» sigue siendo la absoluta. La opción queda en `CUBE_CONFIG`
   (`randomStart: true`). La lista accesible no cambia de orden.

## Fase B — Programa (el cartel solo es referencia)

No se integran los carteles, no se cambian el diseño ni la estructura (día → lista de sesiones con hora y texto). El
texto de cada sesión es el rótulo del cronograma (en minúscula de oración, con el lugar entre paréntesis cuando lo
tiene); las descripciones largas del cartel no se copian (la sección solo muestra nombres), salvo el título y el
ponente de la conferencia. Se quitan las sesiones que el cronograma ya no tiene:

| Jornada | Web actual | Cronograma nuevo |
|---|---|---|
| 1 | 16:00–17:00 Recepción | 16:00–17:00 Registro de forajidos y docentes |
| 1 | 17:00–17:30 Inauguración · 17:30–18:00 Apertura | 17:00–18:00 Bienvenida de los sheriffs de la educación (The Grand Theatre) |
| 1 | 18:00–19:00 Conferencia inaugural: Creatividad en educación | 18:00–19:00 Consejos del viajero del conocimiento: «Que la creatividad te acompañe», conferencia de Rafa Fortis |
| 1 | 19:00–20:30 Exposición de Buenas Prácticas de la provincia de Almería | 19:00–20:30 Cabalgata de éxitos de la frontera |
| 2 | 10:00–11:30 Talleres (1) | 10:00–11:30 Las lecciones del Oeste (Aulario del Correo): talleres prácticos 1 |
| 2 | 11:30–12:15 Desayuno | 11:30–12:15 Desayuno del pionero (Cantina de Tiza Seca) |
| 2 | 12:30–14:00 Talleres (2) | 12:30–14:00 Las lecciones del Oeste (Aulario del Correo): talleres prácticos 2 |
| 2 | 14:00–16:00 Comida | 14:00–16:00 Repostaje de víveres y agua (Cantina de Tiza Seca) |
| 2 | 16:00–17:30 Talleres (3) | 16:00–16:30 El desafío de las seis cartas (en las calles de Tiza Seca Town) |
| 2 | — | 16:30–18:30 Las lecciones del Oeste (Aulario del Correo): talleres prácticos 3 |
| 2 | 19:00–20:00 Dinámica de cierre. Juego: El duelo | 18:30–19:30 Juego: El duelo final (Arenal de los desafíos) |
| 2 | 20:00–20:30 Clausura · Vídeo de cierre · Agradecimientos y despedida | 19:30–20:30 El regreso a la frontera educativa (Saloon): clausura de las jornadas |

Sin cambios (coinciden con cartel-01): fechas 16 y 17-10-2026, Conservatorio de Danza Kina Jiménez y CEIP Freinet,
horarios 16:30–20:30 y 9:30–14:30 / 16:30–20:30. Anotar en el informe (sin decidir): la jornada 1 empieza a las 16:00
en el cronograma y a las 16:30 en el horario del cartel general; el cronograma se titula «El duelo de tiza seca»; y
tiene erratas («SHÉRIFFS», «19: 30», «conocimeintos») que no se trasladan.

## Fase C — Talleres

- `build-assets.sh`: los carteles nuevos se derivan a `public/talleres/cartel-2026-09-29-N-560/1000.webp` (misma
  calidad que los antiguos). Sin sobrescribir los antiguos.
- `media.ts`: `poster-2026-09-29-N` con `original` en `assets/whatsapp/section-talleres/N.png`. Los `poster-1…9`
  antiguos se quedan registrados (sin uso), como el resto de originales retirados.
- `workshops.ts`: cada taller pasa a `posterMediaIds: ["poster-2026-09-29-N"]` según el emparejamiento de arriba. La
  procedencia de las personas no cambia. Sin fichas nuevas, sin tocar textos, reverso ni animación.
- Buscar con `rg` cualquier otra referencia a `poster-N` o `/talleres/cartel-` y actualizarla si muestra un taller.

## Verificación

- `npx tsc --noEmit`, `npm run check:content`, `npx next build`.
- Chrome real por CDP a 1440 y 390 px sobre `out/` servido en local: varias cargas del cubo (el primer integrante
  cambia y está entre 1…36), recorrido completo con «siguiente» (29 actuales + 7 nuevas = 36, cargadas, y
  distintas), programa (textos corregidos en las dos jornadas, pestañas móviles) y las 6 tarjetas de talleres + su
  ficha (la cara delantera, al terminar el giro, usa el cartel nuevo). Evidencias en
  `docs/prompts-output/[55-0]/evidence/`; informe en `docs/prompts-output/[55-0]/report.md`.
- tmp/scratch: N/A (una sesión, tres fases cortas).

## Cierre

Commit(s) de implementación por fase → informe con resumen, riesgos y lista de diferencias del programa → commit del
informe → `./sds-dev-governance/scripts/git-safe-push.sh origin main`.
