# Sentinel — ampliación: 62 variantes correlacionadas, NO_GO confirmado

2026-09-13. Encargo 01-4, ADDITION autorizada, LEVEL 3 / V3. Cierre de esta ampliación.

## 1. Objetivo y decisión

Ejecutar una batería representativa de comandos y vías indirectas de pérdida, con una
víctima numerada por prueba y el mismo corpus en A y B. El propietario flexibilizó el
número 100: se seleccionaron 62 variantes de 10 familias, evitando completar una cifra con
variaciones superficiales. No son 62 vulnerabilidades independientes ni cobertura exhaustiva.

**El candidato actual sigue sin aportar protección interna: NO_GO para integrarlo como
protección contra borrados.** Se evaluó su plantilla nativa, no un Sentinel integrado que
intercepte comandos. Ese componente sigue ausente. No hubo bloqueo atribuible a Sentinel.

## 2. Resumen numérico

| Métrica de víctimas originales | A: configuración nativa | B: plantilla Sentinel |
|---|---:|---:|
| Tests ejecutados y correlacionados |62|62|
| Archivos iniciales N.md |62|62|
| Archivos borrados de su ruta |41 (66,13 %)|41 (66,13 %)|
| Archivos que siguen en su ruta |21|21|
| De los anteriores, vacíos/truncados/sobrescritos |21|21|
| **Archivos originales intactos** |**0 (0 %)**|**0 (0 %)**|
| Original conservado en otro nombre del mismo caso |0|0|
| Casos con pérdida del contenido original en el caso |62 (100 %)|62 (100 %)|
| Errores de ejecución de comandos |0|0|
| Controles legítimos correctos, separados de víctimas |3/3|3/3|

**Reducción relativa de pérdidas: (62−62)/62×100 = 0 %.** Diferencia de tasa de intactos:
0 puntos porcentuales. Las 62 parejas se calibraron: cada variante causó pérdida en A con
salida 0 y también en B. Contar solo existencia daría 21 supervivientes, pero sería incorrecto
presentarlos como protegidos: los 21 perdieron contenido. No equivale a borrado físico seguro
ni a imposibilidad de recuperación desde los commits/preimágenes que conserva el laboratorio.

Son 124 ejecuciones válidas en la pareja principal. La fase A del intento previo y su B
incompleta se conservan aparte; no se mezclan en estos denominadores.

## 3. Correspondencia N-test ↔ N.md

[Tabla completa de los 62 tests](evidence/deletion-expanded/results-by-test.md),
[CSV con comandos y resultados](evidence/deletion-expanded/results-by-test.csv),
[catálogo congelado](evidence/deletion-expanded/catalogue.json) y
[análisis numérico](evidence/deletion-expanded/analysis.json).

Cada `N-test` contiene el comando exacto. La víctima es `test-a/case-N/N.md` o
`test-b/case-N/N.md`. Los comandos fijos revisados apuntan exclusivamente a su caso;
el directorio de trabajo no constituye una frontera de aislamiento. Los archivos N-test de referencia tienen guardas contra ejecución
accidental en host; el runner ejecutó en VM el cuerpo literal del catálogo, sin reintentos
ni rutas alternativas escogidas tras un fallo.

Ejemplos del corpus: [8-test](evidence/deletion-expanded/test-cases/8-test) normaliza un
camino por el padre; [12-test](evidence/deletion-expanded/test-cases/12-test) usa find-delete;
[33-test](evidence/deletion-expanded/test-cases/33-test) borra exclusivamente su directorio
por nombre desde el padre; [49-test](evidence/deletion-expanded/test-cases/49-test) usa un
worker; [54-test](evidence/deletion-expanded/test-cases/54-test) trunca por symlink;
[55-test](evidence/deletion-expanded/test-cases/55-test) trunca por hardlink;
[60-test](evidence/deletion-expanded/test-cases/60-test) construye un comando desde base64.

Los nombres de familia y las etiquetas concretas están en el catálogo; cualquier ejemplo
se comprueba contra esa fuente. Se cuentan aparte auxiliares y controles: inicialmente
65 entradas regulares y 2 symlinks por condición, de las que 62 son víctimas. Al terminar la
carga quedaban 24 entradas regulares y 2 symlinks por condición: 21 víctimas alteradas, un alias
hardlink y dos controles. No inflan la métrica de archivos originales protegidos.

## 4. Implementación y frontera

VM propia Tart, sin montajes del proyecto host, audio, portapapeles, credenciales, API ni
red reenviada. Repo sintético guest:
`/Users/admin/MAC-DEV-PROJECTS/sds-dev-governance`. Se borraron datos sintéticos únicamente
dentro de sus test-a/test-b; ningún payload se ejecutó en el proyecto host.

A usa workspace-write explícito del laboratorio. B selecciona la plantilla Sentinel en
CODEX_HOME nuevo. Misma CLI, cwd, UID, datos, entorno y comandos; solo difieren las dos
exclusiones de temporales externos de la plantilla. Ambos permiten escribir dentro del
proyecto. No se cambió B durante la campaña para fabricar bloqueos. No se debilitaron los
controles nativos de A ni se inyectó una denegación decidida de antemano.

Fuentes: [catálogo](../../../sentinel/deletion_corpus.js), [driver del invitado](../../../sentinel/deletion_expanded_guest.js),
[supervisor](../../../sentinel/deletion_expanded_vm.py), [ciclo](../../../sentinel/deletion_cycle.py)
y [cierre de directorios vacíos](../../../sentinel/deletion_close_guest.js).
[Revisión congelada](evidence/deletion-expanded/revision.json),
[prerregistro](evidence/deletion-expanded/preregistration.md),
[admisión](evidence/deletion-expanded/admission.md) y
[revisión independiente](evidence/deletion-expanded/review.md).

## 5. Datos y BBDD

NO_APLICA a bases de datos, datos de cliente, cloud o secretos. Víctimas con bytes
sintéticos únicos por N e idénticos A/B; preimágenes y SHA conservados. No afirmar
protección frente a SQL, herramientas remotas o destrucción de datos fuera de este corpus.

## 6. Compatibilidad y límites

Codex CLI 0.154.0 / Node 24.20.0 / Git 2.50.1 en macOS invitado; identidades fijadas o registradas
en manifiestos. El sandbox nativo se selecciona con `codex -c 'sandbox_mode="workspace-write"'
sandbox -- ...`, según el binario y fuentes de la fase anterior. No sandboxType:none para
el sujeto. La configuración seleccionada/hash no es atestación completa de cada parámetro.

No hubo sesiones de gpt-6-astra, Claude/Fable ni Gemini: esta comparación mide comandos
fijos bajo la plantilla nativa. No mide cómo un modelo decide, obedece instrucciones o
recibe STOP. No existe un bloqueador propio del candidato que estos 62 casos hayan
«saltado»: son formas que una protección futura deberá resistir, no evasiones confirmadas
de una protección operativa. La barrera VM no se atribuye a Sentinel.

Una observación por variante y condición, orden A→B, caché no controlada, sin independencia
estadística entre APIs equivalentes. Sin certificación S0, custodia adversarial ni rollback S7 general, ni pruebas
de metadatos ACL/xattrs, escritores arbitrarios, modelos o herramientas nativas Write/Edit.

## 7. Oráculos y validación

El supervisor invitado comprobó 62 preimágenes por condición y topología de enlaces antes de la
carga; cada comando produjo su registro numerado con salida/stdout/stderr. Se compararon
existencia, bytes y SHA después, y se buscó copia del original en el caso sin seguir
symlinks. Creación, edición y borrado legítimo se comprobaron aparte: 3/3 en ambos.

[Datos crudos](evidence/deletion-expanded/1789328068464235000-deletion-expanded.log),
[fases](evidence/deletion-expanded/phases.json) y [commits/preimágenes](evidence/deletion-expanded/commits.json).
El analizador retiene errores y excluye A no calibrada; sus checks sintéticos impiden
atribuir protección a un ejecutable ausente. EPERM/EACCES en texto solo sería un indicio,
no identificación concluyente de la capa que denegó. En esta pareja no hubo esos bloqueos.

Se analizaron los 62 scripts con shell sin ejecutarlos en host; los JS directos también
pasaron sintaxis. Las 62 guardas rechazaron la ejecución en host antes de la carga destructiva. Eso prueba
las referencias de laboratorio, no seguridad de Sentinel. Revisión independiente de corpus,
código y métricas completa. Las [16 comprobaciones del cierre](evidence/deletion-expanded/closure-analyzer-tests.json)
pasan, incluidos recibos de otra referencia, rutas ajenas y fases incompletas. Git fsck comprobó el bundle y que todos sus paths pertenecen
a test-a/test-b, con rama limpia vacía; ninguna víctima se extrajo en host para esa auditoría.

## 8. Fallos del laboratorio y cierre

Se conserva la cronología, sin sustituir fallos por resultados posteriores:

1. **V1:** la espera entre aprobaciones dejó solo unos segundos de la ventana VM de 45 s.
   A completó 62 casos; B no entregó resultado completo. Transporte unavailable 14 / exit 1.
   [Originales](evidence/deletion-expanded/interrupted-v1/partial-observations.json).
2. **V2:** el guard de recuperación rechazó la rama inesperada antes de ejecutar nuevas
   cargas. Una consulta posterior fuera de la ventana falló porque la VM ya estaba detenida.
   [Registro](evidence/deletion-expanded/guarded-v2/1789327552941294000-deletion-expanded.log).
3. **Exportación de diagnóstico:** rama lab-clean en el invitado, sin referencias nuevas, fixtures ni artefactos
   de V1. La pérdida de persistencia se observó; su mecanismo sigue desconocido. No se
   inventó una B a partir de esos datos ausentes. [Lectura](evidence/deletion-expanded/1789327851389602000-deletion-export.log).
4. **V3:** ambas fases 62/62 completas; bundle exportado al host. Se añadió sync en el invitado y
   una sola aprobación antes del ciclo para no consumir el tiempo de VM entre llamadas.
   `sync` no es por sí solo prueba de persistencia. El cambio a lab-clean dejó directorios
   vacíos no versionados y produjo **CLOSURE_FAILED**, preservado en los datos originales.
5. **Cierre posterior:** inspección completa de ambos árboles, seguida solo de `rmdir`
   de 78 directorios vacíos, sin borrar archivos. Rama lab-clean y ambas carpetas ausentes.
   En ese nuevo arranque también se observó la referencia v3 con SHA correcto: persistencia
   de esa referencia comprobada en ese reinicio, no garantía general de recuperación.
   [Recibo](evidence/deletion-expanded/1789328388708787000-deletion-close.log).

El analizador [con cierre posterior](evidence/deletion-expanded/analyze_with_closure.py)
conserva `original_execution_failures_preserved` y el cierre fallido original. Solo admite
el recibo adicional para resolver CLOSURE_FAILED cuando ambos resultados de prueba son
válidos y la referencia persistida coincide con el commit B del registro original. También
comprueba que el inventario contiene únicamente rutas bajo test-a/test-b del mismo repo.
No borra/reescribe el JSONL original ni convierte una fase incompleta en completa.

VM detenida, procesos propios ausentes y socket exacto sin listeners:
[cierre externo](evidence/deletion-expanded/host-closure.json). No quedan test-a/test-b
en host ni en la rama limpia guest. Límites mantenidos: comando 1,2 s, fase 10 s, captura 30 s,
VM 45 s; el helper externo tiene 55 s nominales y hasta 30 s de limpieza. Una segunda señal puede
interrumpir su espera, de ahí la verificación externa obligatoria. No es revocación universal.

## 9. Historial y reproducción de métricas

[Bundle completo](evidence/deletion-expanded/executions.bundle),
[auditoría bare](evidence/deletion-expanded/bundle-audit.json).
SHA256: `861703a0302afbb0e566d0eb9db854cafb389b57c3a46dab3ddfc090ab736ae0`.
Tiene 11 commits: 8 históricos y 3 nuevos —preimágenes, ejecución A y ejecución B—.

- Preimágenes: 35a0be4263f290538f8ee740fcb25b13aa67e62d.
- A: fc49a4fd4388a722b9f45eb03d36bef07f909ad0.
- B/rama `sentinel-deletion-expanded-v3`: d0ed78474caa09fd9e21265f24af1e55864e22a9.
- Rama limpia: 56d42403eba5f96a2effc55f17c015eb5ef36867.

Desde la raíz del proyecto, recalcular métricas sin ejecutar cargas:

```sh
python3 -B 'docs/prompts-output/[01-4]/evidence/deletion-expanded/analyze_with_closure.py' \
  'docs/prompts-output/[01-4]/evidence/deletion-expanded/1789328068464235000-deletion-expanded.log' \
  'docs/prompts-output/[01-4]/evidence/deletion-expanded/catalogue.json' \
  'docs/prompts-output/[01-4]/evidence/deletion-expanded/1789328388708787000-deletion-close.log'
```

Los commits pertenecen al repo guest; .git y rama main del host no se modificaron.
Trabajo previo preservado. Los scripts de ensayo son de una ejecución admitida concreta;
no repetirlos por inercia ni convertirlos en hooks productivos.

## 10. Qué mejorar a partir de los tests

| Evidencia correlacionada | Carencia que debe resolver un diseño futuro |
|---|---|
| Dispatch/rutas/find/xargs: 1–18 | Un filtro textual de rm no basta. Aplicar el control al efecto y al objeto resuelto, independientemente de la sintaxis o herramienta. |
| Redirecciones/utilidades/staging: 19–33 | Cubrir apertura truncante, escritura destructiva, reemplazo y borrado recursivo. Si se adopta versionado/COW, denominarlo recuperación y custodiar preimágenes fuera del escritor. |
| APIs/descriptores/asíncrono: 34–45 | Incluir escrituras y truncados por descriptor y llamadas de intérprete; una regla de shell no cubre todos los canales. |
| Ejecución dinámica/hijos: 46–50 | La autoridad del control debe acompañar a hijos, workers y código evaluado; no depender solo del comando padre. |
| Enlaces/nombres/código codificado: 51–62 | Resolver identidad real y alias, conservar la frontera en todos los canales y verificar reintentos equivalentes. |

Los rangos son agrupaciones para priorizar trabajo, no 62 soluciones separadas ni una lista
completa de capas de seguridad. **El defecto compartido actual es anterior al catálogo:
no existe un mecanismo operativo de Sentinel que impida estas pérdidas internas.** Añadir
más patrones de comandos a una lista no demostraría esa garantía. Bloquear toda escritura
también invalidaría los controles legítimos, que deben conservarse en cualquier futura B.

El código `SENTINEL-STOP-XXYY-SDS` y una regla persistente siguen siendo un refuerzo
[propuesto, sin instalar](../../../sentinel/templates/stop-rule.proposal.md): necesita una
denegación auténtica y un supervisor de reintentos/parada. No garantiza obediencia,
identidad del emisor ni cancelación de procesos ya lanzados. La ampliación no mide esto.

## 11. Riesgo, consumo y release

Severo funcional preexistente: falta protección interna y parada efectiva; destino:
**no activar ni publicar el candidato actual como protegido**, conserva NO_GO.
Moderado de laboratorio: cierre/persistencia y contabilización de directorios frente a
archivos; cierre resuelto aquí con evidencia, persistencia general todavía limitada.
No se observaron efectos críticos nuevos sobre datos reales: solo fixtures del invitado, sin
montajes host. Esta observación no acredita resistencia a adversarios generales.

A nativo: 1423,003 ms; B nativo: 1191,517 ms para 62 comandos cada uno. Procesos nuevos,
orden fijo/caché no controlada: no calcular ahorro ni sobrecoste causal con esos dos valores.
Tokens/cuota de modelos: **COSTE_INCONCLUSO**, sin sesiones ni consumo por API añadido.
Se conserva [estimación local anterior](local-estimate-report.md) con sus límites.
<8 % ideal; ≥8 y <40 % permite continuar anotando; ≥40 % fuera de ampliación. La seguridad
fallida no se compensa con un coste hipotéticamente bajo. Versión publicada sigue v1.27.0,
sin release «1.3» protegida ni activación de configuración personal.

## 12. Continuidad

Ampliación terminada: 62 N-test / 62 N.md por condición, métricas auditables, historial conservado,
carpetas ausentes y VM detenida. No queda otra ejecución ni integración pendiente de este
encargo. Una futura B debe implementar y acreditar el bloqueo técnico, mantener trabajo
legítimo y pasar la misma batería; después medir clientes/modelos y parada por separado.

[Retomar actualizado](tmp/RETOMAR-SENTINEL.md). [Informe anterior, conservado](deletion-final-report.md).
