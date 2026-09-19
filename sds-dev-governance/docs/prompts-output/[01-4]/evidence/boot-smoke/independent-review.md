# Revisión independiente del supervisor

Revisor: subagente /root/review_vm, solo lectura; requisito del prompt01-4.
Revisión final: tart_host ca409fabcb880fd880989d74f080fdf090ba4d0231374ede259f92ce8f38d1b0;
net_sink d69ab46e999dedb8e7fef0fdc7b65315eae08805637f7d8aa0765f3443eae09d.
Hallazgos iniciales: SIGTERM podía saltar finally; recibo ausente en fallo de cierre;
Foundation.Process podía crear grupo separado. Corregidos antes del smoke: señal marca flag,
recibo de excepción, sink con vida180s y cierre al perder padre. Revisor no identificó otro
bloqueante de código para evaluar smoke45s, condicionado a preflight/admisión.
Fuente Tart2.37.0 tar inspeccionada: AF_UNIX sin NAT fallback, SUID solo TTY, control.sock
proxy a virtio8080. Tests sintéticos no probaron por sí solos estos canales.
Runtime posterior confirmó PGID distinto para sink, ambos PID ausentes y VM stopped.
Límite: SIGKILL al supervisor no es capturable; S0/S7 no acreditados.
