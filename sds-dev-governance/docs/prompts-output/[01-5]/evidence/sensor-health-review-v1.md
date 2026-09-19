# Revisión independiente de salud y evidencia del sensor

2026-09-14, native_review. Relectura estática final; no ejecución/edición por revisor.
Sensor4ff760dfd560f01fa003a87b94eb935a432af9b0ac50fcb5d555d4c399c9b579;
testdbc7428bad00acac04d89590e66feed14f4235ea8e6ebbd6e30d20a29fc94e43.
Seis huellas del prerregistro y Python cotejadas. G2/G5 PASS_WITH_CONSTRAINTS,
G1/G3/G4/G6 sin delta fuera del desarrollo local admitido; sin VM, IP, señales,
procesos watchdog, modelos, credenciales ni activación. 30s externos por selección.

12 regresiones nuevas +7 SensorTests históricos +5 PumpTests =24 casos dirigidos.
Caducidad del canario anterior se comprueba antes de renovar; un replay no renueva.
health y tick observando muerte congelan antes de preservar cola/drenar sin despachar.
Se conservan hallazgos previos; última relectura no encontró bloqueos >=8/10.
Los50ms del drenaje se comprueban entre callbacks: no acotan un raw_sink bloqueado.
Watchdog independiente y generador periódico de desafío nativo siguen pendientes.
No equivale a prueba de protección. Revisor independiente de la implementación.
