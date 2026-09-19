# GOV-SAFETY — medida local de componentes y estimación sin API

Owner: petición expresa de Codex/gpt-6-astra y Claude/fable, sin euros/API, medida local
o estimación. G1 PASS: solo funciones puras en memoria y lectura de fuentes propias,
salida a evidencia del KIT. G2 PASS_WITH_CONSTRAINTS: baseline vacío no es A; mensajes
medidos en caracteres, tokens por supuesto no calibrado; no afirmar consumo real/modelo.
G3/G4 PASS: no invocar clientes, modelos, credenciales, VM, red ni modificar configuración.
G5 PASS: Python/core/script fijados por hash en preregistration.json, cero dependencias nuevas.
G6 PASS:4 condiciones,9 pares2000 iteraciones con warmup200; ejecución bounded local,
sin procesos hijos o servicios ni efectos de payload. Ninguna admisión nueva para A/B.
Registros/fallos/limitaciones anteriores se conservan. Revisión independiente de medición
antes de emitir conclusiones; no se necesita autenticar o comprar para esta evaluación.
