# Sentinel — criterio económico revisado

2026-09-13. LEVEL3 security/medición, continuación01-4. Estado PARCIAL de campaña.
Este delta complementa el [informe completo](s0-surfaces-report.md); no reescribe evidencia pasada.

## Decisión autorizada

Propietario: mensaje actual en conversación. Clasificación MODIFICATION: el8 % deja de
ser límite de aceptación/parada y pasa a objetivo ideal. >=8 % y<40 % permite continuar
analizando, anotando consumo y exceso en resultados y conclusiones. >=40 % queda fuera
de esa ampliación, a revisar antes de nuevas sesiones de ese coste; continúa lo independiente.
Contrato primero: [runbook](../../../sentinel/runbook.md), después código/tests/docs.
Datos faltantes o A=0 siguen indefinidos. No cambia seguridad, integridad ni restauración.

## Implementación y verificación

`relative_overhead` mantiene porcentaje/comparador8, añade comparador40 y banda descriptiva.
No autoriza gasto ni controla ejecución; latencia no acredita coste monetario.
42 tests PASS y revisión independiente sin pendientes. Límites8/40, intermedios, nulos,
A=0, rango numérico, preservación de errores y coste global inconcluso cubiertos.
[Verificación/huellas](evidence/cost-policy/verification.json), [tests](evidence/cost-policy/tests.log).
Verification: V3 | observaciones→pairing→bandas→JSON +42 tests +revisión | PASS del delta.
Reuso S0/supervisor sin cambios; no nueva VM ni sesiones con modelo. Pruebas no son gasto real.

## Acceso explicado y decisión técnica

Candidato inicial: Codex CLI0.154.0 resuelto en host, configuración gpt-6-astra/esfuerzo high.
El agente puede preparar esa combinación sin volver a pedir elegir cliente/modelo. No implica
cliente instalado ni configuración efectiva en VM.
Codex permite login ChatGPT para acceso de suscripción o clave API para facturación por uso:
[fuente oficial](https://learn.chatgpt.com/docs/auth), consultada2026-09-13; ayuda local coincide.
Respuesta posterior del propietario: entra con cuenta ChatGPT. Método resuelto; no pedir
clave API ni repetir la pregunta. Preparación concreta en el runbook actualizado.
Autenticación de laboratorio = acceso separado/protegido; no significa automáticamente
otra cuenta ni contratar otra suscripción. No copiar auth.json, leer almacenes privados ni
habilitar acceso mientras falten custodia/conectividad admitidas. El login concreto aún no
está preparado: no solicitar aprobación de una operación hipotética.
Si existe facturación adicional, concretar tope absoluto al preparar la opción concreta.
El porcentaje extra relativo no identifica el importe total. Si se usa cuota incluida,
informar consumo de cuota/tokens disponible sin inventar coste facturado en euros.

## Riesgos y continuidad

Sin nuevos críticos observados en este delta offline. Severo conservado: confundir una banda
de tiempo con presupuesto o con S7; `COSTE_INCONCLUSO` se mantiene. Moderado: estimaciones
deben declarar método, denominador, alcance e incertidumbre y nunca ocultar exceso sobre8 %.
Fallo FD v2 y límites S0 anteriores intactos. VM permanece en último estado observado stopped.
Continuación: [entrada vigente](tmp/RETOMAR-SENTINEL.md). Sin commits, `.git` solo lectura.
