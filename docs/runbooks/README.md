# Runbooks

Procedimientos operativos por entorno. Un fichero por entorno.

## Estructura

- `dev.md` — entorno de desarrollo local y remoto
- `staging.md` — entorno de pre-produccion (cuando exista)
- `prod.md` — entorno de produccion

## Contenido minimo por runbook

1. Como arrancar el entorno.
2. Como desplegar.
3. Como verificar que funciona (smoke test).
4. Como hacer rollback.
5. Variables de entorno necesarias (sin valores reales).
6. Dependencias externas (BBDD, APIs, servicios).
