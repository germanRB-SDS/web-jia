# JIA-2026-09-18-03 — Ritmo de fondos, hero cinematográfico, Jornadas y Acoge a la manera de maryna-ventura, socios

**Prompt:** `docs/prompts/JIA-2026-09-18-03-ritmo-de-fondos-hero-acoge-socios.md` · **Fecha:** 2026-09-18

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Hero: aparición de botones (hotfix) | Copiado el gesto de maryna-ventura: el lettering «se enfoca» (`focus-in`, el interletrado se asienta), y regla, título, fecha, párrafo y botones «suben» (`rise`, 700 ms) con retardos escalonados de 350 a 650 ms. | `components/site/Hero.module.css` |
| Hero: luces | Una luz cálida desde arriba a la derecha expone la fotografía una sola vez al cargar: la foto «se revela» (brillo/contraste/saturación de 0,82 a 1) mientras una cuña de luz marfil (radial + máscara cónica, como `studioLight` en maryna-ventura) barre y se asienta al 55 %. Sin bucle; `prefers-reduced-motion` la deja en reposo. | `Hero.tsx` (`.light`), `Hero.module.css` |
| Las jornadas | Banda de tinta con luz clave cobriza, kicker «Las jornadas», el texto de intro como declaración grande en marfil y el cartel grande sangrando por el borde derecho e inferior (formato de la sección «Sobre Maryna»). Las tres hojas del cuaderno siguen debajo sobre papel. | `components/site/Jornadas.tsx/.module.css` |
| Acoge JIA | Banda fotográfica a sangre con el arquero aportado (`assets/images-website/acoge-arquero.png`, 1922×818): el sujeto ocupa la izquierda y el texto «Dispara tu centro. Acoge las próximas JIA» va sobre el fondo despejado de la derecha. Degradado papel→foto arriba y foto→tinta abajo para enlazar con el pie. Móvil: foto 16:9 arriba, texto sobre arena. | `components/site/Host.tsx/.module.css`, `lib/content/sections/acoge.ts`, `media.ts` |
| Etiquetas | `site.preview.markProvisional = false`: desaparecen todos los chips «Provisional» y «Demostración» y el aviso del pie sobre el título. Los estados editoriales siguen en los datos. | `lib/content/site.ts` |
| Socios | Sección nueva «Quién hace posible las JIA» entre Propuestas y Acoge, con la estructura de «Con quién trabajamos» de fields-web: kicker con regla, título, párrafo a la derecha y placa marfil con dos filas (Organiza / Colabora). Sin archivos de logotipo, cada entidad se muestra en tipografía de rótulo en gris; `logoMediaId` en `data/organizations.ts` los sustituye por imagen cuando existan. | `components/site/Partners.tsx/.module.css`, `copy/es/sections/partners.ts` |
| Ritmo de fondos | papel (hero) → papel (atajos) → **tinta** (Jornadas) → papel (hojas) → arena→papel (Dosieres) → papel (Experiencias) → arena (Propuestas) → papel→marfil (Socios) → **fotografía** (Acoge) → tinta (pie). Cambios de fondo netos entre bandas, como en maryna-ventura, y degradados cortos solo donde una superficie entra en otra (arena, marfil, ambos bordes de la foto de Acoge). | `Section.module.css` (`ivory`), `Partners`, `Host` |
| Impeccable (polish) | Pase de pulido sobre capturas: texto de Acoge separado de la flecha y fuera del degradado oscuro, botón no disponible legible, declaración de Jornadas a 22 caracteres, colores sueltos tokenizados (`--jia-ivory-rgb`). El detector solo deja avisos *advisory* de tamaños de fuente fuera de la escala documentada. | — |

## Verificación

- `tsc --noEmit`, `check:content` (47 medios) y `next build`: OK.
- Capturas en `evidence/`: hero 1440 (con los botones ya asentados; la animación no se captura), banda de Jornadas, socios, Acoge en escritorio y móvil, página completa 390.
- No verificado: la animación de entrada y la luz solo se han comprobado por código y por el estado final; conviene verlas en el navegador.

## Riesgos

- Moderado: la imagen del arquero la aporta el promotor sin origen ni licencia documentados; registrado en `media.ts`.
- Moderado: los nombres de socios en texto no sustituyen a los logotipos oficiales; pendiente de la organización.
- Moderado: con las etiquetas apagadas, los datos provisionales (fechas, título de edición) ya no se distinguen visualmente; la trazabilidad queda solo en los datos. Reactivar `markProvisional` antes de revisiones internas.
- Sin críticos nuevos.
