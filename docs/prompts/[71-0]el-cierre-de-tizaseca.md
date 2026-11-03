# [71-0] Sección nueva «El cierre de Tizaseca»: despedida de las JIA 2026 y aftermovie

- Fecha: 2026-11-03 · Rama: `main` · LEVEL 2 (sección nueva de UI + contenido) · áreas `frontend` · skill Impeccable
- Base: [70-0] (`37a3e66`, pendiente de validación visual; sin subir). Rollback: revert del commit de implementación.
- Salida: `docs/prompts-output/[71-0]/report.md` (+ `evidence/`)
- Material del promotor: `assets/images-website/cierre-tizaseca.png` (1672×941, RGBA opaco; la misma cuadrilla de
  «Tu propuesta JIA», de espaldas y del brazo, caminando hacia el atardecer por la calle del pueblo; el 30 % izquierdo
  ya viene fundido a crema). Se versiona tal cual en el commit de este prompt.

## Entrada del promotor

> Usando /impeccable fíjate en la section "Tu propuesta JIA" porque vas a crear una section nueva debajo de la section
> "DISPARA TU CENTRO" y encima de "QUIÉNES SOMOS". Esta section nueva se llama "El cierre de Tizaseca". El texto es de
> cómo vivimos las JIA 2026 y 'despedida'/ánimo hasta las siguientes jornadas. Y el botón (mismo estilo que el de la
> section TU PROPUESTA JIA) contiene el texto "Ver el aftermovie". En [imagen] tienes la foto para dicha section. Y la
> url es https://www.youtube.com/watch?v=wBjSQhmkqe8 -> también con texto informativo o popup en caso de que no
> cargue el vídeo o se elimine.

## Interpretación y decisiones

- **Orden de la página:** … → Propuestas → Acoge («Dispara tu centro.») → **Cierre (nuevo)** → Socios («Quiénes
  somos») → pie. Ancla `#cierre`.
- **Modelo: «Tu propuesta JIA».** Misma anatomía `Section` con `layout="split"`: título + subtítulo + párrafos a la
  izquierda sobre el fondo de la sección, fotografía a la derecha (53 %) a sangre arriba, derecha y abajo, sin velo ni
  máscara; en < 900 px la foto va bajo el título y el texto cierra la sección. Desde 1280 px, la misma altura de banda
  que Propuestas (`--jia-band-aula-ratio`).
- **La foto** se encuadra con un foco a la derecha (la cuadrilla y el sol), de modo que el fundido crema que trae el
  original queda en el borde izquierdo de la columna y se funde con el fondo. Fondo de la sección: `--jia-vellum-4`,
  el mismo color en que termina «Dispara tu centro» y con el que empieza «Quiénes somos», para que no haya costuras.
  Variantes webp 960/1672 por `scripts/build-assets.sh`; entrada en `lib/content/media.ts` con procedencia.
- **Botón «Ver el aftermovie»:** el mismo botón de cuero (`Action.module.css` › `.btn.primary`) que «Comunica tu idea»,
  con el triángulo de play. Enlace externo a YouTube en otra pestaña.
- **Vídeo que no carga o se retira:** misma lógica que la franja de inauguración de [70-0], extraída a un hook común
  (`lib/media/use-youtube-check.ts`): sin peticiones a YouTube al cargar; al primer gesto de intención se consulta la
  miniatura pública; si vuelve el marcador de 120×90 o no hay URL, la pulsación no navega y aparece bajo el botón una
  nota explicativa (región `status`, cerrable). Si la comprobación no responde, se comporta como enlace normal.
- **Texto** (propuesta editorial, marcado `provisional` como el resto de la copia hasta que el promotor lo valide): cómo
  se vivieron las JIA 2026 (dos días, talleres de cine en el aula, docentes compartiendo) y despedida con ánimo hasta
  las próximas jornadas, en la voz western del sitio. **Sin cifras ni hechos no facilitados** (asistentes, centros…).
  «Tizaseca» se usa como nombre del pueblo de la narrativa, tal como lo nombra el promotor.
- Textos solo en `lib/content/copy/es/`; URL e imagen en `lib/content/sections/cierre.ts`; colores solo por tokens.
- No se añade al menú principal (no se pidió); se puede añadir después.

## Alcance

1. `assets/images-website/cierre-tizaseca.png` (original) → `public/cierre/cierre-960.webp`, `cierre-1672.webp`.
2. `lib/content/sections/cierre.ts`, `media.ts`, copy `es/sections/cierre.ts` + tipos, modelo en `assemble.ts`.
3. `lib/media/use-youtube-check.ts` (hook) y refactor de `InaugurationBand` para usarlo.
4. `components/site/Closing.(tsx|module.css)` y su sitio en `app/page.tsx`.
5. Verificación: `npx tsc --noEmit`, `npm run check:content`, `npx next build`; Chrome por CDP a 1440 y 390 (sección,
   costuras con Acoge y Socios, botón, nota de «no disponible» forzada).
6. Commit de implementación + informe con commit propio. Sin push hasta la validación del promotor.
