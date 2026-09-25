# Deployment Memory

## Contexto minimo

- Producción confirmada por el propietario: VPS Hostinger existente, Caddy, dominio jornadasdeinnovacion.com y entrada /almeria-2026.
- Configuración comprobada: /etc/caddy/web-jia.caddy, root /srv/web-jia/current, releases bajo /srv/web-jia/releases. Conservar el mismo sitio y las redirecciones actuales.
- Next exporta almeria-2026.html con trailingSlash:false. La landing de la edición reutiliza app/page.tsx; metadata deriva de lib/content/site.ts.
- Solo publicar export estático; no necesita Node/PM2 en servidor. No volver a ejecutar el instalador de primera instalación.
- Actualizador: deployment/update-web-jia-release.sh, con checksum, bloqueo, enlace atómico y rollback inicial. No recarga Caddy al actualizar archivos.
- SSH por clave existente funciona; sudo requiere autenticación independiente. La autorización del 25-09-2026 es excepcional y solo para esta ocasión, no permiso persistente. MCP no se ha activado.

## Procedimiento canónico

[Cómo desplegar web-jia](../../sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md): inventario, preparación, transferencia, activación, verificaciones y mejoras recomendadas.

## Último estado verificado

2026-09-25: release activa releases/20260925-b410b77, código b410b77. El propietario autenticó sudo y ejecutó el launcher preparado. Origen y público HTTPS 200 con HTML SHA coincidente; 10 checks HTTP (42 recursos, vídeo 206) y 7 checks de navegador PASS. Caddy y configuración sin cambios. Anterior releases/20260920-5b4d363 conservada. La excepción SSH de una sola ocasión queda cerrada. Ver [cierre y evidencia](../prompts-output/[53-1]/deployment-closure.md).
