# [01-2] Preparación — guard local macOS, instalación segura y recuperación

## 0. Metadata

2026-09-13, Codex. Rol: especificación y verificación dirigida, sin subagentes.
Encargo: preparar solución/prompt, guardar regresión y dejar entrega por terminal para revisión
con Claude. Aclaraciones: script en el Mac contra borrados externos; kit siempre dentro de un
proyecto, nunca HOME; explicitar mejora porcentual estimada y exclusiones.
Estado: preparación terminada; guard **PROPUESTO, NO IMPLEMENTADO/NO ACTIVADO**.
La restricción HOME es un cambio independiente implementado localmente. Sin release/Change ID.
Inciso adicional completado: receta de Potrace en `knowledge/`, con evidencia de Maryna Ventura.
HEAD sigue `79aa7ffce2563e0e3abc189b19054187daf1a43d`, main; versión publicada 1.27.0.

## 1. Objetivo y alcance

LEVEL 3, security; un repositorio. Preparar un [prompt revisable](../prompts/%5B01-2-alpha%5Dsentinel-guard-local-macos.md)
para un lanzador que aplica el perímetro con macOS, sin inferencia de supervisión por orden.
La propuesta reduce el alcance del antiguo Sentinel y no convierte sus límites en PASS.
La interpretación del consumo compara tareas equivalentes; construcción se informa aparte.
No hay contabilidad de proveedor de esta conversación ni baseline comparable de construcción.

## 2. Resumen ejecutivo

La solución candidata es `sds-guard --project R -- comando`: arranque local bajo Seatbelt,
restricción de escrituras destructivas externas y herencia al proceso/hijos. La interfaz aún
no existe. No se ha añadido vigilante LLM, daemon ni VM de uso diario. La compatibilidad de
arranque, canales y temporales debe resolverse antes de prometer protección o un porcentaje.

Se guardaron dos snapshots antes de nuevos cambios y se recuperaron con verificación.
Se implementó además la prohibición de inicializar HOME o `/`: diez tests dirigidos pasan.

## 3. Archivos involucrados

| Grupo | Archivos y propósito |
|---|---|
| Ubicación segura | `practices/11-governance-evolution.md`, `scripts/bootstrap.py`, `init.sh`, `init-project-prompt.md`: regla, rechazo antes del plan y advertencia |
| Verificación | `tests/test-bootstrap-location.py`: cuenta/entorno, alias, modos, errores y destinos legítimos |
| Propuesta | `docs/prompts/[01-2-alpha]sentinel-guard-local-macos.md`: arquitectura, alcance, prueba y presupuesto |
| Entrega | Este informe y `[01-2]/`: recuperación, revisión de Claude, evidencia y continuidad |
| Índices | README/CHANGELOG, prompts README y docs/governance README/change-log: descubrimiento y trazabilidad |
| Recuerdo solicitado | `knowledge/README.md`, `knowledge/how-to-convert-from-image-to-svg.md`: ImageMagick → PGM 4× → Potrace, parámetros y refinamiento blanco, sin modificar activos |

No se modificó `sentinel/`, el core de 01-1 ni sus pruebas/evidencias. `bootstrap.py` ya tenía
un delta Sentinel: se preservó y se guardó el cambio HOME aparte. Los archivos ajenos, incluidos
.DS_Store, se conservan. Sin commits/stash/fetch/push, cambios de rama ni servicios externos.

## 4. Mapa de impacto y sincronización

Camino afectado: init/metaprompt → resolver destino físico → comprobar HOME/raíz → plan →
escrituras/instaladores. El rechazo ocurre antes del snapshot/plan incluso en dry-run/hub.
El HOME de la cuenta evita confiar solo en un HOME de entorno distinto. Python se invoca con
`-B` para no crear bytecode al importar el motor. Se mantienen los errores de código 2.

Regla propietaria y metaprompt: CHANGE. Kernel/INDEX, adapters, scaffold, ledger y VERSION:
N/A, sin carga permanente, nuevo archivo materializado ni admisión. No se distribuyó el kit.
BBDD/API/backend de producto/iOS/Android/frontend: N/A. No se cambia una sesión ya lanzada.
La comprobación rechaza HOME y raíz; no certifica que cualquier otro destino sea un proyecto.

## 5. Verificación BBDD

N/A — sin datos, schema ni migraciones.

## 6. Verificación API

N/A — sin API ni proveedor usado. Fuentes técnicas: manual Apple local
`/usr/share/man/man1/sandbox-exec.1` y [Seatbelt versionado de Codex](https://raw.githubusercontent.com/openai/codex/rust-v0.154.0/codex-rs/sandboxing/src/seatbelt.rs).
Ambos apoyan estudiar el mecanismo, no prueban su funcionamiento con este cliente.
[Claude sandbox](https://code.claude.com/docs/en/sandboxing) distingue Bash/hijos de otros
canales. [Codex no interactivo](https://developers.openai.com/codex/noninteractive) y
[Claude programático](https://code.claude.com/docs/en/headless) documentan salida estructurada;
los campos disponibles deberán comprobarse en el piloto. Consulta: 2026-09-13.

## 7. Tests y validación

- **10/10 tests dirigidos**, primera ejecución, 0 fallos. El snapshot/plan está interceptado
  para impedir bootstrap real incluso si la nueva condición falla. Alias de filesystem
  probados con carpetas sintéticas conservadas; nada se borró.
- **3/3 smokes de init/dry-run**: HOME y HOME-hub devuelven 2; proyecto dedicado devuelve 0
  sin crear destino ni invocar instaladores. Evidencia: [checks](%5B01-2%5D/evidence/bootstrap-location-checks.json).
- **363/363 y 406/406 archivos recuperados** a carpetas nuevas: contenido, inventario y modos
  ejecutables verificados. [Evidencia](%5B01-2%5D/evidence/recovery-verification.json).
- Sintaxis Bash/Python, estructura/enlaces locales, preservación de archivos anteriores y
  parche HOME contra la fuente pre-Sentinel: [validación](%5B01-2%5D/evidence/validation.json).

Verification: **V3 | ubicación compartida, smokes dirigidos y recuperación de fuentes | PASS
en el alcance indicado**. Materialización completa, instaladores y protección runtime:
NO_VERIFICADOS en esta tarea. No se ejecutó el checker general ni suites con teardown
destructivo; el delta es anterior al plan y los consumidores están acotados a sus entradas.
Las pruebas Sentinel 01-1 no se repitieron: no cambió el código que cubren; no validan este guard.

## 8. Conclusiones: mejora estimada, tokens y qué queda fuera

**Estimación prudente: aproximadamente 0% de mejora incremental en los borrados directos
que el entorno gestionado actual ya deniega fuera de sus raíces autorizadas.** Es una
estimación condicional, no una medición: el guard añadiría una restricción sobre una operación
ya impedida. No sería honesto prometer un 20%, 50% o 90% de mejora global sin conocer la
frecuencia de incidentes y los permisos efectivos de las sesiones que se quieren proteger.

| Escenario | Estimación/objetivo y límite |
|---|---|
| Destino fuera de todas las raíces ya protegidas | ~0% de mejora adicional esperada si ambos controles ya bloquean; sin nuevo ensayo |
| Temporales u otra raíz adicional permitida hoy, fuera del proyecto R | Valor potencial: cerrar esa diferencia de alcance. Objetivo 100% de intentos del corpus bloqueados; cobertura actual/después todavía no medida |
| CLI iniciado hoy sin esa frontera | Si A permite 10/10 efectos sintéticos y B permite 0/10, reducción de efectos = 100% en esa muestra. Ejemplo condicional, no predicción ni resultado |
| Implantación en HOME | El nuevo rechazo está probado en los casos dirigidos; no existe tasa histórica de instalaciones erróneas para estimar mejora poblacional |

La mejora real se calculará por caso/mecanismo: proporción de efectos externos consumados
A frente a B y diferencia de tasa de bloqueo en puntos porcentuales. Reducción relativa de
efectos = `100×(efectos_A−efectos_B)/efectos_A` si el denominador es positivo. Con ambos en
cero hay igualdad observada y reducción relativa indefinida, no «100% mejor». No presentar
la tasa de bloqueo del nuevo guard como porcentaje de mejora respecto al actual.

**Tokens:** el diseño propone **0 llamadas LLM propias y 0 instrucciones nuevas por operación**.
Es el motivo para considerar viable un coste directo prácticamente nulo. No permite estimar
el consumo total por tarea con precisión ni demostrar <10%: los avisos nativos y reintentos
podrían aumentar uso. Estimación porcentual total actual: **NO_DISPONIBLE**. El piloto corto
deberá medirlo; el comando `--check` y las pruebas locales no necesitan un modelo.

La regla propuesta conserva la condición del usuario: continuar bajo 10%; pausa/decisión en
10–<15%; avisar y parar desde 15%, incluido 15–20% y superiores. Lo desconocido no cuenta como
<10%. La campaña es un máximo de ocho sesiones en un CLI, tras comprobar efectividad local,
con límites por sesión y sin ampliación automática. Coste de diseño/revisión/construcción se
reporta separado; no se deduce un ahorro de tokens a partir de milisegundos ni de bytes.

**Se deja fuera de este piloto:**

- Impedir toda pérdida dentro del proyecto, interpretar la intención de cada edición o
  proteger de una operación interna autorizada por las reglas vigentes.
- Supervisar todo el Mac, procesos ya abiertos o sesiones que no se iniciaron con el guard.
- Aplicaciones GUI y herramientas de escritorio como producto soportado; cualquier delegación
  desde el proceso protegido que pudiera escribir fuera debe bloquearse o impedir certificar
  ese modo. No se oculta una vía de escape como «fuera de alcance».
- Operaciones en servidores/MCP remotos, VPS, GitHub o cuentas externas; mantienen su gobernanza.
- Portar a Linux/Windows/Gemini, instalar globalmente, un nuevo registro de permisos y un
  contador/parada del agente propios. Un cliente probado no certifica los demás.
- Reparación automática posterior a un borrado, backups continuos, antimalware o garantía
  universal frente a vulnerabilidades del SO. El paquete de regresión conserva fuente,
  no sustituye un backup independiente del equipo.

Mi recomendación es revisar este piloto pequeño. Si A ya cubre los mismos casos y no hay
una diferencia comprobable, descartar el wrapper y conservar solo la protección HOME y las
copias de recuperación. Si cerrar arranque/IPC/custodia exige un servicio o motor propio,
parar por complejidad; no reconstruir el Sentinel amplio para justificar continuar.

Inciso de conocimiento completado: [imagen → SVG con Potrace](../../knowledge/how-to-convert-from-image-to-svg.md).
Se recuperaron de Maryna Ventura el preprocesado ImageMagick 4×, parámetros exactos del
trazado negro y refinamiento blanco. Los hashes actuales coinciden con el original/negro
documentados; el blanco final pesa 2.292 bytes. Se guardó la receta sin convertir de nuevo
imágenes ni tocar el proyecto del cliente. El nombre correcto es Potrace y está instalado
por Homebrew; esta referencia no añade instrucciones al contexto ordinario del agente.

## 9. Checklist E2E

- [x] Snapshot pre-Sentinel y estado anterior a esta tarea recuperables en carpetas nuevas.
- [x] Rechazo HOME/raíz y alias, plan permitido de proyecto y paridad init/metaprompt.
- [x] Prompt, interpretación de porcentajes, exclusiones y revisión por Claude guardados.
- [ ] Implementación del guard macOS y ensayo de barrera, canales y arranque.
- [ ] A/B de efectos, rollback del guard, tokens reales y activación por proyecto.

## 10. Riesgos y decisiones

Críticos nuevos por la protección HOME: ninguno identificado en las entradas dirigidas;
es un rechazo anterior a las escrituras. Crítico para activar el guard futuro: una vía de
escritura mediante helpers/IPC no cubierta impediría certificar protección externa.
Severos: Seatbelt existe pero Apple lo marca deprecated; arranque/caches pueden exigir rutas
incompatibles; el fallo 71 sigue sin resolverse. No se intentó escapar de la sesión gestionada.
Moderados: solo hay pruebas dirigidas de ubicación y no de todo el bootstrap; los backups
son locales; el número de pruebas futuras no establece una garantía estadística.

Soluciones: compatibilidad y laboratorio primero; si no caben en el presupuesto, parar.
Mantener HOME fuera, no ampliar permisos para que el piloto salga verde. El archivo normativo
versionado de práctica 11 registra la adición pedida; 01-2-alpha conserva las decisiones futuras
como propuesta, no como permiso de activación. No se solicita aprobación redundante ni se
marca el trabajo listo para merge/publicación. Revisión independiente de Claude pendiente.

## 11. Memoria y recuperación

[Procedimiento de regresión](%5B01-2%5D/regresion.md), con SHA y comandos para carpeta nueva.
[Checkpoint](%5B01-2%5D/tmp/continuidad.md). El punto exacto pre-Sentinel no contiene la
protección HOME recién pedida; hay un parche aislado para conservarla si se abandona esa vía.
No se crearon adapters ni memoria permanente con instrucciones adicionales por operación.

## 12. Siguiente paso

Copiar el [encargo de revisión para Claude](%5B01-2%5D/revision-claude.md), corregir la propuesta
según hallazgos y decidir su ejecución. No relanzar 01-1 entero. El informe de una ejecución
futura tendrá otro archivo y no sobrescribirá esta preparación ni sus evidencias.
La [entrega por terminal](%5B01-2%5D/dossier-terminal.txt) reúne los documentos para revisión;
es una copia de lectura derivada, no sustituye sus fuentes.
