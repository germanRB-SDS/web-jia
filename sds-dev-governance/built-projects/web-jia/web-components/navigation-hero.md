# Navegación, hero y enlaces

[Capturas 01–03](../project-screenshots/README.md) · [escala tipográfica](../STYLE-GUIDE.md).

## menu

Owner: [SiteHeader](../project-skeleton/reference/components/site/SiteHeader.tsx),
[SiteNav](../project-skeleton/reference/components/site/SiteNav.tsx) y CSS homónimos.
Header de 4.25rem mínimo, fondo papel al 92%, blur10px y regla inferior; z20.
Marca separada por línea vertical del nombre de tres líneas; badge de 2.75rem. Las etiquetas
vienen de nav/copy, no de las vistas. En desktop, los hijos son un submenú con hover/focus y botón
independiente `aria-expanded`; el enlace padre conserva su acción. En móvil son enlaces bajo el
padre dentro del panel.

Bajo960px: header fijo con safe-area y espaciador que evita salto; panel vertical de altura de
viewport restante. Botón con texto/icono cambia abierto/cerrado; Escape y navegación cierran;
se restaura overflow previo. No describirlo como diálogo con focus trap: la fuente usa nav y lista.
Validar tabulación y foco al adaptar o convertirlo en modal.

## hero

Owner: [Hero](../project-skeleton/reference/components/site/Hero.tsx) y CSS. Props: modelo hero,
brand, markLabels y showMarks. Tiene marca ilustrada accesible, sello, regla, título, dateline,
lede y acciones; la foto se resuelve mediante Surface. Mantener metadata aparte de la composición.

Escritorio ≥960px: altura mínima `min(75vh,770px)`; texto usa padding-right56% (52% ≥1400px),
foto66% a la derecha. No forzar esta geometría con textos más largos: comprobar solapes de CTA.
Móvil: fotografía4:3 debajo del texto, fundida arriba; acciones wrap. Entradas escalonadas700ms,
foto se revela2200ms y luz2600ms. Reduced motion presenta el estado final.

Al reutilizar, conservar espacio negativo junto al texto, no solo el sujeto. Cambiar una imagen
puede exigir cambiar máscara y focal. No incrustar título/CTA dentro de una imagen.

## waypoints

Owner: [Waypoints](../project-skeleton/reference/components/site/Waypoints.tsx) y CSS.
Lista variable; cada entrada tiene ID, label, descripción, destino e icono. Rótulo superior1rem,
título1.125rem, descripción.9375rem; mínimo72px por enlace. Desktop1100px reparte iguales;
640–1099px usa auto-fit mínimo16rem; móvil filas. Hover/focus fondo arena + flecha4px.
Al reducir navegación a otra receta, retirar destinos inexistentes también aquí.
