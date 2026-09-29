# Registro histórico de activación manual

**Completada y verificada el 29-09-2026. No volver a ejecutar este comando.** El propietario confirmó la activación; `current` apunta a `releases/20260929-bf682a8`. Ver el [informe final](report.md).
La revisión automática rechazó el acceso de escritura del agente por falta de admisión exacta y custodia independiente de Hostinger. Este procedimiento es manual del propietario, no una vía alternativa para ejecución del agente.

Comando preparado para la terminal del propietario (conservado solo como registro):

```sh
ssh -t -o StrictHostKeyChecking=yes sds-prod-01 'cd /home/sdsadmin/web-jia-release-review-HyREwzOk && printf "%s\n" "3092111323183328ac71797a842698a64c119988b71ede2c95e2818f7ee084eb  update-web-jia-release.sh" | sha256sum -c - && sudo bash update-web-jia-release.sh /home/sdsadmin/web-jia-release-review-HyREwzOk/web-jia-20260929-bf682a8.tar.gz 5c116ef4e8494e0878812fd860b8f0b440d59bce6ddc847088239a02786252c5 20260929-bf682a8 releases/20260925-b1adf52'
```

Resultado esperado: `ACTIVATED 20260929-bf682a8`. El actualizador toma un bloqueo, exige el destino previo exacto, comprueba el paquete y cambia el enlace atómicamente. Verifica hash HTTPS del origen y que Caddy no cambie; ante fallo posterior a activación restaura la versión anterior. No reintentar sin inspeccionar el estado real.

Verificado después: URL pública, redirects, 193 recursos, vídeo Range y navegador móvil/escritorio. SHA-256 esperado de `almeria-2026.html`: `8e1c09cbcfa4b9faf047852fe061b87eb51105aa85c13f03e2abf3412c15c51b`. Guía canónica: `sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md`.
