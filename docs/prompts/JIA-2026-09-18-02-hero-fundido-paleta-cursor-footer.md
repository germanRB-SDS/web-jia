# JIA-2026-09-18-02 — Fundido del hero, paleta de hover, cursor SDS y ajustes de footer

**Fecha:** 2026-09-18 · **Origen:** petición del promotor tras revisar la primera landing en localhost.

## Encargo (transcripción del promotor)

1. Mirar `assets/images-website/hero-3.png` para que el fundido de la imagen del hero sea como en esa
   imagen: **quitar el fundido inferior**; la fotografía llega hasta la línea horizontal de la siguiente
   sección. **Mantener el fundido por la izquierda.** Si existe un estilo que permita el degradado por
   la izquierda como se ve en el render, aplicarlo; si no, dejar el fundido actual.
2. Al hacer hover, el color de resalte es demasiado parecido al fondo: debe ser algún tono más oscuro,
   **sin pasarse**. Re-analizar y redefinir la paleta por si hay otro color que tocar. **No tocar** el
   fondo (`#f1e7d8` / `#f0e6d7`) ni la tinta JIA (`#2f180b`): están perfectos.
3. Los dos colores sólidos de las fichas de demostración (oliva y cobre) gustan: mantenerlos, sólidos o
   en variante acorde.
4. El puntero debe ser como el de `../south-desert-main-web/` (cursor y efecto hover), adaptando los
   colores a JIA.
5. Footer: quitar el texto «Boceto de trabajo…» y el enlace «Volver arriba». Cambiar «Centro del
   Profesorado de Almería» por «CEP de Almería». Mantener el estilo de «Secciones», «Organiza» y
   «Colabora» con dos puntos más de tamaño. Quitar la marca «provisional» de «Organiza» y «Colabora».
6. Guardar este encargo como prompt, ejecutarlo y hacer commit al terminar.

## Salida

`docs/prompts-output/JIA-2026-09-18-02/report.md`
