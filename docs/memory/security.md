# Security Memory

Contexto tecnico estable de seguridad. No duplicar reglas de `CLAUDE.md`.

## Cargar cuando

- Cambios en auth, permisos, roles, secretos, tokens, datos personales, logging sensible o configuracion de seguridad.
- Cambios de deployment que afecten credenciales o exposicion publica.

## Contexto minimo

- _pendiente_

## Rutas clave

| Ruta | Proposito |
|---|---|
| `docs/security/` | Revisiones y hallazgos de seguridad |

## Superficies sensibles

- _pendiente_

## Comandos canonicos

| Comando | Uso |
|---|---|
| `rg -i -l "password|secret|key|token|connection|mongodb\\+srv|apikey" .` | Busqueda inicial de posibles secretos |

## Riesgos conocidos

- _pendiente_

## Ultimo estado estable

- _pendiente_
