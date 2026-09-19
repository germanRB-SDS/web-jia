# Corrección del supervisor — 2026-09-13

Estado: **fallo sintético reproducido y corregido**. 11/11 tests PASS con Python 3.14.6
y 11/11 con Python 3.8.10, en el contexto gestionado actual sin escalación. No se ha arrancado
la VM ni ejecutado una campaña Sentinel. El bloqueo de arranque se conserva hasta evaluar
la revisión para VM y verificar las condiciones de aislamiento/custodia; S0/S7 siguen pendientes.

## Causa y evidencia

El propietario aportó 3/5 PASS y dos EPERM desde su Terminal con pyenv Python 3.8.10:
los mismos casos de límite de salida y timeout que fallaban en el ensayo previo. Esto no
permitía atribuir el fallo únicamente a restricciones de Codex o a la versión de Python.

Reproducción mínima local observada en esta corrección, con un proceso Python propio en
sesión nueva y sleep(5): SIGTERM enviado correctamente; tras 0,25 segundos SIGKILL devuelve
errno 1; wait devuelve -15 (terminación por SIGTERM); killpg(pgid, 0) después de wait devuelve
errno 3 (ESRCH). Es resumen de salida de herramienta, no un log raw reconstruido.

El supervisor anterior enviaba TERM, esperaba dos segundos y enviaba KILL antes de recoger
el estado del hijo en las rutas de límite/timeout. Un hijo terminado pero no recogido podía
mantener el grupo como zombie. El código público de Apple en
[killpg1](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_sig.c)
excluye SZOMB en el filtro del grupo y devuelve EPERM si no encuentra miembros elegibles.
Esto concuerda con la reproducción; no se ha identificado el commit exacto del kernel instalado.

La corrección resuelve el mecanismo reproducido, no demuestra que cualquier EPERM sea benigno.
Los errores históricos siguen conservados; esta evidencia sustituye la hipótesis de que fuera
necesario cambiar de contexto/permisos para resolver estos dos casos sintéticos.

## Cambio y verificación

- `sentinel/tart_host.py`: recoge el estado del hijo durante la espera y exige ausencia de
  todo su grupo mediante ESRCH. Mantiene TERM/KILL para grupos propios vivos. Tras una señal
  denegada solo recoge/observa: EPERM persistente o grupo todavía presente produce error.
  El pipe se cierra también si falla el cierre del grupo.
- `tests/test-sentinel-tart-host.py`: conserva cinco tests y añade seis para hijo terminado,
  descendiente que ignora TERM tras salida del padre, carrera salida/señal, denegación real
  de señal, denegación de observación y supervivencia tras KILL. Las denegaciones se simulan;
  los tests de cierre crean grupos Python reales y comprueban ESRCH.
- [Python 3.14](evidence/supervisor-fix/test-results.json): 11/11, 2,842 s según unittest.
- [Python 3.8](evidence/supervisor-fix/test-results-python38.json): 11/11, 2,803 s según unittest.
  Se utilizó el ejecutable pyenv de la salida del propietario, desde el contexto gestionado;
  no se afirma haber ejecutado una nueva prueba dentro de su Terminal.
- Sin ResourceWarning en ambas salidas. La primera pasada del nuevo test de descendiente
  esperaba incorrectamente timeout aunque el padre salía con 0: expectativa corregida,
  conservando cierre del grupo y cota temporal; resultado inicial y hashes preservados.

[Revisión exacta](evidence/supervisor-fix/revision.json) y
[admisión de evaluación sintética](evidence/supervisor-fix/admission.md). El ledger añade
solo ese modo de prueba; no amplía la admisión Tart para ejecutar la VM. Los tests no cubren
descendientes que abandonen el grupo, procesos Tart reales ni custodia exterior frente al sujeto.

## Continuación

Ya no es necesario repetir el diagnóstico antiguo para pedir otro ejecutor. Antes de habilitar
arranque hay que revisar/admitir esta revisión para el contexto exacto de VM y comprobar parada
de Tart/helpers, NIC efectiva, ausencia de shares/secretos y separación sujeto/supervisor/E.
Después implementar/verificar el backend y ejecutar A/B/restauración/A2/B2.

Sobrecoste requerido: **inferior al 8 %**, sin obligación de ahorro. Permanece sin medir;
estos tiempos de tests no son latencia operativa A/B ni se convierten en protección Sentinel.
