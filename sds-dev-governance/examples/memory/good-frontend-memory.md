# Frontend Memory — Example

## Contexto minimo

- Frontend vive en `web/`.
- Clientes API en `web/src/api/`.
- Formularios validan en cliente y backend.
- Build canonico: `npm run build`.
- Cambios de contrato API pueden romper modelos cliente.

## Rutas clave

| Ruta | Proposito |
|---|---|
| `web/src/pages/` | Paginas principales |
| `web/src/components/` | Componentes reutilizables |
| `web/src/api/` | Clientes API |

## Convenciones tecnicas

- Estado remoto se carga desde hooks de API.
- Formularios validan en cliente y backend.
- Errores de API se muestran con mensaje contextual.

## Comandos canonicos

| Comando | Uso |
|---|---|
| `npm run build` | Verificar build frontend |
| `npm run lint` | Verificar lint |

## Riesgos conocidos

- Cambios de contrato API pueden romper decodificacion de modelos cliente.

## Ultimo estado estable

- Build verde en la ultima revision documentada.
