# JIA-2026-09-18-24 — Carrusel de colaboradores: imagen de cada entidad y deriva de derecha a izquierda

**Prompt:** `docs/prompts/JIA-2026-09-18-24-carrusel-colaboradores-imagenes-y-deriva.md` ·
**Fecha:** 2026-09-18 · **Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 2 · tmp/scratch: N/A.
**Commit de implementación:** `bf3ac22`.

## Resumen

- **Imágenes:** los cinco originales `assets/images-logo-companies/logo-final-*.png` (1448×1086) se correlacionan por
  nombre de fichero: `sds` → South Desert Studio, `minihollywood` → Minihollywood Oasys Theme Park, `leonardo` →
  Leonardo Atrezzo, `kichi` → Kichi García Films, `lagata` → La Gata Púrpura. `build-assets.sh` genera WebP de 420
  y 840 px en `public/colaboradores/` (10–16 KB y 29–43 KB), `media.ts` los registra (`colabora-*`) y
  `organizations.ts` los enlaza con `logoMediaId`. Ningún componente ni CSS de tamaños cambia.
- **Recorte:** los originales son 4:3, la misma proporción del hueco, así que hoy no se recorta nada; el hueco fija su
  proporción y la imagen va con `object-fit: cover` centrada, de modo que cualquier otra proporción futura se recorta
  sola. El color sólido por entidad sigue de respaldo.
- **Deriva:** el motor pasa a un único bucle: deriva a 28 px/s hacia la izquierda con arranque y frenada suaves
  (450 ms); se detiene al pulsar, con el ratón encima, con foco de teclado dentro, fuera de pantalla y con la pestaña
  oculta; se reanuda 1,4 s después de un arrastre, rueda o tecla. Al soltar conserva la inercia del gesto, ya sin
  asentarse en una tarjeta. ← / → siguen avanzando de tarjeta en tarjeta. Ajustes en `config.ts`.

## Verificación (Chrome real por CDP)

- Medidas idénticas a las de JIA-23, tomadas antes y después: tarjeta 296×312 e imagen 272×204 a 1440;
  264×288 y 240×180 a 390.
- Las cinco tarjetas cargan su fichero (`sds`, `minihollywood`, `leonardo`, `kichi`, `lagata`), `object-fit: cover`;
  variante de 420 px a densidad 1 y de 840 px a densidad 3.
- Deriva −28 px/s (hacia la izquierda) a 1440 y a 390. Ratón encima: 0. Ratón fuera: −28. Pulsado sin mover: 0 px
  en 0,6 s. 0,9 s tras soltar: 0; 3,9 s tras soltar: −28. Foco de teclado dentro: 0; al salir: −28. Fuera de
  pantalla: 0. Movimiento reducido: 0. Sin scroll horizontal de página.
- `tsc`, `check:content` (55 medios), `next build`: OK. Capturas en `evidence/`.

## Riesgos

- **Moderado — contenido en movimiento (WCAG 2.2.2).** La deriva no termina nunca; se detiene con ratón encima, con
  foco de teclado y con movimiento reducido, pero en táctil no hay un control de pausa visible. *Propuesta:* si se
  quiere cumplimiento estricto, añadir un botón de pausa junto a la ayuda «Arrastra…».
- **Moderado — derechos de imagen.** Los logotipos son de cada entidad y el fondo es una composición aportada por el
  promotor; licencia anotada en `media.ts` como aportación del promotor, pendiente de confirmación por las entidades.
- **Menor:** los originales (8,5 MB en total) entran en git, como el resto de originales del proyecto. Los
  `logo-*.png` sueltos de la misma carpeta no se usan y quedan sin seguimiento.
- Sin severos ni críticos.
