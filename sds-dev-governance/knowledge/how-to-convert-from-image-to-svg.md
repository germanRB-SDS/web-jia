# Convertir una imagen en SVG con Potrace

La herramienta se llama **Potrace**, no «Potrage». La usamos para vectorizar la firma/logo
de **Maryna Ventura** el 12 de septiembre de 2026. ImageMagick preparó el raster y Potrace
generó curvas reales. Este recuerdo se recuperó de las evidencias del proyecto y se contrastó
con sus archivos el 13 de septiembre de 2026; no se ha vuelto a procesar el logo para escribirlo.

## Herramientas locales

En el Mac consultado están instalados con Homebrew **Potrace 1.16** (incluye `mkbitmap`)
e **ImageMagick 7.1.1-47** (`magick`). Se comprobó la instalación y el recibo de Potrace,
sin instalar ni actualizar paquetes. No fijar `/opt/homebrew` en scripts portables: resolver
los comandos desde PATH. En otro equipo, comprobar primero:

```bash
command -v potrace magick mkbitmap
potrace --version
magick -version
```

Si faltan y está autorizada su instalación en ese equipo:

```bash
brew install potrace imagemagick
```

Potrace acepta PBM/PGM/PPM/BMP y produce, entre otros formatos, SVG. No recibe directamente
el PNG/JPEG habitual: primero se convierte a un formato de entrada. Traza las formas de un
bitmap binario o convertido a blanco/negro; no reconstruye semánticamente un logo multicolor
o una fotografía. [Documentación de Potrace](https://potrace.sourceforge.net/).

## Qué hicimos con Maryna Ventura

1. Conservamos el original sin modificar: `docs/prompt-images/logo-mv-original.png`.
   Aunque el encargo lo llamaba JPG, los bytes eran **PNG RGBA, 622 × 106 px**, 32.987 bytes.
2. Preparamos un PGM en escala de grises con ImageMagick: ampliación **4× con Lanczos**
   y suavizado de baja frecuencia **sigma 1,8** en la imagen ampliada, equivalente a
   unos **0,45 píxeles originales**. No se dilató la tinta.
3. Comparamos variantes de umbral y curvas. Potrace 1.16 quedó con:

```text
--blacklevel 0.30 --turdsize 8 --alphamax 1.0 --opttolerance 0.35 --unit 10
```

4. Normalizamos el SVG manteniendo las proporciones originales: `viewBox="0 0 622 106"`,
   un contorno real dentro de `g id="signature"`, fondo transparente y `fill="currentColor"`.
   Se eliminaron dimensiones CSS fijas y metadatos innecesarios, sin incrustar un bitmap.
5. Inspeccionamos comparación original/render, superposición cian/magenta, extremos finos,
   cruces, huecos y tamaño real de uso. La evidencia histórica registró RMSE normalizado
   **0,0707976**, que no equivale a un porcentaje de fidelidad perceptiva.

El resultado negro se conserva como `public/brand/logo-mv-black.svg`: **5.262 bytes**.
Su SHA-256 observado sigue siendo
`9eabec495d0ab3bd5e475eccc8bf6994f04511454c8639f35d1464e312bc8be7`.
Original: `20003cb5f29699d85c39d5918a68b6de2dba5815b154a280885267bcc85bc6f1`.

## Receta reproducible a partir de esos parámetros

Este bloque reconstruye el flujo documentado; no es una transcripción de un comando
histórico completo ni promete el mismo hash con otras versiones. Usar la raíz del proyecto,
conservar el original y escribir a una carpeta nueva. Para una firma clara sobre oscuro,
preparar antes una copia con tinta oscura sobre fondo blanco; no invertir por defecto.

```bash
SDS_LOGO_INPUT="$PWD/docs/prompt-images/logo-mv-original.png"
SDS_VECTOR_DIR="$(mktemp -d "$PWD/.vectorization.XXXXXX")" && \

magick "$SDS_LOGO_INPUT" \
  -background white -alpha remove -alpha off \
  -colorspace Gray -filter Lanczos -resize 400% -blur 0x1.8 \
  "$SDS_VECTOR_DIR/logo-4x.pgm" && \
potrace --svg \
  --blacklevel 0.30 --turdsize 8 --alphamax 1.0 --opttolerance 0.35 --unit 10 \
  --output "$SDS_VECTOR_DIR/logo-raw.svg" -- "$SDS_VECTOR_DIR/logo-4x.pgm" && \

printf 'Intermedios y SVG para revisar: %s\n' "$SDS_VECTOR_DIR"
```

No pasar `--tight` si se quiere mantener el lienzo y encuadre originales. `mkbitmap` es otra
opción de preprocesado, pero **no fue la elegida en esta conversión**. No aplicar a ciegas
un threshold más agresivo: puede borrar remates finos o cerrar huecos.

## Normalización para uso web

La geometría salió de un raster ampliado 4×. Cambiar solo el `viewBox` sin ajustar el
transform puede recortar o deformar el resultado. El SVG negro final utiliza exactamente:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 622 106">
  <g id="signature"
     transform="translate(0.000000,106.000000) scale(0.025000,-0.025000)"
     fill="currentColor">
    <!-- Conservar aquí el path completo generado por Potrace. -->
  </g>
</svg>
```

El factor 0,025 corresponde a la unidad 10 de Potrace y a deshacer la ampliación 4×
en este caso. Descubrir las dimensiones y transforms para otra imagen; no copiar 622/106
universalmente. No reescribir manualmente la geometría si solo se quiere cambiar el color.
`currentColor` sirve al insertar el SVG inline; una imagen cargada con `<img>` no hereda
automáticamente el `color` CSS del elemento padre. La variante blanca utiliza color explícito.

## Refinamiento posterior del SVG blanco

El propietario creó una versión blanca manual, inicialmente de **7.815 bytes**. Más tarde
se retrazó esa geometría a 4×, con gris/suavizado gaussiano **sigma 2,4** (0,6 píxeles
de origen), sin dilatación y con estos parámetros:

```text
--blacklevel 0.5 --turdsize 8 --alphamax 1 --opttolerance 0.8 --unit 10
```

La versión blanca final pesa **2.292 bytes**, mantiene el viewBox 622 × 106, `id="signature"`
y un path de relleno blanco. SHA-256 observado:
`f3815822383fdd245e5c66edccb18d4326406fac45df4ba13859af7374b449fb`.
El blanco anterior se conserva en el proyecto en
`docs/prompts-output/[07-8]/evidence/smoothing/logo-mv-white-before.svg`.
La firma negra y el raster original no se sustituyeron. El ajuste aceptó un ligero redondeo
de terminales a cambio de menos microirregularidades; no convertirlo en preset universal.

## Verificación que importa

- SVG con `<path>` real: sin `<image>`, data URI ni bitmap embebido bajo una extensión SVG.
- Lienzo, proporción, huecos/cruces y remates preservados; comparar ampliado y al tamaño real.
- Fondo transparente y color correcto; sin filtros de desenfoque usados para ocultar errores.
- XML válido y original intacto; guardar parámetros/versiones y evidencia de la selección.
- Potrace produce el **contorno de la tinta**, no el eje ni el orden de escritura. La animación
  de la firma de Maryna se resolvió aparte con guías/máscaras; no viene incluida en vectorizar.

Fuentes de memoria dentro del proyecto `maryna-ventura` (rutas relativas a ese proyecto):

- `docs/prompts-output/[07-8]/evidence/vectorization.md`: trazado original y parámetros.
- `docs/prompts-output/[07-8]/README.md`, sección «Contour refinement»: actualización blanca
  que sustituye las cifras históricas posteriores del mismo informe.
- Los tres archivos de origen/resultado mencionados arriba: hashes y tamaños comprobados.

El kit conserva la receta, no copia los activos del cliente ni necesita que su repositorio
esté presente para entenderla. Consultar los manuales locales `man potrace` y `man mkbitmap`
para otras opciones. Convertir con estas herramientas es procesamiento local: no requiere
llamadas al modelo; redactar/revisar el trabajo del agente sí consume su contexto habitual.
