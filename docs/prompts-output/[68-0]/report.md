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
