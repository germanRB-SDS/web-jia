# Revisión independiente previa

/root/review_s0 confirmó revisión final de fuente/hash y test sintético el2026-09-13.
Correcciones: envelopes/tipos y excepciones estructuradas, XOR result/error, secuencias
monótonas, rechazo de exit duplicado/sandboxDenied y espera process/closed antes de EOF.
Dos métodos/13 escenarios sintéticos PASS12.798s; fallo inicial de fixture conservado.
Conforme solo para ensayo único prerregistrado, sujeto a revisión de plataforma.
Aceptación real: exit0, metadata/pwd exactos y cierreVM. No acredita auth/custodia/A-B.

Diagnóstico posterior al fallo78: revisor confirma hash982f1b41…ac371532 y alcance
read-only. No arranca Codex ni lee auth. set-e puede dejar comprobaciones posteriores
sin observar si falla Node; nunca interpretar esas ausencias como PASS.
