# REL-2026-09-09-11 — Lectura selectiva, frescura e informe PM

Fecha 2026-09-09. Base v1.25.2/1d01279; checkpoint previo 90d1263, worktree aislado.
Implementación verde 2810ac9. Versión final preparada v1.26.0. El hub estaba inicializado y cerrado en 87266f4.
Resultado: lector y comprobación de frescura implementados, con tests en ambos Bash; adopción
opcional según tarea. **El objetivo del 75% no se alcanza en el coste completo instrumentado.**
El valor adicional del wrapper es validar selección/dependencias/revisión; nativo sigue siendo
la elección mínima para textos sencillos, cortos o lecturas completas.

## Qué se entrega y por qué

`sds-text list|get|check|index` usa códigos H2 estables, rangos físicos calculados y un snapshot
UTF-8 de hasta 2 MiB. Recupera preámbulo, requisitos y cierre de dependencias declaradas del mismo
archivo. Falta/duplicado/ciclo/fence abierto/SHA distinto/índice derivado obsoleto/presupuesto fallido
no produce stdout parcial. Límites cuentan metadatos y preámbulo; nunca recortan una sección.
Preambles H2 sin código antes del primer H2 codificado se conservan: fue necesario para soportar
el prefacio no ejecutable del dossier existente sin reescribir su evidencia.

`governance-freshness.sh` distingue pin activo, HEAD/dirty, vendored sin/con procedencia, offline,
timeout, remoto adelantado/local adelantado/divergente y ancestro desconocido. No hace fetch, pull,
checkout, instalación, OAuth ni adopción automática. Consulta remota opt-out por --offline; timeout
mata solo el grupo de procesos creado para su consulta. Git permite https/ssh/file; no remote helper
arbitrario ni HTTPS con credencial embebida. SSH exige hosts conocidos, no actualiza host keys ni
crea sockets de multiplexación. Los helpers de credenciales de Git existentes siguen bajo su propia
configuración: esto no promete que un programa externo no mantenga su caché interna.

Se conserva la gobernanza completa y las dependencias del router. Módulo lazy nuevo bajo práctica
01; prácticas 02/03/11, RULE-COVERAGE, ejemplos, preface/memory template, bootstrap prompt y checker
sincronizados por delta. Kernel e INDEX de prácticas no cambian. No se añade índice vectorial,
caché persistente, árbol arbitrario, dependencia de tokenizer a producción ni autodistribución.

## Experimento y criterio de completitud

Corpus original congelado: 50.900 bytes, 642 líneas, SHA
`e6a8f80772413938f1f9d84cd1fb0047a0350a14b47eabfbb1ea890795a55a66`; no se copia su contenido de
producto al canónico. Está conservado en el dossier del hub. El script requiere esa entrada por
--corpus y rechaza un hash distinto. Rangos esperados contrastados con su tabla publicada, no
obtenidos exclusivamente del lector nuevo. 21 secciones. Startup = AUD-00, AUD-01, MAIL-01,
MAIL-06 **y MAIL-08**, incluida la corrección posterior de Graph principal + Gmail automático.
La lectura focal añade MAIL-05; followup cobra la segunda recuperación. El control completo reutiliza
un único cat: no se inventa una segunda lectura completa para favorecer el wrapper. Control corto:
111 bytes de texto sintético, con el mismo perfil de gobernanza para aislar el efecto del método.

Tres familias comparadas: herramientas nativas (cat, awk y descubrimiento rg+awk), wrapper y un
índice derivado frío (generar, materializar, validar y extraer con sed). Cada salida nativa se coteja
byte a byte con spans esperados; wrapper conserva bytes de cada span y selecciona exactamente los
códigos auditados, añadiendo metadatos. Todos los casos: recall de spans requeridos **1,0**. Esto
no demuestra que un modelo haya elegido bien los requisitos: casos definidos por el mismo autor,
sin evaluación ciega, LLM ni revisión externa. Fences/dep/rangos inválidos se prueban aparte.

Tokenizer temporal **tiktoken 0.12.0**, encodings **o200k_base / cl100k_base**; wheels/dependencias
observadas en metrics-requirements.txt y vocabularios por hash. Python 3.14.6, macOS arm64. Ningún
texto del dossier se envió al tokenizer remoto: descarga pública de vocabularios, tokenización local.
21 repeticiones por método/caso, un warmup excluido, mediana/p95 y muestras crudas. Rerun final sin
checker/suites concurrentes del agente; no se afirma aislamiento de toda actividad del sistema.

## Resultados completos del modelo de lectura

Tokens de entrada incluyen: kernel/INDEX/skills router/adapter (6.440 o200k), prácticas aplicables
01/02/03/12/15 (8.599), guía nueva completa cuando se usa (1.468), texto de comandos y **toda** salida
recuperada (índices/metadatos/preámbulos/repeticiones). Perfil: análisis de prompt con continuidad y
autoridad contractual; no significa que una consulta casual deba cargar esas prácticas. Escalas:
input de una pasada y exposición acumulada sin caché están separadas en JSON; no son facturación.

| Caso | Método | Bytes recuperados | Input o200k / cl100k | Ahorro input o200k | Mediana / p95 ms | Llamadas locales |
|---|---|---:|---:|---:|---:|---:|
| Arranque | cat reutilizado | 50900 | 27126 / 29328 | 0.00% | 2.33 / 2.53 | 1 |
| Arranque | awk | 15420 | 18989 / 20133 | 30.00% | 3.75 / 3.89 | 1 |
| Arranque | rg + awk | 16707 | 19441 / 20612 | 28.33% | 7.62 / 8.01 | 2 |
| Arranque | wrapper | 16890 | 20955 / 22104 | 22.75% | 44.56 / 46.86 | 1 |
| Arranque | índice frío validado | 17616 | 21288 / 22456 | 21.52% | 92.31 / 94.07 | 3 |
| Focal + requisitos | cat reutilizado | 50900 | 27126 / 29328 | 0.00% | 2.35 / 2.57 | 1 |
| Focal + requisitos | awk | 18023 | 19581 / 20805 | 27.81% | 3.86 / 3.98 | 1 |
| Focal + requisitos | rg + awk | 19310 | 20033 / 21284 | 26.15% | 7.69 / 7.85 | 2 |
| Focal + requisitos | wrapper | 19740 | 21649 / 22881 | 20.19% | 44.57 / 46.05 | 1 |
| Focal + requisitos | índice frío validado | 20219 | 21887 / 23134 | 19.31% | 92.01 / 93.89 | 3 |
| Arranque + followup | cat reutilizado | 50900 | 27126 / 29328 | 0.00% | 2.34 / 2.52 | 1 |
| Arranque + followup | awk | 33444 | 23532 / 25226 | 13.25% | 9.68 / 11.49 | 2 |
| Arranque + followup | rg + awk | 34731 | 23984 / 25705 | 11.58% | 14.89 / 15.67 | 3 |
| Arranque + followup | wrapper | 36631 | 26098 / 27811 | 3.79% | 99.06 / 106.19 | 2 |
| Arranque + followup | índice frío validado | 35640 | 25733 / 27454 | 5.14% | 97.83 / 101.00 | 4 |
| Documento completo | cat reutilizado | 50900 | 27126 / 29328 | 0.00% | 2.35 / 2.48 | 1 |
| Documento completo | awk | 50900 | 27333 / 29534 | -0.76% | 5.55 / 5.89 | 1 |
| Documento completo | rg + awk | 52187 | 27785 / 30013 | -2.43% | 9.40 / 10.36 | 2 |
| Documento completo | wrapper | 56157 | 30891 / 33113 | -13.88% | 45.78 / 47.13 | 1 |
| Documento completo | índice frío validado | 53096 | 29687 / 31910 | -9.44% | 94.96 / 96.67 | 3 |
| Control corto | cat reutilizado | 111 | 15112 / 15787 | 0.00% | 2.34 / 2.62 | 1 |
| Control corto | awk | 111 | 15252 / 15924 | -0.93% | 2.35 / 2.53 | 1 |
| Control corto | rg + awk | 152 | 15321 / 15994 | -1.38% | 6.36 / 6.60 | 2 |
| Control corto | wrapper | 774 | 16921 / 17590 | -11.97% | 43.87 / 45.05 | 1 |
| Control corto | índice frío validado | 638 | 17013 / 17684 | -12.58% | 90.25 / 92.36 | 3 |

El wrapper de arranque pasa de 27.126 a **20.955 tokens o200k (-22,75%)**; cl100k -24,63%.
Bytes recuperados bajan de 50.900 a 16.890 (-66,82%), pero esa cifra no representa el coste total.
Awk alcanza -30,00% en el perfil completo y es más rápido. Con followup el wrapper ahorra solo
3,79%; leyendo todo añade 13,88%. El control corto también pierde. No extrapolar el resultado
exploratorio anterior: aquel core no incluía MAIL-08 ni todo el coste fijo/protocolo nuevo.

## Coste completo: componentes, fórmula y desconocidos

No hubo llamadas a modelos en el benchmark (0 medidas) ni acceso a factura/usage del harness.
Cada comando es una recuperación/proceso de nivel superior; varios pueden agruparse en una
llamada del harness si los códigos ya se conocen. Subprocesos internos del wrapper no se cuentan
como llamadas de herramienta; su tiempo sí está incluido. Descubrir antes de elegir puede requerir
una interacción adicional: no declarar reducción universal de llamadas frente a cat.

El JSON cobra guía de uso de primera vez, comandos reales, generación/escritura/validación de
índice, salidas y lecturas posteriores; simula además un cierre fijo de 15 tokens para comparar
sin inventar una respuesta de LLM. Unidades normalizadas = (input + cierre modelado)/1.000.000,
suponiendo 1 unidad por millón de tokens de cada tipo, sin caché. Arranque: cat 0,027141 unidades,
wrapper 0,020970. **No son dólares ni precios de proveedor.** Con precios efectivos:

`C = Tin_uncached*Pin/1e6 + Tin_cached*Pcache/1e6 + Tout*Pout/1e6 + Ctools + Coperación`.

Tin/Tout reales de la sesión, mensajes/JSON envolventes ocultos, razonamiento, caché/compacción,
latencia de modelo/red, cuotas, precio y horas de mantenimiento no están disponibles. Son
**desconocidos, no cero**. El coste monetario completo de esta conversación no se puede certificar
con estas herramientas. No presentar una extrapolación de bytes o esta simulación como factura.
La implementación añade 4 entrypoints/motores y 2 suites; ese mantenimiento debe compensarse por
reutilización y errores evitados, aún sin datos de adopción. No hay ingresos/ROI medidos.

## Aportación PM y decisión de producto

El propietario definió el problema (cargar demasiado contexto y perder requisitos), el orden seguro
(reparar antes de instalar), la independencia de productos, conservación de incubación, el objetivo
75% y la exigencia de no forzar resultados. Su corrección Graph/Gmail cambia el core de aceptación;
por eso se cobra MAIL-08. Son decisiones de alcance/aceptación observables. El agente diseñó,
implementó y midió las alternativas, registró el límite económico y mantuvo el camino nativo.
No se atribuye al propietario una revisión línea a línea, aprobación de cifras posterior, ni una
firma de PR que no ha realizado.

Orientación externa: [Stripe, Product Manager Strategic Apps](https://stripe.com/careers/listing/product-manager-strategic-apps/8122188)
expone responsabilidades de priorizar problemas con evidencia, definir métricas antes del lanzamiento
y equilibrar calidad/mantenimiento. Se aplican aquí al elegir el alcance y medir controles negativos.
[Google, Product Manager Workspace Third Party AI Controls](https://www.google.com/about/careers/applications/jobs/results/123698400200663750-product-manager-workspace-third-party-ai-controls)
relaciona métricas de producto con controles del usuario y acceso acotado para agentes; orienta la
separación entre informar frescura y adoptar una revisión. Ambas páginas se consultaron el
2026-09-09. Esta correspondencia es nuestra interpretación; ninguna compañía validó este proyecto,
su PM, el benchmark o el código. La fuente del tokenizer es
[openai/tiktoken 0.12.0](https://github.com/openai/tiktoken/releases/tag/0.12.0).

Decisión: mantener nativo como opción mínima; publicar wrapper opcional cuando SHA, dependencias,
fences y presupuesto aporten seguridad. No adoptar un índice persistente/árbol completo como
ruta por defecto: mayor coste y más estado sin mejora medida. Ante expansión de alcance, recuperar
más contexto; no optimizar omitiendo invariantes. Próximo experimento posible: tareas ciegas reales
con telemetría autorizada y coste de mantenimiento, sin declararlo ya cumplido ni imponerlo al usuario.

## Verificación, seguridad y recuperación

V3 acotado a herramientas de contexto/frescura y gates modificados. Nueve grupos del lector y seis
de frescura por Bash 3.2/5.3 PASS; precisión física LF/CRLF/Unicode, prefacio, códigos/títulos,
presupuestos, alias hoja/dispositivos/FIFO, índices obsoletos, dependencias y errores sin salida.
Frescura: local/remote temp Git, current, dirty, pin, ahead/behind/diverged/objeto desconocido,
vendored/incubación, offline, timeout, annotated tag y worktree. HEAD/index/config invariables,
sin FETCH_HEAD. Opciones SSH observadas por `ssh -G`; ninguna conexión SSH real de prueba.
Acceptance.json: cuatro suites heredadas y checker project/hub en ambos shells, 12/12 PASS.
Después de ajustes de metadatos/rangos y opciones SSH, se repitieron solo las suites afectadas.
Los tres documentos originales conservan sus SHA y se validaron con el lector; no fueron editados.

Comandos de reproducción (desde el kit, con Python/tokenizer temporal instalado según requirements):

```bash
python3 tests/test-selective-context.py /bin/bash
python3 tests/test-selective-context.py /opt/homebrew/bin/bash
python3 tests/test-governance-freshness.py /bin/bash
python3 tests/test-governance-freshness.py /opt/homebrew/bin/bash
python3 docs/prompts-output/REL-2026-09-09-11/evidence/verify-release.py
python3 docs/prompts-output/REL-2026-09-09-11/evidence/benchmark-context.py --corpus /RUTA/AL/01-analisis.md --output /RUTA/TEMP/context-metrics.json
```

- **Crítico/severo abierto:** ninguno detectado en las rutas publicadas. No hay comandos de update
  ni ejecuciones de contenido del documento. Revisión de cada archivo cambiado y APIs stdlib/CLI.
- **Severo condicionado:** requisitos semánticos omitidos por el autor/router no pueden ser inferidos
  por el lector. Mitigación: núcleo/deps explícitos y revisión del contrato; no certificar decisiones
  a partir de recall de spans. Recargar frente a ambigüedad o una instrucción posterior.
- **Moderado:** dialecto limitado, no CommonMark universal; caso no soportado usa nativo o
  normalización explícita de documento propio. SHA detecta cambio, no actualidad del dato externo.
- **Moderado:** observación de Git/árbol no es un bloqueo transaccional de todos los concurrentes;
  detectar cambios observables y conservar pin, no autoactualizar. Provenance vendored es declarada
  por el caller y debe ser confiable; igualdad de hash no convierte una fuente desconocida en fiable.
- **Moderado:** coste real de LLM y exactitud semántica independiente no medidos; no afirmar 75% ni
  ROI. El fallback nativo evita sobrecoste en casos cortos/completos.

Recuperación: retirar los entrypoints opcionales o revertir los commits propios de esta fase y
reconciliar únicamente checker/templates afectados; la gobernanza base y corpus siguen operativos
con rg/awk/cat. No borrar evidencia ni actualizar/resetear productos para corregir una herramienta.
No se han cambiado correo, DNS, Entra, Google, Stripe, VPS ni constantes de las apps FIELDS.

## Evaluación de capacidades

Ruta completa G1–G6. G1 PASS_WITH_CONSTRAINTS: lector sin red/escrituras; frescura con egress Git
read-only al remoto explícitamente confiado. G2 PASS: ninguna aprobación/adopción/semántica decidida
por herramienta. G3 PASS: archivos versionados, sin instalación global ni autoactivación. G4 PASS:
source Markdown único, índices derivados sin segundo owner; router existente manda. G5
PASS_WITH_CONSTRAINTS: Python stdlib/Git instalados, hashes de entrypoints/motores en manifiesto,
input/transport/size/timeouts acotados; no contenido de corpus enviado. G6 PASS: retirada conserva
fuentes y gobernanza base; no caché o índice obligatorio. Ledger canónico registra revisión/modo;
la instancia hub tendrá evaluación propia, sin transferir admisiones a productos.
