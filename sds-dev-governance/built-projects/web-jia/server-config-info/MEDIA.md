# Assets necesarios para conservar y reutilizar

**Se conserva:** todo public servido por la revisión (fotografías optimizadas, SVG, carteles, logos,
frames/manchas de film, máscaras/cutout, poster/MP4 web y GLB), código/CSS/tokens y las fuentes Blender
seleccionadas. [Manifiesto de archivos y SHA-256](../metainfo/source-manifest.json).
**Se excluye:** node_modules/builds, originales pesados de fotos/vídeos, backups .blend1 y renders
de autoría. Los derivados bastan para reconstruir esta página; no para reeditar los originales a
resolución arbitraria. Las capturas se guardan separadas e intactas.

| Módulo | Paquete visual dentro de reference | Metadatos que no deben perderse |
|---|---|---|
| Menu/hero | public/brand, public/hero | Proporción de lettering/sello, variantes, máscara orgánica y focal. |
| Jornadas | public/jornadas, assets/3d/carruaje | Fondo, sello, GLB, .blend, generador/config y contrato de nodos/ejes. |
| Video | public/jornadas/intro | MP4 optimizado, poster, aspect/maxHeight/type; duración real la aporta el vídeo. |
| Programa | public/programa | Icono opcional, reloj y zona horaria en config/datos. |
| Cube | public/cubo | Portrait ratio1414/2000, variantes420/800, IDs/títulos/roles/copy; no GLB. |
| Cards | public/talleres | Carteles560/1000, relación con taller, alt, reverso/sello, disponibilidad de dosier. |
| Film/experiencias | public/experiencias | Frame/manchas, geometría ventana, carteles, aula y recorte alineado. |
| Split-hard/soft | public/propuestas, public/acoge | Encuadres y destino del CTA; hard47/53 frente a soft con velo. |
| Partners | public/colaboradores | Imagen por entidad, nombre/enlace y aria para copias repetidas. |
| Footer | public/footer, assets/3d/herradura | Foto/poste, marcador DOM, GLB/.blend/generador, cámara/luz y config del gesto. |

La fuente de procedencia/licencia de cada medio se mantiene en media.ts. El archivo histórico puede
contener referencias a originales que no se incluyen; no es un enlace de runtime. No prometer que
`npm run assets` regenerará sin esos originales. Usar derivados archivados o un pipeline propio.
Los generadores Blender son referencia de autoría y pueden exigir adaptación a la versión instalada.

Las imágenes del evento, nombres, logos y vídeo se conservan como evidencia de esta referencia por
petición del propietario. No son un paquete de stock con permiso universal para otras marcas.
En una nueva web sustituirlos por medios autorizados del negocio. Para componentes sueltos, las
fixtures neutrales de resources permiten validar funcionamiento sin depender de personas/logos JIA.
