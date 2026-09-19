# JIA-2026-09-19-40 — Pie: la imagen del establo de fondo, la herradura 3D colgada siempre del poste, y las tres columnas compactas, equidistantes y centradas

**Fecha:** 2026-09-19 · **Origen:** dos mensajes del promotor en chat (el segundo, a mitad de la preparación), con la
imagen `assets/images-website/footer-caballo-poste.png` (2172 × 724, 3:1: establo en penumbra, patas de un caballo a
contraluz en la puerta, y a la derecha un **poste de madera** iluminado; los bordes se funden a marrón oscuro).
**Nivel:** LEVEL 2 (imagen nueva en el pie + cambio del anclaje de un componente WebGL + maquetación) · tmp/scratch:
**aplica** → `docs/prompts-output/JIA-2026-09-19-40/tmp/progress.md` y `evidence/`.
**Estado:** EJECUTADO (2026-09-19/20) — informe en `docs/prompts-output/JIA-2026-09-19-40/report.md`. Decisiones de ejecución: herradura al 78 % de la cara del poste (≈ 124 px), umbral de montaje 1100 px y segunda versión de la imagen del establo (enviada el 20-09).

## Texto del promotor

> «¿puedes integrar esta imagen en el footer, haciendo que la herradura 3D coincida siempre (y esto es adaptative) con
> el poste? En principio probamos con el tamaño de la animación; si consideras que es muy grande, se puede reducir un
> poquito para que ajuste más a la visual, decisión tuya. Probemos ;)»
>
> «y compactar (no tener tanto padding inicial en las 3 "columnas" del footer "SECCIONES" (y lo que hay en esa columna
> visual), "ORGANIZA" y "COLABORA" ;) Algo menos de separación y que las 3 secciones sean equidistantes entre sí y
> centradas respecto al width adaptativo de la pantalla»

## Estado de partida (medido)

- El bloque del pie por encima de la línea mide ≈ 332 px de alto a 1788 px de ventana. Rejilla
  `1.4fr 1fr 1fr 1fr`: marca a la izquierda y tres columnas que **llegan hasta el borde derecho del contenedor**, con
  ≈ 250 px de hueco entre la marca y «Secciones» y ≈ 300 px de paso entre columnas.
- La herradura (`components/site/horseshoe/`) cuelga de un clavo a **28 px del borde derecho de la ventana** y 6 px bajo
  el borde superior, mide la mitad del alto del bloque (tope 240 px) y **solo se monta desde 1600 px**, porque más
  estrecho pisaría la columna «Colabora».

## Encargo 1 — Columnas compactas, equidistantes y centradas

- La rejilla pasa a **tres zonas**: marca a la izquierda · **grupo de las tres columnas en el centro** · zona libre a la
  derecha, con las dos zonas laterales iguales (`1fr`), de modo que **el grupo queda centrado respecto al ancho de la
  ventana** a cualquier tamaño.
- Dentro del grupo, cada columna mide lo que su contenido y **la separación entre ellas es la misma** y menor que hoy
  (del orden de 3–4 rem, adaptativa). Desaparece el hueco grande entre la marca y «Secciones».
- Se interpreta «padding inicial» como ese hueco **horizontal**; el aire vertical del bloque no se toca (la imagen lo
  agradece). Si el promotor se refería al de arriba, es un valor (`padding-block` de `.inner`).
- En móvil (< 760 px) todo sigue apilado como hoy.

## Encargo 2 — La imagen del establo, de fondo del pie

- Por la vía de contenido del proyecto: derivados WebP con `scripts/build-assets.sh` → `public/footer/`, entrada en
  `lib/content/media.ts`, `stableMediaId` en `lib/content/sections/footer.ts`, campo `stable` en el modelo del pie.
  Nada de rutas de imagen ni medidas en el componente.
- Capa de fondo del **bloque superior del pie** (a todo el ancho de la ventana, por debajo del texto y de la
  herradura; la franja del estudio y los estepicursores siguen sobre tinta). La imagen ya se funde a oscuro en sus
  bordes; se remata con una máscara para que **no se vea ningún corte** contra `--jia-ink`.
- **La imagen se ancla por el poste, no por sus bordes**: se escala por el alto del bloque y se coloca de modo que el
  poste caiga en la zona libre de la derecha (la que deja el encargo 1). Así el poste está siempre donde puede estar
  la herradura.
- **El texto manda:** la luz de la puerta cae detrás de «Organiza»/«Colabora». Velo de tinta graduado (más denso bajo
  el texto, nulo sobre el poste) hasta que el texto se lea como hoy. Comprobar contraste en capturas.

## Encargo 3 — La herradura, siempre en el poste (adaptativo)

- El poste se marca **en CSS, en porcentajes de la caja de la imagen** (un marcador invisible sobre la cara iluminada
  del poste, a la altura del clavo). El motor de la herradura **lee el rectángulo de ese marcador** en cada colocación
  (carga, redimensión): clavo en el centro del poste, y **tamaño derivado del ancho del poste** (la herradura cabe en la
  cara del poste con aire a los lados). Como la imagen y el marcador escalan juntos, la herradura coincide con el poste
  a cualquier ancho sin números mágicos en el motor.
- **Tamaño (decisión delegada):** hoy llega a 240 px; sobre un poste de ≈ 150 px se saldría de la madera. Se reduce a lo
  que pida el poste (≈ 80 % de su cara). Se decide viendo la captura.
- Sin marcador (p. ej. sin imagen) la herradura se comporta como hasta ahora (clavo junto al borde derecho).
- La caída, los rebotes, el suelo (la línea del pie) y la vuelta al clavo no cambian; la sombra cae ahora sobre la madera.
- **Umbral de montaje:** con el grupo centrado, la derecha queda libre también en ventanas medianas: bajar
  `largeMedia` de 1600 px hasta donde el poste quepa sin pisar texto (objetivo ≥ 1280 px; decidir con capturas).

## Reglas de ejecución

- Prompt **commiteado antes de ejecutar**; un commit por fase; **commit al terminar**; sin push salvo que se pida.
- El promotor usa **Fork** en paralelo y deja ficheros preparados: **todos los commits con rutas explícitas**
  (`git commit … -- <rutas>`); si hay `index.lock`, esperar, no borrarlo.
- Verificación: `tsc`, `check:content`, `next build`; Chrome por CDP (SwiftShader) a 1920, 1788, 1440, 1280 y 390;
  medir que el centro del grupo = centro de la ventana y que los dos huecos entre columnas son iguales; medir el
  desfase clavo–poste a cada ancho; doble clic (la herradura cae y vuelve al poste); `scrollWidth`.

| Fase | Contenido | Cierre |
|---|---|---|
| 0 | este prompt | commit **(antes de ejecutar)** |
| 1 | columnas del pie | commit |
| 2 | imagen de fondo (activos, contenido, capa, velo) | commit |
| 3 | herradura anclada al poste + tamaño + umbral + evidencias | commit |
| 4 | `report.md` y estado del prompt | commit |

## Riesgos previstos

- **Moderado — legibilidad** de «Organiza»/«Colabora» sobre la luz de la puerta: velo graduado; verificar.
- **Moderado — origen y licencia de la imagen** por confirmar (como el resto de imágenes aportadas): anotarlo en
  `media.ts`.
- **Menor — peso:** una imagen más (WebP, dos anchos); carga diferida (está al final de la página).
- **Menor — la herradura será más pequeña** que hoy: es lo que pide el poste; decisión delegada por el promotor.
