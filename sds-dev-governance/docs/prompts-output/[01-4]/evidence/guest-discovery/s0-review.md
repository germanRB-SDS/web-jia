# Revisión independiente de sondas

Revisor /root/review_vm, solo lectura. v1 apta para evaluación mínima; positivos W/FD añadidos.
v1 falló arranque; v2 admitió explícitamente bash como variante real de sh. v2 confirmó fallo
FD heredado, que se conserva sin reetiquetar. v3 añade lanzador Node antes de Seatbelt, con
hash de ejecutable verificado previamente, env-i, stdio ignore/pipe/pipe, timeout5s y máximo64KiB.
Condiciones requeridas: comparar dev/inoFD9 con canario, exigir FD_STATUS no0 y contenidos.
Todas incorporadas antes de ejecución; hash fuente igual al prerregistro.

Cierre: revisor confirma PASS del subconjuntov3, cuatro positivos, P/X0, Y/W1, FD9=1/BadFD,
canarios intactos y sin error Node. No detecta severo que invalide ese resultado acotado.
S0 completo/S7/A-B pendientes; no revocación de FDs ya entregados a sujeto activo.

Corrección de nota menor del revisor: source s0_probe.sh líneas41-42 ya exige fd_status!=0,
Node propaga status en65 y gate parent en76 rechaza status!=0. Verificación rg/hash confirmó
que esto estaba antes de ejecución; el marcador no acepta FD_STATUS0. No cambio posterior.
