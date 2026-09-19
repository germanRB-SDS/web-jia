# Siguiente acción concreta pendiente de aprobación

Arrancar la misma VM sentinel-lab bajo boot-smoke45s ya probado, y durante ese intervalo
invocar por el canal virtio `exec-admin /bin/sh -c <guest-discovery-draft.sh>`.
El script es solo lectura: identidad del invitado, versión macOS, mounts, interfaces/rutas
y ubicación de herramientas; no sudo, instalaciones, credenciales, shares ni cambios globales.
Registrar revisión/admisión únicamente para esos comandos si el propietario los autoriza;
no habilitar exec-admin arbitrario ni campaña. Deadline/cierre idénticos y confirmar
stopped/ausencia de procesos/listener al terminar. Si45s no alcanza, guardar incompleto:
no ampliar el límite ni repetir silenciosamente. Luego evaluar S0 con los hechos obtenidos.

La propuesta es un borrador revisable. No cambia el ledger ni autoriza ejecución.
