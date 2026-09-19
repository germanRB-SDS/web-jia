# Indice-glosario de terminos UI

Este glosario fija nombres comunes para efectos, componentes y patrones visuales ya extraidos o
identificados en `sds-dev-governance/resources/frontend-patterns/`.

Usalo cuando quieras pedir un efecto por nombre sin depender de una descripcion ambigua como
"el brillo ese", "el difuminado" o "la animacion del texto". El nombre canonico permite localizar
el ejemplo exportable, sus archivos y sus cautelas de integracion.

## Como usar este glosario

1. Busca el termino canonico o un alias.
2. Abre la carpeta indicada en "Ejemplo exportable".
3. Lee su `INDEX-AND-HOW-TO-USE-THEM.md` antes de copiar codigo.
4. Adapta colores, copy y assets mediante tokens/config/i18n del proyecto destino.

## Terminos

| Termino canonico | Alias utiles | Que describe | Tecnica principal | Ejemplo exportable |
|---|---|---|---|---|
| `aura-lift` | aura post-scroll, capa radial blanca, difuminado blanco del hero, light lift | Overlay radial claro que aparece durante el scroll para aclarar la escena sin cambiar el contenido base. | Capa absoluta con `radial-gradient(...)`, `pointer-events: none` y opacidad animada por scroll/timeline. | Pendiente de exportar como recurso propio. Fuente actual: `src/public/styles/app.css` (`.aura-lift`) y `src/public/scripts/hero.js` (`tl.to(".aura-lift", ...)`). |
| `mask-reveal` | reveal por mascara, logo reveal, wordmark reveal, reveal recortado | Una capa visual aparece recortada por una forma, normalmente un logo o wordmark, mientras el tamano de mascara cambia. | `mask` / `-webkit-mask`, `mask-size` animado, capa de fondo/glow detras del recorte. | Pendiente de exportar como recurso propio. Fuente actual: `src/public/styles/app.css` (`.reveal`) y `src/public/scripts/hero.js` (`maskState`). |
| `wordmark-glow` | logo glow, brillo del wordmark, marca luminosa | Marca o wordmark con relleno degradado y halo suave para dominar el primer viewport. | `background` degradado recortado con `mask`, mas `filter: drop-shadow(...)`. | Pendiente de exportar como recurso propio. Fuente actual: `src/public/styles/app.css` (`.hero-wordmark`). |
| `svg-path-glow-trace` | glow que recorre SVG, brillo sobre path, estela en contorno, comet trail SVG | Particula luminosa o estela tipo cometa que sigue la geometria real de un path SVG. | SVG inline overlay, path invisible, `radialGradient`, `<animateMotion>` y varios circulos escalonados para la estela. | `ui-animations/svg-path-glow-trace/` |
| `border-glow` | pointer glow, card glow, halo de borde, spotlight border | Brillo que sigue el cursor sobre el borde de una superficie sin tintar el contenido. | Pseudo-elementos, coordenadas de puntero en CSS variables, gradientes y `pointer-events: none`. | `ui-animations/border-glow/` |
| `text-shimmer` | shimmer de texto, texto con brillo, gradiente animado de texto | Banda luminosa que se desplaza por una palabra o frase corta. | `background-clip: text`, texto transparente y `background-position` animado. | `ui-animations/text-shimmer/` |
| `carousel-motion` | transicion de carrusel, slide fade direccional, motion layer | Capa de movimiento para carruseles con direccion, fade y fallback de reduced motion. | Estados/classes de slide, `transform`, `opacity` y transiciones CSS/JS. | `ui-animations/carousel-motion/` |
| `consult-source-button` | boton consultar fuente, external-source CTA, legal CTA | CTA tipo pill que abre un documento canonico externo y combina glow, puntos flotantes e icono animado. | Link `<a>`, gradientes, particulas CSS, SVG line icon animado en hover/focus. | `ui-components/consult-source-button/` |
| `frosted-alert-modal` | modal frost, alert glass, modal de aviso | Modal de una accion con backdrop de vidrio esmerilado. | Backdrop fijo, `backdrop-filter`, dialog surface, focus/accessibility states. | `ui-components/frosted-alert-modal/` |
| `frosted-confirm-modal` | confirm glass, modal confirmacion frost | Dialogo de confirmacion con dos acciones sobre una superficie frosted. | Backdrop frosted, botones primario/secundario, estado opcional de peligro. | `ui-components/frosted-confirm-modal/` |
| `frosted-arrow-buttons` | arrows frost, navegacion glass, botones prev/next | Botones de navegacion anterior/siguiente con superficie frosted. | Botones icon-only, `backdrop-filter`, estados hover/focus/disabled. | `ui-components/frosted-arrow-buttons/` |
| `drag-relocate-button` | drag handle, relocation handle, boton reordenar | Control de arrastre para reordenar tarjetas o secciones. | SortableJS, asa dedicada, persistencia opcional del orden. | `ui-components/drag-relocate-button/` |
| `carousel` | carrusel base, carousel component | Componente de carrusel con estado, controles, contador y teclado. | HTML estructurado, JS de indice actual, ARIA/keyboard support. | `ui-components/carousel/` |
| `palette-seed` | paleta exportable, design token seed | Paleta de referencia para iniciar tokens de color en otro proyecto. | CSS custom properties y export JS de tokens. | `color-palettes/teragenda-colors-palette/` |
| `notification-toast-stack` | `notificaciones-01`, toast, aviso animado, notificacion success/error/info | Pila de feedback transitorio con entrada/salida lateral, lectura de 3,5 s y cierre inmediato al pulsar. | DOM seguro, roles `status`/`alert`, temporizadores JS, transiciones CSS y reduced motion. | `ui-components/notification-toast-stack/` |

## Notas de nomenclatura

- Usa `aura-lift` solo para la capa que aclara la escena. No lo mezcles con `wordmark-glow`.
- Usa `mask-reveal` para el mecanismo de mascara, aunque el contenido recortado sea un logo,
  una foto, un degradado o una textura.
- Usa `text-shimmer` solo para texto. Si el brillo sigue el cursor sobre una superficie, es
  `border-glow`.
- Usa `svg-path-glow-trace` cuando el brillo deba seguir la geometria de un SVG concreto. Si la
  forma viene de una CSS mask, primero crea una capa SVG inline aditiva con el path a trazar.
- Usa `frosted-*` cuando el patron dependa de vidrio esmerilado (`backdrop-filter`) y no solo de
  transparencia.

## Pendientes de exportacion

Estos terminos ya existen en codigo de Auragenda pero aun no tienen carpeta portable propia:

- `aura-lift`
- `mask-reveal`
- `wordmark-glow`

Cuando se exporten, crear una carpeta bajo `ui-animations/` con `INDEX-AND-HOW-TO-USE-THEM.md`,
HTML/CSS/JS minimo y actualizar `../index-of-resources-and-working-patters.md`.
