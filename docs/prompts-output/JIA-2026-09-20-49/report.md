# JIA-2026-09-20-49 · Informe de ejecución

**Prompt:** `docs/prompts/JIA-2026-09-20-49-movil-jornada-1-y-2-con-pestanas-talleres-en-carrusel-fichas-mas-juntas-y-pie-y-menu.md`
**Fecha de ejecución:** 2026-09-21 · **Rama:** `main` · **Nivel:** LEVEL 2 · **tmp/scratch:** N/A
**Estado:** EJECUTADO, los seis puntos.

## Qué se pidió y qué quedó

| # | Encargo | Estado |
|---|---|---|
| 1 | El programa, en móvil, con «Jornada 1 / Jornada 2», línea bajo la seleccionada y deslizamiento | Hecho |
| 2 | Los talleres, en móvil, en carrusel con botones redondos | Hecho |
| 3 | Las fichas de «Ideas que ya han pasado por el aula», con poca separación antes de «Ver ficha» | Hecho (84 px → 11 px) |
| 4 | La hoguera debajo del título de «Tu propuesta JIA», en móvil | Hecho |
| 5 | El pie, enseñando la zona derecha del establo | Hecho (54 %–95 % de la imagen) |
| 6 | Franja del pie y menú: nota fuera en móvil, marca +15 %, crédito más grande, «Contacta con South Desert Studio» | Hecho |

## Decisiones que el prompt dejaba abiertas

- **Estética de los botones del carrusel:** el aro de la tarjeta de colaboradores llevado al papel, no el
  control del vídeo. El control del vídeo lleva disco de tinta y `backdrop-filter` porque tiene que leerse
  sobre película en marcha; sobre el papel de los talleres sería una mancha oscura.
- **Umbral de «vista móvil vertical»:** `max-width: 759.98px`, el que el proyecto ya usaba para separar las
  jornadas y para reordenar la franja del pie. Dos puntos conservan el suyo porque su composición estaba ya
  escrita: la foto de «Tu propuesta JIA» (900 px, donde arranca el `split`) y la entrada del menú (960 px,
  donde existe el panel).
- **«Un tamaño de letra más grande»:** se interpretó sobre la escala de interfaz del proyecto
  (…0,8125 · 0,875 · 0,9375 · 1…): 0,9375 rem en móvil y 1 rem de 760 px en adelante.
- **«Aumentar un 15 % la marca»:** sobre lo que se dibuja hoy, que ya era `scale(1.15)`; queda en 1,3225.
- **Alto de la pista del programa:** añadido sobre el encargo, porque con las dos jornadas en la misma pista
  el alto lo ponía la más larga y la Jornada 1 dejaba un palmo de papel vacío.

## Cierre por fases (práctica 14)

| Fase | Implementación | Informe |
|---|---|---|
| A — el móvil de las jornadas (puntos 1 y 2) | `12fffed`, `a9ba29f`, `97bd3fc` | `phase-a-report.md` (commit `fe7e8a4`) |
| B — fichas, propuestas, pie y menú (puntos 3–6) | `0ca224a`, `dd7a676`, `58e62c0`, `f1888ae` | `phase-b-report.md` |

## Verificación

`npx next build`, `npx tsc --noEmit` y `npm run check:content` en verde en cada punto. Medición en el
navegador por CDP a 360, 390, 768, 1024 y 1440 px, y capturas en `evidence/`. El detalle de cada medida está
en los dos informes de fase.

## Riesgo abierto

Sin críticos ni severos. Los moderados, con su solución propuesta, están en los informes de fase; el que
conviene no perder de vista: **cuatro sobrescrituras de móvil ganan por orden dentro de su hoja**, así que
al tocar `SiteFooter.module.css` hay que comprobar el estilo calculado en el navegador, y **el velo del pie
está afinado contra la fotografía actual del establo**: si se cambia esa imagen, hay que repetir la medición
de contraste.
