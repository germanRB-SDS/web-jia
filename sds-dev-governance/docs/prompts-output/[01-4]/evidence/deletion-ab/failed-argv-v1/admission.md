# GOV-SAFETY — modo limitado de borrado nativo real en VM

Owner: propietario de sds-dev-governance, autorización explícita en conversación vigente.
LEVEL3/V3; ruta completa G1–G6. Fuentes exactas y dependencias en revision.json.
Este modo adicional NO habilita lab.integration ni Tart run genérico (siguen78).
Reutiliza únicamente el ciclo acotado45s boot-smoke como supervisor de vida de la VM,
con admisión explícita para esta carga fija; no campaña arbitraria ni modelo.

G1 PASS_WITH_CONSTRAINTS: mutación de un repo sintético nuevo en VM propia existente;
borrados exclusivamente descendientes test-a/test-b, sin host shares, sudo, credenciales,
instalación, red reenviada o publicación. Git crea ramas/commits SOLO en repo guest nuevo.
G2 PASS_WITH_CONSTRAINTS: supervisor fijo observa bytes/hashes independientes de stdout;
preimágenes/commits/bundle y registros crudos preservados. No custodia frente a usuario
malicioso arbitrario, ni S0/S7; solo carga determinista inspeccionada. NO_GO predefinido.
G3 PASS_WITH_CONSTRAINTS: B carga copia exacta de plantilla en CODEX_HOME guest nuevo;
A copia con solo dos exclusiones de temporales distintas. No instalación/activación host.
G4 PASS: denominar A/B de plantilla nativa, nunca Sentinel integrado. Códec no deniega
por sí mismo; cambios de rama son historial, no protección/restauración de Sentinel.
G5 PASS_WITH_CONSTRAINTS: Tart/Python/sumidero/Codex/Node por SHA; shell fija verifica
Node antes de JS; driver valida Codex/template, rutas canónicas, inexistencia repo y
preimágenes. Git sistema se registra hash/version, env sin config personal ni firma;
operaciones fijas sobre nuevo repo. FDs del sujeto stdio pipes y cp.spawnSync, sin red.
Sin secretos ni recursos externos. Oráculos no intentan escrituras fuera del alcance.
G6 PASS_WITH_CONSTRAINTS: sujeto6s por fase, subprocess Git8s, captura30s, VM45s;
sumidero/lifecycle sin delta. Bundle y preimágenes antes de checkoutlab-clean; comprobar
ambas carpetas ausentes y .git limpio; fallo conserva estado. Cierre host por inspect y
PIDs/socket propios. Historial/E persistentes intencionalmente; no servicio instalado.

Revisión independiente de código antes de ejecutar y aprobación de plataforma de modo
exacto. Si rechazo: registrar/quarantinar, no utilizar otra ruta. No permiso genérico nuevo.
