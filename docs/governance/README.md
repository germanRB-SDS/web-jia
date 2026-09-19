# Governance

Registro local de cambios de gobernanza aplicados al proyecto.

## Proposito

Usar esta carpeta cuando una regla, criterio, seccion, plantilla o protocolo del proyecto cambie y sea necesario dejar trazabilidad operativa.

El indice resumido vive en este README. El detalle obligatorio por cambio vive en
`docs/governance/governance-change-log.md`. El estado efectivo de capacidades agentic vive
exclusivamente en `docs/governance/capability-registry.md` y se carga solo cuando una tarea usa o
cambia una capacidad.
El catalogo base de plugins vive bajo `sds-dev-governance/plugins/` y no forma parte de esta carga:
su estado local se consulta explicitamente con `scripts/plugin-status.sh`.

## Regla

Todo cambio de gobernanza parte de su owner canonico y una matriz de impacto. Los consumidores se
actualizan solo si cambia su trigger, referencia o comportamiento; el resto queda `N/A — motivo`.
Una capacidad no listada con revision/modo exactos en el ledger es `NOT_EVALUATED` y no autorizada.

## Registro sugerido

| Fecha | Tipo | Cambio | Ficheros sincronizados | Verificacion | Output |
|---|---|---|---|---|---|
| YYYY-MM-DD | `GOV-RULE` | _descripcion_ | _rutas_ | _comando/revision_ | `[NN-R]` |

## Tipos

- `GOV-RULE`: regla o criterio operativo.
- `GOV-STRUCTURE`: carpeta, fichero, plantilla o convencion.
- `GOV-PROMPT`: comportamiento requerido en prompts.
- `GOV-SAFETY`: seguridad, no regresion, permisos o secretos.
- `GOV-CONTINUITY`: checkpoints, memorias o reanudacion.
- `GOV-AUTOMATION`: validadores, bootstrap o checks automatizados.
