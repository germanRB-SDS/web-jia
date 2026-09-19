Fuente oficial consultada2026-09-13:
https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/cli/src/main.rs
La definición exit_on_stdin_close requiere exec_server_remote cuando true. El runtime
local usa run_main_with_telemetry con listen_url. Se registra diferencia con argvv2.
No se utilizan argumentos remote ni autenticación para satisfacer el parser.
