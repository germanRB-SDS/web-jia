# Componentes y bloques

**P** = export portable con demo propia. **R** = implementación original conservada en el snapshot;
para otro negocio requiere adaptar modelos de contenido, imports y tokens. R no equivale a npm package.
No duplicamos los tres exports P dentro de este catálogo: sus owners siguen en resources.

| ID | Estado / propietario | Unidad que hay que conservar | Contrato detallado |
|---|---|---|---|
| menu | R · [SiteHeader](../project-skeleton/reference/components/site/SiteHeader.tsx) | SiteHeader + SiteNav + ambos CSS; icons + modelos nav/brand/event/copy. | [Navegación y hero](navigation-hero.md) |
| hero | R · [Hero](../project-skeleton/reference/components/site/Hero.tsx) | Hero + CSS; primitives, logo, sello, Surface; tokens/máscaras globales. | [Navegación y hero](navigation-hero.md) |
| waypoints | R · [Waypoints](../project-skeleton/reference/components/site/Waypoints.tsx) | TSX/CSS, iconos y modelos. | [Navegación y hero](navigation-hero.md) |
| jornadas | R · [Jornadas](../project-skeleton/reference/components/site/Jornadas.tsx) | Banda/CSS + jornadas-route + motion + GLB con nodos/config y enlaces a talleres. | [Foto y 3D](photo-composition.md) |
| video | R · [IntroVideo](../project-skeleton/reference/components/site/IntroVideo.tsx) | TSX/CSS, modelo IntroVideoModel, copy/format, icons, motion; MP4 + poster. | [Vídeo](video.md) |
| program | R · [ProgramaDias](../project-skeleton/reference/components/site/programa-dias/ProgramaDias.tsx) | TSX/CSS + clock.ts + modelos/datos horarios/locales; SVG del indicador si se usa. | [Programa](program.md) |
| cube | P · [cube-carousel](../../../resources/web-components/cube-carousel/INDEX-AND-HOW-TO-USE-THEM.md) | component/, soporte, palette, GSAP/Draggable, items y labels. Wrapper de prosa original en Jornadas. | [Cubo, film y colaboradores](portable-widgets.md) |
| cards | R · [TalleresCarrusel](../project-skeleton/reference/components/site/talleres-carrusel/TalleresCarrusel.tsx) | Deck/config/CSS + SheetCard + SheetDialog + TiltCard + FlipCard + Picture/Surface + datos. | [Tarjetas, baraja y diálogo](cards.md) |
| experiences | P para tira; R para escena · [film-reel](../../../resources/web-components/film-reel/INDEX-AND-HOW-TO-USE-THEM.md) | FilmReel/visor/motor/config/arte; wrapper Experiences, SunRays y cutout si se desea profundidad. | [Widgets](portable-widgets.md) · [Foto y 3D](photo-composition.md) |
| split-hard | R · [Proposals](../project-skeleton/reference/components/site/Proposals.tsx) | Section/Surface/Action y CSS + props; corte recto. | [Divisiones de contenido](splits.md) |
| split-soft | R · [Host](../project-skeleton/reference/components/site/Host.tsx) | Host/CSS, Surface/Action y props; velo ligado a columna. | [Divisiones de contenido](splits.md) |
| partners | P · [collaborators-carousel](../../../resources/web-components/collaborators-carousel/INDEX-AND-HOW-TO-USE-THEM.md) | Sección completa Partners + tira + tarjeta + TiltCard + estilos/soporte. | [Widgets](portable-widgets.md) |
| footer | R · [SiteFooter](../project-skeleton/reference/components/site/SiteFooter.tsx) | Footer/CSS, StudioStrip/FooterShots si se conservan; horseshoe, GLB, marker, fonts/tokens y modelos. | [Footer](footer.md) · [Foto y 3D](photo-composition.md) |

## Dependencias compartidas

En el snapshot, `@/` apunta a la raíz de reference. Conservar CSS Modules homónimos, helpers de
`components/primitives`, iconos utilizados y tipos de `lib/content`; `lib/motion` enlaza política,
hooks y limpieza. El [manifest](../metainfo/source-manifest.json) contiene todos esos archivos.
Para separar una pieza, seguir imports locales transitivamente y extraer un tipo de props pequeño;
no arrastrar el negocio completo por comodidad. Los exports P ya hicieron esa separación y documentan
sus cambios respecto al original. El snapshot original permanece disponible para comparar fidelidad.
