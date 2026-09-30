# Aceptación al adaptar el modelo

Aplicar solo filas de módulos seleccionados. Verificación nueva en el proyecto destino; la evidencia
histórica no certifica otra marca, otro arte, otra versión de librería o navegador.

| Superficie | Comprobación observable |
|---|---|
| Composición | Un H1, secuencia legible, anclas únicas/válidas, CTA principal y orden móvil coherente. |
| Jerarquía | Contrastar título/subtítulo/cuerpo/UI; fuentes cargadas y fallback legible; títulos largos sin recorte. |
| Breakpoints | Desktop1440, móvil390 y límites relevantes600/760/900/960/1100/1280 ±1px; sin overflow accidental. |
| Menú | Abrir/cerrar, Escape, subenlaces, scroll/foco, no cubrir anchor bajo header. |
| Programa | Botones/swipe/teclado sincronizan indicador y altura; filas/fechas correctas. |
| Cubo | Índice/leyenda coherentes, drag/flechas, n0/1/muchos, pausa tras interacción, reduce y resize. |
| Baraja | Expandir, deslizar sin abrir ficha, idle5s con guardas; acciones accesibles en reposo. |
| Ficha | Imagen/click/teclado; blur; flip con reverso; cerrar/X/Escape/fondo; restaurar foco y scroll; fullscreen móvil. |
| Film | Deriva/drag/pausa, apertura tap y teclado, visor no recortado, cierre, no activación en fade invisible. |
| Partners | Hover/foco pausa; drag no navega; enlaces reales y sin focos duplicados. |
| Video | Seek, muted autoplay permitido, pausa manual, fullscreen/PiP según soporte, fold/unfold sin salto; error/poster. |
| Foto/3D | Sin seam gris ni texto sobre ruido; sujeto/cutout alineados, GLB anclado tras resize, fallback si no WebGL. |
| Footer | Legibilidad sobre imagen; gesto teclado y puntero; móvil sin escena 3D; enlaces/créditos del destino. |
| Rendimiento | Motores visibles únicamente, RAF/listeners/GSAP/texturas liberados al desmontar; motion no reinicia página. |
| Contenido/medios | Ningún asset faltante, srcSet/ratio/alt correctos, derechos, sin enlaces o nombres del negocio anterior. |
| Build | TypeScript + check de contenido + export estático; errores de consola/red de medios revisados. |

Documentar qué se probó en navegador real, qué solo en emulación y qué quedó como lectura de fuente.
Capturar móvil, Acoge y reverso en la siguiente validación visual si forman parte de la entrega nueva.
