# GOV-SAFETY — delta de pruebas sintéticas

Autorización propietario: continuar implementación/laboratorio. Revisión en revision.json.
G1/G5 PASS_WITH_CONSTRAINTS: tests nuevos solo ficheros/FDs/procesos sintéticos; entradas
regulares, enlace/FIFO y hash/tamaño inválidos sin llamada a Tart. No VM/network/credenciales.
G2/G3/G4 PASS: originales preservados, no certificación S0/A-B ni cambios de controles activos.
G6 PASS_WITH_CONSTRAINTS: mismo group/deadlines/cleanup existentes; stdin FD regular sin
thread escritor. Temporales propios y evidencias conservadas. No fallback ante denegación.
