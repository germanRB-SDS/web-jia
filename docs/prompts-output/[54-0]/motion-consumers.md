# Fase A — Mapa de impacto

LEVEL 3; contract-change; REL-2026-09-25-03. Base bb284af. El propietario ordena ejecutar, commit, push y producción el 25-09-2026. [54-0] sustituye explícitamente la prohibición absoluta bajo reduce solo tras aceptación. La guía exige autorización nueva para SSH; no se reutiliza la excepción consumida.

Constantes: lib/content/index.ts negocio; copy/types.ts y copy/es/ textos; media.ts assets; palette.css colores; lib/motion/config.ts cookie; config.ts de Talleres tiempo/geometría.

| Consumidor | Antes | Política / cleanup | Verificación |
|---|---|---|---|
| `app/globals.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/tilt-card/TiltCard.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/tilt-card/TiltCard.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/Hero.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/SiteFooter.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/PosterCard.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/IntroVideo.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/FooterShots.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/Experiences.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/horseshoe/Horseshoe.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/CursorMark.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/tumbleweeds/StudioStrip.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/programa-dias/ProgramaDias.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/CursorMark.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/IntroVideo.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/sun-rays/SunRays.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/programa-dias/ProgramaDias.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/jornadas-route/JornadasRoute.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/talleres-carrusel/TalleresCarrusel.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/jornadas-route/JornadasRoute.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/flip-card/FlipCard.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/site/collaborators-carousel/carousel-engine.ts` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/cube-carousel/CubeCarousel.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/cube-carousel/CubeCarousel.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/primitives/BulletHole.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/talleres-carrusel/TalleresCarrusel.tsx` | consulta local JS | store compartido; cleanup individual o actualización en vivo | CSS computado / E2E dirigido |
| `components/primitives/SheetDialog.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/primitives/Action.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/primitives/SheetCard.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |
| `components/site/collaborators-carousel/CollaboratorsCarousel.module.css` | media CSS | atributo efectivo + fallback media sin JS | CSS computado / E2E dirigido |

Cookie on → store en memoria → atributo html + suscripciones → motores/CSS. Sin API/BBDD. Rechazo solo memoria del documento. Carrusel: gesto → actividad en memoria → bloqueo/timer → expansión y scroll. V3 dirigido a consumidores enumerados.
