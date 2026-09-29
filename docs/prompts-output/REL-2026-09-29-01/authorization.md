# Autorización de publicación — 29-09-2026

El propietario solicita en esta sesión push de web-jia a GitHub, árbol limpio y publicación en su servidor existente sin duplicar información; autoriza expresamente SSH y pide captura segura mediante Keychain.

Se renueva para esta operación la excepción SSH del procedimiento canónico de despliegue (MODIFICATION acotada). Sustituye el estado consumido de la autorización anterior solo para inspeccionar y actualizar web-jia en el mismo sitio. No admite MCP, otros proyectos, cambios de DNS/Caddy ni permisos permanentes. La contraseña sudo se introduce en diálogo local oculto y se guarda en Keychain; ningún secreto se incorpora a Git, evidencias o argumentos. La excepción termina al cerrar este despliegue.

Conservar originales locales. Ignorar únicamente duplicados/ZIP de entrega comprobados; versionar el PDF nuevo como fuente, sin publicarlo automáticamente. Publicar exclusivamente el export estático mediante el actualizador existente, con hashes, expected-current, bloqueo y rollback. Las releases previas se conservan para recuperación; no se crea un segundo sitio.
