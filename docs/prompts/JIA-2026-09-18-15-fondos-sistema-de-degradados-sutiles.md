# JIA-2026-09-18-15 — Fondos: un sistema de degradados casi imperceptibles que desemboca en #ece2d2

**Fecha:** 2026-09-18 · **Origen:** prompt del promotor en chat, reelaborado para este repositorio.
**Nivel:** LEVEL 2 (solo CSS y tokens; sin cambios de contenido ni de estructura) · **Ejecución:** con `/impeccable`
(refinamiento: se conserva la identidad; PRODUCT.md y DESIGN.md mandan).

## Objetivo

La web gana profundidad y «lujo silencioso» con fondos cálidos muy sutiles: ni un plano uniforme ni un degradado que
se note. Referencia: la lógica del fondo del hero (papel que se abre hacia arena, con una luz marfil en una esquina);
no el personaje ni la tipografía. Sensación editorial, sobria, cinematográfica. Nada de «demo de CSS».

## Alcance en este repositorio

Secuencia vertical de superficies de papel, en orden de lectura:

| # | Superficie | Dónde vive hoy su fondo |
|---|---|---|
| 1 | Hero | `components/site/Hero.module.css` (ya tiene su lógica: es la referencia, no se toca) |
| 2 | «Por dónde empezar» | `Waypoints.module.css` `.strip` (papel plano) |
| 3 | Jornadas: programa, cómo funcionan, talleres | fondo del `body` (`app/globals.css`, papel plano) |
| 4 | Experiencias | `Section.module.css` (tono de sección) |
| 5 | Tu propuesta JIA | `Section.module.css` `.sand` (columna de texto) |
| 6 | Quién hace posible las JIA | `Partners.module.css` `.section` (marfil plano) |
| 7 | Dispara tu centro (Acoge JIA) | `Host.module.css` `.band` (arena plana bajo la fotografía) |

Fuera de alcance: la banda del jinete y el vídeo (duna y tinta, fotográficos), el pie (tinta), tarjetas, fichas y el
cubo. No se tocan textos, tipografía, espaciados ni componentes.

## Reglas del proyecto que condicionan la solución

1. **Un solo sitio para el color.** Ningún HEX de marca fuera de `app/theme/palette.css`. La escala nueva entra ahí
   como extensión documentada, y los degradados como tokens `--jia-bg-*` que solo combinan esos colores.
2. **Escala cálida contenida** (la que propone el promotor), de más clara a más densa:
   `#f6eee2`, `#f3eadc`, `#efe5d6`, `#ece2d2`, `#e8ddcc`. Se nombran como pasos de una misma escala de pergamino.
   La paleta canónica (papel `#f1e7d8`, marfil, arena, tarjeta) no cambia de valor: tarjetas y fichas la siguen usando.
3. **Punto de llegada obligatorio:** la última superficie de papel (n.º 7) termina en `#ece2d2`. Si hay degradado,
   desemboca ahí; esa zona no pierde ese color.
4. **Un sistema, no siete fondos.** Como mucho tres recetas reutilizables (p. ej. «abre», «reposa», «llega») más una
   luz de esquina opcional; las superficies vecinas comparten el color de su junta (donde una acaba, la otra empieza),
   de modo que no haya escalón entre secciones.
5. **Casi imperceptible:** diferencia máxima entre los extremos de un degradado ≈ 3–4 % de luminosidad; radiales muy
   grandes y con opacidad baja; sin manchas, sin bandas visibles (apoyarse en el grano de papel existente,
   `--paper-grain`, si hace falta romper el banding).
6. **Legibilidad primero:** el texto secundario (`--jia-text-muted` `#71604d`) mantiene ≥ 4,5:1 sobre el paso más
   denso de la escala; títulos y cuerpo, de sobra. Se calcula, no se estima.
7. **Sin JavaScript, sin imágenes nuevas, sin animación.** `prefers-reduced-motion` no aplica (nada se mueve).

## Entregable

1. Análisis breve de la estrategia (en el informe).
2. Tokens en `palette.css`: la escala y las recetas `--jia-bg-*`.
3. Aplicación en las superficies 2–7 sustituyendo sus fondos planos; los tonos de `Section.module.css` pasan a
   consumir las recetas.
4. DESIGN.md: la regla del sistema de fondos (qué receta usa cada tipo de superficie y el punto de llegada).
5. Verificación en una sola ronda (escritorio 1440 y móvil 390): capturas de página completa, contraste calculado,
   color medido al final de la superficie 7 = `#ece2d2`, `tsc` + `check:content` + `next build`.
6. Commits según la práctica 14 (prompt → implementación → informe con riesgos) y push.

## Criterio de éxito

Al abrir la web se nota más profundidad, delicadeza y coherencia, y sigue pareciendo limpia, sobria y legible. Si al
probarlo los degradados distintos fragmentan la página, se prioriza la elegancia: menos recetas, mejor resueltas.

## Prompt original del promotor (transcripción)

> Quiero que ajustes los fondos de esta web tomando como referencia el tipo de fondo que se percibe en la imagen hero
> que te muestro: no me interesa el personaje ni la tipografía, sino únicamente la lógica visual del fondo. […]
> Necesito que la web gane sofisticación visual mediante fondos muy sutiles, premium, minimalistas y cálidos […]
> Paleta base sugerida: #f6eee2, #f3eadc, #efe5d6, #ece2d2, #e8ddcc […] la última sección debe mantener como base o
> punto de llegada el color `#ece2d2` […] define variables CSS tipo `--bg-section-1`, `--bg-section-2` […] mejor pocos
> gradients muy bien resueltos que muchos fondos distintos. […] Hazlo con criterio de dirección de arte, no solo como
> una tarea técnica de CSS.

(Texto completo en el chat del 2026-09-18; aquí se conservan las condiciones que fijan el resultado.)
