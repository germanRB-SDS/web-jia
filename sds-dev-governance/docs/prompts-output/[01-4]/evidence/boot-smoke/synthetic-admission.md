# GOV-SAFETY — evaluación sintética de interrupción

2026-09-13. Owner: propietario, continuación explícita RETOMAR-SENTINEL.
Revisión exacta: revision.json. Modo: tests Python locales propios y sockets AF_UNIX sintéticos, sin Tart/VM/red IP.

G1 PASS_WITH_CONSTRAINTS: señales solo entre supervisor sintético y sus hijos nuevos.
G2 PASS: conserva errores/recibos, no acredita S0 ni campaña.
G3 PASS_WITH_CONSTRAINTS: fuentes locales candidatas; sin instalación ni cambios globales.
G4 PASS: mismo supervisor y ruta killpg; no ejecutor alternativo.
G5 PASS_WITH_CONSTRAINTS: stdlib, Python identificado, datos sintéticos, tiempo acotado.
G6 PASS_WITH_CONSTRAINTS: TERM/INT se enrutan al cierre; confirmar ESRCH en test.
SIGKILL del supervisor no es capturable y no se declara recuperación garantizada.
Reutilización: sumidero y public_registry sin delta; supervisor previo cubierto por tests
históricos, suite dirigida repetida por nuevo manejo de señales que alcanza capture completo.
Boot aún no admitido por este documento; su modo se revisa aparte antes de ejecutar.

Delta: sumidero con expiración de 180s y cierre por pérdida del padre, sin reenvío; tests Unix propios admitidos. G1/G5/G6 reabiertos y acotados al mismo modo sintético.
