# Dos variantes foto/texto

## División recta · split-hard

[Proposals](../project-skeleton/reference/components/site/Proposals.tsx) + CSS + Section + Surface
+ Action. En escritorio≥900px, texto a la izquierda y foto absoluta de53% a la derecha, separación
recta al47%. Fondo sólido, H2 dominante, subtitle cursiva, prosa, pista con flecha y CTA.
Desde1280px, mínimo de banda `100vw / --jia-band-aula-ratio` para emparejar Experiencias.
No copiar esa relación si el bloque vecino cambia. Foto object-fit/focal desde media registry.

En móvil la imagen se coloca tras el título y antes de prosa/CTA, para que la sección cierre con
palabras antes de otra banda fotográfica. [Captura12](../project-screenshots/12-propuestas-corte-recto.png).

## División con velo · split-soft

[Host](../project-skeleton/reference/components/site/Host.tsx) + CSS + Surface/Action. Fotografía
ocupando el fondo; columna derecha máx28rem; altura desktop `min(82vh,820px)` más padding propio.
Título slab2.25–4rem, line-height.98; subtitle cursiva del token; cuerpo1.6.

La rampa opaca está calculada a partir del inicio de la columna. Seis stops eased a lo largo de12%
antes del borde, color del vellum también en transparencia: evita un seam gris o texto sobre polvo.
Capas adicionales unen suelo superior e inferior. Bajo900px foto16:9 relativa y texto apilado,
sin velo lateral. No se aportó screenshot específico: se conserva fuente y medios en el snapshot.

Ambas variantes son slots de composición. Pueden ser alternativas para el mismo contenido o
convivir con funciones distintas. No duplicar dos CTAs idénticos solo por utilizar ambas.
