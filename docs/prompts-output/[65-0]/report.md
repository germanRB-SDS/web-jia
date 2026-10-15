# [65-0] Dosieres, experiencias descargables y tres tarjetas del cubo · informe de fase

- Prompt: `docs/prompts/[65-0]dosieres-y-experiencias-descargables.md` · LEVEL 2 · área `frontend`
- Commits: `1fcbb52` (prompt + originales) · `1024719` F1 cubo · `e0c7833` F2 dosieres · `cf7827e` F3 experiencias
- Continuidad tmp/: N/A (una sesión, tres fases cortas). Evidencia: `evidence/*.webp`.
- Rollback: `git revert cf7827e e0c7833 1024719` (los originales de `1fcbb52` pueden quedarse).

## Resumen

1. **Cubo.** Yolanda García, Ana I. García y Eli Iglesias (Asesora CEP) **no estaban** en el cubo. Sus tarjetas
   (`28 (1).png`, `29 (1).png`, `30 (1).png`) pasan a ser las 59, 60 y 61, con WebP 420/800 y su persona en
   `data/people.ts`. El cubo pasa de 49 a 52 tarjetas («n de 52»); el orden es el de numeración, así que salen al final.
2. **Talleres.** Los seis dosieres en `public/talleres/dosieres/` (nombres limpios; bytes idénticos a los de
   `~/Downloads` y a `assets/dosieres-didacticos/`, verificado por MD5 y por el título de la primera página).
   `config/talleres.ts` los asigna en el orden pedido. «Descargar dosier» de la tarjeta descarga (atributo `download`).
   En la ficha emergente, botón primario de cuero **«Dosier ↓»** bajo el cartel y a su ancho: queda junto a lo que
   documenta, visible sin desplazar y lejos de «Cerrar». En móvil va bajo el cartel flotante.
   Alt de los seis carteles comprobado: «Cartel del taller …»; ninguna imagen de Jornadas/Talleres sin `alt`.
3. **Experiencias.** Título «Experiencias de éxito» y la entradilla nueva. Los siete PDFs en
   `public/experiencias/descargas/`, ligados a cada cartel por la persona (Gabriela Moral = «Gabi Moral»;
   Cristina León y Cristina Robles = «Cristina Robles / León»). El visor lleva un degradado de marfil (sólido abajo,
   transparente al 40 % de la altura) y el botón centrado **«Descargar ↓»**.

## Verificación

- `npx tsc --noEmit` PASS · `npm run check:content` PASS (6 talleres, 59 personas, 99 medios) · `next build` PASS.
- CDP en Chrome, 1440 y 390 px, sobre `out/`: la ficha del taller 1 muestra «DOSIER» → su PDF; el visor del cartel 3
  muestra «DESCARGAR» → `experiencia-de-exito-toni-navarro.pdf`; los 12 enlaces de las tarjetas apuntan a sus seis PDFs;
  el HTML contiene las tarjetas 59-61 con alt «Nombre, Asesora CEP»; los PDFs se sirven como `application/pdf`.
- Verification: V1 | contenido + dos componentes de UI | PASS. No se probó en un dispositivo físico.

## Riesgos moderados y soluciones

1. **El degradado tapa el nombre y la recompensa del cartel en el visor.** Es lo pedido (40 % sólido → transparente);
   el nombre sigue en el nombre accesible y en el rollo. Destino: decisión del promotor si quiere bajar el degradado.
2. **Peso.** Los PDFs suman ~41 MB en `public/` (7 × ~4,5 MB + 6 × ~1,6 MB) y se suben con el despliegue. Solo se
   descargan al pulsar. Destino: comprimirlos (p. ej. `gs -dPDFSETTINGS=/ebook`) si el alojamiento lo pide.
3. **Duplicados en el repositorio.** Los originales quedan en `assets/` y la copia publicable en `public/`.
   Destino: aceptado, como con el resto de imágenes del proyecto.
4. **Las tarjetas 59-61 salen al final del cubo**, no junto a las otras asesoras (10-32), porque el cubo sigue la
   numeración. Destino: decisión del promotor; renumerar todo el set tiene más coste que beneficio.
5. **En la portada sigue la línea «Ideas de cine que ya han pasado por el aula»** como resumen de Experiencias
   (`copy/es/sections/hero.ts`). No se tocó: el encargo hablaba de la sección. Destino: decisión del promotor.

## Riesgos severos/críticos

Ninguno nuevo. No se toca backend, auth, datos personales nuevos (solo nombres impresos en las tarjetas), secretos ni
despliegue. Los PDFs son documentos aportados por el promotor para su publicación. Nada se ha subido a `origin`.
