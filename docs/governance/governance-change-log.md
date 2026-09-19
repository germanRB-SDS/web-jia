# Governance Change Log

Bitacora estructurada para cambios del sistema SDS Governance aplicados al proyecto.

## Regla

Registrar aqui cada cambio que modifique reglas, plantillas, scaffold, adapters, validadores,
prompts de gobernanza, estructura documental o protocolos operativos.

No sustituye al output del prompt ni al historial Git. Su funcion es indexar cambios de gobernanza
con suficiente detalle para que otro agente pueda descubrir que cambio, por que, como se usa y que
ficheros quedaron sincronizados.

## Campos obligatorios por entrada

- **ID:** identificador estable del cambio, por ejemplo `GOV-YYYY-MM-DD-NN`.
- **Fecha de incorporacion:** fecha en que el cambio entra al sistema SDS del proyecto.
- **Fecha de ultima modificacion:** fecha de la ultima edicion de esta entrada o del mecanismo.
- **Tipo SDS:** `GOV-RULE`, `GOV-STRUCTURE`, `GOV-PROMPT`, `GOV-SAFETY`,
  `GOV-CONTINUITY`, `GOV-AUTOMATION` o combinacion.
- **Prompt base:** prompt, pedido de usuario o referencia que origina el cambio; usar `N/A` si no
  existe.
- **Resumen:** descripcion corta del cambio.
- **Sistema de utilizacion:** como se descubre o usa el cambio: scaffold, init, validador,
  adapters, indice, grafo/Graphify, memoria, plantilla, output o combinacion.
- **Ficheros tocados:** tabla con ruta, accion, motivo y efecto esperado.
- **Verificacion:** comandos/revisiones ejecutadas y resultado.
- **Riesgos residuales:** riesgos conocidos o `N/A`.
- **Rollback/recuperacion:** como revertir o compensar el cambio si falla.

## Plantilla

### GOV-YYYY-MM-DD-NN — _titulo_

- **Fecha de incorporacion:** YYYY-MM-DD
- **Fecha de ultima modificacion:** YYYY-MM-DD
- **Tipo SDS:** `GOV-PROMPT`
- **Prompt base:** `N/A`
- **Resumen:** _..._
- **Sistema de utilizacion:** _scaffold / init / check-governance / docs index / Graphify / memoria_
- **Verificacion:** _..._
- **Riesgos residuales:** _..._
- **Rollback/recuperacion:** _..._

| Fichero | Accion | Por que | Efecto esperado |
|---|---|---|---|
| `ruta` | creado/modificado/eliminado | motivo | efecto |
