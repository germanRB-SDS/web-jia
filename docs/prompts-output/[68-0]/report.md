# [68-0] Huellas de carreta y caballos de fondo en «Programa» · informe

- LEVEL 2 · prompt `docs/prompts/[68-0]huellas-carreta-programa.md` · tmp/: N/A
- Rollback: `git revert` del commit `feat(programa): [68-0]…`, o quitar `decor={<WagonTrail />}` en `Jornadas.tsx`.

## Resumen

- `components/site/wagon-trail/`: un camino curvo (Catmull-Rom por 12 puntos relativos al tamaño de la capa) que
  entra bajo por la izquierda, se enrosca en el papel libre bajo la Jornada 1, cruza entre los dos días y sale por la
  derecha. Dos rodadas (lecho suave + dibujo del neumático) y, entre ellas, las herraduras de dos caballos
  (`HORSESHOE_PATH`, el icono del promotor), alternando pie izquierdo/derecho, orientadas hacia donde iba la carreta,
  con una pequeña variación sembrada (el mismo trazado tras redimensionar).
- Capa de borde a borde tras la subsección, desvanecida arriba y abajo, terracota profunda al 15 %; `aria-hidden`,
  sin puntero; oculta por debajo de 760 px. `SubSection` gana la prop `decor`.
- La primera vez que entra en pantalla la carreta pasa en 5,5 s: las rodadas se descubren a ritmo constante y cada
  huella aparece cuando llegan. Con movimiento reducido el camino ya está hecho.

## Verificación

tsc PASS · check:content PASS · next build PASS · CDP: 1440 (194 huellas, capa 1440×889), 1024 (198, 1024×1313),
390 (display none, 0 huellas); a mitad de la pasada el camino está a medio dibujar (`evidence/`).

## Riesgos moderados

1. El camino pasa por detrás de algunas líneas del programa. Al 15 % el texto sigue legible; si molesta, bajar
   `opacity` o mover `route` en `config.ts`.
2. ~200 `<use>` en un SVG: coste bajo; se redibuja solo al cambiar el tamaño.
3. A 760–1024 px la sección es más alta y el camino ocupa su mitad inferior con la misma forma (puntos relativos).

Severos/críticos: ninguno.

## Hotfix on the fly 1

- Un solo caballo, centrado entre las rodadas; el trazado no cambia.
- Reloj propio de la carreta (`build` en `WagonTrail.tsx`, ajustes en `config.ts`): paso con ritmo que respira
  (±10 %), parada de 0,5 s la primera vez que el camino alcanza la mitad del ancho, arranque progresivo en 180 px y
  galope. Las rodadas se descubren con la Web Animations API sobre ese reloj y cada huella aparece en su instante.
- Huellas: al paso, una a una alternando lado cada 22 px; al galope, grupos de cuatro pisadas seguidos del salto
  (96 px), más grandes (×1,12) y más torcidas, y los primeros grupos más cortos mientras toma impulso.
- Medido en Chrome a 1440: avance 8,2–9,5 %/s al paso, 500 ms quieto a los ~5,5 s, 21,7 → 31 %/s al galope;
  pasada completa ≈ 8 s; 106 huellas (52 de galope). Un redimensionado a mitad reinicia la pasada sobre el nuevo
  camino. tsc, next build PASS (`evidence/hotfix1-gait-*.webp`). Severos/críticos: ninguno.

## Hotfix on the fly 2

- Las rodadas iban por delante de las huellas por dos motivos: el remate redondo del trazo que las descubre
  (≈54 px de ancho) adelantaba media galga, y las ruedas no tenían retraso. Ahora el remate es recto (`butt`) y las
  ruedas van `wheelLag` = 90 px detrás del caballo sobre el mismo reloj; la pasada dura lo justo para que salgan.
  Cada huella aparece en 140 ms (antes 380): una pisada es instantánea y, al galope, no llega tarde.
- Medido en Chrome a 1440 (frente de las ruedas frente a la última huella visible, sobre el camino): 77, 67, 78, 83
  y 43 px por detrás a 1,5 / 3,5 / 5,8 / 7 / 8 s. tsc, next build PASS (`evidence/hotfix2-ruedas-detras.webp`).

## Hotfix on the fly 3

- Rodadas del carromato del 15 % al 10 % (`rutOpacity` en `config.ts`); las herraduras siguen al 15 %. tsc, next
  build PASS; captura a 1440 (`evidence/hotfix3-rodadas-10.webp`).
