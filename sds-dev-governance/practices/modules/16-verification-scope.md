# Modulo 16 — Alcance de verificacion: escaladores, reuso avanzado y calibracion

Modulo condicional de `practices/16-verification-proportionality.md` (la raiz es el unico entrypoint
numerado). Cargar SOLO ante candidato V3/V4, superficie critica, disputa de alcance o reutilizacion
dudosa de evidencia. No es una practica numerada.

## Disparadores objetivos de V4

Aplica V4 cuando se verifica al menos uno:

1. Config, bootstrap, build, runtime o dependencia con alcance transversal.
2. Middleware, base class, libreria interna o infraestructura consumida globalmente.
3. Refactor amplio sin equivalencia local demostrable.
4. Migracion o cambio de esquema con consumidores no completamente enumerables.
5. Autenticacion, autorizacion o aislamiento implementado en capa global.
6. Contrato publico o compartido con consumidores dispersos o externos.
7. Interaccion nueva entre dominios previamente independientes.
8. Fallos dirigidos que revelan blast radius inicial incompleto.
9. Imposibilidad de acotar el impacto tras el descubrimiento minimo.
10. Gate de release/CI o politica del proyecto que exige ejecucion autoritativa completa sobre el
    commit final.

Distinguir y registrar el tipo: V4 por riesgo real, por obligacion externa o por incertidumbre
residual. Ninguno de estos es disparador: cierre final, `LEVEL 3` documental, numero de fases o
ficheros, suite rapida, miedo, falta de familiaridad sin descubrimiento previo.

## Descubrimiento minimo de impacto (obligatorio antes de escalar por duda)

1. Enumerar comportamientos modificados, no solo ficheros.
2. Localizar productores y consumidores de los simbolos/contratos/interfaces tocados.
3. Identificar campos, invariantes, consultas, transacciones o eventos afectados.
4. Identificar modulos compartidos, middleware, politicas, config o rutas comunes.
5. Localizar las suites que prueban esos caminos (los tests son consumidores estaticos:
   buscar los identificadores modificados, antiguos y nuevos, en las ubicaciones autoritativas de
   tests; un grep sin resultados NO demuestra ausencia — helpers, fixtures, snapshots e indireccion
   existen; preferir grafo/manifiesto si el proyecto lo tiene).
6. Determinar si existe frontera razonable del impacto.

Solo si la frontera sigue sin ser fiable: V4, reducir el cambio, o `PARTIAL`/`NO VERIFICADO`.

## Incorporacion de consumidores (senal, no condena)

Compartir tabla, servicio, controlador, modulo o directorio sirve para DESCUBRIR caminos, no para
incluir automaticamente todos sus tests. Un consumidor entra al alcance cuando el cambio puede
afectar una propiedad que usa: campo o estructura; contrato consumido; invariante de negocio;
semantica de lectura/escritura; transaccion o lifecycle; errores o estados recibidos; autorizacion
o aislamiento dependiente; side effect observable; configuracion compartida.

Ejemplos no normativos: anadir columna nullable no obliga a correr todos los tests de la tabla;
cambiar el significado de un estado de negocio si obliga a verificar sus consumidores; invocar un
servicio compartido sin modificar su contrato no arrastra a todos sus consumidores; modificar el
propio servicio compartido puede elevar a V3/V4.

## Tabla de modalidades

Solo con herramienta autoritativa existente en el proyecto (ausencia = `N/A`; no instalar salvo que
el tooling sea el producto explicito del cambio).

| Senal del cambio | Evidencia minima esperada |
|---|---|
| Sintaxis, tipos, formato, estructura | Estatico: compilacion, type-check, lint equivalente |
| Logica local | Tests unitarios o de componente |
| Contrato API, esquema, serializacion | Tests de contrato/integracion de productores y consumidores afectados |
| Persistencia, consulta, transaccion, migracion | Tests de datos, migracion, rollback o invariantes aplicables |
| Flujo visible para usuario | Smoke funcional o E2E dirigido del recorrido modificado |
| Auth, autorizacion, permisos | Casos positivos, negativos y de aislamiento tenant/rol |
| Asincronia, eventos, colas | Productor, consumidor, idempotencia, reintento, entrega |
| Config global, build, dependencias | Verificacion de build/instalacion y alcance transversal justificado |

Las modalidades no se acumulan automaticamente: solo las necesarias para los riesgos modificados.
Un smoke E2E dirigido puede ser la evidencia correcta de un cambio visual pequeno; una suite
unitaria completa puede no observar ese recorrido.

## Reuso avanzado e identidad de estado

- Orden de identidad: commit exacto + arbol limpio (preferido); fingerprint determinista del
  contenido SOLO si el proyecto ya posee un mecanismo (no disenar uno); arbol sucio sin fingerprint
  = evidencia local al checkpoint, irreutilizable despues.
- Un run local registrado con estado exacto es evidencia de primera clase; no depende de que exista
  CI. `Environment` (runtime, gestor, plataforma, config material) se registra solo ante drift,
  reuso entre agentes/entornos o herramienta sensible al runtime.
- Matriz momento/regla: baseline = reactiva (raiz); checkpoint = delta desde evidencia anterior;
  sin delta ejecutable = V0 estructural; integracion entre fases = solo si crean o modifican una
  relacion entre superficies; cierre = solo riesgos del estado final no cubiertos; cierre ya
  cubierto = `REUSED`, cero rerun; release/CI = una unica ejecucion autoritativa sobre el estado
  final exacto. Una fase no adquiere derecho a suite por estar numerada.

## Anti-gaming

Prohibido:

1. Elegir V4 para evitar analizar el blast radius.
2. Elegir V1 describiendo el cambio solo como "pocos ficheros".
3. Enumerar ficheros sin identificar comportamientos.
4. Usar "misma tabla/directorio" como inclusion automatica.
5. Dividir el trabajo en fases para esquivar una verificacion de interaccion necesaria.
6. Repetir una suite sobre el mismo estado presentandola como evidencia nueva.
7. Alegar evidencia reciente sin identificar el estado cubierto.
8. Justificaciones genericas aplicables a cualquier cambio.
9. Ejecutar suite completa para compensar tests dirigidos que deberian existir.
10. Usar proporcionalidad para omitir verificaciones exigidas por otro contrato activo.

## Calibracion y ledger (derivado; coste cero por prompt)

La practica opera en `PROVISIONAL_CALIBRATION`. El ledger
`docs/governance/evaluation/verification-proportionality-ledger.md` NO se mantiene prompt a prompt:
se genera/actualiza solo al calibrar, cosechando los registros `Verification:` existentes en
`docs/prompts-output/` (una fila `VENTRY | prompt | max-V | full-suite-used | escalation |
unique-failure | notes` por prompt cerrado; cabecera `reviewed_through`; contador
`grep -c '^VENTRY |'`). Al abrir un cambio de gobernanza, contar cierres no cosechados:
`>= 10` activa `CALIBRATION_DUE` y la revision es gate de ESE cambio de gobernanza — nunca bloquea
cierres de producto. La revision corrige en ambas direcciones: infra-verificacion y escaladas
innecesarias. No crear un segundo sistema de metricas fuera de `docs/governance/evaluation/`.
