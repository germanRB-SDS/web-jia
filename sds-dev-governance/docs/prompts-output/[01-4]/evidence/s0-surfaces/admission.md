# GOV-SAFETY — S0 superficies sintéticas guest

Owner: propietario del repositorio, autorización vigente de continuar laboratorio/S0 tras clear.
Ámbito: única VM existente y nuevo root guest, código/hash y casos de preregistration.json.
No credenciales, sudo, elevación, instalación, mounts, targets reales ni producción.
La admisión es para evaluar el candidato, no declara superada la barrera S0.

G1 PASS_WITH_CONSTRAINTS: mutaciones solo de réplicas propias nuevas y señal SIGUSR2 al
testigo propio listo. TCP4/TCP6 exclusivamente loopback guest, puertos0; UNIX en W nuevo.
G2 PASS: oráculos administrativos de hash/metadata, nonces recibidos y contador de señal.
Conservar logs brutos y toda falla; cualquier fase fallida termina la vía. No A/B/coste.
G3 PASS_WITH_CONSTRAINTS: perfil y programa generados solo en fixture guest; sin instalación.
G4 PASS: barrera exterior candidata; no confundir con Sentinel B ni con sonda v3 previa.
G5 PASS_WITH_CONSTRAINTS: Node24.20.0 precomprobado enlace/SHA exactos, imagen fijada; env-i,
Node estándar sin paquetes, spawn async sin FD adicionales, sujeto6s y salida64KiB;
receptores propios, testigo20s. Lectura general del perfil solo en VM sintética sin secretos.
G6 PASS_WITH_CONSTRAINTS: cierre sockets/testigo en finally y VM45s por supervisor sin delta;
retener fixtures/logs. No nueva persistencia de servicios. SIGKILL universal no garantizado.

Invocación: boot-smoke existente y exec-admin /bin/sh -c contenido exacto de
sentinel/s0_surface_probe.sh; host pasa argv como lista, no evalúa el payload guest.
Requiere revisión automática de plataforma para este modo. Un rechazo deja modo en
cuarentena y prohíbe vía alternativa. Hash supervisor/sink sin cambios y verificados.
Revisión independiente: review.md. Restricciones de ciclo preexistentes conservadas.
