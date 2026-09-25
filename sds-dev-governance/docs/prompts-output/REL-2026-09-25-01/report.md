# REL-2026-09-25-01 — button-leather-shimmer

| Campo | Valor |
|---|---|
| Versión | `v1.30.0` |
| Fecha | 2026-09-25 |
| Tipo | `GOV-STRUCTURE` (recurso nuevo; ninguna regla cambia) |
| Origen | `web-jia`, prompt `[50-0]`, validado visualmente por el propietario el 2026-09-25 |
| Agente | Claude Code |

## Resumen

Se promueve al kit canónico el patrón de botón que se construyó y validó en `web-jia`:
`resources/frontend-patterns/ui-components/button-leather-shimmer`. Es una superficie física para una llamada a la
acción —degradado diagonal, relieve de dos sombras, un destello inclinado que la cruza en menos de un tercio de su
ciclo y descansa el resto, elevación al pasar el puntero y hundimiento al pulsar— con un hueco de icono opcional en el
que las flechas avanzan y las chapas giran. CSS puro, sin JavaScript y sin dependencias.

El recurso llega desacoplado de la paleta de origen: todos los colores son custom properties y los valores que se
publican son un punto de partida neutro, no una marca. La guía dice explícitamente que se mapeen a los tokens de
diseño del proyecto receptor y que el rótulo salga de su capa de textos.

## Procedencia de terceros

El patrón se modeló a partir de «Wild West Shimmer Button», de **LeonKohli** en Uiverse (MIT), que aportó el
propietario. Se tomó la idea visual; no se copió el código. La ficha publicada de esa referencia declara dos defectos
de rendimiento, y ambos quedan documentados en la guía junto con lo que los sustituye aquí:

| Defecto de la referencia | Qué se hace en su lugar |
|---|---|
| Anima `background-position`, que repinta en CPU en cada fotograma durante toda la vida de la página | El destello es una banda posicionada que se mueve con `transform` |
| `transition: all`, que fuerza recálculo de layout y sombras en cada cambio de estado | Las transiciones listan sus propiedades |

La atribución y la licencia quedan registradas en la guía del recurso.

## Accesibilidad como parte del contrato

La guía no deja la accesibilidad como nota al pie: el contraste se mide contra el **extremo más claro** del degradado
—6,0:1 con los valores publicados—, el anillo de foco está verificado contra el `overflow: hidden` del propio botón,
el área táctil de 48 px se conserva, y con movimiento reducido se detienen el destello, la elevación, el hundimiento y
los iconos mientras **se conserva a propósito** el cambio de color al pasar el puntero, que es la señal de estado y no
decoración.

## Verificación

| Comprobación | Resultado |
|---|---|
| `bash -n init.sh`, `bash -n check-governance.sh` | verde |
| `./init.sh fixture <tmp> --mode project --files-only` | fixture generado |
| `check-governance.sh` sobre el fixture | `SDS Dev Governance check passed`, con `OK: resource indexed: button-leather-shimmer` |
| Barrido de contaminación local (`/Users/`, `/home/`, `teragenda`) en el recurso | sin coincidencias |
| `tests/*.sh` (5) | todos verdes |
| `tests/*.py` | `bootstrap-safety`, `copy-safety`, `mcp-control`, `selective-context` verdes |
| `tests/test-governance-freshness.py` | verde al repetir (fragilidad temporal ya conocida y registrada) |
| `tests/test-bootstrap-location.py` | **fallo preexistente**, reproducido en un worktree limpio de `main` |
| `tests/test-sentinel-sensor-health.py` | **fallo preexistente**, reproducido en `main` limpio: `sentinel.beta` no existe porque `sentinel/` es material sin seguimiento del clon |

Los dos fallos preexistentes se comprobaron uno a uno contra un `git worktree` de `main` sin estos cambios: fallan
igual allí. No se tocan en esta release ni se maquillan.

## Análisis de riesgo

**Moderados**

1. *`color-mix()` en la regla de hover.* Necesita un navegador de 2023 en adelante. En uno anterior el degradado de
   hover no se aplica y el botón se queda en su degradado de reposo: sigue leyéndose como botón y conserva relieve,
   elevación y destello. Degradación aceptable; queda escrita en el registro de gobernanza.
2. *`will-change: transform` permanente.* Mantiene viva una capa de composición por botón. La guía lo dice y acota su
   uso: vale para dos o tres llamadas a la acción, no para una lista.
3. *El recurso es CSS que puede envejecer* con las convenciones de paleta de los proyectos receptores. Sin dependencia
   y sin build; para retirarlo basta borrar la hoja y sus tres registros (índice, README de categoría, glosario).

**Severos**

Ninguno. La release no toca reglas, prácticas, routers, adapters, instaladores, scaffold ni el conjunto de lectura
obligatoria. Nada entra en el contexto siempre-leído: el recurso es perezoso y solo se descubre por el índice.

**Críticos**

Ninguno. Sin secretos, sin datos personales, sin rutas locales, sin ejecutables nuevos.

## Deuda corregida de paso

`README.md` anunciaba `v1.27.0` después de dos releases. Queda en `v1.30.0`.

## Distribución

Tras publicar la etiqueta, la copia de `web-jia` se actualiza desde `v1.30.0` y se commitea allí por separado. Ningún
otro proyecto se toca en esta release.
