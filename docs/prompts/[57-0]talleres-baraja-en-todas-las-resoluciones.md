# [57-0] Talleres: la presentación móvil (baraja en abanico → tira deslizable) en todas las resoluciones

## PREFACE — NON-EXECUTABLE

Prompt del promotor (chat, 29-09-2026), refinado y aterrizado a `web-jia` tras inspeccionar el repositorio. Esta
sección es memoria: **execute from `## Status` onward**.

> «Quiero que copies el estilo de presentación de las cards de la subsección TALLERES, para que lo presentes en
> escritorio y resto de resoluciones tal y como se presenta en móvil actualmente. Guapísimo. Commit antes de hacerlo,
> y si te valido, commit al terminar y gh push.»

- **Hoy (verificado con capturas a 390 y 1440 px):**
  - Móvil (< 760 px): las 6 tarjetas forman una **baraja en abanico** (escala 0,62, giro ±25°) con el rótulo «Toca
    para desplegar los talleres». Al tocarla (o al pasar el ratón por encima, si hay puntero fino) se despliega en una
    **tira con scroll-snap**: una tarjeta por vista con la siguiente asomando, solo el cartel (con un margen del 5 %)
    y las acciones «Ver ficha» / «Descargar dosier», y dos flechas redondas debajo. Si nadie la explora en 5 s, o si la
    sección sale de pantalla, vuelve a plegarse.
  - Escritorio (≥ 760 px): rejilla de 3×2 con cartel, título, subtítulo y acciones.
- **Dónde vive:** `components/site/talleres-carrusel/` (comportamiento en `TalleresCarrusel.tsx`, gobernado por el
  estado `mobile` de `WORKSHOP_DECK.mobileMedia`; geometría en su CSS bajo `@media (max-width: 759.98px)`) y las
  reglas de la tarjeta de taller en `components/primitives/SheetCard.module.css` (bloques móviles de `.workshop`).
- **Alcance:** solo las **tarjetas** de Talleres. No cambia la ficha (el diálogo) de escritorio, que tiene su propia
  maqueta, ni el rótulo de la subsección («Talleres» en escritorio, «Talleres en el Saloon» en móvil), ni el resto de
  tarjetas (`SheetCard` también pinta «Experiencias»).
- **Severidad prevista:** moderada (en escritorio el abanico se abre al pasar el ratón, y la tira ya no muestra
  título ni subtítulo bajo el cartel: están en la ficha). Nada severo ni crítico.

## Status

**NO ADOPTADO** (29-09-2026): implementado en a732974 y revertido por [58-0] a petición del promotor («en móvil se ven como una baraja, pero en el resto de resoluciones no: como estaba»).

## Alcance y autoridad

- LEVEL 2 (presentación de un componente en todas las resoluciones). Área: frontend. Sin API, BBDD ni seguridad.
- SDS: prácticas 02, 06, 12, 14 y 16. Impeccable como criterio: se replica la presentación móvil, no se rediseña.
- Colores solo con tokens; sin textos nuevos (si hiciera falta, en `lib/content/copy/`).
- Commits con rutas explícitas; `next-env.d.ts` fuera de los commits. Push **solo tras la validación del promotor**.

## Ejecución

1. `TalleresCarrusel`: la baraja es la presentación en todas las anchuras. Se quita la condición `mobile` (y su
   `matchMedia`) del comportamiento: pliegue, despliegue por toque/clic/teclado/ratón, auto-pliegue a los 5 s sin
   explorar y al salir de pantalla, y flechas. `config.ts` deja de tener `mobileMedia`.
2. `TalleresCarrusel.module.css`: la geometría móvil sin `@media`; desaparece la rejilla de escritorio. El ancho de
   tarjeta sigue siendo `min(78cqw, 19rem)`, así que en escritorio la tira enseña varias tarjetas a la vez.
3. `SheetCard.module.css`: las reglas de la tarjeta de taller que hoy solo aplican en móvil (la tarjeta fluye, sin
   título/subtítulo/quién/tema/«reveal» bajo el cartel, sin elevación al pasar el ratón, cartel con margen en la tira
   desplegada) pasan a aplicar en todas las anchuras. Las del diálogo (`.workshop .sheet…`) siguen siendo solo de
   móvil.
4. Verificación: `tsc`, `check:content`, `next build`; capturas en Chrome a 1440, 1024 y 390 px, plegada y desplegada;
   teclado (Tab → botón de desplegar → Enter → foco en la tira → flechas); un enlace del programa a un taller concreto
   sigue desplegando la baraja y llevando a su tarjeta.
5. Commit de implementación → enseñar capturas → **validación del promotor** → informe en
   `docs/prompts-output/[57-0]/report.md` → commit → push con `sds-dev-governance/scripts/git-safe-push.sh origin main`.
