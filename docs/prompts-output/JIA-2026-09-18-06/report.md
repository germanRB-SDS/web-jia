# JIA-2026-09-18-06 — Tamaños de etiquetas, enlaces a los CEP, distintivo como fondo del pie, Propuestas con título/subtítulo y columna visual

**Prompt:** `docs/prompts/JIA-2026-09-18-06-tamanos-enlaces-cep-footer-propuestas.md` · **Fecha:** 2026-09-18

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Tamaños | «Organiza y colabora» es la clase `.kicker` de Partners: 0,75 → 0,875 rem. «Organiza» / «Colabora» es `.groupLabel`: 0,6875 → 0,8125 rem. (+0,125 rem cada una, «2 puntos relativos».) | `components/site/Partners.module.css` |
| Enlaces CEP | URL de cada CEP una sola vez en datos; «CEP de Cuevas Olula» pasa a «CEP de Cuevas-Olula». El pie las enlaza (nueva pestaña) y el párrafo de Socios se compone con marcadores `{o-cep-almeria}` etc. resueltos a enlaces desde los mismos datos. | `lib/content/data/organizations.ts`, `copy/es/sections/partners.ts`, `assemble.ts`, `Partners.tsx`, `SiteFooter.tsx` |
| Distintivo en el pie | Ya no es un icono pequeño: marca de agua en la esquina inferior derecha, ×5 (40 rem), 60 % del disco visible, desenfoque de 1 px, opacidad 0,22 y fundido lineal hacia las columnas para que el anillo se lea sin cruzar el texto. Valoración Impeccable: un mask radial ocultaba el anillo (lo reconocible del distintivo); el fundido lineal lo conserva. Se añade espacio bajo las columnas. | `components/site/SiteFooter.tsx/.module.css` |
| Propuestas | Título «Tu propuesta JIA»; nueva clase compartida **subtítulo** (Alegreya itálica, `--t-subtitle`) con «Tu propuesta puede formar parte de las JIA»; la mitad derecha es una columna visual con la fotografía de la cámara acorazada a sangre por la derecha (velo arena suave en el borde interior). La brújula desaparece. | `Section.tsx/.module.css` (`subtitle`, `layout="split"`), `Proposals.tsx/.module.css`, `lib/content/sections/propuestas.ts`, `media.ts` |

| Propuestas (adenda) | La imagen es una columna real como en «Servicios»: sin padding vertical en la sección, el texto lo aporta y la fotografía ocupa toda la altura, a sangre por arriba, derecha y abajo, en el 45 % del ancho. La sección de Socios pasa a fondo Marfil plano. | `Section.module.css` (`.split`), `Proposals.module.css`, `Partners.module.css` |

| Propuestas (adenda 2) | Menos altura (padding vertical de la columna de texto reducido a 2,5–4 rem), columna visual del 45 % al 53 % (+18 %), recorte del 8 % inferior de la imagen en el build (el original queda intacto) y padding derecho del texto igual a la mitad del izquierdo; todo fluido. | `Section.module.css`, `scripts/build-assets.sh`, `media.ts` |

| Propuestas (adenda 3) | Título, subtítulo y cuerpo llenan la columna de texto sin tope de medida; padding derecho hacia la foto = 1/6 del izquierdo (mín. 16 px), es decir, un tercio del anterior. El script de capturas desactiva la caché del navegador para no revisar builds antiguos. | `Section.module.css` (`.split`), `Proposals.module.css`, `scripts/qa-screenshots.mjs` |

## Verificación

- `tsc --noEmit`, `check:content` (49 medios), `next build`: OK. Capturas en `evidence/` (Propuestas, socios con enlaces, pie escritorio y móvil).

## Riesgos

- Moderado: imagen de la cámara aportada sin origen ni licencia documentados.
- Sin críticos nuevos.
