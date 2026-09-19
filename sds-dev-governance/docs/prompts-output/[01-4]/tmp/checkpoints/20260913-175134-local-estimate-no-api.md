# Sentinel — estimación local sin API ni presupuesto monetario

Timestamp:2026-09-13T17:51:34.058365+00:00. Autorización persistente, sin confirmaciones genéricas.
Anterior técnico completo: [transporte](20260913-171631-codex-transport.md).

## Precisión del propietario

«Codex/gpt-6-astra y Claude con fable pero sin euros, sin consumo por api. Estimación
realista en local. Si puedes, sino estimación.» No preguntar euros, API key ni identidad
exclusiva como bloqueo para estimar. No activar API, créditos extra o facturación nueva.
Codex: cuentaChatGPT confirmada, gpt-6-astra solicitado. Claude: fable solicitado,
settingsmodel observado claude-fable-5-1[1m]; solo ese campo, no credenciales. Método
Claude/cuota/modeloefectivo no verificados; innecesarios para la estimación actual.

## Entrega de esta continuación

[Informe](../../local-estimate-report.md), [raw](../../evidence/local-estimate/result.json),
[prerregistro](../../evidence/local-estimate/preregistration.json),
[verificación](../../evidence/local-estimate/verification.json).
Fuente tests/estimate-sentinel-local.py:4condiciones códec puro,9pares2000iteraciones
por condición,200warmup; baselinefunciónvacía, NO clienteA. En proceso, no sesiones.
Medianas delta últimas:Codex vacío0.170µs/aviso2.588µs; Claude0.183µs/2.599µs.
No cliente ni modelo invocados. Caracteres167/bytes169/wire290 observados para avisoR3.
Sin tokenizador utilizado/calibrado. Heurística explícita2–4chars/token:42–84 por aviso.
Escenarios NO calibrados para modelos/cuotas: A hipotético10000tokens,1aviso1lectura
0.42–0.84 %;5avisos5lecturas10.5–21 %;10avisos5lecturas21–42 %;1aviso+2000otros
extratokens20.42–20.84 %. Nunca sumarlos ni presentar0avisos como0costeSentinel.
Los2000tokens excluyen aviso ya contado. Rango puede quedar fuera del valor real;
no es confianza ni predicción validada. Consumo/modelo, cuota, dinero y porcentajeA-B null.
Observación inicial preservada: cambios posteriores precisan metadata, sin borrar historia.

Runbook/contract/evaluation/docsgobernanza actualizados con restricción sinAPI/sin€ y
fallback a estimación. Ningún cambio funcional Sentinel ni API ni nueva VM ni auth ni .git.
Comparador42PASS anterior no se reejecutó: sin delta. No se suman pares/testrepetidos como
sesiones independientes. Cada modelo necesitará su parejaA/B, no comparar CodexcontraClaude.

## Estado real y continuación

Última VMstopped y procesos/socketpropios ausentes en exec-identity/closure.json, sin
nuevos arranques desde entonces. Binario guestpersistente /Users/Shared/sds-sentinel-client-4f85982624b3/codex; no repetir stage sobre ruta existente. Transportepwd previoPASSadmin,
sandboxType:none; noA/noB. FallosFD9, temporalesausentes,CLIflag yrelease0.0unknown intactos.
S0/S7/custodia/routing/rollback y A/B reales todavía pendientes; no relajar barreras por
aceptar estimación. <8 %ideal,>=8 y<40permite seguir/anotar;>=40fueraampliación.

Continuar trabajo local independiente según checkpoint técnico. Si no puede medirse
modelo real sin API/gastoextra y con separación efectiva, entregar/afinar estimación;
no volver a bloquear por presupuesto euros. Para futurospilotos, verificar acceso de
suscripción sin fallback a cobroextra y contadores comparables, oráculos de tarea y A
con controlesnativos antes de iniciar sesiones. No copiar credenciales personales.
