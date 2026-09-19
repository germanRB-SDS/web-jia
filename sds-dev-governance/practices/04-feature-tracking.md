# 04 — Tracking de features (FTR-NNN)

## Problema que resuelve

Las funcionalidades complejas generan documentacion dispersa entre auditorias, prompts, outputs, specs UI y schemas de DB. Sin un indice centralizado, se pierde el hilo.

## Estructura

```
docs/features/
├── features-index.md          ← indice global
├── FTR-001-nombre.md          ← ficha completa
├── FTR-001-action-memory.md   ← memoria rapida para reentrada de agente
└── FTR-001-docs-correlation-log.md  ← correlacion con otros docs
```

## features-index.md

Tabla ligera con:

| ID | Funcionalidad | Estado | Prioridad | Doc tecnica | UI/UX | DB/API | Memoria parcial | Prompt | Output | Siguiente accion |
|---|---|---|---|---|---|---|---|---|---|---|

## Reglas

1. La memoria principal (`CLAUDE.md`) referencia features activas por ID, no duplica detalle.
2. Cada feature tiene su propia action-memory para que el agente retome sin leer todo.
3. La ficha completa (FTR-NNN-nombre.md) contiene: scope, dependencias, estado por capa, riesgos.
4. El correlation-log conecta auditorias, prompts, outputs, schemas y specs UI de esa feature.

## Cuando crear una feature

Cuando una funcionalidad:
- toca mas de 2 capas (backend + iOS + DB, por ejemplo);
- tiene mas de 1 prompt asociado;
- requiere seguimiento entre sesiones.
