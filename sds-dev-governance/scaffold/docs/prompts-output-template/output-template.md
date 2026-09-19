# Prompt Output — [NN-R]

<!--
  PROPOSITO DE ESTA PLANTILLA
  ============================
  Plantilla obligatoria para cualquier prompt con impacto en codigo
  (iOS/Swift, Android/Kotlin, Web/JS/TS, backend/Java, BBDD Mongo/CosmosDB).

  Objetivo: garantizar trazabilidad minima, deteccion de fallos rapida,
  y checklist de verificacion extremo a extremo sin duplicar Git.

  Uso: copiar este fichero a docs/prompts-output/[NN-R]prompt-output.md
  y rellenar cada seccion. Eliminar secciones que no apliquen marcandolas
  como "N/A - [motivo]". No desarrollar secciones que no aportan contexto.
-->

## 0. Metadata

| Campo | Valor |
|---|---|
| Prompt ejecutado | `docs/prompts/[NN-R]nombre.md` |
| Fecha | YYYY-MM-DD |
| Agente/herramienta | Claude Code / Codex / manual |
| Rol principal | _ver tabla de roles en CLAUDE.md_ |
| Roles secundarios | _si aplica_ |
| Nivel de gobernanza | `LEVEL 0` / `LEVEL 1` / `LEVEL 2` / `LEVEL 3` |
| Areas afectadas | `frontend` / `backend` / `api-openapi` / `database` / `security` / `deployment` |
| Memorias cargadas | `docs/memory/...` |
| Estado final | `IMPLEMENTADO` / `PARCIAL` / `BLOQUEADO` / `NO VERIFICADO` |
| Change ID | `REL-YYYY-MM-DD-NN` _(si cambio multi-repo)_ |

---

## 1. Objetivo del prompt

Descripcion concisa del objetivo global.

### 1.0 Nivel de gobernanza

| Nivel | Motivo | Output requerido |
|---|---|---|
| `LEVEL 0/1/2/3` | _por que se eligio_ | _ninguno / compacto / completo / completo + checkpoint_ |

### 1.1 Areas de contexto

| Area | Declarada por usuario | Inferida por agente | Motivo | Memoria cargada |
|---|---|---|---|---|
| `frontend` | si/no | si/no | _motivo_ | si/no |
| `backend` | si/no | si/no | _motivo_ | si/no |
| `api-openapi` | si/no | si/no | _motivo_ | si/no |
| `database` | si/no | si/no | _motivo_ | si/no |
| `security` | si/no | si/no | _motivo_ | si/no |
| `deployment` | si/no | si/no | _motivo_ | si/no |

### 1.2 Desglose de tareas

| ID | Tarea | Dependencia | Estado |
|---|---|---|---|
| 1.1 | Crear/modificar fichero X | — | `DONE` / `BLOCKED` / `PENDING` |
| 1.2 | Implementar cambios en Y | 1.1 | |
| 1.3 | Conectar con pantalla/endpoint existente | 1.2 | |
| 1.4 | Verificar llamadas a BBDD/API | 1.2, 1.3 | |
| 1.5 | Tests y validacion | 1.1–1.4 | |
| 1.6 | Resultado y siguientes pasos | 1.5 | |

### 1.2.x Detalle por tarea (solo si necesario)

Para tareas complejas, detallar:
- Que debe incluir el fichero/cambio.
- Modelo, DTO, vista, endpoint afectado.
- Restricciones (no romper contrato, no tocar campo X, etc.).

---

## 2. Resumen ejecutivo

1–3 lineas: que se hizo, que quedo pendiente, que esta bloqueado.

---

## 3. Ficheros involucrados

### 3.1 Leidos (contexto)

- `ruta/fichero.ext` — motivo de lectura

### 3.2 Creados

- `ruta/fichero.ext` — proposito

### 3.3 Modificados

- `ruta/fichero.ext` — que cambio

### 3.4 Eliminados

- `ruta/fichero.ext` — motivo

---

## 4. Mapa de impacto

> Rellenar solo las filas que apliquen al prompt.

| Capa | Componente | Estado | Riesgo |
|---|---|---|---|
| **BBDD** | Collection/tabla afectada | `VERIFIED` / `NOT VERIFIED` / `CHANGED` | Bajo/Medio/Alto |
| **Backend** | Controller / Service / DTO | | |
| **API contrato** | Endpoint, request/response | | |
| **iOS** | Model / ViewModel / View | | |
| **Android** | Activity / Fragment / ViewModel | | |
| **Web** | Componente / pagina / store | | |
| **Integraciones** | Stripe / Twilio / email / push | | |

### 4.1 Matriz cross-layer campo-a-campo

> Requerida solo para cambios cross-layer. Marcar `N/A - cambio aislado` si no aplica.

| Campo/valor | UI/input | Request | Contrato/API | Service/validacion | Repository/query | Persistencia/integracion | Response DTO | Consumo/render UI | Validacion |
|---|---|---|---|---|---|---|---|---|---|
| _campo_ | _origen visual_ | _payload_ | _schema_ | _regla_ | _query_ | _tabla/API externa_ | _shape_ | _componente_ | _test/gate_ |

### 4.2 Lineage UI-to-data

> Requerido solo para UI con estado de negocio critico. Marcar `N/A - presentation only` si no aplica.

| Elemento UI | Fuente de verdad | Ruta de datos | Transformaciones | Ambiguedades |
|---|---|---|---|---|
| _elemento_ | _BBDD/API/servicio_ | _component -> state -> API -> service -> persistence_ | _timezone/formato/mapeo/etc._ | _ninguna o blocker_ |

### 4.3 Resiliencia de mutaciones y carrera

> Completar si hay escrituras o mutaciones de estado con riesgo de repeticion, fallo parcial o contencion.

| Operacion | Primitiva de atomicidad/concurrencia | Idempotencia/deduplicacion | Reintentos/fallo parcial | Riesgo residual | Validacion |
|---|---|---|---|---|---|
| _operacion_ | _transaccion/lock/constraint/etc._ | _estrategia_ | _comportamiento_ | _riesgo_ | _test/gate_ |

---

## 5. Verificacion de BBDD (si aplica)

> Completar si el prompt involucra lecturas/escrituras a MongoDB, CosmosDB u otra BBDD.

### 5.1 Estado previo

| Collection | Documentos | Campos relevantes | Indices |
|---|---|---|---|
| `nombre` | N docs | campo1, campo2 | idx_name |

### 5.2 Cambios aplicados

- Escrituras: si/no. Detalle.
- Indices creados: si/no. Script.
- Migraciones: si/no.

### 5.3 Arbol de diagnostico si falla

```
Fallo en operacion BBDD
├── Conexion: verificar URI, credenciales, network
├── Collection: verificar que existe (db.getCollectionNames())
├── Schema: verificar shape del documento vs modelo esperado
├── Query: verificar filtro, projection, sort
├── Indice: verificar que no hay full collection scan
└── Permisos: verificar roles de usuario BBDD
```

---

## 6. Verificacion de API/endpoints (si aplica)

### 6.1 Endpoints tocados

| Metodo | Ruta | Request cambio | Response cambio | Compatibilidad |
|---|---|---|---|---|
| `GET/POST/PUT/DELETE` | `/ruta` | si/no | si/no | retrocompatible / breaking |

### 6.2 Arbol de diagnostico si falla

```
Fallo en llamada API
├── Network: verificar URL base, puerto, HTTPS
├── Auth: verificar token, roles, permisos
├── Request: verificar body, headers, content-type
├── Backend: verificar logs del servidor
│   ├── Controller: llega la request?
│   ├── Service: logica de negocio correcta?
│   ├── Repository: query a BBDD correcta?
│   └── DTO/Mapper: serialization/deserialization?
└── Response: verificar status code, body, headers
```

---

## 7. Tests y validacion

El alcance se decide con la practica 16 (proporcionalidad de verificacion): declarar nivel `V` y
registro `Verification:` por checkpoint. Ejecutar regresion completa unicamente cuando corresponda
al nivel seleccionado o un contrato explicito la exija; las filas siguientes son ejemplos de
herramientas, no mandatos.

### 7.1 Ejecutados

| Tipo | Comando/herramienta | Resultado | Notas |
|---|---|---|---|
| Compilacion backend | `./mvnw compile` | `SUCCESS` / `FAILED` | |
| Compilacion iOS | `xcodebuild build ...` | | |
| Compilacion web | `npm run build` | | |
| Tests unitarios | `./mvnw test` / `npm test` / `xcodebuild test` | | |
| Tests E2E | Playwright / XCUITest / Espresso | | |
| Smoke test endpoint | `curl` / Postman / manual | | |
| Verificacion BBDD | `mongosh --eval ...` | | |
| Lint / format | ESLint / SwiftLint / Checkstyle | | |

### 7.2 No ejecutados

| Tipo | Motivo | Riesgo | Como verificar |
|---|---|---|---|
| _tipo_ | _motivo_ | Bajo/Medio/Alto | _comando o pasos_ |

<!--
### Referencia: herramientas de test por plataforma
| Plataforma       | Unitarios        | Integracion      | E2E                     | Visual           |
|------------------|------------------|------------------|-------------------------|------------------|
| Web (JS/TS)      | Jest / Vitest    | Supertest        | Playwright              | Storybook        |
| iOS (Swift)      | XCTest           | XCTest + mocks   | XCUITest                | Snapshot tests   |
| Android (Kotlin) | JUnit / MockK    | Espresso         | Espresso / UI Automator | Screenshot tests |
| Backend (Java)   | JUnit / Mockito  | SpringBootTest   | —                       | —                |
| MongoDB          | mongosh --eval   | —                | —                       | —                |
-->

---

## 8. Resultado

### 8.1 Clases/ficheros con fallo (si hay)

| Fichero | Linea/zona | Tipo de fallo | Causa |
|---|---|---|---|
| `ruta/fichero.ext` | L42 / metodo X | compilacion / runtime / logica | descripcion |

### 8.2 Bloqueos activos

| Bloqueo | Tipo | Impacto | Resolucion propuesta |
|---|---|---|---|
| _descripcion_ | `BLOCKED` / `NOT VERIFIED` | que no se puede hacer | que hacer para desbloquearlo |

### 8.3 Soluciones propuestas para siguiente iteracion

1. Solucion A — trade-off.
2. Solucion B — trade-off.

---

## 9. Checklist de verificacion extremo a extremo

> Marcar con [x] lo verificado, [ ] lo pendiente, [~] lo no aplicable.

### 9.1 Datos y persistencia
- [ ] Campos en BBDD coinciden con modelo/entidad
- [ ] No se reutiliza campo existente con significado nuevo
- [ ] Datos existentes compatibles con el cambio
- [ ] Indices necesarios creados o documentados

### 9.2 Backend
- [ ] Controller recibe y valida correctamente
- [ ] Service implementa logica sin side effects no documentados
- [ ] DTO de entrada/salida coincide con contrato
- [ ] Permisos/auth verificados
- [ ] Compilacion exitosa
- [ ] Tests pasan

### 9.3 Contrato API
- [ ] Request/response no rompe consumidores existentes
- [ ] Campos nuevos son opcionales o retrocompatibles
- [ ] Documentado en fields-openapi.yaml si aplica

### 9.4 Frontend / Mobile
- [ ] Modelo cliente decodifica respuesta correctamente
- [ ] Estado loading funciona
- [ ] Estado exito funciona
- [ ] Estado error funciona
- [ ] Estado vacio funciona
- [ ] Navegacion al flujo verificada
- [ ] Compilacion exitosa

### 9.5 Integraciones externas (si aplica)
- [ ] Stripe: no afecta flujo de pago
- [ ] Twilio: no afecta notificaciones
- [ ] Email: no afecta envios
- [ ] Push: no afecta notificaciones
- [ ] Otros: _especificar_

### 9.6 Seguridad
- [ ] No se exponen secretos en logs ni respuestas
- [ ] Permisos minimos aplicados
- [ ] Datos personales protegidos

---

## 10. Decisiones y riesgos

### 10.1 Decisiones tomadas

| Decision | Motivo |
|---|---|
| _que se decidio_ | _por que_ |

### 10.2 Autoridad y resoluciones contractuales

> Completar cuando `practices/15-contract-authority.md` se haya cargado y exista una contradiccion o
> una resolucion contractual. Marcar `N/A - sin contradiccion material` cuando corresponda.

| Alcance | Claim A + fuente/autoridad/estado | Claim B + fuente/autoridad/estado | Decision/owner | Clase | Supersesion y propagacion |
|---|---|---|---|---|---|
| _scope_ | _claim_ | _claim_ | _cual gobierna + owner/fecha_ | `ERROR` / `CLARIFICATION` / `ADDITION` / `MODIFICATION` / `IMPROVEMENT` | _artefactos afectados_ |

### 10.3 Riesgos

| Riesgo | Severidad | Mitigacion |
|---|---|---|
| _descripcion_ | Baja/Media/Alta | _que hacer_ |

### 10.4 Inconsistencias detectadas

| Inconsistencia | Resolucion |
|---|---|
| _que se encontro_ | _que se hizo o que queda pendiente_ |

---

## 11. Actualizaciones de memoria

| Fichero | Actualizado | Motivo |
|---|---|---|
| `CLAUDE.md` | si/no | |
| `docs/memory/*` | si/no | |
| `docs/features/FTR-NNN-action-memory.md` | si/no | |
| `docs/contracts/*` | si/no | |
| `docs/governance/README.md` | si/no | |

---

## 12. Siguiente paso recomendado

1. Accion concreta siguiente.
2. Verificaciones manuales pendientes.
3. Prompt de seguimiento si aplica.

### 12.1 Checkpoint de continuidad

> Obligatorio si el estado final es `PARCIAL`, `BLOQUEADO` o `NO VERIFICADO`. Recomendado para prompts largos.

| Campo | Valor |
|---|---|
| Objetivo activo | _que se estaba intentando completar_ |
| Estado actual | `DONE` / `IN_PROGRESS` / `BLOCKED` / `PENDING` |
| Ultimo fichero/modulo tocado | `ruta/fichero.ext` |
| Cambios ya aplicados | _resumen minimo_ |
| Cambios pendientes inmediatos | _siguiente bloque concreto_ |
| Verificaciones ejecutadas | _comando + resultado_ |
| Como continuar | _prompt o comando exacto_ |

### 12.2 Tmp/scratch memory y evidencia

> Usar solo si el prompt fue largo, `LEVEL 3`, multi-gate o con riesgo de interrupcion. No usar `docs/prompts/` para scratch memory.

| Campo | Valor |
|---|---|
| Tmp utilizado | `docs/prompts-output/<PROMPT_ID>/tmp/` / `N/A` |
| Evidence utilizado | `docs/prompts-output/<PROMPT_ID>/evidence/` / `N/A` |
| Contenido consolidado en reporte/memoria | si/no + destino |
| Tmp/evidence sin trackear intencional | si/no + motivo |
| Revision de secretos | `PASS` / `N/A` / detalle |
