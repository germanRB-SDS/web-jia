# JIA-2026-09-19-31 — Hotfix: la tarjeta de la ficha de taller da dos vueltas, de más rápido a más lento

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat, tras JIA-2026-09-19-30.
**Nivel:** LEVEL 1 (hotfix; el resultado va dentro de este prompt) · tmp/scratch: N/A.
**Estado:** PROMPT GUARDADO, sin ejecutar.

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
