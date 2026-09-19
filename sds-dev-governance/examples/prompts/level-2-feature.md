# [02-0]add-profile-status.md

## PREFACE — NON-EXECUTABLE

> Bloque no-operativo (documentacion / mini-memoria). Ejecutar desde `## Nivel de gobernanza` en adelante.
> El marcador no ahorra tokens salvo stripping por un loader.
>
> - **Que cambia:** expone en la pantalla de cuenta un campo de estado de perfil ya persistido (backend +
>   OpenAPI + frontend).
> - **Por que:** la cuenta no muestra hoy ese estado existente.
> - **Que implica:** un campo persistido se vuelve publico en la respuesta; el frontend añade estados
>   loading / exito / error / vacio.
> - **Como lo hace:** backend expone el campo, OpenAPI lo documenta, frontend lo renderiza.
> - **Consecuencias:** cambio aditivo; ningun consumidor existente rompe.
> - **Analisis de severidad:** sin criticos ni severos. Moderado: verificar que el campo no filtre datos
>   de otros usuarios (scoping por usuario autenticado).

## Nivel de gobernanza

`LEVEL 2`

## Areas afectadas

- `frontend`
- `backend`
- `api-openapi`

## Objetivo

Mostrar el estado del perfil de usuario en la pantalla de cuenta.

## Alcance

- Backend expone el campo existente.
- OpenAPI documenta la respuesta.
- Frontend renderiza estado loading, exito, error y vacio.

## Validacion esperada

- Tests o build backend.
- Build/lint frontend.
- Verificacion del contrato API.
