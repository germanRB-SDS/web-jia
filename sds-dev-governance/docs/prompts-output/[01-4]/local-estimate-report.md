# Sentinel — medida local y estimación sin API

El propietario selecciona **Codex/gpt-6-astra y Claude/Fable**, sin presupuesto en euros
ni consumo por API. Acepta estimación si no se puede medir realmente. Se ha medido el
componente local disponible y calculado escenarios explícitos; **el sobrecoste total A/B
de los modelos sigue desconocido**. Ninguna nueva sesión experimental de modelo ni VM en esta fase. Los contadores del
ensayo excluyen esta conversación de construcción y su revisión; no afirman consumo
total cero de la asistencia.

La configuración local de Claude declara `claude-fable-5-1[1m]`; se leyó solo el campo
model de settings, sin credenciales/historial. Configuración no acredita modelo ni
autenticación efectiva. Codex con cuenta ChatGPT ya fue confirmado por el propietario.
La autenticación de Codex por suscripción es distinta del acceso con clave API según
[OpenAI](https://learn.chatgpt.com/docs/auth). En Claude, las cifras de coste calculadas
para API no son la factura de un suscriptor; cuota y gasto adicional son conceptos
distintos según [su documentación](https://code.claude.com/docs/en/costs).
No se consulta saldo, se activa crédito, se invoca API ni se ejecuta /insights.

## Medición real del componente local

[Fuente reproducible](../../../tests/estimate-sentinel-local.py),
[prerregistro](evidence/local-estimate/preregistration.json) y
[datos completos](evidence/local-estimate/result.json).
Python3.14.6 en el host;9 pares alternados por condición,2000 llamadas por brazo/par,
200 llamadas de calentamiento por brazo. Son pares temporales dentro de un proceso,
no nueve sesiones independientes. El baseline es una función vacía: **no es A
con los controles nativos del cliente**. Se informa diferencia mediana por llamada:

| Función medida | Códec Codex | Códec Claude |
|---|---:|---:|
| Validar evento y devolver vacío | 0,170 µs | 0,183 µs |
| Construir y serializar un aviso de denegación | 2,588 µs | 2,599 µs |

Estas columnas son rutas de un mismo helper Python, no ejecuciones de GPT o Fable.
La diferencia no demuestra que un cliente/modelo sea más rápido. No incluye arranque
de procesos, hooks reales, IPC, disco, resolvedor de permisos, snapshots o rollback.
No usar estas duraciones para inferir porcentaje de tiempo de sesión o seguridad.

El retorno permitido del códec contiene0 bytes. El aviso de pérdida de contenido sobre
`fixtures/report.md` tiene167 caracteres/169 bytes UTF-8; la envoltura JSON tiene290 bytes.
No se ha utilizado ni calibrado un tokenizador: **no se ha medido el número de tokens**.
Tampoco se ha observado qué parte de la respuesta entregaría cada cliente al modelo.

## Estimación provisional: sensibilidad, no predicción validada

Para dimensionar únicamente el aviso, se supone2–4 caracteres por token:
`ceil(167/4)` a `ceil(167/2)` = **42–84 tokens por lectura**.
Es una heurística deliberada; el valor real puede quedar fuera. No es un intervalo
estadístico ni un límite acreditado para gpt-6-astra o Fable.

Ejemplos con **A hipotético de10000 tokens totales**. Los avisos se consideran texto nuevo
solo en B; si A ya produciría su propio aviso, habría que descontarlo. Se cuenta texto
releído, sin convertirlo a cuota ponderada/caché o dinero. La fórmula de cada escenario es
`avisos × lecturas_por_aviso × tokens_por_aviso + tokens_extra_asumidos`.

| Supuesto de escenario | Tokens adicionales estimados del componente | Proporción sobre A hipotético |
|---|---:|---:|
| Ningún aviso | 0 | 0 % del texto de avisos; no del sistema completo |
| Un aviso leído una vez | 42–84 | 0,42–0,84 % |
| Cinco avisos leídos cinco veces cada uno | 1050–2100 | 10,5–21 % |
| Diez avisos leídos cinco veces cada uno | 2100–4200 | 21–42 % |
| Un aviso y un turno adicional supuesto de2000 tokens | 2042–2084 | 20,42–20,84 % |

Los10000/2000 tokens y las relecturas son **supuestos**, no sesiones observadas. Los2000 tokens
del turno adicional excluyen el aviso ya contado; no se duplica ese componente. No se suman los
escenarios. El coste de construcción de Sentinel tampoco se mezcla con su funcionamiento.

Conclusión provisional: serializar el aviso añade poco trabajo local en este helper;
su texto aislado es corto. Relecturas, razonamiento y turnos extra pueden dominar el consumo.
No hay base para prometer «Sentinel consume menos del8 %» ni estimar una cuota real por
modelo. El mismo escenario se aplica a ambos modelos por falta de calibración diferenciada.
Son desconocidos el contexto inicial adicional, framing efectivo, tokenizador, caché,
razonamiento, reintentos, cambios de conducta, utilidad y oráculos A/B.

## Continuación y límites conservados

El8 % sigue siendo ideal. Una observación comparable >=8 y<40 permite seguir y anotarla;
>=40 queda fuera de la ampliación. Un escenario que cruza40, como el de diez avisos,
se registra como sensibilidad que requiere revisión; no es un consumo real ni detiene
la estimación independiente. No se activa facturación para resolver incertidumbre.

Para medición real futura: como piloto inicial, una pareja A/B por cada cliente/modelo,
sin suficiencia confirmatoria; tamaño y ciclos posteriores deben prerregistrarse. Mismas tareas,
controles nativos de A conservados, misma configuración de modelo/esfuerzo/caché y contadores
nativos correlacionados. Antes se requieren custodia, routing y los pendientes de S0/S7;
la cuenta de Claude tendría que acreditar modo suscripción sin consumo extra. No hace
falta pedir ahora autenticación dedicada ni presupuesto en euros para esta estimación.

El transporte previo sigue acreditando solo pwd administrativo con sandboxType:none;
la VM conserva el último cierre verificado, sin nuevos arranques. Permanecen los fallos
FD9, temporales ausentes, flag CLI inválido y versión del ejecutor desconocida, así como
los límites de custodia, contención, revocación y rollback. Ver
[checkpoint anterior](tmp/checkpoints/20260913-171631-codex-transport.md).
