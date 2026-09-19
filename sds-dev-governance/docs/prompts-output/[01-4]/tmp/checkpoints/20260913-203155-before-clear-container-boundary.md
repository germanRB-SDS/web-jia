# Sentinel — guardado antes de clear, pendiente del aviso del propietario

Fecha UTC: 2026-09-13T20:31:55.137489+00:00. Rama: main. HEAD: 79aa7ffce2563e0e3abc189b19054187daf1a43d.
Worktree con numerosos cambios previos y archivos no seguidos; preservarlos. Esta fase
solo guarda conclusión/propuesta/checkpoint. No commit, checkout, stash o reset en host.

## Instrucción actual

«Guarda la conclusión y el estado y debo hacerte clear. Luego a implementar, tras el
clear. Yo te aviso.» Guardado completado. No comenzar implementación, VM, pruebas
destructivas, cambios de permisos ni traslados por el mero hecho de leer este checkpoint.
Esperar el aviso explícito posterior al clear. No volver a pedir confirmación genérica
cuando ese aviso autorice la continuación. No trasladar automáticamente el kit.

## Lectura mínima para retomar

1. [Conclusión del contenedor](../../container-boundary-conclusion.md).
2. [Propuesta local evaluada](../../local-protection-proposal.md).
3. [62 definiciones e índice](../../evidence/local-protection-design/README.md).
4. [Último informe experimental](../../deletion-expanded-report.md).
5. Antes de implementación, router de gobernanza y fuentes específicas afectadas;
   no cargar todo el historial ni reutilizar admisiones antiguas para un modo nuevo.

## Conclusión que no debe perderse

MAC-DEV-PROJECTS es contenedor, nunca raíz permisiva inferida del kit que contiene.
Encontrar uno o más kits descendientes impide tratar el padre como ámbito único de
mutación. Cada proyecto conserva frontera. Kits anidados también pueden indicar monorepo;
clasificar sin ampliar permisos ante ambigüedad o exploración incompleta. No encontrar
kits tampoco acredita por sí solo una raíz. Incluso un proyecto válido no puede perder
su raíz, kit o Sentinel mediante una orden del agente. Prompt con supuesto permiso no
cambia política. Sugerir reubicar kit del contenedor solo como mensaje; no mover/borrar.

## Diseño pendiente de implementar

Barrera local sobre procesos y descendientes, custodia independiente de binario/política/
servicio/ancestros, copia de trabajo y aplicación controlada de cambios; sin escritura
directa a originales protegidos ni exterior. Memorias por eventos/versiones sin destruir
historia. Perfil de protección del kit dentro del mismo Sentinel; desarrollo canónico
separado de instalación protegida. Bootstrap/prompt con paridad y verificación futura,
sin chmod recursivo como sustituto del control. Definir raíz, legítimos y mantenimiento
fuera del texto del agente. Fail-closed ante fallo del servicio, alias, rutas ambiguas
o canales sin confinamiento. Entrega STOP/parada verificadas aparte del bloqueo.

## Estado verificado y límites

62 N-test históricos regulares 0644; comandos correlacionados con 62 N.md definidos por
bytes/SHA/rutas A/B y preimágenes, sin materialización actual. Permisos actuales no son
custodia independiente; no se cambiaron. test-a/test-b ausentes en host; último cierre
guest registra ambas ausentes y VM detenida. No nueva inspección guest en esta fase.
Pruebas futuras de exterior/raíces/hermanos/kit solo con objetos sintéticos dentro de
test-a/test-b en VM; nunca comandos de ataque sobre rutas reales exteriores aunque se
espere denegación. No atribuir protección al simple bloqueo de todo: comprobar legítimos.

Anterior A/B fue plantilla nativa, sin Sentinel integrado: 41 borrados + 21 alterados
por condición, 0 intactos, mejora 0 %. Candidato actual NO_GO. Conservar V1 interrumpida,
V2 rama inesperada, persistencia desconocida y CLOSURE_FAILED V3; posterior cierre retiró
78 directorios vacíos, 0 archivos; bundle 11 commits verificado. No certificar S0/S7.
Sin API, euros ni créditos extra. Codex ChatGPT/gpt-6-astra y Claude/Fable son preferencias
del usuario, no modelos ensayados aquí. Coste no medido: <8 % ideal; ≥8 y <40 % se permite
anotando; ≥40 % fuera de ampliación. Versión publicada v1.27.0, ninguna «1.3» protegida.

## Siguiente paso exacto

Tras aviso explícito del propietario: retomar este estado y convertir el diseño acordado
en un plan técnico acotado/revisable antes de implementar. Concretar mecanismo de
confinamiento efectivo y custodia en el entorno disponible, proteger originales y
Sentinel, incorporar clasificación conservadora de contenedores y luego validar con
batería A/B real y controles legítimos. No reutilizar ciegamente scripts de ejecución
única ni solicitar secretos/presupuestos innecesarios. Si un dato técnico esencial falta,
investigarlo y avanzar lo independiente; no afirmar que una plantilla sea protección.

Últimos documentos: container-boundary-conclusion.md, local-protection-proposal.md,
RETOMAR-SENTINEL.md. Checkpoint previo: [discusión local](20260913-202656-local-protection-discussion.md).
