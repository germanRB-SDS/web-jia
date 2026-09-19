# DEC-001 — El árbol 3D se retira de la web y se conserva en la gobernanza

## Metadata

| Campo | Valor |
|---|---|
| Fecha | 2026-09-19 |
| Estado | `aceptada` |
| Autor | promotor (German Roche), ejecutado por el agente |
| Afecta a | `web-jia` (sección «Experiencias», paleta, modelo de contenido) · `sds-dev-governance` v1.29.0 |

## Contexto

Entre JIA-2026-09-19-34 y -38 se construyó y afinó, con el promotor, un árbol 3D procedural animado (Three.js) como
fondo de «Experiencias»: componente portable `components/tree-3d/`, copa en lóbulos, hojas que la brisa arranca y
trae hacia el espectador, rocas ocres, profundidad, paleta por tokens. El resultado se dio por bueno («el diseño está
sublime») y funciona.

## Decision

1. **Conservar el conocimiento en la gobernanza, no en la web.** Todo lo usado se auditó y se exportó a
   `sds-dev-governance/resources/web-components/tree-3d/` (publicado en **v1.29.0**, `REL-2026-09-19-01`): fuente del
   componente, integración React/Next validada, `mountTree` sin framework, demo HTML sin build, `AUDIT.md` (ficheros,
   constantes de color, opciones, decisiones y descartes) e `INDEX-AND-HOW-TO-USE-THEM.md` con el procedimiento para
   volver a integrarlo en cualquier proyecto.
2. **Retirar el árbol de `web-jia`**: `components/tree-3d/`, `components/site/ExperiencesTree.tsx`, el montaje en
   `Experiences.tsx`, `experienciasTree` en `lib/content/sections/experiencias.ts`, el campo `tree` del modelo en
   `lib/content/assemble.ts`, la caja `.tree` de `Experiences.module.css` y los tokens `--jia-tree-*` de
   `app/theme/palette.css`. Se hizo contra el estado previo a las primeras pruebas del árbol (`8bd6687`).
3. **Se mantienen** dos cambios del mismo periodo que no son del árbol: la entradilla nueva de «Experiencias»
   (JIA-34) y la columna de texto un 5 % a la izquierda (`--aula-shift`, JIA-36).

## Alternativas consideradas

| Alternativa | Pros | Contras | Motivo de descarte |
|---|---|---|---|
| Dejarlo en la web, apagado (`enabled: false`) | Un valor lo recupera | Código, tokens y un contexto WebGL en potencia sin uso en el repo del cliente | El promotor pidió quitarlo |
| Solo borrar | Simple | Se pierde lo aprendido en cinco iteraciones | Se quería reutilizable |

## Consecuencias

- La web vuelve a no tener árbol ni coste de WebGL en «Experiencias». `three` sigue siendo dependencia (herradura,
  carruaje).
- Para recuperarlo aquí o en otro proyecto: pedir a la gobernanza el recurso `tree-3d` (alias «árbol 3d», «árbol del
  saber») y seguir su how-to; los valores exactos que se validaron en esta web están en su `integration/react-next/`.
- El historial completo sigue en git (JIA-34…38: prompts, informes y evidencias en `docs/prompts*`).

## Relacion con otras decisiones

- Supersede: —
- Depende de: —
