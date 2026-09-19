# 16 — Proporcionalidad de verificacion

## Problema que resuelve

Sin regla de alcance se ejecutan suites completas por ritual o se verifica solo lo tocado literal.
La sobre-verificacion quema tiempo y contexto sin cubrir hipotesis nuevas; la infra-verificacion
ignora consumidores y contratos afectados.

## Regla central

Cada ejecucion debe responder a un riesgo concreto aun no cubierto por evidencia vigente. Ni tamano
de suite, ni numero de tests, ni la existencia de un checkpoint la justifican por si solos.

## Carga condicional

APLICA: decidir alcance de tests/smokes; checkpoint o cierre con evidencia automatizada; debate
sobre suite completa; reclamo de reuso de evidencia. NO APLICA: consultas sin cambios, redaccion no
ejecutable, tareas sin evidencia automatizada. Cargar `practices/modules/16-verification-scope.md`
SOLO ante candidato V3/V4, superficie critica, disputa o reuso dudoso.

## Escala de amplitud (solo amplitud; las modalidades van aparte)

| Nivel | Criterio |
|---|---|
| V0 | Sin delta ejecutable (docs, comentarios). Solo validaciones estructurales pertinentes |
| V1 | Cambio hoja/local sin contrato ni consumidor compartido. Tests directos |
| V2 | V1 + consumidores/proveedores inmediatos identificables |
| V3 | V2 + dominio compartido (contrato/dato/servicio) con consumidores enumerables, verificados dirigidamente |
| V4 | Impacto global o no acotable tras descubrimiento. Maximo alcance autoritativo pertinente, no "todos los repos" |

Modalidades (estatico/unit/contrato/integracion/datos/smoke/E2E): solo las que el riesgo exige y
solo con herramienta autoritativa existente (ausencia = `N/A`; no instalar). Tabla en el modulo.

## Algoritmo por checkpoint

1. Delta de comportamiento desde la ultima evidencia aplicable; sin delta ejecutable, V0.
2. Si evidencia vigente cubre estado y alcance: `REUSED`, no repetir.
3. Amplitud V1-V4 segun la escala.
4. Modalidades necesarias.
5. Escaladores: superficies criticas y disparadores V4 (modulo).
6. Ejecutar el minimo suficiente; registrar.
7. Fallo fuera del mapa: recalcular y escalar si el mapa era corto; nunca "todo" automatico.

Fast path V0/V1: sin descubrimiento extendido. V1 exige dos comprobaciones baratas: superficie no
compartida, y busqueda de los identificadores modificados (antiguos y nuevos) en las ubicaciones
autoritativas de tests del proyecto — los tests tambien son consumidores. Registro en una linea.

## Evidencia

- Identidad: commit exacto con arbol limpio = reutilizable; arbol sucio = valido solo para el
  checkpoint actual. Un commit sin delta de contenido no invalida evidencia del contenido identico.
- No-change, no-rerun. Un superset verde posterior satisface los alcances que contiene. Un delta
  invalida solo lo relacionado: comportamiento, caminos, contratos, entorno material.
- Baseline reactiva: solo ante fallo de atribucion dudosa, drift, cambio critico/global o mandato;
  ejecutar en la base solo la parte preexistente comparable del alcance previsto.
- Repetir solo por: investigacion de fallo, flake, cambio material de entorno, evidencia invalida,
  mandato contractual o run autoritativo final. Registrar la excepcion.
- Fallo seguido de exito en estado identico = `FLAKY-SUSPECT` (sospecha de inestabilidad, no
  absolucion); conservar ambos resultados.

## Ampliaciones y superficies criticas

Toda ampliacion sobre V1 nombra la regresion plausible aun no cubierta con un camino concreto
(cambio, dependencia, comportamiento, test). Invalidos: "por si acaso", "es el cierre", "tarda
poco", "siempre se hizo asi". Superficies criticas (auth, permisos, aislamiento de tenant,
migraciones/datos, contratos publicos, pagos, secretos, modulos globales, build transversal,
rollback): nunca cierran en V1; normalmente V3; V4 solo si ademas son globales o no acotables.

## Registro

Siempre: `Verification: V<n> | <evidencia> | PASS|FAIL|PARTIAL|NOT VERIFIED`. Campos condicionales:
`Delta`/`Paths` (V2+, al menos un camino), `Trigger` (V4), `Reused` (al reclamar), `Excluded` (solo
alcance mayor evaluado y descartado), `Environment`/`State` (solo materiales o al reclamar reuso).
Sin ensayos justificativos.

## Relaciones

La practica 06 decide QUE coherencias no pueden degradarse; esta decide CUANTA evidencia ejecutar y
CUANDO — jamas autoriza omitir lo que la 06 exige; en tension, practica 15. La 14 conserva su cierre
por checkpoint: su evidencia verde se declara con este registro. Sin equivalencia `LEVEL`-`V` (la 12
es documental). Calibracion `PROVISIONAL_CALIBRATION` y ledger derivado: ver modulo.
