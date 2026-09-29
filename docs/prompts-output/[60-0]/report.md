# [60-0] Informe — Experiencias: nueva entradilla, tarjetas solo imagen y la luz de la ventana dos veces

**Estado:** EXECUTED (29-09-2026). Prompt: [`docs/prompts/[60-0]experiencias-lede-tarjetas-solo-imagen-y-luz-dos-veces.md`](../../prompts/[60-0]experiencias-lede-tarjetas-solo-imagen-y-luz-dos-veces.md).
Tmp/scratch: N/A. Commits: a8e5cd3 (prompt) · implementación · informe.

## Resumen

- **Entradilla:** «Cultiva las experiencias educativas desde la práctica. Disfruta de la experiencia tal y como nos
  muestran los compañeros ;)» (`lib/content/copy/es/sections/experiencias.ts`). El título no cambia.
- **Tarjetas solo imagen:** nueva opción `pictureOnly` en `lib/content/sections/experiencias.ts` (activada), que
  llega a `SheetCard` como `bare`. Solo queda la superficie de color: el título se mantiene para lectores de
  pantalla y no hay «Ver ficha». La propia imagen hace de botón (`role="button"`, alcanzable con Tab, se abre con
  Intro o Espacio, nombre accesible «Ficha: …», anillo de foco en terracota). Con `pictureOnly: false` vuelve la
  tarjeta completa.
- **Luz de la ventana:** `SUN_RAYS.timing.cycles = 2`. Cada llegada real de la banda a la pantalla reproduce dos
  ciclos y se para; al salir y volver, otros dos como máximo. La tiza, igual que antes: se escribe una sola vez.

## Verificación

- `npx tsc --noEmit` y `npm run check:content`: OK (6 talleres, 56 personas, 2 experiencias, 89 medios).
- Chrome por CDP (`evidence/qa.mjs`, se cuentan las llamadas de dibujo WebGL), a 1440 y a 390 px: en la primera
  llegada, **2 ciclos** (unos 11,7 s de dibujo) y después nada durante más de 4 s; tras subir y volver a bajar,
  **otra vez 2**. Títulos no visibles, ningún «Ver ficha», imagen con `role=button` y `tabIndex=0`; Intro sobre la
  imagen enfocada abre la ficha. Sin errores de consola.
- Captura: `evidence/experiencias-1440.png`.

## Riesgos (moderado / severo / crítico)

- **Moderado — faltó parte del encargo:** el mensaje citaba un bloque pegado de 253 líneas y una imagen que no
  llegaron a la sesión (solo sus marcadores). Se aplicó lo que dice el texto. *Propuesta:* que el promotor vuelva a
  enviar el bloque si traía algo más.
- **Moderado — tarjetas sin nombre visible:** las dos experiencias son `demo` y sin imagen, así que ahora son dos
  bloques de color sin nada que diga qué son. *Propuesta:* ponerles su imagen cuando lleguen las experiencias
  reales (hay material sin versionar en `assets/` con «Experiencias de éxito»), o volver a `pictureOnly: false`.
