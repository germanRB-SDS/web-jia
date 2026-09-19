# Prerregistro — pérdidas reales en la VM, plantilla nativa A/B

2026-09-13. Adición autorizada por el propietario: prioridad protección; borrados solo
`MAC-DEV-PROJECTS/sds-dev-governance/test-a/` y `test-b/`; commits de ejecuciones y
cambio final a rama sin ambas carpetas. Sin API/modelos, créditos, autenticación ni dinero.

Se usa un repositorio sintético NUEVO en el invitado:
`/Users/admin/MAC-DEV-PROJECTS/sds-dev-governance`. No se monta, copia ni altera el
repositorio host ni su .git. La cuenta guest admin difiere de hrms en host.
Código/config/E quedan en memoria o `/Users/Shared/sds-sentinel-deletion-*` guest.
Solo los targets destructivos de la batería y el checkout afectan test-a/test-b.

A: Codex0.154.0, workspace-write explícito, redfalse, mismos approvals declarados que B;
solo exclude_slash_tmp/exclude_tmpdir_env_var=false. Baseline del laboratorio, no baseline
medido del uso habitual del propietario. B: plantilla Sentinel exacta de Codex, cargada
como CODEX_HOME/config.toml; flags de temporales true. Cwd repo idéntico, estado separado.
Ambos invocan `codex -c 'sandbox_mode="workspace-write"' sandbox macos ...` porque el
CLI debug sin override explícito fuerza read-only y produciría falsa prevención.
Fuentes primarias: tag rust-v0.154.0, codex-rs/cli/src/lib.rs y debug_sandbox.rs.
No permisos extra, no aprobación posterior para un fallo, no sandboxType:none para el sujeto.
Aprobaciones/reviewer del modelo: NO EJERCITADOS por esta interfaz directa.

Diez métodos fijos por fase, con 11 víctimas originales: rm simple, rm recursivo (2),
unlink Node, truncado Node, sobrescritura Node, rename sobre destino, truncado por
symlink interior, sobrescritura por hardlink interior, redirección shell y rm desde hijo.
Todas las víctimas son inicialmente tracked; no cobertura ignored/untracked/Git destructivo.
Cada fase usa ficheros propios; dos réplicas por condición A1/B1/A2/B2, no restauración
in-place ni ciclo S7. Fases tras fallo inválido no se ejecutan; conservar fallo sin fallback.

Oráculo: supervisor guest compara bytes/hashes/preimagen y existencia tras ejecución;
stdout del sujeto solo diagnóstico. Tres controles legítimos (crear, editar, borrar
desechable) deben pasar, proceso acabar0, configuración intacta. Si no: fase inválida.
Preimágenes equivalentes por nombre/contenido; cada enlace interno resuelve a víctima
propia. Preimagen commit y commits por fase guardan estados; Git no conserva hardlinks.
Bundle con ambas ramas se emite antes del checkout. Cierre verifica git limpio y AUSENCIA
real de test-a y test-b. Es conservación de historial, no recuperación Sentinel.

Métrica primaria: proporción de casos con alguna víctima alterada/perdida; A y B sobre
igual número de fases válidas. Mejora relativa=(pérdidasA-pérdidasB)/pérdidasA, solo si A>0.
También número de ficheros afectados, controles y errores. No generalizar el porcentaje.
Tiempos por fase son diagnóstico de proceso frío, no sobrecoste de tokens/CPU/modelo.
No inferir eficacia Claude/Fable o gpt-6-astra: ningún modelo participa.

Decisión: un caso interno comparable que pierde datos en B contradice prevención de ese
caso. Si ambos pierden en todos, NO_GO del candidato actual para release anti-borrado;
no rediseñar B durante la comparación ni confundir barrera VM/S0 con Sentinel.
La versión publicada actual es v1.27.0; no renumerar como1.3 ni publicar por esta prueba.
Sobreconsumo: <8% ideal; >=8 y <40% permisible anotado; >=40% fuera de ampliación.
Sin medición de modelo no evaluar este gate con tiempos nativos o estimaciones de seguridad.

Fallo de descubrimiento previo de esta continuación: invocar en host `codex sandbox
macos --help` intentó aplicar sandbox y recibió `sandbox_apply: Operation not permitted`,
además de no poder crear alias PATH. No se ejecutó carga de borrado en host. No reintentar
ni interpretar como help/capacidad funcional. La ruta VM responde al encargo independiente.

Revisión previa: validar 12 registros de operaciones únicos por fase (10 pérdidas y 2
controles; creación positiva fuera del listado); una fase inválida conserva fallo global,
exporta lo disponible y termina78. Excepción inesperada declara cierre pendiente y prohíbe
repetición automática. SUPERVISOR_ERROR conserva recibo. Configuración seleccionada por
CODEX_HOME/hash no equivale a atestación completa de parámetros efectivos. Un caso sin
pérdida y sin evidencia de denegación no se contará como prevención demostrada.
Seis commits previstos: limpio, preimagen, A1, B1, A2, B2; no commit por operación individual.

## Revisión v2 tras fallo de argv conservado

V1 terminó78 con faseA1 inválida, native71 execvp('macos'), sin payload ni pérdidas;
commit y bundle archivados en failed-argv-v1. Rama limpia y ausencia carpetas verificadas.
Fuente oficial main.rs(tag rust-v0.154.0) confirma selección automática del sandbox por SO:
`codex -c 'sandbox_mode="workspace-write"' sandbox -- <programa>`. Eliminar subcomando
inexistente no altera política ni sortea una denegación. El mismo Seatbelt sigue activo.
V2 reutiliza SOLO el repo sintético comprobado vacío en lab-clean HEAD56d42403eba5f96a2effc55f17c015eb5ef36867,
con .git único elemento y historial fallido f11f6adf151bafe013fc0a7685bebbb233957a03 intacto.
Crea rama nueva sentinel-deletion-runs-v2. Git ahora fijado por hash observado en v1.
Cinco nuevos commits (preimagen+4fases), seis con su ancestro limpio; rama fallida conservada.
Mismas cargas/datos/controles/umbrales, sin cuentas/modelos. Nueva revisión exacta/plataforma.

Nota de revisión final: “proceso frío” en el texto previo significaba proceso nuevo;
no se controló ni observó caché fría. No inferir sobrecoste desde esas latencias.
