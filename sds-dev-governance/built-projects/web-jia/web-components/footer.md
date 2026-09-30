# Footer fotográfico con objeto interactivo

[SiteFooter](../project-skeleton/reference/components/site/SiteFooter.tsx) y
[CSS](../project-skeleton/reference/components/site/SiteFooter.module.css) son la composición;
[Horseshoe](../project-skeleton/reference/components/site/horseshoe/Horseshoe.tsx), scene/config y
GLB aportan la interacción. [Captura14](../project-screenshots/14-footer.png).

## Jerarquía

Fondo tinta, marca clara y descripción serif a la izquierda; columnas Secciones/Organiza/Colabora
con títulos UI espaciados y enlaces legibles. Reglas discretas y banda inferior de crédito de estudio
+ enlace adicional. Mantener relaciones legales/contacto de cada negocio; no inventar metadatos
que la referencia no contiene. Datos reales en modelo footer/brand/event/copy.

## Registro de la fotografía

La escena de establo se dimensiona con container units; CSS calcula posición del poste y máscara
horizontal, más velo vertical arriba/abajo y oscuro hacia zona de enlaces. Marcador
`data-horseshoe-post` identifica la cara iluminada del poste. El canvas ocupa banda pero no captura
puntero; solo el botón que sigue a la herradura es interactivo.

Móvil: imagen a240cqw, poste62cqw, centrada verticalmente y máscaras intersectadas horizontal/vertical.
El velo conserva opacidad sobre toda la lectura. La foto no se comprime proporcionalmente al desktop:
es otro encuadre. Columnas y crédito se apilan.

## Objeto 3D

Montaje solo≥1100px. GLB y .blend/generador de herradura en snapshot; tamaño share.5 acotado96–240px;
anclaje78% de la cara del poste; cámaraFOV20 y luz cálida/sombra transparentes.
Doble click (puntero) o Enter/Espacio (teclado) suelta el objeto; cae600ms, rebota dos veces, queda
erguido, espera5000ms y vuelve1200ms. **tipOver:false** en configuración final: un comentario histórico
del motor menciona tumbarse, pero no es el comportamiento habilitado. Returns:true.
Motion/visibilidad/ausencia de WebGL se resuelven en wrapper y motor; no deben quitar los enlaces.

FooterShots y StudioStrip/tumbleweeds son decoraciones adicionales separables. No convertirlas en
requisitos de todas las plantillas ni en una razón para cargar 3D en móvil.
