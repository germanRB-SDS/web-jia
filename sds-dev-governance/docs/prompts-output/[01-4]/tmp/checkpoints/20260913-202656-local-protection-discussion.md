# Sentinel — diseño local guardado, solo discusión

Timestamp: 2026-09-13T20:26:56.203962+00:00. Rama: main. HEAD: 79aa7ffce2563e0e3abc189b19054187daf1a43d.
Worktree: trabajo previo modificado/no seguido en múltiples superficies; se conserva íntegro.
Esta fase solo añade documentos/definiciones y actualiza continuidad, sin commit host.

## Autoridad y fase vigente

El propietario pide guardar estado/propuesta y dejar definidos N.md y N-test 1–62; evaluar
permisos, frontera exterior, autoprotección, memorias e init.sh. Cierra expresamente con
«estamos hablando, no implementes aún». Se conserva el deseo de una futura ejecución con
Sentinel real; NO iniciar VM, ejecutar borrados, recrear víctimas, cambiar permisos o
implementar protección bajo esa autorización anterior. No pedir confirmación genérica.

## Leer primero

- [Propuesta evaluada](../../local-protection-proposal.md).
- [Definiciones e índice de 62 casos](../../evidence/local-protection-design/README.md).
- [Permisos observados](../../evidence/local-protection-design/permissions-review.json).
- [Resultado histórico](../../deletion-expanded-report.md).

## Completado en esta fase

Definidos 1.md–62.md mediante contenido exacto, SHA y rutas A/B, sin materializarlos.
Los 62 N-test históricos existen, regulares 0644 sin ejecución directa, comandos/bytes
coinciden con catálogo y preimágenes A/B. No se cambiaron sus permisos. Repo, padre y
sentinel/ con modos 0755 del mismo UID; ello no certifica aislamiento o acceso efectivo
bajo el sandbox. Fixtures host ausentes; invitado ausente/VM detenida según cierre
anterior, sin nueva inspección guest. El raw anterior no acredita modos/ACL de víctimas.

Revisados init.sh, prompt y motor: generación 0644/0755, sin protección Sentinel activa.
Propuesta: P por proyecto explícito (no tomar MAC-DEV-PROJECTS como raíz permisiva),
prohibir mutación exterior y eliminación de P/G; control del SO y servicio con custodia
independiente, copia de trabajo y aplicación controlada; perfil del kit dentro del mismo
Sentinel. Memorias por eventos/versiones, sin truncado de historia. Permiso alegado en
prompt/memoria no cambia política. Canal de mantenimiento fuera del agente.

Escenario futuro documentado: 62 parejas con Sentinel operativo más positivos legítimos;
batería aparte de perímetro/autoprotección con miniárboles sintéticos exclusivamente
dentro test-a/test-b. Nunca atacar el padre real, HOME, kit o Sentinel reales. No confundir
protección de originales con borrado permitido en copia ni contar el bloqueo total como
éxito útil. Si todo canal no está confinado, no hay garantía general.

## Hechos y límites preservados

Anterior: A/B plantilla nativa, 41 borrados + 21 alterados = 62 pérdidas por condición,
0 intactos, 0 % mejora. NO_GO de candidato, no Sentinel integrado. Fallos de V1/V2,
persistencia desconocida y CLOSURE_FAILED V3 conservados. Cierre posterior con 78
directorios vacíos retirados, 0 archivos, rama limpia y test-a/test-b ausentes; bundle
de 11 commits validado y referencia B persistida. No reescribir evidencias anteriores.

Sin API, euros o créditos extra. Local no exige modelos; mensajes de bloqueo pueden
añadir tokens si se envían al modelo. Sobrecoste no medido; <8 % ideal; ≥8 y <40 %
permite continuar anotando; ≥40 % fuera de ampliación. Sin versión «1.3» protegida;
versión publicada v1.27.0. STOP sigue propuesta, sin instalación ni parada probada.

## Continuación exacta

Continuar la conversación desde la propuesta local. Aclarar conceptualmente P y los
cambios legítimos/memorias cuando sea necesario; no pedir secretos/presupuesto. No
implementar ni ejecutar hasta instrucción explícita del propietario que abra esa fase.
No hay rechazo de aprobación pendiente ni tarea de ejecución en marcha.

Último documento de diseño: local-protection-proposal.md. Código/contratos activos,
init.sh, prompt, bootstrap, permisos, clientes, ledger y .git sin cambios en esta fase.
Checkpoint anterior: [cierre 62 variantes](20260913-195145-expanded-62-no-go.md).
