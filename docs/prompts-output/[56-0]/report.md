# [56-0] Informe — Revólver a la hora real de Almería en el programa + luz de la ventana en bucle

**Estado:** EXECUTED (29-09-2026). Prompt: [`docs/prompts/[56-0]revolver-hora-real-en-el-programa.md`](../../prompts/[56-0]revolver-hora-real-en-el-programa.md).
Tmp/scratch: N/A (tarea corta, una sesión).

## Resumen

- **Revólver en «Programa»** (`components/site/programa-dias/`): apunta al numeral de la sesión en curso, con la hora
  de `Europe/Madrid` calculada por `Intl` (el 16 y 17-10-2026 rige CEST, UTC+2; el cambio de hora es el 25-10). Solo se
  ve en las fechas de `data/program.ts` y dentro del horario de una sesión (`inicio ≤ ahora < fin`); en los huecos
  y el resto del tiempo, nada. Se reevalúa cada 30 s. La fila activa lleva `aria-current="time"` y el texto oculto
  «Ahora».
- **Config externa** `lib/content/config/revolver.ts`: `REVOLVER_HORA` ENABLED/DISABLED, `REVOLVER_VISTA_PREVIA`
  (`{ jornada, sesion } | null`), zona horaria y estilo (`natural` | `tinta`). Queda **ENABLED, sin vista previa**.
- **Asset:** derivado de `assets/icons/revolver.svg` (original intacto) sin el fondo, con el cañón acortado a petición
  del promotor («demasiado alargado»), 96/192 px WebP con alfa (1,8 KB / 4,5 KB). Registrado como `icon-revolver`.
- **Colocación:** en escritorio va en el margen, a la izquierda del numeral, con posición absoluta (la rejilla no se
  mueve) e inclinado 8°. En móvil, el día que tiene el revólver reserva su hueco en todas las filas, para que los
  numerales queden alineados.
- **Adición:** la luz de la ventana de «Experiencias» se repite mientras la banda está en pantalla, con 1 s a oscuras
  entre ciclos (`SUN_RAYS.timing.pause`); se detiene al salir la banda y en pestaña oculta. La tiza se escribe una vez.
- **Validación del promotor:** tamaño y estilo aprobados a pantalla completa en PC (Jornada 1 · I y Jornada 2 · III).

## Verificación

- `npx tsc --noEmit`, `npm run check:content` (77 medios), `npx next build`: OK.
- Lógica, con horas simuladas: 16-10 15:00 → nada; 16:30 → J1·I; 14:30Z (= 16:30 CEST) → J1·I; 20:29 → J1·IV;
  20:30 → nada; 17-10 12:20 (hueco) → nada; 12:30 → J2·III; 18-10 → nada; hoy → nada.
- Chrome real con reloj inyectado: 16-10 18:10 → J1·III; 17-10 12:45 → J2·III; 16-10 15:00 → nada. Sin reloj falso
  (hoy) y con la vista previa en `null`: no aparece, y `out/index.html` no contiene `aria-current="time"`.
- Evidencias en `evidence/`.

## Riesgos (moderado / severo / crítico)

- **Moderado — el reloj es el del dispositivo.** Si el móvil de un asistente tiene la hora mal, el revólver señalará
  otra sesión. Es aceptable para un indicador decorativo; la alternativa (hora de un servidor) no existe en un sitio
  estático. *Propuesta:* ninguna; se documenta.
- **Moderado — el horario es `provisional`.** Si cambia una sesión, basta con corregir `time` en `data/program.ts`: el
  revólver lee el mismo dato. Un `time` sin el formato «HH:MM–HH:MM» deja esa sesión sin revólver (no rompe nada).
- **Moderado — la luz en bucle consume GPU** mientras la banda está en pantalla (antes, un ciclo). Se para fuera de
  pantalla y en pestaña oculta; con movimiento reducido sigue siendo un fotograma fijo. No se ha medido en un móvil
  de gama baja. *Propuesta:* si hiciera falta, subir `pause` o limitar el número de ciclos. El bucle no se ha visto en
  el navegador: solo se ha comprobado que compila.
- Sin riesgos severos ni críticos.

## Commits

50a1d94 (prompt) · 0dd3ed6 · e5c5f5a · 106e5f6 · 4420853 · 968aab4 · informe (este commit).
