# GOV-SAFETY — autorización de discovery del invitado

Owner: propietario del repositorio. Autorización explícita en chat: «Sí, lo autorizo»,
en respuesta a registrar/ejecutar lectura de identidad, sistema, montajes, red y herramientas
sin sudo y con cierre automático. Esta autorización resuelve el impedimento de auto-review
anterior para la propuesta reducida; no autoriza sudo ni amplía el modo a comandos arbitrarios.

Revisión exacta: revision.json. Mismo Python/Tart/supervisor/sink/root; guest-discovery.sh fijo.
Invocación: boot-smoke45s; dentro de esa vida, exec-admin /bin/sh -c con contenido exacto del
script autorizado. Captura, log/recibo y observación de procesos/listener propios al cierre.
Ruta: contexto de escalación de plataforma aprobado para Tart; no permisos globales.

G1 PASS_WITH_CONSTRAINTS: solo arranque VM sintética propia y lecturas invitado autorizadas.
G2 PASS: raw conservado; no inferir S0/S7 por discovery ni por terminación de procesos.
G3 PASS_WITH_CONSTRAINTS: registro de admisión/evidencia local autorizado, sin settings/instalación.
G4 PASS: mismo supervisor, sin ejecutor paralelo ni vía alternativa tras denegación.
G5 PASS_WITH_CONSTRAINTS: hashes exactos reutilizados; no sudo, secretos, shares ni red IP.
G6 PASS_WITH_CONSTRAINTS: mismo45s y cierre probado; no procesos guest persistentes intencionales,
comprobar stopped/ausencia de Tart y sink/listener. Si45s no alcanza, conservar incompleto.

Reuso: 14+3 tests y lifecycle anterior por fuentes iguales, sin rerun. Delta de modo es
lectura de invitado por virtio; no demuestra aislamiento del sujeto, requerido antes de corpus.

## Corrección de transporte argv, sin ampliación de permisos

Primer discovery devolvió125 sin stdout; VM cerró45,128s, PS sin PID16767/16768/16897,
listener ausente y VM stopped. No se cuenta como lectura guest completada.
Tart2.37.0 Exec.swift usa captureForPassthrough y command[0] directamente como executable.
Package.resolved fija ArgumentParser1.6.1 commit309a47b2b1d9b5e991f36961c983ecec72275be3;
Argument.swift de la rama oficial main documenta que -- se conserva (la recuperación web de la revisión1.6.1 no estuvo disponible). La ejecución corregida confirmó el comportamiento esperado. Se elimina ese argumento intermedio:
`[tart, exec, sentinel-lab, /bin/sh, -c, script]`. Fuente/test final en revision.json.
G1/G5 reabiertos PASS_WITH_CONSTRAINTS: mismos efectos autorizados, corrección de llamada,
sin nueva identidad/comandos guest. G6 sin delta; source lifecycle/sink idénticos.
Se admite test sintético directo del argv y repetición45s por corrección concreta anunciada,
no por insuficiencia de tiempo ni intento de eludir denegación. Fallo inicial retenido.

Fuente documental consultada: https://raw.githubusercontent.com/apple/swift-argument-parser/main/Sources/ArgumentParser/Parsable%20Properties/Argument.swift (captureForPassthrough); fuente Tart local exacta en tar2.37.0.

## Descubrimiento adicional de identidad de herramienta, sin ejecutarla

Se admite script exacto node-identity.sh: readlink/shasum/stat del binario Node ya incluido
en la imagen pública desechable; no ejecutar Node, no instalar. G1/G5 PASS_WITH_CONSTRAINTS:
lectura de ruta/hash/owner/modo de herramienta para evaluación de nuevo componente confiable;
sin secretos ni otros targets. Misma vida45s/captura/cierre y permiso de inspeccionar herramientas.
El modo de escritura v3 continúa no admitido hasta fijar identidad Node y revisión final.
