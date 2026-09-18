# JIA-2026-09-18-19 — Experiencias: la maestra a la izquierda, el contenido a la derecha y la sección a la altura de la foto

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat tras JIA-2026-09-18-18, con la imagen adjunta
(`assets/images-website/aula-maestra2.png`, la misma escena en espejo). **Nivel:** LEVEL 2.

## Encargo

1. En «Ideas que ya han pasado por el aula» la imagen pasa a la izquierda usando la nueva fotografía (la maestra a la
   izquierda, el papel claro a la derecha); título, entradilla y fichas van a la derecha. Motivo: mejor contraste con
   la sección siguiente.
2. La altura de la sección es, como máximo, la de la imagen: ningún elemento queda por encima de la foto.

## Criterios

- Misma cadena que JIA-18: original intacto en `assets/`, derivados WebP por `scripts/build-assets.sh`, entrada en
  `lib/content/media.ts`, `mediaId` en la configuración de la sección. La imagen anterior deja de usarse y sus
  derivados se retiran.
- Escritorio: sección = altura exacta de la foto a todo el ancho (`100vw × 821 / 1916`); el contenido se compacta
  (márgenes, cuerpo del título, proporción de las fichas) para caber dentro, sin desbordar, en 1280–1920 px.
- Donde el contenido no quepa a esa altura (pantallas estrechas), la foto vuelve a ser una banda propia sobre el
  título, recortada hacia la maestra, y el contenido va debajo: tampoco ahí hay nada encima de la foto.
- Verificación medida: altura de la sección = altura de la foto; borde inferior del contenido dentro de la sección;
  el contenido empieza a la derecha de los pupitres.
