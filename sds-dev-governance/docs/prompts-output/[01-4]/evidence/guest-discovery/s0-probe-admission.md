# GOV-SAFETY — sondas sintéticas de archivos del laboratorio

Autoridad: encargo original reanudado de automatizar y ejecutar laboratorio/S0 (checkpoint
20260913-142537-sentinel-ab.md), más discovery explícitamente autorizado y completado.
Este modo es una continuación técnica sin sudo; no amplía la autorización a datos reales,
instalaciones, credenciales, red ni cambios globales. Sometido a revisión automática de plataforma
antes de ejecutar. Un rechazo deja el modo en cuarentena, sin vía alternativa.

Revisión de script/perfil/plan: s0-probe-preregistration.json; supervisor: revision.json.
Invocación: mismo boot-smoke45s y exec-admin /bin/sh -c contenido exacto de sentinel/s0_probe.sh.
Objetos: solo nuevo root guest /private/tmp/sds-sentinel-s0.XXXXXX. Sin otros paths de escritura
intencional salvo descriptores propios stdout/stderr y /dev/null. Conservar fixtures/logs.

G1 PASS_WITH_CONSTRAINTS: creación de réplicas sintéticas y pruebas de escritura locales,
ningún target real; efecto no permitido en canario es dato del ensayo, no permiso para continuar.
G2 PASS: observador administrativo compara contenido y registra estados; no cuenta como A/B/S0
completo. Datos originales/minimizados host fuera del invitado.
G3 PASS_WITH_CONSTRAINTS: perfil de prueba generado solo dentro del root nuevo del invitado;
no modifica usuarios/servicios/ajustes; no instala ni activa Sentinel en clientes.
G4 PASS: outer sandbox candidato separado de Sentinel B; solo sondas de barrera.
G5 PASS_WITH_CONSTRAINTS: /bin/sh y sandbox-exec del SO invitado26.6.2; perfil deny-default,
file-read permitido y file-write limitado a P/X; ejecución solo sh. No sudo ni sockets IP.
G6 PASS_WITH_CONSTRAINTS: proceso sujeto no inicia background; shell administrativo termina,
VM cierra45s y se comprueba ausencia de procesos/listener. Un fallo no habilita fallback.

Revisión independiente /root/review_vm: apto para evaluación mínima condicionada a admisión
exacta/plataforma. Mejorados positivos W/FD conforme revisión. El oráculo textual sirve solo
para valores fijos; custodia host/guest general, red, política, metadatos y privilegios pendientes.
Sonda heredadaFD9 puede modificar solo canario sintético, con FAIL y parada de la vía.

## Delta v2 — intérprete real del shell

La evaluación de plataforma aprobó v1 y solo hubo efectos en root sintético MOv9AK.
Positivos4/4; sandbox no pudo iniciar sh porque el SO encadena /bin/bash, no admitido en v1.
Y/W intactos, P/X no creados; FAIL de arranque, no prueba de prevención.
G1/G5 reabiertos PASS_WITH_CONSTRAINTS para v2: añadir solo /bin/bash a /bin/sh en process-exec,
misma cadena nativa observada y datos sintéticos; no ampliar file-write/Mach/red/privilegios.
No denegación de plataforma en v1: la negativa observada pertenece al perfil experimental
creado para evaluar S0; su corrección se revisa/versiona y se somete a auto-review nuevamente.
Una ejecución nueva, fixture nuevo, mismo45s, sin reinterpretar el intento previo como PASS.

## Resultado v2 — fallo confirmado de FD heredado

P/X permitidos, Y/W por ruta denegados, FD9 permitió escritura y alteró Y. Outcome FAIL.
No se certifica Seatbelt aislado para revocar FDs abiertos; positivo correspondiente PASS.
Candidato v3 en revisión: launcher Node instalado, env vacío, spawnSync con stdin ignore y
stdout/stderr pipe, sin FDs extras; mismo sandbox de archivos. Es una capa de lanzamiento
adicional, no una reinterpretación de v2. No ejecutado todavía.

## Admisión v3 para evaluación desechable, no certificación

Node ya incluido en imagen pública: readlink ../Cellar/node@24/24.20.0/bin/node,
SHA256 c8eedc7651a438fb7d2ceb36fd70032676c855586a36c950ba5a662f0b7853bd, uid501 modo555.
Se comprueban enlace/hash ANTES de ejecutar Node. Dependencias del invitado siguen bajo
confianza en la imagen pública fijada; no se declara attestation individual para producción.
G1/G5 reabiertos PASS_WITH_CONSTRAINTS: Node es nuevo lanzador confiable solo en VM sintética,
env-i elimina opciones ambientales; builtins node:fs/crypto/child_process, sin paquetes/red.
G6 PASS_WITH_CONSTRAINTS: sujeto fijo sin background, timeout5s/maxBuffer64KiB y VM45s;
no generalizar a árboles arbitrarios ni señales ignoradas.
Revisión independiente exige y v3 incorpora dev/ino exactos FD9/canario y FD_STATUS!=0.
Invocación igual, perfil file-write igual; cierre de FDs es tratamiento explícito del lanzador,
no mejora atribuida a Seatbelt. Casos/criterios congelados en prerregistrov3 antes de ejecutar.
