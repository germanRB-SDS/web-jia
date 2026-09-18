# JIA-2026-09-18-25 — Hotfix del carrusel: tarjeta de la Junta y nombres a la izquierda

**Fecha:** 2026-09-18 · **Origen:** dos mensajes del promotor en chat tras JIA-2026-09-18-24 (con la imagen).
**Nivel:** LEVEL 1 (ajuste acotado; sin informe de fase aparte: el resultado va aquí).

## Encargo

1. Una tarjeta más en el carrusel: **Junta de Andalucía · Consejería de Educación**, enlace
   https://www.juntadeandalucia.es/organismos/educacion.html, imagen `assets/images-logo-companies/logo-final-consejeria-educacion.png`.
2. El nombre de cada entidad deja de ir centrado: **empieza por la izquierda**, con el mismo margen que tiene la imagen
   hasta el borde de la tarjeta.

## Resultado

- La Junta es organizadora, no «colabora», así que el carrusel ya no filtra por relación: toma la lista ordenada
  `carouselIds` de `lib/content/sections/socios.ts` (Junta primero, luego los cinco colaboradores). La URL se guarda
  en `data/organizations.ts` (fuente única), por lo que **el nombre de la Junta en el pie pasa también a ser enlace**.
  Imagen por el camino habitual (`build-assets.sh` → `public/colaboradores/consejeria-educacion-{420,840}.webp` →
  `media.ts` → `logoMediaId`). La etiqueta accesible del carrusel pasa a «Entidades que organizan y colaboran».
- Nombre en la primera columna del pie de tarjeta, alineado a la izquierda a ras de la imagen (el margen es el
  relleno de la tarjeta, 0,75 rem); la flecha conserva el borde derecho. Medidas de tarjeta e imagen sin cambios
  (296×312 / 272×204 a 1440; 264×288 / 240×180 a 390).
- Comprobado en Chrome real a 1440 y 390 px: seis tarjetas, cada una con su fichero; deriva −28 px/s; sin scroll
  horizontal. `tsc`, `check:content` (56 medios), `next build`: OK. Capturas en
  `docs/prompts-output/JIA-2026-09-18-25/evidence/`.

## Riesgos

- **Moderado:** uso del logotipo institucional de la Junta sobre una composición; su manual de identidad restringe
  fondos y alteraciones. *Propuesta:* confirmarlo con la organización (CEP) antes de publicar.
- **Menor:** el nombre largo de la Junta ocupa dos renglones en escritorio y tres en móvil, dentro del alto actual.
