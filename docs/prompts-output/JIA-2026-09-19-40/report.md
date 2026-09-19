# JIA-2026-09-19-40 — Informe

**Prompt:** `docs/prompts/JIA-2026-09-19-40-pie-con-la-imagen-del-establo-herradura-colgada-del-poste-y-columnas-compactas-y-centradas.md`
**Fecha:** 2026-09-19 / 20 · **Rama:** `main`

| Fase | Commit | Contenido |
|---|---|---|
| 0 | `8e9c116` | Prompt (antes de ejecutar). |
| 1 | `24d8ed7` | Columnas del pie compactas, equidistantes y centradas. |
| 2 | `2a22d44` | La imagen del establo de fondo del bloque superior. |
| 3–4 | (este) | Herradura anclada al poste, segunda versión de la imagen, informe. |

## Resultado

**1 · Columnas.** «Secciones», «Organiza» y «Colabora» viajan juntas en un grupo (`.cols`) dentro de una rejilla de
tres zonas —marca · grupo · suelo libre— cuyos laterales son iguales: el grupo queda **centrado respecto a la ventana**
a cualquier ancho (medido: centro del grupo = centro de la ventana a 1920, 1440, 1280 y 1100) y con **la misma
separación** entre las tres (44–64 px según el ancho, antes ≈ 300 px). Desaparece el hueco grande tras la marca. En
tablet siguen las cuatro columnas de antes; en móvil, apiladas.

**2 · La imagen.** Entra por la vía de contenido del proyecto: derivados en `public/footer/establo-{1200,2172}.webp`
(`scripts/build-assets.sh`), medio `footer-establo` en `lib/content/media.ts`, `stableMediaId`/`stablePost` en
`lib/content/sections/footer.ts` y campo `stable` en el modelo. El componente no conoce rutas ni medidas.
Se escala por el **alto del bloque** y se coloca **por su poste**, que cae en el suelo libre a la derecha del grupo.
Bordes fundidos a tinta con `mask-image` y velo graduado (denso bajo las listas, nulo sobre el poste) para que el texto
se lea igual que antes. Se usa la **segunda versión** que envió el promotor el 20-09
(`assets/images-website/footer-caballo-poste-2.png`); la primera se queda al lado, sin uso: los originales no se
sobrescriben.

**3 · La herradura, siempre en el poste.** El pie marca la cara iluminada del poste con un elemento invisible
(`[data-horseshoe-post]`, colocado en porcentajes de la caja de la imagen) y `horseshoe-scene.ts` **lee su rectángulo
en cada colocación**: el clavo va al centro de esa cara y el tamaño sale del **ancho del poste** (`post.widthShare`
0,78). Como imagen y marcador escalan juntos, coinciden a cualquier ancho **sin números mágicos en el motor**; sin
marcador, la herradura se comporta como antes (junto al borde derecho). Medido: desfase entre el centro de la
herradura y el del poste de **2–3 px** a 1920, 1788, 1440 y 1100.
**Tamaño:** decisión delegada por el promotor — la herradura pasa de un tope de 240 px a ≈ 124 px, el 78 % de la cara
del poste, que es lo que pide la madera.
**Umbral de montaje:** de 1600 px a **1100 px**: con el grupo centrado, el poste ya queda libre en ventanas medianas.
**Caída:** verificada con doble clic real por CDP — cae del poste, rebota, queda de pie sobre la línea, el clavo no se
mueve de la madera y a los 5 s vuelve exactamente a su sitio (misma caja que colgada: 1442–1566, top 23).

## Verificación

`tsc`, `check:content` y `next build` ok. Chrome real por CDP a 1920, 1788, 1440, 1280, 1100, 900 y 390:
`scrollWidth = clientWidth` salvo los desbordes previos y ajenos (1280 → 1290, 900 → 925, 390 → 438). Por debajo de
1100 px no se monta ningún `<canvas>`. Evidencias en `evidence/`: antes, después, detalle 2× de la herradura en el
poste, móvil y los cuatro fotogramas de la caída.

## Riesgos

**Críticos / graves:** ninguno.

**Moderados**
1. **Legibilidad.** El texto se lee bien en las capturas, pero el velo está calibrado sobre esta imagen; si el promotor
   cambia la fotografía habrá que revisarlo (y las cifras de `stablePost`). Conviene que lo mire en su pantalla.
2. **`stablePost` depende de la imagen.** Los porcentajes (74,4 % / 10,3 % / 28 %) se midieron sobre la segunda
   versión. Cambiar la imagen sin actualizarlos deja la herradura fuera del poste. Está documentado en
   `sections/footer.ts`.
3. **Origen y licencia de la imagen por confirmar**, como el resto de imágenes aportadas; anotado en `media.ts`.

**Menores**
- La herradura es ahora bastante más pequeña; es lo que pide el poste.
- Sigue sin medirse en GPU real (capturas por software).
- El promotor renombró `hero-2-almeria-docentes.png` mientras se ejecutaba; se le devolvió su nombre porque el hero y
  «Acoge JIA» lo usan y `build-assets.sh` lo deriva. Si quería esa imagen (el paisaje con el poste indicador) en el
  pie, es otro encargo.
