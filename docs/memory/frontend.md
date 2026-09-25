# Frontend Memory

## Contexto minimo

- Next App Router exporta la misma landing en `/` (preview) y `/almeria-2026` (producción); no hay backend.
- Movimiento: `lib/motion/policy.ts` mantiene aceptación y preferencia efectiva; `use-motion.ts` conecta React. El atributo `html[data-motion]` gobierna CSS, con fallback media sin inicializar.
- Cada motor se actualiza o limpia individualmente; cambiar la preferencia no remonta página, carruseles ni vídeo. CSS/JS no consultan otra política de reduce.
- `components/motion/MotionPreference.tsx`: diálogo nativo, diferido si hay otro modal; control en footer. Copy en diccionario ES.
- Talleres móvil: `TalleresCarrusel` conserva actividad en memoria del documento; 5000ms sin explorar devuelve a mazo, con guardas de foco/modal/pointer/visibilidad.
- `SheetCard` reserva 5% por lado solo en cartel móvil expandido, manteniendo celda y acciones. Geometría/config en `talleres-carrusel/config.ts`.

- Tarjetas de Talleres: vista previa sin Imparte/Temática y separación de 4px entre subtítulo y Ver ficha en escritorio; los datos completos permanecen en el diálogo. Delta autorizado en [54-0].

## Constants Ownership

| Ámbito | Fuente |
|---|---|
| Negocio | `lib/content/index.ts` agrega `site.ts`, datos y secciones |
| Copy | `lib/content/copy/types.ts` y `copy/es/` |
| Medios | `lib/content/media.ts` |
| Colores | `app/theme/palette.css` |
| Preferencia | `lib/motion/config.ts` |

## Validación

Sin .nvmrc en la revisión [54-0]; runtime comprobado Node 24.19.0. TypeScript, check:content y Next build webpack (node_modules enlazado en worktree). CDP de proyecto: `scripts/qa-motion-workshops.mjs ORIGIN policy|geometry|timer|resilience|extra|input|full`. Ver evidencia y límites en `docs/prompts-output/[54-0]/`.

## Riesgos y referencias

No se han probado equipos físicos Windows, Guadalinex ni Samsung Internet. La emulación en Chrome macOS no certifica esas plataformas. No modificar ajustes del sistema ni introducir UA sniffing. Publicación: memoria deployment y guía de despliegue.
