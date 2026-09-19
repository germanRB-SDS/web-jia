# Checklist de detección de drift (segundo pase)

> Úsala en lugar de "revisa si hay problemas". Cada bloque pregunta por un **tipo concreto** de drift.
> Responder explícitamente *Sí / No / N-A + evidencia*. Un "No" sin evidencia bloquea el cierre de fase.

## 1. Contract drift (el más frecuente y silencioso)

- [ ] ¿Algún endpoint **ya existente** cambió su request en esta fase? → ¿Está reflejado en el contrato?
- [ ] ¿Algún endpoint existente cambió su response/DTO? → ¿Contrato actualizado y **validado por test de forma**?
- [ ] ¿Hay campos que el DTO real expone y el contrato **no declara**? (revisar el builder del DTO, no solo la ruta)
- [ ] ¿Hay campos `required`/no-nullable en el contrato que el runtime puede devolver `null`/ausentes?
      (típico al añadir un flujo que deja en `null` campos antes obligatorios)
- [ ] ¿El validador de entrada acepta propiedades que el request schema del contrato no lista (o viceversa)?
- [ ] ¿El lint de contrato valida **forma de DTO** o solo **existencia de rutas**? Si solo rutas → falso verde.

## 2. Paridad entre flujos hermanos

Para CADA preocupación, ¿el flujo nuevo la trata igual que el existente, o hay decisión consciente?

- [ ] Autenticación / sesión
- [ ] Elegibilidad / anti-abuso (límites, bloqueos, no-show)
- [ ] Rate limiting
- [ ] Auditoría (acción registrada)
- [ ] Recordatorios / notificaciones
- [ ] Integración de calendario / externos
- [ ] Idempotencia / doble-submit
- [ ] i18n / strings desde constantes
- [ ] Cada "distinto" tiene **motivo escrito**; ningún "pendiente".

## 3. Side-effects de integración externa

- [ ] ¿Se escribe a un sistema externo (calendario, email, pago, webhook)?
- [ ] ¿La lógica que da forma correcta a esa escritura ya existe en esta fase?
- [ ] Si no: ¿se gatea, o queda como deuda con **prerrequisito de deploy** explícito y documentado?
- [ ] ¿Un fallo del side-effect puede revertir/duplicar la operación principal? (debe ser best-effort aislado)

## 4. Requisitos del prompt

- [ ] ¿Cada requisito explícito del prompt tiene evidencia (commit/test/doc)?
- [ ] ¿Los "si es barato / opcional" omitidos están **marcados y justificados** (no silenciosamente fuera)?
- [ ] ¿Las derivas respecto al prompt están **ratificadas** (decisión + motivo), no asumidas?

## 5. Asincronía documental

- [ ] `continuity-state` (o equivalente) describe el estado **real** y el siguiente paso.
- [ ] Memorias del agente y su índice apuntan al estado actual (no a uno anterior).
- [ ] El informe terminal de fase está al día o marcado explícitamente como *stub hasta GATE de cierre*.
- [ ] Hallazgos bloqueados por una etapa futura están **recogidos en memoria**, no solo en un informe suelto.

## 6. Concurrencia y datos

- [ ] Escrituras sensibles a contención: ¿primitiva de concurrencia, frontera atómica y riesgo residual documentados?
- [ ] Migraciones: ¿el rollback sigue siendo seguro **una vez existan datos reales** del nuevo tipo?
      Si no → migración compensatoria, no rollback simple. Documentarlo.

---

### Salida esperada del segundo pase

Una tabla `hallazgo → severidad → dónde cerrarlo → estado (recogido/corregido)` y, para cada ítem
bloqueado por una etapa futura, **el argumento de por qué no se actúa ahora** + su registro en memoria.
