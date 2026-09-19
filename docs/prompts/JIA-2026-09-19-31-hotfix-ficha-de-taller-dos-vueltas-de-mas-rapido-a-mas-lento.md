# JIA-2026-09-19-31 — Hotfix: la tarjeta de la ficha de taller da dos vueltas, de más rápido a más lento

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat, tras JIA-2026-09-19-30.
**Nivel:** LEVEL 1 (hotfix; el resultado va dentro de este prompt) · tmp/scratch: N/A.
**Estado:** EJECUTADO (2026-09-19); resultado al final.

## Encargo (palabras del promotor)

«En la ventana popup que contiene la imagen de los talleres, dicha imagen gira. Que dé **dos vueltas yendo de más
rápido a más lento**. La **primera vuelta la completa en 1,3 s** (y **cuando se ve la parte de atrás se ralentiza
adicionalmente un poquito más** para continuar con su velocidad de giro). La **segunda vuelta es más lenta,
completándose en 2,0 s**.»

## Cómo

- Solo `components/flip-card/` (`config.ts`, `flip-card.ts`, comentarios de `FlipCard.tsx`). Sustituye al giro de
  JIA-30 (reverso → frontal en 900 ms + segundo giro de 1,2 s con parada de 0,1 s).
- Dos vueltas completas (720°) en el mismo sentido que hasta ahora, 3,3 s en total, con **velocidad continua y siempre
  decreciente** de principio a fin (sin tirones entre una vuelta y otra), salvo el **freno suave al pasar por el
  reverso en la primera vuelta** (una bajada de velocidad, no una parada), y llegada suave al frontal.
- Supuesto del ejecutor: para que dos vueltas enteras terminen en el frontal —y para que el reverso «se vea» a mitad
  de la primera vuelta— la tarjeta **sale del frontal** (antes salía del reverso). Al cerrar vuelve al frontal sin
  animar. El sello se ve dos veces: frenado en la primera vuelta y despacio en la segunda.
- Todo en `config.ts`: duración de cada vuelta, cuánto y durante cuánto frena en el reverso, forma de la segunda vuelta.
- Sin cambios: posición y tamaño finales, inclinación posterior hacia el puntero, movimiento reducido (frontal quieto).
- Verificación: `tsc`, `check:content`, `next build`, Chrome por CDP a 1440 muestreando el ángulo por fotograma:
  vuelta 1 ≈ 1,3 s, vuelta 2 ≈ 2,0 s, velocidad decreciente con el freno en ≈ 180°, caja final idéntica.

## Resultado (2026-09-19)

- `flip-card.ts`: el giro ya no es una cadena de tramos con su «ease», sino una **tabla de ángulos** (cada 5 ms)
  calculada una vez a partir de la velocidad: en la 2.ª vuelta la velocidad es V·(1 − u³) (V = 240 °/s, acaba en 0); en
  la 1.ª baja en línea recta hasta esa misma V —así no hay tirón entre vueltas— menos un **freno gaussiano** centrado
  en el instante en que el reverso queda de frente (30 % menos de velocidad, ≈ 13 % de la vuelta). La velocidad inicial
  sale sola (bisección) para que la vuelta sean 360° exactos. Un único tween de GSAP recorre la tabla.
- `config.ts` → `turns`: `firstMs: 1300`, `backDip: { depth: 0.3, spread: 0.13 }`, `secondMs: 2000`, `secondHold: 3`.
- La tarjeta **sale del frontal** y termina en el frontal (supuesto anunciado arriba); al cerrar, frontal sin animar.
- Medido en Chrome (CDP, 1440) muestreando el ángulo por fotograma: **180° a 581 ms, 360° a 1285 ms**, 540° a 2052 ms,
  720° a ≈ 3,3 s. Velocidad (°/s, ventanas de 200 ms): 309 → **232 (freno en el reverso)** → 248 → 269 → 256 → 242 │
  240 → 238 → 232 → 223 → 209 → 184 → 154 → 113 → 58 → 6. Caja final 264 / 223,69 / 320 / 452,61 y `transform`
  identidad: igual que antes. Consola limpia. `tsc`, `check:content` y `next build` en verde.
- Evidencia: `docs/prompts-output/JIA-2026-09-19-31/evidence/ficha-taller-dos-vueltas-1440.png`.
- Riesgo menor: 3,3 s de giro antes de que el cartel quede quieto es largo para quien abre varias fichas seguidas;
  el texto de la ficha se lee desde el primer instante y con movimiento reducido no hay giro. Si cansa, bajar
  `secondMs` en `config.ts`.
