# Sentinel — Codex en el laboratorio sin credenciales

2026-09-13. **Transporte nativo guest observado: handshake, ready, pwd exacto y EOF con
exit0. Binario persistente comprobado tras reinicio; VM detenida.** Es una comprobación
administrativa: no acredita custodia, Sentinel B ni comparación A/B.

[Resultado final](evidence/exec-identity/result.json), [cierre](evidence/exec-identity/closure.json)
y [revisión](evidence/exec-identity/review.md). Tiempo de captura10,911s; cierreVM45,240s
por timeout previsto. La orden declaró sandboxType:none: no representa el brazo A con
sus controles nativos ni B con Sentinel. Auth transferida0, sesiones modelo0, A/B0.

El ejecutor declara release0.0.0 (desconocida), distinta de la CLI0.154.0 comprobada y
del hash binario fijado. Se conserva executor_version_unknowntrue y compatibilidadfalse;
providerId no es atestación. El fallo previo por esa discrepancia permanece en su evidencia.

Los apartados siguientes conservan la secuencia de observaciones y revisiones.

Se transfirió el ejecutable Codex0.154.0 ya instalado (222655232bytes) por stdin de Tart
hacia una carpeta nueva de la VM. Hash SHA256 comprobado antes de ejecutar y coincidente
con el host; `--version` devolvió `codex-cli 0.154.0`. Exit0 en11,016s. Se dejaron
binario/estado propios al finalizar la transferencia en `/private/tmp/sds-sentinel-client.gXPEva` dentro de la VM.

El supervisor terminó por su plazo45s (exit124 esperado), y después la VM estaba stopped.
Los tres procesos propios y el propietario del socket exacto estaban ausentes al observar.
[Evidencia completa](evidence/codex-transport/result.json), [cierre](evidence/codex-transport/closure.json)
y [revisión independiente](evidence/codex-transport/review.md).

El supervisor ahora admite stdin regular opcional para esta transferencia fijada; su
comportamiento habitual sigue DEVNULL. Validación: suite18 PASS antes del último caso
de recibo de excepción, seguida de2 pruebas dirigidas PASS con solapamiento. No sumar20
como suite distinta. El comparador conserva42 PASS previos; no se reejecutó sin delta.

La autenticación ya está aclarada: cuenta ChatGPT, candidato Codex/gpt-6-astra/high.
La petición anterior de cliente/autenticación/presupuesto no es un bloqueo genérico.
No se transfieren credenciales personales, config API ni compras de créditos. Cuota,
saldo y coste monetario reales desconocidos; no atribuir coste cero a la suscripción.

La vía candidata mantiene el controlador autenticado fuera de la VM y utiliza un ejecutor
por stdio dentro. El schema nativo y el código oficial permiten preparar esa vía, pero
no demuestran aún custodia ni routing sin ejecución local alternativa. `command/exec`
del app-server no selecciona environmentId: no emplearlo como prueba de routing remoto.
[Fuentes y discrepancias](evidence/exec-transport/sources.md).

Conservar: v2 alteró un canario prohibido por FD9 heredado; v3 y la sonda de superficies
solo cubren los casos documentados. S0 completo, custodia runtime, privilegios, egress
general, procesos/FD previos, revocación y rollback/S7 siguen pendientes. El intento de
ayuda Tart con entorno habitual produjo un rechazo de acceso al cache del host; las
operaciones reales usaron el entorno del supervisor admitido. Ayuda/schema de Codex
avisaron de alias PATH, sin cambiar configuración para evitarlos.

Política de consumo vigente: <8 % ideal; >=8 % y <40 % permite continuar y anotar el exceso;
>=40 % queda fuera de esa franja adicional. Estos ensayos administrativos sin modelo
no miden sobrecoste A/B: no hay denominador comparable y el coste sigue inconcluso.


La sonda nativa posterior devolvió78 en10,245s y no produjo salida, antes de PROBE_ROOT:
falló una comprobación de Node o del binario transferido. Se conserva como
FAIL_PRECONDITION_UNLOCALIZED en [resultado](evidence/exec-transport/result.json).
No se acredita handshake, proceso remoto ni persistencia del directorio temporal guest
entre reinicios. En ese punto, la siguiente prueba era únicamente diagnóstico de esas precondiciones.
Cierre posterior verificado: stopped, timeout45,080s esperado, objetivos propios ausentes.

Observador sintético:2 métodos con13 escenarios PASS12,798s. Primera pasada FALLÓ porque
el generador Python producía sufijos temporales con '_' y la sonda exige alfanuméricos,
como mktemp guest. Se corrigió el fixture, sin relajar el guard; log inicial retenido.
La revisión también exigió validar envelopes/secuencias, sandboxDenied y process/closed.


Diagnóstico read-only posterior: Node correcto; root/codex/state en /private/tmp ausentes.
Consistente con el guard del fallo anterior, cuyo instante carece de diagnóstico. No se
ha probado el mecanismo de desaparición. Corregido a root guest nuevo owner-only en
/Users/Shared/sds-sentinel-client-4f85982624b3, nunca sobrescribe un existente; fsync propio.
Staging exit0 en12,856s y **presencia/hash comprobados tras reinicio**.

La sonda posterior llegó a arrancar Codex pero la CLI devolvió2 antes de inicializar:
--exit-on-stdin-close requiere modo remoto. Observer78, sin falso PASS. Se conserva
[evidencia](evidence/persistent-client/result.json). La fuente oficial confirma ese
requisito; candidato nuevo elimina el flag manteniendo deadlines y comprobación de EOF,
sin añadir remote ni autenticación. En ese punto quedaba pendiente una sonda nativa válida.


Revisión final de identidad: handshake+ready observados en la revisión anterior, que
falló antes de pwd por comparar releaseCLI con executorVersion0.0.0. Fuente oficial define
0.0.0 como desconocida. Nuevo prerregistro permite esa declaración solo para el build
observado y el hash binario fijado, manteniendo el dato desconocido y compatibilidadfalse.
La nueva ejecución obtuvo pwd exacto, salida/exit/closed coherentes y EOF/exit0 sin señal.
No se reclasifica ninguno de los fallos anteriores. Testsdelúltimodelta:2 métodos14 casos
PASS; deadline12s anterior se reutiliza sin delta, no suma una suite nueva.

Siguiente trabajo independiente: controlador aislado sin auth y selección de entorno
remoto, demostrar fallo del canal sin ejecución alternativa en host, proteger configuración
real/custodia, y ampliar S0/rollback. Solo después preparar loginChatGPT y sesiones A/B
comparables, con controles nativos conservados en A. No falta dato del usuario para esa
preparación. No volver a transferir el binario a la ruta persistente ya existente.
