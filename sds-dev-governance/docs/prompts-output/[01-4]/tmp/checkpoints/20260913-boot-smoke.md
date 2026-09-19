# Retomar Sentinel — estado vigente

Timestamp: 2026-09-13T14:41:10.555393+00:00. Branch main, HEAD79aa7ffce2563e0e3abc189b19054187daf1a43d.
LEVEL3 security. Índice vacío, cambios anteriores preservados, .git solo lectura. No commits.

Lee [informe actual](../../boot-smoke-report.md) y evidencia/boot-smoke/admission.md/verification.json.
Histórico anterior: 20260913-142537-sentinel-ab.md; no reutilizar su afirmación «VM no arrancada».

Completado: supervisor14/14 y sink3/3; smoke de 45 s arrancó VM en escalación aprobada;
Tart12976 PGID12976 y sink12977 PGID12977 desaparecieron; final VM stopped y listener ausente.
Primer arranque restringido abortó6 en AppKit, evidencia conservada. No nueva descarga/instalación.

Pendiente: S0, no privilegiado/P/X/Y/egress; backend/B real; A/B/A2/B2; coste <8%.
A=sin Sentinel, B=con candidato. 0 intentos, métricas null. No activar fuera del lab.

Bloqueo: auto-review rechazó ampliar ledger + discovery con sudo + segundo smoke (nada ejecutado).
Borrador reducido sin sudo en evidence/boot-smoke/guest-discovery-proposal.md y .sh, NO ADMITIDO.
Siguiente paso exacto: recibir aprobación explícita del propietario para ese discovery
read-only y su admisión exacta, luego smoke de 45 s + virtio lectura + verificación de cierre.
No eludir rechazo ni pedir al usuario un comando Terminal. Si el usuario ya da esa aprobación
en chat al reanudar, conservarla y seguir sin reconfirmar. Mantener cualquier denegación nueva.

No MCP, credenciales, hooks/settings globales ni procesos propios vivos al cierre.
Delta propio en tart_host/net_sink/tests, ledger admitido solo smoke/synthetic, informes/evidencia.
Tests y revisión hashes en evidence/boot-smoke/revision.json. No rerun sin delta.
