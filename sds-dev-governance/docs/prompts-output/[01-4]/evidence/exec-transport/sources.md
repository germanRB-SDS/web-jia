# Fuentes y límites del transporte candidato

Inspección nativa de Codex0.154.0: exec-server --help admite stdio/stdio://;
Tart exec-i permite stdin. El schema app-server nativo está en ../codex-transport/.
No se confunden los dos protocolos ni las notificaciones de tokens con JSONL de exec.

Fuentes oficiales consultadas2026-09-13, tag rust-v0.154.0:
- [Protocolo](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/exec-server-protocol/src/protocol.rs): handshake, estado y mensajes de proceso.
- [README](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/exec-server/README.md): cierre de output mediante process/closed. Su lista CLI no enumera stdio aunque la ayuda del binario instalado sí.
- [environments.toml](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/exec-server/src/environment_toml.rs): configuración de ejecutor por programa y opción include_local. Candidato para routing futuro, no configuración validada ni activada.

El schema CommandExecParams no selecciona environmentId; no usar command/exec como
prueba de ejecución remota. Probar ausencia de fallback host antes de introducir auth.
No se registra remote ni se inicia app-server autenticado en esta sonda.
