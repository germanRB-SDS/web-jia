# Extraer componentes interactivos sin perder lo que los hace funcionar

Receta descriptiva de web-jia, 2026-09-29. Cargar sólo al reutilizar UI interactiva o exportar
componentes. No cambia normas SDS ni impone Next/GSAP al siguiente proyecto.

## Encontrar el recurso

- [Quiénes somos / carrusel y tilt](../../resources/web-components/collaborators-carousel/INDEX-AND-HOW-TO-USE-THEM.md).
- [Tira de cine / hover y visor](../../resources/web-components/film-reel/INDEX-AND-HOW-TO-USE-THEM.md).
- [Cubo de imágenes](../../resources/web-components/cube-carousel/INDEX-AND-HOW-TO-USE-THEM.md).

Pedir cualquiera de esos nombres permite recorrer el índice de resources y cargar sólo su hoja.
Cada hoja lleva código, soporte local, configuración, tokens, contratos de datos, demo, lock,
fixtures, procedencia y evidencia. No hace falta volver a web-jia para arrancar la demo.

## Lo que aprendimos construyendo esta web

1. **Datos → ensamblador → componentes.** `lib/content/index.ts` agregaba datos de negocio;
   `assemble.ts` construía modelos de vista; `copy/` contenía español; `media.ts` contenía variantes,
   ratio y foco; `palette.css` poseía los colores. Exportar el shape del modelo, no el catálogo real
   ni el ensamblador completo. En el ejemplo reutilizable, `demo/app/content.ts` cumple ese límite.
2. **Motor separado de React.** React posee contenido/selección; el motor imperativo escribe
   transforms y variables CSS. Evita rerender por cada píxel y permite limpiar RAF, observers,
   listeners y GSAP al desmontar. Imports dinámicos comprueban cancelación tras await.
3. **Movimiento como autoridad compartida.** El original combina preferencia, aceptación y cookie.
   Eso es una decisión de producto, no requisito del carrusel: la exportación usa el sistema.
   Al adoptar, JS y CSS deben consultar la misma decisión. No copiar cookies ni excepciones Apple
   del origen por accidente. Una política local por componente no debe competir con la global.
4. **Infinito visual, finito accesible.** Repetir tarjetas para cubrir el viewport no significa
   repetir enlaces en el tabulador. Un juego real + copias aria-hidden; foco sobre contenido real
   debe traerlo a la zona visible. Durante drag se suprime el clic; pan-y deja desplazamiento vertical.
5. **Geometría medida, no posiciones a ojo.** En película, medir módulo y ventana en píxeles de la
   ilustración original, convertir a porcentajes y escalar el conjunto completo. El marco y el
   contenido comparten coordenadas; la imagen mantiene su proporción con contain. Las manchas
   pertenecen a otra capa inmóvil. Un cambio de piel obliga a revisar geometría y fade.
6. **Ampliación fuera del recorte.** El visor usa dialog/showModal y la top layer: overflow, máscaras
   y transform del carrusel no recortan el cartel ampliado. Reservar espacio para X y safe areas,
   bloquear scroll y devolver foco. Mouse-leave no debe usarse para cerrar en touch.
7. **Un cubo no necesita WebGL.** Seis planos CSS con preserve-3d/perspective bastan; GSAP controla
   giro/drag. Reasignar sólo caras ocultas permite n elementos sin crear n caras. El roll vertical
   necesita llevar su propio contador para conservar la secuencia al avanzar y retroceder.
8. **La capa de presentación también es una dependencia.** Tokens RGB, fuentes, tamaños, estilos
   globales, registro @property, iconos, Surface/Picture y tratamiento de null importan tanto como
   el archivo TSX principal. Una extracción sin ellos compila a veces pero no reproduce el resultado.

## Qué conservar y qué sustituir

Conservar código y parámetros con procedencia; ejemplos mínimos que arranquen solos; contrato de
medios, ratios y geometría; decisiones de teclado/touch/reduce; checks y capturas neutras.
Sustituir por configuración identidad, textos, enlaces, fotografías, logos, fuentes, preferencias
específicas de producto y política de cookies. Los recursos ajenos requieren permiso propio.

No confundir «funciona en la web original» con «exportación validada»: ejecutar el código extraído
con datos nuevos, sin aliases al origen, en escritorio y móvil, con reduce y rutas estáticas.
Tampoco confundir emulación con certificación en dispositivos físicos o lectores de pantalla.
