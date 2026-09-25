# [50-0] Botones primarios: cuero en relieve, destello y estrella de sheriff

## PREFACE — NON-EXECUTABLE

Este documento recoge la instrucción del propietario del 25 de septiembre de 2026. Es documentación del prompt: **no se ejecuta**. La ejecución empieza en `## Status`.

- **Qué cambia:** el estilo de los tres botones primarios del sitio (`EXPLORAR LAS JORNADAS`, `DISPARA TU IDEA`, `QUIERO ACOGER LAS JIA`), que pasan de un marrón plano a una superficie de cuero en relieve con un destello que la recorre; el rótulo del tercero pasa a `ACOGER LAS JIA`; el primero estrena una estrella de sheriff.
- **Por qué:** el propietario aporta una referencia concreta (Uiverse, «Wild West Shimmer Button», de LeonKohli, licencia MIT) y quiere esa presencia física en las tres llamadas a la acción, sin salir de la paleta del proyecto.
- **Cómo:** tokens nuevos en `app/theme/palette.css`, un solo componente (`components/primitives/Action.tsx` y su módulo CSS) y un icono nuevo en la familia existente. Ningún texto, color ni enlace en el JSX.
- **Consecuencias:** cambia el aspecto de los tres botones en escritorio y móvil. No cambia su destino, su semántica, su orden ni el botón secundario `VER TALLERES`. La variante `.primary` solo la usan esos tres botones: el radio de impacto está acotado y verificado en Phase A.
- **Severidad prevista:** moderada por contraste insuficiente del rótulo sobre el degradado, por animación permanente que obligue a repintar, y por regresión de foco visible. Severa solo si se rompiera el enlace o se ocultara la acción. Crítica: no se prevé. La evaluación definitiva corresponde a cada fase conforme a la práctica 14.
- **Estado de evidencia:** la referencia aportada es código de ejemplo, no una medición. La propia ficha de la referencia advierte de dos defectos: animar `background-position` provoca repintados continuos de CPU y `transition: all` fuerza recálculo de layout y sombras en hover. Este prompt **no** copia esos dos defectos; los corrige (Phase C).

---

## Status

`EJECUTADO Y CERRADO` el 25-09-2026, Phases A–F. El propietario dio la validación visual ese mismo día
(«Visualmente te doy la aprobación»), lo que desbloqueó la Phase F. Resultado, análisis de riesgo y constancia de la
validación en `docs/prompts-output/[50-0]prompt-output.md`. El patrón vive en el kit como
`resources/frontend-patterns/ui-components/button-leather-shimmer` desde `v1.30.0` (`REL-2026-09-25-01`).

Objetivo: llevar los tres botones primarios al lenguaje visual del oeste que ya tiene el sitio, con una pieza reutilizable y modular, y dejar el conocimiento listo para promoverse al kit canónico **solo después** de la validación visual del propietario.

**Gate de validación visual (vinculante).** La promoción a `sds-dev-governance/` (Phase F) está **BLOQUEADA**. No se ejecuta en esta pasada. Requiere que el propietario diga explícitamente que el resultado le gusta, después de verlo. Ninguna otra señal —que compilen los checks, que las capturas parezcan correctas, que el prompt esté escrito— sustituye esa validación.

## Governance and scope

- Ejecución: **LEVEL 2**. Área: `frontend`. Backend, API, base de datos, seguridad y despliegue: N/A; no introducirlos.
- Aplicar el orden de lectura de `CLAUDE.md`, el router SDS y solo las prácticas que seleccione. Práctica 14 gobierna el cierre de cada fase (aterriza código ejecutable). Práctica 16, el alcance de verificación.
- Leer `docs/memory/frontend.md`. No cargar el resto de memorias.
- Aplicar `sds-dev-governance/skills/impeccable.md` al trabajo visual.
- Trabajar desde la raíz del proyecto. Antes de cada comando `node`, `npm` o `npx`, si existe `.nvmrc`, ejecutar en la misma shell `source "$HOME/.nvm/nvm.sh" && nvm use`.
- Preservar los cambios del usuario. Commits con rutas explícitas, nunca `git add -A`: el árbol tiene trabajo ajeno sin seguimiento (`assets/`, `docs/prompts/[48-0]*`). Push por `sds-dev-governance/scripts/git-safe-push.sh origin main`.
- Ficheros nuevos con nombre en inglés; la documentación, en español.
- Continuidad: este prompt es corto y de una sola sesión. Tmp/scratch: **N/A**. Evidencia visual: `docs/prompts-output/[50-0]/evidence/`.
- Output: `docs/prompts-output/[50-0]prompt-output.md`, según `docs/prompts-output-template/output-template.md`.

## Referencia aportada por el propietario

Uiverse, «Wild West Shimmer Button», de LeonKohli, MIT. Del ejemplo se toma **la idea**, no el código:

| Del ejemplo se toma | Del ejemplo se descarta |
| --- | --- |
| Fondo de cuero en degradado diagonal (45°), no plano | Los hex sueltos (`#8b4513`, `#a0522d`, `#f1dabb`, `#d2b48c`): aquí todo sale de la paleta |
| Relieve: sombra proyectada hacia abajo + sombra interior en el borde inferior | La escena de fondo (`wild-west-scene`, rejilla, viñeta, foco): el sitio ya tiene su propio fondo |
| Destello claro que recorre la pieza en bucle lento | `animation: background-position`: repinta en CPU. Aquí se anima `transform` |
| Elevación al pasar el puntero y hundimiento al pulsar | `transition: all`: recalcula layout y sombras. Aquí se listan las propiedades |
| Icono que acompaña al rótulo y reacciona al puntero | `position: absolute` y el centrado del ejemplo: los botones viven en el flujo de su sección |

## Phase A — Descubrimiento y radio de impacto (solo lectura)

1. Confirmar que la clase `.primary` de `components/primitives/Action.module.css` la usan exactamente tres botones y ningún otro: el primero del hero (`components/site/Hero.tsx`, variante explícita), `components/site/Proposals.tsx` y `components/site/Host.tsx` (variante por defecto). Si apareciera un cuarto consumidor, detenerse y registrarlo antes de tocar el estilo.
2. Confirmar que `VER TALLERES` usa `.secondary` y **no** debe cambiar.
3. Confirmar que los rótulos ya viven en `lib/content/copy/es/buttons.ts` y los enlaces en `lib/content/config/enlaces.ts`. Si algún rótulo o URL estuviera escrito en un componente, moverlo antes de seguir.
4. Anotar los tokens existentes que se van a reutilizar: `--jia-terracotta`, `--jia-terracotta-deep`, `--jia-ink-rgb`, `--jia-ivory`, `--jia-ivory-rgb`, `--jia-radius-button`, `--ease-out`.
5. Dejar constancia del estado de partida de los checks (`npx tsc --noEmit`, `npm run check:content`, `npx next build`). Los errores previos, si los hubiera, se registran aparte y no se atribuyen a este cambio.

## Phase B — Tokens de cuero y destello

En `app/theme/palette.css`, junto a los degradados existentes y con su comentario en español:

1. `--jia-gradient-leather`: degradado diagonal a 45° de terracota profunda a terracota. Es el equivalente en paleta del cuero del ejemplo.
2. `--jia-gradient-leather-hover`: un paso más hondo, mezclando terracota profunda con tinta mediante `color-mix`. Nunca un hex nuevo.
3. `--jia-glint`: la banda de luz del destello, marfil translúcido sobre transparente a ambos lados.
4. `--jia-shadow-relief`, `--jia-shadow-relief-hover`, `--jia-shadow-relief-active`: el relieve, siempre como `rgb(var(--jia-ink-rgb) / …)`. Cada uno combina la sombra proyectada hacia abajo y la sombra interior del borde inferior que da el canto de cuero.

Reglas: ningún color literal fuera de este fichero; ningún token nuevo que no use uno anterior; comentario que diga para qué sirve cada uno, como el resto del fichero.

## Phase C — El botón

En `components/primitives/Action.module.css`, solo dentro de `.primary` y sus estados:

1. Fondo: `--jia-gradient-leather`; rótulo en `--jia-ivory`; borde que no rompa la silueta actual.
2. Relieve con `--jia-shadow-relief`.
3. Destello: un `::after` en posición absoluta que cubre el botón, pintado con `--jia-glint`, inclinado con `skewX`, y **animado con `transform: translateX`**, no con `background-position`. El botón necesita `position: relative` y `overflow: hidden`; el contenido (rótulo e icono) va por encima con su propio nivel de apilado.
4. El ciclo del destello no es un estrobo: pasa una vez y descansa. Repartir los fotogramas de modo que el barrido ocupe menos de la mitad del ciclo y el resto sea reposo, con una duración total de entre 4 y 6 segundos.
5. Hover y `focus-visible`: `--jia-gradient-leather-hover`, `--jia-shadow-relief-hover` y una elevación contenida (subir unos pocos píxeles y crecer muy poco). Nada de `transition: all`: extender la lista explícita que ya tiene `.btn` con las propiedades nuevas.
6. `:active`: hundimiento con `--jia-shadow-relief-active`. El botón debe sentirse pulsado.
7. **No tocar** `.secondary`, `.quiet`, `.disabled` ni `.unavailable`. Un botón no disponible sigue siendo un rótulo apagado, sin cuero ni destello.

Restricciones de calidad, de obligado cumplimiento:

- **Movimiento reducido.** Bajo `prefers-reduced-motion: reduce`, el destello no se anima (queda invisible o quieto) y la elevación desaparece. El cambio de color en hover se conserva: es la señal de estado.
- **Foco.** El anillo global (`:focus-visible`, terracota con `outline-offset`) debe seguir viéndose entero. `overflow: hidden` recorta el interior, no el contorno; verificarlo en el hero, donde el botón se apoya sobre la fotografía.
- **Contraste.** Medir marfil contra el extremo **más claro** del degradado. Mínimo 4,5:1. Si no llegara, oscurecer ese extremo, nunca aclarar el rótulo.
- **Composición.** El destello se anima en el compositor (`transform`, con `will-change`), no en CPU.
- **Tacto.** El área táctil mínima actual (`min-height: 48px`) no se reduce.

## Phase D — La estrella del sheriff y el rótulo

1. En `components/icons/index.tsx`, añadir `SheriffStarIcon` a la familia existente: misma rejilla de 64 unidades, silueta rellena con `currentColor`, decorativa (`aria-hidden`). Es una placa de sheriff —estrella de cinco puntas con un remate redondeado en cada punta—, no la estrella lisa que ya existe (`StarIcon`, que se usa en el hero y no se toca).
2. El icono lo declara la capa de contenido, no el JSX, siguiendo el precedente de los `waypoints` (`icon: "hat" | "cactus" | …` en `lib/content/sections/hero.ts`): añadir el nombre del icono a la acción primaria del hero en su configuración, propagarlo por `lib/content/assemble.ts` hasta el modelo `Action`, y que `components/primitives/Action.tsx` resuelva el nombre al componente. Un nombre desconocido o ausente cae en el icono por defecto.
3. Los otros dos botones **conservan su flecha**: son enlaces externos y siguen mostrando `ExternalIcon`. No cambiar esa lógica.
4. Al pasar el puntero, la estrella gira sobre sí misma; las flechas siguen avanzando como hasta ahora. Bajo movimiento reducido, ninguna de las dos se mueve.
5. Rótulo: en `lib/content/copy/es/buttons.ts`, `host.host` pasa de `Quiero acoger las JIA` a `Acoger las JIA`. Es la única cadena que cambia. Sigue siendo JIA, nunca GIA. Ningún rótulo se escribe en un componente.

## Phase E — Verificación y evidencia

1. `npx tsc --noEmit`, `npm run check:content` y `npx next build`, los tres en verde.
2. Comprobar en el HTML generado que los tres rótulos salen de las constantes y que `ACOGER LAS JIA` sustituye al anterior.
3. Levantar el servidor de desarrollo y capturar con CDP, en `docs/prompts-output/[50-0]/evidence/`: el hero en escritorio, la sección «Tu propuesta JIA» y la banda «Dispara tu centro», en reposo y con el puntero encima; y el hero en ancho de móvil. Las capturas son para el propietario: deben verse los tres botones.
4. Verificar a mano: foco visible con teclado en los tres; el destello no aparece con movimiento reducido activado; el contraste medido del rótulo.
5. Cierre conforme a la práctica 14: commit(s) de implementación con rutas explícitas, informe de fase por terminal y en el output, y commit documental aparte con el resumen y el análisis de riesgo íntegros en su descripción. Después, `git-safe-push.sh origin main`.
6. Presentar el resultado al propietario y **parar**. El prompt queda `EJECUTADO — PENDIENTE DE VALIDACIÓN VISUAL`.

## Phase F — Promoción al kit canónico (BLOQUEADA)

No ejecutar sin la validación visual explícita del propietario. Cuando llegue:

1. Registrarla en el output con fecha y palabras del propietario.
2. Promover el patrón a `sds-dev-governance/resources/frontend-patterns/ui-components/`, que es la ruta real del kit (el propietario la nombró como «resources/ui-components»; confirmarla antes de escribir y no crear una carpeta paralela). Nombre propuesto: `button-leather-shimmer`, neutro y portable, sin atarlo a esta edición ni al oeste.
3. La carpeta lleva su `INDEX-AND-HOW-TO-USE-THEM.md` y el ejemplo funcional desacoplado de la paleta de JIA: tokens propios con valores por defecto que el proyecto receptor sobrescribe. Documentar los dos defectos corregidos de la referencia original y acreditar su autoría y licencia MIT.
4. Añadir la fila en `sds-dev-governance/resources/index-of-resources-and-working-patters.md` en el mismo cambio: un recurso sin indexar se considera inexistente y `check-governance.sh` lo rechaza.
5. Seguir el flujo de release del kit (versión, changelog, etiqueta, push, redistribución) tal como está registrado en la memoria del agente.
