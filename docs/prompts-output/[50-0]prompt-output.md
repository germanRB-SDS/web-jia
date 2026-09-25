# Prompt Output — [50-0]

## 0. Metadata

| Campo | Valor |
|---|---|
| Prompt ejecutado | `docs/prompts/[50-0]primary-buttons-leather-relief-and-shimmer.md` |
| Fecha | 2026-09-25 |
| Agente/herramienta | Claude Code |
| Rol principal | Frontend |
| Nivel de gobernanza | `LEVEL 2` |
| Áreas afectadas | `frontend` |
| Memorias cargadas | `docs/memory/frontend.md` |
| Estado final | `IMPLEMENTADO` (Phases A–F) |
| Change ID | N/A (un solo repositorio) |

## 1. Objetivo

Llevar los tres botones primarios (`EXPLORAR LAS JORNADAS`, `DISPARA TU IDEA`, `ACOGER LAS JIA`) del marrón plano a una
pieza de cuero en relieve con un destello que la recorre, a partir de la referencia que aportó el propietario; poner la
estrella de sheriff en el primero y renombrar el tercero. Todo el texto sigue viviendo en constantes.

Phases A–F ejecutadas y cerradas.

## 2. Qué se hizo

| ID | Tarea | Estado |
|---|---|---|
| A | Radio de impacto: `.primary` la usan exactamente tres botones, verificado en el código y en el DOM en ejecución (3 nodos `a[class*="primary"]`) | `DONE` |
| B | Seis tokens nuevos en `app/theme/palette.css`: cuero, cuero al puntero, banda de luz y relieve en tres estados | `DONE` |
| C | `.primary` en `components/primitives/Action.module.css`: cuero, relieve, destello, elevación, hundimiento y guarda de movimiento reducido | `DONE` |
| D | `SheriffStarIcon`, el icono declarado desde la capa de contenido, y el rótulo `Acoger las JIA` | `DONE` |
| E | Checks, evidencia visual y cierre por práctica 14 | `DONE` |
| F | Promoción al kit canónico, tras la validación del propietario | `DONE` |

### Ficheros

| Fichero | Qué cambia |
|---|---|
| `app/theme/palette.css` | `--jia-gradient-leather`, `--jia-gradient-leather-hover`, `--jia-glint`, `--jia-shadow-relief{,-hover,-active}` |
| `components/primitives/Action.module.css` | `.primary` y sus estados; `@keyframes glint`; `.badge`; bloque de movimiento reducido |
| `components/icons/index.tsx` | `SheriffStarIcon` |
| `components/primitives/Action.tsx` | `ACTION_ICONS` resuelve el nombre declarado; la flecha sigue siendo el recurso por defecto |
| `lib/content/sections/hero.ts` | La acción primaria declara `icon: "sheriff-star"` |
| `lib/content/assemble.ts` | `ActionIcon` y el campo opcional `icon` en el modelo `Action` |
| `lib/content/index.ts` | Exporta `ActionIcon` |
| `lib/content/copy/es/buttons.ts` | `host.host`: `Quiero acoger las JIA` → `Acoger las JIA` |

### De la referencia: qué se tomó y qué no

El propietario aportó «Wild West Shimmer Button», de LeonKohli (Uiverse, MIT). Se tomó la idea —cuero en degradado,
relieve de dos sombras, destello en bucle, elevación y hundimiento— y se descartaron sus hex sueltos, su escena de
fondo y **sus dos defectos declarados en la propia ficha de la referencia**: animar `background-position`, que repinta
en CPU en cada fotograma, y `transition: all`, que fuerza recálculo de layout y sombras. Aquí el destello se mueve con
`transform` sobre una banda inclinada y la transición sigue listando sus propiedades.

## 3. Verificación

| Check | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run check:content` | verde — `6 workshops, 38 people, 2 experiences, 0 resources, 61 media` |
| `npx next build` | verde — export estático generado |
| Rótulos en el HTML generado | `Acoger las JIA`, `Dispara tu idea` y `Explorar las jornadas` presentes; `Quiero acoger las JIA` ya no aparece |
| Contraste | marfil a **6,0:1** contra el extremo más claro del cuero (`--jia-terracotta`); mayor contra cualquier punto más oscuro y contra el degradado del puntero |
| Movimiento reducido | `prefers-reduced-motion: reduce` → destello con `animation: none` y `opacity: 0`; sin elevación ni hundimiento; iconos quietos |
| Foco con teclado | `:focus-visible` verdadero, `outline: 3px solid rgb(137,72,46)` con `offset: 3px`, visible entero pese al `overflow: hidden` |
| Área táctil | `min-height: 48px` intacta |
| Radio de impacto en ejecución | 3 botones `.primary` en el DOM, ni uno más |

Evidencia en `docs/prompts-output/[50-0]/evidence/`: los tres botones en reposo, bajo el puntero y con el destello
congelado a mitad del barrido (un bucle de 5 s con un barrido de 1,6 s casi nunca sale en una foto fija), en escritorio
y en móvil, más la toma del anillo de foco.

## 4. Informe de fase (práctica 14)

**Resumen.** Los tres botones primarios pasan a cuero en relieve con destello; el primero estrena la estrella de
sheriff, declarada desde la capa de contenido; el tercero se llama ahora `ACOGER LAS JIA`. Seis tokens nuevos, todos
hechos con colores anteriores de la paleta; ningún color, rótulo ni enlace escrito en un componente. Tres checks en
verde y evidencia visual capturada por CDP.

### Análisis de riesgo

**Moderados**

1. *El degradado no interpola.* `background-image` no es animable entre degradados, así que el cambio de color al pasar
   el puntero es instantáneo mientras el relieve y la elevación sí se suavizan en 160 ms. Se percibe como un pequeño
   salto de color. Propuesta: aceptarlo por ahora; si molesta, superponer una capa de tinta con `opacity` en transición
   en vez de cambiar el degradado de fondo. Destino: decisión del propietario junto con la validación visual.
2. *`will-change: transform` permanente.* Mantiene tres capas de composición vivas durante toda la vida de la página,
   aunque el destello descanse 3,4 s de cada 5. El coste es bajo (tres rectángulos pequeños), pero es memoria de GPU
   reservada sin pausa. Propuesta: si un perfil de rendimiento lo señalara, retirar `will-change` y dejar que el
   compositor promueva la capa por la propia animación. Destino: fase futura, solo con medición.
3. *La animación no se detiene fuera de pantalla.* Dos de los tres botones viven muy abajo en la página y su destello
   sigue corriendo aunque no se vean. Chrome suele suspender animaciones fuera de la vista, pero no está garantizado
   en todos los navegadores. Propuesta: si se midiera consumo en móvil, condicionar la animación con un
   `IntersectionObserver`; hoy sería desproporcionado. Destino: fase futura, solo con medición.
4. *El anillo de foco es terracota sobre cuero terracota.* El `outline-offset: 3px` lo saca del botón y sobre el papel
   se ve entero (verificado), pero el botón del hero se apoya en una fotografía: si esa fotografía cambiara a una con
   una zona oscura justo ahí, el anillo perdería contraste. Propuesta: revisarlo cada vez que se cambie la fotografía
   del hero. Destino: nota de vigilancia, sin cambio hoy.

**Severos**

Ninguno detectado. Se buscaron expresamente: el destino de los tres enlaces, su semántica de enlace externo
(`target="_blank"` con `rel="noopener noreferrer"`), el orden de foco, el área táctil de 48 px y el estado «no
disponible» quedan exactamente como estaban. Un formulario retirado seguiría comunicándose con su rótulo apagado, sin
cuero ni destello, porque `.disabled` no se tocó.

**Críticos**

Ninguno. El cambio no toca secretos, permisos, datos personales, rutas de despliegue ni dependencias.

**Mejora incidental.** `.btn:hover svg` no tenía guarda de movimiento reducido y ahora la tiene: con movimiento
reducido tampoco se mueven las flechas de los demás botones.

## 5. Desviaciones respecto al prompt

| Punto | Desviación | Motivo |
|---|---|---|
| Phase E, servidor de desarrollo | Se capturó contra el servidor ya levantado en `localhost:3000` en vez de abrir uno nuevo en `:3005` | Había un `next dev` del propietario corriendo sobre este mismo directorio; matarlo habría interrumpido su trabajo |
| Phase C, opacidad del destello | Subida de 0,22 a 0,26 sobre el marfil | A 0,22 el destello casi no se percibía sobre la terracota, que es más clara que el cuero de la referencia |

Ninguna otra. El resto de fases se ejecutó tal como estaba escrito.

## 6. Continuidad

Tmp/scratch: N/A — prompt corto, una sola sesión, sin interrupciones. Los scripts de captura son de un solo uso y
viven en el scratchpad de la sesión, fuera del repositorio; los scripts de QA del proyecto no se tocaron.

## 7. Validación del propietario y Phase F

**Validación visual recibida el 2026-09-25**, en palabras del propietario: «Visualmente te doy la aprobación». Con
ella se desbloqueó la Phase F y se promovió el patrón al kit canónico.

| Qué | Dónde |
|---|---|
| Recurso | `sds-dev-governance/resources/frontend-patterns/ui-components/button-leather-shimmer` (guía, `css/`, `html/`) |
| Registros | fila en el índice de recursos, bullet en el README de la categoría, término `leather-shimmer` en el glosario |
| Release | `v1.30.0`, `REL-2026-09-25-01`, etiquetada y subida a `germanRB-SDS/sds-dev-governance` |
| Informe de release | `sds-dev-governance/docs/prompts-output/REL-2026-09-25-01/report.md` |

El propietario nombró el destino como «resources/ui-components»; la ruta real del kit es
`resources/frontend-patterns/ui-components`, confirmada contra el índice antes de escribir. No se creó una carpeta
paralela.

El recurso salió desacoplado de la paleta de JIA: todos los colores son custom properties con valores neutros de
partida. Se registró la procedencia de terceros (LeonKohli, Uiverse, MIT) y los dos defectos de rendimiento que
declara la propia ficha de la referencia, con la técnica que los sustituye.

La copia del kit dentro de este proyecto se actualizó desde la etiqueta `v1.30.0` y su `check-governance.sh` pasa
en verde, reconociendo el recurso nuevo.
