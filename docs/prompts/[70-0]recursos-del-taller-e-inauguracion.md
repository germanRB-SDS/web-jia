# [70-0] «Recursos del taller» en Talleres y franja «Inauguración de las JIA 2026» bajo la Intro

- Fecha: 2026-11-03 · Rama: `main` · LEVEL 2 (UI + contenido configurable) · áreas `frontend` · skill Impeccable
- Base: `40d407d` (aviso de Programa hacia el Genially). Rollback: revert del commit de implementación de este prompt.
- Salida: `docs/prompts-output/[70-0]/report.md` (+ `evidence/`)

## Entrada del promotor (resumen fiel)

1. Subsección TALLERES:
   - a. En cada tarjeta, menos separación vertical entre «Ver ficha» y «Descargar dosier», **solo fuera del móvil**
     (en móvil queda igual).
   - b. Debajo, un tercer enlace con el mismo estilo, «Recursos del taller», a un enlace externo propio de cada taller:
     - «Por un puñado de bloques» → https://padlet.com/CEPAl/scratch-s023g0evjmgf8zwtzcsj
     - «El bueno, el feo… y el plano» → https://padlet.com/CEPAl/corto-s023g0d0yxrx7dud8rkb
     - «Dos renders y un destino» → https://padlet.com/CEPAl/video-s023g0eakkb3qqi2ci3c
     - «Siete legos para siete planos» → https://padlet.com/CEPAl/recursos-para-hacer-y-disfrutar-haciendo-stop-motion-s023g0e71jqh8aygxuxu
     - «La muerte tenía un micro» → https://padlet.com/CEPAl/radio-s023g0f0vknebi81rtlu
     - (1.b.6 repite «Siete legos…» con la misma URL: **«La profe que pintó a Liberty Valance» queda sin URL**.)
   - c. En la ficha emergente de cada taller (`SheetDialog`), en móvil y en el resto, un botón «Recursos del taller»
     con el mismo estilo, debajo del botón «Dosier», al mismo enlace del taller.
2. Debajo de la franja «Intro — Jornadas de Innovación de Almería», una franja nueva (que no se despliega) con el
   mismo estilo pero en un marrón oscuro algo más claro que el de la Intro, con el texto «Inauguración de las JIA 2026»
   y a la derecha el botón redondo de la Intro, con un triángulo de «play». Toda la franja (botón incluido, que se
   anima al pulsarlo) lleva a https://www.youtube.com/watch?v=LKWcO_QzofA. Al pasar por encima indica que se verá el
   vídeo de la inauguración en YouTube. Si el vídeo no carga o se ha retirado, al pulsar sale un texto explicativo y
   nunca un enlace roto.

## Interpretación y decisiones

- **Configuración, no componentes.** Las URL de recursos van en `lib/content/config/talleres.ts`
  (`TALLER_N_RECURSOS`, mismo patrón que `TALLER_N_DOSIER`); la del vídeo de inauguración en
  `lib/content/sections/jornadas-inauguracion.ts`. Textos solo en `lib/content/copy/es/`. Colores solo como tokens de
  `app/theme/palette.css` (el marrón nuevo se define allí como mezcla de tokens existentes, sin HEX nuevo).
- **Taller sin URL** (`null`): en la tarjeta, etiqueta apagada «Recursos próximamente» (igual que el dosier pendiente);
  en la ficha, el botón no aparece. Nunca un enlace muerto. Pendiente que el promotor facilite la URL del taller 5.
- **Tarjeta (1.a/1.b).** «Recursos del taller» es un `<a target="_blank" rel="noopener noreferrer">` con la voz de
  «Ver ficha» / «Descargar dosier» (terracota, versalitas, icono de enlace externo que se desplaza en diagonal al
  pasar). Desde 760 px los tres enlaces de los talleres reducen su alto mínimo (44 → 32 px; sigue por encima de los
  24 px de WCAG 2.5.8) y el hueco entre filas, así quedan más juntos; por debajo de 760 px no cambia nada de lo que ya
  había.
- **Ficha (1.c).** Bajo «Dosier ↓», un segundo botón de cuero de la misma anchura: «Recursos ↗», con nombre accesible
  «Recursos del taller {título} (Padlet, se abre en otra pestaña)».
- **Franja de inauguración (2).** Componente propio `InaugurationBand`, tras `IntroVideo` en `Jornadas.tsx`, fuera de
  la región de la Intro (no se pliega con ella). Misma anatomía que la barra de cine: etiqueta a la izquierda sobre la
  línea fina, texto en la cursiva de la edición en el centro, botón redondo a la derecha. Toda la franja es UN enlace
  (no un botón dentro de un enlace, que no es HTML válido): el círculo es su indicador visual. Hover/foco: el fondo se
  calienta, el triángulo avanza y aparece «Ver en YouTube ↗»; al pulsar, el círculo se hunde y suelta una onda.
- **Vídeo retirado, sin enlace roto.** Sin peticiones a terceros al cargar la página: al primer indicio de intención
  (puntero encima, foco, pulsación) se comprueba la miniatura pública del vídeo (`i.ytimg.com/vi/<id>/mqdefault.jpg`,
  sin referrer). YouTube devuelve un marcador de 120×90 cuando el vídeo ya no existe: en ese caso la pulsación no
  navega y despliega bajo la franja una nota («El vídeo de la inauguración no está disponible ahora mismo en
  YouTube…»). Si la comprobación no llega a tiempo o falla la red, el enlace se comporta como enlace normal. Con la URL
  a `null`, la franja muestra directamente la nota al pulsar.
- Movimiento reducido: sin onda ni desplazamientos.

## Alcance

1. `lib/content/config/talleres.ts`: `TALLER_N_RECURSOS` + `TALLERES_RECURSOS`.
2. `lib/content/assemble.ts`: `SheetModel.resources` y modelo `InaugurationModel` en `jornadas`.
3. `lib/content/copy/`: textos nuevos (tipos + `es`).
4. `components/primitives/SheetCard.(tsx|module.css)`: enlace en la tarjeta, botón en la ficha y espaciado de escritorio.
5. `components/site/InaugurationBand.(tsx|module.css)`, `components/icons` si hace falta, `Jornadas.tsx`, `palette.css`.
6. Verificación: `npx tsc --noEmit`, `npm run check:content`, `npx next build`; Chrome por CDP a 1440 y 390 px
   (tarjetas, ficha abierta, franja en reposo/hover, nota de vídeo no disponible forzada).
7. Commit de implementación + informe y commit del informe. Se arranca `npm run dev` para validación visual del
   promotor; **push y despliegue solo tras su visto bueno**.

## Hotfix on the fly 1 (2026-11-03)

> «puedes crear un nuevo color para la paleta para la section del video por si consideras que la gama que tenemos no
> es perfecta para esa nueva section»

- Token nuevo `--jia-saddle: #4b2a18` (+ `--jia-saddle-rgb`) en `app/theme/palette.css`, «cuero de silla»: un paso más
  claro que `--jia-ink` (#2f180b) de la Intro, en la misma familia; 11,1:1 con el marfil del texto.

## Hotfix 2 — URL de recursos del taller 5 (2026-11-03) · LEVEL 1

> «revisa los enlaces de RECURSOS DEL TALLER. Tanto en el botón como en el botón del popup menu. […] Para "LA PROFE QUE
> PINTÓ A LIBERTY VALANCE", url: https://padlet.com/CEPAl/album-ilustrado-s023g0g96mjnqn374z1d […] asegúrate de que el
> resto está con su url bien. Y lo subes a producción.» · «commit al terminar y gh push de web-jia/ (sin
> sds-dev-governance […])»

- `TALLER_5_RECURSOS` = `https://padlet.com/CEPAl/album-ilustrado-s023g0g96mjnqn374z1d`: la tarjeta deja de mostrar
  «Recursos próximamente» y pasa a «Recursos del taller» (enlace a otra pestaña); la ficha (popup) gana el botón «Recursos».
- Revisión de los otros cinco contra la lista del promotor (orden `workshops.ts` = `TALLER_N`): 1 bloques → scratch,
  2 renders → video, 3 plano → corto, 4 legos → stop-motion, 6 micro → radio. Todos coinciden; sin cambios.
- Tarjeta y ficha leen el mismo `href` (`assemble.ts` → `SheetModel.resources`), así que no hay un segundo sitio que corregir.
- Commits solo con rutas explícitas de web-jia; `sds-dev-governance/` queda fuera (trabajo en curso de otro agente).
- Verificación: tsc, check:content, build; publicación como REL-2026-11-03-02 con el procedimiento habitual.
