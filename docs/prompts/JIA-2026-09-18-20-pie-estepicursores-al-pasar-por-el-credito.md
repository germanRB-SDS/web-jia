# JIA-2026-09-18-20 — Pie: estepicursores que cruzan la franja del crédito mientras se pasa el ratón por él

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat. **Nivel:** LEVEL 2.

## Encargo

Una animación de estepicursores (plantas rodadoras) en la franja inferior del pie, la que contiene el logotipo y
«Diseñado por South Desert Studio». Aparece mientras el ratón está sobre el crédito (la imagen, «Diseñado por» o
«South Desert Studio»).

## Comportamiento

- **Tecnología:** GSAP (ya es dependencia y se carga bajo demanda). Son unos pocos elementos 2D que ruedan: three.js
  no aporta nada aquí y costaría un canvas WebGL más.
- **Disparo:** al entrar el ratón (o el foco de teclado) en el enlace del crédito sale el primero; mientras siga
  encima, el siguiente sale tras una espera aleatoria de **2 a 5 s**. Al salir el ratón no nacen más; los que ya
  ruedan terminan su recorrido.
- **Dirección:** siempre horizontal, de izquierda a derecha, de fuera a fuera de la franja.
- **Rodar y saltar:** giran lo que avanzan (rodadura real: ángulo = distancia / radio) y, de vez en cuando, dan un
  saltito, como al tropezar con un guijarro: altura proporcional a su tamaño, caída con un rebote corto.
- **Profundidad:** cada uno nace a una profundidad aleatoria. Cuanto más al fondo, más arriba en la franja, más
  pequeño, más lento y más tenue. Topes: la base de un arbusto nunca está por encima del **70 %** de la altura de la
  franja (medida desde abajo); en primer plano mide como máximo el **80 %** de la altura del logotipo del estudio, y
  al fondo como máximo el **15 %**.
- **Varios a la vez:** sí; velocidad, tamaño y profundidad cambian de uno a otro. Tope de seguridad de elementos vivos.
- **Dibujo:** SVG generado por código (maraña de ramas dentro de un círculo), en tonos de la paleta sobre la tinta del
  pie. Ninguno es igual a otro.
- **Capa:** decorativa (`aria-hidden`, sin eventos de puntero), por detrás del enlace; el enlace sigue funcionando igual.
- **Movimiento reducido:** con `prefers-reduced-motion` no hay animación. En pantallas táctiles (sin hover) no aparece.

## Verificación

Medir en navegador real (Chrome DevTools Protocol): con el ratón sobre el crédito nace uno de inmediato y otro entre
2 y 5 s después; tamaños ≤ 80 % del logotipo; bases ≤ 70 % de la franja; x siempre creciente; al salir el ratón dejan
de nacer y la capa queda vacía al terminar. `tsc`, `check:content`, `next build`.
