# Deployment Memory

## Contexto mínimo

- Producción confirmada por el propietario: VPS Hostinger existente, Caddy, dominio jornadasdeinnovacion.com y entrada /almeria-2026.
- Configuración comprobada: /etc/caddy/web-jia.caddy, root /srv/web-jia/current, releases bajo /srv/web-jia/releases. Conservar el mismo sitio y las redirecciones actuales.
- Next exporta almeria-2026.html con trailingSlash:false. La landing de la edición reutiliza app/page.tsx; metadata deriva de lib/content/site.ts.
- Solo publicar export estático; no necesita Node/PM2 en servidor. No volver a ejecutar el instalador de primera instalación.
- Actualizador: deployment/update-web-jia-release.sh, con checksum, bloqueo, enlace atómico y rollback inicial. No recarga Caddy al actualizar archivos.
- SSH por clave existente funciona; sudo requiere autenticación independiente. La autorización del 25-09-2026 es excepcional y solo para esta ocasión, no permiso persistente. MCP no se ha activado.

## Procedimiento canónico

[Cómo desplegar web-jia](../../sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md): inventario, preparación, transferencia, activación, verificaciones y mejoras recomendadas.

## Último estado verificado

2026-09-25: producción antigua releases/20260920-5b4d363, HTTPS 200. Nueva release 20260925-b410b77 preparada y transferida a staging privado con SHA verificado; activación pendiente de autenticación sudo. Ver [checkpoint](../prompts-output/[53-1]/tmp/deployment-checkpoint.md).
