# JIA-2026-09-18-24 — Carrusel de colaboradores: imagen de cada entidad y deriva de derecha a izquierda

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat tras JIA-2026-09-18-23 (con las cinco imágenes).
**Nivel:** LEVEL 2 · tmp/scratch: N/A (dos cambios acotados, una sola fase).

## Encargo

### 1. Cada tarjeta lleva la imagen de su entidad

Los originales están en `assets/images-logo-companies/` y se correlacionan **por el nombre del fichero**:

| Original | Entidad (`data/organizations.ts`) |
|---|---|
| `logo-final-sds.png` | `o-south-desert-studio` — South Desert Studio |
| `logo-final-minihollywood.png` | `o-minihollywood` — Minihollywood Oasys Theme Park |
| `logo-final-leonardo.png` | `o-leonardo` — Leonardo Atrezzo |
| `logo-final-kichi.png` | `o-kichigarcia` — Kichi García Films |
| `logo-final-lagata.png` | `o-gata-purpura` — La Gata Púrpura |

Los `logo-*.png` sin «final» de esa carpeta son los logotipos sueltos con los que se compusieron: no se usan.

Reglas:

- **La tarjeta y la zona de imagen se quedan exactamente como están** (mismo ancho, mismo hueco 4:3, mismos radios y
  márgenes). Es la imagen la que se adapta al hueco, nunca al revés: si su proporción no coincide con la del hueco se
  **recorta** (`object-fit: cover`, centrada, que es donde va el logotipo). No se toca el CSS de tamaños.
- Camino del proyecto para imágenes: derivados WebP en `public/` generados por `scripts/build-assets.sh` desde los
  originales intactos, entrada en `lib/content/media.ts` y `logoMediaId` en `data/organizations.ts`. Anchos pensados
  para un hueco de ~272 px CSS en pantallas de densidad 1–3.
- El color sólido de `sections/socios.ts` se conserva como respaldo (si una imagen falta, la tarjeta no se rompe).
- Texto alternativo vacío: el nombre de la entidad ya va escrito bajo la imagen y en el enlace.

### 2. El carrusel se desplaza solo, de derecha a izquierda, mientras no haya arrastre

- Deriva continua y lenta: las tarjetas entran por la derecha y salen por la izquierda. Velocidad en
  `collaborators-carousel/config.ts`.
- **Arrastrar manda:** al pulsar se detiene; al soltar conserva la inercia del gesto (ya sin asentarse en una tarjeta,
  que con deriva no tiene sentido) y, tras una pausa breve, la deriva se reanuda. Lo mismo tras la rueda lateral y
  tras ← / → (que siguen avanzando de tarjeta en tarjeta).
- Se detiene también, con arranque y frenada suaves, mientras el ratón está encima (para poder acertar en la flecha),
  mientras haya foco de teclado dentro, cuando el carrusel no está en pantalla y con la pestaña oculta.
- `prefers-reduced-motion`: **sin deriva**; el arrastre sigue funcionando como hasta ahora.
- Sin dependencias nuevas.

### 3. Cierre

`tsc`, `check:content` y `next build` en verde; comprobación en Chrome real a 1440 y 390 px (las cinco imágenes en su
tarjeta correcta, medidas de tarjeta y hueco idénticas a las de JIA-23, sentido y velocidad de la deriva, pausa con
ratón encima y con foco, reanudación tras arrastre, movimiento reducido); capturas en
`docs/prompts-output/JIA-2026-09-18-24/evidence/`; nota en `DESIGN.md`; commit de implementación, informe de fase con
riesgos, commit del informe y **push**.

## Fuera de alcance

Tamaños o composición de la tarjeta, textos de la sección, y el resto de ficheros sin seguimiento de `assets/`.
