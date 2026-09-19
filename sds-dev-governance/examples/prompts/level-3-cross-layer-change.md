# [03-0]change-user-permissions.md

## PREFACE — NON-EXECUTABLE

> Bloque no-operativo (documentacion / mini-memoria). Ejecutar desde `## Nivel de gobernanza` en adelante.
>
> - **Que cambia:** la logica de permisos de administradores (backend + API + database + security).
> - **Por que:** _[motivo del cambio de modelo de permisos]_.
> - **Que implica:** toca authz; cambia quien puede hacer que sobre que recursos.
> - **Como lo hace:** revisa el modelo persistido real, actualiza backend y contrato, verifica consumidores.
> - **Consecuencias:** una migracion de roles incorrecta puede abrir acceso indebido o bloquear admins.
> - **Analisis de severidad:** **severo** potencial (authz): un fallo puede conceder acceso indebido o
>   provocar lockout; **critico** si eliminara el ultimo superadmin. Mitigar con tests A/B de permisos y
>   guard de no-lockout. El informe terminal de riesgo va segun `practices/14-phase-commit-report.md`.

## Nivel de gobernanza

`LEVEL 3`

## Areas afectadas

- `backend`
- `api-openapi`
- `database`
- `security`

## Objetivo

Modificar la logica de permisos de usuarios administradores.

## Alcance

- Revisar datos reales y modelo persistido.
- Actualizar backend y contrato API si aplica.
- Verificar compatibilidad de consumidores.
- Documentar riesgos de seguridad.

## Validacion esperada

- Verificacion BBDD.
- Tests backend.
- Revision de permisos/auth.
- Output completo con checkpoint.
