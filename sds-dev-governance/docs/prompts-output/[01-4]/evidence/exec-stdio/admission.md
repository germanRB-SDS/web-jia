# GOV-SAFETY — stdio nativo, argv corregido

G1/G3/G4/G5 sin ampliación: root guest persistente ya verificado, hash/dependencias
revision.json, sin auth/model/network/host share. Solo handshake/info/status/pwd propios.
G2 reevaluado: fallo CLI2 previo observado, flag --exit-on-stdin-close requiere --remote
según fuente oficial tag rust-v0.154.0 cli/src/main.rs. Se elimina ese flag; no se añade
remote/environment-id. Los oráculos de salida/secuencia/cierre y límites no se relajan.
G6 PASS_WITH_CONSTRAINTS: stdout/EOF nativo a comprobar en ejecución nativa, deadline12/15/25s y
VM45s idénticos; no suponer que eliminar flag acredita cierre. Inspeccionar stopped/PID/
socket después. No fallback ni reintento oculto; una nueva revisión y una ejecución.
Owner continuación autorizada. Revisión independiente y plataforma antes de ejecución.
Prerregistro: el de exec-transport con ruta persistent-client y argv exec-server --listen
stdio. Solo PASS+exit0+metadata/pwd/cierre íntegros aceptan transporte. Custodia/A-B no.
