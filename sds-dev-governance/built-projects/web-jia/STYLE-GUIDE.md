# Guía de estilo — web-jia

Referencia visual y de implementación; cifras tomadas de CSS, no estimadas a partir del zoom
de las capturas. El origen exacto es [globals.css](project-skeleton/reference/app/globals.css),
[palette.css](project-skeleton/reference/app/theme/palette.css) y los CSS Modules de cada bloque.

## Jerarquía tipográfica

Valores en rem; equivalencia px solo con raíz de 16px. Conservar relaciones al cambiar familias.

| Papel | Familia y tratamiento | Escala / interlínea | Efecto editorial |
|---|---|---|---|
| Títulos H2 | Rokkitt, 700, mayúsculas, tracking habitual .02em | `clamp(2.125rem, 4.4vw, 3.5rem)`; 1 aproximadamente (34–56px) | Ancla de cada banda; 2–3 veces el cuerpo. |
| H3 / etiqueta de margen | Rokkitt 700, mayúsculas, .04em | `clamp(1.375rem, 2.2vw, 1.75rem)`; 1 | Encabezado de spread con regla terracota de 3px. |
| Hero, nombre de edición | Alegreya cursiva, 500 | `clamp(1.5rem, 2.8vw, 2.25rem)`; 1.15 | La marca ilustrada tiene más peso visual que el título tipográfico. |
| Subtítulos | Alegreya cursiva, 500 | `clamp(1.375rem, 2.4vw, 1.875rem)`; 1.25 | Segundo nivel expresivo; no confundir con metadatos. |
| Cuerpo | Alegreya normal | 1.0625rem, 1.125rem desde 960px; 1.6 | Lectura cálida, líneas de hasta 62ch. |
| Entradillas | Alegreya | `clamp(1.125rem, 1.5vw, 1.375rem)` | Separa la promesa principal del detalle. |
| Navegación y acciones | Barlow Semi Condensed 500/600, mayúsculas, .12em | 0.8125–1rem según componente | Compacta; botón con altura útil, no solo letras grandes. |
| Fechas y metadatos | Barlow Semi Condensed; fecha larga de programa en Alegreya cursiva | Etiquetas .7rem; valores 1rem; fecha 1.25rem; horas tabulares .875rem | Metadatos estructurados, escaneables. |
| Pizarra decorativa | Homemade Apple 400 | 1.28cqw dentro del marco fotográfico | Se registra en la foto; no sustituye ningún texto accesible. |
| Marca JIA | SVG de lettering | Alto hero `clamp(6rem,13vw,10.5rem)` | No es una quinta fuente de texto. |

Host tiene una variante H2 de 2.25–4rem; las jornadas del programa 1.5–2.125rem. No normalizar
estas diferencias ciegamente. Mantener un H1 semántico, H2 por área y H3/H4 subordinados al recomponer.
Las familias se cargan con next/font y display swap; ver [stack](server-config-info/STACK-I18N.md).

## Color, superficie y ritmo

| Token | Valor de referencia | Papel |
|---|---|---|
| `--jia-paper` | #f1e7d8 | Papel principal. |
| `--jia-ivory` | #f6eedf | Luz y texto claro sobre fondos oscuros. |
| `--jia-ink` | #2f180b | Titulares, footer y superficies oscuras. |
| `--jia-text` | #443d37 | Prosa. |
| `--jia-text-muted` | #71604d | Metadatos secundarios. |
| `--jia-terracotta` / deep | #89482e / #703923 | Acciones, reglas, estado activo. |
| `--jia-line` | #c9b79f | Separación decorativa fina. |
| `--jia-dune` | #c0ac94 | Velo cálido de la sección Jornadas. |
| `--jia-card` | #eee3d1 | Pergamino de fichas. |

La paleta completa conserva RGB auxiliares, gradientes y niveles vellum. Al cambiar marca, remapear
roles completos, incluidos RGB y colores de sombras/canvas. Los exports neutros usan `--wc-*`;
no mezclar ambos espacios sin su mapa de integración.

- Contenedor máximo 80rem; gutter `clamp(1rem,4vw,3.5rem)`.
- Espacio de sección `clamp(4rem,9vw,7.5rem)`; los subbloques tienen su propio ritmo.
- Desde 900px, spread con margen de 200px y separación 2–4rem; etiqueta sticky a 5.5rem.
- Líneas finas agrupan; las tarjetas se reservan para contenido que realmente es una ficha.
- Radio de botón 4px, de tarjeta 10px. Imágenes de bandas a sangre sin redondeo.
- Grano SVG sutil en capa separada; no aplicar ruido ni filtros destructivos a texto o controles.
- CTA principal: material cálido con relieve y brillo móvil; secundario: borde de tinta.
  [Patrón portable leather-shimmer](../../resources/frontend-patterns/ui-components/button-leather-shimmer/INDEX-AND-HOW-TO-USE-THEM.md).

## Gramática de fotografía y capas

1. **Disolución orgánica:** hero, foto derecha hacia papel izquierdo; máscara SVG de ruido/fractal,
   rampa alfa y borde desplazado. En móvil se convierte en transición superior, no en miniatura del desktop.
2. **Velo ligado al texto:** Jornadas y Host. El color sólido debe llegar antes de las letras;
   en Host depende de la geometría real de la columna, no de un porcentaje arbitrario.
3. **División recta:** Propuestas, 47/53. No añadir fundido si se ha seleccionado este módulo.
4. **Profundidad por capas:** aula = foto + rótulo + rayos + recorte de la misma persona + contenido.
   Fondo y cutout deben compartir ratio/focal/encuadre exactamente; una foto distinta no sirve de oclusor.
5. **Foto + campo 2D + objeto 3D:** footer. Imagen anclada al poste, máscaras horizontales y verticales,
   velo oscuro para lectura y marcador DOM de anclaje del GLB. La captura muestra foto a la derecha y
   tinta hacia la izquierda; el patrón admite invertirlo. «Desdibujado 2D» aquí es máscara/velo CSS,
   no prueba de que exista una segunda ilustración pintada. [Receta general](web-components/photo-composition.md).

Registrar siempre origen, dimensiones, ratio, punto focal, dirección del espacio negativo, recortes
por breakpoint, seam superior/inferior, sujeto/objeto que no debe taparse y marcador 3D. Conservar
foto, recorte alfa, máscaras, texturas y GLB por separado. [Medios](server-config-info/MEDIA.md).

## Responsive: conservar decisiones, no escalar una captura

| Umbral observado | Decisión |
|---|---|
| 420px | Oculta el nombre pequeño de marca en cabecera. |
| 600px | Ruta 3D cambia a geometría alta. |
| 640px | Enlaces rápidos admiten auto-fit de columnas de 16rem. |
| 760px | Programa pasa de carril móvil a columnas; talleres de baraja a grid; vídeo puede plegarse. |
| 900px | Spreads con margen; foto/texto laterales; cabecera de colaboradores en dos columnas. |
| 960px | Menú completo y hero lateral; cuerpo crece a 18px. |
| 1100px | Enlaces rápidos en una fila; se admite herradura 3D. |
| 1280px | Aula lateral a sangre y altura compartida con Propuestas. |

Hay pequeños límites decimales de media query en las fuentes; conservarlos al copiar código.
Comprobar anchos cercanos a cada transición, títulos largos y orientación horizontal, no solo 390/1440px.

## Movimiento y acceso

Easing general `cubic-bezier(.16,1,.3,1)`. Diferenciar entrada única, drift continuo e interacción:
ningún hover puede ser la única vía al contenido. Ofrecer tap/click y teclado. Las acciones
completas se describen en cada ficha, incluidos tiempos, pauses, lifecycle y reduced motion.
La política de consentimiento/Apple de JIA es específica: no trasladarla como norma de otras webs.
Los exports portables siguen la preferencia de movimiento del sistema.

Las capturas prueban apariencia en un instante. Los eventos descritos se contrastaron con el código;
la cobertura de ejecución se registra aparte en [VALIDATION](metainfo/VALIDATION.md).
