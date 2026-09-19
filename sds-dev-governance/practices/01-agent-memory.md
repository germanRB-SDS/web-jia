# 01 — Memoria de agentes

## Problema que resuelve

Los agentes IA pierden contexto entre sesiones. Sin memoria persistente, cada sesion empieza de cero y repite errores o contradice decisiones anteriores.

## Regla

`sds-dev-governance/GOVERNANCE.md` es la fuente canonica portable de reglas, protocolos y
convenciones SDS. Los ficheros de agente en la raiz (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`,
`.cursor/rules/`) son adapters finos: apuntan a la governance y contienen solo contexto especifico
del proyecto y notas runtime del agente.

## Modelo de memoria

| Fichero | Rol |
|---|---|
| `sds-dev-governance/GOVERNANCE.md` | Fuente unica de reglas portables SDS |
| `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursor/rules/*` | Adapters de agente en raiz |
| `docs/memory/<area>.md` | Memoria tematica plana por area (legacy) o, si el area crece, ver memoria en arbol |
| `docs/memory/index-<area>.md` + `docs/memory/<area>-N.md` | Memoria en arbol: indice (unico entrypoint) + shards de ambito cerrado bajo demanda |
| `docs/features/FTR-NNN-action-memory.md` | Memoria rapida por funcionalidad |
| `docs/prompts-output/` | Trazabilidad de cada prompt ejecutado |
| `docs/prompts-output/<PROMPT_ID>/tmp/` | Checkpoints temporales de ejecucion para prompts largos o de alto riesgo |
| `docs/prompts-output/<PROMPT_ID>/evidence/` | Evidencia pesada o salidas largas separadas del informe final |
| `docs/governance/` | Registro local de cambios de gobernanza |

## Protocolo

1. Las reglas portables se editan en `sds-dev-governance/GOVERNANCE.md` y/o `sds-dev-governance/practices/`.
2. No hay copias duplicadas de reglas en adapters. Los cambios de gobernanza se sincronizan por protocolo, no por duplicacion libre.
3. Si un area tecnica necesita memoria propia, usar `docs/memory/<area>.md`.
4. Las memorias tematicas contienen hechos verificados de dominio, no reglas duplicadas.
5. Si un prompt queda parcial o bloqueado, el estado minimo para reanudar vive en el checkpoint del output.
6. Cada prompt debe declarar o inferir areas afectadas antes de cargar memorias tematicas.
7. En prompts largos, `LEVEL 3`, multi-fase o con riesgo de interrupcion, usar memoria temporal bajo
   `docs/prompts-output/<PROMPT_ID>/tmp/`; nunca bajo `docs/prompts/`.

## Contenido minimo de cada adapter

- Referencia a `sds-dev-governance/GOVERNANCE.md` como primera lectura.
- Rutas principales del proyecto.
- Ramas compartidas y su convencion.
- Funcionalidades activas (por referencia, no duplicadas).
- Stack tecnologico y restricciones runtime del agente.
- Mapa de memoria tematica por area, sin duplicar reglas.

## Memorias tematicas

Las memorias tematicas viven en `docs/memory/`:

- `frontend.md`
- `backend.md`
- `api-openapi.md`
- `database.md`
- `security.md`
- `deployment.md`

Mantener cada fichero compacto (150-250 lineas orientativas). Referenciar desde el adapter raiz, no duplicar reglas.

Cada memoria debe incluir `Contexto minimo` con 5-10 bullets maximo. El agente debe leer esa seccion antes de cargar detalle.

## Memoria en arbol: indice + shards (cuando un area crece)

Cuando una memoria plana `<area>.md` se acerca a su tope, **no** se sigue engordando: se migra a un
arbol operativo `index-<area>.md` + shards `<area>-N.md`. Reglas:

- `index-<area>.md` es el **unico punto de entrada** del area. Debe contener: `## Contexto minimo` ·
  **mapa tematico** (que shard cubre que ambito y cuando leerlo) · **invariantes criticos** resumidos ·
  seccion `## Cross-links` entre shards · el aviso literal **"do not read all shards by default"**.
- Cada shard `<area>-N.md` (p. ej. `security-1.md`) es **detalle de ambito cerrado**, cargado **bajo
  demanda**; no necesita `## Contexto minimo`; **debe estar listado en su `index-<area>.md`**.
- **Ningun shard se carga por defecto.** El agente lee el indice y abre solo el shard que el indice indique.
- Cross-links entre shards permitidos en la seccion `## Cross-links`, como enlaces locales
  `<area>-N.md` o `docs/memory/<area>-N.md`. El grafo debe ser DAG **por regla documental**; un shard no
  se enlaza a si mismo.
- **Topes:** `index-<area>.md` <= 300 lineas; cada shard `<area>-N.md` <= 250 lineas.
- El nombre de area puede contener guiones (`api-openapi`): el indice es `index-api-openapi.md` y sus
  shards `api-openapi-1.md`, `api-openapi-2.md`...
- **Compatibilidad:** las memorias planas `<area>.md` sin indice siguen siendo validas hasta que migren.
  Si tras migrar queda un `<area>.md` residual, solo se admite como **stub deprecado** (<= 40 lineas,
  contiene `DEPRECATED`, apunta a `docs/memory/index-<area>.md`, sin `## Contexto minimo`, nunca entrypoint).
- **Graphify** (`sds-dev-governance/skills/graphify.md`) es herramienta **auxiliar** de
  descubrimiento/busqueda sobre este arbol; **nunca** sustituye al indice ni es carga primaria por ejecucion.

`check-governance.sh` valida estos minimos: indice con `Contexto minimo` + marcador + topes, shard
indexado y bajo su indice, y cross-links sin destino inexistente ni self-link.

## Anti-patrones

- No mantener multiples copias sincronizadas del mismo contenido.
- No duplicar reglas en memorias tematicas (las reglas viven en `GOVERNANCE.md` y `practices/`).
- No crear ficheros de "memory-of-implementation-changes" ni "memory-of-implementation-outcome" (los prompt outputs cubren ese caso).

## Memoria temporal de ejecucion de prompts

La memoria temporal de ejecucion evita perder estado durante prompts largos, auditorias, cierres de
release, migraciones, refactors, fixes de seguridad/scoping o tareas con alto riesgo de quedarse a
medias por tokens, reinicio del agente, pausa manual o fallo del harness.

Ubicacion canonica:

```text
docs/prompts-output/<PROMPT_ID>/tmp/
```

Evidencia pesada o salidas largas:

```text
docs/prompts-output/<PROMPT_ID>/evidence/
```

No guardar scratch memory en `docs/prompts/`: esa carpeta es corpus limpio de prompts fuente
ejecutables. El estado parcial es output de ejecucion, no input canonico.

Cada checkpoint debe incluir como minimo:

- timestamp;
- branch;
- HEAD;
- resumen de worktree status;
- gate o subfase actual;
- trabajo completado;
- trabajo pendiente;
- riesgos o bloqueos;
- siguiente paso exacto.

Tmp/evidence debe ser secret-safe: no incluir claves, tokens, contrasenas, `DATABASE_URL` completo,
secretos OAuth/Stripe, claves privadas, dumps completos de BBDD ni datos personales innecesarios.
Antes de cerrar el prompt, consolidar lo util en el final report, phase report, continuity state o
memoria permanente aplicable, y comprobar que tmp/evidence no contradice el estado real del repo.

## Lectura por código cuando aporta valor

Para documentos largos, referencias ejecutables y rangos derivados, cargar bajo demanda
`practices/modules/01-selective-text.md`. Conserva preámbulo, núcleo y dependencias completas;
no sustituye el router de prácticas ni obliga a indexar una lectura corta/completa.
