# [55-0] Informe: cubo con 7 integrantes nuevos y arranque aleatorio, programa corregido y carteles nuevos de talleres

Prompt: [`docs/prompts/[55-0]cubo-aleatorio-programa-y-carteles-de-talleres.md`](../../prompts/[55-0]cubo-aleatorio-programa-y-carteles-de-talleres.md)
· LEVEL 2 · Fecha: 29-09-2026 · Rama: `main`.

## Commits

| Commit | Qué |
|---|---|
| `cc5c051` | Material del promotor (`assets/whatsapp/`) antes de empezar (árbol limpio) |
| `3f0ed3e` | Prompt refinado `[55-0]` |
| `c361568` | Fase A: cubo (7 tarjetas y arranque aleatorio) |
| `723b56c` | Fase B: programa |
| `5b2c30c` | Fase C: carteles de talleres |

## Resumen

### Fase A: cubo

- Se añaden 7 integrantes con el rol nuevo `experiencia-exito` («Experiencia de éxito», el rótulo de sus tarjetas),
  al final del orden del cubo: Gabi Moral (59), Rubén López (60), Gonzalo Carretero (61), María López (62), Pilar
  Díaz (65), Toni Navarro (66) y Cristina Robles / León (67). El cubo pasa de 29 a 36 integrantes. Los actuales no
  cambian.
- **Ficheros añadidos:** `public/equipo/card-{59,60,61,62,65,66,67}-{420,800}.webp` (mismo formato, anchos y
  calidad que el resto de tarjetas). Originales leídos de `assets/whatsapp/item-cubo/`, donde siguen.
- **Código:** `lib/content/data/{types,people}.ts`, `lib/content/media.ts`, `lib/content/copy/es/sections/jornadas.ts`
  (etiqueta del rol), `scripts/build-assets.sh` (el bucle de tarjetas también lee la carpeta nueva),
  `components/cube-carousel/{config.ts,CubeCarousel.tsx}`.
- **Arranque aleatorio:** tras montar, el cubo elige un desplazamiento en `[0, 36)` y lo aplica a caras, tapas,
  rótulo, «X de 36», agujeros de bala y precarga. El motor (giro, autoplay, arrastre, volteos) no se toca. Se puede
  apagar con `CUBE_CONFIG.randomStart`.

### Fase B: programa (lista de diferencias)

El cartel general (`cartel-01 #JIA26 (11).png`) coincide con la web: 16-10-2026 en el Conservatorio de Danza Kina
Jiménez, de 16:30 a 20:30, y 17-10-2026 en el CEIP Freinet, de 9:30 a 14:30 y de 16:30 a 20:30. **Sin cambios.**
Las diferencias estaban en el cronograma (`cartel-02-…jpeg`):

| # | Web antes | Cartel | Corrección |
|---|---|---|---|
| 1 | J1 16:00–17:00 «Recepción» | «Registro de forajidos y docentes» | Nombre cambiado |
| 2 | J1 17:00–17:30 «Inauguración» y 17:30–18:00 «Apertura» (dos sesiones) | 17:00–18:00 «Bienvenida de los sheriffs de la educación (The Grand Theatre)» (una sola) | Fusionadas en una sesión de 17:00 a 18:00 con el nombre nuevo |
| 3 | J1 18:00–19:00 «Conferencia inaugural: Creatividad en educación» | «Consejos del viajero del conocimiento»: «Que la creatividad te acompañe», conferencia de Rafa Fortis | Nombre, título de la conferencia y ponente |
| 4 | J1 19:00–20:30 «Exposición de Buenas Prácticas de la provincia de Almería» | «Cabalgata de éxitos de la frontera» | Nombre cambiado |
| 5 | J2 10:00–11:30 «Talleres (1)» | «Las lecciones del Oeste (Aulario del Correo): Talleres prácticos 1» | Nombre y lugar |
| 6 | J2 11:30–12:15 «Desayuno» | «Desayuno del pionero (Cantina de Tiza Seca)» | Nombre y lugar |
| 7 | J2 12:30–14:00 «Talleres (2)» | «Las lecciones del Oeste… Talleres prácticos 2» | Nombre y lugar |
| 8 | J2 14:00–16:00 «Comida» | «Repostaje de víveres y agua (Cantina de Tiza Seca)» | Nombre y lugar |
| 9 | J2 16:00–17:30 «Talleres (3)» | 16:00–16:30 «El desafío de las seis cartas (En las calles de Tiza Seca Town)» | Sesión nueva de 16:00 a 16:30 |
| 10 | (los talleres 3 terminaban a las 17:30) | 16:30–18:30 «Las lecciones del Oeste… Talleres prácticos 3» | Hora 16:30–18:30 y nombre |
| 11 | J2 19:00–20:00 «Dinámica de cierre. Juego: El duelo» | 18:30–19:30 «Juego: El duelo final (Arenal de los desafíos)» | Hora y nombre |
| 12 | J2 20:00–20:30 «Clausura de las jornadas» + «Vídeo de cierre» + «Agradecimientos y despedida» (sin hora) | 19:30–20:30 «El regreso a la frontera educativa (Saloon)»: clausura, archivo digital, aftermovie, despedida | Una sola sesión de 19:30 a 20:30: «El regreso a la frontera educativa (Saloon): clausura de las jornadas»; las dos filas sin hora se quitan |

Resultado: la jornada 1 pasa de 5 a 4 sesiones y la jornada 2 de 9 a 8. Solo se corrigió información; no se tocaron
el diseño, la estructura, los carteles ni el título de la sección. Código: `lib/content/data/program.ts` y
`lib/content/copy/es/sections/jornadas.ts`.

**Datos del cartel que no se trasladaron (decisión del promotor):**

- Las descripciones largas de cada sesión (p. ej., «Entrega de cartas de crédito y mapas de la frontera»). La sección
  solo muestra nombres. Solo se añadieron el título y el ponente de la conferencia.
- El título del cronograma, «El duelo de tiza seca».
- **Discrepancia entre carteles:** la jornada 1 empieza a las 16:00 en el cronograma y a las 16:30 en el cartel
  general. La web ya tenía esa misma diferencia (horario 16:30–20:30 y primera sesión a las 16:00). Se mantiene
  hasta que el promotor diga cuál vale.
- Erratas del cartel que no se copian: «SHÉRIFFS» (en la web, «sheriffs»), «19: 30» y «conocimeintos».

### Fase C: talleres

- Emparejamiento por número, comprobado con el título impreso (sin dudas): 1 → «Por un puñado de bloques», 2 → «Dos
  renders y un destino», 3 → «El bueno, el feo… y el plano», 4 → «Siete legos para siete planos», 5 → «La profe que
  pintó a Liberty Valance», 6 → «La muerte tenía un micro».
- **Ficheros añadidos:** `public/talleres/cartel-2026-09-29-{1…6}-{560,1000}.webp` (mismos anchos y calidad).
- **Reemplazados (referencias):** `posterMediaIds` de los 6 talleres en `lib/content/data/workshops.ts`. Antes
  apuntaban a 9 carteles (tres talleres tenían dos) y ahora cada uno tiene el suyo. Es la única fuente de la tarjeta,
  del carrusel móvil y de la cara delantera de la ficha giratoria (`SheetCard` → `FlipCard`); `rg` no encontró más
  referencias. Los carteles antiguos y sus `.webp` se quedan registrados y sin uso, como el resto de originales
  retirados. No se tocaron los textos, el reverso ni la animación.

## Verificación

- `npx tsc --noEmit` ✔ · `npm run check:content` ✔ (6 talleres, 45 personas, 75 medios) · `npx next build` ✔.
- Chrome real por CDP sobre `out/` a 1440 px y a 390 px (móvil, táctil, densidad 2). Scripts y resultados en
  `evidence/` (`qa.mjs`, `qa-escritorio.json`, `qa-movil.json`):
  - **Cubo:** en 6 cargas por tamaño el primer integrante cambia. El recorrido completo con «siguiente» da 36
    tarjetas distintas y cargadas, vuelve al principio y pasa por las 7 nuevas. Un muestreo aparte de 60 cargas
    (`cubo-60-cargas.json`) da 31 valores distintos y 9 arranques en integrantes nuevos, lo esperable con un reparto
    uniforme. En dos sondeos salió «1 de 36» dos veces seguidas: esas cargas estaban hidratadas y el autoplay siguió
    a «2 de 36», así que fue azar y no un fallo. Capturas: `cubo-*-carga.png` y `cubo-*-integrante-nuevo.png`.
  - **Programa:** el DOM muestra las 4 + 8 sesiones corregidas en los dos tamaños. Capturas: `programa-escritorio.png`,
    `programa-movil.png` y `programa-movil-jornada-2.png`.
  - **Talleres:** en cada una de las 6 tarjetas y en su ficha, tras el giro, se ve `cartel-2026-09-29-N`. El reverso
    sigue siendo el sello. Capturas: `talleres-*-tarjetas.png` y `talleres-*-ficha-{1…6}.png`.
  - Sin desbordamiento horizontal. Sin errores de consola ni excepciones.
- tmp/scratch: N/A (una sesión, tres fases cortas).

## Análisis de riesgo

**Moderados**

1. **Destello del integrante 1 antes de hidratar.** El HTML estático trae el orden fijo y el integrante aleatorio
   llega con la hidratación. Si alguien llega al cubo antes de que termine (conexión muy lenta), puede ver un instante
   a la primera persona. El cubo está a mitad de página y no se observó en las pruebas. *Solución, si molesta:* ocultar
   las caras hasta el primer render en cliente (fase futura, decisión del promotor).
2. **Textos de sesión más largos.** Las filas crecen a 2–4 líneas en móvil, sin desbordar (comprobado a 390 px).
   *Solución:* ninguna ahora; si el promotor prefiere nombres cortos, se acortan en el catálogo.
3. **Datos pendientes de confirmar:**
   - la hora de inicio de la jornada 1 (16:00 o 16:30);
   - el nombre de la tarjeta 67, que muestra a dos personas y queda `provisional`;
   - la entradilla del equipo («Coordinadores, Directores CEP, asesores y colaboradores») no nombra al grupo nuevo de
     «Experiencia de éxito», porque no se cambiaron textos.

   *Destino:* decisión del promotor.

**Severos:** ninguno. Se buscaron regresiones del motor del cubo (índices envueltos con `mod`, agujeros de bala en el
integrante absoluto, precarga desplazada) y referencias perdidas a los carteles: no se encontró nada.

**Críticos:** ninguno nuevo. El cambio es de contenido y de un componente de cliente. No afecta a la seguridad, a
los datos personales más allá de nombres ya impresos en las tarjetas ni al despliegue.

## Fuera de alcance, para el promotor

- `assets/whatsapp/WhatsApp Image 2026-09-29 at 14.48.05.jpeg` (logotipo de «Aribaldi Circus», fuera de las tres
  subcarpetas) no se usa. Aribaldi aparece como colaborador en los carteles nuevos, pero no en el carrusel de
  colaboradores de la web. ¿Hay que añadirlo?
- No se ha desplegado a producción; solo se ha hecho push a `origin/main`.
