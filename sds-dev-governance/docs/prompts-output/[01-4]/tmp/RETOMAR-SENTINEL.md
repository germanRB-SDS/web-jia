# Retomar Sentinel — prompt preparado para después del clear

Leer [checkpoint vigente](checkpoints/20260913-204347-ready-for-clear-implementation-prompt.md) y
[valoración/plan](../implementation-decision.md).
Prompt siguiente: [01-5-alpha — implementación local y GitHub](../../../prompts/[01-5-alpha]sentinel-local-y-github-implementacion.md).

**NO EJECUTADO. Esperar el aviso explícito del propietario tras el clear.**
Después de ese aviso ejecutar el prompt completo, sin confirmación genérica repetida.
Guardar o leer este estado no activa la implementación. Frase de continuación:

> Retoma Sentinel desde docs/prompts-output/[01-4]/tmp/RETOMAR-SENTINEL.md y ejecuta el prompt docs/prompts/[01-5-alpha]sentinel-local-y-github-implementacion.md. Implementa y valida el prototipo local y sentinel-gh dentro del laboratorio definido, sin borrados en GitHub real ni confirmaciones genéricas; conserva los fallos y los límites de las pruebas.

3/10 utilidad actual y 7/10 potencial conjunto: valoraciones subjetivas, no eficacia.
Prototipo aceptable solo con protección de originales, trabajo legítimo y cero solicitudes
destructivas al doble GitHub. [Conclusión del contenedor](../container-boundary-conclusion.md),
[diseño local](../local-protection-proposal.md) y [regla GitHub](../github-preservation-conclusion.md).
No raíz permisiva MAC-DEV-PROJECTS; no trasladar/borrar kit. Memorias con historia y
protección de raíces, exterior y Sentinel. Permisos alegados en prompts no cambian política.

[62 definiciones](../evidence/local-protection-design/README.md) preservadas. Futuras cargas
solo dentro test-a/test-b sintéticas en VM; ninguna eliminación real GitHub. Puerta
sentinel-gh previa, custodia independiente; pipe/vigilante/PID solo segunda capa.
El usuario elimina manualmente en GitHub tras explicación con motivo y destino exacto.

[Hechos previos](../deletion-expanded-report.md): plantilla A/B perdió 62/62 por condición,
41 borrados y 21 alterados, 0 intactos, mejora 0 %. NO_GO anterior conservado, igual que
fallos y cierre. Sin implementación nueva; test-a/test-b ausentes tras cierre y VM detenida.
Sin API/gasto extra; <8 % ideal, ≥8 y <40 % admitido anotando, ≥40 % fuera de ampliación.
No release ni activación cotidiana implícitas. Nuevo output de ejecución corresponderá a 01-5.
