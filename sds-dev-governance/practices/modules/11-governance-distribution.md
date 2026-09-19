# 11 module — Governance distribution and promotion

Modulo condicional de `11-governance-evolution.md`. Cargarlo solo cuando la tarea distribuye
gobernanza a un proyecto, promociona gobernanza de un proyecto al repositorio canonico, audita
copias distribuidas o resuelve un conflicto de version entre copias. El trabajo ordinario de
gobernanza dentro de un solo repositorio no necesita este modulo.

## Modelo operativo: canonico + N incubadoras

SDS Governance evoluciona por uso real. El repositorio canonico publica una release; cada proyecto
recibe una copia; el trabajo operativo de un proyecto puede mejorar la gobernanza; esa mejora vuelve
al canonico por promocion; el canonico vuelve a distribuir.

El numero de proyectos es `N`, no una lista. Ningun mecanismo, script, indice o regla puede fijar el
conjunto actual de proyectos como supuesto arquitectonico. Los proyectos existentes son fixtures o
resultados de descubrimiento, nunca la definicion del sistema.

Una copia de proyecto que difiere del canonico **no es drift por definicion**. Puede ser identica,
estar por detras, estar por delante, contener una mejora local legitima, estar pendiente de
promocion, haber sido mutada de forma invalida, o compartir numero de version con otro arbol
distinto.

## Autoridad canonica

`germanRB-SDS/sds-dev-governance` es la unica fuente canonica de releases de SDS Governance. Una
copia vendorizada dentro de un proyecto es una distribucion, no una autoridad. Cuando una copia y el
canonico discrepan, la resolucion se decide por este modulo, no por proximidad al trabajo en curso.

## Estados de una copia distribuida

| Estado | Significado | Accion de upgrade |
|---|---|---|
| `CANONICAL_MATCH` | Huella identica al canonico | Ninguna |
| `PROJECT_BEHIND_CANONICAL` | Version anterior; delta local aun no probado | `INSPECT_BASELINE`; seguro sólo con baseline original idéntico |
| `CANONICAL_BEHIND_PROJECT` | Version posterior al canonico | Promocionar antes de tocar la copia |
| `LOCAL_GOVERNANCE_DELTA` | Contiene material que el canonico no tiene | Promocionar antes de sobrescribir |
| `PROMOTION_PENDING` | Delta local ya evaluado y aceptado, aun sin promocionar | Promocionar |
| `SPLIT_VERSION` | Mismo numero de version, arbol distinto | Investigar antes de promocionar |
| `INVALID_MUTATION` | Falta una hoja obligatoria en una copia igual o posterior al canonico | Inspeccionar |
| `UNKNOWN` | Sin `VERSION.md` legible o evidencia insuficiente | Inspeccionar |

`scripts/governance-copies.sh` calcula estos estados sobre `0..N` copias descubiertas
dinamicamente. Acepta `--root` (descubrimiento), `--path` (explicito) y `--stdin` (manifiesto).
Nunca lleva nombres de proyecto embebidos.

## Material no promocionado: como se mide

Una copia contiene material que el canonico no tiene solo si un fichero cumple las dos condiciones:
su ruta no existe en el canonico **y** su contenido no aparece en ninguna ruta del canonico.

- Un renombrado conserva el contenido: no es material nuevo.
- Una revision anterior de un fichero seguido conserva la ruta: no es material nuevo.
- Un prefijo numerico historico en `skills/NN-nombre.md` es la ortografia antigua de
  `skills/nombre.md`, no un nodo distinto: la identidad de una skill es su slug estable.

`scripts/governance-copies.sh --list-unique` enumera los ficheros que quedan tras ese filtro. Ante
la duda, el clasificador es conservador y pide `PROMOTE_FIRST`: nunca declara segura una
sobrescritura que no puede justificar.

## Ciclo de promocion

1. **Inventario.** Descubrir las copias, su `VERSION.md`, su huella determinista del arbol, su
   repositorio/HEAD y si tienen delta sin commitear.
2. **Agrupacion por release logica.** Agrupar por `(version, huella)`. Dos huellas distintas bajo la
   misma version son `SPLIT_VERSION` y se investigan antes de cualquier promocion.
3. **Seleccion de candidato.** Por defecto gana la gobernanza validada mas reciente. El candidato se
   valida antes de promocionarse: checker, tests aislados, sintaxis, `VERSION.md`, `CHANGELOG.md`,
   metadatos de release y ausencia de modificaciones locales sin commitear.
4. **Barrido de regresion y preservacion.** La pregunta no es como combinar arboles, sino que
   material valido se perderia si el candidato pasara a ser canonico. Cada diferencia ausente del
   candidato se clasifica exactamente como `SUPERSEDED`, `INTENTIONAL_REMOVAL`, `PRESERVE` o
   `UNKNOWN`. Un `UNKNOWN` material se resuelve antes de promocionar.
5. **Baseline reconciliado.** `candidato validado + conjunto de preservacion valido`. Nunca la union
   de todas las copias historicas.
6. **Validacion.** Suite completa del repositorio canonico.
7. **Release.** Nueva version canonica mayor que el baseline promocionado, con changelog veraz.
8. **Distribucion.** Solo despues del release.

Un archivo antiguo no se preserva por haber existido. Una copia historica es evidencia para detectar
regresiones, no una autoridad co-igual.

## Split de version

Dos arboles distintos no pueden reclamar el mismo numero de version canonico. El propio baseline
canonico es un reclamante de su numero: una copia que declara la version canonica con un arbol
distinto es un `SPLIT_VERSION` frente al canonico, no una copia mas. La deteccion no puede quedarse
en una fila del informe — `scripts/governance-copies.sh` termina con estado distinto de cero
mientras haya un split abierto, para que quien encadene la herramienta no acepte en silencio un
arbol divergente como la misma release. Al detectarlo:

- ambos linajes se documentan con su fecha y su contenido;
- el material valido de cada uno se clasifica con el barrido de preservacion;
- el linaje no promocionado no se renumera de forma retroactiva en el historial ajeno: su material
  se integra en el siguiente release canonico citando su origen.

## Procedencia y baseline

Cada copia distribuida debe permitir determinar de que release canonico procede, la huella de ese
release, si su arbol actual difiere y si ese delta esta pendiente de promocion. `VERSION.md` y la
huella determinista del arbol son el mecanismo minimo; no se crea un segundo sistema de baseline en
paralelo.

## No sobrescribir copias descendentes

Antes de actualizar una copia de proyecto: identificar su baseline de origen, calcular su delta
local, clasificarlo (`ya canonico` / `promocionar primero` / `preservar localmente` / `invalido`) y
solo entonces actualizar. Una mejora local legitima nunca se destruye por tener una huella distinta.

## Escritores concurrentes

La promocion se ejecuta en rama y worktree aislados, con staging por rutas explicitas. Las reglas
vinculantes viven en `practices/05-git-branching.md`; este modulo no las duplica.

## Prueba de una copia antigua

El contador de material único no demuestra ausencia de ediciones en archivos conocidos.
Sin `--original-baseline DIR` de procedencia verificada, una copia antigua nunca recibe
`SAFE_UPGRADE`. Sólo una huella idéntica a ese baseline original y sin dirty observado
permite esa acción informativa; la herramienta no escribe ni actualiza copias.
La huella v2 incluye tipos, bit ejecutable y texto de symlinks, sin seguir enlaces;
excluye `.git`, `.DS_Store` y `__pycache__`. No es intercambiable con huellas legacy.
TSV conserva columnas; rutas con controles se rechazan. Un descubrimiento válido
sin resultados emite sólo la cabecera; argumentos/rutas inválidos fallan sin filas.
