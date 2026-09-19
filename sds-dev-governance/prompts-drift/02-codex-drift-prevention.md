# Prompts Drift Prevention

> Estado: guía local de prevención de drift para prompts SDS. No sustituye `GOVERNANCE.md` ni las
> prácticas canónicas; sirve como checklist operativo para convertir errores reales en mejores gates.

## Problema

Un prompt puede quedar "verde" aunque haya drift si la validación se concentra en lo nuevo y no en
todo lo que el cambio toca indirectamente. El caso detectado en `[19-0-alpha]` fue claro:

- P5.5 sí actualizó OpenAPI para endpoints públicos nuevos.
- P5.2/P5.4 ya habían cambiado contratos admin existentes.
- El lint de OpenAPI seguía verde porque validaba rutas y algunos invariantes, pero no la forma real
  de DTOs admin modificados.

Resultado: falso verde contractual. Runtime funcional, pero contrato incompleto para futuros clientes
o frontend.

## Medidas preventivas

### 1. Matriz de contrato por endpoint afectado

Todo prompt `contract-change` debe listar no solo endpoints nuevos, también endpoints existentes que
cambian por DTO, payload, status code, campos nullable o semántica.

Formato mínimo:

| Endpoint | Tipo de cambio | Código fuente | Schema OpenAPI | Test que lo cubre |
|---|---|---|---|---|
| `PATCH /api/admin/bookings/{id}` | request añade `confirmationStatus` | ruta/schema zod | `AdminUpdateBookingRequest` | test |
| `GET /api/admin/bookings` | response añade campos/nullables | DTO builder | `AdminBookingItem` | test |

Gate: ningún endpoint en la matriz puede quedar sin schema o sin motivo `N/A`.

### 2. Comparar DTO real contra contrato

Cuando un serializer/DTO builder cambia, el prompt debe obligar a revisar el schema OpenAPI que lo
representa. No basta con añadir una ruta al set `implemented`.

Señales de DTO cambiado:

- se modifica un `build*Dto`;
- se cambia `map*`;
- un `JOIN` pasa de `JOIN` a `LEFT JOIN`;
- un campo pasa a nullable;
- se añaden action flags (`canConfirm...`, `canReject...`);
- se añade un estado o subestado (`confirmationStatus`);
- se relaja un `NOT NULL` de base de datos;
- se añade un flujo discriminante (`bookingFlow`).

### 3. Invariantes de lint para cambios críticos

El lint custom debe crecer donde ya hubo drift, de forma quirúrgica.

Ejemplos derivados de `[19-0-alpha]`:

- `AdminUpdateBookingRequest` debe incluir `confirmationStatus` cuando runtime lo acepta.
- `AdminBookingItem.serviceId/serviceName` deben admitir `null` si existe `capacity_based`.
- `AdminBookingItem` debe documentar campos capacity expuestos por `buildBookingDto`.
- `AdminSettingsResponse` y `AdminSettingsUpdateRequest` deben documentar `capacity` y campos capacity
  si las rutas admin settings los devuelven/aceptan.

Regla práctica: cada hallazgo de contrato que pasó con lint verde debe añadir un check barato al lint
o quedar documentado como imposible de automatizar.

### 4. Analysis gate por subfases, no solo por la última subfase

Un analysis gate debe declarar su alcance real:

- si evalúa solo P5.5, debe decir "solo P5.5";
- si el resultado condiciona la continuación del prompt, debe revisar todas las subfases ya ejecutadas;
- si encuentra un fallo de una subfase anterior, debe registrarlo aunque la subfase actual esté verde.

Checklist:

- GATE 0 revisado.
- Migraciones y rollback revisados.
- Repositorios y DTOs revisados.
- Servicios y transacciones revisados.
- Rutas públicas revisadas.
- Rutas admin existentes afectadas revisadas.
- OpenAPI/lint revisado contra todos los anteriores.
- Tests revisados contra riesgo, no solo contra implementación.
- Impacto en fases pendientes registrado.

### 5. "Falso verde" como categoría explícita

Los informes deben incluir una sección breve:

```md
## Posibles falsos verdes

| Check verde | Qué NO cubre | Mitigación |
|---|---|---|
| `lint:openapi` | forma real de DTO admin | añadir invariantes o revisión manual |
```

Esto evita interpretar un check parcial como garantía total.

### 6. Continuity state con instrucciones de siguiente prompt

Cuando un análisis detecta drift que afecta a lo pendiente, el continuity state debe decir exactamente
cómo continuar. Para `[19-0-alpha]`:

1. No crear directamente `[19-1]` sin integrar el análisis.
2. El nuevo prompt `[19-1]` debe partir de:
   - lo que queda por ejecutar de `[19-0-alpha]`;
   - el análisis `docs/prompts-output/[19-0-alpha-analysis-gate-P5.5]capacity-public-endpoints-analysis-output.md`;
   - los hallazgos abiertos en `docs/prompts-output/[19-0]continuity-state.md`.
3. Antes de UI/frontend, cerrar o introducir en el prompt los fixes de contrato admin detectados.

## Aplicación al caso `[19-0-alpha]`

Hallazgo raíz:

- P5.2 y P5.4 cambiaron endpoints admin existentes.
- P5.5 cerró OpenAPI pública.
- El contrato admin quedó probablemente desalineado.

Medida inmediata:

- antes de GATE B, corregir OpenAPI admin y ampliar `scripts/lint-openapi.js`;
- después, generar `[19-1]` incorporando lo pendiente y el análisis.

## Regla de bolsillo

Si una fase cambia una estructura que otro módulo serializa, valida, documenta o consume, el prompt no
está cerrado hasta revisar ese otro módulo. Los checks verdes son evidencia solo de lo que realmente
comprueban.

## Recursos

- [`01-claude-drift-checklist.md`](./01-claude-drift-checklist.md) — checklist accionable del segundo
  pase, organizada por tipo de drift (contrato, paridad entre flujos hermanos, side-effects externos,
  requisitos del prompt, asincronía documental, concurrencia/datos). Úsala en vez de "revisa si hay
  problemas".

## Validación e incorporación del checklist de Claude

El checklist de Claude queda incorporado como fuente 1 porque es correcto y cubre los puntos que
fallaron en `[19-0-alpha]`. Esta guía lo valida así:

| Bloque de Claude | Validación | Por qué se acepta |
|---|---|---|
| Contract drift | Aceptado como gate obligatorio para `contract-change`. | El hallazgo S2 fue exactamente un falso verde: rutas nuevas documentadas, pero contratos admin existentes desalineados. |
| Paridad entre flujos hermanos | Aceptado como revisión de coherencia, no como obligación de igualar todo. | Capacity y profesional pueden diferir, pero cada diferencia debe tener decisión escrita: login, no-show, recordatorios, calendario e idempotencia. |
| Side-effects de integración externa | Aceptado como deploy gate. | Calendar estaba cableado antes de tener títulos/descripcion capacity; eso no rompe DB, pero sí puede crear datos externos incorrectos. |
| Requisitos del prompt | Aceptado como trazabilidad estricta. | El test de doble-submit era un requisito "si es barato"; al omitirse sin registrarlo, quedó drift de prompt. |
| Asincronía documental | Aceptado como condición de continuidad. | Un informe puede quedar actualizado mientras continuity, memoria o informe terminal quedan atrasados; entonces el siguiente agente retoma mal. |
| Concurrencia y datos | Aceptado como revisión de riesgo post-verde. | El lock evitó overbooking, pero rollback post-datos y pending sin caducidad siguen siendo riesgos operativos reales. |
| Salida esperada del segundo pase | Aceptado. | La tabla `hallazgo → severidad → dónde cerrarlo → estado` es la forma más barata de impedir que un hallazgo quede solo en narrativa. |

### Checklist integrado con validación

Usar este bloque dentro de prompts o analysis gates. Responder cada punto con `Sí`, `No` o `N/A`,
siempre con evidencia. Un `No` sin evidencia bloquea el cierre.

#### 1. Contract drift

- [ ] ¿Algún endpoint ya existente cambió su request en esta fase?
  - Validado: sí debe revisarse. Un request admin puede cambiar aunque el prompt esté centrado en una ruta pública.
- [ ] ¿Algún endpoint existente cambió su response/DTO?
  - Validado: sí debe revisarse contra serializer/DTO builder, no solo contra la ruta.
- [ ] ¿Hay campos que el DTO real expone y el contrato no declara?
  - Validado: fue parte de S2 (`bookingFlow`, `confirmationStatus`, flags capacity).
- [ ] ¿Hay campos `required`/no-nullable en contrato que runtime puede devolver `null` o ausentes?
  - Validado: fue parte de S2 (`serviceId`, `serviceName` con capacity).
- [ ] ¿El validador de entrada acepta propiedades que el request schema del contrato no lista, o viceversa?
  - Validado: fue parte de S2 (`confirmationStatus` en PATCH admin).
- [ ] ¿El lint de contrato valida forma de DTO o solo existencia de rutas?
  - Validado: `lint:openapi` verde no garantizaba DTO admin.

#### 2. Paridad entre flujos hermanos

Para cada preocupación, decidir si el flujo nuevo copia el comportamiento existente o se desvía con
motivo escrito:

- [ ] Autenticación / sesión.
- [ ] Elegibilidad / anti-abuso (límites, bloqueos, no-show).
- [ ] Rate limiting.
- [ ] Auditoría.
- [ ] Recordatorios / notificaciones.
- [ ] Integración de calendario / externos.
- [ ] Idempotencia / doble-submit.
- [ ] i18n / strings desde constantes.

Validación: se acepta porque no exige paridad ciega. Exige que cada diferencia sea consciente. En
`[19-0-alpha]`, login, no-show, recordatorios y doble-submit necesitaban precisamente esa ratificación.

#### 3. Side-effects de integración externa

- [ ] ¿Se escribe a un sistema externo (calendario, email, pago, webhook)?
- [ ] ¿La lógica que da forma correcta a esa escritura ya existe en esta fase?
- [ ] Si no existe, ¿se gatea o queda como deuda con prerrequisito de deploy explícito?
- [ ] ¿Un fallo del side-effect puede revertir o duplicar la operación principal?

Validación: se acepta porque los side-effects externos son visibles fuera de la DB y suelen sobrevivir
a rollbacks. En P5.5, Calendar era best-effort, pero podía crear eventos semánticamente erróneos.

#### 4. Requisitos del prompt

- [ ] ¿Cada requisito explícito del prompt tiene evidencia (commit, test o doc)?
- [ ] ¿Los requisitos "si es barato" u opcionales omitidos están marcados y justificados?
- [ ] ¿Las derivas respecto al prompt están ratificadas con decisión y motivo?

Validación: se acepta porque evita que una omisión pequeña se esconda detrás de una suite verde. El
caso concreto fue el test de doble-submit.

#### 5. Asincronía documental

- [ ] `continuity-state` describe el estado real y el siguiente paso.
- [ ] Memorias del agente o índices apuntan al estado actual.
- [ ] El informe terminal está al día o marcado explícitamente como stub hasta cierre.
- [ ] Hallazgos bloqueados por etapa futura están recogidos en memoria, no solo en un informe suelto.

Validación: se acepta porque el siguiente agente trabaja desde continuity y memoria, no desde todo el
histórico. Si esos archivos no reflejan los hallazgos, el drift se repite.

#### 6. Concurrencia y datos

- [ ] Escrituras sensibles a contención tienen primitiva de concurrencia y frontera atómica documentadas.
- [ ] Migraciones documentan si rollback sigue siendo seguro una vez existan datos reales del nuevo tipo.

Validación: se acepta porque una suite puede probar la carrera principal y aun así dejar riesgos de
operación. En `[19-0-alpha]`, el lock está bien, pero pending sin caducidad y rollback post-datos siguen
siendo decisiones operativas.

### Salida integrada esperada

Todo segundo pase debe terminar con:

| Hallazgo | Severidad | Dónde cerrarlo | Estado |
|---|---|---|---|
| ejemplo | crítico/severo/moderado/menor | fase o prompt concreto | recogido/corregido/diferido |

Para cada hallazgo diferido, añadir:

- por qué no se corrige ahora;
- qué condición lo convierte en bloqueante;
- dónde queda registrado para el siguiente agente.
