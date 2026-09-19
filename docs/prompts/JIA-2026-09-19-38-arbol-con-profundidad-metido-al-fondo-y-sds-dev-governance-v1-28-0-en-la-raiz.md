# JIA-2026-09-19-38 — El árbol «metido al fondo», con profundidad (eje z) · `sds-dev-governance` en su última versión en la raíz de `web-jia`

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat tras JIA-2026-09-19-37, elaborado aquí como prompt
(«el input lo guardas como prompt, elaborando un prompt a partir del input»).
**Nivel:** LEVEL 2 (dos encargos independientes: uno instala el kit de gobernanza en el repositorio; otro evoluciona un
componente WebGL) · tmp/scratch: **aplica** → `docs/prompts-output/JIA-2026-09-19-38/tmp/progress.md` y `evidence/`.
**Estado:** EJECUTADO (2026-09-19) — informe en `docs/prompts-output/JIA-2026-09-19-38/report.md`; ver «Corrección del promotor durante la ejecución» al final. Sin push (no se ha pedido).

## Texto del promotor

> «vale, imagina ahora que el árbol es más grande pero si la pantalla tuviera 3D real, en eje x, y, z, siendo la z
> positiva hacia la pantalla y la z negativa alejándose de la pantalla, ahora no tocaríamos x, y pero sí la z para
> ponerla en negativa en cuanto a la base del árbol. Quiero que lo "metas" más al fondo, como si tuviera profundidad.
> Y asegúrate de que tengamos la última versión de sds-dev-governance en nuestra raíz del proyecto web-jia ;)»

## Encargo 1 — `sds-dev-governance`, última versión, en la raíz de `web-jia`

**Estado comprobado (solo lectura) al escribir este prompt:**

- La última versión publicada del kit es **v1.28.0** (2026-09-17): la etiqueta `v1.28.0` apunta a `3b19500`, que es
  también `origin/main`. La copia del hub (`../sds-dev-governance`) está exactamente en ese commit: **está al día**.
- **`web-jia` no tiene ninguna copia del kit en su raíz** (ni carpeta, ni submódulo, ni adaptadores `CLAUDE.md` /
  `AGENTS.md`). Hasta hoy se han usado los scripts del hub (`../sds-dev-governance/scripts/git-safe-push.sh`).
- El hub declara que la gobernanza no se propaga a los repositorios hijos **salvo instrucción del usuario**: este
  mensaje es esa instrucción, con alcance `web-jia`.

**Qué hacer:** instalar el kit con su propio instalador, desde la copia v1.28.0 del hub, en modo proyecto y **solo
ficheros** (sin instaladores de skills/plugins, sin red, sin Git, sin tocar configuración global):

```bash
../sds-dev-governance/init.sh "web-jia" /Users/hrms/MAC-DEV-PROJECTS/web-jia --mode project --files-only --dry-run   # ya revisado
../sds-dev-governance/init.sh "web-jia" /Users/hrms/MAC-DEV-PROJECTS/web-jia --mode project --files-only
```

El plan en seco: **992 ficheros a crear** — `sds-dev-governance/` (la copia del kit), adaptadores (`CLAUDE.md`,
`AGENTS.md`, `GEMINI.md`, `.cursor/rules/`), `check-governance.sh`, plantillas de PR/MR, andamiaje de `docs/`
(`memory/`, `governance/`, `contracts/`, `decisions/`, plantillas de `prompts/`…) y borradores de políticas en
`docs/web-jia-policies/`. **Un conflicto:** `.gitignore` → no se pisa; el instalador deja `.gitignore.sds-new` y hay
que **fusionarlo a mano** (añadir lo que falte, conservar lo nuestro) y borrar el `.sds-new`.

- No se sobrescribe **ningún** fichero existente del proyecto (`README.md`, `DESIGN.md`, `PRODUCT.md`, `docs/prompts/*`).
- Tras instalar: comprobar `sds-dev-governance/VERSION.md` = v1.28.0, que la copia es idéntica a la del hub
  (`diff -rq`, ignorando `.git` y `.DS_Store`), y pasar `./check-governance.sh`. Rellenar en `CLAUDE.md` lo mínimo
  propio del proyecto (stack, flujo de prompts) si el adaptador trae huecos; no inventar lo que no se sepa.
- **No** se admite ninguna capacidad nueva (skills, MCP): «instalado no es autorizado».
- A partir de aquí los scripts se usan desde `./sds-dev-governance/scripts/`.

## Encargo 2 — El árbol, «metido al fondo»

**Lo que pide:** con ejes x (ancho), y (alto), z (positiva hacia el espectador, negativa hacia dentro): el árbol es
**más grande**, su base **no cambia de x ni de y**, y se lleva a **z negativa**. Que se sienta **hundido en la página,
con profundidad**, no pegado sobre ella.

**La trampa geométrica (y por qué no basta con mover la z):** en una cámara en perspectiva, alejar un objeto y
agrandarlo en la misma proporción produce **exactamente la misma imagen**. Un árbol «más grande y más lejos» con la base
en el mismo sitio de la pantalla se vería igual que hoy. La profundidad no la da la coordenada, la dan las **señales de
profundidad**: lo que queda entre el árbol y el espectador, cómo cambia el tamaño de las cosas al acercarse, el aire
entre medias y un suelo que se aleja. Eso es lo que se construye:

1. **El espacio entre el árbol y la pantalla existe: las hojas vienen hacia el espectador.** La brisa deja de ser
   plana (abajo‑izquierda) y gana z positiva: las hojas salen de la copa, **al fondo**, y se acercan creciendo de
   tamaño hasta pasar, grandes, cerca de la «pantalla», antes de desvanecerse. Es la señal más fuerte: mide la distancia.
2. **Perspectiva más marcada.** La cámara pasa de teleobjetivo (22°, que aplana) a un ángulo más abierto, más cerca y
   algo más alta: los lóbulos cercanos ganan tamaño frente a los lejanos y **el suelo se ve alejarse** (el corro de rocas
   se abre en elipse). El encuadre debe seguir siendo exacto con ese ángulo (ajuste por proyección real de la caja, no
   aproximado), manteniendo la base en su x, y de pantalla y el árbol algo **más grande**.
3. **Aire entre medias (perspectiva aérea).** Una neblina muy ligera del color del papel: el árbol entero un punto
   velado y su lado lejano más pálido que el cercano. Sutil: que no parezca niebla, sino distancia.
4. **Un suelo que viene hacia nosotros.** La sombra se alarga hacia el espectador (más fondo que ancho) para dibujar
   el plano del suelo sobre el que el árbol está **lejos**.

Dentro del componente portable como opciones con valores por defecto neutros/apagados (`fall.direction` con z, `haze`,
`camera.fovDeg`/`elevationDeg`, `shadow.depth`); los valores del sitio, en `experienciasTree`. El color de la neblina es
un token de la paleta (el papel de la sección). Sin tocar copa, tallos ni los ocres de las rocas. Si el tamaño o la
posición en pantalla cambian por el nuevo encuadre, reajustar la caja en `Experiences.module.css` para que **la base
quede donde está** y el texto siga libre.

## Reglas de ejecución

- Prompt **commiteado antes de ejecutar**; un commit por fase; **commit al terminar**; sin push salvo que se pida.
  `git add` **solo de ficheros propios** (el promotor edita en paralelo `site.ts`, `jornadas.ts`,
  `.impeccable/design.json`, recursos de `assets/`…).
- Verificación: `tsc`, `check:content`, `next build`, `check-governance.sh`; Chrome por CDP (SwiftShader) contra
  `next dev` :3000 a 1920, 1788 y 1440; secuencia de fotogramas para ver las hojas acercarse; movimiento reducido;
  `scrollWidth`; portabilidad de `tree-3d` (solo `react` y `three`).

| Fase | Contenido | Cierre |
|---|---|---|
| 0 | este prompt | commit **(antes de ejecutar)** |
| 1 | Encargo 1: kit v1.28.0 en la raíz + fusión de `.gitignore` + verificación | commit |
| 2 | Encargo 2: profundidad del árbol (componente + sitio) + evidencias | commit |
| 3 | `report.md` (resumen + riesgos + propuestas) y estado del prompt | commit |

## Riesgos previstos

- **Moderado — tamaño del cambio de gobernanza:** ~1.000 ficheros nuevos en el repositorio y adaptadores que cambian
  cómo cargan contexto los agentes en `web-jia`. Reversible (un commit). Revisar el plan antes de aplicar.
- **Moderado — el build/lint del sitio no debe recoger el kit** (TypeScript, ESLint, `next build`): comprobar
  `tsconfig` y el build tras instalar.
- **Moderado — que la profundidad «no se note» o se pase:** las señales son perceptivas; iterar con capturas. Hojas
  grandes en primer plano pueden molestar sobre el texto: limitar tamaño máximo y opacidad al acercarse.
- **Menor — coste:** la neblina es gratis (uniforme de escena); hojas más grandes en primer plano, algo más de relleno.

## Corrección del promotor durante la ejecución (por chat, «hotfix on the fly»)

> «Y un detalle del árbol: guarda (comentándolo) el color lila/púrpura/morado suave que tiene en las hojas. Guarda esa
> tonalidad como comentario explicando que era el color original, pero utilizas en las hojas, del blanco que
> prácticamente tienen arriba al verde oliva #72715b.»

- Las hojas pasan a un degradado **del casi blanco de arriba (`--jia-tree-cream`) al oliva seco de la casa
  (`--jia-olive`, #72715b)**, con dos pasos intermedios por `color-mix`. Para que el blanco quede **arriba**, el
  componente gana `leaves.heightTone` (la altura en la copa mueve el tono); el sitio lo pone a 0,5.
- **El lila original queda guardado como comentario**, explicando que era el color original y cómo recuperarlo, en los
  dos sitios donde vivía: la línea `leaves` de la paleta en `lib/content/sections/experiencias.ts` y los tres tokens
  (`--jia-tree-rose`, `--jia-tree-lilac`, `--jia-tree-lilac-deep`) en `app/theme/palette.css`.
- El rebote de la luz deja de ser rosado (`--jia-tree-rose`) y pasa a `--jia-dune-light`, para no teñir de rosa el oliva.
