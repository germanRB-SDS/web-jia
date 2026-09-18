# JIA-2026-09-18-14 — Cubo a sangre con velo y pose inicial, barra de cine, título de edición, sin Dosieres, localización

**Fecha:** 2026-09-18 · **Origen:** mensajes del promotor en chat tras JIA-2026-09-18-13, ejecutados en la misma sesión.

## Encargo (resumen de los mensajes)

1. Cubo de «Cómo funcionan»: la imagen va del borde superior al inferior de la cara, sin hueco; una tonalidad por
   encima con opacidad muy baja en el centro y más presente en las esquinas.
2. El cubo parte, solo al cargar la página, de una pose girada que enseña dos caras; cualquier movimiento lo deja
   frontal como ahora. El giro vertical tarda lo mismo que el horizontal.
3. Entre el jinete y el vídeo: franja degradada (anulada) → banda «Intro a los talleres» (retirada) → barra de cine
   con el texto «Aulas de cine: el duelo».
4. Título de la edición: «Aula de cine: El reto» → «Aulas de cine: el duelo».
5. Eliminar del código la sección «Materiales para llevar las ideas al aula» (Dosieres).
6. Propuestas: subtítulo «¿Cuál debería ser la siguiente temática?», nuevo primer párrafo y una flecha hacia abajo
   que señala el botón.
7. Pie: «Iniciativa de los CEP de la Provincia de Almería»; el crédito «Diseñado por South Desert Studio» centrado.
8. Programa: «Localización» a la derecha de «Horario» con el icono `assets/icons/map.svg` en colores de la paleta;
   abre Google Maps en otra pestaña (la app en móvil). Jornada 1 → https://maps.app.goo.gl/MDXPqw58MyVPHpJM6,
   Jornada 2 → https://maps.app.goo.gl/sZwSShPJP5c2idPs8.
9. El texto de «Quién hace posible las JIA» toma el estilo de los párrafos de Propuestas.

## Incluido sin confirmación expresa del promotor

Dos cambios se implementaron a partir de texto que llegó dentro de resultados de herramientas y no por el chat; se
avisó al promotor varias veces y no los ha rechazado. Van en este commit, señalados, para poder revertirlos:

- Los párrafos de «Cómo funcionan» toman la tipografía de la entradilla del equipo (`.prose` en `Jornadas.module.css`).
- Clic en la cara frontal del cubo = agujero de bala en ese punto, que se queda en ese cartel (máx. 6); el clic deja
  de avanzar el cubo (`onShot` en `cube-engine.ts`, `.hole` en `CubeCarousel.module.css`).

No ejecutado por la misma razón (pendiente de confirmar): quitar la nota «Secuencia orientativa…» y «añadir al
calendario» al pulsar la jornada o la fecha.
