# [69-0] El carromato de «Las Jornadas», con su caballo, recorre el camino de «Programa» · informe

- LEVEL 2 · prompt `docs/prompts/[69-0]carromato-caballo-programa.md` · tmp/: N/A
- Commits: prompt `83008a5` · implementación `938a60b` · hotfix 1 `df9bb47`
- Rollback: `git revert df9bb47 938a60b`, o `programWagon: null` en `lib/content/sections/jornadas.ts` (las huellas
  y las rodadas siguen como en [68-0]).

## Resumen

- **Caballo en Blender** (`assets/3d/caballo/make-caballo.py`, Blender 5.2 headless, sin MCP): low-poly alazán con
  crin, cola y cascos oscuros, lucero, collera y cincha de cuero, y **dos varas de madera** (el miel del carromato) que
  llegan hasta el eje delantero del carro. Nodos articulados (cuerpo, cuello, cabeza, cola, muslo y caña de cada pata),
  sin animación horneada. 3 364 triángulos, 68 KB. Vistas previas junto al carro en `assets/3d/caballo/previews/`.
- **Escena** (`components/site/wagon-trail/vehicle-scene.ts`): el GLB del carromato de Jornadas sin tocar y el caballo,
  en una capa propia a opacidad plena, por encima de las huellas y por debajo del texto. Una unidad = 1 px de la capa.
- **Ancho**: el carro se escala para que su vía (1,52 m) mida exactamente las dos rodadas (42 px): 27,6 px/m. El camino,
  las rodadas y las herraduras no cambian.
- **Mismo reloj** que las huellas: el caballo va sobre el camino; el eje delantero, a la longitud de las varas (cuerda
  del camino) y el trasero, a la batalla. El carro gira el tren delantero hacia el caballo. `wheelLag` deja de ser
  90 px a mano y sale del modelo (2,1 m → 58 px): las rodadas se descubren justo bajo las ruedas.
- **Andar ≠ galope**: las patas siguen su propio ciclo (no pisada a pisada), ligado a la distancia: al paso cuatro
  tiempos, pasos cortos y cabeceo suave; en la parada se queda quieto, baja la cabeza y mueve la cola; al galope
  patas abiertas, lomo que balancea, cuello estirado y cola al viento. El cambio es progresivo en la rampa de arranque.
- **Vista oblicua** (`oblique: 0.5`): en cenital puro las patas quedaban ocultas bajo el cuerpo. El suelo sigue exacto
  al píxel (ruedas sobre las rodadas) y la altura se dibuja hacia arriba, así se ven las patas y el costado del carro.
- Sombra como en Jornadas (sol cálido, recogedor al 22 %), con el mapa de sombras siguiendo al carro.
- Sale por la derecha y la escena deja de dibujar. Si los modelos tardan más de 3 s, la pasada arranca sin ellos y el
  carro se incorpora en su punto del reloj. Sin WebGL o sin modelos: [68-0] tal cual. Movimiento reducido o < 760 px:
  no se carga nada.

## Verificación

tsc PASS · check:content PASS · next build PASS · Chrome real por CDP (SwiftShader):

- 1440: reloj del caballo frente a la máscara de las rodadas medido en la página (3,9 s: caballo 829 px, rodadas
  769 + 58 = 827 px). Texto y líneas por encima del carro (`evidence/programa-1440.webp`). Paso, parada y galope
  en poses fijadas (`evidence/gait-paso.webp`, `evidence/gait-parada-galope.webp`).
- 390: capa oculta, sin cargar el GLB (`evidence/narrow.mjs`).
- `evidence/poses.mjs` usaba un gancho de depuración temporal (`window.__dbg`), ya retirado del código.

## Riesgos moderados

1. El carro pasa por detrás de algunas líneas del programa (el camino ya lo hacía). Si estorba: mover `route`.
2. Las capturas sueltas por CDP tardan ~2 s con SwiftShader y mezclan instantes; la sincronía se midió dentro de la
   página, no en las capturas.
3. Canvas WebGL del tamaño de la sección (~1440×890, DPR ≤ 2) solo durante la pasada (~9 s); luego deja de dibujar.

Severos/críticos: ninguno.

## Hotfix on the fly 1

- Galope un 30 % más lento (720 → 504 px/s en `config.ts`). Espaciado de herraduras y rodadas intacto; las patas, que
  van por distancia, frenan con él. Medido: ~520 px/s al galope (con la ondulación del ritmo). La pasada dura ~9 s.
  tsc, next build PASS.
