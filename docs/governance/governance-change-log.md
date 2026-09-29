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

### GOV-2026-09-29-01 — Componentes interactivos portables

- Incorporación / última modificación: 2026-09-29.
- Tipo: GOV-STRUCTURE. Prompt base: petición del propietario y
  `sds-dev-governance/tmp/portable-ui-export/[64-0]exportar-componentes.md` (ubicación autorizada).
- Descubrimiento: índice existente de resources → how-to de una sola hoja; knowledge bajo demanda.
- Verificación: tipos/build, 9 escenarios Chrome, instalación aislada, checker SDS y suite canónica.
  Un test de freshness falla por timeout también en c63d175 sin cambios; fuera del delta de recursos.
- Riesgos residuales: medios originales no redistribuidos; sólo Chrome emulado; sin certificación
  Safari/dispositivo/lector de pantalla. Distribución aditiva preserva divergencias de reglas.
- Recuperación: revertir commits de esta tarea; en copias receptoras retirar únicamente overlay
  identificado por el recibo, preservando cualquier edición posterior. Sin force-push.

| Archivo / grupo | Acción | Motivo / efecto |
|---|---|---|
| resources/web-components/{collaborators-carousel,film-reel,cube-carousel}/ | Crear | Código completo, dependencias locales, geometría, motion, tokens, demos, lock, fixtures, QA, capturas y hashes |
| resources/index-of-resources-and-working-patters.md y web-components/README.md | Ampliar | Registrar los tres recursos sin perder entradas anteriores |
| knowledge/web-jia/portable-interactive-components.md y sus índices | Crear/enlazar | Conservar arquitectura y receta de extracción |
| README.md, VERSION.md, CHANGELOG.md | Actualizar | Publicar v1.31.0 con alcance veraz |
| tmp/portable-ui-export/ | Crear | Prompt autorizado y distribuidor aditivo explícito/dry-run |
| docs/prompts-output/[64-0]/ | Crear | Evidencia, checkpoint, reporte y límites |

Matriz de sincronización: CHANGE recursos/índices/knowledge/metadatos/logs; N/A prácticas, kernel,
adapters, bootstrap/scaffold, capability ledger, validators y memoria frontend: no cambia su contrato
ni la web en runtime. Source web-jia 46065c5; canon c63d175. El material sentinel/deployment existente
sólo en la copia se conserva localmente; no se sustituye ni se promociona como parte de este delta.
