# [56-0] Revólver que marca la sesión en curso del programa, a la hora real de Almería

## PREFACE — NON-EXECUTABLE

Prompt del promotor (chat, 29-09-2026), refinado y aterrizado a `web-jia` tras inspeccionar el repositorio y el
material. Esta sección es memoria: **execute from `## Status` onward**.

- **Qué pide:** en «Programa», un revólver pequeño a la izquierda del numeral romano de la sesión que se está
  celebrando **en este momento**, según la hora real de Almería. Solo el 16-10-2026 (Jornada 1) y el 17-10-2026
  (Jornada 2); el resto del tiempo, y en los huecos entre sesiones, no se muestra nada. Ejemplo: a las 15:00 del día
  16 no hay revólver; entre las 16:00 y las 17:00 apunta a «I» de la Jornada 1; después a «II», «III»…
- **Validación visual primero:** aunque hoy (29-09) debería estar oculto, se muestra **fijo en «I» de la Jornada 1**
  para que el promotor valide el tamaño y el color. Con su OK se quita esa vista previa y queda oculto hasta la fecha.
  El push a `origin/main` se hace **solo después** del OK y de ocultarlo.
- **Config externa ENABLED/DISABLED:** sí, se pide. Fichero propio en `lib/content/config/` (como `talleres.ts`),
  con el interruptor, la vista previa y la zona horaria.
- **Material verificado:** `assets/icons/revolver.svg` (4,1 MB, 1200×675) es una acuarela vectorizada en miles de
  trazos, con un rectángulo de fondo `#F4F2EE` y el revólver apuntando a la derecha (bien: apunta al numeral). No se
  sirve tal cual: se deriva un WebP con transparencia, recortado al arma. Sus colores (hierro y madera) ya casan con
  la paleta; se deja **natural** y la config admite una variante «tinta» (máscara CSS con un token de
  `palette.css`) por si el promotor la prefiere.
- **Hora de Almería:** zona `Europe/Madrid`. El 16 y 17-10-2026 rige el horario de verano (CEST, UTC+2; el cambio es
  el 25-10-2026). No se calcula a mano: `Intl.DateTimeFormat` con `timeZone` da la fecha y la hora locales, sea cual
  sea la zona del visitante y el horario vigente.

## Status

**PENDING**

## Alcance y autoridad

- LEVEL 2 (comportamiento visible nuevo en un componente + contenido). Área: frontend. Sin API, BBDD ni seguridad.
- SDS: prácticas 02, 06, 12, 14 y 16. Impeccable como criterio: no se rediseña el programa, se añade un indicador.
- Textos en `lib/content/copy/`; colores solo con tokens de `app/theme/palette.css`; medio registrado en
  `lib/content/media.ts`; derivados con `scripts/build-assets.sh`. El original no se modifica.
- Commits con rutas explícitas; `next-env.d.ts` fuera de los commits.

## Fase A — Revólver en el programa (vista previa)

1. **Asset.** `scripts/build-assets.sh`: quitar el `<g id="Background">` del SVG en un temporal, rasterizar, recortar
   (`-trim`) y sacar `public/programa/revolver-96.webp` y `revolver-192.webp` con alfa. Registrar `icon-revolver` en
   `media.ts` (ratio del recorte, `original`, licencia «aportado por el promotor el 29-09-2026»).
2. **Config** `lib/content/config/revolver.ts`:
   - `REVOLVER_HORA: "ENABLED" | "DISABLED"` — interruptor general.
   - `REVOLVER_VISTA_PREVIA: boolean` — `true` lo fija en «I» de la Jornada 1 pase lo que pase (solo validación).
   - `REVOLVER_ZONA_HORARIA = "Europe/Madrid"`.
   - `REVOLVER_ESTILO: "natural" | "tinta"`.
3. **Modelo** (`assemble.ts`): cada sesión lleva `slot: { start, end } | null` en minutos desde las 00:00 (leído de
   `time`, «16:00–17:00»); `program.clock` = `{ enabled, preview, timeZone, style, icon, nowLabel }`.
   `copy.jornadas.program.nowLabel` = «Ahora» (texto accesible de la marca).
4. **Componente** (`ProgramaDias`): calcula la sesión activa en el cliente (tras montar; el sitio es estático) con la
   fecha/hora de la zona configurada, `dateIso` del día y `start ≤ ahora < end`; reevalúa cada 30 s. Vista previa →
   `day-1`/`s-1-1` también en el HTML estático. La sesión activa lleva `aria-current="time"` y un texto oculto «Ahora»;
   la imagen es decorativa (`alt=""`).
5. **Colocación:** a la izquierda del numeral, centrado en su línea, sin mover la rejilla (posición absoluta). En
   móvil, dentro del margen si cabe; si no, se ajusta sin desbordar la página.
6. **Verificación:** `tsc`, `check:content`, `next build`; capturas Chrome 1440 y 390 px; prueba de la lógica con
   horas simuladas (15:00 → nada; 16:30 del 16 → I; 12:20 del 17 → nada; 12:30 del 17 → III; 18-10 → nada).
7. Commit de fase y **parar**: enseñar la captura al promotor.

## Fase B — Tras el OK del promotor

1. `REVOLVER_VISTA_PREVIA = false` (queda `ENABLED`: aparece solo el 16 y 17-10 en horario de sesión).
2. Ajustes de tamaño/color que pida. Build, commit, informe en `docs/prompts-output/[56-0]/report.md`, commit del
   informe y push con `sds-dev-governance/scripts/git-safe-push.sh origin main`.

## Adición en ejecución (promotor, chat, 29-09-2026)

> «En la section IDEAS QUE YA HAN PASADO POR EL AULA, el efecto de la luz, cuando desaparece (por la ventana) que
> haya 1s de inacción y luego vuelva a repetirse el efecto de iluminación.»

- Aterrizaje: la luz de `components/site/sun-rays/` hace hoy un solo ciclo de 5 s cada vez que la banda entra en
  pantalla. Pasa a **repetirse** mientras la banda siga en pantalla: al terminar el ciclo (la luz ya ha salido),
  `timing.pause = 1` s de habitación a oscuras y vuelve a empezar. Al salir la banda de pantalla, el ciclo en curso
  termina y no se programa otro; con la pestaña oculta la pausa espera. Movimiento reducido: sin cambios (un
  fotograma fijo). La tiza del encerado se sigue escribiendo una sola vez.
- Va en su propio commit, dentro de la fase A.

## Corrección en ejecución (promotor, chat, 29-09-2026)

> «El revólver es demasiado alargado y se ve no estético, no bonito.»

- A ~40 px de ancho, el cañón largo se leía como un palo. Se acorta en el derivado (no en el original): se quita un
  tramo uniforme de cañón y baqueta (x 1115–1600 del recorte) y se vuelve a poner la boca 24 px más abajo (el cañón
  sube hacia la boca), así queda un Colt de cañón corto, 1744×985 (1,77:1 en vez de 2,21:1). Además es algo más
  grande (`clamp(1.75rem, 2.8vw, 2.75rem)`; 2 rem en móvil) y está inclinado 8° con la boca hacia el numeral.
- Móvil (promotor, chat, 29-09-2026): en vez de desplazar solo la fila marcada, el día que tiene el revólver reserva
  su hueco en **todas** sus filas (`.sessions[data-clock]`), así los numerales quedan en una columna apunte donde
  apunte. El otro día conserva su margen habitual.
