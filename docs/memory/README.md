# Memory

Memorias tematicas compactas del proyecto. Contienen contexto tecnico estable, no reglas de gobernanza.

## Regla

- `sds-dev-governance/GOVERNANCE.md` es la fuente unica de reglas portables.
- Estas memorias se cargan solo si el prompt toca el area correspondiente.
- Rellenar solo las areas reales del proyecto; dejar como `_pendiente_` las que no apliquen todavia.
- Si una memoria supera el limite recomendado, resumir y mover detalle a documentacion especifica.
- Leer primero `Contexto minimo`; bajar a secciones concretas solo si hace falta.

## Limite recomendado

- Maximo orientativo por fichero plano: 150-250 lineas.
- `Contexto minimo`: 5-10 bullets maximo.
- Mantener mapas, rutas, decisiones verificadas y comandos canonicos.
- Evitar historico narrativo, logs, diffs y duplicacion de reglas.

## Memoria en arbol (cuando un area crece)

Cuando una memoria plana `<area>.md` se acerca a su tope, migrar a un **arbol**: un indice
`index-<area>.md` (unico entrypoint, <= 300 lineas) + shards `<area>-N.md` de ambito cerrado
(<= 250 lineas), cargados **bajo demanda**. Ver la plantilla `index-area.md.template` y la practica
`sds-dev-governance/practices/01-agent-memory.md`. Reglas que valida `check-governance.sh`:

- El indice lleva `## Contexto minimo`, el marcador literal `do not read all shards by default`, una
  tabla con cada shard, y opcional `## Cross-links`.
- Cada `<area>-N.md` debe estar **listado en su indice** y tener un `index-<area>.md` hermano.
- Cross-links: solo enlaces locales `<area>-N.md` dentro de `## Cross-links`; destino inexistente o
  self-link = fallo. La deteccion de ciclos es regla documental (fuera del checker).
- El nombre de area puede llevar guiones (`api-openapi` → `index-api-openapi.md`, `api-openapi-1.md`).
- Un `<area>.md` residual tras migrar solo se admite como **stub deprecado**: <= 40 lineas, contiene
  `DEPRECATED`, apunta a `docs/memory/index-<area>.md`, sin `## Contexto minimo`, nunca entrypoint.
- **Graphify** es auxiliar de descubrimiento/busqueda sobre el arbol, nunca carga primaria.

## Contenido permitido

- Rutas clave.
- Comandos canonicos.
- Contratos relevantes.
- Decisiones vigentes.
- Riesgos conocidos.
- Ultimo estado estable.

## Contenido no permitido

- Diario de trabajo.
- Logs largos.
- Historial cronologico.
- Opiniones.
- Reglas duplicadas de `sds-dev-governance/GOVERNANCE.md`.
- Diffs.

## Areas

| Area | Fichero | Cargar cuando |
|---|---|---|
| Frontend | `docs/memory/frontend.md` | UI, web, componentes, estado cliente |
| Backend | `docs/memory/backend.md` | Services, controllers, jobs, logica servidor |
| API/OpenAPI | `docs/memory/api-openapi.md` | Contratos, endpoints, compatibilidad |
| Database | `docs/memory/database.md` | BBDD, schemas, indices, migraciones |
| Security | `docs/memory/security.md` | Auth, permisos, secretos, datos sensibles |
| Deployment | `docs/memory/deployment.md` | CI/CD, entornos, infraestructura, releases |
