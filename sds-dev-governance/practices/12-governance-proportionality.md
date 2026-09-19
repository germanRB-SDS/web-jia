# 12 — Gobernanza proporcional

## Problema que resuelve

Una gobernanza util puede volverse burocratica si exige el mismo nivel de documentacion para un typo que para un cambio de API, BBDD o seguridad. El objetivo es conservar trazabilidad donde aporta valor y evitar ruido donde no lo aporta.

## Regla

Todo trabajo debe clasificarse en un nivel de gobernanza antes de decidir cuanta documentacion requiere. Si el usuario no declara el nivel, el agente debe inferirlo.

## Niveles

| Nivel | Uso | Documentacion requerida |
|---|---|---|
| `LEVEL 0` | Cambio trivial sin impacto funcional | Sin output obligatorio |
| `LEVEL 1` | Cambio pequeno en una sola capa | Output compacto |
| `LEVEL 2` | Feature o cambio normal con impacto verificable | Output completo |
| `LEVEL 3` | Cambio transversal, critico, multi-repo, BBDD, seguridad, API breaking o gobernanza | Output completo + checkpoint + verificacion E2E |

## Criterios de clasificacion

### LEVEL 0 — trivial

Usar solo si:

- Cambio de typo, comentario o formato sin impacto funcional.
- No cambia comportamiento, contrato, datos, seguridad ni despliegue.
- No requiere decision tecnica futura.

Requiere:

- Commit claro.
- Sin output obligatorio.

### LEVEL 1 — cambio pequeno

Usar si:

- Toca una sola capa.
- No cambia contrato externo.
- No cambia persistencia.
- No afecta seguridad.

Requiere output compacto:

- Objetivo.
- Areas afectadas.
- Ficheros modificados.
- Validacion ejecutada o motivo de no ejecutarla.
- Siguiente paso si aplica.

### LEVEL 2 — cambio normal

Usar si:

- Implementa una funcionalidad o correccion con impacto real.
- Toca mas de una capa sin ser critica.
- Cambia flujo de usuario o comportamiento observable.

Requiere:

- Output completo.
- Areas y memorias cargadas.
- Tests/validacion.
- Riesgos y decisiones.

### LEVEL 3 — transversal o critico

Usar si:

- Afecta BBDD, migraciones, auth, permisos, secretos o datos personales.
- Cambia contratos API o OpenAPI.
- Afecta varios repos.
- Modifica gobernanza.
- Puede romper consumidores existentes.
- Puede quedarse a medias y requerir reanudacion.

Requiere:

- Output completo.
- Checkpoint de continuidad.
- Verificacion E2E por capas.
- Registro en `docs/governance/README.md` si es cambio de gobernanza.
- Change ID si afecta a mas de un repo.

## Cuando NO crear documentacion nueva

No crear documentacion nueva si:

- El cambio no modifica comportamiento.
- La correccion es local, evidente y queda clara en codigo o test.
- No hay decision tecnica que preservar.
- No cambia contrato, BBDD, seguridad, arquitectura ni operacion.
- El output seria mas largo que el cambio.
- No hay estado parcial que otra persona o agente tenga que retomar.

## Cuando SI documentar

Documentar si:

- Hay decision tecnica.
- Hay riesgo futuro.
- Hay impacto multi-capa.
- Hay contrato externo.
- Hay cambio de gobernanza.
- Hay cambio de BBDD, seguridad o despliegue.
- El trabajo queda parcial, bloqueado o no verificado.

## Politica para memorias tematicas

`docs/memory/*.md` solo debe contener:

- Contexto minimo de 5-10 bullets.
- Rutas clave.
- Comandos canonicos.
- Contratos relevantes.
- Decisiones vigentes.
- Riesgos conocidos.
- Ultimo estado estable.

No debe contener:

- Diario de trabajo.
- Logs largos.
- Historial cronologico.
- Opiniones.
- Reglas duplicadas de `CLAUDE.md`.
- Diffs.

Limite recomendado: 150-250 lineas por fichero. Si se supera, resumir y mover detalle a documentacion especifica.

## Lectura por secciones

Para reducir coste sin perder utilidad:

1. Leer primero `Contexto minimo`.
2. Inspeccionar titulos antes de cargar detalle.
3. Cargar solo la seccion necesaria si el cambio es local.
4. Cargar la memoria completa solo si el area es central para el cambio.

## Subgrafo minimo suficiente

El corpus de gobernanza crece con cada proyecto, dominio, herramienta e incidente validado. El
contexto cargado por tarea no debe crecer con el.

Para una tarea `T`, la ruta correcta es:

`estatico obligatorio + entradas de indice que la tarea selecciona + nodos especialistas nombrados
por esas entradas + dependencias obligatorias transitivas`.

Cargar el repositorio entero, una carpeta entera o un nodo especialista no seleccionado es un
defecto de enrutado, no rigor.

### Cuando dividir un nodo en shards

Un fichero **no** se divide por ser largo. Se divide cuando la division mejora al menos una de estas
propiedades sin danar descubribilidad ni autoridad:

- selectividad de enrutado: la tarea deja de cargar dominios que no necesita;
- coste de contexto de una superficie siempre leida;
- cohesion: el nodo pasa a tratar un solo dominio;
- evolucion independiente: los shards cambian por motivos distintos;
- aislamiento de dependencias.

### Forma de un nodo raiz sharded

La raiz conserva proposito, informacion de enrutado, autoridad y enlaces. Debe bastar para responder
que conocimiento existe, cuando cargarlo, donde vive la autoridad y que dependencia seguir despues.
No duplica el contenido de sus shards.

### Presupuesto de contexto

Los presupuestos vigentes se verifican en `check-governance.sh`: `GOVERNANCE.md`,
`practices/INDEX.md` y el conjunto siempre leido tienen limite de palabras. Superarlo es una senal de
sharding, no una invitacion a subir el limite.

## Outputs compactos

La plantilla completa existe como contrato, pero no obliga a rellenar texto inutil:

- Secciones no aplicables: `N/A - motivo`.
- No copiar contratos, logs ni diffs.
- Referenciar rutas y comandos.
- Usar `./check-governance.sh .` para validar reglas automatizables en lugar de explicarlas manualmente.

## Automatizacion

Toda regla critica que pueda verificarse por script debe tener un check automatico:

- Placeholders no sustituidos.
- Estructura esperada.
- Memorias demasiado largas.
- Referencias obsoletas.
- Template de output sin areas o checkpoint.
- Posibles secretos.

## Criterio de terminado

Un trabajo esta terminado cuando el nivel de gobernanza aplicado es proporcional al riesgo real del cambio.
