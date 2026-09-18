# JIA-2026-09-18-18 — Experiencias: la fotografía del aula como fondo de la sección

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat, con la imagen adjunta
(`assets/images-website/aula-maestra-clase.png`, 1916 × 821). **Nivel:** LEVEL 2 · **Ejecución:** con `/impeccable`.

## Encargo

Implantar esa imagen en la sección «Ideas que ya han pasado por el aula». La imagen va en horizontal, de izquierda a
derecha (entera, a todo el ancho). El texto y las fichas se ajustan para no tapar la parte derecha de la foto (la
maestra), al menos en resolución grande.

## Reglas del proyecto

Original intacto en `assets/`; derivados WebP por `scripts/build-assets.sh`; la imagen se registra en
`lib/content/media.ts` y la sección la toma por `mediaId` (quitarla es un cambio de configuración). Decorativa
(`alt=""`). El suelo de la sección sigue la regla de fondos: la foto se funde con el paso 3 del pergamino.
